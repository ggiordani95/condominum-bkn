import { AppConfig } from "./appConfig";

export function createLoggerConfig(config: AppConfig) {
  return {
    level: config.logLevel,
    transport:
      config.nodeEnv === "development"
        ? {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "HH:MM:ss Z",
              ignore: "pid,hostname,reqId,req,res",
            },
          }
        : undefined,
    // Desabilitar logs de requisições HTTP
    disableRequestLogging: true,
  };
}
