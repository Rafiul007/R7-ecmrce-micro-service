import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

export const setupSwagger = (app: Express) => {
  const port = process.env.PORT || 5000;

  const options: swaggerJsDoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Product Catalog Service API",
        version: "1.0.0",
        description: "API documentation for Product Catalog microservice",
      },
      servers: [
        {
          url: `${process.env.SWAGGER_SERVER_URL || `http://localhost:${port}`}`,
          description: "Current Server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },

    // 👇 Scans documentation from these files
    apis: ["./src/routes/*.ts", "./src/docs/*.ts"],
  };

  const swaggerSpec = swaggerJsDoc(options);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log(`📘 Swagger docs available at → http://localhost:${port}/api-docs`);
};
