import type { GameState } from '../types/game';
import { Wrench } from 'lucide-react';

interface AppHeaderProps {
  state: GameState;
  onOpenDebug: () => void;
}

export function AppHeader({ state, onOpenDebug }: AppHeaderProps) {
  return (
    <header className="crt-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', background: 'rgba(10, 12, 16, 0.95)', borderBottom: '2px solid var(--neon-green)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div className="pulse-dot" />
        <span className="terminal-title">O.C.T. GME SPEC-OPS TERMINAL v1.20</span>
      </div>
      {state.screen !== 'TITLE' && state.screen !== 'OFFICE_INTRO' && (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div className="header-stat">
            <span className="header-stat-label">CASH</span>
            <span className="header-stat-value text-glow-amber">${state.personalCash.toFixed(2)}</span>
          </div>
          <div className="header-stat">
            <span className="header-stat-label">LEDGER</span>
            <span className="header-stat-value text-glow-green">
              ${state.marginLedger.toFixed(2)} / ${state.weekTarget.toFixed(2)}
            </span>
          </div>
          <div className="header-stat">
            <span className="header-stat-label">RANK</span>
            <span className="header-stat-value text-glow-green" style={{ fontSize: '11px', textTransform: 'uppercase' }}>{state.corporateRank}</span>
          </div>
          <div className="header-stat">
            <span className="header-stat-label">CALENDAR</span>
            <span className="header-stat-value">W{state.currentWeek} D{state.currentDay}/5</span>
          </div>
          <button
            className="terminal-btn warning"
            onClick={onOpenDebug}
            style={{ padding: '3px 8px', fontSize: '9px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Wrench size={10} /> DEBUG PANEL
          </button>
        </div>
      )}
    </header>
  );
}
