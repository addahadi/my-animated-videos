import React, { useMemo } from 'react';
import { AbsoluteFill } from 'remotion';
import { world } from '../../theme-world';

const M = world.map;

/** World geometry (world px). Roads are lines through these centres. */
export const CITY = {
  width: 2400,
  height: 3600,
  roadW: 84,
  xs: [60, 380, 700, 960, 1240, 1560, 1860, 2180],
  ys: [60, 420, 760, 1080, 1400, 1760, 2100, 2460, 2800, 3160, 3520],
};

export type Cam = { x: number; y: number; scale: number; rotate?: number };
export type RoadTint = { x1: number; y1: number; x2: number; y2: number; color: string; p?: number; opacity?: number };

type Rect = { x: number; y: number; w: number; h: number };
type Detail = { kind: 'inset' | 'unit' | 'split' | 'courtyard'; r: Rect; vertical?: boolean };
type Building = Rect & { fill: string; details: Detail[] };
type Park = Rect & { trees: [number, number, number][]; plaza: boolean };

/** small deterministic RNG */
const rng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

/** Runtime "paper city": blocks are Report cards seen from above, with floor-plan details. */
const buildCity = (seed: number) => {
  const r = rng(seed);
  const { xs, ys, roadW } = CITY;
  const inset = roadW / 2 + 16;
  const buildings: Building[] = [];
  const parks: Park[] = [];
  // each 2 x 2 group of cells is a district with one tint; the rest of its blocks stay neutral
  const districtOf = (i: number, j: number) => {
    const h = (Math.floor(i / 2) * 73856093) ^ (Math.floor(j / 2) * 19349663) ^ seed;
    return M.districts[Math.abs(h) % M.districts.length];
  };
  let tint: string = M.districts[0];
  const pick = () => (r() < M.districtShare ? tint : M.neutralBlocks[Math.floor(r() * M.neutralBlocks.length)]);
  const house = (b: Rect) => {
    const details: Detail[] = [];
    const roll = r();
    if (roll < 0.3 && b.w > 90 && b.h > 90) details.push({ kind: 'inset', r: { x: b.x + 14, y: b.y + 14, w: b.w - 28, h: b.h - 28 } });
    else if (roll < 0.5 && b.w > 120 && b.h > 120) {
      const cw = b.w * 0.42;
      const ch = b.h * 0.42;
      details.push({ kind: 'courtyard', r: { x: b.x + (b.w - cw) / 2, y: b.y + (b.h - ch) / 2, w: cw, h: ch } });
    } else if (roll < 0.72) {
      const vertical = b.h > b.w;
      details.push({ kind: 'split', r: b, vertical });
    }
    const nu = r() < 0.55 ? 1 + Math.floor(r() * 2) : 0;
    for (let i = 0; i < nu; i++) {
      const s = 18 + r() * 14;
      details.push({ kind: 'unit', r: { x: b.x + 16 + r() * Math.max(1, b.w - s - 32), y: b.y + 16 + r() * Math.max(1, b.h - s - 32), w: s, h: s } });
    }
    buildings.push({ ...b, fill: pick(), details });
  };
  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = 0; j < ys.length - 1; j++) {
      tint = districtOf(i, j);
      const cell: Rect = { x: xs[i] + inset, y: ys[j] + inset, w: xs[i + 1] - xs[i] - inset * 2, h: ys[j + 1] - ys[j] - inset * 2 };
      if (r() < 0.13) {
        const trees: [number, number, number][] = [];
        const n = 2 + Math.floor(r() * 4);
        for (let k = 0, tries = 0; trees.length < n && tries < 40; k++, tries++) {
          const tr = 16 + r() * 12;
          const tx = cell.x + 36 + r() * (cell.w - 72);
          const ty = cell.y + 36 + r() * (cell.h - 72);
          if (trees.every(([ox, oy, orr]) => Math.hypot(tx - ox, ty - oy) > tr + orr + 10)) trees.push([tx, ty, tr]);
        }
        parks.push({ ...cell, trees, plaza: r() < 0.35 });
        continue;
      }
      const gap = 18;
      const mode = r();
      if (mode < 0.3) house(cell);
      else if (mode < 0.65) {
        const cut = 0.35 + r() * 0.3;
        if (cell.w > cell.h) {
          house({ ...cell, w: cell.w * cut - gap / 2 });
          house({ ...cell, x: cell.x + cell.w * cut + gap / 2, w: cell.w * (1 - cut) - gap / 2 });
        } else {
          house({ ...cell, h: cell.h * cut - gap / 2 });
          house({ ...cell, y: cell.y + cell.h * cut + gap / 2, h: cell.h * (1 - cut) - gap / 2 });
        }
      } else {
        const cx = 0.4 + r() * 0.2;
        const cy = 0.4 + r() * 0.2;
        const w1 = cell.w * cx - gap / 2;
        const h1 = cell.h * cy - gap / 2;
        house({ x: cell.x, y: cell.y, w: w1, h: h1 });
        house({ x: cell.x + w1 + gap, y: cell.y, w: cell.w - w1 - gap, h: h1 });
        house({ x: cell.x, y: cell.y + h1 + gap, w: w1, h: cell.h - h1 - gap });
        house({ x: cell.x + w1 + gap, y: cell.y + h1 + gap, w: cell.w - w1 - gap, h: cell.h - h1 - gap });
      }
    }
  }
  return { buildings, parks };
};

const DetailArt: React.FC<{ d: Detail }> = ({ d }) => {
  const { r } = d;
  if (d.kind === 'inset') return <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={6} fill="none" stroke={M.detail} strokeWidth={2} />;
  if (d.kind === 'courtyard') return <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={6} fill="url(#hatch)" stroke={M.detail} strokeWidth={2} />;
  if (d.kind === 'split')
    return d.vertical ? (
      <line x1={r.x + 10} y1={r.y + r.h / 2} x2={r.x + r.w - 10} y2={r.y + r.h / 2} stroke={M.detail} strokeWidth={2} strokeDasharray="10 8" />
    ) : (
      <line x1={r.x + r.w / 2} y1={r.y + 10} x2={r.x + r.w / 2} y2={r.y + r.h - 10} stroke={M.detail} strokeWidth={2} strokeDasharray="10 8" />
    );
  return <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={3} fill="none" stroke={M.detail} strokeWidth={2.5} />;
};

/** Static city layer (memoised per seed). */
const CityArt: React.FC<{ seed: number }> = React.memo(({ seed }) => {
  const { buildings, parks } = useMemo(() => buildCity(seed), [seed]);
  const { width: W, height: H, xs, ys } = CITY;
  const sw = M.blockStrokeW;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
      <defs>
        <pattern id="mapGrid" width={M.gridStep} height={M.gridStep} patternUnits="userSpaceOnUse">
          <path d={`M ${M.gridStep} 0 L 0 0 0 ${M.gridStep}`} fill="none" stroke={M.grid} strokeWidth={2} />
        </pattern>
        <pattern id="hatch" width={12} height={12} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={12} stroke={M.hatch} strokeWidth={3} />
        </pattern>
      </defs>
      {/* the Report canvas is the road surface */}
      <rect width={W} height={H} fill={M.ground} />
      <rect width={W} height={H} fill="url(#mapGrid)" />
      {/* dashed ink centre lines */}
      {xs.map((x) => (
        <line key={`dv${x}`} x1={x} y1={0} x2={x} y2={H} stroke={M.laneDash} strokeWidth={3} strokeDasharray="18 22" />
      ))}
      {ys.map((y) => (
        <line key={`dh${y}`} x1={0} y1={y} x2={W} y2={y} stroke={M.laneDash} strokeWidth={3} strokeDasharray="18 22" />
      ))}
      {/* parks and plazas */}
      {parks.map((p, i) => (
        <g key={`p${i}`}>
          <rect x={p.x + 6} y={p.y + 8} width={p.w} height={p.h} rx={M.blockRadius} fill={M.blockShadow} />
          <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={M.blockRadius} fill={p.plaza ? 'url(#hatch)' : M.park} stroke={M.blockStroke} strokeWidth={sw} />
          {p.plaza && <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={M.blockRadius} fill={M.park} opacity={0.5} />}
          {p.trees.map(([tx, ty, tr], k) => (
            <circle key={k} cx={tx} cy={ty} r={tr} fill={M.tree} stroke={M.blockStroke} strokeWidth={2.5} />
          ))}
        </g>
      ))}
      {/* blocks = Report cards from above */}
      {buildings.map((b, i) => (
        <g key={`b${i}`}>
          <rect x={b.x + 6} y={b.y + 8} width={b.w} height={b.h} rx={M.blockRadius} fill={M.blockShadow} />
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={M.blockRadius} fill={b.fill} stroke={M.blockStroke} strokeWidth={sw} />
          {b.details.map((d, k) => (
            <DetailArt key={k} d={d} />
          ))}
        </g>
      ))}
    </svg>
  );
});

/**
 * Top-down Runtime "paper city" on the Report grid canvas. `cam` = world point shown at the screen centre (540, 960)
 * and its scale. Children are positioned in world px and move with the camera (tokens, zones, pings).
 */
export const CityMap: React.FC<{ seed?: number; cam: Cam; tints?: RoadTint[]; veil?: number; children?: React.ReactNode }> = ({
  seed = 7,
  cam,
  tints = [],
  veil = 0,
  children,
}) => {
  const s = cam.scale;
  return (
    <AbsoluteFill style={{ background: M.ground, overflow: 'hidden' }}>
      <AbsoluteFill style={{ rotate: `${cam.rotate ?? 0}deg`, transformOrigin: '540px 960px' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: CITY.width,
            height: CITY.height,
            transformOrigin: '0 0',
            transform: `translate(${540 - cam.x * s}px, ${960 - cam.y * s}px) scale(${s})`,
          }}
        >
          <CityArt seed={seed} />
          <svg width={CITY.width} height={CITY.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {tints.map((r, i) => {
              const p = r.p ?? 1;
              if (p <= 0.001) return null;
              return (
                <line
                  key={i}
                  x1={r.x1}
                  y1={r.y1}
                  x2={r.x1 + (r.x2 - r.x1) * p}
                  y2={r.y1 + (r.y2 - r.y1) * p}
                  stroke={r.color}
                  strokeOpacity={r.opacity ?? 0.45}
                  strokeWidth={CITY.roadW - 26}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
          {children}
        </div>
      </AbsoluteFill>
      {veil > 0 && <AbsoluteFill style={{ background: M.veil, opacity: veil }} />}
      {/* the Report vignette: centre slightly brighter */}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 90% 75% at 50% 48%, rgba(0,0,0,0) 55%, rgba(11,15,21,0.08) 100%)' }} />
    </AbsoluteFill>
  );
};

/** Position and heading (deg, 0 = up, clockwise) at distance `d` along a polyline. Corners are eased over ~40 px. */
export const along = (pts: [number, number][], d: number) => {
  const segs = pts.slice(1).map((p, i) => {
    const a = pts[i];
    const len = Math.hypot(p[0] - a[0], p[1] - a[1]);
    const ang = (Math.atan2(p[0] - a[0], -(p[1] - a[1])) * 180) / Math.PI;
    return { a, b: p, len, ang };
  });
  let rest = Math.max(0, d);
  for (let i = 0; i < segs.length; i++) {
    const sg = segs[i];
    if (rest <= sg.len || i === segs.length - 1) {
      const u = Math.min(1, rest / Math.max(sg.len, 1e-3));
      const x = sg.a[0] + (sg.b[0] - sg.a[0]) * u;
      const y = sg.a[1] + (sg.b[1] - sg.a[1]) * u;
      let ang = sg.ang;
      const toEnd = sg.len - rest;
      if (i < segs.length - 1 && toEnd < 40) {
        let next = segs[i + 1].ang;
        if (next - ang > 180) next -= 360;
        if (ang - next > 180) next += 360;
        ang = ang + (next - ang) * (1 - toEnd / 40) * 0.5;
      } else if (i > 0 && rest < 40) {
        let prev = segs[i - 1].ang;
        if (prev - ang > 180) prev -= 360;
        if (ang - prev > 180) prev += 360;
        ang = prev + (ang - prev) * (0.5 + (rest / 40) * 0.5);
      }
      return { x, y, angle: ang };
    }
    rest -= sg.len;
  }
  const last = pts[pts.length - 1];
  return { x: last[0], y: last[1], angle: 0 };
};
