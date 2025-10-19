import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import jwt from "@fastify/jwt";
import { AppConfig } from "../config/appConfig";

export function registerPlugins(app: FastifyInstance, config: AppConfig): void {
  // CORS Plugin
  app.register(cors, {
    origin:
      config.nodeEnv === "production" ? config.frontendUrl || false : true,
  });

  // Swagger Plugin
  app.register(swagger, {
    openapi: {
      info: {
        title: "Condominium API",
        description: "API para gerenciamento de condomínio",
        version: "1.0.0",
      },
      servers: [
        {
          url: config.apiUrl,
          description: `${config.nodeEnv} server`,
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
    },
  });

  // Swagger UI Plugin
  app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });

  // JWT Plugin
  app.register(jwt, {
    secret: config.jwtSecret,
  });
}
