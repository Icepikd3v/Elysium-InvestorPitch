// components/illustrations/AvatarTryOnLaptopMock.jsx

import IllustrationFrame from "./IllustrationFrame";

export default function AvatarTryOnLaptopMock({
  variant = "image",
  fit = "contain",
  className = "",
  label = "Avatar Try-On (Laptop Mock)",
  priority = false,
}) {
  if (variant !== "image") return null;

  return (
    <IllustrationFrame
      className={className}
      padded={true}
      glow={true}
      label={label}
      innerClassName="h-full"
      // ✅ Key change: let IllustrationFrame render the image so zoom/click works
      src="/illustrations/avatar-try-on-laptop.jpg"
      alt="Avatar try-on flow shown on a laptop mockup"
      fit={fit} // ✅ contain prevents cropping
      priority={priority}
    />
  );
}
