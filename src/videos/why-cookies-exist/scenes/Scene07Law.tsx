import React from 'react';
import { random } from 'remotion';
import { LockIcon } from '../../../components/Icons';
import { Card, Mono, Stamp, StickerPill } from '../../../components/Labels';
import { CookieIcon, StarShape, TicketChip, WorldDots } from '../../../components/Web';
import { arabic } from '../../../fonts';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';

const L = theme.light;
const A = theme.accent;

const MAP = { x: 165, y: 540, w: 750, h: 420 };
// banner spots on the stylized map (0..1)
const SPOTS: [number, number][] = [
  [0.5, 0.24],
  [0.2, 0.3],
  [0.7, 0.3],
  [0.53, 0.52],
  [0.3, 0.64],
  [0.86, 0.74],
  [0.14, 0.18],
  [0.74, 0.5],
  [0.47, 0.32],
  [0.62, 0.2],
  [0.24, 0.42],
  [0.55, 0.66],
];

/** The law: a generic star circle, ePrivacy, GDPR 2018 stamp, the rule card; then banners spread worldwide. */
export const Scene07Law: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  const stars = pop(t, e(1), fps, SPRING.soft);
  const spin = ramp(t, e(1), e(1) + 1.2, EASE_IN_OUT);
  const ep = pop(t, e(2), fps, SPRING.pop);
  const gdpr = pop(t, e(3), fps, SPRING.snappy);
  const rule = pop(t, e(4), fps, SPRING.soft);
  const ask = pop(t, e(5), fps, SPRING.pop);
  const lock = ramp(t, e(5), e(5) + 0.3);
  const toMap = ramp(t, e(6) - 0.3, e(6) + 0.3, EASE_IN_OUT);
  const dots = ramp(t, e(6), e(6) + 0.9);
  const banners = SPOTS.map((_, i) => pop(t, e(7) + i * 0.09, fps, SPRING.pop));
  const all = pop(t, e(8), fps, SPRING.pop);

  const CX = 540;
  const CY = 640;
  const R = 130;

  return (
    <>
      {/* ---------- the rule */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - toMap, translate: `0px ${-toMap * 80}px` }}>
        <div style={{ position: 'absolute', left: CX - 175, top: CY - 175, width: 350, height: 350, opacity: Math.min(1, stars * 3), scale: `${0.6 + 0.4 * stars}` }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 999, background: '#3F55B8', border: `3px solid ${L.ink}`, boxShadow: theme.shadow.card }} />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2 + (1 - spin) * 0.8;
            const show = ramp(t, e(1) + i * 0.04, e(1) + i * 0.04 + 0.2);
            return (
              <div key={i} style={{ position: 'absolute', left: 175 + Math.cos(a) * R - 17, top: 175 + Math.sin(a) * R - 17, opacity: show, scale: `${0.4 + 0.6 * show}` }}>
                <StarShape size={34} />
              </div>
            );
          })}
        </div>
        <StickerPill text="ePrivacy" tone="blue" p={ep} rotate={-6} size={34} style={{ left: 190, top: 470 }} />
        <Stamp text="GDPR · 2018" p={gdpr} size={56} rotate={-10} style={{ left: CX + 150, top: CY + 150, translate: '-50% -50%', background: 'rgba(238,238,234,0.92)' }} />

        {/* the rule card */}
        <Card style={{ left: 175, top: 880, width: 730, height: 330, opacity: Math.min(1, rule * 3), translate: `0px ${(1 - Math.min(rule, 1)) * 80}px` }}>
          <div style={{ position: 'absolute', left: 26, top: 22 }}>
            <Mono size={20}>THE RULE · SIMPLIFIED</Mono>
          </div>
          <div dir="rtl" style={{ position: 'absolute', right: 30, top: 70, fontFamily: arabic, fontWeight: 800, fontSize: 64, color: L.ink, lineHeight: 1.1 }}>
            إذن قبل التتبع
          </div>
          <div style={{ position: 'absolute', left: 30, right: 30, bottom: 28, display: 'flex', alignItems: 'center', gap: 22 }}>
            <div style={{ position: 'relative', width: 230, height: 106 }}>
              <TicketChip id="77X9" tone="red" width={230} style={{ left: 0, top: 0, opacity: 1 - lock * 0.45 }} />
            </div>
            <div style={{ width: 90, height: 90, borderRadius: 99, background: lock > 0.5 ? '#DDEFE6' : L.surface, border: `3px solid ${lock > 0.5 ? A.green : L.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LockIcon size={56} open={1 - lock} color={lock > 0.5 ? A.green : L.ink} />
            </div>
            <StickerPill text="ASK FIRST" tone="green" p={ask} rotate={-4} size={30} style={{ position: 'relative' }} />
          </div>
        </Card>
      </div>

      {/* ---------- the world */}
      {toMap > 0.001 && (
        <div style={{ position: 'absolute', inset: 0, opacity: toMap }}>
          <WorldDots width={MAP.w} height={MAP.h} p={dots} style={{ left: MAP.x, top: MAP.y }} />
          {SPOTS.map(([sx, sy], i) => {
            const p = banners[i];
            const wob = (random(`b${i}`) - 0.5) * 10;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: MAP.x + sx * MAP.w - 55,
                  top: MAP.y + sy * MAP.h - 40,
                  width: 110,
                  height: 70,
                  borderRadius: 12,
                  background: L.surface,
                  border: `3px solid ${L.ink}`,
                  boxShadow: '3px 4px 0 rgba(11,15,21,0.18)',
                  opacity: Math.min(1, p * 3),
                  scale: `${0.4 + 0.6 * p}`,
                  rotate: `${wob}deg`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '0 10px',
                  boxSizing: 'border-box',
                }}
              >
                <CookieIcon size={34} />
                <div style={{ flex: 1, height: 18, borderRadius: 6, background: L.ink }} />
              </div>
            );
          })}
          <div dir="rtl" style={{ position: 'absolute', left: 0, right: 0, top: 1010, textAlign: 'center', fontFamily: arabic, fontWeight: 900, fontSize: 76, color: L.ink, opacity: Math.min(1, all * 3), scale: `${0.7 + 0.3 * all}` }}>
            العالم كامل
          </div>
          <div style={{ position: 'absolute', left: 540, top: 1110, translate: '-50% 0', opacity: Math.min(1, all * 3) }}>
            <StickerPill text="EVERY SITE · EVERY COUNTRY" tone="yellow" p={all} rotate={-3} size={26} style={{ position: 'relative' }} />
          </div>
          <div style={{ position: 'absolute', left: 540, top: 1010, translate: '-50% 0', opacity: (1 - Math.min(1, all * 3)) * ramp(t, e(6), e(6) + 0.4) }}>
            <Mono size={24} color={L.mono}>
              {`VISITORS FROM EVERY COUNTRY`}
            </Mono>
          </div>
        </div>
      )}
    </>
  );
};
