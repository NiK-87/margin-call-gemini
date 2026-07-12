import type { GameState } from '../types/game';
import type { WeeklyCardAction } from '../game/actions';
import { getWeeklySettleMetrics } from '../game/selectors';
import useSound from 'use-sound';
import cashSfx from '../assets/audio/cash.mp3';
import discardSfx from '../assets/audio/discard.mp3';

interface WeeklySettleScreenProps {
  state: GameState;
  onSetWeeklyCardAction: (cardId: string, action: WeeklyCardAction) => void;
  onSettleWeeklyAudit: () => void;
  onInitiateShortSqueeze: () => void;
}

export function WeeklySettleScreen({ state, onSetWeeklyCardAction, onSettleWeeklyAudit, onInitiateShortSqueeze }: WeeklySettleScreenProps) {
  const { weeklyExerciseYield, projectedTotalLedger } = getWeeklySettleMetrics(state);
  const [playCash] = useSound(cashSfx, { volume: 0.5 });
  const [playDiscard] = useSound(discardSfx, { volume: 0.4 });

  return (
    <div className="title-screen crt-flicker" style={{ minHeight: '82vh', padding: '10px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '15px', width: '100%', maxWidth: '1000px' }}>

        {/* Left Column: Deck Exercising Board */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', maxHeight: '520px' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
            <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>WEEK {state.currentWeek} FINAL AUDIT</span>
            <h3 className="text-glow-red" style={{ fontSize: '16px' }}>WEEK-END OPTIONS EXERCISE CONSOLE</h3>
            <p style={{ fontSize: '8.5px', color: 'var(--text-muted)', margin: 0 }}>
              Select action for each contract. Rollovers cost **$15.00 cash** each. Unexercised/unrolled contracts expire worthless ($0 fee).
            </p>
          </div>

          <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '4px' }}>
            {state.deck.map((card) => {
              const isCall = card.type === 'CALL';
              const payout = isCall
                ? (state.assetPrice > card.strikePrice ? (state.assetPrice - card.strikePrice) * (card.leverage || 1) : 0)
                : (card.strikePrice > state.assetPrice ? (card.strikePrice - state.assetPrice) * (card.multiplier || 1) * (card.leverage || 1) : 0);

              const isExercised = state.exercisedCardIds.includes(card.id);
              const isRolled = state.rolledOverCardIds.includes(card.id);
              const isAbandoned = !isExercised && !isRolled;

              return (
                <div
                  key={card.id}
                  className="glass-panel"
                  style={{
                    padding: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: isExercised ? '1px solid var(--neon-green)' : isRolled ? '1px solid var(--warning-amber)' : '1px solid rgba(255,255,255,0.05)',
                    background: isExercised ? 'rgba(0,255,102,0.02)' : isRolled ? 'rgba(255,153,0,0.02)' : 'rgba(0,0,0,0.2)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: card.type === 'CALL' ? 'var(--neon-green)' : 'var(--crash-red)' }}>
                      {card.name} {card.leverage && card.leverage > 1 ? `(x${card.leverage} LEV)` : ''}
                    </div>
                    <div style={{ fontSize: '9px', color: payout > 0 ? 'var(--neon-green)' : 'var(--text-muted)' }}>
                      Exercise Yield: {payout > 0 ? `+$${payout.toFixed(2)}` : 'OTM ($0.00)'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      className={`card-btn ${isExercised ? 'warning' : ''}`}
                      style={{ fontSize: '8px', padding: '3px 6px', background: isExercised ? 'var(--neon-green)' : 'rgba(0,0,0,0.4)', color: isExercised ? '#000' : 'var(--text-primary)' }}
                      onClick={() => { playCash(); onSetWeeklyCardAction(card.id, 'EXERCISE'); }}
                    >
                      EXERCISE
                    </button>
                    <button
                      className={`card-btn ${isRolled ? 'warning' : ''}`}
                      style={{ fontSize: '8px', padding: '3px 6px', background: isRolled ? 'var(--warning-amber)' : 'rgba(0,0,0,0.4)', color: isRolled ? '#000' : 'var(--text-primary)' }}
                      onClick={() => { playCash(); onSetWeeklyCardAction(card.id, 'ROLLOVER'); }}
                    >
                      ROLL ($15)
                    </button>
                    <button
                      className="card-btn"
                      style={{ fontSize: '8px', padding: '3px 6px', background: isAbandoned ? 'var(--crash-red)' : 'rgba(0,0,0,0.4)', color: isAbandoned ? '#000' : 'var(--text-primary)' }}
                      onClick={() => { playDiscard(); onSetWeeklyCardAction(card.id, 'ABANDON'); }}
                    >
                      ABANDON
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Solvency Audit Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div className="glass-panel" style={{ borderColor: 'var(--crash-red)', boxShadow: '0 0 25px rgba(255,59,48,0.1)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>AUDITOR LEDGER SUMMARY</span>
            <h3 className="text-glow-red" style={{ fontSize: '15px', margin: '4px 0 10px 0' }}>RECONCILIATION LEDGER</h3>

            <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Closing price locked:</span>
                <span style={{ fontWeight: 'bold' }}>${state.assetPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Rollover Fees Due:</span>
                <span style={{ color: 'var(--warning-amber)' }}>-${(state.rolledOverCardIds.length * 15).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Gained Audit Yield:</span>
                <span style={{ color: 'var(--neon-green)' }}>+${weeklyExerciseYield.toFixed(2)}</span>
              </div>

              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Weekly ledger accrued:</span>
                  <span>${state.marginLedger.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: projectedTotalLedger >= state.weekTarget ? 'var(--neon-green)' : 'var(--crash-red)', fontWeight: 'bold' }}>
                  <span>Projected Total Ledger:</span>
                  <span>${projectedTotalLedger.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--warning-amber)' }}>
                  <span>Required Target:</span>
                  <span>${state.weekTarget.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {state.personalCash < state.rolledOverCardIds.length * 15 ? (
                <span style={{ fontSize: '9px', color: 'var(--crash-red)', fontWeight: 'bold', display: 'block', textAlign: 'center' }}>
                  INSUFFICIENT PERSONAL FUNDS TO PAY ROLLOVER FEES!
                </span>
              ) : (
                <button
                  className="terminal-btn danger"
                  style={{ width: '100%', fontSize: '11px', padding: '10px' }}
                  onClick={onSettleWeeklyAudit}
                >
                  COMPLETE AUDIT & CONCLUDE WEEK
                </button>
              )}
            </div>
          </div>

          {/* Short Squeeze Trigger Block */}
          <div className="glass-panel" style={{ borderColor: state.optionsOutstanding >= state.maxFloatCapacity * 0.65 ? 'var(--neon-green)' : 'var(--text-muted)', background: state.optionsOutstanding >= state.maxFloatCapacity * 0.65 ? 'rgba(0,255,102,0.02)' : 'rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '12px', margin: 0, color: state.optionsOutstanding >= state.maxFloatCapacity * 0.65 ? 'var(--neon-green)' : 'var(--text-muted)' }}>
              SHORT SQUEEZE CORNER (BOSS PHASE)
            </h3>
            <p style={{ fontSize: '9px', color: 'var(--text-secondary)', margin: '4px 0 10px 0', lineHeight: '1.3' }}>
              Requires deck speculative load &gt; 65% of float capacity.<br />
              Current: **{state.optionsOutstanding} / {state.maxFloatCapacity}** ({(state.optionsOutstanding / state.maxFloatCapacity * 100).toFixed(0)}%)
            </p>

            <button
              className="terminal-btn"
              style={{ width: '100%', fontSize: '11px', padding: '8px' }}
              disabled={state.optionsOutstanding < state.maxFloatCapacity * 0.65}
              onClick={onInitiateShortSqueeze}
            >
              INITIATE GME SHORT SQUEEZE
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
