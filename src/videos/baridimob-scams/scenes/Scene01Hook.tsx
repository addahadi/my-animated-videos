import React from 'react';
import { ArText, StickerPill } from '../../../components/Labels';
import { pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN, SPRING, theme } from '../../../theme';
import { BALANCE, E, HOOK_PHONE, WalletPhone } from './parts';

const A = theme.accent;

/** Hook text: visible from frame 0 (no sound needed). Shared with scene 2 so it can fade out there. */
export const HookText: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <ArText size={78} weight={900} style={{ position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', opacity }}>
    بريدي موب: <span dir="ltr" style={{ color: A.red }}>0 DA</span> ⚠️
  </ArText>
);

/** balance at absolute time t: already falling at frame 0, hits 0 on "صفر" */
export const hookBalance = (t: number) => BALANCE * (1 - ramp(t, -0.7, E(1, 1), EASE_IN));

/**
 * Scene 1: the shock result first. A generic wallet app, balance rolling down from 48 750 DA,
 * slams to 0 DA on "صفر" (red, sticker), then the transfer row slides in.
 */
export const Scene01Hook: React.FC<SceneProps> = () => {
  const { t, fps } = useClock();
  const zero = pop(t, E(1, 1), fps, SPRING.snappy);
  const row = pop(t, E(1, 2), fps, SPRING.soft);
  const sticker = pop(t, E(1, 1) + 0.05, fps, SPRING.pop);
  const bump = t > E(1, 1) ? Math.exp(-(t - E(1, 1)) * 9) * Math.sin((t - E(1, 1)) * 40) : 0;
  const { x, y, w, h } = HOOK_PHONE;
  return (
    <>
      <HookText />
      <WalletPhone
        w={w}
        h={h}
        balance={hookBalance(t)}
        zero={Math.min(1, zero)}
        rows={[{ label: 'تحويل', amount: '−48 750 DA', p: row, tone: 'red' }]}
        style={{ left: x, top: y, scale: `${1 + bump * 0.02}` }}
      />
      <StickerPill text="0 DA" tone="red" p={sticker} rotate={7} size={54} style={{ left: 650, top: 700 }} />
    </>
  );
};
