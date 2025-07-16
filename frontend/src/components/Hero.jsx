import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import graduatingStudentImage from '../assets/Images/graduatingStudent.png';

const Hero = () => {
  return (
    <section className="relative overflow-hidden h-auto w-full">
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[var(--light-blue-color)] opacity-10 blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-[var(--coral-color)] opacity-10 blur-lg"></div>
      
      {/* Content container */}
      <div className="relative z-10 flex flex-col h-full max-w-7xl mx-auto">
        {/* Section heading */}
        <div className="w-full px-6 lg:px-[75px] pt-[50px] flex flex-col items-center">
          <h1 className="text-4xl leading-12 md:text-5xl md:leading-16 lg:text-6xl font-extrabold leading-18 text-center mb-4">
            Education is life's single most important decision
          </h1>
          <div className="w-24 h-1 bg-[var(--coral-color)]"></div>
        </div>
        
        {/* Large screen layout with image - Only visible on xl screens */}
        <div className="hidden xl:flex flex-1 items-center w-full mt-10">
          {/* Text and CTA */}
          <div className="w-5/7 flex flex-col items-start justify-center pl-[75px] pr-5">
            <p className="text-xl font-medium tracking-wide mb-[45px] leading-11 lg:leading-12 max-w-2xl text-left">
              {/* For over 15 years, I've dedicated myself to helping students discover learning paths that not only build meaningful careers but also instill lasting confidence, adaptability, and a love for growth. Many of them have gone on to become successful leaders, entrepreneurs, and changemakers in their own right. Their journeys are a testament to the fact that with the right education — and the right guidance — you're not just prepared for a job, you're prepared for life. I'm here to help you do the same, in a world that's changing fast. */}
              For over 15 years, I have dedicated myself to guiding students towards learning pathways that cultivate not only employability, but also adaptability and lifelong resilience. Many of my students have become top executives, successful entrepreneurs, and inspiring change-makers. Their journeys prove that the right education — paired with the right guidance — prepares you for life, not just a job. 
              <br></br>
              I am <span className="font-bold text-[var(--coral-color)]">Meenu Agarwal</span> — a Chartered Accountant by qualification and an educationist by passion. I empower students to unlock their true potential and build careers that equip them not just for today's opportunities, but for tomorrow's challenges.
            </p>
            
            <a href="/contact" className="group inline-flex">
              <button className="bg-[var(--coral-color)] h-[50px] px-8 mb-16 rounded-full font-semibold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center">
                CONTACT ME
                <FontAwesomeIcon icon={faArrowRight} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </a>
          </div>

          {/* Hero Image */}
          <div className="w-2/5 flex justify-start items-center">
            <img 
              src={graduatingStudentImage} 
              alt="A student wearing a graduation cap" 
              className="h-[675px] object-contain"
            />
          </div>
        </div>

        {/* Small/Medium screen layout - centered, no image - Only visible below xl screens */}
        <div className="xl:hidden flex flex-col items-center flex-1 px-6 md:px-10 lg:px-20">
          <div className="max-w-2xl mx-auto flex flex-col justify-center items-center h-full py-12 md:py-16">
            <p className="text-lg leading-10 md:text-xl font-medium tracking-wide mb-12 md:leading-12 text-center">
              For over 15 years, I have dedicated myself to guiding students towards learning pathways that cultivate not only employability, but also adaptability and lifelong resilience. Many of my students have become top executives, successful entrepreneurs, and inspiring change-makers. Their journeys prove that the right education — paired with the right guidance — prepares you for life, not just a job. 
              <br></br>
              I am <span className="font-bold text-[var(--coral-color)]">Meenu Agarwal</span> — a Chartered Accountant by qualification and an educationist by passion. I empower students to unlock their true potential and build careers that equip them not just for today's opportunities, but for tomorrow's challenges.
            </p>
            
            <div className="flex justify-center">
              <a href="/contact" className="group inline-flex">
                <button className="bg-[var(--coral-color)] h-[50px] px-8 rounded-full font-semibold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center">
                  CONTACT ME
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
