import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { productRoutes } from "./routes/product.routes";
import { orderRoutes } from "./routes/order.routes";

import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

if (
  !process.env.DATABASE_URL ||
  !process.env.PUBLIC_KEY ||
  !process.env.PRIVATE_KEY ||
  !process.env.SMTP_PORT ||
  !process.env.SMTP_HOST ||
  !process.env.SMTP_PASS ||
  !process.env.SMTP_USER
) {
  console.log(!process.env.DATABASE_URL,
  !process.env.PUBLIC_KEY ,
  !process.env.PRIVATE_KEY ,
  !process.env.SMTP_PORT ,
  !process.env.SMRT_HOST ,
  !process.env.SMTP_PASS,
  !process.env.SMTP_USER)
  throw Error(`Please provide all env variables.`);
}

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173" , // Vite's default port
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    // credentials: true,
  })
);

app.use(express.json());

//Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/public-key", (req, res) => {
  const publicKey = process.env.PUBLIC_KEY;

  res.json({ success: true, data: publicKey });
});

//Error Handler
app.use(errorHandler);

app.get("/health", (req, res) => {
  console.log(req.headers)
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
