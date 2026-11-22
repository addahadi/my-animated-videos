import React from 'react';
import { Mono, StickerPill } from '../../../components/Labels';
import { LoginGate, ThiefGlyph } from '../../../components/Scam';
import { TicketChip, UserGlyph } from '../../../components/Web';
import { arabic, display } from '../../../fonts';
import { mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';
import { E } from './parts';

const L = theme.light;
const A = theme.accent;

/**
 * Hardest idea: the thief holds the yellow cookie ticket up to a login gate; the password field
 * is struck out, the gate opens for the ticket alone (WELCOME BACK), then a generic profile card
 * (invented name, no platform logo) flips to show the thief behind your avatar. Footnote: * ماشي ديما.
 */
export const Scene08CookieEntry: React.FC<SceneProps> = () => {
  const { t, fps } = useClock();
  const e = (i: number) => E(8, i);

  const gate = pop(t, e(0) - 0.1, fps, SPRING.soft);
  const thief = pop(t, e(0), fps, SPRING.pop);
  const strike = ramp(t, e(1), e(1) + 0.35);
  const insert = ramp(t, e(2) - 0.55, e(2) + 0.05, EASE_IN_OUT);
  const open = ramp(t, e(2), e(2) + 0.3);
  const shift = ramp(t, e(3) - 0.2, e(3) + 0.4, EASE_IN_OUT);
  const prof = pop(t, e(3), fps, SPRING.soft);
  const flip = ramp(t, e(4) - 0.1, e(4) + 0.45, EASE_IN_OUT);
  const note = pop(t, e(4) + 0.3, fps, SPRING.pop);
  const noPw = pop(t, e(1) + 0.1, fps, SPRING.pop);

  // gate moves up and shrinks once the profile arrives
  const gx = mix(300, 340, shift);
  const gy = mix(430, 410, shift);
  const gs = mix(1, 0.72, shift);

  // ticket: held by the thief, then slides into the gate's button
  const tx = mix(150, 470, insert);
  const ty = mix(930, 760, insert);

  const flipped = flip > 0.5;
  const faceScale = Math.abs(Math.cos(flip * Math.PI));

  return (
    <>
      <div style={{ position: 'absolute', left: gx, top: gy, transformOrigin: '50% 0%', scale: `${gs}` }}>
        <LoginGate width={480} strike={strike} open={open} p={gate} account="SOCIAL ACCOUNT" style={{ position: 'relative' }} />
      </div>
      <StickerPill text="بلا password" tone="red" p={noPw * (1 - shift)} rotate={-6} size={40} style={{ left: 560, top: 870 }} />

      {/* thief + ticket */}
      <div style={{ position: 'absolute', left: mix(110, 120, insert), top: mix(1000, 980, insert), opacity: Math.min(1, thief * 3) * (1 - shift), scale: `${0.5 + 0.5 * Math.min(1, thief)}` }}>
        <ThiefGlyph size={140} />
      </div>
      <div style={{ position: 'absolute', left: tx, top: ty, opacity: Math.min(1, thief * 3) * (1 - ramp(t, e(2) + 0.1, e(2) + 0.35)), rotate: `${mix(-8, 0, insert)}deg`, scale: `${mix(1, 0.6, insert)}` }}>
        <TicketChip id="77X9" kicker="COOKIE" width={230} glow={0.5} style={{ position: 'relative' }} />
      </div>

      {/* profile card that flips */}
      <div
        style={{
          position: 'absolute',
          left: 190,
          top: 820,
          width: 700,
          height: 300,
          opacity: Math.min(1, prof * 3),
          translate: `0px ${(1 - Math.min(1, prof)) * 80}px`,
          scale: `${faceScale * 0.98 + 0.02} 1`,
        }}
      >
        <div
          dir="rtl"
          style={{
            position: 'absolute',
            inset: 0,
            background: L.surface,
            border: `3px solid ${flipped ? A.red : L.ink}`,
            borderRadius: theme.radius.card,
            boxShadow: theme.shadow.lift,
            display: 'flex',
            alignItems: 'center',
            gap: 30,
            padding: '0 40px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ position: 'relative', width: 170, height: 170, flexShrink: 0 }}>
            {flipped && (
              <div style={{ position: 'absolute', left: 90, top: -56 }}>
                <ThiefGlyph size={130} />
              </div>
            )}
            <div style={{ position: 'absolute', inset: 0, borderRadius: 99, background: '#DCE1F6', border: `4px solid ${L.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserGlyph size={110} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontFamily: arabic, fontWeight: 800, fontSize: 58, color: L.ink, lineHeight: 1.1 }}>نتا</span>
            <span dir="ltr" style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: L.inkSoft }}>
              @you
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 16, height: 16, borderRadius: 99, background: flipped ? A.red : A.green }} />
              <Mono size={20} color={flipped ? A.red : A.green} weight={800}>
                {flipped ? 'ONLINE · NOT YOU' : 'ONLINE'}
              </Mono>
            </div>
          </div>
        </div>
      </div>
      <StickerPill text="كأنو نتا" tone="ink" p={note} rotate={5} size={44} style={{ left: 600, top: 1130 }} />
      <div dir="rtl" style={{ position: 'absolute', left: 0, right: 0, top: 1215, display: 'flex', justifyContent: 'center', opacity: Math.min(1, note * 2) }}>
        <span style={{ fontFamily: arabic, fontWeight: 700, fontSize: 30, color: L.inkSoft }}>* ماشي ديما: بعض المواقع تطلب login من جديد</span>
      </div>
    </>
  );
};
