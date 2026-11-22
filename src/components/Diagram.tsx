import React from 'react';
import { random } from 'remotion';
import { arabic, display } from '../fonts';
import { theme } from '../theme';
import { Mono } from './Labels';

const L = theme.light;
const D = theme.dark;
const A = theme.accent;

/** Node box: card with an icon and a mono label. `glow` 0..1 adds an accent halo. */
export const NodeBox: React.FC<{
  icon: React.ReactNode;
  label: string;
  width?: number;
  height?: number;
  glow?: number;
  glowColor?: string;
  mode?: 'light' | 'dark';
  borderColor?: string;
  style?: React.CSSProperties;
}> = ({ icon, label, width = 220, height = 220, glow = 0, glowColor = A.green, mode = 'light', borderColor, style }) => {
  const dark = mode === 'dark';
  return (
    <div
      style={{
        position: 'absolute',
        width,
        height,
        borderRadius: theme.radius.card,
        background: dark ? D.panel : L.surface,
        border: `3px solid ${borderColor ?? (dark ? D.glow : L.ink)}`,
        boxShadow: `${dark ? '' : theme.shadow.card + ','} 0 0 ${50 * glow}px ${12 * glow}px ${glowColor}${Math.round(glow * 140)
          .toString(16)
          .padStart(2, '0')}`,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        ...style,
      }}
    >
      {icon}
      <Mono size={24} color={dark ? D.text : L.ink} weight={800}>
        {label}
      </Mono>
    </div>
  );
};

/** SVG path drawn progressively (p 0..1). Coordinates are in the parent's pixel space. */
export const DrawPath: React.FC<{
  d: string;
  p: number;
  color?: string;
  width?: number;
  dashed?: boolean;
  arrow?: boolean;
  opacity?: number;
  w?: number;
  h?: number;
  style?: React.CSSProperties;
  glow?: string;
}> = ({ d, p, color = L.ink, width = 5, dashed, arrow, opacity = 1, w = 1080, h = 1920, style, glow }) => {
  const id = React.useId().replace(/:/g, '');
  const q = Math.max(0, Math.min(1, p));
  if (q <= 0.001) return null; // round caps would otherwise leave a dot at 0%
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', opacity, ...style }}>
      <defs>
        {arrow && (
          <marker id={`ah${id}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={color} />
          </marker>
        )}
        {dashed && (
          <mask id={`m${id}`}>
            <path d={d} pathLength={1} stroke="#fff" strokeWidth={width + 8} fill="none" strokeDasharray={`${q} 1`} strokeLinecap="round" />
          </mask>
        )}
      </defs>
      {dashed ? (
        <path d={d} fill="none" stroke={color} strokeWidth={width} strokeDasharray={`${width * 2.6} ${width * 2.2}`} strokeLinecap="round" mask={`url(#m${id})`} style={{ filter: glow ? `drop-shadow(0 0 8px ${glow})` : undefined }} />
      ) : (
        <path
          d={d}
          pathLength={1}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`${q} 1`}
          markerEnd={arrow && q > 0.98 ? `url(#ah${id})` : undefined}
          style={{ filter: glow ? `drop-shadow(0 0 8px ${glow})` : undefined }}
        />
      )}
    </svg>
  );
};

/** position along a quadratic bezier (for objects travelling along a flow arrow) */
export const quadPoint = (p0: [number, number], c: [number, number], p1: [number, number], t: number): [number, number] => {
  const u = 1 - t;
  return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]];
};

const appColors = [A.blue, A.green, A.yellow, '#8C9BE6', '#7CC9A6', '#D9C27A', '#A9B1C2', '#C7CCD6', '#6E7FD8'];

/** Grid of generic app icons. fill(i) 0..1 per tile, dim 0..1, `red` index turns red, `lifted` hides that tile. */
export const AppGrid: React.FC<{
  cols: number;
  rows: number;
  tile: number;
  gap: number;
  fill?: (i: number) => number;
  dim?: number;
  red?: number;
  redP?: number;
  hidden?: number;
  style?: React.CSSProperties;
}> = ({ cols, rows, tile, gap, fill = () => 1, dim = 0, red = -1, redP = 0, hidden = -1, style }) => (
  <div style={{ position: 'absolute', width: cols * tile + (cols - 1) * gap, height: rows * tile + (rows - 1) * gap, ...style }}>
    {Array.from({ length: cols * rows }).map((_, i) => {
      const f = fill(i);
      if (f <= 0.001 || i === hidden) return null;
      const c = i % cols;
      const r = Math.floor(i / cols);
      const base = appColors[Math.floor(random(`app-${i}`) * appColors.length)];
      const isRed = i === red && redP > 0;
      const glyph = Math.floor(random(`glyph-${i}`) * 4);
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: c * (tile + gap),
            top: r * (tile + gap),
            width: tile,
            height: tile,
            borderRadius: tile * 0.26,
            background: isRed ? A.red : base,
            border: `2.5px solid ${L.ink}`,
            boxSizing: 'border-box',
            opacity: Math.min(1, f * 2) * (isRed ? 1 : 1 - dim * 0.72),
            scale: `${0.4 + 0.6 * f}`,
            filter: dim > 0 && !isRed ? `grayscale(${dim * 0.9})` : undefined,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: tile * 0.38,
              height: tile * 0.38,
              borderRadius: glyph === 0 ? 99 : glyph === 1 ? 4 : tile * 0.1,
              border: `3px solid rgba(255,255,255,0.92)`,
              rotate: glyph === 2 ? '45deg' : undefined,
              boxSizing: 'border-box',
              background: glyph === 3 ? 'rgba(255,255,255,0.9)' : undefined,
            }}
          />
        </div>
      );
    })}
  </div>
);

/** Formatted rolling number. */
export const Counter: React.FC<{ value: number; suffix?: string; prefix?: string; style?: React.CSSProperties }> = ({ value, suffix = '', prefix = '', style }) => (
  <span dir="ltr" style={{ fontFamily: display, fontWeight: 900, fontVariantNumeric: 'tabular-nums', ...style }}>
    {prefix}
    {Math.round(value).toLocaleString('en-US')}
    {suffix}
  </span>
);

/** Blueprint ruler with ticks, a marker that slides to `value` (0..1), and a label. */
export const ScaleBar: React.FC<{
  width: number;
  p: number;
  value: number;
  markerP: number;
  title: string;
  markerLabel: React.ReactNode;
  sub?: string;
  style?: React.CSSProperties;
}> = ({ width, p, value, markerP, title, markerLabel, sub, style }) => {
  const h = 64;
  const ticks = 21;
  const mx = width * value * markerP;
  return (
    <div style={{ position: 'absolute', width, ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, opacity: Math.min(1, p * 2) }}>
        <Mono size={20} color={D.mono}>{title} →</Mono>
        <Mono size={20} color={D.mono}>100%</Mono>
      </div>
      <div
        style={{
          position: 'relative',
          width,
          height: h,
          borderRadius: 10,
          border: `2px solid ${D.mono}`,
          background: `linear-gradient(90deg, ${D.rulerFrom}55, ${D.rulerTo}88)`,
          boxShadow: `0 0 26px rgba(92,131,165,0.6)`,
          overflow: 'hidden',
          clipPath: `inset(0 ${(1 - p) * 100}% 0 0 round 10px)`,
        }}
      >
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: mx, background: `linear-gradient(90deg, rgba(129,225,200,0.1), rgba(129,225,200,0.45))` }} />
        {Array.from({ length: ticks }).map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: (i / (ticks - 1)) * (width - 4) + 1, top: 0, width: 2, height: i % 5 === 0 ? h * 0.55 : h * 0.3, background: D.mono, opacity: 0.8 }} />
        ))}
        {[0, 25, 50, 75].map((v) => (
          <div key={v} style={{ position: 'absolute', left: (v / 100) * width + 8, bottom: 6, fontFamily: display, fontWeight: 700, fontSize: 16, color: D.mono, opacity: 0.85 }}>
            {v}%
          </div>
        ))}
      </div>
      {/* marker */}
      <div style={{ position: 'absolute', left: mx, top: 30, opacity: markerP > 0.01 ? 1 : 0 }}>
        <div style={{ position: 'absolute', left: -2, top: 0, width: 4, height: h + 6, background: D.marker, boxShadow: `0 0 14px ${D.marker}` }} />
        <svg width="28" height="20" viewBox="0 0 28 20" style={{ position: 'absolute', left: -14, top: h + 10 }}>
          <path d="M14 0 L28 20 L0 20 z" fill={D.marker} />
        </svg>
        <div style={{ position: 'absolute', left: 0, top: h + 36, translate: `${value > 0.75 ? -72 : -50}% 0px`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
          <div style={{ fontFamily: `${display}, ${arabic}`, fontWeight: 900, fontSize: 52, color: D.marker, textShadow: `0 0 18px rgba(129,225,200,0.7)`, lineHeight: 1 }}>{markerLabel}</div>
          {sub && <Mono size={18} color={D.mono}>{sub}</Mono>}
        </div>
      </div>
    </div>
  );
};
