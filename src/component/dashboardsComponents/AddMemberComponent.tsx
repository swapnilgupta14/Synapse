import React, { useState, useEffect } from "react";
import {
  User as UserIcon,
  UserPlus,
  Search,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
} from "lucide-react";
import { User } from "../../types";
import { useAppDispatch } from "../../redux/store";
import {
  addMembersToOrg,
  loadMembers,
  removeMemberFromOrg,
} from "../../redux/reducers/orgSlice";
import { useAppSelector } from "../../redux/store";

interface AddMembersComponentProps {
  onAddMembers?: (users: User[]) => void;
}

const AddMembersComponent: React.FC<AddMembersComponentProps> = ({
  onAddMembers,
}) => {
  const dispatch = useAppDispatch();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [currentMemberPage, setCurrentMemberPage] = useState(0);

  const [allUsers, setAllUsers] = useState<User[]>([]);

  const members = useAppSelector((state) => state.organisation.members);

  useEffect(() => {
    const users: User[] = JSON.parse(
      localStorage.getItem("SignedUpUsers") || "[]"
    ).filter((user: User) => !user.organisationId && user?.role != "Admin");
    setAllUsers(users);
  }, [onAddMembers]);

  const handleSearchUsers = (email: string) => {
    setSearchEmail(email);
    const filtered = allUsers.filter(
      (user) =>
        user.email.toLowerCase().includes(email.toLowerCase()) &&
        !members.some((member) => member.email === user.email)
    );
    setFilteredUsers(filtered);
  };

  const toggleUserSelection = (user: User) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };

  const handleAddMembers = () => {
    if (selectedUsers.length > 0) {
      dispatch(addMembersToOrg(selectedUsers));
      onAddMembers?.(selectedUsers);
      setSelectedUsers([]);
      setSearchEmail("");
      setFilteredUsers([]);
    }
  };

  useEffect(() => {
    dispatch(loadMembers());
  }, [dispatch]);

  const handleRemoveMember = (email: string) => {
    dispatch(removeMemberFromOrg(email));
  };

  const membersPerPage = 3;
  const totalPages = Math.ceil(members.length / membersPerPage);

  const paginatedMembers = members.slice(
    currentMemberPage * membersPerPage,
    (currentMemberPage + 1) * membersPerPage
  );

  const handleNextPage = () => {
    setCurrentMemberPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    setCurrentMemberPage((prev) => Math.max(prev - 1, 0));
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
        className="bg-black text-white px-4 py-2 rounded-3xl flex items-center hover:bg-gray-800 transition text-sm"
      >
        <UserPlus className="mr-2" size={18} />
        Add Members
      </button>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl w-[600px] max-h-[90vh] flex flex-col">
            <div className="text-black p-6 pt-4 py-2 rounded-t-xl flex justify-between items-center">
              <h2 className="text-xl font-medium py-2">Add New Members in the Organisation</h2>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="text-gray-600 hover:text-gray-900 transition-colors rounded-full p-2 hover:bg-gray-200"
                >
                  <X size={21} />
              </button>
            </div>

            <div className="p-6 flex-grow overflow-auto">
              <div className="mb-6">
                <div className="flex space-x-4">
                  <div className="relative flex-grow">
                    <div className="flex items-center border-2 border-gray-200 rounded-md">
                      <Search className="ml-3 text-gray-500" size={20} />
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
                              {selectedUsers.some((u) => u.id === user.id) ? (
                                <CheckSquare
                                  size={20}
                                  className="mr-2 text-black"
                                />
                              ) : (
                                <Square
                                  size={20}
                                  className="mr-2 text-gray-300"
                                />
                              )}
                              <div>
                                <p className="font-medium">{user.email}</p>
                                <p className="text-sm text-gray-500">
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
                    disabled={selectedUsers.length === 0}
                    className={`w-[120px] py-1 rounded transition ${
                      selectedUsers.length > 0
                        ? "bg-black text-white hover:bg-gray-800"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Add{" "}
                    {selectedUsers.length > 0
                      ? `(${selectedUsers.length})`
                      : ""}
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Organisation Members ({members.length})
                </h3>

                {members.length > 0 ? (
                  <div>
                    <div className="space-y-3 mb-4 max-h-[200px] overflow-y-auto">
                      {paginatedMembers.map((member) => (
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
                              <p className="text-sm text-gray-600">
                                {member.email}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Added: {formatDate(member.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span
                                className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${
                        member.role === "Admin"
                          ? "bg-red-100 text-red-800"
                          : member.role === "Organisation"
                          ? "bg-blue-100 text-blue-800"
                          : member.role === "Project Manager"
                          ? "bg-green-100 text-green-800"
                          : member.role === "Team Manager"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-purple-100 text-purple-800"
                      }
                    `}
                              >
                                {member.role}
                              </span>
                              <button
                                onClick={() => handleRemoveMember(member.email)}
                                className="bg-red-500 hover:bg-red-700 transition text-white p-2 rounded-full"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {members.length > membersPerPage && (
                      <div className="flex justify-center items-center space-x-4">
                        <button
                          onClick={handlePrevPage}
                          disabled={currentMemberPage === 0}
                          className="disabled:opacity-50 hover:bg-gray-100 p-2 rounded-full transition"
                        >
                          <ChevronLeft />
                        </button>
                        <span className="text-sm text-gray-600">
                          {currentMemberPage + 1} / {totalPages}
                        </span>
                        <button
                          onClick={handleNextPage}
                          disabled={currentMemberPage === totalPages - 1}
                          className="disabled:opacity-50 hover:bg-gray-100 p-2 rounded-full transition"
                        >
                          <ChevronRight />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No members found. Add some team members to get started!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMembersComponent;
