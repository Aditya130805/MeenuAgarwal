import LegalPage from '../components/LegalPage';

const Privacy = () => (
  <LegalPage
    title="Privacy Policy"
    introduction="How we collect, use, share, and protect information provided through this website."
  >
    <section>
      <h2>1. Information we collect</h2>
      <p>We may collect information that you provide directly, including:</p>
      <ul>
        <li>Name, email address, phone number, and counseling enquiries.</li>
        <li>Course, country, education, and application-related information.</li>
        <li>
          Payment references, amount, currency, status, and timestamps needed to
          verify and reconcile a purchase.
        </li>
      </ul>
      <p>
        We do not receive or store your card number, bank login, CVV, or UPI
        credentials. Razorpay processes those payment details on its secure
        checkout.
      </p>
    </section>

    <section>
      <h2>2. How information is used</h2>
      <ul>
        <li>To respond to enquiries and provide counseling services.</li>
        <li>To create, verify, reconcile, and support payment orders.</li>
        <li>To prevent fraud, resolve disputes, and meet legal obligations.</li>
        <li>To maintain the reliability and security of the website.</li>
      </ul>
    </section>

    <section>
      <h2>3. Service providers</h2>
      <p>
        Necessary information may be processed by service providers that operate
        the website and its features, including Razorpay for payments, Vercel for
        hosting, Neon for payment-status storage, Cal.com for consultation
        booking, and FormSubmit for contact-form delivery. Each provider handles
        information under its own terms and privacy practices.
      </p>
    </section>

    <section>
      <h2>4. Storage and retention</h2>
      <p>
        Payment records are limited to operational and reconciliation data.
        Information is retained only for as long as reasonably required to
        provide services, maintain business and financial records, resolve
        disputes, and comply with applicable obligations.
      </p>
    </section>

    <section>
      <h2>5. Security</h2>
      <p>
        We use restricted access, encrypted connections, server-side secret
        storage, signed payment callbacks, and verified webhooks. No internet
        service can promise absolute security, so please do not send sensitive
        payment credentials or passwords by email or through the contact form.
      </p>
    </section>

    <section>
      <h2>6. Your choices</h2>
      <p>
        You may ask to review, correct, or delete personal information, subject
        to records that must be retained for payment, dispute, fraud-prevention,
        or legal purposes.
      </p>
    </section>

    <section>
      <h2>7. Contact</h2>
      <p>
        Privacy questions may be sent to{' '}
        <a href="mailto:meenu@meenuagarwal.in">meenu@meenuagarwal.in</a> or raised
        by phone at <a href="tel:9712924902">97129 24902</a>. The business address
        is 605, Entice, Ambli-Bopal Road, Ahmedabad 380058, Gujarat, India.
      </p>
    </section>
  </LegalPage>
);

export default Privacy;
