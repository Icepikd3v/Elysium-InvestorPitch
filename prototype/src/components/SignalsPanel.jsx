// src/components/SignalsPanel.jsx
import { useMemo } from "react";

function formatDelta(n) {
  const v = Math.round(n * 100) / 100;
  if (!v) return "0";
  return v > 0 ? `+${v}` : `${v}`;
}

export default function SignalsPanel({ session, prevStoreScore }) {
  const data = useMemo(() => {
    const score = session?.storeScore || {};
    const prev = prevStoreScore || {};

    const entries = Object.entries(score).map(([store, s]) => {
      const p = Number(prev[store] || 0);
      const cur = Number(s || 0);
      return {
        store,
        cur,
        delta: cur - p,
        views: Number(session?.views?.[store] || 0),
      };
    });

    // sort by current priority
    entries.sort((a, b) => b.cur - a.cur);

    const top = entries.slice(0, 4);

    // sort by delta (movement)
    const movers = [...entries]
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
      .slice(0, 4);

    return { top, movers };
  }, [session, prevStoreScore]);

  const lastStore = session?.signals?.lastStore || "—";
  const priceBand = session?.signals?.priceBand || "—";

  return (
    <div>
      <h2>What changed?</h2>
      <p className="muted">
        Live signals captured in-session (investors should see the AI
        “learning”).
      </p>

      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        <div className="productCard">
          <p className="productName">Signals</p>
          <p className="productMeta">
            Last store: <b>{lastStore}</b>
            <br />
            Price band: <b>{priceBand}</b>
          </p>
        </div>

        <div className="productCard">
          <p className="productName">AI Priority (Top Stores)</p>
          <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
            {data.top.map((x) => (
              <div
                key={x.store}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.85)" }}>
                  {x.store}
                </span>
                <span className="muted">
                  {Math.round(x.cur * 100) / 100}{" "}
                  <span
                    style={{
                      color:
                        x.delta > 0
                          ? "rgba(160,220,255,0.9)"
                          : x.delta < 0
                            ? "rgba(255,170,170,0.9)"
                            : "rgba(255,255,255,0.55)",
                      marginLeft: 8,
                    }}
                  >
                    ({formatDelta(x.delta)})
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="productCard">
          <p className="productName">Biggest Movers</p>
          <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
            {data.movers.map((x) => (
              <div
                key={x.store}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.85)" }}>
                  {x.store}
                </span>
                <span className="muted">
                  Δ{" "}
                  <span
                    style={{
                      color:
                        x.delta > 0
                          ? "rgba(160,220,255,0.9)"
                          : x.delta < 0
                            ? "rgba(255,170,170,0.9)"
                            : "rgba(255,255,255,0.55)",
                    }}
                  >
                    {formatDelta(x.delta)}
                  </span>{" "}
                  • views {x.views}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
