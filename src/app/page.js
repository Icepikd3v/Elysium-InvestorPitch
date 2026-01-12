// app/page.js (or src/app/page.js)
"use client";

import { useEffect, useMemo, useState } from "react";

import AIBrainDiagram from "@/components/illustrations/AIBrainDiagram";
import MallLaptopMock from "@/components/illustrations/MallLaptopMock";
import MallMobileMock from "@/components/illustrations/MallMobileMock";
import DigitalStorefront from "@/components/illustrations/DigitalStorefront";

import RolloutTimelineIllustration from "@/components/illustrations/RolloutTimelineIllustration";
import RevenueYearOneChartMock from "@/components/illustrations/RevenueYearOneChart";
import RevenueYear1Year2ChartMock from "@/components/illustrations/RevenueYearTwoChart";
import RaiseFlowIllustration from "@/components/illustrations/RaiseFlowIllustration";
import MarketOpportunityIllustration from "@/components/illustrations/MarketOpportunityIllustration";

/**
 * Phase 1 Investor Website (Pitch Narrative + Illustration-Forward)
 * - Pitch-deck storytelling: Problem → Solution → Product → AI → Avatar → GTM → Rollout → Financials → Raise → Team → Contact
 * - Mock illustrations in Phase 1; Phase 2 swaps in real system diagrams + validated metrics
 */

const SECTIONS = [
  { id: "cover", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "product", label: "Experience" },
  { id: "ai", label: "AI Brain" },
  { id: "avatar", label: "Try-On" },
  { id: "gtm", label: "Go-to-market" },
  { id: "rollout", label: "Rollout" },
  { id: "financials", label: "Financials" },
  { id: "raise", label: "Raise" },
  { id: "team", label: "Team" },
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

function MiniBarRow({ label, valuePct, meta }) {
  return (
    <div className="grid grid-cols-12 items-center gap-3">
      <div className="col-span-4 text-xs text-black/60">{label}</div>
      <div className="col-span-6">
        <div className="h-2 w-full rounded-full bg-black/5">
          <div
            className="h-2 rounded-full bg-black/25"
            style={{ width: `${Math.max(4, Math.min(100, valuePct))}%` }}
          />
        </div>
      </div>
      <div className="col-span-2 text-right text-xs text-black/55">{meta}</div>
    </div>
  );
}

export default function Home() {
  const [activeId, setActiveId] = useState("cover");
  const sections = useMemo(() => SECTIONS, []);

  useEffect(() => {
    const ids = sections.map((s) => s.id);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0),
          )[0];

        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      {
        root: null,
        threshold: [0.15, 0.25, 0.35],
        rootMargin: "-20% 0px -65% 0px",
      },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <main className="min-h-screen bg-[#fafafa] text-black">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#fafafa]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-black/10 bg-white text-xs font-semibold text-black/70">
              E
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">Elysium</div>
              <div className="text-xs text-black/60">
                Phase 1 Investor Mockup
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-2 text-sm lg:flex">
            {sections.map((s) => {
              const isActive = activeId === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={cx(
                    "rounded-full px-3 py-1 text-sm transition",
                    isActive
                      ? "bg-black text-white"
                      : "text-black/70 hover:bg-black/5 hover:text-black",
                  )}
                >
                  {s.label}
                </a>
              );
            })}
          </nav>

          <a
            href="#contact"
            className="rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-medium text-black/80 hover:border-black/25"
          >
            Contact
          </a>
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
                <Pill>Digital Smart Mall</Pill>
                <Pill>AI Brain</Pill>
                <Pill>Social + eCommerce</Pill>
                <Pill>Investor Overview</Pill>
              </div>

              <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                Multi-dimensional immersion into a virtual shopping experience.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-black/70">
                Elysium is envisioned as a <strong>digital smart mall</strong>{" "}
                that blends social interaction with commerce—powered by an{" "}
                <strong>AI Brain</strong> that learns from{" "}
                <strong>word signals</strong> (and optional physical variables)
                to improve predictability, reduce returns, and increase
                conversion.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#ai"
                  className="rounded-full bg-black px-6 py-3 text-center text-sm font-semibold text-white hover:bg-black/90"
                >
                  See how the AI Brain works
                </a>
                <a
                  href="#product"
                  className="rounded-full border border-black/15 bg-white px-6 py-3 text-center text-sm font-semibold text-black/80 hover:border-black/25"
                >
                  View the Smart Mall experience
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-2 text-xs text-black/60">
                <Pill>Personalized discovery</Pill>
                <Pill>Avatar try-on concept</Pill>
                <Pill>Lower returns</Pill>
                <Pill>Higher conversion</Pill>
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-[#fafafa] p-4">
              <div className="h-[360px] md:h-[380px]">
                <DigitalStorefront />
              </div>
              <div className="mt-3 flex items-center justify-between px-1 text-xs text-black/60">
                <span>Digital Storefront (Mock UI)</span>
                <a
                  href="#product"
                  className="underline decoration-black/20 hover:decoration-black/40"
                >
                  View details
                </a>
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
          <div className="relative mt-8 grid gap-6 md:grid-cols-12">
            <div className="md:col-span-5">
              <Stat
                label="Positioning"
                value="Virtual Smart Mall"
                note="Immersive commerce + social layer."
              />
              <div className="mt-4">
                <Stat
                  label="Engine"
                  value="AI Brain"
                  note="Predictability + personalization."
                />
              </div>
              <div className="mt-4">
                <Stat
                  label="Outcome"
                  value="↑ Conversion / ↓ Returns"
                  note="Confidence drives performance."
                />
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="rounded-3xl border border-black/10 bg-[#fafafa] p-4">
                <div className="h-[320px] md:h-[360px]">
                  <MarketOpportunityIllustration />
                </div>
                <div className="mt-3 text-xs text-black/60">
                  Market Opportunity (Mock) — Phase 2: replace with validated
                  TAM/SAM/SOM.
                </div>
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

        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-black/90">
            Phase 1 framing (illustrative)
          </div>
          <div className="mt-4 space-y-3">
            <MiniBarRow
              label="Returns driven by low confidence"
              valuePct={78}
              meta="High"
            />
            <MiniBarRow
              label="Discovery is search-bar driven"
              valuePct={85}
              meta="Common"
            />
            <MiniBarRow
              label="Social shopping is limited"
              valuePct={72}
              meta="Gap"
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
          title="Digital Smart Mall experience"
          subtitle="Phase 1 mock illustrations show what a typical end user might see on laptop and mobile: storefronts, guided discovery, and social entry points."
          right={
            <>
              <Pill>Laptop</Pill>
              <Pill>Mobile</Pill>
              <Pill>Storefronts</Pill>
            </>
          }
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="h-[360px]">
              <MallLaptopMock />
            </div>
            <div className="mt-3 text-xs text-black/60">
              Laptop view: mall map + personalized storefront tiles + assistant
              rail.
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="h-[360px]">
              <MallMobileMock />
            </div>
            <div className="mt-3 text-xs text-black/60">
              Mobile view: fast discovery, social feed entry points, and quick
              conversions.
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
          subtitle="Multiple signal inputs → predictive intelligence → personalized outcomes. Phase 2 can replace this mock with real system diagrams."
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
              <div className="h-[320px]">
                <AIBrainDiagram />
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <Card title="Predictability">
                Improves relevance by learning from behavior and context over
                time.
              </Card>
              <Card title="Security Monitoring">
                AI-supported monitoring can help protect users and transactions.
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
                  "Inputs include behavior, intent/context, social signals, optional physical variables",
                  "Outputs drive conversion lift and return reduction",
                ]}
              />
              <div className="mt-4 rounded-2xl border border-black/10 bg-black/5 p-4 text-xs text-black/60">
                Phase 2 upgrade: replace with real architecture (data sources →
                model layer → rec engine → telemetry → governance).
              </div>
            </Card>
          </div>
        </div>
      </SectionShell>

      {/* Avatar */}
      <SectionShell id="avatar">
        <SectionHeader
          kicker="Try-on concept"
          title="Avatar-based confidence to reduce returns"
          subtitle="A simple Phase 1 flow that communicates how users can gain confidence before purchase. Phase 2 formalizes privacy, opt-in, and system design."
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

        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-black/90">
            Phase 2 upgrade (recommended)
          </div>
          <div className="mt-2 text-sm text-black/70">
            Add a dedicated illustration for the try-on system: capture →
            privacy/consent → avatar generation → preview rendering → storage
            policy.
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
            <div className="h-[360px]">
              <RolloutTimelineIllustration />
            </div>
            <div className="mt-3 text-xs text-black/60">
              Rollout Timeline (Mock) — Phase 2: replace with validated plan +
              dependencies.
            </div>
          </div>

          <div className="md:col-span-5">
            <Card title="Best-practice upgrades (Phase 2)">
              <BulletList
                items={[
                  "Add a competitive landscape slide (positioning vs Amazon/Etsy/etc.)",
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

        {/* Charts — FIXED ALIGNMENT (single aspect source of truth) */}
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
          title="Raise & milestones"
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
              <RaiseFlowIllustration />
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
            <Card title="CEO / Founder">
              Leadership and vision driving platform strategy, execution, and
              investor communication.
            </Card>
            <Card title="CFO / Finance">
              Financial planning, capital strategy, fundraising support, and
              staged expansion planning.
            </Card>
            <Card title="Operations & Growth">
              Product rollout, partnerships, acquisitions, and scaling strategy
              aligned to milestones.
            </Card>
          </div>

          <div className="md:col-span-5">
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-black/90">
                Operating focus (Phase 1)
              </div>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-black/10 bg-black/5 p-4 text-sm text-black/75">
                  Build → validate → iterate
                </div>
                <div className="rounded-2xl border border-black/10 bg-black/5 p-4 text-sm text-black/75">
                  Secure + monitor platform activity
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
              href="#"
            >
              Request a walkthrough
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

      <footer className="border-t border-black/10 py-10 text-center text-xs text-black/50">
        © {new Date().getFullYear()} Elysium — Phase 1 Investor Website
        (Mockup)
      </footer>
    </main>
  );
}
