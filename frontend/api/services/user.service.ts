import { api } from "./client";

export const getAllUsers = async (page=1, pageSize=10) => {
    const response = await api.get("/users/all", {
        params: { page, pageSize }
    });
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