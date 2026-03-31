// src/lib/demoScript.js
export const DEFAULT_DEMO_KEY = "auto_single_shopper_tour";
export const DEMO_SELECTOR_KEYS = [
  "auto_single_shopper_tour",
  "auto_social_coshop_tour",
];

const msg = (text, ms) => ({ type: "message", text, ms });
const persona = (personaId, ms) => ({ type: "persona", personaId, ms });
const walk = (store, ms) => ({ type: "walk", store, ms });
const store = (store, ms) => ({ type: "store", store, ms });
const addTop = (ms, count = 1) => ({ type: "add_top_reco", ms, count });
const invitePrompt = (ms) => ({ type: "invite_prompt", ms });
const inviteSend = (email, ms) => ({ type: "invite_send", email, ms });
const liveInteraction = (prompts, ms, durationMs = 5600, userIndex = 0) => ({
  type: "live_interaction",
  prompts,
  ms,
  durationMs,
  userIndex,
});
const complete = (ms) => ({ type: "complete", ms });
const script = (label, steps) => ({ label, steps });

export const DEMO_SCRIPTS = {
  auto_single_shopper_tour: script("Solo", [
    msg("Narration: Solo simulation started. Elly begins retina baseline and purchase-history sync.", 1800),
    persona("fashion", 1400),
    msg("Narration: Elly predicts preferred brands, color palette, and likely fit profile before the first stop.", 1900),
    walk("LOUBOUTIN", 3000),
    liveInteraction(
      [
        "Live User: Elly compared my old purchases and nailed the right event heel.",
        "Primary Shopper: Same, it removed most options and kept only high-confidence matches.",
        "Live User: It also matched my favorite color without me filtering anything.",
        "Primary Shopper: That saved time, this feels like true AI-assisted shopping.",
      ],
      1700,
      7600,
      0,
    ),
    store("LOUBOUTIN", 2300),
    addTop(1800, 1),
    msg("Shopper: Love that Elly picked a confident event shoe from my saved taste profile.", 1800),
    walk("PRADA", 3000),
    liveInteraction(
      [
        "Live User: Elly remembered my Prada style history and pushed cleaner options first.",
        "Primary Shopper: That is what we need, less scrolling and faster confident picks.",
        "Live User: It even aligned colors with my past orders.",
      ],
      1700,
      7000,
      1,
    ),
    store("PRADA", 2300),
    addTop(1800, 1),
    msg("Shopper: The recommendation shifted toward practical luxury based on my prior purchases.", 1900),
    walk("OMEGA", 3000),
    liveInteraction(
      [
        "Live User: My retina reaction nudged Elly toward darker dial variants.",
        "Primary Shopper: That is exactly what makes this smart mall feel personal.",
        "Live User: It knew my preferred fit profile from previous purchases too.",
        "Primary Shopper: The shortlist is sharper than normal browsing.",
      ],
      1800,
      7600,
      1,
    ),
    store("OMEGA", 2300),
    addTop(1800, 1),
    msg("Shopper: Elly caught my reaction and adjusted toward precision watches instantly.", 1900),
    walk("JIMMY CHOO", 3000),
    liveInteraction(
      [
        "Live User: Elly kept only the heels matching my fit confidence and event intent.",
        "Primary Shopper: Great, it feels like concierge-level filtering.",
        "Live User: The recommendation trail clearly follows my behavior data.",
      ],
      1700,
      7000,
      2,
    ),
    store("JIMMY CHOO", 2300),
    addTop(1900, 1),
    complete(1500),
    msg("Narration: Solo simulation complete. Cart reflects Elly-curated picks across all storefronts.", 1900),
  ]),

  auto_social_coshop_tour: script("Invite a Friend", [
    msg("Narration: Co-shop simulation started. Primary shopper enters while Elly opens live behavior tracking.", 1800),
    persona("fashion", 1400),
    walk("LOUBOUTIN", 2800),
    msg("Narration: Elly asks if the shopper wants to invite someone to join the same mall session.", 1700),
    invitePrompt(1500),
    inviteSend("friend@elysiummock.com", 1800),
    liveInteraction(
      [
        "Live User: Shared sessions are smoother when Elly merges both shopper profiles.",
        "Primary Shopper: We can actually see overlap picks before entering the next store.",
        "Live User: It pulled our common brands and dropped low-fit suggestions.",
        "Primary Shopper: That makes co-shopping feel coordinated instead of random.",
      ],
      1700,
      7600,
      0,
    ),
    msg("Friend: Joined. My Elly stream is syncing my colors, brands, and historical purchases now.", 1800),
    store("LOUBOUTIN", 2300),
    addTop(1800, 1),
    msg("Primary: Elly merged both of our retina reactions and picked one shared product for both shoppers.", 1900),
    walk("PRADA", 2800),
    liveInteraction(
      [
        "Live User: In co-shop mode Elly is balancing both of our brand histories.",
        "Friend: The shared shortlist is stronger than shopping alone.",
        "Primary Shopper: This avoids the normal back-and-forth guesswork.",
      ],
      1700,
      7000,
      1,
    ),
    store("PRADA", 2300),
    addTop(1800, 1),
    msg("Friend: Nice, it filtered to our overlap and selected one consensus product for this storefront.", 1900),
    walk("OMEGA", 2800),
    liveInteraction(
      [
        "Live User: Co-shop mode is using both retina scans to tune suggestions.",
        "Friend: It filtered noise and kept the products we both reacted to.",
        "Live User: It even synced color preferences across both shoppers.",
        "Friend: This is way better than manually comparing links.",
      ],
      1800,
      7600,
      1,
    ),
    store("OMEGA", 2300),
    addTop(1800, 1),
    msg("Primary: You can see Elly steering toward one co-shop watch choice after both scan responses.", 1900),
    walk("JIMMY CHOO", 2800),
    liveInteraction(
      [
        "Live User: Dual-user Elly sync made the final picks feel consistent.",
        "Friend: It caught overlap in both our color and style profiles.",
        "Primary Shopper: Exactly, this is why the social demo stands out.",
      ],
      1800,
      7000,
      2,
    ),
    store("JIMMY CHOO", 2300),
    addTop(1900, 1),
    msg("Friend: Final picks look aligned. Cart now holds one shared Elly choice per storefront.", 1900),
    complete(1500),
    msg("Narration: Invite-a-Friend simulation complete. Both users can continue in manual mode.", 1900),
  ]),

  auto_coshop_tour: script("Auto Two-Shopper Simulation", [
    msg("Narration: Auto simulation started. Primary shopper enters the virtual mall.", 1400),
    persona("fashion", 1100),
    walk("LOUBOUTIN", 2100),
    msg("Narration: Elly asks if the shopper wants to invite someone to join.", 1400),
    invitePrompt(1200),
    msg("Narration: Primary shopper types a mock invite email in the overlay.", 1200),
    inviteSend("friend@elysiummock.com", 1500),
    msg("Narration: Friend accepted. Dual Elly streams are now active.", 1300),
    walk("LOUBOUTIN", 2000),
    store("LOUBOUTIN", 2000),
    addTop(1300, 1),
    walk("PRADA", 2000),
    store("PRADA", 1900),
    addTop(1300, 1),
    complete(1200),
    msg("Narration: Both shoppers can now continue manually in the same shared mall session.", 1600),
  ]),

  investor_guided: script("Guided Luxury Walkthrough", [
    msg("Narration: Investor mode started. Elly is live in full-scan simulation.", 1800),
    persona("tech", 1600),
    msg("Narration: Baseline persona locked. Running deterministic 4-store walkthrough.", 1800),

    msg("Narration: Store 1/4 - CHRISTIAN LOUBOUTIN scan sequence.", 1200),
    store("LOUBOUTIN", 2400),
    addTop(1600, 1),
    msg("Narration: Elly prioritizes premium silhouette + occasion intent.", 1200),

    msg("Narration: Store 2/4 - PRADA scan sequence.", 1200),
    store("PRADA", 2400),
    addTop(1600, 1),
    msg("Narration: Elly updates budget-fit + cross-category matching in real time.", 1200),

    msg("Narration: Store 3/4 - OMEGA scan sequence.", 1200),
    store("OMEGA", 2400),
    addTop(1600, 1),
    msg("Narration: Elly shifts weight toward precision heritage and high-ticket tolerance.", 1200),

    msg("Narration: Store 4/4 - JIMMY CHOO scan sequence.", 1200),
    store("JIMMY CHOO", 2400),
    addTop(1600, 1),
    msg("Narration: Elly finalizes anchor recommendation plus matching add-on logic.", 1200),
    complete(1200),

    msg("Narration: Walkthrough complete. Investor mock demonstrates scan->reason->recommend loop.", 1800),
  ]),

  louboutin: script("Christian Louboutin", [
    msg("Narration: User simulator enters as a Runway Curator.", 900),
    persona("fashion", 1100),
    store("LOUBOUTIN", 1800),
    addTop(1200, 1),
    msg(
      "Narration: Elly highlights signature silhouettes and high-intent occasion matching inside the virtual mall.",
      1200,
    ),
    complete(1000),
  ]),

  prada: script("Prada", [
    msg("Narration: User simulator enters as a Private Client.", 900),
    persona("home", 1100),
    store("PRADA", 1800),
    addTop(1200, 1),
    msg(
      "Narration: Elly balances budget-fit and wardrobe versatility while the shopper stays inside the mall journey.",
      1200,
    ),
    complete(1000),
  ]),

  omega: script("Omega", [
    msg("Narration: User simulator enters as a Timepiece Enthusiast.", 900),
    persona("tech", 1100),
    store("OMEGA", 1800),
    addTop(1200, 1),
    msg(
      "Narration: Elly prioritizes precision heritage and premium add-ons without leaving the walkthrough experience.",
      1200,
    ),
    complete(1000),
  ]),

  jimmychoo: script("Jimmy Choo", [
    msg("Narration: User simulator enters as an Affluent Family Buyer.", 900),
    persona("family", 1100),
    store("JIMMY CHOO", 1800),
    addTop(1200, 1),
    msg(
      "Narration: Elly shifts toward gifting and statement footwear while keeping the demo inside the virtual mall.",
      1200,
    ),
    complete(1000),
  ]),

  coshop: script("Invite-a-Friend Co-Shop", [
    msg("Narration: Primary shopper starts a shared luxury mall session.", 1200),
    persona("fashion", 1000),
    msg(
      "Narration: Remote friend joins from another city. Elly begins fusing signals across both shoppers.",
      1600,
    ),
    store("LOUBOUTIN", 1800),
    addTop(1200, 1),
    msg(
      "Narration: Elly compares shared occasion intent, budget overlap, and brand affinity in real time.",
      1500,
    ),
    store("PRADA", 1800),
    addTop(1200, 1),
    msg(
      "Narration: Co-shopping logic suggests consensus picks and flags products to review together later.",
      1500,
    ),
    complete(1200),
  ]),
};
