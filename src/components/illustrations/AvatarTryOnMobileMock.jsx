// components/illustrations/AvatarTryOnMobileMock.jsx

import IllustrationFrame from "./IllustrationFrame";
import IllustrationImage from "./IllustrationImage";

export default function AvatarTryOnMobileMock({
  variant = "image",
  fit = "contain",
  className = "",
  label = "Avatar Try-On (Mobile Mock)",
}) {
  if (variant !== "image") return null;

  return (
    <IllustrationFrame
      className={className}
      padded={true}
      glow={true}
      label={label}
      innerClassName="h-full"
    >
      <IllustrationImage
        src="/illustrations/avatar-try-on-mobile.jpg"
        alt="Avatar try-on flow shown on a mobile mockup"
        fit={fit}
        priority={false}
        className="h-full w-full"
        rounded={true}
      />
    </IllustrationFrame>
  );
}
