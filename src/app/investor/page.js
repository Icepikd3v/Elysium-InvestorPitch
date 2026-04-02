"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ClientNav from "@/components/ClientNav";

import RevenueYearOneChartMock from "@/components/illustrations/RevenueYearOneChart";
import RevenueYear1Year2ChartMock from "@/components/illustrations/RevenueYearTwoChart";
import RaiseFlowIllustration from "@/components/illustrations/RaiseFlowIllustration";
import MarketOpportunityIllustration from "@/components/illustrations/MarketOpportunityIllustration";
import IllustrationImage from "@/components/illustrations/IllustrationImage";

/**
 * Phase 1 Investor Website (Pitch Narrative + Illustration-Forward)
 * - Pitch storytelling: Problem → Solution → Product → AI → Avatar → GTM → Rollout → Financials → Raise → Platform → Team → Contact
 * - Phase 1 is intentionally "mock-forward" for narrative clarity.
 * - Mock visuals + demo are AI-assisted and not a final/accurate representation of production fidelity.
 * - Phase 2 swaps in real system diagrams, validated metrics, and implemented backend architecture.
 */

const DEMO_URL =
  process.env.NEXT_PUBLIC_DEMO_URL || "/demo";
const INVESTOR_POPUP_IMAGE = "/NDAPopupFinal.png";
const SOLO_BRAIN_VIDEO = "/soloAIBrain.mp4";
const INVITE_FRIEND_AI_BRAIN_VIDEO = "/InviteFriendSimDemo.mp4";
const ORIGINAL_NARRATION_AUDIO =
  "/voiceovers/full-experience-narration-sequence.mp3";
const SIMULATION_NARRATION_AUDIO =
  "/voiceovers/simulation-voiceover-20260318.m4a";
const PASSWORD_REQUEST_EMAIL = "kori@elysiummall.com";
// Kori note (Mar 18, 2026): start simulation video after first paragraph finishes.
// Tune this value if updated voiceover pacing changes.
const SIMULATION_VIDEO_LEAD_IN_SECONDS = 26;
// HOLD (Kori go-live pending): keep terms gate code built but disabled for now.
// Re-enable by switching this back to:
// process.env.NEXT_PUBLIC_ENABLE_INVESTOR_TERMS_GATE === "true"
const TERMS_GATE_ENABLED = true;

const SECTIONS = [
  { id: "overview-summary", label: "Overview Summary" },
  { id: "overview-market-solution", label: "Elysium Market Solution" },
  { id: "overview-enhanced-shopping", label: "Enhanced Shopping" },
  { id: "ai-brain-core", label: "AI Brain" },
  { id: "ai-advance-avatar", label: "Advance Avatar" },
  { id: "ai-social-media", label: "Social Media" },
  { id: "market-plan-summary", label: "Plan Summary" },
  { id: "marketing-phases", label: "Marketing Phases" },
  { id: "rollout-plan", label: "Roll Out Plan" },
  { id: "financial-projections", label: "Financial Projections" },
  { id: "financial-budget", label: "Budget FY1/FY2" },
  { id: "ipo-readiness", label: "IPO" },
  { id: "ipo-team", label: "IPO Team" },
  { id: "capital-raise-pre-ipo", label: "Capital Raise Pre-IPO" },
  { id: "draft-cap-table", label: "Draft Cap Table" },
  { id: "investor-overview", label: "Investor" },
  { id: "board-directors", label: "Board Of Directors" },
  { id: "management-leadership", label: "Management" },
  { id: "special-advisors", label: "Special Advisors" },
  { id: "cover", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "contracts", label: "Contracts" },
  { id: "product", label: "SmartMall" },
  { id: "ai", label: "AI Brain" },
  { id: "avatar", label: "Shop Experience" },
  { id: "gtm", label: "Go-To-Market" },
  { id: "rollout", label: "Rollout" },
  { id: "financials", label: "Financials" },
  { id: "capitalization", label: "Capitalization" },
  { id: "raise", label: "Investor Capitalization" },
  { id: "investor-information", label: "Investor Information" },
  { id: "backend", label: "Platform" },
  { id: "team", label: "Team" },
  { id: "contact", label: "Contact" },
];

const NAV_ITEMS = [
  {
    label: "Overview",
    children: [
      { id: "overview-summary", label: "Summary" },
      { id: "overview-market-solution", label: "Elysium Market Solution" },
      { id: "overview-enhanced-shopping", label: "Enhanced Shopping" },
    ],
  },
  {
    label: "AI Brain/SmartMall",
    children: [
      { id: "ai-brain-core", label: "AI Brain" },
      { id: "ai-advance-avatar", label: "Advance Avatar" },
      { id: "ai-social-media", label: "Social Media" },
    ],
  },
  {
    label: "Market Plan/Contracts",
    children: [
      { id: "market-plan-summary", label: "Plan Summary" },
      { id: "marketing-phases", label: "Marketing Phases" },
      { id: "rollout-plan", label: "Roll Out Plan" },
    ],
  },
  {
    label: "Financials/IPO",
    children: [
      { id: "financial-projections", label: "Projections" },
      { id: "financial-budget", label: "Budget: FY1 & FY2" },
      { id: "ipo-readiness", label: "IPO" },
      { id: "ipo-team", label: "IPO Team" },
    ],
  },
  {
    label: "Capitalization/Investors",
    children: [
      { id: "capital-raise-pre-ipo", label: "Capital Raise Pre-IPO" },
      { id: "draft-cap-table", label: "Draft Cap Table" },
      { id: "investor-overview", label: "Investor" },
    ],
  },
  {
    label: "Management Team",
    children: [
      { id: "board-directors", label: "Board Of Directors" },
      { id: "management-leadership", label: "Management" },
      { id: "special-advisors", label: "Special Advisors" },
    ],
  },
  { id: "contact", label: "Contact Us" },
];

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-black/70">
      {children}
    </span>
  );
}

function Card({ title, children, right }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-semibold text-black/90">{title}</h3>
        {right ? <div className="text-xs text-black/55">{right}</div> : null}
      </div>
      <div className="mt-3 text-sm leading-relaxed text-black/70">
        {children}
      </div>
    </div>
  );
}

function Stat({ label, value, note }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-black/45">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {note ? <div className="mt-2 text-xs text-black/55">{note}</div> : null}
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-black/70">
      {items.map((t) => (
        <li key={t} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-black/40" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionEvidencePanel({
  title,
  pages = [],
  summary = [],
  takeaway,
  id,
  visualSrc = "",
  visualAlt = "",
  visualFit = "contain",
  visualImageStyle = undefined,
  previewAspectClass = "aspect-[16/9]",
  fixedPreviewHeightClass = "",
  summaryColClass = "lg:col-span-4",
  evidenceColClass = "lg:col-span-8",
  evidenceGridClassName = "",
  useSlideCrop = true,
  previewFramePaddingClass = "p-2",
}) {
  const hasPages = pages.length > 0;
  const hasVisual = Boolean(visualSrc) || hasPages;
  const evidenceGridClass = evidenceGridClassName || (
    pages.length === 1
      ? "grid gap-4"
      : "grid gap-4 2xl:grid-cols-2"
  );
  const previewSizeClass = fixedPreviewHeightClass
    ? `${fixedPreviewHeightClass} w-full`
    : `${previewAspectClass} w-full`;

  if (!hasVisual) {
    return (
      <div id={id} className="mt-6 scroll-mt-56 rounded-3xl border border-black/10 bg-white p-5 shadow-sm md:p-6">
        <div className="text-xl font-semibold text-black/90">{title}</div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {summary.map((item, index) => (
            <div key={item} className="rounded-2xl border border-black/10 bg-[#fafafa] p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-black/45">
                Key Point {index + 1}
              </div>
              <div className="mt-2 text-sm leading-relaxed text-black/75">{item}</div>
            </div>
          ))}
        </div>
        {takeaway ? (
          <div className="mt-4 rounded-2xl border border-black/10 bg-black/5 p-4 text-sm text-black/80">
            <div className="text-xs font-semibold uppercase tracking-wide text-black/55">
              Investor Takeaway
            </div>
            <div className="mt-1">{takeaway}</div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div id={id} className="mt-6 scroll-mt-56 rounded-3xl border border-black/10 bg-white p-5 shadow-sm md:p-6">
      <div className="text-xl font-semibold text-black/90">{title}</div>

      <div className="mt-4 grid items-start gap-5 lg:grid-cols-12">
        <div className={summaryColClass}>
          <div className="rounded-2xl border border-black/10 bg-[#fafafa] p-4">
            <div className="text-sm font-semibold text-black/85">
              What This Section Shows
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-black/70">
              {summary.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-black/40" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {takeaway ? (
              <div className="mt-4 rounded-xl border border-black/10 bg-white p-3 text-sm text-black/75">
                <div className="text-xs font-semibold uppercase tracking-wide text-black/55">
                  Investor Takeaway
                </div>
                <div className="mt-1">{takeaway}</div>
              </div>
            ) : null}
          </div>
        </div>

        <div className={`${evidenceGridClass} ${evidenceColClass}`}>
          {visualSrc ? (
            <div
              className={`self-start overflow-hidden rounded-2xl border border-black/10 bg-[#f8f8f8] ${previewFramePaddingClass}`}
            >
              <div className={previewSizeClass}>
                <IllustrationImage
                  src={visualSrc}
                  alt={visualAlt || `${title} visual`}
                  fit={visualFit}
                  imageStyle={visualImageStyle}
                  unoptimized
                />
              </div>
            </div>
          ) : (
            pages.map((page) => (
              <div
                key={page}
                className={`self-start overflow-hidden rounded-2xl border border-black/10 bg-[#f8f8f8] ${previewFramePaddingClass}`}
              >
                <div className={previewSizeClass}>
                  <IllustrationImage
                    src={`/Slide/page%20${page}.png`}
                    alt={`${title} visual`}
                    fit="contain"
                    imageStyle={
                      useSlideCrop
                        ? {
                            objectPosition: "top center",
                            clipPath: "inset(1px 12px 12px 1px)",
                            transform: "translate(-1px, -1px) scale(1.03)",
                          }
                        : { objectPosition: "center" }
                    }
                    unoptimized
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SyncedSoloDemoPlayer() {
  const videoRef = useRef(null);
  const narrationRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playNarrationIfPaused = async () => {
    const narration = narrationRef.current;
    if (!narration || !narration.paused) return;
    try {
      await narration.play();
    } catch {}
  };

  const startNarratedPlayback = async () => {
    const video = videoRef.current;
    const narration = narrationRef.current;
    if (!video || !narration) return;
    video.pause();
    narration.pause();
    video.currentTime = 0;
    narration.currentTime = 0;
    try {
      await Promise.all([video.play(), narration.play()]);
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const syncOnVideoPlay = async () => {
    await playNarrationIfPaused();
  };

  const pausePlayback = () => {
    [videoRef.current, narrationRef.current].filter(Boolean).forEach((node) => node.pause());
    setIsPlaying(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={startNarratedPlayback}
          className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-black/85"
        >
          Play Narrated AI Brain
        </button>
        <button
          type="button"
          onClick={pausePlayback}
          className="rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-semibold text-black/70 transition hover:bg-black/5"
        >
          Pause
        </button>
        <span className="inline-flex items-center rounded-full border border-black/10 bg-black/5 px-3 py-2 text-xs text-black/60">
          {isPlaying ? "Now playing in sync" : "Ready"}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/10 bg-black">
        <div className="border-b border-white/10 px-3 py-2 text-xs font-medium text-white/80">
          Solo AI Brain Activity
        </div>
        <video
          ref={videoRef}
          className="block h-[320px] w-full object-contain md:h-[460px]"
          src={SOLO_BRAIN_VIDEO}
          controls
          muted
          playsInline
          preload="metadata"
          onPlay={syncOnVideoPlay}
          onPause={() => setIsPlaying(false)}
          onEnded={pausePlayback}
        />
      </div>

      <audio
        ref={narrationRef}
        src={ORIGINAL_NARRATION_AUDIO}
        preload="metadata"
        onEnded={() => {
          setIsPlaying(false);
        }}
      />
    </div>
  );
}

function TimedSimulationPlayer() {
  const videoRef = useRef(null);
  const narrationRef = useRef(null);
  const videoLeadInTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWaitingForLeadIn, setIsWaitingForLeadIn] = useState(false);
  const [hasVideoStarted, setHasVideoStarted] = useState(false);
  const [leadInCountdown, setLeadInCountdown] = useState(
    SIMULATION_VIDEO_LEAD_IN_SECONDS,
  );

  const clearLeadInTimers = () => {
    if (videoLeadInTimeoutRef.current) {
      clearTimeout(videoLeadInTimeoutRef.current);
      videoLeadInTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  const formatSeconds = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const playNarrationIfPaused = async () => {
    const narration = narrationRef.current;
    if (!narration || !narration.paused) return;
    try {
      await narration.play();
    } catch {}
  };

  const startTimedSimulation = async () => {
    const video = videoRef.current;
    const narration = narrationRef.current;
    if (!video || !narration) return;
    clearLeadInTimers();
    video.pause();
    narration.pause();
    video.currentTime = 0;
    narration.currentTime = 0;
    setHasVideoStarted(false);
    setIsWaitingForLeadIn(false);
    setLeadInCountdown(SIMULATION_VIDEO_LEAD_IN_SECONDS);
    try {
      await narration.play();

      setIsPlaying(true);
      setIsWaitingForLeadIn(true);
      countdownIntervalRef.current = setInterval(() => {
        setLeadInCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
      videoLeadInTimeoutRef.current = setTimeout(async () => {
        clearLeadInTimers();
        try {
          await video.play();
          setIsWaitingForLeadIn(false);
          setLeadInCountdown(0);
        } catch {}
      }, SIMULATION_VIDEO_LEAD_IN_SECONDS * 1000);
    } catch {
      setIsPlaying(false);
      setIsWaitingForLeadIn(false);
      clearLeadInTimers();
    }
  };

  const syncOnVideoPlay = async () => {
    clearLeadInTimers();
    setHasVideoStarted(true);
    setIsWaitingForLeadIn(false);
    setLeadInCountdown(0);
    await playNarrationIfPaused();
  };

  const handleVideoPause = () => {
    const narration = narrationRef.current;
    if (narration && !narration.paused) {
      setIsPlaying(true);
      return;
    }
    setIsPlaying(false);
  };

  const handleVideoEnded = () => {
    clearLeadInTimers();
    const video = videoRef.current;
    const narration = narrationRef.current;
    if (video && narration && !narration.paused) {
      video.currentTime = 0;
      video
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasVideoStarted(true);
        })
        .catch(() => {});
      return;
    }
    setHasVideoStarted(false);
    setIsWaitingForLeadIn(false);
    setIsPlaying(Boolean(narration && !narration.paused));
  };

  const pausePlayback = () => {
    clearLeadInTimers();
    [videoRef.current, narrationRef.current].filter(Boolean).forEach((node) => node.pause());
    setIsPlaying(false);
    setIsWaitingForLeadIn(false);
    setHasVideoStarted(false);
    setLeadInCountdown(SIMULATION_VIDEO_LEAD_IN_SECONDS);
  };

  useEffect(() => {
    return () => {
      clearLeadInTimers();
    };
  }, []);

  return (
    <div id="ai-brain-simulation-play" className="scroll-mt-56 md:scroll-mt-48 space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={startTimedSimulation}
          className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-black/85"
        >
          Click Here To Play
        </button>
        <button
          type="button"
          onClick={pausePlayback}
          className="rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-semibold text-black/70 transition hover:bg-black/5"
        >
          Pause
        </button>
        <span className="inline-flex items-center rounded-full border border-black/10 bg-black/5 px-3 py-2 text-xs text-black/60">
          {isWaitingForLeadIn
            ? `Audio playing. Video auto-starts in ${formatSeconds(leadInCountdown)}.`
            : isPlaying && hasVideoStarted
              ? "Now playing in sync"
              : isPlaying
                ? "Audio started"
              : "Ready"}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/10 bg-black">
        <div className="border-b border-white/10 px-3 py-2 text-xs font-medium text-white/80">
          Two-Person Simulation Clip
        </div>
        <video
          ref={videoRef}
          className="block h-[320px] w-full object-contain md:h-[460px]"
          src={INVITE_FRIEND_AI_BRAIN_VIDEO}
          controls={false}
          muted
          playsInline
          preload="metadata"
          onPlay={syncOnVideoPlay}
          onPause={handleVideoPause}
          onEnded={handleVideoEnded}
        />
      </div>

      <audio
        ref={narrationRef}
        src={SIMULATION_NARRATION_AUDIO}
        preload="metadata"
        onEnded={() => {
          clearLeadInTimers();
          const video = videoRef.current;
          if (video) {
            video.pause();
            video.currentTime = 0;
          }
          setIsPlaying(false);
          setIsWaitingForLeadIn(false);
          setHasVideoStarted(false);
          setLeadInCountdown(SIMULATION_VIDEO_LEAD_IN_SECONDS);
        }}
      />
    </div>
  );
}

function SectionHeader({ kicker, title, subtitle, right }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        {kicker ? (
          <div className="text-xs font-medium uppercase tracking-widest text-black/45">
            {kicker}
          </div>
        ) : null}
        <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-3 max-w-3xl text-black/70">{subtitle}</p>
        ) : null}
      </div>
      {right ? <div className="flex flex-wrap gap-2">{right}</div> : null}
    </div>
  );
}

function SectionShell({ id, children }) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-36 px-6 py-16 md:scroll-mt-40">
      {children}
    </section>
  );
}

function MiniBarRow({
  label,
  valuePct,
  meta,
  fillClass = "bg-black/35",
  delayMs = 0,
  cycleMs = 5200,
}) {
  const clamped = Math.max(4, Math.min(100, valuePct));
  const [renderWidth, setRenderWidth] = useState(0);

  useEffect(() => {
    let delayTimer;
    let restartTimer;
    let loopTimer;
    let rafId;

    const animateFill = () => {
      setRenderWidth(0);
      restartTimer = setTimeout(() => {
        rafId = requestAnimationFrame(() => setRenderWidth(clamped));
      }, 90 + delayMs);
    };

    delayTimer = setTimeout(() => {
      animateFill();
      loopTimer = setInterval(animateFill, cycleMs);
    }, delayMs);

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(restartTimer);
      clearInterval(loopTimer);
      cancelAnimationFrame(rafId);
    };
  }, [clamped, delayMs, cycleMs]);

  return (
    <div className="grid grid-cols-12 items-center gap-3">
      <div className="col-span-4 text-xs text-black/60">{label}</div>
      <div className="col-span-6">
        <div className="h-2 w-full rounded-full bg-black/5">
          <div
            className={`h-2 rounded-full transition-[width] duration-[1650ms] ease-out ${fillClass}`}
            style={{ width: `${renderWidth}%` }}
          />
        </div>
      </div>
      <div className="col-span-2 text-right text-xs text-black/55">{meta}</div>
    </div>
  );
}

function EllyBrainIllustration() {
  const supportingFrames = [
    {
      src: "/illustrations/UpdateEllyBrain2.png",
      alt: "Elly command panel with live scan narration and product ranking",
      caption: "Elly Command Panel: live scan + ranking output",
    },
    {
      src: "/EllyBubbleReasoning.png",
      alt: "Elly brain visual showing four simultaneous reasoning bubbles",
      caption: "Elly Brain: bubble reasoning view",
    },
  ];

  return (
    <div className="rounded-2xl border border-black/10 bg-gradient-to-br from-slate-100 to-white p-3">
      <div className="rounded-xl border border-black/10 bg-white/70 p-3">
        <div className="relative h-[320px] overflow-hidden rounded-lg md:h-[420px]">
          <IllustrationImage
            src="/illustrations/EllyBrain1.png"
            alt="Primary Elly Brain render"
            fit="contain"
            expandFit="contain"
            unoptimized
            className="h-full w-full"
            sizes="(max-width: 768px) 100vw, 70vw"
            priority
          />
        </div>
        <div className="mt-2 rounded-lg border border-white/40 bg-white/80 px-3 py-2 text-xs text-black/75 backdrop-blur">
          Elly Brain: hero render
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {supportingFrames.map((frame) => (
          <div
            key={frame.src}
            className="rounded-xl border border-black/10 bg-white/70 p-2"
          >
            <div className="relative h-[280px] overflow-hidden rounded-lg md:h-[320px]">
              <IllustrationImage
                src={frame.src}
                alt={frame.alt}
                fit="contain"
                expandFit="contain"
                unoptimized
                className="h-full w-full"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>
            <div className="mt-2 rounded-lg border border-white/40 bg-white/80 px-3 py-2 text-xs text-black/75 backdrop-blur">
              {frame.caption}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [termsStatus, setTermsStatus] = useState(
    TERMS_GATE_ENABLED ? "pending" : "accepted",
  );
  const [showPasswordRequestModal, setShowPasswordRequestModal] = useState(false);
  const [expandedChart, setExpandedChart] = useState(null);
  const [passwordRequestForm, setPasswordRequestForm] = useState({
    fullName: "",
    contactNumber: "",
    emailAddress: "",
    comments: "",
  });

  const acceptTerms = () => {
    setTermsStatus("accepted");
  };

  const rejectTerms = () => {
    setTermsStatus("rejected");
  };

  const updatePasswordRequestForm = (field) => (event) => {
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

  const sendPasswordRequest = (event) => {
    event.preventDefault();
    const subject = "Elysium Password Request";
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

  const renderChartByKey = (chartKey, expanded = false) => {
    const containerClass = expanded ? "h-full w-full" : "h-full w-full";

    switch (chartKey) {
      case "rollout":
        return (
          <div className={`${containerClass} rounded-2xl border border-black/10 bg-[#fafafa] p-2`}>
            <div className="h-full w-full">
              <IllustrationImage
                src="/Slide/page%2024.png"
                alt="Projected project rollout timetable by action item"
                fit="contain"
                expandable={false}
                unoptimized
              />
            </div>
          </div>
        );
      case "revenue-y1":
        return (
          <div className={containerClass}>
            <RevenueYearOneChartMock />
          </div>
        );
      case "revenue-y1y2":
        return (
          <div className={containerClass}>
            <RevenueYear1Year2ChartMock />
          </div>
        );
      case "raise-flow":
        return (
          <div className={containerClass}>
            <RaiseFlowIllustration />
          </div>
        );
      default:
        return null;
    }
  };

  if (TERMS_GATE_ENABLED && termsStatus === "rejected") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafafa] px-6 text-black">
        <div className="max-w-xl rounded-3xl border border-black/10 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Access Unavailable</h1>
          <p className="mt-3 text-sm text-black/70">
            Access is restricted because the terms and conditions were rejected.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main id="top" className="min-h-screen bg-[#fafafa] text-black">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#fafafa]/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-5 py-4">
          <a href="#cover" className="shrink-0 leading-tight">
            <div className="text-sm font-semibold tracking-wide">Elysium</div>
            <div className="text-xs text-black/60">Phase 1</div>
          </a>

          <a
            href="#top"
            className="ml-4 hidden rounded-full border border-black/15 bg-white px-3 py-1.5 text-sm font-medium text-black/80 hover:border-black/25 lg:inline-flex"
          >
            Home
          </a>

          <ClientNav sections={SECTIONS} items={NAV_ITEMS} />
        </div>

        {/* Phase 1 disclaimer ribbon */}
        <div className="border-t border-black/10 bg-white/70">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-5 py-2.5">
            <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-black/75">
              Phase 1
            </span>

            <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
              <a
                href="#ai-brain-simulation-play"
                className="inline-flex items-center justify-center rounded-full border border-[#1d4ed8]/30 bg-[#eaf2ff] px-3 py-1.5 text-xs font-semibold text-[#1d4ed8] transition hover:bg-[#dbeafe]"
              >
                SmartMall Simulation Video
              </a>
              <a
                href={DEMO_URL}
                className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-medium text-black/80 hover:border-black/25 md:text-sm"
              >
                Open Simulator ↗
              </a>
              <div className="group relative">
                <button
                  type="button"
                  onClick={() => setShowPasswordRequestModal(true)}
                  className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-medium text-black/80 hover:border-black/25 md:text-sm"
                >
                  Request Password
                </button>
                <div className="pointer-events-none absolute right-0 top-full mt-1 rounded-md bg-black px-2 py-1 text-[11px] text-white opacity-0 transition group-hover:opacity-100">
                  Requires Password
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div id="overview-summary" className="scroll-mt-56 md:scroll-mt-48" />
      {/* Cover / Hero */}
      <SectionShell id="cover">
        <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white p-8 shadow-sm md:p-10">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-black/5 blur-3xl" />
            <div className="absolute -right-24 top-32 h-80 w-80 rounded-full bg-black/5 blur-3xl" />
          </div>

          <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <Pill>Virtual SmartMall</Pill>
                <Pill>AI Brain</Pill>
                <Pill>Social + ECommerce</Pill>
                <Pill>AI-assisted mock</Pill>
              </div>

              <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                Multi-Dimensional Immersion Into a Virtual Shopping Experience.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-black/70">
                Elysium is envisioned as a <strong>virtual smart mall</strong>{" "}
                that blends social interaction with commerce—powered by an{" "}
                <strong>AI Brain</strong> that learns from{" "}
                <strong>word data</strong>, <strong>physical cues</strong>, and{" "}
                <strong>reactions</strong>, which improves predictability by
                analyzing a compilation of human variables to &ldquo;learn and
                know&rdquo; not just one shopper, but like shoppers as well. This
                enhances the SmartMall experience.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#ai"
                  className="rounded-full bg-black px-6 py-3 text-center text-sm font-semibold text-white hover:bg-black/90"
                >
                  See how the AI Brain works
                </a>

                <a
                  href={DEMO_URL}
                  className="rounded-full border border-black/15 bg-white px-6 py-3 text-center text-sm font-semibold text-black/80 hover:border-black/25"
                >
                  View the SmartMall experience ↗
                </a>
              </div>

              <div className="mt-3 text-xs text-black/60">
                Open Simulator path: www.elysiummall.com/demo
              </div>

              <div className="mt-8 flex flex-wrap gap-2 text-xs text-black/60">
                <Pill>Personalized discovery</Pill>
                <Pill>Avatar try-on concept</Pill>
                <Pill>Lower Returns</Pill>
                <Pill>Higher Conversion</Pill>
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-[#fafafa] p-4">
              <div className="relative h-[360px] md:h-[380px]">
                <IllustrationImage
                  src="/illustrations/store3-red.png"
                  alt="Smart mall storefront hero visual"
                  fit="cover"
                />
              </div>
              <div className="mt-3 flex items-center justify-between px-1 text-xs text-black/60">
                <span>Digital Storefront (Mock UI)</span>
                <div className="flex items-center gap-3">
                  <a
                    href="#product"
                    className="underline decoration-black/20 hover:decoration-black/40"
                  >
                    View details
                  </a>
                  <a
                    href={DEMO_URL}
                    className="underline decoration-black/20 hover:decoration-black/40"
                  >
                    Open experience ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-10 grid gap-4 md:grid-cols-3">
            <Card title="Differentiation">
              Moves beyond “one-dimensional” shopping by making discovery
              interactive, guided, and personalized.
            </Card>
            <Card title="Social Commerce">
              Users can discover, share, and shop together—without leaving the
              platform.
            </Card>
            <Card title="Growth Story">
              A clear roadmap aligned to revenue generation and expansion
              milestones.
            </Card>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-12">
            <div className="md:col-span-7 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-black/90">About Elysium</h3>
              <p className="mt-2 text-sm leading-relaxed text-black/70">
                Elysium is building a premium digital mall where AI assistants,
                immersive storefronts, and merchant analytics work together in
                one platform.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
                  <div className="text-sm font-semibold text-black/85">Our Mission</div>
                  <p className="mt-1 text-xs leading-relaxed text-black/65">
                    Create a modern, intelligent commerce environment that helps
                    shoppers discover faster and helps brands convert with
                    confidence.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
                  <div className="text-sm font-semibold text-black/85">
                    What Makes Us Different
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-black/65">
                    Session-aware recommendations, co-shopping support, and
                    walkthrough-ready luxury experiences built for measurable
                    growth.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-black/90">News And Updates</h3>
              <p className="mt-2 text-sm leading-relaxed text-black/70">
                Post news updates in window frames for investors and partners.
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
                  <div className="text-sm font-semibold text-black/85">Window Frame 1</div>
                  <p className="mt-1 text-xs text-black/65">
                    Upcoming launch updates and strategic milestones.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
                  <div className="text-sm font-semibold text-black/85">Window Frame 2</div>
                  <p className="mt-1 text-xs text-black/65">
                    Recent partnership and product announcements.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 max-w-3xl rounded-2xl border border-black/10 bg-black/5 p-4 text-xs text-black/65">
            <div className="font-semibold text-black/75">Open Simulator note (important)</div>
            <div className="mt-1">
              The SmartMall simulator is a <strong>mock UI/experience</strong>{" "}
              created with AI assistance for presentation purposes. It is{" "}
              <strong>not</strong> production-grade and does not represent
              final rendering, physics, inventory, or full commerce logic yet.
            </div>
          </div>

          {/* Market opportunity */}
          <div className="relative mt-8 space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Stat
                label="Positioning"
                value="Virtual SmartMall"
                note="Immersive commerce + social layer."
              />
              <Stat
                label="Engine"
                value="AI Brain"
                note="Predictability + personalization."
              />
              <Stat
                label="Outcome"
                value="↑ Conversion / ↓ Returns"
                note="Confidence drives performance."
              />
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-black/90">Services</h3>
              <p className="mt-2 text-sm text-black/70">
                Core offerings for digital mall operators, premium brands, and
                enterprise commerce teams.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
                  <div className="text-sm font-semibold text-black/85">AI Merchandising</div>
                  <p className="mt-1 text-xs text-black/65">
                    Real-time product ranking and recommendation tuning based on
                    active shopper behavior and intent signals.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
                  <div className="text-sm font-semibold text-black/85">Immersive Storefronts</div>
                  <p className="mt-1 text-xs text-black/65">
                    Interactive virtual environments for premium discovery and
                    collaborative shopping experiences.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
                  <div className="text-sm font-semibold text-black/85">Performance Insights</div>
                  <p className="mt-1 text-xs text-black/65">
                    Actionable dashboards for engagement, product interest, and
                    purchase outcomes across storefront touchpoints.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-[#fafafa] p-4 md:p-6">
              <div className="mx-auto w-full max-w-[960px]">
                <MarketOpportunityIllustration />
              </div>
              <div className="mt-3 text-xs text-black/60">
                Market Opportunity (Mock) — Phase 2: replace with validated
                TAM/SAM/SOM.
              </div>
            </div>
          </div>
        </div>

        <SectionEvidencePanel
          title="Overview"
          summary={[
            "Elysium is positioned as a multi-dimensional virtual SmartMall led by an AI Brain.",
            "The concept combines commerce with social interaction to improve discovery and conversion.",
            "The overview frames an execution plan supported by management and early investor backing.",
          ]}
          takeaway="The opportunity is framed as a new category blend: social platform + ecommerce platform in one environment."
        />
      </SectionShell>

      {/* Problem */}
      <SectionShell id="problem">
        <SectionHeader
          kicker="The problem"
          title="Digital Shopping Is Still Frustrating"
          subtitle="Most online experiences are one-dimensional: search bars, static listings, and limited predictability—leading to high returns and abandonment."
          right={
            <>
              <Pill>High returns</Pill>
              <Pill>Cart abandonment</Pill>
              <Pill>Weak social layer</Pill>
            </>
          }
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card title="User Pain">
            <BulletList
              items={[
                "Low confidence without try-on → higher return rates",
                "Uncertainty causes cart abandonment",
                "Shopping is isolated (not social)",
              ]}
            />
          </Card>

          <Card title="Vendor Pain">
            <BulletList
              items={[
                "Exposure depends on paid marketing",
                "Personalization is limited and shallow",
                "Conversion suffers due to friction + uncertainty",
              ]}
            />
          </Card>
        </div>

        <div className="mt-6 rounded-3xl border border-black/10 bg-gradient-to-br from-white via-cyan-50/70 to-amber-50/70 p-6 shadow-sm">
          <div className="text-sm font-semibold text-black/90">
            Phase 1 Framing
          </div>
          <div className="mt-4 space-y-3">
            <MiniBarRow
              label="Returns driven by low confidence"
              valuePct={78}
              meta="High"
              fillClass="bg-cyan-500/80"
              delayMs={0}
              cycleMs={5200}
            />
            <MiniBarRow
              label="Discovery is search-bar driven"
              valuePct={85}
              meta="Common"
              fillClass="bg-fuchsia-500/75"
              delayMs={240}
              cycleMs={5200}
            />
            <MiniBarRow
              label="Social shopping is limited"
              valuePct={72}
              meta="Gap"
              fillClass="bg-amber-500/80"
              delayMs={480}
              cycleMs={5200}
            />
          </div>
          <div className="mt-4 text-xs text-black/45">
            Phase 2 can replace these with validated metrics and a competitive
            baseline.
          </div>
        </div>
      </SectionShell>

      {/* Solution */}
      <div
        id="overview-market-solution"
        className="scroll-mt-56 md:scroll-mt-48"
      />
      <SectionShell id="solution">
        <SectionHeader
          kicker="The solution"
          title="A SmartMall That Feels Guided, Social, And Predictive"
          subtitle="Elysium turns shopping into an interactive experience where AI improves predictability, boosts confidence, and reduces returns."
          right={
            <>
              <Pill>Interactive discovery</Pill>
              <Pill>Real-time recs</Pill>
              <Pill>Higher confidence</Pill>
            </>
          }
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card title="What Changes For Shoppers">
            <BulletList
              items={[
                "Guided discovery (voice/chat + experience), not just search",
                "Try-on concept (avatar) to visualize before buying",
                "Shop with friends inside the platform",
              ]}
            />
          </Card>

          <Card title="What Changes For Vendors">
            <BulletList
              items={[
                "Better targeting via predictability engine",
                "Higher Conversion through reduced friction",
                "More consistent exposure via ‘mall’ layout",
              ]}
            />
          </Card>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card title="Predictability">
            The AI Brain learns over time and improves recommendation relevance.
          </Card>
          <Card title="Lower Returns">
            Try-on confidence reduces guesswork and post-purchase regret.
          </Card>
          <Card title="Higher Conversion">
            Social + guidance drives engagement and purchases.
          </Card>
        </div>

        <SectionEvidencePanel
          title="Elysium Market Solution"
          summary={[
            "Current online shopping pain points include low predictability, limited interaction, and high return risk.",
            "The SmartMall model introduces real-time shopper guidance, social interaction, and adaptive suggestions.",
            "The solution narrative ties AI-driven assistance directly to reduced abandonment and improved satisfaction.",
          ]}
          takeaway="The section argues that stronger shopper confidence can improve both conversion and vendor performance."
        />
      </SectionShell>

      {/* Product Experience */}
      <SectionShell id="product">
        <SectionHeader
          kicker="Product experience"
          title="SmartMall Experience (Phase 1 Simulator)"
          subtitle="Phase 1 includes investor storytelling and the SmartMall simulator in one unified website experience."
          right={
            <>
              <Pill>Investor page</Pill>
              <Pill>Mock simulator</Pill>
              <Pill>AI-assisted</Pill>
            </>
          }
        />

        <div id="ai-social-media" className="mt-6 scroll-mt-56 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-black/90">Social Media Experience</h3>
          <BulletList
            items={[
              "Group shopping supports real-time visual and audio interaction inside the virtual mall.",
              "AI suggestions adapt in real time based on shopper behavior and social interactions.",
              "Bio-measurement and behavioral signals improve predictability across shopper groups.",
              "Shoppers can share, record, and comment on shopping experiences as they happen.",
            ]}
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-black/90">
                Unified Phase 1 setup
              </div>

              <BulletList
                items={[
                  "Investor narrative and simulator now share one domain and deployment",
                  "SmartMall simulator remains a cosmetic walkthrough to show the concept",
                  "Both are AI-assisted mockups for speed and clarity—not final realism",
                ]}
              />

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  href={DEMO_URL}
                  className="rounded-full bg-black px-6 py-3 text-center text-sm font-semibold text-white hover:bg-black/90"
                >
                  Open SmartMall Experience ↗
                </a>

                <a
                  href="#backend"
                  className="rounded-full border border-black/15 bg-white px-6 py-3 text-center text-sm font-semibold text-black/80 hover:border-black/25"
                >
                  See platform + backend plan
                </a>
              </div>

              <div className="mt-2 text-xs text-black/60">
                Open Simulator is a presentation prototype available at
                www.elysiummall.com/demo.
              </div>
              <div className="mt-1 text-xs font-medium text-black/70">
                Click to use yourself.
              </div>

              <div className="mt-5 rounded-2xl border border-black/10 bg-black/5 p-4 text-xs text-black/65">
                <div className="font-semibold text-black/75">
                  Presentation disclaimer
                </div>
                <div className="mt-1">
                  The simulator is intentionally simplified, AI-assisted, and focused
                  on <strong>cosmetic storytelling</strong>. It does not yet
                  represent final 3D detail, accurate store layouts, inventory,
                  checkout, shipping, fraud prevention, or full data pipelines.
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
              <div className="h-[320px]">
                <IllustrationImage
                  src="/illustrations/store3-red.png"
                  alt="Smart mall preview visual"
                  fit="cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="h-[280px] md:h-[360px]">
              <IllustrationImage
                src="/illustrations/product1.png"
                alt="Smart mall desktop hero showing curated product grid"
                fit="cover"
              />
            </div>
            <div className="mt-3 px-1 text-xs text-black/60">
              SmartMall Mock (Hero) — click to use yourself
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card title="Social + ECommerce">
            A combined social-media experience with commerce—users can share,
            discover, and shop together inside the platform.
          </Card>
          <Card title="Guided Discovery Layer">
            Discovery becomes interactive (assistant + context), improving
            relevance and reducing friction vs. static listings.
          </Card>
        </div>

        <SectionEvidencePanel
          title="Social Media"
          summary={[
            "Group shopping enables real-time visual and audio interaction within the SmartMall.",
            "Recommendations are informed by social behavior, prior shopping behavior, and in-session context.",
            "The platform emphasizes sharing, commentary, and continuous social participation during shopping.",
          ]}
          takeaway="Social engagement is presented as a core product feature that increases participation and purchase intent."
        />
      </SectionShell>

      {/* AI */}
      <div id="ai-brain-core" className="scroll-mt-56 md:scroll-mt-48" />
      <SectionShell id="ai">
        <SectionHeader
          kicker="System narrative"
          title="How The AI Brain Works"
          subtitle="Multiple signal inputs → predictive intelligence → personalized outcomes. Phase 2 replaces this mock with real system diagrams and governance."
          right={
            <>
              <Pill>Behavioral data</Pill>
              <Pill>Optional physical variables</Pill>
              <Pill>Security monitoring</Pill>
            </>
          }
        />

        <div className="mt-8 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
              <EllyBrainIllustration />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <Card title="Predictability">
                Improves relevance by learning from behavior and context over
                time.
              </Card>
              <Card title="Security Monitoring">
                AI-supported monitoring helps protect users and transactions.
              </Card>
              <Card title="Multilingual">
                Assistance can be presented in the user’s preferred language.
              </Card>
            </div>
          </div>

          <div className="md:col-span-5">
            <Card title="Investor Takeaway" right="Phase 1 Framing">
              <BulletList
                items={[
                  "The AI Brain is the differentiator: predictability + personalization",
                  "Inputs: behavior, intent/context, social signals, optional physical variables (opt-in)",
                  "Outputs: conversion lift, lower returns, improved retention",
                ]}
              />
              <div className="mt-4 rounded-2xl border border-black/10 bg-black/5 p-4 text-xs text-black/60">
                Phase 2 upgrade: real architecture (events → data lake/warehouse
                → feature store → model layer → rec engine → monitoring &
                governance).
              </div>
            </Card>

            <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
              <div className="text-base font-semibold text-black/90">
                Original AI Brain Narrated Clip
              </div>
              <div className="mt-1 text-sm text-black/60">
                Existing clip kept unchanged.
              </div>
              <div className="mt-4">
                <SyncedSoloDemoPlayer />
              </div>
            </div>

            <div
              id="ai-brain-simulation"
              className="mt-4 scroll-mt-36 rounded-3xl border border-black/10 bg-white p-4 shadow-sm"
            >
              <div className="text-base font-semibold text-black/90">
                Invite a Friend AI Brain Activity
              </div>
              <div className="mt-4">
                <TimedSimulationPlayer />
              </div>
            </div>
          </div>
        </div>

        <SectionEvidencePanel
          title="AI Brain"
          summary={[
            "The AI engine is described as a broad-signal system using behavioral and contextual inputs.",
            "Predictability is positioned as the primary output, with recommendations adapting per shopper.",
            "Security monitoring and multilingual recommendation delivery are included in the narrative.",
          ]}
          takeaway="AI is positioned as the differentiator that drives personalization, efficiency, and measurable lift."
        />
      </SectionShell>

      {/* Shop Experience */}
      <SectionShell id="avatar">
        <div id="ai-advance-avatar" className="scroll-mt-56 md:scroll-mt-48" />
        <SectionHeader
          kicker="Shop experience"
          title="Avatar-Based Shop Experience To Reduce Returns"
          subtitle="Phase 1 communicates the concept. Phase 2 formalizes privacy, opt-in, storage policy, and rendering pipeline."
          right={
            <>
              <Pill>Confidence</Pill>
              <Pill>Return reduction</Pill>
              <Pill>Accessibility</Pill>
            </>
          }
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card title="Why It Matters">
            <BulletList
              items={[
                "Improves confidence before purchase (fit + style preview)",
                "Reduces returns by decreasing uncertainty",
                "Supports diverse shoppers regardless of physical limitations",
              ]}
            />
          </Card>

          <Card title="Phase 1 Flow (Mock)">
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-black/45">
                  Step 1
                </div>
                <div className="mt-1 text-sm font-semibold">Capture</div>
                <div className="mt-1 text-xs text-black/60">
                  Phone scan / measurements
                </div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-black/45">
                  Step 2
                </div>
                <div className="mt-1 text-sm font-semibold">Avatar</div>
                <div className="mt-1 text-xs text-black/60">
                  Personal body model
                </div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-black/45">
                  Step 3
                </div>
                <div className="mt-1 text-sm font-semibold">Try-on</div>
                <div className="mt-1 text-xs text-black/60">
                  Fit + style preview
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-black/45">
                  Outcome
                </div>
                <div className="mt-1 text-sm font-semibold">↑ Confidence</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-black/45">
                  Impact
                </div>
                <div className="mt-1 text-sm font-semibold">↓ Returns</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-black/45">
                  Business
                </div>
                <div className="mt-1 text-sm font-semibold">↑ Conversion</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-7 rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="h-[360px] md:h-[420px]">
              <IllustrationImage
                src="/illustrations/Product2.png"
                alt="Shop experience desktop product cards and add-to-cart flow"
                fit="cover"
              />
            </div>
          </div>

          <div className="md:col-span-5 rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="h-[360px] md:h-[420px]">
              <IllustrationImage
                src="/illustrations/avatar-try-on-mobile.jpg"
                alt="Mobile avatar try-on mockup for the shop experience"
                fit="contain"
              />
            </div>
            <div className="mt-3 text-xs text-black/60">
              Shop Experience Mobile Mock — click to expand
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-black/90">
            Phase 2 upgrade (recommended)
          </div>
          <div className="mt-2 text-sm text-black/70">
            Add a dedicated diagram: capture → privacy/consent → avatar
            generation → preview rendering → retention & deletion policy.
          </div>
        </div>

        <SectionEvidencePanel
          title="Advance Avatar"
          summary={[
            "Avatar use is tied to fit confidence and a more realistic pre-purchase experience.",
            "The section links avatar workflows to lower returns and stronger shopper certainty.",
            "Personalization is presented as a practical conversion tool, not only a visual effect.",
          ]}
          takeaway="The avatar concept is framed as a return-reduction and conversion-improvement lever."
        />
        <SectionEvidencePanel
          title="Enhanced Shopping"
          id="overview-enhanced-shopping"
          summary={[
            "Elysium is positioned as a blended social-commerce model with continuous interaction.",
            "Enhancement themes include collaborative shopping, broader data inputs, and vendor exposure.",
            "The conclusion links platform capability to projected operating and earnings performance.",
          ]}
          takeaway="Enhanced shopping is presented as both a user-experience upgrade and a growth mechanism."
        />
      </SectionShell>

      {/* GTM */}
      <div id="contracts" className="scroll-mt-56 md:scroll-mt-48" />
      <div id="market-plan-summary" className="scroll-mt-56 md:scroll-mt-48" />
      <div id="marketing-phases" className="scroll-mt-56 md:scroll-mt-48" />
      <SectionShell id="gtm">
        <SectionHeader
          kicker="Growth"
          title="Three-Prong Go-To-Market"
          subtitle="A market attack driven by demand creation and strategic acquisitions that bring users and revenue."
          right={
            <>
              <Pill>Marketing</Pill>
              <Pill>Social acquisitions</Pill>
              <Pill>eCommerce acquisitions</Pill>
            </>
          }
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card title="Prong 1 — Traditional/Direct Marketing">
            <BulletList
              items={[
                "Advertising (TV, internet, media) to drive awareness and demand",
                "Performance marketing aligned to conversion + retention KPIs",
              ]}
            />
          </Card>

          <Card title="Prong 2 + 3 — Acquire Platforms">
            <BulletList
              items={[
                "Acquire smaller social media platforms (convert users into members)",
                "Acquire smaller eCommerce platforms (vendors + existing revenues)",
                "Elysium benefits from both because it is social + commerce",
                "Use equity as acquisition currency to preserve operating capital while scaling",
              ]}
            />
          </Card>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card title="Revenue Levers">
            Memberships, vendor subscriptions, advertising, and commerce
            take-rate.
          </Card>
          <Card title="Distribution Advantage">
            Acquisitions bootstrap user base and shorten time-to-scale.
          </Card>
          <Card title="Platform Compounding">
            Better predictability → better conversion → stronger vendor demand.
          </Card>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="h-[300px] md:h-[360px]">
              <IllustrationImage
                src="/illustrations/Prong1.png"
                alt="Traditional marketing summary visual"
                fit="contain"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="h-[300px] md:h-[360px]">
              <IllustrationImage
                src="/illustrations/prong2-3.png"
                alt="Platform acquisition summary visual"
                fit="contain"
                className="overflow-hidden rounded-xl"
                imageStyle={{
                  clipPath: "inset(0 0 0 8px)",
                  transform: "translate(5px, 2px) scale(1.024)",
                }}
              />
            </div>
          </div>
        </div>

        <SectionEvidencePanel
          title="Market Plan / Contracts"
          summary={[
            "The plan is built on three prongs: direct marketing plus social and ecommerce acquisitions.",
            "Traditional market development benchmarks are used to justify staged adoption strategy.",
            "Recurring revenue streams are defined across pre-launch and post-launch phases.",
          ]}
          takeaway="Growth is framed as acquisition-accelerated scale with diversified recurring monetization."
        />
      </SectionShell>

      {/* Rollout */}
      <div id="rollout-plan" className="scroll-mt-56 md:scroll-mt-48" />
      <SectionShell id="rollout">
        <SectionHeader
          kicker="Plan"
          title="Projected Rollout Schedule"
          subtitle="A staged approach focused on product completion, acquisition-driven scale, and revenue rollout."
          right={
            <>
              <Pill>Build</Pill>
              <Pill>Validate</Pill>
              <Pill>Expand</Pill>
            </>
          }
        />

        <div className="mt-8">
          <Card title="Best-Practice Upgrades (Phase 2)">
            <BulletList
              items={[
                "Add competitive landscape visual (positioning vs Amazon/Etsy/etc.)",
                "Add market sizing (TAM/SAM/SOM) + first wedge segment",
                "Add traction plan: pilot KPIs, cohort retention, conversion lift, return reduction",
                "Add security/privacy posture: consent, storage policy, monitoring",
                "Replace mock rollout with a validated plan and dependencies",
              ]}
            />
          </Card>
        </div>

        <SectionEvidencePanel
          title="Roll Out Plan"
          visualSrc="/Slide/page%2024.png"
          visualAlt="Revised projected rollout timetable by action item"
          visualFit="contain"
          summaryColClass="lg:col-span-3"
          evidenceColClass="lg:col-span-9"
          evidenceGridClassName="grid gap-6"
          previewAspectClass="aspect-[16/9]"
          previewFramePaddingClass="p-0"
          useSlideCrop={false}
          visualImageStyle={{
            objectPosition: "center",
          }}
          summary={[
            "The rollout timeline sequences hiring, AI interface completion, coding/testing, and phased rollout.",
            "Mid-plan activities include additional platform acquisition and traditional marketing activation.",
            "Later phases shift into full rollout marketing and revenue acceleration milestones.",
          ]}
          takeaway="Execution is presented as a staged program with explicit build, launch, and scale checkpoints."
        />
      </SectionShell>

      {/* Financials */}
      <div
        id="financial-projections"
        className="scroll-mt-56 md:scroll-mt-48"
      />
      <SectionShell id="financials">
        <SectionHeader
          kicker="Business model"
          title="Financial Upside & Implementation Plan"
          subtitle="Financial model summary across Year 1 and Year 2 projections."
          right={
            <>
              <Pill>Revenue generating</Pill>
              <Pill>Acquisition strategy</Pill>
              <Pill>Scalable rollout</Pill>
            </>
          }
        />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Stat
            label="FY1 Revenue Sub-total"
            value="$10,376,200"
            note="From Year 1-2 Financial Projections v2.xlsx."
          />
          <Stat
            label="FY2 Revenue Sub-total"
            value="$16,740,611.50"
            note="Model includes membership, advertising, reports, and acquisition revenue."
          />
          <Stat
            label="Net-Net"
            value="FY1: -$287,947.25 / FY2: $9,228,262.09"
            note="Matches attached worksheet calculations."
          />
        </div>

        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="h-[460px] sm:h-[620px] md:h-[760px]">
            <IllustrationImage
              src="/illustrations/graph4.png"
                alt="Revenue projections year one and two visual"
              fit="contain"
              unoptimized
            />
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="h-[440px] sm:h-[600px] md:h-[740px]">
            <IllustrationImage
              src="/illustrations/model2.png"
                alt="Business model and revenue sequence visual"
                fit="contain"
              />
            </div>
        </div>

        <div className="mt-6 grid items-start gap-6 md:grid-cols-2">
          <div className="relative rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
            <button
              type="button"
              onClick={() => setExpandedChart("revenue-y1")}
              className="absolute right-3 top-3 z-10 rounded-full border border-black/15 bg-white/95 px-3 py-1 text-[11px] font-medium text-black/70 hover:border-black/30"
            >
              Click to enlarge
            </button>
            <div className="h-[340px] sm:h-[420px] md:h-[520px]">
              <button
                type="button"
                onClick={() => setExpandedChart("revenue-y1")}
                className="block h-full w-full cursor-zoom-in"
                aria-label="Expand Year 1 revenue chart"
              >
                {renderChartByKey("revenue-y1")}
              </button>
            </div>
            <div className="mt-3 text-xs text-black/60">
              Revenue Year 1 (Mock) — Phase 2: replace with validated unit
              economics.
            </div>
          </div>

          <div className="relative rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
            <button
              type="button"
              onClick={() => setExpandedChart("revenue-y1y2")}
              className="absolute right-3 top-3 z-10 rounded-full border border-black/15 bg-white/95 px-3 py-1 text-[11px] font-medium text-black/70 hover:border-black/30"
            >
              Click to enlarge
            </button>
            <div className="h-[340px] sm:h-[420px] md:h-[520px]">
              <button
                type="button"
                onClick={() => setExpandedChart("revenue-y1y2")}
                className="block h-full w-full cursor-zoom-in"
                aria-label="Expand Year 1 vs Year 2 revenue chart"
              >
                {renderChartByKey("revenue-y1y2")}
              </button>
            </div>
            <div className="mt-3 text-xs text-black/60">
              Revenue Year 1 vs Year 2 (Mock) — Phase 2: replace with forecast
              model.
            </div>
          </div>
        </div>

        <div id="financial-budget" className="scroll-mt-56 md:scroll-mt-48" />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card title="Budget Highlights (FY1/FY2 Worksheet)">
            <BulletList
              items={[
                "FY1 expense sub-total: $20,405,739; FY2 expense sub-total: $22,550,000",
                "FY1 EBITDA: $2,594,050; FY2 EBITDA: $4,185,152.88",
                "FY1 recurring expenditure baseline: $146,000",
                "FY1 major budget lines include Staff/AOH ($21,504,000) and Marketing ($675,000)",
              ]}
            />
            <div className="mt-4 text-xs text-black/45">
              Based on the current financial projection model.
            </div>
          </Card>

          <Card title="Financial Projection Assumptions">
            <BulletList
              items={[
                "Year 1 projects approximately a $290K loss while targeting operational profitability by Q2.",
                "Core strategy is a three-prong marketing approach with acquisitions of social and ecommerce platforms.",
                "Pre-launch shopper membership is modeled at $2.50/month with advance payment terms.",
                "Standard shopper membership is modeled at $5/month, with non-member usage fees and vendor report revenue streams.",
              ]}
            />
          </Card>
        </div>

        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-black/90">Disclosure</h3>
          <p className="mt-2 text-sm text-black/70">
            Any financial figures shown in Phase 1 are illustrative estimates
            for presentation purposes and do not guarantee future outcomes.
            Phase 2 should replace these with validated assumptions and formal
            modeling.
          </p>
        </div>

        <SectionEvidencePanel
          title="Projections"
          pages={[23, 25, 26]}
          summaryColClass="lg:col-span-3"
          evidenceColClass="lg:col-span-9"
          evidenceGridClassName="grid gap-6"
          previewAspectClass="aspect-[16/9]"
          previewFramePaddingClass="p-0"
          useSlideCrop={false}
          summary={[
            "Revenue progression starts with acquisition-driven contributions, then membership and advertising streams.",
            "Year 1 assumptions center on member growth, vendor participation, and phased launch timing.",
            "Year 1-to-Year 2 analysis is presented as moving from early buildout into strong profitability.",
          ]}
          takeaway="Financial framing emphasizes a transition from launch-phase pressure to year-two operating strength."
        />
      </SectionShell>

      {/* Raise */}
      <div id="capitalization" className="scroll-mt-56 md:scroll-mt-48" />
      <div id="capital-raise-pre-ipo" className="scroll-mt-56 md:scroll-mt-48" />
      <SectionShell id="raise">
        <SectionHeader
          kicker="Capital plan"
          title="Investor Capitalization & Milestones"
          subtitle="Phase 1 Framing: seed round to complete build + rollout, followed by a larger round aligned to expansion."
          right={
            <>
              <Pill>Seed</Pill>
              <Pill>Expansion</Pill>
              <Pill>Public pathway</Pill>
            </>
          }
        />

        <div className="mt-8 grid gap-6 md:grid-cols-12">
          <div className="relative md:col-span-7 rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
            <button
              type="button"
              onClick={() => setExpandedChart("raise-flow")}
              className="absolute right-3 top-3 z-10 rounded-full border border-black/15 bg-white/95 px-3 py-1 text-[11px] font-medium text-black/70 hover:border-black/30"
            >
              Click to enlarge
            </button>
            <div className="h-[400px] sm:h-[520px] md:h-[620px]">
              <button
                type="button"
                onClick={() => setExpandedChart("raise-flow")}
                className="block h-full w-full cursor-zoom-in"
                aria-label="Expand raise flow chart"
              >
                {renderChartByKey("raise-flow")}
              </button>
            </div>
            <div className="mt-3 text-xs text-black/60">
              Raise Flow (Mock) — Phase 2: add compliance + timing criteria.
            </div>
          </div>

          <div className="md:col-span-5 grid gap-6">
            <Card title="Capital Raise Pre-IPO">
              <BulletList
                items={[
                  "Current model uses a pre-money valuation of $8,000,000 at $0.04/share.",
                  "New equity raised tracked in cap materials: $750,000.",
                  "Seed completion is still aligned to Phase 1 to Phase 2 build-out and rollout readiness.",
                ]}
              />
            </Card>

            <div id="draft-cap-table" className="scroll-mt-56 md:scroll-mt-48" />
            <Card title="Draft Cap Table Snapshot (As Of Feb 16, 2026)">
              <BulletList
                items={[
                  "Authorized shares: 190,000,000 Common and 10,000,000 Preferred.",
                  "Issued and outstanding: 81,000,000 Common; 0 Preferred.",
                  "Cash raised shown in cap table package: $750,000.",
                  "Summary ownership percentages and shareholder rows are included in the attached workbook for diligence review.",
                ]}
              />
            </Card>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card title="OTC Pathway (If Applicable)" right="Illustrative">
            Registering to OTC can require reporting setup and audit readiness;
            Phase 2 should add compliance details.
          </Card>
          <Card title="Expansion Milestone">
            Complete equity acquisitions of revenue-generating social media and
            eCommerce platforms.
          </Card>
          <Card title="NASDAQ Pathway (If Applicable)" right="Illustrative">
            Contingent on meeting regulatory requirements; Phase 2 should
            formalize timing and criteria.
          </Card>
        </div>

        <SectionEvidencePanel
          title="Capital Raise Pre-IPO"
          pages={[27]}
          summary={[
            "Bridge raise target is presented at $750K to $1.0M for pre-IPO execution.",
            "Use of proceeds includes registration/legal work, initial audit work, and capital-raise expenses.",
            "General company operating coverage is included as a use-of-funds category.",
          ]}
          takeaway="This capital stage is positioned as a bridge to public-market readiness and scaling actions."
        />
      </SectionShell>

      {/* Investor Information */}
      <SectionShell id="investor-information">
        <SectionHeader
          kicker="Investor Information"
          title="IPO Pathway And Advisor Package"
          subtitle="Governance readiness, reporting discipline, and advisor support structure."
          right={
            <>
              <Pill>Governance</Pill>
              <Pill>Reporting</Pill>
              <Pill>Listing readiness</Pill>
            </>
          }
        />

        <SectionEvidencePanel
          title="Investors"
          id="investor-overview"
          summary={[
            "This section presents the thesis for early investor interest in a rare AI + social-commerce approach.",
            "The section highlights principal investor participation and supporting investor biographies.",
            "Current fundraising narrative includes progress toward the initial raise target.",
            "Positioning stresses unusual category potential versus standard early-stage benchmarks.",
          ]}
          takeaway="The investor narrative emphasizes strategic conviction in category creation and long-term scale."
        />
        <SectionEvidencePanel
          title="IPO"
          id="ipo-readiness"
          pages={[28]}
          summary={[
            "The pathway outlines an initial seed raise followed by a larger post-reverse expansion raise.",
            "Planned sequence includes OTC registration/readiness and a conditional path toward NASDAQ standards.",
            "Growth capital is linked to acquisition completion and revenue model expansion.",
          ]}
          takeaway="Public-market strategy is framed as phased, compliance-dependent, and tied to operating milestones."
        />

        <div className="mt-8 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-7 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-black/90">
              Illustrative Public-Market Pathway
            </div>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-black/45">
                  Stage 1
                </div>
                <div className="mt-1 text-sm font-semibold text-black/85">
                  Governance + controls baseline
                </div>
                <div className="mt-1 text-xs text-black/60">
                  Board structure, accounting controls, audit preparation, and
                  legal readiness.
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-black/45">
                  Stage 2
                </div>
                <div className="mt-1 text-sm font-semibold text-black/85">
                  OTC-readiness (if pursued)
                </div>
                <div className="mt-1 text-xs text-black/60">
                  Reporting cadence, disclosures, compliance calendar, and
                  investor communications discipline.
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-black/45">
                  Stage 3
                </div>
                <div className="mt-1 text-sm font-semibold text-black/85">
                  Uplisting pathway (if criteria are met)
                </div>
                <div className="mt-1 text-xs text-black/60">
                  Revenue, governance, and reporting thresholds aligned with
                  exchange qualification standards.
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 grid gap-6">
            <div id="ipo-team" className="scroll-mt-56 md:scroll-mt-48" />
            <Card title="IPO Team">
              <BulletList
                items={[
                  "Corporate Counsel: Jesse Blue, ESQ — Sichenzia Ross Ference Carmel LLP",
                  "Auditors: Brian Zucker, CPA — RRBB Accountants + Advisors",
                  "IR/PR: Scott Powell — Skyline Corporate Communications Group, LLC",
                ]}
              />
              <div className="mt-3 text-xs text-black/60">
                Counsel, audit, and investor-communications partners are presented as core listing-readiness support.
              </div>
            </Card>

            <Card title="Investor Diligence Package">
              <BulletList
                items={[
                  "Corporate structure, cap table, and governance framework",
                  "Audited/attestable financial package and controls documentation",
                  "Risk disclosures: product, privacy, compliance, and execution",
                  "Milestone map tied to capital plan and growth assumptions",
                ]}
              />
            </Card>

            <Card title="Important Note" right="Illustrative Only">
              This section is not legal, tax, or securities advice. Counsel and
              qualified advisors should define jurisdiction-specific listing and
              reporting requirements.
            </Card>
          </div>
        </div>
      </SectionShell>

      {/* Platform / Backend */}
      <SectionShell id="backend">
        <SectionHeader
          kicker="Platform"
          title="What Backend Is Required To Make Elysium Real"
          subtitle="The pitch and simulator are Phase 1 storytelling. A production SmartMall requires secure accounts, commerce, data persistence, AI pipelines, and a high-fidelity rendering stack for realistic visuals (not low-poly mock quality)."
          right={
            <>
              <Pill>Auth</Pill>
              <Pill>Payments</Pill>
              <Pill>Data</Pill>
              <Pill>Security</Pill>
            </>
          }
        />

        <div className="mt-8 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-7 grid gap-6">
            <Card title="Core Platform Services" right="Phase 2 build">
              <BulletList
                items={[
                  "Accounts & identity: sign-up/login, MFA, roles (member/vendor/admin)",
                  "Product catalog + inventory: items, variants, pricing, availability",
                  "Cart + checkout: secure payments, taxes, shipping, refunds, chargebacks",
                  "Orders: order history, fulfillment status, returns workflow",
                  "Vendor portal: onboarding, product management, analytics dashboard",
                  "Social layer: follows, sharing, lists, comments (moderation needed)",
                  "Real-time rendering services: scene/profile delivery, variant switching, and latency-aware asset streaming",
                ]}
              />
            </Card>

            <Card title="Data + AI Foundation" right="Efficient approach">
              <BulletList
                items={[
                  "Event tracking: clicks, searches, saves, purchases (privacy-aware)",
                  "Personalization: features + recommendation service (online inference)",
                  "Model training loop: batch training + evaluation + rollout gates",
                  "Observability: metrics, logs, tracing, anomaly detection",
                  "Visual intelligence loop: capture fit/confidence outcomes to improve recommendations and render choices over time",
                ]}
              />
              <div className="mt-4 rounded-2xl border border-black/10 bg-black/5 p-4 text-xs text-black/60">
                Phase 2 upgrade: publish a complete architecture diagram
                (frontend/app → API/services → DB/storage → rec engine →
                rendering/asset pipeline → monitoring).
              </div>
            </Card>
          </div>

          <div className="md:col-span-5 grid gap-6">
            <Card title="Suggested Architecture (Investor-Friendly)">
              <BulletList
                items={[
                  "Frontend: Next.js (app router) for investor site + authenticated app",
                  "API layer: Next.js API routes or separate Node service (as scale grows)",
                  "Database: PostgreSQL for relational truth (users, orders, products)",
                  "Cache/queues: Redis for sessions, rate limits, job queues",
                  "File storage: object storage for high-resolution assets (CDN-backed, versioned)",
                  "Rendering pipeline: PBR material workflow, LOD strategy, texture compression, and scene streaming for realistic quality at runtime",
                  "Payments: Stripe for checkout, subscriptions, tax, webhooks",
                ]}
              />
            </Card>

            <Card title="Security & Governance (Required)">
              <BulletList
                items={[
                  "PII protection: encryption, least privilege, audit logs",
                  "Fraud controls: velocity limits, webhook verification, monitoring",
                  "Privacy: opt-in for sensitive signals, retention + deletion policies",
                  "Compliance readiness: logging, reporting, vendor contracts",
                ]}
              />
            </Card>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Stat
            label="Phase 2 output"
            value="Production-Ready Core"
            note="Auth + catalog + checkout + personalization + high-fidelity visual pipeline."
          />
          <Stat
            label="Data persistence"
            value="Postgres + Storage"
            note="Orders, users, vendors, assets, audit logs."
          />
          <Stat
            label="Scale plan"
            value="Services + Queues"
            note="Separate rec engine, rendering/asset services, background jobs, CDN."
          />
        </div>

        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-black/90">
            Why this matters to investors
          </h3>
          <p className="mt-2 text-sm text-black/70">
            The differentiator (AI Brain + SmartMall experience) only becomes
            defensible when the platform reliably supports secure commerce,
            persistent data, monitored AI systems, and realistic high-resolution
            rendering. Phase 2 formalizes this into architecture,
            implementation milestones, and measurable KPIs.
          </p>
        </div>
      </SectionShell>

      {/* Team */}
      <div
        id="management-leadership"
        className="scroll-mt-56 md:scroll-mt-48"
      />
      <SectionShell id="team">
        <SectionHeader
          kicker="Execution"
          title="Leadership"
          subtitle="Investors want confidence in execution: strong management, clear plan, and a disciplined approach to growth."
          right={
            <>
              <Pill>Strategy</Pill>
              <Pill>Finance</Pill>
              <Pill>Growth</Pill>
            </>
          }
        />

        <div className="mt-8 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-7 grid gap-4">
            <Card title="Dr. Michael Rivers — CEO / Managing Partner">
              Conceptual design lead and managing partner. Board leadership and
              strategic execution oversight. Background includes doctorate-level
              expertise in clinical psychology with emphasis on neurophysiology.
            </Card>

            <Card title="Sophia Xue — CFO">
              Financial strategy, modeling, and capital planning. Background
              includes senior finance roles spanning equity derivatives and risk
              monitoring (Nomura, Merrill Lynch, and PwC).
            </Card>

            <Card title="Jason Lynn — Chief Product Officer (CPO)">
              Product and platform leadership with consumer privacy and
              protection focus. Background includes co-founding mParticle (by
              Rokt) and privacy/consumer protection leadership.
            </Card>

            <Card title="Kori Rivers — Director of Marketing">
              (Central Florida major theme park hospitality)
            </Card>

            <div id="board-directors" className="scroll-mt-56 md:scroll-mt-48" />
            <Card title="Board Of Directors">
              To be announced.
            </Card>
          </div>

          <div className="md:col-span-5">
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-black/90">
                Operating Focus (Phase 1)
              </div>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-black/10 bg-black/5 p-4 text-sm text-black/75">
                  Build → validate → iterate (Phase 2 MVP)
                </div>
                <div className="rounded-2xl border border-black/10 bg-black/5 p-4 text-sm text-black/75">
                  Secure + monitor commerce + data pipelines
                </div>
                <div className="rounded-2xl border border-black/10 bg-black/5 p-4 text-sm text-black/75">
                  Scale via partnerships + acquisitions
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-black/10 bg-white p-4 text-xs text-black/60">
                Phase 2 add: org chart + hiring plan + advisors.
              </div>
            </div>
          </div>
        </div>

        <div
          id="special-advisors"
          className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
        >
          <h3 className="text-base font-semibold text-black/90">
            Special Advisors To the Company
          </h3>
          <p className="mt-2 text-sm text-black/70">
            To be announced.
          </p>
        </div>

        <SectionEvidencePanel
          title="Management Team"
          summary={[
            "Leadership content presents executive bios and role ownership across strategy, finance, product, and marketing.",
            "The team profile emphasizes operational delivery capability for Phase 1 and scale readiness for Phase 2.",
            "Management depth is positioned as a core risk-reduction factor for investors.",
          ]}
          takeaway="Execution confidence is anchored in role clarity, leadership background, and staged operating focus."
        />
      </SectionShell>

      {/* Contact */}
      <SectionShell id="contact">
        <div className="rounded-3xl border border-black/10 bg-white p-10 text-center shadow-sm">
          <h2 className="text-3xl font-semibold tracking-tight">
            Ready To Review Phase 1?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-black/70">
            This mockup is designed to communicate the opportunity,
            differentiation, and investor narrative clearly. Feedback is
            welcome—iteration will be fast.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              className="rounded-full bg-black px-7 py-3 text-sm font-semibold text-white hover:bg-black/90"
              href={DEMO_URL}
            >
              Open Simulator ↗
            </a>
            <a
              className="rounded-full border border-black/15 bg-white px-7 py-3 text-sm font-semibold text-black/80 hover:border-black/25"
              href={`mailto:${PASSWORD_REQUEST_EMAIL}`}
            >
              Contact Us
            </a>
          </div>

          <div className="mx-auto mt-8 max-w-3xl text-left">
            <div className="rounded-2xl border border-black/10 bg-black/5 p-4 text-xs text-black/60">
              <div className="font-semibold text-black/75">
                Phase 2 Checklist (Quick)
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <div>• Real system architecture + governance</div>
                <div>• TAM/SAM/SOM + wedge strategy</div>
                <div>• Competitive landscape + moat</div>
                <div>• Unit economics + validated KPI targets</div>
                <div>• Security/privacy posture (opt-in signals)</div>
                <div>• Pilot plan + traction dashboard</div>
              </div>
            </div>
          </div>
        </div>
      </SectionShell>

      {showPasswordRequestModal ? (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/60 px-6 py-10">
          <div className="w-full max-w-lg rounded-2xl border border-black/10 bg-white p-6 shadow-2xl">
            <div className="text-xs font-semibold uppercase tracking-wide text-black/45">
              Requires Password
            </div>
            <h3 className="mt-2 text-xl font-semibold text-black/90">Request Password</h3>
            <form className="mt-4 space-y-3" onSubmit={sendPasswordRequest}>
              <div>
                <label className="mb-1 block text-sm font-medium text-black/70" htmlFor="pw-full-name">
                  Full Name
                </label>
                <input
                  id="pw-full-name"
                  value={passwordRequestForm.fullName}
                  onChange={updatePasswordRequestForm("fullName")}
                  required
                  className="w-full rounded-xl border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-black/70" htmlFor="pw-contact-number">
                  Contact Number
                </label>
                <input
                  id="pw-contact-number"
                  value={passwordRequestForm.contactNumber}
                  onChange={updatePasswordRequestForm("contactNumber")}
                  required
                  className="w-full rounded-xl border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-black/70" htmlFor="pw-email-address">
                  Email Address
                </label>
                <input
                  id="pw-email-address"
                  type="email"
                  value={passwordRequestForm.emailAddress}
                  onChange={updatePasswordRequestForm("emailAddress")}
                  required
                  className="w-full rounded-xl border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-black/70" htmlFor="pw-comments">
                  Comment
                </label>
                <textarea
                  id="pw-comments"
                  value={passwordRequestForm.comments}
                  onChange={updatePasswordRequestForm("comments")}
                  rows={3}
                  className="w-full rounded-xl border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/35"
                />
              </div>
              <div className="flex flex-wrap justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closePasswordRequestModal}
                  className="rounded-full border border-black/15 bg-white px-5 py-2 text-sm font-semibold text-black/75 hover:border-black/30"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-black/90"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {expandedChart ? (
        <div
          className="fixed inset-0 z-[98] flex items-center justify-center bg-black/75 px-4 py-6"
          onClick={() => setExpandedChart(null)}
        >
          <div
            className="w-full max-w-7xl rounded-2xl border border-black/10 bg-white p-4 shadow-2xl md:p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-black/80">Expanded Chart View</div>
              <button
                type="button"
                className="rounded-full border border-black/15 bg-white px-3 py-1 text-xs font-medium text-black/70 hover:border-black/30"
                onClick={() => setExpandedChart(null)}
              >
                Close
              </button>
            </div>
            <div className="h-[82vh] w-full rounded-xl border border-black/10 bg-[#fafafa] p-3 md:p-4">
              {renderChartByKey(expandedChart, true)}
            </div>
          </div>
        </div>
      ) : null}

      {TERMS_GATE_ENABLED && termsStatus === "pending" ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-6 py-10">
          <div className="w-full max-w-6xl rounded-3xl border border-black/10 bg-white p-6 shadow-2xl md:p-8">
            <div className="mx-auto max-h-[68vh] overflow-auto rounded-2xl border border-black/10">
              <Image
                src={INVESTOR_POPUP_IMAGE}
                alt="Investor terms and conditions"
                width={1400}
                height={1800}
                className="h-auto w-full"
                priority
              />
            </div>
            <p className="mt-8 text-center text-base font-medium text-black/85 md:mt-10 md:text-lg">
              I have read and understand the terms and conditions and accept them.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={acceptTerms}
                className="rounded-full bg-black px-8 py-3.5 text-sm font-semibold text-white hover:bg-black/90 md:text-base"
              >
                ACCEPT
              </button>
              <button
                type="button"
                onClick={rejectTerms}
                className="rounded-full border border-black/20 bg-white px-8 py-3.5 text-sm font-semibold text-black/80 hover:border-black/35 md:text-base"
              >
                REJECT
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <footer className="border-t border-black/10 py-10 text-center text-xs text-black/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 sm:flex-row">
          <span>
            © {new Date().getFullYear()} Elysium — Phase 1 Investor Website
            (AI-assisted mockup) • Simulator is cosmetic-only for concept storytelling
          </span>
          <div className="flex items-center gap-3 text-xs">
            <span>Post News in Window Frames</span>
            <a className="underline decoration-black/20 hover:decoration-black/45" href="#contact">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
