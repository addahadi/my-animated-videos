import React from 'react';
import { DeviceMock } from '../../../components/Device';
import { AppGrid, DrawPath, NodeBox, quadPoint } from '../../../components/Diagram';
import { CameraIcon, ServerIcon } from '../../../components/Icons';
import { StickerPill } from '../../../components/Labels';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';
import { GRID } from './Scene05Study';

const L = theme.light;
const A = theme.accent;

const RED = 17; // the one app that misbehaves (row 2, col 3)
const PHONE = { x: 190, y: 600, w: 270, h: 560 };
const BOX = { x: 680, y: 720, w: 225, h: 250 };

/** A miniature copy of the phone screen (a "screenshot"). */
const Shot: React.FC<{ w: number }> = ({ w }) => (
  <div style={{ width: w, height: w * 1.9, borderRadius: w * 0.12, background: '#F6F6F2', border: `3px solid ${L.ink}`, boxShadow: theme.shadow.card, padding: w * 0.1, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: w * 0.08 }}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ height: w * 0.36, borderRadius: w * 0.06, background: i === 0 ? '#DCE1F6' : 'rgba(11,15,21,0.1)', border: '2px solid rgba(11,15,21,0.2)' }} />
    ))}
  </div>
);

/** The twist: one app was recording the SCREEN, and sending it to a third party. */
export const Scene06Leak: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  const gridOut = ramp(t, e(1) + 0.5, e(1) + 0.9);
  const redP = ramp(t, e(1) - 0.15, e(1) + 0.1);
  const lift = pop(t, e(1), fps, SPRING.pop);
  const fly = ramp(t, e(1) + 0.55, e(1) + 1.15, EASE_IN_OUT);
  const phone = pop(t, e(1) + 0.4, fps, SPRING.soft);
  const sticker = pop(t, e(1) + 0.1, fps, SPRING.pop);
  const box = pop(t, e(3) - 0.55, fps, SPRING.soft);
  const arrow = ramp(t, e(3) - 0.3, e(3) + 0.3, EASE_IN_OUT);
  const tag = pop(t, e(4), fps, SPRING.pop);
  const shots = [0, 0.35, 0.7];
  const flash = Math.max(0, ...shots.map((d) => 1 - Math.abs(t - (e(2) + d)) * 7)) * 0.9;

  // red app tile path: from its grid cell into the phone screen center
  const tileFrom: [number, number] = [GRID.left + (RED % GRID.cols) * (GRID.tile + GRID.gap), GRID.top + Math.floor(RED / GRID.cols) * (GRID.tile + GRID.gap)];
  const tileTo: [number, number] = [PHONE.x + PHONE.w / 2 - 55, PHONE.y + PHONE.h / 2 - 55];
  const tx = mix(tileFrom[0], tileTo[0], fly);
  const ty = mix(tileFrom[1] - lift * 30, tileTo[1], fly);
  const tileSize = mix(GRID.tile * mix(1, 1.4, Math.min(lift, 1)), 110, fly);

  const S0: [number, number] = [PHONE.x + PHONE.w - 40, PHONE.y + 160];
  const SC: [number, number] = [600, 560];
  const S1: [number, number] = [BOX.x + 40, BOX.y + 40];

  return (
    <>
      <AppGrid cols={GRID.cols} rows={GRID.rows} tile={GRID.tile} gap={GRID.gap} dim={1} hidden={RED} style={{ left: GRID.left, top: GRID.top, opacity: 1 - gridOut, scale: `${1 - gridOut * 0.05}` }} />

      <DeviceMock width={PHONE.w} height={PHONE.h} flash={flash} style={{ left: PHONE.x, top: PHONE.y, opacity: Math.min(1, phone * 3), translate: `${(1 - Math.min(phone, 1)) * -120}px 0px`, rotate: '-2deg' }}>
        <div style={{ position: 'absolute', left: 22, right: 22, top: 70, display: 'flex', flexDirection: 'column', gap: 14, opacity: 0.9 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ height: 70, borderRadius: 12, background: i === 1 ? '#DCE1F6' : 'rgba(11,15,21,0.08)', border: '2px solid rgba(11,15,21,0.15)' }} />
          ))}
        </div>
      </DeviceMock>

      <DrawPath d={`M ${S0[0]} ${S0[1]} Q ${SC[0]} ${SC[1]} ${S1[0]} ${S1[1]}`} p={arrow} dashed color={A.red} width={5} />

      <NodeBox
        icon={<ServerIcon size={96} blink={t * 3} />}
        label="THIRD PARTY"
        width={BOX.w}
        height={BOX.h}
        glow={ramp(t, e(3) + 0.6, e(3) + 1.0) * 0.8}
        glowColor={A.red}
        borderColor={A.red}
        style={{ left: BOX.x, top: BOX.y, opacity: Math.min(1, box * 3), scale: `${0.7 + 0.3 * box}` }}
      />

      {/* screenshots peel off the phone, hover, then fly to the third party */}
      {shots.map((d, k) => {
        const born = e(2) + d;
        const peel = pop(t, born, fps, SPRING.soft);
        if (peel <= 0.001) return null;
        const go = ramp(t, e(3) + k * 0.18, e(3) + 0.75 + k * 0.18, EASE_IN_OUT);
        const hover: [number, number] = [PHONE.x + PHONE.w + 10 + k * 26, PHONE.y + 120 + k * 34];
        const [fx, fy] = quadPoint([hover[0], hover[1]], [SC[0], SC[1] - 40], [BOX.x + 60 + k * 12, BOX.y + 50 + k * 10], go);
        const x = go > 0 ? fx : mix(PHONE.x + 40, hover[0], Math.min(peel, 1));
        const y = go > 0 ? fy : mix(PHONE.y + 80, hover[1], Math.min(peel, 1));
        const w = mix(mix(150, 100, Math.min(peel, 1)), 64, go);
        return (
          <div key={k} style={{ position: 'absolute', left: x, top: y, rotate: `${mix(-2, 8 - k * 7, Math.min(peel, 1))}deg`, opacity: Math.min(1, peel * 3) * (1 - ramp(t, e(3) + 0.7 + k * 0.18, e(3) + 0.95 + k * 0.18)) }}>
            <Shot w={w} />
          </div>
        );
      })}

      {/* the misbehaving app */}
      {fly < 1 || t < e(1) + 1.3 ? (
        <div
          style={{
            position: 'absolute',
            left: tx,
            top: ty,
            width: tileSize,
            height: tileSize,
            borderRadius: tileSize * 0.26,
            background: redP > 0 ? A.red : '#A9B1C2',
            border: `3px solid ${L.ink}`,
            boxShadow: `0 ${10 * lift}px ${24 * lift}px rgba(230,88,86,${0.35 * Math.min(lift, 1)})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            zIndex: 5,
          }}
        >
          <CameraIcon size={tileSize * 0.6} color="#FFFFFF" />
        </div>
      ) : null}
      {fly >= 1 && t >= e(1) + 1.3 && (
        <div style={{ position: 'absolute', left: tileTo[0], top: tileTo[1], width: 110, height: 110, borderRadius: 28, background: A.red, border: `3px solid ${L.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', scale: `${1 + Math.max(0, 1 - Math.abs(((t - e(2)) % 0.35) - 0.02) * 12) * 0.08}` }}>
          <CameraIcon size={66} color="#FFFFFF" />
        </div>
      )}

      <StickerPill text="حاجة أخرى" tone="red" p={sticker} rotate={-5} size={44} style={{ left: 600, top: 470 }} />
      <StickerPill text="SCREEN → 3RD PARTY" tone="red" p={tag} rotate={-3} size={24} style={{ left: 590, top: 1010 }} />
    </>
  );
};
