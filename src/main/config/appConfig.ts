export interface AppConfig {
  host: string;
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  logLevel: string;
  apiUrl: string;
  frontendUrl?: string;
}

export function loadConfig(): AppConfig {
  return {
    host: process.env.HOST || "0.0.0.0",
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    jwtSecret: process.env.JWT_SECRET || "supersecret",
    logLevel: process.env.LOG_LEVEL || "warn",
    apiUrl: process.env.API_URL || "http://localhost:3000",
    frontendUrl: process.env.FRONTEND_URL,
  };
}

export function validateConfig(config: AppConfig): void {
  if (config.nodeEnv === "production" && config.jwtSecret === "supersecret") {
    throw new Error("JWT_SECRET deve ser definido no ambiente de produção");
  }

  if (config.port < 1 || config.port > 65535) {
    throw new Error("PORT deve estar entre 1 e 65535");
  }

  console.log(`⚙️  Configuração carregada para o ambiente ${config.nodeEnv}`);
}
