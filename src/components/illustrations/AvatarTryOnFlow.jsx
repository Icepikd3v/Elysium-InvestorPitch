"use client";

import { useEffect, useState } from "react";

import AIBrainDiagram from "@/components/illustrations/AIBrainDiagram";
import MallLaptopMock from "@/components/illustrations/MallLaptopMock";
import MallMobileMock from "@/components/illustrations/MallMobileMock";
import DigitalStorefront from "@/components/illustrations/DigitalStorefront"; /**
 * Phase 1 Investor Mockup (single-page)
 * - Sticky nav w/ active section highlight
 * - Investor-friendly narrative + mock illustrations
 * - SVG mockups live in /src/components/illustrations
 */

const sections = [
  { id: "platform", label: "Platform" },
  { id: "ai", label: "AI Brain" },
  { id: "experience", label: "Experience" },
  { id: "financials", label: "Financials" },
  { id: "team", label: "Team" },
];

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-black/70">
      {children}
    </span>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-black/90">{title}</h3>
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

export default function Home() {
  const [activeId, setActiveId] = useState("platform");

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
        // offsets for sticky header
        rootMargin: "-20% 0px -65% 0px",
      },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

          <nav className="hidden items-center gap-2 text-sm md:flex">
            {sections.map((s) => {
              const isActive = activeId === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={[
                    "rounded-full px-3 py-1 text-sm transition",
                    isActive
                      ? "bg-black text-white"
                      : "text-black/70 hover:text-black hover:bg-black/5",
                  ].join(" ")}
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

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-black/5 blur-3xl" />
          <div className="absolute -right-24 top-32 h-80 w-80 rounded-full bg-black/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            {/* Left: copy */}
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
                that blends social interaction with commerce, powered by an{" "}
                <strong>AI Brain</strong> that learns from word signals (and
                optional physical variables) to improve predictability, reduce
                returns, and increase conversion.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#ai"
                  className="rounded-full bg-black px-6 py-3 text-center text-sm font-semibold text-white hover:bg-black/90"
                >
                  See how the AI Brain works
                </a>
                <a
                  href="#experience"
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

            {/* Right: hero visual */}
            <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
              <div className="h-[380px]">
                <DigitalStorefront />
              </div>

              <div className="mt-3 flex items-center justify-between px-1 text-xs text-black/60">
                <span>Digital Storefront (Mock UI)</span>
                <a
                  href="#experience"
                  className="underline decoration-black/20 hover:decoration-black/40"
                >
                  View details
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <Card title="Differentiation">
              Moves beyond “one-dimensional” shopping by making discovery
              interactive, guided, and personalized.
            </Card>
            <Card title="Social Commerce">
              Enables a combined experience where users can discover, share, and
              shop together—without leaving the platform.
            </Card>
            <Card title="Growth Story">
              Presents a clear roadmap and go-to-market plan aligned to revenue
              generation and expansion milestones.
            </Card>
          </div>
        </div>
      </section>

      {/* Platform */}
      <section id="platform" className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Platform overview
            </h2>
            <p className="mt-3 max-w-3xl text-black/70">
              Investor lens: the platform’s value is in{" "}
              <strong>experience</strong> (immersion + social) and{" "}
              <strong>intelligence</strong> (AI-driven predictability). Phase 1
              demonstrates the narrative using clean mock illustrations.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill>Guided discovery</Pill>
            <Pill>Reduced friction</Pill>
            <Pill>Lower returns</Pill>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card title="The problem with today’s online shopping">
            <ul className="list-disc space-y-2 pl-5">
              <li>One-dimensional discovery (search bar driven)</li>
              <li>Limited predictability and personalization</li>
              <li>High return rates due to lack of try-on confidence</li>
              <li>Weak social interaction and shared shopping experiences</li>
              <li>Cart abandonment from friction and uncertainty</li>
            </ul>
          </Card>

          <Card title="Elysium’s solution">
            <ul className="space-y-2">
              <li>Interactive guided discovery (voice/chat + experience)</li>
              <li>Real-time recommendations powered by the AI Brain</li>
              <li>Avatar/try-on concept to help reduce returns</li>
              <li>Social shopping: share, shop together, convert faster</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* AI */}
      <section id="ai" className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              How the AI Brain works
            </h2>
            <p className="mt-3 max-w-3xl text-black/70">
              A simple investor-friendly model: multiple signal inputs →
              predictive intelligence → personalized outcomes. (Phase 2 can
              replace this mock with real system diagrams.)
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="h-[320px]">
            <AIBrainDiagram />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card title="Predictability">
            Improves relevance of recommendations by learning from user behavior
            and context over time.
          </Card>
          <Card title="Security Monitoring">
            AI-supported monitoring can be incorporated to protect users,
            transactions, and platform activity.
          </Card>
          <Card title="Multilingual">
            Recommendations and assistance can be presented in the user’s
            preferred language to increase accessibility and conversion.
          </Card>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-semibold tracking-tight">
          Digital Smart Mall experience
        </h2>
        <p className="mt-3 max-w-3xl text-black/70">
          Phase 1 uses mock illustrations to demonstrate what a typical end user
          might see on laptop and mobile: storefronts, guided discovery, and a
          social layer that amplifies commerce.
        </p>

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
          <Card title="Avatar & Try-On">
            Avatar-based try-on is intended to improve confidence and reduce
            returns by helping users visualize fit and style.
          </Card>
        </div>
      </section>

      {/* Financials */}
      <section id="financials" className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Financial upside & implementation plan
            </h2>
            <p className="mt-3 max-w-3xl text-black/70">
              Phase 1 frames the narrative. Phase 2 can incorporate validated
              metrics, unit economics, and real system illustrations.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill>Revenue generating</Pill>
            <Pill>Acquisition strategy</Pill>
            <Pill>Scalable rollout</Pill>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Stat
            label="Revenue streams"
            value="eComm + Ads + Subscriptions"
            note="Example buckets; refine with real assumptions."
          />
          <Stat
            label="Key KPI targets"
            value="↑ Conversion / ↓ Returns"
            note="Powered by predictability + better user confidence."
          />
          <Stat
            label="Operating model"
            value="Platform + Partnerships"
            note="Brands, creators, and marketplaces as growth multipliers."
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card title="Go-to-market (three-prong attack)">
            <ol className="list-decimal space-y-2 pl-5">
              <li>Build demand through targeted marketing</li>
              <li>Acquire smaller social-media platforms</li>
              <li>Acquire smaller eCommerce platforms</li>
            </ol>
          </Card>

          <Card title="Revenue story (Phase 1 presentation)">
            High-level projections can be presented in a clean snapshot with
            appropriate disclaimers and assumptions. This section evolves as
            validated metrics are introduced in Phase 2.
          </Card>
        </div>

        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-black/90">
            Raises & milestones
          </h3>
          <p className="mt-2 text-sm text-black/70">
            Seed → product completion → strategic acquisitions → expansion →
            public market pathway (as applicable).
          </p>
          <p className="mt-4 text-xs text-black/50">
            Note: Any financial figures shown are illustrative estimates for
            presentation purposes and do not guarantee future outcomes.
          </p>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-semibold tracking-tight">Leadership</h2>
        <p className="mt-3 max-w-3xl text-black/70">
          Investors want confidence in execution: strong management, clear plan,
          and a disciplined approach to growth.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
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
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-6xl px-6 py-16">
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
              href="mailto:mrconsultant09@yahoo.com"
            >
              Contact
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/10 py-10 text-center text-xs text-black/50">
        © {new Date().getFullYear()} Elysium — Phase 1 Investor Website
        (Mockup)
      </footer>
    </main>
  );
}
