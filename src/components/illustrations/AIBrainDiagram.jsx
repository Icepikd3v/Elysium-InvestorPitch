export default function AIBrainDiagram({ className = "" }) {
  return (
    <div className={`w-full aspect-[1100/420] ${className}`}>
      <svg
        className="h-full w-full"
        viewBox="0 0 1100 420"
        role="img"
        aria-label="AI Brain diagram"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="bgFade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#f6f6f6" />
          </linearGradient>

          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodOpacity="0.12" />
          </filter>

          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="5"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="rgba(0,0,0,0.35)" />
          </marker>
        </defs>

        {/* Card background */}
        <rect
          x="16"
          y="16"
          width="1068"
          height="388"
          rx="28"
          fill="url(#bgFade)"
          stroke="rgba(0,0,0,0.10)"
        />

        {/* Left column: Inputs */}
        <text
          x="150"
          y="70"
          textAnchor="middle"
          fontSize="16"
          fontWeight="650"
          fill="rgba(0,0,0,0.75)"
        >
          Inputs
        </text>

        {[
          "Behavioral signals",
          "Context & intent",
          "Social signals",
          "Optional physical variables",
        ].map((t, i) => (
          <g key={t} filter="url(#softShadow)">
            <rect
              x="70"
              y={95 + i * 58}
              width="260"
              height="44"
              rx="14"
              fill="#fff"
              stroke="rgba(0,0,0,0.10)"
            />
            <circle cx="96" cy={117 + i * 58} r="6" fill="rgba(0,0,0,0.20)" />
            <text
              x="112"
              y={122 + i * 58}
              fontSize="13"
              fill="rgba(0,0,0,0.70)"
            >
              {t}
            </text>
          </g>
        ))}

        {/* Middle: AI Brain */}
        <text
          x="550"
          y="70"
          textAnchor="middle"
          fontSize="16"
          fontWeight="650"
          fill="rgba(0,0,0,0.75)"
        >
          AI Brain
        </text>

        <g filter="url(#softShadow)">
          <rect
            x="410"
            y="95"
            width="280"
            height="235"
            rx="24"
            fill="#fff"
            stroke="rgba(0,0,0,0.10)"
          />
          <text
            x="550"
            y="135"
            textAnchor="middle"
            fontSize="13"
            fontWeight="650"
            fill="rgba(0,0,0,0.78)"
          >
            Predictability Engine
          </text>

          <text
            x="550"
            y="165"
            textAnchor="middle"
            fontSize="12"
            fill="rgba(0,0,0,0.62)"
          >
            Personalization Logic
          </text>
          <text
            x="550"
            y="190"
            textAnchor="middle"
            fontSize="12"
            fill="rgba(0,0,0,0.62)"
          >
            Security Monitoring
          </text>
          <text
            x="550"
            y="215"
            textAnchor="middle"
            fontSize="12"
            fill="rgba(0,0,0,0.62)"
          >
            Multilingual Recommendations
          </text>

          {/* “Neural” arcs */}
          <path
            d="M455 285 C510 250, 590 250, 645 285"
            fill="none"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="2"
          />
          <path
            d="M470 300 C515 270, 585 270, 630 300"
            fill="none"
            stroke="rgba(0,0,0,0.14)"
            strokeWidth="2"
          />
          <path
            d="M485 315 C520 292, 580 292, 615 315"
            fill="none"
            stroke="rgba(0,0,0,0.10)"
            strokeWidth="2"
          />
        </g>

        {/* Right column: Outputs */}
        <text
          x="920"
          y="70"
          textAnchor="middle"
          fontSize="16"
          fontWeight="650"
          fill="rgba(0,0,0,0.75)"
        >
          Outputs
        </text>

        {[
          "Personalized mall layout",
          "Tailored product/service recs",
          "Try-on suggestions (avatar)",
          "Higher conversion, fewer returns",
        ].map((t, i) => (
          <g key={t} filter="url(#softShadow)">
            <rect
              x="770"
              y={95 + i * 58}
              width="260"
              height="44"
              rx="14"
              fill="#fff"
              stroke="rgba(0,0,0,0.10)"
            />
            <text
              x="900"
              y={122 + i * 58}
              textAnchor="middle"
              fontSize="13"
              fill="rgba(0,0,0,0.70)"
            >
              {t}
            </text>
          </g>
        ))}

        {/* Arrows between columns */}
        <path
          d="M340 150 L402 150"
          stroke="rgba(0,0,0,0.30)"
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />
        <path
          d="M698 150 L760 150"
          stroke="rgba(0,0,0,0.30)"
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />

        {/* Data “nodes” */}
        {[
          [365, 135],
          [380, 150],
          [365, 165],
          [720, 135],
          [735, 150],
          [720, 165],
        ].map(([x, y], idx) => (
          <circle key={idx} cx={x} cy={y} r="4" fill="rgba(0,0,0,0.18)" />
        ))}
      </svg>
    </div>
  );
}
