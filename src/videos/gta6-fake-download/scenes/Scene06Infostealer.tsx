import React from 'react';
import { quadPoint } from '../../../components/Diagram';
import { CursorIcon, LockIcon, SearchIcon } from '../../../components/Icons';
import { Mono, StickerPill } from '../../../components/Labels';
import { LootBag, ThiefGlyph } from '../../../components/Scam';
import { BrowserCard, TermLabel, TicketChip, UserGlyph } from '../../../components/Web';
import { arabic, display } from '../../../fonts';
import { mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';
import { E } from './parts';

const L = theme.light;
const D = theme.dark;
const A = theme.accent;

const ROWS = [
  { site: 'mail.site', user: 'you@mail.com', pw: 'Sara#1998' },
  { site: 'shop.site', user: 'you@mail.com', pw: 'dz2024!!' },
  { site: 'bank.site', user: '0555 •• •• ••', pw: 'Moh@123' },
];

/** Generic controller glyph (the game you expected). */
const Controller: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 100 62" fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
    <path d="M22 6 H78 Q96 6 97 30 L98 46 Q98 60 86 56 L72 44 H28 L14 56 Q2 60 2 46 L3 30 Q4 6 22 6 Z" />
    <path d="M26 20 V36 M18 28 H34" />
    <circle cx="70" cy="24" r="4" fill={color} />
    <circle cx="80" cy="34" r="4" fill={color} />
  </svg>
);

/**
 * Scenes 6 + 7 (what is inside the file), dark blueprint:
 * 1. X-ray of the file: the game controller you expected is crossed out, a thief is inside.
 *    INFOSTEALER = يعني سارق.
 * 2. "كي تفتحو": a double-click on the file, the thief jumps into YOUR browser's saved
 *    passwords; a magnifier passes over each row and the dots turn into the real password
 *    (it READS them), a copy flies into the thief's bag "عند السارق".
 * 3. The logged-in row "connecté ✓" drops its cookie ticket (تذكرة الدخول) into the bag too.
 */
export const Scene06Infostealer: React.FC<SceneProps> = () => {
  const { t, fps } = useClock();

  // phase A: x-ray reveal
  const xray = ramp(t, E(6, 0), E(6, 0) + 0.45, EASE_IN_OUT);
  const game = pop(t, E(6, 0) + 0.15, fps, SPRING.pop);
  const gameX = ramp(t, E(6, 0) + 0.55, E(6, 0) + 0.8);
  const gameOut = ramp(t, E(6, 0) + 1.0, E(6, 0) + 1.3);
  const thiefIn = pop(t, E(6, 0) + 0.95, fps, SPRING.pop);
  const term = pop(t, E(6, 1), fps, SPRING.pop);
  const gloss = Math.max(0, 1 - Math.abs(t - E(6, 2) - 0.15) * 4);
  // phase B: open it
  const shrink = ramp(t, E(6, 3) - 0.35, E(6, 3) + 0.25, EASE_IN_OUT);
  const click = Math.max(0, 1 - Math.abs(t - (E(6, 3) + 0.15)) * 5);
  const browser = pop(t, E(6, 3) + 0.1, fps, SPRING.soft);
  const bag = pop(t, E(6, 3) + 0.3, fps, SPRING.pop);
  const jump = ramp(t, E(6, 3) + 0.25, E(6, 3) + 0.85, EASE_IN_OUT);
  const readAt = (i: number) => E(6, 4) + i * 0.55;
  const reads = ROWS.map((_, i) => ramp(t, readAt(i) + 0.15, readAt(i) + 0.35));
  const copies = ROWS.map((_, i) => ramp(t, readAt(i) + 0.45, readAt(i) + 1.0, EASE_IN_OUT));
  // phase C: the cookie of a logged-in site
  const sessHl = ramp(t, E(7, 0) - 0.1, E(7, 0) + 0.2);
  const ticket = pop(t, E(7, 0) + 0.1, fps, SPRING.pop);
  const ticketGloss = pop(t, E(7, 0) + 0.5, fps, SPRING.pop);
  const conn = Math.max(0, 1 - Math.abs(t - E(7, 1) - 0.1) * 3);
  const tFly = ramp(t, E(7, 1) + 0.35, E(7, 1) + 0.95, EASE_IN_OUT);

  const caught = copies.filter((c) => c >= 1).length + (tFly >= 1 ? 1 : 0);
  const lastCatch = [...copies.map((_, i) => readAt(i) + 1.0), E(7, 1) + 0.95].filter((x) => t >= x).pop();
  const bump = lastCatch === undefined ? 0 : Math.max(0, 1 - (t - lastCatch) * 5);

  // geometry
  const F = { x: 370, y: 450, w: 340, h: 410 }; // x-ray file (phase A, full size)
  const S = 0.4; // phase B scale, anchored at the top-left content corner
  const ax = 150;
  const ay = 405;
  const gx = (x: number) => mix(x, ax + (x - F.x) * S, shrink);
  const gy = (y: number) => mix(y, ay + (y - F.y) * S, shrink);
  const B = { x: 150, y: 690, w: 780, h: 560 };
  const rowTop = (i: number) => B.y + 62 + 92 + i * 92;
  const sessTop = B.y + 62 + 92 + 3 * 92 + 10;
  const BAG = { x: 690, y: 380, size: 190 };
  const bagMouth: [number, number] = [BAG.x + BAG.size / 2, BAG.y + 70];

  // thief: big inside the file, then a small reader next to the password rows
  const reading = ROWS.findIndex((_, i) => t < readAt(i) + 0.5);
  const rowI = reading === -1 ? 2 : reading;
  const thiefSmallY = t > E(7, 0) - 0.3 ? sessTop - 10 : rowTop(rowI) - 14;
  const thX = mix(gx(F.x + F.w / 2 - 115), B.x + B.w - 128, jump);
  const thY = mix(gy(F.y + F.h / 2 - 100), thiefSmallY, jump);
  const thSize = mix(mix(230, 230 * S, shrink), 96, jump);

  return (
    <>
      {/* ---- the file under x-ray ---- */}
      <div style={{ position: 'absolute', left: gx(F.x), top: gy(F.y), width: F.w, height: F.h, transformOrigin: '0 0', scale: `${mix(1, S, shrink)}`, opacity: xray }}>
        <svg width={F.w} height={F.h} viewBox={`0 0 ${F.w} ${F.h}`} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <path d={`M4 4 H${F.w - 70} L${F.w - 4} 70 V${F.h - 4} H4 Z`} fill="rgba(129,225,200,0.08)" stroke={D.marker} strokeWidth={4} strokeDasharray="14 8" />
          <path d={`M${F.w - 70} 4 V70 H${F.w - 4}`} fill="none" stroke={D.marker} strokeWidth={4} />
          {[1, 2, 3, 4].map((k) => (
            <path key={k} d={`M14 ${k * (F.h / 5)} H${F.w - 14}`} stroke="rgba(129,225,200,0.15)" strokeWidth={2} />
          ))}
        </svg>
        <div style={{ position: 'absolute', left: 14, top: -44 }}>
          <Mono size={22} color={D.marker} weight={800}>
            GTA6_Setup.exe · X-RAY
          </Mono>
        </div>
        {/* the game you expected: crossed and gone */}
        <div style={{ position: 'absolute', left: F.w / 2 - 70, top: 80, opacity: Math.min(1, game * 3) * (1 - gameOut), scale: `${0.6 + 0.4 * game}` }}>
          <Controller size={140} color={D.text} />
          <svg width={140} height={100} viewBox="0 0 140 100" style={{ position: 'absolute', left: 0, top: -10, overflow: 'visible' }}>
            <path d={`M10 10 L${10 + 120 * gameX} ${10 + 80 * gameX}`} stroke={A.red} strokeWidth={10} strokeLinecap="round" />
            <path d={`M130 10 L${130 - 120 * gameX} ${10 + 80 * gameX}`} stroke={A.red} strokeWidth={10} strokeLinecap="round" />
          </svg>
        </div>
        {/* scan line sweeping the file */}
        {xray > 0 && <div style={{ position: 'absolute', left: 6, right: 6, top: 10 + ((t * 0.9) % 1) * (F.h - 20), height: 4, background: '#9BE7FF', boxShadow: '0 0 16px 4px rgba(120,210,255,0.6)', opacity: 0.7 * (1 - shrink) }} />}
      </div>

      <TermLabel term="INFOSTEALER" gloss="يعني سارق" p={term * (1 - shrink)} mode="dark" size={52} style={{ left: 540, top: 905, translate: '-50% 0px', scale: `${(0.7 + 0.3 * term) * (1 + gloss * 0.08)}` }} />
      <div style={{ position: 'absolute', left: ax + 2, top: ay + F.h * S + 14, opacity: shrink }}>
        <Mono size={20} color={A.red} weight={800}>
          INFOSTEALER
        </Mono>
      </div>

      {/* double-click on the file */}
      {click > 0 && (
        <div style={{ position: 'absolute', left: ax + 70, top: ay + 90 }}>
          <div style={{ position: 'absolute', left: -34, top: -34, width: 68, height: 68, borderRadius: 99, border: `4px solid ${D.text}`, opacity: click, scale: `${1.8 - click}` }} />
          <CursorIcon size={70} fill="#FFFFFF" stroke={3.2} />
        </div>
      )}

      {/* ---- YOUR browser: saved passwords ---- */}
      <BrowserCard width={B.w} height={B.h} url="your browser · settings · passwords" style={{ left: B.x, top: B.y, opacity: Math.min(1, browser * 3), translate: `0px ${(1 - Math.min(1, browser)) * 120}px` }}>
        <div dir="rtl" style={{ position: 'absolute', left: 26, right: 26, top: 18, height: 64, display: 'flex', alignItems: 'center', gap: 14 }}>
          <LockIcon size={44} color={L.ink} />
          <span style={{ fontFamily: arabic, fontWeight: 800, fontSize: 46, color: L.ink, paddingTop: 6 }}>الـpasswords اللي سجلتهم</span>
        </div>
      </BrowserCard>
      {browser > 0.01 &&
        ROWS.map((r, i) => {
          const read = reads[i];
          const active = t >= readAt(i) - 0.1 && t < readAt(i) + 0.6;
          return (
            <div
              key={r.site}
              dir="ltr"
              style={{
                position: 'absolute',
                left: B.x + 24,
                top: rowTop(i),
                width: B.w - 48 - 130,
                height: 78,
                borderRadius: 14,
                border: `${active ? 3.5 : 2.5}px solid ${read > 0.5 ? A.red : L.ink}`,
                background: active ? '#FFF6D6' : '#F6F6F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 22px',
                boxSizing: 'border-box',
                opacity: Math.min(1, browser * 3),
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Mono size={22} color={L.ink} weight={800} style={{ textTransform: 'none' }}>
                  {r.site}
                </Mono>
                <Mono size={16} color={L.mono} style={{ textTransform: 'none' }}>
                  {r.user}
                </Mono>
              </div>
              <span style={{ fontFamily: display, fontWeight: 900, fontSize: read > 0.5 ? 34 : 30, color: read > 0.5 ? A.red : L.ink, letterSpacing: read > 0.5 ? '0.01em' : '0.08em' }}>{read > 0.5 ? r.pw : '●●●●●●●●'}</span>
            </div>
          );
        })}
      {/* the logged-in site: its cookie keeps you connecté */}
      {browser > 0.01 && (
        <div
          dir="ltr"
          style={{
            position: 'absolute',
            left: B.x + 24,
            top: sessTop,
            width: B.w - 48 - 130,
            height: 88,
            borderRadius: 14,
            border: `${sessHl > 0.5 ? 3.5 : 2.5}px solid ${sessHl > 0.5 ? A.red : L.ink}`,
            background: sessHl > 0.5 ? '#FFF6D6' : '#EEF6F1',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '0 22px',
            boxSizing: 'border-box',
            opacity: Math.min(1, browser * 3),
          }}
        >
          <div style={{ width: 52, height: 52, borderRadius: 99, background: '#DCE1F6', border: `3px solid ${L.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserGlyph size={34} />
          </div>
          <Mono size={22} color={L.ink} weight={800} style={{ textTransform: 'none' }}>
            social.site
          </Mono>
          <div style={{ flex: 1 }} />
          <div style={{ padding: '8px 16px', borderRadius: 999, background: A.green, border: `2.5px solid ${L.ink}`, scale: `${1 + conn * 0.15}` }}>
            <Mono size={20} color="#FFFFFF" weight={800}>
              CONNECTÉ ✓
            </Mono>
          </div>
        </div>
      )}

      {/* copies of each password fly into the bag */}
      {ROWS.map((r, i) => {
        const c = copies[i];
        if (c <= 0 || c >= 1) return null;
        const [px, py] = quadPoint([B.x + B.w - 290, rowTop(i) + 20], [B.x + B.w - 60, rowTop(i) - 260], bagMouth, c);
        return (
          <div key={i} style={{ position: 'absolute', left: px - 80, top: py - 26, padding: '8px 14px', borderRadius: 12, background: L.surface, border: `3px solid ${A.red}`, scale: `${1 - c * 0.5}`, boxShadow: theme.shadow.card }}>
            <span style={{ fontFamily: display, fontWeight: 900, fontSize: 28, color: A.red }}>{r.pw}</span>
          </div>
        );
      })}

      {/* the cookie ticket: تذكرة الدخول */}
      {(() => {
        const start: [number, number] = [B.x + 300, sessTop - 40];
        const [px, py] = quadPoint(start, [560, 520], bagMouth, tFly);
        if (ticket <= 0.001 || tFly >= 1) return null;
        return (
          <div style={{ position: 'absolute', left: px - 110, top: py - 50, opacity: Math.min(1, ticket * 3), scale: `${(0.5 + 0.5 * Math.min(1, ticket)) * (1 - tFly * 0.55)}`, rotate: `${mix(-6, 20, tFly)}deg` }}>
            <TicketChip id="77X9" kicker="COOKIE" width={220} glow={0.6} mode="dark" style={{ position: 'relative' }} />
            <StickerPill text="تذكرة الدخول" tone="yellow" p={ticketGloss * (1 - tFly)} rotate={-5} size={34} style={{ left: 20, top: 110 }} />
          </div>
        );
      })()}

      {/* the thief's bag */}
      <LootBag size={BAG.size} fill={caught / 4} bump={bump} p={bag} style={{ left: BAG.x, top: BAG.y }}>
        <div dir="rtl" style={{ fontFamily: arabic, fontWeight: 800, fontSize: 34, color: D.text, lineHeight: 1 }}>
          عند السارق
        </div>
        <Mono size={18} color={A.red} weight={800}>
          {`STOLEN · ${caught}`}
        </Mono>
      </LootBag>
      {/* ---- what is inside: a thief ---- */}
      <div style={{ position: 'absolute', left: thX, top: thY, opacity: Math.min(1, thiefIn * 3), scale: `${(0.4 + 0.6 * Math.min(1, thiefIn))}`, transformOrigin: '50% 50%' }}>
        <ThiefGlyph size={thSize} />
        {jump > 0.9 && (
          <div style={{ position: 'absolute', left: -46, top: 34, rotate: '-20deg' }}>
            <SearchIcon size={70} color={L.ink} stroke={4.5} />
          </div>
        )}
      </div>

    </>
  );
};
