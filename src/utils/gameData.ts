import type { Card, Upgrade } from '../types/game';


export const STARTER_DECK: Card[] = [
  // Call options
  {
    id: 'call-low-covered-1',
    name: 'Covered Call $105',
    type: 'CALL',
    strikePrice: 105,
    tier: 'LOW',
    volatilityModifier: 0.01,
    priceShift: 5,
    description: 'Pays (Price - $105) if Price > $105. Discard: shifts price +$5.',
    flavorText: 'A safe, conservative strategy to grind out tiny premium yields.'
  },
  {
    id: 'call-low-covered-2',
    name: 'Covered Call $105',
    type: 'CALL',
    strikePrice: 105,
    tier: 'LOW',
    volatilityModifier: 0.01,
    priceShift: 5,
    description: 'Pays (Price - $105) if Price > $105. Discard: shifts price +$5.',
    flavorText: 'Selling upside to yield-hungry retail buyers.'
  },
  {
    id: 'call-low-leap-1',
    name: 'Retail LEAP Call $110',
    type: 'CALL',
    strikePrice: 110,
    tier: 'LOW',
    volatilityModifier: 0.012,
    priceShift: 6,
    description: 'Pays (Price - $110) if Price > $110. Discard: shifts price +$6.',
    flavorText: 'Long-term Equity Anticipation Securities. In practice: buying hope on leverage.'
  },
  {
    id: 'call-low-arb-1',
    name: 'Market Maker Arb Call $100',
    type: 'CALL',
    strikePrice: 100,
    tier: 'LOW',
    volatilityModifier: 0.015,
    priceShift: 4,
    description: 'Pays (Price - $100) if Price > $100. Discard: shifts price +$4.',
    flavorText: 'Picking up pennies in front of a steamroller. Extremely consistent, until it isn\'t.'
  },
  {
    id: 'call-med-sweep-1',
    name: 'Gamma Sweep Call $120',
    type: 'CALL',
    strikePrice: 120,
    tier: 'MEDIUM',
    volatilityModifier: 0.025,
    priceShift: 12,
    description: 'Pays (Price - $120) if Price > $120. Discard: shifts price +$12.',
    flavorText: 'Sweep the board and watch the market makers panic-buy to hedge their deltas.'
  },
  // Put options
  {
    id: 'put-low-married-1',
    name: 'Married Put $95',
    type: 'PUT',
    strikePrice: 95,
    tier: 'LOW',
    volatilityModifier: 0.01,
    priceShift: -5,
    multiplier: 1.2,
    description: 'Multiplier x1.2: Pays ($95 - Price) x 1.2 if Price < $95. Discard: shifts price -$5.',
    flavorText: 'Bundled protection. Like a prenuptial agreement, but for stock certificates.'
  },
  {
    id: 'put-low-married-2',
    name: 'Married Put $95',
    type: 'PUT',
    strikePrice: 95,
    tier: 'LOW',
    volatilityModifier: 0.01,
    priceShift: -5,
    multiplier: 1.2,
    description: 'Multiplier x1.2: Pays ($95 - Price) x 1.2 if Price < $95. Discard: shifts price -$5.',
    flavorText: 'Insurance against immediate market corrections.'
  },
  {
    id: 'put-low-collar-1',
    name: 'Protective Collar Put $90',
    type: 'PUT',
    strikePrice: 90,
    tier: 'LOW',
    volatilityModifier: 0.012,
    priceShift: -6,
    multiplier: 1.3,
    description: 'Multiplier x1.3: Pays ($90 - Price) x 1.3 if Price < $90. Discard: shifts price -$6.',
    flavorText: 'Caps your upside, limits your downside, and bores everyone at the cocktail party.'
  },
  {
    id: 'put-med-sweep-1',
    name: 'Gamma Sweep Put $85',
    type: 'PUT',
    strikePrice: 85,
    tier: 'MEDIUM',
    volatilityModifier: 0.025,
    priceShift: -12,
    multiplier: 1.5,
    description: 'Multiplier x1.5: Pays ($85 - Price) x 1.5 if Price < $85. Discard: shifts price -$12.',
    flavorText: 'A massive block trade of downside protection that sends market makers into a shorting frenzy.'
  },
  {
    id: 'put-high-swan-1',
    name: 'Black Swan Put $55',
    type: 'PUT',
    strikePrice: 55,
    tier: 'HIGH',
    volatilityModifier: 0.06,
    priceShift: -25,
    multiplier: 2.2,
    description: 'Multiplier x2.2: Pays ($55 - Price) x 2.2 if Price < $55. Discard: shifts price -$25.',
    flavorText: 'Betting on tail-risk events. You\'ll look like a lunatic until the day the world ends.'
  }
];

export const UPGRADES_LIST: Upgrade[] = [
  // Permanent Shares
  {
    id: 'share-salary',
    name: 'Leveraged Capital',
    description: 'Permanent: Increases daily baseline salary from $50 to $100.',
    cost: 120,
    type: 'SHARE',
    icon: 'TrendingUp'
  },
  {
    id: 'share-discards',
    name: 'Insider Tip-off',
    description: 'Permanent: Start each trading day with +1 discard limit.',
    cost: 100,
    type: 'SHARE',
    icon: 'Info'
  },
  {
    id: 'share-volatility',
    name: 'Algorithmic Stabilizer',
    description: 'Permanent: Cuts daily volatility build-up from option transactions in half.',
    cost: 80,
    type: 'SHARE',
    icon: 'Activity'
  },
  {
    id: 'share-commission',
    name: 'Broker Rebate',
    description: 'Permanent: Adds +5% commission payout on daily yields.',
    cost: 140,
    type: 'SHARE',
    icon: 'Percent'
  },
  {
    id: 'share-float',
    name: 'Liquidity License',
    description: 'Permanent: Increases options float threshold capacity from 100 to 150.',
    cost: 90,
    type: 'SHARE',
    icon: 'Layers'
  },
  // Consumable OTC Shares
  {
    id: 'otc-darkpool',
    name: 'Dark Pool Contract',
    description: 'Consumable: Discard 1 card from hand without moving the market price.',
    cost: 30,
    type: 'OTC',
    icon: 'EyeOff'
  },
  {
    id: 'otc-pump',
    name: 'Reddit Pump contract',
    description: 'Consumable: Instantly drives the asset price up by 15%.',
    cost: 45,
    type: 'OTC',
    icon: 'Zap'
  },
  {
    id: 'otc-dump',
    name: 'Short Raid Contract',
    description: 'Consumable: Instantly drives the asset price down by 15%.',
    cost: 40,
    type: 'OTC',
    icon: 'Flame'
  },
  {
    id: 'otc-hedge',
    name: 'Synthetic Put Protection',
    description: 'Consumable: Guarantees a minimum daily yield of $100 if you would otherwise yield less.',
    cost: 35,
    type: 'OTC',
    icon: 'ShieldCheck'
  },
  {
    id: 'share-overnight-insurance',
    name: 'Overnight Insurance',
    description: 'Permanent: Caps negative overnight GME price shifts to a maximum of -5%.',
    cost: 90,
    type: 'SHARE',
    icon: 'Shield'
  },
  {
    id: 'share-volatility-hedge',
    name: 'Volatility Hedge',
    description: 'Permanent: Cuts GME overnight price volatility shock in half.',
    cost: 75,
    type: 'SHARE',
    icon: 'Lock'
  }
];

export const CARD_POOL: Card[] = [
  // Low tier cards
  {
    id: 'put-low-beta-1',
    name: 'Beta Hedge Put $92',
    type: 'PUT',
    strikePrice: 92,
    tier: 'LOW',
    volatilityModifier: 0.015,
    priceShift: -5,
    multiplier: 1.2,
    description: 'Multiplier x1.2: Pays ($92 - Price) x 1.2 if Price < $92. Discard: shifts price -$5.',
    flavorText: 'Neutralizing market correlation. A fancy way to say you\'re afraid of green days.'
  },
  {
    id: 'call-low-treasury-1',
    name: 'Corporate Treasury Call $102',
    type: 'CALL',
    strikePrice: 102,
    tier: 'LOW',
    volatilityModifier: 0.011,
    priceShift: 5,
    description: 'Pays (Price - $102) if Price > $102. Discard: shifts price +$5.',
    flavorText: 'Underwritten by the board to show "immense confidence" in the upcoming quarter.'
  },
  // Medium tier cards
  {
    id: 'call-med-insider-1',
    name: 'Insider Arbitrage Call $115',
    type: 'CALL',
    strikePrice: 115,
    tier: 'MEDIUM',
    volatilityModifier: 0.022,
    priceShift: 14,
    description: 'Pays (Price - $115) if Price > $115. Discard: shifts price +$14.',
    flavorText: 'A congressman\'s spouse just bought 50,000 shares. Follow the smart money.'
  },
  {
    id: 'call-med-pump-1',
    name: 'Hedge Fund Pump Call $125',
    type: 'CALL',
    strikePrice: 125,
    tier: 'MEDIUM',
    volatilityModifier: 0.03,
    priceShift: 15,
    description: 'Pays (Price - $125) if Price > $125. Discard: shifts price +$15.',
    flavorText: 'A highly coordinated, definitely legal public media push to "discuss structural value".'
  },
  {
    id: 'call-med-fomo-1',
    name: 'FOMO Retail Momentum Call $130',
    type: 'CALL',
    strikePrice: 130,
    tier: 'MEDIUM',
    volatilityModifier: 0.035,
    priceShift: 18,
    description: 'Pays (Price - $130) if Price > $130. Discard: shifts price +$18.',
    flavorText: 'The forums are posting rocket ship emojis. Resistance is futile, solvency is optional.'
  },
  {
    id: 'put-med-raid-1',
    name: 'Bear Raid Put $75',
    type: 'PUT',
    strikePrice: 75,
    tier: 'MEDIUM',
    volatilityModifier: 0.03,
    priceShift: -15,
    multiplier: 1.7,
    description: 'Multiplier x1.7: Pays ($75 - Price) x 1.7 if Price < $75. Discard: shifts price -$15.',
    flavorText: 'We spread the rumors, we short the stock, and then we buy the puts. Standard operating procedure.'
  },
  {
    id: 'put-med-otc-1',
    name: 'Over-the-Counter Put $80',
    type: 'PUT',
    strikePrice: 80,
    tier: 'MEDIUM',
    volatilityModifier: 0.035,
    priceShift: -10,
    multiplier: 1.5,
    description: 'Multiplier x1.5: Pays ($80 - Price) x 1.5 if Price < $80. Discard: shifts price -$10.',
    flavorText: 'A customized downside contract negotiated directly with a desperate counterparty.'
  },
  {
    id: 'put-med-condor-1',
    name: 'Iron Condor Put $78',
    type: 'PUT',
    strikePrice: 78,
    tier: 'MEDIUM',
    volatilityModifier: 0.028,
    priceShift: -11,
    multiplier: 1.6,
    description: 'Multiplier x1.6: Pays ($78 - Price) x 1.6 if Price < $78. Discard: shifts price -$11.',
    flavorText: 'A complex four-legged strategy that relies on range-bound drift. Or you can just hope it goes down.'
  },
  {
    id: 'put-med-squeeze-1',
    name: 'Short Squeeze Put $65',
    type: 'PUT',
    strikePrice: 65,
    tier: 'MEDIUM',
    volatilityModifier: 0.04,
    priceShift: -16,
    multiplier: 1.8,
    description: 'Multiplier x1.8: Pays ($65 - Price) x 1.8 if Price < $65. Discard: shifts price -$16.',
    flavorText: 'Betting against the crowd when they\'re trapped in a corner. Brutal and highly effective.'
  },
  // High tier cards
  {
    id: 'call-high-swap-1',
    name: 'Dark Pool Swap Call $140',
    type: 'CALL',
    strikePrice: 140,
    tier: 'HIGH',
    volatilityModifier: 0.05,
    priceShift: 25,
    description: 'Pays (Price - $140) if Price > $140. Discard: shifts price +$25.',
    flavorText: 'Settled in the shadows of institutional clearinghouses. No retail eye shall see.'
  },
  {
    id: 'call-high-zero-1',
    name: '0DTE Out-Of-The-Money Call $155',
    type: 'CALL',
    strikePrice: 155,
    tier: 'HIGH',
    volatilityModifier: 0.075,
    priceShift: 30,
    description: 'Pays (Price - $155) if Price > $155. Discard: shifts price +$30.',
    flavorText: 'Zero days to expiration. The financial equivalent of playing Russian roulette with a rocket launcher.'
  },
  {
    id: 'call-high-yolo-1',
    name: 'YOLO Moonshot Call $175',
    type: 'CALL',
    strikePrice: 175,
    tier: 'HIGH',
    volatilityModifier: 0.08,
    priceShift: 35,
    description: 'Pays (Price - $175) if Price > $175. Discard: shifts price +$35.',
    flavorText: 'Selling your second car for out-of-the-money options is a recognized investment thesis.'
  },
  {
    id: 'put-high-collapse-1',
    name: 'Systemic Collapse Put $50',
    type: 'PUT',
    strikePrice: 50,
    tier: 'HIGH',
    volatilityModifier: 0.08,
    priceShift: -30,
    multiplier: 2.5,
    description: 'Multiplier x2.5: Pays ($50 - Price) x 2.5 if Price < $50. Discard: shifts price -$30.',
    flavorText: 'A hyper-leveraged bet on total financial ruin. Cash it out quickly before the dollar collapses too.'
  },
  {
    id: 'put-high-toxic-1',
    name: 'Toxic Derivative Put $60',
    type: 'PUT',
    strikePrice: 60,
    tier: 'HIGH',
    volatilityModifier: 0.07,
    priceShift: -28,
    multiplier: 2.0,
    description: 'Multiplier x2.0: Pays ($60 - Price) x 2.0 if Price < $60. Discard: shifts price -$28.',
    flavorText: 'No one knows what assets are actually backing this contract. Best not to ask questions.'
  },
  {
    id: 'put-high-naked-1',
    name: 'Naked Put Protection $58',
    type: 'PUT',
    strikePrice: 58,
    tier: 'HIGH',
    volatilityModifier: 0.075,
    priceShift: -32,
    multiplier: 2.4,
    description: 'Multiplier x2.4: Pays ($58 - Price) x 2.4 if Price < $58. Discard: shifts price -$32.',
    flavorText: 'Writing puts without collateral. If the stock plunges, you don\'t just lose money, you lose your shirt.'
  }
];

export const updateCardDescription = (card: Card): Card => {
  const isCall = card.type === 'CALL';
  const leverageText = card.leverage && card.leverage > 1 ? ` (x${card.leverage} Leverage)` : '';
  let desc = '';
  if (isCall) {
    desc = `Pays (GME - $${card.strikePrice}) if GME > $${card.strikePrice}. Discard: shifts GME price +$${card.priceShift}.`;
  } else {
    const multText = card.multiplier ? `x${card.multiplier} Put Multiplier: ` : '';
    desc = `${multText}Pays ($${card.strikePrice} - GME) if GME < $${card.strikePrice}. Discard: shifts GME price -$${Math.abs(card.priceShift)}.`;
  }
  return {
    ...card,
    description: desc + leverageText
  };
};

export const createDeckForRisk = (risk: 'LOW' | 'MEDIUM' | 'HIGH'): Card[] => {
  let deckTemplates: Omit<Card, 'id'>[] = [];

  if (risk === 'LOW') {
    deckTemplates = [
      {
        name: 'GME Covered Call',
        type: 'CALL',
        strikePrice: 100,
        tier: 'LOW',
        volatilityModifier: 0.008,
        priceShift: 4,
        description: '',
        flavorText: 'Conservative retail GME calls for steady premium yields.'
      },
      {
        name: 'GME Covered Call',
        type: 'CALL',
        strikePrice: 102,
        tier: 'LOW',
        volatilityModifier: 0.008,
        priceShift: 4,
        description: '',
        flavorText: 'Selling calls above current cost basis for safe gains.'
      },
      {
        name: 'GME Treasury Call',
        type: 'CALL',
        strikePrice: 98,
        tier: 'LOW',
        volatilityModifier: 0.01,
        priceShift: 5,
        description: '',
        flavorText: 'In-the-money GME option designed to preserve capital.'
      },
      {
        name: 'GME Treasury Call',
        type: 'CALL',
        strikePrice: 98,
        tier: 'LOW',
        volatilityModifier: 0.01,
        priceShift: 5,
        description: '',
        flavorText: 'Backstopped by corporate cash reserves.'
      },
      {
        name: 'GME Retail LEAP Call',
        type: 'CALL',
        strikePrice: 104,
        tier: 'LOW',
        volatilityModifier: 0.012,
        priceShift: 6,
        description: '',
        flavorText: 'Long-term equity anticipation with low risk decay.'
      },
      {
        name: 'GME Market Maker Arb Call',
        type: 'CALL',
        strikePrice: 100,
        tier: 'LOW',
        volatilityModifier: 0.015,
        priceShift: 4,
        description: '',
        flavorText: 'Arbitrage option ensuring tight bid-ask spreads.'
      },
      {
        name: 'GME Married Put',
        type: 'PUT',
        strikePrice: 95,
        tier: 'LOW',
        volatilityModifier: 0.01,
        priceShift: -5,
        multiplier: 1.1,
        description: '',
        flavorText: 'Insurance put married to shares to buffer downswings.'
      },
      {
        name: 'GME Married Put',
        type: 'PUT',
        strikePrice: 95,
        tier: 'LOW',
        volatilityModifier: 0.01,
        priceShift: -5,
        multiplier: 1.1,
        description: '',
        flavorText: 'Hedging GME volatility at reasonable premiums.'
      },
      {
        name: 'GME Protective Collar Put',
        type: 'PUT',
        strikePrice: 92,
        tier: 'LOW',
        volatilityModifier: 0.012,
        priceShift: -6,
        multiplier: 1.2,
        description: '',
        flavorText: 'Limits both upside potential and downside crash risk.'
      },
      {
        name: 'GME Beta Hedge Put',
        type: 'PUT',
        strikePrice: 90,
        tier: 'LOW',
        volatilityModifier: 0.015,
        priceShift: -5,
        multiplier: 1.2,
        description: '',
        flavorText: 'Low volatility index hedge.'
      }
    ];
  } else if (risk === 'HIGH') {
    deckTemplates = [
      {
        name: 'GME YOLO Moonshot Call',
        type: 'CALL',
        strikePrice: 140,
        tier: 'HIGH',
        volatilityModifier: 0.08,
        priceShift: 35,
        description: '',
        flavorText: 'Distant calls betting on exponential short-squeeze spikes.'
      },
      {
        name: 'GME Gamma Sweep Call',
        type: 'CALL',
        strikePrice: 125,
        tier: 'MEDIUM',
        volatilityModifier: 0.025,
        priceShift: 14,
        description: '',
        flavorText: 'Buying sweeps to trigger massive retail momentum.'
      },
      {
        name: 'GME Covered Call',
        type: 'CALL',
        strikePrice: 110,
        tier: 'LOW',
        volatilityModifier: 0.01,
        priceShift: 5,
        description: '',
        flavorText: 'High risk premium generation.'
      },
      {
        name: 'GME Married Put',
        type: 'PUT',
        strikePrice: 90,
        tier: 'LOW',
        volatilityModifier: 0.015,
        priceShift: -6,
        multiplier: 1.3,
        description: '',
        flavorText: 'Insurance options when market panic is imminent.'
      },
      {
        name: 'GME Bear Raid Put',
        type: 'PUT',
        strikePrice: 80,
        tier: 'MEDIUM',
        volatilityModifier: 0.03,
        priceShift: -15,
        multiplier: 1.6,
        description: '',
        flavorText: 'Coordinates downside pressure with high risk.'
      },
      {
        name: 'GME Gamma Sweep Put',
        type: 'PUT',
        strikePrice: 75,
        tier: 'MEDIUM',
        volatilityModifier: 0.035,
        priceShift: -14,
        multiplier: 1.8,
        description: '',
        flavorText: 'Market maker panic shorts cascade GME downwards.'
      },
      {
        name: 'GME Black Swan Put',
        type: 'PUT',
        strikePrice: 55,
        tier: 'HIGH',
        volatilityModifier: 0.06,
        priceShift: -25,
        multiplier: 2.2,
        description: '',
        flavorText: 'Betting on catastrophic liquidation.'
      },
      {
        name: 'GME Black Swan Put',
        type: 'PUT',
        strikePrice: 55,
        tier: 'HIGH',
        volatilityModifier: 0.06,
        priceShift: -25,
        multiplier: 2.2,
        description: '',
        flavorText: 'Unhedged tail risk bets.'
      },
      {
        name: 'GME Systemic Collapse Put',
        type: 'PUT',
        strikePrice: 50,
        tier: 'HIGH',
        volatilityModifier: 0.08,
        priceShift: -30,
        multiplier: 2.5,
        description: '',
        flavorText: 'Hyper-leveraged short options betting on broker bankruptcy.'
      },
      {
        name: 'GME Toxic Derivative Put',
        type: 'PUT',
        strikePrice: 60,
        tier: 'HIGH',
        volatilityModifier: 0.07,
        priceShift: -28,
        multiplier: 2.0,
        description: '',
        flavorText: 'Exotic downside derivative with extreme risk.'
      }
    ];
  } else {
    // MEDIUM (Balanced)
    deckTemplates = [
      {
        name: 'GME Covered Call',
        type: 'CALL',
        strikePrice: 105,
        tier: 'LOW',
        volatilityModifier: 0.01,
        priceShift: 5,
        description: '',
        flavorText: 'Grinding out premium payouts above typical cost basis.'
      },
      {
        name: 'GME Covered Call',
        type: 'CALL',
        strikePrice: 105,
        tier: 'LOW',
        volatilityModifier: 0.01,
        priceShift: 5,
        description: '',
        flavorText: 'Yield harvest call option.'
      },
      {
        name: 'GME Retail LEAP Call',
        type: 'CALL',
        strikePrice: 110,
        tier: 'LOW',
        volatilityModifier: 0.012,
        priceShift: 6,
        description: '',
        flavorText: 'Solid long GME momentum option.'
      },
      {
        name: 'GME Market Maker Call',
        type: 'CALL',
        strikePrice: 100,
        tier: 'LOW',
        volatilityModifier: 0.015,
        priceShift: 4,
        description: '',
        flavorText: 'Tight arbitrage GME call.'
      },
      {
        name: 'GME Gamma Sweep Call',
        type: 'CALL',
        strikePrice: 120,
        tier: 'MEDIUM',
        volatilityModifier: 0.025,
        priceShift: 12,
        description: '',
        flavorText: 'Spikes GME sentiment on retail market sweep orders.'
      },
      {
        name: 'GME Married Put',
        type: 'PUT',
        strikePrice: 95,
        tier: 'LOW',
        volatilityModifier: 0.01,
        priceShift: -5,
        multiplier: 1.2,
        description: '',
        flavorText: 'Standard downside protective collar put.'
      },
      {
        name: 'GME Married Put',
        type: 'PUT',
        strikePrice: 95,
        tier: 'LOW',
        volatilityModifier: 0.01,
        priceShift: -5,
        multiplier: 1.2,
        description: '',
        flavorText: 'Safe protection option.'
      },
      {
        name: 'GME Protective Collar Put',
        type: 'PUT',
        strikePrice: 90,
        tier: 'LOW',
        volatilityModifier: 0.012,
        priceShift: -6,
        multiplier: 1.3,
        description: '',
        flavorText: 'Protects equity position at low cost.'
      },
      {
        name: 'GME Gamma Sweep Put',
        type: 'PUT',
        strikePrice: 85,
        tier: 'MEDIUM',
        volatilityModifier: 0.025,
        priceShift: -12,
        multiplier: 1.5,
        description: '',
        flavorText: 'Forces high volatility downwards in retail dumps.'
      },
      {
        name: 'GME Black Swan Put',
        type: 'PUT',
        strikePrice: 55,
        tier: 'HIGH',
        volatilityModifier: 0.06,
        priceShift: -25,
        multiplier: 2.2,
        description: '',
        flavorText: 'Extreme downside tail risk option.'
      }
    ];
  }

  // Map templates to actual Cards, applying strike price randomizations
  return deckTemplates.map((template, idx) => {
    const isCall = template.type === 'CALL';
    // Randomize strike price slightly (LOW/MED: -2 to +2, HIGH: -4 to +4)
    const strikeRange = risk === 'HIGH' ? 8 : 4;
    const strikeOffset = Math.floor(Math.random() * (strikeRange + 1)) - (strikeRange / 2);
    const randomizedStrike = template.strikePrice + strikeOffset;

    // Randomize price shift slightly (-1 to +1)
    const shiftOffset = Math.floor(Math.random() * 3) - 1;
    const finalShift = isCall 
      ? Math.max(1, template.priceShift + shiftOffset)
      : Math.min(-1, template.priceShift - shiftOffset); // ensure it stays negative

    const card: Card = {
      id: `${template.type.toLowerCase()}-${template.tier.toLowerCase()}-${idx}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: template.name + ` $${randomizedStrike}`,
      type: template.type,
      strikePrice: randomizedStrike,
      tier: template.tier,
      volatilityModifier: template.volatilityModifier,
      priceShift: finalShift,
      multiplier: template.multiplier,
      description: '',
      flavorText: template.flavorText,
      leverage: 1
    };

    return updateCardDescription(card);
  });
};
