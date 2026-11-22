import React from 'react';
import { ScanLine } from '../../../components/Canvas';
import { DeviceMock, PhoneFeed, type AdKind } from '../../../components/Device';
import { CommentIcon } from '../../../components/Icons';
import { Mono, SpeechBubble, Stamp } from '../../../components/Labels';
import { arabic, display } from '../../../fonts';
import { evAt, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';

const L = theme.light;

const feed: { kind: AdKind; variant: number }[] = Array.from({ length: 6 }, (_, i) => ({ kind: 'shoe', variant: i }));

/** End card: the hook's phone returns (loop), stamp, wordmark with scan, one CTA. */
export const Scene13End: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  const phone = pop(t, e(0), fps, SPRING.soft);
  const stamp = pop(t, e(1), fps, SPRING.snappy);
  const mark = pop(t, e(2) - 0.15, fps, SPRING.soft);
  const scan = ramp(t, e(2) + 0.1, e(2) + 0.9, EASE_IN_OUT);
  const tagline = ramp(t, e(2) + 0.35, e(2) + 0.75);
  const bubble = pop(t, e(3), fps, SPRING.pop);
  const button = pop(t, e(4), fps, SPRING.pop);
  const breathe = t > e(4) + 0.6 ? 1 + 0.03 * Math.sin((t - e(4)) * 5) : 1;
  const W = 210;
  const H = 420;

  return (
    <>
      <DeviceMock width={W} height={H} style={{ left: 540 - W / 2, top: 530, opacity: Math.min(1, phone * 3), scale: `${0.7 + 0.3 * phone}`, rotate: '-2deg' }}>
        <PhoneFeed width={W - 2 * Math.max(8, W * 0.035) - 4} items={feed} top={40} gap={8} scroll={(t - e(0)) * 14} />
      </DeviceMock>
      <Stamp text="EXPLAINED" p={stamp} size={58} rotate={-12} style={{ left: 540, top: 745, translate: '-50% -50%' }} />
      <SpeechBubble p={bubble} tail="left" size={34} style={{ left: 700, top: 560 }}>
        <CommentIcon size={36} />
        <Mono size={28} color={L.ink} weight={800}>
          PART 2?
        </Mono>
      </SpeechBubble>

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

      {/* the one call to action */}
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
          <span style={{ fontFamily: arabic, fontWeight: 800, fontSize: 38, paddingTop: 4 }}>كتبلي</span>
          <Mono size={30} color="#F4F4F0" weight={800}>
            PART 2
          </Mono>
          <span style={{ fontFamily: display, fontWeight: 900, fontSize: 36 }}>←</span>
        </div>
      </div>
    </>
  );
};
