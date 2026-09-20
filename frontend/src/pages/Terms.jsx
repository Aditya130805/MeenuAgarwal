import { Link } from 'react-router-dom';
import LegalPage from '../components/LegalPage';

const Terms = () => (
  <LegalPage
    title="Terms and Conditions"
    introduction="The terms that apply when you purchase or use Meenu Agarwal’s counseling services."
  >
    <section>
      <h2>1. About these terms</h2>
      <p>
        These terms apply to the Complete Counseling Package offered by Meenu
        Agarwal from Ahmedabad, Gujarat, India. By purchasing the package, you
        confirm that the information you provide is accurate and that you accept
        these terms and our <Link to="/refund-policy">refund policy</Link>.
      </p>
    </section>

    <section>
      <h2>2. Package and price</h2>
      <p>
        The package price is ₹30,000 as a one-time payment, including all taxes.
        It covers personal counseling support described on the pricing page,
        including profile assessment, shortlisting, application guidance, offer
        evaluation, and visa and pre-departure guidance where relevant.
      </p>
      <p>
        The package is a counseling and guidance service. It does not include
        third-party charges such as application fees, tests, translations,
        university deposits, visa fees, travel, insurance, or accommodation
        unless agreed separately in writing.
      </p>
    </section>

    <section>
      <h2>3. No guaranteed outcome</h2>
      <p>
        Admissions, scholarships, visas, loans, and other decisions are made by
        independent institutions and authorities. Counseling improves planning
        and preparation but cannot guarantee any particular result.
      </p>
    </section>

    <section>
      <h2>4. Your responsibilities</h2>
      <ul>
        <li>Provide complete, accurate, and genuine information and documents.</li>
        <li>Meet deadlines communicated by institutions, authorities, and Meenu.</li>
        <li>Review applications and documents before they are submitted.</li>
        <li>Communicate material changes that may affect your application.</li>
      </ul>
    </section>

    <section>
      <h2>5. Payment and onboarding</h2>
      <p>
        Payments are processed by Razorpay. Service onboarding begins only after
        payment is verified as captured. A checkout screen or bank debit alone
        does not override the verified payment status. Meenu will contact you
        using the email address or phone number supplied at checkout.
      </p>
    </section>

    <section>
      <h2>6. Cancellations and service availability</h2>
      <p>
        Customer cancellations are governed by the{' '}
        <Link to="/refund-policy">Cancellation and Refund Policy</Link>. If Meenu
        cannot provide the purchased service, the affected amount will be
        refunded to the original payment method.
      </p>
    </section>

    <section>
      <h2>7. Acceptable use</h2>
      <p>
        You must not submit false records, request dishonest representations, or
        use the service for unlawful activity. Service may be stopped if fraud,
        abuse, or deliberate misrepresentation is identified.
      </p>
    </section>

    <section>
      <h2>8. Contact</h2>
      <p>
        Questions may be sent to{' '}
        <a href="mailto:meenu@meenuagarwal.in">meenu@meenuagarwal.in</a> or raised
        by phone at <a href="tel:9712924902">97129 24902</a>. The business address
        is 605, Entice, Ambli-Bopal Road, Ahmedabad 380058, Gujarat, India.
      </p>
    </section>
  </LegalPage>
);

export default Terms;
