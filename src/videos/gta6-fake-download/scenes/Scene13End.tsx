import React from 'react';
import { ScanLine } from '../../../components/Canvas';
import { DrawPath, quadPoint } from '../../../components/Diagram';
import { Mono, Stamp, StickerPill } from '../../../components/Labels';
import { LinkCard, SeriesPill } from '../../../components/Scam';
import { UserGlyph } from '../../../components/Web';
import { arabic, display } from '../../../fonts';
import { mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';
import { ChatPhone, E, LINK_TITLE } from './parts';

const L = theme.light;
const A = theme.accent;

/**
 * Share CTA, then the end card (series pill · 01, next-episode teaser, wordmark, follow button),
 * and in the last 0.4 s the frame-1 phone starts rising again so the loop is seamless.
 */
export const Scene13End: React.FC<SceneProps> = () => {
  const { t, fps } = useClock();
  const e = (i: number) => E(13, i);

  // part 1: send the video to your friend
  const send = ramp(t, e(0) + 0.1, e(0) + 0.9, EASE_IN_OUT);
  const chat = pop(t, e(0), fps, SPRING.pop);
  const cta = pop(t, e(0) + 0.25, fps, SPRING.pop);
  const away = ramp(t, e(1) - 0.35, e(1) + 0.05, EASE_IN_OUT);
  // part 2: end card
  const series = pop(t, e(1), fps, SPRING.pop);
  const mini = pop(t, e(1) + 0.1, fps, SPRING.soft);
  const stamp = pop(t, e(1) + 0.3, fps, SPRING.snappy);
  const mark = pop(t, e(1) + 0.15, fps, SPRING.soft);
  const scan = ramp(t, e(1) + 0.3, e(1) + 1.0, EASE_IN_OUT);
  const next = pop(t, e(1) + 0.5, fps, SPRING.pop);
  const button = pop(t, e(1) + 0.7, fps, SPRING.pop);
  const breathe = t > e(1) + 1 ? 1 + 0.03 * Math.sin((t - e(1)) * 5) : 1;
  // part 3: loop
  const loop = ramp(t, e(2) - 0.05, e(2) + 0.35, EASE_IN_OUT);

  const from: [number, number] = [300, 640];
  const to: [number, number] = [780, 760];
  const ctrl: [number, number] = [560, 420];
  const [px, py] = quadPoint(from, ctrl, to, send);

  return (
    <>
      <div style={{ opacity: 1 - away }}>
        <DrawPath d={`M${from[0]} ${from[1]} Q ${ctrl[0]} ${ctrl[1]} ${to[0]} ${to[1]}`} p={send} dashed width={4} color={L.ink} opacity={0.4} arrow />
        <div style={{ position: 'absolute', left: to[0] - 110, top: to[1] - 40, width: 220, height: 200, borderRadius: 24, background: L.surface, border: `3px solid ${L.ink}`, boxShadow: theme.shadow.card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: Math.min(1, chat * 3), scale: `${0.6 + 0.4 * chat}` }}>
          <UserGlyph size={70} />
          <span style={{ fontFamily: arabic, fontWeight: 800, fontSize: 40, color: L.ink }}>صاحبك</span>
        </div>
        <div style={{ position: 'absolute', left: px - 130, top: py - 70, scale: `${mix(1, 0.4, send)}`, opacity: 1 - ramp(send, 0.85, 1) }}>
          <LinkCard width={260} title="GTA 6 PC" meta="RUNTIME.TECH" domain="video" cta="SEND" />
        </div>
        <StickerPill text="ابعثها لصاحبك" tone="ink" p={cta} rotate={-3} size={60} style={{ left: 250, top: 1010 }} />
      </div>

      <div style={{ opacity: away * (1 - loop) }}>
        <SeriesPill ep="01" p={series} size={44} style={{ left: 540, top: 430, translate: '-50% 0px' }} />
        <div style={{ position: 'absolute', left: 540 - 190, top: 540, width: 380, opacity: Math.min(1, mini * 3), scale: `${0.7 + 0.3 * mini}`, rotate: '-3deg' }}>
          <LinkCard width={380} title={LINK_TITLE} />
          <Stamp text="كذب" p={stamp} size={92} rotate={-12} style={{ mixBlendMode: 'normal', background: 'rgba(238,238,234,0.88)', left: 190, top: 130, translate: '-50% -50%' }} />
        </div>
        <StickerPill text="الجاي: كيفاش ترجع الـaccount" tone="yellow" p={next} rotate={3} size={36} style={{ left: 200, top: 860 }} />

        <div style={{ position: 'absolute', left: 0, right: 0, top: 960, height: 152, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, mark * 3), translate: `0px ${(1 - Math.min(mark, 1)) * 30}px` }}>
          <div style={{ position: 'relative', fontFamily: display, fontWeight: 900, fontSize: 124, lineHeight: 1, color: L.ink, letterSpacing: '-0.02em' }}>
            Runtime<span style={{ color: L.inkSoft, fontWeight: 800 }}>.tech</span>
            {scan > 0 && scan < 1 && <ScanLine y={8 + scan * 112} left={-30} width={800} />}
          </div>
          <div style={{ marginTop: 14, opacity: ramp(t, e(1) + 0.5, e(1) + 0.9) }}>
            <Mono size={24} color={L.mono}>
              TECH · EXPLAINED SIMPLY
            </Mono>
          </div>
        </div>

        <div style={{ position: 'absolute', left: 0, right: 0, top: 1170, display: 'flex', justifyContent: 'center' }}>
          <div dir="rtl" style={{ height: 80, padding: '0 40px', borderRadius: 14, background: L.ink, color: '#F4F4F0', display: 'flex', alignItems: 'center', gap: 16, boxShadow: theme.shadow.lift, opacity: Math.min(1, button * 3), scale: `${(0.6 + 0.4 * button) * breathe}` }}>
            <span style={{ fontFamily: arabic, fontWeight: 800, fontSize: 40, paddingTop: 4 }}>تابع باش ما يفوتكش الجاي</span>
            <span style={{ fontFamily: display, fontWeight: 900, fontSize: 38 }}>←</span>
          </div>
        </div>
      </div>

      {/* loop: the frame-1 phone starts rising again */}
      {loop > 0 && <ChatPhone rise={mix(0, 0.2, loop)} bubble={0} card={0} />}
    </>
  );
};
