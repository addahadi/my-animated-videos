import React from 'react';
import { DeviceMock } from '../../../components/Device';
import { NodeBox } from '../../../components/Diagram';
import { NotifCard } from '../../../components/Hardware';
import { BatteryIcon, ClockIcon } from '../../../components/Icons';
import { Mono, SpeechBubble, Stamp, StickerPill, ValueTag } from '../../../components/Labels';
import { PhoneGlyph, UserGlyph } from '../../../components/Web';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';

const L = theme.light;
const A = theme.accent;

const OLD = [
  { x: 205, weak: true },
  { x: 465, weak: false },
  { x: 725, weak: true },
];

/** Scene 4: only some old phones (weak battery) were slowed; then three evidence cards fan in. */
export const Scene04CaseFile: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);
  const phones = OLD.map((_, i) => pop(t, e(1) + i * 0.15, fps, SPRING.soft));
  const weak = ramp(t, e(2), e(2) + 0.5);
  const slowed = pop(t, e(2) + 0.45, fps, SPRING.pop);
  const c1 = pop(t, e(3), fps, SPRING.soft);
  const notTold = pop(t, e(3) + 0.45, fps, SPRING.snappy);
  const c2 = pop(t, e(4), fps, SPRING.soft);
  const fine = pop(t, e(4) + 0.3, fps, SPRING.heavy);
  const c3 = pop(t, e(5), fps, SPRING.soft);
  const dimPhones = ramp(t, e(3), e(3) + 0.4);
  return (
    <>
      {OLD.map((ph, i) => (
        <div key={i} style={{ position: 'absolute', left: ph.x, top: 450, opacity: Math.min(1, phones[i] * 3) * (1 - dimPhones * 0.35), translate: `0px ${(1 - Math.min(phones[i], 1)) * 60}px` }}>
          <DeviceMock width={150} height={270} style={{ left: 0, top: 0 }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BatteryIcon size={90} level={ph.weak ? mix(1, 0.18, weak) : 1} levelColor={ph.weak && weak > 0.5 ? A.red : L.ink} />
            </div>
          </DeviceMock>
          {ph.weak ? (
            <StickerPill text="SLOWED" tone="red" p={slowed} rotate={-6} size={22} style={{ left: 8, top: 236 }} />
          ) : (
            <StickerPill text="OK" tone="ink" p={slowed} rotate={4} size={22} style={{ left: 46, top: 236 }} />
          )}
        </div>
      ))}
      <div style={{ position: 'absolute', left: 175, top: 760 }}>
        <Mono size={20} color={L.mono} weight={800} style={{ opacity: Math.min(1, c1 * 3) }}>
          CASE FILE · 2017–2020
        </Mono>
      </div>
      <NotifCard width={520} category="2017 · DISCLOSURE" headline="ما وضّحتش للناس" p={c1} rotate={-1} icon={<PhoneGlyph size={40} fill="#F4F4F0" />} style={{ left: 175, top: 800 }} />
      <NotifCard width={520} category="FRANCE · 2020" headline="غرامة" p={c2} rotate={1} icon={<ClockIcon size={40} fill="#F4F4F0" />} style={{ left: 195, top: 945 }} />
      <NotifCard width={520} category="USA · 2020" headline="تسويات قضايا" p={c3} rotate={-1.5} icon={<UserGlyph size={40} fill="#F4F4F0" />} style={{ left: 185, top: 1090 }} />
      <Stamp text="NOT TOLD" p={notTold} size={38} rotate={-12} style={{ left: 780, top: 830, translate: '-50% -50%' }} />
      <div style={{ position: 'absolute', left: 812, top: 980, width: 0 }}>
        <ValueTag value="€25M" caption="FINE" p={fine} size={44} string={30} style={{ left: 0, top: 0, translate: '-50% 0px' }} />
      </div>
    </>
  );
};

/** Scene 5: people felt cheated vs the maker's reason; then the real question: what does an old battery do? */
export const Scene05ClaimVsReply: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);
  const people = pop(t, e(0) + 0.05, fps, SPRING.soft);
  const b1 = pop(t, e(1), fps, SPRING.pop);
  const maker = pop(t, e(2) - 0.2, fps, SPRING.soft);
  const b2 = pop(t, e(2), fps, SPRING.pop);
  const blink = t > e(3) && t < e(3) + 0.42 ? 1 : 0;
  const part2 = ramp(t, e(4), e(4) + 0.45, EASE_IN_OUT);
  const bat = pop(t, e(4) + 0.2, fps, SPRING.soft);
  const aged = t >= e(5);
  const ageTag = pop(t, aged ? e(5) : e(4) + 0.4, fps, SPRING.heavy);
  const drain = ramp(t, e(6), e(6) + 0.8, EASE_IN_OUT);
  const fast = pop(t, e(6) + 0.5, fps, SPRING.pop);
  const level = aged ? mix(1, 0.15, drain) : 1;
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - part2, translate: `0px ${part2 * -40}px`, scale: `${1 - part2 * 0.05}` }}>
        {/* people (right, read first in RTL) */}
        <div style={{ position: 'absolute', left: 650, top: 820, display: 'flex', gap: 6, opacity: Math.min(1, people * 3) }}>
          {[0, 1, 2].map((i) => (
            <UserGlyph key={i} size={82} fill="#F4F4F0" />
          ))}
        </div>
        <Mono size={20} color={L.ink} weight={800} style={{ position: 'absolute', left: 700, top: 920, opacity: Math.min(1, people * 3) }}>
          PEOPLE
        </Mono>
        <SpeechBubble text="تخدعنا!" p={b1} tail="right" size={52} style={{ left: 660, top: 670 }} />
        {/* the maker (left) */}
        <NodeBox icon={<PhoneGlyph size={78} fill="#DCE1F6" />} label="PHONE MAKER" width={250} height={210} style={{ left: 175, top: 800, opacity: Math.min(1, maker * 3) }} />
        <SpeechBubble text="باش ما يطفاش فجأة" p={b2} tail="left" size={40} style={{ left: 175, top: 680 }} />
        {/* the phone between them */}
        <DeviceMock width={170} height={300} style={{ left: 455, top: 960 }}>
          <div style={{ position: 'absolute', inset: 0, background: '#07090C', opacity: blink }} />
        </DeviceMock>
      </div>

      {/* part 2: an aging battery */}
      {part2 > 0 && (
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(1, bat * 3), translate: `0px ${(1 - Math.min(bat, 1)) * 60}px` }}>
          <div style={{ position: 'absolute', left: 540, top: 470, translate: '-50% 0px' }}>
            <BatteryIcon size={400} stroke={2} level={level} levelColor={aged ? (level < 0.4 ? A.red : L.inkSoft) : A.green} />
          </div>
          <div style={{ position: 'absolute', left: 540, top: 800, width: 0 }}>
            <ValueTag value={aged ? '2 YEARS' : 'NEW'} caption="BATTERY AGE" p={ageTag} size={54} string={34} style={{ left: 0, top: 0, translate: '-50% 0px' }} />
          </div>
          <StickerPill text="تفرغ بالخف" tone="red" p={fast} rotate={-5} size={44} style={{ left: 560, top: 1060 }} />
        </div>
      )}
    </>
  );
};
