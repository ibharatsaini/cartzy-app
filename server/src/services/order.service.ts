import { OrderStatus, Payment, PaymentStatus, Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import prisma from "./prismaClient";
import { CreateOrderDTO, PaymentDetails } from "../types";
import { AppError } from "../middleware/errorHandler";
import { NextFunction } from "express";
import { emailService } from "./email.service";

const generateOrderNumber = () => {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `ORD-${timestamp}-${random}`;
};

const processPayment = async (
  total: number,
  payment: PaymentDetails,
  simulateOutcome: number
) => {
  switch (simulateOutcome) {
    case 2:
      return {
        success: false,
        error: `Transaction declined.`,
        code: "TRANSACTION_DECLINED",
      };
    case 3:
      return {
        success: false,
        error: "Gateway Failure",
        code: "GATEWAY_FAILURE",
      };
    default:
      return {
        success: true,
        lastFour: payment.cardNumber.slice(-4),
      };
  }
};

const validateOrderItems = async (items: CreateOrderDTO["items"]) => {
  const validatedItems = await Promise.all(
    items.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          variants: {
            where: { id: item.variantId },
          },
        },
      });

      if (!product) {
        throw new AppError(
          404,
          `Product not found: ${item.productId}`,
          "PRODUCT_NOT_FOUND"
        );
      }

      const variant = product.variants[0];
      if (!variant) {
        throw new AppError(
          404,
          `Variant not found: ${item.variantId}`,
          "VARIANT_NOT_FOUND"
        );
      }

      return {
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: variant.price,
      };
    })
  );

  return validatedItems;
};

const calculateOrderTotals = (
  items: Array<{ price: number; quantity: number }>
) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 15.99;
  const total = subtotal + tax + shipping;

  return { subtotal, tax, shipping, total };
};

export const orderService = {
  async createOrder(orderData: CreateOrderDTO, next: NextFunction) {
    const { customer, payment, items, simulateOutcome } = orderData;

    try {
      // Validate order items and get correct prices
      const validatedItems = await validateOrderItems(items);

      // Calculate totals
      const { subtotal, tax, shipping, total } =
        calculateOrderTotals(validatedItems);

      // Process payment
      const paymentResult = await processPayment(
        total,
        payment,
        simulateOutcome
      );

      // Create customer
      const customerRecord = await prisma.customer.create({
        data: customer,
      });

      // Create order with basic info
      const order = await prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          status: OrderStatus.APPROVED,
          customerId: customerRecord.id,
        },
      });

      // Create order items
      await prisma.orderItem.createMany({
        data: validatedItems.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      //update inventory
      await Promise.all([
        ...validatedItems.map((item) =>
          prisma.product.update({
            where: {
              id: item.productId,
            },
            data: {
              inventory: {
                decrement: item.quantity,
              },
            },
          })
        ),
      ]);

      // Create payment record
      if (paymentResult.success) {
        await prisma.payment.create({
          data: {
            orderId: order.id,
            total,
            subtotal,
            tax,
            shipping,
            status: PaymentStatus.COMPLETED,
            lastFour: paymentResult.lastFour!,
          },
        });
      } else {
        await prisma.payment.create({
          data: {
            orderId: order.id,
            total,
            subtotal,
            tax,
            shipping,
            status: PaymentStatus.PENDING,
          },
        });
        const orderStatus =
          paymentResult.error == "TRANSACTION_DECLINED"
            ? "DECLINED"
            : paymentResult.error == "GATEWAY_FAILURE"
            ? "ERROR"
            : "PENDING";
        await prisma.order.update({
          where: {
            id: order.id,
          },
          data: {
            status: orderStatus,
          },
        });
      }

      // Fetch complete order with all relations
      const completeOrder = await prisma.order.findUnique({
        where: { id: order.id },
        include: {
          customer: true,
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
          payment: true,
        },
      });

      if (!completeOrder) {
        throw new AppError(
          500,
          "Failed to fetch complete order",
          "ORDER_ERROR"
        );
      }

      const emailSent = await emailService.sendOrderEmail(completeOrder, next);

      if (!emailSent)
        throw new AppError(505, `Could not send email`, "EMAIL_NOT_SENT");

      return completeOrder;
    } catch (error) {
      // If any step fails, throw the error to be handled by the error middleware
      throw error;
    }
  },

  async getOrderById(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!order) {
      throw new AppError(404, "Order not found", "ORDER_NOT_FOUND");
    }

    return order;
  },

  async retryPayment(orderId: string, paymentDetail: PaymentDetails) {
    try {
      const details = await prisma.payment.findUnique({
        where: {
          orderId,
        },
      });
      if (!details)
        throw new AppError(
          404,
          `Payment details not found.`,
          "PAYMENT_NOT_FOUND"
        );
      const paymentResult = processPayment(details?.total, paymentDetail, 1);

      const payment = await prisma.payment.update({
        where: {
          id: details.id,
        },
        data: {
          status: PaymentStatus.COMPLETED,
        },
      });

      if (!payment)
        throw new AppError(
          500,
          "payment not completed.",
          "PAYMENT_NOT_COMPLETED"
        );
      const completeOrder = await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: OrderStatus.APPROVED,
        },
        include: {
          customer: true,
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
          payment: true,
        },
      });
      return completeOrder;
    } catch (err) {
      throw err;
    }
  },
};
