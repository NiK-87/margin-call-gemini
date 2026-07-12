import type { Card, GameState } from '../types/game';

// Payout of a single card at a given price (leverage + put multiplier applied, no gamma)
export const getCardPayout = (card: Card, price: number): number => {
  if (card.type === 'CALL') {
    const payout = price > card.strikePrice ? price - card.strikePrice : 0;
    return payout * (card.leverage || 1);
  }
  const payout = card.strikePrice > price ? card.strikePrice - price : 0;
  return payout * (card.multiplier || 1) * (card.leverage || 1);
};

export const sumCalls = (cards: Card[], price: number): number =>
  cards.reduce((acc, c) => (c.type === 'CALL' ? acc + getCardPayout(c, price) : acc), 0);

export const sumPuts = (cards: Card[], price: number): number =>
  cards.reduce((acc, c) => (c.type === 'PUT' ? acc + getCardPayout(c, price) : acc), 0);

// Progressive commission brackets:
// - First 100: base rate
// - Next 400: half base rate
// - Above 500: 2%
export const computeCommission = (dailyYield: number, baseRate: number): number => {
  if (dailyYield <= 100) return dailyYield * baseRate;
  if (dailyYield <= 500) return 100 * baseRate + (dailyYield - 100) * (baseRate * 0.5);
  return 100 * baseRate + 400 * baseRate * 0.5 + (dailyYield - 500) * 0.02;
};

export const getSalary = (state: GameState): number =>
  state.activeUpgrades.includes('share-salary') ? 100.0 : 50.0;

export const getCommissionRate = (state: GameState): number =>
  state.activeUpgrades.includes('share-commission') ? 0.15 : 0.10;

// Derived metrics for the Daily Settle screen (hand-based, no gamma multiplier)
export const getDailySettleMetrics = (state: GameState) => {
  const settleCallsSum = sumCalls(state.hand, state.assetPrice);
  const settlePutsSum = sumPuts(state.hand, state.assetPrice);
  const settleDailyYield = settleCallsSum + settlePutsSum;
  const settleSalary = getSalary(state);
  const settleCommission = computeCommission(settleDailyYield, getCommissionRate(state));
  const settleEarnings = settleSalary + settleCommission;
  return { settleCallsSum, settlePutsSum, settleDailyYield, settleSalary, settleCommission, settleEarnings };
};

// Derived metrics for the Weekly Settle screen (deck-based)
export const getWeeklySettleMetrics = (state: GameState) => {
  const weeklyCallsSum = sumCalls(state.deck, state.assetPrice);
  const weeklyPutsSum = sumPuts(state.deck, state.assetPrice);
  const weeklyExerciseYield = weeklyCallsSum + weeklyPutsSum;
  const projectedTotalLedger = state.marginLedger + weeklyExerciseYield;
  return { weeklyCallsSum, weeklyPutsSum, weeklyExerciseYield, projectedTotalLedger };
};
