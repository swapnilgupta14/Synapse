import axiosInstance from "./axiosInstance";
import { User, Organisation } from "../types";

export const fetchFeatures = async () => {
  try {
    const response = await axiosInstance.get("/features");
    return response.data;
  } catch (error) {
    console.error("Error fetching features:", error);
    throw error;
  }
};

export const fetchQuickLinks = async () => {
  try {
    const response = await axiosInstance.get("/quickLinks");
    return response.data;
  } catch (error) {
    console.error("Error fetching quick links:", error);
    throw error;
  }
};

export const fetchSocialLinks = async () => {
  try {
    const response = await axiosInstance.get("/socialLinks");
    return response.data;
  } catch (error) {
    console.error("Error fetching social links:", error);
    throw error;
  }
};

export const createUser = async (userData: Omit<User, "id">) => {
  try {
    const response = await axiosInstance.post("/users", userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const createOrganisation = async (orgData: Omit<Organisation, "id">) => {
  try {
    const response = await axiosInstance.post("/organisations", orgData);
    return response.data;
  } catch (error) {
    console.error("Error creating organisation:", error);
    throw error;
  }
};

export const getUserByCredentials = async (
  username: string,
  password: string
) => {
  try {
    const response = await axiosInstance.get(
      `/users?username=${username}&password=${password}`
    );
    return response.data[0] || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const getOrgByCredentials = async (
  username: string,
  password: string
) => {
  try {
    const response = await axiosInstance.get(
      `/organisations?username=${username}&password=${password}`
    );
    return response.data[0] || null;
  } catch (error) {
    console.error("Error fetching organisation:", error);
    throw error;
  }
};

export const verifyOrgToken = async (token: string) => {
  try {
    const response = await axiosInstance.get(`/organisations?token=${token}`);
    console.log("response 77", response);
    return response.data[0] || null;
  } catch (error) {
    console.error("Error verifying organisation token:", error);
    throw error;
  }
};

export const verifyToken = async (token: string) => {
  try {
    const response = await axiosInstance.get(`/users?token=${token}`);
    return response.data[0] || null;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw error;
  }
};

export const fetchImage = async () => {
  try {
    const response = await axiosInstance.get("/image");
    return response.data;
  } catch (error) {
    console.error("Error fetching image:", error);
    throw error;
  }
};
