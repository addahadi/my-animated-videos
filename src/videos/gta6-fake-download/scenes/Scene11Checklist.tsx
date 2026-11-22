import React from 'react';
import { PinIcon, ShopIcon } from '../../../components/Icons';
import { Stamp, StickerPill } from '../../../components/Labels';
import { MiniRow, MiniUI } from '../../../components/MiniUI';
import { pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { SPRING, theme } from '../../../theme';
import { E } from './parts';

const L = theme.light;
const A = theme.accent;

const ShieldOff: React.FC = () => (
  <svg width={44} height={44} viewBox="0 0 48 48" fill="none" stroke={L.ink} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
    <path d="M24 5 L40 11 V23 Q40 36 24 43 Q8 36 8 23 V11 Z" fill="#E4E7F3" />
    <path d="M6 6 L42 42" stroke={A.red} strokeWidth={4} />
  </svg>
);
const NumberCoin: React.FC = () => (
  <svg width={44} height={44} viewBox="0 0 48 48" fill="none" stroke={L.ink} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
    <rect x="4" y="10" width="28" height="18" rx="4" fill="#F6F6F2" />
    <path d="M9 19 H27" strokeDasharray="3 3" />
    <circle cx="34" cy="32" r="10" fill={A.yellow} />
    <path d="M34 27 V37" />
  </svg>
);

/**
 * Save frame: "3 علامات الـarnaque" builds one row per spoken point, each gets a red flag;
 * mini stamp هرب on row 2, ARNAQUE stamp at the end, full card held with a silent pin chip.
 */
export const Scene11Checklist: React.FC<SceneProps> = () => {
  const { t, fps } = useClock();
  const e = (i: number) => E(11, i);

  const card = pop(t, e(0), fps, SPRING.soft);
  const rowsAt = [e(1), e(3), e(5)];
  const flagsAt = [e(2), e(4), e(6)];
  const rows = rowsAt.map((a) => pop(t, a, fps, SPRING.pop));
  const flags = flagsAt.map((a) => pop(t, a, fps, SPRING.pop));
  const active = t < rowsAt[1] ? 0 : t < rowsAt[2] ? 1 : 2;
  const hold = t >= e(7) - 0.4;
  const count = rowsAt.filter((a) => t >= a).length;
  const run = pop(t, e(4), fps, SPRING.snappy);
  const arnaque = pop(t, e(6), fps, SPRING.snappy);
  const pin = pop(t, e(7) - 0.3, fps, SPRING.pop);
  const breathe = t > e(7) ? 1 + 0.025 * Math.sin((t - e(7)) * 6) : 1;

  const data = [
    { icon: <ShopIcon size={44} />, text: 'ماشي في الـstore الرسمي' },
    { icon: <ShieldOff />, text: 'طفّي الـantivirus' },
    { icon: <NumberCoin />, text: 'رقمك ولا دراهم' },
  ];

  const top = 470;
  const rowTop = (i: number) => top + 26 + 64 + i * (112 + 14);

  return (
    <>
      <MiniUI title="3 علامات الـarnaque" label={`${count}/3 SIGNS`} width={800} p={card} style={{ left: 140, top }}>
        {data.map((d, i) => (
          <MiniRow
            key={i}
            icon={d.icon}
            text={d.text}
            p={rows[i]}
            highlighted={hold ? 0 : active === i ? ramp(t, rowsAt[i], rowsAt[i] + 0.3) : 0}
            dim={hold ? 0 : active > i ? 0.35 : 0}
          />
        ))}
      </MiniUI>
      {data.map((_, i) => (
        <StickerPill key={i} text="RED FLAG" tone="red" p={flags[i]} rotate={-6} size={22} style={{ left: 112, top: rowTop(i) - 14 }} />
      ))}
      <Stamp text="هرب" p={run} size={48} rotate={-10} style={{ left: 190, top: rowTop(1) + 40 }} />
      <Stamp text="ARNAQUE" p={arnaque} size={96} rotate={-12} style={{ left: 540, top: 1040, translate: '-50% -50%' }} />
      <StickerPill text="سيفيها" tone="yellow" p={pin} rotate={5} size={46} icon={<PinIcon size={36} />} style={{ left: 640, top: 1150, scale: `${breathe}` }} />
    </>
  );
};
