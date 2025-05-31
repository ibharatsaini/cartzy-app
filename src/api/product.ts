import { api, handleApiError } from "../lib/api";
import { ApiResponse, Product } from "../types";

export const productApi = {
  async getProducts(): Promise<ApiResponse<Product[]>> {
    try {
      const { data } = await api.get<ApiResponse<Product[]>>("/products");
      return data;
    } catch (error) {
      return handleApiError(error, "Failed to fetch products");
    }
  },
};
