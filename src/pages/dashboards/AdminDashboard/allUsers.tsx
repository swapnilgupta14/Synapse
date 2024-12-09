import { useEffect, useState } from "react";
import { loadFromLocalStorage } from "../../../utils/localStorage";
import { Shield, Mail, Calendar } from "lucide-react";
import { RoleType, User } from "../../../types";
import ProfilePopup from "../../../component/popups/ProfilePopup";

const UserAvatar = ({ username }: { username: string }) => {



  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center 
    text-gray-700 font-semibold text-lg mr-4">
      {getInitials(username)}
    </div>
  );
};

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [profile, openProfile] = useState(false);


  useEffect(() => {
    const users = loadFromLocalStorage("SignedUpUsers", []);
    if (users) {
      setAllUsers(users);
    }
  }, []);

  const getRoleColor = (role: RoleType) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-50 text-red-600';
      case 'Team Member':
        return 'bg-blue-50 text-blue-600';
      default:
        return 'bg-yellow-50 text-yellow-700';
    }
  };

  const getDate = (createdAt: string | undefined): Date => {
    if (createdAt === undefined) return new Date();
    return new Date(createdAt)
  }

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    openProfile(true);
  };

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <>
      <div className="bg-transaprent min-h-screen p-6">
        <div className="container mx-auto">
          <h1 className="text-xl font-semibold mb-8 text-gray-800">All Users ({allUsers.length})</h1>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allUsers.filter((it) => it.role !== "Admin").map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserClick(user)}
                className="bg-white border border-gray-300 rounded-xl 
              shadow-sm hover:shadow-md transition-all duration-300 
              p-5 flex items-start space-x-4 cursor-pointer hover:bg-zinc-200"
              >
                <UserAvatar username={user.username} />

                <div className="flex-grow">
                  <div className="flex items-center mb-2">
                    <h2 className="text-lg font-semibold mr-3 text-gray-800">
                      {user.username}
                    </h2>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium 
                    ${getRoleColor(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </div>

                  <div className="text-gray-500 space-y-1 text-sm">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{user.email}</span>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span>
                        {getDate(user?.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    {user && user?.teamId && user.teamId !== null ? (
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-gray-400" />
                        <span>
                          Teams: {user.teamId.length}
                          {user.teamId.length > 1 ? ' teams' : ' team'}
                        </span>
                      </div>
                    ) : <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-gray-400" />
                      <span>
                        Teams: N/A
                      </span>
                    </div>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {allUsers.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              No users found
            </div>
          )}
        </div>
      </div>


      <ProfilePopup
        profile={profile}
        user={selectedUser}
        openProfile={openProfile}
      />


    </>
  );
};

export default AllUsers;