import { Customer, Order, OrderItem, Payment } from "@prisma/client";
import { NextFunction } from "express";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '2525'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});


const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getOrderConfirmationTemplate = (
  order: Order & {
    customer: Customer;
    items: (OrderItem & {
      product: { title: string };
      variant: { name: string; price: number };
    })[];
  }
) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1a73e8; margin: 0;">Order Confirmed!</h1>
        <p style="font-size: 18px; color: #666;">Thank you for shopping with us</p>
      </div>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="margin-top: 0; color: #1a73e8;">Order Details</h2>
        <p style="margin: 5px 0;">Order Number: <strong>#${
          order.orderNumber
        }</strong></p>
        <p style="margin: 5px 0;">Order Date: <strong>${
          order.createdAt
        }}</strong></p>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color: #1a73e8;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Product</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (item) => `
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">
                  <div style="font-weight: bold;">${item.product.title}</div>
                  <div style="color: #666; font-size: 14px;">${item.variant.name}</div>
                </td>
                <td style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6;">
                  ${item.quantity}
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #1a73e8;">Shipping Details</h3>
        <p style="margin: 5px 0;"><strong>${
          order.customer.fullName
        }</strong></p>
        <p style="margin: 5px 0;">${order.customer.address}</p>
        <p style="margin: 5px 0;">${order.customer.city}, ${
    order.customer.state
  } ${order.customer.zipCode}</p>
        <p style="margin: 5px 0;">${order.customer.email}</p>
        <p style="margin: 5px 0;">${order.customer.phoneNumber}</p>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
        <p style="color: #666;">Questions about your order?</p>
        <p style="margin: 5px 0;">Email us at support@example.com</p>
        <p style="margin: 5px 0;">Call us at 1-800-EXAMPLE</p>
      </div>
    </div>
  `;
};

const getOrderProcessingTemplate = (
  order: Order & {
    customer: Customer;
    items: (OrderItem & {
      product: { title: string };
      variant: { name: string; price: number };
    })[];
  }
) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #fb8c00; margin: 0;">Order Processing</h1>
        <p style="font-size: 18px; color: #666;">We're working on your order</p>
      </div>

      <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="margin-top: 0; color: #fb8c00;">Order Details</h2>
        <p style="margin: 5px 0;">Order Id: <strong>#${order.id}</strong></p>
        <p style="margin: 5px 0;">Order Date: <strong>${
          order.createdAt
        }</strong></p>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color: #fb8c00;">Items in Your Order</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #fff3e0;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ffe0b2;">Product</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ffe0b2;">Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (item) => `
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ffe0b2;">
                  <div style="font-weight: bold;">${item.product.title}</div>
                  <div style="color: #666; font-size: 14px;">${item.variant.name}</div>
                </td>
                <td style="padding: 12px; text-align: center; border-bottom: 1px solid #ffe0b2;">
                  ${item.quantity}
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #fb8c00;">Shipping Details</h3>
        <p style="margin: 5px 0;"><strong>${
          order.customer.fullName
        }</strong></p>
        <p style="margin: 5px 0;">${order.customer.address}</p>
        <p style="margin: 5px 0;">${order.customer.city}, ${
    order.customer.state
  } ${order.customer.zipCode}</p>
        <p style="margin: 5px 0;">${order.customer.email}</p>
        <p style="margin: 5px 0;">${order.customer.phoneNumber}</p>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ffe0b2;">
        <p style="color: #666;">Need assistance?</p>
        <p style="margin: 5px 0;">Email us at support@example.com</p>
        <p style="margin: 5px 0;">Call us at 1-800-EXAMPLE</p>
      </div>
    </div>
  `;
};

const getOrderIssueTemplate = (
  order: Order & {
    customer: Customer;
    items: (OrderItem & {
      product: { title: string };
      variant: { name: string; price: number };
    })[];
  }
) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #d32f2f; margin: 0;">Order Status Update</h1>
        <p style="font-size: 18px; color: #666;">We encountered an issue with your order</p>
      </div>

      <div style="background-color: #ffebee; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="margin-top: 0; color: #d32f2f;">Order Details</h2>
        <p style="margin: 5px 0;">Order Number: <strong>#${
          order.id
        }</strong></p>
        <p style="margin: 5px 0;">Order Date: <strong>${
          order.createdAt
        }</strong></p>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color: #d32f2f;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #ffebee;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ffcdd2;">Product</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ffcdd2;">Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (item) => `
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ffcdd2;">
                  <div style="font-weight: bold;">${item.product.title}</div>
                  <div style="color: #666; font-size: 14px;">${item.variant.name}</div>
                </td>
                <td style="padding: 12px; text-align: center; border-bottom: 1px solid #ffcdd2;">
                  ${item.quantity}
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div style="background-color: #ffebee; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #d32f2f;">Customer Information</h3>
        <p style="margin: 5px 0;"><strong>${
          order.customer.fullName
        }</strong></p>
        <p style="margin: 5px 0;">${order.customer.email}</p>
        <p style="margin: 5px 0;">${order.customer.phoneNumber}</p>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ffcdd2;">
        <p style="color: #666;">Need immediate assistance?</p>
        <p style="margin: 5px 0;">Email us at support@example.com</p>
        <p style="margin: 5px 0;">Call us at 1-800-EXAMPLE</p>
        <p style="margin: 15px 0; font-style: italic;">Our customer service team is ready to help resolve any issues with your order.</p>
      </div>
    </div>
  `;
};

const sendOrderEmail = async (
  order: Order & {
    customer: Customer;
    items: (OrderItem & {
      product: { title: string };
      variant: { name: string; price: number };
    })[];
  },
  next: NextFunction
) => {
  try {
    let subject = "";
    let htmlContent = "";

    switch (order.status) {
      case "APPROVED":
        subject = `Order Confirmed: #${order.orderNumber}`;
        htmlContent = getOrderConfirmationTemplate(order);
        break;
      case "PENDING":
        subject = `Order Processing: #${order.orderNumber}`;
        htmlContent = getOrderProcessingTemplate(order);
        break;
      case "DECLINED":
        subject = `Order Declined: #${order.orderNumber}`;
        htmlContent = getOrderIssueTemplate(order);
        break;
      case "ERROR":
        subject = `Important Update: Order #${order.orderNumber}`;
        htmlContent = getOrderIssueTemplate(order);
        break;
    }

    const sent = await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@example.com",
      to: order.customer.email,
      subject,
      html: htmlContent,
    });
    // if(!sent) new Error("Email not sent!")
    return sent;
  } catch (error) {
    next(error)
  }
};

export const emailService = {
  sendOrderEmail,
};
