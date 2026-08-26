import { api } from "./client";
import type { User } from "@/lib/data/types";
import type { T_ApiResponse } from "../hooks/types";

type UserFilters = {
    search?: string;
    role?: string;
    status?: string;
};

type UserLike = {
    deletedAt?: string | null;
    role?: string;
    active?: boolean;
    [key: string]: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const normalizeUser = <T extends UserLike>(user: T) => ({
    ...user,
    active: (user.active ?? user.deletedAt) === null || user.deletedAt === undefined,
});

type UsersResponse = T_ApiResponse<User[]>;
type UserResponse = T_ApiResponse<User>;

function normalizeResponse(payload: UsersResponse): UsersResponse;
function normalizeResponse(payload: UserResponse): UserResponse;
function normalizeResponse(payload: unknown): UsersResponse | UserResponse | unknown {
    if (!isRecord(payload)) return payload;

    if (Array.isArray(payload.data)) {
        return {
            ...payload,
            data: payload.data.map((user) =>
                isRecord(user) ? normalizeUser(user as UserLike) : user,
            ),
        } as UsersResponse;
    }

    if (isRecord(payload.data)) {
        return {
            ...payload,
            data: normalizeUser(payload.data as UserLike),
        } as unknown as UserResponse;
    }

    return payload;
}

export const getAllUsers = async (page = 1, pageSize = 10, filters: UserFilters = {}) => {
    const role = filters.role?.trim().toLowerCase();
    const status = filters.status?.trim().toLowerCase();
    const search = filters.search?.trim();
    const response = await api.get("/users/all", {
        params: {
            page,
            pageSize,
            ...(search ? { search } : {}),
            ...(role && role !== "all" ? { role } : {}),
            ...(status && status !== "all" ? { status } : {}),
        },
    });

    return normalizeResponse(response.data as UsersResponse);
};

export const getUsersById = async (userId: string | undefined) => {
    const response = await api.get(`users/${userId}`);
    return normalizeResponse(response.data as UserResponse);
};

export const deleteUser = async (userId: string | undefined) => {
    const response = await api.delete(`users/${userId}`)
    return response.data
}
