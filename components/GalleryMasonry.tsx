"use client";

import { motion } from "framer-motion";
import { useGalleryStore, type PhotoItem } from "@/lib/store";
import { ImageCanvas } from "./ImageCanvas";
import { parseTags, parseMetadata } from "@/lib/utils";

interface GalleryMasonryProps {
  photos: PhotoItem[];
}

export function GalleryMasonry({ photos }: GalleryMasonryProps) {
  const { openLightbox } = useGalleryStore();

  // Split photos into 3 columns
  const columns: PhotoItem[][] = [[], [], []];
  photos.forEach((photo, i) => {
    columns[i % 3].push(photo);
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-4 py-6 max-w-screen-2xl mx-auto">
      {columns.map((col, colIdx) => (
        <div key={colIdx} className="flex flex-col gap-2">
          {col.map((photo, idx) => {
            const meta = parseMetadata(
              typeof photo.metadata === "string"
                ? photo.metadata
                : JSON.stringify(photo.metadata)
            );
            const aspect =
              meta.width && meta.height
                ? (meta.height as number) / (meta.width as number)
                : 0.75;

            const globalIdx = colIdx + idx * 3;

            return (
              <motion.div
                key={photo.id}
                layoutId={`photo-${photo.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: globalIdx * 0.05, duration: 0.4 }}
                className="relative overflow-hidden rounded-sm cursor-pointer group"
                style={{ paddingBottom: `${aspect * 100}%` }}
                onClick={() => openLightbox(photo, photos, globalIdx)}
              >
                <div className="absolute inset-0">
                  <ImageCanvas
                    src={photo.thumbnailUrl}
                    alt={photo.title ?? "Photo"}
                    fill
                    priority={globalIdx < 2}
                    className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  {photo.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm font-light">
                        {photo.title}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
