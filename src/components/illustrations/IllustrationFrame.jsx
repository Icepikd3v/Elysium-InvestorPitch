import IllustrationImage from "./IllustrationImage";

function cx(...c) {
  return c.filter(Boolean).join(" ");
}

/**
 * IllustrationFrame (PROD-SAFE)
 * - Uses CSS aspect-ratio instead of Tailwind dynamic classes (avoids purge issues).
 *
 * aspect:
 *  - "16/10" | "4/3" | "1/1" | "920/360" etc.
 */
export default function IllustrationFrame({
  className = "",
  src,
  alt = "",
  caption = "",
  fit = "cover", // "cover" | "contain"
  aspect = "16/9",
  maxH = "520px",
  priority = false,
  sizes = "(min-width: 1024px) 720px, 92vw",
  children,
}) {
  // Normalize aspect like "16/10" -> "16 / 10" (valid CSS aspect-ratio)
  const aspectRatio = String(aspect).includes("/")
    ? String(aspect).replace("/", " / ")
    : String(aspect);

  return (
    <figure
      className={cx(
        "rounded-3xl border border-black/10 bg-white shadow-sm",
        className,
      )}
    >
      {/* Media area */}
      <div
        className="relative w-full overflow-hidden rounded-3xl"
        style={{
          aspectRatio,
          maxHeight: maxH,
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
            sizes={sizes}
            className="h-full w-full"
            imageClassName="h-full w-full"
          />
        )}

        {/* Subtle highlight */}
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
