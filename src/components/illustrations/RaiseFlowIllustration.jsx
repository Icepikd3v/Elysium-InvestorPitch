export default function RaiseFlowIllustration({ className = "" }) {
  return (
    <div className={`w-full aspect-[920/360] ${className}`}>
      <svg
        className="h-full w-full"
        viewBox="0 0 920 360"
        role="img"
        aria-label="Capital raise flow illustration"
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
          Raise & Milestones (Illustrative)
        </text>
        <text
          x="52"
          y="94"
          fontSize="12"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.55)"
        >
          Seed → Build → Pilot → Acquire → Expand (Phase 1 narrative)
        </text>

        {renderSteps()}

        {/* Optional public pathway callouts */}
        <rect
          x="560"
          y="112"
          width="308"
          height="46"
          rx="16"
          fill="rgba(0,0,0,0.04)"
          stroke="rgba(0,0,0,0.06)"
        />
        <text
          x="576"
          y="131"
          fontSize="11.5"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.62)"
          fontWeight="650"
        >
          Public pathway (as applicable)
        </text>
        <text
          x="576"
          y="149"
          fontSize="11.5"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.58)"
        >
          OTC readiness → reporting → possible NASDAQ pathway
        </text>

        {/* bottom note */}
        <rect
          x="52"
          y="300"
          width="816"
          height="42"
          rx="16"
          fill="rgba(0,0,0,0.04)"
          stroke="rgba(0,0,0,0.06)"
        />
        <text
          x="70"
          y="325"
          fontSize="12"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.62)"
        >
          Phase 2: add budget breakdown, diligence checklist, integration plan,
          and compliance timing criteria.
        </text>
      </svg>
    </div>
  );

  function renderSteps() {
    const steps = [
      { x: 110, title: "Seed", sub: "$750K–$1M", tone: 0.55 },
      { x: 270, title: "Build", sub: "AI + product", tone: 0.18 },
      { x: 430, title: "Pilot", sub: "vendors + cohorts", tone: 0.18 },
      { x: 590, title: "Acquire", sub: "social + eComm", tone: 0.18 },
      { x: 750, title: "Expand", sub: "marketing + scale", tone: 0.18 },
    ];

    return (
      <>
        {/* rail */}
        <line
          x1="110"
          y1="200"
          x2="750"
          y2="200"
          stroke="rgba(0,0,0,0.12)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <line
          x1="110"
          y1="200"
          x2="270"
          y2="200"
          stroke="rgba(0,0,0,0.20)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* steps */}
        {steps.map((s, idx) => (
          <g key={s.x}>
            <circle
              cx={s.x}
              cy={200}
              r={16}
              fill="#FFFFFF"
              stroke="rgba(0,0,0,0.22)"
              strokeWidth="2"
            />
            <circle cx={s.x} cy={200} r={7} fill={`rgba(0,0,0,${s.tone})`} />

            {idx < steps.length - 1 ? (
              <polygon
                points={`${s.x + 62},200 ${s.x + 52},193 ${s.x + 52},207`}
                fill="rgba(0,0,0,0.20)"
              />
            ) : null}

            <rect
              x={s.x - 70}
              y="230"
              width="140"
              height="54"
              rx="16"
              fill="#FFFFFF"
              stroke="rgba(0,0,0,0.08)"
            />
            <text
              x={s.x}
              y="253"
              textAnchor="middle"
              fontSize="12"
              fontFamily="ui-sans-serif, system-ui"
              fill="rgba(0,0,0,0.78)"
              fontWeight="700"
            >
              {s.title}
            </text>
            <text
              x={s.x}
              y="272"
              textAnchor="middle"
              fontSize="10.5"
              fontFamily="ui-sans-serif, system-ui"
              fill="rgba(0,0,0,0.55)"
            >
              {s.sub}
            </text>
          </g>
        ))}
      </>
    );
  }
}
