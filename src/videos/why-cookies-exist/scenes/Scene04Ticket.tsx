import React from 'react';
import { DrawPath } from '../../../components/Diagram';
import { ClockIcon } from '../../../components/Icons';
import { Card, Mono, StickerPill } from '../../../components/Labels';
import { ShirtIcon, TermLabel, TicketChip } from '../../../components/Web';
import { arabic, display } from '../../../fonts';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';
import { BROWSER_EDGE, LINE_Y, SERVER_EDGE, SiteServer, STAGE, YouBrowser, YouTag } from './parts';

const L = theme.light;
const A = theme.accent;

const SHIRTS = [
  { id: '48211', fill: '#C9CFE3' },
  { id: '48213', fill: A.blue },
  { id: '48217', fill: '#D9C27A' },
];

/**
 * The fix (1994): the server hands your browser a small ticket with a number = the cookie.
 * Then the analogy: the pressing. You leave your clothes, get a numbered ticket, come back,
 * hand it over, and they know right away which shirt is yours.
 */
export const Scene04Ticket: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  // part A: 1994 + the ticket is born
  const year = pop(t, e(1), fps, SPRING.pop);
  const netscape = pop(t, e(2), fps, SPRING.soft);
  const born = pop(t, e(3), fps, SPRING.pop);
  const fly = ramp(t, e(4), e(4) + 0.8, EASE_IN_OUT);
  const term = pop(t, e(3) + 0.35, fps, SPRING.pop);
  const idGlow = Math.max(0, Math.min(1, ramp(t, e(5) - 0.1, e(5) + 0.2) - ramp(t, e(5) + 1.2, e(5) + 1.6)));
  const zoom = pop(t, e(5), fps, SPRING.soft);
  // part B: the pressing
  const toB = ramp(t, e(6) - 0.35, e(6) + 0.25, EASE_IN_OUT);
  const counter = pop(t, e(6), fps, SPRING.soft);
  const hang = ramp(t, e(7) - 0.1, e(7) + 0.6, EASE_IN_OUT);
  const give = pop(t, e(8), fps, SPRING.pop);
  const later = pop(t, e(9), fps, SPRING.pop);
  const handBack = ramp(t, e(10), e(10) + 0.6, EASE_IN_OUT);
  const found = ramp(t, e(11), e(11) + 0.7, EASE_IN_OUT);
  const check = pop(t, e(11) + 0.45, fps, SPRING.pop);
  const map = pop(t, e(11) + 1.0, fps, SPRING.soft);

  // ticket path: from the server edge, arc, into the browser's bottom
  const sx = SERVER_EDGE + 20;
  const sy = LINE_Y - 60;
  const bx = STAGE.browser.x + 40;
  const by = STAGE.browser.y + STAGE.browser.h - 140;
  const tx = mix(sx, bx, fly);
  const ty = mix(sy, by, fly) - Math.sin(fly * Math.PI) * 140;
  const tw = mix(230, 240, fly);

  return (
    <>
      {/* ---------- part A */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - toB, translate: `0px ${-toB * 90}px`, scale: `${1 - toB * 0.08}` }}>
        <YouBrowser>
          <div style={{ position: 'absolute', left: 24, right: 24, top: 24, display: 'flex', flexDirection: 'column', gap: 12, opacity: 0.8 }}>
            <div style={{ height: 100, borderRadius: 14, background: '#DCE1F6' }} />
            {[0.9, 0.7].map((w, i) => (
              <div key={i} style={{ height: 14, width: `${w * 100}%`, borderRadius: 8, background: '#D5D7D2' }} />
            ))}
          </div>
        </YouBrowser>
        <YouTag />
        <DrawPath d={`M${BROWSER_EDGE - 14} ${LINE_Y} H${SERVER_EDGE + 14}`} p={1} dashed width={5} color={L.ink} opacity={0.6} />
        <SiteServer blink={t * 3} glow={born > 0.1 && fly < 1 ? 0.5 : 0} glowColor={A.yellow} />

        {/* 1994 + who */}
        <StickerPill text="1994" tone="ink" p={year} rotate={-4} size={54} style={{ left: 540, top: 440, translate: '-50% 0' }} />
        <div style={{ position: 'absolute', left: 540, top: 530, translate: '-50% 0', opacity: Math.min(1, netscape * 3) }}>
          <Mono size={22} color={L.mono}>
            NETSCAPE · ENGINEER
          </Mono>
        </div>

        {/* the cookie: born at the server, flies into your browser */}
        {born > 0.001 && (
          <TicketChip
            id="48213"
            width={tw}
            glow={Math.max(idGlow, fly < 1 && fly > 0 ? 0.6 : 0)}
            style={{ left: tx, top: ty, opacity: Math.min(1, born * 3), scale: `${0.4 + 0.6 * Math.min(born, 1.05)}`, rotate: `${mix(-8, 3, fly)}deg` }}
          />
        )}
        <TermLabel term="cookie" gloss="ملف صغير فيه رقم" p={term} size={44} style={{ left: 540, top: 1085, translate: '-50% 0' }} />

        {/* the number, zoomed */}
        <div
          style={{
            position: 'absolute',
            left: 196,
            top: 930,
            opacity: Math.min(1, zoom * 3) * (fly >= 1 ? 1 : 0),
            scale: `${0.5 + 0.5 * zoom}`,
            transformOrigin: '100% 0%',
          }}
        >
          <div style={{ background: L.ink, borderRadius: 14, padding: '10px 18px' }}>
            <Mono size={26} color={A.yellow} weight={800}>
              ID = 48213
            </Mono>
          </div>
        </div>
      </div>

      {/* ---------- part B: the pressing (reads right to left) */}
      {toB > 0.001 && (
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(1, counter * 3), translate: `0px ${(1 - Math.min(counter, 1)) * 100}px` }}>
          <Card style={{ left: 175, top: 450, width: 730, height: 700 }}>
            <div style={{ position: 'absolute', right: 26, top: 18 }}>
              <div dir="rtl" style={{ fontFamily: arabic, fontWeight: 800, fontSize: 52, color: L.ink }}>
                الـpressing
              </div>
            </div>
            <div style={{ position: 'absolute', left: 26, top: 30 }}>
              <Mono size={20}>DRY CLEANER · RACK</Mono>
            </div>
            {/* rack */}
            <div style={{ position: 'absolute', left: 40, right: 40, top: 120, height: 8, borderRadius: 6, background: L.ink }} />
            {SHIRTS.map((s, i) => {
              const mine = s.id === '48213';
              // my shirt arrives from the right (the customer side) when I leave it, and comes back out the same way
              const inP = mine ? hang : 1;
              const outP = mine ? found : 0;
              const x = 40 + i * 225 + (mine ? (1 - inP) * 380 + outP * 170 : 0);
              const y = 108 + outP * 360;
              return (
                <div key={s.id} style={{ position: 'absolute', left: x, top: y, width: 200, opacity: mine ? Math.min(1, inP * 3) : 1 - found * 0.55 }}>
                  <svg width={200} height={46} style={{ display: 'block', overflow: 'visible' }}>
                    <path d="M100 0 v12 M100 12 l-62 30 h124 z" stroke={L.ink} strokeWidth={4} fill="none" strokeLinejoin="round" />
                  </svg>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: -30 }}>
                    <ShirtIcon size={210} fill={s.fill} stroke={2.2} />
                  </div>
                  <div style={{ position: 'absolute', left: 52, top: 150, rotate: '-4deg', background: A.yellow, border: `3px solid ${L.ink}`, borderRadius: 10, padding: '4px 10px', boxShadow: mine && found > 0.1 ? `0 0 22px ${A.yellow}` : 'none' }}>
                    <Mono size={20} color={L.ink} weight={800}>
                      {`N° ${s.id}`}
                    </Mono>
                  </div>
                </div>
              );
            })}
            {/* counter top */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: 410, height: 6, background: L.ink, opacity: 0.85 }} />
          </Card>

          {/* the customer's ticket: given, kept, handed back */}
          {give > 0.001 && (
            <TicketChip
              id="48213"
              kicker="N°"
              width={250}
              glow={found > 0.3 ? 0.8 : 0}
              style={{
                left: mix(620, 215, handBack),
                top: mix(1000, 990, handBack),
                opacity: Math.min(1, give * 3),
                scale: `${0.5 + 0.5 * Math.min(give, 1.05)}`,
                rotate: `${mix(6, -3, handBack)}deg`,
              }}
            />
          )}
          <StickerPill text="غدوة" tone="ink" p={later * (1 - found)} rotate={5} size={40} icon={<ClockIcon size={34} color="#F4F4F0" hand={(t - e(9)) * 0.8} />} style={{ left: 690, top: 880 }} />
          <StickerPill text="✓ 48213" tone="green" p={check} rotate={-5} size={36} style={{ left: 225, top: 905 }} />

          {/* mapping back to the web */}
          <div style={{ position: 'absolute', left: 175, top: 1180, width: 730, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, opacity: Math.min(1, map * 3), scale: `${0.8 + 0.2 * map}` }}>
            <span dir="rtl" style={{ fontFamily: arabic, fontWeight: 800, fontSize: 46, color: L.ink }}>
              التيكي
            </span>
            <span style={{ fontFamily: arabic, fontWeight: 900, fontSize: 46, color: L.ink }}>=</span>
            <span dir="ltr" style={{ fontFamily: display, background: A.yellow, border: `3px solid ${L.ink}`, borderRadius: 12, padding: '4px 16px', fontWeight: 900, fontSize: 40, color: L.ink }}>
              cookie
            </span>
          </div>
        </div>
      )}
    </>
  );
};
