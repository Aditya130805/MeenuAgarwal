import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactButton from '../components/ContactButton';
import UKFlag from '../assets/Images/UKFlag.jpg';
import ItalyFlag from '../assets/Images/italyFlag.png';
import NetherlandsFlag from '../assets/Images/netherlandsFlag.png';

const Countries = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Why Study Abroad Section */}
      <section className="py-12 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
            Why study in Europe?
          </h2>
          <div className="w-24 h-1 bg-[var(--coral-color)] mb-8"></div>
          
          <ul className="space-y-8">
            <li className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl md:text-2xl font-semibold text-[var(--coral-color)] mb-3">
                Internationally recognized degrees
              </h3>
              <p className="text-gray-700">
                Universities in the UK, Italy, and Netherlands, are all well-known for the excellent quality of education and practical skills that they provide. Many organisations, even apart from those in these countries, value the degrees obtained from these institutions. This can be very crucial and can make a huge difference when applying for jobs and searching for placements in the entirety of Europe.
              </p>
            </li>
            
            <li className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl md:text-2xl font-semibold text-[var(--coral-color)] mb-3">
                Shorter duration of courses
              </h3>
              <p className="text-gray-700">
                Undergraduate courses in Europe often last for no more than three years, as opposed to the four-year courses in colleges in the United States. As a result, the programmes are less time-consuming and more cost-effective for all of the students that attend. Furthermore, several colleges there provide a one-year work internship in the industry too, which can help you improve your practical abilities, and gain crucial work experience. As for postgraduate programs, they can be as short as just lasting for a single year, while also teaching you everything that's important during that period.
              </p>
            </li>
            
            <li className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl md:text-2xl font-semibold text-[var(--coral-color)] mb-3">
                Great infrastructure and a vast assortment of subjects to select from
              </h3>
              <p className="text-gray-700">
                Education infrastructure is a critical component of the university learning setting. High-quality infrastructure, among other things, promotes better education, increases student results, and lowers dropout rates, according to credible data. This is omnipresent in all universities in Europe, especially in the UK, Italy, and Netherlands. Additionally, as mentioned above, you can select any subject that you are passionate about there and catch your dreams.
              </p>
            </li>
          </ul>
        </div>
      </section>
      
      {/* Countries Section */}
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
              Where to study in Europe and why?
            </h2>
            <div className="w-24 h-1 bg-[var(--coral-color)]"></div>
          </div>
          
          <div className="space-y-12">
            {/* United Kingdom */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 p-6 bg-gradient-to-r from-[var(--light-blue-color)] to-[var(--dark-blue-color)] flex flex-col items-center justify-center">
                  <img 
                    src={UKFlag} 
                    alt="Flag of the United Kingdom" 
                    className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md mb-4"
                  />
                  <h3 className="text-2xl font-bold text-white text-center">United Kingdom</h3>
                </div>
                
                <div className="md:w-2/3 p-6">
                  <ul className="space-y-6">
                    <li>
                      <h4 className="text-xl font-semibold text-[var(--coral-color)]">
                        UK has a diverse multi-cultural environment
                      </h4>
                      <p className="mt-2 text-gray-700 pl-4 border-l-4 border-[var(--light-blue-color)]">
                        There are relatively few places in the world that have a rich past as well as the conveniences of the modern world. The United Kingdom has it all. With its racial, cultural, and religious diversity, the United Kingdom is particularly receptive to different customs and cultures, which is ideal for foreign students.
                      </p>
                    </li>
                    
                    <li>
                      <h4 className="text-xl font-semibold text-[var(--coral-color)]">
                        The reinstatement of the post-study work visa
                      </h4>
                      <p className="mt-2 text-gray-700 pl-4 border-l-4 border-[var(--light-blue-color)]">
                        After finishing your studies in the UK, you can now stay for two years (on a Student route PSW visa). This was disbanded earlier and has just recently been re-introduced. Make sure to make the most of it.
                      </p>
                    </li>
                    
                    <li>
                      <h4 className="text-xl font-semibold text-[var(--coral-color)]">
                        Health benefits
                      </h4>
                      <p className="mt-2 text-gray-700 pl-4 border-l-4 border-[var(--light-blue-color)]">
                        As an international student, you will have access to free medical treatment through the National Health Service while studying in the UK (NHS). You will only be required to pay an Immigration Health Surcharge (IHS) when applying for a student visa in order to get this benefit.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Italy */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 p-6 bg-gradient-to-r from-[var(--light-blue-color)] to-[var(--dark-blue-color)] flex flex-col items-center justify-center">
                  <img 
                    src={ItalyFlag} 
                    alt="Flag of Italy" 
                    className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md mb-4"
                  />
                  <h3 className="text-2xl font-bold text-white text-center">Italy</h3>
                </div>
                
                <div className="md:w-2/3 p-6">
                  <ul className="space-y-6">
                    <li>
                      <h4 className="text-xl font-semibold text-[var(--coral-color)]">
                        It is an affordable destination
                      </h4>
                      <p className="mt-2 text-gray-700 pl-4 border-l-4 border-[var(--light-blue-color)]">
                        The average tuition fees for any and all degrees range from just 850-1000 EUR/year. The average living expenses range from 700-1000 EUR/month including housing, transportation, food, and fun.
                      </p>
                    </li>
                    
                    <li>
                      <h4 className="text-xl font-semibold text-[var(--coral-color)]">
                        There are several top universities with a splendid international environment
                      </h4>
                      <p className="mt-2 text-gray-700 pl-4 border-l-4 border-[var(--light-blue-color)]">
                        For example, the University of Bologna is known to be the origin of the current Western higher education system and the oldest university in all of Europe. Additionally, other public universities are also quite well-known, such as Politecnico di Milano, Politecnico di Torino, University of Siena, Univeresity of Pavia, University of Padua, etc.
                      </p>
                    </li>
                    
                    <li>
                      <h4 className="text-xl font-semibold text-[var(--coral-color)]">
                        Italy is surrounded by art, history, and fashion
                      </h4>
                      <p className="mt-2 text-gray-700 pl-4 border-l-4 border-[var(--light-blue-color)]">
                        It is known to be the birthplace of Renaissance art; anywhere in Italy you go, you'll find amazing architectural wonders that stood the test of time. 51 UNESCO World Heritage Sites, to be precise, the most in any single country. It is filled with wonders to explore.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Netherlands */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 p-6 bg-gradient-to-r from-[var(--light-blue-color)] to-[var(--dark-blue-color)] flex flex-col items-center justify-center">
                  <img 
                    src={NetherlandsFlag} 
                    alt="Flag of Netherlands" 
                    className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md mb-4"
                  />
                  <h3 className="text-2xl font-bold text-white text-center">Netherlands</h3>
                </div>
                
                <div className="md:w-2/3 p-6">
                  <ul className="space-y-6">
                    <li>
                      <h4 className="text-xl font-semibold text-[var(--coral-color)]">
                        Innovative teaching methods
                      </h4>
                      <p className="mt-2 text-gray-700 pl-4 border-l-4 border-[var(--light-blue-color)]">
                        Getting straight to the point, the Dutch educational system emphasises teamwork. Good personal relationships between professors and students are also highly valued in Dutch universities. As a result, majority of tutorials and seminars are held in small groups of 15-30 students. This teamwork approach helps you improve not just your academic talents but also your ability to operate as part of a team. Many practical components are also included. There is a strong focus on meaningful practical experience, and institutions here have numerous relationships with both Dutch and foreign enterprises.
                      </p>
                    </li>
                    
                    <li>
                      <h4 className="text-xl font-semibold text-[var(--coral-color)]">
                        Affordable living expenses
                      </h4>
                      <p className="mt-2 text-gray-700 pl-4 border-l-4 border-[var(--light-blue-color)]">
                        In comparison to other Western European countries, the cost of living in the Netherlands is relatively low - roughly between €800 and €1,000 every month. Additionally, as a student, you can avail many discounts in restaurants, museums, and theatres. Be sure to get an ISIC Student card to take advantage of even more privileges and savings.
                      </p>
                    </li>
                    
                    <li>
                      <h4 className="text-xl font-semibold text-[var(--coral-color)]">
                        Excellent travel opportunities
                      </h4>
                      <p className="mt-2 text-gray-700 pl-4 border-l-4 border-[var(--light-blue-color)]">
                        The Netherlands, also known as "the gateway to Europe", is ideally situated, with easy access to major European cities; Berlin, Brussels, Paris, and London are just a one-hour flight away from Amsterdam. Additionally, it is quite simple and convenient to move around the city on a bicycle, the favourite mode of transportation for the Dutch and also the cheapest. There are specific routes for cyclists, so you can cycle with peace and confidence.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      <ContactButton />
    </div>
  );
};

export default Countries;
