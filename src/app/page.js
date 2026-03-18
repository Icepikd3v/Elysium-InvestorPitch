"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ClientNav from "@/components/ClientNav";

import RolloutTimelineIllustration from "@/components/illustrations/RolloutTimelineIllustration";
import RevenueYearOneChartMock from "@/components/illustrations/RevenueYearOneChart";
import RevenueYear1Year2ChartMock from "@/components/illustrations/RevenueYearTwoChart";
import RaiseFlowIllustration from "@/components/illustrations/RaiseFlowIllustration";
import MarketOpportunityIllustration from "@/components/illustrations/MarketOpportunityIllustration";
import IllustrationImage from "@/components/illustrations/IllustrationImage";

/**
 * Phase 1 Investor Website (Pitch Narrative + Illustration-Forward)
 * - Pitch-deck storytelling: Problem → Solution → Product → AI → Avatar → GTM → Rollout → Financials → Raise → Platform → Team → Contact
 * - Phase 1 is intentionally "mock-forward" for narrative clarity.
 * - Mock visuals + demo are AI-assisted and not a final/accurate representation of production fidelity.
 * - Phase 2 swaps in real system diagrams, validated metrics, and implemented backend architecture.
 */

const DEMO_URL = "https://demo.elysiummall.com"; // Smart Mall mock experience domain
const INVESTOR_POPUP_IMAGE = "/illustrations/InvestorPopup.png";
const SOLO_BRAIN_VIDEO = "/soloAIBrain.mp4";
const INVITE_FRIEND_AI_BRAIN_VIDEO = "/InviteFriendSimDemo.mp4";
const ORIGINAL_NARRATION_AUDIO =
  "/voiceovers/full-experience-narration-sequence.mp3";
const SIMULATION_NARRATION_AUDIO =
  "/voiceovers/simulation-voiceover-20260318.m4a";
// Kori note (Mar 18, 2026): start simulation video after first paragraph finishes.
// Tune this value if updated voiceover pacing changes.
const SIMULATION_VIDEO_LEAD_IN_SECONDS = 26;
// HOLD (Kori go-live pending): keep terms gate code built but disabled for now.
// Re-enable by switching this back to:
// process.env.NEXT_PUBLIC_ENABLE_INVESTOR_TERMS_GATE === "true"
const TERMS_GATE_ENABLED = true;

const SECTIONS = [
  { id: "cover", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "product", label: "Smart Mall" },
  { id: "ai", label: "AI Brain" },
  { id: "avatar", label: "Shop Experience" },
  { id: "gtm", label: "Go-to-market" },
  { id: "rollout", label: "Rollout" },
  { id: "financials", label: "Financials" },
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
      { id: "cover", label: "Overview" },
      { id: "problem", label: "Problem" },
      { id: "solution", label: "Solution" },
    ],
  },
  {
    label: "Experience",
    children: [
      { id: "ai", label: "AI Brain" },
      { id: "avatar", label: "Shop Experience" },
    ],
  },
  { id: "product", label: "Smart Mall" },
  { id: "gtm", label: "Go-to-market" },
  { id: "rollout", label: "Rollout" },
  { id: "financials", label: "Financials" },
  { id: "raise", label: "Investor Capitalization" },
  { id: "investor-information", label: "Investor Information" },
  { id: "backend", label: "Platform" },
  { id: "team", label: "Team" },
  { id: "contact", label: "Contact" },
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWaitingForLeadIn, setIsWaitingForLeadIn] = useState(false);
  const [hasVideoStarted, setHasVideoStarted] = useState(false);

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
    if (videoLeadInTimeoutRef.current) {
      clearTimeout(videoLeadInTimeoutRef.current);
      videoLeadInTimeoutRef.current = null;
    }
    video.pause();
    narration.pause();
    video.currentTime = 0;
    narration.currentTime = 0;
    setHasVideoStarted(false);
    setIsWaitingForLeadIn(false);
    try {
      await narration.play();

      setIsPlaying(true);
      setIsWaitingForLeadIn(true);
      videoLeadInTimeoutRef.current = setTimeout(async () => {
        try {
          await video.play();
          setIsWaitingForLeadIn(false);
        } catch {}
      }, SIMULATION_VIDEO_LEAD_IN_SECONDS * 1000);
    } catch {
      setIsPlaying(false);
      setIsWaitingForLeadIn(false);
    }
  };

  const syncOnVideoPlay = async () => {
    if (videoLeadInTimeoutRef.current) {
      clearTimeout(videoLeadInTimeoutRef.current);
      videoLeadInTimeoutRef.current = null;
    }
    setHasVideoStarted(true);
    setIsWaitingForLeadIn(false);
    await playNarrationIfPaused();
  };

  const pausePlayback = () => {
    if (videoLeadInTimeoutRef.current) {
      clearTimeout(videoLeadInTimeoutRef.current);
      videoLeadInTimeoutRef.current = null;
    }
    [videoRef.current, narrationRef.current].filter(Boolean).forEach((node) => node.pause());
    setIsPlaying(false);
    setIsWaitingForLeadIn(false);
    setHasVideoStarted(false);
  };

  useEffect(() => {
    return () => {
      if (videoLeadInTimeoutRef.current) {
        clearTimeout(videoLeadInTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-3">
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
            ? "Audio playing. Video auto-starts at 00:26."
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
          onPause={() => setIsPlaying(false)}
          onEnded={pausePlayback}
        />
      </div>

      <audio
        ref={narrationRef}
        src={SIMULATION_NARRATION_AUDIO}
        preload="metadata"
        onEnded={() => {
          setIsPlaying(false);
          setIsWaitingForLeadIn(false);
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
    <section id={id} className="mx-auto max-w-6xl px-6 py-16">
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

  const acceptTerms = () => {
    setTermsStatus("accepted");
  };

  const rejectTerms = () => {
    setTermsStatus("rejected");
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
    <main className="min-h-screen bg-[#fafafa] text-black">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#fafafa]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#cover" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-black/10 bg-white text-xs font-semibold text-black/70">
              E
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">Elysium</div>
              <div className="text-xs text-black/60">
                Phase 1 Investor Mockup
              </div>
            </div>
          </a>

          <ClientNav sections={SECTIONS} items={NAV_ITEMS} />

          <div className="flex items-center gap-2">
            <a
              href="#cover"
              className="rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-medium text-black/80 hover:border-black/25"
            >
              Home
            </a>
          </div>
        </div>

        {/* Phase 1 disclaimer ribbon */}
        <div className="border-t border-black/10 bg-white/60">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-3 text-xs text-black/65 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-black/10 bg-white px-3 py-1 font-medium">
                Phase 1
              </span>
              <span>
                This page + visuals are <strong>AI-assisted mockups</strong> for
                narrative clarity. The demo is a{" "}
                <strong>mock experience</strong> (cosmetic) and not{" "}
                <strong>production-grade</strong>.
              </span>
            </div>

            <div className="flex flex-col items-end gap-1">
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-4 py-2 font-medium text-black/80 hover:border-black/25"
              >
                Open Smart Mall Experience ↗
              </a>
              <div className="text-[11px] text-black/55">
                Demo hosted at demo.elysiummall.com
              </div>
              <a
                href="#ai-brain-simulation"
                className="mt-1 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#0f172a] via-[#1d4ed8] to-[#0ea5e9] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-110"
              >
                Jump to Simulation Video ↓
              </a>
            </div>
          </div>
        </div>
      </header>

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
                <Pill>Virtual Smart Mall</Pill>
                <Pill>AI Brain</Pill>
                <Pill>Social + eCommerce</Pill>
                <Pill>AI-assisted mock</Pill>
              </div>

              <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                Multi-dimensional immersion into a virtual shopping experience.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-black/70">
                Elysium is envisioned as a <strong>virtual smart mall</strong>{" "}
                that blends social interaction with commerce—powered by an{" "}
                <strong>AI Brain</strong> that learns from{" "}
                <strong>word data</strong>, <strong>physical cues</strong>, and{" "}
                <strong>reactions</strong>, which improves predictability by
                analyzing a compilation of human variables to &ldquo;learn and
                know&rdquo; not just one shopper, but like shoppers as well. This
                enhances the Smart Mall experience.
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
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-black/15 bg-white px-6 py-3 text-center text-sm font-semibold text-black/80 hover:border-black/25"
                >
                  View the Smart Mall experience ↗
                </a>
              </div>

              <div className="mt-3 text-xs text-black/60">
                Demo hosted at demo.elysiummall.com
              </div>

              <div className="mt-4 max-w-xl rounded-2xl border border-black/10 bg-black/5 p-4 text-xs text-black/65">
                <div className="font-semibold text-black/75">
                  Demo note (important)
                </div>
                <div className="mt-1">
                  The Smart Mall demo is a <strong>mock UI/experience</strong>{" "}
                  created with AI assistance for presentation purposes. It is{" "}
                  <strong>not</strong> production-grade and does not represent
                  final rendering, physics, inventory, or full commerce logic
                  yet.
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2 text-xs text-black/60">
                <Pill>Personalized discovery</Pill>
                <Pill>Avatar try-on concept</Pill>
                <Pill>Lower returns</Pill>
                <Pill>Higher conversion</Pill>
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-[#fafafa] p-4">
              <div className="relative h-[360px] md:h-[380px]">
                <IllustrationImage
                  src="/illustrations/store2.png"
                  alt="Smart mall storefront hero visual"
                  fit="cover"
                />
                <div className="pointer-events-none absolute left-[18px] top-[18px] h-[calc(100%-36px)] w-[6px] rounded-full bg-[#fafafa]" />
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
                    target="_blank"
                    rel="noopener noreferrer"
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

          {/* Market opportunity */}
          <div className="relative mt-8 space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Stat
                label="Positioning"
                value="Virtual Smart Mall"
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
      </SectionShell>

      {/* Problem */}
      <SectionShell id="problem">
        <SectionHeader
          kicker="The problem"
          title="Digital shopping is still frustrating"
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
          <Card title="User pain">
            <BulletList
              items={[
                "Low confidence without try-on → higher return rates",
                "Uncertainty causes cart abandonment",
                "Shopping is isolated (not social)",
              ]}
            />
          </Card>

          <Card title="Vendor pain">
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
            Phase 1 framing
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
      <SectionShell id="solution">
        <SectionHeader
          kicker="The solution"
          title="A Smart Mall that feels guided, social, and predictive"
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
          <Card title="What changes for shoppers">
            <BulletList
              items={[
                "Guided discovery (voice/chat + experience), not just search",
                "Try-on concept (avatar) to visualize before buying",
                "Shop with friends inside the platform",
              ]}
            />
          </Card>

          <Card title="What changes for vendors">
            <BulletList
              items={[
                "Better targeting via predictability engine",
                "Higher conversion through reduced friction",
                "More consistent exposure via ‘mall’ layout",
              ]}
            />
          </Card>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card title="Predictability">
            The AI Brain learns over time and improves recommendation relevance.
          </Card>
          <Card title="Lower returns">
            Try-on confidence reduces guesswork and post-purchase regret.
          </Card>
          <Card title="Higher conversion">
            Social + guidance drives engagement and purchases.
          </Card>
        </div>
      </SectionShell>

      {/* Product Experience */}
      <SectionShell id="product">
        <SectionHeader
          kicker="Product experience"
          title="Smart Mall experience (Phase 1 demo)"
          subtitle="Phase 1 includes an investor narrative site (this page) plus a separate mock Smart Mall experience (demo) for visual storytelling."
          right={
            <>
              <Pill>Investor page</Pill>
              <Pill>Mock demo</Pill>
              <Pill>AI-assisted</Pill>
            </>
          }
        />

        <div className="mt-6 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-black/90">
                Two-part Phase 1 setup
              </div>

              <BulletList
                items={[
                  "Investor pitch site (Next.js): narrative + visuals + roadmap (current page)",
                  "Mock Smart Mall demo (Elysium-prototype): cosmetic walkthrough to show the concept",
                  "Both are AI-assisted mockups for speed and clarity—not final realism",
                ]}
              />

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  href={DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-black px-6 py-3 text-center text-sm font-semibold text-white hover:bg-black/90"
                >
                  Open Smart Mall Experience ↗
                </a>

                <a
                  href="#backend"
                  className="rounded-full border border-black/15 bg-white px-6 py-3 text-center text-sm font-semibold text-black/80 hover:border-black/25"
                >
                  See platform + backend plan
                </a>
              </div>

              <div className="mt-2 text-xs text-black/60">
                Demo is a presentation prototype hosted at demo.elysiummall.com.
              </div>
              <div className="mt-1 text-xs font-medium text-black/70">
                Click to use yourself.
              </div>

              <div className="mt-5 rounded-2xl border border-black/10 bg-black/5 p-4 text-xs text-black/65">
                <div className="font-semibold text-black/75">
                  Presentation disclaimer
                </div>
                <div className="mt-1">
                  The demo is intentionally simplified, AI-assisted, and focused
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
                  src="/illustrations/store3.png"
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
              Smart Mall Mock (Hero) — click to use yourself
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card title="Social + eCommerce">
            A combined social-media experience with commerce—users can share,
            discover, and shop together inside the platform.
          </Card>
          <Card title="Guided discovery layer">
            Discovery becomes interactive (assistant + context), improving
            relevance and reducing friction vs. static listings.
          </Card>
        </div>
      </SectionShell>

      {/* AI */}
      <SectionShell id="ai">
        <SectionHeader
          kicker="System narrative"
          title="How the AI Brain works"
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
            <Card title="Investor takeaway" right="Phase 1 framing">
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
                Original AI Brain narrated clip
              </div>
              <div className="mt-1 text-sm text-black/60">
                Existing clip kept unchanged for reference.
              </div>
              <div className="mt-4">
                <SyncedSoloDemoPlayer />
              </div>
            </div>

            <div
              id="ai-brain-simulation"
              className="mt-4 rounded-3xl border border-black/10 bg-white p-4 shadow-sm"
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

      </SectionShell>

      {/* Shop Experience */}
      <SectionShell id="avatar">
        <SectionHeader
          kicker="Shop experience"
          title="Avatar-based shop experience to reduce returns"
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
          <Card title="Why it matters">
            <BulletList
              items={[
                "Improves confidence before purchase (fit + style preview)",
                "Reduces returns by decreasing uncertainty",
                "Supports diverse shoppers regardless of physical limitations",
              ]}
            />
          </Card>

          <Card title="Phase 1 flow (mock)">
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

      </SectionShell>

      {/* GTM */}
      <SectionShell id="gtm">
        <SectionHeader
          kicker="Growth"
          title="Three-prong go-to-market"
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
          <Card title="Prong 1 — Traditional/Direct marketing">
            <BulletList
              items={[
                "Advertising (TV, internet, media) to drive awareness and demand",
                "Performance marketing aligned to conversion + retention KPIs",
              ]}
            />
          </Card>

          <Card title="Prong 2 + 3 — Acquire platforms">
            <BulletList
              items={[
                "Acquire smaller social media platforms (convert users into members)",
                "Acquire smaller eCommerce platforms (vendors + existing revenues)",
                "Elysium benefits from both because it is social + commerce",
              ]}
            />
          </Card>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card title="Revenue levers">
            Memberships, vendor subscriptions, advertising, and commerce
            take-rate.
          </Card>
          <Card title="Distribution advantage">
            Acquisitions bootstrap user base and shorten time-to-scale.
          </Card>
          <Card title="Platform compounding">
            Better predictability → better conversion → stronger vendor demand.
          </Card>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="h-[300px] md:h-[360px]">
              <IllustrationImage
                src="/illustrations/Prong1.png"
                alt="Pitch deck slide summarizing prong one traditional marketing development"
                fit="contain"
              />
            </div>
            <div className="mt-3 text-xs text-black/60">
              Deck support visual: Prong One traditional marketing.
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="h-[300px] md:h-[360px]">
              <IllustrationImage
                src="/illustrations/prong2-3.png"
                alt="Pitch deck slide summarizing prong two and three acquisition strategy"
                fit="contain"
                className="overflow-hidden rounded-xl"
                imageStyle={{
                  clipPath: "inset(0 0 0 8px)",
                  transform: "translate(5px, 2px) scale(1.024)",
                }}
              />
            </div>
            <div className="mt-3 text-xs text-black/60">
              Deck support visual: Prong Two and Prong Three acquisitions.
            </div>
          </div>
        </div>
      </SectionShell>

      {/* Rollout */}
      <SectionShell id="rollout">
        <SectionHeader
          kicker="Plan"
          title="Projected rollout schedule"
          subtitle="A staged approach focused on product completion, acquisition-driven scale, and revenue rollout."
          right={
            <>
              <Pill>Build</Pill>
              <Pill>Validate</Pill>
              <Pill>Expand</Pill>
            </>
          }
        />

        <div className="mt-8 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-7 rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="h-[420px] md:h-[460px]">
              <RolloutTimelineIllustration variant="svg" mode="fill" />
            </div>
          </div>

          <div className="md:col-span-5">
            <Card title="Best-practice upgrades (Phase 2)">
              <BulletList
                items={[
                  "Add competitive landscape slide (positioning vs Amazon/Etsy/etc.)",
                  "Add market sizing (TAM/SAM/SOM) + first wedge segment",
                  "Add traction plan: pilot KPIs, cohort retention, conversion lift, return reduction",
                  "Add security/privacy posture: consent, storage policy, monitoring",
                  "Replace mock rollout with a validated plan and dependencies",
                ]}
              />
            </Card>
          </div>
        </div>

      </SectionShell>

      {/* Financials */}
      <SectionShell id="financials">
        <SectionHeader
          kicker="Business model"
          title="Financial upside & implementation plan"
          subtitle="Phase 1 uses illustrative snapshots and assumptions. Phase 2 should incorporate validated metrics, unit economics, and real forecasts."
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
            label="Revenue streams"
            value="eComm + Ads + Subscriptions"
            note="Example buckets; refine with real assumptions."
          />
          <Stat
            label="Key KPI targets"
            value="↑ Conversion / ↓ Returns"
            note="Powered by predictability + try-on confidence."
          />
          <Stat
            label="Operating model"
            value="Platform + Partnerships"
            note="Brands, creators, and marketplaces as multipliers."
          />
        </div>

        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="h-[440px] md:h-[520px]">
            <IllustrationImage
              src="/illustrations/graph4.png"
              alt="Revenue projections year one and two from investor deck"
              fit="contain"
            />
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="h-[420px] md:h-[500px]">
            <IllustrationImage
              src="/illustrations/model2.png"
              alt="Business model and revenue sequence slide from pitch deck"
              fit="contain"
            />
          </div>
          <div className="mt-3 text-xs text-black/60">
            Business model slide from current pitch deck export.
          </div>
        </div>

        <div className="mt-6 grid items-start gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="w-full aspect-[920/360]">
              <RevenueYearOneChartMock />
            </div>
            <div className="mt-3 text-xs text-black/60">
              Revenue Year 1 (Mock) — Phase 2: replace with validated unit
              economics.
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="w-full aspect-[920/360]">
              <RevenueYear1Year2ChartMock />
            </div>
            <div className="mt-3 text-xs text-black/60">
              Revenue Year 1 vs Year 2 (Mock) — Phase 2: replace with forecast
              model.
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card title="Illustrative assumptions (Phase 1 framing)">
            <BulletList
              items={[
                "Assumes ~8–9M member base driven by acquisitions (illustrative)",
                "~500 vendors generating membership + advertising revenues (illustrative)",
                "Growth assumption based on one-dimensional commerce baselines (illustrative)",
              ]}
            />
            <div className="mt-4 text-xs text-black/45">
              These are presentation assumptions for Phase 1 and do not
              guarantee outcomes.
            </div>
          </Card>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-black/90">
                  Financial Snapshot (Phase 1)
                </div>
                <div className="mt-1 text-xs text-black/55">
                  Illustrative only — swap to validated metrics in Phase 2.
                </div>
              </div>
              <span className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs text-black/70">
                Snapshot
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-medium text-black/50">Revenue</div>
                <div className="mt-2 text-sm text-black/75">• eComm</div>
                <div className="text-sm text-black/75">• Ads</div>
                <div className="text-sm text-black/75">• Subscriptions</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-medium text-black/50">KPIs</div>
                <div className="mt-2 text-sm text-black/75">• ↑ Conversion</div>
                <div className="text-sm text-black/75">• ↓ Returns</div>
                <div className="text-sm text-black/75">• ↑ Retention</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-medium text-black/50">Rollout</div>
                <div className="mt-2 text-sm text-black/75">
                  • Pilot → Expand
                </div>
                <div className="text-sm text-black/75">• Partnerships</div>
                <div className="text-sm text-black/75">• M&A</div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-black/5 p-4">
              <div className="text-xs font-medium text-black/60">
                Milestone logic (mock)
              </div>
              <div className="mt-2 text-xs text-black/55">
                Predictability improvements + try-on confidence → return-rate
                reduction → conversion lift → vendor demand → revenue scale.
              </div>
            </div>
          </div>
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
      </SectionShell>

      {/* Raise */}
      <SectionShell id="raise">
        <SectionHeader
          kicker="Capital plan"
          title="Investor Capitalization & milestones"
          subtitle="Phase 1 framing: seed round to complete build + rollout, followed by a larger round aligned to expansion."
          right={
            <>
              <Pill>Seed</Pill>
              <Pill>Expansion</Pill>
              <Pill>Public pathway</Pill>
            </>
          }
        />

        <div className="mt-8 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-7 rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="h-[360px]">
              <RaiseFlowIllustration variant="image" fit="contain" />
            </div>
            <div className="mt-3 text-xs text-black/60">
              Raise Flow (Mock) — Phase 2: add compliance + timing criteria.
            </div>
          </div>

          <div className="md:col-span-5 grid gap-6">
            <Card title="Two rounds (Phase 1 framing)">
              <BulletList
                items={[
                  "Seed round: $750K–$1M (illustrative) to finalize Phase 1→Phase 2 build-out",
                  "Post-reverse / expansion round: target $10M–$15M (illustrative) to scale acquisitions and growth",
                ]}
              />
            </Card>

            <Card title="Use of proceeds (best-practice)">
              <BulletList
                items={[
                  "Product + AI engineering (recommendations, safety, monitoring)",
                  "Pilot + onboarding (vendors, members, partnerships)",
                  "Data governance + privacy controls (opt-in signals, security)",
                  "Acquisition diligence + integration roadmap",
                ]}
              />
            </Card>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card title="OTC pathway (if applicable)" right="Illustrative">
            Registering to OTC can require reporting setup and audit readiness;
            Phase 2 should add compliance details.
          </Card>
          <Card title="Expansion milestone">
            Complete equity acquisitions of revenue-generating social media and
            eCommerce platforms.
          </Card>
          <Card title="NASDAQ pathway (if applicable)" right="Illustrative">
            Contingent on meeting regulatory requirements; Phase 2 should
            formalize timing and criteria.
          </Card>
        </div>
      </SectionShell>

      {/* Investor Information */}
      <SectionShell id="investor-information">
        <SectionHeader
          kicker="Investor Information"
          title="Pathway for going public"
          subtitle="Illustrative pathway for readiness, reporting discipline, and exchange qualification milestones."
          right={
            <>
              <Pill>Governance</Pill>
              <Pill>Reporting</Pill>
              <Pill>Listing readiness</Pill>
            </>
          }
        />

        <div className="mt-8 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-7 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-black/90">
              Illustrative public-market pathway
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
            <Card title="Investor diligence package">
              <BulletList
                items={[
                  "Corporate structure, cap table, and governance framework",
                  "Audited/attestable financial package and controls documentation",
                  "Risk disclosures: product, privacy, compliance, and execution",
                  "Milestone map tied to capital plan and growth assumptions",
                ]}
              />
            </Card>

            <Card title="Important note" right="Illustrative only">
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
          title="What backend is required to make Elysium real"
          subtitle="The pitch and demo are Phase 1 storytelling. A production Smart Mall requires secure accounts, commerce, data persistence, AI pipelines, and a high-fidelity rendering stack for realistic visuals (not low-poly mock quality)."
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
            <Card title="Core platform services" right="Phase 2 build">
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

            <Card title="Data + AI foundation" right="Efficient approach">
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
            <Card title="Suggested architecture (investor-friendly)">
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

            <Card title="Security & governance (required)">
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
            value="Services + queues"
            note="Separate rec engine, rendering/asset services, background jobs, CDN."
          />
        </div>

        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-black/90">
            Why this matters to investors
          </h3>
          <p className="mt-2 text-sm text-black/70">
            The differentiator (AI Brain + Smart Mall experience) only becomes
            defensible when the platform reliably supports secure commerce,
            persistent data, monitored AI systems, and realistic high-resolution
            rendering. Phase 2 formalizes this into architecture,
            implementation milestones, and measurable KPIs.
          </p>
        </div>
      </SectionShell>

      {/* Team */}
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
              expertise in clinical psychology with emphasis on neurophysiology
              (as presented in Phase-1 deck).
            </Card>

            <Card title="Sophia Xue — CFO">
              Financial strategy, modeling, and capital planning. Background
              includes senior finance roles spanning equity derivatives and risk
              monitoring (Nomura, Merrill Lynch, PwC as presented in Phase-1
              deck).
            </Card>

            <Card title="Jason Lynn — Chief Product Officer (CPO)">
              Product and platform leadership with consumer privacy and
              protection focus. Background includes co-founding mParticle (by
              Rokt) and privacy/consumer protection leadership (as presented in
              Phase-1 deck).
            </Card>

            <Card title="Kori Rivers — Director of Marketing">
              (Central Florida major theme park hospitality)
            </Card>
          </div>

          <div className="md:col-span-5">
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-black/90">
                Operating focus (Phase 1)
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

        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-black/90">
            Special Advisors to the Company
          </h3>
          <p className="mt-2 text-sm text-black/70">
            David Cheriton, Leon Black, and Paul Erickson.
          </p>
        </div>
      </SectionShell>

      {/* Contact */}
      <SectionShell id="contact">
        <div className="rounded-3xl border border-black/10 bg-white p-10 text-center shadow-sm">
          <h2 className="text-3xl font-semibold tracking-tight">
            Ready to review Phase 1?
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
              target="_blank"
              rel="noopener noreferrer"
            >
              Open the Smart Mall Experience ↗
            </a>
            <a
              className="rounded-full border border-black/15 bg-white px-7 py-3 text-sm font-semibold text-black/80 hover:border-black/25"
              href="mailto:sam.d3v.35@gmail.com"
            >
              Contact
            </a>
          </div>

          <div className="mx-auto mt-8 max-w-3xl text-left">
            <div className="rounded-2xl border border-black/10 bg-black/5 p-4 text-xs text-black/60">
              <div className="font-semibold text-black/75">
                Phase 2 checklist (quick)
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

      {TERMS_GATE_ENABLED && termsStatus === "pending" ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-6 py-10">
          <div className="w-full max-w-4xl rounded-3xl border border-black/10 bg-white p-5 shadow-2xl md:p-7">
            <div className="mx-auto max-h-[56vh] overflow-auto rounded-2xl border border-black/10">
              <Image
                src={INVESTOR_POPUP_IMAGE}
                alt="Investor terms and conditions"
                width={1400}
                height={1800}
                className="h-auto w-full"
                priority
              />
            </div>
            <p className="mt-3 text-center text-xs text-black/60 md:text-sm">
              Legal copy update applied: <strong>Copyright</strong> and{" "}
              <strong>Trademark</strong>.
            </p>

            <p className="mt-5 text-center text-sm font-medium text-black/85 md:text-base">
              I have read and understand the terms and conditions and accept them.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={acceptTerms}
                className="rounded-full bg-black px-7 py-3 text-sm font-semibold text-white hover:bg-black/90"
              >
                ACCEPT
              </button>
              <button
                type="button"
                onClick={rejectTerms}
                className="rounded-full border border-black/20 bg-white px-7 py-3 text-sm font-semibold text-black/80 hover:border-black/35"
              >
                REJECT
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <footer className="border-t border-black/10 py-10 text-center text-xs text-black/50">
        © {new Date().getFullYear()} Elysium — Phase 1 Investor Website
        (AI-assisted mockup) • Demo is cosmetic-only for concept storytelling
      </footer>
    </main>
  );
}
