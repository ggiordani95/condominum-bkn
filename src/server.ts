import { buildServer } from "./main/buildServer";
import { DatabaseInitializer } from "./main/database/initializer";
import { FastifyInstance } from "fastify";

let server: FastifyInstance | null = null;

const start = async () => {
  try {
    const host = process.env.HOST || "0.0.0.0";
    const port = Number(process.env.PORT) || 3000;

    server = await buildServer();

    await server.listen({ host, port });

    console.log(`🚀 Servidor está rodando em http://localhost:${port}`);
    console.log(`📚 Documentação Swagger disponível em http://localhost:${port}/docs`);
    console.log(`💚 Check de saúde disponível em http://localhost:${port}/health`);
  } catch (err) {
    if (server) {
      server.log.error(err);
    } else {
      console.error("❌ Falha ao iniciar o servidor:", err);
    }
    await DatabaseInitializer.shutdown();
    process.exit(1);
  }
};

const gracefulShutdown = async (signal: string) => {
  if (server) {
    server.log.info(`Recebido ${signal}, encerrando gracefulmente`);
    try {
      await server.close();
      server.log.info("Servidor encerrado com sucesso");
    } catch (err) {
      server.log.error({ err }, "Erro durante o encerramento do servidor");
    }
  } else {
    console.log(`Recebido ${signal}, encerrando gracefulmente`);
  }

  // Shutdown database
  await DatabaseInitializer.shutdown();
  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("uncaughtException", async (err) => {
  if (server) {
    server.log.fatal(err, "Exceção não tratada");
  } else {
    console.error("❌ Exceção não tratada:", err);
  }
  await DatabaseInitializer.shutdown();
  process.exit(1);
});

process.on("unhandledRejection", async (reason, promise) => {
  if (server) {
    server.log.fatal({ reason, promise }, "Rejeição não tratada");
  } else {
    console.error("❌ Rejeição não tratada:", { reason, promise });
  }
  await DatabaseInitializer.shutdown();
  process.exit(1);
});

start();
