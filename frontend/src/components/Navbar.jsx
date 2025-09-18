import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useLocation, Link } from 'react-router-dom';
import logo from '../assets/Images/transparentLogoBlack.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className="bg-gradient-to-r from-[var(--light-blue-color)] to-[var(--dark-blue-color)] h-[85px] flex justify-center items-center relative z-50">
      {/* Logo */}
      <div className="w-full lg:w-1/2 flex items-center">
        <Link to="/" className="ml-2 sm:ml-4 md:ml-[7%]">
          <img 
            src={logo} 
            alt="Firm's logo" 
            className="h-[50px] sm:h-[60px] md:h-[70px] filter invert"
          />
        </Link>
        <span className="text-white text-[24px] sm:text-[28px] md:text-[32px] ml-2 font-alex-brush italic tracking-wider truncate">
          Meenu Agarwal
        </span>
      </div>

      {/* Mobile Menu Button */}
      <div 
        className="lg:hidden absolute right-5 cursor-pointer"
        onClick={toggleMenu}
      >
        <FontAwesomeIcon icon={faBars} className="text-white text-2xl" />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex w-1/2 justify-end items-center">
        <NavLink href="/" active={currentPath === '/'}>Home</NavLink>
        <NavLink href="/countries" active={currentPath === '/countries'}>Countries</NavLink>
        <NavLink href="/videos" active={currentPath === '/videos'}>Videos</NavLink>
        {/* <NavLink href="/scholarships" active={currentPath === '/scholarships'}>Scholarships</NavLink> */}
        <NavLink href="/contact" active={currentPath === '/contact'} className="mr-[20%]">Contact</NavLink>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div 
        className={`lg:hidden absolute top-[85px] left-0 w-full bg-[var(--dark-blue-color)] shadow-lg transition-all duration-300 ease-in-out z-40 ${isMenuOpen ? 'block' : 'hidden'}`}
      >
        <div className="flex flex-col items-center py-6 space-y-5">
          <MobileNavLink href="/" active={currentPath === '/'}>Home</MobileNavLink>
          <MobileNavLink href="/countries" active={currentPath === '/countries'}>Countries</MobileNavLink>
          <MobileNavLink href="/videos" active={currentPath === '/videos'}>Videos</MobileNavLink>
          {/* <MobileNavLink href="/scholarships" active={currentPath === '/scholarships'}>Scholarships</MobileNavLink> */}
          <MobileNavLink href="/contact" active={currentPath === '/contact'}>Contact</MobileNavLink>
        </div>
      </div>
    </nav>
  );
};

// NavLink component for consistent styling
const NavLink = ({ href, children, active, className = '' }) => {
  return (
    <div className={`relative h-[22px] mx-4 group ${className}`}>
      <Link 
        to={href} 
        className="text-white hover:text-white/80 transition-colors duration-300"
      >
        <pre className="font-sans">  {children}  </pre>
      </Link>
      <div 
        className={`absolute -bottom-2 left-0 h-[3px] bg-[var(--coral-color)] transition-all duration-300 ease-in-out
          ${active ? 'w-full shadow-md' : 'w-0 group-hover:w-full'}`}
      ></div>
    </div>
  );
};

// Mobile NavLink component with larger touch targets
const MobileNavLink = ({ href, children, active }) => {
  return (
    <Link 
      to={href}
      className="w-full text-center py-2 px-4"
    >
      <div className="relative inline-block">
        <span className="text-white text-lg font-medium">{children}</span>
        {active && <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-[var(--coral-color)]"></div>}
      </div>
    </Link>
  );
};

export default Navbar;
