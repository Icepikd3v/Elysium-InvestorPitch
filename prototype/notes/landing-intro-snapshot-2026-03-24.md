# Landing Intro Snapshot (March 24, 2026)

Purpose: keep a quick rollback reference before/after Kori timing update.

## Previous Intro Settings
- `INTRO_STAGE_BLACK_MS = 2200`
- `INTRO_DISSOLVE_MS = 5600`
- `INTRO_HOLD_MS = 900`
- Transition to landing required user click (`Click to continue` button).

## Current Intro Settings
- `INTRO_STAGE_BLACK_MS = 300`
- `INTRO_DISSOLVE_MS = 3000`
- `INTRO_HOLD_MS = 350`
- Auto-transition to landing after sequence (no click required).

## Quick Revert
In `src/App.jsx`, restore prior constants and re-enable click/keyboard continue block in the `brandIntro` render section.
