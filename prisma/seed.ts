import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { createHash } from "crypto";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

const PHOTOS: {
  seed: number;
  title: string;
  tags: string[];
  group: string;
  w: number;
  h: number;
}[] = [
  // Still Life (14)
  { seed: 10, title: "Ceramic Vase", tags: ["ceramic", "still-life"], group: "still-life", w: 1200, h: 800 },
  { seed: 20, title: "Glass & Light", tags: ["glass", "light"], group: "still-life", w: 1200, h: 900 },
  { seed: 30, title: "Fruit Bowl", tags: ["food", "color"], group: "still-life", w: 1200, h: 800 },
  { seed: 40, title: "Dried Flowers", tags: ["flowers", "texture"], group: "still-life", w: 900, h: 1200 },
  { seed: 50, title: "Book Stack", tags: ["books", "minimal"], group: "still-life", w: 1200, h: 800 },
  { seed: 60, title: "Coffee & Cup", tags: ["coffee", "morning"], group: "still-life", w: 1000, h: 1000 },
  { seed: 70, title: "Wooden Spoons", tags: ["wood", "kitchen"], group: "still-life", w: 1200, h: 800 },
  { seed: 80, title: "Stone & Moss", tags: ["stone", "nature"], group: "still-life", w: 1200, h: 900 },
  { seed: 90, title: "Candle Wax", tags: ["candle", "light"], group: "still-life", w: 900, h: 1200 },
  { seed: 100, title: "Linen Cloth", tags: ["textile", "minimal"], group: "still-life", w: 1200, h: 800 },
  { seed: 110, title: "Clay Bowl", tags: ["ceramic", "minimal"], group: "still-life", w: 1200, h: 800 },
  { seed: 120, title: "Amber Bottle", tags: ["glass", "amber"], group: "still-life", w: 900, h: 1200 },
  { seed: 130, title: "Seeds & Pod", tags: ["nature", "macro"], group: "still-life", w: 1200, h: 800 },
  { seed: 140, title: "Paper Folds", tags: ["paper", "minimal"], group: "still-life", w: 1200, h: 900 },

  // Architecture (14)
  { seed: 150, title: "Brutalist Facade", tags: ["concrete", "urban"], group: "architecture", w: 1200, h: 800 },
  { seed: 160, title: "Glass Tower", tags: ["glass", "modern"], group: "architecture", w: 800, h: 1200 },
  { seed: 170, title: "Staircase Spiral", tags: ["interior", "geometry"], group: "architecture", w: 900, h: 900 },
  { seed: 180, title: "Arched Corridor", tags: ["arch", "symmetry"], group: "architecture", w: 1200, h: 800 },
  { seed: 190, title: "Rooftop Grid", tags: ["aerial", "pattern"], group: "architecture", w: 1200, h: 800 },
  { seed: 200, title: "Concrete Steps", tags: ["concrete", "minimal"], group: "architecture", w: 1200, h: 900 },
  { seed: 210, title: "Wooden Lattice", tags: ["wood", "pattern"], group: "architecture", w: 900, h: 1200 },
  { seed: 220, title: "Bridge Lines", tags: ["bridge", "steel"], group: "architecture", w: 1200, h: 800 },
  { seed: 230, title: "Window Grid", tags: ["window", "geometry"], group: "architecture", w: 800, h: 1200 },
  { seed: 240, title: "Dome Interior", tags: ["dome", "light"], group: "architecture", w: 1000, h: 1000 },
  { seed: 250, title: "Brick Wall", tags: ["brick", "texture"], group: "architecture", w: 1200, h: 800 },
  { seed: 260, title: "Steel Column", tags: ["steel", "structure"], group: "architecture", w: 800, h: 1200 },
  { seed: 270, title: "Balcony Row", tags: ["balcony", "repetition"], group: "architecture", w: 1200, h: 800 },
  { seed: 280, title: "Shadow Play", tags: ["shadow", "light"], group: "architecture", w: 1200, h: 900 },

  // Experimental (12)
  { seed: 290, title: "Double Exposure", tags: ["experimental", "overlay"], group: "experimental", w: 1200, h: 800 },
  { seed: 300, title: "Long Exposure", tags: ["motion", "blur"], group: "experimental", w: 1200, h: 800 },
  { seed: 310, title: "Chromatic Split", tags: ["color", "glitch"], group: "experimental", w: 1000, h: 1000 },
  { seed: 320, title: "Mirror World", tags: ["reflection", "abstract"], group: "experimental", w: 1200, h: 800 },
  { seed: 330, title: "Noise Field", tags: ["texture", "grain"], group: "experimental", w: 900, h: 1200 },
  { seed: 340, title: "Light Leak", tags: ["analog", "light"], group: "experimental", w: 1200, h: 800 },
  { seed: 350, title: "Infrared Tone", tags: ["infrared", "surreal"], group: "experimental", w: 1200, h: 900 },
  { seed: 360, title: "Tilt Shift", tags: ["miniature", "focus"], group: "experimental", w: 1200, h: 800 },
  { seed: 370, title: "Prism Break", tags: ["prism", "color"], group: "experimental", w: 800, h: 1200 },
  { seed: 380, title: "Fog Layer", tags: ["fog", "atmosphere"], group: "experimental", w: 1200, h: 800 },
  { seed: 390, title: "Grain Study", tags: ["grain", "monochrome"], group: "experimental", w: 1000, h: 1000 },
  { seed: 400, title: "Vortex", tags: ["abstract", "motion"], group: "experimental", w: 1200, h: 800 },
];

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

  const groupDefs = [
    { name: "Still Life", slug: "still-life", defaultView: "grid" },
    { name: "Architecture", slug: "architecture", defaultView: "carousel" },
    { name: "Experimental", slug: "experimental", defaultView: "wall" },
  ];

  const groupMap: Record<string, string> = {};

  for (const g of groupDefs) {
    const record = await prisma.group.upsert({
      where: { slug: g.slug },
      update: {},
      create: g,
    });
    groupMap[g.slug] = record.id;
    console.log(`Group: ${g.name}`);
  }

  // Add test photos (skip if already seeded)
  const existing = await prisma.photo.count();
  if (existing >= 40) {
    console.log(`Photos already seeded (${existing} found). Skipping.`);
  } else {
    let added = 0;
    for (const p of PHOTOS) {
      const url = `https://picsum.photos/seed/${p.seed}/${p.w}/${p.h}`;
      const thumb = `https://picsum.photos/seed/${p.seed}/400/300`;
      await prisma.photo.create({
        data: {
          url,
          thumbnailUrl: thumb,
          title: p.title,
          tags: JSON.stringify(p.tags),
          metadata: JSON.stringify({ width: p.w, height: p.h, format: "jpeg" }),
          groupId: groupMap[p.group],
        },
      });
      added++;
    }
    console.log(`Added ${added} photos.`);
  }

  console.log("Seed complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
