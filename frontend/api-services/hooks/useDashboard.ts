import toast from "react-hot-toast";
import { getDashboardData } from "../services/dashboard.service";
import type { ApiResponse } from "@/types/api";
import type { DashboardData } from "@/types/dashboard";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboard = () => {
  const query = useQuery<ApiResponse<DashboardData>>({
    queryKey: ["getDashboardData"],
    queryFn: () => getDashboardData(),
  });

  if (query.isError) {
    const errorMessage = getApiErrorMessage(query.error);
    toast.error(errorMessage);
  }

  return { ...query, data: query.data?.data };
};