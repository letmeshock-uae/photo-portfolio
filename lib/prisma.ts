import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Resolve the database URL.
 * - Local dev: absolute path to prisma/dev.db relative to this file
 * - Vercel / serverless: writes to /tmp which is the only writable directory
 */
function resolveDbUrl(): string {
  // On Vercel, the deployed filesystem is read-only. Force /tmp.
  if (process.env.VERCEL === "1") {
    return "file:/tmp/portfolio.db";
  }

  // Use absolute path anchored to project root (Next.js always sets cwd to project root)
  const absPath = path.resolve(process.cwd(), "prisma/dev.db");
  return `file:${absPath}`;
}

function createPrismaClient() {
  const url = resolveDbUrl();
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter, log: ["error"] });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
