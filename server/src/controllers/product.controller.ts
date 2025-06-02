import { NextFunction, Request, Response } from "express";
import prisma from "../services/prismaClient";
import { AppError } from "../middleware/errorHandler";

export const productController = {
  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await prisma.product.findMany({
        include: {
          variants: true,
        },
      });

      res.json({
        success: true,
        data: products,
      });
    } catch (err) {
      next(err);
    }
  },

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError(400, "Product ID is required", "MISSING_ID");
      }

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          variants: true,
        },
      });

      if (!product) {
        throw new AppError(404, "Product not found", "PRODUCT_NOT_FOUND");
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (err) {
      next(err);
    }
  },
};
