export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";
export type OrderStatus = "PENDING" | "FULFILLED" | "CANCELLED";
export type UserRole = "Admin" | "Staff";

export interface Product {
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: StockStatus;
  icon: string;
  discontinued?: boolean;
}

export interface Order {
  id: string;
  date: string;
  customer: string;
  items: number;
  total: number;
  status: OrderStatus;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
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
