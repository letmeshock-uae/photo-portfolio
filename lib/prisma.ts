import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Resolve the database URL.
 * - Local dev: uses DATABASE_URL env var (defaults to ./prisma/dev.db)
 * - Vercel / serverless: writes to /tmp which is the only writable directory
 */
function resolveDbUrl(): string {
  const envUrl = process.env.DATABASE_URL;

  // On Vercel, the deployed filesystem is read-only. Force /tmp.
  if (process.env.VERCEL === "1") {
    return "file:/tmp/portfolio.db";
  }

  return envUrl ?? "file:./prisma/dev.db";
}

function createPrismaClient() {
  const url = resolveDbUrl();
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter, log: ["error"] });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
