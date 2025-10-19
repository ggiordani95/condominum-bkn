import { buildServer } from "./main/buildServer";
import { DatabaseInitializer } from "./main/database/initializer";
import { FastifyInstance } from "fastify";

let server: FastifyInstance | null = null;

const start = async () => {
  try {
    const host = process.env.HOST || "0.0.0.0";
    const port = Number(process.env.PORT) || 3000;

    // Build server with database initialization
    server = await buildServer();

    await server.listen({ host, port });

    console.log(`🚀 Server is running at http://localhost:${port}`);
    console.log(`📚 Swagger docs available at http://localhost:${port}/docs`);
    console.log(`💚 Health check at http://localhost:${port}/health`);
  } catch (err) {
    if (server) {
      server.log.error(err);
    } else {
      console.error("❌ Server startup failed:", err);
    }
    await DatabaseInitializer.shutdown();
    process.exit(1);
  }
};

const gracefulShutdown = async (signal: string) => {
  if (server) {
    server.log.info(`Received ${signal}, shutting down gracefully`);
    try {
      await server.close();
      server.log.info("Server closed successfully");
    } catch (err) {
      server.log.error({ err }, "Error during server shutdown");
    }
  } else {
    console.log(`Received ${signal}, shutting down gracefully`);
  }

  // Shutdown database
  await DatabaseInitializer.shutdown();
  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("uncaughtException", async (err) => {
  if (server) {
    server.log.fatal(err, "Uncaught exception");
  } else {
    console.error("❌ Uncaught exception:", err);
  }
  await DatabaseInitializer.shutdown();
  process.exit(1);
});

process.on("unhandledRejection", async (reason, promise) => {
  if (server) {
    server.log.fatal({ reason, promise }, "Unhandled rejection");
  } else {
    console.error("❌ Unhandled rejection:", { reason, promise });
  }
  await DatabaseInitializer.shutdown();
  process.exit(1);
});

start();
