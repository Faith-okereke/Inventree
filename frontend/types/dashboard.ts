export interface DashboardTopProduct {
  productId: string;
  name: string;
  sku: string;
  totalQuantity: number;
}

export interface DashboardLowStockProduct {
  id: string;
  name: string;
  sku: string;
  quantityInStock: number;
}

export interface DashboardData {
  summary: {
    totalOrders: number;
    totalRevenue: number;
  };
  ordersByStatus: Record<string, number>;
  topProducts: DashboardTopProduct[];
  lowStockProducts: DashboardLowStockProduct[];
}
