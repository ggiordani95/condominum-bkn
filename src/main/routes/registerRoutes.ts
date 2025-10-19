import { FastifyInstance } from "fastify";
import authRoutes from "../../modules/auth/http/routes";
import userRoutes from "../../modules/user/http/routes";

export function registerRoutes(app: FastifyInstance): void {
  // Health check - registrado primeiro, antes de qualquer plugin de autenticação
  app.get(
    "/health",
    {
      schema: {
        tags: ["Health"],
        summary: "Health check endpoint",
        description: "Verifica se o servidor está funcionando corretamente",
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "string" },
              timestamp: { type: "string", format: "date-time" },
              uptime: { type: "number" },
              version: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      return {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || "1.0.0",
      };
    }
  );

  // Business Routes
  app.register(authRoutes, { prefix: "/auth" });
  app.register(userRoutes, { prefix: "/users" });
}
