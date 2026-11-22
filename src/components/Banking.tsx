import React from 'react';
import { Img, staticFile } from 'remotion';
import { arabic, display, mono } from '../fonts';
import { theme } from '../theme';
import { Mono } from './Labels';

const L = theme.light;
const A = theme.accent;

/* ------------------------------------------------------------------ icons */

type GlyphProps = { size?: number; color?: string; fill?: string; style?: React.CSSProperties };

const G: React.FC<GlyphProps & { children: React.ReactNode; stroke?: number }> = ({ size = 48, color = L.ink, stroke = 3, style, children }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', overflow: 'visible', ...style }}>
    {children}
  </svg>
);

export const KeyGlyph: React.FC<GlyphProps> = ({ fill = 'none', ...p }) => (
  <G {...p}>
    <circle cx="15" cy="24" r="8" fill={fill} />
    <path d="M23 24h19M36 24v7M42 24v5" />
  </G>
);

export const SendGlyph: React.FC<GlyphProps> = ({ fill = 'none', ...p }) => (
  <G {...p}>
    <path d="M6 22L42 6 30 42l-7-15z" fill={fill} />
    <path d="M23 27L42 6" />
  </G>
);

export const SmsGlyph: React.FC<GlyphProps> = ({ fill = 'none', ...p }) => (
  <G {...p}>
    <path d="M7 10h34a3 3 0 013 3v18a3 3 0 01-3 3H20l-9 8v-8H7a3 3 0 01-3-3V13a3 3 0 013-3z" fill={fill} />
    <path d="M13 22h4M22 22h4M31 22h4" />
  </G>
);

export const LayersGlyph: React.FC<GlyphProps> = ({ fill = 'none', ...p }) => (
  <G {...p}>
    <path d="M24 8L44 18 24 28 4 18z" fill={fill} />
    <path d="M4 26l20 10 20-10M4 33l20 10 20-10" />
  </G>
);

export const AtmGlyph: React.FC<GlyphProps> = ({ fill = 'none', ...p }) => (
  <G {...p}>
    <rect x="8" y="5" width="32" height="38" rx="4" fill={fill} />
    <rect x="13" y="10" width="22" height="13" rx="2" fill="#DCE1F6" />
    <path d="M14 29h4M22 29h4M30 29h4M14 35h4M22 35h4M30 35h4" />
  </G>
);

export const ShieldGlyph: React.FC<GlyphProps> = ({ fill = 'none', ...p }) => (
  <G {...p}>
    <path d="M24 5l16 6v11c0 10-7 18-16 21C15 40 8 32 8 22V11z" fill={fill} />
    <path d="M17 24l5 5 9-10" />
  </G>
);

export const CallGlyph: React.FC<GlyphProps> = ({ fill = 'none', ...p }) => (
  <G {...p}>
    <path d="M14 6l6 9-4 4c2 5 6 9 11 11l4-4 9 6-3 7C23 40 8 25 7 9z" fill={fill} />
  </G>
);

/* ------------------------------------------------------------------ image card (style.md section 14) */

/**
 * ImageCard: a photo inside the `Card` frame (3 px ink outline, radius 24, offset shadow), never full-bleed.
 * `p` = enter progress, `push` 0..1 = slow push-in (scale 1.00 -> 1.06), `blur` = regions in image pixels,
 * `credit` = tiny mono credit line on the photo (CC BY attribution).
 */
export const ImageCard: React.FC<{
  src: string;
  width: number;
  height: number;
  natural: { w: number; h: number };
  p?: number;
  push?: number;
  tilt?: number;
  focus?: { x: number; y: number };
  blur?: { x: number; y: number; w: number; h: number }[];
  credit?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ src, width, height, natural, p = 1, push = 0, tilt = 0, focus = { x: 0.5, y: 0.5 }, blur = [], credit, style, children }) => {
  const q = Math.min(1, Math.max(0, p));
  // object-fit: cover math, so blur boxes (image pixels) land on the right spot
  const k = Math.max(width / natural.w, height / natural.h) * (1 + 0.06 * push);
  const iw = natural.w * k;
  const ih = natural.h * k;
  const ox = (width - iw) * focus.x;
  const oy = (height - ih) * focus.y;
  return (
    <div
      style={{
        position: 'absolute',
        width,
        height,
        opacity: Math.min(1, q * 2.5),
        translate: `0px ${(1 - q) * 40}px`,
        rotate: `${tilt}deg`,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: theme.radius.card,
          border: `${theme.stroke.card}px solid ${L.ink}`,
          boxShadow: theme.shadow.lift,
          overflow: 'hidden',
          background: L.surface,
        }}
      >
        <Img src={staticFile(src)} style={{ position: 'absolute', left: ox, top: oy, width: iw, height: ih }} />
        {blur.map((b, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: ox + b.x * k,
              top: oy + b.y * k,
              width: b.w * k,
              height: b.h * k,
              backdropFilter: 'blur(14px)',
              background: 'rgba(200,200,200,0.35)',
              borderRadius: 6,
            }}
          />
        ))}
        {credit && (
          <div style={{ position: 'absolute', right: 10, bottom: 8, background: 'rgba(11,15,21,0.55)', borderRadius: 6, padding: '3px 8px' }}>
            <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 13, color: '#F4F4F0', letterSpacing: '0.06em' }}>{credit}</span>
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ the code (spine object) */

/** CodeChip: the viewer's secret code. Yellow pill, key glyph, mono CODE, dots. */
export const CodeChip: React.FC<{ p?: number; size?: number; glow?: number; dots?: number; style?: React.CSSProperties }> = ({ p = 1, size = 1, glow = 0, dots = 4, style }) => (
  <div
    style={{
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      gap: 12 * size,
      padding: `${12 * size}px ${22 * size}px`,
      borderRadius: 999,
      background: A.yellow,
      border: `3px solid ${L.ink}`,
      boxShadow: `4px 6px 0 rgba(11,15,21,0.18)${glow > 0 ? `, 0 0 ${30 * glow}px ${8 * glow}px rgba(238,206,97,${0.7 * glow})` : ''}`,
      opacity: Math.min(1, p * 3),
      scale: `${(0.6 + 0.4 * p) * size}`,
      transformOrigin: '50% 50%',
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    <KeyGlyph size={40} />
    <span style={{ fontFamily: mono, fontWeight: 800, fontSize: 26, letterSpacing: '0.12em', color: L.ink }}>CODE</span>
    <span style={{ fontFamily: display, fontWeight: 900, fontSize: 30, color: L.ink, letterSpacing: '0.1em' }}>{'•'.repeat(dots)}</span>
  </div>
);

/* ------------------------------------------------------------------ wallet app (generic, no real logo) */

export type WalletRow = { label: string; amount: string; p?: number; tone?: 'red' | 'ink' };

/**
 * WalletScreen: a generic banking app screen to place inside `DeviceMock`. The app name is text only.
 * `zero` 0..1 tints the balance red, `fake` draws the red dashed edge of an overlay copy,
 * `code` shows a code field with `code.dots` typed dots.
 */
export const WalletScreen: React.FC<{
  width: number;
  height: number;
  balance: number;
  name?: string;
  zero?: number;
  rows?: WalletRow[];
  fake?: number;
  code?: { p: number; dots: number };
  style?: React.CSSProperties;
}> = ({ width, height, balance, name = 'BaridiMob', zero = 0, rows = [], fake = 0, code, style }) => {
  const s = width / 460;
  const balColor = zero > 0.5 ? A.red : L.ink;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width, height, background: '#F3F4F1', overflow: 'hidden', ...style }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 210 * s, background: A.blue, borderBottom: `3px solid ${L.ink}` }}>
        <div style={{ position: 'absolute', left: 28 * s, top: 92 * s, display: 'flex', alignItems: 'center', gap: 12 * s }}>
          <div style={{ width: 46 * s, height: 46 * s, borderRadius: 12 * s, background: A.yellow, border: `3px solid ${L.ink}` }} />
          <span dir="ltr" style={{ fontFamily: display, fontWeight: 900, fontSize: 40 * s, color: '#FFFFFF' }}>
            {name}
          </span>
        </div>
        <div style={{ position: 'absolute', left: 28 * s, top: 160 * s }}>
          <Mono size={17 * s} color="rgba(255,255,255,0.85)">ACCOUNT · CCP</Mono>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 22 * s,
          right: 22 * s,
          top: 240 * s,
          height: 190 * s,
          borderRadius: 22 * s,
          background: zero > 0 ? `rgba(230,88,86,${0.14 * zero})` : '#FFFFFF',
          border: `3px solid ${zero > 0.5 ? A.red : L.ink}`,
          boxShadow: theme.shadow.card,
        }}
      >
        <div style={{ position: 'absolute', left: 24 * s, top: 22 * s }}>
          <Mono size={18 * s} color={L.mono}>BALANCE</Mono>
        </div>
        <div dir="ltr" style={{ position: 'absolute', left: 24 * s, top: 62 * s, display: 'flex', alignItems: 'baseline', gap: 12 * s }}>
          <span style={{ fontFamily: display, fontWeight: 900, fontSize: 84 * s, lineHeight: 1, color: balColor, fontVariantNumeric: 'tabular-nums' }}>
            {Math.round(balance).toLocaleString('en-US').replace(/,/g, ' ')}
          </span>
          <span style={{ fontFamily: display, fontWeight: 900, fontSize: 40 * s, color: balColor }}>DA</span>
        </div>
      </div>
      {code && (
        <div style={{ position: 'absolute', left: 22 * s, right: 22 * s, top: 460 * s, opacity: Math.min(1, code.p * 3) }}>
          <Mono size={17 * s} color={L.mono}>SECRET CODE</Mono>
          <div style={{ marginTop: 10 * s, height: 86 * s, borderRadius: 16 * s, border: `3px solid ${L.ink}`, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22 * s }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ width: 22 * s, height: 22 * s, borderRadius: 99, background: i < code.dots ? L.ink : 'transparent', border: `3px solid ${i < code.dots ? L.ink : L.faded}` }} />
            ))}
          </div>
        </div>
      )}
      {!code && (
        <div style={{ position: 'absolute', left: 22 * s, right: 22 * s, top: 460 * s, display: 'flex', flexDirection: 'column', gap: 14 * s }}>
          {rows.map((r, i) => {
            const q = r.p ?? 1;
            if (q <= 0.001) return null;
            return (
              <div
                key={i}
                dir="rtl"
                style={{
                  height: 86 * s,
                  borderRadius: 16 * s,
                  background: '#FFFFFF',
                  border: `2.5px solid ${r.tone === 'red' ? A.red : 'rgba(11,15,21,0.6)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: `0 ${20 * s}px`,
                  opacity: Math.min(1, q * 2.5),
                  translate: `0px ${(1 - Math.min(1, q)) * 30}px`,
                }}
              >
                <span style={{ fontFamily: arabic, fontWeight: 800, fontSize: 34 * s, color: L.ink, paddingTop: 4 }}>{r.label}</span>
                <span dir="ltr" style={{ fontFamily: display, fontWeight: 900, fontSize: 32 * s, color: r.tone === 'red' ? A.red : L.ink }}>
                  {r.amount}
                </span>
              </div>
            );
          })}
        </div>
      )}
      {fake > 0 && <div style={{ position: 'absolute', inset: 4, border: `${6 * s}px dashed ${A.red}`, borderRadius: 18 * s, opacity: fake }} />}
    </div>
  );
};

/* ------------------------------------------------------------------ SMS notification */

/** Lock-screen style notification card: mono sender, Arabic text, a blue link chip. */
export const SmsNotif: React.FC<{ width: number; sender: string; text: string; link: string; p?: number; linkGlow?: number; style?: React.CSSProperties }> = ({
  width,
  sender,
  text,
  link,
  p = 1,
  linkGlow = 0,
  style,
}) => {
  const s = width / 440;
  return (
    <div
      style={{
        position: 'absolute',
        width,
        borderRadius: 26 * s,
        background: 'rgba(246,246,242,0.97)',
        border: `3px solid ${L.ink}`,
        boxShadow: theme.shadow.lift,
        padding: `${18 * s}px ${20 * s}px ${20 * s}px`,
        boxSizing: 'border-box',
        opacity: Math.min(1, p * 3),
        translate: `0px ${(1 - Math.min(1, p)) * -140}px`,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 * s, marginBottom: 10 * s }}>
        <SmsGlyph size={30 * s} fill={A.green} />
        <Mono size={18 * s} color={L.ink} weight={800}>
          {sender}
        </Mono>
        <div style={{ flex: 1 }} />
        <Mono size={15 * s} color={L.mono}>NOW</Mono>
      </div>
      <div dir="rtl" style={{ fontFamily: arabic, fontWeight: 800, fontSize: 34 * s, color: L.ink, lineHeight: 1.25 }}>
        {text}
      </div>
      <div
        style={{
          marginTop: 12 * s,
          display: 'inline-block',
          padding: `${8 * s}px ${14 * s}px`,
          borderRadius: 10 * s,
          background: '#DCE1F6',
          border: `2.5px solid ${A.blue}`,
          boxShadow: linkGlow > 0 ? `0 0 ${24 * linkGlow}px rgba(85,107,209,${0.8 * linkGlow})` : undefined,
        }}
      >
        <span dir="ltr" style={{ fontFamily: mono, fontWeight: 700, fontSize: 20 * s, color: A.blue, textDecoration: 'underline' }}>
          {link}
        </span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ magnifier */

/** Magnifier: a lens with a handle; children are drawn inside the lens, already zoomed by the caller. */
export const Magnifier: React.FC<{ size: number; p?: number; ring?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ size, p = 1, ring = L.ink, style, children }) => (
  <div style={{ position: 'absolute', width: size, height: size, opacity: Math.min(1, p * 3), scale: `${0.6 + 0.4 * p}`, ...style }}>
    <div style={{ position: 'absolute', left: size * 0.78, top: size * 0.78, width: size * 0.42, height: size * 0.13, borderRadius: 99, background: L.ink, rotate: '45deg', transformOrigin: '0 50%' }} />
    <div style={{ position: 'absolute', inset: 0, borderRadius: 999, border: `${Math.max(8, size * 0.05)}px solid ${ring}`, background: '#FFFFFF', overflow: 'hidden', boxShadow: theme.shadow.lift, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </div>
  </div>
);

/* ------------------------------------------------------------------ Android-style accessibility list */

export type A11yRow = { label: string; on: number; highlight?: number; fake?: boolean };

/** Generic Android-style "Accessibility" settings screen (drawn, no screenshot). Toggles take 0..1. */
export const AccessibilityScreen: React.FC<{ width: number; height: number; rows: A11yRow[]; style?: React.CSSProperties }> = ({ width, height, rows, style }) => {
  const s = width / 460;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width, height, background: '#F3F4F1', ...style }}>
      <div style={{ position: 'absolute', left: 26 * s, top: 92 * s, display: 'flex', alignItems: 'center', gap: 14 * s }}>
        <span style={{ fontFamily: display, fontWeight: 900, fontSize: 36 * s, color: L.ink }}>←</span>
        <span dir="ltr" style={{ fontFamily: display, fontWeight: 800, fontSize: 42 * s, color: L.ink }}>
          Accessibility
        </span>
      </div>
      <div style={{ position: 'absolute', left: 28 * s, top: 186 * s }}>
        <Mono size={17 * s} color={L.mono}>DOWNLOADED APPS</Mono>
      </div>
      <div style={{ position: 'absolute', left: 18 * s, right: 18 * s, top: 222 * s, display: 'flex', flexDirection: 'column', gap: 12 * s }}>
        {rows.map((r, i) => {
          const hl = r.highlight ?? 0;
          const on = Math.min(1, Math.max(0, r.on));
          const track = r.fake ? A.red : A.green;
          return (
            <div
              key={i}
              dir="ltr"
              style={{
                height: 96 * s,
                borderRadius: 18 * s,
                background: hl > 0 ? `rgba(230,88,86,${0.12 * hl})` : '#FFFFFF',
                border: `${hl > 0.05 ? 3 : 2}px solid ${hl > 0.05 ? A.red : 'rgba(11,15,21,0.35)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: 16 * s,
                padding: `0 ${20 * s}px`,
              }}
            >
              <div style={{ width: 44 * s, height: 44 * s, borderRadius: 12 * s, background: r.fake ? A.blue : '#C9CED8', border: `2.5px solid ${L.ink}` }} />
              <span style={{ flex: 1, fontFamily: display, fontWeight: 800, fontSize: 28 * s, color: L.ink, whiteSpace: 'nowrap' }}>{r.label}</span>
              <div style={{ position: 'relative', width: 78 * s, height: 42 * s, borderRadius: 99, background: on > 0.5 ? track : '#C9CED8', border: `2.5px solid ${L.ink}` }}>
                <div style={{ position: 'absolute', top: 3 * s, left: (4 + on * 36) * s, width: 32 * s, height: 32 * s, borderRadius: 99, background: '#FFFFFF', border: `2px solid ${L.ink}` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Generic permission dialog (Latin UI text, invented copy). `press` 0..1 squashes ALLOW. */
export const AllowDialog: React.FC<{ width: number; app: string; p?: number; press?: number; style?: React.CSSProperties }> = ({ width, app, p = 1, press = 0, style }) => {
  const s = width / 400;
  return (
    <div
      style={{
        position: 'absolute',
        width,
        borderRadius: 26 * s,
        background: '#FFFFFF',
        border: `3px solid ${L.ink}`,
        boxShadow: theme.shadow.lift,
        padding: `${24 * s}px ${24 * s}px ${20 * s}px`,
        boxSizing: 'border-box',
        opacity: Math.min(1, p * 3),
        scale: `${0.8 + 0.2 * p}`,
        ...style,
      }}
    >
      <div dir="ltr" style={{ fontFamily: display, fontWeight: 800, fontSize: 28 * s, color: L.ink, lineHeight: 1.25 }}>
        Allow <span style={{ color: A.red }}>{app}</span> full control of your phone?
      </div>
      <div style={{ marginTop: 10 * s }}>
        <Mono size={15 * s} color={L.mono}>VIEW AND CONTROL SCREEN</Mono>
      </div>
      <div style={{ marginTop: 20 * s, display: 'flex', justifyContent: 'flex-end', gap: 16 * s }}>
        <div style={{ padding: `${10 * s}px ${18 * s}px` }}>
          <Mono size={20 * s} color={L.mono} weight={800}>DENY</Mono>
        </div>
        <div style={{ padding: `${10 * s}px ${22 * s}px`, borderRadius: 12 * s, background: A.red, border: `2.5px solid ${L.ink}`, scale: `${1 - press * 0.12}` }}>
          <Mono size={20 * s} color="#FFFFFF" weight={800}>ALLOW</Mono>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ ATM */

/** Generic ATM front (no bank logo): label strip, screen with Arabic text, keypad, card slot. */
export const AtmMock: React.FC<{ width: number; label?: string; screenText?: string; p?: number; style?: React.CSSProperties }> = ({
  width,
  label = 'GAB',
  screenText = '',
  p = 1,
  style,
}) => {
  const s = width / 460;
  const h = 620 * s;
  return (
    <div
      style={{
        position: 'absolute',
        width,
        height: h,
        borderRadius: 30 * s,
        background: 'linear-gradient(170deg, #E3E5E8 0%, #C4C8CE 100%)',
        border: `3px solid ${L.ink}`,
        boxShadow: theme.shadow.lift,
        opacity: Math.min(1, p * 3),
        ...style,
      }}
    >
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 70 * s, borderRadius: `${27 * s}px ${27 * s}px 0 0`, background: A.yellow, borderBottom: `3px solid ${L.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: display, fontWeight: 900, fontSize: 40 * s, color: L.ink, letterSpacing: '0.12em' }}>{label}</span>
      </div>
      <div style={{ position: 'absolute', left: 50 * s, right: 50 * s, top: 100 * s, height: 200 * s, borderRadius: 14 * s, background: '#2B3D63', border: `3px solid ${L.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 14 * s, boxSizing: 'border-box' }}>
        <span dir="rtl" style={{ fontFamily: arabic, fontWeight: 800, fontSize: 40 * s, color: '#E2F5FF', textAlign: 'center', lineHeight: 1.2 }}>
          {screenText}
        </span>
      </div>
      <div style={{ position: 'absolute', left: 110 * s, top: 330 * s, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 * s, width: 240 * s }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ height: 46 * s, borderRadius: 10 * s, background: '#F3F4F1', border: `2.5px solid ${L.ink}` }} />
        ))}
      </div>
      <div style={{ position: 'absolute', right: 40 * s, top: 340 * s, width: 50 * s, height: 140 * s, borderRadius: 10 * s, background: '#9AA0A8', border: `3px solid ${L.ink}` }}>
        <div style={{ position: 'absolute', left: 20 * s, top: 14 * s, width: 8 * s, height: 110 * s, borderRadius: 4, background: L.ink }} />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ choice buttons */

/** Two big answer buttons for the comment question (green / red). */
export const ChoiceButton: React.FC<{ text: string; tone: 'green' | 'red'; p: number; style?: React.CSSProperties }> = ({ text, tone, p, style }) => (
  <div
    dir="rtl"
    style={{
      position: 'absolute',
      width: 260,
      height: 120,
      borderRadius: 30,
      background: tone === 'green' ? A.green : A.red,
      border: `3px solid ${L.ink}`,
      boxShadow: '6px 8px 0 rgba(11,15,21,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: arabic,
      fontWeight: 900,
      fontSize: 66,
      color: '#FFFFFF',
      opacity: Math.min(1, p * 3),
      scale: `${0.5 + 0.5 * p}`,
      ...style,
    }}
  >
    <span style={{ paddingTop: 10 }}>{text}</span>
  </div>
);
