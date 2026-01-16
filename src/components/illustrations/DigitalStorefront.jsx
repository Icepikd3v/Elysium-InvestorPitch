"use client";

export default function DigitalStorefront({ className = "" }) {
  return (
    <div className={`w-full aspect-[900/520] ${className}`}>
      <svg
        viewBox="0 0 900 520"
        className="h-full w-full"
        role="img"
        aria-label="Digital Storefront mock UI"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect
          x="0"
          y="0"
          width="900"
          height="520"
          rx="28"
          fill="rgba(0,0,0,0.03)"
        />

        {/* header */}
        <rect
          x="70"
          y="56"
          width="760"
          height="62"
          rx="18"
          fill="rgba(255,255,255,0.90)"
          stroke="rgba(0,0,0,0.10)"
        />
        <text
          x="95"
          y="92"
          fontSize="16"
          fill="rgba(0,0,0,0.72)"
          fontFamily="ui-sans-serif, system-ui"
          fontWeight="650"
        >
          Virtual Smart Mall • Personalized for You
        </text>
        <text
          x="95"
          y="110"
          fontSize="11.5"
          fill="rgba(0,0,0,0.50)"
          fontFamily="ui-sans-serif, system-ui"
        >
          AI predicts & displays items/services tailored to your signals
          (illustrative).
        </text>

        {/* small badge */}
        <rect
          x="742"
          y="66"
          width="78"
          height="24"
          rx="12"
          fill="rgba(0,0,0,0.05)"
          stroke="rgba(0,0,0,0.10)"
        />
        <text
          x="781"
          y="83"
          textAnchor="middle"
          fontSize="11"
          fill="rgba(0,0,0,0.60)"
          fontFamily="ui-sans-serif, system-ui"
        >
          Mock UI
        </text>

        {/* search */}
        <rect
          x="520"
          y="78"
          width="210"
          height="28"
          rx="14"
          fill="rgba(0,0,0,0.04)"
          stroke="rgba(0,0,0,0.10)"
        />
        <text
          x="540"
          y="97"
          fontSize="12"
          fill="rgba(0,0,0,0.45)"
          fontFamily="ui-sans-serif, system-ui"
        >
          Search the mall…
        </text>

        {/* quick actions */}
        <rect
          x="740"
          y="78"
          width="90"
          height="28"
          rx="14"
          fill="rgba(0,0,0,0.04)"
          stroke="rgba(0,0,0,0.10)"
        />
        <text
          x="785"
          y="97"
          textAnchor="middle"
          fontSize="12"
          fill="rgba(0,0,0,0.55)"
          fontFamily="ui-sans-serif, system-ui"
        >
          Cart
        </text>

        {/* left: categories */}
        <rect
          x="70"
          y="140"
          width="190"
          height="310"
          rx="22"
          fill="rgba(255,255,255,0.90)"
          stroke="rgba(0,0,0,0.10)"
        />
        <text
          x="92"
          y="175"
          fontSize="13"
          fill="rgba(0,0,0,0.70)"
          fontFamily="ui-sans-serif, system-ui"
          fontWeight="650"
        >
          Categories
        </text>

        {["Apparel", "Shoes", "Beauty", "Tech", "Home", "Gifts"].map((t, i) => (
          <g key={t}>
            <rect
              x="92"
              y={192 + i * 40}
              width="146"
              height="26"
              rx="13"
              fill="rgba(0,0,0,0.03)"
              stroke="rgba(0,0,0,0.06)"
            />
            <circle cx="104" cy={205 + i * 40} r="4" fill="rgba(0,0,0,0.20)" />
            <text
              x="115"
              y={210 + i * 40}
              fontSize="12"
              fill="rgba(0,0,0,0.55)"
              fontFamily="ui-sans-serif, system-ui"
            >
              {t}
            </text>
          </g>
        ))}

        {/* center: product grid */}
        <rect
          x="280"
          y="140"
          width="550"
          height="310"
          rx="22"
          fill="rgba(255,255,255,0.90)"
          stroke="rgba(0,0,0,0.10)"
        />
        <text
          x="305"
          y="175"
          fontSize="13"
          fill="rgba(0,0,0,0.70)"
          fontFamily="ui-sans-serif, system-ui"
          fontWeight="650"
        >
          Recommended (Illustrative)
        </text>

        {Array.from({ length: 6 }).map((_, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = 305 + col * 170;
          const y = 195 + row * 125;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width="150"
                height="110"
                rx="18"
                fill="rgba(0,0,0,0.03)"
                stroke="rgba(0,0,0,0.10)"
              />
              <rect
                x={x + 14}
                y={y + 14}
                width="92"
                height="12"
                rx="6"
                fill="rgba(0,0,0,0.10)"
              />
              <rect
                x={x + 14}
                y={y + 38}
                width="120"
                height="10"
                rx="5"
                fill="rgba(0,0,0,0.06)"
              />
              <rect
                x={x + 14}
                y={y + 58}
                width="98"
                height="10"
                rx="5"
                fill="rgba(0,0,0,0.05)"
              />

              <rect
                x={x + 14}
                y={y + 80}
                width="86"
                height="18"
                rx="9"
                fill="rgba(0,0,0,0.06)"
              />
              <text
                x={x + 57}
                y={y + 93}
                textAnchor="middle"
                fontSize="10"
                fill="rgba(0,0,0,0.55)"
                fontFamily="ui-sans-serif, system-ui"
              >
                View
              </text>
            </g>
          );
        })}

        {/* assistant bar */}
        <rect
          x="70"
          y="465"
          width="760"
          height="34"
          rx="17"
          fill="rgba(0,0,0,0.03)"
          stroke="rgba(0,0,0,0.10)"
        />
        <text
          x="92"
          y="487"
          fontSize="12"
          fill="rgba(0,0,0,0.55)"
          fontFamily="ui-sans-serif, system-ui"
        >
          AI Assistant: “Want options that match your style + size with fewer
          returns?”
        </text>
      </svg>
    </div>
  );
}
