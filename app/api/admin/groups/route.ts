import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const groupSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  defaultView: z.enum(["grid", "carousel", "wall"]).default("grid"),
});

export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      orderBy: { createdAt: "asc" },
      include: { _count: { select: { photos: true } } },
    });

    return NextResponse.json({ groups });
  } catch (error) {
    console.error("[GET /api/admin/groups]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = groupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const slug = slugify(result.data.name);
    const existing = await prisma.group.findUnique({ where: { slug } });

    if (existing) {
      return NextResponse.json(
        { error: "A group with this name already exists" },
        { status: 409 }
      );
    }

    const group = await prisma.group.create({
      data: {
        name: result.data.name,
        slug,
        defaultView: result.data.defaultView,
      },
    });

    return NextResponse.json({ group }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/groups]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
