import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Lock,
    User as UserIcon,
    Mail,
    ArrowRight
} from 'lucide-react';

interface AuthUIProps {
    isSignup: boolean;
    username: string;
    password: string;
    email?: string;
    isOrganisation?: Boolean,
    setUsername: (username: string) => void;
    setPassword: (password: string) => void;
    setEmail?: (email: string) => void;
    setIsSignup: (isSignup: boolean) => void;
    onLogin: (e: React.FormEvent) => void;
    onSignup: (e: React.FormEvent) => void;
}

export const AuthUI: React.FC<AuthUIProps> = ({
    isSignup,
    username,
    password,
    email = '',
    setUsername,
    setPassword,
    setEmail,
    setIsSignup,
    onLogin,
    onSignup,
    isOrganisation
}) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white px-12 py-6 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-2 text-center">
                    {isOrganisation
                        ? (isSignup ? 'Create Organization' : 'Welcome Organization')
                        : (isSignup ? 'Create Account' : 'Welcome Back')}
                </h2>
                <p className="text-center text-gray-600 mb-8">
                    {isSignup
                        ? isOrganisation
                            ? 'Sign up your organization to start managing tasks'
                            : 'Sign up to start your journey'
                        : 'Log in to continue!'}

                    {!isOrganisation ? (
                        <span className='font-medium cursor-pointer hover:underline text-black'
                            onClick={() => navigate('/auth?mode=login&role=organisation')}
                        >{" "}Are you an Organisation?</span>
                    ) : <span className='font-medium cursor-pointer hover:underline text-black'
                        onClick={() => navigate('/auth?mode=login')}
                    >{" "}Are you an User?</span>}

                </p>

                <form onSubmit={isSignup ? onSignup : onLogin} className="space-y-6">
                    <div className="relative">
                        <label htmlFor="email" className="sr-only">
                            Email
                        </label>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail size={20} className="text-gray-400" />
                        </div>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail && setEmail(e.target.value)}
                            className="w-full px-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            required={isSignup}
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="username" className="sr-only">
                            {isOrganisation ? 'Username/ Organization Name' : 'Username/ Organization Name'}
                        </label>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon size={20} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="username"
                            placeholder={isOrganisation ? 'Username/ Organization Name' : 'Username/ Organization Name'}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={20} className="text-gray-400" />
                        </div>
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            required
                            minLength={6}
                        />
                    </div>

                    {isOrganisation && isSignup && (
                        <div className="relative">
                            <label htmlFor="location" className="sr-only">
                                Location
                            </label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon size={20} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="location"
                                placeholder="Organization Location (Optional)"
                                className="w-full px-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition duration-300 flex items-center justify-center"
                    >
                        {isSignup
                            ? isOrganisation
                                ? 'Sign Up Organization'
                                : 'Sign Up'
                            : 'Log In'}
                        <ArrowRight size={20} className="ml-2" />
                    </button>
                </form>

                <div className="text-center mt-6">
                    {isSignup ? (
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <button
                                className="text-black hover:underline"
                                onClick={() => setIsSignup(false)}
                            >
                                Log in
                            </button>
                        </p>
                    ) : (
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <button
                                className="text-black hover:underline"
                                onClick={() => setIsSignup(true)}
                            >
                                Sign up
                            </button>
                        </p>
                    )}
                </div>

                {/* <div className="text-center mt-1">
                    {isSignup && isOrganisation ? (
                        null
                    ) : (
                        <p className="text-black text-sm hover:underline cursor-pointer"
                            onClick={() => {
                                setIsSignup(false);
                                navigate('/auth?mode=signup')
                            }}
                        >
                            Create Organisation Account! {' '}
                        </p>
                    )}
                </div> */}
            </div>
        </div>
    );
};
