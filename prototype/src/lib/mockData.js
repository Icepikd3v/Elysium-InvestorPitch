// src/lib/mockData.js
export const STORES = [
  // NEW: Luxury storefronts (Kori requirement)
  "LOUBOUTIN",
  "JIMMY CHOO",
  "PRADA",
  "OMEGA",

  // Existing categories (keep for current demo structure)
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Health & Beauty",
  "Books & Media",
  "Sports & Outdoors",
  "Toys & Games",
  "Groceries",
];

export const PERSONAS = [
  // Luxury-focused persona set for investor walkthrough demos
  {
    id: "luxury",
    label: "Luxury Collector",
    primaryStores: ["JIMMY CHOO", "PRADA", "LOUBOUTIN", "OMEGA"],
    keywords: ["heritage", "limited", "premium", "collector", "craft"],
  },

  // Keep legacy IDs for demo-script compatibility, but align profiles to luxury intent
  {
    id: "tech",
    label: "Timepiece Enthusiast",
    primaryStores: ["OMEGA", "PRADA", "Electronics"],
    keywords: ["precision", "movement", "chronograph", "performance"],
  },
  {
    id: "fashion",
    label: "Runway Curator",
    primaryStores: ["LOUBOUTIN", "JIMMY CHOO", "PRADA"],
    keywords: ["runway", "signature", "editorial", "craft"],
  },
  {
    id: "home",
    label: "Private Client",
    primaryStores: ["PRADA", "JIMMY CHOO", "Home & Garden"],
    keywords: ["concierge", "bespoke", "lifestyle", "elevated"],
  },
  {
    id: "fitness",
    label: "Performance Executive",
    primaryStores: ["OMEGA", "PRADA", "Sports & Outdoors"],
    keywords: ["precision", "performance", "versatile", "executive"],
  },
  {
    id: "family",
    label: "Affluent Family Buyer",
    primaryStores: ["JIMMY CHOO", "LOUBOUTIN", "PRADA"],
    keywords: ["gifting", "occasion", "premium", "household"],
  },
];

// Remote fallback (stable) if a real image is missing
const remoteFallbackFor = (sku) =>
  `https://picsum.photos/seed/${encodeURIComponent(sku)}/700/500`;

// Helpers for local images in /public/products
const toPublicProduct = (name) => `/products/${name}.jpg`;

// Generate SKU variants so we can support:
// - EL-101.jpg (your catalog SKU)
// - EL101.jpg (your actual file for EL-101, per screenshot)
// - and the reverse if needed later
const skuVariants = (sku) => {
  const out = new Set([sku]);

  const noHyphen = sku.replace(/-/g, "");
  out.add(noHyphen);

  // If looks like "EL101", add "EL-101"
  if (/^[A-Z]{2}\d{2,}$/.test(noHyphen)) {
    out.add(`${noHyphen.slice(0, 2)}-${noHyphen.slice(2)}`);
  }

  return Array.from(out);
};

const localImgFor = (sku) => toPublicProduct(sku); // /products/<SKU>.jpg
const localAltImgFor = (sku) => {
  // pick a *different* variant than the primary if possible
  const variants = skuVariants(sku);
  const primary = sku;
  const alt = variants.find((v) => v !== primary) || null;
  return alt ? toPublicProduct(alt) : null;
};

const P = (sku, name, brand, price, brandMark) => ({
  sku,
  name,
  brand,
  price,
  brandMark,
  imageUrl: localImgFor(sku),
  localAltImageUrl: localAltImgFor(sku),
  fallbackImageUrl: remoteFallbackFor(sku),
});

const L = (sku, name, brand, price, brandMark, imageUrl, localAltImageUrl = null) => ({
  sku,
  name,
  brand,
  price,
  brandMark,
  imageUrl,
  localAltImageUrl,
  fallbackImageUrl: remoteFallbackFor(sku),
});

export const PRODUCT_CATALOG = {
  // =========================
  // NEW: Luxury storefronts
  // =========================
  LOUBOUTIN: [
    L(
      "LB-001",
      "Red Sole Stiletto",
      "Louboutin",
      1295,
      "LB",
      "/products/christianlouboutin/lb-red-stilletto-black.png",
    ),
    L(
      "LB-002",
      "Patent Slingback",
      "Louboutin",
      1195,
      "LB",
      "/products/christianlouboutin/lb-patent-slingback-black.png",
    ),
    L(
      "LB-003",
      "Classic Bootie",
      "Louboutin",
      1595,
      "LB",
      "/products/christianlouboutin/lb-classic-bootie-black.png",
    ),
    L(
      "LB-004",
      "Evening Heel",
      "Louboutin",
      1395,
      "LB",
      "/products/christianlouboutin/lb-evening-heel-black.png",
    ),
  ],

  "JIMMY CHOO": [
    L(
      "JC-001",
      "Aurelia Heel",
      "Jimmy Choo",
      895,
      "JC",
      "/products/jimmychoo/jc-aurelia-heel-black.png",
    ),
    L(
      "JC-002",
      "Crystal Strap Heel",
      "Jimmy Choo",
      1095,
      "JC",
      "/products/jimmychoo/jc-crystal-strap-black.png",
    ),
    L(
      "JC-003",
      "Nude Pointed Pump",
      "Jimmy Choo",
      795,
      "JC",
      "/products/jimmychoo/jc-nude-pointed-black.png",
    ),
    L(
      "JC-004",
      "Signature Pump",
      "Jimmy Choo",
      850,
      "JC",
      "/products/jimmychoo/jc-sig-pump-black.png",
    ),
  ],

  PRADA: [
    L(
      "PR-001",
      "Structured Tote",
      "Prada",
      2450,
      "PR",
      "/products/Prada/pr-structured-tote-black.png",
    ),
    L(
      "PR-002",
      "Leather Loafer",
      "Prada",
      1150,
      "PR",
      "/products/Prada/pr-leather-loafer-black.png",
    ),
    L(
      "PR-003",
      "Saffiano Pump",
      "Prada",
      990,
      "PR",
      "/products/Prada/pr-saffiano-pump-black.png",
    ),
    L(
      "PR-004",
      "Icon Sunglasses",
      "Prada",
      620,
      "PR",
      "/products/Prada/pr-icon-sunglasses-black.png",
    ),
  ],

  OMEGA: [
    L(
      "OM-001",
      "Seamaster Diver",
      "Omega",
      5900,
      "OM",
      "/products/Omega/om-seamaster-diver-blackstainless.png",
    ),
    L(
      "OM-002",
      "Speedmaster Chronograph",
      "Omega",
      7100,
      "OM",
      "/products/Omega/om-speedmaster-chronograph-blackdial.png",
    ),
    L(
      "OM-003",
      "Constellation Quartz",
      "Omega",
      4200,
      "OM",
      "/products/Omega/om-constellation-quartz-black.png",
    ),
    L(
      "OM-004",
      "Omega Prestige",
      "Omega",
      3900,
      "OM",
      "/products/Omega/om-prestige-blackdial.png",
    ),
  ],

  // =========================
  // Existing categories
  // =========================
  Electronics: [
    P("EL-101", "Noise-Canceling Headphones", "Aurum", 249, "AU"),
    P("EL-114", "Smartwatch (Stainless)", "Kairo", 199, "KA"),
    P("EL-122", "4K Streaming Stick", "Nova", 49, "NV"),
    P("EL-130", "Mechanical Keyboard", "Tactile", 129, "TC"),
    P("EL-141", "Ultrabook 14” (i7)", "Helix", 1099, "HX"),
    P("EL-152", "Bluetooth Speaker", "Pulse", 89, "PL"),
  ],

  Fashion: [
    P("FA-201", "Tailored Blazer", "Monarch", 179, "MO"),
    P("FA-212", "Leather Sneakers", "Vanta", 129, "VA"),
    P("FA-223", "Structured Tote Bag", "Eline", 149, "EL"),
    P("FA-238", "Premium Denim", "Civic", 98, "CI"),
    P("FA-249", "Silk Scarf", "Sable", 64, "SA"),
    P("FA-257", "Sunglasses (Polarized)", "Noir", 89, "NO"),
  ],

  "Home & Garden": [
    P("HG-301", "Smart Thermostat", "Arden", 179, "AR"),
    P("HG-318", "LED Floor Lamp", "Lumen", 79, "LU"),
    P("HG-326", "Cordless Drill Kit", "Forge", 159, "FO"),
    P("HG-334", "Air Purifier (HEPA)", "Breeze", 219, "BR"),
    P("HG-342", "Kitchen Knife Set", "Stone", 129, "ST"),
    P("HG-356", "Indoor Plant Kit", "Verd", 45, "VE"),
  ],

  "Health & Beauty": [
    P("HB-401", "Skincare Set (AM/PM)", "Clair", 72, "CL"),
    P("HB-416", "Electric Trimmer", "Edge", 59, "ED"),
    P("HB-427", "Hair Dryer (Ionic)", "Halo", 89, "HA"),
    P("HB-438", "Fragrance (50ml)", "Bloom", 95, "BL"),
    P("HB-446", "Sunscreen SPF 50", "Sol", 22, "SO"),
    P("HB-459", "Makeup Palette", "Muse", 48, "MU"),
  ],

  "Books & Media": [
    P("BM-501", "Business Strategy Hardcover", "Ledger Press", 28, "LP"),
    P("BM-512", "Sci-Fi Bestseller Paperback", "Orbit House", 18, "OH"),
    P("BM-524", "Audiobook Subscription (1 mo)", "Soundly", 12, "SD"),
    P("BM-533", "Vinyl Record (Classic)", "Arc", 34, "AC"),
    P("BM-545", "Coffee Table Art Book", "Gallery", 42, "GA"),
    P("BM-558", "Magazine Bundle (3 issues)", "Courier", 15, "CO"),
  ],

  "Sports & Outdoors": [
    P("SO-601", "Training Shoes", "Stride", 119, "SR"),
    P("SO-612", "Adjustable Dumbbells", "Ironline", 249, "IL"),
    P("SO-623", "Hiking Backpack 30L", "Summit", 98, "SU"),
    P("SO-634", "Insulated Bottle", "Field", 26, "FI"),
    P("SO-646", "Camping Lantern", "Glow", 32, "GL"),
    P("SO-657", "Yoga Mat (Pro)", "Balance", 49, "BA"),
  ],

  "Toys & Games": [
    P("TG-701", "STEM Building Set", "BrickLab", 59, "BL"),
    P("TG-712", "Strategy Board Game", "Tabletop Co.", 44, "TC"),
    P("TG-723", "Remote Control Car", "Vector", 49, "VE"),
    P("TG-734", "Puzzle 1000pc", "Zenith", 19, "ZE"),
    P("TG-745", "Kids Tablet (Wi-Fi)", "Kite", 89, "KI"),
    P("TG-756", "Plush Toy", "Cuddle", 17, "CU"),
  ],

  Groceries: [
    P("GR-801", "Fresh Produce Box", "Harvest", 24, "HA"),
    P("GR-812", "Coffee Beans (12oz)", "Roast", 14, "RO"),
    P("GR-823", "Organic Eggs (dozen)", "Field", 6, "FI"),
    P("GR-834", "Pasta Bundle", "Terra", 12, "TE"),
    P("GR-845", "Snack Pack Variety", "Stack", 9, "ST"),
    P("GR-856", "Frozen Meal (2 servings)", "Bright", 8, "BR"),
  ],
};
