import React from 'react';
import { AdCard } from '../../../components/Device';
import { DrawPath } from '../../../components/Diagram';
import { EarIcon, EyeIcon } from '../../../components/Icons';
import { StickerPill } from '../../../components/Labels';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';

const L = theme.light;
const A = theme.accent;

/** Re-hook: the hook's ad returns with a "?"; the ear is crossed out and flips into an eye. */
export const Scene07EarEye: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  const ad = pop(t, e(0) - 0.05, fps, SPRING.soft);
  const q = pop(t, e(0) + 0.35, fps, SPRING.pop);
  const ear = pop(t, e(1), fps, SPRING.pop);
  const strike = ramp(t, e(2), e(2) + 0.3, EASE_IN_OUT);
  const flip = ramp(t, e(3) - 0.1, e(3) + 0.45, EASE_IN_OUT);
  const eyeSide = flip > 0.5;
  const angle = eyeSide ? mix(-90, 0, (flip - 0.5) * 2) : mix(0, 90, flip * 2);
  const glow = ramp(t, e(3) + 0.25, e(3) + 0.6);
  const look = ramp(t, e(3) + 0.35, e(3) + 0.8, EASE_IN_OUT);
  const pulse = (t * 1.3) % 1;

  const CX = 540;
  const CY = 1040;

  return (
    <>
      <AdCard
        width={560}
        kind="shoe"
        variant={0}
        highlight={glow * (0.6 + 0.4 * Math.sin(t * 5))}
        style={{ left: 260, top: 520, rotate: `${mix(6, -3, Math.min(ad, 1))}deg`, opacity: Math.min(1, ad * 3), translate: `0px ${(1 - Math.min(ad, 1)) * 140}px`, scale: `${0.85 + 0.15 * ad}` }}
      />
      <StickerPill text="?" tone="ink" p={q} rotate={10} size={90} style={{ left: 760, top: 455, padding: '16px 40px' }} />

      {/* sight line from the eye to the ad */}
      <DrawPath d={`M ${CX} ${CY - 130} L ${CX} 780`} p={look} dashed color={A.yellow} width={7} glow="rgba(238,206,97,0.8)" />

      <div style={{ position: 'absolute', left: CX - 130, top: CY - 130, width: 260, height: 260, opacity: Math.min(1, ear * 3), scale: `${0.5 + 0.5 * ear}`, perspective: 900 }}>
        {eyeSide &&
          [0, 0.5].map((o) => {
            const w = (pulse + o) % 1;
            return <div key={o} style={{ position: 'absolute', inset: -w * 60, borderRadius: 999, border: `4px solid ${A.yellow}`, opacity: (1 - w) * 0.7 * glow }} />;
          })}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 999,
            background: eyeSide ? A.yellow : '#F6F6F2',
            border: `4px solid ${L.ink}`,
            boxShadow: eyeSide ? `0 0 ${50 * glow}px rgba(238,206,97,0.85), ${theme.shadow.card}` : theme.shadow.card,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            rotate: `y ${angle}deg`,
          }}
        >
          {eyeSide ? <EyeIcon size={150} stroke={3.4} fill="#FFFFFF" /> : <EarIcon size={140} stroke={3.4} fill="#F6D9D8" />}
          {!eyeSide && strike > 0 && <div style={{ position: 'absolute', width: 300, height: 14, borderRadius: 7, background: A.red, border: `3px solid ${L.ink}`, rotate: '-38deg', scale: `${strike} 1` }} />}
        </div>
      </div>
    </>
  );
};
