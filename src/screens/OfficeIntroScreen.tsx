import { ArrowRight } from 'lucide-react';

interface OfficeIntroScreenProps {
  onEnterTradingFloor: () => void;
}

export function OfficeIntroScreen({ onEnterTradingFloor }: OfficeIntroScreenProps) {
  return (
    <div className="title-screen" style={{ minHeight: '82vh' }}>
      <div className="title-logo-box" style={{ maxWidth: '650px', textAlign: 'left', padding: '24px' }}>
        <h2 className="text-glow-green" style={{ fontSize: '18px', marginBottom: '8px' }}>MEMORANDUM - OPTIONS RESEARCH DESK</h2>
        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>FROM: SENIOR PARTNER (WHALE CO.)</span>

        <div style={{ margin: '12px 0', fontSize: '11px', color: 'var(--text-primary)', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p>
            Listen up, recruit. Syndicate Corp has allocated you a starting deck of synthetic GME option contracts.
          </p>
          <p>
            Every day, you get a hand of 5 GME options. Discarding Call or Put options shifts the GME stock price up or down. At day-end, your held options are exercised against closing price. Puts multiply payout yields; Calls pay standard differentials.
          </p>
          <p>
            At day-end, GME price is subject to overnight volatility shocks. Accumulating volatility during the day increases overnight price variance. Use protective stabilizer cards or buy defensive upgrades to buffer overnight crashes.
          </p>
          <p>
            On Day 5, we perform our Weekend Ledger Audit. You must choose which cards in your deck to exercise to hit our weekly target, or pay roll-over fees to extend contracts to next week. If you corner the short sellers (load &gt; 65% float), you can initiate a **Short Squeeze War** to bankrupt the hedge fund and win instantly.
          </p>
        </div>
      </div>

      <button className="terminal-btn" onClick={onEnterTradingFloor} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        ACCESS TRADING FLOOR <ArrowRight size={14} />
      </button>
    </div>
  );
}
