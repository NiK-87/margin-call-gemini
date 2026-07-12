import type { Dispatch } from 'react';
import type { GameState } from '../types/game';
import type { GameAction } from '../game/actions';
import type { RiskTier } from '../game/helpers';
import { Wrench, X } from 'lucide-react';

interface DebugPanelProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
  onClose: () => void;
}

const inputStyle = { width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: '#fff', padding: '4px', fontSize: '11px' } as const;

const TOGGLEABLE_UPGRADES = [
  { id: 'share-salary', name: 'Leveraged Capital ($100 salary)' },
  { id: 'share-discards', name: 'Insider Tip-off (+1 daily discard)' },
  { id: 'share-volatility', name: 'Algorithmic Stabilizer (half intraday vol)' },
  { id: 'share-commission', name: 'Broker Rebate (+5% commission)' },
  { id: 'share-float', name: 'Liquidity License (150 Float Limit)' },
  { id: 'share-overnight-insurance', name: 'Overnight Insurance (max -5% shift)' },
  { id: 'share-volatility-hedge', name: 'Volatility Hedge (half overnight shock)' },
];

export function DebugPanel({ state, dispatch, onClose }: DebugPanelProps) {
  const patch = (p: Partial<GameState>) => dispatch({ type: 'DEBUG_PATCH', patch: p });

  return (
    <div className="overlay-curtain">
      <div className="glass-panel dialog-box" style={{ borderColor: 'var(--warning-amber)', boxShadow: '0 0 30px rgba(255, 153, 0, 0.3)', width: '100%', maxWidth: '580px', padding: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginBottom: '10px' }}>
          <h3 className="text-glow-amber" style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wrench size={14} /> GME SPECIAL OPERATIONS CONTROL PANEL
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11px', maxHeight: '72vh', overflowY: 'auto', paddingRight: '4px' }}>

          {/* Toggles */}
          <div>
            <span style={{ color: 'var(--warning-amber)', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>SYSTEM CONFIGURATION:</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={state.settings.enableOvernightVol}
                  onChange={(e) => patch({ settings: { ...state.settings, enableOvernightVol: e.target.checked } })}
                />
                <span>Overnight Vol Price Shifts</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={state.settings.enableGammaSqueeze}
                  onChange={(e) => patch({ settings: { ...state.settings, enableGammaSqueeze: e.target.checked } })}
                />
                <span>Gamma Squeezes ($200 trigger)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={state.settings.enableManualExercise}
                  onChange={(e) => patch({ settings: { ...state.settings, enableManualExercise: e.target.checked } })}
                />
                <span>Manual Weekend Exercise Desk</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={state.overnightNegated}
                  onChange={(e) => patch({ overnightNegated: e.target.checked })}
                />
                <span style={{ color: 'var(--neon-green)' }}>Skip Next Overnight Price Crash</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={state.isGammaSqueezedToday}
                  onChange={(e) => patch({ isGammaSqueezedToday: e.target.checked })}
                />
                <span style={{ color: 'var(--neon-green)' }}>Force Active Gamma Squeeze Today</span>
              </label>
            </div>
          </div>

          {/* Numeric Inputs */}
          <div>
            <span style={{ color: 'var(--warning-amber)', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>MARKET & ACCOUNT METRICS:</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>GME Stock Price ($):</label>
                <input
                  type="number"
                  value={state.assetPrice}
                  onChange={(e) => dispatch({ type: 'DEBUG_SET_PRICE', price: parseFloat(e.target.value) || 10.0 })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Personal Cash ($):</label>
                <input
                  type="number"
                  value={state.personalCash}
                  onChange={(e) => patch({ personalCash: parseFloat(e.target.value) || 0.0 })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Volatility Index (0-1):</label>
                <input
                  type="number"
                  step="0.05"
                  value={state.volatility}
                  onChange={(e) => patch({ volatility: Math.max(0, Math.min(1.0, parseFloat(e.target.value) || 0.15)) })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Hedge Fund Liquidity ($):</label>
                <input
                  type="number"
                  value={state.hedgeFundLiquidity}
                  onChange={(e) => patch({ hedgeFundLiquidity: parseFloat(e.target.value) || 0.0 })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Set Corporate Rank:</label>
                <select
                  value={state.corporateRank}
                  onChange={(e) => patch({ corporateRank: e.target.value })}
                  style={inputStyle}
                >
                  <option value="Junior GME Speculator">Junior Speculator</option>
                  <option value="Senior Options Daytrader">Senior Daytrader</option>
                  <option value="Vice President of Leverage">Vice President</option>
                  <option value="Managing Director of Arbitrage">Managing Director</option>
                  <option value="Syndicate Partner (GME Whale)">Syndicate Partner</option>
                </select>
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Risk Starter Archetype:</label>
                <select
                  value={state.riskTier}
                  onChange={(e) => dispatch({ type: 'DEBUG_SET_RISK', risk: e.target.value as RiskTier })}
                  style={inputStyle}
                >
                  <option value="LOW">Low Risk (Conservative)</option>
                  <option value="MEDIUM">Medium Risk (Balanced)</option>
                  <option value="HIGH">High Risk (Degenerate)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Toggle Upgrades */}
          <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '6px' }}>
            <span style={{ color: 'var(--warning-amber)', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
              TOGGLE ACTIVE UPGRADES:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '4px' }}>
              {TOGGLEABLE_UPGRADES.map((upg) => {
                const isOwned = state.activeUpgrades.includes(upg.id);
                return (
                  <label key={upg.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '10px' }}>
                    <input
                      type="checkbox"
                      checked={isOwned}
                      onChange={(e) => dispatch({ type: 'DEBUG_TOGGLE_UPGRADE', upgradeId: upg.id, upgradeName: upg.name, enabled: e.target.checked })}
                    />
                    <span>{upg.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Card Injector Panel */}
          <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '6px' }}>
            <span style={{ color: 'var(--warning-amber)', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
              DEBUG CARD INJECTOR:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
              <button className="terminal-btn" style={{ fontSize: '8.5px', padding: '4px' }} onClick={() => dispatch({ type: 'DEBUG_INJECT_CARD', variant: 'yolo' })}>
                Inject YOLO Moonshot Call ($175)
              </button>
              <button className="terminal-btn warning" style={{ fontSize: '8.5px', padding: '4px' }} onClick={() => dispatch({ type: 'DEBUG_INJECT_CARD', variant: 'swan' })}>
                Inject GME Black Swan Put ($55)
              </button>
              <button className="terminal-btn danger" style={{ fontSize: '8.5px', padding: '4px' }} onClick={() => dispatch({ type: 'DEBUG_INJECT_CARD', variant: 'collapse' })}>
                Inject GME Collapse Put ($50)
              </button>
              <button className="terminal-btn" style={{ fontSize: '8.5px', padding: '4px' }} onClick={() => dispatch({ type: 'DEBUG_INJECT_CARD', variant: 'pump' })}>
                Inject Reddit Pump Contract
              </button>
              <button className="terminal-btn" style={{ fontSize: '8.5px', padding: '4px', border: '1px solid #ffd700', color: '#ffd700' }} onClick={() => dispatch({ type: 'DEBUG_INJECT_CARD', variant: 'giga-call' })}>
                Inject 100x Leverage Call ($180)
              </button>
              <button className="terminal-btn warning" style={{ fontSize: '8.5px', padding: '4px', border: '1px solid #ffd700', color: '#ffd700' }} onClick={() => dispatch({ type: 'DEBUG_INJECT_CARD', variant: 'giga-put' })}>
                Inject 100x Leverage Put ($50)
              </button>
            </div>
          </div>

          {/* Cheats section */}
          <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '6px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span style={{ color: 'var(--warning-amber)', display: 'block', fontWeight: 'bold' }}>QUICK CHEATS / ACTIONS:</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
              <button
                className="terminal-btn warning"
                style={{ fontSize: '9px', padding: '5px' }}
                onClick={() => {
                  dispatch({ type: 'DEBUG_CLEAR_TARGET' });
                  onClose();
                }}
              >
                Instant Clear Weekly Target
              </button>

              <button
                className="terminal-btn danger"
                style={{ fontSize: '9px', padding: '5px' }}
                onClick={() => {
                  dispatch({ type: 'DEBUG_CORNER_FLOAT' });
                  onClose();
                }}
              >
                Corner GME Float & Settle Week (Ready to Squeeze)
              </button>

              <button
                className="terminal-btn warning"
                style={{ fontSize: '9px', padding: '5px', gridColumn: 'span 2' }}
                onClick={() => {
                  dispatch({ type: 'DEBUG_FORCE_SQUEEZE_WAR' });
                  onClose();
                }}
              >
                Cheat: Force Instant Squeeze War Phase
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
