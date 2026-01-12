"use client";

export default function DigitalStorefront({ className = "" }) {
  return (
    <div className={`w-full aspect-[900/520] ${className}`}>
      <svg
        viewBox="0 0 900 520"
        className="h-full w-full"
        role="img"
        aria-label="Digital Storefront mock UI"
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
          y="60"
          width="760"
          height="58"
          rx="18"
          fill="rgba(255,255,255,0.85)"
          stroke="rgba(0,0,0,0.10)"
        />
        <text
          x="95"
          y="96"
          fontSize="16"
          fill="rgba(0,0,0,0.70)"
          fontFamily="ui-sans-serif, system-ui"
        >
          Storefront • Personalized for You
        </text>

        {/* search */}
        <rect
          x="520"
          y="76"
          width="290"
          height="28"
          rx="14"
          fill="rgba(0,0,0,0.04)"
          stroke="rgba(0,0,0,0.10)"
        />
        <text
          x="540"
          y="95"
          fontSize="12"
          fill="rgba(0,0,0,0.45)"
          fontFamily="ui-sans-serif, system-ui"
        >
          Search the mall…
        </text>

        {/* left: categories */}
        <rect
          x="70"
          y="140"
          width="190"
          height="310"
          rx="22"
          fill="rgba(255,255,255,0.85)"
          stroke="rgba(0,0,0,0.10)"
        />
        <text
          x="92"
          y="175"
          fontSize="13"
          fill="rgba(0,0,0,0.70)"
          fontFamily="ui-sans-serif, system-ui"
        >
          Categories
        </text>

        {["Apparel", "Shoes", "Beauty", "Tech", "Home", "Gifts"].map((t, i) => (
          <g key={t}>
            <rect
              x="92"
              y={190 + i * 40}
              width="146"
              height="26"
              rx="13"
              fill="rgba(0,0,0,0.03)"
            />
            <text
              x="105"
              y={208 + i * 40}
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
          fill="rgba(255,255,255,0.85)"
          stroke="rgba(0,0,0,0.10)"
        />
        <text
          x="305"
          y="175"
          fontSize="13"
          fill="rgba(0,0,0,0.70)"
          fontFamily="ui-sans-serif, system-ui"
        >
          Recommended
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
                width="72"
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
                width="90"
                height="10"
                rx="5"
                fill="rgba(0,0,0,0.05)"
              />

              <rect
                x={x + 14}
                y={y + 80}
                width="66"
                height="18"
                rx="9"
                fill="rgba(0,0,0,0.06)"
              />
              <text
                x={x + 26}
                y={y + 93}
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
