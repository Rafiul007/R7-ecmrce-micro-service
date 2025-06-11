import { Router } from "express";
import expressProxy from "express-http-proxy";
import { services } from "../config/services";

const router = Router();

Object.entries(services).forEach(([serviceName, targetUrl]) => {
  if (!targetUrl) {
    console.warn(`⚠️ Skipping ${serviceName}: No target URL defined.`);
    return;
  }

  router.use(`/${serviceName}`, expressProxy(targetUrl));
});

export default router;
