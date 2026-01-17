// components/illustrations/AvatarTryOnMobileMock.jsx

import IllustrationFrame from "./IllustrationFrame";

export default function AvatarTryOnMobileMock({
  variant = "image",
  fit = "contain",
  className = "",
  label = "Avatar Try-On (Mobile Mock)",
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
      src="/illustrations/avatar-try-on-mobile.jpg"
      alt="Avatar try-on flow shown on a mobile mockup"
      fit={fit} // ✅ contain prevents cropping
      priority={priority}
    />
  );
}
