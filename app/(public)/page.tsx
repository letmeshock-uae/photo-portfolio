// Database lives in /tmp on Vercel (runtime only) — cannot query at build time.
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { parseTags, parseMetadata } from "@/lib/utils";
import { HomeClient } from "./HomeClient";

async function getPhotos() {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: { createdAt: "desc" },
      take: 60,
      include: {
        group: { select: { id: true, name: true, slug: true, defaultView: true } },
      },
    });

    return photos.map((p) => ({
      ...p,
      tags: parseTags(p.tags),
      metadata: parseMetadata(p.metadata),
      createdAt: p.createdAt.toISOString(),
    }));
  } catch (err) {
    console.error("[HomePage] getPhotos failed:", err);
    return [];
  }
}

async function getGroups() {
  try {
    return await prisma.group.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, slug: true, defaultView: true },
    });
  } catch (err) {
    console.error("[HomePage] getGroups failed:", err);
    return [];
  }
}

export default async function HomePage() {
  const [photos, groups] = await Promise.all([getPhotos(), getGroups()]);

  return <HomeClient photos={photos} groups={groups} />;
}
