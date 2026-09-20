import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faCheck,
  faCircleCheck,
  faLock,
  faRotateRight,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  PACKAGE_CURRENCY,
  PACKAGE_INCLUSIONS,
  PACKAGE_NAME,
  PACKAGE_PRICE_DISPLAY,
  PACKAGE_PRICE_RUPEES,
  PAYMENT_SUCCESS_MESSAGE,
  PAYMENT_TEST_MODE,
  PAYMENT_POLL_ATTEMPTS,
  PAYMENT_POLL_INTERVAL_MS,
} from '../config/payments';

const initialCustomer = { name: '', email: '', phone: '' };

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    if (existing) {
      existing.addEventListener('load', () => resolve(true), { once: true });
      existing.addEventListener('error', () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Pricing = () => {
  const [customer, setCustomer] = useState(initialCustomer);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [testToken, setTestToken] = useState('');
  const [paymentState, setPaymentState] = useState('idle');
  const [message, setMessage] = useState('');
  const [reference, setReference] = useState('');
  const pollingCancelled = useRef(false);

  useEffect(() => {
    pollingCancelled.current = false;
    return () => {
      pollingCancelled.current = true;
    };
  }, []);

  const updateCustomer = (event) => {
    const { name, value } = event.target;
    setCustomer((current) => ({ ...current, [name]: value }));
  };

  const pollForConfirmation = async (orderId) => {
    for (let attempt = 0; attempt < PAYMENT_POLL_ATTEMPTS; attempt += 1) {
      if (pollingCancelled.current) return;
      await new Promise((resolve) =>
        window.setTimeout(resolve, PAYMENT_POLL_INTERVAL_MS),
      );

      const response = await fetch(
        `/api/payments/status?orderId=${encodeURIComponent(orderId)}`,
      );
      if (!response.ok) continue;
      const data = await response.json();

      if (data.status === 'paid') {
        setPaymentState('success');
        setMessage(PAYMENT_SUCCESS_MESSAGE);
        return;
      }

      if (data.status === 'failed') {
        setPaymentState('failed');
        setMessage('The payment was not completed. No service has been activated.');
        return;
      }
    }

    setPaymentState('pending');
    setMessage(
      PAYMENT_TEST_MODE
        ? 'Razorpay is still confirming the ₹1 verification payment. Keep the reference number and do not pay again while we reconcile it.'
        : 'Razorpay is still confirming the payment. Keep your reference number and do not pay again. We will verify it before onboarding.',
    );
  };

  const beginPayment = async (event) => {
    event.preventDefault();
    setMessage('');
    setReference('');
    setPaymentState('creating');

    try {
      const checkoutLoaded = await loadRazorpay();
      if (!checkoutLoaded) {
        throw new Error('Secure checkout could not load. Please try again.');
      }

      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...customer, acceptedTerms, testToken }),
      });
      const order = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(order.error || 'Could not create a secure payment order.');
      }

      setReference(order.receipt);
      setPaymentState('checkout');

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Meenu Agarwal',
        description: PACKAGE_NAME,
        order_id: order.orderId,
        prefill: customer,
        notes: { receipt: order.receipt },
        theme: { color: '#FF7043' },
        modal: {
          ondismiss: () => {
            setPaymentState('cancelled');
            setMessage('Checkout was closed. You have not been charged by this attempt.');
          },
        },
        handler: async (result) => {
          setPaymentState('verifying');
          setMessage('Payment received. Verifying it securely…');

          try {
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: result.razorpay_order_id,
                paymentId: result.razorpay_payment_id,
                signature: result.razorpay_signature,
              }),
            });
            const verification = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(
                verification.error ||
                  'We could not verify this payment automatically.',
              );
            }

            if (verification.status === 'paid') {
              setPaymentState('success');
              setMessage(PAYMENT_SUCCESS_MESSAGE);
              return;
            }

            setPaymentState('verifying');
            setMessage('Payment received. Waiting for final bank confirmation…');
            await pollForConfirmation(result.razorpay_order_id);
          } catch {
            setPaymentState('pending');
            setMessage(
              'We received a payment response but could not finish verification. Do not pay again; contact us with your reference number.',
            );
          }
        },
      });

      checkout.on('payment.failed', (failure) => {
        setPaymentState('failed');
        setMessage(
          failure.error?.description ||
            'The payment was declined. You may try again or contact your bank.',
        );
      });

      checkout.open();
    } catch (error) {
      setPaymentState('failed');
      setMessage(error.message || 'Something went wrong. Please try again.');
    }
  };

  const resetPayment = () => {
    setPaymentState('idle');
    setMessage('');
    setReference('');
  };

  const isBusy = ['creating', 'checkout', 'verifying'].includes(paymentState);
  const showResult = !['idle', 'creating', 'checkout'].includes(paymentState);

  return (
    <div className="min-h-screen bg-[#f7fafb]">
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-r from-[var(--light-blue-color)] to-[var(--dark-blue-color)] px-4 pb-28 pt-16 text-center md:pb-36 md:pt-24">
          <div className="absolute -left-20 top-12 h-56 w-56 rounded-full border border-white/10" />
          <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full border border-white/10" />
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-white/75">
              Personal guidance, from first plan to departure
            </p>
            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
              {PAYMENT_TEST_MODE
                ? 'Verify the payment gateway end to end'
                : 'One complete counseling package'}
            </h1>
            <div className="mx-auto my-6 h-1 w-24 bg-[var(--coral-color)]" />
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
              {PAYMENT_TEST_MODE
                ? 'A restricted ₹1 live payment to confirm capture, signed webhooks, settlement, and the destination bank account before launch.'
                : 'Clear, one-on-one support for students and families navigating the study-abroad journey—without confusing tiers or hidden add-ons.'}
            </p>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-20 max-w-6xl px-4 pb-16 md:-mt-24 md:px-8 md:pb-24">
          <div className="grid overflow-hidden rounded-[28px] bg-white shadow-[0_18px_55px_rgba(28,84,109,0.2)] lg:grid-cols-[1.12fr_0.88fr]">
            <div className="p-7 sm:p-10 lg:p-12">
              <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-[var(--dark-blue-color)]">
                    {PACKAGE_NAME}
                  </p>
                  <h2 className="text-4xl font-extrabold text-[var(--dark-blue-color)] sm:text-5xl">
                    {PACKAGE_PRICE_DISPLAY}
                  </h2>
                </div>
                <div className="sm:text-right">
                  <p className="font-semibold text-slate-700">
                    {PAYMENT_TEST_MODE ? 'Owner verification only' : 'One-time payment'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {PAYMENT_TEST_MODE ? 'Not a package purchase' : 'Including all taxes'}
                  </p>
                </div>
              </div>

              {PAYMENT_TEST_MODE && (
                <div className="mb-8 rounded-2xl border border-[rgba(35,105,138,0.18)] bg-[#edf5f7] p-5 text-sm leading-relaxed text-slate-700">
                  <strong className="text-[var(--dark-blue-color)]">
                    Live gateway verification mode.
                  </strong>{' '}
                  This ₹1 payment does not purchase or activate the counseling
                  package. It exists only to prove that money is captured,
                  recorded, and settled to the intended bank account.
                </div>
              )}

              <h3 className="mb-5 text-xl font-bold text-slate-900">
                What your package includes
              </h3>
              <ul className="grid gap-4 sm:grid-cols-2">
                {PACKAGE_INCLUSIONS.map((item) => (
                  <li key={item} className="flex gap-3 text-slate-700">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(35,105,138,0.12)] text-[var(--dark-blue-color)]">
                      <FontAwesomeIcon icon={faCheck} className="text-xs" />
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-9 rounded-2xl bg-[rgba(35,105,138,0.08)] p-5">
                <div className="flex gap-3">
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="mt-1 text-[var(--dark-blue-color)]"
                  />
                  <div>
                    <p className="font-bold text-[var(--dark-blue-color)]">
                      What happens after payment?
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      {PAYMENT_TEST_MODE
                        ? 'We will reconcile the Razorpay order, captured payment, signed webhook, settlement reference, and final bank credit. No counseling package is activated.'
                        : 'Once the payment is verified, Meenu will contact you using the details provided here to begin your personal onboarding.'}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-7 text-sm leading-relaxed text-slate-500">
                Not ready to purchase?{' '}
                <Link
                  to="/book"
                  className="font-bold text-[var(--coral-color)] underline underline-offset-4"
                >
                  Book a free 30-minute consultation
                </Link>{' '}
                first.
              </p>
            </div>

            <aside className="bg-[#f0f6f8] p-7 sm:p-10 lg:p-12">
              <div className="mb-7 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--dark-blue-color)] shadow-sm">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <div>
                  <h2 className="text-xl font-extrabold text-[var(--dark-blue-color)]">
                    Secure checkout
                  </h2>
                  <p className="text-sm text-slate-600">
                    Payment details are handled by Razorpay.
                  </p>
                </div>
              </div>

              {showResult ? (
                <div
                  className="rounded-2xl bg-white p-6 shadow-sm"
                  role="status"
                  aria-live="polite"
                >
                  <FontAwesomeIcon
                    icon={
                      paymentState === 'success' ? faCircleCheck : faShieldHalved
                    }
                    className={`mb-4 text-3xl ${
                      paymentState === 'success'
                        ? 'text-emerald-600'
                        : paymentState === 'failed'
                          ? 'text-red-500'
                          : 'text-[var(--dark-blue-color)]'
                    }`}
                  />
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {paymentState === 'success'
                      ? 'Payment confirmed'
                      : paymentState === 'failed'
                        ? 'Payment not completed'
                        : paymentState === 'cancelled'
                          ? 'Checkout closed'
                          : 'Verification pending'}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {message}
                  </p>
                  {reference && (
                    <p className="mt-4 rounded-lg bg-slate-100 px-3 py-2 font-mono text-xs text-slate-700">
                      Reference: {reference}
                    </p>
                  )}
                  {paymentState !== 'success' && (
                    <button
                      type="button"
                      onClick={resetPayment}
                      className="mt-6 inline-flex items-center gap-2 font-bold text-[var(--dark-blue-color)]"
                    >
                      <FontAwesomeIcon icon={faRotateRight} />
                      Return to checkout
                    </button>
                  )}
                </div>
              ) : (
                <form onSubmit={beginPayment} className="space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">
                      Full name
                    </span>
                    <input
                      name="name"
                      value={customer.name}
                      onChange={updateCustomer}
                      required
                      minLength={2}
                      maxLength={100}
                      autoComplete="name"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[var(--light-blue-color)] focus:ring-2 focus:ring-[rgba(35,105,138,0.15)]"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">
                      Email address
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={customer.email}
                      onChange={updateCustomer}
                      required
                      maxLength={254}
                      autoComplete="email"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[var(--light-blue-color)] focus:ring-2 focus:ring-[rgba(35,105,138,0.15)]"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">
                      Mobile number
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={customer.phone}
                      onChange={updateCustomer}
                      required
                      minLength={8}
                      maxLength={15}
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[var(--light-blue-color)] focus:ring-2 focus:ring-[rgba(35,105,138,0.15)]"
                    />
                  </label>

                  {PAYMENT_TEST_MODE && (
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-slate-700">
                        Private verification code
                      </span>
                      <input
                        type="password"
                        value={testToken}
                        onChange={(event) => setTestToken(event.target.value)}
                        required
                        autoComplete="off"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[var(--light-blue-color)] focus:ring-2 focus:ring-[rgba(35,105,138,0.15)]"
                      />
                      <span className="mt-2 block text-xs leading-relaxed text-slate-500">
                        Must match the owner-only code stored in Vercel.
                      </span>
                    </label>
                  )}

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-white p-4 text-sm leading-relaxed text-slate-600">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(event) => setAcceptedTerms(event.target.checked)}
                      required
                      className="mt-1 h-4 w-4 accent-[var(--dark-blue-color)]"
                    />
                    <span>
                      I agree to the{' '}
                      <Link
                        to="/terms"
                        target="_blank"
                        className="font-bold text-[var(--dark-blue-color)] underline"
                      >
                        terms
                      </Link>{' '}
                      and{' '}
                      <Link
                        to="/refund-policy"
                        target="_blank"
                        className="font-bold text-[var(--dark-blue-color)] underline"
                      >
                        cancellation/refund policy
                      </Link>
                      .
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isBusy || !acceptedTerms}
                    className="group flex min-h-[56px] w-full items-center justify-center rounded-full bg-[var(--coral-color)] px-6 font-bold text-white shadow-[0_8px_20px_rgba(255,112,67,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(255,112,67,0.4)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {isBusy ? (
                      'Opening secure checkout…'
                    ) : (
                      <>
                        {PAYMENT_TEST_MODE
                          ? `Pay ${PACKAGE_PRICE_DISPLAY} verification`
                          : `Pay ${PACKAGE_PRICE_DISPLAY} securely`}
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="ml-2 transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>

                  {message && (
                    <p className="text-center text-sm text-red-600" role="alert">
                      {message}
                    </p>
                  )}
                  <p className="text-center text-xs leading-relaxed text-slate-500">
                    Final charge: {PACKAGE_PRICE_DISPLAY} {PACKAGE_CURRENCY} (
                    {PACKAGE_PRICE_RUPEES.toLocaleString('en-IN')} rupees).
                    We never receive your card, bank, or UPI credentials.
                  </p>
                </form>
              )}
            </aside>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
