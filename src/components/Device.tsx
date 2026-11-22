import React from 'react';
import { display, mono } from '../fonts';
import { theme } from '../theme';
import { ProductGlyph, Sneaker } from './Icons';

const L = theme.light;
const A = theme.accent;

/** Generic flat phone: metallic gray frame, ink outline, island, soft screen. No real logos. */
export const DeviceMock: React.FC<{
  width: number;
  height: number;
  children?: React.ReactNode;
  screen?: string;
  style?: React.CSSProperties;
  flash?: number;
  island?: React.ReactNode;
}> = ({ width, height, children, screen, style, flash = 0, island }) => {
  const bezel = Math.max(8, width * 0.035);
  const r = width * 0.16;
  return (
    <div
      style={{
        position: 'absolute',
        width,
        height,
        borderRadius: r,
        background: 'linear-gradient(145deg, #E3E5E8 0%, #B9BDC4 45%, #D5D8DC 70%, #A9AEB6 100%)',
        border: `3px solid ${L.ink}`,
        boxShadow: theme.shadow.lift,
        boxSizing: 'border-box',
        padding: bezel,
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: r - bezel,
          overflow: 'hidden',
          background: screen ?? 'linear-gradient(170deg, #F3F4F1 0%, #E4E7EA 100%)',
          border: `2px solid rgba(11,15,21,0.55)`,
          boxSizing: 'border-box',
        }}
      >
        {children}
        <div
          style={{
            position: 'absolute',
            top: width * 0.03,
            left: '50%',
            translate: '-50% 0px',
            width: width * 0.3,
            height: width * 0.085,
            borderRadius: 999,
            background: L.ink,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: width * 0.03,
            boxSizing: 'border-box',
          }}
        >
          {island}
        </div>
        {/* glass highlight */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(115deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 32%)',
            pointerEvents: 'none',
          }}
        />
        {flash > 0 && <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF', opacity: flash }} />}
      </div>
      {/* side buttons */}
      <div style={{ position: 'absolute', right: -7, top: height * 0.22, width: 5, height: height * 0.1, borderRadius: 3, background: '#9EA3AB', border: `2px solid ${L.ink}` }} />
      <div style={{ position: 'absolute', left: -7, top: height * 0.18, width: 5, height: height * 0.07, borderRadius: 3, background: '#9EA3AB', border: `2px solid ${L.ink}` }} />
    </div>
  );
};

/** Generic status bar: time, signal, wifi, battery, optional privacy dot. */
export const StatusBar: React.FC<{ width: number; scale?: number; dot?: number; dotColor?: string }> = ({ width, scale = 1, dot = 0, dotColor = A.green }) => {
  const s = scale;
  return (
    <div style={{ position: 'relative', width, height: 44 * s, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${26 * s}px`, boxSizing: 'border-box' }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26 * s, color: L.ink }}>9:41</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 * s }}>
        {dot > 0 && (
          <div style={{ position: 'relative', width: 14 * s, height: 14 * s }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 99, background: dotColor, scale: `${dot}` }} />
          </div>
        )}
        <svg width={30 * s} height={20 * s} viewBox="0 0 30 20">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 8} y={14 - i * 4} width={5.5} height={6 + i * 4} rx={1.5} fill={L.ink} />
          ))}
        </svg>
        <svg width={28 * s} height={20 * s} viewBox="0 0 28 20" fill="none" stroke={L.ink} strokeWidth={3} strokeLinecap="round">
          <path d="M3 7a16 16 0 0122 0M7.5 11.5a9.5 9.5 0 0113 0" />
          <circle cx="14" cy="16.5" r="2" fill={L.ink} stroke="none" />
        </svg>
        <svg width={40 * s} height={20 * s} viewBox="0 0 40 20" fill="none" stroke={L.ink} strokeWidth={2.5}>
          <rect x="1.5" y="2" width="32" height="16" rx="4.5" />
          <rect x="5" y="5.5" width="22" height="9" rx="2" fill={L.ink} stroke="none" />
          <path d="M37 8v4" strokeWidth={3} strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};

export type AdKind = 'shoe' | 'headphones' | 'watch' | 'bag';
const tileColor: Record<AdKind, string> = {
  shoe: '#DCE1F6',
  headphones: '#E3E3DE',
  watch: '#E3E3DE',
  bag: '#E3E3DE',
};
const shoeColors = [A.blue, '#7D8FE0', '#3F55B8'];

/**
 * Feed ad card: product tile, two text lines, "AD" tag, small CTA.
 * `faded` greys it out (not noticed); `highlight` 0..1 adds a yellow outline glow.
 */
export const AdCard: React.FC<{
  width: number;
  kind?: AdKind;
  variant?: number;
  faded?: number;
  highlight?: number;
  style?: React.CSSProperties;
}> = ({ width, kind = 'shoe', variant = 0, faded = 0, highlight = 0, style }) => {
  const h = width * 0.4;
  const tile = h - 20;
  const f = faded;
  return (
    <div
      style={{
        position: 'absolute',
        width,
        height: h,
        borderRadius: 16,
        background: '#FAFAF7',
        border: `${2.5 + highlight * 2.5}px solid ${highlight > 0.02 ? A.yellow : L.ink}`,
        boxShadow: highlight > 0.02 ? `0 0 ${24 * highlight}px rgba(238,206,97,${0.9 * highlight}), 3px 4px 0 rgba(11,15,21,0.12)` : '3px 4px 0 rgba(11,15,21,0.12)',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: width * 0.05,
        padding: 9,
        overflow: 'hidden',
        filter: f > 0 ? `grayscale(${f}) opacity(${1 - f * 0.45})` : undefined,
        ...style,
      }}
    >
      <div
        style={{
          width: tile,
          height: tile,
          flexShrink: 0,
          borderRadius: 11,
          background: tileColor[kind],
          border: `2px solid rgba(11,15,21,0.25)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {kind === 'shoe' ? <Sneaker width={tile * 0.86} stroke={2.4} color={shoeColors[variant % shoeColors.length]} /> : <ProductGlyph kind={kind} size={tile * 0.62} />}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: h * 0.08 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              fontFamily: mono,
              fontWeight: 800,
              fontSize: Math.max(10, width * 0.042),
              letterSpacing: '0.1em',
              color: '#FFFFFF',
              background: kind === 'shoe' ? A.blue : L.inkSoft,
              borderRadius: 5,
              padding: '2px 6px',
            }}
          >
            AD
          </span>
          <div style={{ height: h * 0.1, width: '55%', borderRadius: 4, background: 'rgba(11,15,21,0.7)' }} />
        </div>
        <div style={{ height: h * 0.075, width: '88%', borderRadius: 4, background: 'rgba(11,15,21,0.18)' }} />
        <div style={{ height: h * 0.075, width: '62%', borderRadius: 4, background: 'rgba(11,15,21,0.18)' }} />
        <div style={{ alignSelf: 'flex-start', marginTop: 2, padding: `2px ${width * 0.03}px`, borderRadius: 99, border: `2px solid ${L.ink}`, fontFamily: mono, fontWeight: 800, fontSize: Math.max(9, width * 0.036), letterSpacing: '0.08em', color: L.ink }}>
          SHOP
        </div>
      </div>
    </div>
  );
};

/**
 * Vertical feed of ad cards inside a phone screen. Items can pop in (appear[i] 0..1),
 * be faded or highlighted. `scroll` shifts the list up in px.
 */
export const PhoneFeed: React.FC<{
  width: number;
  items: { kind: AdKind; variant?: number }[];
  appear?: (i: number) => number;
  faded?: (i: number) => number;
  highlight?: (i: number) => number;
  scroll?: number;
  top?: number;
  gap?: number;
}> = ({ width, items, appear = () => 1, faded = () => 0, highlight = () => 0, scroll = 0, top = 60, gap = 14 }) => {
  const cardW = width - 28;
  const h = cardW * 0.4;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {items.map((it, i) => {
        const a = appear(i);
        if (a <= 0.001) return null;
        return (
          <AdCard
            key={i}
            width={cardW}
            kind={it.kind}
            variant={it.variant ?? i}
            faded={faded(i)}
            highlight={highlight(i)}
            style={{
              left: 14,
              top: top + i * (h + gap) - scroll,
              opacity: Math.min(1, a * 2),
              translate: `0px ${(1 - Math.min(a, 1)) * 60}px`,
              scale: `${0.9 + 0.1 * a}`,
            }}
          />
        );
      })}
    </div>
  );
};
