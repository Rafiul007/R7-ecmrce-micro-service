import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db';
import { globalErrorHandler } from './utils/error-handler';
import productRoutes from './routes/product.routes';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/test', (_req, res) => res.send('product-service is running ✅'));
app.use(globalErrorHandler);

app.use('/', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ product-service running on port ${PORT}`);
});
