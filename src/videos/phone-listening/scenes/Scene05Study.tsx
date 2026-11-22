import React from 'react';
import { ScanLine } from '../../../components/Canvas';
import { AppGrid, Counter } from '../../../components/Diagram';
import { ArText, Card, Mono, StickerPill, ValueTag } from '../../../components/Labels';
import { display } from '../../../fonts';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, EASE_OUT, SPRING, theme } from '../../../theme';

const L = theme.light;
const A = theme.accent;

export const GRID = { cols: 7, rows: 6, tile: 78, gap: 18, left: 213, top: 610 };
export const gridW = GRID.cols * GRID.tile + (GRID.cols - 1) * GRID.gap;
export const gridH = GRID.rows * GRID.tile + (GRID.rows - 1) * GRID.gap;

/** 2018 study: 17,000+ apps scanned, zero secret audio leaks. Honest nuance as a replaced value. */
export const Scene05Study: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  const year = pop(t, e(0), fps, SPRING.soft);
  const count = pop(t, e(2) - 0.25, fps, SPRING.soft);
  const roll = ramp(t, e(2) - 0.15, e(2) + 1.2, EASE_OUT);
  const scan = ramp(t, e(3), e(3) + 0.95, EASE_IN_OUT);
  const result = pop(t, e(4), fps, SPRING.pop);
  const zero = pop(t, e(4) + 0.15, fps, SPRING.pop);
  const dim = ramp(t, e(4) - 0.1, e(4) + 0.3) * 0.75;
  const gridFade = ramp(t, e(5) - 0.3, e(5) + 0.1) * 0.7;
  const nuance = pop(t, e(5) - 0.3, fps, SPRING.soft);
  const oldVal = pop(t, e(5) - 0.2, fps, SPRING.soft);
  const strike = ramp(t, e(5) + 0.25, e(5) + 0.6, EASE_IN_OUT);
  const swap = ramp(t, e(6) - 0.1, e(6) + 0.25);
  const newVal = pop(t, e(6), fps, SPRING.pop);
  const badge = pop(t, e(6) + 0.3, fps, SPRING.pop);

  const fill = (i: number) => {
    const r = Math.floor(i / GRID.cols);
    const c = i % GRID.cols;
    return pop(t, e(1) + (r * GRID.cols + c) * 0.028, fps, SPRING.snappy);
  };

  return (
    <>
      <ValueTag p={year} value="2018" caption="UNIVERSITY STUDY" size={64} string={26} style={{ left: 190, top: 400 }} />

      <AppGrid cols={GRID.cols} rows={GRID.rows} tile={GRID.tile} gap={GRID.gap} fill={fill} dim={dim} style={{ left: GRID.left, top: GRID.top, opacity: 1 - gridFade }} />
      {scan > 0 && scan < 1 && <ScanLine y={GRID.top - 10 + scan * (gridH + 20)} left={GRID.left - 40} width={gridW + 80} />}
      {scan > 0 && scan < 1 && (
        <div style={{ position: 'absolute', left: GRID.left - 20, top: GRID.top - 10, width: gridW + 40, height: scan * (gridH + 20), background: 'linear-gradient(180deg, rgba(155,231,255,0.0), rgba(155,231,255,0.18))', borderRadius: 12 }} />
      )}

      {/* apps-tested counter */}
      <Card style={{ left: 560, top: 470, width: 345, height: 124, opacity: Math.min(1, count * 3), translate: `0px ${(1 - Math.min(count, 1)) * -30}px`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
        <Counter value={17000 * roll} suffix={roll > 0.99 ? '+' : ''} style={{ fontSize: 72, color: L.ink, lineHeight: 1 }} />
        <Mono size={20}>APPS TESTED</Mono>
      </Card>

      {/* the result */}
      <Card
        lift
        style={{
          left: 250,
          top: 700,
          width: 580,
          height: 330,
          opacity: Math.min(1, result * 3),
          scale: `${0.8 + 0.2 * result}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Mono size={24} color={L.ink} weight={800}>
          SECRET AUDIO SENT
        </Mono>
        <div style={{ fontFamily: display, fontWeight: 900, fontSize: 210, lineHeight: 0.95, color: A.green, scale: `${0.5 + 0.5 * zero}`, opacity: Math.min(1, zero * 3) }}>0</div>
        <Mono size={20}>APPS CAUGHT</Mono>
      </Card>

      {/* not impossible -> but no evidence */}
      <Card style={{ left: 215, top: 1060, width: 650, height: 130, opacity: Math.min(1, nuance * 3), scale: `${0.9 + 0.1 * nuance}` }} />
      <div style={{ position: 'absolute', left: 540, top: 1085, translate: '-50% 0px' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, translate: `-50% ${-swap * 40}px`, opacity: Math.min(1, oldVal * 3) * (1 - swap), whiteSpace: 'nowrap' }}>
          <div style={{ position: 'relative' }}>
            <ArText size={66} color={mix(0, 1, strike) > 0.5 ? L.faded : L.ink}>
              مستحيل؟
            </ArText>
            <div style={{ position: 'absolute', left: -14, right: -14, top: '52%', height: 7, borderRadius: 4, background: A.red, scale: `${strike} 1`, transformOrigin: 'right center' }} />
          </div>
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, translate: '-50% 0px', opacity: Math.min(1, newVal * 3), scale: `${0.7 + 0.3 * newVal}`, whiteSpace: 'nowrap' }}>
          <ArText size={70}>ما كاين حتى دليل</ArText>
        </div>
      </div>
      <StickerPill text="NO EVIDENCE" tone="green" p={badge} rotate={-5} size={28} style={{ left: 640, top: 1170 }} />
    </>
  );
};
