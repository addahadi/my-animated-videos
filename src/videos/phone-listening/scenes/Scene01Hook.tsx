import React from 'react';
import { AdCard, DeviceMock, PhoneFeed, type AdKind } from '../../../components/Device';
import { ClockIcon, MicIcon, Sneaker } from '../../../components/Icons';
import { SpeechBubble, StickerPill, ValueTag, XStamp } from '../../../components/Labels';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, EASE_OUT, SPRING, theme } from '../../../theme';

const A = theme.accent;
const L = theme.light;

// phone geometry (hero object, centered)
const PW = 330;
const PH = 690;
const PX = (1080 - PW) / 2;
const PY = 470;

const feed: { kind: AdKind; variant: number }[] = Array.from({ length: 10 }, (_, i) => ({ kind: 'shoe', variant: i }));

// ads that spill out of the phone when the screen "fills" (x, y, rotation, delay)
const SPILL: [number, number, number, number][] = [
  [158, 560, -9, 0.0],
  [672, 600, 8, 0.1],
  [150, 860, 7, 0.2],
  [680, 905, -7, 0.28],
  [190, 1080, -4, 0.36],
  [650, 1100, 5, 0.42],
];

export const Scene01Hook: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  // phone is on screen from frame 0, settling in with a small lift
  const enter = ramp(t, e(0) - 0.05, e(0) + 0.7, EASE_OUT);
  const fill = e(3);
  const scroll = (t - e(0)) * 10 + mix(0, 300, ramp(t, fill, fill + 1.6, EASE_IN_OUT));

  const bubbleA = pop(t, e(1), fps, SPRING.pop);
  const bubbleB = pop(t, e(1) + 0.35, fps, SPRING.pop);
  const bubblesOut = ramp(t, fill + 0.1, fill + 0.45);
  const tagP = pop(t, e(2), fps, SPRING.soft);

  const q1 = pop(t, e(4), fps, SPRING.pop);
  const x1 = pop(t, e(5), fps, SPRING.snappy);
  const micP = pop(t, e(6) - 0.1, fps, SPRING.pop);
  const q2 = pop(t, e(6), fps, SPRING.pop);
  const x2 = pop(t, e(7), fps, SPRING.snappy);
  // the phone gets a tiny recoil on each stamp
  const recoil = Math.max(0, 1 - Math.abs(t - e(5) - 0.05) * 10) * 0.012 + Math.max(0, 1 - Math.abs(t - e(7) - 0.05) * 10) * 0.012;
  // sound waves around the mic badge while "listening?"
  const waveT = (t - e(6)) % 1;

  return (
    <>
      {/* spilled ads behind the phone */}
      {SPILL.map(([x, y, r, d], i) => {
        const p = pop(t, fill + 0.45 + d, fps, SPRING.soft);
        if (p <= 0.001) return null;
        const fromX = PX + PW / 2 - 115;
        const fromY = PY + PH / 2;
        return (
          <AdCard
            key={i}
            width={230}
            kind="shoe"
            variant={i + 1}
            style={{
              left: mix(fromX, x, Math.min(p, 1.05)),
              top: mix(fromY, y, Math.min(p, 1.05)) + Math.sin(t * 1.6 + i) * 4,
              rotate: `${r * Math.min(p, 1)}deg`,
              opacity: Math.min(1, p * 2) * 0.95,
              scale: `${0.6 + 0.4 * p}`,
            }}
          />
        );
      })}

      {/* hero phone */}
      <DeviceMock
        width={PW}
        height={PH}
        style={{
          left: PX,
          top: PY + (1 - enter) * 40,
          rotate: `${mix(-3, 0, enter)}deg`,
          scale: `${mix(0.94, 1, enter) - recoil}`,
        }}
      >
        <PhoneFeed
          width={PW - 2 * Math.max(8, PW * 0.035) - 4}
          items={feed}
          top={58}
          scroll={scroll}
          appear={(i) => (i < 3 ? pop(t, e(0) - 0.35 + i * 0.16, fps, SPRING.soft) : pop(t, fill + (i - 3) * 0.12, fps, SPRING.soft))}
        />
      </DeviceMock>

      {/* "listening?" mic badge on top of the phone */}
      {micP > 0.001 && (
        <div style={{ position: 'absolute', left: 540 - 58, top: PY - 70, width: 116, height: 116, scale: `${Math.min(micP, 1.1)}`, opacity: Math.min(1, micP * 3) }}>
          {[0, 0.5].map((o) => {
            const w = (waveT + o) % 1;
            return (
              <div
                key={o}
                style={{ position: 'absolute', inset: -w * 46, borderRadius: 999, border: `3px solid ${A.red}`, opacity: (1 - w) * 0.55 * (1 - x2 * 0.9) }}
              />
            );
          })}
          <div style={{ position: 'absolute', inset: 0, borderRadius: 999, background: L.surface, border: `3px solid ${L.ink}`, boxShadow: theme.shadow.card, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MicIcon size={64} fill="#F6D9D8" />
          </div>
          {x2 > 0.001 && (
            <div style={{ position: 'absolute', left: -8, top: 52, width: 132, height: 8, borderRadius: 4, background: A.red, rotate: '-40deg', scale: `${Math.min(1, x2)} 1`, border: `2px solid ${L.ink}` }} />
          )}
        </div>
      )}

      {/* the conversation */}
      <SpeechBubble text="صبّاط..." p={bubbleA * (1 - bubblesOut)} tail="right" size={50} style={{ left: 120, top: 400 }} />
      <SpeechBubble p={bubbleB * (1 - bubblesOut)} tail="left" size={44} style={{ left: 700, top: 420 }}>
        <Sneaker width={110} stroke={3} />
      </SpeechBubble>

      {/* +5 MIN hanging tag above the phone */}
      <ValueTag
        p={tagP}
        value={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
            <ClockIcon size={46} hand={ramp(t, e(2), e(2) + 1.2, EASE_IN_OUT)} />
            +5 MIN
          </span>
        }
        size={46}
        string={18}
        style={{ left: 540, top: 262, translate: '-50% 0px', opacity: Math.min(1, tagP * 3) * (1 - micP) }}
      />

      {/* the two wrong answers, each crossed out */}
      <div style={{ position: 'absolute', left: 735, top: 1208, translate: '-50% 0px' }}>
        <StickerPill text="صدفة؟" tone="ink" p={q1} rotate={-4} size={52} style={{ left: 0, top: 0, translate: '-50% 0px' }} />
        <XStamp p={x1} size={110} style={{ left: -55, top: -14 }} />
      </div>
      <div style={{ position: 'absolute', left: 345, top: 1208, translate: '-50% 0px' }}>
        <StickerPill text="يسمعك؟" tone="ink" p={q2} rotate={3} size={52} style={{ left: 0, top: 0, translate: '-50% 0px' }} />
        <XStamp p={x2} size={110} style={{ left: -55, top: -14 }} />
      </div>
    </>
  );
};
