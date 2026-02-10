import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

export const setupSwagger = (app: Express) => {
  const port = process.env.PORT || 4000;

  const options: swaggerJsDoc.Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Gateway API',
        version: '1.0.0',
        description:
          'Unified API documentation for all services via the gateway. All paths are prefixed with the service name.',
      },
      servers: [
        {
          url: process.env.SWAGGER_SERVER_URL || `http://localhost:${port}`,
          description: 'Gateway',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    apis: ['./src/docs/**/*.ts'],
  };

  const swaggerSpec = swaggerJsDoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log(`📘 Gateway Swagger docs available at → http://localhost:${port}/api-docs`);
};
