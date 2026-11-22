import React from 'react';
import { arabic, display, mono } from '../fonts';
import { theme } from '../theme';
import { LockIcon } from './Icons';

const L = theme.light;
const D = theme.dark;
const A = theme.accent;

export type Tone = 'red' | 'green' | 'yellow' | 'ink' | 'blue';
const toneFill: Record<Tone, string> = { red: A.red, green: A.green, yellow: A.yellow, ink: L.ink, blue: A.blue };
const toneText: Record<Tone, string> = { red: '#FFFFFF', green: '#FFFFFF', yellow: L.ink, ink: '#F4F4F0', blue: '#FFFFFF' };

const isArabic = (s: string) => /[؀-ۿ]/.test(s);

/** Card: #EEEEEA, 3 px ink outline, radius 24, offset shadow. */
export const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; lift?: boolean }> = ({ style, children, lift }) => (
  <div
    style={{
      position: 'absolute',
      background: L.surface,
      border: `${theme.stroke.card}px solid ${L.ink}`,
      borderRadius: theme.radius.card,
      boxShadow: lift ? theme.shadow.lift : theme.shadow.card,
      boxSizing: 'border-box',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Mono label: uppercase Latin, letter-spaced. Never use for Arabic. */
export const Mono: React.FC<{ children: React.ReactNode; size?: number; color?: string; weight?: number; style?: React.CSSProperties }> = ({
  children,
  size = theme.type.monoTag,
  color = L.mono,
  weight = 700,
  style,
}) => (
  <span
    dir="ltr"
    style={{ fontFamily: mono, fontSize: size, fontWeight: weight, color, letterSpacing: theme.type.monoSpacing, textTransform: 'uppercase', whiteSpace: 'nowrap', ...style }}
  >
    {children}
  </span>
);

/**
 * Sticker pill. Pops in from scale 0.6 rotated -10deg and settles at `rotate`.
 * `p` is a spring progress (may overshoot slightly above 1, which gives the 1.08 bounce).
 */
export const StickerPill: React.FC<{
  text: string;
  tone?: Tone;
  p?: number;
  rotate?: number;
  size?: number;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
}> = ({ text, tone = 'red', p = 1, rotate = -4, size, style, icon }) => {
  const ar = isArabic(text);
  const fs = size ?? (ar ? 40 : 30);
  const outlined = tone === 'red' || tone === 'yellow' || tone === 'blue';
  return (
    <div
      dir={ar ? 'rtl' : 'ltr'}
      style={{
        position: 'absolute',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: ar ? `${fs * 0.32}px ${fs * 0.62}px ${fs * 0.22}px` : `${fs * 0.36}px ${fs * 0.7}px`,
        borderRadius: 999,
        background: toneFill[tone],
        color: toneText[tone],
        border: outlined ? `${theme.stroke.sticker}px solid ${L.ink}` : 'none',
        boxShadow: '4px 6px 0px rgba(11,15,21,0.16)',
        fontFamily: ar ? arabic : mono,
        fontWeight: 800,
        fontSize: fs,
        lineHeight: 1,
        letterSpacing: ar ? undefined : '0.06em',
        whiteSpace: 'nowrap',
        opacity: Math.min(1, p * 3.5),
        scale: `${0.6 + 0.4 * p}`,
        rotate: `${-10 + (rotate + 10) * Math.min(p, 1.05)}deg`,
        ...style,
      }}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
};

/** Red double-outline rubber stamp. Slams in from 1.7x. */
export const Stamp: React.FC<{ text: string; p?: number; rotate?: number; size?: number; color?: string; style?: React.CSSProperties }> = ({
  text,
  p = 1,
  rotate = -12,
  size = 64,
  color = A.red,
  style,
}) => {
  const ar = isArabic(text);
  const q = Math.min(1, Math.max(0, p));
  return (
    <div
      dir={ar ? 'rtl' : 'ltr'}
      style={{
        position: 'absolute',
        padding: ar ? `${size * 0.22}px ${size * 0.42}px ${size * 0.1}px` : `${size * 0.16}px ${size * 0.38}px`,
        border: `${Math.max(4, size * 0.08)}px solid ${color}`,
        outline: `${Math.max(2, size * 0.035)}px solid ${color}`,
        outlineOffset: -size * 0.16,
        borderRadius: size * 0.22,
        color,
        fontFamily: ar ? arabic : display,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: ar ? undefined : '0.02em',
        textTransform: ar ? undefined : 'uppercase',
        whiteSpace: 'nowrap',
        background: 'rgba(230,88,86,0.06)',
        opacity: q * 0.92,
        scale: `${1.75 - 0.75 * Math.min(p, 1.02)}`,
        rotate: `${rotate}deg`,
        mixBlendMode: 'multiply',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Big X mark stamp (for "no"). */
export const XStamp: React.FC<{ p?: number; size?: number; style?: React.CSSProperties }> = ({ p = 1, size = 120, style }) => {
  const q = Math.min(1, Math.max(0, p));
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ position: 'absolute', overflow: 'visible', opacity: q, scale: `${1.8 - 0.8 * Math.min(p, 1.03)}`, rotate: '-8deg', ...style }}
    >
      <path d="M18 18L82 82M82 18L18 82" stroke={A.red} strokeWidth={17} strokeLinecap="round" />
      <path d="M18 18L82 82M82 18L18 82" stroke={L.ink} strokeWidth={3} strokeLinecap="round" opacity={0.25} />
    </svg>
  );
};

/** Hanging tag: ring, string, heavy value, mono caption. `p` drives a damped swing-in. */
export const ValueTag: React.FC<{
  value: React.ReactNode;
  caption?: string;
  p?: number;
  string?: number;
  valueColor?: string;
  size?: number;
  style?: React.CSSProperties;
  mode?: 'light' | 'dark';
}> = ({ value, caption, p = 1, string = 46, valueColor, size = 64, style, mode = 'light' }) => {
  const dark = mode === 'dark';
  const swing = (1 - Math.min(p, 1)) * 16 + (p > 1 ? (p - 1) * -40 : 0);
  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transformOrigin: 'top center',
        rotate: `${swing}deg`,
        opacity: Math.min(1, p * 3),
        translate: `0px ${(1 - Math.min(p, 1)) * -30}px`,
        ...style,
      }}
    >
      <div style={{ width: 16, height: 16, borderRadius: 99, border: `3px solid ${dark ? D.text : L.ink}`, background: 'transparent' }} />
      <div style={{ width: 3, height: string, background: dark ? D.text : L.ink, opacity: 0.8 }} />
      <div
        style={{
          background: dark ? D.panel : L.surface,
          border: `3px solid ${dark ? D.glow : L.ink}`,
          borderRadius: 16,
          padding: `${size * 0.14}px ${size * 0.34}px ${size * 0.12}px`,
          boxShadow: dark ? `0 0 24px ${D.glow}` : theme.shadow.card,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <div style={{ fontFamily: `${display}, ${arabic}`, fontWeight: 900, fontSize: size, lineHeight: 1.02, color: valueColor ?? (dark ? D.text : L.ink), whiteSpace: 'nowrap' }}>
          {value}
        </div>
        {caption && <Mono size={Math.max(16, size * 0.3)} color={dark ? D.mono : L.mono}>{caption}</Mono>}
      </div>
    </div>
  );
};

/** Pill chip with an icon and a mono label (packets, inputs). */
export const PacketChip: React.FC<{ label: string; icon?: React.ReactNode; mode?: 'light' | 'dark'; style?: React.CSSProperties; size?: number }> = ({
  label,
  icon,
  mode = 'light',
  style,
  size = 26,
}) => {
  const dark = mode === 'dark';
  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: `${size * 0.42}px ${size * 0.8}px ${size * 0.42}px ${size * 0.55}px`,
        borderRadius: 999,
        background: dark ? 'rgba(51,74,106,0.92)' : L.surface,
        border: `3px solid ${dark ? D.marker : L.ink}`,
        boxShadow: dark ? `0 0 20px rgba(129,225,200,0.45)` : theme.shadow.card,
        ...style,
      }}
    >
      {icon}
      <Mono size={size} color={dark ? D.text : L.ink} weight={800}>
        {label}
      </Mono>
    </div>
  );
};

/** Speech bubble with an Arabic word. Tail on the side given. */
export const SpeechBubble: React.FC<{ text?: string; children?: React.ReactNode; p?: number; tail?: 'left' | 'right'; style?: React.CSSProperties; size?: number }> = ({
  text,
  children,
  p = 1,
  tail = 'right',
  style,
  size = 50,
}) => (
  <div
    style={{
      position: 'absolute',
      opacity: Math.min(1, p * 3),
      scale: `${0.5 + 0.5 * p}`,
      transformOrigin: tail === 'right' ? '100% 100%' : '0% 100%',
      ...style,
    }}
  >
    <div
      dir="rtl"
      lang="ar"
      style={{
        position: 'relative',
        background: L.surface,
        border: `3px solid ${L.ink}`,
        borderRadius: 30,
        padding: `${size * 0.32}px ${size * 0.55}px ${size * 0.18}px`,
        boxShadow: theme.shadow.card,
        fontFamily: arabic,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.1,
        color: L.ink,
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      {text ?? children}
      <svg
        width="34"
        height="30"
        viewBox="0 0 34 30"
        style={{ position: 'absolute', bottom: -27, [tail === 'right' ? 'right' : 'left']: 26, overflow: 'visible' }}
      >
        <path d={tail === 'right' ? 'M2 0 L30 26 L22 0' : 'M32 0 L4 26 L12 0'} fill={L.surface} stroke={L.ink} strokeWidth={3} strokeLinejoin="round" />
        <path d={tail === 'right' ? 'M4 -3 H20' : 'M14 -3 H30'} stroke={L.surface} strokeWidth={6} />
      </svg>
    </div>
  </div>
);

/** Open-loop chip: "TRUTH · LOCKED" -> "TRUTH · UNLOCKED". `label` replaces TRUTH (Latin only). */
export const LockedChip: React.FC<{ open?: number; mode?: 'light' | 'dark'; style?: React.CSSProperties; shake?: number; label?: string }> = ({
  open = 0,
  mode = 'light',
  style,
  shake = 0,
  label = 'TRUTH',
}) => {
  const dark = mode === 'dark';
  const col = open > 0.5 ? A.green : dark ? D.text : L.ink;
  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 18px 9px 12px',
        borderRadius: 14,
        background: dark ? D.panel : L.surface,
        border: `3px solid ${open > 0.5 ? A.green : dark ? D.glow : L.ink}`,
        boxShadow: dark ? `0 0 18px ${D.glow}` : theme.shadow.card,
        rotate: `${shake}deg`,
        ...style,
      }}
    >
      <LockIcon size={30} open={open} color={col} />
      <Mono size={20} color={col} weight={800}>
        {open > 0.5 ? `${label} · UNLOCKED` : `${label} · LOCKED`}
      </Mono>
    </div>
  );
};

/** Arabic text block helper (RTL, Tajawal, never letter-spaced). */
export const ArText: React.FC<{ children: React.ReactNode; size?: number; weight?: number; color?: string; style?: React.CSSProperties }> = ({
  children,
  size = 48,
  weight = 800,
  color = L.ink,
  style,
}) => (
  <div dir="rtl" lang="ar" style={{ fontFamily: arabic, fontWeight: weight, fontSize: size, color, lineHeight: 1.15, ...style }}>
    {children}
  </div>
);
