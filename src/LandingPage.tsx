import React, {useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Clock } from "lucide-react";
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
  name: string;
  href: string;
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const [features, setFeatures] = useState<Feature[]>([]);
  const [quickLinks, setQuickLinks] = useState<QuickLinkSection[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  set

  const icons: LucideIcon[] = [
    CheckCircle,
    Layers,
    Calendar,
    Lock,
    MessageCircle,
    Share2,
  ];

  const navigateToLogin = () => handleNavigate("/auth?mode=login");
  const navigateToSignupOrganization = () =>
    handleNavigate("/auth?mode=signup&role=organisation");
  const navigateToDemo = () => handleNavigate("/demo");
  const navigateToSignupUser = () => handleNavigate("/auth/?mode=signup");

  const handleNavigate = (path: string): void => {
    if (!path || path.length < 1) return;
    navigate(path);
  };

  const currentYear = new Date().getFullYear();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          {/* Main header content */}
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="bg-black py-1 px-2 font-bold text-white rounded-2xl">Syn</span>
              <span className="text-2xl font-bold text-black">SYNAPSE.</span>
            </div>

            {/* Desktop Navigation */}
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

            {/* Mobile menu button */}
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

          {/* Mobile Navigation */}
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

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-10 py-8 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center md:text-left space-y-6 order-2 md:order-1">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Streamline Team Tasks, Boost Productivity
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto md:mx-0">
                Synapse helps organizations manage tasks, collaborate effectively,
                and track progress with intuitive, powerful tools.
              </p>

              {/* CTA Buttons */}
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

              <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 justify-center md:justify-start pt-6 text-gray-600">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <Users className="text-gray-800" size={20} />
                  <span>100+ Teams</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <Clock className="text-gray-800" size={20} />
                  <span>Saves 10+ Hours Weekly</span>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="bg-gray-950 rounded-2xl p-2 md:p-4 lg:p-4 shadow-2xl">
                <img
                  src="/image.png"
                  alt="Taskify Dashboard"
                  className="rounded-lg shadow-xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Solution Overview */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="https://res.cloudinary.com/dml6gxfmn/image/upload/v1735850133/my-profit-tutor-ZfRWq1bRisE-unsplash_gmmrye.jpg"
                className="w-full h-full object-cover"
                alt="Taskify Solution"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                <div className="absolute bottom-0 p-6 sm:p-8 text-white">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">
                    Intuitive Interface
                  </h3>
                  <p>Designed for clarity and efficiency</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                Meet Synapse: Your Team's Command Center
              </h2>
              <p className="text-xl text-gray-600">
                Transform chaos into clarity with our intelligent task
                management platform. Built for modern teams who value efficiency
                and collaboration.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-black rounded-lg p-2 text-white">
                      {React.createElement(icons[index], { size: 24 })}
                    </div>
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">
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

      {/* Feature Showcase */}
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

          <div className="space-y-20 sm:space-y-32">
            {/* Feature 1 */}
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="order-2 lg:order-1 space-y-6">
                <h3 className="text-2xl sm:text-3xl font-bold">
                  Smart Task Organization
                </h3>
                <p className="text-base sm:text-lg text-gray-600">
                  Automatically categorize and prioritize tasks based on your
                  team's needs.
                </p>
                <ul className="space-y-4">
                  {features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-600">{feature.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 lg:order-2">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://res.cloudinary.com/dml6gxfmn/image/upload/v1735850134/behnam-norouzi-GAgEfSQMPa4-unsplash_uqwnej.jpg"
                    className="w-full h-full object-cover"
                    alt="Task Organization"
                  />
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://res.cloudinary.com/dml6gxfmn/image/upload/v1735849601/authImage_seuq1p.jpg"
                    className="w-full h-full object-cover"
                    alt="Collaboration"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                  Real-time Collaboration
                </h3>
                <p className="text-base sm:text-lg text-gray-600 mb-6">
                  Work together seamlessly, no matter where your team is
                  located.
                </p>
                <ul className="space-y-4">
                  {features.slice(3, 6).map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-600">{feature.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>



      <section className="relative py-16 sm:py-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/dml6gxfmn/image/upload/v1735850133/georgie-cobbs-muOHbrFGEQY-unsplash_srkxsc.jpg"
            className="w-full h-full object-cover opacity-20"
            alt="Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
              Ready to Transform Your Team?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
              Join thousands of teams already using Synapse to boost their
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
