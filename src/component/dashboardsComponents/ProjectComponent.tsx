import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from "../../redux/store";
import {
    addProject,
    deleteProject
} from "../../redux/reducers/projectsSlice";
import {
    Folder,
    Plus,
    Trash2,
    Calendar,
    Users as UsersIcon,
    BarChart,
    X
} from 'lucide-react';
import { Project } from '../../types';
import ProjectDetailsView from './ProjectDetailsView';

const ProjectsComponent: React.FC = () => {
    const dispatch = useAppDispatch();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const { user } = useAppSelector((state) => state.auth);

    const orgs = localStorage.getItem("SignedUpOrgs");
    const userCurrent = localStorage.getItem("userCurrent");

    if (!orgs || !userCurrent) return;

    // const orgsParsed = JSON.parse(orgs);
    const parsedUserCurrent = JSON.parse(userCurrent);

    // const organisation = orgsParsed.filter((o: Organisation) => o.id === parsedUserCurrent.id);

    const projects = useAppSelector((state) =>
        state.projects.projects.filter(
            project => project.organisationId === parsedUserCurrent?.id
        )
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: ''
    });

    const handleCreateProject = () => {
        if (!newProject.name || !parsedUserCurrent.id) return;

        dispatch(addProject({
            name: newProject.name,
            description: newProject.description,
            organisationId: parsedUserCurrent.id,
            projectManagerId: user?.id || 0,
            startDate: newProject.startDate,
            endDate: newProject.endDate
        }));

        setNewProject({
            name: '',
            description: '',
            startDate: '',
            endDate: ''
        });
        setIsModalOpen(false);
    };

    const handleDeleteProject = (projectId: number) => {
        dispatch(deleteProject(projectId));
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 h-full flex-1">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-black flex items-center justify-center">
                    <Folder className="mr-3" size={21} />
                    Projects ({projects.length > 0 ? projects.length : "0"})
                </h2>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-black text-white px-2 py-1 rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <Plus size={16} />
                    Create Project
                </button>
            </div>

            {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                        <div
                            key={project.projectId}
                            onClick={() => setSelectedProject(project)}
                            className="flex flex-col justify-between bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-300 cursor-pointer hover:bg-gray-200 transition"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-grow">
                                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {project.description || 'No description'}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.projectId) }}
                                    className="bg-red-500 hover:bg-red-700 transition text-white p-1 rounded-full"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center border-t-2 pt-3">
                                <div className="flex flex-col items-center">
                                    <Calendar size={16} className="text-blue-500 mb-1" />
                                    <span className="text-sm text-blue-600">
                                        {project.startDate
                                            ? new Date(project.startDate).toLocaleDateString()
                                            : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <UsersIcon size={16} className="text-yellow-500 mb-1" />
                                    <span className="text-sm text-yellow-500">
                                        {project.teams?.length || 0} Teams
                                    </span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <BarChart size={16} className="text-red-500 mb-1" />
                                    <span className="text-sm text-red-600 capitalize">
                                        {project.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    No projects found. Create your first project!
                </div>
            )}


            {selectedProject && (
                <ProjectDetailsView
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Create New Project
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-600 hover:text-gray-900 transition-colors rounded-full p-2 hover:bg-gray-200"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Project Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter project name"
                                    value={newProject.name}
                                    onChange={(e) => setNewProject(prev => ({
                                        ...prev,
                                        name: e.target.value
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    placeholder="Project description"
                                    value={newProject.description}
                                    onChange={(e) => setNewProject(prev => ({
                                        ...prev,
                                        description: e.target.value
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black min-h-[100px]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={newProject.startDate}
                                        onChange={(e) => setNewProject(prev => ({
                                            ...prev,
                                            startDate: e.target.value
                                        }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={newProject.endDate}
                                        onChange={(e) => setNewProject(prev => ({
                                            ...prev,
                                            endDate: e.target.value
                                        }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleCreateProject}
                                disabled={!newProject.name}
                                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create Project
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsComponent;