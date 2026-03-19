import express from 'express';
import dotenv from 'dotenv';
// import cors from 'cors';
import { connectDB } from './config/db';
import { globalErrorHandler } from './utils/error-handler';
import morgan from 'morgan';
import customerRoutes from './routes/customer.routes';
import employeeRoutes from './routes/employee.routes';
import authRoutes from './routes/auth.routes';
import { setupSwagger } from './config/swagger';

dotenv.config();
connectDB();

const app = express();

// app.use(
//   cors({
//     origin: ['http://localhost:4000', 'http://localhost:5173', 'http://localhost:3000'],
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
//   })
// );

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 Enable Swagger Docs
setupSwagger(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/staff', employeeRoutes);

// Error Handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 IAM running on port ${PORT}`);
});
