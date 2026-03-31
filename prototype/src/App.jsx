// src/App.jsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

import AvatarStepper from "./components/AvatarStepper";
import EllyChat from "./components/EllyChat";
import CategoryTiles from "./components/CategoryTiles";
import MallPreview3D from "./components/MallPreview3D";

import VirtualMallWalkthroughR3F from "./components/VirtualMallWalkthroughR3F";
import RetinaScan from "./components/RetinaScan";
import { PERSONAS, PRODUCT_CATALOG } from "./lib/mockData.js";
import {
  addToCart,
  createAIBrainSession,
  getRecommendations,
  getTopStores,
  logStoreView,
  setPersona,
} from "./lib/aiBrain.js";
import {
  DEMO_SCRIPTS,
  DEFAULT_DEMO_KEY,
  DEMO_SELECTOR_KEYS,
} from "./lib/demoScript.js";
import {
  resendVerificationRemote,
  signinRemote,
  verifyEmailRemote,
} from "./lib/authClient.js";

const PASSWORD_REQUEST_EMAIL = "kori@elysiummall.com";

/**
 * ✅ Walkthrough storefront → category + brand filter + label
 * This makes each storefront enter into a "real shop" view with the right products.
 */
const WALK_STORE_CONTEXT = {
  louboutin: {
    category: "LOUBOUTIN",
    label: "CHRISTIAN LOUBOUTIN",
    brand: "Louboutin",
    aliases: ["Louboutin", "Christian Louboutin"],
  },
  prada: {
    category: "PRADA",
    label: "PRADA",
    brand: "Prada",
    aliases: ["Prada"],
  },
  omega: {
    category: "OMEGA",
    label: "OMEGA",
    brand: "Omega",
    aliases: ["Omega"],
  },
  jimmychoo: {
    category: "JIMMY CHOO",
    label: "JIMMY CHOO",
    brand: "Jimmy Choo",
    aliases: ["Jimmy Choo", "JimmyChoo"],
  },
};

const LUXURY_STORES = ["LOUBOUTIN", "PRADA", "OMEGA", "JIMMY CHOO"];

const STOREFRONT_DISPLAY_LABELS = {
  LOUBOUTIN: "CHRISTIAN LOUBOUTIN",
  PRADA: "PRADA",
  OMEGA: "OMEGA",
  "JIMMY CHOO": "JIMMY CHOO",
};

const STORE_TO_SIM_KEY = {
  LOUBOUTIN: "louboutin",
  PRADA: "prada",
  OMEGA: "omega",
  "JIMMY CHOO": "jimmychoo",
};

const simKeyForStore = (store) => STORE_TO_SIM_KEY[store] || null;

const formatStoreLabel = (store) =>
  STOREFRONT_DISPLAY_LABELS[store] || store || "—";

const LUXURY_PRODUCT_ORDER = {
  LOUBOUTIN: [
    "Red Sole Stiletto",
    "Patent Slingback",
    "Classic Bootie",
    "Evening Heel",
  ],
  PRADA: [
    "Structured Tote",
    "Leather Loafer",
    "Saffiano Pump",
    "Icon Sunglasses",
  ],
  OMEGA: [
    "Seamaster Diver",
    "Speedmaster Chronograph",
    "Constellation Quartz",
    "Omega Prestige",
  ],
  "JIMMY CHOO": [
    "Aurelia Heel",
    "Crystal Strap Heel",
    "Signature Pump",
    "Nude Pointed Pump",
  ],
};

const DEMO_COLOR_BY_STORE = {
  LOUBOUTIN: ["red", "black", "beige"],
  PRADA: ["beige", "black", "red"],
  OMEGA: ["bluebezel", "blackstainless", "whitedial"],
  "JIMMY CHOO": ["beige", "red", "black"],
};

const DEMO_PERSONA_COLOR_PREFS = {
  fashion: ["red", "beige", "black"],
  home: ["beige", "black", "red"],
  tech: ["bluebezel", "blackdial", "blackstainless", "bluedial", "whitedial"],
  family: ["beige", "red", "black", "whitedial"],
  luxury: ["red", "black", "beige"],
};

const DEMO_PERSONA_SIZE_PROFILE = {
  fashion: "narrow fit",
  home: "standard fit",
  tech: "precision fit",
  family: "comfort fit",
  luxury: "tailored fit",
};

const hashSeed = (value) => {
  const input = String(value || "");
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
};

const pickDemoSelection = ({ store, recos = [], personaId = "fashion", session, cycle = 0 }) => {
  if (!recos.length) return null;
  const pool = recos.slice(0, Math.min(3, recos.length));
  const historySeed = (session?.cart || []).map((p) => p.sku).join("|");
  const seed = hashSeed(`${personaId}|${store}|${historySeed}|${cycle}|${session?.signals?.lastStore || ""}`);
  const pick = pool[seed % pool.length] || pool[0];

  const preferredColors = DEMO_PERSONA_COLOR_PREFS[personaId] || DEMO_PERSONA_COLOR_PREFS.fashion;
  const storePalette = DEMO_COLOR_BY_STORE[store] || ["black"];
  const colorPool = [...preferredColors, ...storePalette, "black"];
  const color = colorPool[seed % colorPool.length] || "black";

  return {
    product: pick,
    color,
    sizeProfile: DEMO_PERSONA_SIZE_PROFILE[personaId] || DEMO_PERSONA_SIZE_PROFILE.fashion,
  };
};

function orderLuxuryProducts(store, products = []) {
  const order = LUXURY_PRODUCT_ORDER[store];
  if (!order?.length) return products;
  const rank = new Map(order.map((name, idx) => [name, idx]));
  return [...products].sort((a, b) => {
    const ar = rank.has(a.name) ? rank.get(a.name) : 999;
    const br = rank.has(b.name) ? rank.get(b.name) : 999;
    if (ar !== br) return ar - br;
    return String(a.name || "").localeCompare(String(b.name || ""));
  });
}

/** Product image overrides (support multiple candidates per SKU) */
const PRODUCT_IMAGE_OVERRIDES = {
  "EL-101": ["/products/EL101.jpg", "/products/EL-101.jpg"],
  "HB-427": [
    "/products/HB427.jpg",
    "/products/HB-427.jpg",
    "/products/HB-247.jpg",
  ],
};

/** Small “AI explanation layer” to make the demo feel undeniably AI-driven */
const explainReco = (session, store) => {
  const persona = session?.personaLabel || "Shopper";
  const last = session?.signals?.lastStore;
  const band = session?.signals?.priceBand;

  const bandText =
    band === "premium"
      ? "premium preference detected"
      : band === "mid"
        ? "mid-range preference detected"
        : band === "value"
          ? "value preference detected"
          : null;

  const views = session?.views?.[store] || 0;
  const viewText = views ? `${views} view(s) in ${store}` : null;

  const why = [
    persona,
    last ? `recently browsed ${last}` : null,
    bandText,
    viewText,
  ]
    .filter(Boolean)
    .join(" • ");

  return why || "Session-based personalization";
};

const priceBandLabelFor = (price) => {
  const value = Number(price) || 0;
  if (value >= 200) return "premium";
  if (value >= 80) return "mid-range";
  return "budget-friendly";
};

const budgetFitLabel = (session, price) => {
  const signal = session?.signals?.priceBand;
  const value = Number(price) || 0;

  if (!signal) return "exploratory fit";
  if (signal === "premium") return value >= 200 ? "strong budget fit" : "stretch fit";
  if (signal === "mid") return value >= 80 && value < 200 ? "strong budget fit" : "cross-band fit";
  return value < 80 ? "strong budget fit" : "stretch fit";
};

function ProductThumb({ product }) {
  const candidatesRef = useRef([]);
  const [src, setSrc] = useState("");
  const [tryIndex, setTryIndex] = useState(0);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    if (!product) return;

    const overrides = PRODUCT_IMAGE_OVERRIDES[product.sku];
    const overrideList = Array.isArray(overrides)
      ? overrides
      : overrides
        ? [overrides]
        : [];

    const sku = String(product.sku || "");
    const skuNoHyphen = sku.replace(/-/g, "");

    const candidates = [
      ...overrideList,
      product.imageUrl,
      product.localAltImageUrl,
      `/products/${sku}.jpg`,
      `/products/${skuNoHyphen}.jpg`,
      `/products/${sku.toUpperCase()}.jpg`,
      `/products/${skuNoHyphen.toUpperCase()}.jpg`,
    ].filter(Boolean);

    candidatesRef.current = candidates;
    setTryIndex(0);
    setUsedFallback(false);
    setSrc(candidates[0] || "");
  }, [product?.sku, product?.imageUrl, product?.localAltImageUrl]);

  const onError = () => {
    if (!product) return;

    const candidates = candidatesRef.current || [];
    const nextIdx = tryIndex + 1;

    if (nextIdx < candidates.length) {
      setTryIndex(nextIdx);
      setSrc(candidates[nextIdx]);
      return;
    }

    if (!usedFallback && product.fallbackImageUrl) {
      setUsedFallback(true);
      setSrc(product.fallbackImageUrl);
      return;
    }

    setSrc("");
  };

  const showMarkOnly = !src;

  return (
    <div className="thumb" aria-label={`Product image for ${product?.name}`}>
      {!showMarkOnly ? (
        <img
          src={src}
          onError={onError}
          alt={product?.name || "Product"}
          className="thumbImg"
          loading="lazy"
        />
      ) : (
        <div className="thumbInner">{product?.brandMark || "—"}</div>
      )}
    </div>
  );
}

/** ✅ Brand matching helper (robust) */
function matchesStorefront(product, storefrontCtx) {
  if (!product || !storefrontCtx) return true;
  const aliases =
    storefrontCtx.aliases || [storefrontCtx.brand].filter(Boolean);

  const haystack =
    `${product.brand || ""} ${product.name || ""} ${product.sku || ""}`.toLowerCase();

  // Match any alias in brand/name/sku
  const hit = aliases.some((a) => haystack.includes(String(a).toLowerCase()));
  if (hit) return true;

  // Extra fallback: if label exists, try it too
  if (
    storefrontCtx.label &&
    haystack.includes(storefrontCtx.label.toLowerCase())
  )
    return true;

  return false;
}

const USER_STORE_KEY = "elysium_registered_users";
const NAME_RE = /^[A-Za-z][A-Za-z '-]*$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.com$/i;
const PASSWORD_RE = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/;
const PHONE_RE = /^1\+\(\d{3}\)-\(\d{4}\)$/;

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const readRegisteredUsers = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USER_STORE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeRegisteredUsers = (users) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_STORE_KEY, JSON.stringify(users));
};

const createVerificationToken = () =>
  `verify_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const formatPhoneValue = (input) => {
  const digitsOnly = String(input || "").replace(/\D/g, "");
  if (!digitsOnly) return "";
  const normalized = (digitsOnly.startsWith("1") ? digitsOnly : `1${digitsOnly}`).slice(0, 8);
  const area = normalized.slice(1, 4);
  const line = normalized.slice(4, 8);
  let out = "1+";
  if (area.length) {
    out += `(${area}`;
    if (area.length === 3) out += ")";
  }
  if (line.length) {
    out += `-(${line}`;
    if (line.length === 4) out += ")";
  }
  return out;
};

export default function App() {
  const DEMO_EMAIL = "investor@elysiummall.com";
  const DEMO_PASS = "Elysium2026!";
  const INVESTOR_PAGE_URL =
    import.meta.env.VITE_INVESTOR_PAGE_URL || "https://elysiummall.com";
  const LANDING_PATH = "/landing-page";
  const SIGN_IN_PATH = "/landing-page/sign-in";
  const VERIFY_EMAIL_PATH = "/landing-page/verify-email";
  const SIMULATOR_PATH = "/simulator";
  const INTRO_STAGE_BLACK_MS = 300;
  const INTRO_HOLD_MS = 350;
  const LANDING_INTRO_DISSOLVE_MS = 3000;
  const initialRoute = (() => {
    if (typeof window === "undefined") return { view: "landing", intent: "signin" };
    const normalizedPath = decodeURIComponent(window.location.pathname || "/")
      .toLowerCase()
      .replace(/\s+/g, "-");
    if (normalizedPath.includes("/sign-up") || normalizedPath.includes("/signup")) {
      return { view: "auth", intent: "signin" };
    }
    if (normalizedPath.includes("/verify-email")) {
      return { view: "verify", intent: "signin" };
    }
    if (normalizedPath.includes("/sign-in") || normalizedPath.includes("/signin")) {
      return { view: "auth", intent: "signin" };
    }
    return { view: "landing", intent: "signin" };
  })();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [publicView, setPublicView] = useState(initialRoute.view); // landing | auth | verify
  const [authIntent, setAuthIntent] = useState(initialRoute.intent); // signin only
  const [registeredUsers, setRegisteredUsers] = useState(() => readRegisteredUsers());
  const [pendingVerification, setPendingVerification] = useState(null);
  const [authNotice, setAuthNotice] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const [scanAuthorized, setScanAuthorized] = useState(false);
  const [showBrandIntroMall, setShowBrandIntroMall] = useState(false);
  const [introReadyToContinue, setIntroReadyToContinue] = useState(false);
  const [showLandingMallTransition, setShowLandingMallTransition] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(false);
  const [error, setError] = useState("");
  // Flow: brand_intro -> landing/auth/verify -> scan -> app
  const [flowStage, setFlowStage] = useState(() => {
    if (initialRoute.view === "landing") return "brand_intro";
    const saved = localStorage.getItem("elysium_flow_stage");
    return saved === "brand_intro" || saved === "scan" || saved === "app"
      ? saved
      : "login";
  });

  const [minorityReportMode, setMinorityReportMode] = useState(() => {
    const saved = localStorage.getItem("elysium_mr_mode");
    return saved === "0" ? false : true; // default ON
  });

  useEffect(() => {
    localStorage.setItem("elysium_flow_stage", flowStage);
  }, [flowStage]);

  useEffect(() => {
    localStorage.setItem("elysium_mr_mode", minorityReportMode ? "1" : "0");
  }, [minorityReportMode]);

  // Theme
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("elysium_theme");
    return saved === "light" || saved === "dark" ? saved : "dark";
  });
  const [showPasswordRequestModal, setShowPasswordRequestModal] = useState(false);
  const [passwordRequestForm, setPasswordRequestForm] = useState({
    fullName: "",
    contactNumber: "",
    emailAddress: "",
    comments: "",
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("elysium_theme", theme);
  }, [theme]);

  useEffect(() => {
    writeRegisteredUsers(registeredUsers);
  }, [registeredUsers]);

  const pushPath = (path, replace = false) => {
    if (typeof window === "undefined") return;
    const nextPath = path || "/";
    if (window.location.pathname === nextPath) return;
    if (replace) {
      window.history.replaceState({}, "", nextPath);
      return;
    }
    window.history.pushState({}, "", nextPath);
  };

  const openPublicLanding = () => {
    setShowLandingMallTransition(true);
    setPublicView("landing");
    setError("");
    setAuthNotice("");
    setVerificationStatus("");
    if (isLoggedIn) {
      setShowLandingPage(true);
      pushPath(LANDING_PATH);
      return;
    }
    pushPath(LANDING_PATH);
  };

  const openAuthScreen = () => {
    setShowLandingMallTransition(true);
    setAuthIntent("signin");
    setPublicView("auth");
    setError("");
    setAuthNotice("");
    setVerificationStatus("");
    pushPath(SIGN_IN_PATH);
  };

  const openSimulatorGate = () => {
    setShowLandingMallTransition(true);
    if (!isLoggedIn) {
      openAuthScreen();
      return;
    }
    setShowLandingPage(false);
    setFlowStage("app");
    pushPath(SIMULATOR_PATH);
  };

  const goToInvestorPage = () => {
    if (typeof window !== "undefined") {
      window.location.href = INVESTOR_PAGE_URL;
    }
  };

  const updatePasswordRequestField = (field) => (event) => {
    const { value } = event.target;
    setPasswordRequestForm((prev) => ({ ...prev, [field]: value }));
  };

  const closePasswordRequestModal = () => {
    setShowPasswordRequestModal(false);
    setPasswordRequestForm({
      fullName: "",
      contactNumber: "",
      emailAddress: "",
      comments: "",
    });
  };

  const submitPasswordRequest = (event) => {
    event.preventDefault();
    const subject = "Elysium SmartMall Password Request";
    const body = [
      "Password request details:",
      `Full Name: ${passwordRequestForm.fullName}`,
      `Contact Number: ${passwordRequestForm.contactNumber}`,
      `Email Address: ${passwordRequestForm.emailAddress}`,
      "",
      "Comments:",
      passwordRequestForm.comments || "(none)",
    ].join("\n");

    if (typeof window !== "undefined") {
      window.location.href = `mailto:${PASSWORD_REQUEST_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
    closePasswordRequestModal();
  };

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const readRoute = () => {
      const normalizedPath = decodeURIComponent(window.location.pathname || "/")
        .toLowerCase()
        .replace(/\s+/g, "-");
      if (normalizedPath.includes("/sign-up") || normalizedPath.includes("/signup")) {
        return { view: "auth", intent: "signin" };
      }
      if (normalizedPath.includes("/verify-email")) {
        return { view: "verify", intent: "signin" };
      }
      if (normalizedPath.includes("/sign-in") || normalizedPath.includes("/signin")) {
        return { view: "auth", intent: "signin" };
      }
      if (normalizedPath.includes("/simulator")) {
        return { view: "simulator", intent: "signin" };
      }
      return { view: "landing", intent: "signin" };
    };

    const applyRoute = (replace = false) => {
      const route = readRoute();
      if (!isLoggedIn) {
        setPublicView(
          route.view === "auth" || route.view === "verify" ? route.view : "landing",
        );
        setAuthIntent(route.intent);
        if (route.view === "simulator") {
          openAuthScreen();
          return;
        }
        if (replace && route.view === "landing") pushPath(LANDING_PATH, true);
        return;
      }

      if (route.view === "landing" || route.view === "auth") {
        setShowLandingPage(true);
        setFlowStage("app");
        if (route.view === "auth") pushPath(LANDING_PATH, true);
        return;
      }

      setShowLandingPage(false);
      setFlowStage("app");
      if (replace && route.view !== "simulator") pushPath(SIMULATOR_PATH, true);
    };

    applyRoute(true);
    const onPopState = () => applyRoute(false);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isLoggedIn]);

  useEffect(() => {
    if (publicView !== "verify") return;
    if (typeof window === "undefined") return;
    let cancelled = false;

    const run = async () => {
      const query = new URLSearchParams(window.location.search);
      const token = query.get("token");
      if (!token) {
        setVerificationStatus("Verification link is missing a token.");
        return;
      }

      const remote = await verifyEmailRemote({ token });
      if (!cancelled && remote.ok) {
        const verifiedEmail = remote.data?.email || "your account";
        setPendingVerification(null);
        setVerificationStatus(`Email verified for ${verifiedEmail}. You can sign in now.`);
        setAuthNotice(`Email verified for ${verifiedEmail}. Please sign in.`);
        setPublicView("auth");
        setAuthIntent("signin");
        pushPath(SIGN_IN_PATH, true);
        return;
      }

      const users = readRegisteredUsers();
      const userToVerify = users.find(
        (user) => String(user.verificationToken || "") === token,
      );
      if (!userToVerify) {
        setVerificationStatus(
          remote.data?.message || "Verification link is invalid or expired.",
        );
        return;
      }

      if (!userToVerify.emailVerified) {
        const nextUsers = users.map((user) =>
          user.verificationToken === token
            ? {
                ...user,
                emailVerified: true,
                verificationToken: "",
              }
            : user,
        );
        setRegisteredUsers(nextUsers);
      }

      setPendingVerification(null);
      setVerificationStatus(`Email verified for ${userToVerify.email}. You can sign in now.`);
      setAuthNotice(`Email verified for ${userToVerify.email}. Please sign in.`);
      setPublicView("auth");
      setAuthIntent("signin");
      pushPath(SIGN_IN_PATH, true);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [publicView, SIGN_IN_PATH]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // AI session state
  const [session, setSession] = useState(() => createAIBrainSession());
  const [persona, setPersonaState] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null); // luxury storefront key
  const [messageLog, setMessageLog] = useState([]);
  const [walkthroughBrain, setWalkthroughBrain] = useState(null);
  const [requestedStoreKey, setRequestedStoreKey] = useState(null);
  const [walkDemoCommand, setWalkDemoCommand] = useState(null);
  const [coShopInviteSent, setCoShopInviteSent] = useState(false);
  const [coShopActive, setCoShopActive] = useState(false);
  const [coShopInviteEmail, setCoShopInviteEmail] = useState("");
  const [coShopInviteAccepted, setCoShopInviteAccepted] = useState(false);
  const [coShopJoinNotice, setCoShopJoinNotice] = useState("");
  const [demoCompletionNotice, setDemoCompletionNotice] = useState("");
  const [walkthroughInstanceKey, setWalkthroughInstanceKey] = useState(0);

  // ✅ storefront context when entering from walkthrough
  const [activeStorefront, setActiveStorefront] = useState(null); // {category,label,brand,aliases}

  // Walkthrough state
  const [walkLastEvent, setWalkLastEvent] = useState(null);

  // Demo runner
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoCountdown, setDemoCountdown] = useState(null);
  const [manualPlayMode, setManualPlayMode] = useState(true);
  const demoAbortRef = useRef(false);
  const demoRunLockRef = useRef(false);
  const demoCommandSeqRef = useRef(0);
  const [demoKey, setDemoKey] = useState(DEFAULT_DEMO_KEY);
  const promptedProductsRef = useRef(new Set());
  const handleDemoCommandHandled = useCallback(() => {
    setWalkDemoCommand(null);
  }, []);

  const cartCount = session.cart.length;
  const topStores = useMemo(
    () => getTopStores(session, 4).filter((s) => LUXURY_STORES.includes(s)).slice(0, 2),
    [session],
  );
  const topStoreLabels = useMemo(
    () => topStores.map((store) => formatStoreLabel(store)),
    [topStores],
  );
  const [stableTopStoreLabels, setStableTopStoreLabels] = useState([]);

  useEffect(() => {
    if (topStoreLabels.length) setStableTopStoreLabels(topStoreLabels);
  }, [topStoreLabels]);

  useEffect(() => {
    if (DEMO_SELECTOR_KEYS.includes(demoKey)) return;
    setDemoKey(DEFAULT_DEMO_KEY);
  }, [demoKey]);

  useEffect(() => {
    if (flowStage !== "brand_intro") return undefined;

    setShowBrandIntroMall(false);
    setIntroReadyToContinue(false);
    const dissolveTimer = window.setTimeout(() => {
      setShowBrandIntroMall(true);
    }, INTRO_STAGE_BLACK_MS);

    const readyTimer = window.setTimeout(() => {
      setIntroReadyToContinue(true);
    }, INTRO_STAGE_BLACK_MS + LANDING_INTRO_DISSOLVE_MS + INTRO_HOLD_MS);

    return () => {
      window.clearTimeout(dissolveTimer);
      window.clearTimeout(readyTimer);
    };
  }, [flowStage, INTRO_STAGE_BLACK_MS, LANDING_INTRO_DISSOLVE_MS, INTRO_HOLD_MS]);

  useEffect(() => {
    if (flowStage !== "brand_intro") return;
    if (!introReadyToContinue) return;
    setFlowStage("login");
    setPublicView("landing");
    setShowLandingPage(true);
    pushPath(LANDING_PATH);
  }, [flowStage, introReadyToContinue]);

  useEffect(() => {
    if (!showLandingMallTransition) return undefined;
    const timer = window.setTimeout(
      () => setShowLandingMallTransition(false),
      LANDING_INTRO_DISSOLVE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [showLandingMallTransition, LANDING_INTRO_DISSOLVE_MS]);

  const displayTopStoreLabels = topStoreLabels.length
    ? topStoreLabels
    : stableTopStoreLabels;

  /** ✅ If activeStorefront is set, filter store catalog down to that shop’s products */
  const storeCatalog = useMemo(() => {
    if (!selectedStore) return [];
    const base = PRODUCT_CATALOG[selectedStore] || [];
    if (!activeStorefront) return base;
    if (activeStorefront.category !== selectedStore) return base;
    const filtered = base.filter((p) => matchesStorefront(p, activeStorefront));
    // If filtered is empty, fall back to base so the shop never looks “empty”
    return orderLuxuryProducts(
      selectedStore,
      filtered.length ? filtered : base,
    );
  }, [selectedStore, activeStorefront]);

  /** ✅ Same filter applied to recos */
  const recommendations = useMemo(() => {
    if (!selectedStore) return [];
    const base = getRecommendations(session, selectedStore, 6); // ask for more, then filter down
    if (!activeStorefront)
      return orderLuxuryProducts(selectedStore, base).slice(0, 3);
    if (activeStorefront.category !== selectedStore)
      return orderLuxuryProducts(selectedStore, base).slice(0, 3);
    const filtered = base.filter((p) => matchesStorefront(p, activeStorefront));
    return orderLuxuryProducts(selectedStore, filtered.length ? filtered : base).slice(
      0,
      3,
    );
  }, [session, selectedStore, activeStorefront]);

  const pushMessage = (text) => {
    const msg = { text, ts: Date.now() };
    setMessageLog((prev) => [...prev.slice(-18), msg]);
  };

  const issueWalkDemoCommand = (type, payload = {}) => {
    demoCommandSeqRef.current += 1;
    setWalkDemoCommand({
      id: demoCommandSeqRef.current,
      type,
      ...payload,
    });
  };

  useEffect(() => {
    promptedProductsRef.current = new Set();
  }, [selectedStore, session.personaId]);

  const emitProductInsight = (product, source = "catalog") => {
    if (!product || !selectedStore) return;

    const dedupeKey = `${session.personaId || "none"}|${selectedStore}|${product.sku}|${source}`;
    if (promptedProductsRef.current.has(dedupeKey)) return;
    promptedProductsRef.current.add(dedupeKey);

    const personaLabel = session.personaLabel || "Shopper";
    const budgetFit = budgetFitLabel(session, product.price);
    const bandLabel = priceBandLabelFor(product.price);
    const price = Number(product.price) || 0;

    const anchorMessage =
      source === "recommendation"
        ? `Elly: ${product.name} is a ${budgetFit} for ${personaLabel} in ${selectedStore}.`
        : `Elly: Scanning ${product.name} in ${selectedStore} -> ${budgetFit}.`;

    pushMessage(anchorMessage);

    if (bandLabel === "premium") {
      pushMessage(
        `Elly: Suggest pairing high-ticket alternatives near $${Math.max(180, price - 120)}-$${price + 180}.`,
      );
      return;
    }
    if (bandLabel === "mid-range") {
      pushMessage(
        `Elly: Suggest similar style options near $${Math.max(60, price - 40)}-$${price + 60}.`,
      );
      return;
    }
    pushMessage(
      `Elly: Suggest budget-friendly alternatives near $${Math.max(20, price - 20)}-$${price + 30}.`,
    );
  };

  const hardResetDemoState = () => {
    demoAbortRef.current = true;

    setPersonaState(null);
    setSelectedStore(null);
    setActiveStorefront(null);
    setRequestedStoreKey(null);
    setWalkDemoCommand(null);
    setSession(createAIBrainSession());
    setMessageLog([]);
    setWalkthroughBrain(null);
    setDemoRunning(false);
    setCoShopInviteSent(false);
    setCoShopActive(false);
    setCoShopInviteAccepted(false);
    setCoShopInviteEmail("");
    setCoShopJoinNotice("");
    setDemoCompletionNotice("");
    setWalkthroughInstanceKey(0);

    // walkthrough reset
    setWalkLastEvent(null);

    demoAbortRef.current = false;
  };

  const resetAccessFlow = () => {
    demoAbortRef.current = true;
    setIsLoggedIn(false);
    setPublicView("landing");
    setAuthIntent("signin");
    setScanAuthorized(false);
    setShowBrandIntroMall(false);
    setIntroReadyToContinue(false);
    setShowLandingMallTransition(false);
    setShowLandingPage(true);
    setFlowStage("brand_intro");
    setEmail("");
    setPassword("");
    setAuthNotice("");
    setVerificationStatus("");
    setPendingVerification(null);
    hardResetDemoState();
    setCoShopInviteSent(false);
    setCoShopActive(false);
    setCoShopInviteAccepted(false);
    setCoShopInviteEmail("");
    setCoShopJoinNotice("");
    setDemoCompletionNotice("");
    setWalkthroughInstanceKey(0);
    pushPath(LANDING_PATH);
  };

  const friendDisplayLabel = useMemo(() => {
    const inviteEmail = coShopInviteEmail.trim().toLowerCase();
    if (!inviteEmail) return "Remote Friend";
    const local = inviteEmail.split("@")[0] || "Friend";
    const cleaned = local
      .replace(/[._-]+/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return cleaned || "Remote Friend";
  }, [coShopInviteEmail]);

  const coShopSession = coShopInviteAccepted
    ? {
        scenarioKey: "invite_friend",
        scenarioLabel: "Invite-a-Friend Session",
        description:
          "Two remote shoppers are active in the same virtual mall session while dual Elly streams compare both users in parallel.",
        inviteEmail: coShopInviteEmail,
        primaryLabel: "Primary Shopper",
        friendLabel: friendDisplayLabel,
        friendVariant: "female",
        friendStatus: `Joined live via ${coShopInviteEmail}`,
      }
    : null;

  useEffect(() => {
    if (!coShopJoinNotice) return undefined;
    const timer = window.setTimeout(() => setCoShopJoinNotice(""), 3200);
    return () => window.clearTimeout(timer);
  }, [coShopJoinNotice]);

  useEffect(() => {
    if (!demoCompletionNotice) return undefined;
    const timer = window.setTimeout(() => setDemoCompletionNotice(""), 5200);
    return () => window.clearTimeout(timer);
  }, [demoCompletionNotice]);

  const handleSendInvite = (nextEmail = coShopInviteEmail) => {
    const inviteEmail = String(nextEmail || "").trim().toLowerCase();
    if (!inviteEmail) {
      pushMessage("Co-shop: Enter a friend email before sending an invite.");
      return;
    }

    const local = inviteEmail.split("@")[0] || "Friend";
    const nextFriendLabel =
      local
        .replace(/[._-]+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase()) || "Remote Friend";

    setCoShopInviteEmail(inviteEmail);
    setCoShopInviteSent(true);
    setCoShopInviteAccepted(true);
    setCoShopActive(true);
    setSelectedStore(null);
    setActiveStorefront(null);
    setRequestedStoreKey(null);
    setWalkDemoCommand(null);
    setWalkthroughInstanceKey((prev) => prev + 1);
    setCoShopJoinNotice(
      `${nextFriendLabel} accepted the invite. Reloading the simulator into shared shopping mode...`,
    );
    pushMessage(
      `Co-shop: Invite sent to ${inviteEmail}. Mock acceptance confirmed.`,
    );
    pushMessage(
      `Co-shop: ${nextFriendLabel} is joining the virtual mall from a remote location.`,
    );
    pushMessage(
      "AI Brain: Dual Elly mode active. Reloading the mall from the main spawn so both shoppers can browse together.",
    );
    pushMessage(
      "Elly: Each shopper now has an individual analysis stream while recommendation overlap is compared side by side.",
    );
  };

  // Optional D: Deterministic persona selection from scan seed
  const pickPersonaFromSeed = (seed) => {
    const s = String(seed || "");
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    const idx = PERSONAS?.length ? h % PERSONAS.length : 0;
    return PERSONAS?.[idx] || null;
  };

  const applyScanProfile = ({ seed } = {}) => {
    // reset everything (fresh identity)
    hardResetDemoState();

    const p = pickPersonaFromSeed(seed);

    // Build ONE session deterministically
    const nextSession = createAIBrainSession();
    if (p) setPersona(nextSession, p);

    setPersonaState(p);
    setSession(nextSession);

    // Boot narrative
    setMessageLog([]);
    pushMessage("Retina Scan: complete.");
    pushMessage("AI Brain: building shopper profile…");
    pushMessage(
      `AI Brain: Persona selected → ${p?.label || nextSession.personaLabel || "Shopper"}.`,
    );
    pushMessage("Elly: online. Personalization enabled.");
  };

  const completeStandardLogin = () => {
    hardResetDemoState();
    setIsLoggedIn(true);
    setPublicView("landing");
    setScanAuthorized(false);
    setShowLandingPage(false);
    setShowBrandIntroMall(false);
    setIntroReadyToContinue(false);
    setShowLandingMallTransition(false);
    setFlowStage("app");
    pushPath(SIMULATOR_PATH);
  };

  const buildVerificationLink = useCallback(
    (token) => {
      if (typeof window === "undefined" || !token) return "";
      const nextUrl = new URL(VERIFY_EMAIL_PATH, window.location.origin);
      nextUrl.searchParams.set("token", token);
      return nextUrl.toString();
    },
    [VERIFY_EMAIL_PATH],
  );

  const sendVerificationEmailDraft = useCallback(
    ({ targetEmail, token, verificationLink }) => {
      if (typeof window === "undefined" || !targetEmail) return;
      const verifyLink = verificationLink || buildVerificationLink(token);
      if (!verifyLink) return;
      const subject = encodeURIComponent("Verify your Elysium account");
      const body = encodeURIComponent(
        `Welcome to Elysium.\n\nPlease verify your email by opening this link:\n${verifyLink}\n\nIf you did not request this account, ignore this message.`,
      );
      window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
      setAuthNotice(`Verification email draft prepared for ${targetEmail}.`);
    },
    [buildVerificationLink],
  );

  const handleResendVerification = useCallback(async () => {
    if (!pendingVerification?.email) return;
    const remote = await resendVerificationRemote({
      email: pendingVerification.email,
    });

    if (remote.ok) {
      const nextToken = remote.data?.verificationToken || pendingVerification.token;
      const nextLink =
        remote.data?.verificationLink || buildVerificationLink(nextToken);
      setPendingVerification({
        email: pendingVerification.email,
        token: nextToken,
        verificationLink: nextLink,
      });
      sendVerificationEmailDraft({
        targetEmail: pendingVerification.email,
        token: nextToken,
        verificationLink: nextLink,
      });
      return;
    }

    // Offline fallback: still allow local/draft verification UX.
    sendVerificationEmailDraft({
      targetEmail: pendingVerification.email,
      token: pendingVerification.token,
      verificationLink: pendingVerification.verificationLink,
    });
  }, [
    pendingVerification,
    buildVerificationLink,
    sendVerificationEmailDraft,
  ]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setAuthNotice("");

    const normalizedEmail = normalizeEmail(email);
    const normalizedPassword = String(password || "").trim();

    if (normalizedEmail === DEMO_EMAIL && normalizedPassword === DEMO_PASS) {
      hardResetDemoState();
      setPublicView("auth");
      setScanAuthorized(true);
      setShowLandingPage(false);
      setShowBrandIntroMall(false);
      setIntroReadyToContinue(false);
      setFlowStage("scan");
      pushPath(SIMULATOR_PATH);
      return;
    }

    const remoteSignIn = await signinRemote({
      email: normalizedEmail,
      password: normalizedPassword,
    });

    if (remoteSignIn.ok) {
      if (remoteSignIn.data?.type === "demo") {
        hardResetDemoState();
        setPublicView("auth");
        setScanAuthorized(true);
        setShowLandingPage(false);
        setShowBrandIntroMall(false);
        setIntroReadyToContinue(false);
        setFlowStage("scan");
        pushPath(SIMULATOR_PATH);
        return;
      }
      completeStandardLogin();
      return;
    }

    if (!remoteSignIn.networkError) {
      if (remoteSignIn.data?.code === "EMAIL_NOT_VERIFIED") {
        setPendingVerification({
          email: remoteSignIn.data?.email || normalizedEmail,
          token: remoteSignIn.data?.verificationToken || "",
          verificationLink: remoteSignIn.data?.verificationLink || "",
        });
      }
      setError(remoteSignIn.data?.message || "Invalid credentials. Please try again.");
      return;
    }

    const existingUser = registeredUsers.find(
      (user) => normalizeEmail(user.email) === normalizedEmail,
    );
    if (!existingUser || existingUser.password !== normalizedPassword) {
      setError("Invalid credentials. Please try again.");
      return;
    }
    if (!existingUser.emailVerified) {
      setPendingVerification({
        email: existingUser.email,
        token: existingUser.verificationToken,
      });
      setError("Please verify your email before signing in.");
      return;
    }

    completeStandardLogin();
  };

  const completeRetinaScan = ({ seed } = {}) => {
    applyScanProfile({ seed });
    setScanAuthorized(false);
    setIsLoggedIn(true);
    setError("");
    setShowLandingPage(false);
    setFlowStage("app");
    pushPath(SIMULATOR_PATH);
  };

  const handleLogout = () => {
    resetAccessFlow();
  };

  const onSelectPersona = (p) => {
    setPersonaState(p);

    setSession((prev) => {
      const next = structuredClone(prev);
      setPersona(next, p);
      return next;
    });

    pushMessage(`AI Brain: Persona selected → ${p.label}.`);
    pushMessage(
      "AI Brain: Updating mall priorities based on predicted intent…",
    );
  };

  /**
   * ✅ Updated openStore:
   * - store = category key ("Fashion", "Electronics", etc)
   * - storefrontCtx optional (when entered via walkthrough)
   */
  const openStore = (store, storefrontCtx = null) => {
    setSelectedStore(store);
    setActiveStorefront(storefrontCtx);

    setSession((prev) => {
      const next = structuredClone(prev);
      logStoreView(next, store);
      return next;
    });

    if (storefrontCtx?.label) {
      pushMessage(`Virtual Mall: Entered storefront → ${storefrontCtx.label}.`);
      pushMessage(
        `AI Brain: Switching to ${store} inventory filtered for this shop…`,
      );
    } else {
      pushMessage(`AI Brain: Tracking behavior → viewed ${store}.`);
    }
    pushMessage("AI Brain: Generating recommendations in real time…");
  };

  const openSimulatorStore = (store) => {
    const simKey = STORE_TO_SIM_KEY[store];
    if (!simKey) return;

    setSelectedStore(store);
    setActiveStorefront(null);
    setRequestedStoreKey(simKey);

    setSession((prev) => {
      const next = structuredClone(prev);
      logStoreView(next, store);
      return next;
    });

    pushMessage(
      `Virtual Mall: Opening ${formatStoreLabel(store)} inside the simulator.`,
    );
    pushMessage("AI Brain: Loading storefront products in-sim…");
  };

  const addItemToCart = (product, source = "recommendation") => {
    setSession((prev) => {
      const next = structuredClone(prev);
      addToCart(next, product);
      return next;
    });

    if (source === "recommendation") {
      pushMessage(`AI Brain: Cart updated → ${product.name}.`);
      pushMessage(
        `Elly: Purchase intent increased after ${product.name} was added to cart.`,
      );
    } else {
      pushMessage(
        `AI Brain: Saved interest signal from catalog → ${product.name}.`,
      );
      pushMessage(
        `Elly: Catalog interaction logged for ${product.name}; recalculating preference fit.`,
      );
    }
    pushMessage(
      `AI Brain: Comparing ${product.name} against budget, emotion, and cross-store affinity.`,
    );
    pushMessage(
      `Elly: Refreshing follow-up recommendations using cart and dwell behavior.`,
    );
    emitProductInsight(product, source);
  };

  /**
   * Walkthrough event handler
   * - STORE_INTERACT now routes into the correct storefront (category + product filter)
   */
  const handleWalkthroughEvent = (e) => {
    if (!e?.type) return;

    setWalkLastEvent(e.type);

    if (e.type === "STORE_ZONE_ENTER") {
      pushMessage(`Virtual Mall: Passing ${e.storeLabel} storefront…`);
      pushMessage(
        `AI Brain: Store signal detected → evaluating ${e.storeLabel} for affinity uplift.`,
      );
      pushMessage(
        `Elly: Scanning storefront context, category fit, and prior session overlap for ${e.storeLabel}.`,
      );
      return;
    }

    if (e.type === "STORE_ZONE_EXIT") {
      pushMessage(`Virtual Mall: Leaving ${e.storeLabel} storefront…`);
      pushMessage(
        `AI Brain: Exit logged from ${e.storeLabel}; preserving visit data for retarget ranking.`,
      );
      pushMessage(
        `Elly: Rebalancing next-store suggestions after ${e.storeLabel} exit behavior.`,
      );
      return;
    }

    if (e.type === "STORE_INTERACT") {
      pushMessage(`Virtual Mall: Enter requested → ${e.storeLabel}.`);
      pushMessage(
        "AI Brain: Loading storefront products directly inside the simulator…",
      );
      pushMessage(
        `Elly: Searching ${e.storeLabel} inventory for strongest budget and style matches.`,
      );
      pushMessage(
        `AI Brain: Building in-store recommendation stack from dwell, persona, and purchase history.`,
      );

      const ctx = WALK_STORE_CONTEXT[e.storeKey];
      if (ctx?.category) {
        setSelectedStore(ctx.category);
        setActiveStorefront(ctx);
        pushMessage(
          `AI Brain: Routed to ${ctx.label} simulator overlay.`,
        );
        pushMessage(
          `Elly: Suggesting hero products for ${ctx.label} based on live shopper intent.`,
        );
      } else {
        pushMessage(
          "AI Brain: No storefront mapping found (check WALK_STORE_CONTEXT).",
        );
      }
      return;
    }

    if (e.type === "STORE_CART_ADD") {
      pushMessage(
        `Virtual Mall: ${e.productName} added to cart inside ${e.storeLabel}.`,
      );
      pushMessage(
        `AI Brain: Retina scan signal captured → ${e.retinaSignal || "elevated product emotion detected."}`,
      );
      pushMessage(
        `Elly: ${e.productName} triggered ${e.emotionTag || "strong purchase resonance"}; searching for similar products with matching fit confidence.`,
      );
      pushMessage(
        `AI Brain: Comparing ${e.productName} against past browsing, cart composition, and likely conversion path.`,
      );
      if (coShopActive) {
        pushMessage(
          `Elly: Dual-shopper mode active — primary and friend sessions are now syncing around ${e.productName}.`,
        );
      }
      return;
    }

    // Dwell / stop personalization trigger (all luxury storefronts)
    if (e.type === "AVATAR_STOPPED" && e.storeLabel) {
      pushMessage(`Virtual Mall: Avatar paused at ${e.storeLabel}.`);
      pushMessage(
        "AI Brain: Dwell signal detected → refreshing luxury recommendations.",
      );
      pushMessage(
        `Elly: Interpreting pause behavior at ${e.storeLabel} as elevated attention and deeper consideration.`,
      );
      pushMessage(
        `AI Brain: Re-ranking featured products inside ${e.storeLabel} using emotion, price fit, and category confidence.`,
      );
    }
  };

  // Demo Script Runner
  const runDemo = async () => {
    if (demoRunning || demoRunLockRef.current) return;
    demoRunLockRef.current = true;

    setDemoRunning(true);
    setManualPlayMode(false);
    demoAbortRef.current = false;
    const countdownStart = 5;
    setDemoCountdown(countdownStart);

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    // Fast reset without remounting the simulator to avoid a visible double reload.
    demoAbortRef.current = true;
    setSelectedStore(null);
    setActiveStorefront(null);
    setRequestedStoreKey(null);
    setWalkDemoCommand(null);
    setWalkLastEvent(null);
    setWalkthroughBrain(null);
    setMessageLog([]);
    setSession(createAIBrainSession());
    setPersonaState(null);
    setCoShopInviteSent(false);
    setCoShopActive(false);
    setCoShopInviteAccepted(false);
    setCoShopInviteEmail("");
    setCoShopJoinNotice("");
    setDemoCompletionNotice("");
    await sleep(60);
    demoAbortRef.current = false;

    for (let remaining = countdownStart; remaining >= 1; remaining -= 1) {
      if (demoAbortRef.current) break;
      setDemoCountdown(remaining);
      pushMessage(`Demo starts in ${remaining}…`);
      await sleep(1000);
    }

    setDemoCountdown(null);
    if (demoAbortRef.current) {
      setDemoRunning(false);
      setManualPlayMode(true);
      demoRunLockRef.current = false;
      return;
    }

    let localSession = createAIBrainSession();
    let localPersona = null;
    let localStore = null;
    const storeVisitCounts = {};
    const plannedSelectionByStore = {};

    setSession(localSession);
    setPersonaState(null);
    setSelectedStore(null);
    setActiveStorefront(null);
    setMessageLog([]);
    setDemoCompletionNotice("");

    // walkthrough reset
    setWalkLastEvent(null);

    await sleep(250);

    const selectedScriptKey = DEMO_SELECTOR_KEYS.includes(demoKey)
      ? demoKey
      : DEFAULT_DEMO_KEY;
    const selectedScript = DEMO_SCRIPTS[selectedScriptKey] || DEMO_SCRIPTS[DEFAULT_DEMO_KEY];
    const isInviteFriendScenario = selectedScriptKey === "auto_social_coshop_tour";
    const steps = selectedScript?.steps || [];

    try {
      pushMessage(
        `Demo Script: Starting ${selectedScript?.label || "luxury walkthrough"}…`,
      );
      await sleep(600);

      for (const step of steps) {
        if (demoAbortRef.current) break;

        if (step.type === "message") {
          pushMessage(step.text);
          await sleep(step.ms ?? 850);
          continue;
        }

        if (step.type === "persona") {
          const p = PERSONAS.find((x) => x.id === step.personaId);
          if (p) {
            localPersona = p;
            localSession = structuredClone(localSession);
            setPersona(localSession, p);

            setPersonaState(p);
            setSession(localSession);

            pushMessage(`AI Brain: Persona selected → ${p.label}.`);
            pushMessage(
              "AI Brain: Updating mall priorities based on predicted intent…",
            );
          }
          await sleep(step.ms ?? 1100);
          continue;
        }

        if (step.type === "walk") {
          const storeLabel = formatStoreLabel(step.store);
          setWalkLastEvent(`USER_SIMULATOR: Walking to ${storeLabel}`);
          pushMessage(`Virtual Mall: User simulator walking toward ${storeLabel}.`);
          pushMessage(
            "AI Brain: Tracking gait, dwell direction, and route intent while approaching the next storefront.",
          );
          await sleep(step.ms ?? 950);
          continue;
        }

        if (step.type === "invite_prompt") {
          setWalkLastEvent("USER_SIMULATOR: Invite prompt displayed");
          issueWalkDemoCommand("OPEN_INVITE");
          pushMessage("Co-shop: Invite prompt opened in the simulator.");
          pushMessage(
            "AI Brain: Social mode available. Invite a second shopper to compare intent in parallel.",
          );
          await sleep(step.ms ?? 1200);
          continue;
        }

        if (step.type === "invite_send") {
          const inviteEmail = String(step.email || "friend@elysiummock.com").toLowerCase();
          handleSendInvite(inviteEmail);
          issueWalkDemoCommand("CLOSE_INVITE");
          setWalkLastEvent(`USER_SIMULATOR: Invite sent to ${inviteEmail}`);
          await sleep(step.ms ?? 1300);
          continue;
        }

        if (step.type === "live_interaction") {
          const prompts = Array.isArray(step.prompts) ? step.prompts.filter(Boolean).slice(0, 4) : [];
          issueWalkDemoCommand("NAVIGATE_TO_LIVE_USER", {
            userIndex: Number(step.userIndex) || 0,
          });
          await sleep(2200);
          if (prompts.length) {
            issueWalkDemoCommand("LIVE_INTERACTION", {
              prompts,
              durationMs: step.durationMs || 5600,
              userIndex: Number(step.userIndex) || 0,
            });
            prompts.forEach((line) => pushMessage(line));
          }
          await sleep(step.ms ?? 1400);
          continue;
        }

        if (step.type === "store") {
          localStore = step.store;
          storeVisitCounts[step.store] = (storeVisitCounts[step.store] || 0) + 1;
          const storeLabel = formatStoreLabel(step.store);
          const simKey = STORE_TO_SIM_KEY[step.store];

          localSession = structuredClone(localSession);
          logStoreView(localSession, step.store);

          setSelectedStore(step.store);
          setActiveStorefront(null);
          setRequestedStoreKey(simKey || null);
          setWalkLastEvent(`USER_SIMULATOR: ${storeLabel}`);
          setSession(localSession);

          const storeCycle = Math.max(0, (storeVisitCounts[step.store] || 1) - 1);
          const previewRecos = getRecommendations(localSession, step.store, 4);
          const previewSelection = pickDemoSelection({
            store: step.store,
            recos: previewRecos,
            personaId: localPersona?.id || "fashion",
            session: localSession,
            cycle: storeCycle,
          });
          plannedSelectionByStore[step.store] = previewSelection || null;

          if (simKey && previewSelection?.product) {
            issueWalkDemoCommand("SET_STORE_SUGGESTION", {
              storeKey: simKey,
              productName: previewSelection.product.name || null,
              productSku: previewSelection.product.sku || null,
              productId: previewSelection.product.id || null,
              color: previewSelection.color,
              sizeProfile: previewSelection.sizeProfile,
              reason: `${storeLabel}: ${previewSelection.product.name} pre-ranked from prior purchases, retina behavior, and ${previewSelection.color} preference.`,
            });
          }

          if (simKey) {
            issueWalkDemoCommand("NAVIGATE_TO_STORE", {
              storeKey: simKey,
              mode: "hud",
            });
          }
          pushMessage(`Virtual Mall: User simulator focused on ${storeLabel}.`);
          pushMessage("Virtual Mall: Pausing at hologram cards to review Elly suggestions.");
          await sleep(5000);

          if (simKey) {
            issueWalkDemoCommand("NAVIGATE_TO_STORE", {
              storeKey: simKey,
              mode: "entry",
            });
          }
          pushMessage("Virtual Mall: Approaching storefront entry point.");
          await sleep(1850);

          if (simKey) {
            issueWalkDemoCommand("OPEN_STORE", { storeKey: simKey });
          }
          pushMessage(
            "Virtual Mall: Entered storefront and loaded product overlay in-sim.",
          );
          pushMessage(`AI Brain: Tracking behavior → viewed ${storeLabel}.`);
          pushMessage("AI Brain: Generating recommendations in real time…");

          await sleep(step.ms ?? 1400);
          continue;
        }

        if (step.type === "add_top_reco") {
          if (!localStore) {
            await sleep(step.ms ?? 650);
            continue;
          }

          const pickCount = Math.max(1, Number(step.count) || 1);
          const recos = getRecommendations(localSession, localStore, Math.max(6, pickCount + 2));
          const storeKey = simKeyForStore(localStore);
          const storeCycle = Math.max(0, (storeVisitCounts[localStore] || 1) - 1);

          for (let i = 0; i < pickCount; i += 1) {
            const selection =
              plannedSelectionByStore[localStore] ||
              pickDemoSelection({
                store: localStore,
                recos,
                personaId: localPersona?.id || "fashion",
                session: localSession,
                cycle: storeCycle + i,
              });
            const pick = selection?.product;
            if (!pick || !selection) continue;

            localSession = structuredClone(localSession);
            addToCart(localSession, pick);
            setSession(localSession);
            pushMessage(`AI Brain: Cart updated → ${pick.name}.`);
            const reason = `${formatStoreLabel(localStore)}: ${pick.name} selected from purchase history, retina response, preferred ${selection.color} palette, and ${selection.sizeProfile}.`;
            pushMessage(
              `Elly: Selected ${pick.name} (${selection.color}) using prior purchases, brand affinity, and retina confidence signals.`,
            );
            if (isInviteFriendScenario) {
              pushMessage(
                `Elly Co-Shop: Consensus pick locked for both shoppers at ${formatStoreLabel(localStore)} after overlap analysis.`,
              );
            }
            pushMessage(
              `Elly: Size profile forecast ${selection.sizeProfile} with high fit confidence for this shopper.`,
            );

            if (storeKey) {
              issueWalkDemoCommand("ADD_PRODUCT", {
                storeKey,
                productId: pick.id || null,
                productName: pick.name || null,
                productSku: pick.sku || null,
                color: selection.color,
                sizeProfile: selection.sizeProfile,
                reason,
              });
            }
            await sleep(2400);
          }

          plannedSelectionByStore[localStore] = null;

          await sleep(step.ms ?? 2200);
          continue;
        }

        if (step.type === "complete") {
          issueWalkDemoCommand("COMPLETE_DEMO");
          setWalkLastEvent("USER_SIMULATOR: Demo complete - checkout summary ready");
          setDemoCompletionNotice(
            coShopActive
              ? "Auto social simulation complete: both shoppers visited all storefronts and reached checkout summary."
              : "Auto solo simulation complete: shopper visited all storefronts and reached checkout summary.",
          );
          pushMessage("Virtual Mall: Simulation complete. Final cart summary and checkout state ready.");
          pushMessage("AI Brain: End-of-session recap generated for investor review.");
          if (localSession.cart.length) {
            localSession.cart.forEach((item) => {
              pushMessage(
                `Elly Conclusion: ${item.name} (${item.brand || "luxury store"}) recommended from purchase history + retina response + fit-confidence modeling.`,
              );
            });
          }
          await sleep(step.ms ?? 1200);
          continue;
        }
      }

      await sleep(500);
      pushMessage(
        `Demo Script: Finished ${selectedScript?.label || "luxury walkthrough"}. (${localPersona?.label || localSession?.personaLabel || "Persona"} session)`,
      );
    } finally {
      setDemoRunning(false);
      setManualPlayMode(true);
      demoRunLockRef.current = false;
    }
  };

  const stopDemo = () => {
    demoAbortRef.current = true;
    demoRunLockRef.current = false;
    setDemoCountdown(null);
    setManualPlayMode(true);
    pushMessage("Demo Script: Stopped. Manual play is now active.");
    setDemoRunning(false);
  };

  const resetDemo = (silent = false) => {
    demoAbortRef.current = true;
    demoRunLockRef.current = false;
    setDemoRunning(false);
    setManualPlayMode(true);
    setSelectedStore(null);
    setActiveStorefront(null);
    setRequestedStoreKey(null);
    setWalkDemoCommand(null);
    setWalkLastEvent(null);
    setWalkthroughBrain(null);
    setMessageLog([]);
    setSession(createAIBrainSession());
    setPersonaState(null);
    setCoShopInviteSent(false);
    setCoShopActive(false);
    setCoShopInviteAccepted(false);
    setCoShopInviteEmail("");
    setCoShopJoinNotice("");
    setDemoCompletionNotice("");
    setWalkthroughInstanceKey((prev) => prev + 1);
    setDemoCountdown(null);
    demoAbortRef.current = false;
    if (!silent) {
      pushMessage("Demo reset: simulator homed to start and ready for a fresh run.");
    }
  };

  const switchToManualPlay = () => {
    if (demoRunning) {
      stopDemo();
      return;
    }
    setManualPlayMode(true);
    pushMessage(
      "Manual Play: You can now control movement, invites, storefront entry, and cart actions directly.",
    );
  };

  useEffect(() => {
    if (!isLoggedIn) demoAbortRef.current = true;
  }, [isLoggedIn]);

  const showPublicLanding = !isLoggedIn ? publicView === "landing" : showLandingPage;
  const showAuthScreen = !isLoggedIn && publicView === "auth";
  const showVerifyScreen = !isLoggedIn && publicView === "verify";
  const isFullPageStage = flowStage === "brand_intro" || showPublicLanding;
  const introTransitionActive =
    flowStage === "brand_intro" && showBrandIntroMall && !introReadyToContinue;

  return (
    <div className={`app ${isFullPageStage ? "appFull" : ""}`}>
      {flowStage === "brand_intro" ? (
        <div
          className={`brandIntro ${introReadyToContinue ? "brandIntroReady" : ""} ${introTransitionActive ? "brandIntroFizzleOn" : ""}`}
          aria-live="polite"
        >
          <div className={`brandIntroLayer ${showBrandIntroMall ? "isHidden" : ""}`}>
            <div className="brandIntroBlack" />
          </div>
          <div className={`brandIntroLayer ${showBrandIntroMall ? "isVisible" : ""}`}>
            <div className="brandIntroMall" />
            {showBrandIntroMall ? (
              <p className="brandIntroTagline">The Future of Digital Commerce</p>
            ) : null}
          </div>
          <div className="brandIntroFizzle" aria-hidden="true" />
        </div>
      ) : flowStage === "scan" && scanAuthorized && !isLoggedIn ? (
        <RetinaScan
          onComplete={completeRetinaScan}
          autoStart
          hidePasswordOption
        />
      ) : showVerifyScreen ? (
        <div className="loginWrap">
          <div className="loginBox">
            <h1>Verify your email</h1>
            <p>
              {verificationStatus ||
                "Checking your verification link. If this takes too long, return to sign in and request another verification email draft."}
            </p>
            <div className="authActions">
              <button
                className="btn primary"
                type="button"
                onClick={openAuthScreen}
              >
                Go to Sign In
              </button>
              <button className="btn" type="button" onClick={openPublicLanding}>
                Back to Landing
              </button>
              <button className="btn" type="button" onClick={goToInvestorPage}>
                Back to Investor Page
              </button>
            </div>
          </div>
        </div>
      ) : showAuthScreen ? (
        <div className="loginWrap">
          <div className="loginBox">
            <h1>Investor Sign In</h1>
            <p>Sign in to continue to the private simulator.</p>

            <form onSubmit={handleAuthSubmit}>
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  placeholder="name@company.com"
                  required
                  autoComplete="username"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>

              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  placeholder="Enter investor password"
                  required
                  autoComplete="current-password"
                />
              </div>

              {error ? <div className="error">{error}</div> : null}
              {authNotice ? <div className="notice">{authNotice}</div> : null}

              <div className="authActions">
                <button className="btn primary" type="submit">
                  Sign In
                </button>
                <button className="btn" type="button" onClick={toggleTheme}>
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
                <button className="btn" type="button" onClick={openPublicLanding}>
                  Back to Landing
                </button>
                <button className="btn" type="button" onClick={goToInvestorPage}>
                  Back to Investor Page
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : showPublicLanding ? (
        <div id="home" className="officialLanding">
          {showLandingMallTransition ? (
            <div className="officialLandingMallFade" aria-hidden="true">
              <div className="officialLandingMallFadeScene" />
            </div>
          ) : null}
          <header className="officialHeader">
            <div className="officialHeaderInner">
              <nav className="officialNavLinks" aria-label="Primary">
                <a href="#home" className="officialNavItem">HOME</a>
                <div className="officialNavDropdown">
                  <button className="officialNavItem officialNavItemBtn" type="button">
                    EXPERIENCE
                  </button>
                  <div className="officialNavMenu">
                    <a href="#services">Services</a>
                    <a href="#about">Immersive Vision</a>
                  </div>
                </div>
                <div className="officialNavDropdown">
                  <button className="officialNavItem officialNavItemBtn" type="button">
                    COMPANY
                  </button>
                  <div className="officialNavMenu">
                    <a href="#about">About Elysium</a>
                    <a href="#contact">Contact</a>
                  </div>
                </div>
              </nav>
              <div className="officialNavAuth">
                <button
                  className="officialAuthBtn"
                  type="button"
                  onClick={goToInvestorPage}
                >
                  Back to Investor Page
                </button>
                <div className="officialPasswordRequestWrap">
                  <button
                    className="officialAuthBtn officialPasswordRequestBtn"
                    type="button"
                    onClick={() => setShowPasswordRequestModal(true)}
                  >
                    REQUEST PASSWORD
                  </button>
                  <span className="officialPasswordHint">Requires Password</span>
                </div>
              </div>
            </div>
          </header>

          <div className="officialCanvas">
            <section className="officialHero">
              <div className="officialHeroCopy">
                <h1>Welcome to Elysium</h1>
                <h2>The Future of Digital Commerce</h2>
                <p>
                  Elysium combines AI-driven merchandising, immersive luxury
                  storefronts, and real-time shopper intelligence to deliver a
                  modern digital mall experience.
                </p>
                <div className="officialHeroActions">
                  <button
                    className="officialGetStarted"
                    type="button"
                    onClick={openSimulatorGate}
                  >
                    Full Demo Site
                  </button>
                </div>
                <p className="officialHeroActionNote">
                  Opens the password-protected SmartMall simulator.
                </p>
              </div>
              <div className="officialHeroVisual">
                <img
                  src="/Ellylogo2/LuxuryBagCutout1.png?v=20260326"
                  alt="Elysium brain-in-bag hero logo"
                />
              </div>
            </section>

            <section className="officialFeatureRow">
              <article className="officialFeatureCard">
                <div className="officialFeatureIcon">🛒</div>
                <div>
                  <h3>AI-Driven Shopping</h3>
                  <p>
                    Personalized recommendations adapt instantly to behavior,
                    intent, and live session context.
                  </p>
                </div>
              </article>
              <article className="officialFeatureCard officialFeatureCardMid">
                <div className="officialFeatureIcon">🛋️</div>
                <div>
                  <h3>Immersive Experiences</h3>
                  <p>
                    Walkthrough-ready virtual stores enable premium discovery,
                    co-shopping, and guided conversion journeys.
                  </p>
                </div>
              </article>
              <article className="officialFeatureCard">
                <div className="officialFeatureIcon">📈</div>
                <div>
                  <h3>Smart Analytics</h3>
                  <p>
                    Track engagement, product interest, and purchase signals
                    with actionable performance insights.
                  </p>
                </div>
              </article>
            </section>

            <section id="about" className="officialSection">
              <div className="officialSectionHeader">
                <h2>About Elysium</h2>
                <p>
                  Elysium is building a premium digital mall where AI assistants,
                  immersive storefronts, and merchant analytics work together in one
                  platform.
                </p>
              </div>
              <div className="officialAboutGrid">
                <article className="officialInfoCard">
                  <h3>Our Mission</h3>
                  <p>
                    Create a modern, intelligent commerce environment that helps
                    shoppers discover faster and helps brands convert with confidence.
                  </p>
                </article>
                <article className="officialInfoCard">
                  <h3>What Makes Us Different</h3>
                  <p>
                    Session-aware recommendations, co-shopping support, and
                    walkthrough-ready luxury experiences built for measurable growth.
                  </p>
                </article>
              </div>
            </section>

            <section id="services" className="officialSection">
              <div className="officialSectionHeader">
                <h2>Services</h2>
                <p>
                  Core offerings for digital mall operators, premium brands, and
                  enterprise commerce teams.
                </p>
              </div>
              <div className="officialServiceGrid">
                <article className="officialInfoCard">
                  <h3>AI Merchandising</h3>
                  <p>
                    Real-time product ranking and recommendation tuning based on
                    active shopper behavior and intent signals.
                  </p>
                </article>
                <article className="officialInfoCard">
                  <h3>Immersive Storefronts</h3>
                  <p>
                    Interactive virtual environments for premium discovery, guided
                    journeys, and collaborative shopping experiences.
                  </p>
                </article>
                <article className="officialInfoCard">
                  <h3>Performance Insights</h3>
                  <p>
                    Actionable dashboards for engagement, product interest, and
                    purchase outcomes across every storefront touchpoint.
                  </p>
                </article>
              </div>
            </section>

            <section id="news" className="officialSection">
              <div className="officialSectionHeader">
                <h2>Window Frame News</h2>
                <p>Post news updates in the window frames for investors and partners.</p>
              </div>
              <div className="officialAboutGrid">
                <article className="officialInfoCard">
                  <h3>Window Frame 1</h3>
                  <p>Upcoming launch updates and strategic milestones.</p>
                </article>
                <article className="officialInfoCard">
                  <h3>Window Frame 2</h3>
                  <p>Recent partnership and product announcements.</p>
                </article>
              </div>
            </section>

            <section id="contact" className="officialSection officialContactSection">
              <div className="officialSectionHeader">
                <h2>Contact Us</h2>
                <p>
                  Questions, feedback, concerns, or partnership requests are welcome.
                </p>
              </div>
              <div className="officialContactGrid">
                <article className="officialInfoCard">
                  <h3>Business Information</h3>
                  <p>Elysium Inc.</p>
                  <p>
                    Contact Team Email:{" "}
                    <a href={`mailto:${PASSWORD_REQUEST_EMAIL}`}>{PASSWORD_REQUEST_EMAIL}</a>
                  </p>
                  <p>Support Channel: By request</p>
                </article>
                <article className="officialInfoCard">
                  <h3>Password Requests</h3>
                  <p>
                    Use Request Password to send your full name, contact number,
                    email, and comments directly to the Elysium team.
                  </p>
                  <div className="officialContactActions">
                    <button
                      className="officialGetStarted officialGetStartedSmall"
                      type="button"
                      onClick={() => setShowPasswordRequestModal(true)}
                    >
                      Request Password
                    </button>
                  </div>
                </article>
              </div>
            </section>
          </div>

          <footer className="officialFooter">
            <div className="officialFooterInner">
              <span>
                © {new Date().getFullYear()} Elysium Mall Inc. All rights
                reserved. Built for next-generation digital commerce.
              </span>
              <div className="officialFooterLinks">
                <a href="#news">Post News in Window Frames</a>
                <a href="#contact">Contact Us</a>
              </div>
            </div>
          </footer>

          {showPasswordRequestModal ? (
            <div className="officialPasswordModalBackdrop">
              <div className="officialPasswordModal">
                <div className="officialPasswordModalKicker">Requires Password</div>
                <h3>Request Password</h3>
                <form onSubmit={submitPasswordRequest}>
                  <label htmlFor="request-full-name">Full Name</label>
                  <input
                    id="request-full-name"
                    value={passwordRequestForm.fullName}
                    onChange={updatePasswordRequestField("fullName")}
                    required
                  />

                  <label htmlFor="request-contact-number">Contact Number</label>
                  <input
                    id="request-contact-number"
                    value={passwordRequestForm.contactNumber}
                    onChange={updatePasswordRequestField("contactNumber")}
                    required
                  />

                  <label htmlFor="request-email-address">Email Address</label>
                  <input
                    id="request-email-address"
                    type="email"
                    value={passwordRequestForm.emailAddress}
                    onChange={updatePasswordRequestField("emailAddress")}
                    required
                  />

                  <label htmlFor="request-comment">Comment</label>
                  <textarea
                    id="request-comment"
                    rows={3}
                    value={passwordRequestForm.comments}
                    onChange={updatePasswordRequestField("comments")}
                  />

                  <div className="officialPasswordModalActions">
                    <button className="officialAuthBtn" type="button" onClick={closePasswordRequestModal}>
                      Cancel
                    </button>
                    <button className="officialGetStarted officialGetStartedSmall" type="submit">
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="card">
          <div className="topbar">
            <div className="brand">
              <h1>Elysium • Virtual Smart Mall</h1>
              <p>
                AI-guided shopping simulation • session-based personalization
              </p>
            </div>

            <div className="actions">
              <span className="badge">Cart: {cartCount}</span>
              <span className="badge">
                {coShopActive ? "Friend Shopping: Joined" : "Friend Shopping: Solo"}
              </span>

              <button className="btn" onClick={toggleTheme}>
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>

              <button
                className="btn"
                onClick={() => {
                  openPublicLanding();
                }}
                disabled={demoRunning}
              >
                Back to Landing
              </button>

              <button
                className="btn"
                onClick={goToInvestorPage}
                disabled={demoRunning}
              >
                Back to Investor Page
              </button>

              <button
                className="btn"
                onClick={() => {
                  resetAccessFlow();
                }}
                disabled={demoRunning}
              >
                Reset Session
              </button>

              <button className="btn danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          {true ? (
            <div className="homeGrid">
              <div className="panel personaRow">
                <AvatarStepper
                  persona={persona}
                  onSelectPersona={onSelectPersona}
                />
              </div>

              <div className="panel ellyPanel">
                <h2>AI Brain Live Activity</h2>
                <p className="muted">
                  Live AI activity stays visible above the simulator so
                  investors can follow decisions while the user is moving
                  through the mall.
                </p>
                <EllyChat
                  personaLabel={session.personaLabel}
                  activeStore={selectedStore}
                  messageLog={messageLog}
                  brainSnapshot={walkthroughBrain}
                />
              </div>

              <div className="panel walkRow">
                <h2>Virtual Mall Walkthrough</h2>
                <p className="muted">
                  Click inside the simulator below to take control of the mall
                  walkthrough.
                </p>
                {coShopJoinNotice ? (
                  <div className="walkJoinNotice">{coShopJoinNotice}</div>
                ) : null}
                {demoCompletionNotice ? (
                  <div className="walkJoinNotice">{demoCompletionNotice}</div>
                ) : null}
                <div className="walkInstructionBar">
                  <div className="walkOperateHint">
                    <div className="walkOperateTitle">Quick start</div>
                    <div className="walkOperateCopy">
                      Click inside the simulator, move with <strong>Arrows</strong>, hold <strong>Shift</strong> while moving to run, press <strong>E</strong> at storefronts to shop, and press <strong>I</strong> to invite a friend.
                    </div>
                    <div className="walkOperateNote">
                      To use mouse again, select <strong>Escape</strong> on keyboard.
                    </div>
                  </div>
                  <div className="walkKeyAndDemo">
                    <div className="walkHotkeys" aria-label="Walkthrough hotkeys">
                      <span className="walkHotkey">
                        <b>Arrows</b>
                        <span>Move</span>
                      </span>
                      <span className="walkHotkey">
                        <b>Mouse</b>
                        <span>Look</span>
                      </span>
                      <span className="walkHotkey">
                        <b>Arrows + Shift</b>
                        <span>Run</span>
                      </span>
                      <span className="walkHotkey">
                        <b>E</b>
                        <span>Enter</span>
                      </span>
                      <span className="walkHotkey">
                        <b>Esc</b>
                        <span>Exit</span>
                      </span>
                      <span className="walkHotkey">
                        <b>V</b>
                        <span>View</span>
                      </span>
                      <span className="walkHotkey">
                        <b>I</b>
                        <span>Invite</span>
                      </span>
                      <span className="walkHotkey">
                        <b>M</b>
                        <span>Map</span>
                      </span>
                    </div>
                    <div className="walkDemoActivation walkDemoInline">
                      <div className="walkDemoTitle">Luxury Demo Guide</div>
                      <div className="walkDemoControls">
                        <select
                          value={demoKey}
                          onChange={(ev) => setDemoKey(ev.target.value)}
                          className="btn"
                          disabled={demoRunning}
                          aria-label="Luxury Demo Script"
                        >
                          {DEMO_SELECTOR_KEYS.map((key) => {
                            const script = DEMO_SCRIPTS[key];
                            if (!script) return null;
                            return (
                              <option key={key} value={key}>
                                {script.label}
                              </option>
                            );
                          })}
                        </select>
                        <button
                          className="btn primary"
                          onClick={runDemo}
                          disabled={demoRunning}
                        >
                          {demoRunning
                            ? demoCountdown
                              ? `Starting in ${demoCountdown}…`
                              : "Running Demo…"
                            : "Run Luxury Demo"}
                        </button>
                        <button
                          className="btn"
                          onClick={switchToManualPlay}
                          disabled={!demoRunning && manualPlayMode}
                        >
                          {demoRunning ? "Switch to Manual Play" : "Manual Play Active"}
                        </button>
                        <button
                          className="btn"
                          onClick={() => resetDemo(false)}
                        >
                          Reset Demo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <VirtualMallWalkthroughR3F
                  key={walkthroughInstanceKey}
                  height="clamp(560px, 66vh, 860px)"
                  onEvent={handleWalkthroughEvent}
                  onBrainStateChange={setWalkthroughBrain}
                  requestedStoreKey={requestedStoreKey}
                  onRequestedStoreHandled={() => setRequestedStoreKey(null)}
                  coShopActive={coShopActive}
                  coShopSession={coShopSession}
                  coShopInviteEmail={coShopInviteEmail}
                  onCoShopInviteEmailChange={setCoShopInviteEmail}
                  onCoShopInviteSend={handleSendInvite}
                  demoCommand={walkDemoCommand}
                  onDemoCommandHandled={handleDemoCommandHandled}
                />
              </div>

              <div className="bottomControls">
                <div className="panel summaryPanel">
                  <h2>Session Summary</h2>
                  <p className="muted">Quick view of what the AI is learning.</p>

                  <div className="summaryCompact">
                    <div className="summaryItem">
                      <p className="title">Persona</p>
                      <p className="value">
                        {session.personaLabel || "Not selected yet"}
                      </p>
                    </div>

                    <div className="summaryItem">
                      <p className="title">AI Priority Stores</p>
                      <p className="value">
                        {displayTopStoreLabels.length
                          ? displayTopStoreLabels.join(", ")
                          : "—"}
                      </p>
                    </div>

                    <div className="summaryItem">
                      <p className="title">Walkthrough</p>
                      <p className="value">
                        {walkLastEvent
                          ? walkLastEvent.startsWith("USER_SIMULATOR:")
                            ? walkLastEvent.replace("USER_SIMULATOR:", "User simulator:")
                            : `Last event: ${walkLastEvent} (Press E at the door to enter)`
                          : "Click walkthrough canvas, use WASD or arrow keys + mouse + E to enter"}
                      </p>
                    </div>

                    <div className="summaryItem">
                      <p className="title">Cart</p>
                      <p className="value">
                        {session.cart.length
                          ? session.cart
                              .map((c) => c.name)
                              .slice(0, 3)
                              .join(" • ")
                          : "Cart is empty"}
                      </p>
                    </div>

                    <div className="summaryItem">
                      <p className="title">Tip</p>
                      <p className="value">
                        Use Walkthrough → press E to enter → storefront filters
                        products automatically.
                      </p>
                    </div>

                    <div className="summaryItem">
                      <p className="title">Co-Shopping</p>
                      <p className="value">
                        {coShopActive
                          ? `${friendDisplayLabel} is now in the simulator with the primary shopper. Both Ellys are analyzing each shopper independently while comparing overlap in real time.`
                          : coShopInviteSent
                            ? `Invite sent to ${coShopInviteEmail || "friend"}. The simulator will reload into shared shopping mode for the mock social session.`
                            : "Invite a friend by email to join the same mall session with their own avatar, Elly stream, and recommendation track."}
                      </p>
                    </div>

                    <div className="summaryItem">
                      <p className="title">Social Demo</p>
                      <p className="value">
                        Two people in different locations can meet inside the virtual mall, shop together, and let separate Elly assistants analyze each shopper at the same time.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="panel storefrontPanel">
                  <CategoryTiles
                    stores={LUXURY_STORES}
                    topStores={displayTopStoreLabels}
                    selectedStore={selectedStore}
                    onCategoryClick={openSimulatorStore}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="storeLayout">
              <div className="panel">
                <div className="storeHeader">
                  <div>
                    {/* ✅ If entered via walkthrough, show storefront label */}
                    <h2 style={{ margin: 0 }}>
                      {activeStorefront?.label
                        ? activeStorefront.label
                        : selectedStore}
                    </h2>

                    <p className="muted" style={{ margin: "6px 0 0" }}>
                      {activeStorefront?.label
                        ? `Storefront connected to ${selectedStore} catalog • filtered for ${activeStorefront.brand}`
                        : "AI recommendations update based on in-session behavior."}
                    </p>
                  </div>

                  <button
                    className="btn primary backToMallBtn"
                    onClick={() => {
                      setSelectedStore(null);
                      setActiveStorefront(null);
                    }}
                  >
                    Back to Mall
                  </button>
                </div>

                <div className="grid2">
                  <div className="panel">
                    <h2>AI Recommendations</h2>
                    <p className="muted">Top picks for this shopper profile</p>

                    <div className="priorityBar">
                      {displayTopStoreLabels.map((s) => (
                        <span key={s} className="badge">
                          AI Priority: {s}
                        </span>
                      ))}
                    </div>

                    <div className="whyLine">
                      <span className="whyLabel">Why these picks</span>
                      <span className="whyText">
                        {explainReco(session, selectedStore)}
                      </span>
                    </div>

                    <div className="products" style={{ marginTop: 12 }}>
                      {recommendations.map((p) => (
                        <div
                          className="productCard"
                          key={p.sku}
                          onMouseEnter={() => emitProductInsight(p, "recommendation")}
                          onFocusCapture={() => emitProductInsight(p, "recommendation")}
                        >
                          <ProductThumb product={p} />
                          <div className="productMain">
                            <p className="productName">
                              {p.brandMark} • {p.name}
                            </p>
                            <p className="productMeta">
                              {p.brand} • SKU: {p.sku}
                            </p>

                            <div className="priceRow">
                              <span className="badge">${p.price}</span>
                              <button
                                className="btn primary"
                                onClick={() =>
                                  addItemToCart(p, "recommendation")
                                }
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {!recommendations.length ? (
                        <p className="muted">No recommendations available.</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="panel">
                    <h2>
                      {activeStorefront?.label
                        ? `${activeStorefront.label} Catalog`
                        : "Store Catalog"}
                    </h2>
                    <p className="muted">
                      {activeStorefront?.label
                        ? "Connected storefront inventory (filtered from catalog)."
                        : "Baseline inventory for demo"}
                    </p>

                    <div className="products" style={{ marginTop: 12 }}>
                      {storeCatalog.map((p) => (
                        <div
                          className="productCard"
                          key={p.sku}
                          onMouseEnter={() => emitProductInsight(p, "catalog")}
                          onFocusCapture={() => emitProductInsight(p, "catalog")}
                        >
                          <ProductThumb product={p} />
                          <div className="productMain">
                            <p className="productName">
                              {p.brandMark} • {p.name}
                            </p>
                            <p className="productMeta">
                              {p.brand} • SKU: {p.sku}
                            </p>

                            <div className="priceRow">
                              <span className="badge">${p.price}</span>
                              <button
                                className="btn"
                                onClick={() => addItemToCart(p, "catalog")}
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {!storeCatalog.length ? (
                        <p className="muted">No catalog items.</p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="panel" style={{ marginTop: 14 }}>
                  <EllyChat
                    personaLabel={session.personaLabel}
                    activeStore={selectedStore}
                    messageLog={messageLog}
                  />
                </div>
              </div>

              <div className="panel summaryPanel">
                <h2>Session Summary</h2>
                <p className="muted">Quick view of what the AI is learning.</p>

                <div className="summaryCompact">
                  <div className="summaryItem">
                    <p className="title">Persona</p>
                    <p className="value">
                      {session.personaLabel || "Not selected yet"}
                    </p>
                  </div>

                  <div className="summaryItem">
                    <p className="title">AI Priority Stores</p>
                    <p className="value">
                      {topStoreLabels.length ? topStoreLabels.join(", ") : "—"}
                    </p>
                  </div>

                  <div className="summaryItem">
                    <p className="title">Cart</p>
                    <p className="value">
                      {session.cart.length
                        ? session.cart
                            .map((c) => c.name)
                            .slice(0, 3)
                            .join(" • ")
                        : "Cart is empty"}
                    </p>
                  </div>

                  <div className="summaryItem">
                    <p className="title">Tip</p>
                    <p className="value">
                      Narrate persona shifts + storefront entry → product
                      filtering on camera.
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: 14 }}>
                  <h2>3D Preview</h2>
                  <p className="muted">Click a storefront to switch.</p>
                  <MallPreview3D
                    onStoreClick={(store) => openStore(store, null)}
                    priorityStores={topStores}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="footer">
            <span>Prototype v0.4 • Confidential • January 2026</span>
            <span>
              Walkthrough: pointer-lock • E enters storefront • dwell shows AI
              overlay
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
