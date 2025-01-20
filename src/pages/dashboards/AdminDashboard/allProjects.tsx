import React from "react";
import { useQuery } from "react-query";
import ProjectCard from "../../../components/ui/ProjectCard";
import { Project } from "../../../types";
import projectServices from "../../../api/services/projectServices";


const AllProjects: React.FC = () => {
  const { data: allProjects = [], isLoading, error } = useQuery<Project[], Error>(
    'projects',
    projectServices.getAllProjects,
    {
      initialData: [],
      onError: (error) => {
        console.error('Error fetching projects:', error);
      }
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-gray-500">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-red-500">Error loading projects: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-black">
            All Projects ({allProjects.length})
          </h1>
        </div>
        {allProjects.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No projects found</div>
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