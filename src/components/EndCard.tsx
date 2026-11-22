import React from 'react';
import { GridCanvas, ScanLine } from './Canvas';
import { Mono, Stamp } from './Labels';
import { arabic, display } from '../fonts';
import { theme } from '../theme';

const L = theme.light;

/**
 * Shared Runtime.tech end card (both Report and World styles, plans/style.md section 6 scene 8):
 * light grid canvas, objects slot (y 540 to 950), stamp, wordmark with scan line, mono tagline, follow button.
 * All progress values come from the scene (springs / ramps), so the card never reads the clock.
 */
export const EndCard: React.FC<{
  bg?: number;
  mark: number;
  scan: number;
  tagline: number;
  button: number;
  stamp?: number;
  breathe?: number;
  buttonText: string;
  stampText?: string;
  drift?: number;
  objects?: React.ReactNode;
}> = ({ bg = 1, mark, scan, tagline, button, stamp = 0, breathe = 1, buttonText, stampText = 'EXPLAINED', drift = 0, objects }) => (
  <div style={{ position: 'absolute', inset: 0, opacity: bg }}>
    <GridCanvas mode="light" drift={drift} spacing={240} />
    {objects}
    {stamp > 0 && <Stamp text={stampText} p={stamp} size={70} rotate={-12} style={{ left: 540, top: 900, translate: '-50% -50%' }} />}
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 1018,
        height: 152,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: Math.min(1, mark * 3),
        translate: `0px ${(1 - Math.min(mark, 1)) * 30}px`,
      }}
    >
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
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1246, display: 'flex', justifyContent: 'center' }}>
      <div
        dir="rtl"
        style={{
          height: 80,
          padding: '0 40px',
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
        <span style={{ fontFamily: arabic, fontWeight: 800, fontSize: 40, paddingTop: 4 }}>{buttonText}</span>
        <span style={{ fontFamily: display, fontWeight: 900, fontSize: 38 }}>←</span>
      </div>
    </div>
  </div>
);
