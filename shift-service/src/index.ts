import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import { connectDB } from './config/db';
import { globalErrorHandler } from './utils/error-handler';
import { setupSwagger } from './config/sweager';

import shiftRoutes from './routes/shift.routes';
import cashMovementRoutes from './routes/cashMovement.routes';

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

// 🔥 Swagger Docs
setupSwagger(app);

// Test Route
app.get('/test', (_req, res) => res.send('shift-service is running ✅'));

// API Routes
app.use('/shifts', shiftRoutes);
app.use('/cash-movements', cashMovementRoutes);

// Global Error Handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
console.log(`🚀 shift-service running on port ${PORT}`);
});
