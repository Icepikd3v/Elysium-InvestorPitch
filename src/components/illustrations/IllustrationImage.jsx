import Image from "next/image";

export default function IllustrationImage({
  src,
  alt,
  priority = false,
  className = "",
  sizes = "(max-width: 768px) 100vw, 900px",
  fit = "cover", // cover | contain
}) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-2xl ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={fit === "contain" ? "object-contain" : "object-cover"}
      />
    </div>
  );
}
