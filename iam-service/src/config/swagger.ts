import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express, Request } from 'express';

const getBaseUrl = (req: Request) => {
  const forwardedProto = req.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const forwardedHost = req.get('x-forwarded-host')?.split(',')[0]?.trim();
  const forwardedPrefix = req.get('x-forwarded-prefix')?.trim().replace(/\/$/, '');

  const protocol = forwardedProto || req.protocol;
  const host = forwardedHost || req.get('host');

  return `${protocol}://${host}${forwardedPrefix || ''}`;
};

export const setupSwagger = (app: Express) => {
  const options: swaggerJsDoc.Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'IAM Service API',
        version: '1.0.0',
        description: 'API documentation for Identity and Access Management microservice'
      },
      servers: [
        {
          url: '/',
          description: 'IAM Service'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    apis: ['./src/routes/**/*.ts', './src/docs/**/*.ts']
  };

  const swaggerSpec = swaggerJsDoc(options);

  app.get('/api-docs/swagger.json', (req, res) => {
    res.json({
      ...swaggerSpec,
      servers: [
        {
          url: getBaseUrl(req),
          description: 'IAM Service'
        }
      ]
    });
  });

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(null, {
      swaggerOptions: {
        url: '/api-docs/swagger.json'
      }
    })
  );

  console.log('📘 Swagger docs available at → /api-docs');
};
