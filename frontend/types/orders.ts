export type OrderStatus = "pending" | "fulfilled" | "cancelled";

export interface OrderItemProduct {
  id: string;
  name: string;
  price: number | string;
  sku: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceAtOrder: number | string;
  product: OrderItemProduct;
}

export interface OrderMembershipUser {
  id: string;
  name: string;
  email: string;
}

export interface OrderMembership {
  id: string;
  role: "admin" | "staff";
  user: OrderMembershipUser;
}

export interface OrderResponse {
  id: string;
  businessId: string;
  membershipId: string;
  status: OrderStatus;
  createdAt: string;
  membership: OrderMembership;
  orderItems: OrderItem[];
}

export type OrderListResponse = OrderResponse;

export interface OrderMutationInput {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export interface OrderUpdate {
  status: OrderStatus;
}
