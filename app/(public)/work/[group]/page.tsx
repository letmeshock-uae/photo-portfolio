import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseTags, parseMetadata } from "@/lib/utils";
import { GalleryView } from "@/components/GalleryView";
import Link from "next/link";

interface Props {
  params: Promise<{ group: string }>;
}

async function getGroupData(slug: string) {
  const group = await prisma.group.findUnique({
    where: { slug },
    include: {
      photos: {
        orderBy: { createdAt: "desc" },
        take: 60,
      },
    },
  });

  if (!group) return null;

  return {
    ...group,
    photos: group.photos.map((p) => ({
      ...p,
      tags: parseTags(p.tags),
      metadata: parseMetadata(p.metadata),
      createdAt: p.createdAt.toISOString(),
    })),
  };
}

export default async function GroupPage({ params }: Props) {
  const { group: slug } = await params;
  const group = await getGroupData(slug);

  if (!group) notFound();

  return (
    <div className="pt-20">
      <div className="px-6 pb-6">
        <div className="flex items-center gap-2 text-white/30 text-xs tracking-widest uppercase">
          <Link href="/" className="hover:text-white transition-colors">
            All
          </Link>
          <span>/</span>
          <span className="text-white/70">{group.name}</span>
        </div>
      </div>

      <GalleryView photos={group.photos} defaultView={group.defaultView} />
    </div>
  );
}

// Database lives in /tmp on Vercel (runtime only) — cannot query at build time.
// All group pages are rendered on-demand at request time.
export const dynamic = "force-dynamic";
