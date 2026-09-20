import LegalPage from '../components/LegalPage';

const RefundPolicy = () => (
  <LegalPage
    title="Cancellation and Refund Policy"
    introduction="Please read this policy before purchasing the Complete Counseling Package."
  >
    <section>
      <h2>1. Customer cancellations</h2>
      <p>
        The Complete Counseling Package is reserved and prepared as a personal
        professional service. Once payment has been successfully completed, the
        purchase is non-refundable if you cancel or decide not to use the
        service.
      </p>
    </section>

    <section>
      <h2>2. Duplicate or erroneous charges</h2>
      <p>
        If the same package is charged more than once, or the amount charged does
        not match the confirmed ₹30,000 price, contact us promptly with the
        payment reference. Once verified, the duplicate or erroneous amount will
        be refunded to the original payment method.
      </p>
    </section>

    <section>
      <h2>3. Payment shown as failed or pending</h2>
      <p>
        Do not make another payment if your bank shows a debit but this website
        shows verification pending. Send us the payment reference first. We will
        check Razorpay’s captured status before asking you to retry. Failed bank
        debits may also be automatically reversed by the issuing bank.
      </p>
    </section>

    <section>
      <h2>4. Cancellation by the service provider</h2>
      <p>
        If Meenu cannot provide the purchased counseling service, the affected
        amount will be refunded to the original payment method. This does not
        limit any rights that cannot be excluded under applicable law.
      </p>
    </section>

    <section>
      <h2>5. Refund processing</h2>
      <p>
        Approved refunds are initiated through Razorpay to the original payment
        method. Banks and payment providers control the final credit timeline.
        We will share the available refund reference after initiation.
      </p>
    </section>

    <section>
      <h2>6. Contact</h2>
      <p>
        For a payment issue, email{' '}
        <a href="mailto:meenu@meenuagarwal.in">meenu@meenuagarwal.in</a> or call{' '}
        <a href="tel:9712924902">97129 24902</a>. Include your name, payment
        reference, payment date, and a description of the issue. Do not send card
        numbers, CVV, bank passwords, OTPs, or UPI PINs.
      </p>
    </section>
  </LegalPage>
);

export default RefundPolicy;
