# CLAUDE.md — Margin Call (GME Speculator)

WallStreetBets-themed options-trading roguelite card game. React 19 + TypeScript + Vite SPA. All 9 dev phases complete; builds with 0 TS errors. Full design doc: `Artifacts/agent_handover.md`.

## Commands
- Dev server: `npm run dev`
- Build (strict TS check): `npm run build`
- Lint: `npm run lint`

## Architecture
- `src/App.tsx` (~1,800 lines) — entire `GameState` in one `useState`, all mutation handlers (`discardCard`, `settleWeeklyAudit`, `buyUpgrade`, `activateOtcConsumable`), and screen router: Title → Office → Trade → Shop → Weekly Settle → Boss Fight. Known refactor target (Context/useReducer).
- `src/types/game.ts` — interfaces: `GameState`, `Card`, `Upgrade`, `GameScreen`, `CardTier`.
- `src/utils/gameData.ts` — `CARD_POOL`, `UPGRADES_LIST`, risk-tier starter deck generators. Add new cards/upgrades by appending here; UI maps dynamically.
- `src/components/` — `StockChart.tsx` (SVG chart), `TradingDesk.tsx` (daily loop + OTC Tactical Desk), `UpgradeShop.tsx` (drafting, upgrades, liquidation).

## Core mechanics (quick reference)
- CALL: payout = price − strike; discarding drives price UP. PUT: payout = strike − price; discarding drives price DOWN. Modified by `leverage` and `multiplier` (puts).
- 5-day weekly cycle → Weekend Audit (Exercise / Roll Over $15 / Abandon) → deck replenished with 5 new risk-matched cards → target ×1.5.
- Volatility from discards → overnight price shocks. Gamma Squeeze at $200 doubles Call payouts. OTC consumables live in `state.otcInventory`. Short Squeeze boss fight when deck exceeds float capacity.

## Conventions
- **No Tailwind.** All styles in `src/index.css` — dark glassmorphism, CRT flicker, neon accents, `rgba(255,255,255,0.05)` borders, `text-glow` classes.
- Icons: `lucide-react` only.
- `GameState` is deeply nested — always use functional updates (`setState(prev => ...)`); never mutate.
- Testing: use the in-game GME Special Operations Control Panel (SYSTEM TERMINAL/debug link) to set price, inject cash, force squeezes, or skip to Weekend Settle.

## Roadmap (from handover doc)
1. Audio/SFX (none exist)
2. Framer Motion animations
3. Refactor App.tsx state management
4. Endless Mode + exotic options (Straddles, Iron Condors)
5. In-game interactive tutorial/onboarding
