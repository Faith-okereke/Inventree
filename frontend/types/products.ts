export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface ProductResponse {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number | string;
  quantityInStock: number;
  image: string;
  supplierEmail: string | null;
  lowStockThreshold: number;
}

export interface ProductMutationInput {
  sku: string;
  name: string;
  description: string;
  price: number;
  quantityInStock: number;
  image: string;
  supplierEmail: string;
  lowStockThreshold: number;
}
