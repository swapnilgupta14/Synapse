import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User as UserIcon, Mail } from 'lucide-react';
import Header from '../components/Header';

interface AuthUIProps {
    isSignup: boolean;
    formData: {
        username: string;
        password: string;
        email: string;
    };
    setFormData: (data: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    isOrganisation: boolean;
    setIsSignup: (value: boolean) => void;
}

export const AuthUI: React.FC<AuthUIProps> = ({
    isSignup,
    formData,
    setFormData,
    onSubmit,
    isOrganisation,
    setIsSignup
}) => {
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header darkMode={false} />

            <div className="flex-1 flex flex-col md:flex-row">
                {/* Left Panel - Image Background */}
                <div className="hidden md:block md:w-1/2 relative overflow-hidden">
                    <img
                        src="/authImage.webp"
                        alt="Authentication"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="text-white space-y-6 max-w-lg text-center">
                            <h1 className="text-5xl font-bold leading-tight">
                                {isSignup ? 'Start Your Journey' : 'Welcome Back'}
                            </h1>
                            <p className="text-gray-200 text-lg">
                                {isSignup
                                    ? 'Join our platform and experience seamless task management.'
                                    : 'Continue your productivity journey with us.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Form Section */}
                <div className="flex-1 flex items-center justify-center p-4 md:p-8">
                    <div className="w-full max-w-md">
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                            <div className="px-8 pt-8 pb-6 relative">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-black via-gray-700 to-gray-900" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {isSignup ? 'Create Account' : 'Sign In'}
                                </h2>
                                <p className="text-gray-600">
                                    {isOrganisation ? 'Organisation Account' : 'User Account'}
                                </p>
                            </div>

                            <div className="px-8 pb-8">
                                <form onSubmit={onSubmit} className="space-y-5">
                                    {/* Form inputs with enhanced styling */}
                                    {isSignup && (
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Email"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl focus:border-black focus:bg-white focus:outline-none transition-all duration-300"
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="relative group">
                                        <UserIcon className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            placeholder="Username"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl focus:border-black focus:bg-white focus:outline-none transition-all duration-300"
                                            required
                                        />
                                    </div>

                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Password"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl focus:border-black focus:bg-white focus:outline-none transition-all duration-300"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-black text-white py-3.5 rounded-xl hover:bg-gray-800 transform hover:scale-[0.99] transition-all duration-200 font-medium"
                                    >
                                        {isSignup ? 'Create Account' : 'Sign In'}
                                    </button>
                                </form>

                                <div className="mt-6 space-y-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-200"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white text-gray-500">or</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setIsSignup(!isSignup)}
                                        className="w-full text-gray-600 hover:text-black transition-colors text-sm"
                                    >
                                        {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                                    </button>

                                    <button
                                        onClick={() => navigate(isOrganisation
                                            ? '/auth?mode=' + (isSignup ? 'signup' : 'login')
                                            : '/auth?mode=' + (isSignup ? 'signup' : 'login') + '&role=organisation'
                                        )}
                                        className="w-full text-gray-600 hover:text-black transition-colors text-sm"
                                    >
                                        {isOrganisation ? 'Switch to User Account' : 'Switch to Organisation Account'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
