import IllustrationFrame from "@/components/illustrations/IllustrationFrame";

export default function MallMobileMock({
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
          alt="Smart mall mock experience featuring mobile UI elements in a neon mall environment."
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
        aria-label="Mobile smart mall mock"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect x="0" y="0" width="920" height="520" rx="28" fill="#FAFAFA" />

        <rect
          x="170"
          y="45"
          width="580"
          height="410"
          rx="28"
          fill="rgba(0,0,0,0.03)"
        />

        <rect
          x="350"
          y="70"
          width="220"
          height="360"
          rx="44"
          fill="rgba(0,0,0,0.06)"
          stroke="rgba(0,0,0,0.08)"
        />
        <rect
          x="365"
          y="92"
          width="190"
          height="316"
          rx="34"
          fill="rgba(255,255,255,0.55)"
          stroke="rgba(0,0,0,0.08)"
        />

        <rect
          x="420"
          y="102"
          width="80"
          height="10"
          rx="5"
          fill="rgba(0,0,0,0.10)"
        />

        <rect
          x="382"
          y="124"
          width="156"
          height="18"
          rx="9"
          fill="rgba(0,0,0,0.06)"
        />
        <text
          x="460"
          y="138"
          textAnchor="middle"
          fontSize="10.5"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.55)"
        >
          Smart Mall (Mock)
        </text>

        <circle cx="392" cy="160" r="16" fill="rgba(0,0,0,0.08)" />
        <rect
          x="415"
          y="150"
          width="120"
          height="10"
          rx="5"
          fill="rgba(0,0,0,0.08)"
        />
        <rect
          x="415"
          y="167"
          width="92"
          height="10"
          rx="5"
          fill="rgba(0,0,0,0.07)"
        />

        {renderCards()}

        <rect
          x="382"
          y="385"
          width="156"
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
          Mock: Mobile discovery + social feed entry points
        </text>
      </svg>
    </div>
  );

  function renderCards() {
    const cards = [
      [392, 200],
      [476, 200],
      [392, 276],
      [476, 276],
      [392, 352],
      [476, 352],
    ];

    return (
      <>
        <text
          x="460"
          y="196"
          textAnchor="middle"
          fontSize="10"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.55)"
        >
          Ranked tiles
        </text>

        {cards.map(([x, y], idx) => (
          <g key={idx}>
            <rect
              x={x}
              y={y}
              width="68"
              height="60"
              rx="16"
              fill="rgba(0,0,0,0.06)"
              stroke="rgba(0,0,0,0.06)"
            />
            <rect
              x={x + 10}
              y={y + 18}
              width="44"
              height="10"
              rx="5"
              fill="rgba(0,0,0,0.08)"
            />
            <rect
              x={x + 10}
              y={y + 36}
              width="34"
              height="10"
              rx="5"
              fill="rgba(0,0,0,0.07)"
            />
          </g>
        ))}
      </>
    );
  }
}
