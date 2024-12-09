import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../redux/store";
import { logout } from "../../../redux/reducers/authSlice";
import { LogOut, Users, Trash2, Edit, Plus } from "lucide-react";
import { Project, Team } from "../../../types";
import { deleteTeam } from "../../../redux/reducers/teamsSlice";

import AddMembersComponent from "../../../component/dashboardsComponents/AddMemberComponent";
import ProjectsComponent from "../../../component/dashboardsComponents/ProjectComponent";
import AddTeamsComponent from "../../../component/dashboardsComponents/AddTeamsComponent";
import MembersPopup from "../../../component/popups/MemberPopup";
import AddTeamMembersModal from "../../../component/popups/AddTeamMembersModal";
import ProfilePopup from "../../../component/popups/ProfilePopup";

const CreateProject: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const teams = useAppSelector((state) => state.teams.teams);

  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const members = useAppSelector((state) => state.organisation.members);
  const [selectedTeamForMembers, setSelectedTeamForMembers] = useState<number | null>(null);

  const [profile, openProfile] = useState(false);



  const handleDeleteTeam = (teamId: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this team?');
    if (confirmDelete) {
      dispatch(deleteTeam(teamId));
    }
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);

  };

  const handleAddTeamMembers = (teamId: number) => {
    setSelectedTeamForMembers(teamId);
  };

  // useEffect(() => {
  //   dispatch(loadMembers());
  // }, [dispatch]);

  const allProjects = useAppSelector(state => state.projects.projects);

  const handleGetName = (id: number) => {
    const filtered = allProjects.find((it: Project) => it.projectId === id);
    return filtered?.name;
  }

  const st = useAppSelector((state) => state);
  console.log(st);

  return (
    <div className="container mx-auto flex flex-col items-center justify-start gap-4 h-screen">
      <header className="flex flex-col lg:flex-row w-full justify-between px-8 items-center py-4 pb-0 my-2">
        <div>
          <p className="text-xl font-medium text-gray-800">
            Welcome to your Organisation,<span className="text-black font-bold"> {user?.username}
            </span>!
          </p>

          <p className="text-sm text-gray-500">Manage your teams, projects, and members</p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => openProfile(true)}
            className="flex items-center justify-center gap-2 bg-slate-200 hover:bg-gray-100 border border-black text-black px-4 py-2 rounded-3xl shadow-sm transition-colors text-sm"
          >
            Role: <span className='font-semibold'>{user?.role}</span>
          </button>


          <button
            className="bg-black text-white px-4 py-2 rounded-3xl flex items-center hover:bg-gray-800 transition text-sm"
            onClick={() => setIsPopupOpen(true)}
          >
            View Members <span className='font-semibold ml-1'> ({members?.length})</span>
          </button>

          <AddMembersComponent />

          <button
            onClick={() => dispatch(logout())}
            className="flex items-center justify-center gap-2 bg-red-500 text-white text-sm px-4 py-2 hover:bg-red-600 transition rounded-3xl"
          >
            <LogOut size={16} className="text-white" />
            Logout
          </button>
        </div>
      </header>

      <div className="flex-1 flex items-center gap-4 mx-6 mb-4 w-[98%]">

        <div className="flex-1 h-[100%]">
          <ProjectsComponent />
        </div>

        <div className=" h-[100%] w-[30%] flex flex-col gap-4">
          <div className="flex-1 bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-black flex items-center py-2">
                <Users className="mr-3" size={19} />
                Teams ({teams.length > 0 ? teams.length : "0"})
              </h2>
              <AddTeamsComponent
                isEditing={!!editingTeam}
                existingTeam={editingTeam || undefined}
                onClose={() => setEditingTeam(null)}
              />
            </div>

            {teams.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {teams.map((team: Team) => (
                  <div
                    key={team.teamId}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {team.name}
                      </h3>

                      <div className="flex space-x-2">
                        <button
                          className="text-black hover:text-gray-700 transition-colors"
                          onClick={() => handleEditTeam(team)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-700 transition text-white p-1 rounded-full"
                          onClick={() => handleDeleteTeam(team.teamId)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 my-2">
                      <p className="truncate">
                        {team.description || 'No description'}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="text-sm bg-green-100 text-green-700 py-1 px-2 rounded-3xl hover:text-black cursor-pointer"
                          onClick={() => handleAddTeamMembers(team.teamId)}
                        >
                          Members: {team.members.length}
                        </span>
                        {team?.projectId !== 0 && (
                          <span className="text-sm bg-yellow-100 text-yellow-700 py-1 px-2 rounded-3xl">
                            {handleGetName(team?.projectId)}
                          </span>
                        )}
                      </div>

                      <div
                        className="py-2 px-2 bg-black text-white flex rounded-3xl cursor-pointer"
                        onClick={() => handleAddTeamMembers(team.teamId)}
                      >
                        <Plus size={12} className="text-white" />
                        <Users size={12} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No Teams Found. Add some teams!
              </div>
            )}
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <MembersPopup
          members={members}
          onClose={() => setIsPopupOpen(false)}
        />
      )}

      <ProfilePopup
        profile={profile}
        user={user}
        openProfile={openProfile}
      />

      {selectedTeamForMembers && (
        <AddTeamMembersModal
          teamId={selectedTeamForMembers}
          onClose={() => setSelectedTeamForMembers(null)}
        />
      )}

    </div>
  );
};

export default CreateProject;