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
  id: string;
  title: string;
  tags: string[];
  group: string;
  w: number;
  h: number;
}[] = [
  // Still Life (14) — Unsplash photo IDs
  { id: "1616486822087-7b49a460e45e", title: "Ceramic Vase", tags: ["ceramic", "still-life"], group: "still-life", w: 1200, h: 800 },
  { id: "1558618666-fcd25c85cd64", title: "Glass & Light", tags: ["glass", "light"], group: "still-life", w: 1200, h: 900 },
  { id: "1546069901-ba9599a7e63c", title: "Fruit Bowl", tags: ["food", "color"], group: "still-life", w: 1200, h: 800 },
  { id: "1490750967868-88df5691cc03", title: "Dried Flowers", tags: ["flowers", "texture"], group: "still-life", w: 900, h: 1200 },
  { id: "1519682577872-be05c9e3cb54", title: "Book Stack", tags: ["books", "minimal"], group: "still-life", w: 1200, h: 800 },
  { id: "1495474472287-4d8bc40af5e9", title: "Coffee & Cup", tags: ["coffee", "morning"], group: "still-life", w: 1000, h: 1000 },
  { id: "1556742049-0cfed4f6a45d", title: "Wooden Spoons", tags: ["wood", "kitchen"], group: "still-life", w: 1200, h: 800 },
  { id: "1594731804930-2d5de2fce17d", title: "Stone & Moss", tags: ["stone", "nature"], group: "still-life", w: 1200, h: 900 },
  { id: "1603033620393-d8e6a56da1d5", title: "Candle Wax", tags: ["candle", "light"], group: "still-life", w: 900, h: 1200 },
  { id: "1471943311424-646960669fbc", title: "Linen Cloth", tags: ["textile", "minimal"], group: "still-life", w: 1200, h: 800 },
  { id: "1565193566173-7a0ee3dbe261", title: "Clay Bowl", tags: ["ceramic", "minimal"], group: "still-life", w: 1200, h: 800 },
  { id: "1587640004817-b4f0fc1e3e3d", title: "Amber Bottle", tags: ["glass", "amber"], group: "still-life", w: 900, h: 1200 },
  { id: "1549298916-b41d501d3772", title: "Seeds & Pod", tags: ["nature", "macro"], group: "still-life", w: 1200, h: 800 },
  { id: "1571019613454-1cb2f99b2d8b", title: "Paper Folds", tags: ["paper", "minimal"], group: "still-life", w: 1200, h: 900 },

  // Architecture (14) — Unsplash photo IDs
  { id: "1486325212027-8081e485255e", title: "Brutalist Facade", tags: ["concrete", "urban"], group: "architecture", w: 1200, h: 800 },
  { id: "1487958449943-2429e8be8625", title: "Glass Tower", tags: ["glass", "modern"], group: "architecture", w: 800, h: 1200 },
  { id: "1463797221720-6b07e6426c24", title: "Staircase Spiral", tags: ["interior", "geometry"], group: "architecture", w: 900, h: 900 },
  { id: "1448630360428-65456885c650", title: "Arched Corridor", tags: ["arch", "symmetry"], group: "architecture", w: 1200, h: 800 },
  { id: "1460317442991-0ec209397118", title: "Rooftop Grid", tags: ["aerial", "pattern"], group: "architecture", w: 1200, h: 800 },
  { id: "1518780664697-55e3ad937233", title: "Concrete Steps", tags: ["concrete", "minimal"], group: "architecture", w: 1200, h: 900 },
  { id: "1523217582562-09d05efaea2d", title: "Wooden Lattice", tags: ["wood", "pattern"], group: "architecture", w: 900, h: 1200 },
  { id: "1431889892736-11d3f93e2971", title: "Bridge Lines", tags: ["bridge", "steel"], group: "architecture", w: 1200, h: 800 },
  { id: "1494959323928-1de8d6e5ff42", title: "Window Grid", tags: ["window", "geometry"], group: "architecture", w: 800, h: 1200 },
  { id: "1477414348463-c0eb7f1359b6", title: "Dome Interior", tags: ["dome", "light"], group: "architecture", w: 1000, h: 1000 },
  { id: "1515263487990-61b07816b324", title: "Brick Wall", tags: ["brick", "texture"], group: "architecture", w: 1200, h: 800 },
  { id: "1496307653780-42ee777d4833", title: "Steel Column", tags: ["steel", "structure"], group: "architecture", w: 800, h: 1200 },
  { id: "1486728297118-82ec1f7e4c4c", title: "Balcony Row", tags: ["balcony", "repetition"], group: "architecture", w: 1200, h: 800 },
  { id: "1507003211169-0a1dd7228f2d", title: "Shadow Play", tags: ["shadow", "light"], group: "architecture", w: 1200, h: 900 },

  // Experimental (12) — Unsplash photo IDs
  { id: "1541185933-ef5d8ed016c2", title: "Double Exposure", tags: ["experimental", "overlay"], group: "experimental", w: 1200, h: 800 },
  { id: "1508739773434-c26b3d09e071", title: "Long Exposure", tags: ["motion", "blur"], group: "experimental", w: 1200, h: 800 },
  { id: "1614849963640-9cc74b2a826f", title: "Chromatic Split", tags: ["color", "glitch"], group: "experimental", w: 1000, h: 1000 },
  { id: "1557672172-298e090bd0f1", title: "Mirror World", tags: ["reflection", "abstract"], group: "experimental", w: 1200, h: 800 },
  { id: "1451187580459-43490279c0fa", title: "Noise Field", tags: ["texture", "grain"], group: "experimental", w: 900, h: 1200 },
  { id: "1516796181074-bf453fbfa3e6", title: "Light Leak", tags: ["analog", "light"], group: "experimental", w: 1200, h: 800 },
  { id: "1533158628620-7ac14128d63a", title: "Infrared Tone", tags: ["infrared", "surreal"], group: "experimental", w: 1200, h: 900 },
  { id: "1558591710-4b4a1ae0f04d", title: "Tilt Shift", tags: ["miniature", "focus"], group: "experimental", w: 1200, h: 800 },
  { id: "1567095761054-7a02e69e5c43", title: "Prism Break", tags: ["prism", "color"], group: "experimental", w: 800, h: 1200 },
  { id: "1511300636408-a63a89df3482", title: "Fog Layer", tags: ["fog", "atmosphere"], group: "experimental", w: 1200, h: 800 },
  { id: "1468657988500-aca2be09f4c5", title: "Grain Study", tags: ["grain", "monochrome"], group: "experimental", w: 1000, h: 1000 },
  { id: "1507525428034-b723cf961d3e", title: "Vortex", tags: ["abstract", "motion"], group: "experimental", w: 1200, h: 800 },
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
      const base = `https://images.unsplash.com/photo-${p.id}`;
      const url = `${base}?auto=format&fit=crop&w=${p.w}&h=${p.h}&q=80`;
      const thumb = `${base}?auto=format&fit=crop&w=400&h=300&q=70`;
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
