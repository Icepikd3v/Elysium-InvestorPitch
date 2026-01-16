import IllustrationFrame from "@/components/illustrations/IllustrationFrame";

export default function MallLaptopMock({
  className = "",
  variant = "svg", // "svg" | "image"
  mode = "fill", // "fill" | "aspect"
  priority = false,
  caption = "",
  imageSrc = "/illustrations/mall-mock.jpg",
  fit = "cover",
}) {
  if (variant === "image") {
    return (
      <div className={["h-full w-full", className].join(" ")}>
        <IllustrationFrame
          src={imageSrc}
          alt="Smart mall mock shown on laptop and mobile with neon mall background."
          priority={priority}
          caption={caption}
          fit={fit}
          sizes="(max-width: 768px) 100vw, 700px"
          badge="Phase 1 Mock"
        />
      </div>
    );
  }

  return (
    <div
      className={[
        mode === "aspect" ? "w-full aspect-[920/520]" : "h-full w-full",
        className,
      ].join(" ")}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 920 520"
        role="img"
        aria-label="Laptop smart mall mock"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect x="0" y="0" width="920" height="520" rx="28" fill="#FAFAFA" />

        <rect
          x="60"
          y="55"
          width="800"
          height="360"
          rx="26"
          fill="rgba(0,0,0,0.03)"
        />

        <rect
          x="190"
          y="85"
          width="540"
          height="285"
          rx="22"
          fill="rgba(0,0,0,0.06)"
          stroke="rgba(0,0,0,0.08)"
        />
        <rect
          x="210"
          y="105"
          width="500"
          height="245"
          rx="18"
          fill="rgba(255,255,255,0.55)"
          stroke="rgba(0,0,0,0.08)"
        />

        <rect
          x="210"
          y="105"
          width="500"
          height="34"
          rx="18"
          fill="rgba(0,0,0,0.05)"
        />
        <circle cx="235" cy="122" r="6" fill="rgba(0,0,0,0.12)" />
        <circle cx="255" cy="122" r="6" fill="rgba(0,0,0,0.12)" />
        <circle cx="275" cy="122" r="6" fill="rgba(0,0,0,0.12)" />

        <text
          x="460"
          y="128"
          textAnchor="middle"
          fontSize="12"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.55)"
        >
          Virtual Smart Mall (Mock)
        </text>

        <rect
          x="230"
          y="155"
          width="120"
          height="180"
          rx="16"
          fill="rgba(0,0,0,0.06)"
        />
        <text
          x="290"
          y="173"
          textAnchor="middle"
          fontSize="10.5"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.55)"
        >
          Categories
        </text>

        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x="248"
            y={182 + i * 24}
            width="85"
            height="11"
            rx="6"
            fill="rgba(0,0,0,0.07)"
          />
        ))}

        {renderTiles()}

        <rect
          x="680"
          y="155"
          width="26"
          height="180"
          rx="13"
          fill="rgba(0,0,0,0.08)"
        />
        <circle cx="693" cy="175" r="10" fill="rgba(0,0,0,0.10)" />
        <text
          x="693"
          y="212"
          textAnchor="middle"
          fontSize="9"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.45)"
        >
          AI
        </text>

        <path
          d="M 160 380 L 760 380 L 830 440 L 90 440 Z"
          fill="rgba(0,0,0,0.04)"
          stroke="rgba(0,0,0,0.06)"
        />
        <rect
          x="330"
          y="408"
          width="260"
          height="16"
          rx="8"
          fill="rgba(0,0,0,0.06)"
        />

        <text
          x="460"
          y="475"
          textAnchor="middle"
          fontSize="14"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.55)"
        >
          Mock: Smart Mall layout + personalized storefronts + AI assistant rail
        </text>
      </svg>
    </div>
  );

  function renderTiles() {
    const tiles = [
      [380, 155],
      [520, 155],
      [660, 155],
      [380, 240],
      [520, 240],
      [660, 240],
    ];

    return (
      <>
        <text
          x="520"
          y="150"
          textAnchor="middle"
          fontSize="10.5"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.55)"
        >
          Storefront tiles (ranked)
        </text>

        {tiles.map(([x, y], idx) => (
          <g key={idx}>
            <rect
              x={x}
              y={y}
              width="120"
              height="70"
              rx="16"
              fill="rgba(0,0,0,0.06)"
              stroke="rgba(0,0,0,0.06)"
            />
            <rect
              x={x + 14}
              y={y + 18}
              width="84"
              height="10"
              rx="5"
              fill="rgba(0,0,0,0.08)"
            />
            <rect
              x={x + 14}
              y={y + 36}
              width="64"
              height="10"
              rx="5"
              fill="rgba(0,0,0,0.07)"
            />
            <rect
              x={x + 14}
              y={y + 52}
              width="46"
              height="10"
              rx="5"
              fill="rgba(0,0,0,0.05)"
            />
          </g>
        ))}
      </>
    );
  }
}
