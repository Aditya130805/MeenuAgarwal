# Payments Setup and Operations

This guide takes the payment flow from a safe test environment to live INR
settlements. Complete each launch gate in order. Never paste a Key Secret,
webhook secret, database URL, OTP, UPI PIN, or bank password into chat, source
code, email, or a support ticket.

The current branch separates public pricing from **owner verification mode**:

- Public `/pricing`: Complete Counseling Package at INR 30,000, with checkout
  disabled until launch
- Unlinked `/payment-verification`: INR 1 (100 paise), Razorpay's minimum INR
  order amount
- Type: One-time payment
- Provider: Razorpay Standard Checkout
- Access: Owner-only code stored as `PAYMENT_TEST_TOKEN`
- Fulfillment: None; this payment does not purchase counseling

The intended public package remains INR 30,000. Do not switch back to that
amount until the INR 1 payment has been captured, delivered by signed webhook,
settled, and matched to the intended bank account.

## 1. What is already implemented

- `/pricing` shows the real INR 30,000 package and does not collect payment
  details while verification is underway.
- `/payment-verification` contains the restricted INR 1 checkout, is not linked
  in navigation, and is marked `noindex`.
- `/api/payments/create-order` creates the fixed-price order on the server.
- Order creation requires the owner-only `PAYMENT_TEST_TOKEN`; the code is
  checked server-side and is never stored with the order.
- `/api/payments/verify` verifies Razorpay's HMAC signature and fetches both
  payment and order status before returning `paid`.
- `/api/payments/webhook` verifies the exact raw body, records provider event
  IDs, and handles `payment.captured`, `payment.failed`, and `order.paid`.
- `/api/payments/status` reconciles a pending browser with Razorpay.
- Neon Postgres stores only customer contact details, order/payment references,
  amount, state, policy-acceptance time, and event IDs. It never stores card,
  bank-login, CVV, OTP, or UPI PIN data.
- The database tables are created automatically on the first payment request.
- `/terms`, `/privacy`, and `/refund-policy` are linked at checkout and in the
  footer.

## 2. Owner-only Razorpay account setup

Use an email account and mobile number controlled by the business owner.

1. Open [Razorpay](https://razorpay.com/) and select **Sign Up**.
2. Enable an authenticator app or passkey/strong 2FA. Do not rely on shared SMS
   access.
3. In account activation, choose **Individual / Unregistered Business**.
4. Select the closest accurate category for education consulting/counseling.
   Do not choose a different category merely to speed up approval.
5. Enter the owner's Personal PAN.
6. Complete the CKYC lookup using the mobile number linked to CKYC and its OTP.
7. If CKYC cannot fetch the record, follow Razorpay's prompt for identity and
   address verification through DigiLocker, Aadhaar/photo ID, or passport.
8. Enter the Indian bank account that must receive settlements:
   - Account holder/beneficiary name
   - Account number
   - IFSC
9. Read the account number and IFSC back from the screen and compare them
   character by character with the bank's own statement or app. A second trusted
   person should independently check them.
10. If bank verification fails, supply the requested cancelled-cheque video.
11. Complete Video KYC if Razorpay requests it.
12. Submit the activation form. Live Mode must not be used until the dashboard
    state is `activated`.

Razorpay can change its KYC prompts. Follow the current dashboard checklist and
do not send identity documents to anyone claiming to be the developer.

## 3. Review the website before submitting it

Publish and review these routes:

- About/business information: `/`
- Contact details: `/contact`
- Pricing: `/pricing`
- Terms: `/terms`
- Privacy: `/privacy`
- Cancellation/refunds: `/refund-policy`

The selected policy says purchases are non-refundable after successful payment,
except duplicate/erroneous charges, provider inability to deliver, and rights
that cannot legally be excluded. The owner should review this wording and obtain
professional advice if needed before launch.

The specimen requested during gateway review is:

`docs/razorpay-sample-invoice.pdf`

It is deliberately labelled “SPECIMEN” and “Not proof of payment.” Upload it
only as a sample. It is not an issued invoice or receipt.

In Razorpay Dashboard, open **Account & Settings → Business Website Details**
and provide:

1. The live website URL.
2. The six URLs listed above.
3. The specimen invoice PDF.
4. **No** when asked whether a login is required to complete payment.
5. Any accurate business description requested by the review form.

Submit the website for review and resolve every clarification from the
registered Razorpay email.

## 4. Create the database

The recommended path is Neon through the Vercel Marketplace:

1. Open the Vercel project.
2. Open **Storage** or **Integrations / Marketplace**, depending on the current
   Vercel navigation.
3. Add **Neon Postgres** and create a database in the nearest appropriate
   region.
4. Connect it to the project.
5. Confirm Vercel created a `DATABASE_URL` environment variable.
6. Give Preview and Production separate Neon branches/databases if possible.
   Test records must not be mixed with real customer payments.

No manual migration is required. The first API request creates
`payment_orders` and `payment_events`. The database user therefore needs table
creation and normal read/write permission for this database.

## 5. Test Mode credentials

Razorpay Test and Live modes are separate systems. Test successes move no money.

1. Switch the Razorpay Dashboard to **Test Mode**.
2. Open **Account & Settings → API Keys → Generate Key**.
3. Save the Key ID and Key Secret in a password manager. The secret may be
   displayed only once.
4. In Razorpay Test Mode, open **Account & Settings → Webhooks → Add New
   Webhook**.
5. Use the deployed test endpoint:
   `https://YOUR-TEST-DEPLOYMENT/api/payments/webhook`
6. Select:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
7. Generate a new random webhook secret. It must not be the API Key Secret.
8. Save and activate the webhook.

For a Vercel Preview URL that changes on each deployment, either update the Test
Mode webhook URL after deployment or assign a stable staging domain. Razorpay
must be able to reach the endpoint; deployment protection can block webhooks.

## 6. Configure Vercel safely

In **Vercel Project → Settings → Environment Variables**, add:

| Variable | Preview value | Production value |
| --- | --- | --- |
| `RAZORPAY_KEY_ID` | Test Key ID (`rzp_test_...`) | Live Key ID (`rzp_live_...`) |
| `RAZORPAY_KEY_SECRET` | Test Key Secret | Live Key Secret |
| `RAZORPAY_WEBHOOK_SECRET` | Test webhook secret | Live webhook secret |
| `PAYMENT_TEST_TOKEN` | Preview-only owner code | Separate live owner code |
| `DATABASE_URL` | Preview/test database | Production database |

Mark every value sensitive. Although the Key ID is designed to be public, there
is no need to expose it as a `VITE_` variable; this implementation sends it only
with a newly created server order.

Important:

- Never prefix the Key Secret, webhook secret, test token, or database URL with
  `VITE_`.
- Never commit `.env`, `.env.local`, or downloaded credential files.
- Use different secrets in Preview and Production.
- After changing variables, redeploy; an existing deployment does not
  automatically gain the new build-time/runtime configuration.

For local function testing, copy `.env.example` to `.env.local`, insert Test
Mode values locally, and use Vercel's local development runtime. Do not use live
credentials locally.

## 7. Test Mode launch gate

Run the code checks:

```bash
npm test
npm run lint
npm run build
npm audit --omit=dev
```

Then use Razorpay Test Mode to complete all of these:

1. Successful payment.
2. Declined/failed payment.
3. Close checkout without paying.
4. Double-click/repeated-submit attempt.
5. Refresh while verification is pending.
6. Successful callback followed by delayed webhook.
7. Replay the same webhook and confirm it is reported as a duplicate.
8. Send a webhook with a bad signature and confirm HTTP 400.
9. Alter `amount` in a browser request and confirm the Razorpay order remains
   exactly `100` paise.
10. Confirm `/api/payments/status` never returns `paid` for an unpaid order.
11. Confirm a delayed failure event cannot downgrade a paid order.
12. Check mobile and desktop layouts, policy links, keyboard navigation,
    loading states, and visible references.
13. Confirm a missing or incorrect owner verification code returns HTTP 403 and
    creates no Razorpay order.

For a successful test, reconcile four records:

1. Browser confirmation and internal receipt.
2. Razorpay Test Mode order (`paid`).
3. Razorpay Test Mode payment (`captured`).
4. `payment_orders.status` in Neon (`paid`).

Do not proceed if any one of these disagrees.

## 8. Go live

Only the Razorpay account Owner/Admin should do the following:

1. Confirm account status is `activated`.
2. Confirm the destination bank details again under Razorpay account/settlement
   settings.
3. Switch to **Live Mode**.
4. Generate a separate Live Key ID and Key Secret.
5. Add a separate Live webhook using:
   `https://YOUR-PRODUCTION-DOMAIN/api/payments/webhook`
6. Select the same three events and create a new live webhook secret.
7. Put the live values only in Vercel's **Production** environment.
8. Confirm the Production `DATABASE_URL` points to the production database.
9. Redeploy production.
10. Confirm `/pricing` displays ₹30,000 and has no enabled payment form.
11. Confirm `/payment-verification` displays ₹1, “Owner verification only,”
    and “Not a package purchase.”
12. Confirm no `rzp_test_` value is present in Production settings.
13. Confirm the Production `PAYMENT_TEST_TOKEN` is long, unique, and known only
    to the owner.

### Run the INR 1 live website verification

Open the production `/payment-verification` page yourself, enter the private
verification code, and pay INR 1 using an owner-controlled payment method. Do
not share the route or code. This verifies the actual website integration and
settlement route.

Check all of the following:

- The browser shows a verified receipt/reference.
- Payment is `captured`.
- The order is `paid`.
- The live webhook delivery shows HTTP 200.
- The matching Neon `payment_orders` row is `paid`.
- Settlement is `processed`.
- Settlement UTR/reference is available.
- The exact intended bank account received the net settlement.
- Razorpay fees/taxes in the settlement report are understood.

Test Mode cannot prove bank routing. A captured payment is also not the same as
a bank settlement.

### Switch from verification mode to the public package

Only after the INR 1 bank credit is reconciled:

1. Change `api/_lib/payment-config.js` to name the Complete Counseling Package,
   set `amount: 3_000_000`, and set `testMode: false`.
2. Enable the verified checkout form on `/pricing` and remove the temporary
   `/payment-verification` route.
3. Update the amount assertions in payment tests back to `3_000_000`.
4. Run tests, lint, build, and the dependency audit.
5. Have a second person verify that UI, server configuration, Razorpay order
   amount, terms, and refund policy all say INR 30,000.
6. Deploy. The private verification-code field and test warning then disappear,
   and the server stops requiring `PAYMENT_TEST_TOKEN`.

Never display one amount while charging another.

## 9. First real payment reconciliation

Monitor the first customer payment in real time:

1. Note the website receipt shown to the customer.
2. In Razorpay, open the matching order and verify:
   - Amount: INR 30,000
   - Order status: `paid`
   - Payment status: `captured`
   - Customer/reference values match
3. In Neon, find the same `razorpay_order_id` and confirm status `paid`.
4. Check the live webhook delivery log for HTTP 200.
5. Contact the customer only after these checks pass.
6. After settlement, match the Razorpay settlement report/UTR to the bank
   statement.

If the customer reports a debit but the site is pending, do not ask them to pay
again. Search by order/payment reference and verify Razorpay status first.

## 10. Status meanings

- `created`: a fixed-price Razorpay order exists; no verified payment yet.
- `pending`: a signed browser callback exists, but server-fetched provider
  status is not both captured/paid yet.
- `failed`: a payment attempt failed. The same order may still receive another
  successful attempt.
- `paid`: Razorpay reported a captured payment/paid order. This state cannot be
  downgraded by delayed failure events.
- `captured` (Razorpay payment): funds were successfully captured.
- `settled` / settlement `processed`: Razorpay sent the net amount to the linked
  bank. This happens after capture.
- `refunded`: a separate Razorpay refund was initiated/processed. The current
  application does not automatically grant refunds.

## 11. Refund operations

Only refund a verified duplicate/erroneous charge or another case allowed by the
published policy:

1. Find the payment by order ID, payment ID, or customer reference.
2. Confirm it is the correct captured payment and check for prior refunds.
3. Initiate the refund in Razorpay to the original payment method.
4. Record the refund ID, amount, reason, operator, and date in the business
   records.
5. Send the customer the refund reference and provider-controlled timeline.
6. Never request card details, OTP, bank password, or UPI PIN.

## 12. Incident response

### A key or secret may have leaked

1. Disable/rotate it immediately in Razorpay or Neon.
2. Replace the Vercel sensitive environment variable.
3. Redeploy.
4. Review Razorpay API logs, webhook logs, Vercel logs, and database access.
5. Contact provider support for any unrecognized activity.

### Payments succeed but webhooks fail

1. Keep onboarding paused for pending orders.
2. Check Razorpay webhook delivery status and HTTP response.
3. Confirm the endpoint URL and live/test mode match.
4. Confirm the correct webhook secret is in the matching Vercel environment.
5. Retry the event from Razorpay. Replays are safe because event IDs are unique.

### Wrong bank details or suspicious settlement change

1. Stop accepting payments or disable the checkout immediately.
2. Place settlements on hold in Razorpay if the dashboard permits.
3. Contact Razorpay through the authenticated dashboard.
4. Do not accept bank-change instructions received only by email or phone.

## 13. Ongoing controls

- Require strong 2FA for Razorpay, Vercel, Neon, domain, and email accounts.
- Keep Owner/Admin access limited and remove departed users immediately.
- Review payments against settlements and the bank statement regularly.
- Rotate secrets after suspected exposure or personnel changes.
- Run tests, lint, build, and audit before each payment-related deployment.
- Keep dependency security updates current.
- Review policy and package copy whenever the service changes.
