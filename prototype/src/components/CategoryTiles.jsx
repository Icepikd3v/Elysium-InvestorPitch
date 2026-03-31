// src/components/CategoryTiles.jsx
import { STORES } from "../lib/mockData.js";

export default function CategoryTiles({
  stores = STORES,
  topStores = [],
  selectedStore = null,
  onCategoryClick,
}) {
  return (
    <div>
      <h2>Storefronts</h2>
      <p className="muted">
        Click a storefront to open its products directly inside the simulator.
      </p>

      <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
        {topStores.map((s) => (
          <div key={s} className="badge" style={{ width: "fit-content" }}>
            AI Priority: {s}
          </div>
        ))}
      </div>

      {selectedStore ? (
        <div
          style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}
        >
          <div className="badge">Selected: {selectedStore}</div>
        </div>
      ) : null}

      <div
        style={{
          marginTop: 12,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        {stores.map((s) => (
          <button
            key={s}
            className="btn"
            onClick={() => onCategoryClick?.(s)}
            style={{
              padding: "12px",
              justifyContent: "center",
              borderColor:
                selectedStore === s ? "rgba(120,180,255,0.55)" : undefined,
              background:
                selectedStore === s ? "rgba(120,180,255,0.10)" : undefined,
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
