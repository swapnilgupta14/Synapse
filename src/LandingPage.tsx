import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock } from 'lucide-react';
import {
  CheckCircle,
  Layers,
  Calendar,
  Lock,
  MessageCircle,
  Share2,
  ArrowRight,
  LucideIcon
} from 'lucide-react';

// Define interfaces for data structures
interface Feature {
  title: string;
  description: string;
}

interface QuickLinkSection {
  title: string;
  links: string[];
}

interface SocialLink {
  href: string;
  icon: LucideIcon;
}

// interface FetchFunctions {
//   fetchFeatures: () => Promise<Feature[]>;
//   fetchQuickLinks: () => Promise<QuickLinkSection[]>;
//   fetchSocialLinks: () => Promise<SocialLink[]>;
// }

import { 
  fetchFeatures, 
  fetchQuickLinks, 
  fetchSocialLinks 
} from './api/fetch';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div
      className="bg-white border-gray-100 border-2 rounded-2xl p-6 space-y-4 
        hover:shadow-2xl shadow-md transition-all duration-300 group relative overflow-hidden
         hover:border-gray-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Rest of the component remains the same as in the original code */}
      <div className="relative z-10">
        <div className={`bg-gray-100 w-16 h-16 rounded-full flex items-center 
          justify-center group-hover:bg-black group-hover:text-white 
          transition-colors duration-300 relative
          `}>
          <Icon className="text-black group-hover:text-white" size={28} />
        </div>
      </div>

      <div className="relative z-10 space-y-3">
        <h3 className="text-xl font-semibold text-gray-900 transition-colors group-hover:text-black">
          {title}
        </h3>
        <div className="absolute top-5 left-0 w-full h-[0.1rem] bg-black 
      origin-left scale-x-0 group-hover:scale-x-100 
      transition-transform duration-300"></div>
        <p className="text-gray-600 mb-4">{description}</p>

        <div
          className={`flex items-center text-sm font-medium text-gray-500 
            group-hover:text-black transition-all duration-300 cursor-pointer
            ${isHovered ? 'translate-x-2' : ''}`}
        >
          <span>Learn More</span>
          <ArrowRight
            size={16}
            className="ml-2 group-hover:translate-x-1 transition-transform"
          />
        </div>
      </div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const [features, setFeatures] = useState<Feature[]>([]);
  const [quickLinks, setQuickLinks] = useState<QuickLinkSection[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  const icons: LucideIcon[] = [
    CheckCircle,
    Layers,
    Calendar,
    Lock,
    MessageCircle,
    Share2,
  ];

  const navigateToLogin = () => handleNavigate('/auth?mode=login');
  const navigateToSignupOrganization = () => handleNavigate('/auth?mode=signup&role=organisation');
  const navigateToDemo = () => handleNavigate('/demo');
  const navigateToSignupUser = () => handleNavigate('/auth/?mode=signup');

  const handleNavigate = (path: string): void => {
    if (!path || path.length < 1) return;
    navigate(path);
  };

  const currentYear = new Date().getFullYear();

  const loadData = async (): Promise<void> => {
    try {
      const [featuresData, quickLinksData, socialLinksData] = await Promise.all([
        fetchFeatures(),
        fetchQuickLinks(),
        fetchSocialLinks(),
      ]);
      
      setFeatures(featuresData);
      setQuickLinks(quickLinksData);
      setSocialLinks(socialLinksData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 justify-center">
            <span className="bg-black py-1 px-2 font-bold text-white rounded-2xl">Tfy</span>
            <span className="text-2xl font-bold text-black">TASKIFY.</span>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={navigateToLogin}
              className="px-4 py-2 text-black border border-black rounded-lg hover:bg-blue-50 transition"
            >
              Log In
            </button>
            <button
              onClick={navigateToSignupOrganization}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700 transition"
            >
              Join as an Organization
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-10 md:py-24 grid md:grid-cols-2 gap-12 items-center overflow-x-clip overflow-y-clip">
        <div className="space-y-6 p-10 h-[100%]">
          <h1 className="text-6xl font-bold text-gray-900 leading-tight">
            Streamline Team Tasks, Boost Productivity
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Taskify helps organizations manage tasks, collaborate effectively, and track progress with intuitive, powerful tools.
          </p>

          <div className="flex space-x-4 pt-4">
            <button
              onClick={navigateToDemo}
              className="text-gray-700 border border-gray-900 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Request Demo
            </button>
            <button
              onClick={navigateToSignupUser}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
            >
              Get Started as User
            </button>
          </div>

          <div className="flex space-x-6 pt-6 text-gray-600">
            <div className="flex items-center space-x-2">
              <Users className="text-gray-800" size={20} />
              <span>100+ Teams</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="text-gray-800" size={20} />
              <span>Saves 10+ Hours Weekly</span>
            </div>
          </div>
        </div>

        <div className="hidden md:block w-[70vw]">
          <div className="bg-gray-950 rounded-2xl p-4 shadow-2xl h-fit">
            <img
              src="/image.png"
              alt="Taskify Dashboard"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </main>


      <section className="bg-white p-20 relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 
            animate-[wiggle_10s_infinite] opacity-50"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 ">
              Designed for Productive Teams
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Taskify provides a comprehensive suite of tools to streamline task management,
              enhance collaboration, and boost organizational productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={icons[index]}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-black text-white py-16 flex w-full">
        <div className="container mx-auto px-6">

          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <span className="bg-white py-1 px-2 font-bold text-black rounded-2xl">Tfy</span>
                <span className="text-2xl font-bold">TASKIFY.</span>
              </div>
              <p className="text-gray-400">
                Streamline your team's productivity with our comprehensive task management solution.
              </p>
            </div>

            {quickLinks.map((section, index) => (
              <div key={index}>
                <h4 className="text-lg font-semibold mb-4 text-white">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>


          <div className='flex justify-between items-end w-full pt-16 mt-10 border-t border-gray-500'>


            <div >
              <h4 className="text-lg font-semibold mb-4 text-white">
                Stay Updated
              </h4>
              <p className="text-gray-400 mb-4">
                Subscribe to our newsletter for product updates and productivity tips.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-l-lg bg-gray-800 text-white 
    focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  className="bg-white text-black px-4 py-2 rounded-r-lg 
    hover:bg-gray-200 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>

            <div className="flex flex-col space-y-4  ">
              <div className='flex space-x-4 mb-4 md:mb-0 justify-end'>

                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
              <div className="text-gray-400">
                © {currentYear} Taskify. All rights reserved.
              </div>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
