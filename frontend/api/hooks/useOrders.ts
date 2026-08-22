import { OrderListResponse, OrderMutationInput,   } from "@/lib/data/types";
import { T_ApiResponse } from "./types";
import { createOrder, getOrders } from "../services/order.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function getErrorMessage(error: unknown): string {
  const response = error as { response?: { data?: { message?: unknown } } };
  const message = response?.response?.data?.message;

  if (typeof message === "string") return message;
  if (error instanceof Error) return error.message;
  return "Something went wrong, Please check connection";
}

export const useGetAllOrders = () => {
  const query = useQuery<T_ApiResponse<OrderListResponse[]>>({
    queryKey: ["getAllOrders"],
    queryFn: () => getOrders(),
  });

  if (query.isError) {
    const errorMessage = getErrorMessage(query.error);
    toast.error(errorMessage);
  }

  return { ...query, data: query.data?.data || [] };
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<T_ApiResponse<OrderListResponse>, unknown, OrderMutationInput>({
    mutationFn: (orderData) => createOrder(orderData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getAllOrders"] });
      toast.success("Order created successfully");
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      console.error("API ERROR DETAILS:", error);
      toast.error(errorMessage);
    },
  });
};
