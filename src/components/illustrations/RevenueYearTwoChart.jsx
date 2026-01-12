export default function RevenueYearTwoChart({ className = "" }) {
  return (
    <svg
      className={["h-full w-full", className].join(" ")}
      viewBox="0 0 920 360"
      role="img"
      aria-label="Year 1 vs Year 2 revenue projection mock"
      preserveAspectRatio="xMidYMid meet"
    >
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

      <text
        x="52"
        y="70"
        fontSize="18"
        fontFamily="ui-sans-serif, system-ui"
        fill="rgba(0,0,0,0.82)"
        fontWeight="700"
      >
        Revenue Projection — Year 1 vs Year 2 (Illustrative)
      </text>
      <text
        x="52"
        y="94"
        fontSize="12"
        fontFamily="ui-sans-serif, system-ui"
        fill="rgba(0,0,0,0.55)"
      >
        Pitch narrative: operationally profitable mid-Year 1; cash-profitable by
        end of Year 2 (replace with validated model)
      </text>

      {/* Legend */}
      <g transform="translate(720 56)">
        <rect width="12" height="12" rx="3" fill="rgba(0,0,0,0.55)" />
        <text
          x="18"
          y="10"
          fontSize="11"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.60)"
        >
          Gross
        </text>

        <rect x="70" width="12" height="12" rx="3" fill="rgba(0,0,0,0.18)" />
        <text
          x="88"
          y="10"
          fontSize="11"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.60)"
        >
          Net
        </text>
      </g>

      {/* inner stage */}
      <rect
        x="70"
        y="122"
        width="780"
        height="175"
        rx="18"
        fill="#FAFAFA"
        stroke="rgba(0,0,0,0.06)"
      />

      {/* Year 1 block */}
      <g>
        <rect
          x="190"
          y="210"
          width="170"
          height="70"
          rx="14"
          fill="rgba(0,0,0,0.55)"
        />
        <polygon
          points="190,210 220,190 390,190 360,210"
          fill="rgba(0,0,0,0.40)"
        />
        <polygon
          points="360,210 390,190 390,260 360,280"
          fill="rgba(0,0,0,0.32)"
        />

        <rect
          x="270"
          y="192"
          width="110"
          height="40"
          rx="12"
          fill="rgba(0,0,0,0.18)"
        />
        <text
          x="325"
          y="216"
          textAnchor="middle"
          fontSize="11"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.65)"
          fontWeight="600"
        >
          Net
        </text>

        <text
          x="275"
          y="305"
          textAnchor="middle"
          fontSize="11"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.60)"
        >
          Year 1 Gross
        </text>
      </g>

      {/* Year 2 block */}
      <g>
        <rect
          x="450"
          y="185"
          width="200"
          height="95"
          rx="14"
          fill="rgba(0,0,0,0.55)"
        />
        <polygon
          points="450,185 480,165 680,165 650,185"
          fill="rgba(0,0,0,0.40)"
        />
        <polygon
          points="650,185 680,165 680,260 650,280"
          fill="rgba(0,0,0,0.32)"
        />

        <rect
          x="575"
          y="158"
          width="120"
          height="45"
          rx="12"
          fill="rgba(0,0,0,0.18)"
        />
        <text
          x="635"
          y="187"
          textAnchor="middle"
          fontSize="11"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.65)"
          fontWeight="600"
        >
          Net
        </text>

        <text
          x="550"
          y="305"
          textAnchor="middle"
          fontSize="11"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.60)"
        >
          Year 2 Gross
        </text>
      </g>

      {/* callout pill */}
      <rect
        x="52"
        y="312"
        width="816"
        height="28"
        rx="14"
        fill="rgba(0,0,0,0.04)"
        stroke="rgba(0,0,0,0.06)"
      />
      <text
        x="70"
        y="331"
        fontSize="12"
        fontFamily="ui-sans-serif, system-ui"
        fill="rgba(0,0,0,0.62)"
      >
        Phase 2 upgrade: replace with real forecast (CAC, LTV, take-rate, gross
        margin, churn, cohorts).
      </text>
    </svg>
  );
}
