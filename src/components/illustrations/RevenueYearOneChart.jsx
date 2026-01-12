export default function RevenueYearOneChart({ className = "" }) {
  return (
    <svg
      className={["h-full w-full", className].join(" ")}
      viewBox="0 0 920 360"
      role="img"
      aria-label="Projected revenue year one chart mock"
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
        Projected Revenue — Year One (Illustrative)
      </text>
      <text
        x="52"
        y="94"
        fontSize="12"
        fontFamily="ui-sans-serif, system-ui"
        fill="rgba(0,0,0,0.55)"
      >
        Replace with validated forecast + unit economics in Phase 2
      </text>

      {/* Legend (top-right aligned) */}
      <g transform="translate(680 56)">
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

        <rect x="80" width="12" height="12" rx="3" fill="rgba(0,0,0,0.18)" />
        <text
          x="98"
          y="10"
          fontSize="11"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.60)"
        >
          Net (after costs)
        </text>
      </g>

      {/* chart area */}
      <rect
        x="70"
        y="120"
        width="780"
        height="180"
        rx="18"
        fill="#FAFAFA"
        stroke="rgba(0,0,0,0.06)"
      />

      {/* grid lines */}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="90"
          y1={150 + i * 40}
          x2="830"
          y2={150 + i * 40}
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="1"
        />
      ))}

      {/* bars */}
      {renderBars()}

      {/* x labels */}
      {[
        { x: 190, label: "Q1" },
        { x: 360, label: "Q2" },
        { x: 530, label: "Q3" },
        { x: 700, label: "Q4" },
      ].map((t) => (
        <text
          key={t.label}
          x={t.x}
          y="320"
          fontSize="11"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.55)"
        >
          {t.label}
        </text>
      ))}

      {null}

      {/* helper */}
      {null}
    </svg>
  );

  function renderBars() {
    return (
      <>
        {/* Q1 */}
        <rect
          x="160"
          y="190"
          width="40"
          height="90"
          rx="10"
          fill="rgba(0,0,0,0.55)"
        />
        <rect
          x="205"
          y="240"
          width="40"
          height="40"
          rx="10"
          fill="rgba(0,0,0,0.18)"
        />
        <rect
          x="205"
          y="280"
          width="40"
          height="40"
          rx="10"
          fill="rgba(0,0,0,0.10)"
        />

        {/* Q2 */}
        <rect
          x="330"
          y="175"
          width="40"
          height="105"
          rx="10"
          fill="rgba(0,0,0,0.55)"
        />
        <rect
          x="375"
          y="205"
          width="40"
          height="75"
          rx="10"
          fill="rgba(0,0,0,0.18)"
        />

        {/* Q3 */}
        <rect
          x="500"
          y="185"
          width="40"
          height="95"
          rx="10"
          fill="rgba(0,0,0,0.55)"
        />
        <rect
          x="545"
          y="215"
          width="40"
          height="65"
          rx="10"
          fill="rgba(0,0,0,0.18)"
        />

        {/* Q4 */}
        <rect
          x="670"
          y="180"
          width="40"
          height="100"
          rx="10"
          fill="rgba(0,0,0,0.55)"
        />
        <rect
          x="715"
          y="210"
          width="40"
          height="70"
          rx="10"
          fill="rgba(0,0,0,0.18)"
        />
      </>
    );
  }
}
