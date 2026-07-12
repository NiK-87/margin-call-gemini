import type { GameState } from '../types/game';
import { Coins, Crown, RefreshCw, Skull } from 'lucide-react';

interface EndScreenProps {
  state: GameState;
  onResetGame: () => void;
}

export function GameOverScreen({ state, onResetGame }: EndScreenProps) {
  return (
    <div className="title-screen">
      <div className="title-logo-box" style={{ borderColor: 'var(--crash-red)', boxShadow: '0 0 35px rgba(255, 59, 48, 0.35)', padding: '24px' }}>
        <div style={{ color: 'var(--crash-red)', display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
          <Skull size={44} />
        </div>
        <h2 className="text-glow-red" style={{ fontSize: '24px', marginBottom: '10px' }}>MARGIN CALL DECLARED</h2>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '15px' }}>
          Your margin ledger has failed to meet target capital requirements.
          Your positions have been liquidated and your employment is terminated.
        </p>

        <div style={{ borderTop: '1px solid rgba(255,59,48,0.2)', paddingTop: '10px', textAlign: 'left', fontSize: '10.5px' }}>
          <div>Final Personal Cash: ${state.personalCash.toFixed(2)}</div>
          <div>GME Stock Price: ${state.assetPrice.toFixed(2)}</div>
          <div>Completed Weeks: {state.currentWeek - 1}</div>
          <div>Risk Tier Selected: {state.riskTier}</div>
        </div>
      </div>

      <button className="terminal-btn danger" onClick={onResetGame} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        RE-INITIALIZE INTERFACE <RefreshCw size={14} />
      </button>
    </div>
  );
}

export function VictoryScreen({ state, onResetGame }: EndScreenProps) {
  return (
    <div className="title-screen">
      <div className="title-logo-box" style={{ borderColor: 'var(--neon-green)', boxShadow: '0 0 35px rgba(0, 255, 102, 0.35)', padding: '24px' }}>
        <div style={{ color: 'var(--neon-green)', display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
          <Crown size={44} />
        </div>
        <h2 className="text-glow-green" style={{ fontSize: '24px', marginBottom: '10px' }}>GME SHORT SQUEEZE COMPLETED</h2>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '15px' }}>
          Your speculative options deck weight cornered the float! Hedge fund went bankrupt. GME skyrocketed.
          You are crowned a Legendary GME Whale Partner.
        </p>

        <div style={{ borderTop: '1px solid rgba(0,255,102,0.2)', paddingTop: '10px', textAlign: 'left', fontSize: '10.5px' }}>
          <div>Final Cash Surplus: ${state.personalCash.toFixed(2)}</div>
          <div>GME Peak Squeezed Price: ${state.assetPrice.toFixed(2)}</div>
          <div>Completed Weeks: {state.currentWeek}</div>
          <div>Risk Tier Survived: {state.riskTier}</div>
        </div>
      </div>

      <button className="terminal-btn" onClick={onResetGame}>
        PLAY AGAIN
      </button>
    </div>
  );
}

export function RetiredScreen({ state, onResetGame }: EndScreenProps) {
  return (
    <div className="title-screen">
      <div className="title-logo-box" style={{ borderColor: 'var(--neon-green)', boxShadow: '0 0 35px rgba(0, 255, 102, 0.35)', padding: '24px' }}>
        <div style={{ color: 'var(--neon-green)', display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
          <Coins size={44} />
        </div>
        <h2 className="text-glow-green" style={{ fontSize: '24px', marginBottom: '10px' }}>RETIRED TO THE BAHAMAS</h2>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '15px' }}>
          You successfully surrendered your position as **{state.corporateRank}**. You cashed out with a personal fortune, bankrupted short hedges, and retired to white sand beaches.
        </p>

        <div style={{ borderTop: '1px solid rgba(0,255,102,0.2)', paddingTop: '10px', textAlign: 'left', fontSize: '10.5px' }}>
          <div>Retirement Fund Payout: ${state.personalCash.toFixed(2)}</div>
          <div>Final GME Price: ${state.assetPrice.toFixed(2)}</div>
          <div>Completed Weeks: {state.currentWeek}</div>
          <div>GME spec-ops rank: {state.corporateRank}</div>
        </div>
      </div>

      <button className="terminal-btn" onClick={onResetGame}>
        START NEW SPECULATION WAR
      </button>
    </div>
  );
}
