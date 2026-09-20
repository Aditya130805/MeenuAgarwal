import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactButton from '../components/ContactButton';
import PageHero from '../components/PageHero';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass, faHome } from '@fortawesome/free-solid-svg-icons';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7fafb]">
      <Navbar />

      <main className="flex-grow">
        <PageHero
          title="Looks like you took a wrong turn"
          description="The page you were looking for may have moved, or the address may be incomplete. Your next step is still easy."
        />

        <section className="relative z-10 mx-auto -mt-20 max-w-2xl px-4 pb-20 md:-mt-24 md:px-8 md:pb-28">
          <div className="rounded-[28px] bg-white p-8 text-center shadow-[0_18px_55px_rgba(28,84,109,0.2)] sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#edf5f7] text-4xl text-[var(--dark-blue-color)]">
              <FontAwesomeIcon icon={faCompass} />
            </div>
            <h2 className="mt-7 text-2xl font-extrabold text-[var(--dark-blue-color)]">
              Let’s get you back on track
            </h2>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-slate-600">
              Return to the homepage to explore counseling, countries, student
              stories, and the free introductory session.
            </p>
            <Link
              to="/"
              className="group mx-auto mt-8 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[var(--coral-color)] px-8 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <FontAwesomeIcon icon={faHome} />
              <span>Take me home</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <ContactButton />
    </div>
  );
};

export default NotFound;
