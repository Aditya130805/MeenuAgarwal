import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faHandshake, faChartLine } from '@fortawesome/free-solid-svg-icons';

const WhyUs = () => {
  return (
    <section className="relative min-h-[450px] w-full bg-gradient-to-r from-[var(--light-blue-color)] to-[var(--dark-blue-color)] flex flex-col justify-center items-center py-16 px-6 lg:px-[7%] overflow-hidden">
      {/* Decorative elements */}
      {/* <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-bl-full"></div> */}
      {/* <div className="absolute left-0 bottom-0 w-64 h-64 bg-white opacity-5 rounded-tr-full"></div> */}
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col items-center mb-12">
          {/* <span className="bg-white/10 text-white text-sm font-medium px-4 py-1 rounded-full mb-4">MY PHILOSOPHY</span> */}
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-center px-4 md:px-6 leading-15">
            Career counselling goes beyond just securing admission.
          </h2>
          <div className="w-24 h-1 bg-[var(--coral-color)]"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg flex flex-col items-center text-center hover:transform hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-[var(--coral-color)] flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faUserGraduate} className="text-white text-2xl" />
            </div>
            <h3 className="text-white text-xl font-bold mb-3">Personalized Guidance</h3>
            <p className="text-white/90">Every student receives personal counseling tailored to their unique aspirations and goals.</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg flex flex-col items-center text-center hover:transform hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-[var(--coral-color)] flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faHandshake} className="text-white text-2xl" />
            </div>
            <h3 className="text-white text-xl font-bold mb-3">Direct Involvement</h3>
            <p className="text-white/90">I never delegate counseling to colleagues or assistants, ensuring a relationship built on trust.</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg flex flex-col items-center text-center hover:transform hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-[var(--coral-color)] flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faChartLine} className="text-white text-2xl" />
            </div>
            <h3 className="text-white text-xl font-bold mb-3">Long-term Success</h3>
            <p className="text-white/90">My satisfaction comes from watching students thrive in their careers, not just securing admissions.</p>
          </div>
        </div>
        
        <p className="text-base md:text-xl leading-7 md:leading-9 text-white font-normal max-w-4xl mx-auto text-center">
          I firmly believe in true career guidance — not just 'admissions into universities'. I take pride in personally counselling every student, taking the time to deeply understand their aspirations and guiding them towards choices that genuinely align with their goals.
        </p>
      </div>
    </section>
  );
};

export default WhyUs;
