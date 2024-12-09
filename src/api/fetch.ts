import axiosInstance from './axiosInstance';

export const fetchFeatures = async () => {
  try {
    const response = await axiosInstance.get('/features');
    return response.data;
  } catch (error) {
    console.error('Error fetching features:', error);
    throw error;
  }
};

export const fetchQuickLinks = async () => {
  try {
    const response = await axiosInstance.get('/quickLinks');
    return response.data;
  } catch (error) {
    console.error('Error fetching quick links:', error);
    throw error;
  }
};

export const fetchSocialLinks = async () => {
  try {
    const response = await axiosInstance.get('/socialLinks');
    return response.data;
  } catch (error) {
    console.error('Error fetching social links:', error);
    throw error;
  }
};
