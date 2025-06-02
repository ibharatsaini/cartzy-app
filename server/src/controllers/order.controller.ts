import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { orderService } from "../services/order.service";
import { AppError } from "../middleware/errorHandler";
import { decryptData } from "../utils/crypto";

const customerSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  phoneNumber: z.string().min(10).max(10),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  zipCode: z.string().min(5),
});

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/),
  cvv: z.string().regex(/^\d{3}$/),
});

const orderItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid(),
  quantity: z.number().int().positive(),
  // price: z.number().positive()
});

const createOrderSchema = z.object({
  customer: customerSchema,
  // payment: paymentSchema,
  payment: z.string(),
  items: z.array(orderItemSchema).min(1),
  simulateOutcome: z.number(),
});

const retryPaymentSchema = z.object({
  payment: z.string(),
  orderId: z.string(),
});
export const orderController = {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body);
      const {
        customer,
        payment: encryptedPayment,
        items,
        simulateOutcome,
      } = createOrderSchema.parse(req.body);

      let decryptedPayment = decryptData(encryptedPayment);
      decryptedPayment = JSON.parse(decryptedPayment);

      const payment = paymentSchema.parse(JSON.parse(decryptedPayment));

      const order = await orderService.createOrder(
        { customer, payment, items, simulateOutcome },
        next
      );

      res.status(201).json({
        success: true,
        data: order,
      });
    } catch (err) {
      next(err);
    }
  },

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError(400, "Order ID is required", "MISSING_ID");
      }

      const order = await orderService.getOrderById(id);

      res.json({
        success: true,
        data: order,
      });
    } catch (err) {
      next(err);
    }
  },
  async retryPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId, payment: encryptedPayment } = req.body;

      retryPaymentSchema.parse(req.body);
      let decryptedPayment = decryptData(encryptedPayment);
      decryptedPayment = JSON.parse(decryptedPayment);

      const paymentDetails = paymentSchema.parse(JSON.parse(decryptedPayment));

      const payment = await orderService.retryPayment(orderId, paymentDetails);

      res.json({
        success: true,
        data: payment,
      });
    } catch (err) {
      next(err);
    }
  },
};
