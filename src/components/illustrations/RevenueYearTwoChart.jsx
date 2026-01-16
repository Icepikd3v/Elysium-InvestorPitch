export default function RevenueYearTwoChart({ className = "" }) {
  const W = 920;
  const H = 360;

  const outer = { x: 18, y: 18, w: 884, h: 324, r: 20 };
  const title = { x: 52, y: 70 };
  const subtitle = { x: 52, y: 94 };

  const legend = { x: 662, y: 56 };

  const plot = { x: 70, y: 120, w: 780, h: 180, r: 18 };
  const baselinePad = 22;
  const chartBaseY = plot.y + plot.h - baselinePad;
  const usableH = plot.h - (baselinePad + 18);

  const footer = { x: 52, y: 312, w: 816, h: 28, r: 14 };

  const grossFill = "rgba(0,0,0,0.55)";
  const netFill = "rgba(0,0,0,0.18)";

  const years = [
    { label: "Year 1", gross: 26.7, net: 13.3 },
    { label: "Year 2", gross: 44.5, net: 24.8 },
  ];

  const maxVal = Math.max(...years.flatMap((y) => [y.gross, y.net]));
  const scaleY = usableH / (maxVal * 1.15);

  const groupW = plot.w / years.length;
  const barW = 64;
  const gap = 14;

  const fmt = (n) => `$${n.toFixed(1)}M`;

  const ticks = 4;
  const tickVals = Array.from({ length: ticks + 1 }).map((_, i) => {
    const v = (maxVal * 1.15 * (ticks - i)) / ticks;
    return Math.round(v * 10) / 10;
  });

  return (
    <svg
      className={["w-full h-full", className].join(" ")}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Year 1 vs Year 2 revenue projection mock"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect x="0" y="0" width={W} height={H} rx="24" fill="#FAFAFA" />
      <rect
        x={outer.x}
        y={outer.y}
        width={outer.w}
        height={outer.h}
        rx={outer.r}
        fill="#FFFFFF"
        stroke="rgba(0,0,0,0.08)"
      />

      <text
        x={title.x}
        y={title.y}
        fontSize="18"
        fontFamily="ui-sans-serif, system-ui"
        fill="rgba(0,0,0,0.82)"
        fontWeight="700"
      >
        Revenue Projection — Year 1 vs Year 2 (Illustrative)
      </text>
      <text
        x={subtitle.x}
        y={subtitle.y}
        fontSize="12"
        fontFamily="ui-sans-serif, system-ui"
        fill="rgba(0,0,0,0.55)"
      >
        Illustrative estimates — replace with validated model + assumptions.
      </text>

      {/* Legend */}
      <g transform={`translate(${legend.x} ${legend.y})`}>
        <rect width="12" height="12" rx="3" fill={grossFill} />
        <text
          x="18"
          y="10"
          fontSize="11"
          fontFamily="ui-sans-serif, system-ui"
          fill="rgba(0,0,0,0.60)"
        >
          Gross
        </text>

        <rect x="80" width="12" height="12" rx="3" fill={netFill} />
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

      <rect
        x={plot.x}
        y={plot.y}
        width={plot.w}
        height={plot.h}
        rx={plot.r}
        fill="#FAFAFA"
        stroke="rgba(0,0,0,0.06)"
      />

      {/* Y axis labels + grid */}
      {tickVals.map((v, i) => {
        const y = plot.y + 20 + i * (usableH / ticks);
        return (
          <g key={i}>
            <line
              x1={plot.x + 48}
              y1={y}
              x2={plot.x + plot.w - 20}
              y2={y}
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="1"
            />
            <text
              x={plot.x + 18}
              y={y + 4}
              fontSize="10"
              fontFamily="ui-sans-serif, system-ui"
              fill="rgba(0,0,0,0.50)"
              textAnchor="start"
            >
              {fmt(v)}
            </text>
          </g>
        );
      })}

      <line
        x1={plot.x + 48}
        y1={chartBaseY}
        x2={plot.x + plot.w - 20}
        y2={chartBaseY}
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="1"
      />

      {years.map((y, idx) => {
        const groupCenter = plot.x + groupW * idx + groupW / 2;
        const grossH = Math.max(8, y.gross * scaleY);
        const netH = Math.max(8, y.net * scaleY);

        const grossX = groupCenter - barW - gap / 2;
        const netX = groupCenter + gap / 2;

        const grossY = chartBaseY - grossH;
        const netY = chartBaseY - netH;

        return (
          <g key={y.label}>
            <rect
              x={grossX}
              y={grossY}
              width={barW}
              height={grossH}
              rx="14"
              fill={grossFill}
            />
            <rect
              x={netX}
              y={netY}
              width={barW}
              height={netH}
              rx="14"
              fill={netFill}
            />

            <text
              x={grossX + barW / 2}
              y={grossY - 8}
              textAnchor="middle"
              fontSize="10"
              fontFamily="ui-sans-serif, system-ui"
              fill="rgba(0,0,0,0.55)"
            >
              {fmt(y.gross)}
            </text>
            <text
              x={netX + barW / 2}
              y={netY - 8}
              textAnchor="middle"
              fontSize="10"
              fontFamily="ui-sans-serif, system-ui"
              fill="rgba(0,0,0,0.55)"
            >
              {fmt(y.net)}
            </text>

            <text
              x={groupCenter}
              y={plot.y + plot.h - 6}
              textAnchor="middle"
              fontSize="11"
              fontFamily="ui-sans-serif, system-ui"
              fill="rgba(0,0,0,0.55)"
            >
              {y.label}
            </text>
          </g>
        );
      })}

      <rect
        x={footer.x}
        y={footer.y}
        width={footer.w}
        height={footer.h}
        rx={footer.r}
        fill="rgba(0,0,0,0.04)"
        stroke="rgba(0,0,0,0.06)"
      />
      <text
        x={footer.x + 18}
        y={footer.y + 19}
        fontSize="12"
        fontFamily="ui-sans-serif, system-ui"
        fill="rgba(0,0,0,0.62)"
      >
        Phase 2: validate forecast + assumptions (margin, take-rate, CAC/LTV,
        churn, cohorts).
      </text>
    </svg>
  );
}
