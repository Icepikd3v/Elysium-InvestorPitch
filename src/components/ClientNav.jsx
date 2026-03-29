"use client";
import { useEffect, useState } from "react";

function cx(...c) {
  return c.filter(Boolean).join(" ");
}

export default function ClientNav({ sections, items = [] }) {
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
      { threshold: [0.1, 0.2, 0.35], rootMargin: "-120px 0px -55% 0px" },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="hidden min-w-0 flex-1 flex-wrap items-center justify-center gap-2 pr-1 text-sm lg:flex">
      {items.map((item) => {
        if (item.children?.length) {
          const isGroupActive = item.children.some((c) => c.id === activeId);

          return (
            <div key={item.label} className="group relative">
              <button
                type="button"
                className={cx(
                  "rounded-full px-2.5 py-1 text-sm whitespace-nowrap transition",
                  isGroupActive
                    ? "bg-black text-white"
                    : "text-black/70 hover:bg-black/5 hover:text-black",
                )}
              >
                {item.label}
              </button>

              <div className="pointer-events-none absolute left-0 top-full z-50 mt-2 min-w-[170px] translate-y-1 rounded-2xl border border-black/10 bg-white p-2 opacity-0 shadow-lg transition duration-150 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {item.children.map((child) => {
                  const isActive = activeId === child.id;
                  return (
                    <a
                      key={child.id}
                      href={`#${child.id}`}
                      onClick={() => setActiveId(child.id)}
                      className={cx(
                        "mb-1 block rounded-xl px-3 py-2 text-sm whitespace-nowrap transition last:mb-0",
                        isActive
                          ? "bg-black text-white"
                          : "text-black/70 hover:bg-black/5 hover:text-black",
                      )}
                    >
                      {child.label}
                    </a>
                  );
                })}
              </div>
            </div>
          );
        }

        const isActive = activeId === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => setActiveId(item.id)}
            className={cx(
              "rounded-full px-2.5 py-1 text-sm whitespace-nowrap transition",
              isActive
                ? "bg-black text-white"
                : "text-black/70 hover:bg-black/5 hover:text-black",
            )}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
