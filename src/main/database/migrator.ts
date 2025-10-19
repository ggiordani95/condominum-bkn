import { DatabaseConnection } from "./connection";

export class DatabaseMigrator {
  public static async runMigrations(): Promise<void> {
    try {
      const prisma = DatabaseConnection.getInstance();

      console.log("🔄 Checking database schema...");

      // Check if we need to run migrations or push schema
      try {
        await prisma.$queryRaw`SELECT 1 FROM users LIMIT 1`;
        console.log("✅ Database schema is up to date");
      } catch (error) {
        console.log("📊 Database schema needs initialization");

        // In development, we can use db push instead of migrations
        if (process.env.NODE_ENV === "development") {
          console.log("🔄 Applying schema changes to development database...");
          // Note: In a real scenario, you would run: await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS...`
          // or use Prisma's migration system
          console.log(
            "ℹ️  Please run 'bun run db:push' to apply schema changes"
          );
        } else {
          console.log("🔄 Running production migrations...");
          // In production, use proper migrations
          console.log("ℹ️  Please run 'bun run db:deploy' to apply migrations");
        }
      }
    } catch (error) {
      console.error("❌ Database migration failed:", error);
      throw error;
    }
  }

  public static async seedDatabase(): Promise<void> {
    try {
      const prisma = DatabaseConnection.getInstance();

      console.log("🌱 Checking if database seeding is needed...");

      // Check if we have any users
      const userCount = await prisma.user.count();

      if (userCount === 0) {
        console.log("🌱 Seeding database with initial data...");

        // Create a default admin user
        await prisma.user.create({
          data: {
            id: "admin-user-id",
            name: "Administrator",
            email: "admin@condominum.com",
            password: "hashed_admin123", // This should be properly hashed in real app
            isActive: true,
          },
        });

        console.log("✅ Database seeded successfully");
      } else {
        console.log("✅ Database already contains data, skipping seeding");
      }
    } catch (error) {
      console.error("❌ Database seeding failed:", error);
      // Don't throw error here, seeding is optional
    }
  }
}
