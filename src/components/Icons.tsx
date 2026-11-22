import React from 'react';
import { theme } from '../theme';

// Flat line icons, 48x48 viewBox, ink stroke. Generic shapes only (no real logos).
export type IconProps = {
  size?: number;
  color?: string;
  fill?: string;
  stroke?: number;
  style?: React.CSSProperties;
};

const Svg: React.FC<IconProps & { children: React.ReactNode }> = ({ size = 48, color = theme.light.ink, stroke = 3, style, children }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'block', overflow: 'visible', ...style }}
  >
    {children}
  </svg>
);

export const MicIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="17" y="5" width="14" height="24" rx="7" fill={p.fill ?? 'none'} />
    <path d="M11 22c0 7.2 5.8 13 13 13s13-5.8 13-13" />
    <path d="M24 35v8M17 43h14" />
    <path d="M17 14h5M17 20h5" strokeWidth={(p.stroke ?? 3) * 0.7} />
  </Svg>
);

export const EarIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M14 20c0-7.7 5.6-14 13-14s12 5.6 12 12.5c0 5.8-3 8.6-6 11.3-2.6 2.3-3 4.4-3.6 7.2C28.6 41.3 26 43 23 43c-3.4 0-6-2.4-6-5.6" fill={p.fill ?? 'none'} />
    <path d="M21 20.5c0-3.4 2.6-6 6-6s5.6 2.5 5.6 5.6c0 2.6-1.6 3.8-3 4.9-1.4 1-2 2.1-2 3.6" />
  </Svg>
);

export const EyeIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M3 24s7.6-13 21-13 21 13 21 13-7.6 13-21 13S3 24 3 24z" fill={p.fill ?? 'none'} />
    <circle cx="24" cy="24" r="7" />
    <circle cx="24" cy="24" r="2.5" fill={p.color ?? theme.light.ink} stroke="none" />
  </Svg>
);

export const PinIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M24 44S9 29.5 9 19a15 15 0 0130 0c0 10.5-15 25-15 25z" fill={p.fill ?? 'none'} />
    <circle cx="24" cy="19" r="5.5" fill={theme.light.surface} />
  </Svg>
);

export const WifiIcon: React.FC<IconProps & { level?: number }> = ({ level = 3, ...p }) => (
  <Svg {...p}>
    <circle cx="24" cy="38" r="2.6" fill={p.color ?? theme.light.ink} stroke="none" />
    <path d="M17 31a10 10 0 0114 0" opacity={level >= 1 ? 1 : 0.15} />
    <path d="M11 25a18.5 18.5 0 0126 0" opacity={level >= 2 ? 1 : 0.15} />
    <path d="M5 19a27 27 0 0138 0" opacity={level >= 3 ? 1 : 0.15} />
  </Svg>
);

export const HouseIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M6 22L24 7l18 15" />
    <path d="M10 19v22h28V19" fill={p.fill ?? 'none'} />
    <path d="M20 41V29h8v12" />
  </Svg>
);

export const BatteryIcon: React.FC<IconProps & { level: number; levelColor?: string }> = ({ level, levelColor, ...p }) => (
  <Svg {...p}>
    <rect x="4" y="14" width="36" height="20" rx="4" />
    <path d="M43 21v6" strokeWidth={(p.stroke ?? 3) * 1.4} />
    <rect x="8" y="18" width={Math.max(0, 28 * level)} height="12" rx="1.5" fill={levelColor ?? p.color ?? theme.light.ink} stroke="none" />
  </Svg>
);

export const LockIcon: React.FC<IconProps & { open?: number }> = ({ open = 0, ...p }) => (
  <Svg {...p}>
    <rect x="10" y="21" width="28" height="21" rx="4" fill={p.fill ?? 'none'} />
    <path
      d="M16 21v-6a8 8 0 0116 0v6"
      style={{ translate: `0px ${-open * 5}px`, rotate: `${open * 28}deg`, transformOrigin: '32px 21px', transformBox: 'view-box' }}
    />
    <circle cx="24" cy="31" r="2.5" fill={p.color ?? theme.light.ink} stroke="none" />
  </Svg>
);

export const BrainIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path
      d="M24 9c-2-3-8-3-9.5 1-4-.5-6.5 3-5.5 6.5-3.5 1.5-4 6.5-1 8.5-2 3 0 7.5 3.5 7.5 0 4 4.5 6.5 8 4.5 1.5 2.5 3.5 3 4.5 3V9z"
      fill={p.fill ?? 'none'}
    />
    <path
      d="M24 9c2-3 8-3 9.5 1 4-.5 6.5 3 5.5 6.5 3.5 1.5 4 6.5 1 8.5 2 3 0 7.5-3.5 7.5 0 4-4.5 6.5-8 4.5-1.5 2.5-3.5 3-4.5 3V9z"
      fill={p.fill ?? 'none'}
    />
    <path d="M24 9v31M15 18c2 0 4 1.5 4 4M33 18c-2 0-4 1.5-4 4M14 28c2-1 4-.5 5 1.5M34 28c-2-1-4-.5-5 1.5" strokeWidth={(p.stroke ?? 3) * 0.8} />
  </Svg>
);

export const CommentIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M8 10h32a3 3 0 013 3v18a3 3 0 01-3 3H20l-9 8v-8H8a3 3 0 01-3-3V13a3 3 0 013-3z" fill={p.fill ?? 'none'} />
  </Svg>
);

export const ServerIcon: React.FC<IconProps & { blink?: number }> = ({ blink = 1, ...p }) => (
  <Svg {...p}>
    {[6, 18, 30].map((y, i) => (
      <g key={y}>
        <rect x="6" y={y} width="36" height="11" rx="2.5" fill={p.fill ?? 'none'} />
        <circle cx="13" cy={y + 5.5} r="1.8" fill={theme.accent.green} stroke="none" opacity={((i + Math.floor(blink)) % 2 === 0 ? 1 : 0.25)} />
        <path d={`M20 ${y + 5.5}h16`} strokeWidth={(p.stroke ?? 3) * 0.6} />
      </g>
    ))}
  </Svg>
);

export const SearchIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="20" cy="20" r="12" />
    <path d="M29 29l12 12" />
  </Svg>
);

export const CursorIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 6l24 16-11 2.5 6 12.5-5 2.5-6-12.5L12 34z" fill={p.fill ?? 'none'} />
  </Svg>
);

export const PlayIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="5" y="9" width="38" height="30" rx="6" />
    <path d="M20 17l11 7-11 7z" fill={p.color ?? theme.light.ink} />
  </Svg>
);

export const CartIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M4 8h6l5 22h24l4-15H13" />
    <circle cx="18" cy="38" r="3" />
    <circle cx="35" cy="38" r="3" />
  </Svg>
);

export const ClockIcon: React.FC<IconProps & { hand?: number }> = ({ hand = 0, ...p }) => (
  <Svg {...p}>
    <circle cx="24" cy="24" r="18" fill={p.fill ?? 'none'} />
    <path d="M24 24V13" style={{ rotate: `${hand * 360}deg`, transformOrigin: '24px 24px', transformBox: 'view-box' }} />
    <path d="M24 24l7 5" />
  </Svg>
);

export const CameraIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M6 15h8l3-5h14l3 5h8v24H6z" fill={p.fill ?? 'none'} />
    <circle cx="24" cy="27" r="7" />
  </Svg>
);

export const ShopIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M7 18l3-10h28l3 10" />
    <path d="M7 18c0 3 2 5 4.5 5S16 21 16 18c0 3 2 5 4 5s4-2 4-5c0 3 2 5 4 5s4-2 4-5c0 3 2 5 4.5 5S41 21 41 18" />
    <path d="M10 23v17h28V23" fill={p.fill ?? 'none'} />
  </Svg>
);

/** flat sneaker drawing (120x70 viewBox) used in ad cards */
export const Sneaker: React.FC<{ width?: number; color?: string; stroke?: number; faded?: boolean }> = ({
  width = 120,
  color = theme.accent.blue,
  stroke = 3,
  faded = false,
}) => {
  const ink = faded ? theme.light.faded : theme.light.ink;
  return (
    <svg width={width} height={(width * 70) / 120} viewBox="0 0 120 70" fill="none" stroke={ink} strokeWidth={stroke} strokeLinejoin="round" strokeLinecap="round" style={{ display: 'block', overflow: 'visible' }}>
      <path d="M9 50c0-12 4-21 12-23l23-6c6 8 14 12 26 14l26 5c11 2 16 6 16 10z" fill={faded ? '#D7DADE' : color} />
      <path d="M7 50h106a4 4 0 014 4v2a5 5 0 01-5 5H10a5 5 0 01-5-5v-2a4 4 0 012-4z" fill={theme.light.surface} />
      <path d="M38 25l6 9M46 23l6 9M54 26l5 8" strokeWidth={stroke * 0.8} />
      <path d="M72 44c8 0 18 1 26 4" strokeWidth={stroke * 0.8} />
      <path d="M14 56h96" strokeWidth={stroke * 0.5} opacity={0.5} />
    </svg>
  );
};

/** small product glyphs for non-shoe ads */
export const ProductGlyph: React.FC<{ kind: 'headphones' | 'watch' | 'bag' | 'phone'; size?: number; color?: string }> = ({ kind, size = 56, color = theme.light.inkSoft }) => (
  <Svg size={size} color={color} stroke={3}>
    {kind === 'headphones' && (
      <>
        <path d="M9 30v-6a15 15 0 0130 0v6" />
        <rect x="6" y="28" width="9" height="13" rx="3" />
        <rect x="33" y="28" width="9" height="13" rx="3" />
      </>
    )}
    {kind === 'watch' && (
      <>
        <rect x="14" y="14" width="20" height="20" rx="6" />
        <path d="M18 14l2-9h8l2 9M18 34l2 9h8l2-9M24 19v5l3 3" />
      </>
    )}
    {kind === 'bag' && (
      <>
        <path d="M9 17h30l-2 25H11z" />
        <path d="M17 17v-4a7 7 0 0114 0v4" />
      </>
    )}
    {kind === 'phone' && (
      <>
        <rect x="14" y="5" width="20" height="38" rx="4" />
        <path d="M21 38h6" />
      </>
    )}
  </Svg>
);
