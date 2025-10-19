import { FastifyInstance } from "fastify";
import authRoutes from "../../modules/auth/http/routes";
import userRoutes from "../../modules/user/http/routes";
import visitorRoutes from "../../modules/visitor/http/routes";

export function registerRoutes(app: FastifyInstance): void {
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

  app.register(authRoutes, { prefix: "/auth" });
  app.register(userRoutes, { prefix: "/users" });
  app.register(visitorRoutes, { prefix: "/visitors" });
}
