import axiosInstance from './axiosInstance';
import { Team, User } from '../types';

export const createTeam = async (teamData: Omit<Team, "teamId">) => {
    try {
        const response = await axiosInstance.post('/teams', {
            ...teamData,
            members: [],
            createdAt: new Date().toISOString()
        });
        return response.data;
    } catch (error) {
        console.error('Error creating team:', error);
        throw error;
    }
};

export const getTeamById = async (teamId: number) => {
    try {
        const response = await axiosInstance.get(`/teams/${teamId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching team:', error);
        throw error;
    }
};

export const updateTeam = async (teamId: number, teamData: Partial<Team>) => {
    try {
        const response = await axiosInstance.patch(`/teams/${teamId}`, teamData);
        return response.data;
    } catch (error) {
        console.error('Error updating team:', error);
        throw error;
    }
};

export const addTeamMember = async (teamId: number, user: User) => {
    try {
        const team = await getTeamById(teamId);
        const response = await axiosInstance.patch(`/teams/${teamId}`, {
            members: [...(team.members || []), user]
        });
        
        await axiosInstance.patch(`/users/${user.id}`, {
            teamId: [...(user.teamId || []), teamId]
        });

        return response.data;
    } catch (error) {
        console.error('Error adding team member:', error);
        throw error;
    }
};

export const removeTeamMember = async (teamId: number, userId: number) => {
    try {
        const team = await getTeamById(teamId);
        
        const response = await axiosInstance.patch(`/teams/${teamId}`, {
            members: team.members.filter((member : User) => member.id !== userId)
        });

        const user = await axiosInstance.get(`/users/${userId}`);
        await axiosInstance.patch(`/users/${userId}`, {
            teamId: (user.data.teamId || []).filter((id: number) => id !== teamId)
        });

        return response.data;
    } catch (error) {
        console.error('Error removing team member:', error);
        throw error;
    }
};

export const getProjectTeams = async (projectId: number) => {
    try {
        const response = await axiosInstance.get(`/teams?projectId=${projectId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching project teams:', error);
        throw error;
    }
}; 