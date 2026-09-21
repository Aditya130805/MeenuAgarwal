import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingCTA from '../components/BookingCTA';
import ContactButton from '../components/ContactButton';
import PageHero from '../components/PageHero';
import studentPointingImage from '../assets/Images/studentPointing.webp';

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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        title="Let’s talk about your plans"
        description="Tell Meenu where you are in your journey, what you are considering, and where you feel stuck. A thoughtful reply starts with the right context."
      />

      <section className="relative z-10 mx-auto -mt-20 max-w-6xl px-4 pb-16 md:-mt-24 md:px-8 md:pb-24">
        <div className="grid overflow-hidden rounded-[28px] bg-white shadow-[0_18px_55px_rgba(28,84,109,0.2)] md:grid-cols-[0.78fr_1.22fr]">
          <div className="relative hidden min-h-[620px] overflow-hidden bg-[#edf5f7] md:flex md:flex-col md:justify-between md:p-10">
            <div className="relative z-10 max-w-xs">
              <h2 className="text-3xl font-extrabold leading-tight text-[var(--dark-blue-color)]">
                Start with a conversation.
              </h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                Share your goals and questions. Meenu will respond personally,
                without passing you through a call centre.
              </p>
            </div>
            <div className="relative h-[390px]">
              <div className="absolute -bottom-24 -left-28 h-72 w-72 rounded-full border border-[rgba(35,105,138,0.12)]" />
              <img
                src={studentPointingImage}
                alt="Student pointing toward the contact form"
                className="absolute bottom-[-2.5rem] left-1/2 h-[430px] max-w-none -translate-x-1/2"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>

          <form
              className="flex w-full flex-col p-6 sm:p-9 lg:p-12"
              autoComplete="off"
              id="contactForm"
              action="https://formsubmit.co/meenu@meenuagarwal.in"
              method="POST"
            >
              <div className="mb-7">
                <h2 className="text-2xl font-extrabold text-[var(--dark-blue-color)] sm:text-3xl">
                  Leave me a message
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Fields marked with an asterisk are required.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name *"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-[var(--light-blue-color)] focus:ring-2 focus:ring-[rgba(35,105,138,0.14)]"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name *"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-[var(--light-blue-color)] focus:ring-2 focus:ring-[rgba(35,105,138,0.14)]"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email-id *"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-[var(--light-blue-color)] focus:ring-2 focus:ring-[rgba(35,105,138,0.14)]"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number *"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-[var(--light-blue-color)] focus:ring-2 focus:ring-[rgba(35,105,138,0.14)]"
                />
                <input
                  type="text"
                  name="course"
                  placeholder="Course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-[var(--light-blue-color)] focus:ring-2 focus:ring-[rgba(35,105,138,0.14)]"
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-[var(--light-blue-color)] focus:ring-2 focus:ring-[rgba(35,105,138,0.14)]"
                />
              </div>

              <textarea
                id="message"
                name="message"
                rows="4"
                placeholder="Any extra remarks you would like to add"
                value={formData.message}
                onChange={handleChange}
                className="mt-5 resize-none rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-[var(--light-blue-color)] focus:ring-2 focus:ring-[rgba(35,105,138,0.14)]"
              />

              <button
                type="submit"
                className="mt-7 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[var(--coral-color)] px-8 text-base font-bold text-white shadow-[0_7px_18px_rgba(255,112,67,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_9px_22px_rgba(255,112,67,0.38)] sm:w-fit"
              >
                Send message
              </button>
            </form>
        </div>
      </section>
      
      {/* Location section temporarily hidden.
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
      */}
      
      <BookingCTA
        heading="Prefer to talk it through?"
        body="Pick a time that suits you and Meenu will be there — one-on-one, free, and with no obligation."
      />
      <Footer />
      <ContactButton />
    </div>
  );
};

export default Contact;
