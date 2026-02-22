// lib/api/user.ts

import API from "@/lib/api"; // adjust path if needed

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
}

export const getUserProfile = async (): Promise<User> => {
  try {
    const response = await API.get("/auth/profile");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to fetch user" };
  }
};

export const getUserId = async (): Promise<string> => {
  const user = await getUserProfile();
  return user._id;
};
