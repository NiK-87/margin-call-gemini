# Implementation Plan: Week Replenishment & OTC Inventory System

This plan outlines the implementation of a deck replenishment mechanism between weeks (adding 5 new starter options contracts) and the transition of OTC consumable upgrades into a persistent, visible, and playable "OTC Inventory" on the trading floor.

---

## Proposed Systems & Changes

### 1. GameState Modifications
We will modify the `GameState` interface in [game.ts](file:///d:/AI/Margin%20Call/src/types/game.ts):
*   Add `otcInventory: string[]` to track owned OTC consumable IDs (e.g. `['otc-pump', 'otc-darkpool']`).
*   Initialize `otcInventory: []` in `createStateForRisk` inside [App.tsx](file:///d:/AI/Margin%20Call/src/App.tsx).

### 2. Week-to-Week Deck Replenishment
In `settleWeeklyAudit` inside [App.tsx](file:///d:/AI/Margin%20Call/src/App.tsx):
*   At the conclusion of the audit (when advancing to next week), keep the player's rolled-over cards.
*   Generate **5 new randomized option contracts** matching the player's `riskTier`.
*   These cards will be randomized for strike prices ($\pm \$2$) and price shifts ($\pm \$1$) and added to the player's deck.
*   This ensures the player's portfolio is replenished for the upcoming week and keeps deck size sustainable.

### 3. OTC Consumable Upgrades Inventory
We will separate option contracts (the deck) from OTC tactical consumable items:
*   **UpgradeShop Purchase:** In `buyUpgrade`, when buying an OTC consumable (Reddit Pump, Short Raid, Dark Pool, Synthetic Put), deduct cash and append its ID to `state.otcInventory` instead of appending a card structure to the options deck.
*   **Trading Desk Floor UI:** Add an **OTC Tactical Desk** panel in [TradingDesk.tsx](file:///d:/AI/Margin%20Call/src/components/TradingDesk.tsx) sidebar:
    *   Lists all purchased OTC consumables:
        *   *Reddit Pump Contract* (Qty: X)
        *   *Short Raid Contract* (Qty: Y)
        *   *Dark Pool Contract* (Qty: Z)
        *   *Synthetic Put Protection* (Qty: W)
    *   Provides an **[ACTIVATE]** button next to each consumable that can be clicked at any point during the daily trading phase.
*   **Activation Handler:** Implement `activateOtcConsumable(otcId: string)` in [App.tsx](file:///d:/AI/Margin%20Call/src/App.tsx):
    *   Consumes (removes) 1 instance of the item from `state.otcInventory`.
    *   Triggers the immediate effect on GME price (e.g. $\pm 15\%$ price change) or adds active modifiers (Dark Pool, Synthetic Put floor).
    *   Appends descriptive logs to the secure terminal log.

---

## Proposed Changes File by File

### #### [MODIFY] [game.ts](file:///d:/AI/Margin%20Call/src/types/game.ts)
*   Add `otcInventory: string[]` to `GameState` interface.

### #### [MODIFY] [App.tsx](file:///d:/AI/Margin%20Call/src/App.tsx)
*   Update `createStateForRisk` to initialize `otcInventory: []`.
*   Update `buyUpgrade` to add OTC consumables to `state.otcInventory`.
*   Implement `activateOtcConsumable(otcId)` state modifier.
*   Pass `activateOtcConsumable` down to `<TradingDesk />`.
*   Update `settleWeeklyAudit` to append 5 randomized replenishment contracts to the deck after filtering rolled-over cards.

### #### [MODIFY] [TradingDesk.tsx](file:///d:/AI/Margin%20Call/src/components/TradingDesk.tsx)
*   Declare `activateOtcConsumable: (otcId: string) => void;` in props.
*   Render the "OTC Tactical Desk" below the Broker Account panel in the sidebar, displaying owned counts and action buttons.

### #### [MODIFY] [UpgradeShop.tsx](file:///d:/AI/Margin%20Call/src/components/UpgradeShop.tsx)
*   Update OTC Upgrades loop to read the counts from `state.otcInventory` instead of counting card names in the options deck.

---

## Verification Plan

### Automated Verification
Verify the compilation:
```bash
cmd /c "npm run build"
```

### Manual Verification
1.  **Draft & Shop:** Buy OTC consumables in the shop (e.g., Reddit Pump Contract, Short Raid Contract). Check that they reflect in the shop counts.
2.  **Trading Floor:** Transition to the trading floor and verify the new "OTC Tactical Desk" panel is visible in the sidebar showing purchased quantities.
3.  **Deploy Action:** Click **ACTIVATE** on a Reddit Pump or Short Raid contract. Confirm GME price instantly shifts by 15% and the log prints the correct notification.
4.  **Rollover & Replenishment:** Roll over 2 cards, settle the week, and verify that the next week starts with those 2 rolled-over cards plus 5 brand-new randomized contracts.
