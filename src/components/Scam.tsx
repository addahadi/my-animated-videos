import React from 'react';
import { arabic, display } from '../fonts';
import { theme } from '../theme';
import { LockIcon } from './Icons';
import { Mono } from './Labels';

const L = theme.light;
const D = theme.dark;
const A = theme.accent;

/* ------------------------------------------------------------------ link preview */

/** Invented neon-city thumbnail (no game art): navy sky, yellow sun, ink skyline with lit windows. */
const CityThumb: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const towers = [
    [0.02, 0.5, 0.1], [0.12, 0.32, 0.09], [0.22, 0.58, 0.08], [0.3, 0.22, 0.11], [0.42, 0.45, 0.08],
    [0.5, 0.3, 0.1], [0.61, 0.52, 0.07], [0.68, 0.18, 0.1], [0.79, 0.42, 0.09], [0.88, 0.28, 0.11],
  ];
  return (
    <svg width={width} height={height} viewBox="0 0 100 56" preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="cityThumbSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={D.bg} />
          <stop offset="1" stopColor="#7A4A6A" />
        </linearGradient>
      </defs>
      <rect width="100" height="56" fill="url(#cityThumbSky)" />
      <circle cx="72" cy="30" r="13" fill={A.yellow} opacity="0.95" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x="58" y={31 + i * 3.2} width="28" height="1.3" fill="#7A4A6A" />
      ))}
      {towers.map(([x, top, w], i) => (
        <g key={i}>
          <rect x={x * 100} y={top * 56 + 6} width={w * 100} height={56} fill={L.ink} />
          {[0, 1, 2, 3, 4].map((r) =>
            [0, 1].map((c) => (
              <rect key={`${r}${c}`} x={x * 100 + 1.6 + c * (w * 100 - 4) / 2} y={top * 56 + 9 + r * 5} width="1.4" height="1.8" fill={(i + r + c) % 3 === 0 ? A.red : A.blue} opacity="0.9" />
            )),
          )}
        </g>
      ))}
      {/* palm silhouette */}
      <path d="M12 56 L13.5 36" stroke={L.ink} strokeWidth="1.4" />
      <path d="M13.5 36 Q6 33 3 37 M13.5 36 Q9 30 4 30 M13.5 36 Q18 30 23 31 M13.5 36 Q20 34 23 38" stroke={L.ink} strokeWidth="1.6" fill="none" />
    </svg>
  );
};

/**
 * LinkCard: a chat link preview (thumbnail, bold title, meta line, domain, DOWNLOAD chip).
 * Invented copy and art only. `pulse` 0..1 glows the chip, `press` squashes it.
 */
export const LinkCard: React.FC<{
  width: number;
  title: string;
  meta?: string;
  domain?: string;
  cta?: string;
  pulse?: number;
  press?: number;
  style?: React.CSSProperties;
}> = ({ width, title, meta = '2.1 GB · DIRECT DOWNLOAD', domain = 'gta6-free-pc.download', cta = 'DOWNLOAD', pulse = 0, press = 0, style }) => {
  const s = width / 600;
  return (
    <div
      style={{
        position: 'absolute',
        width,
        background: L.surface,
        border: `3px solid ${L.ink}`,
        borderRadius: 26 * s,
        boxShadow: theme.shadow.lift,
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{ position: 'relative', borderBottom: `3px solid ${L.ink}` }}>
        <CityThumb width={width - 6} height={(width - 6) * 0.5} />
        <div style={{ position: 'absolute', left: 16 * s, top: 14 * s, background: L.ink, borderRadius: 8 * s, padding: `${5 * s}px ${10 * s}px` }}>
          <Mono size={16 * s} color="#F4F4F0" weight={800}>
            {domain}
          </Mono>
        </div>
      </div>
      <div style={{ padding: `${18 * s}px ${22 * s}px ${22 * s}px`, display: 'flex', alignItems: 'center', gap: 16 * s }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 * s }}>
          <span dir="ltr" style={{ fontFamily: display, fontWeight: 900, fontSize: 46 * s, lineHeight: 1, color: L.ink, whiteSpace: 'nowrap' }}>
            {title}
          </span>
          <Mono size={17 * s} color={L.mono}>
            {meta}
          </Mono>
        </div>
        <div
          style={{
            padding: `${14 * s}px ${20 * s}px`,
            borderRadius: 14 * s,
            background: A.green,
            border: `3px solid ${L.ink}`,
            boxShadow: `0 0 ${34 * pulse * s}px ${10 * pulse * s}px rgba(50,175,122,${0.55 * pulse})`,
            scale: `${1 + pulse * 0.06 - press * 0.12}`,
          }}
        >
          <Mono size={20 * s} color="#FFFFFF" weight={800}>
            ↓ {cta}
          </Mono>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ platforms */

export type PlatformKind = 'console' | 'pc' | 'phone';

const PlatformArt: React.FC<{ kind: PlatformKind; size: number }> = ({ kind, size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={L.ink} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round">
    {kind === 'console' && (
      <>
        <rect x="18" y="14" width="40" height="72" rx="6" fill="#F6F6F2" />
        <path d="M24 26 H52 M24 34 H44" opacity="0.5" />
        <circle cx="38" cy="72" r="4" fill={L.ink} />
        {/* generic controller */}
        <path d="M60 60 Q60 50 70 50 H84 Q94 50 94 60 L96 76 Q96 84 89 82 L84 76 H70 L65 82 Q58 84 58 76 Z" fill="#E4E7F3" />
        <path d="M68 62 V70 M64 66 H72" />
        <circle cx="86" cy="64" r="2.4" fill={L.ink} />
      </>
    )}
    {kind === 'pc' && (
      <>
        <rect x="10" y="16" width="80" height="52" rx="6" fill="#F6F6F2" />
        <rect x="17" y="23" width="66" height="38" rx="3" fill="#DCE1F6" />
        <path d="M42 68 L38 84 H62 L58 68" fill="#F6F6F2" />
        <path d="M32 86 H68" />
      </>
    )}
    {kind === 'phone' && (
      <>
        <rect x="30" y="8" width="40" height="84" rx="9" fill="#F6F6F2" />
        <rect x="36" y="18" width="28" height="60" rx="3" fill="#DCE1F6" />
        <path d="M46 85 H54" />
      </>
    )}
  </svg>
);

/** PlatformBox: a generic device (no brand marks) with a Latin label and a check / cross verdict. */
export const PlatformBox: React.FC<{
  kind: PlatformKind;
  label: string;
  verdict: 'yes' | 'no';
  verdictP?: number;
  p?: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({ kind, label, verdict, verdictP = 0, p = 1, size = 190, style }) => {
  const yes = verdict === 'yes';
  const v = Math.min(1, Math.max(0, verdictP));
  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        opacity: Math.min(1, p * 3),
        translate: `0px ${(1 - Math.min(1, p)) * 60}px`,
        scale: `${0.7 + 0.3 * p}`,
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          borderRadius: theme.radius.card,
          background: L.surface,
          border: `3px solid ${v > 0.5 ? (yes ? A.green : A.red) : L.ink}`,
          boxShadow: theme.shadow.card,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: !yes && v > 0.5 ? 'grayscale(0.6)' : undefined,
        }}
      >
        <PlatformArt kind={kind} size={size * 0.72} />
        {v > 0 && (
          <div
            style={{
              position: 'absolute',
              right: -18,
              top: -18,
              width: 64,
              height: 64,
              borderRadius: 99,
              background: yes ? A.green : A.red,
              border: `3px solid ${L.ink}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontFamily: display,
              fontWeight: 900,
              fontSize: 40,
              lineHeight: 1,
              scale: `${0.4 + 0.6 * verdictP}`,
              opacity: v,
            }}
          >
            {yes ? '✓' : '✕'}
          </div>
        )}
      </div>
      <Mono size={26} color={L.ink} weight={800}>
        {label}
      </Mono>
    </div>
  );
};

/* ------------------------------------------------------------------ files */

/** FileChip: file icon with a Latin filename and an extension badge. `wobble` in degrees. */
export const FileChip: React.FC<{ name: string; ext: string; p?: number; wobble?: number; tone?: 'ink' | 'red'; size?: number; style?: React.CSSProperties }> = ({
  name,
  ext,
  p = 1,
  wobble = 0,
  tone = 'ink',
  size = 1,
  style,
}) => (
  <div
    style={{
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12 * size,
      opacity: Math.min(1, p * 3),
      scale: `${(0.6 + 0.4 * p) * size}`,
      rotate: `${wobble}deg`,
      ...style,
    }}
  >
    <svg width={120} height={150} viewBox="0 0 120 150" style={{ overflow: 'visible', filter: 'drop-shadow(5px 7px 0 rgba(11,15,21,0.16))' }}>
      <path d="M8 6 H80 L112 38 V144 H8 Z" fill={L.surface} stroke={L.ink} strokeWidth={4} strokeLinejoin="round" />
      <path d="M80 6 V38 H112" fill="#DCDDD8" stroke={L.ink} strokeWidth={4} strokeLinejoin="round" />
      <rect x="-6" y="80" width="98" height="40" rx="8" fill={tone === 'red' ? A.red : L.ink} />
      <text x="43" y="108" textAnchor="middle" fontFamily={display} fontWeight={900} fontSize="24" fill="#FFFFFF">
        .{ext.toUpperCase()}
      </text>
    </svg>
    <div style={{ background: L.surface, border: `2.5px solid ${L.ink}`, borderRadius: 10, padding: '6px 12px' }}>
      <Mono size={20} color={L.ink} weight={800} style={{ textTransform: 'none', letterSpacing: '0.02em' }}>
        {name}
      </Mono>
    </div>
  </div>
);

/* ------------------------------------------------------------------ thief */

/** ThiefGlyph: round masked "bandit" face (generic, no character). 48x48 viewBox like the icon set. */
export const ThiefGlyph: React.FC<{ size?: number; fill?: string; color?: string; style?: React.CSSProperties }> = ({ size = 48, fill = A.red, color = L.ink, style }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" style={{ display: 'block', overflow: 'visible', ...style }}>
    <path d="M10 18 Q10 6 24 6 Q38 6 38 18" fill={color} />
    <path d="M7 18 H41" />
    <circle cx="24" cy="27" r="15" fill={fill} />
    <path d="M9.5 24 Q24 18 38.5 24 V30 Q24 25 9.5 30 Z" fill={color} />
    <circle cx="18" cy="26.5" r="2.4" fill="#FFFFFF" stroke="none" />
    <circle cx="30" cy="26.5" r="2.4" fill="#FFFFFF" stroke="none" />
    <path d="M19 36 Q24 33 29 36" />
  </svg>
);

/* ------------------------------------------------------------------ login */

/**
 * LoginGate: a generic sign-in card. `strike` 0..1 crosses out the password row,
 * `open` 0..1 flips the status bar from LOCKED (red) to WELCOME BACK (green).
 */
export const LoginGate: React.FC<{ width: number; strike?: number; open?: number; p?: number; account?: string; style?: React.CSSProperties }> = ({
  width,
  strike = 0,
  open = 0,
  p = 1,
  account = 'ACCOUNT',
  style,
}) => {
  const ok = open > 0.5;
  return (
    <div
      style={{
        position: 'absolute',
        width,
        background: L.surface,
        border: `3px solid ${L.ink}`,
        borderRadius: theme.radius.card,
        boxShadow: theme.shadow.lift,
        padding: '22px 26px 26px',
        boxSizing: 'border-box',
        opacity: Math.min(1, p * 3),
        scale: `${0.85 + 0.15 * p}`,
        ...style,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <Mono size={24} color={L.ink} weight={800}>
          {account}
        </Mono>
        <Mono size={18} color={L.mono}>
          LOG IN
        </Mono>
      </div>
      {[
        { k: 'USER', v: 'you@mail.com' },
        { k: 'PASSWORD', v: '●●●●●●●●' },
      ].map((r, i) => (
        <div key={r.k} style={{ position: 'relative', marginBottom: 14 }}>
          <Mono size={15} color={L.mono}>
            {r.k}
          </Mono>
          <div style={{ marginTop: 6, height: 62, borderRadius: 14, border: `2.5px solid ${L.ink}`, background: '#F6F6F2', display: 'flex', alignItems: 'center', padding: '0 18px' }}>
            <span dir="ltr" style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: i === 1 && strike > 0.5 ? L.faded : L.ink }}>
              {r.v}
            </span>
          </div>
          {i === 1 && strike > 0 && (
            <div style={{ position: 'absolute', left: -8, top: 52, height: 7, width: `calc(${strike * 100}% + 16px)`, background: A.red, borderRadius: 4, rotate: '-3deg' }} />
          )}
        </div>
      ))}
      <div
        style={{
          marginTop: 8,
          height: 70,
          borderRadius: 14,
          background: ok ? A.green : L.ink,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          scale: `${1 + Math.max(0, Math.sin(Math.min(1, open) * Math.PI)) * 0.06}`,
        }}
      >
        <LockIcon size={34} open={open} color="#FFFFFF" />
        <Mono size={24} color="#FFFFFF" weight={800}>
          {ok ? 'WELCOME BACK' : 'LOCKED'}
        </Mono>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ hardware */

/** FanTower: blueprint PC tower with a spinning fan. `angle` in degrees (from the clock), `heat` 0..1 tints the vents red. */
export const FanTower: React.FC<{ height: number; angle: number; heat?: number; p?: number; style?: React.CSSProperties }> = ({ height, angle, heat = 0, p = 1, style }) => {
  const w = height * 0.52;
  const fan = w * 0.62;
  const hot = Math.min(1, Math.max(0, heat));
  return (
    <div
      style={{
        position: 'absolute',
        width: w,
        height,
        borderRadius: 22,
        background: D.panel,
        border: `3px solid ${D.glow}`,
        boxShadow: `0 0 ${26 + hot * 40}px rgba(${hot > 0.5 ? '230,88,86' : '92,131,165'},${0.5 + hot * 0.3})`,
        opacity: Math.min(1, p * 3),
        translate: `0px ${(1 - Math.min(1, p)) * 50}px`,
        ...style,
      }}
    >
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: 'absolute', left: w * 0.14, right: w * 0.14, top: height * (0.08 + i * 0.06), height: 6, borderRadius: 3, background: i === 0 ? D.marker : 'rgba(179,226,251,0.35)' }} />
      ))}
      <svg width={fan} height={fan} viewBox="-50 -50 100 100" style={{ position: 'absolute', left: (w - fan) / 2, top: height * 0.4 }}>
        <circle r="47" fill={D.bg} stroke={D.text} strokeWidth="3" />
        <g style={{ transform: `rotate(${angle}deg)` }}>
          {[0, 72, 144, 216, 288].map((a) => (
            <path key={a} d="M0 0 C 10 -12, 30 -18, 38 -6 C 26 -4, 12 2, 0 0 Z" fill={hot > 0.5 ? A.red : D.mono} opacity="0.9" transform={`rotate(${a})`} />
          ))}
        </g>
        <circle r="8" fill={D.text} />
      </svg>
      <div style={{ position: 'absolute', left: w * 0.2, right: w * 0.2, bottom: height * 0.07, height: 10, borderRadius: 5, background: hot > 0.5 ? A.red : D.marker }} />
    </div>
  );
};

/* ------------------------------------------------------------------ series */

/** SeriesPill: the "صح ولا كذب؟" verdict-series badge, optional episode number (Latin). */
export const SeriesPill: React.FC<{ ep?: string; p?: number; size?: number; mode?: 'light' | 'dark'; style?: React.CSSProperties }> = ({ ep, p = 1, size = 34, mode = 'light', style }) => {
  const dark = mode === 'dark';
  return (
    <div
      dir="rtl"
      style={{
        position: 'absolute',
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.4,
        padding: `${size * 0.28}px ${size * 0.6}px ${size * 0.18}px`,
        borderRadius: 999,
        background: dark ? D.panel : L.pill,
        border: dark ? `2px solid ${D.glow}` : `none`,
        boxShadow: theme.shadow.card,
        opacity: Math.min(1, p * 3),
        scale: `${0.7 + 0.3 * p}`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span style={{ fontFamily: display, fontWeight: 900, fontSize: size * 0.8, color: A.green, lineHeight: 1 }}>✓</span>
      <span style={{ fontFamily: arabic, fontWeight: 800, fontSize: size, color: '#F4F4F0', lineHeight: 1 }}>صح ولا كذب؟</span>
      <span style={{ fontFamily: display, fontWeight: 900, fontSize: size * 0.8, color: A.red, lineHeight: 1 }}>✕</span>
      {ep && (
        <span dir="ltr" style={{ fontFamily: display, fontWeight: 900, fontSize: size * 0.7, color: A.yellow, lineHeight: 1, paddingBottom: size * 0.08 }}>
          · {ep}
        </span>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ loot */

/** LootBag: the thief's sack (stolen data goes here). `fill` 0..1 makes it bulge, `bump` 0..1 squashes on each catch. */
export const LootBag: React.FC<{ size?: number; fill?: number; bump?: number; p?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  size = 200,
  fill = 0,
  bump = 0,
  p = 1,
  style,
  children,
}) => {
  const f = Math.min(1, Math.max(0, fill));
  const w = 70 + 22 * f;
  return (
    <div style={{ position: 'absolute', width: size, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: Math.min(1, p * 3), scale: `${(0.6 + 0.4 * p) * (1 + bump * 0.08)} ${(0.6 + 0.4 * p) * (1 - bump * 0.06)}`, transformOrigin: '50% 100%', ...style }}>
      <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: 'visible', filter: 'drop-shadow(5px 8px 0 rgba(11,15,21,0.25))' }}>
        <path d={`M${100 - 26} 52 Q${100 - w} 70 ${100 - w} 130 Q${100 - w} 188 100 188 Q${100 + w} 188 ${100 + w} 130 Q${100 + w} 70 ${100 + 26} 52 Z`} fill={A.beige} stroke={L.ink} strokeWidth={5} strokeLinejoin="round" />
        <path d="M70 52 Q100 62 130 52" stroke={L.ink} strokeWidth={5} fill="none" />
        <path d="M78 50 L64 22 M100 48 V16 M122 50 L136 22" stroke={L.ink} strokeWidth={5} strokeLinecap="round" />
        <rect x="70" y="44" width="60" height="14" rx="6" fill={A.red} stroke={L.ink} strokeWidth={4} />
        <text x="100" y="146" textAnchor="middle" fontFamily={display} fontWeight={900} fontSize={60} fill={L.ink}>
          $
        </text>
      </svg>
      {children}
    </div>
  );
};
