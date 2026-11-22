import React from 'react';
import { DrawPath, quadPoint } from '../../../components/Diagram';
import { Mono, StickerPill } from '../../../components/Labels';
import { ThiefGlyph } from '../../../components/Scam';
import { UserGlyph } from '../../../components/Web';
import { arabic } from '../../../fonts';
import { mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';
import { ChatPhone, E, PHONE } from './parts';

const L = theme.light;
const A = theme.accent;

// five friend chats in an arc under the hacked account; the last one (index 4) is "you"
const FRIENDS: [number, number][] = [
  [175, 880],
  [345, 1000],
  [565, 1000],
  [735, 880],
  [455, 1150],
];

const MiniLink: React.FC = () => (
  <div style={{ width: 90, height: 56, borderRadius: 10, border: `2.5px solid ${L.ink}`, background: '#2B3655', overflow: 'hidden', position: 'relative' }}>
    <div style={{ position: 'absolute', right: 10, top: 8, width: 22, height: 22, borderRadius: 99, background: A.yellow }} />
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 18, background: A.green }} />
  </div>
);

/**
 * The hacked account resends the same link to five friends; the camera zooms into the last chat:
 * it is exactly the frame-1 chat (loop closed, "وهكا وصلك").
 */
export const Scene09Spread: React.FC<SceneProps> = () => {
  const { t, fps } = useClock();
  const e = (i: number) => E(9, i);

  const acct = pop(t, E(9, 0) - 0.25, fps, SPRING.soft);
  const sends = FRIENDS.map((_, i) => ramp(t, e(0) + i * 0.25, e(0) + i * 0.25 + 0.6, EASE_IN_OUT));
  const zoom = ramp(t, e(1), e(1) + 1.0, EASE_IN_OUT);
  const reveal = ramp(t, e(2) - 0.45, e(2) - 0.05, EASE_IN_OUT);
  const hit = pop(t, e(2), fps, SPRING.pop);

  const src: [number, number] = [540, 640];
  const [fx, fy] = FRIENDS[4];
  const Z = mix(1, 3.2, zoom);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: `${fx + 75}px ${fy + 60}px`,
          scale: `${Z}`,
          translate: `${mix(0, 540 - (fx + 75), zoom)}px ${mix(0, 800 - (fy + 60), zoom)}px`,
          opacity: 1 - reveal,
        }}
      >
        {/* the hacked account */}
        <div style={{ position: 'absolute', left: 540 - 110, top: 430, width: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: Math.min(1, acct * 3), scale: `${0.7 + 0.3 * acct}` }}>
          <div style={{ position: 'relative', width: 150, height: 150 }}>
            <div style={{ position: 'absolute', left: -40, top: -30 }}>
              <ThiefGlyph size={110} />
            </div>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 99, background: '#DCE1F6', border: `4px solid ${A.red}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserGlyph size={96} />
            </div>
          </div>
          <Mono size={20} color={A.red} weight={800}>
            YOUR ACCOUNT
          </Mono>
        </div>

        {FRIENDS.map(([x, y], i) => {
          const p = sends[i];
          const [px, py] = quadPoint(src, [mix(src[0], x + 75, 0.5), src[1] - 40], [x + 75, y + 50], p);
          return (
            <React.Fragment key={i}>
              <DrawPath d={`M${src[0]} ${src[1]} Q ${mix(src[0], x + 75, 0.5)} ${src[1] - 40} ${x + 75} ${y + 50}`} p={p} dashed width={3} color={A.red} opacity={0.5} />
              <div
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width: 150,
                  height: 120,
                  borderRadius: 20,
                  border: `3px solid ${i === 4 ? A.red : L.ink}`,
                  background: L.surface,
                  boxShadow: theme.shadow.card,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  opacity: Math.min(1, acct * 2),
                }}
              >
                <UserGlyph size={44} />
                <span style={{ fontFamily: arabic, fontWeight: 800, fontSize: 26, color: i === 4 ? A.red : L.ink, lineHeight: 1 }}>{i === 4 ? 'نتا' : 'صاحب'}</span>
              </div>
              {p > 0 && (
                <div style={{ position: 'absolute', left: px - 45, top: py - 28, opacity: p >= 1 ? 1 : Math.min(1, p * 4), scale: `${p >= 1 ? 0.7 : 1}`, translate: p >= 1 ? '40px -30px' : undefined }}>
                  <MiniLink />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* the last chat IS the frame-1 chat */}
      {reveal > 0 && <ChatPhone rise={1} card={1} style={{ opacity: reveal, scale: `${mix(0.85, 1, reveal)}` }} />}
      <StickerPill text="وهكا وصلك" tone="red" p={hit} rotate={-5} size={56} style={{ left: PHONE.x + 120, top: PHONE.y + 690 }} />
    </>
  );
};
