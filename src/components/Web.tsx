import React from 'react';
import { arabic, display } from '../fonts';
import { theme } from '../theme';
import { Mono } from './Labels';

const L = theme.light;
const D = theme.dark;
const A = theme.accent;

/* ------------------------------------------------------------------ icons (48x48, ink stroke) */

const Svg: React.FC<{ size?: number; color?: string; stroke?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  size = 48,
  color = L.ink,
  stroke = 3,
  style,
  children,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', overflow: 'visible', ...style }}>
    {children}
  </svg>
);

/** round cookie with chips (generic) */
export const CookieIcon: React.FC<{ size?: number; color?: string; fill?: string; stroke?: number }> = ({ size = 48, color = L.ink, fill = A.yellow, stroke = 3 }) => (
  <Svg size={size} color={color} stroke={stroke}>
    <path d="M24 5a19 19 0 1 0 19 19 6 6 0 0 1-7-6 6 6 0 0 1-6-6 6 6 0 0 1-6-7z" fill={fill} />
    {[
      [16, 20],
      [27, 30],
      [17, 32],
      [33, 21],
      [24, 22],
    ].map(([x, y]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" fill={color} stroke="none" />
    ))}
  </Svg>
);

export const NewsIcon: React.FC<{ size?: number; color?: string; fill?: string }> = ({ size = 48, color = L.ink, fill = 'none' }) => (
  <Svg size={size} color={color}>
    <rect x="6" y="8" width="30" height="32" rx="3" fill={fill} />
    <path d="M36 16h6v20a4 4 0 0 1-4 4H10" />
    <path d="M12 16h18M12 23h18M12 30h11" strokeWidth={2.4} />
  </Svg>
);

export const PhoneGlyph: React.FC<{ size?: number; color?: string; fill?: string }> = ({ size = 48, color = L.ink, fill = 'none' }) => (
  <Svg size={size} color={color}>
    <rect x="13" y="4" width="22" height="40" rx="5" fill={fill} />
    <path d="M21 37h6" />
  </Svg>
);

export const ShirtIcon: React.FC<{ size?: number; color?: string; fill?: string; stroke?: number }> = ({ size = 48, color = L.ink, fill = A.blue, stroke = 3 }) => (
  <Svg size={size} color={color} stroke={stroke}>
    <path d="M17 7l-11 6 4 9 5-2v21h18V20l5 2 4-9-11-6c-1 3-4 5-7 5s-6-2-7-5z" fill={fill} />
  </Svg>
);

export const StarShape: React.FC<{ size?: number; fill?: string }> = ({ size = 30, fill = A.yellow }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.2l7.1-.6z" fill={fill} />
  </svg>
);

export const UserGlyph: React.FC<{ size?: number; color?: string; fill?: string }> = ({ size = 48, color = L.ink, fill = 'none' }) => (
  <Svg size={size} color={color}>
    <circle cx="24" cy="17" r="8" fill={fill} />
    <path d="M9 41c1-9 7-14 15-14s14 5 15 14" fill={fill} />
  </Svg>
);

/* ------------------------------------------------------------------ the spine object */

/**
 * TicketChip: the yellow ID ticket (a cookie, a pressing ticket, a session id...).
 * Notched ticket shape, mono kicker on top, big ID number. `glow` 0..1 adds a halo.
 */
export const TicketChip: React.FC<{
  id: string;
  kicker?: string;
  width?: number;
  tone?: 'yellow' | 'red' | 'paper';
  glow?: number;
  mode?: 'light' | 'dark';
  style?: React.CSSProperties;
}> = ({ id, kicker = 'COOKIE', width = 260, tone = 'yellow', glow = 0, mode = 'light', style }) => {
  const h = width * 0.46;
  const fill = tone === 'yellow' ? A.yellow : tone === 'red' ? '#F3B2B0' : L.surface;
  const ink = mode === 'dark' && tone === 'paper' ? L.ink : L.ink;
  const halo = tone === 'red' ? A.red : tone === 'yellow' ? (mode === 'dark' ? D.delta : A.yellow) : A.green;
  const r = h * 0.16; // notch radius
  const s = width / 260;
  return (
    <div style={{ position: 'absolute', width, height: h, ...style }}>
      <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} style={{ position: 'absolute', inset: 0, overflow: 'visible', filter: glow > 0 ? `drop-shadow(0 0 ${22 * glow}px ${halo})` : undefined }}>
        <path
          d={`M${14 * s} 2 H${width - 14 * s} a${12 * s} ${12 * s} 0 0 1 ${12 * s} ${12 * s} V${h / 2 - r} a${r} ${r} 0 0 0 0 ${2 * r} V${h - 14 * s} a${12 * s} ${12 * s} 0 0 1 -${12 * s} ${12 * s} H${14 * s} a${12 * s} ${12 * s} 0 0 1 -${12 * s} -${12 * s} V${h / 2 + r} a${r} ${r} 0 0 0 0 -${2 * r} V${14 * s} a${12 * s} ${12 * s} 0 0 1 ${12 * s} -${12 * s} z`}
          fill={fill}
          stroke={ink}
          strokeWidth={3}
          style={{ filter: mode === 'light' ? 'drop-shadow(4px 6px 0 rgba(11,15,21,0.16))' : undefined }}
        />
        <path d={`M${width * 0.3} ${10 * s} V${h - 10 * s}`} stroke={ink} strokeWidth={2.2} strokeDasharray={`${6 * s} ${6 * s}`} opacity={0.5} />
      </svg>
      <div style={{ position: 'absolute', left: 0, top: 0, width: width * 0.3, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CookieIcon size={width * 0.17} fill={tone === 'red' ? A.red : tone === 'paper' ? L.faded : '#F7E3A0'} />
      </div>
      <div style={{ position: 'absolute', left: width * 0.33, right: 8 * s, top: 0, height: h, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 * s }}>
        <Mono size={Math.max(12, 17 * s)} color={ink} weight={800} style={{ opacity: 0.75 }}>
          {kicker}
        </Mono>
        <span dir="ltr" style={{ fontFamily: display, fontWeight: 900, fontSize: 44 * s, lineHeight: 1, color: ink, letterSpacing: '-0.01em' }}>
          {id}
        </span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ browser + banner */

/** Minimal browser window card: dot bar + mono URL pill + content area (children, absolutely positioned). */
export const BrowserCard: React.FC<{
  width: number;
  height: number;
  url: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  barRight?: React.ReactNode;
}> = ({ width, height, url, children, style, barRight }) => {
  const bar = 62;
  return (
    <div
      style={{
        position: 'absolute',
        width,
        height,
        background: L.surface,
        border: `3px solid ${L.ink}`,
        borderRadius: theme.radius.card,
        boxShadow: theme.shadow.card,
        boxSizing: 'border-box',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: bar, borderBottom: `3px solid ${L.ink}`, background: '#E4E5E0', display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', boxSizing: 'border-box' }}>
        {[A.red, A.yellow, A.green].map((c) => (
          <div key={c} style={{ width: 14, height: 14, borderRadius: 99, background: c, border: `2px solid ${L.ink}` }} />
        ))}
        <div style={{ flex: 1, marginLeft: 8, height: 34, borderRadius: 999, background: L.surface, border: `2px solid ${L.ink}`, display: 'flex', alignItems: 'center', padding: '0 14px', overflow: 'hidden' }}>
          <Mono size={17} color={L.ink} weight={700} style={{ textTransform: 'none', letterSpacing: '0.02em' }}>
            {url}
          </Mono>
        </div>
        {barRight}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: bar, bottom: 0 }}>{children}</div>
    </div>
  );
};

/**
 * Generic cookie-consent banner (invented copy, no real brand). Buttons carry a 0..1 highlight
 * in their own tone; `press` 0..1 squashes the pressed button.
 */
export const ConsentBanner: React.FC<{
  width: number;
  buttons: { label: string; tone: 'ink' | 'outline'; hl?: number; hlColor?: string; press?: number }[];
  style?: React.CSSProperties;
  scale?: number;
}> = ({ width, buttons, style, scale = 1 }) => {
  const s = scale;
  return (
    <div
      style={{
        position: 'absolute',
        width,
        background: L.surface,
        border: `3px solid ${L.ink}`,
        borderRadius: 22 * s,
        boxShadow: theme.shadow.lift,
        padding: `${20 * s}px ${22 * s}px ${22 * s}px`,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 * s }}>
        <CookieIcon size={46 * s} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 * s, flex: 1 }}>
          <Mono size={19 * s} color={L.ink} weight={800}>
            THIS SITE USES COOKIES
          </Mono>
          <div style={{ height: 8 * s, width: '92%', borderRadius: 9, background: '#D5D7D2' }} />
          <div style={{ height: 8 * s, width: '70%', borderRadius: 9, background: '#D5D7D2' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12 * s, marginTop: 18 * s }}>
        {buttons.map((b) => {
          const hl = b.hl ?? 0;
          const col = b.hlColor ?? A.green;
          const ink = b.tone === 'ink';
          return (
            <div
              key={b.label}
              style={{
                flex: 1,
                height: 58 * s,
                borderRadius: 14 * s,
                border: `3px solid ${hl > 0.5 ? col : L.ink}`,
                background: hl > 0.01 ? col : ink ? L.ink : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                scale: `${1 - 0.08 * (b.press ?? 0)}`,
                boxShadow: hl > 0.01 ? `0 0 ${24 * hl}px ${col}` : 'none',
              }}
            >
              <Mono size={20 * s} color={ink || hl > 0.01 ? '#F4F4F0' : L.ink} weight={800}>
                {b.label}
              </Mono>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ profile + term */

/** A file about "you" that fills row by row. Each row: icon, Arabic text (RTL), `p` 0..1 and `hl` 0..1. */
export const ProfileCard: React.FC<{
  width: number;
  title: string;
  rows: { icon: React.ReactNode; text: string; p: number; hl?: number }[];
  mode?: 'light' | 'dark';
  style?: React.CSSProperties;
  rowH?: number;
  textSize?: number;
}> = ({ width, title, rows, mode = 'light', style, rowH = 96, textSize = 46 }) => {
  const dark = mode === 'dark';
  return (
    <div
      style={{
        position: 'absolute',
        width,
        background: dark ? 'rgba(51,74,106,0.95)' : L.surface,
        border: `3px solid ${dark ? D.glow : L.ink}`,
        borderRadius: theme.radius.card,
        boxShadow: dark ? `0 0 26px rgba(92,131,165,0.55)` : theme.shadow.lift,
        padding: '20px 22px 22px',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <div style={{ width: 58, height: 58, borderRadius: 99, background: dark ? D.bg : '#DCDDD8', border: `3px solid ${dark ? D.text : L.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <UserGlyph size={38} color={dark ? D.text : L.ink} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Mono size={26} color={dark ? D.text : L.ink} weight={800}>
            {title}
          </Mono>
          <Mono size={17} color={dark ? D.mono : L.mono}>
            PROFILE · AUTO-BUILT
          </Mono>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rows.map((r, i) => {
          const hl = r.hl ?? 0;
          if (r.p <= 0.001) return <div key={i} style={{ height: rowH, borderRadius: 16, border: `2px dashed ${dark ? 'rgba(179,226,251,0.25)' : 'rgba(11,15,21,0.15)'}`, boxSizing: 'border-box' }} />;
          return (
            <div
              key={i}
              dir="rtl"
              style={{
                height: rowH,
                borderRadius: 16,
                border: `3px solid ${hl > 0.5 ? (dark ? D.delta : A.gold) : dark ? 'rgba(179,226,251,0.35)' : L.ink}`,
                background: hl > 0.01 ? (dark ? 'rgba(230,207,109,0.16)' : A.beige) : dark ? 'rgba(34,43,68,0.6)' : '#F4F4F0',
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                padding: '0 20px',
                boxSizing: 'border-box',
                opacity: Math.min(1, r.p * 2.5),
                translate: `${(1 - Math.min(1, r.p)) * -40}px 0px`,
              }}
            >
              {r.icon}
              <span style={{ fontFamily: arabic, fontWeight: 800, fontSize: textSize, color: dark ? D.text : L.ink, paddingTop: 6, whiteSpace: 'nowrap' }}>{r.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Term pin: a Latin tech term (ink pill) with its Arabic gloss underneath. */
export const TermLabel: React.FC<{ term: string; gloss: string; p?: number; mode?: 'light' | 'dark'; style?: React.CSSProperties; size?: number }> = ({
  term,
  gloss,
  p = 1,
  mode = 'light',
  style,
  size = 40,
}) => {
  const dark = mode === 'dark';
  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        opacity: Math.min(1, p * 3),
        scale: `${0.7 + 0.3 * p}`,
        ...style,
      }}
    >
      <div style={{ background: dark ? D.panel : L.ink, border: dark ? `3px solid ${D.marker}` : 'none', boxShadow: dark ? `0 0 20px rgba(129,225,200,0.45)` : theme.shadow.card, borderRadius: 16, padding: `${size * 0.3}px ${size * 0.6}px` }}>
        <span dir="ltr" style={{ fontFamily: display, fontWeight: 900, fontSize: size, color: '#F4F4F0', lineHeight: 1, whiteSpace: 'nowrap' }}>
          {term}
        </span>
      </div>
      <div dir="rtl" style={{ fontFamily: arabic, fontWeight: 800, fontSize: size * 0.95, color: dark ? D.text : L.ink, lineHeight: 1.1, whiteSpace: 'nowrap' }}>
        {gloss}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ world */

// rough continents as ellipses in a 0..1 box (stylized dots, not a real map)
const LAND: [number, number, number, number][] = [
  [0.2, 0.3, 0.13, 0.14], // north america
  [0.14, 0.18, 0.08, 0.08],
  [0.29, 0.66, 0.06, 0.16], // south america
  [0.5, 0.25, 0.07, 0.08], // europe
  [0.52, 0.55, 0.08, 0.17], // africa
  [0.7, 0.3, 0.17, 0.14], // asia
  [0.73, 0.5, 0.06, 0.07],
  [0.85, 0.75, 0.07, 0.07], // australia
];
const inLand = (x: number, y: number) => LAND.some(([cx, cy, rx, ry]) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1);

/** Dotted world outline (stylized). `p` 0..1 reveals dots left to right. */
export const WorldDots: React.FC<{ width: number; height: number; p?: number; color?: string; style?: React.CSSProperties }> = ({
  width,
  height,
  p = 1,
  color = '#9CA29C',
  style,
}) => {
  const step = 22;
  const dots: [number, number][] = [];
  for (let y = step / 2; y < height; y += step) {
    for (let x = step / 2; x < width; x += step) {
      if (inLand(x / width, y / height)) dots.push([x, y]);
    }
  }
  return (
    <svg width={width} height={height} style={{ position: 'absolute', overflow: 'visible', ...style }}>
      {dots.map(([x, y]) => {
        const o = Math.max(0, Math.min(1, p * 1.4 - (x / width) * 0.4));
        return <circle key={`${x}-${y}`} cx={x} cy={y} r={6.5} fill={color} opacity={o} />;
      })}
    </svg>
  );
};
