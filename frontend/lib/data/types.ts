export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type UserRole = "Admin" | "Staff";

export interface ProductResponse {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number | string;
  quantityInStock: number;
  image: string;
}

export interface OrderUser {
  id: string;
  name: string;
  email: string;
}

export interface OrderListResponse {
  id: string;
  userId: string;
  status: OrderStatus;
  createdAt: string;
  user: OrderUser;
  orderItems: OrderItem[];
}

/**
 * Represents the API response for a list of orders.
 */

export interface OrderItemProduct {
  id: string;
  name: string;
  price: number;
  sku: string;
}
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceAtOrder: number;
  product: OrderItemProduct;
}
export interface OrderCreationItem {
  productId: string;
  quantity: number;
}

export interface OrderMutationInput {
  items: OrderCreationItem[];
}


export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  deletedAt: string | null;
  updatedAt: string;
}

export interface StatCard {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "success" | "warn" | "danger";
  icon: string;
}

export interface LowStockAlert {
  sku: string;
  name: string;
  currentQty: number;
  reorderPoint: number;
  status: StockStatus | "Stock Out";
}

export interface TopProduct {
  name: string;
  units: number;
}

export interface OrderStatusSlice {
  label: string;
  percent: number;
  colorVar: string;
}
