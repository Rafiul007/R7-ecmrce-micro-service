import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import proxyRoutes from './routes/proxy.routes';
import { setupSwagger } from './config/swagger';

dotenv.config();

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://r7-pos.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(morgan('dev'));

setupSwagger(app);
app.use('/', proxyRoutes);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

export default app;
