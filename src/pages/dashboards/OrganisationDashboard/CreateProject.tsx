import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../redux/store";
import { logout } from "../../../redux/reducers/authSlice";
import { LogOut, Users, Trash2, Edit, Plus } from "lucide-react";
import { Project, Team, User } from "../../../types";

import AddMembersComponent from "../../../components/dashboardsComponents/AddMemberComponent";
import ProjectsComponent from "../../../components/dashboardsComponents/ProjectComponent";
import AddTeamsComponent from "../../../components/dashboardsComponents/AddTeamsComponent";
import MembersPopup from "../../../components/popups/MemberPopup";
import AddTeamMembersModal from "../../../components/popups/AddTeamMembersModal";
import ProfilePopup from "../../../components/popups/ProfilePopup";
import orgServices, { getOrgMembers } from "../../../api/services/orgServices";
import teamServices from "../../../api/services/teamServices";
import { toast } from "react-hot-toast";
import projectServices from "../../../api/services/projectServices";

const CreateProject: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [teams, setTeams] = useState<Team[]>([]);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTeamForMembers, setSelectedTeamForMembers] = useState<number | null>(null);
  const [profile, setProfile] = useState(false);
  const [members, setMembers] = useState<User[]>([]);
  const [organisationId, setOrganisationId] = useState<number | null>(null);
  const [projectsMap, setProjectsMap] = useState<Map<number, string>>(new Map());

  const fetchTeams = async (organisationId: number) => {
    try {
      const res = await teamServices.getTeamsByOrganisation(organisationId);
      setTeams(res);

      // Fetch project names for all teams
      const projectPromises = res
        .filter(team => team.projectId)
        .map(team => fetchProjectById(team.projectId));

      const projects = await Promise.all(projectPromises);
      const newProjectsMap = new Map<number, string>();
      projects.forEach(project => {
        if (project) {
          newProjectsMap.set(project.projectId ?? project?.id, project.name);
        }
      });
      setProjectsMap(newProjectsMap);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to fetch teams');
    }
  };

  useEffect(() => {
    if (user?.organisationId) {
      fetchTeams(user.organisationId);
    }
  }, [user?.organisationId]);

  const fetchOrganisationById = async (orgId: number) => {
    try {
      const org = await orgServices.getOrgById(orgId);
      setOrganisationId(org?.id);
      const memberData = await getOrgMembers(orgId);
      const filterAdmin = memberData.filter((member: User) => member.role !== 'Admin');
      setMembers(filterAdmin);
    } catch (error) {
      console.error('Error fetching organisation:', error);
      toast.error('Failed to fetch organisation details');
    }
  };

  useEffect(() => {
    if (user?.organisationId) {
      fetchOrganisationById(user.organisationId);
    }
  }, [user?.organisationId]);

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
  };

  const handleDeleteTeam = async (teamId: number) => {
    try {
      await teamServices.deleteTeam(teamId);
      toast.success('Team deleted successfully');
      if (user?.organisationId) {
        fetchTeams(user.organisationId);
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      toast.error('Failed to delete team');
    }
  };

  const handleAddTeamMembers = (teamId: number) => {
    setSelectedTeamForMembers(teamId);
  };

  const fetchProjectById = async (projectId: number): Promise<Project | null> => {
    try {
      return await projectServices.getProjectById(projectId);
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  };

  const getProjectName = (projectId: number): string => {
    console.log(projectsMap, "PROJECT_MAP")
    return projectsMap.get(projectId) || 'No Project';
  };

  const handleTeamAdded = async () => {
    if (user?.organisationId) {
      toast.success('Team added successfully');
      await fetchTeams(user.organisationId);
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-start gap-4 h-screen">
      <header className="flex flex-col lg:flex-row w-full justify-between px-8 items-center py-4 pb-0 my-2">
        <div>
          <p className="text-xl font-medium text-gray-800">
            Welcome to your Organisation,
            <span className="text-black font-bold"> {user?.username}</span>!
          </p>
          <p className="text-md text-gray-500">Manage your teams, projects, and members</p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setProfile(true)}
            className="flex items-center justify-center gap-2 bg-slate-200 hover:bg-gray-100 border border-black text-black px-4 py-2 rounded-3xl shadow-sm transition-colors text-md"
          >
            Role: <span className="font-semibold">{user?.role}</span>
          </button>

          <button
            className="bg-black text-white px-4 py-2 rounded-3xl flex items-center hover:bg-gray-800 transition text-md"
            onClick={() => setIsPopupOpen(true)}
          >
            View Members <span className="font-semibold ml-1">({members.length})</span>
          </button>

          <AddMembersComponent organisationId={organisationId} />

          <button
            onClick={() => dispatch(logout())}
            className="flex items-center justify-center gap-2 bg-red-500 text-white text-md px-4 py-2 hover:bg-red-600 transition rounded-3xl"
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

        <div className="h-[100%] w-[30%] flex flex-col gap-4">
          <div className="flex-1 bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-black flex items-center py-2">
                <Users className="mr-3" size={19} />
                Teams ({teams.length})
              </h2>
              <AddTeamsComponent
                organisationId={organisationId}
                isEditing={!!editingTeam}
                existingTeam={editingTeam || undefined}
                onClose={() => setEditingTeam(null)}
                onTeamAdded={handleTeamAdded}
              />
            </div>

            {teams.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {teams.map((team) => (
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

                    <div className="text-md text-gray-600 my-2">
                      <p className="truncate">
                        {team.description || 'No description'}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span
                          className="text-sm bg-green-100 text-green-900 py-1 px-2 rounded-3xl hover:text-black cursor-pointer"
                          onClick={() => handleAddTeamMembers(team.teamId)}
                        >
                          Members: {team.members.length}
                        </span>
                        <span className="text-sm bg-yellow-100 text-yellow-950 py-1 px-2 rounded-3xl">
                          {team.projectId ? getProjectName(team.projectId) : 'No Project'}
                        </span>
                      </div>

                      <button
                        className="py-2 px-2 bg-black text-white flex rounded-3xl cursor-pointer"
                        onClick={() => handleAddTeamMembers(team.teamId)}
                      >
                        <Plus size={12} className="text-white" />
                        <Users size={12} />
                      </button>
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
        openProfile={setProfile}
      />

      {selectedTeamForMembers && (
        <AddTeamMembersModal
          organisationId={user?.organisationId}
          teamId={selectedTeamForMembers}
          onClose={() => setSelectedTeamForMembers(null)}
        />
      )}
    </div>
  );
};

export default CreateProject;