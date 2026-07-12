import type { RiskTier } from '../game/helpers';

interface TitleScreenProps {
  onStartGame: (risk: RiskTier) => void;
}

export function TitleScreen({ onStartGame }: TitleScreenProps) {
  return (
    <div className="title-screen" style={{ minHeight: '82vh' }}>
      <div className="title-logo-box" style={{ maxWidth: '650px', padding: '24px' }}>
        <h1 className="text-glow-red" style={{ fontSize: '42px', margin: '0 0 5px 0', letterSpacing: '4px' }}>GME SPECULATOR</h1>
        <p className="text-glow-green" style={{ fontSize: '12px', marginBottom: '15px', letterSpacing: '2px' }}>
          ROGUE-LITE STOCK OPTIONS DECKBUILDER
        </p>

        <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', lineHeight: '1.5', textAlign: 'left', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginBottom: '15px' }}>
          &gt; Manipulate GME price on the daily trading floor.<br />
          &gt; Hold CALLs to generate yield when GME closing price spikes.<br />
          &gt; Secure PUTs to yield cash when GME falls (multiplied by contract coefficients).<br />
          &gt; Reconcile GME weekend ledger audits to survive the corporate board.
        </div>

        <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '12px' }}>
          <span style={{ fontSize: '10px', color: 'var(--warning-amber)', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
            SELECT SPECULATOR DECK ARCHETYPE:
          </span>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              className="terminal-btn"
              style={{ fontSize: '10px', padding: '8px 12px' }}
              onClick={() => onStartGame('LOW')}
            >
              CONSERVATIVE (LOW RISK)<br />
              <span style={{ fontSize: '7.5px', color: 'var(--text-secondary)' }}>More Calls | Fewer Puts</span>
            </button>
            <button
              className="terminal-btn warning"
              style={{ fontSize: '10px', padding: '8px 12px' }}
              onClick={() => onStartGame('MEDIUM')}
            >
              BALANCED APE (MEDIUM RISK)<br />
              <span style={{ fontSize: '7.5px', color: 'var(--text-secondary)' }}>Current Starter Deck</span>
            </button>
            <button
              className="terminal-btn danger"
              style={{ fontSize: '10px', padding: '8px 12px' }}
              onClick={() => onStartGame('HIGH')}
            >
              DEGEN SPECULATOR (HIGH RISK)<br />
              <span style={{ fontSize: '7.5px', color: 'var(--text-secondary)' }}>More puts | High spreads</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
