import React from 'react';
import { DrawPath } from '../../../components/Diagram';
import { CursorIcon } from '../../../components/Icons';
import { Mono, StickerPill } from '../../../components/Labels';
import { CookieIcon } from '../../../components/Web';
import { arabic } from '../../../fonts';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';

const L = theme.light;
const A = theme.accent;

const C = { x: 175, y: 470, w: 730 };
const ROW_H = 118;
const ROW0 = C.y + 150;
const rowY = (i: number) => ROW0 + i * (ROW_H + 18);
const ADS_Y = 1150;

/**
 * Save frame: the banner as a clean reference card. Accept all = tracking (red, lines to three
 * advertisers); Reject / Necessary only = the site still works (green). Cursor picks Necessary only.
 */
export const Scene08Choice: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  const card = pop(t, e(1) - 0.2, fps, SPRING.soft);
  const rowsIn = [0, 1, 2].map((i) => pop(t, e(1) + 0.25 + i * 0.15, fps, SPRING.pop));
  const forced = pop(t, e(2), fps, SPRING.pop);
  const accept = ramp(t, e(3), e(3) + 0.25);
  const acceptTag = pop(t, e(3) + 0.2, fps, SPRING.pop);
  const lines = ramp(t, e(4), e(4) + 0.7, EASE_IN_OUT);
  const adsP = [0, 1, 2].map((i) => pop(t, e(4) + 0.25 + i * 0.12, fps, SPRING.pop));
  const reject = ramp(t, e(5), e(5) + 0.25);
  const necessary = ramp(t, e(6), e(6) + 0.25);
  const goodTag = pop(t, e(6) + 0.25, fps, SPRING.pop);
  const cur = ramp(t, e(7) - 0.7, e(7) - 0.05, EASE_IN_OUT);
  const press = Math.max(0, 1 - Math.abs(t - e(7)) * 7);
  const chosen = ramp(t, e(7), e(7) + 0.3);
  const fadeAds = chosen;

  const rows = [
    { label: 'ACCEPT ALL', color: A.red, hl: accept * (1 - chosen * 0.5), tag: '= TRACKING', tagP: acceptTag, tone: 'red' as const },
    { label: 'REJECT ALL', color: A.green, hl: reject, tag: '', tagP: 0, tone: 'green' as const },
    { label: 'NECESSARY ONLY', color: A.green, hl: necessary, tag: 'SITE WORKS', tagP: goodTag, tone: 'green' as const },
  ];

  return (
    <>
      {/* advertisers that Accept-all feeds */}
      {[0, 1, 2].map((i) => {
        const x = 230 + i * 230;
        const d = `M${C.x + 160} ${rowY(0) + ROW_H / 2} C ${C.x - 60} ${rowY(0) + 200}, ${x + 60} ${ADS_Y - 160}, ${x + 75} ${ADS_Y}`;
        return (
          <React.Fragment key={i}>
            <DrawPath d={d} p={lines} dashed width={4} color={A.red} opacity={1 - fadeAds * 0.75} />
            <div
              style={{
                position: 'absolute',
                left: x,
                top: ADS_Y,
                width: 150,
                height: 90,
                borderRadius: 16,
                background: L.surface,
                border: `3px solid ${A.red}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: Math.min(1, adsP[i] * 3) * (1 - fadeAds * 0.75),
                scale: `${0.5 + 0.5 * adsP[i]}`,
                boxShadow: theme.shadow.card,
              }}
            >
              <Mono size={24} color={A.red} weight={800}>
                {`ADS ${i + 1}`}
              </Mono>
            </div>
          </React.Fragment>
        );
      })}

      {/* the card */}
      <div
        style={{
          position: 'absolute',
          left: C.x,
          top: C.y,
          width: C.w,
          background: L.surface,
          border: `3px solid ${L.ink}`,
          borderRadius: theme.radius.card,
          boxShadow: theme.shadow.lift,
          padding: '24px 28px 30px',
          boxSizing: 'border-box',
          opacity: Math.min(1, card * 3),
          translate: `0px ${(1 - Math.min(card, 1)) * 70}px`,
          scale: `${0.94 + 0.06 * Math.min(card, 1)}`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 90 }}>
          <Mono size={20}>COOKIE SETTINGS</Mono>
          <div dir="rtl" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <CookieIcon size={56} />
            <span style={{ fontFamily: arabic, fontWeight: 800, fontSize: 50, color: L.ink, paddingTop: 6 }}>واش تختار؟</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 16 }}>
          {rows.map((r, i) => {
            const p = rowsIn[i];
            const hl = r.hl;
            const pressed = i === 2 ? press : 0;
            const dim = i === 0 ? chosen * 0.45 : 0;
            return (
              <div
                key={r.label}
                style={{
                  position: 'relative',
                  height: ROW_H,
                  borderRadius: 18,
                  border: `3px solid ${hl > 0.5 ? r.color : L.ink}`,
                  background: hl > 0.01 ? (r.tone === 'red' ? `rgba(230,88,86,${0.16 * hl})` : `rgba(50,175,122,${0.16 * hl})`) : '#F4F4F0',
                  boxShadow: i === 2 && chosen > 0 ? `0 0 ${26 * chosen}px ${A.green}` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 26px',
                  boxSizing: 'border-box',
                  opacity: Math.min(1, p * 3) * (1 - dim),
                  translate: `0px ${(1 - Math.min(p, 1)) * 30}px`,
                  scale: `${1 - pressed * 0.05}`,
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 99, border: `3px solid ${hl > 0.5 ? r.color : L.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 22 }}>
                  {i === 2 && chosen > 0.5 && <div style={{ width: 18, height: 18, borderRadius: 99, background: A.green }} />}
                </div>
                <Mono size={34} color={hl > 0.5 ? r.color : L.ink} weight={800} style={{ letterSpacing: '0.04em' }}>
                  {r.label}
                </Mono>
                {r.tag && <StickerPill text={r.tag} tone={r.tone} p={r.tagP} rotate={-4} size={24} style={{ right: 18, top: 34 }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* "the site is forced to ask you" */}
      <StickerPill text="مجبور يسقسيك" tone="yellow" p={forced} rotate={-6} size={40} style={{ left: 150, top: 430 }} />

      {/* the cursor picks Necessary only */}
      {cur > 0 && (
        <div style={{ position: 'absolute', left: mix(860, 640, cur), top: mix(1270, rowY(2) + 50, cur), scale: `${1 - press * 0.15}` }}>
          {press > 0 && <div style={{ position: 'absolute', left: -34, top: -34, width: 80, height: 80, borderRadius: 99, border: `4px solid ${L.ink}`, opacity: press, scale: `${1.6 - press * 0.6}` }} />}
          <CursorIcon size={80} fill="#FFFFFF" stroke={3.4} />
        </div>
      )}
      <StickerPill text="✓ الموقع يخدم عادي" tone="green" p={pop(t, e(7) + 0.35, fps, SPRING.pop)} rotate={-3} size={40} style={{ left: 540, top: 1170, translate: '-50% 0' }} />
    </>
  );
};
