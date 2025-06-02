import { Router } from "express";
import { orderController } from "../controllers/order.controller";

const router = Router();

router.post("/", orderController.createOrder);
router.get("/:id", orderController.getOrderById);
router.post("/retry-payment", orderController.retryPayment);

export const orderRoutes = router;
