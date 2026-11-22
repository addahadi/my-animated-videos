import React from 'react';
import { DeviceMock } from '../../../components/Device';
import { DrawPath, NodeBox, quadPoint } from '../../../components/Diagram';
import { BatteryIcon, MicIcon, ServerIcon } from '../../../components/Icons';
import { Card, Mono, Stamp } from '../../../components/Labels';
import { display } from '../../../fonts';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';

const L = theme.light;
const A = theme.accent;

const P0: [number, number] = [400, 690];
const C: [number, number] = [540, 560];
const P1: [number, number] = [688, 690];

const WaveChip: React.FC<{ phase: number }> = ({ phase }) => (
  <div style={{ width: 86, height: 40, borderRadius: 99, background: L.surface, border: `3px solid ${L.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, boxShadow: theme.shadow.card }}>
    {[0.4, 0.9, 0.6, 1, 0.5, 0.8].map((h, i) => (
      <div key={i} style={{ width: 5, height: 24 * (0.35 + 0.65 * Math.abs(Math.sin(phase * 6 + i * 1.3)) * h), borderRadius: 3, background: A.red }} />
    ))}
  </div>
);

/** "If it recorded you 24/7": audio streams to a server, battery drains, data climbs. */
export const Scene03Drain: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  const phone = pop(t, e(0) - 0.05, fps, SPRING.soft);
  const server = pop(t, e(0) + 0.15, fps, SPRING.soft);
  const arrow = ramp(t, e(0) + 0.3, e(1) - 0.2, EASE_IN_OUT);
  const glow = ramp(t, e(2), e(2) + 0.4) * (0.75 + 0.25 * Math.sin(t * 9));
  const bat = pop(t, e(3) - 0.45, fps, SPRING.soft);
  const drain = ramp(t, e(3), e(3) + 1.7, EASE_IN_OUT);
  const level = mix(1, 0.09, drain);
  const data = pop(t, e(4) - 0.35, fps, SPRING.soft);
  const dataFill = ramp(t, e(4), e(4) + 1.0, EASE_IN_OUT);
  const stamp = pop(t, e(5), fps, SPRING.snappy);
  const dimAll = ramp(t, e(5), e(5) + 0.2) * 0.22;
  const rec = Math.floor(t * 2) % 2 === 0;

  // audio chips streaming phone -> server
  const chips = [];
  if (t > e(1) - 0.1) {
    for (let k = 0; k < 14; k++) {
      const born = e(1) - 0.1 + k * 0.42;
      const u = (t - born) / 1.15;
      if (u < 0 || u > 1) continue;
      const [x, y] = quadPoint(P0, C, P1, EASE_IN_OUT(u));
      chips.push(
        <div key={k} style={{ position: 'absolute', left: x - 43, top: y - 20, opacity: Math.min(1, u * 6, (1 - u) * 6), scale: `${0.8 + 0.2 * Math.sin(u * Math.PI)}` }}>
          <WaveChip phase={t + k} />
        </div>,
      );
    }
  }

  const batColor = level > 0.5 ? A.green : level > 0.2 ? A.yellow : A.red;

  return (
    <>
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - dimAll }}>
        {/* the phone, recording */}
        <DeviceMock
          width={210}
          height={430}
          style={{ left: 185, top: 480, opacity: Math.min(1, phone * 3), translate: `${(1 - Math.min(phone, 1)) * -80}px 0px`, rotate: '-2deg' }}
        >
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
            <MicIcon size={84} fill="#F6D9D8" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 99, background: A.red, border: `2.5px solid ${L.ink}` }}>
              <div style={{ width: 12, height: 12, borderRadius: 99, background: '#fff', opacity: rec ? 1 : 0.3 }} />
              <Mono size={18} color="#fff" weight={800}>
                REC 24/7
              </Mono>
            </div>
          </div>
        </DeviceMock>

        <DrawPath d={`M ${P0[0]} ${P0[1]} Q ${C[0]} ${C[1]} ${P1[0]} ${P1[1]}`} p={arrow} dashed width={5} color={L.ink} opacity={0.55} />
        {chips}

        <NodeBox
          icon={<ServerIcon size={110} blink={t * 4} />}
          label="SERVER"
          width={210}
          height={250}
          glow={glow}
          glowColor={A.red}
          style={{ left: 690, top: 570, opacity: Math.min(1, server * 3), translate: `${(1 - Math.min(server, 1)) * 80}px 0px` }}
        />

        {/* battery card */}
        <Card style={{ left: 175, top: 990, width: 350, height: 250, opacity: Math.min(1, bat * 3), translate: `0px ${(1 - Math.min(bat, 1)) * 60}px` }}>
          <div style={{ position: 'absolute', left: 26, top: 20 }}>
            <Mono size={20}>BATTERY</Mono>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 58, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
            <BatteryIcon size={118} level={level} levelColor={batColor} stroke={3.2} />
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 18, textAlign: 'center', fontFamily: display, fontWeight: 900, fontSize: 64, color: level < 0.2 ? A.red : L.ink, fontVariantNumeric: 'tabular-nums' }}>
            {Math.round(level * 100)}%
          </div>
        </Card>

        {/* data card */}
        <Card style={{ left: 555, top: 990, width: 350, height: 250, opacity: Math.min(1, data * 3), translate: `0px ${(1 - Math.min(data, 1)) * 60}px` }}>
          <div style={{ position: 'absolute', left: 26, top: 20 }}>
            <Mono size={20}>DATA USED</Mono>
          </div>
          <div style={{ position: 'absolute', left: 30, right: 30, top: 80, height: 54, borderRadius: 12, border: `3px solid ${L.ink}`, overflow: 'hidden', background: '#F6F6F2' }}>
            <div style={{ width: `${dataFill * 100}%`, height: '100%', background: `linear-gradient(90deg, ${A.yellow}, ${A.red})` }} />
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 22, display: 'flex', justifyContent: 'center', gap: 6 }}>
            {[0, 1, 2].map((i) => {
              const bob = ((t * 1.6 + i * 0.33) % 1);
              return (
                <div key={i} style={{ fontFamily: display, fontWeight: 900, fontSize: 60, color: A.red, translate: `0px ${-bob * 18 * dataFill}px`, opacity: dataFill > 0.05 ? 0.4 + 0.6 * (1 - bob) : 0.15 }}>
                  ↑
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Stamp text="ماشي منطقي" p={stamp} size={96} rotate={-10} style={{ left: 540, top: 820, translate: '-50% -50%' }} />
    </>
  );
};
