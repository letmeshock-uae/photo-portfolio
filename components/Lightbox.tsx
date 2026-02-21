"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGalleryStore } from "@/lib/store";
import { ImageCanvas } from "./ImageCanvas";

export function Lightbox() {
  const { lightboxPhoto, closeLightbox, nextPhoto, prevPhoto } =
    useGalleryStore();

  useEffect(() => {
    if (!lightboxPhoto) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxPhoto, closeLightbox, nextPhoto, prevPhoto]);

  return (
    <AnimatePresence>
      {lightboxPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors text-2xl leading-none active:scale-95 z-10"
            onClick={closeLightbox}
            aria-label="Close"
          >
            ✕
          </button>

          {/* Prev */}
          <button
            className="absolute left-4 text-white/50 hover:text-white transition-colors p-3 active:scale-95 z-10"
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
            aria-label="Previous photo"
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Next */}
          <button
            className="absolute right-4 text-white/50 hover:text-white transition-colors p-3 active:scale-95 z-10"
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
            aria-label="Next photo"
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Image */}
          <motion.div
            key={lightboxPhoto.id}
            layoutId={`photo-${lightboxPhoto.id}`}
            className="relative max-w-[90vw] max-h-[85vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <ImageCanvas
              src={lightboxPhoto.url}
              alt={lightboxPhoto.title ?? "Photo"}
              fill
              className="rounded-sm"
            />
          </motion.div>

          {/* Caption */}
          {lightboxPhoto.title && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-6 left-0 right-0 text-center text-white/70 text-sm"
            >
              {lightboxPhoto.title}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
