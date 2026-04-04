// src/App.jsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

import AvatarStepper from "./components/AvatarStepper";
import EllyChat from "./components/EllyChat";
import CategoryTiles from "./components/CategoryTiles";
import MallPreview3D from "./components/MallPreview3D";

import VirtualMallWalkthroughR3F from "./components/VirtualMallWalkthroughR3F";
import RetinaScan from "./components/RetinaScan";
import { PERSONAS, PRODUCT_CATALOG } from "./lib/mockData.js";
import {
  addToCart,
  createAIBrainSession,
  getRecommendations,
  getTopStores,
  logStoreView,
  setPersona,
} from "./lib/aiBrain.js";
import {
  DEMO_SCRIPTS,
  DEFAULT_DEMO_KEY,
  DEMO_SELECTOR_KEYS,
} from "./lib/demoScript.js";
import {
  resendVerificationRemote,
  signinRemote,
  verifyEmailRemote,
} from "./lib/authClient.js";

const PASSWORD_REQUEST_EMAIL = "kori@elysiummall.com";
const ORIGINAL_NARRATION_AUDIO = "/voiceovers/full-experience-narration-sequence.mp3";
const SIMULATION_NARRATION_AUDIO = "/voiceovers/simulation-voiceover-20260318.m4a";
const SIMULATION_VIDEO_LEAD_IN_SECONDS = 26;
const INVITE_FRIEND_AI_BRAIN_VIDEO = "/InviteFriendSimDemo.mp4";

function RevenueYearOneChartInvestor() {
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
  const quarters = [
    { label: "Q1", gross: 4.2, net: 1.6 },
    { label: "Q2", gross: 6.0, net: 2.8 },
    { label: "Q3", gross: 7.4, net: 3.7 },
    { label: "Q4", gross: 9.1, net: 5.2 },
  ];

  const maxVal = Math.max(...quarters.flatMap((q) => [q.gross, q.net]));
  const scaleY = usableH / (maxVal * 1.15);
  const groupW = plot.w / quarters.length;
  const barW = 44;
  const gap = 10;
  const grossFill = "#0EA5E9";
  const netFill = "#14B8A6";
  const fmt = (n) => `$${n.toFixed(1)}M`;
  const ticks = 4;
  const tickVals = Array.from({ length: ticks + 1 }).map((_, i) => {
    const v = (maxVal * 1.15 * (ticks - i)) / ticks;
    return Math.round(v * 10) / 10;
  });

  return (
    <svg
      className="chartSvgInvestor"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Projected revenue year one chart"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect x="0" y="0" width={W} height={H} rx="24" fill="#F6FBFF" />
      <rect x={outer.x} y={outer.y} width={outer.w} height={outer.h} rx={outer.r} fill="#FFFFFF" stroke="rgba(14,165,233,0.22)" />
      <text x={title.x} y={title.y} fontSize="18" fontFamily="ui-sans-serif, system-ui" fill="rgba(3,34,53,0.9)" fontWeight="700">
        Projected Revenue — Year One (Illustrative)
      </text>
      <text x={subtitle.x} y={subtitle.y} fontSize="12" fontFamily="ui-sans-serif, system-ui" fill="rgba(3,34,53,0.55)">
        Illustrative estimates for pitch narrative — not audited financials.
      </text>
      <g transform={`translate(${legend.x} ${legend.y})`}>
        <rect width="12" height="12" rx="3" fill={grossFill} />
        <text x="18" y="10" fontSize="11" fontFamily="ui-sans-serif, system-ui" fill="rgba(3,34,53,0.62)">Gross</text>
        <rect x="80" width="12" height="12" rx="3" fill={netFill} />
        <text x="98" y="10" fontSize="11" fontFamily="ui-sans-serif, system-ui" fill="rgba(3,34,53,0.62)">Net (after costs)</text>
      </g>
      <rect x={plot.x} y={plot.y} width={plot.w} height={plot.h} rx={plot.r} fill="#F8FCFF" stroke="rgba(14,165,233,0.14)" />
      {tickVals.map((v, i) => {
        const y = plot.y + 20 + i * (usableH / ticks);
        return (
          <g key={i}>
            <line x1={plot.x + 48} y1={y} x2={plot.x + plot.w - 20} y2={y} stroke="rgba(14,165,233,0.18)" strokeWidth="1" />
            <text x={plot.x + 18} y={y + 4} fontSize="10" fontFamily="ui-sans-serif, system-ui" fill="rgba(3,34,53,0.52)" textAnchor="start">
              {fmt(v)}
            </text>
          </g>
        );
      })}
      <line x1={plot.x + 48} y1={chartBaseY} x2={plot.x + plot.w - 20} y2={chartBaseY} stroke="rgba(3,34,53,0.18)" strokeWidth="1" />
      {quarters.map((q, idx) => {
        const groupCenter = plot.x + groupW * idx + groupW / 2;
        const grossH = Math.max(6, q.gross * scaleY);
        const netH = Math.max(6, q.net * scaleY);
        const grossX = groupCenter - barW - gap / 2;
        const netX = groupCenter + gap / 2;
        const grossY = chartBaseY - grossH;
        const netY = chartBaseY - netH;
        return (
          <g key={q.label}>
            <rect className="chart-bar" x={grossX} y={grossY} width={barW} height={grossH} rx="12" fill={grossFill} style={{ animationDelay: `${0.12 + idx * 0.14}s` }} />
            <rect className="chart-bar" x={netX} y={netY} width={barW} height={netH} rx="12" fill={netFill} style={{ animationDelay: `${0.2 + idx * 0.14}s` }} />
            <text x={grossX + barW / 2} y={grossY - 8} textAnchor="middle" fontSize="10" fontFamily="ui-sans-serif, system-ui" fill="rgba(3,34,53,0.62)">{fmt(q.gross)}</text>
            <text x={netX + barW / 2} y={netY - 8} textAnchor="middle" fontSize="10" fontFamily="ui-sans-serif, system-ui" fill="rgba(3,34,53,0.62)">{fmt(q.net)}</text>
            <text x={groupCenter} y={plot.y + plot.h - 6} textAnchor="middle" fontSize="11" fontFamily="ui-sans-serif, system-ui" fill="rgba(3,34,53,0.58)">{q.label}</text>
          </g>
        );
      })}
      <rect x={footer.x} y={footer.y} width={footer.w} height={footer.h} rx={footer.r} fill="rgba(14,165,233,0.08)" stroke="rgba(14,165,233,0.16)" />
      <text x={footer.x + 18} y={footer.y + 19} fontSize="12" fontFamily="ui-sans-serif, system-ui" fill="rgba(3,34,53,0.62)">
        Phase 2: replace with validated unit economics (CAC/LTV, take-rate, margin, churn, cohorts).
      </text>
    </svg>
  );
}

function RevenueYearTwoChartInvestor() {
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
  const years = [
    { label: "Year 1", gross: 26.7, net: 13.3 },
    { label: "Year 2", gross: 44.5, net: 24.8 },
  ];
  const grossFill = "#6366F1";
  const netFill = "#22C55E";
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
      className="chartSvgInvestor"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Year 1 vs Year 2 revenue projection chart"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect x="0" y="0" width={W} height={H} rx="24" fill="#F8F9FF" />
      <rect x={outer.x} y={outer.y} width={outer.w} height={outer.h} rx={outer.r} fill="#FFFFFF" stroke="rgba(99,102,241,0.2)" />
      <text x={title.x} y={title.y} fontSize="18" fontFamily="ui-sans-serif, system-ui" fill="rgba(32,30,92,0.9)" fontWeight="700">
        Revenue Projection — Year 1 vs Year 2 (Illustrative)
      </text>
      <text x={subtitle.x} y={subtitle.y} fontSize="12" fontFamily="ui-sans-serif, system-ui" fill="rgba(32,30,92,0.55)">
        Illustrative estimates — replace with validated model + assumptions.
      </text>
      <g transform={`translate(${legend.x} ${legend.y})`}>
        <rect width="12" height="12" rx="3" fill={grossFill} />
        <text x="18" y="10" fontSize="11" fontFamily="ui-sans-serif, system-ui" fill="rgba(32,30,92,0.62)">Gross</text>
        <rect x="80" width="12" height="12" rx="3" fill={netFill} />
        <text x="98" y="10" fontSize="11" fontFamily="ui-sans-serif, system-ui" fill="rgba(32,30,92,0.62)">Net (after costs)</text>
      </g>
      <rect x={plot.x} y={plot.y} width={plot.w} height={plot.h} rx={plot.r} fill="#F6F7FF" stroke="rgba(99,102,241,0.14)" />
      {tickVals.map((v, i) => {
        const y = plot.y + 20 + i * (usableH / ticks);
        return (
          <g key={i}>
            <line x1={plot.x + 48} y1={y} x2={plot.x + plot.w - 20} y2={y} stroke="rgba(99,102,241,0.17)" strokeWidth="1" />
            <text x={plot.x + 18} y={y + 4} fontSize="10" fontFamily="ui-sans-serif, system-ui" fill="rgba(32,30,92,0.5)" textAnchor="start">{fmt(v)}</text>
          </g>
        );
      })}
      <line x1={plot.x + 48} y1={chartBaseY} x2={plot.x + plot.w - 20} y2={chartBaseY} stroke="rgba(32,30,92,0.2)" strokeWidth="1" />
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
            <rect className="chart-bar" x={grossX} y={grossY} width={barW} height={grossH} rx="14" fill={grossFill} style={{ animationDelay: `${0.2 + idx * 0.2}s` }} />
            <rect className="chart-bar" x={netX} y={netY} width={barW} height={netH} rx="14" fill={netFill} style={{ animationDelay: `${0.3 + idx * 0.2}s` }} />
            <text x={grossX + barW / 2} y={grossY - 8} textAnchor="middle" fontSize="10" fontFamily="ui-sans-serif, system-ui" fill="rgba(32,30,92,0.62)">{fmt(y.gross)}</text>
            <text x={netX + barW / 2} y={netY - 8} textAnchor="middle" fontSize="10" fontFamily="ui-sans-serif, system-ui" fill="rgba(32,30,92,0.62)">{fmt(y.net)}</text>
            <text x={groupCenter} y={plot.y + plot.h - 6} textAnchor="middle" fontSize="11" fontFamily="ui-sans-serif, system-ui" fill="rgba(32,30,92,0.56)">{y.label}</text>
          </g>
        );
      })}
      <rect x={footer.x} y={footer.y} width={footer.w} height={footer.h} rx={footer.r} fill="rgba(99,102,241,0.08)" stroke="rgba(99,102,241,0.16)" />
      <text x={footer.x + 18} y={footer.y + 19} fontSize="12" fontFamily="ui-sans-serif, system-ui" fill="rgba(32,30,92,0.62)">
        Phase 2: validate forecast + assumptions (margin, take-rate, CAC/LTV, churn, cohorts).
      </text>
    </svg>
  );
}

function RolloutTimelineChartInvestor() {
  const items = [
    { label: "Q1", title: "Hire/engage tech team" },
    { label: "Q2", title: "Complete AI engine framing + interface" },
    { label: "Q3", title: "Build website + expand over time" },
    { label: "Q4", title: "Complete coding/testing + phase-in rollout" },
    { label: "Q5–Q6", title: "Acquire additional platforms" },
    { label: "Q7–Q8", title: "Begin marketing + scale revenue rollout" },
  ];

  return (
    <svg
      className="chartSvgInvestor"
      viewBox="0 0 920 360"
      role="img"
      aria-label="Projected rollout timeline illustration"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect x="0" y="0" width="920" height="360" rx="24" fill="#F6FBFF" />
      <rect x="18" y="18" width="884" height="324" rx="20" fill="#FFFFFF" stroke="rgba(14,165,233,0.2)" />
      <text x="52" y="70" fontSize="18" fontFamily="ui-sans-serif, system-ui" fill="rgba(3,34,53,0.9)" fontWeight="700">
        Projected Rollout Schedule (Illustrative)
      </text>
      <text x="52" y="94" fontSize="12" fontFamily="ui-sans-serif, system-ui" fill="rgba(3,34,53,0.55)">
        Phase 1: narrative + mock visuals • Phase 2: validated dependencies & execution plan
      </text>

      <line x1="90" y1="150" x2="830" y2="150" stroke="rgba(14,165,233,0.2)" strokeWidth="10" strokeLinecap="round" />
      <line className="rollout-progress-rail" x1="90" y1="150" x2="465" y2="150" stroke="rgba(14,165,233,0.5)" strokeWidth="10" strokeLinecap="round" />

      {items.map((item, i) => {
        const x = 120 + i * 120;
        const isUpper = i % 2 === 0;
        const cardY = isUpper ? 182 : 248;
        const cardW = Math.max(164, Math.min(228, item.title.length * 5.9));
        const cardH = 58;
        const titleY = cardY + 25;
        const subtitleY = cardY + 46;

        return (
          <g key={item.label}>
            <circle
              className="rollout-node-pop"
              cx={x}
              cy={150}
              r={14}
              fill="#FFFFFF"
              stroke="rgba(14,165,233,0.45)"
              strokeWidth="2"
              style={{ animationDelay: `${i * 0.14}s` }}
            />
            <circle
              className="rollout-node-core"
              cx={x}
              cy={150}
              r={6}
              fill="rgba(20,184,166,0.9)"
              style={{ animationDelay: `${i * 0.12}s` }}
            />

            <text
              x={x}
              y={128}
              textAnchor="middle"
              fontSize="11"
              fontFamily="ui-sans-serif, system-ui"
              fill="rgba(3,34,53,0.58)"
              fontWeight="700"
            >
              {item.label}
            </text>

            <g className="rollout-milestone-group" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
              <rect x={x - cardW / 2} y={cardY} width={cardW} height={cardH} rx={14} fill="#FFFFFF" stroke="rgba(14,165,233,0.2)" />
              <text
                x={x}
                y={titleY}
                textAnchor="middle"
                fontSize="11.5"
                fontFamily="ui-sans-serif, system-ui"
                fill="rgba(3,34,53,0.84)"
                fontWeight="700"
              >
                {item.title}
              </text>
              <text
                x={x}
                y={subtitleY}
                textAnchor="middle"
                fontSize="10"
                fontFamily="ui-sans-serif, system-ui"
                fill="rgba(3,34,53,0.54)"
              >
                milestone
              </text>
            </g>
          </g>
        );
      })}

      <rect x="52" y="314" width="816" height="28" rx="16" fill="rgba(14,165,233,0.08)" stroke="rgba(14,165,233,0.16)" />
      <text x="70" y="332" fontSize="12" fontFamily="ui-sans-serif, system-ui" fill="rgba(3,34,53,0.64)">
        Phase 2: add hiring plan, data pipeline readiness, vendor onboarding, acquisition integration steps, and KPI gates.
      </text>
    </svg>
  );
}

function RaiseMilestonesChartInvestor() {
  const steps = [
    { x: 110, title: "Seed", sub: "$750K–$1M" },
    { x: 270, title: "Build", sub: "AI + product" },
    { x: 430, title: "Pilot", sub: "vendors + cohorts" },
    { x: 590, title: "Acquire", sub: "social + eComm" },
    { x: 750, title: "Expand", sub: "marketing + scale" },
  ];

  return (
    <svg
      className="chartSvgInvestor"
      viewBox="0 0 920 360"
      role="img"
      aria-label="Capital raise flow illustration"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect x="0" y="0" width="920" height="360" rx="24" fill="#FFF9F2" />
      <rect x="18" y="18" width="884" height="324" rx="20" fill="#FFFFFF" stroke="rgba(245,158,11,0.24)" />

      <text x="52" y="70" fontSize="18" fontFamily="ui-sans-serif, system-ui" fill="rgba(74,43,8,0.9)" fontWeight="700">
        Raise & Milestones (Illustrative)
      </text>
      <text x="52" y="94" fontSize="12" fontFamily="ui-sans-serif, system-ui" fill="rgba(74,43,8,0.58)">
        Seed → Build → Pilot → Acquire → Expand (Phase 1 narrative)
      </text>

      <line x1="110" y1="200" x2="750" y2="200" stroke="rgba(245,158,11,0.22)" strokeWidth="10" strokeLinecap="round" />
      <line className="raise-progress-rail" x1="110" y1="200" x2="270" y2="200" stroke="rgba(245,158,11,0.55)" strokeWidth="10" strokeLinecap="round" />

      {steps.map((step, idx) => (
        <g key={step.x}>
          <circle
            className="raise-node-pop"
            cx={step.x}
            cy={200}
            r={16}
            fill="#FFFFFF"
            stroke="rgba(245,158,11,0.45)"
            strokeWidth="2"
            style={{ animationDelay: `${idx * 0.12}s` }}
          />
          <circle
            className="raise-node-core"
            cx={step.x}
            cy={200}
            r={7}
            fill={idx === 0 ? "rgba(245,158,11,0.95)" : "rgba(20,184,166,0.82)"}
            style={{ animationDelay: `${idx * 0.12}s` }}
          />

          {idx < steps.length - 1 ? (
            <polygon points={`${step.x + 62},200 ${step.x + 52},193 ${step.x + 52},207`} fill="rgba(0,0,0,0.20)" />
          ) : null}

          <g className="raise-step-group" style={{ animationDelay: `${0.18 + idx * 0.08}s` }}>
            <rect x={step.x - 70} y="230" width="140" height="54" rx="16" fill="#FFFFFF" stroke="rgba(245,158,11,0.22)" />
            <text x={step.x} y="253" textAnchor="middle" fontSize="12" fontFamily="ui-sans-serif, system-ui" fill="rgba(74,43,8,0.84)" fontWeight="700">
              {step.title}
            </text>
            <text x={step.x} y="272" textAnchor="middle" fontSize="10.5" fontFamily="ui-sans-serif, system-ui" fill="rgba(74,43,8,0.62)">
              {step.sub}
            </text>
          </g>
        </g>
      ))}

      <rect x="560" y="112" width="308" height="46" rx="16" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.2)" />
      <text x="576" y="131" fontSize="11.5" fontFamily="ui-sans-serif, system-ui" fill="rgba(74,43,8,0.74)" fontWeight="650">
        Public pathway (as applicable)
      </text>
      <text x="576" y="149" fontSize="11.5" fontFamily="ui-sans-serif, system-ui" fill="rgba(74,43,8,0.62)">
        OTC readiness → reporting → possible NASDAQ pathway
      </text>

      <rect x="52" y="300" width="816" height="42" rx="16" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.2)" />
      <text x="70" y="325" fontSize="12" fontFamily="ui-sans-serif, system-ui" fill="rgba(74,43,8,0.7)">
        Phase 2: add budget breakdown, diligence checklist, integration plan, and compliance timing criteria.
      </text>
    </svg>
  );
}

function RevenueMixBarChartInvestor() {
  const rows = [
    { label: "Membership", value: 34 },
    { label: "Advertising", value: 22 },
    { label: "Vendor Reports", value: 18 },
    { label: "Acquisition Revenue", value: 26 },
  ];
  return (
    <div className="investorBarGraphCard">
      <h4>Revenue Mix (Illustrative)</h4>
      {rows.map((row, idx) => (
        <div key={row.label} className="investorBarRow">
          <span>{row.label}</span>
          <div><i style={{ width: `${row.value}%`, animationDelay: `${idx * 120}ms` }} /></div>
          <b>{row.value}%</b>
        </div>
      ))}
    </div>
  );
}

function RolloutBarsChartInvestor() {
  const rows = [
    { label: "Team + Build", value: 78 },
    { label: "Testing + QA", value: 56 },
    { label: "Acquisitions", value: 62 },
    { label: "Scale Marketing", value: 86 },
  ];
  return (
    <div className="investorBarGraphCard">
      <h4>Rollout Workstream Load</h4>
      {rows.map((row, idx) => (
        <div key={row.label} className="investorBarRow">
          <span>{row.label}</span>
          <div><i style={{ width: `${row.value}%`, animationDelay: `${idx * 120}ms` }} /></div>
          <b>{row.value}%</b>
        </div>
      ))}
    </div>
  );
}

function BridgeUseOfFundsBarChartInvestor() {
  const rows = [
    { label: "Reg / Legal", value: 28 },
    { label: "Audit Setup", value: 19 },
    { label: "Raise Expenses", value: 21 },
    { label: "Operating Coverage", value: 32 },
  ];
  return (
    <div className="investorBarGraphCard">
      <h4>Bridge Raise Use Of Funds</h4>
      {rows.map((row, idx) => (
        <div key={row.label} className="investorBarRow">
          <span>{row.label}</span>
          <div><i style={{ width: `${row.value}%`, animationDelay: `${idx * 120}ms` }} /></div>
          <b>{row.value}%</b>
        </div>
      ))}
    </div>
  );
}

function YearOneRevenueBarsChartInvestor() {
  const rows = [
    { label: "Membership", value: 26 },
    { label: "Advertising", value: 18 },
    { label: "Vendor Data", value: 21 },
    { label: "Acquisition", value: 35 },
  ];
  return (
    <div className="investorBarGraphCard">
      <h4>Year 1 Revenue Drivers</h4>
      {rows.map((row, idx) => (
        <div key={row.label} className="investorBarRow">
          <span>{row.label}</span>
          <div><i style={{ width: `${row.value}%`, animationDelay: `${idx * 120}ms` }} /></div>
          <b>{row.value}%</b>
        </div>
      ))}
    </div>
  );
}

function YearTwoRevenueBarsChartInvestor() {
  const rows = [
    { label: "Membership", value: 32 },
    { label: "Advertising", value: 24 },
    { label: "Vendor Data", value: 19 },
    { label: "Acquisition", value: 25 },
  ];
  return (
    <div className="investorBarGraphCard">
      <h4>Year 2 Revenue Drivers</h4>
      {rows.map((row, idx) => (
        <div key={row.label} className="investorBarRow">
          <span>{row.label}</span>
          <div><i style={{ width: `${row.value}%`, animationDelay: `${idx * 120}ms` }} /></div>
          <b>{row.value}%</b>
        </div>
      ))}
    </div>
  );
}

function formatInvestorNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function MarketSizeContextChartInvestor() {
  const rows = [
    { label: "Global eCommerce (2023)", valueLabel: "$21,100B", width: 11.5 },
    { label: "Projected eCommerce (2032)", valueLabel: "$183,800B", width: 100 },
    { label: "Global Online Retail (2023)", valueLabel: "$4,400B", width: 2.4 },
    { label: "Projected Online Retail (2028)", valueLabel: "$6,800B", width: 3.7 },
    { label: "Social Media (2025)", valueLabel: "$286.53B", width: 0.5 },
    { label: "Projected Social Media (2029)", valueLabel: "$466.56B", width: 0.7 },
  ];

  return (
    <div className="investorBarGraphCard">
      <h4>Market Size Context (Slide 11)</h4>
      {rows.map((row, idx) => (
        <div key={row.label} className="investorBarRow investorBarRowWide">
          <span>{row.label}</span>
          <div><i style={{ width: `${Math.max(3, row.width)}%`, animationDelay: `${idx * 120}ms` }} /></div>
          <b>{row.valueLabel}</b>
        </div>
      ))}
    </div>
  );
}

function CapitalizationShareStructureChartInvestor() {
  const rows = [
    { label: "Common Authorized", value: 190000000 },
    { label: "Blank Check Preferred Stock Authorized", value: 10000000 },
    { label: "Common Issued", value: 81000000 },
    { label: "Preferred Issued", value: 0 },
  ];
  const max = Math.max(...rows.map((row) => row.value), 1);
  return (
    <div className="investorBarGraphCard">
      <h4>Capitalization Share Structure</h4>
      {rows.map((row, idx) => (
        <div key={row.label} className="investorBarRow investorBarRowWide">
          <span>{row.label}</span>
          <div><i style={{ width: `${Math.max(3, (row.value / max) * 100)}%`, animationDelay: `${idx * 120}ms` }} /></div>
          <b>{formatInvestorNumber(row.value)} shares</b>
        </div>
      ))}
    </div>
  );
}

function ValuationRaiseSnapshotChartInvestor() {
  const rows = [
    { label: "Pre-Money Valuation", value: 8000000 },
    { label: "New Equity Raised", value: 750000 },
    { label: "Post-Money Valuation", value: 8750000 },
  ];
  const max = Math.max(...rows.map((row) => row.value), 1);
  return (
    <div className="investorBarGraphCard">
      <h4>Valuation + Raise Snapshot</h4>
      {rows.map((row, idx) => (
        <div key={row.label} className="investorBarRow investorBarRowWide">
          <span>{row.label}</span>
          <div><i style={{ width: `${Math.max(3, (row.value / max) * 100)}%`, animationDelay: `${idx * 120}ms` }} /></div>
          <b>${formatInvestorNumber(row.value)}</b>
        </div>
      ))}
    </div>
  );
}

/**
 * ✅ Walkthrough storefront → category + brand filter + label
 * This makes each storefront enter into a "real shop" view with the right products.
 */
const WALK_STORE_CONTEXT = {
  louboutin: {
    category: "LOUBOUTIN",
    label: "CHRISTIAN LOUBOUTIN",
    brand: "Louboutin",
    aliases: ["Louboutin", "Christian Louboutin"],
  },
  prada: {
    category: "PRADA",
    label: "PRADA",
    brand: "Prada",
    aliases: ["Prada"],
  },
  omega: {
    category: "OMEGA",
    label: "OMEGA",
    brand: "Omega",
    aliases: ["Omega"],
  },
  jimmychoo: {
    category: "JIMMY CHOO",
    label: "JIMMY CHOO",
    brand: "Jimmy Choo",
    aliases: ["Jimmy Choo", "JimmyChoo"],
  },
};

const LUXURY_STORES = ["LOUBOUTIN", "PRADA", "OMEGA", "JIMMY CHOO"];

const STOREFRONT_DISPLAY_LABELS = {
  LOUBOUTIN: "CHRISTIAN LOUBOUTIN",
  PRADA: "PRADA",
  OMEGA: "OMEGA",
  "JIMMY CHOO": "JIMMY CHOO",
};

const STORE_TO_SIM_KEY = {
  LOUBOUTIN: "louboutin",
  PRADA: "prada",
  OMEGA: "omega",
  "JIMMY CHOO": "jimmychoo",
};

const simKeyForStore = (store) => STORE_TO_SIM_KEY[store] || null;

const formatStoreLabel = (store) =>
  STOREFRONT_DISPLAY_LABELS[store] || store || "—";

const LUXURY_PRODUCT_ORDER = {
  LOUBOUTIN: [
    "Red Sole Stiletto",
    "Patent Slingback",
    "Classic Bootie",
    "Evening Heel",
  ],
  PRADA: [
    "Structured Tote",
    "Leather Loafer",
    "Saffiano Pump",
    "Icon Sunglasses",
  ],
  OMEGA: [
    "Seamaster Diver",
    "Speedmaster Chronograph",
    "Constellation Quartz",
    "Omega Prestige",
  ],
  "JIMMY CHOO": [
    "Aurelia Heel",
    "Crystal Strap Heel",
    "Signature Pump",
    "Nude Pointed Pump",
  ],
};

const DEMO_COLOR_BY_STORE = {
  LOUBOUTIN: ["red", "black", "beige"],
  PRADA: ["beige", "black", "red"],
  OMEGA: ["bluebezel", "blackstainless", "whitedial"],
  "JIMMY CHOO": ["beige", "red", "black"],
};

const DEMO_PERSONA_COLOR_PREFS = {
  fashion: ["red", "beige", "black"],
  home: ["beige", "black", "red"],
  tech: ["bluebezel", "blackdial", "blackstainless", "bluedial", "whitedial"],
  family: ["beige", "red", "black", "whitedial"],
  luxury: ["red", "black", "beige"],
};

const DEMO_PERSONA_SIZE_PROFILE = {
  fashion: "narrow fit",
  home: "standard fit",
  tech: "precision fit",
  family: "comfort fit",
  luxury: "tailored fit",
};

const hashSeed = (value) => {
  const input = String(value || "");
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
};

const pickDemoSelection = ({ store, recos = [], personaId = "fashion", session, cycle = 0 }) => {
  if (!recos.length) return null;
  const pool = recos.slice(0, Math.min(3, recos.length));
  const historySeed = (session?.cart || []).map((p) => p.sku).join("|");
  const seed = hashSeed(`${personaId}|${store}|${historySeed}|${cycle}|${session?.signals?.lastStore || ""}`);
  const pick = pool[seed % pool.length] || pool[0];

  const preferredColors = DEMO_PERSONA_COLOR_PREFS[personaId] || DEMO_PERSONA_COLOR_PREFS.fashion;
  const storePalette = DEMO_COLOR_BY_STORE[store] || ["black"];
  const colorPool = [...preferredColors, ...storePalette, "black"];
  const color = colorPool[seed % colorPool.length] || "black";

  return {
    product: pick,
    color,
    sizeProfile: DEMO_PERSONA_SIZE_PROFILE[personaId] || DEMO_PERSONA_SIZE_PROFILE.fashion,
  };
};

function orderLuxuryProducts(store, products = []) {
  const order = LUXURY_PRODUCT_ORDER[store];
  if (!order?.length) return products;
  const rank = new Map(order.map((name, idx) => [name, idx]));
  return [...products].sort((a, b) => {
    const ar = rank.has(a.name) ? rank.get(a.name) : 999;
    const br = rank.has(b.name) ? rank.get(b.name) : 999;
    if (ar !== br) return ar - br;
    return String(a.name || "").localeCompare(String(b.name || ""));
  });
}

/** Product image overrides (support multiple candidates per SKU) */
const PRODUCT_IMAGE_OVERRIDES = {
  "EL-101": ["/products/EL101.jpg", "/products/EL-101.jpg"],
  "HB-427": [
    "/products/HB427.jpg",
    "/products/HB-427.jpg",
    "/products/HB-247.jpg",
  ],
};

/** Small “AI explanation layer” to make the demo feel undeniably AI-driven */
const explainReco = (session, store) => {
  const persona = session?.personaLabel || "Shopper";
  const last = session?.signals?.lastStore;
  const band = session?.signals?.priceBand;

  const bandText =
    band === "premium"
      ? "premium preference detected"
      : band === "mid"
        ? "mid-range preference detected"
        : band === "value"
          ? "value preference detected"
          : null;

  const views = session?.views?.[store] || 0;
  const viewText = views ? `${views} view(s) in ${store}` : null;

  const why = [
    persona,
    last ? `recently browsed ${last}` : null,
    bandText,
    viewText,
  ]
    .filter(Boolean)
    .join(" • ");

  return why || "Session-based personalization";
};

const priceBandLabelFor = (price) => {
  const value = Number(price) || 0;
  if (value >= 200) return "premium";
  if (value >= 80) return "mid-range";
  return "budget-friendly";
};

const budgetFitLabel = (session, price) => {
  const signal = session?.signals?.priceBand;
  const value = Number(price) || 0;

  if (!signal) return "exploratory fit";
  if (signal === "premium") return value >= 200 ? "strong budget fit" : "stretch fit";
  if (signal === "mid") return value >= 80 && value < 200 ? "strong budget fit" : "cross-band fit";
  return value < 80 ? "strong budget fit" : "stretch fit";
};

function ProductThumb({ product }) {
  const candidatesRef = useRef([]);
  const [src, setSrc] = useState("");
  const [tryIndex, setTryIndex] = useState(0);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    if (!product) return;

    const overrides = PRODUCT_IMAGE_OVERRIDES[product.sku];
    const overrideList = Array.isArray(overrides)
      ? overrides
      : overrides
        ? [overrides]
        : [];

    const sku = String(product.sku || "");
    const skuNoHyphen = sku.replace(/-/g, "");

    const candidates = [
      ...overrideList,
      product.imageUrl,
      product.localAltImageUrl,
      `/products/${sku}.jpg`,
      `/products/${skuNoHyphen}.jpg`,
      `/products/${sku.toUpperCase()}.jpg`,
      `/products/${skuNoHyphen.toUpperCase()}.jpg`,
    ].filter(Boolean);

    candidatesRef.current = candidates;
    setTryIndex(0);
    setUsedFallback(false);
    setSrc(candidates[0] || "");
  }, [product?.sku, product?.imageUrl, product?.localAltImageUrl]);

  const onError = () => {
    if (!product) return;

    const candidates = candidatesRef.current || [];
    const nextIdx = tryIndex + 1;

    if (nextIdx < candidates.length) {
      setTryIndex(nextIdx);
      setSrc(candidates[nextIdx]);
      return;
    }

    if (!usedFallback && product.fallbackImageUrl) {
      setUsedFallback(true);
      setSrc(product.fallbackImageUrl);
      return;
    }

    setSrc("");
  };

  const showMarkOnly = !src;

  return (
    <div className="thumb" aria-label={`Product image for ${product?.name}`}>
      {!showMarkOnly ? (
        <img
          src={src}
          onError={onError}
          alt={product?.name || "Product"}
          className="thumbImg"
          loading="lazy"
        />
      ) : (
        <div className="thumbInner">{product?.brandMark || "—"}</div>
      )}
    </div>
  );
}

/** ✅ Brand matching helper (robust) */
function matchesStorefront(product, storefrontCtx) {
  if (!product || !storefrontCtx) return true;
  const aliases =
    storefrontCtx.aliases || [storefrontCtx.brand].filter(Boolean);

  const haystack =
    `${product.brand || ""} ${product.name || ""} ${product.sku || ""}`.toLowerCase();

  // Match any alias in brand/name/sku
  const hit = aliases.some((a) => haystack.includes(String(a).toLowerCase()));
  if (hit) return true;

  // Extra fallback: if label exists, try it too
  if (
    storefrontCtx.label &&
    haystack.includes(storefrontCtx.label.toLowerCase())
  )
    return true;

  return false;
}

const USER_STORE_KEY = "elysium_registered_users";
const NAME_RE = /^[A-Za-z][A-Za-z '-]*$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.com$/i;
const PASSWORD_RE = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/;
const PHONE_RE = /^1\+\(\d{3}\)-\(\d{4}\)$/;

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const readRegisteredUsers = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USER_STORE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeRegisteredUsers = (users) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_STORE_KEY, JSON.stringify(users));
};

const createVerificationToken = () =>
  `verify_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const formatPhoneValue = (input) => {
  const digitsOnly = String(input || "").replace(/\D/g, "");
  if (!digitsOnly) return "";
  const normalized = (digitsOnly.startsWith("1") ? digitsOnly : `1${digitsOnly}`).slice(0, 8);
  const area = normalized.slice(1, 4);
  const line = normalized.slice(4, 8);
  let out = "1+";
  if (area.length) {
    out += `(${area}`;
    if (area.length === 3) out += ")";
  }
  if (line.length) {
    out += `-(${line}`;
    if (line.length === 4) out += ")";
  }
  return out;
};

export default function App() {
  const DEMO_EMAIL = "investor@elysiummall.com";
  const DEMO_PASS = "Elysium2026!";
  const NDA_POPUP_IMAGE = "/NDAPopupFinal.png";
  const LANDING_PATH = "/landing-page";
  const SIGN_IN_PATH = "/landing-page/sign-in";
  const VERIFY_EMAIL_PATH = "/landing-page/verify-email";
  const SIMULATOR_PATH = "/simulator";
  const INTRO_STAGE_BLACK_MS = 300;
  const INTRO_HOLD_MS = 350;
  const LANDING_INTRO_DISSOLVE_MS = 3000;
  const initialRoute = (() => {
    if (typeof window === "undefined") return { view: "landing", intent: "signin" };
    const normalizedPath = decodeURIComponent(window.location.pathname || "/")
      .toLowerCase()
      .replace(/\s+/g, "-");
    if (normalizedPath.includes("/sign-up") || normalizedPath.includes("/signup")) {
      return { view: "auth", intent: "signin" };
    }
    if (normalizedPath.includes("/verify-email")) {
      return { view: "verify", intent: "signin" };
    }
    if (normalizedPath.includes("/sign-in") || normalizedPath.includes("/signin")) {
      return { view: "auth", intent: "signin" };
    }
    return { view: "landing", intent: "signin" };
  })();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [publicView, setPublicView] = useState(initialRoute.view); // landing | auth | verify
  const [authIntent, setAuthIntent] = useState(initialRoute.intent); // signin only
  const [registeredUsers, setRegisteredUsers] = useState(() => readRegisteredUsers());
  const [pendingVerification, setPendingVerification] = useState(null);
  const [authNotice, setAuthNotice] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const [scanAuthorized, setScanAuthorized] = useState(false);
  const [showBrandIntroMall, setShowBrandIntroMall] = useState(false);
  const [introReadyToContinue, setIntroReadyToContinue] = useState(false);
  const [showLandingMallTransition, setShowLandingMallTransition] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [error, setError] = useState("");
  // Flow: brand_intro -> landing/auth/verify -> scan -> app
  const [flowStage, setFlowStage] = useState(() => {
    if (initialRoute.view === "landing") return "brand_intro";
    const saved = localStorage.getItem("elysium_flow_stage");
    return saved === "brand_intro" || saved === "scan" || saved === "app"
      ? saved
      : "login";
  });

  const [minorityReportMode, setMinorityReportMode] = useState(() => {
    const saved = localStorage.getItem("elysium_mr_mode");
    return saved === "0" ? false : true; // default ON
  });

  useEffect(() => {
    localStorage.setItem("elysium_flow_stage", flowStage);
  }, [flowStage]);

  useEffect(() => {
    localStorage.setItem("elysium_mr_mode", minorityReportMode ? "1" : "0");
  }, [minorityReportMode]);

  // Theme
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("elysium_theme");
    return saved === "light" || saved === "dark" ? saved : "dark";
  });
  const [showPasswordRequestModal, setShowPasswordRequestModal] = useState(false);
  const [ndaStatus, setNdaStatus] = useState("pending");
  const [mediaLightbox, setMediaLightbox] = useState(null);
  const [passwordRequestForm, setPasswordRequestForm] = useState({
    fullName: "",
    contactNumber: "",
    emailAddress: "",
    comments: "",
  });
  const inviteClipRef = useRef(null);
  const soloClipRef = useRef(null);
  const soloNarrationRef = useRef(null);
  const simulationNarrationRef = useRef(null);
  const simulationLeadInTimeoutRef = useRef(null);
  const simulationCountdownIntervalRef = useRef(null);
  const authTransitionTimeoutRef = useRef(null);
  const [soloClipReady, setSoloClipReady] = useState(false);
  const [inviteClipReady, setInviteClipReady] = useState(false);
  const [isSoloPlaying, setIsSoloPlaying] = useState(false);
  const [isSimulationPlaying, setIsSimulationPlaying] = useState(false);
  const [isSimulationWaitingForLeadIn, setIsSimulationWaitingForLeadIn] = useState(false);
  const [simulationHasVideoStarted, setSimulationHasVideoStarted] = useState(false);
  const [simulationLeadInCountdown, setSimulationLeadInCountdown] = useState(
    SIMULATION_VIDEO_LEAD_IN_SECONDS,
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("elysium_theme", theme);
  }, [theme]);

  useEffect(() => {
    writeRegisteredUsers(registeredUsers);
  }, [registeredUsers]);

  const pushPath = (path, replace = false) => {
    if (typeof window === "undefined") return;
    const nextPath = path || "/";
    if (window.location.pathname === nextPath) return;
    if (replace) {
      window.history.replaceState({}, "", nextPath);
      return;
    }
    window.history.pushState({}, "", nextPath);
  };

  const openPublicLanding = () => {
    if (authTransitionTimeoutRef.current) {
      window.clearTimeout(authTransitionTimeoutRef.current);
      authTransitionTimeoutRef.current = null;
    }
    setShowLandingMallTransition(true);
    setPublicView("landing");
    setIsMobileNavOpen(false);
    setError("");
    setAuthNotice("");
    setVerificationStatus("");
    if (isLoggedIn) {
      setShowLandingPage(true);
      pushPath(LANDING_PATH);
      return;
    }
    pushPath(LANDING_PATH);
  };

  const openAuthScreen = ({ withDissolve = false } = {}) => {
    if (authTransitionTimeoutRef.current) {
      window.clearTimeout(authTransitionTimeoutRef.current);
      authTransitionTimeoutRef.current = null;
    }

    setShowLandingMallTransition(true);

    const routeToSignIn = () => {
      setIsMobileNavOpen(false);
      setAuthIntent("signin");
      setPublicView("auth");
      setError("");
      setAuthNotice("");
      setVerificationStatus("");
      pushPath(SIGN_IN_PATH);
      authTransitionTimeoutRef.current = null;
    };

    if (withDissolve && !isLoggedIn && publicView === "landing") {
      routeToSignIn();
      return;
    }

    routeToSignIn();
  };

  const openSimulatorGate = () => {
    setShowLandingMallTransition(true);
    setIsMobileNavOpen(false);
    if (!isLoggedIn) {
      openAuthScreen({ withDissolve: true });
      return;
    }
    setShowLandingPage(false);
    setFlowStage("app");
    pushPath(SIMULATOR_PATH);
  };

  const updatePasswordRequestField = (field) => (event) => {
    const { value } = event.target;
    setPasswordRequestForm((prev) => ({ ...prev, [field]: value }));
  };

  const closePasswordRequestModal = () => {
    setShowPasswordRequestModal(false);
    setPasswordRequestForm({
      fullName: "",
      contactNumber: "",
      emailAddress: "",
      comments: "",
    });
  };

  const acceptNda = () => {
    setNdaStatus("accepted");
  };

  const rejectNda = () => {
    setNdaStatus("rejected");
  };

  const submitPasswordRequest = (event) => {
    event.preventDefault();
    const subject = "Elysium SmartMall Password Request";
    const body = [
      "Password request details:",
      `Full Name: ${passwordRequestForm.fullName}`,
      `Contact Number: ${passwordRequestForm.contactNumber}`,
      `Email Address: ${passwordRequestForm.emailAddress}`,
      "",
      "Comments:",
      passwordRequestForm.comments || "(none)",
    ].join("\n");

    if (typeof window !== "undefined") {
      window.location.href = `mailto:${PASSWORD_REQUEST_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
    closePasswordRequestModal();
  };

  const clearSimulationLeadInTimers = useCallback(() => {
    if (simulationLeadInTimeoutRef.current) {
      clearTimeout(simulationLeadInTimeoutRef.current);
      simulationLeadInTimeoutRef.current = null;
    }
    if (simulationCountdownIntervalRef.current) {
      clearInterval(simulationCountdownIntervalRef.current);
      simulationCountdownIntervalRef.current = null;
    }
  }, []);

  const formatSeconds = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  }, []);

  const playSoloNarratedClip = useCallback(async () => {
    const video = soloClipRef.current;
    const narration = soloNarrationRef.current;
    if (!video || !narration) return;
    video.pause();
    narration.pause();
    video.currentTime = 0;
    narration.currentTime = 0;
    try {
      await Promise.all([video.play(), narration.play()]);
      setIsSoloPlaying(true);
    } catch {
      setIsSoloPlaying(false);
    }
  }, []);

  const syncSoloNarrationOnVideoPlay = useCallback(async () => {
    const narration = soloNarrationRef.current;
    if (!narration || !narration.paused) return;
    try {
      await narration.play();
      setIsSoloPlaying(true);
    } catch {}
  }, []);

  const pauseSoloNarratedClip = useCallback(() => {
    [soloClipRef.current, soloNarrationRef.current]
      .filter(Boolean)
      .forEach((node) => node.pause());
    setIsSoloPlaying(false);
  }, []);

  const startTimedSimulationClip = useCallback(async () => {
    const video = inviteClipRef.current;
    const narration = simulationNarrationRef.current;
    if (!video || !narration) return;
    clearSimulationLeadInTimers();
    video.pause();
    narration.pause();
    video.currentTime = 0;
    narration.currentTime = 0;
    setSimulationHasVideoStarted(false);
    setIsSimulationWaitingForLeadIn(false);
    setSimulationLeadInCountdown(SIMULATION_VIDEO_LEAD_IN_SECONDS);
    try {
      await narration.play();
      setIsSimulationPlaying(true);
      setIsSimulationWaitingForLeadIn(true);
      simulationCountdownIntervalRef.current = setInterval(() => {
        setSimulationLeadInCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
      simulationLeadInTimeoutRef.current = setTimeout(async () => {
        clearSimulationLeadInTimers();
        try {
          await video.play();
          setIsSimulationWaitingForLeadIn(false);
          setSimulationLeadInCountdown(0);
        } catch {}
      }, SIMULATION_VIDEO_LEAD_IN_SECONDS * 1000);
    } catch {
      setIsSimulationPlaying(false);
      setIsSimulationWaitingForLeadIn(false);
      clearSimulationLeadInTimers();
    }
  }, [clearSimulationLeadInTimers]);

  const syncSimulationNarrationOnVideoPlay = useCallback(async () => {
    const narration = simulationNarrationRef.current;
    clearSimulationLeadInTimers();
    setSimulationHasVideoStarted(true);
    setIsSimulationWaitingForLeadIn(false);
    setSimulationLeadInCountdown(0);
    if (!narration || !narration.paused) return;
    try {
      await narration.play();
    } catch {}
  }, [clearSimulationLeadInTimers]);

  const pauseTimedSimulationClip = useCallback(() => {
    clearSimulationLeadInTimers();
    [inviteClipRef.current, simulationNarrationRef.current]
      .filter(Boolean)
      .forEach((node) => node.pause());
    setIsSimulationPlaying(false);
    setIsSimulationWaitingForLeadIn(false);
    setSimulationHasVideoStarted(false);
    setSimulationLeadInCountdown(SIMULATION_VIDEO_LEAD_IN_SECONDS);
  }, [clearSimulationLeadInTimers]);

  const handleSimulationVideoPause = useCallback(() => {
    const narration = simulationNarrationRef.current;
    if (narration && !narration.paused) {
      setIsSimulationPlaying(true);
      return;
    }
    setIsSimulationPlaying(false);
  }, []);

  const handleSimulationVideoEnd = useCallback(() => {
    clearSimulationLeadInTimers();
    const video = inviteClipRef.current;
    const narration = simulationNarrationRef.current;
    if (video && narration && !narration.paused) {
      video.currentTime = 0;
      video
        .play()
        .then(() => {
          setIsSimulationPlaying(true);
          setSimulationHasVideoStarted(true);
        })
        .catch(() => {});
      return;
    }
    setSimulationHasVideoStarted(false);
    setIsSimulationWaitingForLeadIn(false);
    setIsSimulationPlaying(Boolean(narration && !narration.paused));
  }, [clearSimulationLeadInTimers]);

  const openImageLightbox = useCallback((src, alt) => {
    if (!src) return;
    setMediaLightbox({
      type: "image",
      src,
      alt: alt || "Investor media",
    });
  }, []);

  const openChartLightbox = useCallback((chartKey) => {
    if (!chartKey) return;
    setMediaLightbox({
      type: "chart",
      chartKey,
    });
  }, []);

  const closeMediaLightbox = useCallback(() => {
    setMediaLightbox(null);
  }, []);

  const handleLandingMediaClick = useCallback(
    (event) => {
      const chartTarget = event.target.closest("[data-chart-enlarge]");
      if (chartTarget) {
        openChartLightbox(chartTarget.getAttribute("data-chart-enlarge"));
        return;
      }

      const imageTarget = event.target.closest(".investorMediaCard img");
      if (imageTarget) {
        openImageLightbox(imageTarget.currentSrc || imageTarget.src, imageTarget.alt);
      }
    },
    [openChartLightbox, openImageLightbox],
  );

  useEffect(() => {
    if (!mediaLightbox) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeMediaLightbox();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mediaLightbox, closeMediaLightbox]);

  useEffect(() => {
    return () => {
      clearSimulationLeadInTimers();
    };
  }, [clearSimulationLeadInTimers]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const readRoute = () => {
      const normalizedPath = decodeURIComponent(window.location.pathname || "/")
        .toLowerCase()
        .replace(/\s+/g, "-");
      if (normalizedPath.includes("/sign-up") || normalizedPath.includes("/signup")) {
        return { view: "auth", intent: "signin" };
      }
      if (normalizedPath.includes("/verify-email")) {
        return { view: "verify", intent: "signin" };
      }
      if (normalizedPath.includes("/sign-in") || normalizedPath.includes("/signin")) {
        return { view: "auth", intent: "signin" };
      }
      if (normalizedPath.includes("/simulator")) {
        return { view: "simulator", intent: "signin" };
      }
      return { view: "landing", intent: "signin" };
    };

    const applyRoute = (replace = false) => {
      const route = readRoute();
      if (!isLoggedIn) {
        setPublicView(
          route.view === "auth" || route.view === "verify" ? route.view : "landing",
        );
        setAuthIntent(route.intent);
        if (route.view === "simulator") {
          openAuthScreen();
          return;
        }
        if (replace && route.view === "landing") pushPath(LANDING_PATH, true);
        return;
      }

      if (route.view === "landing" || route.view === "auth") {
        setShowLandingPage(true);
        setFlowStage("app");
        if (route.view === "auth") pushPath(LANDING_PATH, true);
        return;
      }

      setShowLandingPage(false);
      setFlowStage("app");
      if (replace && route.view !== "simulator") pushPath(SIMULATOR_PATH, true);
    };

    applyRoute(true);
    const onPopState = () => applyRoute(false);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isLoggedIn]);

  useEffect(() => {
    if (publicView !== "verify") return;
    if (typeof window === "undefined") return;
    let cancelled = false;

    const run = async () => {
      const query = new URLSearchParams(window.location.search);
      const token = query.get("token");
      if (!token) {
        setVerificationStatus("Verification link is missing a token.");
        return;
      }

      const remote = await verifyEmailRemote({ token });
      if (!cancelled && remote.ok) {
        const verifiedEmail = remote.data?.email || "your account";
        setPendingVerification(null);
        setVerificationStatus(`Email verified for ${verifiedEmail}. You can sign in now.`);
        setAuthNotice(`Email verified for ${verifiedEmail}. Please sign in.`);
        setPublicView("auth");
        setAuthIntent("signin");
        pushPath(SIGN_IN_PATH, true);
        return;
      }

      const users = readRegisteredUsers();
      const userToVerify = users.find(
        (user) => String(user.verificationToken || "") === token,
      );
      if (!userToVerify) {
        setVerificationStatus(
          remote.data?.message || "Verification link is invalid or expired.",
        );
        return;
      }

      if (!userToVerify.emailVerified) {
        const nextUsers = users.map((user) =>
          user.verificationToken === token
            ? {
                ...user,
                emailVerified: true,
                verificationToken: "",
              }
            : user,
        );
        setRegisteredUsers(nextUsers);
      }

      setPendingVerification(null);
      setVerificationStatus(`Email verified for ${userToVerify.email}. You can sign in now.`);
      setAuthNotice(`Email verified for ${userToVerify.email}. Please sign in.`);
      setPublicView("auth");
      setAuthIntent("signin");
      pushPath(SIGN_IN_PATH, true);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [publicView, SIGN_IN_PATH]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // AI session state
  const [session, setSession] = useState(() => createAIBrainSession());
  const [persona, setPersonaState] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null); // luxury storefront key
  const [messageLog, setMessageLog] = useState([]);
  const [walkthroughBrain, setWalkthroughBrain] = useState(null);
  const [requestedStoreKey, setRequestedStoreKey] = useState(null);
  const [walkDemoCommand, setWalkDemoCommand] = useState(null);
  const [coShopInviteSent, setCoShopInviteSent] = useState(false);
  const [coShopActive, setCoShopActive] = useState(false);
  const [coShopInviteEmail, setCoShopInviteEmail] = useState("");
  const [coShopInviteAccepted, setCoShopInviteAccepted] = useState(false);
  const [coShopJoinNotice, setCoShopJoinNotice] = useState("");
  const [demoCompletionNotice, setDemoCompletionNotice] = useState("");
  const [walkthroughInstanceKey, setWalkthroughInstanceKey] = useState(0);

  // ✅ storefront context when entering from walkthrough
  const [activeStorefront, setActiveStorefront] = useState(null); // {category,label,brand,aliases}

  // Walkthrough state
  const [walkLastEvent, setWalkLastEvent] = useState(null);

  // Demo runner
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoCountdown, setDemoCountdown] = useState(null);
  const [manualPlayMode, setManualPlayMode] = useState(true);
  const demoAbortRef = useRef(false);
  const demoRunLockRef = useRef(false);
  const demoCommandSeqRef = useRef(0);
  const [demoKey, setDemoKey] = useState(DEFAULT_DEMO_KEY);
  const promptedProductsRef = useRef(new Set());
  const handleDemoCommandHandled = useCallback(() => {
    setWalkDemoCommand(null);
  }, []);

  const cartCount = session.cart.length;
  const topStores = useMemo(
    () => getTopStores(session, 4).filter((s) => LUXURY_STORES.includes(s)).slice(0, 2),
    [session],
  );
  const topStoreLabels = useMemo(
    () => topStores.map((store) => formatStoreLabel(store)),
    [topStores],
  );
  const [stableTopStoreLabels, setStableTopStoreLabels] = useState([]);

  useEffect(() => {
    if (topStoreLabels.length) setStableTopStoreLabels(topStoreLabels);
  }, [topStoreLabels]);

  useEffect(() => {
    if (DEMO_SELECTOR_KEYS.includes(demoKey)) return;
    setDemoKey(DEFAULT_DEMO_KEY);
  }, [demoKey]);

  useEffect(() => {
    if (flowStage !== "brand_intro") return undefined;

    setShowBrandIntroMall(false);
    setIntroReadyToContinue(false);
    const dissolveTimer = window.setTimeout(() => {
      setShowBrandIntroMall(true);
    }, INTRO_STAGE_BLACK_MS);

    const readyTimer = window.setTimeout(() => {
      setIntroReadyToContinue(true);
    }, INTRO_STAGE_BLACK_MS + LANDING_INTRO_DISSOLVE_MS + INTRO_HOLD_MS);

    return () => {
      window.clearTimeout(dissolveTimer);
      window.clearTimeout(readyTimer);
    };
  }, [flowStage, INTRO_STAGE_BLACK_MS, LANDING_INTRO_DISSOLVE_MS, INTRO_HOLD_MS]);

  useEffect(() => {
    if (flowStage !== "brand_intro") return;
    if (!introReadyToContinue) return;
    setFlowStage("login");
    setPublicView("landing");
    setShowLandingPage(true);
    pushPath(LANDING_PATH);
  }, [flowStage, introReadyToContinue]);

  useEffect(() => {
    if (!showLandingMallTransition) return undefined;
    const timer = window.setTimeout(
      () => setShowLandingMallTransition(false),
      LANDING_INTRO_DISSOLVE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [showLandingMallTransition, LANDING_INTRO_DISSOLVE_MS]);

  useEffect(() => {
    return () => {
      if (authTransitionTimeoutRef.current) {
        window.clearTimeout(authTransitionTimeoutRef.current);
        authTransitionTimeoutRef.current = null;
      }
    };
  }, []);

  const displayTopStoreLabels = topStoreLabels.length
    ? topStoreLabels
    : stableTopStoreLabels;

  /** ✅ If activeStorefront is set, filter store catalog down to that shop’s products */
  const storeCatalog = useMemo(() => {
    if (!selectedStore) return [];
    const base = PRODUCT_CATALOG[selectedStore] || [];
    if (!activeStorefront) return base;
    if (activeStorefront.category !== selectedStore) return base;
    const filtered = base.filter((p) => matchesStorefront(p, activeStorefront));
    // If filtered is empty, fall back to base so the shop never looks “empty”
    return orderLuxuryProducts(
      selectedStore,
      filtered.length ? filtered : base,
    );
  }, [selectedStore, activeStorefront]);

  /** ✅ Same filter applied to recos */
  const recommendations = useMemo(() => {
    if (!selectedStore) return [];
    const base = getRecommendations(session, selectedStore, 6); // ask for more, then filter down
    if (!activeStorefront)
      return orderLuxuryProducts(selectedStore, base).slice(0, 3);
    if (activeStorefront.category !== selectedStore)
      return orderLuxuryProducts(selectedStore, base).slice(0, 3);
    const filtered = base.filter((p) => matchesStorefront(p, activeStorefront));
    return orderLuxuryProducts(selectedStore, filtered.length ? filtered : base).slice(
      0,
      3,
    );
  }, [session, selectedStore, activeStorefront]);

  const pushMessage = (text) => {
    const msg = { text, ts: Date.now() };
    setMessageLog((prev) => [...prev.slice(-18), msg]);
  };

  const issueWalkDemoCommand = (type, payload = {}) => {
    demoCommandSeqRef.current += 1;
    setWalkDemoCommand({
      id: demoCommandSeqRef.current,
      type,
      ...payload,
    });
  };

  useEffect(() => {
    promptedProductsRef.current = new Set();
  }, [selectedStore, session.personaId]);

  const emitProductInsight = (product, source = "catalog") => {
    if (!product || !selectedStore) return;

    const dedupeKey = `${session.personaId || "none"}|${selectedStore}|${product.sku}|${source}`;
    if (promptedProductsRef.current.has(dedupeKey)) return;
    promptedProductsRef.current.add(dedupeKey);

    const personaLabel = session.personaLabel || "Shopper";
    const budgetFit = budgetFitLabel(session, product.price);
    const bandLabel = priceBandLabelFor(product.price);
    const price = Number(product.price) || 0;

    const anchorMessage =
      source === "recommendation"
        ? `Elly: ${product.name} is a ${budgetFit} for ${personaLabel} in ${selectedStore}.`
        : `Elly: Scanning ${product.name} in ${selectedStore} -> ${budgetFit}.`;

    pushMessage(anchorMessage);

    if (bandLabel === "premium") {
      pushMessage(
        `Elly: Suggest pairing high-ticket alternatives near $${Math.max(180, price - 120)}-$${price + 180}.`,
      );
      return;
    }
    if (bandLabel === "mid-range") {
      pushMessage(
        `Elly: Suggest similar style options near $${Math.max(60, price - 40)}-$${price + 60}.`,
      );
      return;
    }
    pushMessage(
      `Elly: Suggest budget-friendly alternatives near $${Math.max(20, price - 20)}-$${price + 30}.`,
    );
  };

  const hardResetDemoState = () => {
    demoAbortRef.current = true;

    setPersonaState(null);
    setSelectedStore(null);
    setActiveStorefront(null);
    setRequestedStoreKey(null);
    setWalkDemoCommand(null);
    setSession(createAIBrainSession());
    setMessageLog([]);
    setWalkthroughBrain(null);
    setDemoRunning(false);
    setCoShopInviteSent(false);
    setCoShopActive(false);
    setCoShopInviteAccepted(false);
    setCoShopInviteEmail("");
    setCoShopJoinNotice("");
    setDemoCompletionNotice("");
    setWalkthroughInstanceKey(0);

    // walkthrough reset
    setWalkLastEvent(null);

    demoAbortRef.current = false;
  };

  const resetAccessFlow = () => {
    demoAbortRef.current = true;
    setIsLoggedIn(false);
    setPublicView("landing");
    setAuthIntent("signin");
    setScanAuthorized(false);
    setShowBrandIntroMall(false);
    setIntroReadyToContinue(false);
    setShowLandingMallTransition(false);
    setShowLandingPage(true);
    setFlowStage("brand_intro");
    setEmail("");
    setPassword("");
    setAuthNotice("");
    setVerificationStatus("");
    setPendingVerification(null);
    hardResetDemoState();
    setCoShopInviteSent(false);
    setCoShopActive(false);
    setCoShopInviteAccepted(false);
    setCoShopInviteEmail("");
    setCoShopJoinNotice("");
    setDemoCompletionNotice("");
    setWalkthroughInstanceKey(0);
    pushPath(LANDING_PATH);
  };

  const friendDisplayLabel = useMemo(() => {
    const inviteEmail = coShopInviteEmail.trim().toLowerCase();
    if (!inviteEmail) return "Remote Friend";
    const local = inviteEmail.split("@")[0] || "Friend";
    const cleaned = local
      .replace(/[._-]+/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return cleaned || "Remote Friend";
  }, [coShopInviteEmail]);

  const coShopSession = coShopInviteAccepted
    ? {
        scenarioKey: "invite_friend",
        scenarioLabel: "Invite-a-Friend Session",
        description:
          "Two remote shoppers are active in the same virtual mall session while dual Elly streams compare both users in parallel.",
        inviteEmail: coShopInviteEmail,
        primaryLabel: "Primary Shopper",
        friendLabel: friendDisplayLabel,
        friendVariant: "female",
        friendStatus: `Joined live via ${coShopInviteEmail}`,
      }
    : null;

  useEffect(() => {
    if (!coShopJoinNotice) return undefined;
    const timer = window.setTimeout(() => setCoShopJoinNotice(""), 3200);
    return () => window.clearTimeout(timer);
  }, [coShopJoinNotice]);

  useEffect(() => {
    if (!demoCompletionNotice) return undefined;
    const timer = window.setTimeout(() => setDemoCompletionNotice(""), 5200);
    return () => window.clearTimeout(timer);
  }, [demoCompletionNotice]);

  const handleSendInvite = (nextEmail = coShopInviteEmail) => {
    const inviteEmail = String(nextEmail || "").trim().toLowerCase();
    if (!inviteEmail) {
      pushMessage("Co-shop: Enter a friend email before sending an invite.");
      return;
    }

    const local = inviteEmail.split("@")[0] || "Friend";
    const nextFriendLabel =
      local
        .replace(/[._-]+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase()) || "Remote Friend";

    setCoShopInviteEmail(inviteEmail);
    setCoShopInviteSent(true);
    setCoShopInviteAccepted(true);
    setCoShopActive(true);
    setSelectedStore(null);
    setActiveStorefront(null);
    setRequestedStoreKey(null);
    setWalkDemoCommand(null);
    setWalkthroughInstanceKey((prev) => prev + 1);
    setCoShopJoinNotice(
      `${nextFriendLabel} accepted the invite. Reloading the simulator into shared shopping mode...`,
    );
    pushMessage(
      `Co-shop: Invite sent to ${inviteEmail}. Mock acceptance confirmed.`,
    );
    pushMessage(
      `Co-shop: ${nextFriendLabel} is joining the virtual mall from a remote location.`,
    );
    pushMessage(
      "AI Brain: Dual Elly mode active. Reloading the mall from the main spawn so both shoppers can browse together.",
    );
    pushMessage(
      "Elly: Each shopper now has an individual analysis stream while recommendation overlap is compared side by side.",
    );
  };

  // Optional D: Deterministic persona selection from scan seed
  const pickPersonaFromSeed = (seed) => {
    const s = String(seed || "");
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    const idx = PERSONAS?.length ? h % PERSONAS.length : 0;
    return PERSONAS?.[idx] || null;
  };

  const applyScanProfile = ({ seed } = {}) => {
    // reset everything (fresh identity)
    hardResetDemoState();

    const p = pickPersonaFromSeed(seed);

    // Build ONE session deterministically
    const nextSession = createAIBrainSession();
    if (p) setPersona(nextSession, p);

    setPersonaState(p);
    setSession(nextSession);

    // Boot narrative
    setMessageLog([]);
    pushMessage("Retina Scan: complete.");
    pushMessage("AI Brain: building shopper profile…");
    pushMessage(
      `AI Brain: Persona selected → ${p?.label || nextSession.personaLabel || "Shopper"}.`,
    );
    pushMessage("Elly: online. Personalization enabled.");
  };

  const completeStandardLogin = () => {
    hardResetDemoState();
    setIsLoggedIn(true);
    setPublicView("landing");
    setScanAuthorized(false);
    setShowLandingPage(false);
    setShowBrandIntroMall(false);
    setIntroReadyToContinue(false);
    setShowLandingMallTransition(false);
    setFlowStage("app");
    pushPath(SIMULATOR_PATH);
  };

  const buildVerificationLink = useCallback(
    (token) => {
      if (typeof window === "undefined" || !token) return "";
      const nextUrl = new URL(VERIFY_EMAIL_PATH, window.location.origin);
      nextUrl.searchParams.set("token", token);
      return nextUrl.toString();
    },
    [VERIFY_EMAIL_PATH],
  );

  const sendVerificationEmailDraft = useCallback(
    ({ targetEmail, token, verificationLink }) => {
      if (typeof window === "undefined" || !targetEmail) return;
      const verifyLink = verificationLink || buildVerificationLink(token);
      if (!verifyLink) return;
      const subject = encodeURIComponent("Verify your Elysium account");
      const body = encodeURIComponent(
        `Welcome to Elysium.\n\nPlease verify your email by opening this link:\n${verifyLink}\n\nIf you did not request this account, ignore this message.`,
      );
      window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
      setAuthNotice(`Verification email draft prepared for ${targetEmail}.`);
    },
    [buildVerificationLink],
  );

  const handleResendVerification = useCallback(async () => {
    if (!pendingVerification?.email) return;
    const remote = await resendVerificationRemote({
      email: pendingVerification.email,
    });

    if (remote.ok) {
      const nextToken = remote.data?.verificationToken || pendingVerification.token;
      const nextLink =
        remote.data?.verificationLink || buildVerificationLink(nextToken);
      setPendingVerification({
        email: pendingVerification.email,
        token: nextToken,
        verificationLink: nextLink,
      });
      sendVerificationEmailDraft({
        targetEmail: pendingVerification.email,
        token: nextToken,
        verificationLink: nextLink,
      });
      return;
    }

    // Offline fallback: still allow local/draft verification UX.
    sendVerificationEmailDraft({
      targetEmail: pendingVerification.email,
      token: pendingVerification.token,
      verificationLink: pendingVerification.verificationLink,
    });
  }, [
    pendingVerification,
    buildVerificationLink,
    sendVerificationEmailDraft,
  ]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setAuthNotice("");

    const normalizedEmail = normalizeEmail(email);
    const normalizedPassword = String(password || "").trim();

    if (normalizedEmail === DEMO_EMAIL && normalizedPassword === DEMO_PASS) {
      hardResetDemoState();
      setPublicView("auth");
      setScanAuthorized(true);
      setShowLandingPage(false);
      setShowBrandIntroMall(false);
      setIntroReadyToContinue(false);
      setFlowStage("scan");
      pushPath(SIMULATOR_PATH);
      return;
    }

    const remoteSignIn = await signinRemote({
      email: normalizedEmail,
      password: normalizedPassword,
    });

    if (remoteSignIn.ok) {
      if (remoteSignIn.data?.type === "demo") {
        hardResetDemoState();
        setPublicView("auth");
        setScanAuthorized(true);
        setShowLandingPage(false);
        setShowBrandIntroMall(false);
        setIntroReadyToContinue(false);
        setFlowStage("scan");
        pushPath(SIMULATOR_PATH);
        return;
      }
      completeStandardLogin();
      return;
    }

    if (!remoteSignIn.networkError) {
      if (remoteSignIn.data?.code === "EMAIL_NOT_VERIFIED") {
        setPendingVerification({
          email: remoteSignIn.data?.email || normalizedEmail,
          token: remoteSignIn.data?.verificationToken || "",
          verificationLink: remoteSignIn.data?.verificationLink || "",
        });
      }
      setError(remoteSignIn.data?.message || "Invalid credentials. Please try again.");
      return;
    }

    const existingUser = registeredUsers.find(
      (user) => normalizeEmail(user.email) === normalizedEmail,
    );
    if (!existingUser || existingUser.password !== normalizedPassword) {
      setError("Invalid credentials. Please try again.");
      return;
    }
    if (!existingUser.emailVerified) {
      setPendingVerification({
        email: existingUser.email,
        token: existingUser.verificationToken,
      });
      setError("Please verify your email before signing in.");
      return;
    }

    completeStandardLogin();
  };

  const completeRetinaScan = ({ seed } = {}) => {
    applyScanProfile({ seed });
    setScanAuthorized(false);
    setIsLoggedIn(true);
    setError("");
    setShowLandingPage(false);
    setFlowStage("app");
    pushPath(SIMULATOR_PATH);
  };

  const handleLogout = () => {
    resetAccessFlow();
  };

  const onSelectPersona = (p) => {
    setPersonaState(p);

    setSession((prev) => {
      const next = structuredClone(prev);
      setPersona(next, p);
      return next;
    });

    pushMessage(`AI Brain: Persona selected → ${p.label}.`);
    pushMessage(
      "AI Brain: Updating mall priorities based on predicted intent…",
    );
  };

  /**
   * ✅ Updated openStore:
   * - store = category key ("Fashion", "Electronics", etc)
   * - storefrontCtx optional (when entered via walkthrough)
   */
  const openStore = (store, storefrontCtx = null) => {
    setSelectedStore(store);
    setActiveStorefront(storefrontCtx);

    setSession((prev) => {
      const next = structuredClone(prev);
      logStoreView(next, store);
      return next;
    });

    if (storefrontCtx?.label) {
      pushMessage(`Virtual Mall: Entered storefront → ${storefrontCtx.label}.`);
      pushMessage(
        `AI Brain: Switching to ${store} inventory filtered for this shop…`,
      );
    } else {
      pushMessage(`AI Brain: Tracking behavior → viewed ${store}.`);
    }
    pushMessage("AI Brain: Generating recommendations in real time…");
  };

  const openSimulatorStore = (store) => {
    const simKey = STORE_TO_SIM_KEY[store];
    if (!simKey) return;

    setSelectedStore(store);
    setActiveStorefront(null);
    setRequestedStoreKey(simKey);

    setSession((prev) => {
      const next = structuredClone(prev);
      logStoreView(next, store);
      return next;
    });

    pushMessage(
      `Virtual Mall: Opening ${formatStoreLabel(store)} inside the simulator.`,
    );
    pushMessage("AI Brain: Loading storefront products in-sim…");
  };

  const addItemToCart = (product, source = "recommendation") => {
    setSession((prev) => {
      const next = structuredClone(prev);
      addToCart(next, product);
      return next;
    });

    if (source === "recommendation") {
      pushMessage(`AI Brain: Cart updated → ${product.name}.`);
      pushMessage(
        `Elly: Purchase intent increased after ${product.name} was added to cart.`,
      );
    } else {
      pushMessage(
        `AI Brain: Saved interest signal from catalog → ${product.name}.`,
      );
      pushMessage(
        `Elly: Catalog interaction logged for ${product.name}; recalculating preference fit.`,
      );
    }
    pushMessage(
      `AI Brain: Comparing ${product.name} against budget, emotion, and cross-store affinity.`,
    );
    pushMessage(
      `Elly: Refreshing follow-up recommendations using cart and dwell behavior.`,
    );
    emitProductInsight(product, source);
  };

  /**
   * Walkthrough event handler
   * - STORE_INTERACT now routes into the correct storefront (category + product filter)
   */
  const handleWalkthroughEvent = (e) => {
    if (!e?.type) return;

    setWalkLastEvent(e.type);

    if (e.type === "STORE_ZONE_ENTER") {
      pushMessage(`Virtual Mall: Passing ${e.storeLabel} storefront…`);
      pushMessage(
        `AI Brain: Store signal detected → evaluating ${e.storeLabel} for affinity uplift.`,
      );
      pushMessage(
        `Elly: Scanning storefront context, category fit, and prior session overlap for ${e.storeLabel}.`,
      );
      return;
    }

    if (e.type === "STORE_ZONE_EXIT") {
      pushMessage(`Virtual Mall: Leaving ${e.storeLabel} storefront…`);
      pushMessage(
        `AI Brain: Exit logged from ${e.storeLabel}; preserving visit data for retarget ranking.`,
      );
      pushMessage(
        `Elly: Rebalancing next-store suggestions after ${e.storeLabel} exit behavior.`,
      );
      return;
    }

    if (e.type === "STORE_INTERACT") {
      pushMessage(`Virtual Mall: Enter requested → ${e.storeLabel}.`);
      pushMessage(
        "AI Brain: Loading storefront products directly inside the simulator…",
      );
      pushMessage(
        `Elly: Searching ${e.storeLabel} inventory for strongest budget and style matches.`,
      );
      pushMessage(
        `AI Brain: Building in-store recommendation stack from dwell, persona, and purchase history.`,
      );

      const ctx = WALK_STORE_CONTEXT[e.storeKey];
      if (ctx?.category) {
        setSelectedStore(ctx.category);
        setActiveStorefront(ctx);
        pushMessage(
          `AI Brain: Routed to ${ctx.label} simulator overlay.`,
        );
        pushMessage(
          `Elly: Suggesting hero products for ${ctx.label} based on live shopper intent.`,
        );
      } else {
        pushMessage(
          "AI Brain: No storefront mapping found (check WALK_STORE_CONTEXT).",
        );
      }
      return;
    }

    if (e.type === "STORE_CART_ADD") {
      pushMessage(
        `Virtual Mall: ${e.productName} added to cart inside ${e.storeLabel}.`,
      );
      pushMessage(
        `AI Brain: Retina scan signal captured → ${e.retinaSignal || "elevated product emotion detected."}`,
      );
      pushMessage(
        `Elly: ${e.productName} triggered ${e.emotionTag || "strong purchase resonance"}; searching for similar products with matching fit confidence.`,
      );
      pushMessage(
        `AI Brain: Comparing ${e.productName} against past browsing, cart composition, and likely conversion path.`,
      );
      if (coShopActive) {
        pushMessage(
          `Elly: Dual-shopper mode active — primary and friend sessions are now syncing around ${e.productName}.`,
        );
      }
      return;
    }

    // Dwell / stop personalization trigger (all luxury storefronts)
    if (e.type === "AVATAR_STOPPED" && e.storeLabel) {
      pushMessage(`Virtual Mall: Avatar paused at ${e.storeLabel}.`);
      pushMessage(
        "AI Brain: Dwell signal detected → refreshing luxury recommendations.",
      );
      pushMessage(
        `Elly: Interpreting pause behavior at ${e.storeLabel} as elevated attention and deeper consideration.`,
      );
      pushMessage(
        `AI Brain: Re-ranking featured products inside ${e.storeLabel} using emotion, price fit, and category confidence.`,
      );
    }
  };

  // Demo Script Runner
  const runDemo = async () => {
    if (demoRunning || demoRunLockRef.current) return;
    demoRunLockRef.current = true;

    setDemoRunning(true);
    setManualPlayMode(false);
    demoAbortRef.current = false;
    const countdownStart = 5;
    setDemoCountdown(countdownStart);

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    // Fast reset without remounting the simulator to avoid a visible double reload.
    demoAbortRef.current = true;
    setSelectedStore(null);
    setActiveStorefront(null);
    setRequestedStoreKey(null);
    setWalkDemoCommand(null);
    setWalkLastEvent(null);
    setWalkthroughBrain(null);
    setMessageLog([]);
    setSession(createAIBrainSession());
    setPersonaState(null);
    setCoShopInviteSent(false);
    setCoShopActive(false);
    setCoShopInviteAccepted(false);
    setCoShopInviteEmail("");
    setCoShopJoinNotice("");
    setDemoCompletionNotice("");
    await sleep(60);
    demoAbortRef.current = false;

    for (let remaining = countdownStart; remaining >= 1; remaining -= 1) {
      if (demoAbortRef.current) break;
      setDemoCountdown(remaining);
      pushMessage(`Simulator starts in ${remaining}…`);
      await sleep(1000);
    }

    setDemoCountdown(null);
    if (demoAbortRef.current) {
      setDemoRunning(false);
      setManualPlayMode(true);
      demoRunLockRef.current = false;
      return;
    }

    let localSession = createAIBrainSession();
    let localPersona = null;
    let localStore = null;
    const storeVisitCounts = {};
    const plannedSelectionByStore = {};

    setSession(localSession);
    setPersonaState(null);
    setSelectedStore(null);
    setActiveStorefront(null);
    setMessageLog([]);
    setDemoCompletionNotice("");

    // walkthrough reset
    setWalkLastEvent(null);

    await sleep(250);

    const selectedScriptKey = DEMO_SELECTOR_KEYS.includes(demoKey)
      ? demoKey
      : DEFAULT_DEMO_KEY;
    const selectedScript = DEMO_SCRIPTS[selectedScriptKey] || DEMO_SCRIPTS[DEFAULT_DEMO_KEY];
    const isInviteFriendScenario = selectedScriptKey === "auto_social_coshop_tour";
    const steps = selectedScript?.steps || [];

    try {
      pushMessage(
        `Simulator Script: Starting ${selectedScript?.label || "luxury walkthrough"}…`,
      );
      await sleep(600);

      for (const step of steps) {
        if (demoAbortRef.current) break;

        if (step.type === "message") {
          pushMessage(step.text);
          await sleep(step.ms ?? 850);
          continue;
        }

        if (step.type === "persona") {
          const p = PERSONAS.find((x) => x.id === step.personaId);
          if (p) {
            localPersona = p;
            localSession = structuredClone(localSession);
            setPersona(localSession, p);

            setPersonaState(p);
            setSession(localSession);

            pushMessage(`AI Brain: Persona selected → ${p.label}.`);
            pushMessage(
              "AI Brain: Updating mall priorities based on predicted intent…",
            );
          }
          await sleep(step.ms ?? 1100);
          continue;
        }

        if (step.type === "walk") {
          const storeLabel = formatStoreLabel(step.store);
          setWalkLastEvent(`USER_SIMULATOR: Walking to ${storeLabel}`);
          pushMessage(`Virtual Mall: User simulator walking toward ${storeLabel}.`);
          pushMessage(
            "AI Brain: Tracking gait, dwell direction, and route intent while approaching the next storefront.",
          );
          await sleep(step.ms ?? 950);
          continue;
        }

        if (step.type === "invite_prompt") {
          setWalkLastEvent("USER_SIMULATOR: Invite prompt displayed");
          issueWalkDemoCommand("OPEN_INVITE");
          pushMessage("Co-shop: Invite prompt opened in the simulator.");
          pushMessage(
            "AI Brain: Social mode available. Invite a second shopper to compare intent in parallel.",
          );
          await sleep(step.ms ?? 1200);
          continue;
        }

        if (step.type === "invite_send") {
          const inviteEmail = String(step.email || "friend@elysiummock.com").toLowerCase();
          handleSendInvite(inviteEmail);
          issueWalkDemoCommand("CLOSE_INVITE");
          setWalkLastEvent(`USER_SIMULATOR: Invite sent to ${inviteEmail}`);
          await sleep(step.ms ?? 1300);
          continue;
        }

        if (step.type === "live_interaction") {
          const prompts = Array.isArray(step.prompts) ? step.prompts.filter(Boolean).slice(0, 4) : [];
          issueWalkDemoCommand("NAVIGATE_TO_LIVE_USER", {
            userIndex: Number(step.userIndex) || 0,
          });
          await sleep(2200);
          if (prompts.length) {
            issueWalkDemoCommand("LIVE_INTERACTION", {
              prompts,
              durationMs: step.durationMs || 5600,
              userIndex: Number(step.userIndex) || 0,
            });
            prompts.forEach((line) => pushMessage(line));
          }
          await sleep(step.ms ?? 1400);
          continue;
        }

        if (step.type === "store") {
          localStore = step.store;
          storeVisitCounts[step.store] = (storeVisitCounts[step.store] || 0) + 1;
          const storeLabel = formatStoreLabel(step.store);
          const simKey = STORE_TO_SIM_KEY[step.store];

          localSession = structuredClone(localSession);
          logStoreView(localSession, step.store);

          setSelectedStore(step.store);
          setActiveStorefront(null);
          setRequestedStoreKey(simKey || null);
          setWalkLastEvent(`USER_SIMULATOR: ${storeLabel}`);
          setSession(localSession);

          const storeCycle = Math.max(0, (storeVisitCounts[step.store] || 1) - 1);
          const previewRecos = getRecommendations(localSession, step.store, 4);
          const previewSelection = pickDemoSelection({
            store: step.store,
            recos: previewRecos,
            personaId: localPersona?.id || "fashion",
            session: localSession,
            cycle: storeCycle,
          });
          plannedSelectionByStore[step.store] = previewSelection || null;

          if (simKey && previewSelection?.product) {
            issueWalkDemoCommand("SET_STORE_SUGGESTION", {
              storeKey: simKey,
              productName: previewSelection.product.name || null,
              productSku: previewSelection.product.sku || null,
              productId: previewSelection.product.id || null,
              color: previewSelection.color,
              sizeProfile: previewSelection.sizeProfile,
              reason: `${storeLabel}: ${previewSelection.product.name} pre-ranked from prior purchases, retina behavior, and ${previewSelection.color} preference.`,
            });
          }

          if (simKey) {
            issueWalkDemoCommand("NAVIGATE_TO_STORE", {
              storeKey: simKey,
              mode: "hud",
            });
          }
          pushMessage(`Virtual Mall: User simulator focused on ${storeLabel}.`);
          pushMessage("Virtual Mall: Pausing at hologram cards to review Elly suggestions.");
          await sleep(5000);

          if (simKey) {
            issueWalkDemoCommand("NAVIGATE_TO_STORE", {
              storeKey: simKey,
              mode: "entry",
            });
          }
          pushMessage("Virtual Mall: Approaching storefront entry point.");
          await sleep(1850);

          if (simKey) {
            issueWalkDemoCommand("OPEN_STORE", { storeKey: simKey });
          }
          pushMessage(
            "Virtual Mall: Entered storefront and loaded product overlay in-sim.",
          );
          pushMessage(`AI Brain: Tracking behavior → viewed ${storeLabel}.`);
          pushMessage("AI Brain: Generating recommendations in real time…");

          await sleep(step.ms ?? 1400);
          continue;
        }

        if (step.type === "add_top_reco") {
          if (!localStore) {
            await sleep(step.ms ?? 650);
            continue;
          }

          const pickCount = Math.max(1, Number(step.count) || 1);
          const recos = getRecommendations(localSession, localStore, Math.max(6, pickCount + 2));
          const storeKey = simKeyForStore(localStore);
          const storeCycle = Math.max(0, (storeVisitCounts[localStore] || 1) - 1);

          for (let i = 0; i < pickCount; i += 1) {
            const selection =
              plannedSelectionByStore[localStore] ||
              pickDemoSelection({
                store: localStore,
                recos,
                personaId: localPersona?.id || "fashion",
                session: localSession,
                cycle: storeCycle + i,
              });
            const pick = selection?.product;
            if (!pick || !selection) continue;

            localSession = structuredClone(localSession);
            addToCart(localSession, pick);
            setSession(localSession);
            pushMessage(`AI Brain: Cart updated → ${pick.name}.`);
            const reason = `${formatStoreLabel(localStore)}: ${pick.name} selected from purchase history, retina response, preferred ${selection.color} palette, and ${selection.sizeProfile}.`;
            pushMessage(
              `Elly: Selected ${pick.name} (${selection.color}) using prior purchases, brand affinity, and retina confidence signals.`,
            );
            if (isInviteFriendScenario) {
              pushMessage(
                `Elly Co-Shop: Consensus pick locked for both shoppers at ${formatStoreLabel(localStore)} after overlap analysis.`,
              );
            }
            pushMessage(
              `Elly: Size profile forecast ${selection.sizeProfile} with high fit confidence for this shopper.`,
            );

            if (storeKey) {
              issueWalkDemoCommand("ADD_PRODUCT", {
                storeKey,
                productId: pick.id || null,
                productName: pick.name || null,
                productSku: pick.sku || null,
                color: selection.color,
                sizeProfile: selection.sizeProfile,
                reason,
              });
            }
            await sleep(2400);
          }

          plannedSelectionByStore[localStore] = null;

          await sleep(step.ms ?? 2200);
          continue;
        }

        if (step.type === "complete") {
          issueWalkDemoCommand("COMPLETE_DEMO");
          setWalkLastEvent("USER_SIMULATOR: Simulator complete - checkout summary ready");
          setDemoCompletionNotice(
            coShopActive
              ? "Auto social simulation complete: both shoppers visited all storefronts and reached checkout summary."
              : "Auto solo simulation complete: shopper visited all storefronts and reached checkout summary.",
          );
          pushMessage("Virtual Mall: Simulation complete. Final cart summary and checkout state ready.");
          pushMessage("AI Brain: End-of-session recap generated for investor review.");
          if (localSession.cart.length) {
            localSession.cart.forEach((item) => {
              pushMessage(
                `Elly Conclusion: ${item.name} (${item.brand || "luxury store"}) recommended from purchase history + retina response + fit-confidence modeling.`,
              );
            });
          }
          await sleep(step.ms ?? 1200);
          continue;
        }
      }

      await sleep(500);
      pushMessage(
        `Simulator Script: Finished ${selectedScript?.label || "luxury walkthrough"}. (${localPersona?.label || localSession?.personaLabel || "Persona"} session)`,
      );
    } finally {
      setDemoRunning(false);
      setManualPlayMode(true);
      demoRunLockRef.current = false;
    }
  };

  const stopDemo = () => {
    demoAbortRef.current = true;
    demoRunLockRef.current = false;
    setDemoCountdown(null);
    setManualPlayMode(true);
    pushMessage("Simulator Script: Stopped. Manual play is now active.");
    setDemoRunning(false);
  };

  const resetDemo = (silent = false) => {
    demoAbortRef.current = true;
    demoRunLockRef.current = false;
    setDemoRunning(false);
    setManualPlayMode(true);
    setSelectedStore(null);
    setActiveStorefront(null);
    setRequestedStoreKey(null);
    setWalkDemoCommand(null);
    setWalkLastEvent(null);
    setWalkthroughBrain(null);
    setMessageLog([]);
    setSession(createAIBrainSession());
    setPersonaState(null);
    setCoShopInviteSent(false);
    setCoShopActive(false);
    setCoShopInviteAccepted(false);
    setCoShopInviteEmail("");
    setCoShopJoinNotice("");
    setDemoCompletionNotice("");
    setWalkthroughInstanceKey((prev) => prev + 1);
    setDemoCountdown(null);
    demoAbortRef.current = false;
    if (!silent) {
      pushMessage("Simulator reset: simulator homed to start and ready for a fresh run.");
    }
  };

  const switchToManualPlay = () => {
    if (demoRunning) {
      stopDemo();
      return;
    }
    setManualPlayMode(true);
    pushMessage(
      "Manual Play: You can now control movement, invites, storefront entry, and cart actions directly.",
    );
  };

  useEffect(() => {
    if (!isLoggedIn) demoAbortRef.current = true;
  }, [isLoggedIn]);

  const showPublicLanding = !isLoggedIn ? publicView === "landing" : showLandingPage;
  const showAuthScreen = !isLoggedIn && publicView === "auth";
  const showVerifyScreen = !isLoggedIn && publicView === "verify";
  const isFullPageStage = flowStage === "brand_intro" || showPublicLanding;
  const introTransitionActive =
    flowStage === "brand_intro" && showBrandIntroMall && !introReadyToContinue;

  useEffect(() => {
    if (!showPublicLanding || typeof window === "undefined") return undefined;

    const chartBlocks = Array.from(
      document.querySelectorAll("[data-chart-enlarge]"),
    );
    if (!chartBlocks.length) return undefined;

    let rafId = null;
    let pollId = null;

    const updateChartVisibility = () => {
      const viewportH = window.innerHeight || 0;
      chartBlocks.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const isVisible = rect.top < viewportH * 0.9 && rect.bottom > viewportH * 0.12;
        node.classList.toggle("is-chart-visible", isVisible);
      });
    };

    const queueUpdate = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        updateChartVisibility();
      });
    };

    updateChartVisibility();
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);
    pollId = window.setInterval(updateChartVisibility, 450);

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      if (pollId !== null) window.clearInterval(pollId);
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
    };
  }, [showPublicLanding]);

  if (ndaStatus === "rejected") {
    return (
      <div className="app appFull">
        <main className="ndaBlockedWrap">
          <section className="ndaBlockedCard">
            <p className="ndaBlockedKicker">Access Restricted</p>
            <h1>Unable to Continue</h1>
            <p>
              Access is restricted because the NDA terms and conditions were rejected.
            </p>
            <button className="officialGetStarted officialGetStartedSmall" type="button" onClick={() => setNdaStatus("pending")}>
              Review NDA Again
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className={`app ${isFullPageStage ? "appFull" : ""}`}>
      {showLandingMallTransition ? (
        <div className="officialLandingMallFade" aria-hidden="true">
          <div className="officialLandingMallFadeScene" />
        </div>
      ) : null}
      {flowStage === "brand_intro" ? (
        <div
          className={`brandIntro ${introReadyToContinue ? "brandIntroReady" : ""} ${introTransitionActive ? "brandIntroFizzleOn" : ""}`}
          aria-live="polite"
        >
          <div className={`brandIntroLayer ${showBrandIntroMall ? "isHidden" : ""}`}>
            <div className="brandIntroBlack" />
          </div>
          <div className={`brandIntroLayer ${showBrandIntroMall ? "isVisible" : ""}`}>
            <div className="brandIntroMall" />
            {showBrandIntroMall ? (
              <p className="brandIntroTagline">The Future Of Digital Commerce</p>
            ) : null}
          </div>
          <div className="brandIntroFizzle" aria-hidden="true" />
        </div>
      ) : flowStage === "scan" && scanAuthorized && !isLoggedIn ? (
        <RetinaScan
          onComplete={completeRetinaScan}
          autoStart
          hidePasswordOption
        />
      ) : showVerifyScreen ? (
        <div className="loginWrap">
          <div className="loginBox">
            <h1>Verify your email</h1>
            <p>
              {verificationStatus ||
                "Checking your verification link. If this takes too long, return to sign in and request another verification email draft."}
            </p>
            <div className="authActions">
              <button
                className="btn primary"
                type="button"
                onClick={openAuthScreen}
              >
                Go to Sign In
              </button>
              <button className="btn" type="button" onClick={openPublicLanding}>
                Back to Landing
              </button>
            </div>
          </div>
        </div>
      ) : showAuthScreen ? (
        <div className="loginWrap">
          <div className="loginBox">
            <h1>Investor Sign In</h1>
            <p>Sign in to continue to the private simulator.</p>

            <form onSubmit={handleAuthSubmit}>
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  placeholder="name@company.com"
                  required
                  autoComplete="username"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>

              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  placeholder="Enter investor password"
                  required
                  autoComplete="current-password"
                />
              </div>

              {error ? <div className="error">{error}</div> : null}
              {authNotice ? <div className="notice">{authNotice}</div> : null}

              <div className="authActions">
                <button className="btn primary" type="submit">
                  Sign In
                </button>
                <button className="btn" type="button" onClick={toggleTheme}>
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
                <button className="btn" type="button" onClick={openPublicLanding}>
                  Back to Landing
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : showPublicLanding ? (
        <div id="home" className="officialLanding">
          <header className="officialHeader">
            <div className="officialHeaderInner">
              <nav className="officialNavLinks" aria-label="Primary">
                <a href="#home" className="officialNavItem">Home</a>
                <div className="officialNavDropdown">
                  <a className="officialNavItem officialNavItemBtn" href="#overview-summary">
                    Overview
                  </a>
                  <div className="officialNavMenu">
                    <a href="#overview-summary">Summary</a>
                    <a href="#problem-solution">Problem + Solution</a>
                    <a href="#elysium-market-solution">Elysium Market Solutions</a>
                  </div>
                </div>
                <div className="officialNavDropdown">
                  <a className="officialNavItem officialNavItemBtn" href="#elysium-market-solution">
                    AI Brain/SmartMall
                  </a>
                  <div className="officialNavMenu">
                    <a href="#social-media">Social Media</a>
                    <a href="#ai-brain-system">AI Brain</a>
                    <a href="#avatar-experience">Advanced Avatar</a>
                  </div>
                </div>
                <div className="officialNavDropdown">
                  <a className="officialNavItem officialNavItemBtn" href="#growth-plan">
                    Market Plan/Contract
                  </a>
                  <div className="officialNavMenu">
                    <a href="#growth-plan">Plan Summary</a>
                    <a href="#market-contracts">Contracts</a>
                    <a href="#rollout-financials">Rollout Plan</a>
                  </div>
                </div>
                <div className="officialNavDropdown">
                  <a className="officialNavItem officialNavItemBtn" href="#financial-projections">
                    Financials/IPO
                  </a>
                  <div className="officialNavMenu">
                    <a href="#financial-projections">Financial Projections</a>
                    <a href="#financial-ipo">Budget + Assumptions</a>
                    <a href="#ipo-pathway">IPO Pathway</a>
                  </div>
                </div>
                <div className="officialNavDropdown">
                  <a className="officialNavItem officialNavItemBtn" href="#capital-plan">
                    Capitalization/Investors
                  </a>
                  <div className="officialNavMenu">
                    <a href="#capital-overview">Capitalization Overview</a>
                    <a href="#draft-cap-tables">Draft Cap Tables</a>
                    <a href="#capital-raise-pre-ipo">Capital Raise Pre-IPO</a>
                  </div>
                </div>
                <div className="officialNavDropdown">
                  <a className="officialNavItem officialNavItemBtn" href="#management-team">
                    Management Team
                  </a>
                  <div className="officialNavMenu">
                    <a href="#leadership">Leadership</a>
                    <a href="#management-team">Management Team</a>
                  </div>
                </div>
                <a href="#contact-review" className="officialNavItem">Contact Us</a>
              </nav>
              <div
                id="official-mobile-nav-panel"
                className={`officialMobileNavPanel ${isMobileNavOpen ? "isOpen" : ""}`}
                aria-label="Mobile Navigation"
              >
                <a href="#home" className="officialMobileNavLink" onClick={() => setIsMobileNavOpen(false)}>
                  Home
                </a>
                <div className="officialMobileNavGroup">
                  <a href="#overview-summary" className="officialMobileNavGroupTitle" onClick={() => setIsMobileNavOpen(false)}>
                    Overview
                  </a>
                  <a href="#overview-summary" className="officialMobileNavLink" onClick={() => setIsMobileNavOpen(false)}>
                    Summary
                  </a>
                  <a href="#problem-solution" className="officialMobileNavLink" onClick={() => setIsMobileNavOpen(false)}>
                    Problem + Solution
                  </a>
                  <a href="#elysium-market-solution" className="officialMobileNavLink" onClick={() => setIsMobileNavOpen(false)}>
                    Elysium Market Solutions
                  </a>
                </div>
                <div className="officialMobileNavGroup">
                  <a href="#elysium-market-solution" className="officialMobileNavGroupTitle" onClick={() => setIsMobileNavOpen(false)}>
                    AI Brain/SmartMall
                  </a>
                  <a href="#social-media" className="officialMobileNavLink" onClick={() => setIsMobileNavOpen(false)}>
                    Social Media
                  </a>
                  <a href="#ai-brain-system" className="officialMobileNavLink" onClick={() => setIsMobileNavOpen(false)}>
                    AI Brain
                  </a>
                  <a href="#avatar-experience" className="officialMobileNavLink" onClick={() => setIsMobileNavOpen(false)}>
                    Advanced Avatar
                  </a>
                </div>
                <div className="officialMobileNavGroup">
                  <a href="#growth-plan" className="officialMobileNavGroupTitle" onClick={() => setIsMobileNavOpen(false)}>
                    Market Plan/Contract
                  </a>
                  <a href="#growth-plan" className="officialMobileNavLink" onClick={() => setIsMobileNavOpen(false)}>
                    Plan Summary
                  </a>
                  <a href="#market-contracts" className="officialMobileNavLink" onClick={() => setIsMobileNavOpen(false)}>
                    Contracts
                  </a>
                  <a href="#rollout-financials" className="officialMobileNavLink" onClick={() => setIsMobileNavOpen(false)}>
                    Rollout Plan
                  </a>
                </div>
                <div className="officialMobileNavGroup">
                  <a href="#financial-projections" className="officialMobileNavGroupTitle" onClick={() => setIsMobileNavOpen(false)}>
                    Financials/IPO
                  </a>
                  <a href="#financial-projections" className="officialMobileNavLink" onClick={() => setIsMobileNavOpen(false)}>
                    Financial Projections
                  </a>
                  <a href="#financial-ipo" className="officialMobileNavLink" onClick={() => setIsMobileNavOpen(false)}>
                    Budget + Assumptions
                  </a>
                  <a href="#ipo-pathway" className="officialMobileNavLink" onClick={() => setIsMobileNavOpen(false)}>
                    IPO Pathway
                  </a>
                </div>
                <div className="officialMobileNavGroup">
                  <a href="#capital-plan" className="officialMobileNavGroupTitle" onClick={() => setIsMobileNavOpen(false)}>
                    Capitalization/Investors
                  </a>
                  <a href="#capital-overview" className="officialMobileNavLink" onClick={() => setIsMobileNavOpen(false)}>
                    Capitalization Overview
                  </a>
                  <a href="#draft-cap-tables" className="officialMobileNavLink" onClick={() => setIsMobileNavOpen(false)}>
                    Draft Cap Tables
                  </a>
                  <a href="#capital-raise-pre-ipo" className="officialMobileNavLink" onClick={() => setIsMobileNavOpen(false)}>
                    Capital Raise Pre-IPO
                  </a>
                </div>
                <div className="officialMobileNavGroup">
                  <a href="#management-team" className="officialMobileNavGroupTitle" onClick={() => setIsMobileNavOpen(false)}>
                    Management Team
                  </a>
                  <a href="#leadership" className="officialMobileNavLink" onClick={() => setIsMobileNavOpen(false)}>
                    Leadership
                  </a>
                  <a href="#management-team" className="officialMobileNavLink" onClick={() => setIsMobileNavOpen(false)}>
                    Management Team
                  </a>
                </div>
                <a href="#contact-review" className="officialMobileNavLink" onClick={() => setIsMobileNavOpen(false)}>
                  Contact Us
                </a>
              </div>
              <div className="officialNavAuth">
                <a className="officialAuthBtn officialNavJumpBtn" href="#ai-brain-system">
                  Simulation Videos
                </a>
                <div className="officialPasswordRequestWrap">
                  <button
                    className="officialAuthBtn officialPasswordRequestBtn"
                    type="button"
                    onClick={() => setShowPasswordRequestModal(true)}
                  >
                    REQUEST PASSWORD
                  </button>
                  <span className="officialPasswordHint">Requires Password</span>
                </div>
                <button
                  className="officialMobileNavToggle"
                  type="button"
                  aria-expanded={isMobileNavOpen}
                  aria-controls="official-mobile-nav-panel"
                  aria-label={isMobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
                  onClick={() => setIsMobileNavOpen((prev) => !prev)}
                >
                  <span className="officialMobileNavDots" aria-hidden="true">⋯</span>
                  <span className="officialMobileNavLabel">{isMobileNavOpen ? "Close" : "Menu"}</span>
                </button>
              </div>
            </div>
          </header>

          <div className="officialCanvas" onClick={handleLandingMediaClick}>
            <section className="officialHero">
              <div className="officialHeroCopy">
                <h1>Welcome to Elysium</h1>
                <h2>The Future Of Digital Commerce</h2>
                <p>
                  Elysium combines AI-driven merchandising, immersive luxury
                  storefronts, and real-time shopper intelligence to deliver a
                  modern digital mall experience.
                </p>
                <div className="officialHeroActions">
                  <button
                    className="officialGetStarted"
                    type="button"
                    onClick={openSimulatorGate}
                  >
                    Open Simulator
                  </button>
                </div>
              </div>
              <div className="officialHeroVisual">
                <img
                  src="/Ellylogo2/LuxuryBagCutout1.png?v=20260326"
                  alt="Elysium brain-in-bag hero logo"
                />
              </div>
            </section>

            <section className="officialFeatureRow">
              <article className="officialFeatureCard">
                <div className="officialFeatureIcon">🛒</div>
                <div>
                  <h3>AI-Driven Shopping</h3>
                  <p>
                    Personalized recommendations adapt instantly to behavior,
                    intent, and live session context.
                  </p>
                </div>
              </article>
              <article className="officialFeatureCard officialFeatureCardMid">
                <div className="officialFeatureIcon">🛋️</div>
                <div>
                  <h3>Immersive Experiences</h3>
                  <p>
                    Walkthrough-ready virtual stores enable premium discovery,
                    co-shopping, and guided conversion journeys.
                  </p>
                </div>
              </article>
              <article className="officialFeatureCard">
                <div className="officialFeatureIcon">📈</div>
                <div>
                  <h3>Smart Analytics</h3>
                  <p>
                    Track engagement, product interest, and purchase signals
                    with actionable performance insights.
                  </p>
                </div>
              </article>
            </section>

            <section id="overview-summary" className="officialSection investorSection investorImmersionSection">
              <div className="investorImmersionGrid">
                <article className="investorImmersionCopy">
                  <div className="investorTagGroup investorImmersionTags">
                    <span>Virtual SmartMall</span>
                    <span>AI Brain</span>
                    <span>Social + ECommerce</span>
                    <span>AI-assisted mock</span>
                  </div>
                  <h2>Multi-Dimensional Immersion Into a Virtual Shopping Experience.</h2>
                  <p>
                    Elysium is envisioned as a virtual smart mall that blends social
                    interaction with commerce, powered by an AI Brain that learns from
                    word data, physical cues, and reactions to improve predictability by
                    analyzing a compilation of human variables.
                  </p>
                  <div className="investorImmersionActions">
                    <a className="reviewPrimaryBtn" href="#ai-brain-system">
                      See how the AI Brain works
                    </a>
                    <button
                      className="reviewSecondaryBtn"
                      type="button"
                      onClick={openSimulatorGate}
                    >
                      View the SmartMall experience ↗
                    </button>
                  </div>
                  <p className="investorImmersionPath">Open Simulator path: www.elysiummall.com/demo</p>
                  <div className="investorTagGroup investorImmersionTags">
                    <span>Personalized discovery</span>
                    <span>Avatar try-on concept</span>
                    <span>Lower Returns</span>
                    <span>Higher Conversion</span>
                  </div>
                </article>

                <article className="investorMediaCard investorImmersionVisual">
                  <img src="/illustrations/store3-red.png" alt="Digital storefront mock UI" />
                  <p>
                    <span>Digital Storefront (Mock UI)</span>
                    <span>View details</span>
                    <span>Open experience ↗</span>
                  </p>
                </article>
              </div>

              <div className="investorCards3 investorImmersionCards">
                <article className="investorInfoMiniCard">
                  <h3>Differentiation</h3>
                  <p>Moves beyond one-dimensional shopping by making discovery interactive, guided, and personalized.</p>
                </article>
                <article className="investorInfoMiniCard">
                  <h3>Social Commerce</h3>
                  <p>Shoppers can discover, share, and shop together without leaving the platform.</p>
                </article>
                <article className="investorInfoMiniCard">
                  <h3>Growth Story</h3>
                  <p>A clear roadmap aligned to revenue generation and expansion milestones.</p>
                </article>
              </div>
            </section>

            <section className="officialSection investorSection overviewSupportSection">
              <div className="overviewSupportGrid">
                <article className="investorListCard">
                  <h3>About Elysium</h3>
                  <p>
                    Elysium is building a premium digital mall where AI assistants, immersive storefronts, and merchant analytics work together in one platform.
                  </p>
                  <div className="overviewMiniGrid">
                    <article className="investorPointCard">
                      <h4>Our Mission</h4>
                      <p>Create a modern, intelligent commerce environment that helps shoppers discover faster and helps brands convert with confidence.</p>
                    </article>
                    <article className="investorPointCard">
                      <h4>What Makes Us Different</h4>
                      <p>Session-aware recommendations, co-shopping support, and walkthrough-ready luxury experiences built for measurable growth.</p>
                    </article>
                  </div>
                </article>
                <article className="investorListCard">
                  <h3>News And Updates</h3>
                  <p>Post news updates in window frames for investors and partners.</p>
                  <div className="overviewMiniGrid">
                    <article className="investorPointCard">
                      <h4>Window Frame 1</h4>
                      <p>Upcoming launch updates and strategic milestones.</p>
                    </article>
                    <article className="investorPointCard">
                      <h4>Window Frame 2</h4>
                      <p>Recent partnership and product announcements.</p>
                    </article>
                  </div>
                </article>
              </div>

              <article className="investorTakeawayCard">
                <p className="investorPointLabel">Open Simulator note (important)</p>
                <p>
                  The SmartMall simulator is a mock UI/experience created with AI assistance for presentation purposes. It is not production-grade and does not represent final rendering, physics, inventory, or full commerce logic yet.
                </p>
              </article>

              <div className="investorCards3">
                <article className="investorInfoMiniCard">
                  <p className="investorPointLabel">Positioning</p>
                  <h3>Virtual SmartMall</h3>
                  <p>Immersive commerce + social layer.</p>
                </article>
                <article className="investorInfoMiniCard">
                  <p className="investorPointLabel">Engine</p>
                  <h3>AI Brain</h3>
                  <p>Predictability + personalization.</p>
                </article>
                <article className="investorInfoMiniCard">
                  <p className="investorPointLabel">Outcome</p>
                  <h3>↑ Conversion / ↓ Returns</h3>
                  <p>Confidence drives performance.</p>
                </article>
              </div>

              <article className="investorListCard investorSocialCard">
                <h3>Services</h3>
                <p>Core offerings for digital mall operators, premium brands, and enterprise commerce teams.</p>
                <div className="overviewMiniGrid overviewMiniGridServices">
                  <article className="investorPointCard">
                    <h4>AI Merchandising</h4>
                    <p>Real-time product ranking and recommendation tuning based on active shopper behavior and intent signals.</p>
                  </article>
                  <article className="investorPointCard">
                    <h4>Immersive Storefronts</h4>
                    <p>Interactive virtual environments for premium discovery and collaborative shopping experiences.</p>
                  </article>
                  <article className="investorPointCard">
                    <h4>Performance Insights</h4>
                    <p>Actionable dashboards for engagement, product interest, and purchase outcomes across storefront touchpoints.</p>
                  </article>
                </div>
              </article>

            </section>

            <section id="investor-overview" className="officialSection investorSection">
              <div className="investorHeader">
                <p className="investorKicker">Investor Overview</p>
                <h2>Market Opportunity (Illustrative)</h2>
                <p>
                  Phase 2 replaces placeholders with validated TAM/SAM/SOM and wedge sizing.
                </p>
              </div>

              <div className="marketOpportunityWrap investorEnlargeableBlock" data-chart-enlarge="market-opportunity">
                <div className="marketOpportunityVisual" aria-hidden="true">
                  <div className="tamRing">
                    <div className="samRing">
                      <div className="somCore">SOM</div>
                    </div>
                    <span className="tamLabel">TAM</span>
                    <span className="samLabel">SAM</span>
                    <span className="somLabel">SOM</span>
                    <div className="wedgeSlice" />
                  </div>
                </div>

                <div className="marketOpportunityStats">
                  <div className="marketStatCard">
                    <strong>TAM</strong>
                    <span>Total Addressable Market · $ —</span>
                  </div>
                  <div className="marketStatCard">
                    <strong>SAM</strong>
                    <span>Serviceable Available Market · $ —</span>
                  </div>
                  <div className="marketStatCard">
                    <strong>SOM</strong>
                    <span>Serviceable Obtainable Market · $ — · First wedge segment</span>
                  </div>
                </div>
              </div>

              <article className="investorListCard investorSocialCard">
                <h3>Market Size And Timing</h3>
                <div className="investorTwoCol">
                  <article className="investorListCard">
                    <h3>What This Section Shows</h3>
                    <ul>
                      <li>Market framing combines global eCommerce and social media growth trajectories.</li>
                      <li>The thesis positions Elysium at the intersection of both expanding markets.</li>
                      <li>Deck language distinguishes this from narrow AI personalization approaches.</li>
                    </ul>
                    <div className="investorTakeawayCard">
                      <p className="investorPointLabel">INVESTOR TAKEAWAY</p>
                      <p>The opportunity case is tied to category convergence and projected market expansion.</p>
                    </div>
                  </article>
                  <article className="investorMediaCard investorSlideCard">
                    <img src="/Slide/page%2011.png" alt="Market size and timing slide" />
                    <p>Market size and timing source slide</p>
                  </article>
                </div>
                <div className="investorTwoCol">
                  <div className="capitalRightStack">
                    <article className="investorInfoMiniCard">
                      <p className="investorPointLabel">Global eCommerce (2023)</p>
                      <h3>$21.1T</h3>
                      <p>Slide 11 market context.</p>
                    </article>
                    <article className="investorInfoMiniCard">
                      <p className="investorPointLabel">Projected eCommerce (2032)</p>
                      <h3>$183.8T</h3>
                      <p>Source text from deck slide market assumptions.</p>
                    </article>
                    <article className="investorInfoMiniCard">
                      <p className="investorPointLabel">Social Media (2025)</p>
                      <h3>$286.53B</h3>
                      <p>Projected to $466.56B by 2029 in deck context.</p>
                    </article>
                  </div>
                  <article
                    className="investorListCard investorEnlargeableBlock"
                    data-chart-enlarge="market-size-context-bars"
                  >
                    <MarketSizeContextChartInvestor />
                    <p className="investorPointLabel">Converted from deck market values into native bar chart</p>
                  </article>
                </div>
              </article>

              <div className="investorPointsGrid">
                <article className="investorPointCard">
                  <p className="investorPointLabel">KEY POINT 1</p>
                  <p>Elysium is positioned as a multi-dimensional virtual SmartMall led by an AI Brain.</p>
                </article>
                <article className="investorPointCard">
                  <p className="investorPointLabel">KEY POINT 2</p>
                  <p>The concept combines commerce with social interaction to improve discovery and conversion.</p>
                </article>
                <article className="investorPointCard">
                  <p className="investorPointLabel">KEY POINT 3</p>
                  <p>The overview frames an execution plan supported by management and early investor backing.</p>
                </article>
              </div>

              <div className="investorTakeawayCard">
                <p className="investorPointLabel">INVESTOR TAKEAWAY</p>
                <p>
                  The opportunity is framed as a new category blend: social platform + ecommerce platform in one environment.
                </p>
              </div>
            </section>

            <section id="problem-solution" className="officialSection investorSection">
              <div className="investorSplitHeader">
                <div>
                  <p className="investorKicker">The Problem</p>
                  <h2>Digital Shopping Is Still Frustrating</h2>
                  <p>
                    Most online experiences are one-dimensional: search bars, static listings, and limited predictability.
                  </p>
                </div>
                <div className="investorTagGroup">
                  <span>High returns</span>
                  <span>Cart abandonment</span>
                  <span>Weak social layer</span>
                </div>
              </div>

              <div className="investorTwoCol">
                <article className="investorListCard">
                  <h3>Shopper Pain</h3>
                  <ul>
                    <li>Low confidence without try-on → higher return rates</li>
                    <li>Uncertainty causes cart abandonment</li>
                    <li>Shopping is isolated (not social)</li>
                  </ul>
                </article>
                <article className="investorListCard">
                  <h3>Vendor Pain</h3>
                  <ul>
                    <li>Exposure depends on paid marketing</li>
                    <li>Personalization is limited and shallow</li>
                    <li>Conversion suffers due to friction + uncertainty</li>
                  </ul>
                </article>
              </div>

              <div className="phaseFramingCard investorEnlargeableBlock" data-chart-enlarge="phase-framing">
                <h3>Phase 1 Framing</h3>
                <div className="phaseMeter">
                  <span>Returns driven by low confidence</span>
                  <div><i style={{ width: "78%" }} /></div>
                  <b>High</b>
                </div>
                <div className="phaseMeter">
                  <span>Discovery is search-bar driven</span>
                  <div><i style={{ width: "85%" }} /></div>
                  <b>Common</b>
                </div>
                <div className="phaseMeter">
                  <span>Social shopping is limited</span>
                  <div><i style={{ width: "68%" }} /></div>
                  <b>Gap</b>
                </div>
              </div>

              <div className="investorSplitHeader investorSplitHeaderSolution">
                <div>
                  <p className="investorKicker">The Solution</p>
                  <h2>A SmartMall That Feels Guided, Social, And Predictive</h2>
                  <p>
                    Elysium turns shopping into an interactive experience where AI improves predictability, boosts confidence, and reduces returns.
                  </p>
                </div>
                <div className="investorTagGroup">
                  <span>Interactive discovery</span>
                  <span>Real-time recs</span>
                  <span>Higher confidence</span>
                </div>
              </div>

              <div className="investorTwoCol">
                <article className="investorListCard">
                  <h3>What Changes For Shoppers</h3>
                  <ul>
                    <li>Guided discovery (voice/chat + experience), not just search</li>
                    <li>Try-on concept (avatar) to visualize before buying</li>
                    <li>Shop with friends inside the platform</li>
                  </ul>
                </article>
                <article className="investorListCard">
                  <h3>What Changes For Vendors</h3>
                  <ul>
                    <li>Better targeting via predictability engine</li>
                    <li>Higher Conversion through reduced friction</li>
                    <li>More consistent exposure via mall layout</li>
                  </ul>
                </article>
              </div>

            </section>

            <section id="elysium-market-solution" className="officialSection investorSection">
              <div className="investorCards3">
                <article className="investorInfoMiniCard">
                  <h3>Predictability</h3>
                  <p>The AI Brain learns over time and improves recommendation relevance.</p>
                </article>
                <article className="investorInfoMiniCard">
                  <h3>Lower Returns</h3>
                  <p>Try-on confidence reduces guesswork and post-purchase regret.</p>
                </article>
                <article className="investorInfoMiniCard">
                  <h3>Higher Conversion</h3>
                  <p>Social + guidance drives engagement and purchases.</p>
                </article>
              </div>

              <div className="investorSummaryBlock">
                <h2>Elysium Market Solutions</h2>
                <div className="investorPointsGrid">
                  <article className="investorPointCard">
                    <p className="investorPointLabel">KEY POINT 1</p>
                    <p>Current online shopping pain points include low predictability, limited interaction, and high return risk.</p>
                  </article>
                  <article className="investorPointCard">
                    <p className="investorPointLabel">KEY POINT 2</p>
                    <p>The SmartMall model introduces real-time shopper guidance, social interaction, and adaptive suggestions.</p>
                  </article>
                  <article className="investorPointCard">
                    <p className="investorPointLabel">KEY POINT 3</p>
                    <p>The solution narrative ties AI-driven assistance directly to reduced abandonment and improved satisfaction.</p>
                  </article>
                </div>
                <div className="investorTakeawayCard">
                  <p className="investorPointLabel">INVESTOR TAKEAWAY</p>
                  <p>The section argues that stronger shopper confidence can improve both conversion and vendor performance.</p>
                </div>
              </div>

              <div id="social-media" className="navAnchor" />
              <article className="investorListCard investorSocialCard">
                <h3>Social Media Experience</h3>
                <div className="investorTwoCol">
                  <article className="investorListCard">
                    <ul>
                      <li>Group shopping supports real-time visual and audio interaction inside the virtual mall.</li>
                      <li>AI suggestions adapt in real time based on shopper behavior and social interactions.</li>
                      <li>Bio-measurement and behavioral signals improve predictability across shopper groups.</li>
                      <li>Shoppers can share, record, and comment on shopping experiences as they happen.</li>
                    </ul>
                  </article>
                  <article className="investorMediaCard investorSlideCard">
                    <img src="/Slide/page%2019.png" alt="Social media experience slide from the PowerPoint deck" />
                    <p>Social media experience source slide</p>
                  </article>
                </div>
              </article>

            </section>

            <section id="ai-brain-system" className="officialSection investorSection">
              <div className="investorSplitHeader">
                <div>
                  <p className="investorKicker">System Narrative</p>
                  <h2>How The AI Brain Works</h2>
                  <p>
                    Multiple signal inputs → predictive intelligence → personalized outcomes.
                    Phase 2 replaces this mock with real system diagrams and governance.
                  </p>
                </div>
                <div className="investorTagGroup">
                  <span>Behavioral data</span>
                  <span>Optional physical variables</span>
                  <span>Security monitoring</span>
                </div>
              </div>

              <div className="investorAiSystemGrid">
                <div className="investorAiLeftCol">
                  <article className="investorMediaCard investorBrainHeroCard">
                    <img src="/illustrations/EllyBrain2.png" alt="Elly Brain hero render" />
                    <p>Elly Brain: hero render</p>
                  </article>

                  <div className="investorMediaTwin investorMediaTwinCompact">
                    <article className="investorMediaCard">
                      <img className="investorMediaContain" src="/illustrations/AI Dash.png" alt="Elly command panel live scan and ranking output" />
                      <p>Elly Command Panel: live scan + ranking output</p>
                    </article>
                    <article className="investorMediaCard">
                      <img className="investorMediaContain" src="/EllyBubbleReasoning.png" alt="Elly bubble reasoning view" />
                      <p>Elly Brain: bubble reasoning view</p>
                    </article>
                  </div>

                  <div className="investorCards3 investorCards3Compact">
                    <article className="investorInfoMiniCard">
                      <h3>Predictability</h3>
                      <p>Improves relevance by learning from behavior and context over time.</p>
                    </article>
                    <article className="investorInfoMiniCard">
                      <h3>Security Monitoring</h3>
                      <p>AI-supported monitoring helps protect shoppers and transactions.</p>
                    </article>
                    <article className="investorInfoMiniCard">
                      <h3>Multilingual</h3>
                      <p>Assistance can be presented in the shopper’s preferred language.</p>
                    </article>
                  </div>
                </div>

                <div className="investorAiRightCol">
                  <article className="investorListCard investorListCardTight">
                    <h3>Investor Takeaway</h3>
                    <ul>
                      <li>The AI Brain is the differentiator: predictability + personalization</li>
                      <li>Inputs: behavior, intent/context, social signals, optional physical variables (opt-in)</li>
                      <li>Outputs: conversion lift, lower returns, improved retention</li>
                    </ul>
                    <p className="investorPointLabel">Phase 2 upgrade: real architecture + governance diagram.</p>
                  </article>

                  <article className="investorVideoCard">
                    <h3>Original AI Brain Narrated Clip</h3>
                    <video
                      ref={soloClipRef}
                      src="/soloAIBrain.mp4"
                      preload="metadata"
                      controls
                      muted
                      playsInline
                      onCanPlay={() => setSoloClipReady(true)}
                      onPlay={syncSoloNarrationOnVideoPlay}
                      onPause={() => setIsSoloPlaying(false)}
                      onEnded={pauseSoloNarratedClip}
                    />
                    <div className="videoActionsRow">
                      <button className="officialGetStarted officialGetStartedSmall" type="button" onClick={playSoloNarratedClip}>
                        Play Narrated AI Brain
                      </button>
                      <button className="officialAuthBtn" type="button" onClick={pauseSoloNarratedClip}>
                        Pause
                      </button>
                      <span className="videoReadyPill">
                        {soloClipReady ? (isSoloPlaying ? "Now playing in sync" : "Ready") : "Loading..."}
                      </span>
                    </div>
                    <audio
                      ref={soloNarrationRef}
                      src={ORIGINAL_NARRATION_AUDIO}
                      preload="metadata"
                      onEnded={() => {
                        setIsSoloPlaying(false);
                      }}
                    />
                  </article>

                  <article className="investorVideoCard">
                    <h3>Invite a Friend AI Brain Activity</h3>
                    <video
                      ref={inviteClipRef}
                      src={INVITE_FRIEND_AI_BRAIN_VIDEO}
                      preload="metadata"
                      controls={false}
                      muted
                      playsInline
                      onCanPlay={() => setInviteClipReady(true)}
                      onPlay={syncSimulationNarrationOnVideoPlay}
                      onPause={handleSimulationVideoPause}
                      onEnded={handleSimulationVideoEnd}
                    />
                    <div className="videoActionsRow">
                      <button className="officialGetStarted officialGetStartedSmall" type="button" onClick={startTimedSimulationClip}>
                        Click Here To Play
                      </button>
                      <button className="officialAuthBtn" type="button" onClick={pauseTimedSimulationClip}>
                        Pause
                      </button>
                      <span className="videoReadyPill">
                        {!inviteClipReady
                          ? "Loading..."
                          : isSimulationWaitingForLeadIn
                            ? `Audio playing. Video auto-starts in ${formatSeconds(simulationLeadInCountdown)}.`
                            : isSimulationPlaying && simulationHasVideoStarted
                              ? "Now playing in sync"
                              : isSimulationPlaying
                                ? "Audio started"
                                : "Ready"}
                      </span>
                    </div>
                    <audio
                      ref={simulationNarrationRef}
                      src={SIMULATION_NARRATION_AUDIO}
                      preload="metadata"
                      onEnded={() => {
                        clearSimulationLeadInTimers();
                        const video = inviteClipRef.current;
                        if (video) {
                          video.pause();
                          video.currentTime = 0;
                        }
                        setIsSimulationPlaying(false);
                        setIsSimulationWaitingForLeadIn(false);
                        setSimulationHasVideoStarted(false);
                        setSimulationLeadInCountdown(SIMULATION_VIDEO_LEAD_IN_SECONDS);
                      }}
                    />
                  </article>
                </div>
              </div>

              <div className="investorSummaryBlock">
                <h2>AI Brain</h2>
                <div className="investorPointsGrid">
                  <article className="investorPointCard">
                    <p className="investorPointLabel">KEY POINT 1</p>
                    <p>The AI engine is described as a broad-signal system using behavioral and contextual inputs.</p>
                  </article>
                  <article className="investorPointCard">
                    <p className="investorPointLabel">KEY POINT 2</p>
                    <p>Predictability is positioned as the primary output, with recommendations adapting per shopper.</p>
                  </article>
                  <article className="investorPointCard">
                    <p className="investorPointLabel">KEY POINT 3</p>
                    <p>Security monitoring and multilingual recommendation delivery are included in the narrative.</p>
                  </article>
                </div>
                <div className="investorTakeawayCard">
                  <p className="investorPointLabel">INVESTOR TAKEAWAY</p>
                  <p>AI is positioned as the differentiator that drives personalization, efficiency, and measurable lift.</p>
                </div>
              </div>

              <article className="investorListCard investorSocialCard">
                <h3>AI Data Collection Model</h3>
                <div className="investorTwoCol">
                  <article className="investorListCard">
                    <h3>What This Section Shows</h3>
                    <ul>
                      <li>The AI model is framed as combining sensory, behavioral, and social-context inputs.</li>
                      <li>The goal is to improve predictability and recommendation quality over time.</li>
                      <li>Input diversity is positioned as the core advantage versus narrow historical-only models.</li>
                    </ul>
                    <div className="investorTakeawayCard">
                      <p className="investorPointLabel">INVESTOR TAKEAWAY</p>
                      <p>A richer input layer supports more adaptive recommendations and shopper guidance.</p>
                    </div>
                  </article>
                  <article className="investorMediaCard investorSlideCard">
                    <img src="/Slide/page%2014.png" alt="AI data collection model slide" />
                    <p>AI data collection model source slide</p>
                  </article>
                </div>
              </article>

            </section>

            <section id="avatar-experience" className="officialSection investorSection">
              <div className="investorSplitHeader">
                <div>
                  <p className="investorKicker">Shop Experience</p>
                  <h2>Avatar-Based Shop Experience To Reduce Returns</h2>
                  <p>
                    Phase 1 communicates the concept. Phase 2 formalizes privacy, opt-in,
                    storage policy, and rendering pipeline.
                  </p>
                </div>
                <div className="investorTagGroup">
                  <span>Confidence</span>
                  <span>Return reduction</span>
                  <span>Accessibility</span>
                </div>
              </div>

              <div className="investorTwoCol">
                <article className="investorListCard">
                  <h3>Why It Matters</h3>
                  <ul>
                    <li>Improves confidence before purchase (fit + style preview)</li>
                    <li>Reduces returns by decreasing uncertainty</li>
                    <li>Supports diverse shoppers regardless of physical limitations</li>
                  </ul>
                </article>
                <article className="investorListCard">
                  <h3>Phase 1 Flow (Mock)</h3>
                  <div className="flowGridMock">
                    <div><small>STEP 1</small><strong>Capture</strong><span>Phone scan / measurements</span></div>
                    <div><small>STEP 2</small><strong>Avatar</strong><span>Personal body model</span></div>
                    <div><small>STEP 3</small><strong>Try-on</strong><span>Fit + style preview</span></div>
                    <div><small>OUTCOME</small><strong>↑ Confidence</strong></div>
                    <div><small>IMPACT</small><strong>↓ Returns</strong></div>
                    <div><small>BUSINESS</small><strong>↑ Conversion</strong></div>
                  </div>
                </article>
              </div>

              <div className="investorMediaTwin">
                <article className="investorMediaCard">
                  <img src="/illustrations/product1.png" alt="SmartMall mock desktop product view" />
                  <p>SmartMall Mock (Hero) — click to use yourself</p>
                </article>
                <article className="investorMediaCard">
                  <img src="/illustrations/avatar-try-on-mobile.jpg" alt="Shop experience mobile mock" />
                  <p>Shop Experience Mobile Mock — click to expand</p>
                </article>
              </div>

              <article className="investorTakeawayCard">
                <p className="investorPointLabel">Phase 2 upgrade (recommended)</p>
                <p>Add a dedicated diagram: capture → privacy/consent → avatar generation → preview rendering → retention & deletion policy.</p>
              </article>

              <article className="investorListCard investorSocialCard">
                <h3>Collaborative Shopping</h3>
                <div className="investorTwoCol">
                  <article className="investorListCard">
                    <h3>What This Section Shows</h3>
                    <ul>
                      <li>Slide framing emphasizes a group-first shopping journey inside the virtual mall.</li>
                      <li>Avatar-linked participation and continuous interaction are positioned as a social differentiator.</li>
                      <li>The shopping session is designed to remain connected before, during, and after purchase decisions.</li>
                    </ul>
                    <div className="investorTakeawayCard">
                      <p className="investorPointLabel">INVESTOR TAKEAWAY</p>
                      <p>The collaborative flow supports stronger engagement and more confident purchase behavior.</p>
                    </div>
                  </article>
                  <article className="investorMediaCard investorSlideCard">
                    <img src="/Slide/page%2018.png" alt="Collaborative shopping slide" />
                    <p>Collaborative shopping source slide</p>
                  </article>
                </div>
              </article>

            </section>

            <section id="growth-plan" className="officialSection investorSection">
              <div className="investorSplitHeader">
                <div>
                  <p className="investorKicker">Growth</p>
                  <h2>Three-Prong Go-To-Market</h2>
                  <p>A market attack driven by demand creation and strategic acquisitions that bring shoppers and revenue.</p>
                </div>
                <div className="investorTagGroup">
                  <span>Marketing</span>
                  <span>Social acquisitions</span>
                  <span>eCommerce acquisitions</span>
                </div>
              </div>

              <div className="investorTwoCol">
                <article className="investorListCard">
                  <h3>Prong 1 — Traditional/Direct Marketing</h3>
                  <ul>
                    <li>Advertising (TV, internet, media) to drive awareness and demand</li>
                    <li>Performance marketing aligned to conversion + retention KPIs</li>
                  </ul>
                </article>
                <article className="investorListCard">
                  <h3>Prong 2 + 3 — Acquire Platforms</h3>
                  <ul>
                    <li>Acquire smaller social media platforms (convert shoppers into members)</li>
                    <li>Acquire smaller eCommerce platforms (vendors + existing revenues)</li>
                    <li>Use equity as acquisition currency to preserve operating capital while scaling</li>
                  </ul>
                </article>
              </div>

              <div className="investorCards3">
                <article className="investorInfoMiniCard">
                  <h3>Revenue Levers</h3>
                  <p>Memberships, vendor subscriptions, advertising, and commerce take-rate.</p>
                </article>
                <article className="investorInfoMiniCard">
                  <h3>Distribution Advantage</h3>
                  <p>Acquisitions bootstrap shopper base and shorten time-to-scale.</p>
                </article>
                <article className="investorInfoMiniCard">
                  <h3>Platform Compounding</h3>
                  <p>Better predictability → better conversion → stronger vendor demand.</p>
                </article>
              </div>

              <div className="investorMediaTwin">
                <article className="investorMediaCard investorSlideCard">
                  <img src="/Slide/page%2020.png" alt="Prong one traditional marketing development slide" />
                  <p>Traditional marketing benchmark timeline</p>
                </article>
                <article className="investorMediaCard investorSlideCard">
                  <img src="/Slide/page%2021.png" alt="Prong two three platform acquisitions slide" />
                  <p>Platform acquisition strategy benchmark</p>
                </article>
              </div>

              <div id="market-contracts" className="investorSummaryBlock navAnchor">
                <h2>Market Plan / Contracts</h2>
                <div className="investorPointsGrid">
                  <article className="investorPointCard">
                    <p className="investorPointLabel">KEY POINT 1</p>
                    <p>The plan is built on three prongs: direct marketing plus social and ecommerce acquisitions.</p>
                  </article>
                  <article className="investorPointCard">
                    <p className="investorPointLabel">KEY POINT 2</p>
                    <p>Traditional market development benchmarks are used to justify staged adoption strategy.</p>
                  </article>
                  <article className="investorPointCard">
                    <p className="investorPointLabel">KEY POINT 3</p>
                    <p>Recurring revenue streams are defined across pre-launch and post-launch phases.</p>
                  </article>
                </div>
                <div className="investorTakeawayCard">
                  <p className="investorPointLabel">INVESTOR TAKEAWAY</p>
                  <p>Growth is framed as acquisition-accelerated scale with diversified recurring monetization.</p>
                </div>
              </div>

            </section>

            <section id="rollout-financials" className="officialSection investorSection">
              <div className="investorSplitHeader">
                <div>
                  <p className="investorKicker">Plan</p>
                  <h2>Projected Rollout Schedule</h2>
                  <p>A staged approach focused on product completion, acquisition-driven scale, and revenue rollout.</p>
                </div>
                <div className="investorTagGroup">
                  <span>Build</span>
                  <span>Validate</span>
                  <span>Expand</span>
                </div>
              </div>

              <article className="investorListCard">
                  <h3>Rollout Plan</h3>
                <div className="investorTwoCol rolloutPlanGrid">
                  <article className="investorListCard">
                    <h3>What This Section Shows</h3>
                    <ul>
                      <li>The rollout timeline sequences hiring, AI interface completion, coding/testing, and phased rollout.</li>
                      <li>Mid-plan activities include additional platform acquisition and traditional marketing activation.</li>
                      <li>Later phases shift into full rollout marketing and revenue acceleration milestones.</li>
                    </ul>
                    <div className="investorTakeawayCard">
                      <p className="investorPointLabel">INVESTOR TAKEAWAY</p>
                      <p>Execution is presented as a staged program with explicit build, launch, and scale checkpoints.</p>
                    </div>
                  </article>
                  <article
                    className="animatedChartCard chartInvestorCard investorEnlargeableBlock rolloutScheduleChartCard"
                    data-chart-enlarge="rollout-schedule"
                  >
                    <RolloutTimelineChartInvestor />
                    <p>Rollout Timeline (Mock) — Phase 2: replace with validated plan + dependencies.</p>
                  </article>
                  <article
                    className="investorMediaCard investorSlideCard rolloutScheduleSlideWide investorEnlargeableBlock"
                    data-chart-enlarge="rollout-bars"
                  >
                    <RolloutBarsChartInvestor />
                    <p>Converted from deck graph into native rollout bar chart</p>
                  </article>
                </div>
              </article>

            </section>

            <section id="financial-projections" className="officialSection investorSection">
              <div className="investorSplitHeader investorSplitHeaderSolution">
                <div>
                  <p className="investorKicker">Business Model</p>
                  <h2>Financial Upside & Implementation Plan</h2>
                  <p>Financial model summary across Year 1 and Year 2 projections.</p>
                </div>
                <div className="investorTagGroup">
                  <span>Revenue generating</span>
                  <span>Acquisition strategy</span>
                  <span>Scalable rollout</span>
                </div>
              </div>

              <div className="investorCards3">
                <article className="investorInfoMiniCard">
                  <h3>FY1 Revenue Sub-total</h3>
                  <p>$10,376,200</p>
                </article>
                <article className="investorInfoMiniCard">
                  <h3>FY2 Revenue Sub-total</h3>
                  <p>$16,740,611.50</p>
                </article>
                <article className="investorInfoMiniCard">
                  <h3>Net-Net</h3>
                  <p>FY1: -$287,947.25 / FY2: $8,928,262.09</p>
                </article>
              </div>

              <div className="animatedChartsGrid">
                <article className="animatedChartCard chartInvestorCard investorEnlargeableBlock" data-chart-enlarge="revenue-year-one">
                  <RevenueYearOneChartInvestor />
                </article>
                <article className="animatedChartCard chartInvestorCard investorEnlargeableBlock" data-chart-enlarge="revenue-year-two">
                  <RevenueYearTwoChartInvestor />
                </article>
              </div>
            </section>

            <section id="financial-ipo" className="officialSection investorSection">
              <div className="investorSplitHeader">
                <div>
                  <p className="investorKicker">Financials / IPO</p>
                  <h2>Budget Highlights And Projection Assumptions</h2>
                  <p>Financial figures are illustrative in Phase 1 and replaced with validated assumptions in Phase 2.</p>
                </div>
                <div className="investorTagGroup">
                  <span>FY1 / FY2</span>
                  <span>Assumptions</span>
                  <span>Disclosure</span>
                </div>
              </div>

              <div className="investorTwoCol">
                <article className="investorListCard">
                  <h3>Budget Highlights (FY1/FY2 Worksheet)</h3>
                  <ul>
                    <li>FY1 expense sub-total: $20,405,739; FY2 expense sub-total: $22,550,000</li>
                    <li>FY1 EBITDA: $2,594,050; FY2 EBITDA: $4,185,152.88</li>
                    <li>FY1 recurring expenditure baseline: $146,000</li>
                    <li>FY1 major budget lines include Staff/AOH ($21,504,000) and Marketing ($675,000)</li>
                  </ul>
                </article>
                <article className="investorListCard">
                  <h3>Financial Projection Assumptions</h3>
                  <ul>
                    <li>Year 1 projects approximately a $290K loss while targeting operational profitability by Q2.</li>
                    <li>Core strategy is a three-prong marketing approach with acquisitions of social and ecommerce platforms.</li>
                    <li>Pre-launch shopper membership is modeled at $2.50/month with advance payment terms.</li>
                    <li>Standard shopper membership is modeled at $5/month, with non-member usage fees and vendor report revenue streams.</li>
                  </ul>
                </article>
              </div>

              <article className="investorTakeawayCard">
                <p className="investorPointLabel">Disclosure</p>
                <p>Any financial figures shown in Phase 1 are illustrative estimates for presentation purposes and do not guarantee future outcomes.</p>
              </article>

              <article className="investorListCard investorSocialCard projectionsSectionCard">
                <h3>Projections</h3>
                <div className="investorTwoCol projectionsTopGrid">
                  <article className="investorListCard projectionsSummaryCard">
                    <h3>What This Section Shows</h3>
                    <ul>
                      <li>Revenue progression starts with acquisition-driven contributions, then membership and advertising streams.</li>
                      <li>Year 1 assumptions center on member growth, vendor participation, and phased launch timing.</li>
                      <li>Year 1-to-Year 2 analysis is presented as moving from early buildout into strong profitability.</li>
                    </ul>
                    <div className="investorTakeawayCard">
                      <p className="investorPointLabel">INVESTOR TAKEAWAY</p>
                      <p>Financial framing emphasizes a transition from launch-phase pressure to year-two operating strength.</p>
                    </div>
                  </article>
                  <article
                    className="investorMediaCard investorSlideCard projectionsPrimarySlide investorEnlargeableBlock"
                    data-chart-enlarge="revenue-mix-bars"
                  >
                    <RevenueMixBarChartInvestor />
                    <p>Converted from deck graph into native revenue-mix bar chart</p>
                  </article>
                </div>
              </article>

              <div className="investorMediaTwin projectionsSlidesGrid">
                <article
                  className="investorListCard projectionsSecondarySlide investorEnlargeableBlock"
                  data-chart-enlarge="revenue-year-one-bars"
                >
                  <YearOneRevenueBarsChartInvestor />
                  <p className="investorPointLabel">Converted from deck graph (Year 1)</p>
                </article>
                <article
                  className="investorListCard projectionsSecondarySlide investorEnlargeableBlock"
                  data-chart-enlarge="revenue-year-two-bars"
                >
                  <YearTwoRevenueBarsChartInvestor />
                  <p className="investorPointLabel">Converted from deck graph (Year 2)</p>
                </article>
              </div>
            </section>

            <section id="ipo-pathway" className="officialSection investorSection">
              <div className="investorSplitHeader">
                <div>
                  <p className="investorKicker">Investor Information</p>
                  <h2>IPO Pathway And Advisor Package</h2>
                  <p>Governance readiness, reporting discipline, and advisor support structure.</p>
                </div>
                <div className="investorTagGroup">
                  <span>Governance</span>
                  <span>Reporting</span>
                  <span>Listing readiness</span>
                </div>
              </div>

              <div className="investorSummaryBlock">
                <h2>Investors</h2>
                <div className="investorPointsGrid">
                  <article className="investorPointCard">
                    <p className="investorPointLabel">KEY POINT 1</p>
                    <p>This section presents the thesis for early investor interest in a rare AI + social-commerce approach.</p>
                  </article>
                  <article className="investorPointCard">
                    <p className="investorPointLabel">KEY POINT 2</p>
                    <p>The section highlights principal investor participation and supporting investor biographies.</p>
                  </article>
                  <article className="investorPointCard">
                    <p className="investorPointLabel">KEY POINT 3</p>
                    <p>Current fundraising narrative includes progress toward the initial raise target.</p>
                  </article>
                </div>
                <div className="investorTakeawayCard">
                  <p className="investorPointLabel">INVESTOR TAKEAWAY</p>
                  <p>The investor narrative emphasizes strategic conviction in category creation and long-term scale.</p>
                </div>
              </div>

              <div className="investorTwoCol">
                <article className="investorListCard">
                  <h3>Early Investor Thesis</h3>
                  <ul>
                    <li>Investor case emphasizes category convergence: AI + social + commerce in one platform.</li>
                    <li>Initial capital focus was AI Brain development and Phase 1 platform narrative.</li>
                    <li>Public-market pathway and equity-led acquisitions are positioned as growth levers.</li>
                  </ul>
                </article>
                <article className="investorListCard">
                  <h3>Government Opportunity Context</h3>
                  <ul>
                    <li>Deck narrative references provisional verbal approval and planning participation for a 2026 government commerce initiative.</li>
                    <li>Potential upside includes member-revenue share and broader commerce-data monetization.</li>
                    <li>A one-stop commerce integration concept is presented if a formal agreement is executed.</li>
                  </ul>
                  <p className="investorPointLabel">Important: no formal contract or binding agreement is represented as executed at this stage.</p>
                </article>
              </div>

              <article className="investorListCard investorSocialCard">
                <h3>Prominent Investor Bios</h3>
                <div className="investorCards3">
                  <article className="investorInfoMiniCard">
                    <h3>David Cheriton</h3>
                    <p>Early Google investor; co-founded multiple technology companies with notable exits and public-market outcomes.</p>
                  </article>
                  <article className="investorInfoMiniCard">
                    <h3>Leon Black</h3>
                    <p>Apollo Global Management co-founder with deep private-equity and M&A background.</p>
                  </article>
                  <article className="investorInfoMiniCard">
                    <h3>Paul Erickson</h3>
                    <p>Entrepreneur with cross-industry company-building background and strategic networking support.</p>
                  </article>
                </div>
              </article>

              <article className="investorListCard investorSocialCard">
                <h3>IPO</h3>
                <div className="investorTwoCol">
                  <article className="investorListCard">
                    <h3>What This Section Shows</h3>
                    <ul>
                      <li>The pathway outlines an initial seed raise followed by a larger post-reverse expansion raise.</li>
                      <li>Planned sequence includes OTC registration/readiness and a conditional path toward NASDAQ standards.</li>
                      <li>Growth capital is linked to acquisition completion and revenue model expansion.</li>
                    </ul>
                    <div className="investorTakeawayCard">
                      <p className="investorPointLabel">INVESTOR TAKEAWAY</p>
                      <p>Public-market strategy is framed as phased, compliance-dependent, and tied to operating milestones.</p>
                    </div>
                  </article>
                  <article className="investorMediaCard investorSlideCard">
                    <img src="/Slide/page%2027.png" alt="IPO strategy and pathway slide" />
                    <p>IPO pathway visual and advisor narrative</p>
                  </article>
                </div>
              </article>

              <div className="investorTwoCol">
                <article className="investorListCard">
                  <h3>Illustrative Public-Market Pathway</h3>
                  <ul>
                    <li>Stage 1: Governance + controls baseline</li>
                    <li>Stage 2: OTC-readiness (if pursued)</li>
                    <li>Stage 3: Uplisting pathway (if criteria are met)</li>
                  </ul>
                </article>
                <article className="investorListCard">
                  <h3>IPO Team</h3>
                  <ul>
                    <li>Corporate Counsel: Jesse Blue, ESQ — Sichenzia Ross Ference Carmel LLP</li>
                    <li>Auditors: Brian Zucker, CPA — RRBB Accountants + Advisors</li>
                    <li>IR/PR: Scott Powell — Skyline Corporate Communications Group, LLC</li>
                  </ul>
                </article>
              </div>

              <article className="investorListCard investorSocialCard">
                <h3>Investor Diligence Package</h3>
                <ul>
                  <li>Corporate structure, cap table, and governance framework</li>
                  <li>Audited/attestable financial package and controls documentation</li>
                  <li>Risk disclosures: product, privacy, compliance, and execution</li>
                  <li>Milestone map tied to capital plan and growth assumptions</li>
                </ul>
              </article>

              <article className="investorTakeawayCard">
                <p className="investorPointLabel">Important Note</p>
                <p>This section is not legal, tax, or securities advice. Counsel and qualified advisors should define jurisdiction-specific listing and reporting requirements.</p>
              </article>
            </section>



            <section id="capital-plan" className="officialSection investorSection">
              <div id="capital-overview" className="navAnchor" />
              <div className="investorSplitHeader">
                <div>
                  <p className="investorKicker">Capital plan</p>
                  <h2>Investor Capitalization & Milestones</h2>
                  <p>Seed round to complete build + rollout, followed by a larger round aligned to expansion.</p>
                </div>
                <div className="investorTagGroup">
                  <span>Seed</span>
                  <span>Expansion</span>
                  <span>Public pathway</span>
                </div>
              </div>

              <div className="investorTwoCol">
                <article
                  className="investorListCard investorEnlargeableBlock"
                  data-chart-enlarge="capital-share-structure-bars"
                >
                  <CapitalizationShareStructureChartInvestor />
                  <p className="investorPointLabel">Bar-form view from cap-table workbook data.</p>
                </article>
                <article className="investorListCard">
                  <h3>Capital Raise Pre-IPO</h3>
                  <ul>
                    <li>Current model uses a pre-money valuation of $8,000,000 at $0.04/share.</li>
                    <li>New equity raised tracked in cap materials: $750,000.</li>
                    <li>Seed completion is still aligned to Phase 1 to Phase 2 build-out and rollout readiness.</li>
                  </ul>
                </article>
              </div>

              <div className="investorTwoCol">
                <article
                  className="investorListCard investorEnlargeableBlock"
                  data-chart-enlarge="valuation-raise-snapshot-bars"
                >
                  <ValuationRaiseSnapshotChartInvestor />
                  <p className="investorPointLabel">Series A rows from the February 16, 2026 cap table.</p>
                </article>
                <article className="investorListCard">
                  <div id="draft-cap-tables" className="navAnchor" />
                  <h3>Draft Cap Tables Snapshot (As Of Feb 16, 2026)</h3>
                  <ul>
                    <li>Authorized shares: 190,000,000 Common and 10,000,000 Blank Check Preferred Stock.</li>
                    <li>Issued and outstanding: 81,000,000 Common; 0 Blank Check Preferred Stock.</li>
                    <li>Cash raised shown in cap table package: $750,000.</li>
                    <li>Summary ownership percentages and shareholder rows are included in the attached workbook for diligence review.</li>
                  </ul>
                </article>
              </div>

              <article className="investorListCard" data-chart-enlarge="actual-cap-table">
                <h3>Actual Cap Table Summary</h3>
                <div className="investorTableWrap">
                  <table className="investorDataTable">
                    <thead>
                      <tr>
                        <th>Class</th>
                        <th>Authorized</th>
                        <th>Issued</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Common</td>
                        <td>190,000,000</td>
                        <td>81,000,000</td>
                      </tr>
                      <tr>
                        <td>Blank Check Preferred Stock</td>
                        <td>10,000,000</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td><strong>Cash Raised</strong></td>
                        <td colSpan="2">$750,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </article>

              <div className="investorCards3">
                <article className="investorInfoMiniCard">
                  <h3>OTC Pathway (If Applicable)</h3>
                  <p>Registering to OTC can require reporting setup and audit readiness; Phase 2 adds compliance detail.</p>
                </article>
                <article className="investorInfoMiniCard">
                  <h3>Expansion Milestone</h3>
                  <p>Complete equity acquisitions of revenue-generating social media and eCommerce platforms.</p>
                </article>
                <article className="investorInfoMiniCard">
                  <h3>NASDAQ Pathway (If Applicable)</h3>
                  <p>Contingent on meeting regulatory requirements with formal timing and criteria in Phase 2.</p>
                </article>
              </div>

              <div className="investorTwoCol">
                <article className="animatedChartCard chartInvestorCard investorEnlargeableBlock" data-chart-enlarge="raise-milestones">
                  <RaiseMilestonesChartInvestor />
                  <p>Raise Flow (Mock) — Phase 2: add compliance + timing criteria.</p>
                </article>
                <div className="capitalRightStack">
                  <article className="investorListCard">
                    <h3>Capital Raise Pre-IPO</h3>
                    <ul>
                      <li>Current model uses a pre-money valuation of $8,000,000 at $0.04/share.</li>
                      <li>New equity raised tracked in cap materials: $750,000.</li>
                      <li>Seed completion remains aligned to Phase 1 to Phase 2 build-out readiness.</li>
                    </ul>
                  </article>
                </div>
              </div>

              <article className="investorListCard investorSocialCard">
                <div id="capital-raise-pre-ipo" className="navAnchor" />
                <div id="capital-investors" className="navAnchor" />
                <h3>Capital Raise Pre-IPO</h3>
                <div className="investorTwoCol">
                  <article className="investorListCard">
                    <h3>What This Section Shows</h3>
                    <ul>
                      <li>Bridge raise target is presented at $750K to $1.0M for pre-IPO execution.</li>
                      <li>Use of proceeds includes registration/legal work, initial audit work, and capital-raise expenses.</li>
                      <li>General company operating coverage is included as a use-of-funds category.</li>
                    </ul>
                    <div className="investorTakeawayCard">
                      <p className="investorPointLabel">INVESTOR TAKEAWAY</p>
                      <p>This capital stage is positioned as a bridge to public-market readiness and scaling actions.</p>
                    </div>
                  </article>
                  <article
                    className="investorListCard investorEnlargeableBlock"
                    data-chart-enlarge="bridge-use-of-funds-bars"
                  >
                    <BridgeUseOfFundsBarChartInvestor />
                    <p className="investorPointLabel">Converted from deck graph into native use-of-funds bars</p>
                  </article>
                </div>
              </article>

            </section>
            <section id="leadership" className="officialSection investorSection">
              <div className="investorSplitHeader">
                <div>
                  <p className="investorKicker">Execution</p>
                  <h2>Leadership</h2>
                  <p>Investors want confidence in execution: strong management, clear plan, and disciplined growth.</p>
                </div>
                <div className="investorTagGroup">
                  <span>Strategy</span>
                  <span>Finance</span>
                  <span>Growth</span>
                </div>
              </div>

              <div className="investorTwoCol">
                <div className="leadershipBioCol">
                  <article className="investorListCard">
                    <h3>Dr. Michael Rivera — CEO / Managing Partner</h3>
                    <p>Conceptual design lead and managing partner with board leadership and strategic execution oversight.</p>
                  </article>
                  <article className="investorListCard">
                    <h3>Sophia Xue — CFO</h3>
                    <p>Financial strategy, modeling, and capital planning with prior senior finance roles.</p>
                  </article>
                  <article className="investorListCard">
                    <h3>Jason Lynn — Chief Product Officer (CPO)</h3>
                    <p>Product and platform leadership with consumer privacy and protection focus.</p>
                  </article>
                  <article className="investorListCard">
                    <h3>Kori Rivers — Director of Marketing</h3>
                    <p>Central Florida major theme park hospitality background.</p>
                  </article>
                  <article className="investorListCard">
                    <h3>Board Of Directors</h3>
                    <p>To be announced.</p>
                  </article>
                  <article className="investorListCard">
                    <h3>Special Advisors To the Company</h3>
                    <ul>
                      <li>
                        <strong>SRFC — Corporate Counsel (Jesse Blue, ESQ):</strong> National securities and
                        corporate law firm focused on complex legal execution and commercial outcomes.
                      </li>
                      <li>
                        <strong>RRBB Accountants + Advisors — Audit Lead (Brian Zucker, CPA):</strong> Audit and
                        advisory firm known for responsive service, deep accounting expertise, and long-term
                        business consulting support.
                      </li>
                      <li>
                        <strong>Skyline Corporate Communications Group — IR/PR Lead (Scott Powell):</strong> Integrated
                        investor relations, public relations, and digital communications support for late-stage
                        private and publicly listed companies.
                      </li>
                    </ul>
                  </article>
                </div>
                <article className="investorListCard">
                  <h3>Operating Focus (Phase 1)</h3>
                  <ul>
                    <li>Build → validate → iterate (Phase 2 MVP)</li>
                    <li>Secure + monitor commerce + data pipelines</li>
                    <li>Scale via partnerships + acquisitions</li>
                  </ul>
                  <p className="investorPointLabel" style={{ marginTop: "12px" }}>Phase 2 add: org chart + hiring plan + advisors.</p>
                </article>
              </div>

            </section>

            <section id="management-team" className="officialSection investorSection">
              <div className="investorSummaryBlock">
                <h2>Management Team</h2>
                <div className="investorPointsGrid">
                  <article className="investorPointCard">
                    <p className="investorPointLabel">KEY POINT 1</p>
                    <p>Leadership content presents executive bios and role ownership across strategy, finance, product, and marketing.</p>
                  </article>
                  <article className="investorPointCard">
                    <p className="investorPointLabel">KEY POINT 2</p>
                    <p>The team profile emphasizes operational delivery capability for Phase 1 and scale readiness for Phase 2.</p>
                  </article>
                  <article className="investorPointCard">
                    <p className="investorPointLabel">KEY POINT 3</p>
                    <p>Management depth is positioned as a core risk-reduction factor for investors.</p>
                  </article>
                </div>
                <div className="investorTakeawayCard">
                  <p className="investorPointLabel">INVESTOR TAKEAWAY</p>
                  <p>Execution confidence is anchored in role clarity, leadership background, and staged operating focus.</p>
                </div>
              </div>
            </section>



            <section id="platform-backend" className="officialSection investorSection">
              <div className="investorSplitHeader">
                <div>
                  <p className="investorKicker">Platform</p>
                  <h2>What Backend Is Required To Make Elysium Real</h2>
                  <p>A production SmartMall requires secure accounts, commerce, data persistence, AI pipelines, and high-fidelity rendering infrastructure.</p>
                </div>
                <div className="investorTagGroup">
                  <span>Auth</span>
                  <span>Payments</span>
                  <span>Data</span>
                  <span>Security</span>
                </div>
              </div>

              <div className="investorTwoCol">
                <article className="investorListCard">
                  <h3>Core Platform Services</h3>
                  <ul>
                    <li>Accounts & identity: sign-up/login, MFA, roles (member/vendor/admin)</li>
                    <li>Product catalog + inventory: items, variants, pricing, availability</li>
                    <li>Cart + checkout: secure payments, taxes, shipping, refunds, chargebacks</li>
                    <li>Orders, vendor portal, social layer, and real-time rendering services</li>
                  </ul>
                </article>
                <article className="investorListCard">
                  <h3>Suggested Architecture (Investor-Friendly)</h3>
                  <ul>
                    <li>Frontend: Next.js app router for investor site + authenticated app</li>
                    <li>API layer: Next.js routes or separate Node service as scale grows</li>
                    <li>Database: PostgreSQL; cache/queues: Redis; storage: CDN-backed object storage</li>
                    <li>Payments, compliance, and monitoring pipeline are mandatory for launch readiness</li>
                  </ul>
                </article>
              </div>

              <div className="investorCards3">
                <article className="investorInfoMiniCard">
                  <h3>Production-Ready Core</h3>
                  <p>Auth + catalog + checkout + personalization + high-fidelity visual pipeline.</p>
                </article>
                <article className="investorInfoMiniCard">
                  <h3>Postgres + Storage</h3>
                  <p>Orders, users, vendors, assets, and audit logs.</p>
                </article>
                <article className="investorInfoMiniCard">
                  <h3>Services + Queues</h3>
                  <p>Separate recommendation engine, rendering/asset services, background jobs, CDN.</p>
                </article>
              </div>
            </section>

            <section id="contact-review" className="officialSection officialContactSection investorSection">
              <div className="reviewCtaCard">
                <div className="officialSectionHeader reviewCtaHead">
                  <h2>Ready To Review Phase 1?</h2>
                  <p>This mockup is designed to communicate the opportunity, differentiation, and investor narrative clearly. Feedback is welcome, iteration will be fast.</p>
                </div>
                <div className="reviewCtaActions">
                  <button
                    className="reviewPrimaryBtn"
                    type="button"
                    onClick={openSimulatorGate}
                  >
                    Open Simulator ↗
                  </button>
                  <a className="reviewSecondaryBtn" href={`mailto:${PASSWORD_REQUEST_EMAIL}`}>
                    Contact Us
                  </a>
                </div>
                <article className="reviewChecklistCard">
                  <h3>Phase 2 Checklist (Quick)</h3>
                  <div className="reviewChecklistGrid">
                    <p>• Real system architecture + governance</p>
                    <p>• TAM/SAM/SOM + wedge strategy</p>
                    <p>• Competitive landscape + moat</p>
                    <p>• Unit economics + validated KPI targets</p>
                    <p>• Security/privacy posture (opt-in signals)</p>
                    <p>• Pilot plan + traction dashboard</p>
                  </div>
                </article>
              </div>
            </section>
          </div>

          <footer className="officialFooter">
            <div className="officialFooterInner">
              <span>
                © {new Date().getFullYear()} Elysium Mall Inc. All rights
                reserved. Built for next-generation digital commerce.
              </span>
              <div className="officialFooterLinks">
                <a href="#financial-ipo">Financials/IPO</a>
                <a href="#contact-review">Contact Us</a>
              </div>
            </div>
          </footer>

          {showPasswordRequestModal ? (
            <div className="officialPasswordModalBackdrop">
              <div className="officialPasswordModal">
                <div className="officialPasswordModalKicker">Requires Password</div>
                <h3>Request Password</h3>
                <form onSubmit={submitPasswordRequest}>
                  <label htmlFor="request-full-name">Full Name</label>
                  <input
                    id="request-full-name"
                    value={passwordRequestForm.fullName}
                    onChange={updatePasswordRequestField("fullName")}
                    required
                  />

                  <label htmlFor="request-contact-number">Contact Number</label>
                  <input
                    id="request-contact-number"
                    value={passwordRequestForm.contactNumber}
                    onChange={updatePasswordRequestField("contactNumber")}
                    required
                  />

                  <label htmlFor="request-email-address">Email Address</label>
                  <input
                    id="request-email-address"
                    type="email"
                    value={passwordRequestForm.emailAddress}
                    onChange={updatePasswordRequestField("emailAddress")}
                    required
                  />

                  <label htmlFor="request-comment">Comment</label>
                  <textarea
                    id="request-comment"
                    rows={3}
                    value={passwordRequestForm.comments}
                    onChange={updatePasswordRequestField("comments")}
                  />

                  <div className="officialPasswordModalActions">
                    <button className="officialAuthBtn" type="button" onClick={closePasswordRequestModal}>
                      Cancel
                    </button>
                    <button className="officialGetStarted officialGetStartedSmall" type="submit">
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}

          {mediaLightbox ? (
            <div className="mediaLightboxBackdrop" onClick={closeMediaLightbox}>
              <div className="mediaLightboxDialog" onClick={(event) => event.stopPropagation()}>
                <button className="mediaLightboxClose" type="button" onClick={closeMediaLightbox}>
                  Close
                </button>

                {mediaLightbox.type === "image" ? (
                  <img
                    className="mediaLightboxImage"
                    src={mediaLightbox.src}
                    alt={mediaLightbox.alt}
                  />
                ) : null}

                {mediaLightbox.type === "chart" && mediaLightbox.chartKey === "revenue-year-one" ? (
                  <div className="mediaLightboxChart">
                    <RevenueYearOneChartInvestor />
                  </div>
                ) : null}

                {mediaLightbox.type === "chart" && mediaLightbox.chartKey === "revenue-year-two" ? (
                  <div className="mediaLightboxChart">
                    <RevenueYearTwoChartInvestor />
                  </div>
                ) : null}

                {mediaLightbox.type === "chart" && mediaLightbox.chartKey === "rollout-schedule" ? (
                  <div className="mediaLightboxChart">
                    <RolloutTimelineChartInvestor />
                  </div>
                ) : null}

                {mediaLightbox.type === "chart" && mediaLightbox.chartKey === "rollout-bars" ? (
                  <div className="mediaLightboxChart">
                    <RolloutBarsChartInvestor />
                  </div>
                ) : null}

                {mediaLightbox.type === "chart" && mediaLightbox.chartKey === "raise-milestones" ? (
                  <div className="mediaLightboxChart">
                    <RaiseMilestonesChartInvestor />
                  </div>
                ) : null}

                {mediaLightbox.type === "chart" && mediaLightbox.chartKey === "revenue-mix-bars" ? (
                  <div className="mediaLightboxChart">
                    <RevenueMixBarChartInvestor />
                  </div>
                ) : null}

                {mediaLightbox.type === "chart" && mediaLightbox.chartKey === "revenue-year-one-bars" ? (
                  <div className="mediaLightboxChart">
                    <YearOneRevenueBarsChartInvestor />
                  </div>
                ) : null}

                {mediaLightbox.type === "chart" && mediaLightbox.chartKey === "revenue-year-two-bars" ? (
                  <div className="mediaLightboxChart">
                    <YearTwoRevenueBarsChartInvestor />
                  </div>
                ) : null}

                {mediaLightbox.type === "chart" && mediaLightbox.chartKey === "bridge-use-of-funds-bars" ? (
                  <div className="mediaLightboxChart">
                    <BridgeUseOfFundsBarChartInvestor />
                  </div>
                ) : null}

                {mediaLightbox.type === "chart" && mediaLightbox.chartKey === "market-size-context-bars" ? (
                  <div className="mediaLightboxChart">
                    <MarketSizeContextChartInvestor />
                  </div>
                ) : null}

                {mediaLightbox.type === "chart" && mediaLightbox.chartKey === "capital-share-structure-bars" ? (
                  <div className="mediaLightboxChart">
                    <CapitalizationShareStructureChartInvestor />
                  </div>
                ) : null}

                {mediaLightbox.type === "chart" && mediaLightbox.chartKey === "valuation-raise-snapshot-bars" ? (
                  <div className="mediaLightboxChart">
                    <ValuationRaiseSnapshotChartInvestor />
                  </div>
                ) : null}

                {mediaLightbox.type === "chart" && mediaLightbox.chartKey === "phase-framing" ? (
                  <div className="mediaLightboxChart">
                    <div className="phaseFramingCard phaseFramingCardLarge">
                      <h3>Phase 1 Framing</h3>
                      <div className="phaseMeter">
                        <span>Returns driven by low confidence</span>
                        <div><i style={{ width: "78%" }} /></div>
                        <b>High</b>
                      </div>
                      <div className="phaseMeter">
                        <span>Discovery is search-bar driven</span>
                        <div><i style={{ width: "85%" }} /></div>
                        <b>Common</b>
                      </div>
                      <div className="phaseMeter">
                        <span>Social shopping is limited</span>
                        <div><i style={{ width: "68%" }} /></div>
                        <b>Gap</b>
                      </div>
                    </div>
                  </div>
                ) : null}

                {mediaLightbox.type === "chart" && mediaLightbox.chartKey === "market-opportunity" ? (
                  <div className="mediaLightboxChart">
                    <div className="marketOpportunityWrap marketOpportunityWrapLarge">
                      <div className="marketOpportunityVisual" aria-hidden="true">
                        <div className="tamRing">
                          <div className="samRing">
                            <div className="somCore">SOM</div>
                          </div>
                          <span className="tamLabel">TAM</span>
                          <span className="samLabel">SAM</span>
                          <span className="somLabel">SOM</span>
                          <div className="wedgeSlice" />
                        </div>
                      </div>
                      <div className="marketOpportunityStats">
                        <div className="marketStatCard">
                          <strong>TAM</strong>
                          <span>Total Addressable Market · $ —</span>
                        </div>
                        <div className="marketStatCard">
                          <strong>SAM</strong>
                          <span>Serviceable Available Market · $ —</span>
                        </div>
                        <div className="marketStatCard">
                          <strong>SOM</strong>
                          <span>Serviceable Obtainable Market · $ — · First wedge segment</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="card">
          <div className="topbar">
            <div className="brand">
              <h1>Elysium • Virtual Smart Mall</h1>
              <p>
                AI-guided shopping simulation • session-based personalization
              </p>
            </div>

            <div className="actions">
              <span className="badge">Cart: {cartCount}</span>
              <span className="badge">
                {coShopActive ? "Friend Shopping: Joined" : "Friend Shopping: Solo"}
              </span>

              <button className="btn" onClick={toggleTheme}>
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>

              <button
                className="btn"
                onClick={() => {
                  openPublicLanding();
                }}
                disabled={demoRunning}
              >
                Back to Landing
              </button>

              <button
                className="btn"
                onClick={() => {
                  resetAccessFlow();
                }}
                disabled={demoRunning}
              >
                Reset Session
              </button>

              <button className="btn danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          {true ? (
            <div className="homeGrid">
              <div className="panel personaRow">
                <AvatarStepper
                  persona={persona}
                  onSelectPersona={onSelectPersona}
                />
              </div>

              <div className="panel ellyPanel">
                <h2>AI Brain Live Activity</h2>
                <p className="muted">
                  Live AI activity stays visible above the simulator so
                  investors can follow decisions while the user is moving
                  through the mall.
                </p>
                <EllyChat
                  personaLabel={session.personaLabel}
                  activeStore={selectedStore}
                  messageLog={messageLog}
                  brainSnapshot={walkthroughBrain}
                />
              </div>

              <div className="panel walkRow">
                <h2>Virtual Mall Walkthrough</h2>
                <p className="muted">
                  Click inside the simulator below to take control of the mall
                  walkthrough.
                </p>
                {coShopJoinNotice ? (
                  <div className="walkJoinNotice">{coShopJoinNotice}</div>
                ) : null}
                {demoCompletionNotice ? (
                  <div className="walkJoinNotice">{demoCompletionNotice}</div>
                ) : null}
                <div className="walkInstructionBar">
                  <div className="walkOperateHint">
                    <div className="walkOperateTitle">Quick start</div>
                    <div className="walkOperateCopy">
                      Click inside the simulator, move with <strong>Arrows</strong>, hold <strong>Shift</strong> while moving to run, press <strong>E</strong> at storefronts to shop, and press <strong>I</strong> to invite a friend.
                    </div>
                    <div className="walkOperateNote">
                      To use mouse again, select <strong>Escape</strong> on keyboard.
                    </div>
                  </div>
                  <div className="walkKeyAndDemo">
                    <div className="walkHotkeys" aria-label="Walkthrough hotkeys">
                      <span className="walkHotkey">
                        <b>Arrows</b>
                        <span>Move</span>
                      </span>
                      <span className="walkHotkey">
                        <b>Mouse</b>
                        <span>Look</span>
                      </span>
                      <span className="walkHotkey">
                        <b>Arrows + Shift</b>
                        <span>Run</span>
                      </span>
                      <span className="walkHotkey">
                        <b>E</b>
                        <span>Enter</span>
                      </span>
                      <span className="walkHotkey">
                        <b>Esc</b>
                        <span>Exit</span>
                      </span>
                      <span className="walkHotkey">
                        <b>V</b>
                        <span>View</span>
                      </span>
                      <span className="walkHotkey">
                        <b>I</b>
                        <span>Invite</span>
                      </span>
                      <span className="walkHotkey">
                        <b>M</b>
                        <span>Map</span>
                      </span>
                    </div>
                    <div className="walkDemoActivation walkDemoInline">
                      <div className="walkDemoTitle">Luxury Simulator Guide</div>
                      <div className="walkDemoControls">
                        <select
                          value={demoKey}
                          onChange={(ev) => setDemoKey(ev.target.value)}
                          className="btn"
                          disabled={demoRunning}
                          aria-label="Luxury Simulator Script"
                        >
                          {DEMO_SELECTOR_KEYS.map((key) => {
                            const script = DEMO_SCRIPTS[key];
                            if (!script) return null;
                            return (
                              <option key={key} value={key}>
                                {script.label}
                              </option>
                            );
                          })}
                        </select>
                        <button
                          className="btn primary"
                          onClick={runDemo}
                          disabled={demoRunning}
                        >
                          {demoRunning
                            ? demoCountdown
                              ? `Starting in ${demoCountdown}…`
                              : "Running Simulator…"
                            : "Run Luxury Simulator"}
                        </button>
                        <button
                          className="btn"
                          onClick={switchToManualPlay}
                          disabled={!demoRunning && manualPlayMode}
                        >
                          {demoRunning ? "Switch to Manual Play" : "Manual Play Active"}
                        </button>
                        <button
                          className="btn"
                          onClick={() => resetDemo(false)}
                        >
                          Reset Simulator
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <VirtualMallWalkthroughR3F
                  key={walkthroughInstanceKey}
                  height="clamp(560px, 66vh, 860px)"
                  onEvent={handleWalkthroughEvent}
                  onBrainStateChange={setWalkthroughBrain}
                  requestedStoreKey={requestedStoreKey}
                  onRequestedStoreHandled={() => setRequestedStoreKey(null)}
                  coShopActive={coShopActive}
                  coShopSession={coShopSession}
                  coShopInviteEmail={coShopInviteEmail}
                  onCoShopInviteEmailChange={setCoShopInviteEmail}
                  onCoShopInviteSend={handleSendInvite}
                  demoCommand={walkDemoCommand}
                  onDemoCommandHandled={handleDemoCommandHandled}
                />
              </div>

              <div className="bottomControls">
                <div className="panel summaryPanel">
                  <h2>Session Summary</h2>
                  <p className="muted">Quick view of what the AI is learning.</p>

                  <div className="summaryCompact">
                    <div className="summaryItem">
                      <p className="title">Persona</p>
                      <p className="value">
                        {session.personaLabel || "Not selected yet"}
                      </p>
                    </div>

                    <div className="summaryItem">
                      <p className="title">AI Priority Stores</p>
                      <p className="value">
                        {displayTopStoreLabels.length
                          ? displayTopStoreLabels.join(", ")
                          : "—"}
                      </p>
                    </div>

                    <div className="summaryItem">
                      <p className="title">Walkthrough</p>
                      <p className="value">
                        {walkLastEvent
                          ? walkLastEvent.startsWith("USER_SIMULATOR:")
                            ? walkLastEvent.replace("USER_SIMULATOR:", "User simulator:")
                            : `Last event: ${walkLastEvent} (Press E at the door to enter)`
                          : "Click walkthrough canvas, use WASD or arrow keys + mouse + E to enter"}
                      </p>
                    </div>

                    <div className="summaryItem">
                      <p className="title">Cart</p>
                      <p className="value">
                        {session.cart.length
                          ? session.cart
                              .map((c) => c.name)
                              .slice(0, 3)
                              .join(" • ")
                          : "Cart is empty"}
                      </p>
                    </div>

                    <div className="summaryItem">
                      <p className="title">Tip</p>
                      <p className="value">
                        Use Walkthrough → press E to enter → storefront filters
                        products automatically.
                      </p>
                    </div>

                    <div className="summaryItem">
                      <p className="title">Co-Shopping</p>
                      <p className="value">
                        {coShopActive
                          ? `${friendDisplayLabel} is now in the simulator with the primary shopper. Both Ellys are analyzing each shopper independently while comparing overlap in real time.`
                          : coShopInviteSent
                            ? `Invite sent to ${coShopInviteEmail || "friend"}. The simulator will reload into shared shopping mode for the mock social session.`
                            : "Invite a friend by email to join the same mall session with their own avatar, Elly stream, and recommendation track."}
                      </p>
                    </div>

                    <div className="summaryItem">
                      <p className="title">Social Simulator</p>
                      <p className="value">
                        Two people in different locations can meet inside the virtual mall, shop together, and let separate Elly assistants analyze each shopper at the same time.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="panel storefrontPanel">
                  <CategoryTiles
                    stores={LUXURY_STORES}
                    topStores={displayTopStoreLabels}
                    selectedStore={selectedStore}
                    onCategoryClick={openSimulatorStore}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="storeLayout">
              <div className="panel">
                <div className="storeHeader">
                  <div>
                    {/* ✅ If entered via walkthrough, show storefront label */}
                    <h2 style={{ margin: 0 }}>
                      {activeStorefront?.label
                        ? activeStorefront.label
                        : selectedStore}
                    </h2>

                    <p className="muted" style={{ margin: "6px 0 0" }}>
                      {activeStorefront?.label
                        ? `Storefront connected to ${selectedStore} catalog • filtered for ${activeStorefront.brand}`
                        : "AI recommendations update based on in-session behavior."}
                    </p>
                  </div>

                  <button
                    className="btn primary backToMallBtn"
                    onClick={() => {
                      setSelectedStore(null);
                      setActiveStorefront(null);
                    }}
                  >
                    Back to Mall
                  </button>
                </div>

                <div className="grid2">
                  <div className="panel">
                    <h2>AI Recommendations</h2>
                    <p className="muted">Top picks for this shopper profile</p>

                    <div className="priorityBar">
                      {displayTopStoreLabels.map((s) => (
                        <span key={s} className="badge">
                          AI Priority: {s}
                        </span>
                      ))}
                    </div>

                    <div className="whyLine">
                      <span className="whyLabel">Why these picks</span>
                      <span className="whyText">
                        {explainReco(session, selectedStore)}
                      </span>
                    </div>

                    <div className="products" style={{ marginTop: 12 }}>
                      {recommendations.map((p) => (
                        <div
                          className="productCard"
                          key={p.sku}
                          onMouseEnter={() => emitProductInsight(p, "recommendation")}
                          onFocusCapture={() => emitProductInsight(p, "recommendation")}
                        >
                          <ProductThumb product={p} />
                          <div className="productMain">
                            <p className="productName">
                              {p.brandMark} • {p.name}
                            </p>
                            <p className="productMeta">
                              {p.brand} • SKU: {p.sku}
                            </p>

                            <div className="priceRow">
                              <span className="badge">${p.price}</span>
                              <button
                                className="btn primary"
                                onClick={() =>
                                  addItemToCart(p, "recommendation")
                                }
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {!recommendations.length ? (
                        <p className="muted">No recommendations available.</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="panel">
                    <h2>
                      {activeStorefront?.label
                        ? `${activeStorefront.label} Catalog`
                        : "Store Catalog"}
                    </h2>
                    <p className="muted">
                      {activeStorefront?.label
                        ? "Connected storefront inventory (filtered from catalog)."
                        : "Baseline inventory for simulator"}
                    </p>

                    <div className="products" style={{ marginTop: 12 }}>
                      {storeCatalog.map((p) => (
                        <div
                          className="productCard"
                          key={p.sku}
                          onMouseEnter={() => emitProductInsight(p, "catalog")}
                          onFocusCapture={() => emitProductInsight(p, "catalog")}
                        >
                          <ProductThumb product={p} />
                          <div className="productMain">
                            <p className="productName">
                              {p.brandMark} • {p.name}
                            </p>
                            <p className="productMeta">
                              {p.brand} • SKU: {p.sku}
                            </p>

                            <div className="priceRow">
                              <span className="badge">${p.price}</span>
                              <button
                                className="btn"
                                onClick={() => addItemToCart(p, "catalog")}
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {!storeCatalog.length ? (
                        <p className="muted">No catalog items.</p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="panel" style={{ marginTop: 14 }}>
                  <EllyChat
                    personaLabel={session.personaLabel}
                    activeStore={selectedStore}
                    messageLog={messageLog}
                  />
                </div>
              </div>

              <div className="panel summaryPanel">
                <h2>Session Summary</h2>
                <p className="muted">Quick view of what the AI is learning.</p>

                <div className="summaryCompact">
                  <div className="summaryItem">
                    <p className="title">Persona</p>
                    <p className="value">
                      {session.personaLabel || "Not selected yet"}
                    </p>
                  </div>

                  <div className="summaryItem">
                    <p className="title">AI Priority Stores</p>
                    <p className="value">
                      {topStoreLabels.length ? topStoreLabels.join(", ") : "—"}
                    </p>
                  </div>

                  <div className="summaryItem">
                    <p className="title">Cart</p>
                    <p className="value">
                      {session.cart.length
                        ? session.cart
                            .map((c) => c.name)
                            .slice(0, 3)
                            .join(" • ")
                        : "Cart is empty"}
                    </p>
                  </div>

                  <div className="summaryItem">
                    <p className="title">Tip</p>
                    <p className="value">
                      Narrate persona shifts + storefront entry → product
                      filtering on camera.
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: 14 }}>
                  <h2>3D Preview</h2>
                  <p className="muted">Click a storefront to switch.</p>
                  <MallPreview3D
                    onStoreClick={(store) => openStore(store, null)}
                    priorityStores={topStores}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="footer">
            <span>Prototype v0.4 • Confidential • January 2026</span>
            <span>
              Walkthrough: pointer-lock • E enters storefront • dwell shows AI
              overlay
            </span>
          </div>
        </div>
      )}
      {ndaStatus === "pending" && showPublicLanding && flowStage !== "brand_intro" ? (
        <div className="ndaModalBackdrop">
          <div className="ndaModal">
            <div className="ndaModalFrame">
              <img src={NDA_POPUP_IMAGE} alt="NDA terms and conditions" />
            </div>
            <p className="ndaModalCopy">
              I have read and understand the terms and conditions and accept them.
            </p>
            <div className="ndaModalActions">
              <button className="officialGetStarted officialGetStartedSmall" type="button" onClick={acceptNda}>
                ACCEPT
              </button>
              <button className="officialAuthBtn" type="button" onClick={rejectNda}>
                REJECT
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
