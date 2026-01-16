"use client";
import { useEffect, useState } from "react";

function cx(...c) {
  return c.filter(Boolean).join(" ");
}

export default function ClientNav({ sections }) {
  const [activeId, setActiveId] = useState(sections?.[0]?.id ?? "cover");

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
      { threshold: [0.15, 0.25, 0.35], rootMargin: "-20% 0px -65% 0px" },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
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
  );
}
