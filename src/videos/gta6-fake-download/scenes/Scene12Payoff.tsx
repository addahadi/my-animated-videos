import React from 'react';
import { Stamp } from '../../../components/Labels';
import { LinkCard } from '../../../components/Scam';
import { arabic } from '../../../fonts';
import { pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { SPRING, theme } from '../../../theme';
import { E, LINK_TITLE } from './parts';

const L = theme.light;
const A = theme.accent;

/**
 * Payoff: the frame-1 link card returns with its red كذب stamp; "ما يسرقش اللعبة" appears word by
 * word, اللعبة is struck out and "يسرقك نتا." lands in red (hit).
 */
export const Scene12Payoff: React.FC<SceneProps> = () => {
  const { t, fps } = useClock();
  const e = (i: number) => E(12, i);

  const card = pop(t, e(0), fps, SPRING.soft);
  const stamp = pop(t, e(0) + 0.2, fps, SPRING.snappy);
  const words = ['ما', 'يسرقش', 'اللعبة'];
  const wp = words.map((_, i) => pop(t, e(1) + i * 0.3, fps, SPRING.pop));
  const strike = ramp(t, e(2) - 0.05, e(2) + 0.2);
  const you = pop(t, e(2) + 0.1, fps, SPRING.snappy);
  const shake = Math.max(0, 1 - (t - e(2) - 0.1) * 4) * Math.sin(t * 90) * 5;

  return (
    <>
      <div style={{ position: 'absolute', left: 540 - 300, top: 420, width: 600, opacity: Math.min(1, card * 3), scale: `${0.8 + 0.2 * card}` }}>
        <LinkCard width={600} title={LINK_TITLE} />
        <Stamp text="كذب" p={stamp} size={140} rotate={-12} style={{ mixBlendMode: 'normal', background: 'rgba(238,238,234,0.88)', left: 300, top: 210, translate: '-50% -50%' }} />
      </div>

      <div dir="rtl" style={{ position: 'absolute', left: 0, right: 0, top: 920, display: 'flex', justifyContent: 'center' }}>
        <div style={{ fontFamily: arabic, fontWeight: 800, fontSize: 84, color: L.ink, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
          {words.map((w, i) => (
            <span key={w} style={{ position: 'relative', display: 'inline-block', marginLeft: i < words.length - 1 ? 22 : 0, opacity: Math.min(1, wp[i] * 3) * (i === 2 ? 1 - strike * 0.45 : 1), translate: `0px ${(1 - Math.min(1, wp[i])) * 30}px` }}>
              {w}
              {i === 2 && strike > 0 && <span style={{ position: 'absolute', right: -8, top: '50%', height: 10, width: `calc(${strike * 100}% + 16px)`, background: A.red, borderRadius: 5, rotate: '-4deg' }} />}
            </span>
          ))}
        </div>
      </div>
      <div dir="rtl" style={{ position: 'absolute', left: 0, right: 0, top: 1060, display: 'flex', justifyContent: 'center', translate: `${shake}px 0px` }}>
        <div style={{ fontFamily: arabic, fontWeight: 900, fontSize: 140, color: A.red, lineHeight: 1.1, opacity: Math.min(1, you * 3), scale: `${0.5 + 0.5 * you}`, WebkitTextStroke: `3px ${L.ink}` }}>يسرقك نتا.</div>
      </div>
    </>
  );
};
