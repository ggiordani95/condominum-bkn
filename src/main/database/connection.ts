import { PrismaClient } from "../../generated/prisma";

class DatabaseConnection {
  private static instance: PrismaClient | null = null;

  public static getInstance(): PrismaClient {
    if (!this.instance) {
      this.instance = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
      });

      // Set up logging for development
      if (process.env.NODE_ENV === "development") {
        console.log("🗃️  Database logging enabled for development");
      }

      // Handle application shutdown
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
      console.log("🗃️  Database connected successfully");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      throw error;
    }
  }

  public static async disconnect(): Promise<void> {
    if (this.instance) {
      await this.instance.$disconnect();
      this.instance = null;
      console.log("🗃️  Database disconnected");
    }
  }

  public static async healthCheck(): Promise<boolean> {
    try {
      const client = this.getInstance();
      await client.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error("Database health check failed:", error);
      return false;
    }
  }
}

export { DatabaseConnection };
export const prisma = DatabaseConnection.getInstance();
