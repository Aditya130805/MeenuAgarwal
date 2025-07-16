import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Why should you go overseas for your education?",
      answer: "Studying in a foreign country has several advantages, including exposure to a different culture, a more impressive résumé, a wider pool of potential employers, and a broader perspective, and more."
    },
    {
      question: "How long do programs abroad typically last?",
      answer: "The answer lies in the level of degree sought. A bachelor's degree may be earned in three to four years of full-time study. Particularly in the United Kingdom, the standard time frame for studying most disciplines is three years. In the US, this is about 4 years. Alternatively, a master's degree might be earned in only a year or two. However, a Ph.D. or doctorate programme takes roughly 3 to 4 years."
    },
    {
      question: "What is the price range?",
      answer: "If you're attending a school abroad, you'll have to pay tuition for either the semester or the whole academic year. Apart from this, you will also be paying for your home, food, and other basics. So, the cost varies greatly, and is dependent upon the course, the institution, and the place."
    },
    {
      question: "Will financial aid be applicable for tuition abroad?",
      answer: "A variety of scholarship opportunities are constantly available. We can assist you enrol at a university overseas and provide you with accurate information to make an informed decision."
    },
    {
      question: "Can language serve as a barrier?",
      answer: "The language barrier is real, but if you're travelling to an English-speaking nation, you won't have to worry about it as much. Time spent overseas will only hone your skillset will only enhance language skills."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="relative w-full bg-gradient-to-r from-[var(--light-blue-color)] to-[var(--dark-blue-color)] flex flex-col justify-center items-center py-16 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-20 bg-white opacity-5" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)' }}></div>
      <div className="absolute bottom-0 right-0 w-full h-20 bg-white opacity-5" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0 100%)' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[var(--light-blue-color)] opacity-10 blur-3xl"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-center px-4">
            FAQs <span className="text-2xl md:text-3xl font-normal opacity-80">(Frequently Asked Questions)</span>
          </h2>
          <div className="w-24 h-1 bg-[var(--coral-color)]"></div>
        </div>
        
        <div className="w-full min-h-[250px] mb-6 px-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`w-full bg-white/[0.02] backdrop-blur-sm rounded-lg mb-4 overflow-hidden transition-all duration-300 ${activeIndex === index ? 'shadow-lg' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center p-5 cursor-pointer">
                <p className="text-lg md:text-[22px] text-white pr-4 font-normal">{faq.question}</p>
                <div className={`w-8 h-8 rounded-full bg-[var(--coral-color)] flex items-center justify-center transition-transform duration-500 ${activeIndex === index ? 'rotate-180' : ''}`}>
                  <FontAwesomeIcon icon={faChevronDown} className="text-white text-sm" />
                </div>
              </div>
              
              <div
                style={{
                  height: activeIndex === index ? 'auto' : '0',
                  opacity: activeIndex === index ? 1 : 0,
                  transform: activeIndex === index ? 'translateY(0)' : 'translateY(-10px)',
                  transition: 'opacity 300ms ease-out, transform 300ms ease-out',
                  overflow: 'hidden',
                  willChange: 'transform, opacity'
                }}
              >
                <div className="p-5 pt-2 text-base md:text-lg leading-7 md:leading-8 text-white border-t border-white/10">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
