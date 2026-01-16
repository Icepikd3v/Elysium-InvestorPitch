export default function AvatarTryOnFlow({ className = "" }) {
  const steps = [
    { title: "Consent", sub: "Opt-in + policy" },
    { title: "Capture", sub: "Phone scan / sizing" },
    { title: "Avatar", sub: "Body model built" },
    { title: "Try-On", sub: "Fit + style preview" },
    { title: "Outcome", sub: "↑ confidence • ↓ returns" },
  ];

  return (
    <div className={`w-full aspect-[920/360] ${className}`}>
      <svg
        className="h-full w-full"
        viewBox="0 0 920 360"
        role="img"
        aria-label="Avatar try-on flow diagram"
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
          Avatar Try-On (Illustrative Flow)
        </text>
        <text
          x="52"
          y="94"
          fontSize="12"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.55)"
        >
          Phase 2 adds consent UX, retention/deletion rules, and rendering
          pipeline.
        </text>

        {/* rail */}
        <line
          x1="90"
          y1="170"
          x2="830"
          y2="170"
          stroke="rgba(0,0,0,0.12)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <line
          x1="90"
          y1="170"
          x2="250"
          y2="170"
          stroke="rgba(0,0,0,0.20)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {steps.map((s, idx) => {
          const x = 120 + idx * 170;

          return (
            <g key={s.title}>
              <circle
                cx={x}
                cy={170}
                r={16}
                fill="#FFFFFF"
                stroke="rgba(0,0,0,0.22)"
                strokeWidth="2"
              />
              <circle cx={x} cy={170} r={7} fill="rgba(0,0,0,0.25)" />

              {idx < steps.length - 1 ? (
                <polygon
                  points={`${x + 70},170 ${x + 58},163 ${x + 58},177`}
                  fill="rgba(0,0,0,0.18)"
                />
              ) : null}

              <rect
                x={x - 74}
                y="200"
                width="148"
                height="58"
                rx="16"
                fill="#FFFFFF"
                stroke="rgba(0,0,0,0.08)"
              />
              <text
                x={x}
                y="224"
                textAnchor="middle"
                fontSize="12"
                fontFamily="ui-sans-serif, system-ui"
                fill="rgba(0,0,0,0.78)"
                fontWeight="700"
              >
                {s.title}
              </text>
              <text
                x={x}
                y="244"
                textAnchor="middle"
                fontSize="10.5"
                fontFamily="ui-sans-serif, system-ui"
                fill="rgba(0,0,0,0.55)"
              >
                {s.sub}
              </text>
            </g>
          );
        })}

        {/* bottom note */}
        <rect
          x="52"
          y="292"
          width="816"
          height="42"
          rx="16"
          fill="rgba(0,0,0,0.04)"
          stroke="rgba(0,0,0,0.06)"
        />
        <text
          x="70"
          y="317"
          fontSize="12"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.62)"
        >
          Governance: opt-in capture, encryption, access controls, audit logs,
          and retention/deletion policy (where permitted).
        </text>
      </svg>
    </div>
  );
}
