import { api } from "./client";
import type { ApiResponse } from "@/types/api";
import type { UserResponse } from "@/types/users";

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

type UsersResponse = ApiResponse<UserResponse[]>;
type SingleUserResponse = ApiResponse<UserResponse>;

function normalizeResponse(payload: UsersResponse): UsersResponse;
function normalizeResponse(payload: SingleUserResponse): SingleUserResponse;
function normalizeResponse(payload: unknown): UsersResponse | SingleUserResponse | unknown {
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
        } as unknown as SingleUserResponse;
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
    return normalizeResponse(response.data as SingleUserResponse);
};

export const deleteUser = async (userId: string | undefined) => {
    const response = await api.delete(`users/${userId}`)
    return response.data
}
