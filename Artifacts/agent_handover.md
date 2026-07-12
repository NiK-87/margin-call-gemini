# 📂 Margin Call (GME Speculator) - Agent Handover Document

Welcome to the **Margin Call** project! This project has been heavily customized and rebranded into a high-stakes, WallStreetBets-themed options trading roguelite card game called **GME Speculator**. 

This document serves as the ultimate source of truth for the game's design, codebase architecture, state management, completed progress, and instructions for any future agent taking over development.

---

## 1. Project Overview & Goal
**Margin Call (GME Speculator)** is a browser-based, single-page application built with React, TypeScript, and Vite. 
The player is a retail trader trying to survive a 5-day cycle of trading GME options while hitting a progressively increasing weekly ledger target (profit goal). If they fail to hit the target during the Weekend Audit, they are margin called and the game is over. If they accumulate enough options to cause a "Speculative Float" crisis, they can trigger a Short Squeeze boss fight to bankrupted the hedge funds.

### Tech Stack
* **Core:** React 19, TypeScript
* **Build Tool:** Vite
* **Styling:** Custom CSS (`src/index.css`) with heavy use of CSS variables, glassmorphism panels, CRT flicker effects, and neon accents (no Tailwind).
* **Icons:** `lucide-react`

---

## 2. Codebase Architecture

The project is structured efficiently with modular components, though the main state logic is centralized.

### Directory Structure
* `src/App.tsx`: The heart of the application. It holds the massive `GameState` object, state mutation handlers (`discardCard`, `activateOtcConsumable`, `settleWeeklyAudit`, `buyUpgrade`, etc.), and the screen router (Title -> Office -> Trade -> Shop -> Weekly Settle -> Boss Fight).
* `src/types/game.ts`: Defines the strict TypeScript interfaces (e.g., `GameState`, `Card`, `Upgrade`, `GameScreen`, `CardTier`).
* `src/utils/gameData.ts`: The core database. Contains the `CARD_POOL` (all possible options contracts), `UPGRADES_LIST` (permanent shares and OTC consumables), and helper functions to generate starter decks based on risk profiles (Low, Medium, High).
* `src/components/`:
  * `StockChart.tsx`: Renders a dynamic, real-time SVG stock chart mapping the asset's price history, current strike thresholds, and Gamma Squeeze boundaries.
  * `TradingDesk.tsx`: The main daily gameplay loop UI. Includes the active hand, drag-and-drop discard zone, broker account stats, and the new **OTC Tactical Desk** for deploying consumables.
  * `UpgradeShop.tsx`: The daily and weekly shop UI. Handles purchasing permanent upgrades, drafting new options, liquidating bad cards, and buying OTC consumables.

---

## 3. Game Design & Core Mechanics

### The Options Math
* **CALL Options:** Profit when the stock price goes UP (Payout = Asset Price - Strike Price). Discarding a Call drives the stock price UP.
* **PUT Options:** Profit when the stock price goes DOWN (Payout = Strike Price - Asset Price). Discarding a Put drives the stock price DOWN.
* Both can be modified by `leverage` (multiplies payout) and `multiplier` (specific to Puts).

### The Gameplay Loop (5-Day Cycle)
1. **Start of Week:** Player selects a risk tier (Low, Med, High). The game generates a customized 5-card deck.
2. **Daily Trading (Days 1-5):** Player draws 5 cards. They can discard cards to manipulate the GME stock price.
3. **Daily Settle:** Yields are calculated. A portion of profits goes to the player's personal cash (for the shop); 90% goes to the Firm's Margin Ledger (the win condition).
4. **Daily Shop:** Player can draft new cards, buy permanent passive upgrades (e.g., Leveraged Capital, Overnight Insurance), buy OTC Consumables, or pay $20 to liquidate (delete) bad cards from their deck.
5. **Weekend Audit (Day 5):** The entire deck is evaluated. The player must manually choose to **Exercise** (cash out), **Roll Over** (pay $15 to keep the card for next week), or **Abandon** (delete for free).
6. **Week Replenishment:** After the audit, the deck is replenished with 5 brand-new, randomized options matching their risk profile, and the cycle continues with a 1.5x higher target.

### Advanced Mechanics
* **Volatility:** Discarding cards increases market volatility. High volatility causes massive, unpredictable overnight price shifts.
* **Gamma Squeeze:** If GME crosses $200 during trading, a Gamma Squeeze activates, doubling all Call payouts for the day.
* **OTC Consumables:** Tactical items (Reddit Pump, Short Raid, Dark Pool, Synthetic Put) stored in `state.otcInventory`. These can be deployed directly from the Trading Desk sidebar for instant effects (e.g., +/- 15% price shifts, zero-shift discards).
* **Short Squeeze (Boss Fight):** If the player's deck grows too large (options outstanding > float capacity), they can initiate a Squeeze War, draining a $10,000 Hedge Fund liquidity pool by maximizing daily yields.

---

## 4. Current Progress (What Has Been Completed)

We have successfully completed all 9 Development Phases!
✅ **Phases 1-4:** Core scaffolding, types, UI layout, and initial trading logic.
✅ **Phases 5-7:** Deep option math (Puts multipliers, Leverage tracking), Drag-and-Drop mechanics, Option Liquidation Desk, and UI separation of Calls/Puts yields.
✅ **Phase 8:** The GME Rebranding, risk-based starter decks, overnight volatility math, Gamma Squeezes, Short Squeeze boss fight, the Debug Control Panel, and the Weekend manual exercise mechanic.
✅ **Phase 9:** The complete separation of OTC Consumables into a persistent `otcInventory` system, deployable tactile buttons in the sidebar, and automatic 5-card deck replenishment at the end of every week.

**Build Status:**
The project compiles with **0 TypeScript warnings or errors**. `npm run build` runs perfectly.

---

## 5. What Needs Work (Future Improvements)

If you are picking up this project, the game is fully functional, balanced, and bug-free. However, to transition it from a polished prototype to a full release, consider the following roadmap:

1. **Audio & Sound Effects (SFX):**
   * The game currently has no sound. Adding UI blips, cash register *cha-chings* on settlement, error buzzers for margin alerts, and heavy impact sounds for OTC Pump/Dump activations would drastically elevate the game feel.
2. **Advanced Animations (Framer Motion):**
   * CSS transitions exist, but a dedicated animation library like `framer-motion` could make card draws, discards, and stock chart line-draws feel incredibly smooth and tactile.
3. **Refactoring `src/App.tsx`:**
   * The `App.tsx` file is nearly 1,800 lines long. The state management (`const [state, setState] = useState<GameState>(...)`) is massive. 
   * **Recommendation:** Extract the state into a React Context provider or use `useReducer` / Redux to manage the complex logic (e.g., separating `auditWeek`, `discardCard`, and `buyUpgrade` into their own dispatcher files).
4. **Endgame Content / Endless Mode:**
   * After surviving Week 4, the player currently achieves a standard victory. An "Endless Mode" with scaling float capacities and new exotic options (Straddles, Iron Condors) could add infinite replayability.
5. **Tutorialization / Onboarding:**
   * While `tutorial.md` exists, in-game interactive tooltips (e.g., a flashing arrow pointing to the Discard Zone on the first turn) would help non-finance players grasp the "discard to manipulate price" concept faster.

---

## 6. Agent Takeover Instructions

As an AI agent stepping into this environment, here is how you operate:

1. **Running the Game:**
   * To start the dev server (Windows environment): `cmd /c "npm run dev"`
   * To verify the build (Strict TS Check): `cmd /c "npm run build"`
2. **Testing Mechanics:**
   * Use the **GME Special Operations Control Panel** (accessible via the "SYSTEM TERMINAL" or Debug header link in-game). This allows you to arbitrarily change the stock price, inject money, force Gamma Squeezes, or skip to the Weekend Settle without having to manually play for 20 minutes.
3. **Modifying the Design:**
   * **Do not use Tailwind CSS.** All styles are in `src/index.css`. Maintain the high-contrast, dark-mode glassmorphism aesthetic (`rgba(255,255,255,0.05)` borders, `text-glow` classes).
   * **Icons:** Use `lucide-react`. Do not import raw SVGs unless necessary.
4. **Adding New Cards / Upgrades:**
   * Simply append them to `CARD_POOL` or `UPGRADES_LIST` in `src/utils/gameData.ts`. The UI maps over these arrays dynamically.
5. **State Updates:**
   * Since `GameState` is deeply nested, always use functional state updates (`setState(prev => ({ ...prev, nested: { ...prev.nested } }))`) to avoid mutating React state directly.

Good luck, and remember: *Diamond Hands!* 💎🙌
