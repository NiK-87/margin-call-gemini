export type CardTier = 'LOW' | 'MEDIUM' | 'HIGH';
export type CardType = 'CALL' | 'PUT';

export interface Card {
  id: string;
  name: string;
  type: CardType;
  strikePrice: number;
  tier: CardTier;
  volatilityModifier: number; // e.g. +0.02 (2%) on play/discard
  priceShift: number; // The flat dollar amount it shifts the asset price on discard (positive for CALL, negative for PUT)
  description: string;
  flavorText: string;
  multiplier?: number; // Multiplier for PUT option payouts
  leverage?: number; // Option contract leverage multiplier (1, 10, 100, 1000)
}

export type UpgradeType = 'SHARE' | 'OTC';

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: UpgradeType;
  icon: string; // lucide icon name
}

export type GameScreen = 
  | 'TITLE'
  | 'OFFICE_INTRO'
  | 'DAILY_TRADE'
  | 'DAILY_SETTLE'
  | 'WEEKLY_SHOP'
  | 'WEEKLY_SETTLE'
  | 'SQUEEZE_WAR'
  | 'GAME_OVER'
  | 'VICTORY_SHORT_SQUEEZE'
  | 'RETIRED';

export interface GameState {
  screen: GameScreen;
  currentDay: number; // 1 to 5
  currentWeek: number;
  assetPrice: number;
  priceHistory: number[]; // ticks for drawing the chart
  volatility: number; // 0.0 to 1.0
  deck: Card[];
  hand: Card[];
  discardPile: Card[];
  drawPile: Card[];
  discardsLeft: number;
  personalCash: number;
  marginLedger: number; // Accumulated 90% target tracker
  weekTarget: number;
  activeUpgrades: string[]; // IDs of permanent upgrades purchased
  tradeLog: string[]; // List of messages for the terminal
  dailyYield: number; // Yield from current day's hand calculation
  dailySalary: number; // $50 baseline
  dailyEarnings: number; // Salary + player's commission cut
  optionsOutstanding: number; // Speculative weight of the deck
  maxFloatCapacity: number; // e.g. 100 shares
  shopCards: Card[]; // 3 drafted cards available for purchase
  
  // Phase 7/8 Additions
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH';
  corporateRank: string;
  hedgeFundLiquidity: number; // Starts at 10000 for Squeeze War
  exercisedCardIds: string[]; // Card IDs selected for exercise during weekend settle
  rolledOverCardIds: string[]; // Card IDs selected for rollover during weekend settle
  overnightNegated: boolean; // Flag to skip overnight price adjustments
  isGammaSqueezedToday: boolean; // Flag for active gamma squeeze
  otcInventory: string[]; // List of owned OTC consumable IDs
  settings: {
    enableOvernightVol: boolean;
    enableGammaSqueeze: boolean;
    enableManualExercise: boolean;
  };
}

