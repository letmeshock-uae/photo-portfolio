import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processImage } from "@/lib/image";
import { getAdminSession } from "@/lib/auth";
import { z } from "zod";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const uploadSchema = z.object({
  groupId: z.string().uuid().optional(),
  title: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  tags: z.string().optional(), // comma-separated
});

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large (max 50MB)" },
        { status: 400 }
      );
    }

    const fields = uploadSchema.safeParse({
      groupId: formData.get("groupId") ?? undefined,
      title: formData.get("title") ?? undefined,
      description: formData.get("description") ?? undefined,
      tags: formData.get("tags") ?? undefined,
    });

    if (!fields.success) {
      return NextResponse.json(
        { error: fields.error.issues[0].message },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const processed = await processImage(buffer, file.name);

    const tags = fields.data.tags
      ? fields.data.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const photo = await prisma.photo.create({
      data: {
        url: processed.url,
        thumbnailUrl: processed.thumbnailUrl,
        title: fields.data.title ?? file.name.replace(/\.[^.]+$/, ""),
        description: fields.data.description,
        tags: JSON.stringify(tags),
        metadata: JSON.stringify(processed.metadata),
        groupId: fields.data.groupId ?? null,
      },
    });

    return NextResponse.json({
      ok: true,
      id: photo.id,
      url: photo.url,
      thumbnailUrl: photo.thumbnailUrl,
      metadata: processed.metadata,
    });
  } catch (error) {
    console.error("[POST /api/admin/upload]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
