import toast from "react-hot-toast";
import { getDashboardData } from "../services/dashboard.service";
import { T_ApiResponse } from "./types";
import { getErrorMessage } from "./useProducts";
import { useQuery } from "@tanstack/react-query";

export interface DashboardData {
  summary: {
    totalOrders: number;
    totalRevenue: number;
  };
  ordersByStatus: Record<string, number>;
  topProducts: Array<{
    productId: string;
    name: string;
    sku: string;
    totalQuantity: number;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    sku: string;
    quantityInStock: number;
  }>;
}

export const useGetDashboard = () => {
  const query = useQuery<T_ApiResponse<DashboardData>>({
    queryKey: ["getDashboardData"],
    queryFn: () => getDashboardData(),
  });

  if (query.isError) {
    const errorMessage = getErrorMessage(query.error);
    toast.error(errorMessage);
  }

  return { ...query, data: query.data?.data };
};