import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';
import { globalErrorHandler } from './utils/error-handler';
import morgan from 'morgan';
import customerRoutes from './routes/customer.routes';
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

// app.get('/', getAuthStatus);

// app.use('/', authRoutes);

app.use(globalErrorHandler);

app.use('/api/customer', customerRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ IAM running on port ${PORT}`);
});
