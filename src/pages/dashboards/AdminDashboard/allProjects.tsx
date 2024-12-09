import React, { useEffect, useState } from "react";
import { loadFromLocalStorage } from "../../../utils/localStorage";
import ProjectCard from "../../../component/ui/ProjectCard";
import { Project } from "../../../types";

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
