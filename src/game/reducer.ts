import type { GameState } from '../types/game';
import type { GameAction } from './actions';
import { createStateForRisk } from './helpers';
import { activateOtcConsumable, discardCard, endDay, redrawDiscards, startNextDay } from './reducers/trading';
import { buyCardDraft, buyUpgrade, liquidateCard } from './reducers/shop';
import { enterWeeklySettle, initiateShortSqueezePhase, setWeeklyCardAction, settleWeeklyAudit } from './reducers/audit';
import {
  debugClearTarget,
  debugCornerFloat,
  debugForceSqueezeWar,
  debugInjectCard,
  debugPatch,
  debugSetPrice,
  debugSetRisk,
  debugToggleUpgrade
} from './reducers/debug';

export const initialState = (): GameState => createStateForRisk('MEDIUM');

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    // Flow
    case 'START_GAME':
      return { ...createStateForRisk(action.risk), screen: 'OFFICE_INTRO' };
    case 'ENTER_TRADING_FLOOR':
      return { ...state, screen: 'DAILY_TRADE' };
    case 'PROCEED_TO_SHOP':
      return { ...state, screen: 'WEEKLY_SHOP' };
    case 'RESET_GAME':
      return initialState();
    case 'RETIRE_BROKER':
      return {
        ...state,
        screen: 'RETIRED',
        tradeLog: [...state.tradeLog, `Player retired as a ${state.corporateRank} with $${state.personalCash.toFixed(2)} cash!`]
      };

    // Trading
    case 'DISCARD_CARD':
      return discardCard(state, action.cardId);
    case 'ACTIVATE_OTC':
      return activateOtcConsumable(state, action.otcId);
    case 'REDRAW_DISCARDS':
      return redrawDiscards(state);
    case 'END_DAY':
      return endDay(state);
    case 'START_NEXT_DAY':
      return startNextDay(state);

    // Shop
    case 'BUY_UPGRADE':
      return buyUpgrade(state, action.upgradeId);
    case 'BUY_CARD_DRAFT':
      return buyCardDraft(state, action.card);
    case 'LIQUIDATE_CARD':
      return liquidateCard(state, action.cardId);

    // Weekly audit / squeeze
    case 'ENTER_WEEKLY_SETTLE':
      return enterWeeklySettle(state);
    case 'SET_WEEKLY_CARD_ACTION':
      return setWeeklyCardAction(state, action.cardId, action.action);
    case 'SETTLE_WEEKLY_AUDIT':
      return settleWeeklyAudit(state);
    case 'INITIATE_SHORT_SQUEEZE':
      return initiateShortSqueezePhase(state);

    // Debug
    case 'DEBUG_PATCH':
      return debugPatch(state, action.patch);
    case 'DEBUG_SET_PRICE':
      return debugSetPrice(state, action.price);
    case 'DEBUG_TOGGLE_UPGRADE':
      return debugToggleUpgrade(state, action.upgradeId, action.upgradeName, action.enabled);
    case 'DEBUG_SET_RISK':
      return debugSetRisk(state, action.risk);
    case 'DEBUG_INJECT_CARD':
      return debugInjectCard(state, action.variant);
    case 'DEBUG_CLEAR_TARGET':
      return debugClearTarget(state);
    case 'DEBUG_CORNER_FLOAT':
      return debugCornerFloat(state);
    case 'DEBUG_FORCE_SQUEEZE_WAR':
      return debugForceSqueezeWar(state);

    default:
      return state;
  }
}
