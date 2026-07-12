import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Card } from '../types/game';


interface StockChartProps {
  priceHistory: number[];
  hand: Card[];
  assetPrice: number;
  volatility: number; // 0.0 to 1.0
}

export const StockChart: React.FC<StockChartProps> = ({
  priceHistory,
  hand,
  assetPrice,
  volatility,
}) => {
  const width = 600;
  const height = 180;
  const padding = { top: 15, right: 90, bottom: 15, left: 45 };

  // Calculate chart boundaries
  const boundaries = useMemo(() => {
    if (priceHistory.length === 0) {
      return { min: 80, max: 120 };
    }

    const strikes = hand.map((c) => c.strikePrice);
    const allVals = [...priceHistory, ...strikes, assetPrice];
    const minVal = Math.min(...allVals);
    const maxVal = Math.max(...allVals);

    // Give some padding on top/bottom
    const range = maxVal - minVal;
    const paddingPercent = 0.15; // 15% padding
    
    let min = minVal - (range * paddingPercent);
    let max = maxVal + (range * paddingPercent);

    // Keep bounds reasonable
    if (min < 0) min = 0;
    if (min === max) {
      min -= 10;
      max += 10;
    }

    return { min, max };
  }, [priceHistory, hand, assetPrice]);

  const { min, max } = boundaries;

  // Determine trend color
  const firstPrice = priceHistory[0] || assetPrice;
  const currentPrice = assetPrice;
  const isUp = currentPrice >= firstPrice;
  const themeColor = isUp ? '#00ff66' : '#ff3b30';
  const gradientId = isUp ? 'chart-grad-up' : 'chart-grad-down';

  // Map price to SVG Y coordinate
  const getY = (price: number) => {
    const chartHeight = height - padding.top - padding.bottom;
    const ratio = (price - min) / (max - min);
    return height - padding.bottom - ratio * chartHeight;
  };

  // Map index to SVG X coordinate
  const getX = (index: number, total: number) => {
    const chartWidth = width - padding.left - padding.right;
    if (total <= 1) return padding.left;
    return padding.left + (index / (total - 1)) * chartWidth;
  };

  // Build the price line path
  const linePath = useMemo(() => {
    if (priceHistory.length < 2) return '';
    return priceHistory
      .map((price, idx) => {
        const x = getX(idx, priceHistory.length);
        const y = getY(price);
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }, [priceHistory, min, max]);

  // Build the gradient path (closed area under the price line)
  const gradientPath = useMemo(() => {
    if (priceHistory.length < 2) return '';
    const firstX = getX(0, priceHistory.length);
    const lastX = getX(priceHistory.length - 1, priceHistory.length);
    const bottomY = height - padding.bottom;

    return `${linePath} L ${lastX.toFixed(1)} ${bottomY.toFixed(1)} L ${firstX.toFixed(1)} ${bottomY.toFixed(1)} Z`;
  }, [priceHistory, linePath, min, max]);

  // Grid lines
  const gridLinesY = useMemo(() => {
    const lines = 4;
    const result = [];
    const step = (max - min) / lines;
    for (let i = 0; i <= lines; i++) {
      const price = min + step * i;
      result.push({
        price,
        y: getY(price),
      });
    }
    return result;
  }, [min, max]);

  // Coordinates of the latest price tick
  const latestX = priceHistory.length > 0 ? getX(priceHistory.length - 1, priceHistory.length) : padding.left;
  const latestY = getY(currentPrice);

  // Volatility Level settings
  const volPercent = Math.min(100, Math.max(0, volatility * 100));
  let volColor = 'var(--neon-green)';
  let volText = 'STABLE';
  if (volatility > 0.6) {
    volColor = 'var(--crash-red)';
    volText = 'CRITICAL';
  } else if (volatility > 0.3) {
    volColor = 'var(--warning-amber)';
    volText = 'VOLATILE';
  }

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>TICKER: GME (GameStop Corp.)</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
            <span 
              className={isUp ? 'price-pulse-green-trigger' : 'price-pulse-red-trigger'} 
              style={{ fontSize: '22px', fontWeight: 'bold', color: themeColor, fontFamily: 'var(--font-mono)' }}
            >
              ${currentPrice.toFixed(2)}
            </span>
            <span style={{ fontSize: '10.5px', color: isUp ? 'var(--neon-green)' : 'var(--crash-red)' }}>
              {isUp ? '▲' : '▼'} {(((currentPrice - firstPrice) / firstPrice) * 100).toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Retro Stock Stats Box */}
        <div style={{ display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '9px', color: 'var(--text-secondary)' }}>
          <div>
            <div>HIGH: <span style={{ color: '#fff', fontWeight: 'bold' }}>${Math.max(...priceHistory, assetPrice).toFixed(2)}</span></div>
            <div>LOW: <span style={{ color: '#fff', fontWeight: 'bold' }}>${Math.min(...priceHistory, assetPrice).toFixed(2)}</span></div>
          </div>
          <div style={{ borderLeft: '1px dashed rgba(255,255,255,0.1)', paddingLeft: '8px' }}>
            <div>VOL: <span style={{ color: 'var(--warning-amber)', fontWeight: 'bold' }}>{(volatility * 100).toFixed(0)}%</span></div>
            <div>BETA: <span style={{ color: 'var(--neon-green)', fontWeight: 'bold' }}>1.85</span></div>
          </div>
        </div>
        
        {/* Volatility Indicator */}
        <div className="volatility-container" style={{ width: '130px', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 'bold' }}>
            <span>VOL INDEX</span>
            <span style={{ color: volColor }}>{volText} ({volPercent.toFixed(0)}%)</span>
          </div>
          <div className="volatility-bar-bg" style={{ height: '6px' }}>
            <div 
              className="volatility-bar-fill" 
              style={{ width: `${volPercent}%`, backgroundColor: volColor }}
            />
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', background: '#090c10', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)', overflow: 'hidden' }}>
        <svg viewBox={`0 0 ${width} ${height}`} className="stock-chart-svg">
          <defs>
            {/* Green Gradient */}
            <linearGradient id="chart-grad-up" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--neon-green)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--neon-green)" stopOpacity="0" />
            </linearGradient>
            
            {/* Red Gradient */}
            <linearGradient id="chart-grad-down" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--crash-red)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--crash-red)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridLinesY.map((line, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={line.y}
                x2={width - padding.right}
                y2={line.y}
                stroke="rgba(0, 255, 102, 0.05)"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={line.y + 4}
                fill="var(--text-muted)"
                fontSize="9"
                fontFamily="var(--font-mono)"
                textAnchor="end"
              >
                ${line.price.toFixed(0)}
              </text>
            </g>
          ))}

          {/* Under fill gradient */}
          {gradientPath && (
            <motion.path 
              d={gradientPath} 
              fill={`url(#${gradientId})`} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
          )}

          {/* Main Price Line */}
          {linePath && (
            <motion.path
              d={linePath}
              fill="none"
              stroke={themeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          )}

          {/* Option Strike Price Lines */}
          {hand.map((card) => {
            const y = getY(card.strikePrice);
            // Only draw if within bounds
            if (y < padding.top || y > height - padding.bottom) return null;

            return (
              <g key={card.id}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  className={`chart-strike-line ${card.type}`}
                />
                <rect
                  x={width - padding.right + 2}
                  y={y - 8}
                  width="85"
                  height="16"
                  fill="rgba(8, 10, 14, 0.9)"
                  stroke={card.type === 'CALL' ? 'var(--neon-green)' : 'var(--crash-red)'}
                  strokeWidth="0.5"
                  rx="3"
                />
                <text
                  x={width - padding.right + 6}
                  y={y + 3}
                  fill={card.type === 'CALL' ? 'var(--neon-green)' : 'var(--crash-red)'}
                  fontSize="8"
                  fontFamily="var(--font-mono)"
                  fontWeight="bold"
                >
                  ${card.strikePrice} {card.type}
                </text>
              </g>
            );
          })}

          {/* Current Asset Price Label line (on the right) */}
          <line
            x1={padding.left}
            y1={latestY}
            x2={width - padding.right}
            y2={latestY}
            stroke={themeColor}
            strokeWidth="0.8"
            strokeDasharray="2, 2"
          />

          {/* Pulsing price tick node */}
          <circle
            cx={latestX}
            cy={latestY}
            r="4"
            fill={themeColor}
            className="price-tick-node"
          />
          <circle
            cx={latestX}
            cy={latestY}
            r="9"
            fill="none"
            stroke={themeColor}
            strokeWidth="1.5"
            opacity="0.4"
            style={{ animation: 'price-tick-pulse 2s infinite' }}
          />

          {/* Gamma Squeeze Trigger Threshold line ($200) */}
          {(() => {
            const y200 = getY(200);
            if (y200 >= padding.top && y200 <= height - padding.bottom) {
              return (
                <g>
                  <line
                    x1={padding.left}
                    y1={y200}
                    x2={width - padding.right}
                    y2={y200}
                    stroke="rgba(255, 153, 0, 0.45)"
                    strokeWidth="1"
                    strokeDasharray="3, 3"
                  />
                  <rect
                    x={padding.left + 4}
                    y={y200 - 7}
                    width="125"
                    height="12"
                    fill="rgba(8, 10, 14, 0.9)"
                    stroke="var(--warning-amber)"
                    strokeWidth="0.5"
                    rx="2"
                  />
                  <text
                    x={padding.left + 8}
                    y={y200 + 2}
                    fill="var(--warning-amber)"
                    fontSize="7"
                    fontFamily="var(--font-mono)"
                    fontWeight="bold"
                  >
                    GAMMA SQUEEZE TRIGGER ($200)
                  </text>
                </g>
              );
            }
            return null;
          })()}

          {/* X axis line */}
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="var(--border-color)"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
};
