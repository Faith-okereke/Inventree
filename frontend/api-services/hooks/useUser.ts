import { useQuery } from "@tanstack/react-query";
import { getAllUsers, getUsersById } from "../services/user.service";
import type { ApiResponse } from "@/types/api";
import toast from "react-hot-toast";
import type { UserResponse } from "@/types/users";
import { getApiErrorMessage } from "@/lib/api/errors";

export const useGetAllUsers = (
  page = 1,
  pageSize = 10,
  search?: string,
  role?: string,
  status?: string,
) => {
  const query = useQuery<ApiResponse<UserResponse[]>>({
    queryKey: ["getAllUsers", page, pageSize, search, role, status],
    queryFn: () => getAllUsers(page, pageSize, { search, role, status }),
  });

  if (query.isError) {
    const errorMessage = getApiErrorMessage(query.error);
    toast.error(errorMessage);
  }

  return { ...query, data: query.data?.data ?? [], pagination: query.data?.pagination };
};

export const useGetUsersById = (userId: string | undefined) => {
  const query = useQuery<ApiResponse<UserResponse>>({
    queryKey: ["getUsersById", userId],
    queryFn: () => getUsersById(userId),
    enabled: Boolean(userId),
    retry: 1,
  });

  if (query.isError) {
    const errorMessage = getApiErrorMessage(query.error);
    toast.error(errorMessage);
  }

  return { ...query, data: query.data?.data };
};
