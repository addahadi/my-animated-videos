import React from 'react';
import { DrawPath } from '../../../components/Diagram';
import { PinIcon, ShopIcon } from '../../../components/Icons';
import { Mono, StickerPill } from '../../../components/Labels';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';

const L = theme.light;
const A = theme.accent;

// map card in canvas space
const M = { x: 165, y: 470, w: 750, h: 790 };
// road centerlines in map-local coordinates
const ROAD_V = [130, 430];
const ROAD_H = [310, 610];
// pin route (map-local)
const ROUTE: [number, number][] = [
  [130, 770],
  [130, 610],
  [430, 610],
  [430, 455],
];
const SHOP = { x: 470, y: 345, w: 240, h: 225 };
const MALL = { x: 470, y: 30, w: 240, h: 245 };

const along = (p: number): [number, number] => {
  const seg = ROUTE.slice(1).map((pt, i) => Math.hypot(pt[0] - ROUTE[i][0], pt[1] - ROUTE[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let d = p * total;
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i]) {
      const k = d / seg[i];
      return [mix(ROUTE[i][0], ROUTE[i + 1][0], k), mix(ROUTE[i][1], ROUTE[i + 1][1], k)];
    }
    d -= seg[i];
  }
  return ROUTE[ROUTE.length - 1];
};

const Block: React.FC<{ x: number; y: number; w: number; h: number; hl?: number; children?: React.ReactNode }> = ({ x, y, w, h, hl = 0, children }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 16,
      background: hl > 0 ? `color-mix(in srgb, ${A.yellow} ${hl * 85}%, #E6E8E2)` : '#E6E8E2',
      border: `${2.5 + hl}px solid ${hl > 0.1 ? L.ink : 'rgba(11,15,21,0.28)'}`,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    }}
  >
    {children}
  </div>
);

/** Clue 1: GPS. A pin walks a flat map to a shoe shop, waits 15 minutes, near the mall. */
export const Scene08Map: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  const map = pop(t, e(0) - 0.15, fps, SPRING.soft);
  const drop = pop(t, e(0) + 0.15, fps, SPRING.pop);
  const walk = ramp(t, e(1), e(2) + 0.1, EASE_IN_OUT);
  const hop = Math.abs(Math.sin(walk * Math.PI * 7)) * 22 * (walk > 0 && walk < 1 ? 1 : 0);
  const shop = ramp(t, e(2), e(2) + 0.35);
  const ring = ramp(t, e(3), e(3) + 0.9, EASE_IN_OUT);
  const mall = ramp(t, e(4) - 0.1, e(4) + 0.4, EASE_IN_OUT);
  const tag = pop(t, e(4), fps, SPRING.pop);
  const push = mix(1, 1.07, ramp(t, e(1), e(4) + 0.5, EASE_IN_OUT));

  const [px, py] = along(walk);
  const trail = ROUTE.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ');

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: M.x,
          top: M.y,
          width: M.w,
          height: M.h,
          borderRadius: theme.radius.card,
          border: `3px solid ${L.ink}`,
          boxShadow: theme.shadow.lift,
          overflow: 'hidden',
          background: '#DADDD6',
          opacity: Math.min(1, map * 3),
          scale: `${0.9 + 0.1 * map}`,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, scale: `${push}`, transformOrigin: `${ROUTE[3][0]}px ${ROUTE[3][1]}px` }}>
          {/* roads */}
          {ROAD_V.map((x) => (
            <div key={`v${x}`} style={{ position: 'absolute', left: x - 34, top: -20, width: 68, height: M.h + 40, background: '#F5F5F1', borderLeft: '2px solid rgba(11,15,21,0.18)', borderRight: '2px solid rgba(11,15,21,0.18)' }} />
          ))}
          {ROAD_H.map((y) => (
            <div key={`h${y}`} style={{ position: 'absolute', top: y - 34, left: -20, height: 68, width: M.w + 40, background: '#F5F5F1', borderTop: '2px solid rgba(11,15,21,0.18)', borderBottom: '2px solid rgba(11,15,21,0.18)' }} />
          ))}
          {ROAD_V.map((x) => (
            <div key={`vd${x}`} style={{ position: 'absolute', left: x - 2, top: 0, width: 4, height: M.h, backgroundImage: 'linear-gradient(rgba(11,15,21,0.25) 50%, transparent 50%)', backgroundSize: '4px 34px' }} />
          ))}
          {ROAD_H.map((y) => (
            <div key={`hd${y}`} style={{ position: 'absolute', top: y - 2, left: 0, height: 4, width: M.w, backgroundImage: 'linear-gradient(90deg, rgba(11,15,21,0.25) 50%, transparent 50%)', backgroundSize: '34px 4px' }} />
          ))}
          {/* blocks */}
          <Block x={190} y={30} w={205} h={245} />
          <Block x={190} y={345} w={205} h={225} />
          <Block x={190} y={650} w={205} h={160} />
          <Block x={470} y={650} w={240} h={160} />
          <Block x={-30} y={30} w={125} h={245} />
          <Block x={-30} y={345} w={125} h={225} />
          <Block {...MALL} hl={mall * 0.5}>
            <Mono size={26} color={L.ink} weight={800}>
              MALL
            </Mono>
          </Block>
          <Block {...SHOP} hl={shop}>
            <ShopIcon size={78} />
            <Mono size={22} color={L.ink} weight={800}>
              SHOE SHOP
            </Mono>
          </Block>
          {/* mall outline highlight */}
          {mall > 0 && (
            <div style={{ position: 'absolute', left: MALL.x - 12, top: MALL.y - 12, width: MALL.w + 24, height: MALL.h + 24, borderRadius: 22, border: `5px dashed ${L.ink}`, opacity: mall }} />
          )}
          {/* trail */}
          <DrawPath d={trail} p={walk} dashed color={L.ink} width={6} w={M.w} h={M.h} opacity={0.7} />
          {/* 15-minute ring */}
          {ring > 0 && (
            <svg width={M.w} height={M.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <circle cx={px} cy={py - 10} r={74} fill="rgba(238,206,97,0.22)" stroke="rgba(11,15,21,0.2)" strokeWidth={4} />
              <circle cx={px} cy={py - 10} r={74} fill="none" stroke={A.yellow} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={`${ring} 1`} style={{ rotate: '-90deg', transformOrigin: `${px}px ${py - 10}px` }} />
            </svg>
          )}
          {/* pin */}
          <div style={{ position: 'absolute', left: px - 42, top: py - 92 - hop - (1 - Math.min(drop, 1)) * 160, opacity: Math.min(1, drop * 3), filter: 'drop-shadow(3px 6px 0 rgba(11,15,21,0.2))' }}>
            <PinIcon size={84} fill={A.yellow} stroke={3.4} />
          </div>
        </div>
      </div>

      {ring > 0.05 && (
        <div style={{ position: 'absolute', left: M.x + 280, top: M.y + 700, opacity: Math.min(1, ring * 3) }}>
          <div style={{ background: L.ink, borderRadius: 12, padding: '8px 16px' }}>
            <Mono size={26} color="#FFFFFF" weight={800}>
              {`${Math.round(ring * 15)} MIN`}
            </Mono>
          </div>
        </div>
      )}
      <StickerPill text="LOCATION" tone="yellow" p={tag} rotate={-5} size={30} style={{ left: 205, top: 520 }} />
    </>
  );
};
