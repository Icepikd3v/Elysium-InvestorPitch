// src/components/illustrations/IllustrationFrame.jsx
import IllustrationImage from "./IllustrationImage";

function cx(...c) {
  return c.filter(Boolean).join(" ");
}

/**
 * IllustrationFrame
 * - Enforces a predictable "mock frame" so images don’t overflow/overlay.
 * - aspect supports:
 *   - "video"  -> 16/9
 *   - "square" -> 1/1
 *   - "[16/10]" "[4/3]" etc
 *   - "16/10"  "4/3"
 */
function aspectToRatio(aspect) {
  if (!aspect) return "16 / 9";
  if (aspect === "video") return "16 / 9";
  if (aspect === "square") return "1 / 1";

  // Tailwind-style bracket ratios: "[16/10]" -> "16 / 10"
  const m = String(aspect).match(/^\[(\d+)\s*\/\s*(\d+)\]$/);
  if (m) return `${m[1]} / ${m[2]}`;

  // Raw ratios like "16/10"
  const m2 = String(aspect).match(/^(\d+)\s*\/\s*(\d+)$/);
  if (m2) return `${m2[1]} / ${m2[2]}`;

  return "16 / 9";
}

export default function IllustrationFrame({
  className = "",
  src,
  alt = "",
  caption = "",
  fit = "cover", // "cover" | "contain"
  aspect = "video",
  maxH = "520px",
  priority = false,
  children,
}) {
  const ratio = aspectToRatio(aspect);

  return (
    <figure
      className={cx(
        "rounded-3xl border border-black/10 bg-white shadow-sm",
        className,
      )}
    >
      {/* Media area */}
      <div
        className={cx("relative w-full overflow-hidden rounded-3xl")}
        style={{
          aspectRatio: ratio, // ✅ production-safe (no Tailwind purge issues)
          maxHeight: maxH,
        }}
      >
        {/* If you pass children, you control the media. Otherwise we render src. */}
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

        {/* Subtle glass highlight so frames look consistent */}
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/40" />
      </div>

      {/* Caption */}
      {caption ? (
        <figcaption className="flex items-center justify-between gap-3 px-5 py-3 text-xs text-black/60">
          <span>{caption}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
