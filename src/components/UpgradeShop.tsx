import type { GameState, Card } from '../types/game';
import { UPGRADES_LIST } from '../utils/gameData';
import * as Icons from 'lucide-react';

interface UpgradeShopProps {
  state: GameState;
  buyUpgrade: (upgradeId: string) => void;
  buyCardDraft: (card: Card) => void;
  liquidateCard: (cardId: string) => void;
  startNextDay: () => void;
  startNextWeek: () => void;
  retireBroker?: () => void;
}

export const UpgradeShop: React.FC<UpgradeShopProps> = ({
  state,
  buyUpgrade,
  buyCardDraft,
  liquidateCard,
  startNextDay,
  startNextWeek,
  retireBroker,
}) => {
  // Helper to dynamically resolve Lucide Icons by name
  const renderIcon = (iconName: string, colorClass: string) => {
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className={colorClass} size={22} />;
    }
    return <Icons.HelpCircle className={colorClass} size={22} />;
  };

  const sharesUpgrades = UPGRADES_LIST.filter((u) => u.type === 'SHARE');
  const otcUpgrades = UPGRADES_LIST.filter((u) => u.type === 'OTC');


  // Get unique cards in deck for liquidation list
  const uniqueDeckCards = state.deck.filter(
    (card, index, self) => self.findIndex((c) => c.name === card.name) === index
  );

  const getCardCost = (card: Card) => {
    if (card.tier === 'LOW') return 25;
    if (card.tier === 'MEDIUM') return 50;
    return 85;
  };

  return (
    <div className="crt-flicker" style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', padding: '10px' }}>
      
      {/* Shop Header Panel */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
            W{state.currentWeek} D{state.currentDay} | LIQUIDATION & DRAFT CONSOLE
          </span>
          <h2 className="text-glow-green" style={{ fontSize: '20px' }}>PORTFOLIO UPGRADE & CONTRACTS DESK</h2>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>CURRENT PERSONAL FUNDS</span>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--warning-amber)' }}>
              ${state.personalCash.toFixed(2)}
            </div>
          </div>
          {state.currentWeek >= 2 && state.personalCash >= 1500 && retireBroker && (
            <button
              className="terminal-btn"
              onClick={retireBroker}
              style={{ 
                background: 'linear-gradient(135deg, #ffd700 0%, #ffa500 100%)', 
                color: '#000', 
                fontWeight: 'bold', 
                border: '1px solid #ffd700',
                paddingLeft: '24px', 
                paddingRight: '24px',
                textShadow: 'none',
                boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)'
              }}
            >
              RETIRE TO BAHAMAS 🌴
            </button>
          )}
          {state.currentDay < 5 ? (
            <button
              className="terminal-btn"
              onClick={startNextDay}
              style={{ paddingLeft: '32px', paddingRight: '32px' }}
            >
              START DAY {state.currentDay + 1}
            </button>
          ) : (
            <button
              className="terminal-btn danger"
              onClick={startNextWeek} // In App.tsx we will route this to enter weekly settle
              style={{ paddingLeft: '32px', paddingRight: '32px' }}
            >
              WEEKLY AUDIT SETTLEMENT
            </button>
          )}
        </div>
      </div>

      {/* CARD DRAFT CONSOLE (NEW) */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ borderBottom: '1px solid rgba(0, 255, 102, 0.2)', paddingBottom: '6px' }}>
          <h3 className="text-glow-green" style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icons.Layers size={15} /> ACTIVE OPTION CONTRACT DRAFT
          </h3>
          <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
            Acquire new high-leverage option contracts to add to your deck.
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
          {state.shopCards.map((card, idx) => {
            const cost = getCardCost(card);
            const canAfford = state.personalCash >= cost;
            const existingCard = state.deck.find((c) => c.name === card.name);
            const isUpgrade = !!existingCard;

            return (
              <div 
                key={card.id || idx} 
                className={`card-option type-${card.type.toLowerCase()} tier-${card.tier.toLowerCase()}`}
                style={{ 
                  transform: 'none', 
                  minHeight: '190px', 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '12px',
                  boxShadow: 'none'
                }}
              >
                <div>
                  <div className="card-header-row" style={{ marginBottom: '6px' }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <span className={`card-tier-badge ${card.tier}`}>{card.tier}</span>
                      {isUpgrade && (
                        <span 
                          style={{ 
                            fontSize: '8.5px', 
                            padding: '1px 5px', 
                            background: 'var(--warning-amber)', 
                            color: 'var(--bg-terminal)', 
                            borderRadius: '3px',
                            fontWeight: 'bold'
                          }}
                        >
                          x{existingCard.leverage || 1} &rarr; x{(existingCard.leverage || 1) * 10} LEV
                        </span>
                      )}
                    </div>
                    <span className="card-type-label">
                      {card.type === 'CALL' ? 'CALL' : 'PUT'}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {card.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--warning-amber)', marginBottom: '4px' }}>
                    Strike: ${card.strikePrice}
                  </div>
                  <p style={{ fontSize: '9.5px', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                    {card.description}
                  </p>
                </div>

                <div style={{ borderTop: '1px dashed rgba(255,255,255,0.06)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--warning-amber)', fontWeight: 'bold' }}>
                    ${cost} cash
                  </span>
                  <button 
                    className="terminal-btn" 
                    style={{ fontSize: '9.5px', padding: '4px 10px' }}
                    disabled={!canAfford}
                    onClick={() => buyCardDraft(card)}
                  >
                    {isUpgrade ? `UPGRADE (x${(existingCard.leverage || 1) * 10})` : 'DRAFT CONTRACT'}
                  </button>
                </div>
              </div>
            );
          })}
          {state.shopCards.length === 0 && (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '12px' }}>
              ALL OPTION CONTRACTS DRAFTED FOR TODAY.
            </div>
          )}
        </div>
      </div>

      {/* Main Upgrades and Liquidation split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
        
        {/* UPGRADES COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* SHARES PANEL */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ borderBottom: '1px solid rgba(0, 255, 102, 0.2)', paddingBottom: '6px' }}>
              <h3 className="text-glow-green" style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icons.TrendingUp size={15} /> CORPORATE SHARES (PERMANENT BUFFS)
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {sharesUpgrades.map((upgrade) => {
                const isOwned = state.activeUpgrades.includes(upgrade.id);
                const canAfford = state.personalCash >= upgrade.cost;
                return (
                  <div key={upgrade.id} className="glass-panel upgrade-card" style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: isOwned ? '1px solid rgba(0,255,102,0.3)' : '1px solid rgba(255,255,255,0.04)', background: isOwned ? 'rgba(0,255,102,0.02)' : 'var(--bg-panel)' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ padding: '6px', background: 'rgba(0,255,102,0.06)', borderRadius: '4px' }}>
                        {renderIcon(upgrade.icon, 'text-glow-green')}
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{upgrade.name}</div>
                        <div style={{ fontSize: '9.5px', color: 'var(--text-secondary)' }}>{upgrade.description}</div>
                      </div>
                    </div>
                    <div>
                      {isOwned ? (
                        <span style={{ fontSize: '8px', padding: '2px 8px', border: '1px solid var(--neon-green)', color: 'var(--neon-green)', borderRadius: '4px', textShadow: '0 0 4px var(--neon-green-glow)' }}>OWNED</span>
                      ) : (
                        <button className="terminal-btn" style={{ fontSize: '10px', padding: '4px 12px' }} disabled={!canAfford} onClick={() => buyUpgrade(upgrade.id)}>
                          BUY FOR ${upgrade.cost}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* OTC PANEL */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ borderBottom: '1px solid rgba(255, 153, 0, 0.2)', paddingBottom: '6px' }}>
              <h3 className="text-glow-amber" style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icons.Activity size={15} /> OVER-THE-COUNTER DERIVATIVE CONTRACTS
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {otcUpgrades.map((upgrade) => {
                const totalInstances = state.otcInventory.filter(id => id === upgrade.id).length;
                const canAfford = state.personalCash >= upgrade.cost;
                return (
                  <div key={upgrade.id} className="glass-panel upgrade-card" style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.04)', background: 'var(--bg-panel)' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                        {renderIcon(upgrade.icon, 'text-glow-amber')}
                        <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{upgrade.name}</span>
                      </div>
                      <p style={{ fontSize: '9px', color: 'var(--text-secondary)', minHeight: '36px', lineHeight: '1.3' }}>
                        {upgrade.description}
                      </p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '6px', marginTop: '6px' }}>
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                        {totalInstances > 0 ? `OWNED: ${totalInstances}` : 'EMPTY'}
                      </span>
                      <button className="terminal-btn warning" style={{ fontSize: '9px', padding: '4px 10px' }} disabled={!canAfford} onClick={() => buyUpgrade(upgrade.id)}>
                        BUY (${upgrade.cost})
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* LIQUIDATION PANEL (NEW) */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ borderBottom: '1px solid rgba(255, 59, 48, 0.2)', paddingBottom: '6px' }}>
            <h3 className="text-glow-red" style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icons.ShieldAlert size={15} /> OPTION LIQUIDATION DESK
            </h3>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
              Sell and close out bad contracts permanently. Flat fee: **$20.00 cash** per liquidation.
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '420px', paddingRight: '4px' }}>
            {uniqueDeckCards.map((card) => {
              const count = state.deck.filter((c) => c.name === card.name).length;
              const canLiquidate = state.personalCash >= 20 && state.deck.length > 5; // Keep min 5 cards in deck
              return (
                <div 
                  key={card.id} 
                  className="glass-panel" 
                  style={{ 
                    padding: '8px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    border: '1px solid rgba(255,59,48,0.15)',
                    background: 'rgba(255,59,48,0.01)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: card.type === 'CALL' ? 'var(--neon-green)' : 'var(--crash-red)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span>{card.name}</span>
                      {card.leverage && card.leverage > 1 && (
                        <span style={{ fontSize: '8px', padding: '1px 4px', background: 'var(--warning-amber)', color: 'var(--bg-terminal)', borderRadius: '3px', fontWeight: 'bold' }}>
                          x{card.leverage} LEV
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>
                      Strike: ${card.strikePrice} | Qty in Deck: {count}
                    </div>
                  </div>
                  <button
                    className="terminal-btn danger"
                    style={{ fontSize: '9px', padding: '4px 8px' }}
                    disabled={!canLiquidate}
                    onClick={() => liquidateCard(card.id)}
                  >
                    SELL (-$20)
                  </button>
                </div>
              );
            })}
            {state.deck.length <= 5 && (
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '10px' }}>
                MINIMUM DECK SIZE (5 CARDS) REACHED. CANNOT LIQUIDATE FURTHER.
              </span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
