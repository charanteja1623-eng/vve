import Image from "next/image";
import { FRAME_W, FRAME_H } from "@/components/loader/logoShards";
import { site } from "@/lib/site";

/**
 * Canonical Vintage Vibe Events logo mark — the single source of truth for the
 * assembled brand lockup. The ornamental frame is the master-quality raster
 * extracted from the client's Canva PDF (public/vve-frame.png); the wordmark is
 * live text in Cinzel Decorative Bold (the exact face used in the source),
 * locked to the frame's proportions. The §7 loader's final state is built to
 * match this exactly, and this component is the reduced-motion fallback.
 */
export default function LogoMark({
  className = "",
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
        sizes="(max-width: 640px) 80vw, 560px"
        className="object-contain"
        aria-hidden
      />
      <span className="vve-wordmark" aria-hidden>
        VINTAGE VIBE EVENTS
      </span>
    </div>
  );
}
