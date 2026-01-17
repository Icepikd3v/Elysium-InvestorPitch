import IllustrationImage from "./IllustrationImage";

function cx(...c) {
  return c.filter(Boolean).join(" ");
}

function resolveHref(src) {
  if (!src) return null;
  if (typeof src === "string") return src;
  if (typeof src === "object" && src?.src) return src.src; // imported static image
  return null;
}

function toAspectRatio(aspect) {
  // Allow: "video" | "square" | "[16/10]" | "[4/3]" | "16/9" | "4/3"
  if (!aspect) return "16 / 9";
  if (aspect === "video") return "16 / 9";
  if (aspect === "square") return "1 / 1";

  const cleaned = String(aspect).replace("[", "").replace("]", "").trim();
  // If user passed "16/10" or "4/3"
  if (cleaned.includes("/")) {
    const [w, h] = cleaned.split("/").map((x) => x.trim());
    if (w && h) return `${w} / ${h}`;
  }
  return "16 / 9";
}

/**
 * IllustrationFrame
 * - Uses inline aspectRatio (production-safe)
 * - Optional click-to-expand overlay
 */
export default function IllustrationFrame({
  className = "",
  src,
  alt = "",
  caption = "",
  fit = "contain", // ✅ default contain to avoid cropping
  aspect = "video",
  maxH = "520px",
  minH = "240px",
  priority = false,
  children,

  // zoom
  zoomEnabled = true,
  zoomHref,
  zoomTarget = "_blank",
  zoomRel = "noreferrer",
  showZoomBadge = true,
}) {
  const resolved = zoomHref ?? resolveHref(src);
  const canZoom = Boolean(zoomEnabled && resolved);

  return (
    <figure
      className={cx(
        "rounded-3xl border border-black/10 bg-white shadow-sm",
        className,
      )}
    >
      <div
        className="relative w-full overflow-hidden rounded-3xl bg-black/5"
        style={{
          aspectRatio: toAspectRatio(aspect),
          maxHeight: maxH,
          minHeight: minH,
        }}
      >
        {children ? (
          children
        ) : (
          <IllustrationImage
            src={src}
            alt={alt}
            fit={fit}
            priority={priority}
            className="h-full w-full"
          />
        )}

        {/* Click overlay */}
        {canZoom ? (
          <a
            href={resolved}
            target={zoomTarget}
            rel={zoomRel}
            aria-label={alt ? `Open full size: ${alt}` : "Open full size image"}
            className="absolute inset-0 z-10 cursor-zoom-in"
          />
        ) : null}

        {canZoom && showZoomBadge ? (
          <div className="pointer-events-none absolute bottom-3 right-3 z-20 rounded-full bg-black/60 px-3 py-1 text-xs text-white shadow-sm">
            Click to expand
          </div>
        ) : null}

        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/40" />
      </div>

      {caption ? (
        <figcaption className="flex items-center justify-between gap-3 px-5 py-3 text-xs text-black/60">
          <span>{caption}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
