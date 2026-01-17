import Image from "next/image";

function cx(...c) {
  return c.filter(Boolean).join(" ");
}

/**
 * IllustrationImage (PROD-SAFE)
 * - Adds object-fit classes (more consistent than inline style in some cases)
 * - Optional `unoptimized` toggle if you ever need to bypass Next optimizer
 */
export default function IllustrationImage({
  src,
  alt = "",
  fit = "contain", // "contain" | "cover"
  priority = false,
  sizes = "(min-width: 1024px) 720px, 92vw",
  className = "",
  imageClassName = "",
  unoptimized = false,
}) {
  if (!src) {
    return (
      <div
        className={cx(
          "relative flex h-full w-full items-center justify-center rounded-2xl bg-black/5",
          className,
        )}
      >
        <div className="text-xs text-black/50">Image source missing</div>
      </div>
    );
  }

  const fitClass = fit === "cover" ? "object-cover" : "object-contain";

  return (
    <div className={cx("relative h-full w-full", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        unoptimized={unoptimized}
        className={cx("select-none", fitClass, imageClassName)}
      />
    </div>
  );
}
