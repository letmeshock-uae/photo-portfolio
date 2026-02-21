"use client";

import { useGalleryStore, type PhotoItem } from "@/lib/store";
import { GalleryMasonry } from "./GalleryMasonry";
import { GalleryFilmstrip } from "./GalleryFilmstrip";
import { GalleryWall } from "./GalleryWall";
import { AnimatePresence, motion } from "framer-motion";

interface GalleryViewProps {
  photos: PhotoItem[];
  defaultView?: string;
}

export function GalleryView({ photos, defaultView }: GalleryViewProps) {
  const { viewMode } = useGalleryStore();

  // Use defaultView only on first render if store is at default
  const mode = viewMode;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {mode === "grid" && <GalleryMasonry photos={photos} />}
        {mode === "carousel" && <GalleryFilmstrip photos={photos} />}
        {mode === "wall" && <GalleryWall photos={photos} />}
      </motion.div>
    </AnimatePresence>
  );
}
