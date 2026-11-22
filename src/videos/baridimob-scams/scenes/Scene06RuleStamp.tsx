import React from 'react';
import { LayersGlyph, SmsGlyph } from '../../../components/Banking';
import { ArText, XStamp } from '../../../components/Labels';
import { arabic, display } from '../../../fonts';
import { Img, staticFile } from 'remotion';
import { evAt, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { SPRING, theme } from '../../../theme';
import { FakeAppIcon } from './Scene04TrickFakeApp';

const L = theme.light;
const A = theme.accent;

/** Scene 6: the 3 tricks as icons, the one rule in big type, three channels crossed out, one stamp over all. */
type RuleProps = SceneProps & {
  /** real brand logo (public path) shown instead of the 3 trick icons; no stamp (TikTok cut: only trick 1 is shown) */
  logo?: string;
};

export const Scene06RuleStamp: React.FC<RuleProps> = ({ events, logo }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  const icons = [0, 1, 2].map((i) => pop(t, e(0) + i * 0.15, fps, SPRING.pop));
  const line1 = ramp(t, e(1), e(1) + 0.35);
  const line2 = ramp(t, e(1) + 0.7, e(1) + 1.05);
  const code = pop(t, e(1) + 1.2, fps, SPRING.pop);
  const ch = [2, 3, 4].map((i) => pop(t, e(i) - 0.25, fps, SPRING.pop));
  const xs = [2, 3, 4].map((i) => pop(t, e(i) + 0.05, fps, SPRING.snappy));
  const stamp = logo ? 0 : pop(t, e(5), fps, SPRING.snappy);
  const logoP = pop(t, e(0), fps, SPRING.pop);

  const tile = (children: React.ReactNode, i: number) => (
    <div
      key={i}
      style={{
        position: 'absolute',
        left: 660 - i * 210,
        top: 430,
        width: 170,
        height: 170,
        borderRadius: 24,
        background: L.surface,
        border: `3px solid ${L.ink}`,
        boxShadow: theme.shadow.card,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: Math.min(1, icons[i] * 3) * (1 - 0.35 * Math.min(1, stamp)),
        scale: `${0.6 + 0.4 * icons[i]}`,
      }}
    >
      {children}
      <span style={{ position: 'absolute', top: -18, right: -14, width: 46, height: 46, borderRadius: 99, background: L.pill, color: '#FFFFFF', fontFamily: display, fontWeight: 900, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
    </div>
  );

  const channels = ['SMS', 'تيليفون', 'ميساج'];
  return (
    <>
      {logo ? (
        <Img src={staticFile(logo)} style={{ position: 'absolute', left: 540 - 100, top: 445, width: 200, height: 220, objectFit: 'contain', opacity: Math.min(1, logoP * 3), scale: `${0.6 + 0.4 * logoP}` }} />
      ) : (
        <>
          {tile(<SmsGlyph size={100} fill={A.green} />, 0)}
          {tile(<FakeAppIcon size={90} flip={1} style={{ position: 'relative' }} />, 1)}
          {tile(<LayersGlyph size={100} fill="#F3B2B0" />, 2)}
          <XStamp p={stamp} size={300} style={{ left: 390, top: 365 }} />
        </>
      )}

      <ArText size={84} weight={900} style={{ position: 'absolute', left: 0, right: 0, top: 690, textAlign: 'center', opacity: line1, translate: `0px ${(1 - line1) * 30}px` }}>
        بريد الجزائر
      </ArText>
      <ArText size={84} weight={900} style={{ position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center', opacity: line2, translate: `0px ${(1 - line2) * 30}px` }}>
        ما يطلبش منك{' '}
        <span style={{ background: `rgba(238,206,97,${Math.min(1, code)})`, borderRadius: 14, padding: '0 14px', boxShadow: code > 0.1 ? `inset 0 0 0 3px ${L.ink}` : undefined }}>الكود</span>
      </ArText>

      {channels.map((c, i) => (
        <div
          key={c}
          style={{
            position: 'absolute',
            left: 650 - i * 235,
            top: 1010,
            width: 210,
            height: 100,
            borderRadius: 999,
            background: L.pill,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: Math.min(1, ch[i] * 3),
            scale: `${0.6 + 0.4 * ch[i]}`,
          }}
        >
          <span dir="auto" style={{ fontFamily: c === 'SMS' ? display : arabic, fontWeight: 900, fontSize: 46, color: '#F4F4F0', paddingTop: c === 'SMS' ? 0 : 6 }}>
            {c}
          </span>
          <div style={{ position: 'absolute', right: -16, top: -20, width: 64, height: 64, borderRadius: 99, background: A.red, border: `3px solid ${L.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, xs[i] * 3), scale: `${0.4 + 0.6 * xs[i]}` }}>
            <span style={{ fontFamily: display, fontWeight: 900, fontSize: 40, color: '#FFFFFF', lineHeight: 1 }}>✕</span>
          </div>
        </div>
      ))}
    </>
  );
};
