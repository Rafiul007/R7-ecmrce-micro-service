import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

export const setupSwagger = (app: Express) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "IAM Service API",
        version: "1.0.0",
        description: "Documentation for Authentication Service",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    apis: ["./src/routes/**/*.ts", "./src/docs/**/*.ts"],
  };

  const swaggerSpec = swaggerJSDoc(options);
  
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log("📄 Swagger documentation available at /docs");
};
