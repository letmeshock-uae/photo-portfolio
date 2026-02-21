import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { createHash } from "crypto";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

async function main() {
  console.log("Seeding database...");

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@portfolio.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hashPassword(adminPassword),
    },
  });

  console.log(`Admin user: ${adminEmail}`);

  const groups = [
    { name: "Still Life", slug: "still-life", defaultView: "grid" },
    { name: "Architecture", slug: "architecture", defaultView: "carousel" },
    { name: "Experimental", slug: "experimental", defaultView: "wall" },
  ];

  for (const group of groups) {
    await prisma.group.upsert({
      where: { slug: group.slug },
      update: {},
      create: group,
    });
    console.log(`Group: ${group.name}`);
  }

  console.log("Seed complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
