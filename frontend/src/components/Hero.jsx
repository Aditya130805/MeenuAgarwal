import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import graduatingStudentImage from '../assets/Images/graduatingStudent.webp';
import PageHero from './PageHero';

const Hero = () => {
  return (
    <section className="bg-[#f7fafb] pb-16 md:pb-24">
      <PageHero
        title="Education is life’s single most important decision"
        description="The right course is more than an admission. It should open a path that fits who you are, where you want to go, and the life you want to build."
      />

      <div className="relative z-10 mx-auto -mt-20 max-w-6xl px-4 md:-mt-24 md:px-8">
        <div className="grid overflow-hidden rounded-[28px] bg-white shadow-[0_18px_55px_rgba(28,84,109,0.2)] md:grid-cols-[1.15fr_0.85fr]">
          <div className="p-7 sm:p-10 lg:p-12">
            <h2 className="max-w-xl text-2xl font-extrabold leading-tight text-[var(--dark-blue-color)] sm:text-3xl lg:text-4xl">
              Guidance for the career—and the person—you are becoming.
            </h2>
            <p className="mt-6 max-w-2xl leading-8 text-slate-700">
              For over 15 years, I have helped students choose learning paths
              that build employability, adaptability, and confidence. Their
              journeys show that the right education, paired with honest
              guidance, prepares you for life—not only for a job.
            </p>
            <p className="mt-5 max-w-2xl leading-8 text-slate-700">
              I am <strong className="text-[var(--dark-blue-color)]">Meenu Agarwal</strong>,
              a Chartered Accountant by qualification and an educationist by
              passion. I work directly with every student to turn ambition into
              a clear, realistic plan.
            </p>

            <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <Link
                to="/book"
                className="group inline-flex min-h-[52px] items-center justify-center rounded-full bg-[var(--coral-color)] px-8 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                BOOK A SESSION
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="ml-2 transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                to="/contact"
                className="font-semibold text-[var(--dark-blue-color)] underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                Contact me instead
              </Link>
            </div>
          </div>

          <div className="relative hidden min-h-[500px] overflow-hidden bg-[#edf5f7] md:block">
            <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full border border-[rgba(35,105,138,0.12)]" />
            <img
              src={graduatingStudentImage}
              alt="A student wearing a graduation cap"
              className="absolute bottom-0 left-1/2 h-[500px] max-w-none -translate-x-1/2 object-contain"
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
