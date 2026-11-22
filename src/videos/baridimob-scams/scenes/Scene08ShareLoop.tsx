import React from 'react';
import { ChoiceButton, CodeChip, SendGlyph } from '../../../components/Banking';
import { ArText } from '../../../components/Labels';
import { display } from '../../../fonts';
import { mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN, EASE_IN_OUT, EASE_OUT, SPRING, theme } from '../../../theme';
import { BALANCE, E, HOOK_PHONE, WalletPhone } from './parts';

const L = theme.light;
const A = theme.accent;

/**
 * Scene 8: share beat ("ابعثو لماماك وباباك" + send icon), the comment question with إيه / لا buttons,
 * then the loop shot: the phone returns to the hook spot, the code goes back in, the balance counts back up.
 */
export const Scene08ShareLoop: React.FC<SceneProps> = () => {
  const { t, fps } = useClock();
  const e = (i: number) => E(8, i);

  const send = pop(t, e(0), fps, SPRING.pop);
  const fly = t > e(0) + 0.6 ? Math.sin((t - e(0)) * 3) * 8 : 0;
  const shareText = ramp(t, e(0) + 0.1, e(0) + 0.45);
  const sub = ramp(t, e(1) - 1.0, e(1) - 0.7); // "باش ما يطيحوش فيها"
  const shareOut = ramp(t, e(1) - 0.25, e(1), EASE_IN);
  const you = pop(t, e(1), fps, SPRING.pop);
  const q = ramp(t, e(1) + 0.6, e(1) + 0.9);
  const btn = [pop(t, e(1) + 0.75, fps, SPRING.pop), pop(t, e(1) + 0.9, fps, SPRING.pop)]; // with the question, held into "إيه ولا لا"
  const qOut = ramp(t, e(2) - 0.05, e(2) + 0.15, EASE_IN);
  const phone = ramp(t, e(2), e(2) + 0.3, EASE_OUT);
  const back = ramp(t, e(2), e(2) + 0.4, EASE_IN_OUT);
  const count = ramp(t, e(2) + 0.15, e(2) + 0.65, EASE_OUT);
  const mark = ramp(t, e(2) + 0.25, e(2) + 0.5);

  const P = HOOK_PHONE;
  return (
    <>
      {/* share */}
      <div style={{ opacity: 1 - shareOut }}>
        <div style={{ position: 'absolute', left: 540 - 140, top: 470, width: 280, height: 280, borderRadius: 999, background: A.yellow, border: `4px solid ${L.ink}`, boxShadow: theme.shadow.lift, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, send * 3), scale: `${0.5 + 0.5 * send}` }}>
          <SendGlyph size={150} fill="#FFFFFF" style={{ translate: `${fly}px ${-fly}px` }} />
        </div>
        <ArText size={86} weight={900} style={{ position: 'absolute', left: 0, right: 0, top: 820, textAlign: 'center', opacity: shareText, translate: `0px ${(1 - shareText) * 30}px` }}>
          ابعثو لماماك وباباك
        </ArText>
        <ArText size={52} color={L.inkSoft} style={{ position: 'absolute', left: 0, right: 0, top: 950, textAlign: 'center', opacity: sub }}>
          باش ما يطيحوش فيها
        </ArText>
      </div>

      {/* comment question */}
      <div style={{ opacity: 1 - qOut }}>
        <ArText size={110} weight={900} style={{ position: 'absolute', left: 0, right: 0, top: 500, textAlign: 'center', opacity: Math.min(1, you * 3), scale: `${0.6 + 0.4 * you}` }}>
          وانت؟
        </ArText>
        <ArText size={66} style={{ position: 'absolute', left: 0, right: 0, top: 680, textAlign: 'center', opacity: q }}>
          وصلتك رسالة كيما هاذي؟
        </ArText>
        <ChoiceButton text="إيه" tone="green" p={btn[0]} style={{ left: 570, top: 880, rotate: '-3deg' }} />
        <ChoiceButton text="لا" tone="red" p={btn[1]} style={{ left: 250, top: 880, rotate: '3deg' }} />
      </div>

      {/* loop: back to frame 1, but the money stays */}
      {phone > 0 && (
        <>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 318, textAlign: 'center', opacity: mark }}>
            <span style={{ fontFamily: display, fontWeight: 900, fontSize: 66, color: L.ink }}>Runtime.tech</span>
          </div>
          <WalletPhone w={P.w} h={P.h} balance={mix(0, BALANCE, count)} style={{ left: P.x, top: P.y + (1 - phone) * 500, opacity: Math.min(1, phone * 2) }} />
          <CodeChip p={1 - ramp(t, e(2) + 0.35, e(2) + 0.45)} size={0.9} glow={0.6} style={{ left: mix(880, P.x + P.w / 2, back), top: mix(1250, P.y + 420, back), translate: '-50% -50%' }} />
        </>
      )}
    </>
  );
};
