import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User as UserIcon, Mail, Building2, Shield } from 'lucide-react';
import Header from '../../components/Header';

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

interface DemoAccount {
    title: string;
    username: string;
    password: string;
    description: string;
    type: 'user' | 'org' | 'admin';
    icon: React.ReactNode;
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

    const demoAccounts: DemoAccount[] = [
        {
            title: "User Demo",
            username: "swapnil",
            password: "swapnil",
            description: "Experience user features",
            type: 'user',
            icon: <UserIcon size={24} />
        },
        {
            title: "Organisation Demo",
            username: "synapse",
            password: "synapse",
            description: "Try organisation features",
            type: 'org',
            icon: <Building2 size={24} />
        },
        {
            title: "Admin Demo",
            username: "admin",
            password: "admin123",
            description: "Access admin controls",
            type: 'admin',
            icon: <Shield size={24} />
        }
    ];

    const handleDemoLogin = (username: string, password: string, type: string) => {
        if (type === 'org' && !isOrganisation) {
            navigate('/auth?mode=login&role=organisation');
        }
        if ((type === 'user' || type === 'admin') && isOrganisation) {
            navigate('/auth?mode=login');
        }

        setFormData({
            ...formData,
            username: username,
            password: password
        });

        if (isSignup) {
            setIsSignup(false);
        }

        setTimeout(() => {
            const formElement = document.querySelector('form');
            if (formElement) {
                const submitEvent = new Event('submit', { cancelable: true });
                formElement.dispatchEvent(submitEvent);
            }
        }, 100);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header darkMode={false} />

            <div className="flex-1 flex flex-col md:flex-row">
                <div className="md:w-1/2 relative min-h-[500px] md:min-h-0 order-2 md:order-1">
                    <div
                        className="absolute inset-0 bg-gray-200"
                        style={{ aspectRatio: '16/9' }}
                    />
                    <img
                        src="/authImage.webp"
                        alt="Authentication"
                        className="absolute inset-0 w-full h-full object-cover "
                        loading="eager"
                        width={800}
                        height={600}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />

                    {/* +                    <div className="absolute inset-0 flex flex-col justify-start pt-12 px-6 text-white text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-3">Welcome Back</h1>
                        <p className="text-base md:text-lg text-white/80 max-w-md mx-auto mb-8">
                            Sign in to access your account and manage your resources
                        </p>
                    </div> */}

                    {!isSignup && (
                        <div className="absolute inset-0 flex items-center justify-center pt-0 md:pt-20 px-4">
                            <div className="w-full max-w-md space-y-4">
                                <h3 className="text-white text-xl font-semibold text-center mb-6">
                                    Quick Demo Access
                                </h3>
                                <div className="grid gap-3">
                                    {demoAccounts.map((account, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleDemoLogin(account.username, account.password, account.type)}
                                            className="flex items-center justify-between w-full px-5 py-3.5 bg-white/90 hover:bg-white rounded-xl transition-all duration-200 group border border-white/20"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="text-gray-800">
                                                    {account.icon}
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-medium text-gray-900">{account.title}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {account.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-gray-400 group-hover:text-gray-600">→</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1 flex items-start md:items-center justify-center p-4 pt-20 md:p-8 order-1 md:order-2 bg-white md:bg-gray-50">
                    <div className="w-full max-w-md">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="px-6 md:px-8 pt-8 pb-6 relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black via-gray-700 to-gray-900" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {isSignup ? 'Create Account' : 'Sign In'}
                                </h2>
                                <p className="text-gray-600">
                                    {isOrganisation ? 'Organisation Account' : 'User Account'}
                                </p>
                            </div>

                            <div className="px-6 md:px-8 pb-8">
                                <form onSubmit={onSubmit} className="space-y-4">
                                    {isSignup && (
                                        <div className="relative group h-12">
                                            <Mail className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Email"
                                                className="w-full h-full pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:bg-white focus:outline-none transition-all duration-200"
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="relative group h-12">
                                        <UserIcon className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            placeholder="Username"
                                            className="w-full h-full pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:bg-white focus:outline-none transition-all duration-200"
                                            required
                                        />
                                    </div>

                                    <div className="relative group h-12">
                                        <Lock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Password"
                                            className="w-full h-full pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:bg-white focus:outline-none transition-all duration-200"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full h-12 bg-black text-white rounded-xl hover:bg-gray-800 transform active:scale-[0.98] transition-all duration-200 font-medium"
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

                                    <div className="space-y-3">
                                        <button
                                            onClick={() => setIsSignup(!isSignup)}
                                            className="w-full py-2 text-gray-600 hover:text-black transition-colors text-sm"
                                        >
                                            {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                                        </button>

                                        <button
                                            onClick={() => navigate(isOrganisation
                                                ? '/auth?mode=' + (isSignup ? 'signup' : 'login')
                                                : '/auth?mode=' + (isSignup ? 'signup' : 'login') + '&role=organisation'
                                            )}
                                            className="w-full py-2 text-gray-600 hover:text-black transition-colors text-sm"
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
        </div>
    );
};

export default AuthUI;