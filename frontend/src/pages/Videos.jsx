import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactButton from '../components/ContactButton';

const Videos = () => {
  // State to track if animations should play
  const [animate, setAnimate] = useState(false);

  // Enable animations after component mounts
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Sample data for YouTube shorts
  // In a real application, this could come from an API or CMS
  const [shorts] = useState([
    {
      id: 'short1',
      title: 'Biotechnology in Scotland',
      thumbnail: 'https://img.youtube.com/vi/BE9wX33MisU/maxresdefault.jpg',
      videoId: 'BE9wX33MisU',
      url: 'https://www.youtube.com/shorts/BE9wX33MisU',
      duration: '0:53'
    },
    {
      id: 'short2',
      title: 'Maximize UK Master\'s',
      thumbnail: 'https://img.youtube.com/vi/Zm6POWAPrMo/maxresdefault.jpg',
      videoId: 'Zm6POWAPrMo',
      url: 'https://www.youtube.com/shorts/Zm6POWAPrMo',
      duration: '0:33'
    },
    {
      id: 'short3',
      title: 'SoP Golden Rules',
      thumbnail: 'https://img.youtube.com/vi/LxHsp8yPIm0/maxresdefault.jpg',
      videoId: 'LxHsp8yPIm0',
      url: 'https://www.youtube.com/shorts/LxHsp8yPIm0',
      duration: '1:04'
    },
    {
      id: 'short4',
      title: 'SoP Mistakes to Avoid',
      thumbnail: 'https://img.youtube.com/vi/zHKEr7xxAX8/maxresdefault.jpg',
      videoId: 'zHKEr7xxAX8',
      url: 'https://www.youtube.com/shorts/zHKEr7xxAX8',
      duration: '0:44'
    },
    {
      id: 'short5',
      title: 'UK vs US Degrees',
      thumbnail: 'https://img.youtube.com/vi/V_9rPCkSrVA/maxresdefault.jpg',
      videoId: 'V_9rPCkSrVA',
      url: 'https://www.youtube.com/shorts/V_9rPCkSrVA',
      duration: '0:48'
    },
    {
      id: 'short6',
      title: 'Beware of These Programs',
      thumbnail: 'https://img.youtube.com/vi/4gKcenRSB_w/maxresdefault.jpg',
      videoId: '4gKcenRSB_w',
      url: 'https://www.youtube.com/shorts/4gKcenRSB_w',
      duration: '1:07'
    },
    {
      id: 'short7',
      title: 'UCAS',
      thumbnail: 'https://img.youtube.com/vi/40HDXq5ywbw/maxresdefault.jpg',
      videoId: '40HDXq5ywbw',
      url: 'https://www.youtube.com/shorts/40HDXq5ywbw',
      duration: '0:53'
    }
  ]);

  // Sample data for long-form videos
  const [longVideos] = useState([
    {
      id: 'long1',
      title: 'UK: Premier Biomedical Science Hub',
      thumbnail: 'https://img.youtube.com/vi/l86lEJKms78/maxresdefault.jpg',
      videoId: 'l86lEJKms78',
      url: 'https://www.youtube.com/watch?v=l86lEJKms78',
      duration: '2:36'
    },
  ]);

  // YouTube channel URL - replace with actual channel URL
  const youtubeChannelUrl = "https://www.youtube.com/@MeenuAgarwal";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Main content section */}
      <section className={`w-full py-12 ${animate ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-16 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
              Video Library
            </h2>
            <div className="w-24 h-1 bg-[var(--coral-color)] mb-8"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center">
              Comprehensive video content about studying abroad, visa applications, and more. 
              From quick tips to detailed guides - everything you need for your educational journey.
            </p>
          </div>

          {/* Shorts Section */}
          <div className="mb-20">
            <div className="mb-8 flex flex-col items-center">
              <h3 className="text-2xl md:text-3xl font-bold text-center mb-4 text-[var(--dark-blue-color)]">
                Quick Tips & Shorts
              </h3>
              <div className="w-16 h-1 bg-purple-500 mb-4"></div>
              <p className="text-gray-600 text-center max-w-2xl">
                Bite-sized advice and quick insights to help you on your study abroad journey.
              </p>
            </div>

            <div className="relative w-full flex flex-wrap justify-center -mx-2 sm:-mx-3">
              {shorts.map((short, index) => {
                const verticalOffset = index % 2 === 0 ? 'translate-y-0' : 'translate-y-8';
                const horizontalOffset = Math.floor(Math.random() * 3) - 1;
                const horizontalClass =
                  horizontalOffset === -1
                    ? '-translate-x-2'
                    : horizontalOffset === 1
                    ? 'translate-x-2'
                    : '';

                return (
                  <div
                    key={short.id}
                    className={`p-3 sm:p-4 ${verticalOffset} ${horizontalClass} transition-all duration-500 transform hover:-translate-y-1 mb-10 sm:mb-8 w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col relative group">
                      <div className="relative pb-[177.78%] w-full">
                        <a
                          href={short.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0"
                        >
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center hover:bg-opacity-10 transition-all duration-300">
                            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                            {short.duration}
                          </div>
                          <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                            SHORT
                          </div>
                          <img
                            src={short.thumbnail}
                            alt={short.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/1080x1920/eee?text=Video+Thumbnail';
                            }}
                          />
                        </a>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-lg mb-2 text-[var(--dark-blue-color)]">
                          {short.title}
                        </h4>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                            Quick Tip
                          </span>
                          <span>{short.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Long Videos Section */}
          <div className="mb-16">
            <div className="mb-8 flex flex-col items-center">
              <h3 className="text-2xl md:text-3xl font-bold text-center mb-4 text-[var(--dark-blue-color)]">
                In-Depth Guides
              </h3>
              <div className="w-16 h-1 bg-blue-500 mb-4"></div>
              <p className="text-gray-600 text-center max-w-2xl">
                Comprehensive tutorials and detailed guides for your study abroad journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {longVideos.map((video, index) => (
                <div
                  key={video.id}
                  className="transition-all duration-500 transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col relative group">
                    <div className="relative pb-[56.25%] w-full">
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0"
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center hover:bg-opacity-10 transition-all duration-300">
                          <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          FULL VIDEO
                        </div>
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/1920x1080/eee?text=Video+Thumbnail';
                          }}
                        />
                      </a>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-lg mb-2 text-[var(--dark-blue-color)]">
                        {video.title}
                      </h4>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                          In-Depth Guide
                        </span>
                        <span>{video.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* View More button */}
          <div className="mt-16 text-center">
            <a 
              href={youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-[var(--coral-color)] hover:bg-[var(--coral-hover-color)] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--coral-color)] transition-all duration-300 transform"
            >
              View More on YouTube
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
      <ContactButton />
    </div>
  );
};

export default Videos;
