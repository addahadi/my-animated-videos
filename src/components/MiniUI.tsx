import React from 'react';
import { arabic } from '../fonts';
import { theme } from '../theme';
import { Mono } from './Labels';

const L = theme.light;
const A = theme.accent;

/** Clean save-frame card with a mono header, an Arabic title and rows (children). */
export const MiniUI: React.FC<{
  title: string;
  label: string;
  icon?: React.ReactNode;
  width: number;
  p?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ title, label, icon, width, p = 1, style, children }) => (
  <div
    style={{
      position: 'absolute',
      width,
      background: L.surface,
      border: `3px solid ${L.ink}`,
      borderRadius: theme.radius.card,
      boxShadow: theme.shadow.lift,
      padding: '26px 28px 30px',
      boxSizing: 'border-box',
      opacity: Math.min(1, p * 2.5),
      translate: `0px ${(1 - Math.min(p, 1)) * 60}px`,
      scale: `${0.94 + 0.06 * p}`,
      ...style,
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Mono size={20} color={L.mono}>{label}</Mono>
      </div>
      <div dir="rtl" lang="ar" style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: arabic, fontWeight: 800, fontSize: 44, color: L.ink, lineHeight: 1 }}>
        {icon}
        <span>{title}</span>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
  </div>
);

/** One MiniUI row: icon + Arabic text on the right (RTL), mono tag on the left. */
export const MiniRow: React.FC<{
  icon: React.ReactNode;
  text: string;
  tag?: string;
  p?: number;
  highlighted?: number;
  struck?: number;
  dim?: number;
}> = ({ icon, text, tag, p = 1, highlighted = 0, struck = 0, dim = 0 }) => {
  if (p <= 0.001) return <div style={{ height: 112 }} />;
  const hl = highlighted;
  return (
    <div
      dir="rtl"
      style={{
        position: 'relative',
        height: 112,
        borderRadius: 18,
        border: `${hl > 0.01 ? 3 : 2.5}px solid ${hl > 0.01 ? A.gold : 'rgba(11,15,21,0.75)'}`,
        background: hl > 0.01 ? `rgba(233,227,208,${hl})` : '#F6F6F2',
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '0 24px',
        boxSizing: 'border-box',
        opacity: Math.min(1, p * 2.5) * (1 - dim * 0.5),
        translate: `${(1 - Math.min(p, 1)) * -40}px 0px`,
        scale: `${0.92 + 0.08 * Math.min(p, 1.04)}`,
      }}
    >
      <div style={{ width: 66, height: 66, borderRadius: 16, background: '#E4E7F3', border: `2.5px solid ${L.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ position: 'relative', fontFamily: arabic, fontWeight: 800, fontSize: 50, color: struck > 0.5 ? L.inkSoft : L.ink, lineHeight: 1, paddingTop: 6 }}>
        {text}
        {struck > 0 && (
          <div style={{ position: 'absolute', right: -6, top: '52%', height: 6, width: `calc(${struck * 100}% + 12px)`, background: A.red, borderRadius: 3 }} />
        )}
      </div>
      <div style={{ flex: 1 }} />
      {tag && (
        <div
          dir="ltr"
          style={{
            padding: '6px 14px',
            borderRadius: 999,
            background: hl > 0.5 ? A.yellow : struck > 0.5 ? A.red : L.ink,
            border: `2.5px solid ${L.ink}`,
            color: hl > 0.5 ? L.ink : '#FFFFFF',
          }}
        >
          <Mono size={20} color={hl > 0.5 ? L.ink : '#FFFFFF'} weight={800}>
            {tag}
          </Mono>
        </div>
      )}
    </div>
  );
};
