import React from 'react';
import { theme } from '../../theme';

// Extra flat line glyphs for World HUD slots (48x48 viewBox, ink stroke). Generic shapes only.
const Svg: React.FC<{ size: number; color: string; stroke?: number; children: React.ReactNode }> = ({ size, color, stroke = 3.4, children }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', overflow: 'visible' }}>
    {children}
  </svg>
);

/** Speed gauge. `needle` 0..1 sweeps from slow (left) to fast (right). */
export const GaugeIcon: React.FC<{ size?: number; color?: string; needle?: number }> = ({ size = 48, color = theme.light.ink, needle = 0.25 }) => {
  const a = Math.PI * (1 - needle);
  return (
    <Svg size={size} color={color}>
      <path d="M8 32a16 16 0 0132 0" />
      <path d="M12 22l2 2M24 16v3M36 22l-2 2" />
      <path d={`M24 32L${24 + Math.cos(a) * 12} ${32 - Math.sin(a) * 12}`} />
      <circle cx="24" cy="32" r="2.5" fill={color} />
    </Svg>
  );
};

/** Big phone outline with a pin on its screen (panel hero object). */
export const PhonePin: React.FC<{ size?: number; color?: string; pin?: string }> = ({ size = 180, color = theme.light.ink, pin = theme.accent.yellow }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <rect x="12" y="3" width="24" height="42" rx="5" />
    <path d="M21 40h6" />
    <path d="M24 30s-6-5.8-6-10a6 6 0 0112 0c0 4.2-6 10-6 10z" fill={pin} stroke={color} strokeWidth={1.8} />
    <circle cx="24" cy="20" r="2.2" fill={theme.light.ink} stroke="none" />
  </svg>
);
