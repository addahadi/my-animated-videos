import React from 'react';
import { EarIcon, EyeIcon, MicIcon, PinIcon, WifiIcon } from '../../../components/Icons';
import { ArText } from '../../../components/Labels';
import { MiniRow, MiniUI } from '../../../components/MiniUI';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';

const L = theme.light;
const A = theme.accent;

const WORDS_TOP = ['يعرفك...'];
const WORDS_BOTTOM = ['بلا', 'ما', 'يسمعك'];

/** Case closed: the save-frame card builds one row per spoken clue, then the closing line lands. */
export const Scene12Recap: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  const card = pop(t, e(0) + 0.1, fps, SPRING.soft);
  const r0 = pop(t, e(1), fps, SPRING.pop);
  const strike = ramp(t, e(1) + 0.3, e(1) + 0.6, EASE_IN_OUT);
  const r1 = pop(t, e(2), fps, SPRING.pop);
  const r2 = pop(t, e(3), fps, SPRING.pop);
  const r3 = pop(t, e(4), fps, SPRING.pop);
  const hl = ramp(t, e(4) + 0.2, e(4) + 0.5);
  const away = ramp(t, e(6) - 0.05, e(6) + 0.45, EASE_IN_OUT);
  const earOut = ramp(t, e(7), e(7) + 0.5);

  return (
    <>
      <MiniUI
        width={740}
        title="كيفاش عرف؟"
        label="CASE FILE · CLOSED"
        p={card}
        style={{ left: 170, top: 470, opacity: Math.min(1, card * 2.5) * (1 - away * 0.82), translate: `0px ${(1 - Math.min(card, 1)) * 60 + away * 70}px`, scale: `${(0.94 + 0.06 * Math.min(card, 1)) * (1 - away * 0.06)}` }}
      >
        <MiniRow icon={<MicIcon size={42} />} text="الميكرو" tag="NOT LISTENING" p={r0} struck={strike} dim={strike * 0.6} />
        <MiniRow icon={<PinIcon size={42} fill={A.yellow} />} text="وين رحت" tag="GPS" p={r1} />
        <MiniRow icon={<WifiIcon size={42} color={A.blue} />} text="مع من كنت" tag="WIFI" p={r2} />
        <MiniRow icon={<EyeIcon size={42} />} text="واش شفت" tag="AI" p={r3} highlighted={hl} />
      </MiniUI>

      {/* closing line over the dimmed card */}
      {away > 0 && (
        <div style={{ position: 'absolute', left: 165, right: 165, top: 640, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{ position: 'absolute', inset: '-60px -10px', background: `radial-gradient(ellipse at center, ${L.bgCenter} 40%, rgba(223,225,220,0) 72%)`, opacity: away }} />
          <div dir="rtl" style={{ position: 'relative', display: 'flex', gap: 22 }}>
            {WORDS_TOP.map((w, i) => {
              const p = pop(t, e(6) + i * 0.15, fps, SPRING.pop);
              return (
                <span key={w} style={{ display: 'inline-block', opacity: Math.min(1, p * 3), scale: `${0.6 + 0.4 * p}`, translate: `0px ${(1 - Math.min(p, 1)) * 30}px` }}>
                  <ArText size={132} weight={900}>
                    {w}
                  </ArText>
                </span>
              );
            })}
          </div>
          <div dir="rtl" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 22 }}>
            {WORDS_BOTTOM.map((w, i) => {
              const p = pop(t, e(6) + 0.45 + i * 0.16, fps, SPRING.pop);
              return (
                <span key={w + i} style={{ display: 'inline-block', opacity: Math.min(1, p * 3), scale: `${0.6 + 0.4 * p}`, translate: `0px ${(1 - Math.min(p, 1)) * 30}px` }}>
                  <ArText size={96} weight={900} color={i === 2 ? A.red : L.ink}>
                    {w}
                  </ArText>
                </span>
              );
            })}
            <span style={{ display: 'inline-block', opacity: mix(1, 0, earOut) * Math.min(1, pop(t, e(6) + 0.9, fps, SPRING.pop) * 3), scale: `${mix(1, 0.4, earOut)}`, filter: `blur(${earOut * 6}px)` }}>
              <EarIcon size={90} stroke={3.4} color={A.red} />
            </span>
          </div>
        </div>
      )}
    </>
  );
};
