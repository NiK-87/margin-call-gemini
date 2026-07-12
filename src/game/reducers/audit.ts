import type { GameState } from '../../types/game';
import type { WeeklyCardAction } from '../actions';
import { drawCards, generateReplenishmentCards, getDeckWeight, getRankForWeek, shuffle } from '../helpers';

export const enterWeeklySettle = (prev: GameState): GameState => {
  // Default selections: ITM gets exercised, OTM gets rolled over
  const exercised: string[] = [];
  const rolledOver: string[] = [];

  prev.deck.forEach((card) => {
    const isCall = card.type === 'CALL';
    const isITM = isCall
      ? prev.assetPrice > card.strikePrice
      : card.strikePrice > prev.assetPrice;

    if (isITM) {
      exercised.push(card.id);
    } else {
      rolledOver.push(card.id);
    }
  });

  return {
    ...prev,
    exercisedCardIds: exercised,
    rolledOverCardIds: rolledOver,
    screen: 'WEEKLY_SETTLE'
  };
};

export const setWeeklyCardAction = (prev: GameState, cardId: string, action: WeeklyCardAction): GameState => {
  const exercised = prev.exercisedCardIds.filter((id) => id !== cardId);
  const rolledOver = prev.rolledOverCardIds.filter((id) => id !== cardId);

  if (action === 'EXERCISE') exercised.push(cardId);
  else if (action === 'ROLLOVER') rolledOver.push(cardId);

  return {
    ...prev,
    exercisedCardIds: exercised,
    rolledOverCardIds: rolledOver
  };
};

export const settleWeeklyAudit = (prev: GameState): GameState => {
  const closingPrice = prev.assetPrice;
  const logs = [`INITIATING SYSTEM AUDIT WEEK ${prev.currentWeek} SETTLEMENT.`];

  // Settle chosen exercised cards against closing price
  let callsSum = 0;
  let putsSum = 0;

  prev.deck.forEach((card) => {
    if (prev.settings.enableManualExercise) {
      if (!prev.exercisedCardIds.includes(card.id)) return;
    }

    if (card.type === 'CALL') {
      const payout = closingPrice > card.strikePrice ? closingPrice - card.strikePrice : 0;
      callsSum += payout * (card.leverage || 1);
    } else {
      const payout = card.strikePrice > closingPrice ? card.strikePrice - closingPrice : 0;
      putsSum += payout * (card.multiplier || 1) * (card.leverage || 1);
    }
  });

  const weeklyYield = callsSum + putsSum;
  const totalMarginLedger = prev.marginLedger + weeklyYield;

  // Rollover fee calculation
  let rolloverCost = 0;
  if (prev.settings.enableManualExercise) {
    rolloverCost = prev.rolledOverCardIds.length * 15;
  }

  logs.push(
    `Week Audit: exercised calls: +$${callsSum.toFixed(2)}, exercised puts: +$${putsSum.toFixed(2)}.`,
    `Weekly Option exercise yield: +$${weeklyYield.toFixed(2)}. Rollover cost paid: -$${rolloverCost.toFixed(2)}.`,
    `Total Margin Ledger: $${totalMarginLedger.toFixed(2)}.`
  );

  let nextScreen = prev.screen;
  let nextWeek = prev.currentWeek;
  let nextTarget = prev.weekTarget;
  let newPersonalCash = prev.personalCash - rolloverCost;

  if (totalMarginLedger < prev.weekTarget) {
    nextScreen = 'GAME_OVER';
    logs.push(`LEDGER RECONCILIATION FAILURE: Required target $${prev.weekTarget.toFixed(2)} but accumulated $${totalMarginLedger.toFixed(2)}. MARGIN CALL INITIATED.`);
  } else {
    if (prev.currentWeek >= 4) {
      nextScreen = 'VICTORY_SHORT_SQUEEZE';
      logs.push('WEEK 4 AUDIT SURVIVED. GME SPECOPS SUCCESSFUL. HEDGE FUNDS LIQUIDATED.');
    } else {
      nextScreen = 'WEEKLY_SHOP';
      nextWeek = prev.currentWeek + 1;
      nextTarget = prev.weekTarget * 1.5;
      newPersonalCash = newPersonalCash + 150.0; // Weekly bonus
      logs.push(
        `SUCCESS: Audit reconciled. Target cleared. Awarded +$150.00 weekly bonus.`,
        `Week ${nextWeek} Rank: ${getRankForWeek(nextWeek)}. Target: $${nextTarget.toFixed(2)}.`
      );
    }
  }

  // Update deck: keep only rolled over cards!
  let newDeck = [...prev.deck];
  if (prev.settings.enableManualExercise) {
    newDeck = prev.deck.filter((card) => prev.rolledOverCardIds.includes(card.id));
  }

  // Automatically replenish deck with 5 brand-new randomized contracts matching their risk archetype
  if (nextScreen === 'WEEKLY_SHOP') {
    const replenishment = generateReplenishmentCards(prev.riskTier, 5);
    newDeck.push(...replenishment);
    logs.push(`Replenished options portfolio: added 5 new contracts matching ${prev.riskTier} risk tier.`);
  }

  // Shuffle and draw hand for the next week
  const nextDayShuffled = shuffle(newDeck);
  const refill = drawCards(5, [], nextDayShuffled, []);

  return {
    ...prev,
    marginLedger: 0.0,
    currentDay: 1,
    currentWeek: nextWeek,
    corporateRank: getRankForWeek(nextWeek),
    weekTarget: nextTarget,
    personalCash: newPersonalCash,
    screen: nextScreen,
    deck: newDeck,
    hand: refill.hand,
    drawPile: refill.drawPile,
    discardPile: refill.discardPile,
    discardsLeft: prev.activeUpgrades.includes('share-discards') ? 4 : 3,
    volatility: 0.15,
    optionsOutstanding: getDeckWeight(newDeck),
    tradeLog: [...prev.tradeLog, ...logs]
  };
};

export const initiateShortSqueezePhase = (prev: GameState): GameState => {
  const logs = ['INITIATING SHORT SQUEEZE LIQUIDATION CASCADE!'];
  const contractCount = prev.deck.length;

  // Calculate GME Squeezed Price: GME rises by $15 per options contract
  const priceIncrease = contractCount * 15;
  const squeezedPrice = prev.assetPrice + priceIncrease;

  // Calculate total deck payouts at this squeezed GME price
  const callsSum = prev.deck.reduce((acc, card) => {
    if (card.type === 'CALL') {
      const payout = squeezedPrice > card.strikePrice ? squeezedPrice - card.strikePrice : 0;
      return acc + (payout * (card.leverage || 1));
    }
    return acc;
  }, 0);

  const putsSum = prev.deck.reduce((acc, card) => {
    if (card.type === 'PUT') {
      const payout = card.strikePrice > squeezedPrice ? card.strikePrice - squeezedPrice : 0;
      return acc + (payout * (card.multiplier || 1) * (card.leverage || 1));
    }
    return acc;
  }, 0);

  const totalSqueezeYield = callsSum + putsSum;
  const nextHedgeFundLiquidity = Math.max(0, 10000 - totalSqueezeYield);

  logs.push(
    `Short Squeeze: GME price skyrocketed +$${priceIncrease.toFixed(2)} to $${squeezedPrice.toFixed(2)}!`,
    `Speculative options exercised value: +$${totalSqueezeYield.toFixed(2)}.`,
    `Hedge Fund Liquidity Pool drained to $${nextHedgeFundLiquidity.toFixed(2)}.`
  );

  let nextScreen = prev.screen;
  if (squeezedPrice >= 500.0 || nextHedgeFundLiquidity <= 0) {
    nextScreen = 'VICTORY_SHORT_SQUEEZE';
    logs.push('HEDGE FUND BANKRUPTCY DECLARED. SHORT CORNER COMPLETED. DIAMOND HANDS VICTORIOUS!');
  } else {
    nextScreen = 'GAME_OVER';
    logs.push('SHORT SQUEEZE RECONCILIATION FAILED. Hedge fund absorbed the speculative load. Margin Call declared.');
  }

  return {
    ...prev,
    assetPrice: squeezedPrice,
    priceHistory: [...prev.priceHistory, squeezedPrice].slice(-25),
    hedgeFundLiquidity: nextHedgeFundLiquidity,
    screen: nextScreen,
    tradeLog: [...prev.tradeLog, ...logs]
  };
};
