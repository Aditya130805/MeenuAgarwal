import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

const ContactButton = () => {
  return (
    <a 
      href="tel:9712924902" 
      className="h-[45px] w-[150px] bg-[var(--contact-green-color)] rounded-full flex justify-center items-center fixed right-[50px] bottom-[50px] z-[1000] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* <i className="fa fa-phone text-xl text-black font-extrabold mr-[4%]"></i> */}
      <FontAwesomeIcon icon={faPhone} className="text-black text-md mr-[4%]" />
      <span className="text-black">97129 24902</span>
    </a>
  );
};

export default ContactButton;
