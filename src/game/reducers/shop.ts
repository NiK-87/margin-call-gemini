import type { Card, GameState } from '../../types/game';
import { UPGRADES_LIST } from '../../utils/gameData';
import { getDeckWeight } from '../helpers';

export const buyUpgrade = (prev: GameState, upgradeId: string): GameState => {
  const upgrade = UPGRADES_LIST.find((u) => u.id === upgradeId);
  if (!upgrade || prev.personalCash < upgrade.cost) return prev;

  const newPersonalCash = prev.personalCash - upgrade.cost;
  const nextUpgrades = [...prev.activeUpgrades, upgradeId];
  const newDeck = [...prev.deck];
  let finalMaxFloat = prev.maxFloatCapacity;
  const nextOtcInventory = [...prev.otcInventory];

  if (upgrade.type === 'SHARE') {
    if (upgradeId === 'share-float') {
      finalMaxFloat = 150;
    }
  } else {
    // Consumable OTC: Add to OTC inventory
    nextOtcInventory.push(upgradeId);
  }

  const newWeight = getDeckWeight(newDeck);

  // Check for instant short squeeze trigger
  let nextScreen = prev.screen;
  const logs = [`Purchased Upgrade: ${upgrade.name} for $${upgrade.cost.toFixed(2)}.`];
  if (newWeight > finalMaxFloat) {
    nextScreen = 'VICTORY_SHORT_SQUEEZE';
    logs.push('ALERT: Speculative option load triggered a Short Squeeze Cascade!');
  }

  return {
    ...prev,
    personalCash: newPersonalCash,
    activeUpgrades: nextUpgrades,
    deck: newDeck,
    maxFloatCapacity: finalMaxFloat,
    optionsOutstanding: newWeight,
    otcInventory: nextOtcInventory,
    screen: nextScreen,
    tradeLog: [...prev.tradeLog, ...logs],
  };
};

export const buyCardDraft = (prev: GameState, card: Card): GameState => {
  const cost = card.tier === 'LOW' ? 25 : card.tier === 'MEDIUM' ? 50 : 85;
  if (prev.personalCash < cost) return prev;

  const newDeck = [...prev.deck];
  const existingIdx = prev.deck.findIndex((c) => c.name === card.name);

  const logs: string[] = [];
  if (existingIdx !== -1) {
    const currentLeverage = prev.deck[existingIdx].leverage || 1;
    const nextLeverage = currentLeverage * 10;
    newDeck[existingIdx] = {
      ...newDeck[existingIdx],
      leverage: nextLeverage
    };
    logs.push(`Leveraged existing option position: ${card.name} upgraded to Leverage x${nextLeverage}!`);
  } else {
    newDeck.push({ ...card, id: `${card.id}-${Date.now()}`, leverage: 1 });
    logs.push(`Drafted new options card: ${card.name} for $${cost.toFixed(2)}.`);
  }

  const newWeight = getDeckWeight(newDeck);
  const nextShopCards = prev.shopCards.filter((c) => c.name !== card.name);

  let nextScreen = prev.screen;

  if (newWeight > prev.maxFloatCapacity) {
    nextScreen = 'VICTORY_SHORT_SQUEEZE';
    logs.push('ALERT: Speculative option load triggered a Short Squeeze Cascade!');
  }

  return {
    ...prev,
    personalCash: prev.personalCash - cost,
    deck: newDeck,
    shopCards: nextShopCards,
    optionsOutstanding: newWeight,
    screen: nextScreen,
    tradeLog: [...prev.tradeLog, ...logs],
  };
};

export const liquidateCard = (prev: GameState, cardId: string): GameState => {
  if (prev.personalCash < 20 || prev.deck.length <= 5) return prev;

  const cardIndex = prev.deck.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) return prev;

  const newDeck = [...prev.deck];
  const removedCard = newDeck.splice(cardIndex, 1)[0];
  const newWeight = getDeckWeight(newDeck);

  return {
    ...prev,
    personalCash: prev.personalCash - 20,
    deck: newDeck,
    optionsOutstanding: newWeight,
    tradeLog: [...prev.tradeLog, `Liquidated Position: closed out ${removedCard.name} for $20.00 fee.`],
  };
};
