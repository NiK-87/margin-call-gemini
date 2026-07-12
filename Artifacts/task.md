# Tasks: "Margin Call" Implementation Checklist

- [x] **Phase 1: Project Scaffolding**
  - [x] Initialize Vite project with React + TypeScript template in `./`
  - [x] Install required icons library (`lucide-react`)
  - [x] Configure `tsconfig.json` and `vite.config.ts`
  - [x] Verify basic app skeleton runs and compiles

- [x] **Phase 2: Types & Game State Architecture**
  - [x] Define type interfaces in `src/types/game.ts` (Card, Upgrades, Deck, DayState, GameState)
  - [x] Write card database (starter deck of Calls and Puts) and initial upgrades list

- [x] **Phase 3: Design System & Styling**
  - [x] Build premium CSS styles in `src/index.css` (retro green/amber glass terminal, CRT flicker, sleek card transitions, chart gradients)
  - [x] Define CSS color variables and grid system

- [x] **Phase 4: Game Components Development**
  - [x] Create `src/components/StockChart.tsx` (dynamic SVG chart displaying stock ticks, strike prices, and target lines)
  - [x] Create `src/components/TradingDesk.tsx` (player dashboard: hand of 5 cards, play/discard action logic, trade sentiment logs)
  - [x] Create `src/components/UpgradeShop.tsx` (weekend shopping screen: buying permanent shares and consumables)
  - [x] Integrate components in `src/App.tsx` (state transitions: Title -> Office -> Trade -> Shop -> Margin Call/Squeeze)

- [x] **Phase 5: Verification & Polishing**
  - [x] Verify build output via `npm run build`
  - [x] Run dev server and visually test game screens, chart updates, and game-over/victory triggers
  - [x] Document in `walkthrough.md`

- [x] **Phase 6: Gameplay Refinements & Interactions**
  - [x] Spin up `Card_Designer` subagent to generate a deep database of 15-20 distinct options cards
  - [x] Implement daily shop drafting and Card Liquidation desk (card trashing) in `src/components/UpgradeShop.tsx`
  - [x] Refactor daily and weekly yield mathematics in `src/App.tsx` (Sum of Calls * Product of Puts)
  - [x] Integrate native HTML5 Drag and Drop events with visual glowing feedback in `TradingDesk.tsx`
  - [x] Refactor main App state transition flow (Daily Trade -> Daily Settle -> Daily Shop -> Day 5 Weekly Settle)
  - [x] Verify compilation and test gameplay
- [x] **Phase 7: Option Upgrades and Yield Sums**
  - [x] Apply `card.multiplier` to PUT option payout math across all components and state logic
  - [x] Separate Call and Put sums in `TradingDesk.tsx` sidebar with a detailed yield breakdown
  - [x] Update Daily Settlement screen to show actual dollar payouts for both Calls and Puts
  - [x] Implement pre-calculations for the Weekly Settle screen to project exercise value
  - [x] Display leverage upgrade path (e.g. `x1 -> x10 LEV`) in the shop drafts console
  - [x] Verify project builds and complies cleanly without type errors

- [x] **Phase 8: GME Speculator Mechanics & Compact Layout**
  - [x] Integrate low/medium/high risk starter decks with strike/shift randomizations
  - [x] Implement overnight volatility shifts, cap shifts at -5% with Overnight Insurance, halve shock with Volatility Hedge
  - [x] Add intraday Gamma Squeeze at $200 with active indicator lines plotted on the stock chart
  - [x] Revamp Weekend settle with manual exercise/rollover controls, fees, and minimum-deck refills
  - [x] Construct Squeeze War combat screen draining Hedge Fund's $10,000 liquidity pool
  - [x] Program corporate ranks and palms-themed gold retirement button in the shop
  - [x] Tighten index.css values (padding to 10px, card width to 130px, chart to 180px) and disable viewport scrolling
  - [x] Upgrade GME Special Operations Control Panel to configure/cheat/debug all variables and upgrades
  - [x] Verify compile builds with 0 warnings or errors and document in `walkthrough.md`

- [x] **Phase 9: Week Replenishment & OTC Inventory System**
  - [x] Declare `otcInventory` in game state and initialize it based on risk tier selection
  - [x] Implement 5-card deck replenishment matching risk profile on weekly audit transition
  - [x] Add OTC Tactical Desk panel in Trading Desk sidebar showing owned counts and active modifier status
  - [x] Support tactical activation of pumps, dumps, dark pools, and synthetic puts during trading hours
  - [x] Update Upgrade Shop counts to query `state.otcInventory` instead of counting deck cards
  - [x] Run typescript production build and verify zero errors


