import "dotenv/config";
import { PrismaClient } from "../../generated/prisma";

// Criar cliente Prisma
export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
});

// Desconexão graceful
export async function disconnectPrisma() {
  await prisma.$disconnect();
}

// Função de teste de conexão
export async function testConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Banco de dados conectado com sucesso");
    return true;
  } catch (error) {
    console.error("❌ Falha na conexão com o banco de dados:", error);
    return false;
  }
}
