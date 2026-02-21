import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { DashboardClient } from "./DashboardClient";

async function getStats() {
  const [photoCount, groupCount] = await Promise.all([
    prisma.photo.count(),
    prisma.group.count(),
  ]);
  return { photoCount, groupCount };
}

async function getGroups() {
  return prisma.group.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { photos: true } } },
  });
}

async function getRecentPhotos() {
  const photos = await prisma.photo.findMany({
    take: 12,
    orderBy: { createdAt: "desc" },
    include: { group: { select: { name: true } } },
  });
  return photos.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }));
}

export default async function DashboardPage() {
  const session = { userId: "preview", email: "admin@portfolio.local" };

  const [stats, groups, recentPhotos] = await Promise.all([
    getStats(),
    getGroups(),
    getRecentPhotos(),
  ]);

  return (
    <DashboardClient
      session={session}
      stats={stats}
      groups={groups.map((g) => ({
        ...g,
        createdAt: g.createdAt.toISOString(),
      }))}
      recentPhotos={recentPhotos}
    />
  );
}
