import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { SESSION_DURATION_MINUTES } from '../config/booking';

/**
 * Closing call-to-action, rendered immediately above the footer.
 *
 * Every page previously ran content straight into the copyright bar, so the
 * most engaged visitor — the one who read to the bottom — was left with no
 * next step. This is that next step.
 *
 * Sits on a white band with a quiet pale-blue panel inside. The lighter finish
 * prevents the CTA from competing with the blue page headers while keeping the
 * coral booking action visually dominant.
 */
const BookingCTA = ({ heading, body }) => {
  // On the contact page the secondary "send a message" link would point at the
  // page the visitor is already on.
  const isContactPage = useLocation().pathname === '/contact';

  return (
    <section className="w-full bg-white py-16 md:py-20 px-4">
      <div className="max-w-5xl mx-auto rounded-[25px] border border-[rgba(35,105,138,0.14)] bg-[#edf5f7] px-6 py-12 md:px-14 md:py-16 text-center shadow-[0_10px_28px_rgba(35,105,138,0.12)]">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--dark-blue-color)] mb-4">
          {heading ?? 'Ready to talk about your options?'}
        </h2>
        <div className="w-24 h-1 bg-[var(--coral-color)] mx-auto mb-6"></div>
        <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto mb-9 leading-relaxed">
          {body ??
            `Book a free ${SESSION_DURATION_MINUTES}-minute session with Meenu — one-on-one, no obligation, and nothing to pay.`}
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Link to="/book" className="group inline-flex">
            <button className="bg-[var(--coral-color)] h-[54px] px-9 rounded-full font-semibold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center">
              BOOK A SESSION
              <FontAwesomeIcon
                icon={faArrowRight}
                className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>
          </Link>

          {!isContactPage && (
            <Link
              to="/contact"
              className="text-[var(--dark-blue-color)] font-semibold underline underline-offset-4 hover:opacity-70 transition-opacity duration-300"
            >
              Or send a message
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingCTA;
