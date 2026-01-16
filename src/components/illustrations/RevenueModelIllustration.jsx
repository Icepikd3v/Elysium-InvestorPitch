import IllustrationFrame from "@/components/illustrations/IllustrationFrame";

export default function RevenueModelIllustration({
  className = "",
  priority = false,
  caption = "Revenue Engine (Mock) — Phase 2: replace with validated unit economics + take-rate model.",
  fit = "contain",
}) {
  return (
    <div className={["h-full w-full", className].join(" ")}>
      <IllustrationFrame
        src="/illustrations/revenue-model.jpg"
        alt="Revenue Engine diagram showing transaction fees, premium AI features, brand partnerships, and sponsored placements."
        priority={priority}
        caption={caption}
        fit={fit}
        sizes="(max-width: 768px) 100vw, 560px"
        badge="Phase 1 Mock"
      />
    </div>
  );
}
