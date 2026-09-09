import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../services/product.service";
import type { ApiResponse } from "@/types/api";
import type { ProductMutationInput, ProductResponse } from "@/types/products";
import { getApiErrorMessage } from "@/lib/api/errors";

export const useGetAllProducts = (page = 1, pageSize = 5) => {
  const query = useQuery<ApiResponse<ProductResponse[]>>({
    queryKey: ["getAllProducts", page, pageSize],
    queryFn: () => getProducts(page, pageSize),
  });

  if (query.isError) {
    const errorMessage = getApiErrorMessage(query.error);
    toast.error(errorMessage);
  }

  return { ...query, data: query.data?.data ?? [], pagination: query.data?.pagination };
};

export const useGetProductsById = (productId: string | undefined) => {
  const query = useQuery<ApiResponse<ProductResponse>>({
    queryKey: ["getProductsById", productId],
    queryFn: () => getProductById(productId),
    enabled: Boolean(productId),
    retry: 1,
  });

  if (query.isError) {
    const errorMessage = getApiErrorMessage(query.error);
    toast.error(errorMessage);
  }

  return { ...query, data: query.data?.data };
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<ProductResponse>, unknown, ProductMutationInput>({
    mutationFn: (productData: ProductMutationInput) => createProduct(productData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getAllProducts"] });
      toast.success("Product created successfully");
    },
    onError: (error: unknown) => {
      const errorMessage = getApiErrorMessage(error);
      console.error("API ERROR DETAILS:", error);
      toast.error(errorMessage);
    },
  });
};

export const useUpdateProduct = (id: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<ProductResponse>, unknown, ProductMutationInput>({
    mutationFn: (productData: ProductMutationInput) => {
      if (!id) throw new Error("Missing product id");
      return updateProduct(id, productData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getAllProducts"] });
      toast.success("Product updated successfully");
    },
    onError: (error: unknown) => {
      const errorMessage = getApiErrorMessage(error);
      console.error("API ERROR DETAILS:", error);
      toast.error(errorMessage);
    },
  });
};

export const useUpdateProducts = useUpdateProduct;

export const useDeleteProducts = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllProducts"] });
      toast.success("Product deleted successfully");
    },
    onError: (error: unknown) => {
      const errorMessage = getApiErrorMessage(error);
      console.error("API ERROR DETAILS:", error);
      toast.error(errorMessage);
    },
  });
};
