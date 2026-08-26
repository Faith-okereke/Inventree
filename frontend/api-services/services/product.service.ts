import { api } from "./client";


export interface ProductMutationInput {
  sku: string;
  name: string;
  description: string;
  price: number;
  quantityInStock: number;
  image: string;
}

export const getProducts = async (page=1, pageSize=10) => {
  const response = await api.get("/products/all", {
    params: { page, pageSize }
  });
  return response.data;
};

export const getProductById = async (id: string | undefined) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (productData: ProductMutationInput) => {
  const response = await api.post("/products/create", productData);
  return response.data;
};

export const updateProduct = async (
  id: string,
  productData: ProductMutationInput,
) => {
  const response = await api.patch(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const searchProduct = async (query: string) => {
  const response = await api.get("/products/search", {
    params: { q: query },
  });
  return response.data;
};
