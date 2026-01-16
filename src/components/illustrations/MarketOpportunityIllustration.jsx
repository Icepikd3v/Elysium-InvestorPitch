export default function MarketOpportunityIllustration({
  className = "",
  tam = "$—",
  sam = "$—",
  som = "$—",
  wedge = "First wedge segment",
}) {
  return (
    <div className={["w-full aspect-[920/360]", className].join(" ")}>
      <svg
        className="h-full w-full"
        viewBox="0 0 920 360"
        role="img"
        aria-label="Market opportunity TAM SAM SOM illustration"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Outer + inner card */}
        <rect x="0" y="0" width="920" height="360" rx="24" fill="#FAFAFA" />
        <rect
          x="18"
          y="18"
          width="884"
          height="324"
          rx="20"
          fill="#FFFFFF"
          stroke="rgba(0,0,0,0.08)"
        />

        {/* Title + subtitle */}
        <text
          x="52"
          y="70"
          fontSize="18"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.82)"
          fontWeight="700"
        >
          Market Opportunity (Illustrative)
        </text>
        <text
          x="52"
          y="94"
          fontSize="12"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.55)"
        >
          Phase 2: replace placeholders with validated TAM/SAM/SOM + wedge
          sizing
        </text>

        {/* Rings */}
        <g transform="translate(250 210)">
          <circle cx="0" cy="0" r="112" fill="rgba(0,0,0,0.06)" />
          <circle cx="0" cy="0" r="78" fill="rgba(0,0,0,0.10)" />
          <circle cx="0" cy="0" r="44" fill="rgba(0,0,0,0.18)" />

          <text
            x="0"
            y="-98"
            textAnchor="middle"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui"
            fill="rgba(0,0,0,0.62)"
            fontWeight="600"
          >
            TAM
          </text>
          <text
            x="0"
            y="-66"
            textAnchor="middle"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui"
            fill="rgba(0,0,0,0.70)"
            fontWeight="600"
          >
            SAM
          </text>
          <text
            x="0"
            y="-34"
            textAnchor="middle"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui"
            fill="rgba(0,0,0,0.80)"
            fontWeight="700"
          >
            SOM
          </text>

          {/* wedge highlight */}
          <path
            d="M 0 0 L 110 -20 A 112 112 0 0 1 45 103 Z"
            fill="rgba(0,0,0,0.16)"
          />
        </g>

        {/* Right side explanation cards */}
        <g>
          <rect
            x="460"
            y="130"
            width="390"
            height="58"
            rx="18"
            fill="#FFFFFF"
            stroke="rgba(0,0,0,0.08)"
          />
          <text
            x="482"
            y="154"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui"
            fill="rgba(0,0,0,0.78)"
            fontWeight="700"
          >
            TAM
          </text>
          <text
            x="520"
            y="154"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui"
            fill="rgba(0,0,0,0.60)"
          >
            Total addressable market • {tam}
          </text>

          <rect
            x="460"
            y="202"
            width="390"
            height="58"
            rx="18"
            fill="#FFFFFF"
            stroke="rgba(0,0,0,0.08)"
          />
          <text
            x="482"
            y="226"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui"
            fill="rgba(0,0,0,0.78)"
            fontWeight="700"
          >
            SAM
          </text>
          <text
            x="520"
            y="226"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui"
            fill="rgba(0,0,0,0.60)"
          >
            Serviceable market • {sam}
          </text>

          <rect
            x="460"
            y="274"
            width="390"
            height="58"
            rx="18"
            fill="#FFFFFF"
            stroke="rgba(0,0,0,0.08)"
          />
          <text
            x="482"
            y="298"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui"
            fill="rgba(0,0,0,0.78)"
            fontWeight="700"
          >
            SOM
          </text>
          <text
            x="520"
            y="298"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui"
            fill="rgba(0,0,0,0.60)"
          >
            Obtainable market • {som} • {wedge}
          </text>
        </g>
      </svg>
    </div>
  );
}
