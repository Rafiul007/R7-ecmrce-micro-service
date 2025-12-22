import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

export const setupSwagger = (app: Express) => {
  const port = process.env.PORT || 3000;

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
          url: process.env.SWAGGER_SERVER_URL || `http://localhost:${port}`,
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

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log(`📘 Swagger docs available at → http://localhost:${port}/api-docs`);
};
