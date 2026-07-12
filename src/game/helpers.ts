import type { Card, GameState } from '../types/game';
import { CARD_POOL, createDeckForRisk, updateCardDescription } from '../utils/gameData';

export type RiskTier = 'LOW' | 'MEDIUM' | 'HIGH';

// Shuffling helper
export const shuffle = (array: Card[]): Card[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Deck drawing helper
export const drawCards = (
  count: number,
  currentHand: Card[],
  currentDraw: Card[],
  currentDiscard: Card[]
) => {
  const hand = [...currentHand];
  let draw = [...currentDraw];
  let discard = [...currentDiscard];

  for (let i = 0; i < count; i++) {
    if (draw.length === 0) {
      if (discard.length === 0) break;
      draw = shuffle(discard);
      discard = [];
    }
    const card = draw.shift();
    if (card) hand.push(card);
  }
  return { hand, drawPile: draw, discardPile: discard };
};

// Market GME tick simulator (drift + volatility shock + priceDelta)
export const marketTick = (currentPrice: number, currentVol: number, priceDelta: number = 0) => {
  const drift = 0.015 * (Math.random() - 0.42); // Slight upward bias for GME
  const shockPercent = (Math.random() - 0.5) * currentVol * 0.15;
  const shock = currentPrice * shockPercent;

  let newPrice = currentPrice + shock + (currentPrice * drift) + priceDelta;
  if (newPrice < 5) newPrice = 5; // Floor price

  return {
    price: newPrice,
  };
};

// Calculate speculative weight of the deck
export const getDeckWeight = (deck: Card[]): number => {
  return deck.reduce((acc, card) => {
    if (card.tier === 'LOW') return acc + 4;
    if (card.tier === 'MEDIUM') return acc + 8;
    return acc + 15; // HIGH tier
  }, 0);
};

export const getRankForWeek = (week: number): string => {
  if (week === 1) return 'Junior GME Speculator';
  if (week === 2) return 'Senior Options Daytrader';
  if (week === 3) return 'Vice President of Leverage';
  if (week === 4) return 'Managing Director of Arbitrage';
  return 'Syndicate Partner (GME Whale)';
};

export const generateReplenishmentCards = (risk: RiskTier, count: number = 5): Card[] => {
  const cards: Card[] = [];
  for (let i = 0; i < count; i++) {
    let allowedTiers: string[] = ['LOW'];
    if (risk === 'LOW') allowedTiers = ['LOW'];
    else if (risk === 'MEDIUM') allowedTiers = ['LOW', 'MEDIUM'];
    else allowedTiers = ['MEDIUM', 'HIGH'];

    const filtered = CARD_POOL.filter(c => allowedTiers.includes(c.tier));
    const randomTemplate = filtered[Math.floor(Math.random() * filtered.length)];

    const baseStrike = randomTemplate.strikePrice;
    const strikeOffset = Math.floor(Math.random() * 9) - 4; // -4 to +4
    const strikePrice = baseStrike + strikeOffset;

    const isCall = randomTemplate.type === 'CALL';
    const shiftOffset = Math.floor(Math.random() * 3) - 1; // -1 to +1
    const priceShift = isCall
      ? Math.max(2, randomTemplate.priceShift + shiftOffset)
      : Math.min(-2, randomTemplate.priceShift - shiftOffset);

    const c: Card = {
      ...randomTemplate,
      id: `${randomTemplate.type.toLowerCase()}-${randomTemplate.tier.toLowerCase()}-rep-${Date.now()}-${Math.floor(Math.random() * 10000)}-${i}`,
      strikePrice,
      priceShift,
      leverage: 1
    };
    cards.push(updateCardDescription(c));
  }
  return cards;
};

export const createStateForRisk = (risk: RiskTier): GameState => {
  const deck = createDeckForRisk(risk);
  const shuffled = shuffle(deck);
  const hand = shuffled.slice(0, 5);
  const drawPile = shuffled.slice(5);
  const initialWeight = getDeckWeight(deck);

  return {
    screen: 'TITLE',
    currentDay: 1,
    currentWeek: 1,
    assetPrice: 100.0,
    priceHistory: [95.0, 97.0, 100.0],
    volatility: 0.15,
    deck,
    hand,
    discardPile: [],
    drawPile,
    discardsLeft: 3,
    personalCash: 120.0,
    marginLedger: 0.0,
    weekTarget: 300.0,
    activeUpgrades: [],
    tradeLog: [
      `GME SPECOPS Speculator Interface initialized on ${risk} RISK profile.`,
      'Hedge Fund GME float capacity cap locked at 100.',
      'Margin Ledger target for Week 1: $300.00.'
    ],
    dailyYield: 0.0,
    dailySalary: 50.0,
    dailyEarnings: 50.0,
    optionsOutstanding: initialWeight,
    maxFloatCapacity: 100,
    shopCards: [],

    // Additions
    riskTier: risk,
    corporateRank: 'Junior GME Speculator',
    hedgeFundLiquidity: 10000,
    exercisedCardIds: [],
    rolledOverCardIds: [],
    overnightNegated: false,
    isGammaSqueezedToday: false,
    otcInventory: [],
    settings: {
      enableOvernightVol: true,
      enableGammaSqueeze: true,
      enableManualExercise: true
    }
  };
};
