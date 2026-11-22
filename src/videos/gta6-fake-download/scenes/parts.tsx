import React from 'react';
import { DeviceMock, StatusBar } from '../../../components/Device';
import { Mono, Stamp, StickerPill } from '../../../components/Labels';
import { LinkCard } from '../../../components/Scam';
import { UserGlyph } from '../../../components/Web';
import { arabic } from '../../../fonts';
import type { TimelineScene } from '../../../lib/time';
import { theme } from '../../../theme';
import timeline from '../timeline.json';

const L = theme.light;
const A = theme.accent;

const SCENES = timeline.scenes as unknown as TimelineScene[];

/** Absolute time (s) of event `i` of scene `id`, so a component can span two timeline scenes. */
export const E = (id: number, i: number) => {
  const s = SCENES.find((x) => x.id === id);
  const e = s?.props.events[i];
  if (!e) throw new Error(`gta6 timeline: scene ${id} event ${i} missing`);
  return e.sec;
};

export const LINK_TITLE = 'GTA 6 PC · FREE';

/** Phone geometry shared by the hook, the spread reveal and the loop ending (same spot = loop). */
export const PHONE = { x: 250, y: 380, w: 580, h: 930 };

/**
 * The spine: a chat from "صاحبي" with the free-download link card.
 * `rise` 0..1 brings the phone up, `card` pops the link preview, `buzz` shakes it,
 * `pulse`/`press` animate the DOWNLOAD chip, `stamp` slams the red كذب, `sticker` shows مجانا.
 */
export const ChatPhone: React.FC<{
  rise?: number;
  bubble?: number;
  card?: number;
  buzz?: number;
  pulse?: number;
  press?: number;
  stamp?: number;
  sticker?: number;
  style?: React.CSSProperties;
}> = ({ rise = 1, bubble = 1, card = 1, buzz = 0, pulse = 0, press = 0, stamp = 0, sticker = 0, style }) => {
  const { x, y, w, h } = PHONE;
  const r = Math.min(1, rise);
  return (
    <DeviceMock
      width={w}
      height={h}
      style={{
        left: x + buzz * 9,
        top: y + (1 - r) * 900,
        rotate: `${(1 - r) * 8 + buzz * 1.6}deg`,
        ...style,
      }}
    >
      <div style={{ position: 'absolute', left: 0, right: 0, top: 18 }}>
        <StatusBar width={w - 40} scale={0.9} />
      </div>
      {/* chat header */}
      <div dir="rtl" style={{ position: 'absolute', left: 0, right: 0, top: 70, height: 96, borderBottom: `2.5px solid rgba(11,15,21,0.25)`, display: 'flex', alignItems: 'center', gap: 16, padding: '0 26px' }}>
        <div style={{ width: 62, height: 62, borderRadius: 99, background: '#DCE1F6', border: `3px solid ${L.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <UserGlyph size={40} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontFamily: arabic, fontWeight: 800, fontSize: 40, color: L.ink, lineHeight: 1.1 }}>صاحبي</span>
          <Mono size={15} color={A.green}>
            ONLINE
          </Mono>
        </div>
      </div>
      {/* incoming message */}
      <div
        style={{
          position: 'absolute',
          left: 22,
          top: 200,
          opacity: Math.min(1, bubble * 3),
          translate: `${(1 - Math.min(1, bubble)) * -60}px 0px`,
        }}
      >
        <div dir="rtl" style={{ display: 'inline-block', background: '#FFFFFF', border: `3px solid ${L.ink}`, borderRadius: '26px 26px 26px 6px', padding: '14px 24px 8px', fontFamily: arabic, fontWeight: 800, fontSize: 40, color: L.ink, boxShadow: theme.shadow.card }}>
          حمّلها بلاش!!
        </div>
      </div>
      <div style={{ position: 'absolute', left: 22, top: 300, width: 490, height: 400, transformOrigin: '0% 0%', opacity: Math.min(1, card * 3), scale: `${0.7 + 0.3 * Math.min(card, 1.04)}` }}>
        <LinkCard width={490} title={LINK_TITLE} pulse={pulse} press={press} />
        <StickerPill text="مجانا؟" tone="yellow" p={sticker} rotate={8} size={52} style={{ right: -24, top: 196 }} />
        <Stamp text="كذب" p={stamp} size={118} rotate={-12} style={{ mixBlendMode: 'normal', background: 'rgba(238,238,234,0.88)', left: 245, top: 170, translate: '-50% -50%' }} />
      </div>
    </DeviceMock>
  );
};

/** Small round icon button used for verdict buttons. */
export const VerdictButton: React.FC<{ text: string; tone: 'green' | 'red'; p: number; hover?: number; style?: React.CSSProperties }> = ({ text, tone, p, hover = 0, style }) => (
  <div
    dir="rtl"
    style={{
      position: 'absolute',
      width: 230,
      height: 104,
      borderRadius: 26,
      background: tone === 'green' ? A.green : A.red,
      border: `3px solid ${L.ink}`,
      boxShadow: `6px 8px 0 rgba(11,15,21,0.2)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
      fontFamily: arabic,
      fontWeight: 900,
      fontSize: 58,
      color: '#FFFFFF',
      opacity: Math.min(1, p * 3),
      scale: `${(0.5 + 0.5 * p) * (1 + hover * 0.08)}`,
      ...style,
    }}
  >
    <span style={{ paddingTop: 8 }}>{text}</span>
    <span style={{ fontSize: 44 }}>{tone === 'green' ? '✓' : '✕'}</span>
  </div>
);

/** deterministic wobble helper (deg) */
export const wobble = (t: number, amp: number, speed = 9) => Math.sin(t * speed) * amp;
