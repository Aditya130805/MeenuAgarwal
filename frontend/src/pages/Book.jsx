import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faCircleCheck,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CalEmbed from '../components/CalEmbed';
import PageHero from '../components/PageHero';
import {
  BOOKING_HEADING,
  BOOKING_SUBHEADING,
  BOOKING_HIGHLIGHTS,
} from '../config/booking';

const HIGHLIGHT_ICONS = [faClock, faCircleCheck, faVideo];

const Book = () => {
  return (
    <div className="min-h-screen bg-[#f7fafb]">
      <Navbar />

      <PageHero title={BOOKING_HEADING} description={BOOKING_SUBHEADING} />

      {/* What to expect */}
      <section className="relative z-10 mx-auto -mt-20 max-w-6xl px-4 md:-mt-24 md:px-8">
        <div className="grid overflow-hidden rounded-[28px] bg-white shadow-[0_18px_55px_rgba(28,84,109,0.2)] md:grid-cols-3">
          {BOOKING_HIGHLIGHTS.map((highlight, index) => (
            <div
              key={highlight.title}
              className="flex flex-col items-center p-7 text-center sm:p-9 md:border-l md:border-slate-200 md:first:border-l-0"
            >
              <FontAwesomeIcon
                icon={HIGHLIGHT_ICONS[index]}
                className="mb-4 text-2xl text-[var(--dark-blue-color)]"
              />
              <h2 className="mb-2 text-lg font-bold text-[var(--dark-blue-color)]">
                {highlight.title}
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                {highlight.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The calendar itself */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
        <CalEmbed />

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
    </div>
  );
};

export default Book;
