import React from 'react';
import { AtmGlyph, AtmMock, CallGlyph, ImageCard, ShieldGlyph } from '../../../components/Banking';
import { StickerPill } from '../../../components/Labels';
import { MiniRow, MiniUI } from '../../../components/MiniUI';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';

const L = theme.light;

const UI = { x: 165, y: 430, w: 750 };
// MiniUI: padding 26 top, title row ~44 + margin 20, rows 112 + gap 14
const rowY = (i: number) => UI.y + 26 + 44 + 20 + i * 126 + 56;
const iconX = UI.x + UI.w - 28 - 24 - 33;

/**
 * Scene 7, save frame: "إذا صرالك" checklist. The GAB (drawn ATM) and the gendarmerie photo each enter big,
 * then shrink into their row; 1530 pops in between. The complete list holds still at the end.
 */
export const Scene07RecoveryChecklist: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  const card = pop(t, e(0), fps, SPRING.soft);
  const atm = pop(t, e(1), fps, SPRING.soft);
  const atmGo = ramp(t, e(2) - 0.45, e(2), EASE_IN_OUT);
  const row1 = pop(t, e(2) - 0.1, fps, SPRING.pop);
  const row2 = pop(t, e(3), fps, SPRING.pop);
  const gen = pop(t, e(4), fps, SPRING.soft);
  const genGo = ramp(t, e(5) - 0.35, e(5), EASE_IN_OUT);
  const row3 = pop(t, e(5) - 0.1, fps, SPRING.pop);
  const dim = Math.max(Math.min(1, atm) * (1 - atmGo), Math.min(1, gen) * (1 - genGo));

  // big -> row icon
  const ATM_W = 400;
  const atmH = ATM_W * (620 / 460);
  const atmC: [number, number] = [mix(540, iconX, atmGo), mix(860, rowY(0), atmGo)];
  const atmS = mix(1, 66 / ATM_W, atmGo);
  const GEN = { w: 680, h: 453 };
  const genC: [number, number] = [mix(540, iconX, genGo), mix(900, rowY(2), genGo)];
  const genS = mix(1, 66 / GEN.w, genGo);

  return (
    <>
      <MiniUI title="إذا صرالك" label="IF IT HAPPENS · 3 STEPS" width={UI.w} p={card} style={{ left: UI.x, top: UI.y }}>
        <MiniRow icon={<AtmGlyph size={44} />} text="بدّل الرقم في GAB" tag="1" p={row1} />
        <MiniRow icon={<CallGlyph size={44} fill="#C8EBD9" />} text="عيّط لـ 1530" tag="2" p={row2} highlighted={row2 > 0.5 && t < e(4) ? 1 : 0} />
        <MiniRow icon={<ShieldGlyph size={44} fill="#DCE1F6" />} text="شكوى: شرطة / درك" tag="3" p={row3} />
      </MiniUI>

      <div style={{ position: 'absolute', inset: 0, background: L.ink, opacity: 0.22 * dim }} />

      {atm > 0.001 && atmGo < 1 && (
        <div style={{ position: 'absolute', left: atmC[0] - ATM_W / 2, top: atmC[1] - atmH / 2, width: ATM_W, height: atmH, scale: `${atmS}`, opacity: 1 - ramp(t, e(2) - 0.12, e(2)) }}>
          <AtmMock width={ATM_W} label="GAB" screenText="تبديل رقم الهاتف" p={atm} style={{ left: 0, top: 0 }} />
          <StickerPill text="أقرب GAB" tone="yellow" p={atm * (1 - atmGo)} rotate={-6} size={44} style={{ left: -60, top: -30 }} />
        </div>
      )}
      {gen > 0.001 && genGo < 1 && (
        <div style={{ position: 'absolute', left: genC[0] - GEN.w / 2, top: genC[1] - GEN.h / 2, width: GEN.w, height: GEN.h, scale: `${genS}`, opacity: 1 - ramp(t, e(5) - 0.12, e(5)) }}>
          <ImageCard
            src="baridimob-scams/images/gendarmerie.jpg"
            natural={{ w: 1280, h: 854 }}
            width={GEN.w}
            height={GEN.h}
            p={gen}
            push={ramp(t, e(4), e(5))}
            tilt={1.5}
            blur={[{ x: 870, y: 550, w: 90, h: 60 }]}
            credit="PHOTO: BERNARD GAGNON · CC BY 4.0"
            style={{ left: 0, top: 0 }}
          />
          <StickerPill text="شكوى" tone="red" p={gen * (1 - genGo)} rotate={-5} size={52} style={{ left: -30, top: -34 }} />
        </div>
      )}
    </>
  );
};
