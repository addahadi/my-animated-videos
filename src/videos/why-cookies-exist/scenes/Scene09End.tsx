import React from 'react';
import { ScanLine } from '../../../components/Canvas';
import { DrawPath } from '../../../components/Diagram';
import { EyeIcon } from '../../../components/Icons';
import { Mono, Stamp, StickerPill } from '../../../components/Labels';
import { TicketChip } from '../../../components/Web';
import { arabic, display } from '../../../fonts';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';

const L = theme.light;
const A = theme.accent;

// faint advertisers that also "remember" you (around the ticket)
const WATCHERS: [number, number][] = [
  [205, 470],
  [735, 500],
  [215, 860],
  [745, 880],
];

/** Loop ending: the ticket alone; who else remembers you? faint advertisers watch; then the end card. */
export const Scene09End: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  const ticket = pop(t, e(0) + 0.1, fps, SPRING.soft);
  const float = Math.sin((t - e(0)) * 2.2) * 8;
  const q = pop(t, e(2), fps, SPRING.pop);
  const watchers = WATCHERS.map((_, i) => ramp(t, e(3) + i * 0.3, e(3) + i * 0.3 + 0.5));
  const end = ramp(t, e(5) - 0.35, e(5) + 0.25, EASE_IN_OUT);
  const mark = pop(t, e(5) - 0.1, fps, SPRING.soft);
  const scan = ramp(t, e(5) + 0.1, e(5) + 0.9, EASE_IN_OUT);
  const tagline = ramp(t, e(5) + 0.35, e(5) + 0.75);
  const stamp = pop(t, e(5) + 0.2, fps, SPRING.snappy);
  const button = pop(t, e(6), fps, SPRING.pop);
  const comment = pop(t, e(6) + 0.2, fps, SPRING.pop);
  const breathe = t > e(6) + 0.6 ? 1 + 0.03 * Math.sin((t - e(6)) * 5) : 1;

  // ticket: big in the centre, then shrinks into the end-card object zone
  const tw = mix(460, 330, end);
  const tx = 540 - tw / 2;
  const ty = mix(640, 640, end) + float;

  return (
    <>
      {WATCHERS.map(([x, y], i) => (
        <React.Fragment key={i}>
          <DrawPath d={`M${x + 70} ${y + 50} L${540} ${ty + tw * 0.23}`} p={watchers[i]} dashed width={3} color={A.red} opacity={0.4 * (1 - end * 0.4)} />
          <div
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 140,
              height: 100,
              borderRadius: 16,
              border: `3px dashed ${A.red}`,
              background: 'rgba(238,238,234,0.6)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              opacity: watchers[i] * (1 - end * 0.5),
            }}
          >
            <EyeIcon size={40} color={A.red} />
            <Mono size={16} color={A.red} weight={800}>
              ADS CO.
            </Mono>
          </div>
        </React.Fragment>
      ))}

      <TicketChip id="48213" width={tw} glow={0.35 + 0.25 * Math.sin(t * 3)} style={{ left: tx, top: ty, opacity: Math.min(1, ticket * 3), scale: `${0.6 + 0.4 * Math.min(ticket, 1.05)}`, rotate: `${-3 + float * 0.15}deg` }} />
      <StickerPill text="شكون آخر؟" tone="ink" p={q * (1 - end)} rotate={6} size={46} style={{ left: 560, top: 850 }} />
      <Stamp text="EXPLAINED" p={stamp} size={54} rotate={-12} style={{ left: 540, top: 880, translate: '-50% -50%' }} />

      {/* wordmark */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1018, height: 152, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, mark * 3), translate: `0px ${(1 - Math.min(mark, 1)) * 30}px` }}>
        <div style={{ position: 'relative', fontFamily: display, fontWeight: 900, fontSize: 124, lineHeight: 1, color: L.ink, letterSpacing: '-0.02em' }}>
          Runtime<span style={{ color: L.inkSoft, fontWeight: 800 }}>.tech</span>
          {scan > 0 && scan < 1 && <ScanLine y={8 + scan * 112} left={-30} width={800} />}
        </div>
        <div style={{ marginTop: 14, opacity: tagline }}>
          <Mono size={24} color={L.mono}>
            TECH · EXPLAINED SIMPLY
          </Mono>
        </div>
      </div>

      {/* comment prompt + the one call to action */}
      <StickerPill text="Accept ولا Reject؟" tone="yellow" p={comment} rotate={-4} size={34} style={{ left: 600, top: 470 }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1246, display: 'flex', justifyContent: 'center' }}>
        <div
          dir="rtl"
          style={{
            height: 74,
            padding: '0 36px',
            borderRadius: 14,
            background: L.ink,
            color: '#F4F4F0',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            boxShadow: theme.shadow.lift,
            opacity: Math.min(1, button * 3),
            scale: `${(0.6 + 0.4 * button) * breathe}`,
          }}
        >
          <span style={{ fontFamily: arabic, fontWeight: 800, fontSize: 38, paddingTop: 4 }}>تابع للجاية</span>
          <span style={{ fontFamily: display, fontWeight: 900, fontSize: 36 }}>←</span>
        </div>
      </div>
    </>
  );
};
