import { Router } from 'express';
import expressProxy from 'express-http-proxy';
import { services } from '../config/services';

const router = Router();

Object.entries(services).forEach(([serviceName, targetUrl]) => {
  router.use(
    `/${serviceName}`,
    expressProxy(targetUrl, {
      proxyReqBodyDecorator: (bodyContent) => bodyContent,
    }),
  );
});

export default router;
