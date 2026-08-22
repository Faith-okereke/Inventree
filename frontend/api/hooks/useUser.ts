import { useQuery } from "@tanstack/react-query";
import { getAllUsers, getUsersById } from "../services/user.service";
import { T_ApiResponse } from "./types";
import toast from "react-hot-toast";
import { User } from "@/lib/data/types";

function getErrorMessage(error: unknown): string {
  const response = error as { response?: { data?: { message?: unknown } } };
  const message = response?.response?.data?.message;

  if (typeof message === "string") return message;
  if (error instanceof Error) return error.message;
  return "Something went wrong, Please check connection";
}

export const useGetAllUsers = () => {
  const query = useQuery<T_ApiResponse<User[]>>({
    queryKey: ["getAllUsers"],
    queryFn: () => getAllUsers(),
  });

  if (query.isError) {
    const errorMessage = getErrorMessage(query.error);
    toast.error(errorMessage);
  }

  return { ...query, data: query.data?.data ?? [] };
};

export const useGetUsersById = (userId: string | undefined) => {
  const query = useQuery<T_ApiResponse<User>>({
    queryKey: ["getUsersById", userId],
    queryFn: () => getUsersById(userId),
    enabled: Boolean(userId),
    retry: 1,
  });

  if (query.isError) {
    const errorMessage = getErrorMessage(query.error);
    toast.error(errorMessage);
  }

  return { ...query, data: query.data?.data };
};