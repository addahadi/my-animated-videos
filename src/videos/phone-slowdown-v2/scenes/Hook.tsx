import React from 'react';
import { CameraView, SpeedBar } from '../../../components/Hardware';
import { LockedChip, Mono, Stamp, StickerPill, ValueTag } from '../../../components/Labels';
import { arabic } from '../../../fonts';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN, EASE_IN_OUT, SPRING, theme } from '../../../theme';
import { HERO, HomeTiles, YourPhone } from './parts';

const L = theme.light;

// the tag hangs from the bottom centre of the hero phone
const TAG_X = HERO.x + HERO.w / 2;
const TAG_Y = HERO.y + HERO.h - 10;

const FineTag: React.FC<{ p: number; flip?: number }> = ({ p, flip = 0 }) => {
  // flip 0..1: at 0.5 the tag is edge-on and swaps to "your phone"
  const yours = flip >= 0.5;
  const sx = Math.abs(Math.cos(flip * Math.PI));
  return (
    <div style={{ position: 'absolute', left: TAG_X, top: TAG_Y, width: 0 }}>
      <ValueTag
        value={yours ? 'YOUR PHONE' : '€25M'}
        caption={yours ? '2 YEARS OLD' : 'FINE · SLOWED PHONES'}
        p={p}
        size={yours ? 44 : 58}
        string={26}
        style={{ left: 0, top: 0, translate: '-50% 0px', scale: `${Math.max(0.02, sx)} 1` }}
      />
    </div>
  );
};

/** Scene 1: a phone with a fine hanging on it. Speed drains, a stamp says they didn't tell. */
export const Scene01HookFine: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);
  const phone = pop(t, -0.18, fps, SPRING.soft); // already moving on frame 0
  const tag = pop(t, e(1), fps, SPRING.heavy);
  const drain = ramp(t, e(2), e(2) + 0.9, EASE_IN_OUT);
  const slowed = pop(t, e(2) + 0.45, fps, SPRING.pop);
  const stamp = pop(t, e(3), fps, SPRING.snappy);
  const speed = mix(0.96, 0.18, drain);
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, opacity: Math.min(1, phone * 2.5), translate: `0px ${(1 - Math.min(phone, 1)) * 170}px` }}>
        <YourPhone>
          <SpeedBar width={HERO.w * 0.76} value={speed} style={{ left: HERO.w * 0.09, top: HERO.w * 0.27 }} />
          <HomeTiles w={HERO.w - 26} top={HERO.w * 0.58} />
        </YourPhone>
      </div>
      <FineTag p={tag} />
      <StickerPill text="SLOWED" tone="red" p={slowed} rotate={6} size={34} style={{ left: 640, top: 500 }} />
      <Stamp text="بلا ما يقولو" p={stamp} size={76} rotate={-11} style={{ left: 540, top: 840, translate: '-50% -50%' }} />
    </>
  );
};

/** Scene 2: "and you?" The tag flips to your phone; the camera loads too slowly and the shot is missed. */
export const Scene02YourCamera: React.FC<SceneProps> = ({ events }) => {
  const { t, fps, startSec } = useClock();
  const e = (i: number) => evAt(events, i);
  const clear = ramp(t, startSec, startSec + 0.3, EASE_IN);
  const flip = ramp(t, e(1), e(1) + 0.45, EASE_IN_OUT);
  const cam = ramp(t, e(2), e(2) + 0.35, EASE_IN_OUT);
  const ballIn = ramp(t, e(3) - 0.2, e(3) + 0.3);
  const ballOut = ramp(t, e(4), e(4) + 0.4, EASE_IN);
  const loaded = ramp(t, e(4) + 0.35, e(4) + 0.6);
  const missed = pop(t, e(4) + 0.5, fps, SPRING.pop);
  const ballX = ballIn <= 0 ? null : mix(0.5, 1.35, ballOut);
  return (
    <>
      <YourPhone>
        <SpeedBar width={HERO.w * 0.76} value={0.18} style={{ left: HERO.w * 0.09, top: HERO.w * 0.27, opacity: 1 - cam }} />
        <HomeTiles w={HERO.w - 26} top={HERO.w * 0.58} />
        {cam > 0 && (
          <div style={{ position: 'absolute', inset: 0, translate: `0px ${(1 - cam) * 100}%` }}>
            <CameraView spin={(t - e(2)) * 300} loaded={Math.max(loaded, ballIn * 0.28 * (1 - ballOut))} subjectX={ballX} />
          </div>
        )}
      </YourPhone>
      <FineTag p={1} flip={flip} />
      {/* scene-1 labels leave */}
      <StickerPill text="SLOWED" tone="red" p={1} rotate={6} size={34} style={{ left: 640, top: 500, opacity: 1 - clear }} />
      <Stamp text="بلا ما يقولو" p={1} size={76} rotate={-11} style={{ left: 540, top: 840 + clear * 120, translate: '-50% -50%', opacity: 0.92 * (1 - clear) }} />
      <StickerPill text="MISSED" tone="red" p={missed} rotate={-6} size={36} style={{ left: 600, top: 520 }} />
    </>
  );
};

/** Scene 3: the open loop. A locked verdict; then "let's start with 2017". */
export const Scene03VerdictLocked: React.FC<SceneProps> = ({ events }) => {
  const { t, fps, startSec } = useClock();
  const e = (i: number) => evAt(events, i);
  const missedOut = ramp(t, startSec + 0.4, startSec + 0.7);
  const chip = pop(t, e(1), fps, SPRING.pop);
  const shake = Math.sin((t - e(2)) * 38) * 4 * Math.max(0, 1 - Math.abs(t - e(2) - 0.25) * 3);
  const q = pop(t, e(2), fps, SPRING.pop);
  const move = ramp(t, e(3), e(3) + 0.55, EASE_IN_OUT);
  const year = pop(t, e(4), fps, SPRING.pop);
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, translate: `${move * -150}px ${move * 40}px`, scale: `${1 - move * 0.18}`, transformOrigin: '540px 780px' }}>
        <YourPhone>
          <CameraView spin={0} loaded={1} subjectX={null} />
        </YourPhone>
        <FineTag p={1} flip={1} />
        <StickerPill text="MISSED" tone="red" p={1} rotate={-6} size={36} style={{ left: 600, top: 520, opacity: 1 - missedOut }} />
      </div>
      <LockedChip label="VERDICT" shake={shake} style={{ left: 540, top: 350, translate: '-50% 0px', opacity: Math.min(1, chip * 3), scale: `${0.6 + 0.4 * chip}` }} />
      <div style={{ position: 'absolute', left: mix(800, 760, move), top: mix(560, 620, move), fontFamily: arabic, fontWeight: 900, fontSize: 190, color: L.ink, opacity: Math.min(1, q * 3), scale: `${0.4 + 0.6 * q}`, lineHeight: 1 }}>
        ؟
      </div>
      <div style={{ position: 'absolute', left: 560, top: 860, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
        <StickerPill text="2017" tone="ink" p={year} rotate={-4} size={92} style={{ position: 'relative' }} />
        <Mono size={24} color={L.ink} weight={800} style={{ opacity: Math.min(1, year * 2), marginLeft: 18 }}>
          CASE FILE →
        </Mono>
      </div>
    </>
  );
};
