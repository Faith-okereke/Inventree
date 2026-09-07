import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  type ProductMutationInput,
} from "../services/product.service";
import { T_ApiResponse } from "./types";
import { ProductResponse } from "@/lib/data/types";
import { getApiErrorMessage } from "@/lib/api/errors";

export const useGetAllProducts = (page = 1, pageSize = 5) => {
  const query = useQuery<T_ApiResponse<ProductResponse[]>>({
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
  const query = useQuery<T_ApiResponse<ProductResponse>>({
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

  return useMutation<T_ApiResponse<ProductResponse>, unknown, ProductMutationInput>({
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

  return useMutation<T_ApiResponse<ProductResponse>, unknown, ProductMutationInput>({
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
