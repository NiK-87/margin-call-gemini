import type { GameState } from '../types/game';

interface SqueezeWarScreenProps {
  state: GameState;
  onInitiateShortSqueeze: () => void;
}

export function SqueezeWarScreen({ state, onInitiateShortSqueeze }: SqueezeWarScreenProps) {
  return (
    <div className="title-screen crt-flicker margin-alert-strobe" style={{ minHeight: '82vh' }}>
      <div className="title-logo-box" style={{ maxWidth: '650px', borderColor: 'var(--neon-green)', boxShadow: '0 0 45px rgba(0, 255, 102, 0.4)', padding: '24px' }}>
        <span style={{ fontSize: '11px', color: 'var(--neon-green)', fontWeight: 'bold', display: 'block', animation: 'blink 1.5s infinite' }}>
          WARNING: GME FLOAT AT ZERO. SHORT CONTRACTS LIQUIDATING.
        </span>
        <h2 className="text-glow-green" style={{ fontSize: '26px', margin: '6px 0 15px 0' }}>GME SHORT SQUEEZE CASCADE</h2>

        <div style={{ textAlign: 'left', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p>
            Hedge fund short positions are being forced to cover at exponentially rising market prices!
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '12px 0' }}>
            <div>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>SQUEEZED GME PRICE</span>
              <div style={{ fontSize: '28px', color: 'var(--neon-green)', fontWeight: 'extrabold' }}>
                ${state.assetPrice.toFixed(2)}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>HEDGE FUND LIQUIDITY</span>
              <div style={{ fontSize: '28px', color: 'var(--crash-red)', fontWeight: 'extrabold' }}>
                ${state.hedgeFundLiquidity.toFixed(2)}
              </div>
            </div>
          </div>

          <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            &gt; Squeezed GME Price Target: **$500.00**<br />
            &gt; Hedge Fund Liquidity Target: **$0.00 (Bankrupt)**
          </div>
        </div>
      </div>

      <button className="terminal-btn danger crt-flicker" onClick={onInitiateShortSqueeze}>
        TRIGGER CASCADE RE-EVALUATION
      </button>
    </div>
  );
}
