import React, { useState } from "react";
import { Team, Project } from "../../types";
import { ArrowUpRightFromCircle } from "lucide-react";
import ProjectDetailsView from "../dashboardsComponents/ProjectDetailsView";
import { useAppSelector } from "../../redux/store";

const TeamCard: React.FC<{ team: Team, onClick?: () => void, handleTeamClick: (team: Team) => void }>
  = ({ team, onClick, handleTeamClick }) => {
    const isActiveTeam = team.members.length > 0;

    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [project, setProject] = useState<Project>();

    const projects = useAppSelector(state => state.projects.projects);

    const handleOpen = (id: number) => {
      const findProject = projects.find((it: Project) => it.projectId === id);
      if (!findProject) return;
      setProject(findProject);
      setIsPopupOpen(true);
    }
    const handleClose = () => {
      setIsPopupOpen(false);
      setIsPopupOpen(false);
    }

    const getName = (id: number) => {
      const findProject = projects.find((it: Project) => it.projectId === id);
      if (!findProject) return "N/A";
      return findProject?.name;
    }


    return (
      <>
        <div className="bg-gray-50 hover:shadow-2xl flex flex-col justify-between rounded-lg border border-gray-200 p-4 space-y-4 shadow-sm  transition-all duration-300"
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
              <span>Project: {getName(team?.projectId)}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ">
                <ArrowUpRightFromCircle className="w-4 h-4 " />
              </span>
            </span>


          </div>

          <div>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Team Members</div>
              <div className="flex -space-x-2">
                {team.members.slice(0, 5).map((member, index) => (
                  <div
                    key={member.id}
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
              <button className="flex-grow bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300 text-sm"
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
        {isPopupOpen && project &&
          <ProjectDetailsView
            project={project}
            onClose={handleClose}
          />}
      </>
    );
  };

export default TeamCard;
