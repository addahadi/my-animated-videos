import React from 'react';
import { DeviceMock, StatusBar } from '../../../components/Device';
import { CauseChips } from '../../../components/Hardware';
import { pop } from '../../../lib/time';
import { SPRING } from '../../../theme';


/** The spine phone ("your phone"): same drawing in every scene. Geometry of the hook layout. */
export const HERO = { x: 350, y: 430, w: 380, h: 700 };

export const YourPhone: React.FC<{
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  children?: React.ReactNode;
  off?: number; // 0..1 screen black (shut down)
  style?: React.CSSProperties;
  statusBar?: boolean;
}> = ({ x = HERO.x, y = HERO.y, w = HERO.w, h = HERO.h, children, off = 0, style, statusBar = true }) => (
  <DeviceMock width={w} height={h} style={{ left: x, top: y, ...style }}>
    {statusBar && (
      <div style={{ position: 'absolute', left: 0, right: 0, top: w * 0.11 }}>
        <StatusBar width={w - w * 0.07} scale={w / 420} />
      </div>
    )}
    {children}
    {off > 0 && <div style={{ position: 'absolute', inset: 0, background: '#07090C', opacity: off }} />}
  </DeviceMock>
);

/** Generic home-screen app tiles (no real apps). */
const TILE = ['#DCE1F6', '#E9E3D0', '#CFE9DE', '#F2D5D4', '#DCE1F6', '#E3E3DE', '#CFE9DE', '#E9E3D0', '#F2D5D4'];
export const HomeTiles: React.FC<{ w: number; top: number; cols?: number; count?: number }> = ({ w, top, cols = 3, count = 9 }) => {
  const pad = w * 0.1;
  const gap = w * 0.06;
  const tile = (w - pad * 2 - gap * (cols - 1)) / cols;
  return (
    <div style={{ position: 'absolute', left: pad, top, display: 'grid', gridTemplateColumns: `repeat(${cols}, ${tile}px)`, gap }}>
      {TILE.slice(0, count).map((c, i) => (
        <div key={i} style={{ width: tile, height: tile, borderRadius: tile * 0.26, background: c, border: '2.5px solid rgba(11,15,21,0.55)' }} />
      ))}
    </div>
  );
};

/**
 * The diagnosis strip (spine list): BATTERY, APPS, STORAGE, HEAT. `at` gives each chip's
 * appearance time in absolute seconds (Infinity = not yet). Chips that were already there show at once.
 */
export const CAUSES = ['BATTERY', 'APPS', 'STORAGE', 'HEAT'] as const;
export const DiagnosisStrip: React.FC<{ t: number; fps: number; at: number[]; hl?: number; style?: React.CSSProperties }> = ({ t, fps, at, hl = -1, style }) => (
  <CauseChips
    style={{ left: 175, top: 404, ...style }}
    items={CAUSES.map((label, i) => ({ label, p: at[i] === undefined ? 0 : pop(t, at[i], fps, SPRING.pop), hl: hl === i ? 1 : 0 }))}
  />
);
