import { DatabaseConnection } from "./connection";
import { DatabaseMigrator } from "./migrator";

export class DatabaseInitializer {
  public static async initialize(): Promise<void> {
    try {
      console.log("🗃️  Initializing database connection...");

      // Connect to database
      await DatabaseConnection.connect();

      // Check database health
      const isHealthy = await DatabaseConnection.healthCheck();
      if (!isHealthy) {
        throw new Error("Database health check failed");
      }

      // Run migrations and seeding
      await DatabaseMigrator.runMigrations();
      await DatabaseMigrator.seedDatabase();

      console.log("✅ Database initialization completed successfully");
    } catch (error) {
      console.error("❌ Database initialization failed:", error);

      // Log more details for debugging
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack:
            process.env.NODE_ENV === "development" ? error.stack : undefined,
        });
      }

      // Exit the process if database initialization fails
      process.exit(1);
    }
  }

  public static async shutdown(): Promise<void> {
    try {
      console.log("🗃️  Shutting down database connection...");
      await DatabaseConnection.disconnect();
      console.log("✅ Database shutdown completed");
    } catch (error) {
      console.error("❌ Database shutdown failed:", error);
    }
  }
}
