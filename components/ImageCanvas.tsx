"use client";

import Image from "next/image";
import { useState } from "react";
import { GeometricPlaceholder } from "./GeometricPlaceholder";
import { cn } from "@/lib/utils";

interface ImageCanvasProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  fill?: boolean;
  onClick?: () => void;
  layoutId?: string;
}

export function ImageCanvas({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  fill = false,
  onClick,
}: ImageCanvasProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (error) {
    return (
      <GeometricPlaceholder
        className={cn("w-full h-full", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        !loaded && "bg-neutral-900",
        className
      )}
      onClick={onClick}
    >
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-neutral-800" />
      )}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : (width ?? 800)}
        height={fill ? undefined : (height ?? 600)}
        fill={fill}
        priority={priority}
        className={cn(
          "object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
