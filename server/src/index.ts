import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { productRoutes } from './routes/product.routes';
import { errorHandler } from './middleware/errorHandler';


dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Vite's default port
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

app.use('/api/products', productRoutes);

app.use(errorHandler)


app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});