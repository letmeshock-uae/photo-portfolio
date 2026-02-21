"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface UploadItem {
  file: File;
  id: string;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
  url?: string;
  error?: string;
}

interface AdminUploaderProps {
  groupId?: string;
  onUploadComplete?: () => void;
}

export function AdminUploader({ groupId, onUploadComplete }: AdminUploaderProps) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    const newItems: UploadItem[] = imageFiles.map((file) => ({
      file,
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      status: "pending",
      progress: 0,
    }));
    setItems((prev) => [...prev, ...newItems]);
    newItems.forEach((item) => uploadFile(item));
  };

  const uploadFile = async (item: UploadItem) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, status: "uploading", progress: 10 } : i
      )
    );

    const formData = new FormData();
    formData.append("file", item.file);
    if (groupId) formData.append("groupId", groupId);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id && i.status === "uploading"
              ? { ...i, progress: Math.min(i.progress + 15, 85) }
              : i
          )
        );
      }, 300);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(data.error ?? "Upload failed");
      }

      const data = await res.json();

      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, status: "done", progress: 100, url: data.url }
            : i
        )
      );

      onUploadComplete?.();
    } catch (err) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                status: "error",
                progress: 0,
                error: err instanceof Error ? err.message : "Upload failed",
              }
            : i
        )
      );
    }
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(Array.from(e.dataTransfer.files));
    },
    [groupId]
  );

  const clearDone = () => {
    setItems((prev) => prev.filter((i) => i.status !== "done"));
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-200 cursor-pointer",
          isDragging
            ? "border-white/60 bg-white/5"
            : "border-white/20 hover:border-white/40"
        )}
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.multiple = true;
          input.onchange = (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (files) addFiles(Array.from(files));
          };
          input.click();
        }}
      >
        <div className="text-white/40 mb-2">
          <svg className="w-10 h-10 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="text-sm">Drop images here or click to browse</p>
          <p className="text-xs mt-1 text-white/20">JPG, PNG, WebP up to 50MB</p>
        </div>
      </div>

      {/* Upload list */}
      <AnimatePresence>
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/50">
                {items.filter((i) => i.status === "done").length} /{" "}
                {items.length} uploaded
              </span>
              {items.some((i) => i.status === "done") && (
                <button
                  onClick={clearDone}
                  className="text-xs text-white/30 hover:text-white/60 transition-colors"
                >
                  Clear done
                </button>
              )}
            </div>

            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white/5 rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white/70 truncate max-w-[60%]">
                    {item.file.name}
                  </span>
                  <span
                    className={cn("text-xs", {
                      "text-yellow-400": item.status === "uploading",
                      "text-green-400": item.status === "done",
                      "text-red-400": item.status === "error",
                      "text-white/30": item.status === "pending",
                    })}
                  >
                    {item.status === "uploading"
                      ? `${item.progress}%`
                      : item.status}
                  </span>
                </div>

                {item.status === "uploading" && (
                  <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white/60 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}

                {item.status === "error" && (
                  <p className="text-xs text-red-400 mt-1">{item.error}</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
