import IllustrationFrame from "@/components/illustrations/IllustrationFrame";

export default function AIBrainDiagram({
  className = "",
  variant = "svg", // "svg" | "image"
  mode = "fill", // "fill" | "aspect" (for svg)
  priority = false,
  caption = "AI Brain (Mock) — Phase 2: replace with validated architecture + governance.",
  imageSrc = "/illustrations/ai-brain-diagram-1.jpg",
  fit = "cover",
}) {
  const inputs = [
    "Behavioral signals (clicks, views, saves)",
    "Context & intent (search, session goals)",
    "Social signals (shares, follows, circles)",
    "Opt-in physical signals (where permitted)",
  ];

  const outputs = [
    "Predicts & displays tailored items/services",
    "Personalized mall layout + storefront order",
    "Try-on suggestions (avatar concept)",
    "Higher conversion, fewer returns",
  ];

  if (variant === "image") {
    return (
      <div className={["h-full w-full", className].join(" ")}>
        <IllustrationFrame
          src={imageSrc}
          alt="AI Brain diagram showing inputs, predictability engine, and outputs."
          priority={priority}
          caption={caption}
          fit={fit}
          sizes="(max-width: 768px) 100vw, 700px"
        />
      </div>
    );
  }

  return (
    <div
      className={[
        mode === "aspect" ? "w-full aspect-[1100/420]" : "h-full w-full",
        className,
      ].join(" ")}
    >
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

        <rect
          x="16"
          y="16"
          width="1068"
          height="388"
          rx="28"
          fill="url(#bgFade)"
          stroke="rgba(0,0,0,0.10)"
        />

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

        {inputs.map((t, i) => (
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
            y="130"
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            fill="rgba(0,0,0,0.80)"
          >
            Predictability Engine
          </text>

          <text
            x="550"
            y="160"
            textAnchor="middle"
            fontSize="12"
            fill="rgba(0,0,0,0.62)"
          >
            Personalization + Ranking
          </text>
          <text
            x="550"
            y="183"
            textAnchor="middle"
            fontSize="12"
            fill="rgba(0,0,0,0.62)"
          >
            Safety + Fraud Monitoring
          </text>
          <text
            x="550"
            y="206"
            textAnchor="middle"
            fontSize="12"
            fill="rgba(0,0,0,0.62)"
          >
            Multilingual Assistance
          </text>
          <text
            x="550"
            y="229"
            textAnchor="middle"
            fontSize="12"
            fill="rgba(0,0,0,0.62)"
          >
            Governance + Audit Signals
          </text>

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

        {outputs.map((t, i) => (
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

        <rect
          x="70"
          y="352"
          width="960"
          height="36"
          rx="14"
          fill="rgba(0,0,0,0.03)"
          stroke="rgba(0,0,0,0.06)"
        />
        <text x="90" y="374" fontSize="11.5" fill="rgba(0,0,0,0.62)">
          Note: physical signals are optional/opt-in (where permitted). Phase 2
          formalizes consent, retention/deletion, and audit controls.
        </text>
      </svg>
    </div>
  );
}
