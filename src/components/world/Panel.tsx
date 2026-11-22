import React from 'react';
import { theme } from '../../theme';
import { world } from '../../theme-world';

const L = theme.light;

// World close-up panels use the Report GridCanvas (light) as their background: see src/components/Canvas.tsx.

/** Large icon on a round Report card (surface, 3 px ink outline, offset shadow). `p` = spring progress. */
export const IconDisc: React.FC<{ size?: number; p?: number; x?: number; y?: number; children: React.ReactNode }> = ({
  size = 320,
  p = 1,
  x = 540,
  y = world.layout.panelObjectY,
  children,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: '50%',
      background: L.surface,
      border: `${theme.stroke.card}px solid ${L.ink}`,
      boxSizing: 'border-box',
      boxShadow: theme.shadow.lift,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: Math.min(1, p * 3),
      scale: `${0.6 + 0.4 * p}`,
    }}
  >
    {children}
  </div>
);
