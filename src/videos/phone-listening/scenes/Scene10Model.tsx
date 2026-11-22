import React from 'react';
import { random } from 'remotion';
import { DrawPath, ScaleBar, quadPoint } from '../../../components/Diagram';
import { CartIcon, CursorIcon, PlayIcon } from '../../../components/Icons';
import { Mono, PacketChip, StickerPill } from '../../../components/Labels';
import { arabic } from '../../../fonts';
import { evAt, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN, EASE_IN_OUT, SPRING, theme } from '../../../theme';

const D = theme.dark;
const A = theme.accent;

const BOX = { x: 330, y: 640, w: 420, h: 250 };
const IN: [number, number] = [BOX.x + BOX.w / 2, BOX.y + 8];

// tiny neural net drawn inside the model box (box-local coordinates)
const LAYERS = [
  [60, 125, 190],
  [40, 95, 150, 205],
  [90, 160],
];
const LX = [80, 210, 340];

const Person: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <div style={{ position: 'absolute', left: x, top: y, opacity: o }}>
    <div style={{ width: 14, height: 14, borderRadius: 99, background: D.marker, marginLeft: 5 }} />
    <div style={{ width: 24, height: 14, borderRadius: '12px 12px 4px 4px', background: D.marker, marginTop: 3 }} />
  </div>
);

/** Clue 3 (hardest idea): behaviour chips feed a model that learned from millions and outputs a prediction. */
export const Scene10Model: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  const box = pop(t, e(0) + 0.25, fps, SPRING.soft);
  const think = ramp(t, e(4) - 0.1, e(4) + 0.3);
  const term = pop(t, e(5), fps, SPRING.pop);
  const crowd = ramp(t, e(6) - 0.3, e(6) + 0.3);
  const bar = ramp(t, e(7), e(7) + 0.6, EASE_IN_OUT);
  const marker = ramp(t, e(8), e(8) + 0.9, EASE_IN_OUT);
  const bracket = ramp(t, e(9), e(9) + 0.45, EASE_IN_OUT);
  const sticker = pop(t, e(9) + 0.15, fps, SPRING.pop);

  // input chips: pop at their event, hover, then dive into the model
  const chips: { at: number; label: string; icon: React.ReactNode; home: [number, number]; dive: number }[] = [
    { at: e(1), label: 'CLICK', icon: <CursorIcon size={30} color={D.text} />, home: [175, 470], dive: 0.9 },
    { at: e(2), label: 'VIDEO · 2s', icon: <PlayIcon size={32} color={D.text} />, home: [395, 470], dive: 1.3 },
    { at: e(3), label: 'BUY', icon: <CartIcon size={30} color={D.text} />, home: [720, 495], dive: 0.6 },
  ];
  const absorbs = chips.map((c) => c.at + c.dive + 0.45);
  const hitGlow = Math.max(0, ...absorbs.map((a) => 1 - Math.abs(t - a) * 4));
  const active = Math.max(think, hitGlow * 0.8);

  // signal sweep through the net while thinking
  const sweep = ((t - e(4)) * 1.4) % 1;

  return (
    <>
      {/* crowds on both sides: "millions of people" */}
      {[0, 1].map((side) =>
        Array.from({ length: 12 }).map((_, i) => {
          const c = i % 3;
          const r = Math.floor(i / 3);
          const x = side === 0 ? 170 + c * 36 : 820 - c * 36;
          return <Person key={`${side}-${i}`} x={x} y={690 + r * 44} o={crowd * (0.35 + 0.65 * random(`p${side}${i}`))} />;
        }),
      )}
      {crowd > 0 && (
        <>
          <div style={{ position: 'absolute', left: 168, top: 650, opacity: crowd }}>
            <Mono size={18} color={D.mono}>MILLIONS</Mono>
          </div>
          <div style={{ position: 'absolute', left: 790, top: 650, opacity: crowd }}>
            <Mono size={18} color={D.mono}>OF USERS</Mono>
          </div>
        </>
      )}
      {/* data particles from the crowds into the model */}
      {crowd > 0 &&
        Array.from({ length: 36 }).map((_, k) => {
          const side = k % 2;
          const seed = random(`d${k}`);
          const u = ((t - e(6) + 0.3) * 0.8 + seed) % 1;
          const y0 = 700 + random(`y${k}`) * 160;
          const x0 = side === 0 ? 250 : 830;
          const x1 = side === 0 ? BOX.x + 10 : BOX.x + BOX.w - 10;
          const y1 = BOX.y + 60 + random(`z${k}`) * 130;
          const [x, y] = quadPoint([x0, y0], [(x0 + x1) / 2, y0 - 30], [x1, y1], u);
          return <div key={k} style={{ position: 'absolute', left: x - 4, top: y - 4, width: 8, height: 8, borderRadius: 99, background: D.marker, boxShadow: `0 0 8px ${D.marker}`, opacity: crowd * Math.sin(u * Math.PI) * 0.9 }} />;
        })}

      {/* model box */}
      <div
        style={{
          position: 'absolute',
          left: BOX.x,
          top: BOX.y,
          width: BOX.w,
          height: BOX.h,
          borderRadius: 26,
          background: 'rgba(51,74,106,0.85)',
          border: `3px solid ${active > 0.05 ? D.marker : D.glow}`,
          boxShadow: `0 0 ${30 + 50 * active}px rgba(129,225,200,${0.25 + 0.45 * active}), inset 0 0 30px rgba(129,225,200,${0.1 + 0.2 * active})`,
          opacity: Math.min(1, box * 3),
          scale: `${0.8 + 0.2 * box + hitGlow * 0.03}`,
        }}
      >
        <div style={{ position: 'absolute', left: 18, top: -16, background: D.bg, padding: '0 10px' }}>
          <Mono size={22} color={D.text} weight={800}>
            AI MODEL
          </Mono>
        </div>
        <svg width={BOX.w} height={BOX.h} style={{ position: 'absolute', inset: 0 }}>
          {LAYERS.slice(0, -1).map((layer, li) =>
            layer.map((y0, a) =>
              LAYERS[li + 1].map((y1, b) => {
                const lit = active * (0.3 + 0.7 * Math.max(0, 1 - Math.abs(sweep - (li + 0.5) / 2.5) * 3));
                return <line key={`${li}${a}${b}`} x1={LX[li]} y1={y0} x2={LX[li + 1]} y2={y1} stroke={D.marker} strokeWidth={2} opacity={0.18 + 0.6 * lit} />;
              }),
            ),
          )}
          {LAYERS.map((layer, li) =>
            layer.map((y, a) => {
              const lit = active * Math.max(0, 1 - Math.abs(sweep - li / 2.5) * 3);
              return <circle key={`n${li}${a}`} cx={LX[li]} cy={y} r={14} fill={lit > 0.3 ? D.marker : D.panel} stroke={D.mono} strokeWidth={3} style={{ filter: lit > 0.3 ? `drop-shadow(0 0 8px ${D.marker})` : undefined }} />;
            }),
          )}
        </svg>
      </div>

      {/* input chips */}
      {chips.map((c, k) => {
        const p = pop(t, c.at - 0.2, fps, SPRING.pop);
        if (p <= 0.001) return null;
        const go = ramp(t, c.at + c.dive, c.at + c.dive + 0.45, EASE_IN);
        if (go >= 1) return null;
        const [x, y] = quadPoint(c.home, [(c.home[0] + IN[0]) / 2, c.home[1] - 40], [IN[0] - 60, IN[1]], go);
        return (
          <PacketChip
            key={k}
            label={c.label}
            icon={c.icon}
            mode="dark"
            size={24}
            style={{ left: x, top: y + Math.sin(t * 3 + k) * 5 * (1 - go), opacity: Math.min(1, p * 3) * (1 - go * 0.8), scale: `${(0.6 + 0.4 * p) * (1 - go * 0.6)}` }}
          />
        );
      })}

      {/* term label */}
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 918,
          translate: '-50% 0px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '12px 26px 8px',
          borderRadius: 16,
          background: D.panel,
          border: `2px solid ${D.glow}`,
          boxShadow: `0 0 20px ${D.glow}`,
          opacity: Math.min(1, term * 3),
          scale: `${0.7 + 0.3 * term}`,
          whiteSpace: 'nowrap',
        }}
      >
        <Mono size={26} color={D.marker} weight={800}>
          MODEL =
        </Mono>
        <span dir="rtl" lang="ar" style={{ fontFamily: arabic, fontWeight: 800, fontSize: 40, color: D.text, lineHeight: 1 }}>
          برنامج تعلّم
        </span>
      </div>

      {/* prediction */}
      <ScaleBar width={700} p={bar} value={0.87} markerP={marker} title="PREDICTION · NEXT PURCHASE" markerLabel={
          <span dir="rtl">
            صبّاط <bdi dir="ltr">{Math.round(87 * marker)}%</bdi>
          </span>
        } sub="EXAMPLE" style={{ left: 190, top: 1000 }} />
      <DrawPath d="M 192 1112 L 192 1130 L 795 1130 L 795 1112" p={bracket} color={D.delta} width={5} />
      <StickerPill text="قبل ما تعرف" tone="yellow" p={sticker} rotate={-5} size={40} style={{ left: 200, top: 1160 }} />
    </>
  );
};
