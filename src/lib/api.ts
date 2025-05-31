import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { ApiResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    let message = "An unexpected error occurred";

    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        message = "Resource not found";
      } else if (status === 422) {
        message = "Invalid data provided";
      } else if (status === 429) {
        message = "Too many requests, please try again later";
      } else if (status >= 500) {
        message = "Server error occurred";
      }
    } else if (error.request) {
      if (error.code === "ECONNABORTED") {
        message = "Request timed out. Please check your connection";
      } else {
        message = "Unable to reach the server. Please check your connection";
      }
    }

    toast.error(message);
    return Promise.reject(error);
  }
);

export const handleApiError = (
  error: unknown,
  defaultMessage: string
): ApiResponse<never> => {
  console.error("API Error:", error);
  const message = error instanceof Error ? error.message : defaultMessage;

  return {
    success: false,
    error: {
      code: "API_ERROR",
      message,
    },
  };
};
