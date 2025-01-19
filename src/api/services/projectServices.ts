import axiosInstance from '../axiosInstance';

export const getProjects = async () => {
    try {
        const response = await axiosInstance.get('/projects');
        return response.data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

export const getProjectById = async (projectId: number) => {
    try {
        const response = await axiosInstance.get(`/projects/${projectId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching project:', error);
        throw error;
    }
}; 