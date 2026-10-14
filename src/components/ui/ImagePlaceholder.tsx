import React from "react";

interface ImagePlaceholderProps {
  title?: string;
  category?: string;
  aspectRatio?: string;
  className?: string;
  alt?: string;
}

/**
 * Brand-consistent neutral burgundy & antique gold placeholder block.
 * Replaces unapproved external prototype/stock imagery.
 * Zero external network requests, zero stock photos.
 */
export default function ImagePlaceholder({
  title = "Curated Event Scenography",
  category,
  aspectRatio = "16/10",
  className = "",
  alt = "Placeholder — Event photography pending",
}: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`vve-placeholder-block border border-gold/25 relative overflow-hidden group ${className}`}
      style={{ aspectRatio }}
    >
      {/* Decorative Gold Filigree Corner Accents */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-gold/40 pointer-events-none" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-gold/40 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-gold/40 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-gold/40 pointer-events-none" />

      {/* Background Watermark Filigree Motif */}
      <div className="vve-placeholder-watermark" aria-hidden="true">
        <svg
          width="160"
          height="160"
          viewBox="0 0 100 100"
          fill="none"
          stroke="#c9a15a"
          strokeWidth="1"
          className="transform rotate-45"
        >
          <rect x="20" y="20" width="60" height="60" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="28" />
          <circle cx="50" cy="50" r="16" />
          <path d="M50 10 L50 90 M10 50 L90 50" />
        </svg>
      </div>

      {/* Content */}
      <div className="vve-placeholder-content max-w-xs px-4">
        {category && (
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gold/80 px-2 py-0.5 rounded bg-burgundy-deep/80 border border-gold/20 mb-1">
            {category}
          </span>
        )}
        <h4 className="font-serif text-base sm:text-lg text-ivory tracking-wide leading-snug">
          {title}
        </h4>
        <div className="h-px w-12 bg-gradient-to-r from-transparent via-gold/50 to-transparent my-1" />
        <span className="font-sans text-[10px] uppercase tracking-wider text-ivory/60 bg-burgundy-deep/60 px-2.5 py-1 rounded border border-gold/15">
          Event Photography Placeholder
        </span>
      </div>
    </div>
  );
}
