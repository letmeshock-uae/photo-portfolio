"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ViewMode = "grid" | "carousel" | "wall";

interface GalleryStore {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  lightboxPhoto: PhotoItem | null;
  lightboxIndex: number;
  lightboxPhotos: PhotoItem[];
  openLightbox: (photo: PhotoItem, photos: PhotoItem[], index: number) => void;
  closeLightbox: () => void;
  nextPhoto: () => void;
  prevPhoto: () => void;
}

export interface PhotoItem {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string | null;
  description: string | null;
  tags: string[];
  metadata: Record<string, unknown>;
  groupId: string | null;
  createdAt: string;
}

export const useGalleryStore = create<GalleryStore>()(
  persist(
    (set, get) => ({
      viewMode: "grid",
      setViewMode: (mode) => set({ viewMode: mode }),
      lightboxPhoto: null,
      lightboxIndex: 0,
      lightboxPhotos: [],
      openLightbox: (photo, photos, index) =>
        set({ lightboxPhoto: photo, lightboxPhotos: photos, lightboxIndex: index }),
      closeLightbox: () =>
        set({ lightboxPhoto: null, lightboxPhotos: [], lightboxIndex: 0 }),
      nextPhoto: () => {
        const { lightboxIndex, lightboxPhotos } = get();
        const next = (lightboxIndex + 1) % lightboxPhotos.length;
        set({ lightboxIndex: next, lightboxPhoto: lightboxPhotos[next] });
      },
      prevPhoto: () => {
        const { lightboxIndex, lightboxPhotos } = get();
        const prev =
          (lightboxIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length;
        set({ lightboxIndex: prev, lightboxPhoto: lightboxPhotos[prev] });
      },
    }),
    {
      name: "gallery-view",
      partialize: (state) => ({ viewMode: state.viewMode }),
    }
  )
);
