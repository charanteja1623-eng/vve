/**
 * Vintage Vibe Events — Anatomical Ornamental Shard Definitions
 *
 * Sliced according to the natural architectural motifs of the canonical
 * master frame artwork (public/vve-frame.png, 720x436).
 *
 * Eliminates artificial rectangular brick slicing and ensures every fragment
 * represents a coherent architectural section of the royal filigree:
 *   - Central crown crest & bottom pendant
 *   - Curving corner scrolls & outer flourishes
 *   - The central cartouche rails & notched side brackets
 *
 * Each shard uses exact clip-path geometry over the 720x436 coordinate space,
 * ensuring 100% pixel coverage and flawless settling into the master frame.
 */

export const FRAME_W = 720;
export const FRAME_H = 436;

export type Shard = {
  id: string;
  clipTop: number; // %
  clipRight: number; // %
  clipBottom: number; // %
  clipLeft: number; // %
  ox: number; // transform-origin X %
  oy: number; // transform-origin Y %
  dx: number; // start offset X (px)
  dy: number; // start offset Y (px)
  rot: number; // start rotation (deg)
  sc: number; // start scale
  delay: number; // start delay (s)
};

export const SHARDS: Shard[] = [
  // 1. Top Crown Crest (descends from above)
  {
    id: "top-crest",
    clipTop: 4.13, clipRight: 34.03, clipBottom: 62.61, clipLeft: 34.03,
    ox: 50.0, oy: 20.8,
    dx: 0, dy: -36, rot: 0, sc: 0.92, delay: 0.85,
  },
  // 2-3. Upper Spiraling Scrolls (converge from diagonals)
  {
    id: "top-left-scroll",
    clipTop: 9.17, clipRight: 62.50, clipBottom: 62.16, clipLeft: 20.14,
    ox: 28.8, oy: 23.5,
    dx: -42, dy: -28, rot: -7, sc: 0.90, delay: 0.96,
  },
  {
    id: "top-right-scroll",
    clipTop: 9.17, clipRight: 20.14, clipBottom: 62.16, clipLeft: 62.50,
    ox: 71.2, oy: 23.5,
    dx: 42, dy: -28, rot: 7, sc: 0.90, delay: 0.96,
  },
  // 4-5. Upper Outer Flourishes (glide in from upper flanks)
  {
    id: "top-left-flourish",
    clipTop: 16.06, clipRight: 77.36, clipBottom: 61.01, clipLeft: 6.67,
    ox: 14.7, oy: 27.5,
    dx: -50, dy: -14, rot: 4, sc: 0.88, delay: 1.08,
  },
  {
    id: "top-right-flourish",
    clipTop: 16.06, clipRight: 6.67, clipBottom: 61.01, clipLeft: 77.36,
    ox: 85.3, oy: 27.5,
    dx: 50, dy: -14, rot: -4, sc: 0.88, delay: 1.08,
  },
  // 6-9. Central Cartouche Rails and Notched Side Brackets
  {
    id: "cartouche-top-rail",
    clipTop: 35.55, clipRight: 10.42, clipBottom: 56.42, clipLeft: 10.42,
    ox: 50.0, oy: 39.6,
    dx: 0, dy: -18, rot: 0, sc: 0.96, delay: 1.20,
  },
  {
    id: "cartouche-left-notch",
    clipTop: 36.70, clipRight: 84.31, clipBottom: 36.93, clipLeft: 6.67,
    ox: 11.2, oy: 49.9,
    dx: -28, dy: 0, rot: 0, sc: 0.94, delay: 1.28,
  },
  {
    id: "cartouche-right-notch",
    clipTop: 36.70, clipRight: 6.67, clipBottom: 36.93, clipLeft: 85.00,
    ox: 89.2, oy: 49.9,
    dx: 28, dy: 0, rot: 0, sc: 0.94, delay: 1.28,
  },
  {
    id: "cartouche-bottom-rail",
    clipTop: 55.05, clipRight: 10.42, clipBottom: 35.78, clipLeft: 10.42,
    ox: 50.0, oy: 59.6,
    dx: 0, dy: 18, rot: 0, sc: 0.96, delay: 1.20,
  },
  // 10-11. Lower Spiraling Scrolls (converge from lower diagonals)
  {
    id: "bottom-left-scroll",
    clipTop: 60.78, clipRight: 62.50, clipBottom: 11.70, clipLeft: 20.14,
    ox: 28.8, oy: 74.5,
    dx: -42, dy: 28, rot: 7, sc: 0.90, delay: 1.38,
  },
  {
    id: "bottom-right-scroll",
    clipTop: 60.78, clipRight: 20.14, clipBottom: 11.70, clipLeft: 62.50,
    ox: 71.2, oy: 74.5,
    dx: 42, dy: 28, rot: -7, sc: 0.90, delay: 1.38,
  },
  // 12-13. Lower Outer Flourishes (glide in from lower flanks)
  {
    id: "bottom-left-flourish",
    clipTop: 59.63, clipRight: 77.36, clipBottom: 18.58, clipLeft: 6.67,
    ox: 14.7, oy: 70.5,
    dx: -50, dy: 14, rot: -4, sc: 0.88, delay: 1.48,
  },
  {
    id: "bottom-right-flourish",
    clipTop: 59.63, clipRight: 6.67, clipBottom: 18.58, clipLeft: 77.08,
    ox: 85.2, oy: 70.5,
    dx: 50, dy: 14, rot: 4, sc: 0.88, delay: 1.48,
  },
  // 14. Bottom Pendant Finial (ascends gracefully from below)
  {
    id: "bottom-pendant",
    clipTop: 63.07, clipRight: 34.03, clipBottom: 4.82, clipLeft: 34.03,
    ox: 50.0, oy: 79.1,
    dx: 0, dy: 36, rot: 0, sc: 0.92, delay: 1.58,
  },
];
