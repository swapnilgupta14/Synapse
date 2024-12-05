import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const navigateToLogin = () => handleNavigate('/auth?mode=login');
  const navigateToSignupOrganization = () => handleNavigate('/auth?mode=signup&role=organisation');
  const navigateToDemo = () => handleNavigate('/demo');
  const navigateToSignupUser = () => handleNavigate('/auth/?mode=signup');

  const handleNavigate = (path: string): void => {
    if (!path || path.length < 1) return;
    navigate(path);
  };

  return (
    <div className="bg-white h-screen flex flex-col overflow-clip">
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
    </div>
  );
};

export default LandingPage;
