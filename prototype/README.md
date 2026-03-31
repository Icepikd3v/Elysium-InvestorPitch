# Elysium Prototype (Luxury Mall Demo)

This repo is the **prototype experience** for Elysium Digital: a retina-scan-style entry flow, AI persona simulation, and an in-browser 3D luxury mall walkthrough with interactive storefronts.

## Prototype Scope (Current)

- Retina scan entry flow + demo login fallback
- AI persona/session simulation (Elly)
- 3D mall walkthrough (React Three Fiber / Three.js)
- 4 luxury storefronts:
  - Christian Louboutin
  - Prada
  - Omega
  - Jimmy Choo
- In-sim storefront interactions:
  - proximity prompts
  - holographic HUD cards
  - enter-store overlays
  - cart actions
- Corridor architecture with dynamic ad-wall boards between storefronts

## Local Setup

Requirements:
- Node 18+ (recommended)
- npm

Install and run:

```bash
npm install
npm run dev
```

Open the local URL shown by Vite (default: `http://localhost:5173`).

Build and preview:

```bash
npm run build
npm run preview
```

Run backend auth API (new):

```bash
npm run start:server
```

Backend defaults:
- API base: `http://localhost:8787`
- Frontend verify-link origin: `http://localhost:5173`

Optional backend env vars:
- `PORT` (default `8787`)
- `FRONTEND_ORIGIN` (default `http://localhost:5173`)

## Demo Access

Set demo access credentials in a local `.env` file before running the app:

```bash
cp .env.example .env
```

Required variables:
- `VITE_DEMO_EMAIL`
- `VITE_DEMO_PASSWORD`
- `VITE_API_BASE` (default `http://localhost:8787`)
- `VITE_INVESTOR_PAGE_URL` (default `https://elysiummall.com`)

The login form stays blank in the live UI. Credentials should be distributed
directly to approved investors/viewers and not committed to source control.

## Walkthrough Controls

Inside the Virtual Mall walkthrough:
- `W/S` or `Up/Down`: forward/back
- `A/D` or `Left/Right`: strafe
- Mouse drag / pointer lock: look around
- `Shift`: run
- `E`: enter nearby storefront
- `V`: toggle camera view (TPV/FPV)
- `Esc`: unlock pointer / close overlays

## Key Files (Prototype Side)

Core app wiring:
- `src/App.jsx`  
  App shell, flow stage handling, AI session wiring, walkthrough event handling, store context mapping.

3D walkthrough:
- `src/components/VirtualMallWalkthroughR3F.jsx`  
  Corridor + lighting + ad walls, storefront architecture, avatar movement, proximity events, mini-map integration, in-sim store/cart UI.
- `src/components/HoloStoreHUD.jsx`  
  Holographic storefront HUD behavior and proximity rendering.
- `src/components/MallPreview3D.jsx`  
  Mini-map panel used in walkthrough.

AI/session and demo data:
- `src/lib/mockData.js`  
  Persona + catalog/store mock data used by demo logic.
- `src/lib/aiBrain.js`  
  Session engine: recommendations, store views, cart updates, persona effects.
- `src/lib/demoScript.js`  
  Automated demo scripts for investor walkthrough sequencing.

Entry/aux UI:
- `src/components/RetinaScan.jsx`
- `src/components/AvatarStepper.jsx`
- `src/components/EllyChat.jsx`
- `src/components/CategoryTiles.jsx`

## Assets Used by Prototype

Storefront renders:
- `public/storefronts/ChristianStoreFront.jpg`
- `public/storefronts/PradaStoreFront.jpg`
- `public/storefronts/OmegaStoreFront.jpg`
- `public/storefronts/JimmyStoreFront.jpg`

Brand logos:
- `public/logos/lblogo.png`
- `public/logos/pradalogo.png`
- `public/logos/omegalogo.png`
- `public/logos/jimmychoologo.svg`

Luxury product images:
- `public/products/christianlouboutin/*`
- `public/products/Prada/*`
- `public/products/Omega/*`
- `public/products/jimmychoo/*`

## Notes

- This branch/readme reflects the **prototype mall experience** only.
- Investor-side UI/content updates are handled separately in the next phase.
