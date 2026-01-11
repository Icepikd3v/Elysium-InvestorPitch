"use client";

import { useEffect, useState } from "react";

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
        rootMargin: "-20% 0px -65% 0px",
      },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
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

          <nav className="hidden items-center gap-2 md:flex">
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
            {/* Left */}
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
                Elysium is envisioned as a digital smart mall that combines
                social-media interaction with eCommerce, powered by an AI Brain
                that analyzes both word data and optional physical variables to
                increase predictability, reduce returns, and improve conversion.
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
                <MallLaptopMock />
              </div>
              <div className="mt-3 flex items-center justify-between px-1 text-xs text-black/60">
                <span>Smart Mall (Mock UI)</span>
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
        <div className="grid gap-6 md:grid-cols-2">
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
              predictive intelligence → personalized outcomes.
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
            AI-supported security monitoring is part of the platform vision to
            protect users and activity.
          </Card>
          <Card title="Multilingual">
            Recommendations can be presented in the user’s language to increase
            accessibility and conversion.
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
          might see on laptop and mobile.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="h-[360px]">
              <MallLaptopMock />
            </div>
          </div>
          <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="h-[360px]">
              <MallMobileMock />
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
        <h2 className="text-3xl font-semibold tracking-tight">
          Financial upside & implementation plan
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card title="Go-to-market (three-prong attack)">
            <ol className="list-decimal space-y-2 pl-5">
              <li>Build demand through targeted marketing</li>
              <li>Acquire smaller social-media platforms</li>
              <li>Acquire smaller eCommerce platforms</li>
            </ol>
          </Card>

          <Card title="Revenue story (Phase 1 presentation)">
            High-level projections can be presented in a clean snapshot with
            appropriate disclaimers and assumptions. This section will evolve as
            real system illustrations and validated metrics are introduced in
            Phase 2.
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
            Note: Any financial figures shown are estimates for presentation
            purposes and do not guarantee future outcomes.
          </p>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-semibold tracking-tight">Leadership</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card title="CEO / Founder">
            Leadership and vision driving platform strategy, execution, and
            investor communication.
          </Card>
          <Card title="CFO / Finance">
            Financial planning, capital strategy, and fundraising support for
            staged growth.
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
              href="mailto:mrconsultant09@yahoo.com?subject=Elysium%20Phase%201%20Mockup%20Walkthrough&body=Hi%20Dr.%20Rivers%2C%0A%0AI%20have%20the%20Phase%201%20investor%20mockup%20ready%20for%20review.%20When%20would%20you%20like%20to%20do%20a%20quick%20walkthrough%3F%0A%0AThanks%2C%0ASamuel"
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

/* ---------------------------
   Inline mock illustrations
--------------------------- */

function AIBrainDiagram() {
  return (
    <svg viewBox="0 0 1200 420" className="h-full w-full">
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0" stopColor="black" stopOpacity="0.10" />
          <stop offset="1" stopColor="black" stopOpacity="0.04" />
        </linearGradient>
        <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>

      <rect
        x="0"
        y="0"
        width="1200"
        height="420"
        rx="28"
        fill="rgba(0,0,0,0.03)"
      />
      <circle cx="250" cy="120" r="90" fill="url(#g)" filter="url(#blur)" />
      <circle cx="980" cy="280" r="110" fill="url(#g)" filter="url(#blur)" />

      <g fontFamily="ui-sans-serif, system-ui" fill="black">
        {/* Inputs */}
        <g transform="translate(70,70)">
          <text fontSize="18" fontWeight="700" opacity="0.85">
            Inputs
          </text>
          {[
            "Behavioral signals",
            "Context & intent",
            "Social signals",
            "Optional physical variables",
          ].map((t, i) => (
            <g key={t} transform={`translate(0,${40 + i * 54})`}>
              <rect
                x="0"
                y="0"
                width="270"
                height="40"
                rx="12"
                fill="rgba(0,0,0,0.03)"
                stroke="rgba(0,0,0,0.08)"
              />
              <text x="16" y="26" fontSize="14" opacity="0.75">
                {t}
              </text>
            </g>
          ))}
        </g>

        {/* Brain */}
        <g transform="translate(460,60)">
          <text
            x="140"
            y="28"
            fontSize="18"
            fontWeight="700"
            opacity="0.85"
            textAnchor="middle"
          >
            AI Brain
          </text>
          <rect
            x="20"
            y="52"
            width="280"
            height="260"
            rx="26"
            fill="rgba(0,0,0,0.03)"
            stroke="rgba(0,0,0,0.10)"
          />
          {[
            "Predictability Engine",
            "Personalization Logic",
            "Security Monitoring",
            "Multilingual Recommendations",
          ].map((t, idx) => (
            <text
              key={t}
              x="160"
              y={110 + idx * 40}
              fontSize="14"
              opacity="0.75"
              textAnchor="middle"
            >
              {t}
            </text>
          ))}

          <path
            d="M80 260 C120 230, 200 230, 240 260"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M90 290 C140 260, 180 260, 230 290"
            stroke="rgba(0,0,0,0.12)"
            strokeWidth="2"
            fill="none"
          />
        </g>

        {/* Outputs */}
        <g transform="translate(860,70)">
          <text fontSize="18" fontWeight="700" opacity="0.85">
            Outputs
          </text>
          {[
            "Personalized mall layout",
            "Tailored product/service recs",
            "Try-on suggestions (avatar)",
            "Higher conversion, fewer returns",
          ].map((t, i) => (
            <g key={t} transform={`translate(0,${40 + i * 54})`}>
              <rect
                x="0"
                y="0"
                width="270"
                height="40"
                rx="12"
                fill="rgba(0,0,0,0.03)"
                stroke="rgba(0,0,0,0.08)"
              />
              <text x="16" y="26" fontSize="14" opacity="0.75">
                {t}
              </text>
            </g>
          ))}
        </g>

        {/* arrows */}
        <g stroke="rgba(0,0,0,0.20)" strokeWidth="2" fill="none">
          <path d="M360 170 L450 170" />
          <path d="M440 164 L450 170 L440 176" />
          <path d="M760 170 L850 170" />
          <path d="M840 164 L850 170 L840 176" />
        </g>
      </g>
    </svg>
  );
}

function MallLaptopMock() {
  return (
    <svg viewBox="0 0 900 520" className="h-full w-full">
      <rect
        x="0"
        y="0"
        width="900"
        height="520"
        rx="28"
        fill="rgba(0,0,0,0.03)"
      />
      <rect
        x="160"
        y="90"
        width="580"
        height="320"
        rx="18"
        fill="rgba(0,0,0,0.03)"
        stroke="rgba(0,0,0,0.12)"
      />
      <rect
        x="180"
        y="115"
        width="540"
        height="270"
        rx="14"
        fill="rgba(0,0,0,0.04)"
        stroke="rgba(0,0,0,0.10)"
      />

      <rect
        x="200"
        y="130"
        width="500"
        height="22"
        rx="10"
        fill="rgba(0,0,0,0.03)"
      />
      <circle cx="214" cy="141" r="4" fill="rgba(0,0,0,0.18)" />
      <circle cx="228" cy="141" r="4" fill="rgba(0,0,0,0.14)" />
      <circle cx="242" cy="141" r="4" fill="rgba(0,0,0,0.10)" />

      <rect
        x="200"
        y="165"
        width="120"
        height="205"
        rx="12"
        fill="rgba(0,0,0,0.03)"
        stroke="rgba(0,0,0,0.08)"
      />
      {Array.from({ length: 5 }).map((_, i) => (
        <rect
          key={i}
          x="214"
          y={182 + i * 34}
          width="92"
          height="18"
          rx="9"
          fill="rgba(0,0,0,0.03)"
        />
      ))}

      {Array.from({ length: 6 }).map((_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 340 + col * 120;
        const y = 165 + row * 105;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width="105"
              height="90"
              rx="14"
              fill="rgba(0,0,0,0.03)"
              stroke="rgba(0,0,0,0.10)"
            />
            <rect
              x={x + 12}
              y={y + 12}
              width="70"
              height="10"
              rx="5"
              fill="rgba(0,0,0,0.08)"
            />
            <rect
              x={x + 12}
              y={y + 32}
              width="84"
              height="8"
              rx="4"
              fill="rgba(0,0,0,0.05)"
            />
            <rect
              x={x + 12}
              y={y + 48}
              width="60"
              height="8"
              rx="4"
              fill="rgba(0,0,0,0.04)"
            />
          </g>
        );
      })}

      <rect
        x="675"
        y="165"
        width="45"
        height="205"
        rx="14"
        fill="rgba(0,0,0,0.03)"
        stroke="rgba(0,0,0,0.08)"
      />
      <circle cx="698" cy="190" r="10" fill="rgba(0,0,0,0.06)" />
      <rect
        x="685"
        y="210"
        width="26"
        height="10"
        rx="5"
        fill="rgba(0,0,0,0.06)"
      />
      <rect
        x="683"
        y="230"
        width="30"
        height="10"
        rx="5"
        fill="rgba(0,0,0,0.05)"
      />
      <rect
        x="685"
        y="250"
        width="26"
        height="10"
        rx="5"
        fill="rgba(0,0,0,0.04)"
      />

      <path
        d="M130 420 H770 L815 460 H85 Z"
        fill="rgba(0,0,0,0.03)"
        stroke="rgba(0,0,0,0.10)"
      />
      <rect
        x="360"
        y="438"
        width="180"
        height="10"
        rx="5"
        fill="rgba(0,0,0,0.06)"
      />

      <text
        x="450"
        y="505"
        textAnchor="middle"
        fill="rgba(0,0,0,0.55)"
        fontSize="14"
        fontFamily="ui-sans-serif, system-ui"
      >
        Mock: Smart Mall layout + personalized storefronts + AI assistant
      </text>
    </svg>
  );
}

function MallMobileMock() {
  return (
    <svg viewBox="0 0 420 520" className="h-full w-full">
      <rect
        x="0"
        y="0"
        width="420"
        height="520"
        rx="28"
        fill="rgba(0,0,0,0.03)"
      />
      <rect
        x="110"
        y="55"
        width="200"
        height="410"
        rx="30"
        fill="rgba(0,0,0,0.03)"
        stroke="rgba(0,0,0,0.12)"
      />
      <rect
        x="126"
        y="90"
        width="168"
        height="340"
        rx="22"
        fill="rgba(0,0,0,0.04)"
        stroke="rgba(0,0,0,0.10)"
      />
      <rect
        x="176"
        y="70"
        width="68"
        height="10"
        rx="5"
        fill="rgba(0,0,0,0.08)"
      />

      <rect
        x="138"
        y="104"
        width="144"
        height="18"
        rx="9"
        fill="rgba(0,0,0,0.03)"
      />
      <circle cx="146" cy="150" r="14" fill="rgba(0,0,0,0.06)" />
      <rect
        x="166"
        y="140"
        width="112"
        height="10"
        rx="5"
        fill="rgba(0,0,0,0.06)"
      />
      <rect
        x="166"
        y="155"
        width="80"
        height="8"
        rx="4"
        fill="rgba(0,0,0,0.05)"
      />

      {Array.from({ length: 6 }).map((_, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 140 + col * 86;
        const y = 185 + row * 78;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width="78"
              height="66"
              rx="16"
              fill="rgba(0,0,0,0.03)"
              stroke="rgba(0,0,0,0.10)"
            />
            <rect
              x={x + 10}
              y={y + 12}
              width="50"
              height="10"
              rx="5"
              fill="rgba(0,0,0,0.08)"
            />
            <rect
              x={x + 10}
              y={y + 30}
              width="58"
              height="8"
              rx="4"
              fill="rgba(0,0,0,0.05)"
            />
          </g>
        );
      })}

      <rect
        x="138"
        y="410"
        width="144"
        height="18"
        rx="9"
        fill="rgba(0,0,0,0.03)"
      />

      <text
        x="210"
        y="500"
        textAnchor="middle"
        fill="rgba(0,0,0,0.55)"
        fontSize="14"
        fontFamily="ui-sans-serif, system-ui"
      >
        Mock: Mobile Smart Mall discovery + social feed
      </text>
    </svg>
  );
}
