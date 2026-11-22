import React from 'react';
import { ImageCard } from '../../../components/Banking';
import { ArText, StickerPill, XStamp } from '../../../components/Labels';
import { display } from '../../../fonts';
import { mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN, EASE_IN_OUT, SPRING, theme } from '../../../theme';
import { HookText } from './Scene01Hook';
import { E, FlyingCode, HOOK_PHONE, Scammer, WalletPhone } from './parts';

const L = theme.light;
const A = theme.accent;

/**
 * Scene 2: "واش صرا؟" -> the hacker cliché photo gets crossed out -> the real cause: the yellow CODE chip
 * leaves YOUR phone, stops halfway on "عطيت الكود", lands in the scammer's bag; calm green ✓ "ما حسيتش";
 * three numbered pills (open loop: 3 tricks).
 */
export const Scene02WhatHappened: React.FC<SceneProps> = () => {
  const { t, fps, startSec } = useClock();
  const e = (i: number) => E(2, i);

  const hookOut = 1 - ramp(t, startSec, startSec + 0.25);
  const shrink = ramp(t, e(0) - 0.15, e(0) + 0.45, EASE_IN_OUT);
  const q = pop(t, e(0) + 0.1, fps, SPRING.pop);
  const qOut = ramp(t, e(1) - 0.2, e(1), EASE_IN);
  const img = pop(t, e(1), fps, SPRING.soft);
  const imgOut = ramp(t, e(3) - 0.05, e(3) + 0.3, EASE_IN);
  const x = pop(t, e(2), fps, SPRING.snappy);
  const notHacker = pop(t, e(2) + 0.15, fps, SPRING.pop);
  const phoneHide = ramp(t, e(1) - 0.2, e(1) + 0.1) * (1 - ramp(t, e(3) - 0.1, e(3) + 0.25));
  const back = ramp(t, e(3) - 0.1, e(3) + 0.35, EASE_IN_OUT);
  const scammer = pop(t, e(3) + 0.1, fps, SPRING.pop);
  const k = 0.5 * ramp(t, e(3) + 0.25, e(4), EASE_IN_OUT) + 0.5 * ramp(t, e(4) + 0.35, e(4) + 0.9, EASE_IN);
  const caught = pop(t, e(4) + 0.9, fps, SPRING.pop);
  const bump = t > e(4) + 0.9 ? Math.exp(-(t - e(4) - 0.9) * 6) : 0;
  const calm = pop(t, e(5), fps, SPRING.pop);
  const pills = [6, 7, 8].map((i) => pop(t, e(i), fps, SPRING.pop));
  const pulse = t > e(8) + 0.3 ? 1 + 0.07 * Math.sin((t - e(8)) * 7) : 1;

  // phone: hook spot -> small left (shrink) ; hidden during the photo ; back at the left
  const P = HOOK_PHONE;
  const sc = mix(1, 0.68, shrink);
  const px = mix(P.x, 150, shrink);
  const py = mix(P.y, 520, shrink);
  const phoneW = P.w * 0.68;
  const from: [number, number] = [150 + phoneW * 0.62, 520 + P.h * 0.68 * 0.36];
  const to: [number, number] = [790, 905];

  return (
    <>
      <HookText opacity={hookOut} />
      <div style={{ opacity: 1 - phoneHide * 0.85 }}>
        <WalletPhone
          w={P.w}
          h={P.h}
          balance={0}
          zero={1}
          rows={[{ label: 'تحويل', amount: '−48 750 DA', p: 1, tone: 'red' }]}
          style={{ left: px, top: py, scale: `${sc}`, transformOrigin: '0 0' }}
        >
          {calm > 0.001 && (
            <div style={{ position: 'absolute', inset: 0, background: `rgba(50,175,122,${0.18 * Math.min(1, calm)})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 210, height: 210, borderRadius: 999, background: A.green, border: `4px solid ${L.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', scale: `${0.5 + 0.5 * calm}`, opacity: Math.min(1, calm * 3) }}>
                <span style={{ fontFamily: display, fontWeight: 900, fontSize: 130, color: '#FFFFFF', lineHeight: 1 }}>✓</span>
              </div>
            </div>
          )}
        </WalletPhone>
      </div>

      {/* واش صرا؟ */}
      <div style={{ position: 'absolute', left: 640, top: 560, fontFamily: display, fontWeight: 900, fontSize: 300, color: A.red, WebkitTextStroke: `6px ${L.ink}`, opacity: Math.min(1, q * 3) * (1 - qOut), scale: `${0.5 + 0.5 * q}` }}>
        ؟
      </div>

      {/* the cliché */}
      {img > 0.001 && imgOut < 1 && (
        <ImageCard
          src="baridimob-scams/images/hacker-hoodie.jpg"
          natural={{ w: 1024, h: 499 }}
          width={720}
          height={420}
          p={img}
          push={ramp(t, e(1), e(3), EASE_IN_OUT)}
          tilt={-2}
          credit="PHOTO: INFOSEC IMAGES · CC BY 2.0"
          style={{ left: 180, top: 520, opacity: 1 - imgOut, translate: `${-imgOut * 300}px 0px` }}
        >
          <StickerPill text="HACKER?" tone="yellow" p={img} rotate={-6} size={34} style={{ left: -20, top: -30 }} />
          <XStamp p={x} size={330} style={{ left: 195, top: 45 }} />
        </ImageCard>
      )}
      <div style={{ opacity: 1 - imgOut }}>
        <StickerPill text="ماشي hacker" tone="red" p={notHacker} rotate={-4} size={60} style={{ left: 330, top: 990 }} />
      </div>

      {/* the real cause: your code goes to the scammer */}
      <Scammer p={scammer * back} fill={caught} bump={bump} x={700} y={820} size={200} />
      {back > 0.5 && <FlyingCode from={from} ctrl={[560, 600]} to={to} k={k} p={Math.min(1, ramp(t, e(3) + 0.15, e(3) + 0.35))} />}
      <StickerPill text="ما حسيتش" tone="yellow" p={calm} rotate={-6} size={48} style={{ left: 175, top: 470 }} />

      {/* 3 tricks */}
      <ArText size={52} style={{ position: 'absolute', left: 0, right: 0, top: 1110, textAlign: 'center', opacity: Math.min(1, pills[0] * 3) }}>
        3 حيل
      </ArText>
      {pills.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 640 - i * 150,
            top: 1185,
            width: 110,
            height: 110,
            borderRadius: 999,
            background: i === 2 ? A.red : L.pill,
            border: `3px solid ${L.ink}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: Math.min(1, p * 3),
            scale: `${(0.5 + 0.5 * p) * (i === 2 ? pulse : 1)}`,
          }}
        >
          <span style={{ fontFamily: display, fontWeight: 900, fontSize: 64, color: '#FFFFFF', lineHeight: 1 }}>{i + 1}</span>
        </div>
      ))}
    </>
  );
};
