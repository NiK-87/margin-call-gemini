import type { GameState } from '../../types/game';
import { CARD_POOL } from '../../utils/gameData';
import { drawCards, marketTick, shuffle } from '../helpers';
import { computeCommission, getCommissionRate, getSalary } from '../selectors';

export const discardCard = (prev: GameState, cardId: string): GameState => {
  const cardIndex = prev.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) return prev;

  const card = prev.hand[cardIndex];
  const newHand = [...prev.hand];
  newHand.splice(cardIndex, 1);

  let priceChange = card.priceShift;
  let logMsg = '';
  let newPrice = prev.assetPrice;

  const nextUpgrades = [...prev.activeUpgrades];
  const isDarkPoolActive = prev.activeUpgrades.includes('otc-darkpool-active');

  if (isDarkPoolActive) {
    priceChange = 0;
    const dpIdx = nextUpgrades.indexOf('otc-darkpool-active');
    if (dpIdx > -1) nextUpgrades.splice(dpIdx, 1);
    logMsg = `Discarded ${card.name} via Dark Pool. Market GME impact suppressed.`;
  } else {
    logMsg = `Discarded ${card.name}. GME price shifted by $${priceChange.toFixed(2)}.`;
  }

  if (!isDarkPoolActive) {
    newPrice = prev.assetPrice + priceChange;
    if (newPrice < 5) newPrice = 5;
  }

  // Check for hedge stabilizer or positive locks
  let overnightNegated = prev.overnightNegated;
  if (card.name.toLowerCase().includes('stabilizer') || card.name.toLowerCase().includes('hedge')) {
    overnightNegated = true;
    logMsg += ` [Hedge Lock Activated: Overnight GME price stabilized.]`;
  }

  // Check for Intraday Gamma Squeeze
  let isGammaSqueezeTriggered = false;
  if (prev.settings.enableGammaSqueeze) {
    const hasCallsInHand = newHand.some((c) => c.type === 'CALL');
    if (newPrice >= 200.0 && hasCallsInHand && !prev.isGammaSqueezedToday) {
      isGammaSqueezeTriggered = true;
      newPrice = newPrice * 1.20; // 20% spike
      logMsg += ` [INTRADAY GAMMA SQUEEZE! GME price spikes +20% as shorts hedge CALL deltas!]`;
    }
  }

  // Volatility calculation
  let volIncrease = card.volatilityModifier;
  if (prev.activeUpgrades.includes('share-volatility')) {
    volIncrease /= 2;
  }
  const newVolatility = Math.min(1.0, prev.volatility + volIncrease);

  // Trigger a standard market tick response
  const tickResult = marketTick(newPrice, newVolatility, 0);

  // Draw replacement card
  const refill = drawCards(1, newHand, prev.drawPile, [...prev.discardPile, card]);

  return {
    ...prev,
    assetPrice: tickResult.price,
    priceHistory: [...prev.priceHistory, tickResult.price].slice(-25),
    volatility: newVolatility,
    hand: refill.hand,
    drawPile: refill.drawPile,
    discardPile: refill.discardPile,
    activeUpgrades: nextUpgrades,
    isGammaSqueezedToday: prev.isGammaSqueezedToday || isGammaSqueezeTriggered,
    overnightNegated: overnightNegated,
    tradeLog: [...prev.tradeLog, logMsg, `Market Update: GME price adjusts to $${tickResult.price.toFixed(2)}.`],
  };
};

export const activateOtcConsumable = (prev: GameState, otcId: string): GameState => {
  const idx = prev.otcInventory.indexOf(otcId);
  if (idx === -1) return prev;

  const nextOtcInventory = [...prev.otcInventory];
  nextOtcInventory.splice(idx, 1); // Consume one instance

  let newPrice = prev.assetPrice;
  let logMsg = '';
  const nextUpgrades = [...prev.activeUpgrades];

  if (otcId === 'otc-pump') {
    newPrice = prev.assetPrice * 1.15;
    logMsg = `Tactical Deploy: Reddit Pump Contract activated! GME price spikes +15%.`;
  } else if (otcId === 'otc-dump') {
    newPrice = prev.assetPrice * 0.85;
    logMsg = `Tactical Deploy: Short Raid Contract activated! GME price drops -15%.`;
  } else if (otcId === 'otc-darkpool') {
    nextUpgrades.push('otc-darkpool-active');
    logMsg = `Tactical Deploy: Dark Pool Contract activated! Next standard option discard has 0 GME price shift.`;
  } else if (otcId === 'otc-hedge') {
    nextUpgrades.push('otc-hedge-active');
    logMsg = `Tactical Deploy: Synthetic Put Contract activated! Guaranteed $100.00 daily yield floor set for today.`;
  }

  if (newPrice < 5) newPrice = 5;

  // Volatility calculation (deploying OTC contracts adds 1.5% volatility)
  let volIncrease = 0.015;
  if (prev.activeUpgrades.includes('share-volatility')) {
    volIncrease /= 2;
  }
  const newVolatility = Math.min(1.0, prev.volatility + volIncrease);

  const tickResult = marketTick(newPrice, newVolatility, 0);

  return {
    ...prev,
    assetPrice: tickResult.price,
    priceHistory: [...prev.priceHistory, tickResult.price].slice(-25),
    volatility: newVolatility,
    otcInventory: nextOtcInventory,
    activeUpgrades: nextUpgrades,
    tradeLog: [...prev.tradeLog, logMsg, `Market Update: GME price adjusts to $${tickResult.price.toFixed(2)}.`],
  };
};

export const redrawDiscards = (prev: GameState): GameState => {
  if (prev.discardsLeft <= 0) return prev;

  // Discard entire hand
  const newDiscardPile = [...prev.discardPile, ...prev.hand];

  // Draw 5 new cards
  const refill = drawCards(5, [], prev.drawPile, newDiscardPile);
  const newVolatility = Math.min(1.0, prev.volatility + 0.02);
  const tickResult = marketTick(prev.assetPrice, newVolatility, 0);

  return {
    ...prev,
    discardsLeft: prev.discardsLeft - 1,
    hand: refill.hand,
    drawPile: refill.drawPile,
    discardPile: refill.discardPile,
    volatility: newVolatility,
    assetPrice: tickResult.price,
    priceHistory: [...prev.priceHistory, tickResult.price].slice(-25),
    tradeLog: [...prev.tradeLog, 'Discarded hand and drew 5 options. Portfolio recycled.', `Market Update: core asset price adjusts to $${tickResult.price.toFixed(2)}.`],
  };
};

export const endDay = (prev: GameState): GameState => {
  // Calculate calls sum and puts sum in hand at lock price with leverage
  const callsSum = prev.hand.reduce((acc, card) => {
    if (card.type === 'CALL') {
      const payout = prev.assetPrice > card.strikePrice ? prev.assetPrice - card.strikePrice : 0;
      const leverage = card.leverage || 1;
      const mult = prev.isGammaSqueezedToday ? 2 : 1;
      return acc + (payout * leverage * mult);
    }
    return acc;
  }, 0);

  const putsSum = prev.hand.reduce((acc, card) => {
    if (card.type === 'PUT') {
      const payout = card.strikePrice > prev.assetPrice ? card.strikePrice - prev.assetPrice : 0;
      return acc + (payout * (card.multiplier || 1) * (card.leverage || 1));
    }
    return acc;
  }, 0);

  let finalYield = callsSum + putsSum;

  // Check synthetic put contract yield guarantee
  if (prev.activeUpgrades.includes('otc-hedge-active')) {
    if (finalYield < 100.0) {
      finalYield = 100.0;
    }
  }

  // Check for speculative penalty
  const isSpecPenalty = prev.optionsOutstanding > prev.maxFloatCapacity;
  if (isSpecPenalty) {
    finalYield = finalYield * 0.75;
  }

  // Calculate personal cut (progressive)
  const salary = getSalary(prev);
  const commission = computeCommission(finalYield, getCommissionRate(prev));
  const earnings = salary + commission;

  const newPersonalCash = prev.personalCash + earnings;
  const newMarginLedger = prev.marginLedger + (finalYield * 0.90);

  const logs = [
    `CONCLUDED DAY ${prev.currentDay} OF TRADING.`,
    `Ledger Yield: +$${(finalYield * 0.90).toFixed(2)} added to Margin Ledger.`,
    `Personal payout salary $${salary} + commission $${commission.toFixed(2)} = +$${earnings.toFixed(2)} cash.`
  ];

  // Clean day consumables
  const nextUpgrades = prev.activeUpgrades.filter(
    (u) => u !== 'otc-hedge-active' && u !== 'otc-darkpool-active'
  );

  // Draft 3 cards from CARD_POOL for the daily shop
  const draftPool = [...CARD_POOL];
  const shuffledDraft = shuffle(draftPool);
  const shopCards = shuffledDraft.slice(0, 3);

  return {
    ...prev,
    personalCash: newPersonalCash,
    marginLedger: newMarginLedger,
    screen: 'DAILY_SETTLE',
    activeUpgrades: nextUpgrades,
    dailyYield: finalYield,
    dailySalary: salary,
    dailyEarnings: earnings,
    shopCards,
    tradeLog: [...prev.tradeLog, ...logs],
  };
};

export const startNextDay = (prev: GameState): GameState => {
  const nextDay = prev.currentDay + 1;
  const nextDayShuffled = shuffle(prev.deck);
  const refill = drawCards(5, [], nextDayShuffled, []);

  let newPrice = prev.assetPrice;
  const logs = [`COMMENCED TRADING DAY ${nextDay}. Hand drawn.`];

  if (prev.settings.enableOvernightVol && !prev.overnightNegated) {
    // Volatility GME overnight shock
    const drift = 0.02 * (Math.random() - 0.35); // Slight upward drift overnight

    let volCoefficient = 0.20;
    if (prev.activeUpgrades.includes('share-volatility-hedge')) {
      volCoefficient = 0.10; // Volatility Hedge cut in half
    }

    // Random volatility shock
    let randomShock = (Math.random() - 0.5) * prev.volatility * volCoefficient;

    // Caps negative overnight GME shifts to max -5% if Overnight Insurance owned
    if (prev.activeUpgrades.includes('share-overnight-insurance')) {
      if (randomShock + drift < -0.05) {
        randomShock = -0.05 - drift;
      }
    }

    const pctChange = drift + randomShock;
    const priceDelta = prev.assetPrice * pctChange;
    newPrice = prev.assetPrice + priceDelta;
    if (newPrice < 5) newPrice = 5;

    logs.push(
      `OVERNIGHT MARKET ACTION: GME price adjusted by ${priceDelta >= 0 ? '+' : ''}${(pctChange * 100).toFixed(1)}% overnight. GME opens at $${newPrice.toFixed(2)}.`
    );
  } else if (prev.overnightNegated) {
    logs.push(`OVERNIGHT MARKET ACTION: Volatility stabilized. Overnight GME price opened flat at $${newPrice.toFixed(2)}.`);
  }

  return {
    ...prev,
    currentDay: nextDay,
    assetPrice: newPrice,
    priceHistory: [...prev.priceHistory, newPrice].slice(-25),
    hand: refill.hand,
    drawPile: refill.drawPile,
    discardPile: refill.discardPile,
    discardsLeft: prev.activeUpgrades.includes('share-discards') ? 4 : 3,
    volatility: 0.15, // reset volatility for the day
    isGammaSqueezedToday: false, // reset gamma squeeze flag
    overnightNegated: false, // reset overnight negation flag
    screen: 'DAILY_TRADE',
    tradeLog: [...prev.tradeLog, ...logs],
  };
};
