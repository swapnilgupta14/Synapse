import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, X } from 'lucide-react';
import { addTeam, updateTeam } from '../../redux/teamsSlice';
import { RootState } from '../../redux/store';
import { Team } from '../../types';

interface AddTeamsComponentProps {
    isEditing?: boolean;
    existingTeam?: Team;
    onClose?: () => void;
}

const AddTeamsComponent: React.FC<AddTeamsComponentProps> = ({
    isEditing = false,
    existingTeam,
    onClose
}) => {
    const dispatch = useDispatch();
    const projects = useSelector((state: RootState) => state.projects.projects);
    const [isOpen, setIsOpen] = useState(false);

    const [teamName, setTeamName] = useState('');
    const [projectId, setProjectId] = useState(0);
    const [description, setDescription] = useState('');
    const [teamManagerId, setTeamManagerId] = useState(0);

    useEffect(() => {
        if (isEditing && existingTeam) {
            setTeamName(existingTeam.name);
            setProjectId(existingTeam.projectId);
            setDescription(existingTeam.description || '');
            setTeamManagerId(existingTeam.teamManagerId);
            setIsOpen(true);
        }
    }, [isEditing, existingTeam]);

    const handleSubmit = () => {
        if (!teamName.trim()) {
            alert('Team name is required');
            return;
        }

        if (!projectId) {
            alert('Please select a project');
            return;
        }

        if (isEditing && existingTeam) {
            dispatch(updateTeam({
                teamId: existingTeam.teamId,
                name: teamName,
                projectId,
                description: description || undefined,
                teamManagerId
            }));
        } else {
            dispatch(addTeam({
                teamId: Date.now(),
                name: teamName,
                projectId,
                description: description || undefined,
                teamManagerId
            }));
        }

        resetForm();
        setIsOpen(false);
        onClose && onClose();
    };

    const resetForm = () => {
        setTeamName('');
        setProjectId(0);
        setDescription('');
        setTeamManagerId(0);
    };

    const handleClose = () => {
        setIsOpen(false);
        resetForm();
        onClose && onClose();
    };

    return (
        <>
            {!isEditing && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 rounded-md hover:bg-gray-700 transition-colors bg-black "
                >
                    <Plus className="h-4 w-4 text-white" />
                </button>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                    onClick={handleClose}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {isEditing ? 'Edit Team' : 'Add New Team'}
                            </h2>
                            <button
                                onClick={handleClose}
                                className="text-gray-600 hover:text-gray-900 transition-colors rounded-full p-2 hover:bg-gray-200"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="teamName"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Team Name
                                </label>
                                <input
                                    id="teamName"
                                    type="text"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    placeholder="Enter team name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="project"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Project
                                </label>
                                <select
                                    value={projectId}
                                    onChange={(e) => setProjectId(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    <option value="0">Select a project</option>
                                    {projects.map((project) => (
                                        <option
                                            key={project.projectId}
                                            value={project.projectId}
                                        >
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Optional team description"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
                            >
                                {isEditing ? 'Update Team' : 'Add Team'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddTeamsComponent;