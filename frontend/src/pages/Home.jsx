import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WhyUs from '../components/WhyUs';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import BookingCTA from '../components/BookingCTA';
import ContactButton from '../components/ContactButton';

const Home = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Hero />
            <WhyUs />
            <Testimonials />
            <FAQ />
            <BookingCTA />
            <Footer />
            <ContactButton />
        </div>
    );
};

export default Home;
