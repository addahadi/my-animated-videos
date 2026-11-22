import React from 'react';
import { DeviceMock } from '../../../components/Device';
import { ChargeTank, PowerMeter, SpeedBar, SpeedDial, TapInset } from '../../../components/Hardware';
import { ArText, Mono, StickerPill } from '../../../components/Labels';
import { TermLabel } from '../../../components/Web';
import { arabic, display } from '../../../fonts';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';
import { HomeTiles } from './parts';

const D = theme.dark;

const METER = { x: 640, y: 470, w: 150, h: 380 };

/** Scene 6 (hardest idea): charge and power are two different meters; then the tap analogy. */
export const Scene06BlueprintPower: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);
  const tank = pop(t, e(1), fps, SPRING.soft);
  const charged = pop(t, e(1) + 0.35, fps, SPRING.pop);
  const meter = pop(t, e(2), fps, SPRING.soft);
  const supply = ramp(t, e(2) + 0.1, e(2) + 0.8, EASE_IN_OUT);
  const need = pop(t, e(3), fps, SPRING.pop);
  const gap = ramp(t, e(3) + 0.25, e(3) + 0.7, EASE_IN_OUT);
  const neq = pop(t, e(3) + 0.5, fps, SPRING.pop);
  const tap = pop(t, e(4), fps, SPRING.soft);
  const water = ramp(t, e(5), e(5) + 0.4);
  const open = ramp(t, e(6), e(6) + 0.55, EASE_IN_OUT);
  const needFlow = ramp(t, e(6) + 0.2, e(6) + 0.6);
  const notEnough = pop(t, e(7), fps, SPRING.pop);
  return (
    <>
      <ChargeTank width={220} height={METER.h} level={0.8 * Math.min(1, tank)} p={tank} style={{ left: 205, top: METER.y }} />
      <div style={{ position: 'absolute', left: 205, top: METER.y + METER.h + 54, width: 220, display: 'flex', justifyContent: 'center', opacity: Math.min(1, charged * 3) }}>
        <ArText size={44} color={D.marker}>
          مشحونة ✓
        </ArText>
      </div>
      <div style={{ position: 'absolute', left: 470, top: 600, fontFamily: display, fontWeight: 900, fontSize: 110, color: D.delta, opacity: Math.min(1, neq * 3), scale: `${0.5 + 0.5 * neq}`, textShadow: `0 0 20px ${D.delta}` }}>≠</div>
      <PowerMeter width={METER.w} height={METER.h} supply={0.5 * supply} needed={0.9} neededP={need} gapP={gap} p={meter} style={{ left: METER.x, top: METER.y }} />

      <TapInset p={tap} open={open} stream={0} need={needFlow} style={{ left: 190, top: 980 }} />
      <div style={{ position: 'absolute', left: 190, top: 1240, width: 230, display: 'flex', justifyContent: 'center', opacity: water }}>
        <ArText size={36} color={D.text}>
          الماء كاين
        </ArText>
      </div>
      <div style={{ position: 'absolute', left: 700, top: 1110, opacity: needFlow }}>
        <ArText size={36} color={D.delta}>
          دفعة كبيرة
        </ArText>
      </div>
      <div style={{ position: 'absolute', left: 700, top: 1170, opacity: Math.min(1, notEnough * 3), scale: `${0.6 + 0.4 * notEnough}` }}>
        <Mono size={24} color={D.delta} weight={800}>
          NOT ENOUGH
        </Mono>
      </div>
    </>
  );
};

/** Scene 7: demand above supply -> shutdown risk. The fix: lower CPU speed until demand fits. Slower, but on. */
export const Scene07BlueprintThrottle: React.FC<SceneProps> = ({ events }) => {
  const { t, fps, startSec } = useClock();
  const e = (i: number) => evAt(events, i);
  const enter = pop(t, startSec + 0.05, fps, SPRING.soft);
  const warn = t >= e(1) && t < e(6) ? (Math.sin((t - e(1)) * 14) > 0 ? 1 : 0) : 0;
  const off = t >= e(2) && t < e(2) + 0.9 ? 1 - ramp(t, e(2) + 0.6, e(2) + 0.9) : 0;
  const q = pop(t, e(3), fps, SPRING.pop) * (1 - ramp(t, e(4) - 0.1, e(4) + 0.2));
  const dial = pop(t, e(4) - 0.15, fps, SPRING.soft);
  const slow = ramp(t, e(4) + 0.1, e(4) + 0.9, EASE_IN_OUT);
  const term = pop(t, e(5), fps, SPRING.pop);
  const fit = ramp(t, e(6), e(6) + 0.6, EASE_IN_OUT);
  const less = pop(t, e(7), fps, SPRING.pop);
  const slower = pop(t, e(8), fps, SPRING.pop);
  const on = pop(t, e(9), fps, SPRING.pop);
  const needed = mix(0.9, 0.42, fit);
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, opacity: Math.min(1, enter * 3) }}>
        <PowerMeter width={150} height={380} supply={0.5} needed={needed} gapP={1 - fit} warn={warn} style={{ left: 300, top: 470 }} />
        <DeviceMock width={240} height={440} style={{ left: 640, top: 480 }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 50 }}>
            <SpeedBar width={180} value={mix(1, 0.7, slow)} label="CPU" style={{ left: 18, top: 0 }} />
          </div>
          <HomeTiles w={214} top={130} />
          <div style={{ position: 'absolute', inset: 0, background: '#07090C', opacity: off }} />
        </DeviceMock>
      </div>
      <div style={{ position: 'absolute', left: 540, top: 1000, translate: '-50% 0px', fontFamily: arabic, fontWeight: 900, fontSize: 170, color: D.text, opacity: Math.min(1, q * 3), lineHeight: 1 }}>؟</div>
      <SpeedDial size={330} value={mix(1, 0.7, slow)} p={dial} label="CPU SPEED" style={{ left: 540 - 165, top: 980 }} />
      <TermLabel term="CPU" gloss="المعالج" p={term} mode="dark" size={40} style={{ left: 180, top: 1000 }} />
      <StickerPill text="يستهلك أقل" tone="green" p={less} rotate={-4} size={36} style={{ left: 230, top: 912 }} />
      <StickerPill text="أبطأ" tone="red" p={slower} rotate={5} size={40} style={{ left: 740, top: 1090 }} />
      <StickerPill text="ON" tone="green" p={on} rotate={-6} size={36} style={{ left: 790, top: 440 }} />
    </>
  );
};
