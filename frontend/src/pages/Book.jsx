import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faCircleCheck,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactButton from '../components/ContactButton';
import CalEmbed from '../components/CalEmbed';
import {
  BOOKING_HEADING,
  BOOKING_SUBHEADING,
  BOOKING_HIGHLIGHTS,
} from '../config/booking';

const HIGHLIGHT_ICONS = [faClock, faCircleCheck, faVideo];

const Book = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Intro band — reuses the site's blue gradient treatment */}
      <section className="w-full bg-gradient-to-r from-[var(--light-blue-color)] to-[var(--dark-blue-color)] py-14 md:py-20 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            {BOOKING_HEADING}
          </h1>
          <div className="w-24 h-1 bg-[var(--coral-color)] mb-6"></div>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl leading-relaxed">
            {BOOKING_SUBHEADING}
          </p>
        </div>
      </section>

      {/* What to expect */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 -mt-8 md:-mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {BOOKING_HIGHLIGHTS.map((highlight, index) => (
            <div
              key={highlight.title}
              className="bg-white rounded-[20px] shadow-[0_8px_24px_rgba(35,105,138,0.15)] p-6 flex flex-col items-center text-center hover:shadow-[0_12px_28px_rgba(35,105,138,0.22)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <FontAwesomeIcon
                icon={HIGHLIGHT_ICONS[index]}
                className="text-[var(--coral-color)] text-2xl mb-4"
              />
              <h3 className="text-lg font-semibold text-[var(--dark-blue-color)] mb-2">
                {highlight.title}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {highlight.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The calendar itself */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="w-full bg-white rounded-[25px] shadow-[0_8px_24px_rgba(35,105,138,0.2)] overflow-hidden">
          <CalEmbed />
        </div>

        <p className="text-center text-gray-600 mt-8 text-base">
          Prefer to write first?{' '}
          <Link
            to="/contact"
            className="text-[var(--coral-color)] font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity duration-300"
          >
            Send a message instead
          </Link>
          .
        </p>
      </section>

      <Footer />
      <ContactButton />
    </div>
  );
};

export default Book;
