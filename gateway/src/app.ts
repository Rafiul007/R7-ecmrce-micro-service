import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import proxyRoutes from './routes/proxy.routes';

dotenv.config();

const app = express();

/* =======================
   CORS (GLOBAL)
======================= */
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(morgan('dev'));

/* =======================
   PROXY FIRST (RAW STREAM)
======================= */
app.use('/', proxyRoutes);

/* =======================
   BODY PARSERS AFTER PROXY
======================= */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

export default app;
