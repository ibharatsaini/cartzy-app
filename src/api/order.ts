import { api, handleApiError } from "../lib/api";
import {
  ApiResponse,
  CustomerDetails,
  Order,
  PaymentDetails,
  TransactionOutcome,
} from "../types";

export const orderApi = {
  async createOrder(
    customerDetails: CustomerDetails,
    paymentDetails: PaymentDetails,
    items: Array<{ productId: string; variantId: string; quantity: number }>,
    transactionOutcome: TransactionOutcome
  ): Promise<ApiResponse<Order>> {
    try {
      const { data } = await api.post<ApiResponse<Order>>("/orders", {
        customer: customerDetails,
        payment: paymentDetails,
        items,
        simulateOutcome: transactionOutcome,
      });

      return data;
    } catch (error) {
      return handleApiError(error, "Failed to create order");
    }
  },
};
