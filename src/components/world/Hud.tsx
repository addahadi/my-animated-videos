import React from 'react';
import { arabic } from '../../fonts';
import { theme } from '../../theme';
import { world } from '../../theme-world';

const H = world.hud;
const SHADOW = theme.shadow.card;

/** Row of rounded pips in the Report card language (ink outline, ink fill). `value` may be fractional. Centred on `y`. */
export const LevelMeter: React.FC<{ count?: number; value: number; alert?: number; p?: number; y?: number; rtl?: boolean }> = ({
  count = 5,
  value,
  alert = 0,
  p = 1,
  y = world.layout.hudY,
  rtl = true,
}) => {
  const pw = 74;
  const ph = 26;
  const gap = 14;
  const total = count * pw + (count - 1) * gap;
  return (
    <div
      style={{
        position: 'absolute',
        left: 540 - total / 2,
        top: y - ph / 2,
        width: total,
        height: ph,
        display: 'flex',
        flexDirection: rtl ? 'row-reverse' : 'row',
        gap,
        opacity: Math.min(1, p * 2),
        translate: `0px ${(1 - Math.min(p, 1)) * -12}px`,
      }}
    >
      {Array.from({ length: count }, (_, i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <div
            key={i}
            style={{
              position: 'relative',
              width: pw,
              height: ph,
              borderRadius: ph / 2,
              background: H.off,
              border: `3px solid ${H.stroke}`,
              boxSizing: 'border-box',
              boxShadow: '3px 4px 0 rgba(11,15,21,0.12)',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, bottom: 0, [rtl ? 'right' : 'left']: 0, width: `${fill * 100}%`, background: H.on }}>
              <div style={{ position: 'absolute', inset: 0, background: H.alert, opacity: alert }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Round slots that fill as the system learns something. Empty = dashed ink ring with "؟",
 * filled = surface plate with ink outline + ink icon (red when `alert`). `fills[i]` = spring per slot. Slot 0 is on the right.
 */
export const SlotTray: React.FC<{
  icons: React.ReactNode[];
  fills: number[];
  p?: number;
  y?: number;
  alert?: number;
  labels?: string[];
}> = ({ icons, fills, p = 1, y = world.layout.slotsY, alert = 0, labels }) => {
  const d = 92;
  const gap = 26;
  const total = icons.length * d + (icons.length - 1) * gap;
  return (
    <div
      dir="rtl"
      style={{
        position: 'absolute',
        left: 540 - total / 2,
        top: y - d / 2,
        width: total,
        height: d,
        display: 'flex',
        gap,
        opacity: Math.min(1, p * 2),
        scale: `${0.85 + 0.15 * Math.min(p, 1)}`,
      }}
    >
      {icons.map((icon, i) => {
        const f = fills[i] ?? 0;
        const fo = Math.min(1, f * 2);
        return (
          <div key={i} style={{ position: 'relative', width: d, height: d }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `3px dashed ${H.slotDash}`,
                background: 'rgba(238,238,234,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: arabic,
                fontWeight: 800,
                fontSize: 40,
                color: H.slotQ,
                opacity: 1 - fo,
              }}
            >
              ؟
            </div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: alert > 0 ? H.alert : H.plate,
                border: `3px solid ${H.stroke}`,
                boxSizing: 'border-box',
                boxShadow: SHADOW,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: fo,
                scale: `${0.4 + 0.6 * f}`,
              }}
            >
              {icon}
            </div>
            {labels?.[i] && (
              <div style={{ position: 'absolute', top: d + 10, left: -30, right: -30, textAlign: 'center', fontFamily: arabic, fontWeight: 800, fontSize: 28, color: H.stroke, opacity: fo }}>
                {labels[i]}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/** Dashed zone in world px with a translucent fill and a label pill. `pulse` 0..1 from the clock. */
export const ZoneOverlay: React.FC<{ x: number; y: number; w: number; h: number; label: string; p?: number; pulse?: number; color?: string; fill?: string }> = ({
  x,
  y,
  w,
  h,
  label,
  p = 1,
  pulse = 0,
  color = H.zone,
  fill = H.zoneFill,
}) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, opacity: Math.min(1, p * 2), scale: `${0.92 + 0.08 * Math.min(p, 1)}` }}>
    <div style={{ position: 'absolute', inset: 0, borderRadius: 22, border: `5px dashed ${color}`, background: fill, opacity: 0.85 + 0.15 * pulse }} />
    <div
      dir="rtl"
      style={{
        position: 'absolute',
        left: '50%',
        top: -32,
        translate: '-50% 0px',
        height: 58,
        padding: '4px 30px 0',
        borderRadius: 999,
        background: color,
        border: `3px solid ${H.stroke}`,
        color: '#FFFFFF',
        fontFamily: arabic,
        fontWeight: 800,
        fontSize: 34,
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        boxShadow: SHADOW,
        rotate: '-3deg',
      }}
    >
      {label}
    </div>
  </div>
);
