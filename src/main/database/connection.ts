import { PrismaClient } from "../../generated/prisma";

class DatabaseConnection {
  private static instance: PrismaClient | null = null;

  public static getInstance(): PrismaClient {
    if (!this.instance) {
      this.instance = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
      });

      if (process.env.NODE_ENV === "development") {
        console.log("🗃️  Log do banco de dados ativado no ambiente de desenvolvimento");
      }

      process.on("SIGINT", async () => {
        await this.disconnect();
        process.exit(0);
      });

      process.on("SIGTERM", async () => {
        await this.disconnect();
        process.exit(0);
      });
    }

    return this.instance;
  }

  public static async connect(): Promise<void> {
    const client = this.getInstance();

    try {
      await client.$connect();
      console.log("🗃️  Conexão com o banco de dados estabelecida com sucesso");
    } catch (error) {
      console.error("❌ Falha na conexão com o banco de dados:", error);
      throw error;
    }
  }

  public static async disconnect(): Promise<void> {
    if (this.instance) {
      await this.instance.$disconnect();
      this.instance = null;
      console.log("🗃️  Conexão com o banco de dados encerrada");
    }
  }

  public static async healthCheck(): Promise<boolean> {
    try {
      const client = this.getInstance();
      await client.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error("Falha no check de saúde do banco de dados:", error);
      return false;
    }
  }
}

export { DatabaseConnection };
export const prisma = DatabaseConnection.getInstance();
