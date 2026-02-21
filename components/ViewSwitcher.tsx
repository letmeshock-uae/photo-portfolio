"use client";

import { motion } from "framer-motion";
import { useGalleryStore, type ViewMode } from "@/lib/store";
import { cn } from "@/lib/utils";

const views: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
  {
    mode: "grid",
    label: "Grid",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <rect x="1" y="1" width="7" height="7" rx="1" />
        <rect x="12" y="1" width="7" height="7" rx="1" />
        <rect x="1" y="12" width="7" height="7" rx="1" />
        <rect x="12" y="12" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    mode: "carousel",
    label: "Filmstrip",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <rect x="1" y="5" width="4" height="10" rx="1" />
        <rect x="8" y="5" width="4" height="10" rx="1" />
        <rect x="15" y="5" width="4" height="10" rx="1" />
      </svg>
    ),
  },
  {
    mode: "wall",
    label: "Fullscreen",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <rect x="1" y="1" width="18" height="18" rx="1" />
      </svg>
    ),
  },
];

export function ViewSwitcher() {
  const { viewMode, setViewMode } = useGalleryStore();

  return (
    <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full p-1 border border-white/10">
      {views.map(({ mode, label, icon }) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          title={label}
          className={cn(
            "relative flex items-center justify-center w-9 h-9 rounded-full text-sm font-medium transition-colors duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
            viewMode === mode
              ? "text-black"
              : "text-white/60 hover:text-white active:scale-95"
          )}
        >
          {viewMode === mode && (
            <motion.span
              layoutId="view-pill"
              className="absolute inset-0 bg-white rounded-full"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{icon}</span>
        </button>
      ))}
    </div>
  );
}
