import React from 'react';
import { CodeChip, WalletScreen, type WalletRow } from '../../../components/Banking';
import { DeviceMock, StatusBar } from '../../../components/Device';
import { quadPoint } from '../../../components/Diagram';
import { LootBag, ThiefGlyph } from '../../../components/Scam';
import type { TimelineScene } from '../../../lib/time';
import timeline from '../timeline.json';

const SCENES = timeline.scenes as unknown as TimelineScene[];

/** Absolute time (s) of event `i` of scene `id`. */
export const E = (id: number, i: number) => {
  const s = SCENES.find((x) => x.id === id);
  const e = s?.props.events[i];
  if (!e) throw new Error(`baridimob timeline: scene ${id} event ${i} missing`);
  return e.sec;
};

export const BALANCE = 48750;

/** Hook phone: same spot in scene 1 and in the loop ending, so the last frame flows into frame 0. */
export const HOOK_PHONE = { x: 290, y: 450, w: 500, h: 850 };

/** inner screen size of a DeviceMock (border 3 + bezel + screen border 2) */
export const screenOf = (w: number, h: number) => {
  const bezel = Math.max(8, w * 0.035);
  return { w: w - 6 - 2 * bezel - 4, h: h - 6 - 2 * bezel - 4 };
};

/** DeviceMock with the generic wallet app inside. */
export const WalletPhone: React.FC<{
  w: number;
  h: number;
  balance: number;
  zero?: number;
  rows?: WalletRow[];
  style?: React.CSSProperties;
  children?: React.ReactNode;
  screen?: React.ReactNode;
}> = ({ w, h, balance, zero = 0, rows = [], style, children, screen }) => {
  const sc = screenOf(w, h);
  return (
    <DeviceMock width={w} height={h} style={style}>
      {screen ?? <WalletScreen width={sc.w} height={sc.h} balance={balance} zero={zero} rows={rows} />}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 16 }}>
        <StatusBar width={sc.w} scale={0.85} />
      </div>
      {children}
    </DeviceMock>
  );
};

/** The scammer: thief glyph above the loot bag. `bump` squashes the bag on each catch. */
export const Scammer: React.FC<{ p: number; fill?: number; bump?: number; x: number; y: number; size?: number }> = ({ p, fill = 0, bump = 0, x, y, size = 200 }) => (
  <div style={{ position: 'absolute', left: x, top: y }}>
    <div style={{ position: 'absolute', left: size * 0.2, top: -size * 0.62, opacity: Math.min(1, p * 3), scale: `${0.6 + 0.4 * p}` }}>
      <ThiefGlyph size={size * 0.6} fill="#E65856" />
    </div>
    <LootBag size={size} fill={fill} bump={bump} p={p} style={{ left: 0, top: 0 }} />
  </div>
);

/** CodeChip flying along a quadratic curve; `k` 0..1 = position on the path. */
export const FlyingCode: React.FC<{ from: [number, number]; ctrl: [number, number]; to: [number, number]; k: number; p?: number; size?: number; glow?: number }> = ({
  from,
  ctrl,
  to,
  k,
  p = 1,
  size = 0.9,
  glow = 0.6,
}) => {
  const [x, y] = quadPoint(from, ctrl, to, Math.min(1, Math.max(0, k)));
  const arrive = k >= 1 ? 0 : 1;
  return <CodeChip p={p * arrive} size={size} glow={glow} style={{ left: x, top: y, translate: '-50% -50%' }} />;
};

/** deterministic tap ripple: 0..1 progress */
export const Tap: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => {
  if (p <= 0 || p >= 1) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 0, height: 0 }}>
      <div style={{ position: 'absolute', left: -24, top: -24, width: 48, height: 48, borderRadius: 99, background: 'rgba(11,15,21,0.35)', opacity: 1 - p, scale: `${1 - p * 0.3}` }} />
      <div style={{ position: 'absolute', left: -50, top: -50, width: 100, height: 100, borderRadius: 99, border: '4px solid rgba(11,15,21,0.6)', opacity: 1 - p, scale: `${0.4 + p * 0.9}` }} />
    </div>
  );
};
