export default function MallMobileMock({ className = "" }) {
  return (
    <div className={["w-full aspect-[920/520]", className].join(" ")}>
      <svg
        className="h-full w-full"
        viewBox="0 0 920 520"
        role="img"
        aria-label="Mobile smart mall mock"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect x="0" y="0" width="920" height="520" rx="28" fill="#FAFAFA" />
        {/* phone stage */}
        <rect
          x="170"
          y="45"
          width="580"
          height="410"
          rx="28"
          fill="rgba(0,0,0,0.03)"
        />
        {/* phone body */}
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
        {/* notch / speaker */}
        <rect
          x="420"
          y="102"
          width="80"
          height="10"
          rx="5"
          fill="rgba(0,0,0,0.10)"
        />
        {/* header area */}
        <rect
          x="382"
          y="124"
          width="156"
          height="18"
          rx="9"
          fill="rgba(0,0,0,0.06)"
        />
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
        {/* content tiles */}
        constCards();
        {/* bottom bar */}
        <rect
          x="382"
          y="385"
          width="156"
          height="16"
          rx="8"
          fill="rgba(0,0,0,0.06)"
        />
        {/* caption */}
        <text
          x="460"
          y="475"
          textAnchor="middle"
          fontSize="14"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.55)"
        >
          Mock: Mobile Smart Mall discovery + social feed
        </text>
      </svg>
    </div>
  );

  function constCards() {
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
