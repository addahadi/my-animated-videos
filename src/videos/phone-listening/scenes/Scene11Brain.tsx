import React from 'react';
import { DeviceMock, PhoneFeed, type AdKind } from '../../../components/Device';
import { DrawPath } from '../../../components/Diagram';
import { BrainIcon } from '../../../components/Icons';
import { Mono, StickerPill } from '../../../components/Labels';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';

const L = theme.light;
const A = theme.accent;

const P = { x: 500, y: 470, w: 390, h: 800 };
const ITEMS: { kind: AdKind; variant?: number }[] = [
  { kind: 'headphones' },
  { kind: 'shoe', variant: 0 },
  { kind: 'watch' },
  { kind: 'shoe', variant: 1 },
  { kind: 'bag' },
  { kind: 'shoe', variant: 2 },
  { kind: 'headphones' },
  { kind: 'shoe', variant: 0 },
  { kind: 'watch' },
];
const BRAIN: [number, number] = [300, 690];

/** Clue 4: the shoe ads were always in the feed; the brain only starts noticing them. */
export const Scene11Brain: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  const phone = pop(t, e(0) - 0.1, fps, SPRING.soft);
  const scroll = (t - e(0)) * 26;
  const brain = pop(t, e(1), fps, SPRING.pop);
  const tag = pop(t, e(2), fps, SPRING.soft);
  const tagArrow = ramp(t, e(2) + 0.15, e(2) + 0.6, EASE_IN_OUT);
  const sticker = pop(t, e(3), fps, SPRING.pop);
  const lit = ramp(t, e(4), e(4) + 0.4);
  const reveal = ramp(t, e(5), e(5) + 0.45);
  const beams = ramp(t, e(5) - 0.1, e(5) + 0.4, EASE_IN_OUT);
  const pulse = t > e(6) ? 0.75 + 0.25 * Math.sin((t - e(6)) * 10) : 1;

  const inner = P.w - 2 * Math.max(8, P.w * 0.035) - 4;
  const cardH = (inner - 28) * 0.4;
  const isShoe = (i: number) => ITEMS[i].kind === 'shoe';

  return (
    <>
      <DeviceMock width={P.w} height={P.h} style={{ left: P.x, top: P.y, opacity: Math.min(1, phone * 3), translate: `${(1 - Math.min(phone, 1)) * 120}px 0px`, rotate: '2deg' }}>
        <PhoneFeed
          width={inner}
          items={ITEMS}
          top={64}
          gap={14}
          scroll={scroll}
          faded={(i) => (isShoe(i) ? 1 - reveal : 0.15 * reveal)}
          highlight={(i) => (isShoe(i) ? reveal * pulse : 0)}
        />
      </DeviceMock>

      {/* beams from the brain to the (now noticed) ads */}
      {[1, 3, 5].map((i, k) => {
        const y = P.y + 18 + 64 + i * (cardH + 14) - scroll + cardH / 2;
        if (y < P.y + 40 || y > P.y + P.h - 40) return null;
        return <DrawPath key={i} d={`M ${BRAIN[0] + 90} ${BRAIN[1]} Q 470 ${mix(BRAIN[1], y, 0.5) - 40} ${P.x + 30} ${y}`} p={beams} dashed color={A.yellow} width={5} opacity={0.9 - k * 0.15} glow="rgba(238,206,97,0.7)" />;
      })}

      {/* the brain */}
      <div style={{ position: 'absolute', left: BRAIN[0] - 120, top: BRAIN[1] - 120, width: 240, height: 240, opacity: Math.min(1, brain * 3), scale: `${0.5 + 0.5 * brain}` }}>
        {lit > 0 &&
          Array.from({ length: 10 }).map((_, k) => (
            <div
              key={k}
              style={{
                position: 'absolute',
                left: 120 - 4,
                top: -14,
                width: 8,
                height: 30,
                borderRadius: 4,
                background: A.yellow,
                border: `2px solid ${L.ink}`,
                transformOrigin: '4px 134px',
                rotate: `${k * 36}deg`,
                opacity: lit,
                scale: `1 ${0.6 + 0.4 * pulse}`,
              }}
            />
          ))}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 999,
            background: lit > 0.5 ? A.yellow : '#F6F6F2',
            border: `4px solid ${L.ink}`,
            boxShadow: lit > 0 ? `0 0 ${60 * lit}px rgba(238,206,97,0.9), ${theme.shadow.card}` : theme.shadow.card,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BrainIcon size={150} stroke={3.2} fill={lit > 0.5 ? '#FFF6D6' : '#F2DCE6'} />
        </div>
      </div>

      {/* "already there" annotation */}
      <div style={{ position: 'absolute', left: 175, top: 900, opacity: Math.min(1, tag * 3), translate: `${(1 - Math.min(tag, 1)) * -40}px 0px`, background: L.ink, borderRadius: 14, padding: '10px 18px' }}>
        <Mono size={24} color="#FFFFFF" weight={800}>
          ALREADY THERE
        </Mono>
      </div>
      <DrawPath d="M 440 925 C 470 925, 480 900, 525 880" p={tagArrow * (1 - reveal)} color={L.ink} width={5} arrow />
      <StickerPill text="ما لاحظتهمش" tone="ink" p={sticker} rotate={-4} size={42} style={{ left: 175, top: 1010 }} />
    </>
  );
};
