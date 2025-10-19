import "dotenv/config";
import { PrismaClient } from "../../generated/prisma";

export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
});

export async function disconnectPrisma() {
  await prisma.$disconnect();
}

export async function testConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Conexão com o banco de dados estabelecida com sucesso");
    return true;
  } catch (error) {
    console.error("❌ Conexão com o banco de dados falhou:", error);
    return false;
  }
}
