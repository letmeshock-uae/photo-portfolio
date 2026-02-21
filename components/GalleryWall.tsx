"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGalleryStore, type PhotoItem } from "@/lib/store";
import { ImageCanvas } from "./ImageCanvas";

interface GalleryWallProps {
  photos: PhotoItem[];
}

export function GalleryWall({ photos }: GalleryWallProps) {
  const { openLightbox } = useGalleryStore();
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + photos.length) % photos.length);
  const next = () => setCurrent((c) => (c + 1) % photos.length);

  if (!photos.length) return null;

  const photo = photos[current];

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={photo.id}
          layoutId={`photo-${photo.id}`}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 cursor-zoom-in"
          onClick={() => openLightbox(photo, photos, current)}
        >
          <ImageCanvas
            src={photo.url}
            alt={photo.title ?? "Photo"}
            fill
            priority
            className="w-full h-full"
          />
          {/* Overlay gradient for caption */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* Caption */}
      {photo.title && (
        <motion.div
          key={`caption-${photo.id}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-20 left-8 text-white"
        >
          <p className="text-xl font-light tracking-wide">{photo.title}</p>
          {photo.description && (
            <p className="text-sm text-white/60 mt-1">{photo.description}</p>
          )}
        </motion.div>
      )}

      {/* Counter */}
      <div className="absolute bottom-8 left-8 text-white/40 text-sm font-light tracking-widest">
        {String(current + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
      </div>

      {/* Navigation */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-4 active:scale-95"
        onClick={prev}
        aria-label="Previous"
      >
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-4 active:scale-95"
        onClick={next}
        aria-label="Next"
      >
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Thumbnail strip */}
      <div className="absolute bottom-8 right-8 flex gap-1">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-6 h-1 rounded-full transition-colors duration-200 ${
              i === current ? "bg-white" : "bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
