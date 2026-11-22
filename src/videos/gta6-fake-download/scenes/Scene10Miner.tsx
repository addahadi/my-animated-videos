import React from 'react';
import { DrawPath, NodeBox, quadPoint } from '../../../components/Diagram';
import { SpeedBar, SpeedDial, Thermometer } from '../../../components/Hardware';
import { ServerIcon } from '../../../components/Icons';
import { Mono, StickerPill } from '../../../components/Labels';
import { FanTower } from '../../../components/Scam';
import { display } from '../../../fonts';
import { mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';
import { E } from './parts';

const L = theme.light;
const D = theme.dark;
const A = theme.accent;

/**
 * Type 2, the hidden miner (dark blueprint): PC tower, CPU dial to 100%, coins leaking to a far
 * NOT YOU server, heat rising red, speed dropping, the fan spinning faster.
 */
export const Scene10Miner: React.FC<SceneProps> = () => {
  const { t, fps } = useClock();
  const e = (i: number) => E(10, i);

  const tower = pop(t, e(0), fps, SPRING.soft);
  const cpu = ramp(t, e(1), e(1) + 0.8, EASE_IN_OUT);
  const dial = pop(t, e(1) - 0.2, fps, SPRING.pop);
  const node = pop(t, e(2) - 0.15, fps, SPRING.pop);
  const heat = ramp(t, e(3), e(3) + 1.0);
  const thermo = pop(t, e(3) - 0.15, fps, SPRING.pop);
  const slow = ramp(t, e(4), e(4) + 0.8);
  const bar = pop(t, e(4) - 0.15, fps, SPRING.pop);
  const fast = ramp(t, e(5), e(5) + 1.2);
  const sticker = pop(t, e(5) + 0.2, fps, SPRING.pop);

  // fan angle: integrate a speed that rises with cpu and then the "fast" phase (closed form)
  const t0 = e(0);
  const base = 120; // deg/s idle
  const angle = base * (t - t0) + 500 * Math.max(0, t - e(1)) + 900 * Math.max(0, t - e(5)) * fast;

  const T = { x: 150, y: 560, h: 560 };
  const N = { x: 700, y: 410, w: 210, h: 170 };
  const from: [number, number] = [T.x + T.h * 0.52, T.y + 90];
  const to: [number, number] = [N.x + 20, N.y + N.h / 2];
  const ctrl: [number, number] = [560, 380];

  return (
    <>
      <FanTower height={T.h} angle={angle} heat={heat} p={tower} style={{ left: T.x, top: T.y }} />
      <div style={{ position: 'absolute', left: T.x, top: T.y + T.h + 18, width: T.h * 0.52, display: 'flex', justifyContent: 'center', opacity: tower }}>
        <Mono size={22} color={D.mono} weight={800}>
          YOUR PC
        </Mono>
      </div>

      <DrawPath d={`M${from[0]} ${from[1]} Q ${ctrl[0]} ${ctrl[1]} ${to[0]} ${to[1]}`} p={ramp(t, e(2), e(2) + 0.5)} dashed width={3} color={D.delta} opacity={0.6} />
      <NodeBox icon={<ServerIcon size={56} color={D.text} />} label="NOT YOU" mode="dark" width={N.w} height={N.h} glow={0.4} glowColor={D.delta} style={{ left: N.x, top: N.y, opacity: Math.min(1, node * 3), scale: `${0.7 + 0.3 * node}` }} />
      {t > e(2) &&
        [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const ph = ((t - e(2)) * 0.9 + i / 8) % 1;
          const [x, y] = quadPoint(from, ctrl, to, ph);
          return (
            <div key={i} style={{ position: 'absolute', left: x - 18, top: y - 18, width: 36, height: 36, borderRadius: 99, background: D.delta, border: `3px solid ${L.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, (t - e(2)) * 3) * Math.min(1, ph * 6, (1 - ph) * 6) }}>
              <span style={{ fontFamily: display, fontWeight: 900, fontSize: 20, color: L.ink }}>$</span>
            </div>
          );
        })}

      <SpeedDial size={250} value={mix(0.15, 1, cpu)} label="CPU" mode="dark" color={cpu > 0.8 ? A.red : undefined} p={dial} style={{ left: 640, top: 640 }} />
      <Thermometer height={300} value={mix(0.2, 1, heat)} p={thermo} style={{ left: 545, top: 930 }} />
      <div style={{ position: 'absolute', left: 660, top: 990, width: 260, padding: '16px 18px', borderRadius: 18, background: L.surface, border: `3px solid ${L.ink}`, opacity: Math.min(1, bar * 3), scale: `${0.8 + 0.2 * bar}` }}>
        <SpeedBar width={220} value={mix(0.9, 0.18, slow)} label="SPEED" style={{ position: 'relative' }} />
      </div>
      <StickerPill text="PC يخدم لغيرك" tone="red" p={sticker} rotate={-4} size={52} style={{ left: 300, top: 1200 }} />
    </>
  );
};
