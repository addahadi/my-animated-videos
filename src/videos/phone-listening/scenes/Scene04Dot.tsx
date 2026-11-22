import React from 'react';
import { DeviceMock, StatusBar } from '../../../components/Device';
import { DrawPath } from '../../../components/Diagram';
import { MicIcon } from '../../../components/Icons';
import { Mono, StickerPill } from '../../../components/Labels';
import { display } from '../../../fonts';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';

const L = theme.light;
const A = theme.accent;

// phone drawn huge; we look at its top. The privacy dot sits inside the island (computed from DeviceMock geometry).
const PW = 760;
const PX = 160;
const PY = 500;
const DOT: [number, number] = [620, 587];

/** Zoom into a generic status bar: the colored privacy dot = the mic is on. */
export const Scene04Dot: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  // camera: starts wide (small phone), pushes into the top of the screen
  const zoom = ramp(t, e(0) - 0.05, e(0) + 1.0, EASE_IN_OUT);
  const s = mix(0.42, 1, zoom);
  const dot = pop(t, e(1), fps, SPRING.pop);
  const ring = ramp(t, e(2), e(2) + 0.5, EASE_IN_OUT);
  const arrow = ramp(t, e(2) + 0.25, e(2) + 0.8, EASE_IN_OUT);
  const label = pop(t, e(2) + 0.55, fps, SPRING.soft);
  const sticker = pop(t, e(3), fps, SPRING.pop);
  const pulse = ((t - e(1)) * 1.2) % 1;
  const appear = ramp(t, e(0) - 0.1, e(0) + 0.25);

  return (
    <>
      <div style={{ position: 'absolute', inset: 0, scale: `${s}`, transformOrigin: `${DOT[0]}px ${DOT[1] + 120}px`, opacity: appear }}>
        <div style={{ position: 'absolute', inset: 0, maskImage: 'linear-gradient(180deg, #000 0%, #000 62%, transparent 70%)', WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 62%, transparent 70%)' }}>
          <DeviceMock
            width={PW}
            height={1560}
            style={{ left: PX, top: PY }}
            island={
              dot > 0.001 ? (
                <div style={{ width: 22, height: 22, borderRadius: 99, background: A.green, scale: `${Math.min(dot, 1.2)}`, boxShadow: `0 0 ${10 + 8 * Math.sin(t * 6)}px ${A.green}` }} />
              ) : null
            }
          >
            <div style={{ position: 'absolute', left: 0, right: 0, top: 10 }}>
              <StatusBar width={PW - 2 * 26.6 - 10} scale={1.5} />
            </div>
            {/* lock screen */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: display, fontWeight: 800, fontSize: 190, color: L.ink, letterSpacing: '-0.02em', opacity: 0.88 }}>9:41</div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center' }}>
              <Mono size={24}>WEDNESDAY · 11 NOVEMBER</Mono>
            </div>
            {[0, 1].map((i) => (
              <div key={i} style={{ position: 'absolute', left: 60 + i * 330, top: 420, width: 290, height: 150, borderRadius: 30, background: 'rgba(11,15,21,0.07)', border: '2px solid rgba(11,15,21,0.12)' }} />
            ))}
          </DeviceMock>
        </div>

        {/* pulse rings around the dot */}
        {dot > 0.01 &&
          [0, 0.5].map((o) => {
            const w = (pulse + o) % 1;
            return (
              <div
                key={o}
                style={{ position: 'absolute', left: DOT[0] - 11 - w * 40, top: DOT[1] - 11 - w * 40, width: 22 + w * 80, height: 22 + w * 80, borderRadius: 999, border: `3px solid ${A.green}`, opacity: (1 - w) * 0.8 }}
              />
            );
          })}
      </div>

      {/* annotation (drawn in screen space after the zoom settles) */}
      <DrawPath d={`M ${DOT[0] + 0.1} ${DOT[1] - 62} a 62 62 0 1 1 -0.2 0`} p={ring} color={A.green} width={6} />
      <DrawPath d={`M 330 900 C 360 760, 460 650, ${DOT[0] - 70} ${DOT[1] + 40}`} p={arrow} color={L.ink} width={6} arrow />
      <div style={{ position: 'absolute', left: 180, top: 920, opacity: Math.min(1, label * 3), translate: `0px ${(1 - Math.min(label, 1)) * 20}px`, display: 'flex', alignItems: 'center', gap: 12, background: L.surface, border: `3px solid ${L.ink}`, borderRadius: 16, padding: '12px 18px', boxShadow: theme.shadow.card }}>
        <MicIcon size={40} />
        <Mono size={24} color={L.ink} weight={800}>
          MIC IN USE
        </Mono>
      </div>
      <StickerPill text="MIC ON" tone="green" p={sticker} rotate={-5} size={44} style={{ left: 520, top: 1060 }} />
    </>
  );
};
