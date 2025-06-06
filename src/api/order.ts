import { api, handleApiError } from "../lib/api";
import { encryptData } from "../lib/crypto";
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
      const paymentDetail = await encryptData(JSON.stringify(paymentDetails));
      const { data } = await api.post<ApiResponse<Order>>("/orders", {
        customer: customerDetails,
        payment: paymentDetail,
        items,
        simulateOutcome: transactionOutcome,
      });

      return data;
    } catch (error) {
      return handleApiError(error, "Failed to create order");
    }
  },
  async retryPayment(orderId: string, paymentDetails: PaymentDetails) {
    try {
      const payment = await encryptData(JSON.stringify(paymentDetails));
      const { data } = await api.post<ApiResponse<Order>>(
        "/orders/retry-payment",
        {
          orderId,
          payment,
        }
      );
      return data;
    } catch (err) {
      return handleApiError(err, "Failed to make payment.");
    }
  },
};
