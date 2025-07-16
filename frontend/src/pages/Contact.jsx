import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactButton from '../components/ContactButton';
import studentPointingImage from '../assets/Images/studentPointing.png';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    course: '',
    country: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic - using formsubmit.co as in the original
    // The form will handle submission through its action attribute
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Main content section */}
      <section className="relative flex flex-col md:flex-row justify-center items-center w-full min-h-[638px] py-10 md:py-0 md:h-[700px]">
        {/* Student image - hidden on small screens, visible from medium screens */}
        <img 
          src={studentPointingImage} 
          alt="Student pointing at our contact details" 
          className="hidden md:block absolute left-0 md:left-5 lg:left-10 bottom-0 h-[300px] md:h-[400px] lg:h-[550px] z-0"
        />
        
        {/* Spacing div - adjusts based on screen size */}
        <div className="hidden md:block w-0 md:w-[30%] lg:w-[40%] h-[638px]"></div>
        
        {/* Form container - takes full width on small screens */}
        <div className="w-full md:w-[70%] lg:w-[55%] min-h-[638px] flex justify-center md:justify-start items-center px-4 md:px-0">
          <div className="w-full md:w-[90%] lg:w-[82%] bg-white rounded-[25px] shadow-[0_8px_24px_rgba(35,105,138,0.2)] my-8 md:my-0">
            <form 
              className="w-full flex flex-col p-5 md:p-[30px] lg:p-[30px_60px] rounded-[10px]"
              autoComplete="off"
              id="contactForm"
              action="https://formsubmit.co/meenuipc@gmail.com"
              method="POST"
              onSubmit={handleSubmit}
            >
              <h3 className="text-2xl text-[rgb(85,85,85)] font-extrabold mb-5">
                Leave me a message:
              </h3>
              
              <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-[35px]">
                <input 
                  type="text"
                  name="firstName"
                  placeholder="First name *"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full sm:w-1/2 border-0 my-[10px] px-[5px] py-[15px] sm:py-[20px] outline-none border-b-2 border-black/20 text-base focus:border-b-2 focus:border-[rgba(35,105,138,0.8)] transition-all duration-300"
                />
                <input 
                  type="text"
                  name="lastName"
                  placeholder="Last name *"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full sm:w-1/2 border-0 my-[10px] px-[5px] py-[15px] sm:py-[20px] outline-none border-b-2 border-black/20 text-base focus:border-b-2 focus:border-[rgba(35,105,138,0.8)] transition-all duration-300"
                />
              </div>
              
              <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-[35px]">
                <input 
                  type="email"
                  name="email"
                  placeholder="Email-id *"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full sm:w-1/2 border-0 my-[10px] px-[5px] py-[15px] sm:py-[20px] outline-none border-b-2 border-black/20 text-base focus:border-b-2 focus:border-[rgba(35,105,138,0.8)] transition-all duration-300"
                />
                <input 
                  type="text"
                  name="phone"
                  placeholder="Phone number *"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full sm:w-1/2 border-0 my-[10px] px-[5px] py-[15px] sm:py-[20px] outline-none border-b-2 border-black/20 text-base focus:border-b-2 focus:border-[rgba(35,105,138,0.8)] transition-all duration-300"
                />
              </div>
              
              <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-[35px]">
                <input 
                  type="text"
                  name="course"
                  placeholder="Course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full sm:w-1/2 border-0 my-[10px] px-[5px] py-[15px] sm:py-[20px] outline-none border-b-2 border-black/20 text-base focus:border-b-2 focus:border-[rgba(35,105,138,0.8)] transition-all duration-300"
                />
                <input 
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full sm:w-1/2 border-0 my-[10px] px-[5px] py-[15px] sm:py-[20px] outline-none border-b-2 border-black/20 text-base focus:border-b-2 focus:border-[rgba(35,105,138,0.8)] transition-all duration-300"
                />
              </div>
              
              <textarea 
                id="message"
                name="message"
                rows="2"
                placeholder="Any extra remarks you would like to add"
                value={formData.message}
                onChange={handleChange}
                className="border-0 my-[10px] px-[5px] py-[20px] outline-none border-b-2 border-black/20 text-base focus:border-b-2 focus:border-[rgba(35,105,138,0.8)] transition-all duration-300 resize-none"
              />
              
              <button 
                type="submit"
                className="py-[15px] bg-[var(--coral-color)] text-white text-lg border-0 outline-none cursor-pointer w-[150px] mx-auto mt-5 rounded-[30px] shadow-[0_4px_12px_rgba(255,112,67,0.3)] transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(255,112,67,0.4)]"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Location section */}
      <section className="min-h-[620px] py-10 md:py-0 md:h-[620px] w-full bg-gradient-to-r from-[var(--light-blue-color)] to-[var(--dark-blue-color)] flex flex-col justify-center items-center overflow-visible">
        <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-[25px] px-4 text-center">
          Meet me!
        </div>
        
        <div className="w-[90%] mb-[15px] text-white text-base sm:text-lg px-4 text-center sm:text-left">
          <span className="text-lg sm:text-xl font-extrabold">Address: </span>
          605, Entice, Ambli-Bopal Road, Ahmedabad 380058, Gujarat, India
        </div>
        
        <div className="h-[300px] sm:h-[350px] md:h-[400px] w-[90%] bg-black rounded-[25px] overflow-hidden">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.88079113476!2d72.48880367513492!3d23.028148816120403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9b149d4f9d29%3A0x2fc8fb6f939b9ad7!2sEntice!5e0!3m2!1sen!2sus!4v1752349616249!5m2!1sen!2sus" 
            className="w-full h-full"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
      
      <Footer />
      <ContactButton />
    </div>
  );
};

export default Contact;
