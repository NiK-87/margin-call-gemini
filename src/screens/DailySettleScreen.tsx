import type { GameState } from '../types/game';
import { getDailySettleMetrics } from '../game/selectors';
import { ArrowRight } from 'lucide-react';

interface DailySettleScreenProps {
  state: GameState;
  onProceedToShop: () => void;
}

export function DailySettleScreen({ state, onProceedToShop }: DailySettleScreenProps) {
  const { settleCallsSum, settlePutsSum, settleDailyYield, settleEarnings } = getDailySettleMetrics(state);

  return (
    <div className="title-screen crt-flicker" style={{ minHeight: '82vh' }}>
      <div className="title-logo-box" style={{ maxWidth: '580px', borderColor: 'var(--neon-green)', boxShadow: '0 0 25px rgba(0,255,102,0.15)', padding: '20px' }}>
        <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>DAY {state.currentDay - 1} SETTLEMENT LEDGER</span>
        <h2 className="text-glow-green" style={{ fontSize: '20px', margin: '4px 0 12px 0' }}>DAILY AUDIT RECONCILIATION</h2>

        <div style={{ textAlign: 'left', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.06)', paddingBottom: '4px' }}>
            <span>GME Closing Price:</span>
            <span style={{ fontWeight: 'bold' }}>${state.assetPrice.toFixed(2)}</span>
          </div>

          <div style={{ margin: '6px 0' }}>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>PORTFOLIO EXERCISE:</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px', maxHeight: '110px', overflowY: 'auto' }}>
              {state.hand.map((card, index) => {
                const isCall = card.type === 'CALL';
                const payout = isCall
                  ? (state.assetPrice > card.strikePrice ? (state.assetPrice - card.strikePrice) * (card.leverage || 1) : 0)
                  : (card.strikePrice > state.assetPrice ? (card.strikePrice - state.assetPrice) * (card.multiplier || 1) * (card.leverage || 1) : 0);
                return (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', padding: '2px 4px', background: 'rgba(255,255,255,0.02)' }}>
                    <span>{card.name} {card.leverage && card.leverage > 1 ? `(x${card.leverage})` : ''}</span>
                    <span style={{ color: payout > 0 ? 'var(--neon-green)' : 'var(--text-muted)' }}>
                      {payout > 0 ? `+$${payout.toFixed(2)}` : 'OTM ($0.00)'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Call Option Sum:</span>
              <span>+${settleCallsSum.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Put Option Sum:</span>
              <span>+${settlePutsSum.toFixed(2)}</span>
            </div>
            {state.isGammaSqueezedToday && (
              <div style={{ color: 'var(--neon-green)', fontSize: '9.5px', fontWeight: 'bold' }}>
                &gt;&gt;&gt; GAMMA SQUEEZE DETECTED: Call yields doubled!
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--neon-green)', fontWeight: 'bold', fontSize: '11.5px' }}>
              <span>Daily Payout Yield (Calls + Puts):</span>
              <span>${settleDailyYield.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>90% Firm Ledger Allocation:</span>
              <span>+${(settleDailyYield * 0.90).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--warning-amber)' }}>
              <span>Daily salary & progressive commission:</span>
              <span>+${settleEarnings.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <button className="terminal-btn" onClick={onProceedToShop} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        PROCEED TO PORTFOLIO SHOP <ArrowRight size={14} />
      </button>
    </div>
  );
}
