import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseTags, parseMetadata } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const groupSlug = searchParams.get("group");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));
  const tag = searchParams.get("tag");

  try {
    const whereGroup = groupSlug
      ? { group: { slug: groupSlug } }
      : {};

    const photos = await prisma.photo.findMany({
      where: whereGroup,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { group: { select: { id: true, name: true, slug: true, defaultView: true } } },
    });

    const total = await prisma.photo.count({ where: whereGroup });

    const result = photos.map((p) => ({
      ...p,
      tags: parseTags(p.tags),
      metadata: parseMetadata(p.metadata),
      createdAt: p.createdAt.toISOString(),
    }));

    // Filter by tag in memory (SQLite doesn't support JSON array queries easily)
    const filtered = tag
      ? result.filter((p) => p.tags.includes(tag))
      : result;

    return NextResponse.json({
      photos: filtered,
      total,
      page,
      limit,
      hasMore: page * limit < total,
    });
  } catch (error) {
    console.error("[GET /api/photos]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
