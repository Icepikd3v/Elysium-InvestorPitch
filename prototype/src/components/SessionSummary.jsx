import React from "react";

export default function SessionSummary({ personaLabel, priorityStores, cart }) {
  return (
    <section className="panel">
      <h3>Session Summary</h3>
      <p className="muted">
        This panel is what investors should “feel”: the AI is learning and
        adjusting.
      </p>

      <div className="summary-box">
        <div className="summary-row">
          <div className="summary-label">Persona</div>
          <div className="summary-value">{personaLabel || "—"}</div>
        </div>

        <div className="summary-row">
          <div className="summary-label">AI Priority Stores</div>
          <div className="summary-value">
            {priorityStores?.length ? priorityStores.join(", ") : "—"}
          </div>
        </div>

        <div className="summary-row">
          <div className="summary-label">Cart Items</div>
          <div className="summary-value">
            {cart.length ? `${cart.length} item(s)` : "Cart is empty"}
          </div>
        </div>

        <div className="summary-tip">
          <div className="summary-label">Open Simulator Recording Tip</div>
          <div className="muted">
            Click <b>Run Simulator Script</b>, then narrate what Elly is doing as
            storefront priorities change.
          </div>
        </div>
      </div>
    </section>
  );
}
