import React from 'react';
import { ScanLine } from '../../../components/Canvas';
import { DrawPath } from '../../../components/Diagram';
import { BatteryIcon } from '../../../components/Icons';
import { ArText, Card, LockedChip, Mono, Stamp, StickerPill, ValueTag } from '../../../components/Labels';
import { MiniRow, MiniUI } from '../../../components/MiniUI';
import { arabic, display } from '../../../fonts';
import { evAt, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';
import { HomeTiles, YourPhone } from './parts';

const L = theme.light;
const A = theme.accent;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const NODES = [
  { y: 530, text: 'بطارية ضعيفة', tag: 'WEAK BATTERY' },
  { y: 790, text: 'التليفون أبطأ', tag: 'SLOWER' },
  { y: 1050, text: 'باش تشري جديد؟', tag: 'MOTIVE?' },
];

const Node: React.FC<{ y: number; text: string; tag: string; p: number; dashed?: boolean }> = ({ y, text, tag, p, dashed }) => (
  <Card
    style={{
      left: 250,
      top: y,
      width: 580,
      height: 140,
      borderStyle: dashed ? 'dashed' : 'solid',
      borderColor: dashed ? A.red : L.ink,
      opacity: clamp01(p * 3),
      scale: `${0.8 + 0.2 * Math.min(p, 1.04)}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 30px',
    }}
  >
    <Mono size={20} color={dashed ? A.red : L.mono} weight={800}>
      {tag}
    </Mono>
    <ArText size={50} color={dashed ? A.red : L.ink}>
      {text}
    </ArText>
  </Card>
);

/** Scene 11: the verdict unlocks. Battery -> slower is proven; slower -> "buy new" is not. */
export const Scene11Verdict: React.FC<SceneProps> = ({ events }) => {
  const { t, fps, startSec } = useClock();
  const e = (i: number) => evAt(events, i);
  const chip = pop(t, startSec + 0.05, fps, SPRING.pop);
  const open = ramp(t, e(1), e(1) + 0.5, EASE_IN_OUT);
  const n1 = pop(t, e(1) + 0.2, fps, SPRING.soft);
  const a1 = ramp(t, e(2) - 0.1, e(2) + 0.35);
  const n2 = pop(t, e(2) + 0.2, fps, SPRING.soft);
  const yes = pop(t, e(2) + 0.35, fps, SPRING.pop);
  const a2 = ramp(t, e(3), e(3) + 0.5);
  const n3 = pop(t, e(3) + 0.3, fps, SPRING.soft);
  const stamp = pop(t, e(4), fps, SPRING.snappy);
  return (
    <>
      <LockedChip label="VERDICT" open={open} style={{ left: 540, top: 430, translate: '-50% 0px', opacity: clamp01(chip * 3) }} />
      <Node {...NODES[0]} p={n1} />
      <DrawPath d="M540 676 L540 784" p={a1} width={8} arrow color={L.ink} />
      <Node {...NODES[1]} p={n2} />
      <StickerPill text="إيه · في حالات" tone="green" p={yes} rotate={-4} size={34} style={{ left: 580, top: 700 }} />
      <DrawPath d="M540 936 L540 1044" p={a2} width={8} arrow dashed color={A.red} />
      <Node {...NODES[2]} p={n3} dashed />
      <Stamp text="ما يثبتش" p={stamp} size={66} rotate={-10} style={{ left: 540, top: 1000, translate: '-50% -50%' }} />
    </>
  );
};

const StorageGlyph: React.FC = () => (
  <svg width={44} height={44} viewBox="0 0 48 48" fill="none" stroke={L.ink} strokeWidth={3}>
    <rect x="6" y="10" width="36" height="28" rx="5" />
    <path d="M12 30h10" strokeLinecap="round" />
    <circle cx="34" cy="30" r="2.5" fill={L.ink} stroke="none" />
  </svg>
);

/** Scene 12 (save frame): check before you buy. Built row by row, then held. */
export const Scene12CheckFirst: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);
  const card = pop(t, e(1), fps, SPRING.soft);
  const r1 = pop(t, e(2), fps, SPRING.pop);
  const r2 = pop(t, e(3), fps, SPRING.pop);
  const r3 = pop(t, e(4), fps, SPRING.pop);
  const hl = ramp(t, e(5), e(5) + 0.35);
  const save = pop(t, e(6), fps, SPRING.pop);
  return (
    <>
      <MiniUI title="قبل ما تبدّل" label="CHECK FIRST" width={750} p={card} style={{ left: 165, top: 470 }}>
        <MiniRow icon={<BatteryIcon size={44} level={0.55} />} text="حالة البطارية" tag="HEALTH %" p={r1} dim={hl * 0.4} />
        <MiniRow icon={<StorageGlyph />} text="التخزين الفارغ" tag="FREE GB" p={r2} dim={hl * 0.4} />
        <MiniRow icon={<BatteryIcon size={44} level={1} levelColor={A.green} />} text="بدّل البطارية" tag="IF WEAK" p={r3} highlighted={hl} />
      </MiniUI>
      <StickerPill text="توفّر دراهمك" tone="green" p={save} rotate={-4} size={44} style={{ left: 540, top: 1010, translate: '-50% 0px' }} />
    </>
  );
};

/** Scene 13: end card. The phone with its hanging tag again (echo of frame 0), wordmark, follow button. */
export const Scene13EndCard: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);
  const phone = pop(t, e(1), fps, SPRING.soft);
  const tag = pop(t, e(1) + 0.15, fps, SPRING.heavy);
  const mark = pop(t, e(2), fps, SPRING.soft);
  const scan = ramp(t, e(2) + 0.1, e(2) + 0.8, EASE_IN_OUT);
  const tagline = ramp(t, e(2) + 0.3, e(2) + 0.6);
  const stamp = pop(t, e(2) + 0.15, fps, SPRING.snappy);
  const button = pop(t, e(3), fps, SPRING.pop);
  const comment = pop(t, e(3) + 0.15, fps, SPRING.pop);
  const breathe = t > e(3) + 0.5 ? 1 + 0.03 * Math.sin((t - e(3)) * 5) : 1;
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, opacity: clamp01(phone * 3), translate: `0px ${(1 - clamp01(phone)) * 60}px` }}>
        <YourPhone x={440} y={540} w={200} h={370} statusBar={false}>
          <HomeTiles w={180} top={70} />
        </YourPhone>
      </div>
      <div style={{ position: 'absolute', left: 735, top: 560, width: 0 }}>
        <ValueTag value="€25M" caption="FINE" p={tag} size={40} string={34} style={{ left: 0, top: 0, translate: '-50% 0px' }} />
      </div>
      <Stamp text="EXPLAINED" p={stamp} size={54} rotate={-12} style={{ left: 540, top: 900, translate: '-50% -50%' }} />

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

      <StickerPill text="شحال عندو تليفونك؟" tone="yellow" p={comment} rotate={-4} size={34} style={{ left: 175, top: 430 }} />
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
