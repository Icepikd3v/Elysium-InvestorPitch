import Image from "next/image";

function cx(...c) {
  return c.filter(Boolean).join(" ");
}

/**
 * IllustrationImage
 * - Safe wrapper around next/image for "framed" mock images.
 * - Works with public assets: src="/illustrations/foo.jpg"
 * - Also works with imported static images: import foo from "@/app/assets/foo.jpg"
 */
export default function IllustrationImage({
  src,
  alt = "",
  fit = "contain", // "contain" | "cover"
  priority = false,
  sizes = "(min-width: 1024px) 720px, 92vw",
  className = "",
  imageClassName = "",
}) {
  // Soft fail: avoid runtime crash if src is missing
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

  return (
    <div className={cx("relative h-full w-full", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cx("select-none", imageClassName)}
        style={{
          objectFit: fit,
        }}
      />
    </div>
  );
}
