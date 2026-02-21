"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGalleryStore, type PhotoItem } from "@/lib/store";
import { ImageCanvas } from "./ImageCanvas";

interface GalleryFilmstripProps {
  photos: PhotoItem[];
}

export function GalleryFilmstrip({ photos }: GalleryFilmstripProps) {
  const { openLightbox } = useGalleryStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -500 : 500,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative flex items-center h-[70vh] bg-black">
      {/* Left arrow */}
      <button
        className="absolute left-4 z-10 text-white/50 hover:text-white transition-colors active:scale-95 p-2"
        onClick={() => scroll("left")}
        aria-label="Scroll left"
      >
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Filmstrip */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide h-full px-16 py-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {photos.map((photo, idx) => (
          <motion.div
            key={photo.id}
            layoutId={`photo-${photo.id}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.4 }}
            className="relative flex-none h-full snap-center cursor-pointer group"
            style={{ width: "clamp(200px, 40vw, 500px)" }}
            onClick={() => openLightbox(photo, photos, idx)}
          >
            <ImageCanvas
              src={photo.thumbnailUrl}
              alt={photo.title ?? "Photo"}
              fill
              priority={idx < 2}
              className="rounded-sm transition-transform duration-500 group-hover:scale-[1.02]"
            />
            {photo.title && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm font-light">{photo.title}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Right arrow */}
      <button
        className="absolute right-4 z-10 text-white/50 hover:text-white transition-colors active:scale-95 p-2"
        onClick={() => scroll("right")}
        aria-label="Scroll right"
      >
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
