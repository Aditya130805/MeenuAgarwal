import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactButton from '../components/ContactButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass, faHome } from '@fortawesome/free-solid-svg-icons';

const NotFound = () => {
  const [rotation, setRotation] = useState(0);
  
  // Gentle animation for compass
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 md:p-12 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-[var(--light-blue-color)] rotate-12"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[var(--light-blue-color)] -rotate-12"></div>
          </div>
          
          <div className="relative z-10">
            {/* Compass icon with animation */}
            <div className="flex justify-center mb-8">
              <div className="text-[var(--coral-color)] opacity-80 text-8xl">
                <FontAwesomeIcon 
                  icon={faCompass} 
                  className="transform transition-transform duration-1000 ease-linear"
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--coral-color)] text-center mb-4">
              Looks like you're lost
            </h1>
            
            <div className="h-0.5 w-24 bg-[var(--coral-color)] mx-auto mb-8"></div>
            
            <p className="text-lg text-gray-600 text-center mb-8 leading-8">
              The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>
            
            <div className="flex justify-center">
              <Link 
                to="/" 
                className="flex items-center gap-2 px-6 py-3 bg-[var(--coral-color)] text-white font-medium rounded-lg hover:shadow-lg transform transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <FontAwesomeIcon icon={faHome} className="group-hover:animate-pulse" />
                <span>Take me home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      <ContactButton />
    </div>
  );
};

export default NotFound;
