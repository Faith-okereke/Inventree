import { api } from "./client";

export const getAllUsers = async () => {
    const response = await api.get("/users/all");
    return response.data;
}
export const getUsersById = async (userId: string | undefined) => {
    const response = await api.get(`users/${userId}`)
    return response.data
}
export const deleteUser = async (userId: string | undefined) => {
    const response = await api.delete(`users/${userId}`)
    return response.data
}