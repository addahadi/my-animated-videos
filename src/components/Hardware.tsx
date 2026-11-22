import React from 'react';
import { arabic, display, mono } from '../fonts';
import { theme } from '../theme';
import { Mono } from './Labels';

// Device internals: speed, camera, battery charge vs power, CPU dial, workload, storage, heat.
// All presentational: progress values come from the scene (no clock reads here).

const L = theme.light;
const D = theme.dark;
const A = theme.accent;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Loading spinner (ring with a gap). `angle` in degrees comes from the scene clock. */
export const Spinner: React.FC<{ size?: number; angle: number; color?: string; track?: string; stroke?: number; style?: React.CSSProperties }> = ({
  size = 64,
  angle,
  color = '#F4F4F0',
  track = 'rgba(244,244,240,0.25)',
  stroke = 7,
  style,
}) => {
  const r = size / 2 - stroke;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ display: 'block', rotate: `${angle}deg`, ...style }}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={`${c * 0.28} ${c}`} />
    </svg>
  );
};

/** Phone speed meter shown on a screen: mono label + bar. Red when slow (value < 0.45), green when fine. */
export const SpeedBar: React.FC<{ width: number; value: number; label?: string; style?: React.CSSProperties }> = ({ width, value, label = 'SPEED', style }) => {
  const v = clamp01(value);
  const col = v < 0.45 ? A.red : A.green;
  return (
    <div style={{ position: 'absolute', width, ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <Mono size={18} color={L.mono} weight={800}>
          {label}
        </Mono>
        <span style={{ fontFamily: display, fontWeight: 900, fontSize: 26, color: col }}>{Math.round(v * 100)}%</span>
      </div>
      <div style={{ height: 22, borderRadius: 11, border: `2.5px solid ${L.ink}`, background: '#F6F6F2', overflow: 'hidden' }}>
        <div style={{ width: `${v * 100}%`, height: '100%', background: col, borderRadius: 8 }} />
      </div>
    </div>
  );
};

/**
 * Camera viewfinder for inside DeviceMock. `loaded` 0..1 fades from the dark loading state to the
 * live preview; `subjectX` (0..1, or null) places a ball crossing the frame.
 */
export const CameraView: React.FC<{ spin: number; loaded: number; subjectX: number | null; subjectY?: number; showSpinner?: number }> = ({
  spin,
  loaded,
  subjectX,
  subjectY = 0.42,
  showSpinner = 1,
}) => (
  <div style={{ position: 'absolute', inset: 0 }}>
    {/* live scene (sky + ground), visible through the loading veil */}
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #C9D6EC 0%, #DCE4F2 58%, #B9C7A6 58%, #A9B994 100%)' }} />
    {subjectX !== null && (
      <div
        style={{
          position: 'absolute',
          left: `${subjectX * 100}%`,
          top: `${subjectY * 100}%`,
          width: 74,
          height: 74,
          translate: '-50% -50%',
          borderRadius: 99,
          background: A.yellow,
          border: `3px solid ${L.ink}`,
          boxShadow: '3px 5px 0 rgba(11,15,21,0.18)',
        }}
      />
    )}
    {/* loading veil */}
    <div style={{ position: 'absolute', inset: 0, background: '#2A2D33', opacity: 0.86 * (1 - clamp01(loaded)) }} />
    {showSpinner > 0.01 && (
      <div style={{ position: 'absolute', left: '50%', top: '42%', translate: '-50% -50%', opacity: showSpinner * (1 - clamp01(loaded)) }}>
        <Spinner size={86} angle={spin} />
      </div>
    )}
    {/* viewfinder chrome */}
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '20%', background: 'rgba(11,15,21,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 66, height: 66, borderRadius: 99, border: '5px solid #F4F4F0', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 46, height: 46, borderRadius: 99, background: '#F4F4F0', opacity: 0.4 + 0.6 * clamp01(loaded) }} />
      </div>
    </div>
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          width: 30,
          height: 30,
          [i < 2 ? 'top' : 'bottom']: i < 2 ? '14%' : '26%',
          [i % 2 ? 'right' : 'left']: '10%',
          borderTop: i < 2 ? '4px solid rgba(244,244,240,0.8)' : undefined,
          borderBottom: i >= 2 ? '4px solid rgba(244,244,240,0.8)' : undefined,
          borderLeft: i % 2 === 0 ? '4px solid rgba(244,244,240,0.8)' : undefined,
          borderRight: i % 2 ? '4px solid rgba(244,244,240,0.8)' : undefined,
        }}
      />
    ))}
  </div>
);

/** Blueprint charge tank (how much energy is stored). Mint fill, % readout. */
export const ChargeTank: React.FC<{ width: number; height: number; level: number; p?: number; label?: string; style?: React.CSSProperties }> = ({
  width,
  height,
  level,
  p = 1,
  label = 'CHARGE',
  style,
}) => (
  <div style={{ position: 'absolute', width, opacity: clamp01(p * 2), translate: `0px ${(1 - clamp01(p)) * 40}px`, ...style }}>
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
      <Mono size={22} color={D.mono} weight={800}>
        {label}
      </Mono>
    </div>
    <div style={{ position: 'relative', width, height, borderRadius: 26, border: `3px solid ${D.mono}`, background: 'rgba(51,74,106,0.55)', boxShadow: `0 0 26px rgba(92,131,165,0.55)`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: `${clamp01(level) * 100}%`, background: `linear-gradient(180deg, rgba(129,225,200,0.85), rgba(129,225,200,0.45))`, boxShadow: `0 0 30px ${D.marker}` }} />
      {[0.25, 0.5, 0.75].map((v) => (
        <div key={v} style={{ position: 'absolute', left: 0, width: 26, bottom: `${v * 100}%`, height: 2, background: D.mono, opacity: 0.7 }} />
      ))}
      <div style={{ position: 'absolute', left: 0, right: 0, top: '38%', textAlign: 'center', fontFamily: display, fontWeight: 900, fontSize: width * 0.3, color: D.text, textShadow: '0 2px 10px rgba(0,0,0,0.35)' }}>
        {Math.round(clamp01(level) * 100)}%
      </div>
    </div>
    <div style={{ position: 'absolute', left: width / 2 - 22, top: -2, width: 44, height: 14, borderRadius: 4, background: D.mono, opacity: 0 }} />
  </div>
);

/**
 * Blueprint power meter (how much power the battery can push right now) against what the phone NEEDS.
 * `supply` 0..1 mint fill; `needed` 0..1 marker; `gapP` reveals the yellow delta bracket between them.
 */
export const PowerMeter: React.FC<{
  width: number;
  height: number;
  supply: number;
  needed: number;
  neededP?: number;
  gapP?: number;
  p?: number;
  label?: string;
  warn?: number;
  style?: React.CSSProperties;
}> = ({ width, height, supply, needed, neededP = 1, gapP = 0, p = 1, label = 'POWER', warn = 0, style }) => {
  const sY = height * (1 - clamp01(supply));
  const nY = height * (1 - clamp01(needed));
  const gapTop = Math.min(sY, nY);
  const gapH = Math.abs(sY - nY);
  return (
    <div style={{ position: 'absolute', width, opacity: clamp01(p * 2), translate: `0px ${(1 - clamp01(p)) * 40}px`, ...style }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <Mono size={22} color={D.mono} weight={800}>
          {label}
        </Mono>
      </div>
      <div style={{ position: 'relative', width, height }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 16, border: `3px solid ${D.mono}`, background: `linear-gradient(180deg, ${D.rulerTo}33, ${D.rulerFrom}55)`, boxShadow: `0 0 26px rgba(92,131,165,0.55)`, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: sY, background: `linear-gradient(180deg, rgba(129,225,200,0.75), rgba(129,225,200,0.3))` }} />
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} style={{ position: 'absolute', right: 0, top: (i / 10) * height, width: i % 5 === 0 ? 30 : 16, height: 2, background: D.mono, opacity: 0.7 }} />
          ))}
        </div>
        {/* NEEDED marker */}
        <div style={{ position: 'absolute', left: -14, right: -14, top: nY - 3, height: 6, borderRadius: 3, background: warn > 0.5 ? A.red : D.text, boxShadow: `0 0 16px ${warn > 0.5 ? A.red : D.text}`, opacity: clamp01(neededP * 2) }} />
        <div style={{ position: 'absolute', right: width + 26, top: nY - 16, opacity: clamp01(neededP * 2) }}>
          <Mono size={20} color={warn > 0.5 ? A.red : D.text} weight={800}>
            NEEDED
          </Mono>
        </div>
        {/* gap bracket */}
        {gapP > 0.01 && gapH > 2 && (
          <div style={{ position: 'absolute', left: width + 18, top: gapTop, height: gapH * clamp01(gapP), width: 22, borderTop: `4px solid ${D.delta}`, borderBottom: `4px solid ${D.delta}`, borderRight: `4px solid ${D.delta}`, boxSizing: 'border-box', filter: `drop-shadow(0 0 8px ${D.delta})` }}>
            <div style={{ position: 'absolute', left: 34, top: '50%', translate: '0 -50%', fontFamily: display, fontWeight: 900, fontSize: 34, color: D.delta, whiteSpace: 'nowrap', opacity: clamp01(gapP * 2 - 1) }}>GAP</div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Tap analogy (blueprint): a full tank, a pipe and a tap. `stream` 0..1 is the water flow width
 * actually coming out; `need` 0..1 reveals the dashed outline of the flow the phone needs.
 */
export const TapInset: React.FC<{ p?: number; level?: number; open: number; stream: number; need: number; style?: React.CSSProperties }> = ({
  p = 1,
  level = 0.92,
  open,
  stream,
  need,
  style,
}) => {
  const W = 700;
  const H = 300;
  const flowTop = 132;
  const flowH = 150;
  const sx = 452;
  const needW = 84;
  const sw = 6 + stream * 60;
  return (
    <div style={{ position: 'absolute', width: W, height: H, opacity: clamp01(p * 2), translate: `0px ${(1 - clamp01(p)) * 50}px`, ...style }}>
      {/* tank */}
      <div style={{ position: 'absolute', left: 0, top: 10, width: 230, height: 230, borderRadius: 22, border: `3px solid ${D.mono}`, background: 'rgba(51,74,106,0.5)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: `${level * 100}%`, background: 'linear-gradient(180deg, rgba(129,225,200,0.7), rgba(129,225,200,0.35))' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 6, background: 'rgba(226,245,255,0.6)' }} />
        </div>
      </div>
      {/* pipe */}
      <div style={{ position: 'absolute', left: 228, top: 90, width: 210, height: 26, background: D.panel, border: `3px solid ${D.mono}`, borderLeft: 'none', boxSizing: 'border-box' }} />
      {/* tap body + handle */}
      <div style={{ position: 'absolute', left: 420, top: 74, width: 64, height: 58, borderRadius: 12, background: D.panel, border: `3px solid ${D.mono}`, boxSizing: 'border-box' }} />
      <div style={{ position: 'absolute', left: 430, top: 40, width: 44, height: 12, borderRadius: 6, background: D.text, rotate: `${open * 80}deg`, transformOrigin: '50% 50%' }} />
      <div style={{ position: 'absolute', left: 449, top: 50, width: 6, height: 26, background: D.text }} />
      {/* the flow the phone needs (dashed outline) */}
      <div style={{ position: 'absolute', left: sx - needW / 2, top: flowTop, width: needW, height: flowH, border: `4px dashed ${D.delta}`, borderTop: 'none', boxSizing: 'border-box', opacity: clamp01(need), borderRadius: '0 0 12px 12px' }} />
      {/* actual stream */}
      {open > 0.02 && (
        <div style={{ position: 'absolute', left: sx - sw / 2, top: flowTop, width: sw, height: flowH * clamp01(open * 1.6), background: 'linear-gradient(180deg, rgba(129,225,200,0.95), rgba(129,225,200,0.55))', borderRadius: 6, boxShadow: `0 0 14px ${D.marker}` }} />
      )}
    </div>
  );
};

/** Half-circle speed dial with a needle and a % readout. `value` 0..1. */
export const SpeedDial: React.FC<{ size: number; value: number; label?: string; mode?: 'light' | 'dark'; color?: string; p?: number; style?: React.CSSProperties }> = ({
  size,
  value,
  label = 'CPU SPEED',
  mode = 'dark',
  color,
  p = 1,
  style,
}) => {
  const dark = mode === 'dark';
  const ink = dark ? D.text : L.ink;
  const col = color ?? (dark ? D.marker : L.ink);
  const r = size / 2 - 14;
  const cx = size / 2;
  const cy = size / 2;
  const arc = (a0: number, a1: number) => {
    const p0 = [cx - r * Math.cos(a0), cy - r * Math.sin(a0)];
    const p1 = [cx - r * Math.cos(a1), cy - r * Math.sin(a1)];
    return `M${p0[0]} ${p0[1]} A${r} ${r} 0 0 1 ${p1[0]} ${p1[1]}`;
  };
  const v = clamp01(value);
  const ang = Math.PI * v;
  return (
    <div style={{ position: 'absolute', width: size, opacity: clamp01(p * 2), scale: `${0.85 + 0.15 * clamp01(p)}`, ...style }}>
      <svg width={size} height={size / 2 + 20} style={{ display: 'block', overflow: 'visible' }}>
        <path d={arc(0, Math.PI)} stroke={dark ? D.panel : '#D9DBD6'} strokeWidth={22} fill="none" strokeLinecap="round" />
        <path d={arc(0, Math.max(0.001, ang))} stroke={col} strokeWidth={22} fill="none" strokeLinecap="round" style={{ filter: dark ? `drop-shadow(0 0 8px ${col})` : undefined }} />
        <line x1={cx} y1={cy} x2={cx - (r - 30) * Math.cos(ang)} y2={cy - (r - 30) * Math.sin(ang)} stroke={ink} strokeWidth={7} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={12} fill={ink} />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -6, gap: 4 }}>
        <span style={{ fontFamily: display, fontWeight: 900, fontSize: size * 0.17, color: ink, lineHeight: 1 }}>{Math.round(v * 100)}%</span>
        <Mono size={20} color={dark ? D.mono : L.mono} weight={800}>
          {label}
        </Mono>
      </div>
    </div>
  );
};

/**
 * Fixed-capacity box filling with task blocks (workload on the same hardware).
 * The box holds exactly `capacity` blocks (`cols` per row); extra blocks pile up above it in red.
 * `blocks` may be fractional (the last block is still dropping in).
 */
export const TaskBox: React.FC<{
  width: number;
  height: number;
  blocks: number;
  capacity: number;
  cols?: number;
  label?: string;
  p?: number;
  shrink?: number;
  style?: React.CSSProperties;
}> = ({ width, height, blocks, capacity, cols = 3, label = 'CAPACITY', p = 1, shrink = 0, style }) => {
  const pad = 16;
  const gap = 10;
  const capRows = Math.ceil(capacity / cols);
  const bw = (width - pad * 2 - gap * (cols - 1)) / cols;
  const bh = (height - pad * 2 - gap * (capRows - 1)) / capRows;
  const n = Math.ceil(blocks);
  return (
    <div style={{ position: 'absolute', width, height, opacity: clamp01(p * 2), ...style }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 20, border: `3px solid ${L.ink}`, background: L.surface, boxShadow: theme.shadow.card }} />
      <div style={{ position: 'absolute', left: -10, right: -10, top: -2, borderTop: `4px dashed ${L.ink}` }} />
      <div style={{ position: 'absolute', left: 0, top: height + 14 }}>
        <Mono size={18} color={L.ink} weight={800}>
          {label}
        </Mono>
      </div>
      {Array.from({ length: n }).map((_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const frac = blocks - Math.floor(blocks);
        const drop = i === n - 1 && frac > 0 ? frac : 1;
        const over = i >= capacity;
        const sz = 1 - shrink * 0.45;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: pad + col * (bw + gap) + (bw * (1 - sz)) / 2,
              top: height - pad - (row + 1) * bh - row * gap - (1 - drop) * 220 + (bh * (1 - sz)) / 2,
              width: bw * sz,
              height: bh * sz,
              borderRadius: 10,
              background: over ? A.red : '#DCE1F6',
              border: `2.5px solid ${L.ink}`,
              boxSizing: 'border-box',
              opacity: clamp01(drop * 3),
            }}
          />
        );
      })}
    </div>
  );
};

/** Segmented storage bar (light). Segments past 90% turn red. */
export const StorageBar: React.FC<{ width: number; value: number; p?: number; label?: string; style?: React.CSSProperties }> = ({ width, value, p = 1, label = 'STORAGE', style }) => {
  const segs = 20;
  const v = clamp01(value);
  return (
    <div style={{ position: 'absolute', width, opacity: clamp01(p * 2), translate: `0px ${(1 - clamp01(p)) * 30}px`, ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <Mono size={22} color={L.ink} weight={800}>
          {label}
        </Mono>
        <span style={{ fontFamily: display, fontWeight: 900, fontSize: 44, color: v > 0.9 ? A.red : L.ink }}>{Math.round(v * 100)}%</span>
      </div>
      <div style={{ display: 'flex', gap: 5, padding: 8, borderRadius: 18, border: `3px solid ${L.ink}`, background: L.surface, boxShadow: theme.shadow.card }}>
        {Array.from({ length: segs }).map((_, i) => {
          const fill = clamp01(v * segs - i);
          const red = (i + 1) / segs > 0.9;
          return (
            <div key={i} style={{ flex: 1, height: 54, borderRadius: 6, background: '#E2E4DF', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: red ? A.red : A.blue }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Thermometer (light). `value` 0..1; turns red above 0.6. */
export const Thermometer: React.FC<{ height: number; value: number; p?: number; style?: React.CSSProperties }> = ({ height, value, p = 1, style }) => {
  const v = clamp01(value);
  const col = v > 0.6 ? A.red : A.blue;
  const tube = height - 70;
  return (
    <div style={{ position: 'absolute', width: 90, height, opacity: clamp01(p * 2), translate: `0px ${(1 - clamp01(p)) * 30}px`, ...style }}>
      <div style={{ position: 'absolute', left: 25, top: 0, width: 40, height: tube + 20, borderRadius: 20, border: `3px solid ${L.ink}`, background: L.surface, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 6, right: 6, bottom: 0, height: `${8 + v * 88}%`, background: col, borderRadius: 14 }} />
      </div>
      <div style={{ position: 'absolute', left: 5, top: tube, width: 80, height: 80, borderRadius: 99, border: `3px solid ${L.ink}`, background: col, boxShadow: theme.shadow.card }} />
      {[0.25, 0.5, 0.75].map((m) => (
        <div key={m} style={{ position: 'absolute', left: 70, top: 10 + tube * (1 - m), width: 18, height: 3, background: L.ink }} />
      ))}
    </div>
  );
};

/** Strip of cause chips that fills one at a time (the video's diagnosis list). */
export type CauseChip = { label: string; p: number; hl?: number; tone?: 'ink' | 'green' | 'red' };
export const CauseChips: React.FC<{ items: CauseChip[]; title?: string; style?: React.CSSProperties }> = ({ items, title = 'CAUSES', style }) => (
  <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', gap: 10, ...style }}>
    <Mono size={18} color={L.mono} weight={800}>
      {title}
    </Mono>
    {items.map((it, i) => {
      const q = clamp01(it.p);
      if (q <= 0.001) return <div key={i} style={{ width: 0 }} />;
      const bg = it.tone === 'green' ? A.green : it.tone === 'red' ? A.red : L.ink;
      return (
        <div
          key={i}
          style={{
            padding: '7px 13px',
            borderRadius: 999,
            background: bg,
            border: `2.5px solid ${L.ink}`,
            boxShadow: it.hl ? `0 0 0 ${4 * it.hl}px ${A.yellow}` : undefined,
            opacity: Math.min(1, q * 3),
            scale: `${0.6 + 0.4 * Math.min(it.p, 1.06)}`,
          }}
        >
          <Mono size={18} color="#FFFFFF" weight={800}>
            {it.label}
          </Mono>
        </div>
      );
    })}
  </div>
);

/** Headline-style evidence card (style.md NotifCard): red mono category, Arabic headline, grey lines, blue icon. */
export const NotifCard: React.FC<{ width: number; category: string; headline: string; p?: number; rotate?: number; icon?: React.ReactNode; style?: React.CSSProperties }> = ({
  width,
  category,
  headline,
  p = 1,
  rotate = 0,
  icon,
  style,
}) => (
  <div
    style={{
      position: 'absolute',
      width,
      background: L.surface,
      border: `3px solid ${L.ink}`,
      borderRadius: 20,
      boxShadow: theme.shadow.card,
      padding: '18px 22px 20px',
      boxSizing: 'border-box',
      opacity: clamp01(p * 3),
      translate: `${(1 - clamp01(p)) * 120}px ${(1 - clamp01(p)) * 30}px`,
      rotate: `${rotate * Math.min(1, p)}deg`,
      ...style,
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <span dir="ltr" style={{ fontFamily: mono, fontSize: 18, fontWeight: 800, color: A.red, letterSpacing: theme.type.monoSpacing, textTransform: 'uppercase' }}>
          {category}
        </span>
        <div dir="rtl" lang="ar" style={{ fontFamily: arabic, fontWeight: 800, fontSize: 44, color: L.ink, lineHeight: 1.1 }}>
          {headline}
        </div>
        <div style={{ height: 12, width: '82%', borderRadius: 6, background: '#D6D8D3' }} />
        <div style={{ height: 12, width: '58%', borderRadius: 6, background: '#D6D8D3' }} />
      </div>
      {icon && (
        <div style={{ width: 64, height: 64, borderRadius: 14, background: A.blue, border: `2.5px solid ${L.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
      )}
    </div>
  </div>
);
