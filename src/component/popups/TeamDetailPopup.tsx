import React, { useState } from "react";
import {
    X, Users, Briefcase, UserCircle2, Calendar, InfoIcon,
    ShieldCheck, MailIcon, UserIcon,
    BarChart2, ClockIcon, TagIcon
} from "lucide-react";
import { Team, User } from "../../types";
import { useAppSelector } from "../../redux/store";

interface TeamDetailsModalProps {
    team: Team;
    users: User[];
    onClose: () => void;
}

const TeamDetailsPopup: React.FC<TeamDetailsModalProps> = ({
    team,
    users,
    onClose
}) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'details'>('overview');
    const projects = useAppSelector(state => state.projects.projects);

    const teamManager = users.find(user => user.id === team.teamManagerId);
    const associatedProject = projects.find(project => project.projectId === team.projectId);
    const teamMembers = team.members.map((item) =>
        users.find((user) => user.id === item.id)
    );

    const tabs = [
        {
            id: 'overview',
            label: 'Overview',
            icon: <BarChart2 size={20} className="text-zinc-600" />
        },
        {
            id: 'members',
            label: 'Team Members',
            icon: <Users size={20} className="text-zinc-600" />
        },
        {
            id: 'details',
            label: 'Additional Details',
            icon: <InfoIcon size={20} className="text-zinc-600" />
        }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-[60%] h-[80%] flex flex-col border border-zinc-200 overflow-hidden">
                <div className="bg-zinc-100 p-5 border-b border-zinc-200 flex justify-between items-center">
                    <div className="flex items-center">
                        <Briefcase className="mr-4 text-zinc-600" size={32} />
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-900 truncate max-w-[500px]">
                                {team.name}
                            </h2>
                            <p className="text-sm text-zinc-500">
                                Team Details and Information
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex border-b border-zinc-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`
                                flex items-center px-6 py-4 border-b-2 
                                ${activeTab === tab.id
                                    ? 'bg-white text-black border-b-2 border-black'
                                    : 'text-zinc-800 hover:bg-zinc-100'}
                            `}
                        >
                            {tab.icon}
                            <span className="ml-2 font-medium">{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="p-10 overflow-y-auto">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <ShieldCheck className="mr-2 text-zinc-700" size={24} />
                                    Team Information
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-zinc-600">Team Name</p>
                                        <p className="font-medium text-zinc-900">{team.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-600">Created On</p>
                                        <p className="font-medium flex items-center text-zinc-900">
                                            <Calendar size={16} className="mr-2 text-zinc-500" />
                                            {new Date(team.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-600">Team Description</p>
                                        <p className="font-medium text-zinc-900">
                                            {team.description || 'No description provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <Briefcase className="mr-2 text-zinc-700" size={24} />
                                    Project Details
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-zinc-600">Project Name</p>
                                        <p className="font-medium text-zinc-900">{associatedProject?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-600">Project Status</p>
                                        <p className="font-medium text-zinc-900">
                                            {associatedProject?.status || 'Unknown'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-600">Project Timeline</p>
                                        <p className="font-medium flex items-center text-zinc-900">
                                            <ClockIcon size={16} className="mr-2 text-zinc-500" />
                                            {associatedProject?.startDate
                                                ? `${new Date(associatedProject.startDate).toLocaleDateString()} - ${associatedProject.endDate ? new Date(associatedProject.endDate).toLocaleDateString() : 'Ongoing'}`
                                                : 'Not specified'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'members' && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <Users className="mr-2 text-zinc-700" size={24} />
                                Team Members ({teamMembers.length})
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {teamMembers.map((member, index) => (
                                    <div
                                        key={index}
                                        className="bg-zinc-100 p-4 rounded-2xl flex items-center space-x-3 hover:bg-zinc-200 transition-colors"
                                    >
                                        <UserCircle2 className="text-zinc-600" size={36} />
                                        <div className="flex-1 min-w-0">
                                            {member ? (
                                                <>
                                                    <p className="font-semibold text-zinc-900 truncate">
                                                        {member.username}
                                                    </p>
                                                    <p className="text-sm text-zinc-600 truncate">
                                                        {member.role}
                                                    </p>
                                                    <p className="text-xs text-zinc-500 flex items-center truncate">
                                                        <MailIcon size={12} className="mr-1" />
                                                        {member.email}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-zinc-600">
                                                    Member Details Unavailable
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'details' && (
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <UserIcon className="mr-2 text-zinc-700" size={24} />
                                    Team Management
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-zinc-600">Team Manager</p>
                                        <p className="font-medium flex items-center text-zinc-900">
                                            {teamManager ? (
                                                <>
                                                    <UserCircle2 size={20} className="mr-2" />
                                                    {teamManager.username}
                                                </>
                                            ) : (
                                                'No manager assigned'
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-600">Team Manager Email</p>
                                        <p className="font-medium flex items-center text-zinc-900">
                                            <MailIcon size={16} className="mr-2 text-zinc-500" />
                                            {teamManager?.email || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <TagIcon className="mr-2 text-zinc-700" size={24} />
                                    Additional Information
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-zinc-600">Team ID</p>
                                        <p className="font-medium text-zinc-900">{team.teamId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-600">Project ID</p>
                                        <p className="font-medium text-zinc-900">{team.projectId}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamDetailsPopup;