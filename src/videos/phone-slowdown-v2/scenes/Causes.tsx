import React from 'react';
import { Spinner, SpeedDial, StorageBar, TaskBox, Thermometer } from '../../../components/Hardware';
import { BatteryIcon, PlayIcon } from '../../../components/Icons';
import { ArText, Card, Mono, StickerPill } from '../../../components/Labels';
import { PacketChip } from '../../../components/Labels';
import { display } from '../../../fonts';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';
import { DiagnosisStrip, YourPhone } from './parts';

const L = theme.light;
const A = theme.accent;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Labelled horizontal load bar (light): fills toward `value`, red when high. */
const LoadBar: React.FC<{ label: string; ar: string; value: number; p: number; style?: React.CSSProperties }> = ({ label, ar, value, p, style }) => (
  <div style={{ position: 'absolute', width: 680, opacity: clamp01(p * 3), translate: `0px ${(1 - clamp01(p)) * 30}px`, ...style }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <Mono size={22} color={L.ink} weight={800}>
          {label}
        </Mono>
        <ArText size={32}>{ar}</ArText>
      </div>
      <span style={{ fontFamily: display, fontWeight: 900, fontSize: 38, color: value > 0.7 ? A.red : L.ink }}>{Math.round(value * 100)}%</span>
    </div>
    <div style={{ height: 44, borderRadius: 14, border: `3px solid ${L.ink}`, background: L.surface, overflow: 'hidden', boxShadow: theme.shadow.card }}>
      <div style={{ width: `${value * 100}%`, height: '100%', background: value > 0.7 ? A.red : A.blue }} />
    </div>
  </div>
);

const FEATURES = ['VIDEO', 'FILTERS', 'AI'];

/** Scene 8: cause 2, apps grow. Features snap on; CPU work and RAM rise. */
export const Scene08AppGrowth: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);
  const notAlways = pop(t, e(1) + 0.35, fps, SPRING.pop);
  const app = pop(t, e(2), fps, SPRING.soft);
  const feats = FEATURES.map((_, i) => pop(t, e(3) + i * 0.32, fps, SPRING.pop));
  const v5 = t >= e(4);
  const ver = pop(t, v5 ? e(4) : e(2), fps, SPRING.pop);
  const cpuP = pop(t, e(5) - 0.4, fps, SPRING.soft);
  const cpu = mix(0.3, 0.86, ramp(t, e(5), e(5) + 0.8, EASE_IN_OUT));
  const ramP = pop(t, e(6) - 0.3, fps, SPRING.soft);
  const ram = mix(0.35, 0.9, ramp(t, e(6), e(6) + 0.7, EASE_IN_OUT));
  return (
    <>
      <DiagnosisStrip t={t} fps={fps} at={[e(1)]} />
      <StickerPill text="ماشي ديما البطارية" tone="ink" p={notAlways} rotate={4} size={30} style={{ left: 560, top: 400 }} />
      <Card style={{ left: 200, top: 520, width: 680, height: 300, opacity: clamp01(app * 3), translate: `0px ${(1 - clamp01(app)) * 50}px` }}>
        <div style={{ position: 'absolute', right: 30, top: 30, width: 130, height: 130, borderRadius: 32, background: A.blue, border: `3px solid ${L.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PlayIcon size={80} color="#F4F4F0" />
        </div>
        <div style={{ position: 'absolute', right: 190, top: 36 }}>
          <ArText size={50}>تطبيق</ArText>
        </div>
        <div style={{ position: 'absolute', right: 190, top: 104, scale: `${0.8 + 0.2 * Math.min(ver, 1.05)}`, transformOrigin: '100% 50%' }}>
          <Mono size={30} color={v5 ? A.red : L.mono} weight={800}>
            {v5 ? 'V5.0 · UPDATED' : 'V1.0'}
          </Mono>
        </div>
        <div style={{ position: 'absolute', left: 30, right: 30, bottom: 30, height: 70 }}>
          {FEATURES.map((f, i) => (
            <PacketChip key={f} label={`+ ${f}`} size={22} style={{ left: i * 205, top: 0, opacity: clamp01(feats[i] * 3), scale: `${0.6 + 0.4 * feats[i]}` }} />
          ))}
        </div>
      </Card>
      <LoadBar label="CPU WORK ·" ar="المعالج" value={cpu} p={cpuP} style={{ left: 200, top: 880 }} />
      <LoadBar label="RAM ·" ar="الذاكرة" value={ram} p={ramP} style={{ left: 200, top: 1050 }} />
    </>
  );
};

/** Scene 9: same phone, more work. The box overflows; then an update that helps. */
export const Scene09SamePhone: React.FC<SceneProps> = ({ events }) => {
  const { t, fps, startSec } = useClock();
  const e = (i: number) => evAt(events, i);
  const phone = pop(t, startSec + 0.05, fps, SPRING.soft);
  const box = pop(t, e(2) - 0.2, fps, SPRING.soft);
  const fill = 4 + 5 * ramp(t, e(3), e(4) - 0.05) + 4 * ramp(t, e(4), e(4) + 1.0);
  const light = pop(t, e(5), fps, SPRING.pop);
  const heavy = t >= e(6);
  const heavyP = pop(t, e(6), fps, SPRING.pop);
  const upd = pop(t, e(7), fps, SPRING.soft);
  const shrink = ramp(t, e(7) + 0.4, e(7) + 1.0, EASE_IN_OUT);
  const after = mix(fill, 7, shrink);
  const faster = pop(t, e(8), fps, SPRING.pop);
  return (
    <>
      <DiagnosisStrip t={t} fps={fps} at={[-10, e(8) + 0.4]} />
      <div style={{ position: 'absolute', inset: 0, opacity: clamp01(phone * 3), translate: `0px ${(1 - clamp01(phone)) * 60}px` }}>
        <YourPhone x={180} y={540} w={300} h={560}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 200, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 120, height: 120, borderRadius: 30, background: A.blue, border: `3px solid ${L.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PlayIcon size={72} color="#F4F4F0" />
            </div>
          </div>
        </YourPhone>
        <Mono size={20} color={L.ink} weight={800} style={{ position: 'absolute', left: 230, top: 1120 }}>
          SAME PHONE
        </Mono>
      </div>
      <TaskBox width={340} height={360} blocks={after} capacity={9} cols={3} label="SAME CAPACITY" p={box} shrink={0} style={{ left: 560, top: 700 }} />
      {heavy ? (
        <StickerPill text="HEAVY" tone="red" p={heavyP} rotate={-6} size={34} style={{ left: 330, top: 500 }} />
      ) : (
        <StickerPill text="LIGHT" tone="ink" p={light} rotate={-6} size={34} style={{ left: 330, top: 500 }} />
      )}
      <Card style={{ left: 560, top: 1160, width: 340, height: 96, opacity: clamp01(upd * 3), translate: `${(1 - clamp01(upd)) * 120}px 0px`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, borderColor: A.green }}>
        <Mono size={26} color={A.green} weight={800}>
          UPDATE ↓
        </Mono>
        <ArText size={34}>تحديث</ArText>
      </Card>
      <StickerPill text="FASTER" tone="green" p={faster} rotate={6} size={30} style={{ left: 760, top: 610 }} />
    </>
  );
};

const GRID = [
  { key: 'BATTERY', icon: (c: string) => <BatteryIcon size={84} level={0.2} levelColor={A.red} color={c} /> },
  { key: 'APPS', icon: (c: string) => <PlayIcon size={84} color={c} /> },
  { key: 'STORAGE', icon: () => <MiniStorage /> },
  { key: 'HEAT', icon: () => <Thermometer height={120} value={0.85} style={{ position: 'relative', scale: '0.7' }} /> },
];

const MiniStorage: React.FC = () => (
  <div style={{ display: 'flex', gap: 4, padding: 6, border: `3px solid ${L.ink}`, borderRadius: 10, background: L.surface }}>
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} style={{ width: 9, height: 44, borderRadius: 3, background: i < 7 ? A.blue : A.red }} />
    ))}
  </div>
);

/** Scene 10: causes 3 and 4 (storage, heat), then the recap: four causes, one symptom. */
export const Scene10StorageHeat: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);
  const sto = pop(t, e(1), fps, SPRING.soft);
  const full = ramp(t, e(1) + 0.2, e(2) + 0.4, EASE_IN_OUT);
  const thermo = pop(t, e(3), fps, SPRING.soft);
  const hot = ramp(t, e(3) + 0.1, e(3) + 0.9, EASE_IN_OUT);
  const dial = pop(t, e(4) - 0.2, fps, SPRING.soft);
  const dip = ramp(t, e(4) + 0.1, e(4) + 0.8, EASE_IN_OUT);
  const protect = pop(t, e(4) + 0.6, fps, SPRING.pop);
  const grid = ramp(t, e(5) - 0.05, e(5) + 0.35, EASE_IN_OUT);
  const tiles = GRID.map((_, i) => pop(t, e(5) + i * 0.18, fps, SPRING.pop));
  const diff = pop(t, e(6), fps, SPRING.pop);
  return (
    <>
      <DiagnosisStrip t={t} fps={fps} at={[-10, -10, e(2), e(3) + 0.3]} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - grid }}>
        <StorageBar width={730} value={mix(0.6, 0.97, full)} p={sto} label="STORAGE" style={{ left: 175, top: 500 }} />
        <ArText size={34} style={{ position: 'absolute', left: 330, top: 496, opacity: clamp01(sto * 3) }}>التخزين</ArText>
        <Thermometer height={380} value={mix(0.2, 0.88, hot)} p={thermo} style={{ left: 230, top: 760 }} />
        <Mono size={22} color={L.ink} weight={800} style={{ position: 'absolute', left: 215, top: 1160, opacity: clamp01(thermo * 3) }}>
          HEAT
        </Mono>
        <SpeedDial size={360} value={mix(1, 0.72, dip)} mode="light" color={A.blue} label="SPEED" p={dial} style={{ left: 470, top: 800 }} />
        <StickerPill text="يحمي روحو" tone="ink" p={protect} rotate={-4} size={36} style={{ left: 560, top: 1110 }} />
      </div>
      {grid > 0 &&
        GRID.map((g, i) => {
          const x = 175 + (i % 2) * 380;
          const y = 500 + Math.floor(i / 2) * 320;
          return (
            <Card key={g.key} style={{ left: x, top: y, width: 350, height: 290, opacity: clamp01(tiles[i] * 3), scale: `${0.7 + 0.3 * Math.min(tiles[i], 1.04)}` }}>
              <div style={{ position: 'absolute', left: 24, top: 22 }}>
                <Mono size={22} color={L.ink} weight={800}>
                  {g.key}
                </Mono>
              </div>
              <div style={{ position: 'absolute', left: 30, bottom: 30, width: 130, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{g.icon(L.ink)}</div>
              <div style={{ position: 'absolute', right: 34, bottom: 46 }}>
                <Spinner size={96} angle={(t - e(5)) * 300} color={L.ink} track="rgba(11,15,21,0.15)" stroke={9} />
              </div>
            </Card>
          );
        })}
      <StickerPill text="نفس التقطيع… أسباب مختلفة" tone="yellow" p={diff} rotate={-3} size={40} style={{ left: 540, top: 1160, translate: '-50% 0px' }} />
    </>
  );
};
