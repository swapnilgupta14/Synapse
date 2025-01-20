import axiosInstance from "../axiosInstance";

export const userServices = {
  getAllUsers: async () => {
    const response = await axiosInstance.get("/users");
    return response.data;
  },

  getUserById: async (userId: number) => {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId: number, updateData: any) => {
    const existingUser = await axiosInstance.get(`/users/${userId}`);
    const updatedUser = {
      ...existingUser.data,
      ...updateData,
    };
    const response = await axiosInstance.put(`/users/${userId}`, updatedUser);
    return response.data;
  },

  deleteUser: async (userId: number) => {
    await axiosInstance.delete(`/users/${userId}`);
    return userId;
  },
};

export default userServices;
