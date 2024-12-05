import React, { useEffect, useState } from "react";
import { 
  Folder, 
  Users, 
  Calendar, 
  Clock, 
  BarChart, 
  MoreHorizontal,
  ChevronRight 
} from "lucide-react";
import { loadFromLocalStorage } from "../../../utils/localStorage";
import { Project } from "../../../types";

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const startDate = new Date(project.startDate as string);
  const endDate = new Date(project.endDate as string);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const statusColors: Record<string, { bg: string; text: string }> = {
    'planning': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    'active': { bg: 'bg-green-100', text: 'text-green-800' },
    'completed': { bg: 'bg-blue-100', text: 'text-blue-800' }
  };

  const currentStatus = statusColors[project.status] || { bg: 'bg-gray-100', text: 'text-gray-800' };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-100 p-2 rounded-lg">
            <Folder className="text-gray-600" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-black transition-colors">
              {project.name}
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className={`${currentStatus.bg} ${currentStatus.text} px-3 py-1 rounded-full text-xs font-medium`}>
            {project.status}
          </div>
          <button className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1 transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 w-full">
        <div className="flex items-center space-x-2">
          <Users size={16} className="text-blue-500 opacity-70" />
          <span className="text-sm text-gray-600">Teams: {project.teams.length}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock size={16} className="text-purple-500 opacity-70" />
          <span className="text-sm text-gray-600">{duration} days</span>
        </div>
      </div>

      <div className="space-y-3 border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-gray-500 opacity-70" />
            <span className="text-sm text-gray-500">
              {project.startDate} {" " } to {" "} {project.endDate}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart size={16} className="text-green-500 opacity-70" />
            <span className="text-sm text-gray-500">Progress</span>
          </div>
        </div>

        {project.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {project.description}
          </p>
        )}
      </div>

      <div className="border-t border-gray-100 pt-4">
        <button className="w-full flex items-center justify-center bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 text-sm transition-colors group/details">
          View Details
          <ChevronRight size={16} className="ml-2 group-hover/details:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

const AllProjects: React.FC = () => {
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  useEffect(() => {
    const projects = loadFromLocalStorage("projects", []);
    if (projects) {
      setAllProjects(projects);
    }
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-black">
            All Projects
            ({allProjects.length})
          </h1>
          {/* <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300">
            Create Project
          </button> */}
        </div>

        {allProjects.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No projects found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {allProjects.map((project) => (
              <ProjectCard key={project.projectId} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProjects;