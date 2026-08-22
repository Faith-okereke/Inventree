import { OrderMutationInput } from "@/lib/data/types";
import { api } from "./client";


export const getOrders = async () => {
  const response = await api.get("/orders/all");
  return response.data;
};

export const getOrderById = async (id: string | undefined) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (orderData: OrderMutationInput) => {
  const response = await api.post("/orders/create", orderData);
  return response.data;
};

export const updateOrder = async (
  id: string,
  orderData: OrderMutationInput,
) => {
  const response = await api.patch(`/orders/${id}`, orderData);
  return response.data;
};

export const deleteOrder = async (id: string) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};
