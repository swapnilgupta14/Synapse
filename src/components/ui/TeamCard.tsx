import React, { useState, useEffect } from "react";
import { Team, Project, User } from "../../types";
import { ArrowUpRightFromCircle } from "lucide-react";
import ProjectDetailsView from "../dashboardsComponents/ProjectDetailsView";
import projectServices from "../../api/services/projectServices";
import userServices from "../../api/services/userServices";

const TeamCard: React.FC<{ team: Team, onClick?: () => void, handleTeamClick: (team: Team) => void }> = ({
  team,
  onClick,
  handleTeamClick,
}) => {
  const isActiveTeam = team.members.length > 0;

  const [project, setProject] = useState<Project | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [projectName, setProjectName] = useState<string>("N/A");
  const [teamMembers, setTeamMembers] = useState<User[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!team) return;
      try {
        const fetchedMembers: User[] = await Promise.all(
          team.members.map(async (memberId) => {
            const member = await userServices.getUserById(memberId);
            return member;
          })
        );
        setTeamMembers(fetchedMembers);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, [team]);

  useEffect(() => {
    const fetchProjectName = async () => {
      if (!team?.projectId) return;
      try {
        const projects: Project[] = await projectServices.getProjects();
        const findProject = projects.find((it: Project) => it.projectId === team?.projectId);
        setProjectName(findProject?.name || "N/A");
      } catch (error) {
        console.error("Error fetching project name:", error);
        setProjectName("N/A");
      }
    };

    fetchProjectName();
  }, [team?.projectId]);

  const fetchProjects = async (): Promise<Project[]> => {
    try {
      const res = await projectServices.getProjects();
      return res || [];
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  };

  const handleOpen = async (id: number) => {
    try {
      const projects: Project[] = await fetchProjects();
      const findProject = projects.find((it: Project) => it.projectId === id);
      if (!findProject) return;
      setProject(findProject);
      setIsPopupOpen(true);
    } catch (error) {
      console.error("Error handling project open:", error);
    }
  };

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <div
        className="bg-gray-50 hover:shadow-2xl flex flex-col justify-between rounded-lg border border-gray-200 p-4 space-y-4 shadow-sm transition-all duration-300"
        onClick={onClick}
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 truncate">{team.name}</h2>
            <span
              className={`px-2 py-1 rounded-full text-sm font-medium ${isActiveTeam ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700"
                }`}
            >
              {isActiveTeam ? "Active" : "Inactive"}
            </span>
          </div>

          <span
            className="group px-3 py-1 my-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 flex items-center justify-between cursor-pointer"
            onClick={() => handleOpen(team?.projectId)}
          >
            <span>Project: {projectName}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <ArrowUpRightFromCircle className="w-4 h-4" />
            </span>
          </span>
        </div>

        <div>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Team Members</div>
            <div className="flex -space-x-2">
              {teamMembers.slice(0, 5).map((member, index) => (
                <div
                  key={member.id + "1"}
                  className="w-7 h-7 rounded-full bg-zinc-200 border border-black flex items-center justify-center text-gray-700 text-sm"
                  style={{ zIndex: 5 - index }}
                >
                  {member.username.charAt(0).toUpperCase()}
                </div>
              ))}
              {team.members.length < 1 && <div>No Team Members</div>}
              {team.members.length > 5 && (
                <div className="w-7 h-7 rounded-full bg-gray-300 border border-white flex items-center justify-center text-gray-700 text-sm">
                  +{team.members.length - 5}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-3 space-x-2">
            <button
              className="flex-grow bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300 text-sm"
              onClick={() => handleTeamClick(team)}
            >
              View Details
            </button>
            <button className="p-2 bg-gray-300 text-black rounded-md hover:bg-gray-200 transition duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isPopupOpen && project && <ProjectDetailsView project={project} onClose={handleClose} />}
    </>
  );
};

export default TeamCard;
