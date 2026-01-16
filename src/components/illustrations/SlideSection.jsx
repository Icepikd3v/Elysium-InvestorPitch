export default function SlideSection({
  id,
  kicker,
  title,
  subtitle,
  children,
  tone = "light", // "light" | "dark"
  align = "center", // "center" | "top"
  mediaMaxW = "md", // "md" | "lg" | "full"
}) {
  const isDark = tone === "dark";

  const mediaWidth =
    mediaMaxW === "full"
      ? "w-full"
      : mediaMaxW === "lg"
        ? "w-full max-w-2xl"
        : "w-full max-w-xl";

  return (
    <section
      id={id}
      className={[
        "px-6 py-16",
        "min-h-[88vh] md:min-h-screen",
        align === "top" ? "flex items-start" : "flex items-center",
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

          <div
            className={[
              "justify-self-center",
              mediaWidth,
              isDark
                ? "rounded-3xl border border-white/10 bg-white/5 p-3 shadow-sm"
                : "rounded-3xl border border-black/10 bg-white p-3 shadow-sm",
            ].join(" ")}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
