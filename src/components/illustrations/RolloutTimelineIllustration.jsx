export default function RolloutTimelineIllustration({ className = "" }) {
  return (
    <div className={`w-full aspect-[920/360] ${className}`}>
      <svg
        className="h-full w-full"
        viewBox="0 0 920 360"
        role="img"
        aria-label="Projected rollout timeline illustration"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* background */}
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

        {/* header */}
        <text
          x="52"
          y="70"
          fontSize="18"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.82)"
          fontWeight="700"
        >
          Projected Rollout Schedule (Illustrative)
        </text>
        <text
          x="52"
          y="94"
          fontSize="12"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.55)"
        >
          Phase 1: narrative + mock visuals • Phase 2: validated metrics + real
          system diagrams
        </text>

        {/* timeline rail */}
        <line
          x1="90"
          y1="160"
          x2="830"
          y2="160"
          stroke="rgba(0,0,0,0.14)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <line
          x1="90"
          y1="160"
          x2="500"
          y2="160"
          stroke="rgba(0,0,0,0.20)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* nodes */}
        {[
          { x: 120, label: "Q1", title: "Team + Phase 1 mock" },
          { x: 230, label: "Q2", title: "AI Engine framing" },
          { x: 340, label: "Q3", title: "Website + pilot" },
          { x: 450, label: "Q4", title: "Test + phased rollout" },
          { x: 610, label: "Q5–Q6", title: "Acquire platforms" },
          { x: 760, label: "Q7–Q8", title: "Scale revenue + marketing" },
        ].map((n) => (
          <g key={n.x}>
            <circle
              cx={n.x}
              cy={160}
              r={14}
              fill="#FFFFFF"
              stroke="rgba(0,0,0,0.25)"
              strokeWidth="2"
            />
            <circle cx={n.x} cy={160} r={6} fill="rgba(0,0,0,0.35)" />

            <text
              x={n.x}
              y={138}
              textAnchor="middle"
              fontSize="11"
              fontFamily="ui-sans-serif, system-ui"
              fill="rgba(0,0,0,0.55)"
              fontWeight="600"
            >
              {n.label}
            </text>

            <rect
              x={n.x - 72}
              y={190}
              width={144}
              height={56}
              rx={14}
              fill="#FFFFFF"
              stroke="rgba(0,0,0,0.08)"
            />
            <text
              x={n.x}
              y={214}
              textAnchor="middle"
              fontSize="12"
              fontFamily="ui-sans-serif, system-ui"
              fill="rgba(0,0,0,0.78)"
              fontWeight="700"
            >
              {n.title}
            </text>
            <text
              x={n.x}
              y={236}
              textAnchor="middle"
              fontSize="10"
              fontFamily="ui-sans-serif, system-ui"
              fill="rgba(0,0,0,0.50)"
            >
              milestone
            </text>
          </g>
        ))}

        {/* footer note */}
        <rect
          x="52"
          y="278"
          width="816"
          height="44"
          rx="16"
          fill="rgba(0,0,0,0.04)"
          stroke="rgba(0,0,0,0.06)"
        />
        <text
          x="70"
          y="305"
          fontSize="12"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.62)"
        >
          Replace with validated dependencies (hiring, data pipelines, model
          readiness, vendor onboarding, acquisition integration).
        </text>
      </svg>
    </div>
  );
}
