import Fastify, { FastifyInstance } from "fastify";
import { loadConfig, validateConfig } from "./config/appConfig";
import { createLoggerConfig } from "./config/logger";
import { initializeContainer } from "./container/initializeContainer";
import { registerPlugins } from "./plugins/registerPlugins";
import { registerRoutes } from "./routes/registerRoutes";
import { registerErrorHandlers } from "./handlers/errorHandlers";
import { DatabaseInitializer } from "./database/initializer";

export async function buildServer(): Promise<FastifyInstance> {
  // Load and validate configuration
  const config = loadConfig();
  validateConfig(config);

  // Initialize database connection (temporariamente comentado - usando InMemory)
  // await DatabaseInitializer.initialize();

  // Initialize dependency injection container
  const container = initializeContainer();

  // Create Fastify instance with logger configuration
  const loggerConfig = createLoggerConfig(config);
  const app = Fastify({ logger: loggerConfig });

  // Register plugins (CORS, Swagger, JWT, etc.)
  registerPlugins(app, config);

  // Register all routes (Health, Auth, Users)
  registerRoutes(app);

  // Register error handlers (Global error handler and 404)
  registerErrorHandlers(app);

  return app;
}
