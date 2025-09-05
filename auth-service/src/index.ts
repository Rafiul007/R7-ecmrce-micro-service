import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';
import { globalErrorHandler } from './utils/error-handler';
import { getAuthStatus } from './controllers/auth.controller';
import authRoutes from './routes/auth.routes';
import morgan from 'morgan';
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

app.get('/', getAuthStatus);

app.use('/', authRoutes);

app.use(globalErrorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Auth Service running on port ${PORT}`);
});
