import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Clock, TimerIcon } from "lucide-react";
import {
  CheckCircle,
  Layers,
  Calendar,
  Lock,
  MessageCircle,
  Share2,
  LucideIcon,
  Twitter,
  Linkedin,
  Github,
  Menu,
  X,
} from "lucide-react";
import { fetchFeatures, fetchQuickLinks, fetchSocialLinks } from "./api/fetch";
// import { Organisation } from './types/index';
import FeatureCarousel from "./components/ui/FeatureCarousel";

interface Feature {
  title: string;
  description: string;
}

interface QuickLinkSection {
  title: string;
  links: string[];
}

interface SocialLink {
  name: string;
  href: string;
}

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

  const navigateToLogin = () => handleNavigate("/auth?mode=login");
  const navigateToSignupOrganization = () => handleNavigate("/auth?mode=signup&role=organisation");
  const navigateToDemo = () => handleNavigate("/demo");
  const navigateToSignupUser = () => handleNavigate("/auth/?mode=signup");

  const handleNavigate = (path: string): void => {
    if (!path || path.length < 1) return;
    navigate(path);
  };

  const currentYear = new Date().getFullYear();

  const loadData = async (): Promise<void> => {
    try {
      const [featuresData, quickLinksData, socialLinksData] = await Promise.all(
        [fetchFeatures(), fetchQuickLinks(), fetchSocialLinks()]
      );

      setFeatures(featuresData);
      setQuickLinks(quickLinksData);
      setSocialLinks(socialLinksData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="bg-black py-1 px-2 font-bold text-white rounded-2xl">Syn</span>
              <span className="text-2xl font-bold text-black">SYNAPSE.</span>
            </div>

            <div className="hidden sm:flex items-center space-x-6">
              <nav className="flex space-x-8 mr-8">
                <a href="#features" className="text-gray-600 hover:text-black transition-colors">Features</a>
                <a href="#solutions" className="text-gray-600 hover:text-black transition-colors">Solutions</a>
                <a href="#pricing" className="text-gray-600 hover:text-black transition-colors">Pricing</a>
              </nav>
              <div className="flex space-x-4">
                <button
                  onClick={navigateToLogin}
                  className="px-6 py-2.5 text-black border-2 border-black rounded-lg hover:bg-blue-50 transition font-medium"
                >
                  Log In
                </button>
                <button
                  onClick={navigateToSignupOrganization}
                  className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
                >
                  Join as an Organization
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="sm:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 z-50">
              <div className="container mx-auto px-4">
                <div className="flex flex-col space-y-4 py-6">
                  <button
                    onClick={navigateToLogin}
                    className="w-full px-6 py-4 text-center text-black border border-black rounded-lg hover:bg-blue-50 transition"
                  >
                    Log In
                  </button>
                  <button
                    onClick={navigateToSignupOrganization}
                    className="w-full px-6 py-4 text-center bg-black text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    Join as an Organization
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 min-h-[90vh] flex items-center">
        <div className="container mx-auto px-4 sm:px-10 py-8 md:py-20 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center md:items-start ">
            <div className="text-center md:text-left space-y-6 order-2 md:order-1 md:mt-5">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Streamline Team Tasks, Boost Productivity
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto md:mx-0">
                Synapse helps organizations manage tasks, collaborate effectively,
                and track progress with intuitive, powerful tools.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                <button
                  onClick={navigateToDemo}
                  className="w-full sm:w-auto text-gray-700 border border-gray-900 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Request Demo
                </button>
                <button
                  onClick={navigateToSignupUser}
                  className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
                >
                  Get Started as User
                </button>
              </div>

              <div className="flex flex-row gap-2 sm:gap-6 justify-center md:justify-start pt-6 text-gray-600">
                <div className="flex flex-col items-center md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2">
                  <Users className="text-gray-800" size={20} />
                  <span className="text-center md:text-left">100+ Clients</span>
                </div>
                <div className="flex flex-col items-center md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2">
                  <TimerIcon className="text-gray-800" size={20} />
                  <span className="text-center md:text-left">25% Increase in Efficiency</span>
                </div>
                <div className="flex flex-col items-center md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2">
                  <Clock className="text-gray-800" size={20} />
                  <span className="text-center md:text-left">Saves 10+ Hours Weekly</span>
                </div>
              </div>

            </div>

            <div className="order-1 md:order-2">
              <div className="bg-gray-950 rounded-2xl p-2 md:p-3 lg:p-3 shadow-2xl md:w-[65vw]">
                <img
                  src="/image.png"
                  alt="Taskify Dashboard"
                  className="rounded-lg shadow-xl w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="py-16 sm:py-20 px-5">
        <div className="container mx-auto max-w-full lg:max-w-full">
          <div className="flex flex-col gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden w-full lg:w-[85%] h-[50vh]">
              <img
                src="https://res.cloudinary.com/dml6gxfmn/image/upload/v1735850133/my-profit-tutor-ZfRWq1bRisE-unsplash_gmmrye.jpg"
                className="w-full h-full object-cover"
                alt="Taskify Solution"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                <div className="absolute bottom-0 p-6 sm:p-8 text-white">
                  <h3 className="text-xl sm:text-2xl font-bold">
                    Migrate from Pen and Paper to Intuitive Interface
                  </h3>
                  <p>Designed for clarity and efficiency</p>
                </div>
              </div>
            </div>
            <div className="space-y-10 w-full lg:w-[85%]">
              <h2 className="text-4xl font-bold text-gray-900">
                Meet Synapse: Your Organisation's Command Center

                <p className="text-xl text-gray-600 mt-3 font-normal">
                  Transform chaos into clarity with our intelligent task
                  management platform. Built for modern teams who value efficiency
                  and collaboration.
                </p>
              </h2>

              <div className="grid sm:grid-cols-2 gap-10">
                {features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 rounded-xl bg-gray-100 hover:bg-zinc-100 transition-colors">
                    <div className="bg-black rounded-full p-3 text-white">
                      {React.createElement(icons[index], { size: 24 })}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                      <p className="text-gray-600 text-md leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 sm:py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How Synapse Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Experience seamless task management at every step
            </p>
          </div>

          <div>
            <FeatureCarousel />
          </div>
        </div>
      </section>



      <section className="relative py-16 sm:py-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
              Ready to Transform Your Organisation?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
              Join hundereds of Organisation already using Synapse to boost their
              productivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={navigateToDemo}
                className="px-8 py-4 bg-white text-black border-2 border-black rounded-lg 
                  hover:bg-gray-50 transition-colors"
              >
                Watch Demo
              </button>
              <button
                onClick={navigateToSignupUser}
                className="px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 
                  transition-colors shadow-lg"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid gap-8 sm:gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <span className="bg-white py-1 px-2 font-bold text-black rounded-2xl">
                  Syn
                </span>
                <span className="text-2xl font-bold">SYNAPSE.</span>
              </div>
              <p className="text-gray-400">
                Streamline your team's productivity with our comprehensive task
                management solution.
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

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full pt-12 sm:pt-16 mt-8 sm:mt-10 border-t border-gray-500 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">
                Stay Updated
              </h4>
              <p className="text-gray-400 mb-4">
                Subscribe to our newsletter for product updates and productivity
                tips.
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
              <div className="flex space-x-4 mb-4 md:mb-0 justify-end">
                {socialLinks.map((social, index) => {
                  let Icon;
                  switch (social.name) {
                    case "Twitter":
                      Icon = Twitter;
                      break;
                    case "LinkedIn":
                      Icon = Linkedin;
                      break;
                    case "GitHub":
                      Icon = Github;
                      break;
                    default:
                      Icon = Share2;
                  }

                  return (
                    <a
                      key={index}
                      href={social.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
              <div className="text-gray-400">
                © {currentYear} Synapse. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
