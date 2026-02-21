"use client";

interface GeometricPlaceholderProps {
  className?: string;
}

export function GeometricPlaceholder({ className }: GeometricPlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center bg-neutral-900 ${className ?? ""}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-1/3 h-1/3 opacity-30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <rect x="10" y="10" width="35" height="35" />
        <rect x="55" y="10" width="35" height="35" />
        <rect x="10" y="55" width="35" height="35" />
        <circle cx="72" cy="72" r="17" />
        <line x1="10" y1="10" x2="45" y2="45" />
      </svg>
    </div>
  );
}
