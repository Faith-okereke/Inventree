import { OrderListResponse, OrderMutationInput, } from "@/lib/data/types";
import { T_ApiResponse } from "./types";
import { createOrder, getOrders, updateOrder } from "../services/order.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/api/errors";

export const useGetAllOrders = (page = 1, pageSize = 5, status?: string) => {
  const query = useQuery<T_ApiResponse<OrderListResponse[]>>({
    queryKey: ["getAllOrders", page, pageSize, status],
    queryFn: () => getOrders(page, pageSize, status),
  });

  if (query.isError) {
    const errorMessage = getApiErrorMessage(query.error);
    toast.error(errorMessage);
  }

  return { ...query, data: query.data?.data || [], pagination: query.data?.pagination };
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<T_ApiResponse<OrderListResponse>, unknown, OrderMutationInput>({
    mutationFn: (orderData: OrderMutationInput) => createOrder(orderData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getAllOrders"] });
      toast.success("Order created successfully");
    },
    onError: (error: unknown) => {
      const errorMessage = getApiErrorMessage(error);
      console.error("API ERROR DETAILS:", error);
      toast.error(errorMessage);
    },
  });
};

export const useEditOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<T_ApiResponse<OrderListResponse>, unknown, { id: string, status: string }>({
    mutationFn: ({ id, status }) => updateOrder(id, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getAllOrders"] });
    },
    onError: (error: unknown) => {
      const errorMessage = getApiErrorMessage(error);
      console.error("API ERROR DETAILS:", error);
      toast.error(errorMessage);
    }
  })
}