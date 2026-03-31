import { PRODUCT_CATALOG, STORES } from "./mockData.js";

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function hashStr(str) {
  // small deterministic hash
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function createAIBrainSession() {
  return {
    personaId: null,
    personaLabel: null,
    // storeScore = AI “priority” weights
    storeScore: Object.fromEntries(STORES.map((s) => [s, 0])),
    views: {}, // store -> count
    cart: [],
    // signals captured in-session
    signals: {
      priceBand: null,
      lastStore: null,
    },
  };
}

export function setPersona(session, persona) {
  session.personaId = persona.id;
  session.personaLabel = persona.label;

  // seed weights: primary stores get stronger initial priority
  for (const s of STORES) session.storeScore[s] = 0;
  for (const s of persona.primaryStores) session.storeScore[s] = 3;

  session.signals.lastStore = null;
  session.signals.priceBand = null;

  return session;
}

export function logStoreView(session, store) {
  session.views[store] = (session.views[store] || 0) + 1;
  session.signals.lastStore = store;

  // Increase priority for store on each view
  session.storeScore[store] = (session.storeScore[store] || 0) + 1.25;

  // Softly decay non-viewed stores (keeps movement believable)
  for (const s of STORES) {
    if (s === store) continue;
    session.storeScore[s] = clamp((session.storeScore[s] || 0) * 0.985, 0, 100);
  }

  return session;
}

export function addToCart(session, product) {
  const exists = session.cart.some((p) => p.sku === product.sku);
  if (!exists) session.cart.push(product);

  // capture “price band” signal (for future recos)
  const price = Number(product.price) || 0;
  if (price >= 200) session.signals.priceBand = "premium";
  else if (price >= 80) session.signals.priceBand = "mid";
  else session.signals.priceBand = "value";

  return session;
}

export function getTopStores(session, n = 2) {
  const entries = Object.entries(session.storeScore || {});
  entries.sort((a, b) => b[1] - a[1]);
  return entries.slice(0, n).map(([s]) => s);
}

export function getRecommendations(session, store, n = 3) {
  const catalog = PRODUCT_CATALOG[store] || [];
  if (!catalog.length) return [];

  const personaSeed = session.personaId || "none";
  const band = session.signals.priceBand || "any";

  const scored = catalog.map((p) => {
    // deterministic but “alive” scoring
    const base = session.storeScore[store] || 0;
    const viewBoost = (session.views[store] || 0) * 0.4;

    const price = Number(p.price) || 0;
    const bandScore =
      band === "premium"
        ? price >= 200
          ? 1.0
          : -0.3
        : band === "mid"
          ? price >= 80 && price < 200
            ? 1.0
            : -0.15
          : band === "value"
            ? price < 80
              ? 1.0
              : -0.25
            : 0;

    // deterministic tie-breaker
    const h = hashStr(`${personaSeed}|${store}|${p.sku}`);
    const jitter = (h % 1000) / 1000; // 0..1

    const score = base + viewBoost + bandScore + jitter * 0.35;
    return { p, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // avoid recommending what’s already in cart
  const filtered = scored
    .map((x) => x.p)
    .filter((p) => !session.cart.some((c) => c.sku === p.sku));

  return filtered.slice(0, n);
}
