import React from "react";

const brandStyles = {
  "Christian Louboutin": {
    class: "brand-louboutin",
    image: "/storefronts/ChristianStoreFront.jpg",
  },
  Prada: {
    class: "brand-prada",
    image: "/storefronts/PradaStoreFront.jpg",
  },
  Omega: {
    class: "brand-omega",
    image: "/storefronts/OmegaStoreFront.jpg",
  },
  "Jimmy Choo": {
    class: "brand-jimmychoo",
    image: "/storefronts/JimmyStoreFront.jpg",
  },
};

export default function StorefrontPanel({ stores, onOpenStore, activeStore }) {
  return (
    <section className="storefront-panel">
      <h2 className="district-title">Elysium Luxury District</h2>

      <div className="store-grid">
        {stores.map((store) => {
          const config = brandStyles[store];

          if (!config) return null;

          return (
            <div
              key={store}
              className={`storefront-card ${config.class} ${activeStore === store ? "active" : ""}`}
              onClick={() => onOpenStore(store)}
            >
              <div className="store-window">
                <img src={config.image} alt={store} />
              </div>

              <div className="store-name">{store}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
