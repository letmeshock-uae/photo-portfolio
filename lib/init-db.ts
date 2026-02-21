import { createHash } from "crypto";

function hashPassword(pw: string) {
  return createHash("sha256").update(pw).digest("hex");
}

/**
 * Ensures the database has the required tables and a default admin user.
 * Called once on cold start via the root layout server component.
 * Uses raw SQL so it can run before Prisma's query engine is warm.
 */
export async function initDb() {
  // Only auto-seed on Vercel where the DB is ephemeral (/tmp resets on cold start)
  if (process.env.VERCEL !== "1") return;

  try {
    const { prisma } = await import("@/lib/prisma");

    // Run migrations / create tables by touching the schema
    // Prisma 7 with driver adapters does NOT run migrations automatically,
    // so we push the schema manually using raw SQL.
    const tableCheck = await prisma.$queryRawUnsafe<{ count: number }[]>(
      `SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='User'`
    );

    if (tableCheck[0]?.count === 0) {
      // Tables don't exist — create them
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "User" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "email" TEXT NOT NULL UNIQUE,
          "passwordHash" TEXT NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Group" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "slug" TEXT NOT NULL UNIQUE,
          "defaultView" TEXT NOT NULL DEFAULT 'grid',
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Photo" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "url" TEXT NOT NULL,
          "thumbnailUrl" TEXT NOT NULL,
          "title" TEXT,
          "description" TEXT,
          "tags" TEXT NOT NULL DEFAULT '[]',
          "metadata" TEXT NOT NULL DEFAULT '{}',
          "groupId" TEXT,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL
        )
      `);
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Log" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "userId" TEXT NOT NULL,
          "action" TEXT NOT NULL,
          "details" TEXT,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("userId") REFERENCES "User"("id")
        )
      `);
    }

    // Ensure admin user exists
    const adminEmail = process.env.ADMIN_EMAIL ?? "admin@portfolio.local";
    const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!existing) {
      const { randomUUID } = await import("crypto");
      await prisma.user.create({
        data: {
          id: randomUUID(),
          email: adminEmail,
          passwordHash: hashPassword(adminPassword),
        },
      });

      // Default groups
      const groups = [
        { slug: "still-life", name: "Still Life", defaultView: "grid" },
        { slug: "architecture", name: "Architecture", defaultView: "carousel" },
        { slug: "experimental", name: "Experimental", defaultView: "wall" },
      ];
      for (const g of groups) {
        const exists = await prisma.group.findUnique({ where: { slug: g.slug } });
        if (!exists) {
          await prisma.group.create({ data: { id: randomUUID(), ...g } });
        }
      }
    }
  } catch {
    // Non-fatal: log and continue. App will still render, admin login may fail.
    console.warn("[initDb] Database initialization failed");
  }
}
