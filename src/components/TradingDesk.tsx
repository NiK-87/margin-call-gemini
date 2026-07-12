import React, { useState, useEffect, useRef } from 'react';
import type { GameState, Card } from '../types/game';
import { StockChart } from './StockChart';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  AlertTriangle, 
  ShieldAlert, 
  Terminal, 
  User, 
  Percent, 
  Layers,
  Zap,
  Flame,
  EyeOff,
  ShieldCheck
} from 'lucide-react';

interface TradingDeskProps {
  state: GameState;
  discardCard: (cardId: string) => void;
  redrawDiscards: () => void;
  endDay: () => void;
  activateOtcConsumable: (otcId: string) => void;
}

export const TradingDesk: React.FC<TradingDeskProps> = ({
  state,
  discardCard,
  redrawDiscards,
  endDay,
  activateOtcConsumable,
}) => {
  const [discardingIds, setDiscardingIds] = useState<Set<string>>(new Set());
  const [isDragOverZone, setIsDragOverZone] = useState<boolean>(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the terminal logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.tradeLog]);

  // Calculate potential yield for a single card in real time
  const getCardYield = (card: Card, assetPrice: number): number => {
    if (card.type === 'CALL') {
      const payout = assetPrice > card.strikePrice ? assetPrice - card.strikePrice : 0;
      return payout * (card.leverage || 1);
    } else {
      const payout = card.strikePrice > assetPrice ? card.strikePrice - assetPrice : 0;
      return payout * (card.multiplier || 1) * (card.leverage || 1);
    }
  };

  // Calculate estimated daily hand yield (Sum of Calls + Sum of Puts)
  const callsSum = state.hand.reduce((acc, card) => {
    if (card.type === 'CALL') {
      const payout = state.assetPrice > card.strikePrice ? state.assetPrice - card.strikePrice : 0;
      return acc + (payout * (card.leverage || 1));
    }
    return acc;
  }, 0);

  const putsSum = state.hand.reduce((acc, card) => {
    if (card.type === 'PUT') {
      const payout = card.strikePrice > state.assetPrice ? card.strikePrice - state.assetPrice : 0;
      return acc + (payout * (card.multiplier || 1) * (card.leverage || 1));
    }
    return acc;
  }, 0);

  const estimatedYield = callsSum + putsSum;

  // Calculate salary and commission preview
  const salary = state.activeUpgrades.includes('share-salary') ? 100.0 : 50.0;
  const commissionRate = state.activeUpgrades.includes('share-commission') ? 0.15 : 0.10;
  const commission = Math.max(0, estimatedYield * commissionRate);
  const estimatedEarnings = salary + commission;

  const handleDiscardCard = (cardId: string) => {
    if (discardingIds.has(cardId)) return;
    setDiscardingIds((prev) => {
      const next = new Set(prev);
      next.add(cardId);
      return next;
    });

    setTimeout(() => {
      discardCard(cardId);
      setDiscardingIds((prev) => {
        const next = new Set(prev);
        next.delete(cardId);
        return next;
      });
    }, 400); // Matches card-discard-animate duration
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('text/plain', cardId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverZone = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOverZone(true);
  };

  const handleDragLeaveZone = () => {
    setIsDragOverZone(false);
  };

  const handleDropZone = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverZone(false);
    const cardId = e.dataTransfer.getData('text/plain');
    if (cardId) {
      handleDiscardCard(cardId);
    }
  };

  const isMarginCalled = state.optionsOutstanding > state.maxFloatCapacity;
  const targetProgress = Math.min(100, (state.marginLedger / state.weekTarget) * 100);

  return (
    <div className="trading-desk-layout">
      {/* LEFT COLUMN: Chart, Controls, Logs, Hand */}
      <div className="main-desk-section">
        {/* Daily Stock Chart */}
        <StockChart
          priceHistory={state.priceHistory}
          hand={state.hand}
          assetPrice={state.assetPrice}
          volatility={state.volatility}
        />

        {/* DRAG DISCARD ZONE (NEW) */}
        <div 
          className={`glass-panel discard-drag-zone ${isDragOverZone ? 'dragover' : ''}`}
          onDragOver={handleDragOverZone}
          onDragLeave={handleDragLeaveZone}
          onDrop={handleDropZone}
          style={{
            border: isDragOverZone ? '2px dashed var(--neon-green)' : '2px dashed rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            padding: '16px',
            textAlign: 'center',
            background: isDragOverZone ? 'rgba(0, 255, 102, 0.05)' : 'rgba(0, 0, 0, 0.15)',
            color: isDragOverZone ? 'var(--neon-green)' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: isDragOverZone ? '0 0 15px rgba(0, 255, 102, 0.2)' : 'none',
            fontSize: '11px',
            fontWeight: 'bold',
            letterSpacing: '1px'
          }}
        >
          <RefreshCw className={isDragOverZone ? 'spin' : ''} size={20} />
          <span>DRAG OPTIONS HERE TO DISCARD & MANIPULATE MARKET</span>
          <span style={{ fontSize: '8px', color: 'var(--text-muted)', fontWeight: 'normal' }}>
            CALLS SHIFT PRICE UP | PUTS SHIFT PRICE DOWN
          </span>
        </div>

        {/* Hand of Cards */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--neon-green)', fontWeight: 'bold' }}>ACTIVE PORTFOLIO HAND</span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              HAND SIZE: {state.hand.length} / 5 | DECK: {state.deck.length} | DISCARDED: {state.discardPile.length}
            </span>
          </div>

          <div className="hand-container">
            {state.hand.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '40px', color: 'var(--text-muted)' }}>
                <Layers size={36} />
                <span>NO OPTIONS OUTSTANDING. REDRAW OR CONCLUDE TRADING DAY.</span>
              </div>
            ) : (
              state.hand.map((card) => {
                const isDiscarding = discardingIds.has(card.id);
                const isCall = card.type === 'CALL';
                const potentialYield = getCardYield(card, state.assetPrice);
                const isITM = isCall ? (state.assetPrice > card.strikePrice) : (state.assetPrice < card.strikePrice);
                
                let cardStateClass = '';
                if (isDiscarding) cardStateClass = 'card-discard-animate';
                else cardStateClass = 'card-draw-animate';

                return (
                  <div
                    key={card.id}
                    className={`card-option type-${card.type.toLowerCase()} tier-${card.tier.toLowerCase()} ${cardStateClass}`}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, card.id)}
                    style={{ cursor: 'grab' }}
                  >
                    {/* Header: Tier and Type Icon */}
                    <div className="card-header-row">
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span className={`card-tier-badge ${card.tier}`}>{card.tier}</span>
                        {card.leverage && card.leverage > 1 && (
                          <span 
                            style={{ 
                              fontSize: '8.5px', 
                              padding: '1px 5px', 
                              background: 'var(--warning-amber)', 
                              color: 'var(--bg-terminal)', 
                              borderRadius: '3px',
                              fontWeight: 'bold',
                              textShadow: 'none'
                            }}
                          >
                            x{card.leverage} LEV
                          </span>
                        )}
                      </div>
                      <span className="card-type-label">
                        {isCall ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                            <TrendingUp size={10} /> CALL
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                            <TrendingDown size={10} /> PUT
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Strike Price display */}
                    <div className="card-strike-container">
                      <span className="card-strike-price">${card.strikePrice}</span>
                      <span className="card-strike-label">STRIKE PRICE</span>
                    </div>

                    {/* In the money / Out of the money live tag */}
                    <div style={{ textAlign: 'center', margin: '2px 0' }}>
                      <span 
                        style={{
                          fontSize: '8px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          background: isITM ? (isCall ? 'rgba(0,255,102,0.15)' : 'rgba(255,153,0,0.15)') : 'rgba(255,255,255,0.05)',
                          color: isITM ? (isCall ? 'var(--neon-green)' : 'var(--warning-amber)') : 'var(--text-muted)',
                          border: `1px solid ${isITM ? (isCall ? 'var(--neon-green)' : 'var(--warning-amber)') : 'transparent'}`,
                        }}
                      >
                        {isITM ? `IN-THE-MONEY (+$${potentialYield.toFixed(2)})` : 'OUT-OF-THE-MONEY ($0.00)'}
                      </span>
                    </div>

                    {/* Description Text */}
                    <div className="card-desc-text" style={{ fontSize: '9px', lineHeight: '1.3', minHeight: '36px' }}>
                      <p style={{ margin: '0 0 4px 0' }}>{card.description}</p>
                      {card.leverage && card.leverage > 1 && (
                        <span style={{ color: 'var(--warning-amber)', fontWeight: 'bold' }}>
                          Contract Leverage Boost: x{card.leverage} payout
                        </span>
                      )}
                    </div>

                    {/* Bottom Stat row */}
                    <div className="card-stats-block">
                      <div className="card-stat-line">
                        <span>VOLATILITY</span>
                        <span style={{ color: 'var(--warning-amber)' }}>
                          +{(card.volatilityModifier * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="card-stat-line">
                        <span>DISCARD IMPACT</span>
                        <span style={{ color: card.priceShift > 0 ? 'var(--neon-green)' : 'var(--crash-red)' }}>
                          {card.priceShift > 0 ? '+$' : '-$'}{Math.abs(card.priceShift)}
                        </span>
                      </div>
                    </div>

                    {/* Card Actions overlay buttons */}
                    <div className="card-actions-overlay" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="card-btn discard-btn"
                        style={{ width: '100%' }}
                        onClick={() => handleDiscardCard(card.id)}
                      >
                        DISCARD CONTRACT
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Console / Controls Panel */}
        <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="terminal-btn warning"
              onClick={redrawDiscards}
              disabled={state.discardsLeft <= 0 || state.hand.length === 0}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <RefreshCw size={14} /> REDRAW DISCARDS ({state.discardsLeft} LEFT)
            </button>
          </div>

          <div>
            <button
              className="terminal-btn"
              onClick={endDay}
              style={{ paddingLeft: '40px', paddingRight: '40px' }}
            >
              CONCLUDE TRADING DAY
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Sidebar Stats & Terminal Log */}
      <div className="sidebar-desk-section">
        {/* Week/Target Tracker */}
        <div className={`glass-panel ${isMarginCalled ? 'margin-alert-strobe' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px' }}>
            {isMarginCalled ? (
              <ShieldAlert className="text-glow-red" size={18} />
            ) : (
              <Percent className="text-glow-green" size={18} />
            )}
            <span style={{ fontWeight: 'bold', fontSize: '13px', color: isMarginCalled ? 'var(--crash-red)' : 'var(--neon-green)' }}>
              {isMarginCalled ? 'MARGIN CALL ALERT' : 'MARGIN LEDGER TARGET'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="stat-item">
              <span className="stat-label">WEEKLY LEDGER GOAL</span>
              <span className="stat-value text-glow-green">${state.weekTarget.toFixed(2)}</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">CURRENT LEDGER ACCUMULATED</span>
              <span className="stat-value">${state.marginLedger.toFixed(2)}</span>
            </div>

            {/* Target Progress Bar */}
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                <span>PROGRESS</span>
                <span>{targetProgress.toFixed(1)}%</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div 
                  style={{ 
                    width: `${targetProgress}%`, 
                    height: '100%', 
                    backgroundColor: targetProgress >= 100 ? 'var(--neon-green)' : 'var(--warning-amber)',
                    boxShadow: targetProgress >= 100 ? '0 0 10px var(--neon-green)' : 'none',
                    transition: 'width 0.4s ease-out'
                  }} 
                />
              </div>
            </div>

            {/* Options outstanding float gauge */}
            <div style={{ marginTop: '12px', borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '12px' }}>
              <div className="stat-item">
                <span className="stat-label">DECK SPECWATER LIMIT</span>
                <span className={`stat-value ${isMarginCalled ? 'text-glow-red' : ''}`}>
                  {state.optionsOutstanding} / {state.maxFloatCapacity}
                </span>
              </div>
              
              {isMarginCalled && (
                <div style={{ color: 'var(--crash-red)', fontSize: '9px', marginTop: '6px', lineHeight: '1.4', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                  <AlertTriangle size={12} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    WARNING: Speculative deck float capacity exceeded! Short squeeze cascade is imminent!
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Balance Statistics */}
        <div className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px' }}>
            <User className="text-glow-green" size={18} />
            <span style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--neon-green)' }}>BROKER ACCOUNT</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="stat-item">
              <span className="stat-label">PERSONAL LIQUID CASH</span>
              <span className="stat-value text-glow-amber">${state.personalCash.toFixed(2)}</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">CALL OPTION YIELD</span>
              <span className="stat-value text-glow-green">+${callsSum.toFixed(2)}</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">PUT OPTION YIELD</span>
              <span className="stat-value text-glow-green">+${putsSum.toFixed(2)}</span>
            </div>

            <div className="stat-item" style={{ borderTop: '1px dashed rgba(255,255,255,0.08)', paddingTop: '6px' }}>
              <span className="stat-label" style={{ fontWeight: 'bold' }}>POTENTIAL DAY YIELD</span>
              <span className="stat-value text-glow-green" style={{ fontWeight: 'bold' }}>
                +${estimatedYield.toFixed(2)}
              </span>
            </div>

            <div className="stat-item">
              <span className="stat-label">ESTIMATED DAY EARNINGS</span>
              <span className="stat-value text-glow-green">${estimatedEarnings.toFixed(2)}</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">WEEK / DAY</span>
              <span className="stat-value">Week {state.currentWeek} | Day {state.currentDay} / 5</span>
            </div>
          </div>
        </div>

        {/* OTC Tactical Desk */}
        <div className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px' }}>
            <Layers className="text-glow-amber" size={18} style={{ color: 'var(--warning-amber)' }} />
            <span style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--warning-amber)' }}>OTC TACTICAL DESK</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              {
                id: 'otc-pump',
                name: 'Reddit Pump Contract',
                desc: '+15% GME Price',
                icon: <Zap size={14} className="text-glow-green" style={{ color: 'var(--neon-green)' }} />,
                badgeColor: 'var(--neon-green)',
              },
              {
                id: 'otc-dump',
                name: 'Short Raid Contract',
                desc: '-15% GME Price',
                icon: <Flame size={14} className="text-glow-red" style={{ color: 'var(--crash-red)' }} />,
                badgeColor: 'var(--crash-red)',
              },
              {
                id: 'otc-darkpool',
                name: 'Dark Pool Contract',
                desc: 'Next Discard has 0 shift',
                icon: <EyeOff size={14} style={{ color: '#00ccff' }} />,
                badgeColor: '#00ccff',
              },
              {
                id: 'otc-hedge',
                name: 'Synthetic Put Protection',
                desc: '$100.00 daily yield floor',
                icon: <ShieldCheck size={14} style={{ color: '#e0c068' }} />,
                badgeColor: '#e0c068',
              }
            ].map((item) => {
              const qty = state.otcInventory.filter(id => id === item.id).length;
              const isActive = qty > 0;
              // Check if it's already active for today (for darkpool and hedge)
              const isDarkPoolActive = item.id === 'otc-darkpool' && state.activeUpgrades.includes('otc-darkpool-active');
              const isHedgeActive = item.id === 'otc-hedge' && state.activeUpgrades.includes('otc-hedge-active');
              const isCurrentlyActiveModifier = isDarkPoolActive || isHedgeActive;

              return (
                <div 
                  key={item.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '8px',
                    borderRadius: '4px',
                    background: isActive ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.1)',
                    border: isCurrentlyActiveModifier ? '1px solid var(--warning-amber)' : '1px solid rgba(255,255,255,0.03)',
                    opacity: isActive ? 1 : 0.6,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {item.icon}
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        {item.name}
                      </span>
                    </div>
                    <span 
                      style={{ 
                        fontSize: '9px', 
                        padding: '1px 5px', 
                        background: isActive ? 'var(--warning-amber)' : 'rgba(255,255,255,0.05)', 
                        color: isActive ? '#000' : 'var(--text-muted)', 
                        borderRadius: '3px',
                        fontWeight: 'bold'
                      }}
                    >
                      QTY: {qty}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '8.5px', color: 'var(--text-muted)' }}>
                      {item.desc}
                    </span>
                    <button
                      className={`card-btn ${isActive && !isCurrentlyActiveModifier ? 'warning' : ''}`}
                      disabled={!isActive || isCurrentlyActiveModifier}
                      style={{ 
                        fontSize: '8px', 
                        padding: '2px 8px', 
                        background: isCurrentlyActiveModifier ? 'rgba(255,153,0,0.15)' : (isActive ? 'var(--warning-amber)' : 'rgba(255,255,255,0.05)'),
                        color: isCurrentlyActiveModifier ? 'var(--warning-amber)' : (isActive ? '#000' : 'var(--text-muted)'),
                        cursor: isActive && !isCurrentlyActiveModifier ? 'pointer' : 'default',
                        border: isCurrentlyActiveModifier ? '1px solid var(--warning-amber)' : 'none'
                      }}
                      onClick={() => activateOtcConsumable(item.id)}
                    >
                      {isCurrentlyActiveModifier ? 'ACTIVE' : 'ACTIVATE'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Terminal Logs log */}
        <div className="glass-panel terminal-log-container">
          <div className="terminal-log-header">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Terminal size={12} /> SECURE FEED LOG
            </span>
            <span className="live-indicator" />
          </div>
          <div className="terminal-log-lines">
            {state.tradeLog.map((log, index) => {
              let logClass = 'system';
              if (log.includes('concluded') || log.includes('Yield') || log.includes('commission') || log.includes('Commission')) logClass = 'info';
              else if (log.includes('Discarded') || log.includes('added') || log.includes('Purchased')) logClass = 'warning';
              else if (log.includes('WARNING') || log.includes('SQUEEZE') || log.includes('MARGIN') || log.includes('Failure')) logClass = 'danger';

              return (
                <div key={index} className={`terminal-log-line ${logClass}`}>
                  &gt; {log}
                </div>
              );
            })}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};
