import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

import { connectDB } from './config/db';
import { globalErrorHandler } from './utils/error-handler';
import { setupSwagger } from './config/sweager';
// Routes
import categoryRoutes from './routes/category.routes';
import productRoutes from './routes/product.routes';

// Swagger Setup

dotenv.config();
connectDB();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 Swagger Docs
setupSwagger(app);

// Test Route
app.get('/test', (_req, res) => res.send('product-catalog-service is running ✅'));

// API Routes
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);

// Global Error Handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 product-catalog-service running on port ${PORT}`);
});
