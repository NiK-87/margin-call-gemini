import type { Card, GameState } from '../types/game';
import type { RiskTier } from './helpers';

export type WeeklyCardAction = 'EXERCISE' | 'ROLLOVER' | 'ABANDON';
export type DebugInjectVariant = 'yolo' | 'swan' | 'collapse' | 'pump' | 'giga-call' | 'giga-put';

export type GameAction =
  // Flow
  | { type: 'START_GAME'; risk: RiskTier }
  | { type: 'ENTER_TRADING_FLOOR' }
  | { type: 'PROCEED_TO_SHOP' }
  | { type: 'RESET_GAME' }
  | { type: 'RETIRE_BROKER' }
  // Trading
  | { type: 'DISCARD_CARD'; cardId: string }
  | { type: 'ACTIVATE_OTC'; otcId: string }
  | { type: 'REDRAW_DISCARDS' }
  | { type: 'END_DAY' }
  | { type: 'START_NEXT_DAY' }
  // Shop
  | { type: 'BUY_UPGRADE'; upgradeId: string }
  | { type: 'BUY_CARD_DRAFT'; card: Card }
  | { type: 'LIQUIDATE_CARD'; cardId: string }
  // Weekly audit / squeeze
  | { type: 'ENTER_WEEKLY_SETTLE' }
  | { type: 'SET_WEEKLY_CARD_ACTION'; cardId: string; action: WeeklyCardAction }
  | { type: 'SETTLE_WEEKLY_AUDIT' }
  | { type: 'INITIATE_SHORT_SQUEEZE' }
  // Debug panel
  | { type: 'DEBUG_PATCH'; patch: Partial<GameState> }
  | { type: 'DEBUG_SET_PRICE'; price: number }
  | { type: 'DEBUG_TOGGLE_UPGRADE'; upgradeId: string; upgradeName: string; enabled: boolean }
  | { type: 'DEBUG_SET_RISK'; risk: RiskTier }
  | { type: 'DEBUG_INJECT_CARD'; variant: DebugInjectVariant }
  | { type: 'DEBUG_CLEAR_TARGET' }
  | { type: 'DEBUG_CORNER_FLOAT' }
  | { type: 'DEBUG_FORCE_SQUEEZE_WAR' };
