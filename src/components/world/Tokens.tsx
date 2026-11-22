import React from 'react';
import { world } from '../../theme-world';

const G = world.agent;

export type AgentKind = 'hero' | 'neutral' | 'threat' | 'system';

const fillOf: Record<AgentKind, string> = { hero: G.hero, neutral: G.neutral, threat: G.threat, system: G.system };

/**
 * Top-down token in the Report card language: flat fill, 3 px ink outline, offset shadow.
 * `angle` 0 = facing up. The ink bar marks the front. Threat tokens blink a small red/blue light bar (driven by `t`).
 */
export const CarToken: React.FC<{
  x: number;
  y: number;
  angle: number;
  kind?: AgentKind;
  t?: number;
  siren?: boolean;
  scale?: number;
  opacity?: number;
}> = ({ x, y, angle, kind = 'neutral', t = 0, siren = kind === 'threat', scale = 1, opacity = 1 }) => {
  const w = 42;
  const h = 74;
  const phase = Math.sin(t * 14) > 0;
  const ink = G.stroke;
  // offset shadow stays down-right on screen: rotate the (5, 7) offset into the token's local frame
  const rad = (-angle * Math.PI) / 180;
  const sx = 5 * Math.cos(rad) - 7 * Math.sin(rad);
  const sy = 5 * Math.sin(rad) + 7 * Math.cos(rad);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 0, height: 0, rotate: `${angle}deg`, scale: `${scale}`, opacity }}>
      {/* offset shadow (screen-space feel: always down-right) */}
      <div style={{ position: 'absolute', left: -w / 2, top: -h / 2, width: w, height: h, borderRadius: 13, background: G.shadow, translate: `${sx}px ${sy}px` }} />
      <div
        style={{
          position: 'absolute',
          left: -w / 2,
          top: -h / 2,
          width: w,
          height: h,
          borderRadius: 13,
          background: fillOf[kind],
          border: `3px solid ${ink}`,
          boxSizing: 'border-box',
        }}
      >
        {/* windshield (front) and rear window */}
        <div style={{ position: 'absolute', left: 5, right: 5, top: 12, height: 11, borderRadius: '6px 6px 3px 3px', background: ink }} />
        <div style={{ position: 'absolute', left: 7, right: 7, bottom: 9, height: 7, borderRadius: '3px 3px 5px 5px', background: ink, opacity: 0.85 }} />
        {siren && (
          <div style={{ position: 'absolute', left: 6, right: 6, top: 32, height: 8, borderRadius: 3, display: 'flex', border: `2px solid ${ink}`, overflow: 'hidden' }}>
            <div style={{ flex: 1, background: phase ? '#FFFFFF' : '#E65856' }} />
            <div style={{ flex: 1, background: phase ? '#556BD1' : '#FFFFFF' }} />
          </div>
        )}
      </div>
    </div>
  );
};

/** Round token with an icon (users, phones, servers) for topics without cars. */
export const DotToken: React.FC<{ x: number; y: number; kind?: AgentKind; size?: number; p?: number; children?: React.ReactNode }> = ({
  x,
  y,
  kind = 'neutral',
  size = 72,
  p = 1,
  children,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: '50%',
      background: fillOf[kind],
      border: `3px solid ${G.stroke}`,
      boxSizing: 'border-box',
      boxShadow: `5px 7px 0 ${G.shadow}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: Math.min(1, p * 3),
      scale: `${0.5 + 0.5 * p}`,
    }}
  >
    {children}
  </div>
);

/** Signal ring (flat, no glow). `u` 0..1 = progress of one ping. */
export const Ping: React.FC<{ x: number; y: number; u: number; color?: string; size?: number }> = ({ x, y, u, color = G.system, size = 200 }) => {
  if (u <= 0 || u >= 1) return null;
  const r = size * (0.15 + 0.85 * u);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - r / 2,
        top: y - r / 2,
        width: r,
        height: r,
        borderRadius: '50%',
        border: `4px solid ${color}`,
        opacity: (1 - u) * 0.85,
      }}
    />
  );
};
