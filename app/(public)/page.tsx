// Database lives in /tmp on Vercel (runtime only) — cannot query at build time.
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { parseTags, parseMetadata } from "@/lib/utils";
import { HomeClient } from "./HomeClient";
import type { PhotoItem } from "@/lib/store";

// ---------------------------------------------------------------------------
// Hardcoded fallback — always visible even if the DB is empty / cold-start
// ---------------------------------------------------------------------------
const FALLBACK_GROUPS = [
  { id: "g1", name: "Still Life",   slug: "still-life",   defaultView: "grid"     },
  { id: "g2", name: "Architecture", slug: "architecture", defaultView: "carousel" },
  { id: "g3", name: "Experimental", slug: "experimental", defaultView: "wall"     },
];

const FALLBACK_PHOTOS: PhotoItem[] = [
  // Still Life
  { id:"p01", url:"https://picsum.photos/seed/10/1200/800",   thumbnailUrl:"https://picsum.photos/seed/10/400/300",  title:"Ceramic Vase",     description:null, tags:["ceramic","still-life"],    metadata:{width:1200,height:800},  groupId:"g1", createdAt:"2024-01-01T00:00:00.000Z" },
  { id:"p02", url:"https://picsum.photos/seed/20/1200/900",   thumbnailUrl:"https://picsum.photos/seed/20/400/300",  title:"Glass & Light",    description:null, tags:["glass","light"],            metadata:{width:1200,height:900},  groupId:"g1", createdAt:"2024-01-02T00:00:00.000Z" },
  { id:"p03", url:"https://picsum.photos/seed/30/1200/800",   thumbnailUrl:"https://picsum.photos/seed/30/400/300",  title:"Fruit Bowl",       description:null, tags:["food","color"],             metadata:{width:1200,height:800},  groupId:"g1", createdAt:"2024-01-03T00:00:00.000Z" },
  { id:"p04", url:"https://picsum.photos/seed/40/900/1200",   thumbnailUrl:"https://picsum.photos/seed/40/400/300",  title:"Dried Flowers",    description:null, tags:["flowers","texture"],        metadata:{width:900, height:1200}, groupId:"g1", createdAt:"2024-01-04T00:00:00.000Z" },
  { id:"p05", url:"https://picsum.photos/seed/50/1200/800",   thumbnailUrl:"https://picsum.photos/seed/50/400/300",  title:"Book Stack",       description:null, tags:["books","minimal"],          metadata:{width:1200,height:800},  groupId:"g1", createdAt:"2024-01-05T00:00:00.000Z" },
  { id:"p06", url:"https://picsum.photos/seed/60/1000/1000",  thumbnailUrl:"https://picsum.photos/seed/60/400/300",  title:"Coffee & Cup",     description:null, tags:["coffee","morning"],         metadata:{width:1000,height:1000}, groupId:"g1", createdAt:"2024-01-06T00:00:00.000Z" },
  { id:"p07", url:"https://picsum.photos/seed/70/1200/800",   thumbnailUrl:"https://picsum.photos/seed/70/400/300",  title:"Wooden Spoons",    description:null, tags:["wood","kitchen"],           metadata:{width:1200,height:800},  groupId:"g1", createdAt:"2024-01-07T00:00:00.000Z" },
  { id:"p08", url:"https://picsum.photos/seed/80/1200/900",   thumbnailUrl:"https://picsum.photos/seed/80/400/300",  title:"Stone & Moss",     description:null, tags:["stone","nature"],           metadata:{width:1200,height:900},  groupId:"g1", createdAt:"2024-01-08T00:00:00.000Z" },
  { id:"p09", url:"https://picsum.photos/seed/90/900/1200",   thumbnailUrl:"https://picsum.photos/seed/90/400/300",  title:"Candle Wax",       description:null, tags:["candle","light"],           metadata:{width:900, height:1200}, groupId:"g1", createdAt:"2024-01-09T00:00:00.000Z" },
  { id:"p10", url:"https://picsum.photos/seed/100/1200/800",  thumbnailUrl:"https://picsum.photos/seed/100/400/300", title:"Linen Cloth",      description:null, tags:["textile","minimal"],        metadata:{width:1200,height:800},  groupId:"g1", createdAt:"2024-01-10T00:00:00.000Z" },
  { id:"p11", url:"https://picsum.photos/seed/110/1200/800",  thumbnailUrl:"https://picsum.photos/seed/110/400/300", title:"Clay Bowl",        description:null, tags:["ceramic","minimal"],        metadata:{width:1200,height:800},  groupId:"g1", createdAt:"2024-01-11T00:00:00.000Z" },
  { id:"p12", url:"https://picsum.photos/seed/120/900/1200",  thumbnailUrl:"https://picsum.photos/seed/120/400/300", title:"Amber Bottle",     description:null, tags:["glass","amber"],            metadata:{width:900, height:1200}, groupId:"g1", createdAt:"2024-01-12T00:00:00.000Z" },
  { id:"p13", url:"https://picsum.photos/seed/130/1200/800",  thumbnailUrl:"https://picsum.photos/seed/130/400/300", title:"Seeds & Pod",      description:null, tags:["nature","macro"],           metadata:{width:1200,height:800},  groupId:"g1", createdAt:"2024-01-13T00:00:00.000Z" },
  { id:"p14", url:"https://picsum.photos/seed/140/1200/900",  thumbnailUrl:"https://picsum.photos/seed/140/400/300", title:"Paper Folds",      description:null, tags:["paper","minimal"],          metadata:{width:1200,height:900},  groupId:"g1", createdAt:"2024-01-14T00:00:00.000Z" },
  // Architecture
  { id:"p15", url:"https://picsum.photos/seed/150/1200/800",  thumbnailUrl:"https://picsum.photos/seed/150/400/300", title:"Brutalist Facade", description:null, tags:["concrete","urban"],         metadata:{width:1200,height:800},  groupId:"g2", createdAt:"2024-01-15T00:00:00.000Z" },
  { id:"p16", url:"https://picsum.photos/seed/160/800/1200",  thumbnailUrl:"https://picsum.photos/seed/160/400/300", title:"Glass Tower",      description:null, tags:["glass","modern"],           metadata:{width:800, height:1200}, groupId:"g2", createdAt:"2024-01-16T00:00:00.000Z" },
  { id:"p17", url:"https://picsum.photos/seed/170/900/900",   thumbnailUrl:"https://picsum.photos/seed/170/400/300", title:"Staircase Spiral", description:null, tags:["interior","geometry"],      metadata:{width:900, height:900},  groupId:"g2", createdAt:"2024-01-17T00:00:00.000Z" },
  { id:"p18", url:"https://picsum.photos/seed/180/1200/800",  thumbnailUrl:"https://picsum.photos/seed/180/400/300", title:"Arched Corridor",  description:null, tags:["arch","symmetry"],          metadata:{width:1200,height:800},  groupId:"g2", createdAt:"2024-01-18T00:00:00.000Z" },
  { id:"p19", url:"https://picsum.photos/seed/190/1200/800",  thumbnailUrl:"https://picsum.photos/seed/190/400/300", title:"Rooftop Grid",     description:null, tags:["aerial","pattern"],         metadata:{width:1200,height:800},  groupId:"g2", createdAt:"2024-01-19T00:00:00.000Z" },
  { id:"p20", url:"https://picsum.photos/seed/200/1200/900",  thumbnailUrl:"https://picsum.photos/seed/200/400/300", title:"Concrete Steps",   description:null, tags:["concrete","minimal"],       metadata:{width:1200,height:900},  groupId:"g2", createdAt:"2024-01-20T00:00:00.000Z" },
  { id:"p21", url:"https://picsum.photos/seed/210/900/1200",  thumbnailUrl:"https://picsum.photos/seed/210/400/300", title:"Wooden Lattice",   description:null, tags:["wood","pattern"],           metadata:{width:900, height:1200}, groupId:"g2", createdAt:"2024-01-21T00:00:00.000Z" },
  { id:"p22", url:"https://picsum.photos/seed/220/1200/800",  thumbnailUrl:"https://picsum.photos/seed/220/400/300", title:"Bridge Lines",     description:null, tags:["bridge","steel"],           metadata:{width:1200,height:800},  groupId:"g2", createdAt:"2024-01-22T00:00:00.000Z" },
  { id:"p23", url:"https://picsum.photos/seed/230/800/1200",  thumbnailUrl:"https://picsum.photos/seed/230/400/300", title:"Window Grid",      description:null, tags:["window","geometry"],        metadata:{width:800, height:1200}, groupId:"g2", createdAt:"2024-01-23T00:00:00.000Z" },
  { id:"p24", url:"https://picsum.photos/seed/240/1000/1000", thumbnailUrl:"https://picsum.photos/seed/240/400/300", title:"Dome Interior",    description:null, tags:["dome","light"],             metadata:{width:1000,height:1000}, groupId:"g2", createdAt:"2024-01-24T00:00:00.000Z" },
  { id:"p25", url:"https://picsum.photos/seed/250/1200/800",  thumbnailUrl:"https://picsum.photos/seed/250/400/300", title:"Brick Wall",       description:null, tags:["brick","texture"],          metadata:{width:1200,height:800},  groupId:"g2", createdAt:"2024-01-25T00:00:00.000Z" },
  { id:"p26", url:"https://picsum.photos/seed/260/800/1200",  thumbnailUrl:"https://picsum.photos/seed/260/400/300", title:"Steel Column",     description:null, tags:["steel","structure"],        metadata:{width:800, height:1200}, groupId:"g2", createdAt:"2024-01-26T00:00:00.000Z" },
  { id:"p27", url:"https://picsum.photos/seed/270/1200/800",  thumbnailUrl:"https://picsum.photos/seed/270/400/300", title:"Balcony Row",      description:null, tags:["balcony","repetition"],     metadata:{width:1200,height:800},  groupId:"g2", createdAt:"2024-01-27T00:00:00.000Z" },
  { id:"p28", url:"https://picsum.photos/seed/280/1200/900",  thumbnailUrl:"https://picsum.photos/seed/280/400/300", title:"Shadow Play",      description:null, tags:["shadow","light"],           metadata:{width:1200,height:900},  groupId:"g2", createdAt:"2024-01-28T00:00:00.000Z" },
  // Experimental
  { id:"p29", url:"https://picsum.photos/seed/290/1200/800",  thumbnailUrl:"https://picsum.photos/seed/290/400/300", title:"Double Exposure",  description:null, tags:["experimental","overlay"],   metadata:{width:1200,height:800},  groupId:"g3", createdAt:"2024-01-29T00:00:00.000Z" },
  { id:"p30", url:"https://picsum.photos/seed/300/1200/800",  thumbnailUrl:"https://picsum.photos/seed/300/400/300", title:"Long Exposure",    description:null, tags:["motion","blur"],            metadata:{width:1200,height:800},  groupId:"g3", createdAt:"2024-01-30T00:00:00.000Z" },
  { id:"p31", url:"https://picsum.photos/seed/310/1000/1000", thumbnailUrl:"https://picsum.photos/seed/310/400/300", title:"Chromatic Split",  description:null, tags:["color","glitch"],           metadata:{width:1000,height:1000}, groupId:"g3", createdAt:"2024-01-31T00:00:00.000Z" },
  { id:"p32", url:"https://picsum.photos/seed/320/1200/800",  thumbnailUrl:"https://picsum.photos/seed/320/400/300", title:"Mirror World",     description:null, tags:["reflection","abstract"],    metadata:{width:1200,height:800},  groupId:"g3", createdAt:"2024-02-01T00:00:00.000Z" },
  { id:"p33", url:"https://picsum.photos/seed/330/900/1200",  thumbnailUrl:"https://picsum.photos/seed/330/400/300", title:"Noise Field",      description:null, tags:["texture","grain"],          metadata:{width:900, height:1200}, groupId:"g3", createdAt:"2024-02-02T00:00:00.000Z" },
  { id:"p34", url:"https://picsum.photos/seed/340/1200/800",  thumbnailUrl:"https://picsum.photos/seed/340/400/300", title:"Light Leak",       description:null, tags:["analog","light"],           metadata:{width:1200,height:800},  groupId:"g3", createdAt:"2024-02-03T00:00:00.000Z" },
  { id:"p35", url:"https://picsum.photos/seed/350/1200/900",  thumbnailUrl:"https://picsum.photos/seed/350/400/300", title:"Infrared Tone",    description:null, tags:["infrared","surreal"],       metadata:{width:1200,height:900},  groupId:"g3", createdAt:"2024-02-04T00:00:00.000Z" },
  { id:"p36", url:"https://picsum.photos/seed/360/1200/800",  thumbnailUrl:"https://picsum.photos/seed/360/400/300", title:"Tilt Shift",       description:null, tags:["miniature","focus"],        metadata:{width:1200,height:800},  groupId:"g3", createdAt:"2024-02-05T00:00:00.000Z" },
  { id:"p37", url:"https://picsum.photos/seed/370/800/1200",  thumbnailUrl:"https://picsum.photos/seed/370/400/300", title:"Prism Break",      description:null, tags:["prism","color"],            metadata:{width:800, height:1200}, groupId:"g3", createdAt:"2024-02-06T00:00:00.000Z" },
  { id:"p38", url:"https://picsum.photos/seed/380/1200/800",  thumbnailUrl:"https://picsum.photos/seed/380/400/300", title:"Fog Layer",        description:null, tags:["fog","atmosphere"],         metadata:{width:1200,height:800},  groupId:"g3", createdAt:"2024-02-07T00:00:00.000Z" },
  { id:"p39", url:"https://picsum.photos/seed/390/1000/1000", thumbnailUrl:"https://picsum.photos/seed/390/400/300", title:"Grain Study",      description:null, tags:["grain","monochrome"],       metadata:{width:1000,height:1000}, groupId:"g3", createdAt:"2024-02-08T00:00:00.000Z" },
  { id:"p40", url:"https://picsum.photos/seed/400/1200/800",  thumbnailUrl:"https://picsum.photos/seed/400/400/300", title:"Vortex",           description:null, tags:["abstract","motion"],        metadata:{width:1200,height:800},  groupId:"g3", createdAt:"2024-02-09T00:00:00.000Z" },
];

async function getPhotos() {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: { createdAt: "desc" },
      take: 60,
      include: {
        group: { select: { id: true, name: true, slug: true, defaultView: true } },
      },
    });

    if (photos.length === 0) return FALLBACK_PHOTOS;

    return photos.map((p) => ({
      ...p,
      tags: parseTags(p.tags),
      metadata: parseMetadata(p.metadata),
      createdAt: p.createdAt.toISOString(),
    }));
  } catch (err) {
    console.error("[HomePage] getPhotos failed:", err);
    return FALLBACK_PHOTOS;
  }
}

async function getGroups() {
  try {
    const groups = await prisma.group.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, slug: true, defaultView: true },
    });

    return groups.length > 0 ? groups : FALLBACK_GROUPS;
  } catch (err) {
    console.error("[HomePage] getGroups failed:", err);
    return FALLBACK_GROUPS;
  }
}

export default async function HomePage() {
  const [photos, groups] = await Promise.all([getPhotos(), getGroups()]);

  return <HomeClient photos={photos} groups={groups} />;
}
