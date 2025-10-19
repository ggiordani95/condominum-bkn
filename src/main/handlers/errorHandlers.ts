import { FastifyInstance } from "fastify";

export function registerErrorHandlers(app: FastifyInstance): void {
  // Global Error Handler
  app.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error }, "Unhandled error");

    const statusCode = error.statusCode ?? 500;
    const message = error.message || "Internal Server Error";
    const code = (error as any).code ?? "INTERNAL_ERROR";

    reply.code(statusCode).send({
      error: {
        message,
        code,
        statusCode,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
      },
    });
  });

  // Not Found Handler
  app.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      error: {
        message: "Route not found",
        code: "NOT_FOUND",
        statusCode: 404,
        path: request.url,
      },
    });
  });
}
