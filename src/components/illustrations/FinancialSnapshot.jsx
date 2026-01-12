export default function FinancialsSnapshot() {
  return (
    <div className="h-full w-full rounded-3xl border border-black/10 bg-white p-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-sm font-semibold text-black/80">
            Financial Snapshot
          </div>
          <div className="mt-1 text-xs text-black/55">
            Illustrative only — replace with validated metrics in Phase 2.
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Box
          title="Revenue Streams"
          lines={["eComm", "Ads", "Subscriptions"]}
        />
        <Box
          title="KPI Targets"
          lines={["↑ Conversion", "↓ Returns", "↑ Retention"]}
        />
        <Box
          title="Rollout"
          lines={["Pilot → Expand", "Partnerships", "Acquisitions"]}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-4">
        <div className="text-xs font-semibold text-black/70">
          Milestone logic
        </div>
        <div className="mt-2 h-16 rounded-xl border border-black/10 bg-white" />
      </div>
    </div>
  );
}

function Box({ title, lines }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="text-xs font-semibold text-black/70">{title}</div>
      <ul className="mt-3 space-y-1 text-xs text-black/60">
        {lines.map((l) => (
          <li key={l}>• {l}</li>
        ))}
      </ul>
    </div>
  );
}
