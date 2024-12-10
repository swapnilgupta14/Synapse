import React from 'react';
import { Key, Shield, Calendar, Mail, Edit3, X, ExternalLink, User2 } from 'lucide-react';
import { User } from "../../types"

interface ProfileModalProps {
    profile: boolean;
    user: User | null;
    openProfile: (isOpen: boolean) => void;
}

interface InfoCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | undefined | number;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value }): JSX.Element => (
    <div className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
        <div className="flex items-center gap-2 mb-1">
            <span className="text-gray-400">{icon}</span>
            <span className="text-sm text-gray-500">{label}</span>
        </div>
        <div className="text-gray-900 font-medium truncate">{value}</div>
    </div>
);

const ProfilePopup: React.FC<ProfileModalProps> = ({ profile, user, openProfile }): JSX.Element | null => {
    if (!profile) return null;

    const handleEditProfile = (): void => {
        console.log('Edit profile clicked');
    };

    const handleRegenerateToken = (): void => {
        console.log('Regenerate token clicked');
    };

    const handleViewActivity = (): void => {
        console.log('View activity clicked');
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg border border-gray-200 shadow-xl relative">
                <div className="p-8">
                    <button
                        onClick={() => openProfile(false)}
                        className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        type="button"
                        aria-label="Close profile"
                    >
                        <X size={20} className="text-black" />
                    </button>

                    <div className="space-y-8">
                        <div className="flex items-start gap-6">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 relative group">
                                <User2 className='w-full h-full p-4'/>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                                    <ExternalLink size={20} className="text-white" />
                                </div>
                            </div>

                            <div className="flex-1">
                                <h2 className="text-2xl font-semibold text-gray-900">{user?.username}</h2>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                                    Active {user?.role}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoCard icon={<Key size={18} />} label="User ID" value={user?.id ? user?.id : "N/a"} />
                            <InfoCard icon={<Shield size={18} />} label="Role" value={user?.role} />
                            <InfoCard
                                icon={<Calendar size={18} />}
                                label="Joined"
                                value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : undefined}
                            />
                            <InfoCard icon={<Mail size={18} />} label="Email" value={user?.email} />
                        </div>

                        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600">Shareable Profile Link</span>
                                <button
                                    onClick={handleRegenerateToken}
                                    className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                                    type="button"
                                >
                                    Regenerate Public Link
                                </button>
                            </div>
                            <code className="text-sm font-mono bg-white p-2 rounded border border-gray-200 block overflow-x-auto">
                                {user?.token}
                            </code>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleEditProfile}
                                className="flex-1 bg-black text-white px-4 py-3 rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                                type="button"
                            >
                                <Edit3 size={18} />
                                Edit Profile
                            </button>
                            <button
                                onClick={handleViewActivity}
                                className="px-4 py-3 border border-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                type="button"
                            >
                                View Activity
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePopup;