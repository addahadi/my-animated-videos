import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { GridCanvas } from '../Canvas';
import { Mono } from '../Labels';
import { arabic, display, mono } from '../../fonts';
import { theme } from '../../theme';

/**
 * Shared carousel primitives (Report style, photo posts). One composition frame = one slide.
 * Slides are laid out on one long strip so the grid and seam objects continue across slide edges.
 * Each slide draws inside a 940 x 1300 "safe box", placed per platform:
 *   ig: 1080 x 1440, box at (70, 70)
 *   tt: 1080 x 1920, box scaled 0.925 inside x 70..940 (right button column) and y 240..1443 (bottom caption zone)
 */

const L = theme.light;
const D = theme.dark;

export type Variant = 'ig' | 'tt';
export const CAROUSEL_SIZES: Record<Variant, { w: number; h: number }> = { ig: { w: 1080, h: 1440 }, tt: { w: 1080, h: 1920 } };
export const BOX = { w: 940, h: 1300 };
export const boxPlace = (v: Variant) => (v === 'ig' ? { x: 70, y: 70, s: 1 } : { x: 70, y: 240, s: 870 / 940 });

export type SlideDef = { mode: 'light' | 'dark'; C: React.FC<{ i: number; n: number }> };

/** Page counter "03 / 12". */
export const Counter: React.FC<{ i: number; n: number; mode?: 'light' | 'dark' }> = ({ i, n, mode = 'light' }) => (
  <Mono size={24} color={mode === 'light' ? L.ink : D.text} weight={800}>
    {String(i + 1).padStart(2, '0')}
    <span style={{ color: mode === 'light' ? L.mono : D.mono, fontWeight: 500 }}> / {String(n).padStart(2, '0')}</span>
  </Mono>
);

/** Body-slide header: wordmark left, optional Latin label in the middle, counter right, hairline under. */
export const SlideHeader: React.FC<{ i: number; n: number; mode?: 'light' | 'dark'; label?: string }> = ({ i, n, mode = 'light', label }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: 44,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `2px solid ${mode === 'light' ? 'rgba(11,15,21,0.12)' : 'rgba(179,226,251,0.18)'}`,
    }}
  >
    <div style={{ fontFamily: mono, fontSize: 24, color: mode === 'light' ? L.ink : D.text, letterSpacing: '0.04em' }}>
      <span style={{ fontWeight: 800 }}>Runtime</span>
      <span style={{ fontWeight: 500 }}>.tech</span>
    </div>
    {label && <Mono size={20} color={mode === 'light' ? L.mono : D.mono}>{label}</Mono>}
    <Counter i={i} n={n} mode={mode} />
  </div>
);

/** Big Arabic headline, right aligned. */
export const SlideTitle: React.FC<{ children: React.ReactNode; size?: number; top?: number; color?: string; style?: React.CSSProperties }> = ({
  children,
  size = 72,
  top = 90,
  color = L.ink,
  style,
}) => (
  <div dir="rtl" lang="ar" style={{ position: 'absolute', left: 0, right: 0, top, fontFamily: arabic, fontWeight: 900, fontSize: size, lineHeight: 1.14, color, ...style }}>
    {children}
  </div>
);

/** Arabic body text. */
export const SlideBody: React.FC<{ children: React.ReactNode; top: number; color?: string; size?: number; style?: React.CSSProperties }> = ({
  children,
  top,
  color = L.inkSoft,
  size = 42,
  style,
}) => (
  <div dir="rtl" lang="ar" style={{ position: 'absolute', left: 0, right: 0, top, fontFamily: arabic, fontWeight: 700, fontSize: size, lineHeight: 1.32, color, ...style }}>
    {children}
  </div>
);

/** Marker highlight behind words. */
export const Hl: React.FC<{ children: React.ReactNode; color: string }> = ({ children, color }) => (
  <span style={{ background: `linear-gradient(transparent 58%, ${color} 58%, ${color} 92%, transparent 92%)`, padding: '0 6px' }}>{children}</span>
);

/** Dark pill with a Darija verb and an arrow pointing to the next slide (the right). */
export const SwipeCue: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => (
  <div
    style={{
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      height: 84,
      padding: '0 36px 0 40px',
      borderRadius: 999,
      background: L.ink,
      color: '#F4F4F0',
      boxShadow: theme.shadow.lift,
      ...style,
    }}
  >
    <span dir="rtl" style={{ fontFamily: arabic, fontWeight: 800, fontSize: 42, paddingTop: 4 }}>{text}</span>
    <span style={{ fontFamily: display, fontWeight: 900, fontSize: 40 }}>→</span>
  </div>
);

/**
 * The strip. `seams` is drawn in strip coordinates over all slides: x = slideIndex * w (+/- px), use `box` to
 * align vertically with the safe box (y = box.y + box.s * boxY).
 */
export const CarouselStrip: React.FC<{
  variant: Variant;
  slides: SlideDef[];
  seams?: (a: { w: number; h: number; box: ReturnType<typeof boxPlace> }) => React.ReactNode;
}> = ({ variant, slides, seams }) => {
  const frame = useCurrentFrame();
  const n = slides.length;
  const idx = Math.min(n - 1, Math.max(0, frame));
  const { w, h } = CAROUSEL_SIZES[variant];
  const box = boxPlace(variant);
  return (
    <AbsoluteFill style={{ background: L.bgEdge, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: -idx * w, top: 0, width: w * n, height: h }}>
        {slides.map(({ mode, C }, i) =>
          // render only the visible slide and its neighbours (seam objects may reach over)
          Math.abs(i - idx) > 1 ? null : (
            <div key={i} style={{ position: 'absolute', left: i * w, top: 0, width: w, height: h, overflow: 'hidden' }}>
              {/* drift -2160*i shifts x by -1080*i so the grid continues across the seam; y moves by a multiple of 240 */}
              <GridCanvas mode={mode} drift={-2160 * i} spacing={240} />
              <div style={{ position: 'absolute', left: box.x, top: box.y, width: BOX.w, height: BOX.h, scale: `${box.s}`, transformOrigin: '0 0' }}>
                <C i={i} n={n} />
              </div>
            </div>
          ),
        )}
        {seams?.({ w, h, box })}
      </div>
    </AbsoluteFill>
  );
};
