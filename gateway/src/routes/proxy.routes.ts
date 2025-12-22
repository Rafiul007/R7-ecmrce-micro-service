import { Router } from 'express';
import expressProxy from 'express-http-proxy';
import { services } from '../config/services';

const router = Router();

Object.entries(services).forEach(([serviceName, targetUrl]) => {
  router.use(
    `/${serviceName}`,
    expressProxy(targetUrl, {
      // Preserve request body (VERY important)
      proxyReqBodyDecorator: (bodyContent) => bodyContent,

      // Ensure headers survive the trip
      proxyReqOptDecorator: (proxyReqOpts) => {
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        return proxyReqOpts;
      },

      // Ensure response body + CORS headers reach browser
      userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        userRes.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        userRes.setHeader('Access-Control-Allow-Credentials', 'true');
        return proxyResData;
      },
    }),
  );
});

export default router;
