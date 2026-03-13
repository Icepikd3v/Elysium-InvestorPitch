export default function MarketOpportunityIllustration({
  className = "",
  tam = "$—",
  sam = "$—",
  som = "$—",
  wedge = "First wedge segment",
}) {
  return (
    <div className={["w-full aspect-[920/420]", className].join(" ")}>
      <svg
        className="h-full w-full"
        viewBox="0 0 920 420"
        role="img"
        aria-label="Market opportunity TAM SAM SOM illustration"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Outer + inner card */}
        <rect x="0" y="0" width="920" height="420" rx="24" fill="#F7FCFF" />
        <rect
          x="18"
          y="18"
          width="884"
          height="384"
          rx="20"
          fill="#FFFFFF"
          stroke="rgba(14,165,233,0.2)"
        />

        {/* Title + subtitle */}
        <text
          x="52"
          y="70"
          fontSize="18"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(7,44,71,0.9)"
          fontWeight="700"
        >
          Market Opportunity (Illustrative)
        </text>
        <text
          x="52"
          y="94"
          fontSize="12"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(7,44,71,0.55)"
        >
          Phase 2: replace placeholders with validated TAM/SAM/SOM + wedge
          sizing
        </text>

        {/* Rings */}
        <g transform="translate(250 210)">
          <circle
            className="ring-pulse-slow"
            cx="0"
            cy="0"
            r="112"
            fill="rgba(14,165,233,0.2)"
          />
          <circle
            className="ring-pulse-mid"
            cx="0"
            cy="0"
            r="78"
            fill="rgba(20,184,166,0.28)"
          />
          <circle
            className="ring-pulse-fast"
            cx="0"
            cy="0"
            r="44"
            fill="rgba(99,102,241,0.35)"
          />

          <text
            x="0"
            y="-98"
            textAnchor="middle"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui"
            fill="rgba(7,44,71,0.66)"
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
            fill="rgba(7,44,71,0.75)"
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
            fill="rgba(7,44,71,0.84)"
            fontWeight="700"
          >
            SOM
          </text>

          {/* wedge highlight */}
          <path
            className="wedge-pop"
            d="M 0 0 L 110 -20 A 112 112 0 0 1 45 103 Z"
            fill="rgba(245,158,11,0.58)"
          />
        </g>

        {/* Bottom acronym legend */}
        <g>
          <text
            x="96"
            y="366"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui"
            fill="rgba(7,44,71,0.84)"
            fontWeight="700"
          >
            TAM
          </text>
          <text
            x="132"
            y="366"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui"
            fill="rgba(7,44,71,0.62)"
          >
            = Total Addressable Market
          </text>

          <text
            x="360"
            y="366"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui"
            fill="rgba(7,44,71,0.84)"
            fontWeight="700"
          >
            SAM
          </text>
          <text
            x="398"
            y="366"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui"
            fill="rgba(7,44,71,0.62)"
          >
            = Serviceable Available Market
          </text>

          <text
            x="96"
            y="390"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui"
            fill="rgba(7,44,71,0.84)"
            fontWeight="700"
          >
            SOM
          </text>
          <text
            x="134"
            y="390"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui"
            fill="rgba(7,44,71,0.62)"
          >
            = Serviceable Obtainable Market
          </text>
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
            stroke="rgba(14,165,233,0.2)"
          />
          <text
            x="482"
            y="154"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui"
            fill="rgba(7,44,71,0.84)"
            fontWeight="700"
          >
            TAM
          </text>
          <text
            x="520"
            y="154"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui"
            fill="rgba(7,44,71,0.64)"
          >
            Total Addressable Market • {tam}
          </text>

          <rect
            x="460"
            y="202"
            width="390"
            height="58"
            rx="18"
            fill="#FFFFFF"
            stroke="rgba(20,184,166,0.2)"
          />
          <text
            x="482"
            y="226"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui"
            fill="rgba(7,44,71,0.84)"
            fontWeight="700"
          >
            SAM
          </text>
          <text
            x="520"
            y="226"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui"
            fill="rgba(7,44,71,0.64)"
          >
            Serviceable Available Market • {sam}
          </text>

          <rect
            x="460"
            y="274"
            width="390"
            height="58"
            rx="18"
            fill="#FFFFFF"
            stroke="rgba(99,102,241,0.2)"
          />
          <text
            x="482"
            y="298"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui"
            fill="rgba(7,44,71,0.84)"
            fontWeight="700"
          >
            SOM
          </text>
          <text
            x="520"
            y="298"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui"
            fill="rgba(7,44,71,0.64)"
          >
            Serviceable Obtainable Market • {som} • {wedge}
          </text>
        </g>
      </svg>
    </div>
  );
}
