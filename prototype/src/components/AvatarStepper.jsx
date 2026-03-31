// src/components/AvatarStepper.jsx
import { PERSONAS } from "../lib/mockData.js";

export default function AvatarStepper({ persona, onSelectPersona }) {
  return (
    <div>
      <h2>Shopper Persona</h2>
      <p className="muted">
        Select a user type to demonstrate how the AI Brain adapts the mall
        experience in real time.
      </p>

      <div className="personaList">
        {PERSONAS.map((p) => {
          const active = persona?.id === p.id;

          return (
            <button
              key={p.id}
              className={`personaBtn ${active ? "active" : ""}`}
              onClick={() => onSelectPersona?.(p)}
              aria-pressed={active}
              type="button"
            >
              <p className="personaBtnTitle">{p.label}</p>
              <p className="personaBtnMeta">
                Primary stores: {(p.primaryStores || []).join(", ") || "—"}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
