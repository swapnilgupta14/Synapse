import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Project } from '../types';
import toast from 'react-hot-toast';

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (project: Project) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/projects');
      setProjects(response.data);
    } catch (err) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (project: Project) => {
    try {
      const response = await axiosInstance.post('/projects', project);
      setProjects([...projects, response.data]);
    } catch (err) {
      setError('Failed to create project');
    }
  };

  const updateProject = async (project: Project) => {
    try {
      await axiosInstance.put(`/projects/${project.projectId}`, project);
      setProjects(projects.map(p => p.projectId === project.projectId ? project : p));
    } catch (err) {
      setError('Failed to update project');
    }
  };

  const deleteProject = async (id: number) => {
    try {
      await axiosInstance.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p.projectId !== id));
      toast.success("Project Deleted Successfully!")
    } catch (err) {
      setError('Failed to delete project');
      toast.error("Failed to delete Project")
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ProjectContext.Provider value={{
      projects,
      loading,
      error,
      fetchProjects,
      createProject,
      updateProject,
      deleteProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}; 