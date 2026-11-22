import React from 'react';
import { CursorIcon } from '../../../components/Icons';
import { mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';
import { ChatPhone, E, PHONE, VerdictButton } from './parts';

const L = theme.light;

/**
 * Hook: the phone is already rising and buzzing on frame 0, a link from صاحبي arrives,
 * the DOWNLOAD chip pulses, مجانا؟ sticker, then صح / كذب buttons with the cursor hovering
 * between them (open loop). The red كذب stamp slams on the card at the very end (cut on impact).
 */
export const Scene01Hook: React.FC<SceneProps> = () => {
  const { t, fps } = useClock();
  const e = (i: number) => E(1, i);

  const rise = pop(t, -0.7, fps, SPRING.soft);
  const buzz = t < 0.7 ? Math.sin(t * 70) * (1 - t / 0.7) : 0;
  const bubble = pop(t, -0.35, fps, SPRING.pop);
  const card = pop(t, Math.min(e(1), -0.1), fps, SPRING.pop);
  const pulse = t > e(2) ? 0.5 + 0.5 * Math.sin((t - e(2)) * 7) : 0;
  const sticker = pop(t, e(3), fps, SPRING.pop);
  const btn = [pop(t, e(4), fps, SPRING.pop), pop(t, e(4) + 0.15, fps, SPRING.pop)];
  const stamp = pop(t, E(2, 0), fps, SPRING.snappy);

  // cursor: glides in toward the DOWNLOAD chip, then drifts between صح and كذب
  const cIn = ramp(t, e(2), e(2) + 0.9, EASE_IN_OUT);
  const cBtn = ramp(t, e(4) + 0.1, e(4) + 0.7, EASE_IN_OUT);
  const freeze = t > e(5);
  const hoverSide = freeze ? 0.5 : 0.5 + 0.5 * Math.sin((t - e(4)) * 3.2);
  const chipX = PHONE.x + 22 + 490 - 90;
  const chipY = PHONE.y + 300 + 330;
  const btnY = 1150;
  const cx = mix(mix(960, chipX, cIn), mix(400, 680, hoverSide), cBtn);
  const cy = mix(mix(1300, chipY, cIn), btnY + 40, cBtn);
  const hoverYes = cBtn > 0.9 ? 1 - hoverSide : 0;
  const hoverNo = cBtn > 0.9 ? hoverSide : 0;
  const wob = freeze ? Math.sin(t * 40) * 1.5 : 0;

  return (
    <>
      <ChatPhone rise={rise} buzz={buzz} bubble={bubble} card={card} pulse={pulse} sticker={sticker} stamp={stamp} />
      {/* dim the phone a bit when the question buttons arrive so they read first */}
      <div style={{ position: 'absolute', inset: 0, background: L.ink, opacity: 0.12 * Math.min(1, btn[0]) }} />
      <VerdictButton text="صح" tone="green" p={btn[0]} hover={hoverYes} style={{ left: 290, top: btnY, rotate: `${-3 + wob}deg` }} />
      <VerdictButton text="كذب" tone="red" p={btn[1]} hover={hoverNo} style={{ left: 560, top: btnY, rotate: `${3 - wob}deg` }} />
      {cIn > 0 && (
        <div style={{ position: 'absolute', left: cx, top: cy }}>
          <CursorIcon size={86} fill="#FFFFFF" stroke={3.4} />
        </div>
      )}
    </>
  );
};
