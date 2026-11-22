import React from 'react';
import { AbsoluteFill } from 'remotion';
import { arabic, mono } from '../fonts';
import { theme } from '../theme';

const L = theme.light;
const D = theme.dark;

/** Light vignette canvas with major + minor grid, or dark navy blueprint with scanlines. `drift` in px. */
export const GridCanvas: React.FC<{ mode?: 'light' | 'dark'; drift?: number; spacing?: number; opacity?: number }> = ({
  mode = 'light',
  drift = 0,
  spacing = 240,
  opacity = 1,
}) => {
  const major = mode === 'light' ? L.gridMajor : D.grid;
  const minor = mode === 'light' ? L.gridMinor : 'rgba(44,61,94,0.55)';
  const minorStep = spacing / 4;
  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill
        style={{
          background:
            mode === 'light'
              ? `radial-gradient(ellipse 75% 60% at 50% 46%, ${L.bgCenter} 0%, ${L.bgCenter} 35%, ${L.bgEdge} 100%)`
              : `radial-gradient(ellipse 80% 60% at 50% 45%, ${D.bgMid} 0%, ${D.bg} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${minor} 1px, transparent 1px), linear-gradient(90deg, ${minor} 1px, transparent 1px)`,
          backgroundSize: `${minorStep}px ${minorStep}px`,
          backgroundPosition: `${drift * 0.5}px ${drift}px`,
          opacity: mode === 'light' ? 0.55 : 0.5,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${major} 2px, transparent 2px), linear-gradient(90deg, ${major} 2px, transparent 2px)`,
          backgroundSize: `${spacing}px ${spacing}px`,
          backgroundPosition: `${drift * 0.5}px ${drift}px`,
        }}
      />
      {mode === 'dark' && (
        <AbsoluteFill
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, ${D.scanlines} 0px, ${D.scanlines} 2px, transparent 2px, transparent 6px)`,
          }}
        />
      )}
      {/* soft edge vignette so the center reads brighter */}
      <AbsoluteFill
        style={{
          background:
            mode === 'light'
              ? 'radial-gradient(ellipse 90% 75% at 50% 45%, rgba(0,0,0,0) 55%, rgba(11,15,21,0.06) 100%)'
              : 'radial-gradient(ellipse 90% 75% at 50% 45%, rgba(0,0,0,0) 50%, rgba(5,10,25,0.35) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

/** Mono header strip: "Runtime.tech" left, topic tag right. Body scenes only. */
export const HeaderStrip: React.FC<{ tag: string; mode?: 'light' | 'dark'; p?: number }> = ({ tag, mode = 'light', p = 1 }) => {
  const ink = mode === 'light' ? L.ink : D.text;
  const soft = mode === 'light' ? L.mono : D.mono;
  const [x0, x1] = theme.layout.headerX;
  return (
    <div
      style={{
        position: 'absolute',
        left: x0,
        width: x1 - x0,
        top: theme.layout.headerY - 18,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: mono,
        fontSize: theme.type.monoHeader,
        opacity: p,
        translate: `0px ${(1 - p) * -14}px`,
      }}
    >
      <div style={{ color: ink, letterSpacing: '0.04em' }}>
        <span style={{ fontWeight: 800 }}>Runtime</span>
        <span style={{ fontWeight: 500 }}>.tech</span>
      </div>
      <div style={{ color: soft, fontWeight: 700, letterSpacing: theme.type.monoSpacing, textTransform: 'uppercase' }}>{tag}</div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -6,
          height: 2,
          background: mode === 'light' ? 'rgba(11,15,21,0.12)' : 'rgba(179,226,251,0.18)',
          scale: `${p} 1`,
          transformOrigin: 'left center',
        }}
      />
    </div>
  );
};

/** Centered chapter pill (Arabic, Tajawal, no letter-spacing). `p` = spring progress. */
export const ChapterPill: React.FC<{ text: string; mode?: 'light' | 'dark'; p?: number; icon?: React.ReactNode }> = ({
  text,
  mode = 'light',
  p = 1,
  icon,
}) => {
  const dark = mode === 'dark';
  const [y0, y1] = theme.layout.pillY;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: y0, height: y1 - y0, display: 'flex', justifyContent: 'center' }}>
      <div
        dir="rtl"
        lang="ar"
        style={{
          minWidth: theme.layout.pillW * 0.62,
          height: '100%',
          padding: '0 34px',
          borderRadius: 999,
          background: dark ? D.panel : L.pill,
          border: dark ? `2px solid ${D.glow}` : 'none',
          boxShadow: dark ? `0 0 22px ${D.glow}, inset 0 0 12px rgba(129,225,200,0.15)` : theme.shadow.card,
          color: dark ? D.text : '#F4F4F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          fontFamily: arabic,
          fontWeight: 800,
          fontSize: 31,
          lineHeight: 1,
          paddingTop: 4,
          opacity: Math.min(1, p * 3),
          scale: `${0.7 + 0.3 * p}`,
          whiteSpace: 'nowrap',
        }}
      >
        {icon}
        <span>{text}</span>
      </div>
    </div>
  );
};

/** Thin cyan glow line sweeping across (y in px, relative to parent). */
export const ScanLine: React.FC<{ y: number; width?: number; left?: number; opacity?: number }> = ({ y, width = 1080, left = 0, opacity = 1 }) => (
  <div style={{ position: 'absolute', left, top: y - 2, width, height: 4, opacity, pointerEvents: 'none' }}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, rgba(120,220,255,0) 0%, #9BE7FF 20%, #E8FBFF 50%, #9BE7FF 80%, rgba(120,220,255,0) 100%)',
        boxShadow: '0 0 18px 6px rgba(120,210,255,0.55), 0 0 60px 18px rgba(120,210,255,0.25)',
        borderRadius: 2,
      }}
    />
  </div>
);
