import { useState, useEffect } from 'react';
import testimonial1Image from '../assets/Images/testimonial1Profile.jpeg';
import testimonial2Image from '../assets/Images/testimonial2Profile.png';
import testimonial3Image from '../assets/Images/testimonial3Profile.jpg';

const Testimonials = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const testimonials = [
    {
      name: "Tesuu Agarwal",
      university: "Queen Mary University, London",
      image: testimonial1Image,
      text: "I am incredibly grateful for the guidance and support I received throughout my academic journey- from high school to securing a place at Queen Mary University of London to study law. Your insight and encouragement played a key role in helping me navigate the admissions process with confidence. It not only helped me prepare a strong university application, but also ensured I was choosing a path that aligned with my interests and long-term goals. Even after starting university, the continued support in helping me explore career opportunities both in the UK and the US has been invaluable. From discussing different specialisations in law to walking me through postgraduate options and internship pathways abroad, the advice has helped me think more clearly and ambitiously about my future."
    },
    {
      name: "Pankaj Kale",
      university: "Heriot Watt University, Edinburgh",
      image: testimonial2Image,
      text: "Meenu Agrawal's guidance and support were instrumental in helping me secure admission to a prestigious university like Heriot-Watt.  I was the first person in my entire family to dream of studying abroad in pursuit of a successful career. However, achieving this dream required securing a bank loan—a daunting task for someone with no prior exposure to international education.  Meenu Agrawal not only assisted me throughout the admission process but also patiently addressed all the concerns my parents had—about the university, my well-being, and most importantly, the education loan. Her involvement made a world of difference at every step of the journey."
    },
    {
      name: "Shravan Doshi",
      university: "University of Edinburgh",
      image: testimonial3Image,
      text: "Interacting with Meenu made the process extremely seamless and effortless. She was extremely knowledgeable, helpful and very respecting of my choices and guided me in the right manner."
    }
  ];

  // Auto-rotate testimonials
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setActiveSlide((prev) => (prev + 1) % testimonials.length);
  //   }, 5000);
    
  //   return () => clearInterval(interval);
  // }, [testimonials.length]);

  return (
    <section className="relative w-full py-20 bg-radial from-white to-gray-200 flex flex-col justify-center items-center overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[var(--coral-color)] opacity-5 blur-xl"></div>
      <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-[var(--coral-color)] opacity-5 blur-xl"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-black mb-4 text-center">
            Testimonials
          </h2>
          <div className="w-24 h-1 bg-[var(--coral-color)]"></div>
        </div>
        
        {/* Container with proper overflow handling */}
        <div className="w-full overflow-hidden rounded-xl">
          <div className="w-full md:w-[100%] mx-auto relative shadow-lg">
            {/* Slider container */}
            <div 
              className="w-full flex transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
              <div key={index} className="min-w-full bg-black/2 backdrop-blur-sm rounded-xl overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-[30%] bg-black/2 flex flex-col justify-center items-center py-8 md:py-12">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--light-blue-color)] to-[var(--coral-color)] rounded-full blur-md opacity-70"></div>
                    <div 
                      className="relative h-[135px] w-[135px] rounded-full border-4 border-black/30 bg-cover bg-center"
                      style={{ backgroundImage: `url(${testimonial.image})` }}
                    ></div>
                  </div>
                  <h3 className="text-xl font-bold text-black text-center mb-2">
                    {testimonial.name}
                  </h3>
                  <p className="text-black/80 text-center font-medium">
                    {testimonial.university}
                  </p>
                </div>
                
                <div className="w-full md:w-[70%] flex justify-center items-center p-8 md:p-12">
                  <div className="relative">
                    <div className="absolute -top-6 -left-6 text-6xl text-[var(--coral-color)] font-serif">"</div>
                    <p className="text-base md:text-xl leading-8 md:leading-10 text-black/90 italic relative z-10">
                      {testimonial.text}
                    </p>
                    <div className="absolute -bottom-10 -right-6 text-6xl text-[var(--coral-color)] font-serif">"</div>
                  </div>
                </div>
              </div>
            ))}
            </div>
            
            {/* Navigation dots */}
            <div className="flex justify-center items-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${activeSlide === index 
                    ? 'bg-[var(--coral-color)] w-6' 
                    : 'bg-black/50 hover:bg-black/80'}`}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
            
            {/* Navigation arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 z-20 pointer-events-none">
              <button 
                onClick={() => setActiveSlide((activeSlide - 1 + testimonials.length) % testimonials.length)}
                className="w-10 h-10 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center text-black hover:bg-black/20 transition-all duration-300 pointer-events-auto"
                aria-label="Previous testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                onClick={() => setActiveSlide((activeSlide + 1) % testimonials.length)}
                className="w-10 h-10 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center text-black hover:bg-black/20 transition-all duration-300 pointer-events-auto"
                aria-label="Next testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
