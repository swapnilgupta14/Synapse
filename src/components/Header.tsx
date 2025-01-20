import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  darkMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({ darkMode = false }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigateToLogin = () => navigate("/auth?mode=login");
  const navigateToSignupOrganization = () => navigate("/auth?mode=signup&role=organisation");

  const textColor = darkMode ? "text-white" : "text-black";
  const borderColor = darkMode ? "border-white" : "border-black";
  const hoverBg = darkMode ? "hover:bg-white/10" : "hover:bg-blue-50";

  return (
    <header className={`sticky top-0 z-50 ${darkMode ? 'bg-black' : 'bg-white'} shadow-sm`}>
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/")}>
            <span className={`${darkMode ? 'bg-white text-black' : 'bg-black text-white'} py-1 px-2 font-bold rounded-2xl`}>
              SYN
            </span>
            <span className={`text-2xl font-bold ${textColor}`}>SYNAPSE.</span>
          </div>

          <div className="hidden sm:flex items-center space-x-6">
            <nav className="flex space-x-8 mr-8">
              <a href="#features" className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} hover:${textColor} transition-colors`}>Features</a>
              <a href="#solutions" className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} hover:${textColor} transition-colors`}>Solutions</a>
              <a href="#pricing" className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} hover:${textColor} transition-colors`}>Pricing</a>
            </nav>
            <div className="flex space-x-4">
              <button
                onClick={navigateToLogin}
                className={`px-5 py-1.5 ${textColor} border-2 ${borderColor} rounded-lg ${hoverBg} transition font-medium`}
              >
                Log In
              </button>
              <button
                onClick={navigateToSignupOrganization}
                className={`px-5 py-1.5 ${darkMode ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-800'} rounded-lg transition font-medium`}
              >
                Join as an Organization
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`sm:hidden p-2 rounded-lg ${hoverBg}`}
          >
            {isMobileMenuOpen ? (
              <X className={`h-6 w-6 ${textColor}`} />
            ) : (
              <Menu className={`h-6 w-6 ${textColor}`} />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="sm:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100">
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
  );
};

export default Header; 