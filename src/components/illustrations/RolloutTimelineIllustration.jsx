export default function RolloutTimelineIllustration({ className = "" }) {
  const items = [
    { label: "Q1", title: "Hire/engage tech team" },
    { label: "Q2", title: "Complete AI engine framing + interface" },
    { label: "Q3", title: "Build website + expand over time" },
    { label: "Q4", title: "Complete coding/testing + phase-in rollout" },
    { label: "Q5–Q6", title: "Acquire additional platforms" },
    { label: "Q7–Q8", title: "Begin marketing + scale revenue rollout" },
  ];

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
          Phase 1: narrative + mock visuals • Phase 2: validated dependencies &
          execution plan
        </text>

        {/* timeline rail */}
        <line
          x1="90"
          y1="150"
          x2="830"
          y2="150"
          stroke="rgba(0,0,0,0.14)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <line
          x1="90"
          y1="150"
          x2="465"
          y2="150"
          stroke="rgba(0,0,0,0.20)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* nodes */}
        {items.map((n, i) => {
          const x = 120 + i * 120;

          return (
            <g key={n.label}>
              <circle
                cx={x}
                cy={150}
                r={14}
                fill="#FFFFFF"
                stroke="rgba(0,0,0,0.25)"
                strokeWidth="2"
              />
              <circle cx={x} cy={150} r={6} fill="rgba(0,0,0,0.35)" />

              <text
                x={x}
                y={128}
                textAnchor="middle"
                fontSize="11"
                fontFamily="ui-sans-serif, system-ui"
                fill="rgba(0,0,0,0.55)"
                fontWeight="700"
              >
                {n.label}
              </text>

              <rect
                x={x - 82}
                y={178}
                width={164}
                height={58}
                rx={14}
                fill="#FFFFFF"
                stroke="rgba(0,0,0,0.08)"
              />
              <text
                x={x}
                y={201}
                textAnchor="middle"
                fontSize="11.5"
                fontFamily="ui-sans-serif, system-ui"
                fill="rgba(0,0,0,0.78)"
                fontWeight="700"
              >
                {n.title}
              </text>
              <text
                x={x}
                y={223}
                textAnchor="middle"
                fontSize="10"
                fontFamily="ui-sans-serif, system-ui"
                fill="rgba(0,0,0,0.50)"
              >
                milestone
              </text>
            </g>
          );
        })}

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
          Phase 2: add hiring plan, data pipeline readiness, vendor onboarding,
          acquisition integration steps, and KPI gates.
        </text>
      </svg>
    </div>
  );
}
