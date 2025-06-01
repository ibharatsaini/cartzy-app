import { api, handleApiError } from "../lib/api";
import { ApiResponse } from "../types";

export const publicKeyApi = {
  async getPublicKey(): Promise<ApiResponse<string>> {
    try {
      const { data } = await api.get("/public-key");
      return data;
    } catch (error) {
      return handleApiError(error, "Failed to fetch products");
    }
  },
};
