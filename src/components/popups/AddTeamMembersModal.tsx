import React, { useState, useEffect, useMemo } from 'react';
import { Team, User } from '../../types';
import { Plus, Search, X } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import teamServices from '../../api/services/teamServices';
import toast from 'react-hot-toast';

const MemberSkeleton = () => (
    <div className="flex items-center bg-zinc-200 px-3 py-2 rounded-full animate-pulse">
        <div className="w-24 h-4 bg-zinc-300 rounded mr-3" />
        <div className="w-16 h-6 bg-zinc-300 rounded-full mr-2" />
        <div className="w-4 h-4 bg-zinc-300 rounded-full" />
    </div>
);

interface TeamWithUsers extends Omit<Team, 'members'> {
    members: User[];
}

const AddTeamMembersModal: React.FC<{
    teamId: number;
    organisationId: number | null | undefined;
    onClose: () => void;
}> = ({ teamId, onClose, organisationId }) => {
    if (organisationId === null) return null;

    const [searchTerm, setSearchTerm] = useState('');
    const [organizationUsers, setOrganizationUsers] = useState<User[]>([]);
    const [currentTeam, setCurrentTeam] = useState<TeamWithUsers | null>(null);
    const [isLoadingTeam, setIsLoadingTeam] = useState(true);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    // const [teamMemberUsers, setTeamMemberUsers] = useState<User[]>([]);

    // Track loading states for individual actions
    const [loadingStates, setLoadingStates] = useState<{
        [key: number]: {
            adding?: boolean;
            removing?: boolean;
            toggling?: boolean;
        };
    }>({});

    const setLoadingState = (userId: number, action: 'adding' | 'removing' | 'toggling', state: boolean) => {
        setLoadingStates(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [action]: state
            }
        }));
    };

    const fetchUserData = async (memberIds: number[]): Promise<User[]> => {
        try {
            const userPromises = memberIds.map(async (memberId) => {
                try {
                    const response = await axiosInstance.get(`/users/${memberId}`);
                    return response.data;
                } catch (error) {
                    console.error(`Failed to fetch user data for ID ${memberId}:`, error);
                    return null;
                }
            });

            const users = await Promise.all(userPromises);
            return users.filter((user): user is User => user !== null);
        } catch (error) {
            console.error('Error fetching user data:', error);
            return [];
        }
    };

    const fetchOrganizationUsers = async () => {
        try {
            setIsLoadingUsers(true);
            const orgMembersResponse = await axiosInstance.get(`/organisations/${organisationId}`);
            const memberIds = orgMembersResponse.data.members || [];
            const users = await fetchUserData(memberIds);
            setOrganizationUsers(users.filter(user => user.role !== 'Admin'));
        } catch (error) {
            console.error('Error fetching organization users:', error);
            toast.error('Failed to load organization users');
        } finally {
            setIsLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchTeam();
        fetchOrganizationUsers();
    }, [teamId, organisationId]);

    const refreshData = async () => {
        await Promise.all([fetchTeam(), fetchOrganizationUsers()]);
    };

    const filteredUsers = useMemo(() => {
        const alreadyAddedIds = currentTeam?.members.map(member => member.id) || [];
        return organizationUsers
            .filter((user: User) =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter((user: User) => !alreadyAddedIds.includes(user.id));
    }, [organizationUsers, searchTerm, currentTeam]);

    const handleToggleRole = async (memberId: number) => {
        try {
            setLoadingState(memberId, 'toggling', true);

            // Get current user data
            const userResponse = await axiosInstance.get(`/users/${memberId}`);
            const userData = userResponse.data;

            // Check if another Team Manager exists
            const currentTeamManagerResponse = await axiosInstance.get(`/users`, {
                params: {
                    role: 'Team Manager',
                    teamId: teamId
                }
            });
            const existingTeamManager = currentTeamManagerResponse.data.find(
                (user: User) => user.id !== memberId && user.teamId?.includes(teamId)
            );

            const newRole = userData.role === 'Team Member' ? 'Team Manager' : 'Team Member';

            if (newRole === 'Team Manager' && existingTeamManager) {
                throw new Error('A Team Manager already exists for this team');
            }

            await axiosInstance.patch(`/users/${memberId}`, {
                role: newRole
            });

            if (newRole === 'Team Manager' && existingTeamManager) {
                await axiosInstance.patch(`/users/${existingTeamManager.id}`, {
                    role: 'Team Member'
                });
            }

            if (newRole === 'Team Manager') {
                await teamServices.updateTeam(teamId, {
                    teamManagerId: memberId
                });
            } else if (newRole === 'Team Member' && currentTeam?.teamManagerId === memberId) {
                await teamServices.updateTeam(teamId, {
                    teamManagerId: null
                });
            }

            await refreshData();
            toast.success(`Role updated to ${newRole} successfully`);
        } catch (error) {
            console.error('Error updating member role:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to update member role');
        } finally {
            setLoadingState(memberId, 'toggling', false);
        }
    };

    const fetchTeam = async () => {
        try {
            setIsLoadingTeam(true);

            if (!Number(teamId)) return;

            const teamData = await teamServices.getTeamById(teamId);

            if (!Array.isArray(teamData.members)) {
                throw new Error("Invalid members data");
            }

            const memberUsers = await Promise.all(
                teamData.members.map(async (memberId: number) => {
                    try {
                        const response = await axiosInstance.get(`/users/${memberId}`);
                        return response.data;
                    } catch (error) {
                        console.error(`Failed to fetch user data for ID ${memberId}:`, error);
                        return null;
                    }
                })
            );

            setCurrentTeam({
                ...teamData,
                members: memberUsers.filter(Boolean)
            });
        } catch (error) {
            console.error("Error fetching team:", error);
            toast.error("Failed to load team members");
        } finally {
            setIsLoadingTeam(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[80vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                        Add Members to {currentTeam?.name || 'Team'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 py-4">
                    <h3 className="text-lg font-medium mb-2">Current Members</h3>
                    <div className="flex flex-wrap gap-2">
                        {isLoadingTeam ? (
                            Array(2).fill(0).map((_, i) => <MemberSkeleton key={i} />)
                        ) : (
                            currentTeam?.members.map(member => (
                                <div
                                    key={member.id}
                                    className="flex items-center bg-zinc-200 px-3 py-2 rounded-full"
                                >
                                    <span className="mr-3">{member.username}</span>
                                    <span
                                        onClick={() => !loadingStates[member.id]?.toggling && handleToggleRole(member.id)}
                                        className={`text-xs bg-black text-white px-2 py-1 rounded-full mr-2 ${loadingStates[member.id]?.toggling ? 'opacity-50' : 'cursor-pointer'
                                            }`}
                                    >
                                        {loadingStates[member.id]?.toggling ? 'Updating...' : member.role}
                                    </span>
                                    <button
                                        onClick={async () => {
                                            try {
                                                setLoadingState(member.id, 'removing', true);
                                                await teamServices.removeTeamMember(teamId, member.id);
                                                await refreshData();
                                            } catch (error) {
                                                console.error('Error removing team member:', error);
                                                toast.error('Failed to remove team member');
                                            } finally {
                                                setLoadingState(member.id, 'removing', false);
                                            }
                                        }}
                                        disabled={loadingStates[member.id]?.removing}
                                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="px-6 py-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search users by name or email"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            disabled={isLoadingUsers}
                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                        />
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <h3 className="text-lg font-medium mb-2">Available Users</h3>
                    {isLoadingUsers ? (
                        <div className="text-center text-gray-500 py-4">
                            Loading users...
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center text-gray-500 py-4">
                            No available users found
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {filteredUsers.map((user: User) => (
                                <div
                                    key={user.id}
                                    className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
                                >
                                    <div>
                                        <p className="font-medium">{user.username}</p>
                                        <p className="text-md text-gray-500">{user.email}</p>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            try {
                                                setLoadingState(user.id, 'adding', true);
                                                await teamServices.addTeamMember(teamId, user);
                                                await refreshData();
                                            } catch (error) {
                                                console.error('Error adding team member:', error);
                                                toast.error('Failed to add team member');
                                            } finally {
                                                setLoadingState(user.id, 'adding', false);
                                            }
                                        }}
                                        disabled={loadingStates[user.id]?.adding}
                                        className="bg-black text-white px-3 py-1 rounded-full flex items-center disabled:opacity-50"
                                    >
                                        {loadingStates[user.id]?.adding ? (
                                            'Adding...'
                                        ) : (
                                            <>
                                                <Plus size={16} className="mr-1" /> Add
                                            </>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTeamMembersModal;