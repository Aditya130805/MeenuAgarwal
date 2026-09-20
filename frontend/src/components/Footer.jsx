import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-[var(--black-color)] px-4 py-7 text-[#dcdcdc]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center text-sm sm:flex-row sm:text-left">
        <p>Copyright © {new Date().getFullYear()}, MeenuAgarwal</p>
        <nav aria-label="Legal links" className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          <Link to="/terms" className="hover:text-white">Terms</Link>
          <Link to="/privacy" className="hover:text-white">Privacy</Link>
          <Link to="/refund-policy" className="hover:text-white">
            Refund Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
