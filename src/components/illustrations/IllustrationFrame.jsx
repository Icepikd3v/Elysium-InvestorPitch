import IllustrationImage from "./IllustrationImage";

function cx(...c) {
  return c.filter(Boolean).join(" ");
}

/**
 * IllustrationFrame
 * - Enforces a predictable "mock frame" so images don’t overflow/overlay.
 * - aspect: Tailwind aspect utility string WITHOUT "aspect-" prefix.
 *   Examples: "video" | "square" | "[16/10]" | "[4/3]"
 */
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
  return (
    <figure
      className={cx(
        "rounded-3xl border border-black/10 bg-white shadow-sm",
        className,
      )}
    >
      {/* Media area */}
      <div
        className={cx(
          "relative w-full overflow-hidden rounded-3xl",
          // aspect ratio guard (prevents Image fill from spilling)
          `aspect-${aspect}`,
        )}
        style={{
          // prevents super-tall sections from making the image feel “not set”
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
