import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db';
import { globalErrorHandler } from './utils/error-handler';
import categoryRoutes from './routes/category.routes';
import productRoutes from './routes/product.routes';
dotenv.config();
connectDB();

const app = express();
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/test', (_req, res) => res.send('product-catelog-service is running ✅'));
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ product-catelog-service running on port ${PORT}`);
});
