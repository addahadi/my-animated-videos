import React from 'react';
import { AdCard, DeviceMock, PhoneFeed } from '../../../components/Device';
import { DrawPath, quadPoint } from '../../../components/Diagram';
import { SearchIcon, WifiIcon } from '../../../components/Icons';
import { Mono, StickerPill } from '../../../components/Labels';
import { display } from '../../../fonts';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';

const L = theme.light;
const A = theme.accent;

const F = { x: 195, y: 690, w: 240, h: 500 }; // friend
const Y = { x: 645, y: 690, w: 240, h: 500 }; // you
const WIFI: [number, number] = [540, 590];
const WORD = 'shoes';

/** Clue 2: same WiFi. The friend searches, one network = one "home", the interest copies to you. */
export const Scene09Wifi: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  const phones = pop(t, e(0) - 0.1, fps, SPRING.soft);
  const lift = ramp(t, e(0) + 0.3, e(0) + 0.7, EASE_IN_OUT);
  const typed = Math.floor(ramp(t, e(1), e(1) + 0.75, (x) => x) * WORD.length + 0.001);
  const results = pop(t, e(1) + 1.0, fps, SPRING.soft);
  const wifi = pop(t, e(2), fps, SPRING.pop);
  const lines = ramp(t, e(2) + 0.2, e(2) + 0.7, EASE_IN_OUT);
  const simple = pop(t, e(3), fps, SPRING.pop);
  const house = ramp(t, e(4), e(4) + 1.4, EASE_IN_OUT);
  const tag = pop(t, e(5), fps, SPRING.pop);
  const fly = ramp(t, e(5) + 0.3, e(5) + 0.95, EASE_IN_OUT);
  const landed = ramp(t, e(5) + 0.9, e(5) + 1.2);
  const caret = Math.floor(t * 3) % 2 === 0;

  const inner = F.w - 2 * Math.max(8, F.w * 0.035) - 4;

  // signal dots travelling from the router to both phones
  const dots = [];
  if (lines >= 1) {
    for (let k = 0; k < 6; k++) {
      const u = ((t - e(2)) * 0.9 + k / 6) % 1;
      for (const target of [F, Y]) {
        const tx = target.x + target.w / 2;
        const [x, y] = quadPoint([WIFI[0], WIFI[1] + 40], [(WIFI[0] + tx) / 2, WIFI[1] + 20], [tx, target.y - 10], u);
        dots.push(<div key={`${k}${target.x}`} style={{ position: 'absolute', left: x - 6, top: y - 6, width: 12, height: 12, borderRadius: 99, background: A.blue, opacity: Math.sin(u * Math.PI) }} />);
      }
    }
  }

  const [fx, fy] = quadPoint([F.x + F.w / 2, F.y - 30], [540, 470], [Y.x + Y.w / 2, Y.y - 30], fly);

  return (
    <>
      {/* house outline around both phones */}
      <DrawPath d="M 175 660 L 540 455 L 905 660 M 200 645 L 200 1268 L 880 1268 L 880 645" p={house} dashed color={L.ink} width={7} opacity={0.85} />

      {/* router */}
      <div style={{ position: 'absolute', left: WIFI[0] - 60, top: WIFI[1] - 60, width: 120, height: 120, borderRadius: 999, background: L.surface, border: `3px solid ${L.ink}`, boxShadow: theme.shadow.card, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, wifi * 3), scale: `${0.4 + 0.6 * wifi}` }}>
        <WifiIcon size={78} level={1 + (Math.floor(t * 3) % 3)} color={A.blue} stroke={4} />
      </div>
      <DrawPath d={`M ${WIFI[0]} ${WIFI[1] + 40} Q ${(WIFI[0] + F.x + F.w / 2) / 2} ${WIFI[1] + 20} ${F.x + F.w / 2} ${F.y - 10}`} p={lines} color={A.blue} width={4} opacity={0.6} />
      <DrawPath d={`M ${WIFI[0]} ${WIFI[1] + 40} Q ${(WIFI[0] + Y.x + Y.w / 2) / 2} ${WIFI[1] + 20} ${Y.x + Y.w / 2} ${Y.y - 10}`} p={lines} color={A.blue} width={4} opacity={0.6} />
      {dots}

      {/* friend's phone: searching */}
      <DeviceMock width={F.w} height={F.h} style={{ left: F.x, top: F.y - lift * 16, opacity: Math.min(1, phones * 3), translate: `${(1 - Math.min(phones, 1)) * -100}px 0px`, rotate: `${-2 - lift}deg` }}>
        <div style={{ position: 'absolute', left: 12, right: 12, top: 52, height: 48, borderRadius: 99, background: '#FFFFFF', border: `2.5px solid ${L.ink}`, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px' }}>
          <SearchIcon size={24} />
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: L.ink }}>
            {WORD.slice(0, typed)}
            <span style={{ opacity: caret && t > e(1) - 0.3 && typed < WORD.length + 1 ? 1 : 0 }}>|</span>
          </span>
        </div>
        <div style={{ position: 'absolute', inset: 0, top: 60, opacity: Math.min(1, results * 3) }}>
          <PhoneFeed width={inner} items={[{ kind: 'shoe', variant: 1 }, { kind: 'shoe', variant: 2 }, { kind: 'shoe', variant: 0 }]} top={56} gap={10} appear={(i) => pop(t, e(1) + 1.0 + i * 0.12, fps, SPRING.soft)} />
        </div>
      </DeviceMock>

      {/* your phone: an ordinary feed until the interest lands */}
      <DeviceMock width={Y.w} height={Y.h} style={{ left: Y.x, top: Y.y, opacity: Math.min(1, phones * 3), translate: `${(1 - Math.min(phones, 1)) * 100}px 0px`, rotate: '2deg' }}>
        <PhoneFeed width={inner} items={[{ kind: 'headphones' }, { kind: 'watch' }, { kind: 'bag' }, { kind: 'headphones' }]} top={58 + landed * 92} gap={10} />
        {landed > 0 && (
          <AdCard width={inner - 28} kind="shoe" variant={2} highlight={landed} style={{ left: 14, top: 58, opacity: landed, scale: `${0.8 + 0.2 * landed}` }} />
        )}
      </DeviceMock>

      <div style={{ position: 'absolute', left: F.x + F.w / 2, top: F.y + F.h + 22, translate: '-50% 0px', opacity: Math.min(1, phones * 3) }}>
        <Mono size={24} color={L.ink} weight={800}>FRIEND</Mono>
      </div>
      <div style={{ position: 'absolute', left: Y.x + Y.w / 2, top: Y.y + Y.h + 22, translate: '-50% 0px', opacity: Math.min(1, phones * 3) }}>
        <Mono size={24} color={L.ink} weight={800}>YOU</Mono>
      </div>

      <StickerPill text="بشكل مبسط" tone="ink" p={simple} rotate={-6} size={26} style={{ left: 540, top: 990, translate: '-50% 0px', zIndex: 3 }} />

      {/* interest tag: pops on the friend's phone, then a copy flies to yours */}
      <StickerPill text="SHOES" tone="yellow" p={tag} rotate={-6} size={28} style={{ left: F.x + 40, top: F.y - 60 }} />
      {fly > 0 && fly < 1 && <StickerPill text="SHOES" tone="yellow" p={1} rotate={mix(-6, 6, fly)} size={28} style={{ left: fx - 70, top: fy - 26, scale: `${1 + Math.sin(fly * Math.PI) * 0.15}` }} />}
      {fly >= 1 && <StickerPill text="SHOES" tone="yellow" p={1} rotate={5} size={28} style={{ left: Y.x + 50, top: Y.y - 60 }} />}
    </>
  );
};
