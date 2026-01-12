export default function SlideSection({
  id,
  kicker,
  title,
  subtitle,
  children,
  tone = "light", // "light" | "dark"
}) {
  const isDark = tone === "dark";

  return (
    <section
      id={id}
      className={[
        "min-h-[88vh] md:min-h-screen px-6 py-16",
        "flex items-center",
        isDark ? "bg-black text-white" : "bg-[#fafafa] text-black",
        "scroll-mt-24",
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            {kicker ? (
              <div
                className={[
                  "text-xs font-semibold uppercase tracking-widest",
                  isDark ? "text-white/60" : "text-black/50",
                ].join(" ")}
              >
                {kicker}
              </div>
            ) : null}

            <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              {title}
            </h2>

            {subtitle ? (
              <p
                className={[
                  "mt-4 text-lg leading-relaxed",
                  isDark ? "text-white/70" : "text-black/70",
                ].join(" ")}
              >
                {subtitle}
              </p>
            ) : null}
          </div>

          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}
