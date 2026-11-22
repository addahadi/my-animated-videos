import React from 'react';
import { MicIcon, SearchIcon } from '../../../components/Icons';
import { ArText, Card, Mono, StickerPill } from '../../../components/Labels';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';

const L = theme.light;
const A = theme.accent;

/** The mic as "SUSPECT #1": a mugshot-style case card with a height chart behind it. */
export const Scene02Suspect: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  const card = pop(t, e(1) - 0.3, fps, SPRING.soft);
  const mic = pop(t, e(1) + 0.05, fps, SPRING.pop);
  const label = pop(t, e(1) + 0.3, fps, SPRING.soft);
  // "let's see why it's not logical": a magnifier sweeps over the mic
  const lensIn = ramp(t, e(1) + 0.9, e(1) + 1.5);
  const lensPath = ramp(t, e(1) + 1.0, e(2) + 0.6, EASE_IN_OUT);
  const lensOut = ramp(t, e(3) - 0.2, e(3) + 0.2);
  const q = pop(t, e(2), fps, SPRING.pop);
  // listening waves pulse around the mic
  const wave = (t * 0.9) % 1;

  const CX = 540;
  const CY = 790;

  return (
    <>
      <Card
        lift
        style={{
          left: 175,
          top: 470,
          width: 730,
          height: 760,
          opacity: Math.min(1, card * 3),
          translate: `0px ${(1 - Math.min(card, 1)) * 120}px`,
          rotate: `${mix(-4, -1, Math.min(card, 1))}deg`,
          overflow: 'hidden',
        }}
      >
        {/* header row */}
        <div style={{ position: 'absolute', left: 30, right: 30, top: 24, display: 'flex', justifyContent: 'space-between' }}>
          <Mono size={22} color={L.ink} weight={800}>
            CASE FILE · SUSPECT #1
          </Mono>
          <Mono size={22}>ID 0001</Mono>
        </div>
        {/* height chart */}
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: 30, right: 30, top: 90 + i * 52, height: 2, background: 'rgba(11,15,21,0.12)' }}>
            <span style={{ position: 'absolute', left: 0, top: -24 }}>
              <Mono size={16} color="rgba(108,108,108,0.8)">{`${200 - i * 10}`}</Mono>
            </span>
          </div>
        ))}
        {/* name plate */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 34,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            opacity: Math.min(1, label * 2),
            translate: `0px ${(1 - Math.min(label, 1)) * 30}px`,
          }}
        >
          <div style={{ background: L.ink, borderRadius: 14, padding: '14px 46px 6px' }}>
            <ArText size={76} color="#F4F4F0">
              الميكرو
            </ArText>
          </div>
          <Mono size={22} color={L.ink}>CHARGE: LISTENING TO YOU</Mono>
        </div>
      </Card>

      {/* the suspect */}
      <div style={{ position: 'absolute', left: CX - 150, top: CY - 190, width: 300, height: 300, opacity: Math.min(1, mic * 3), scale: `${0.5 + 0.5 * mic}` }}>
        {[0, 0.33, 0.66].map((o) => {
          const w = (wave + o) % 1;
          return <div key={o} style={{ position: 'absolute', inset: 20 - w * 70, borderRadius: 999, border: `3px solid ${A.red}`, opacity: (1 - w) * 0.45 }} />;
        })}
        <div
          style={{
            position: 'absolute',
            inset: 20,
            borderRadius: 999,
            background: '#F6F6F2',
            border: `4px solid ${L.ink}`,
            boxShadow: theme.shadow.card,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            rotate: `${Math.sin(t * 2.2) * 3}deg`,
          }}
        >
          <MicIcon size={150} stroke={3.2} fill="#F6D9D8" />
        </div>
      </div>

      {/* magnifier inspecting the suspect */}
      {lensIn > 0 && lensOut < 1 && (
        <div
          style={{
            position: 'absolute',
            left: mix(CX + 60, CX - 150, lensPath) + Math.sin(t * 3) * 6,
            top: mix(CY - 160, CY - 20, lensPath),
            opacity: lensIn * (1 - lensOut),
            scale: `${0.7 + 0.3 * lensIn}`,
          }}
        >
          <div style={{ width: 150, height: 150, borderRadius: 999, background: 'rgba(238,238,234,0.25)', border: `6px solid ${L.ink}`, boxShadow: 'inset 0 0 0 4px rgba(255,255,255,0.6)' }} />
          <div style={{ position: 'absolute', left: 128, top: 128, width: 80, height: 18, borderRadius: 9, background: L.ink, rotate: '45deg', transformOrigin: '0 50%' }} />
          <div style={{ position: 'absolute', left: 30, top: 30, opacity: 0.25 }}>
            <SearchIcon size={10} />
          </div>
        </div>
      )}

      {/* the question mark on the suspect */}
      <StickerPill text="?" tone="ink" p={q} rotate={8} size={86} style={{ left: 740, top: 560, padding: '18px 40px' }} />
    </>
  );
};
