import React from "react";

export default function PersonaPanel({ personas, activePersonaId, onSelect }) {
  return (
    <section className="panel">
      <h3>Shopper Persona</h3>
      <p className="muted">
        Select a user type to demonstrate how the AI Brain adapts the mall
        experience in real time.
      </p>

      <div className="persona-list">
        {personas.map((p) => {
          const active = p.id === activePersonaId;
          return (
            <button
              key={p.id}
              className={`persona-card ${active ? "active" : ""}`}
              onClick={() => onSelect(p)}
              type="button"
            >
              <div className="persona-title">{p.label}</div>
              <div className="persona-sub">
                Primary stores: {p.primaryStores.join(", ")}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
