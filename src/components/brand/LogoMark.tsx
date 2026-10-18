import Image from "next/image";
import { site } from "@/lib/site";

export const FRAME_W = 720;
export const FRAME_H = 436;

/**
 * Canonical Vintage Vibe Events logo mark — the single source of truth for the
 * assembled brand lockup. The ornamental frame is the master-quality raster
 * extracted from the client's Canva master (public/vve-frame.png); the wordmark is
 * Cinzel Decorative Regular 400 locked to the frame's proportions.
 */
export default function LogoMark({
  className = "w-[min(84vw,540px)]",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        aspectRatio: `${FRAME_W} / ${FRAME_H}`,
        containerType: "inline-size",
      }}
      role="img"
      aria-label={site.name}
    >
      <Image
        src="/vve-frame.png"
        alt=""
        fill
        priority={priority}
        sizes="(max-width: 640px) 84vw, 540px"
        className="object-contain"
        aria-hidden
      />
      <div className="vve-wordmark" aria-hidden>
        <span className="vve-word">VINTAGE</span>
        <span className="vve-word">VIBE</span>
        <span className="vve-word">EVENTS</span>
      </div>
    </div>
  );
}
