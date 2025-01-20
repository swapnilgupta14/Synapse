import React, { useState, useEffect, memo } from "react";
import {
  User as UserIcon,
  UserPlus,
  Search,
  X,
  Trash2,
  Building2,
  Loader2
} from "lucide-react";
import { User, Organisation } from "../../types";
import userServices from "../../api/services/userServices";
import orgServices from "../../api/services/orgServices";
import toast from "react-hot-toast";

interface AddMembersComponentProps {
  organisationId: number | null;
  onAddMembers?: (users: User[]) => void;
}

const AddMembersComponent: React.FC<AddMembersComponentProps> = memo(({
  organisationId,
  onAddMembers,
}) => {
  if (!organisationId) return null;

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [orgMembers, setOrgMembers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [organisation, setOrganisation] = useState<Organisation | null>(null);

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  const [removingMembers, setRemovingMembers] = useState<number[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchOrganisation = async () => {
    try {
      const org = await orgServices.getOrgById(organisationId);
      if (!org) {
        setIsPopupOpen(false);
        return;
      }
      setOrganisation(org);
      return org;
    } catch (error) {
      console.error('Error fetching organisation:', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const users = await userServices.getAllUsers();
      setAllUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchOrgMembers = async (org?: Organisation) => {
    try {
      const currentOrg = org || organisation;
      if (currentOrg?.members) {
        const memberPromises = currentOrg.members.map(async (userId) => {
          const user = await userServices.getUserById(userId);
          return user;
        });
        const members = await Promise.all(memberPromises);
        setOrgMembers(members.filter(Boolean));
      }
    } catch (error) {
      console.error('Error fetching org members:', error);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setIsInitialLoading(true);
      try {
        const org = await fetchOrganisation();
        if (org) {
          await Promise.all([
            fetchAllUsers(),
            fetchOrgMembers(org)
          ]);
        }
      } finally {
        setIsInitialLoading(false);
      }
    };

    if (isPopupOpen) {
      initializeData();
    }
  }, [organisationId, isPopupOpen]);

  const handleSearchUsers = async (email: string) => {
    setSearchEmail(email);
    if (!organisation) return;

    setIsSearching(true);
    try {
      const filtered = allUsers.filter(
        (user) =>
          user.email.toLowerCase().includes(email.toLowerCase()) &&
          user.id !== organisation.ownerId &&
          user?.role !== "Admin" &&
          !organisation.members?.includes(user.id)
      );
      setFilteredUsers(filtered);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleUserSelection = (user: User) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };

  const handleAddMembers = async () => {
    if (!organisation || selectedUsers.length === 0) return;

    setIsAddingMembers(true);
    try {
      const updatedMembers = [
        ...(organisation.members || []),
        ...selectedUsers.map(user => user.id)
      ];

      await orgServices.updateOrg(organisation.organisationId, {
        members: updatedMembers
      });

      for (const user of selectedUsers) {
        await userServices.updateUser(user.id, {
          organisationId: organisation.organisationId
        });
      }

      const updatedOrg = await fetchOrganisation();
      if (updatedOrg) {
        await fetchOrgMembers(updatedOrg);
        await fetchAllUsers();
      }

      onAddMembers?.(selectedUsers);
      setSelectedUsers([]);
      setSearchEmail("");
      setFilteredUsers([]);
      toast.success("Members added successfully!");
    } catch (error) {
      console.error('Error adding members:', error);
      toast.error("Failed to add members!");
    }
    finally {
      setIsAddingMembers(false);
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (!organisation) return;

    setRemovingMembers(prev => [...prev, userId]);
    try {
      const updatedMembers = organisation.members?.filter(id => id !== userId) || [];
      await orgServices.updateOrg(organisation.organisationId, {
        members: updatedMembers
      });

      await userServices.updateUser(userId, {
        organisationId: undefined
      });

      const updatedOrg = await fetchOrganisation();
      if (updatedOrg) {
        await fetchOrgMembers(updatedOrg);
        await fetchAllUsers();
        toast.success("Member removed successfully!");
      }
    } catch (error) {
      toast.error("Failed to remove member!");
    } finally {
      setRemovingMembers(prev => prev.filter(id => id !== userId));
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      <button
        onClick={() => setIsPopupOpen(true)}
        className="bg-black text-white px-4 py-2 rounded-3xl flex items-center hover:bg-gray-800 transition text-md"
      >
        <UserPlus className="mr-2" size={18} />
        Add Members
      </button>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl w-[50vw] h-[70vh] flex flex-col">
            <div className="text-black p-6 pt-4 py-2 rounded-t-xl flex justify-between items-center">
              <h2 className="text-xl font-medium py-2">
                Add New Members in {organisation?.username}
              </h2>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="text-gray-600 hover:text-gray-900 transition-colors rounded-full p-2 hover:bg-gray-200"
              >
                <X size={21} />
              </button>
            </div>

            {isInitialLoading ? (
              <div className="flex-grow flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-500" size={40} />
              </div>
            ) : (
              <div className="p-6 py-3 flex-grow overflow-auto">
                <div className="mb-6">
                  <div className="flex space-x-4">
                    <div className="relative flex-grow">
                      <div className="flex items-center border-2 border-gray-200 rounded-md">
                        {isSearching ? (
                          <Loader2 className="ml-3 text-gray-500 animate-spin" size={20} />
                        ) : (
                          <Search className="ml-3 text-gray-500" size={20} />
                        )}
                        <input
                          type="text"
                          placeholder="Search by email"
                          value={searchEmail}
                          onChange={(e) => handleSearchUsers(e.target.value)}
                          className="w-full p-2 pl-2 outline-none"
                        />
                      </div>

                      {filteredUsers.length > 0 && searchEmail.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                          {filteredUsers.map((user) => (
                            <li
                              key={user.id}
                              onClick={() => toggleUserSelection(user)}
                              className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                            >
                              <div className="flex items-center">
                                {user.organisationId ? (
                                  <Building2 size={20} className="mr-2 text-blue-500" />
                                ) : selectedUsers.some((u) => u.id === user.id) ? (
                                  <UserIcon size={20} className="mr-2 text-black" />
                                ) : (
                                  <UserIcon size={20} className="mr-2 text-gray-300" />
                                )}
                                <div>
                                  <p className="font-medium">{user.email}</p>
                                  <p className="text-md text-gray-500">
                                    {user.username}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <button
                      onClick={handleAddMembers}
                      disabled={selectedUsers.length === 0 || isAddingMembers}
                      className={`w-[120px] py-1 rounded transition flex items-center justify-center ${selectedUsers.length > 0 && !isAddingMembers
                        ? "bg-black text-white hover:bg-gray-800"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      {isAddingMembers ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <>Add {selectedUsers.length > 0 ? `(${selectedUsers.length})` : ""}</>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Organisation Members ({orgMembers.length})
                  </h3>

                  {orgMembers.length > 0 ? (
                    <div className="space-y-3 mb-4 max-h-[320px] overflow-y-auto">
                      {orgMembers.map((member) => (
                        <div
                          key={member.id}
                          className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4"
                        >
                          <div className="bg-slate-200 rounded-full p-2">
                            <UserIcon className="text-gray-600" size={24} />
                          </div>
                          <div className="flex-grow flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-gray-800">
                                {member.username}
                              </p>
                              <p className="text-md text-gray-600">
                                {member.email}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                Added: {formatDate(member.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className={`
                                px-2 py-1 rounded-full text-sm font-medium
                                ${member.role === "Admin"
                                  ? "bg-red-100 text-red-800"
                                  : member.role === "Organisation"
                                    ? "bg-blue-100 text-blue-800"
                                    : member.role === "Project Manager"
                                      ? "bg-green-100 text-green-800"
                                      : member.role === "Team Manager"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-purple-100 text-purple-800"
                                }
                              `}>
                                {member.role}
                              </span>
                              <button
                                onClick={() => handleRemoveMember(member.id)}
                                disabled={removingMembers.includes(member.id)}
                                className={`${removingMembers.includes(member.id)
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-red-500 hover:bg-red-700"
                                  } transition text-white p-2 rounded-full`}
                              >
                                {removingMembers.includes(member.id) ? (
                                  <Loader2 className="animate-spin" size={15} />
                                ) : (
                                  <Trash2 size={15} />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No members found. Add some team members to get started!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

AddMembersComponent.displayName = "AddMembersComponent";
export default AddMembersComponent;