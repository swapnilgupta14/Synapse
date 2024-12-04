import React, { useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import { Organisation, User } from '../../types';
// import { updateUserTeam } from '../../redux/userSlice';
import { Plus, Search, X } from 'lucide-react';
import { updateTeam } from '../../redux/teamsSlice';

const AddTeamMembersModal: React.FC<{
    teamId: number;
    onClose: () => void;
}> = ({ teamId, onClose }) => {
    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<User[]>([]);

    console.log(selectedMembers, "test");

    const currentTeam = useAppSelector(state =>
        state.teams.teams.find(team => team.teamId === teamId)
    );

    const currentOrg : Organisation = JSON.parse(localStorage.getItem('userCurrent') || '[]');

    const users = localStorage.getItem('SignedUpUsers');
    if (!users) return null;
    const availableUsers = JSON.parse(users).filter((it: User) => it?.role !== 'Admin');

    const filteredUsers_1 : User[] = useMemo(() => {
        const alreadyAddedIds = currentTeam?.members.map(member => member.id) || [];
        return availableUsers
            .filter((user: User) =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter((user: User) => !alreadyAddedIds.includes(user.id));
    }, [availableUsers, searchTerm, currentTeam]);

    const filteredUsers = filteredUsers_1.filter((it) => it?.organisationId === currentOrg?.id);

    const handleAddMember = (user: User) => {
        if (user?.role === "Admin") {
            console.error("Admins cannot be added to teams.");
            return;
        }

        const newMember: User = { ...user };
        const updatedMembers = [...(currentTeam?.members || []), newMember];

        const signedUpUsers: User[] = JSON.parse(localStorage.getItem("SignedUpUsers") || "[]");
        const updatedUsers = signedUpUsers.map((u: User) => {
            if (u.id === user.id) {
                const updatedTeamIds = Array.isArray(u.teamId) ? [...u.teamId, teamId] : [teamId];
                return { ...u, teamId: updatedTeamIds };
            }
            return u;
        });

        localStorage.setItem("SignedUpUsers", JSON.stringify(updatedUsers));
        dispatch(updateTeam({ teamId, projectId: currentTeam?.projectId, members: updatedMembers, name: currentTeam?.name}));
        setSelectedMembers((prev) => [...prev, newMember]);
    };


    const handleRemoveMember = (userId: number) => {
        const updatedMembers =
            currentTeam?.members.filter((member) => member.id !== userId) || [];

        const signedUpUsers: User[] = JSON.parse(localStorage.getItem("SignedUpUsers") || "[]");
        const updatedUsers = signedUpUsers.map((u: User) => {
            if (u.id === userId) {
                const updatedTeamIds = Array.isArray(u.teamId)
                    ? u.teamId.filter((id) => id !== teamId)
                    : [];
                return { ...u, teamId: updatedTeamIds };
            }
            return u;
        });

        localStorage.setItem("SignedUpUsers", JSON.stringify(updatedUsers));
        dispatch(updateTeam({ teamId, projectId: currentTeam?.projectId, members: updatedMembers, name: currentTeam?.name }));
        setSelectedMembers((prev) => prev.filter((member) => member.id !== userId));
    };




    const handleToggleRole = (memberId: number) => {
        const teamManagerExists = currentTeam?.members.some(
            member => member.role === 'Team Manager'
        );

        const updatedMembers: User[] = (currentTeam?.members || []).map(member => {
            if (member.id === memberId) {
                if (member.role === 'Team Member' && teamManagerExists) {
                    alert('A Team Manager already exists. Only one Team Manager is allowed.');
                    return member;
                }

                const newRole: User['role'] =
                    member.role === 'Team Member' ? 'Team Manager' : 'Team Member';

                return {
                    ...member,
                    role: newRole
                };
            }

            if (member.role === 'Team Manager' && member.id !== memberId) {
                return {
                    ...member,
                    role: 'Team Member'
                };
            }

            return member;
        });

        const newTeamManagerId = updatedMembers.find(
            member => member.role === 'Team Manager'
        )?.id || 0;

        const signedUpUsers: User[] = JSON.parse(
            localStorage.getItem("SignedUpUsers") || "[]"
        );

        const updatedSignedUpUsers: User[] = signedUpUsers.map(user => {
            if (user.id === memberId) {
                const newRole: User['role'] =
                    user.role === 'Team Member' ? 'Team Manager' : 'Team Member';

                return {
                    ...user,
                    role: newRole
                };
            }
            return user;
        });

        localStorage.setItem("SignedUpUsers", JSON.stringify(updatedSignedUpUsers));
        dispatch(updateTeam({
            teamId,
            projectId: currentTeam?.projectId,
            members: updatedMembers,
            teamManagerId: newTeamManagerId,
            name: currentTeam?.name
        }));
    };



    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[80vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                        Add Members to {currentTeam?.name}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                {currentTeam && currentTeam?.members.length > 0 && (
                    <div className="px-6 py-4">
                        <h3 className="text-lg font-medium mb-2">Current Members</h3>
                        <div className="flex flex-wrap gap-2">
                            {currentTeam.members.map(member => (
                                <div
                                    key={member.id}
                                    className="flex items-center bg-zinc-200 px-3 py-2 rounded-full"
                                >
                                    <span className="mr-3">{member.username}</span>
                                    <span
                                        onClick={() => handleToggleRole(member.id)}
                                        className="text-xs bg-black text-white px-2 py-1 rounded-full mr-2 cursor-pointer"
                                    >
                                        {member.role}
                                    </span>
                                    <button
                                        onClick={() => handleRemoveMember(member.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="px-6 py-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search users by name or email"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <h3 className="text-lg font-medium mb-2">Available Users</h3>
                    {filteredUsers.length === 0 ? (
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
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                    <button
                                        onClick={() => handleAddMember(user)}
                                        className="bg-black text-white px-3 py-1 rounded-full flex items-center"
                                    >
                                        <Plus size={16} className="mr-1" /> Add
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
                        Cancel
                    </button>
                    {/* <button
                        onClick={onClose}
                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                    >
                        Save Changes
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export default AddTeamMembersModal;
