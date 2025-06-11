import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import expressProxy from "express-http-proxy";
import proxyRoutes from "./routes/proxy.routes";
const app = express();
dotenv.config();
import morgan from "morgan";

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", proxyRoutes);

export default app;
