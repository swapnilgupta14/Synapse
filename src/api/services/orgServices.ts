import axiosInstance from '../axiosInstance';
import { Organisation, User } from '../../types';

export const createOrg = async (orgData: Omit<Organisation, "organisationId">) => {
    try {
        const newOrgData = {
            ...orgData,
            organisationId: Date.now(),
            id: Date.now(),
            members: [],
            createdAt: new Date().toISOString()
        };
        
        const response = await axiosInstance.post('/organisations', newOrgData);
        return response.data;
    } catch (error) {
        console.error('Error creating organisation:', error);
        throw error;
    }
};

export const getOrgById = async (orgId: number) => {
    try {
        const response = await axiosInstance.get(`/organisations/${orgId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching organisation:', error);
        throw error;
    }
};

export const getAllOrgs = async () => {
    try {
        const response = await axiosInstance.get('/organisations');
        return response.data;
    } catch (error) {
        console.error('Error fetching organisations:', error);
        throw error;
    }
};

export const updateOrg = async (orgId: number, orgData: Partial<Organisation>) => {
    try {
        const response = await axiosInstance.patch(`/organisations/${orgId}`, orgData);
        return response.data;
    } catch (error) {
        console.error('Error updating organisation:', error);
        throw error;
    }
};

export const deleteOrg = async (orgId: number) => {
    try {
        const response = await axiosInstance.delete(`/organisations/${orgId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting organisation:', error);
        throw error;
    }
};

export const addOrgMember = async (orgId: number, userId: number) => {
    try {
        const org = await getOrgById(orgId);
        const updatedMembers = [...(org.members || []), userId];
        const response = await axiosInstance.patch(`/organisations/${orgId}`, {
            members: updatedMembers
        });
        await axiosInstance.patch(`/users/${userId}`, {
            organisationId: orgId
        });
        return response.data;
    } catch (error) {
        console.error('Error adding organisation member:', error);
        throw error;
    }
};

export const removeOrgMember = async (orgId: number, userId: number) => {
    try {
        const org = await getOrgById(orgId);
        
        const updatedMembers = (org.members || []).filter(
            (memberId: number) => memberId !== userId
        );
        
        const response = await axiosInstance.patch(`/organisations/${orgId}`, {
            members: updatedMembers
        });

        await axiosInstance.patch(`/users/${userId}`, {
            organisationId: undefined
        });

        return response.data;
    } catch (error) {
        console.error('Error removing organisation member:', error);
        throw error;
    }
};

export const getOrgMembers = async (orgId: number): Promise<User[]> => {
    try {
        const org = await getOrgById(orgId);
        
        if (!org.members || org.members.length === 0) {
            return [];
        }
        const membersPromises = org.members.map(async (userId: number) => {
            try {
                const response = await axiosInstance.get(`/users/${userId}`);
                return response.data;
            } catch (error) {
                console.error(`Error fetching user ${userId}:`, error);
                return null;
            }
        });

        const members = await Promise.all(membersPromises);
        return members.filter(Boolean);
    } catch (error) {
        console.error('Error fetching organisation members:', error);
        throw error;
    }
};

export const searchOrgMembers = async (orgId: number, searchTerm: string): Promise<User[]> => {
    try {
        const members = await getOrgMembers(orgId);
        
        return members.filter(member => 
            member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
    } catch (error) {
        console.error('Error searching organisation members:', error);
        throw error;
    }
};

const orgServices = {
    createOrg,
    getOrgById,
    getAllOrgs,
    updateOrg,
    deleteOrg,
    addOrgMember,
    removeOrgMember,
    getOrgMembers,
    searchOrgMembers
};

export default orgServices;