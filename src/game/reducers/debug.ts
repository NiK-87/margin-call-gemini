import type { Card, GameState } from '../../types/game';
import type { DebugInjectVariant } from '../actions';
import type { RiskTier } from '../helpers';
import { createStateForRisk, getDeckWeight } from '../helpers';
import { updateCardDescription } from '../../utils/gameData';

export const debugPatch = (prev: GameState, patch: Partial<GameState>): GameState => ({
  ...prev,
  ...patch,
});

export const debugSetPrice = (prev: GameState, price: number): GameState => ({
  ...prev,
  assetPrice: price,
  priceHistory: [...prev.priceHistory, price].slice(-25),
});

export const debugToggleUpgrade = (prev: GameState, upgradeId: string, upgradeName: string, enabled: boolean): GameState => {
  const activeUpgrades = enabled
    ? [...prev.activeUpgrades, upgradeId]
    : prev.activeUpgrades.filter((id) => id !== upgradeId);

  let discardsLeft = prev.discardsLeft;
  if (upgradeId === 'share-discards') {
    discardsLeft = enabled ? prev.discardsLeft + 1 : Math.max(0, prev.discardsLeft - 1);
  }

  return {
    ...prev,
    activeUpgrades,
    discardsLeft,
    maxFloatCapacity: activeUpgrades.includes('share-float') ? 150 : 100,
    tradeLog: [...prev.tradeLog, `DEBUG: ${enabled ? 'Enabled' : 'Disabled'} upgrade ${upgradeName}.`]
  };
};

export const debugSetRisk = (prev: GameState, risk: RiskTier): GameState => {
  const fresh = createStateForRisk(risk);
  return {
    ...prev,
    riskTier: risk,
    deck: fresh.deck,
    hand: fresh.hand,
    drawPile: fresh.drawPile,
    discardPile: fresh.discardPile,
    optionsOutstanding: getDeckWeight(fresh.deck),
    tradeLog: [...prev.tradeLog, `DEBUG: Shifted starter deck to ${risk} risk archetype.`]
  };
};

const buildInjectCard = (variant: DebugInjectVariant): Card => {
  switch (variant) {
    case 'yolo':
      return {
        id: `call-high-yolo-inject-${Date.now()}`,
        name: 'GME YOLO Moonshot Call $175',
        type: 'CALL',
        strikePrice: 175,
        tier: 'HIGH',
        volatilityModifier: 0.08,
        priceShift: 35,
        description: '',
        flavorText: 'Injected via debug terminal.',
        leverage: 1
      };
    case 'swan':
      return {
        id: `put-high-swan-inject-${Date.now()}`,
        name: 'GME Black Swan Put $55',
        type: 'PUT',
        strikePrice: 55,
        tier: 'HIGH',
        volatilityModifier: 0.06,
        priceShift: -25,
        multiplier: 2.2,
        description: '',
        flavorText: 'Injected via debug terminal.',
        leverage: 1
      };
    case 'collapse':
      return {
        id: `put-high-collapse-inject-${Date.now()}`,
        name: 'GME Systemic Collapse Put $50',
        type: 'PUT',
        strikePrice: 50,
        tier: 'HIGH',
        volatilityModifier: 0.08,
        priceShift: -30,
        multiplier: 2.5,
        description: '',
        flavorText: 'Injected via debug terminal.',
        leverage: 1
      };
    case 'giga-call':
      return {
        id: `high-lev-call-inject-${Date.now()}`,
        name: 'YOLO Gigamax Call $180',
        type: 'CALL',
        strikePrice: 180,
        tier: 'HIGH',
        volatilityModifier: 0.10,
        priceShift: 40,
        description: '',
        flavorText: '100x leverage degenerate dream.',
        leverage: 100
      };
    case 'giga-put':
      return {
        id: `high-lev-put-inject-${Date.now()}`,
        name: 'Black Swan Giga Put $50',
        type: 'PUT',
        strikePrice: 50,
        tier: 'HIGH',
        volatilityModifier: 0.10,
        priceShift: -40,
        multiplier: 3.0,
        description: '',
        flavorText: '100x leverage apocalypse insurance.',
        leverage: 100
      };
    case 'pump':
    default:
      return {
        id: `otc-pump-inject-${Date.now()}`,
        name: 'Reddit Pump contract',
        type: 'CALL',
        strikePrice: 110,
        tier: 'MEDIUM',
        volatilityModifier: 0.03,
        priceShift: 15,
        description: '',
        flavorText: 'Injected via debug terminal.',
        leverage: 1
      };
  }
};

export const debugInjectCard = (prev: GameState, variant: DebugInjectVariant): GameState => {
  const updatedCard = updateCardDescription(buildInjectCard(variant));
  const newDeck = [...prev.deck, updatedCard];
  return {
    ...prev,
    deck: newDeck,
    optionsOutstanding: getDeckWeight(newDeck),
    tradeLog: [...prev.tradeLog, `DEBUG: Injected ${updatedCard.name} into deck.`]
  };
};

export const debugClearTarget = (prev: GameState): GameState => ({
  ...prev,
  marginLedger: prev.weekTarget + 100,
});

export const debugCornerFloat = (prev: GameState): GameState => {
  // Inflate options outstanding to 80% float capacity to make Short Squeeze available
  const targetOutstanding = Math.ceil(prev.maxFloatCapacity * 0.8);
  // Refill deck with high-value contracts if needed
  const newDeck = [...prev.deck];
  while (getDeckWeight(newDeck) < targetOutstanding) {
    newDeck.push({
      id: `squeeze-refill-${Date.now()}-${Math.random()}`,
      name: 'Squeeze Heavy Call $110',
      type: 'CALL',
      strikePrice: 110,
      tier: 'HIGH',
      volatilityModifier: 0.05,
      priceShift: 10,
      description: '',
      flavorText: 'Heavy options loaded for instant short squeeze.',
      leverage: 1
    });
  }
  return {
    ...prev,
    deck: newDeck,
    optionsOutstanding: getDeckWeight(newDeck),
    currentDay: 5,
    screen: 'WEEKLY_SETTLE',
    tradeLog: [...prev.tradeLog, 'DEBUG: Cornered GME float! Manual Squeeze Button is now active.']
  };
};

export const debugForceSqueezeWar = (prev: GameState): GameState => ({
  ...prev,
  screen: 'SQUEEZE_WAR',
  assetPrice: 450,
  hedgeFundLiquidity: 200,
  tradeLog: [...prev.tradeLog, 'DEBUG: Entered Squeeze War. Hedge fund has $200 liquidity left, GME at $450.']
});
