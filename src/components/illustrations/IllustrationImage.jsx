"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

function cx(...c) {
  return c.filter(Boolean).join(" ");
}

/**
 * IllustrationImage
 * - Safe wrapper around next/image for "framed" mock images.
 */
export default function IllustrationImage({
  src,
  alt = "",
  fit = "contain", // contain | cover
  expandFit = "contain",
  expandable = true,
  unoptimized = false,
  priority = false,
  sizes = "(min-width: 1024px) 720px, 92vw",
  className = "",
  imageClassName = "",
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

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

  if (!expandable) {
    return (
      <div className={cx("relative h-full w-full", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized={unoptimized}
          priority={priority}
          sizes={sizes}
          className={cx("select-none", imageClassName)}
          style={{ objectFit: fit }}
        />
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cx(
          "relative h-full w-full cursor-zoom-in rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/25",
          className,
        )}
        aria-label={`Expand image${alt ? `: ${alt}` : ""}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized={unoptimized}
          priority={priority}
          sizes={sizes}
          className={cx("select-none", imageClassName)}
          style={{ objectFit: fit }}
        />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 px-4 py-6"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            aria-label="Close expanded image"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-full border border-white/30 bg-black/35 px-3 py-1 text-sm font-semibold text-white hover:bg-black/55"
          >
            Close
          </button>
          <div
            className="relative h-[86vh] w-[96vw] max-w-[1400px]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              unoptimized={unoptimized}
              sizes="96vw"
              className="select-none"
              style={{ objectFit: expandFit }}
              priority
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
