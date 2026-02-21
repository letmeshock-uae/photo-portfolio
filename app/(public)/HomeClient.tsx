"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { GalleryView } from "@/components/GalleryView";
import type { PhotoItem } from "@/lib/store";

interface Group {
  id: string;
  name: string;
  slug: string;
  defaultView: string;
}

interface HomeClientProps {
  photos: PhotoItem[];
  groups: Group[];
}

export function HomeClient({ photos, groups }: HomeClientProps) {
  const [entered, setEntered] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!entered && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-black cursor-pointer"
            onClick={() => setEntered(true)}
          >
            {/* Animated geometric shape */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="mb-12"
            >
              <svg
                viewBox="0 0 120 120"
                className="w-24 h-24 text-white/20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              >
                <motion.rect
                  x="10" y="10" width="100" height="100"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="60" cy="60" r="35"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.7, ease: "easeInOut" }}
                />
                <motion.line
                  x1="10" y1="60" x2="110" y2="60"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1.2, ease: "easeInOut" }}
                />
                <motion.line
                  x1="60" y1="10" x2="60" y2="110"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1.4, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-white text-4xl md:text-6xl font-light tracking-[0.15em] uppercase mb-3"
            >
              Portfolio
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="text-white text-sm tracking-[0.3em] uppercase"
            >
              Commercial · Still Life · Experimental
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="absolute bottom-12 flex flex-col items-center gap-2"
            >
              <p className="text-white/30 text-xs tracking-widest uppercase">Enter</p>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <svg className="w-4 h-4 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main gallery — always mounted but invisible until entered */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: entered ? 1 : 0 }}
        transition={{ duration: 0.6, delay: entered ? 0.3 : 0 }}
        className="pt-20"
      >
        {/* Group filter */}
        {groups.length > 0 && (
          <div className="flex gap-4 px-6 pb-4 overflow-x-auto scrollbar-hide">
            <Link
              href="/"
              className="text-xs text-white/40 hover:text-white transition-colors tracking-widest uppercase whitespace-nowrap"
            >
              All
            </Link>
            {groups.map((g) => (
              <Link
                key={g.id}
                href={`/work/${g.slug}`}
                className="text-xs text-white/40 hover:text-white transition-colors tracking-widest uppercase whitespace-nowrap"
              >
                {g.name}
              </Link>
            ))}
          </div>
        )}

        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-white/20">
            <svg className="w-16 h-16 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p className="text-sm tracking-widest uppercase">No photos yet</p>
            <p className="text-xs mt-2 text-white/10">
              Upload photos from the{" "}
              <Link href="/admin" className="underline hover:text-white/30">
                admin panel
              </Link>
            </p>
          </div>
        ) : (
          <GalleryView photos={photos} />
        )}
      </motion.div>
    </>
  );
}
