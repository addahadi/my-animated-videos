import React from 'react';
import { Stamp, StickerPill, XStamp } from '../../../components/Labels';
import { LinkCard, PlatformBox } from '../../../components/Scam';
import { mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING } from '../../../theme';
import { E, LINK_TITLE } from './parts';

/**
 * Scenes 2 + 3 (one component, absolute times): the stamped link card shrinks to the top,
 * then a platform row builds: PS5 ✓, XBOX SERIES ✓ (scene 2), PC ✕, ANDROID ✕ (scene 3).
 */
export const Scene02Verdict: React.FC<SceneProps> = () => {
  const { t, fps } = useClock();

  const up = ramp(t, E(2, 1), E(2, 1) + 0.55, EASE_IN_OUT);
  const stamp = pop(t, E(2, 0), fps, SPRING.snappy);
  const shake = Math.max(0, 1 - (t - E(2, 0)) * 4) * Math.sin(t * 80) * 6;

  const W = 640;
  const scale = mix(1, 0.6, up);
  const top = mix(560, 420, up);

  const boxes = [
    { kind: 'console' as const, label: 'PS5', v: 'yes' as const, at: E(2, 2) },
    { kind: 'console' as const, label: 'XBOX SERIES', v: 'yes' as const, at: E(2, 3) },
    { kind: 'pc' as const, label: 'PC', v: 'no' as const, at: E(3, 0) },
    { kind: 'phone' as const, label: 'ANDROID', v: 'no' as const, at: E(3, 1) },
  ];
  const size = 170;
  const gap = 22;
  const x0 = 540 - (4 * size + 3 * gap) / 2;
  const rowY = 820;
  const official = pop(t, E(2, 3) + 0.4, fps, SPRING.pop);
  const none = pop(t, E(3, 1) + 0.35, fps, SPRING.pop);

  return (
    <>
      <div style={{ position: 'absolute', left: 540 - W / 2, top, width: W, transformOrigin: '50% 0%', scale: `${scale}`, translate: `${shake}px 0px` }}>
        <LinkCard width={W} title={LINK_TITLE} />
        <Stamp text="كذب" p={stamp} size={150} rotate={-12} style={{ mixBlendMode: 'normal', background: 'rgba(238,238,234,0.88)', left: W / 2, top: 220, translate: '-50% -50%' }} />
      </div>

      {boxes.map((b, i) => {
        const p = pop(t, b.at - 0.15, fps, SPRING.pop);
        const v = pop(t, b.at + 0.12, fps, SPRING.snappy);
        const x = x0 + i * (size + gap);
        return (
          <React.Fragment key={b.label}>
            <PlatformBox kind={b.kind} label={b.label} verdict={b.v} verdictP={v} p={p} size={size} style={{ left: x, top: rowY }} />
            {b.v === 'no' && <XStamp p={v} size={150} style={{ left: x + size / 2 - 75, top: rowY + size / 2 - 75 }} />}
          </React.Fragment>
        );
      })}

      {/* brackets under the row: official vs none */}
      <StickerPill text="OFFICIAL ONLY" tone="green" p={official} rotate={-3} size={28} style={{ left: x0 + 30, top: rowY + size + 80 }} />
      <StickerPill text="ما كاين حتى نسخة" tone="red" p={none} rotate={3} size={40} style={{ left: x0 + 2 * (size + gap) + 10, top: rowY + size + 74 }} />
    </>
  );
};
