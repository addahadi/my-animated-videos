import React from 'react';
import { Mono, StickerPill } from '../../../components/Labels';
import { FileChip, ThiefGlyph } from '../../../components/Scam';
import { BrowserCard } from '../../../components/Web';
import { display } from '../../../fonts';
import { mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN, EASE_IN_OUT, SPRING, theme } from '../../../theme';
import { E, wobble } from './parts';

const L = theme.light;
const A = theme.accent;

/**
 * Scenes 4 + 5: an invented fake download page (three flashing DOWNLOAD buttons, countdown,
 * banner) drops two files: GTA6_Setup.exe and GTA6.apk; "ماشي اللعبة" sticker.
 * Scene 5: the camera pushes into the .exe, an X-ray scanner frame slides over it; behind the scan a
 * blurred figure is barely visible and a "?" pulses (open loop, revealed in scene 6).
 */
export const Scene04FakePage: React.FC<SceneProps> = () => {
  const { t, fps } = useClock();

  const page = pop(t, E(4, 0), fps, SPRING.soft);
  const exe = pop(t, E(4, 1), fps, SPRING.pop);
  const apk = pop(t, E(4, 2), fps, SPRING.pop);
  const fallExe = ramp(t, E(4, 1), E(4, 1) + 0.45, EASE_IN);
  const fallApk = ramp(t, E(4, 2), E(4, 2) + 0.45, EASE_IN);
  const notGame = pop(t, E(4, 3), fps, SPRING.pop);

  const push = ramp(t, E(5, 0), E(5, 0) + 0.7, EASE_IN_OUT);
  const lock = pop(t, E(5, 0) + 0.25, fps, SPRING.pop);
  const q = pop(t, E(5, 1) - 0.4, fps, SPRING.pop);
  const qPulse = t > E(5, 1) ? 1 + 0.08 * Math.sin((t - E(5, 1)) * 10) : 1;

  const countdown = Math.max(0, 9 - Math.floor(Math.max(0, t - E(4, 0)) * 1.2));
  const flash = (i: number) => (Math.floor((t - E(4, 0)) * 3 + i) % 3 === 0 ? 1 : 0);

  const exeX = 230;
  const apkX = 650;
  const fileY = 1000;
  // zoom target: the .exe
  const zx = exeX + 80;
  const zy = fileY + 90;
  const Z = mix(1, 1.7, push);

  return (
    <div style={{ position: 'absolute', inset: 0, transformOrigin: `${zx}px ${zy}px`, scale: `${Z}`, translate: `${mix(0, 540 - zx, push)}px ${mix(0, 760 - zy, push)}px` }}>
      <div style={{ opacity: 1 - push }}>
        <BrowserCard
          width={720}
          height={520}
          url="gta6-free-pc.download"
          style={{ left: 180, top: 420 + (1 - Math.min(1, page)) * -300, opacity: Math.min(1, page * 3) }}
        >
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 64, background: flash(0) ? A.yellow : A.red, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `3px solid ${L.ink}` }}>
            <Mono size={24} color={flash(0) ? L.ink : '#FFFFFF'} weight={800}>
              ★ YOU WON A FREE COPY ★
            </Mono>
          </div>
          <div style={{ position: 'absolute', left: 30, right: 30, top: 88, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span dir="ltr" style={{ fontFamily: display, fontWeight: 900, fontSize: 44, color: L.ink }}>
              GTA 6 PC – CRACK
            </span>
            <span dir="ltr" style={{ fontFamily: display, fontWeight: 900, fontSize: 40, color: A.red }}>
              00:0{countdown}
            </span>
          </div>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 30 + i * 0,
                right: 30,
                top: 170 + i * 92,
                height: 74,
                borderRadius: 14,
                border: `3px solid ${L.ink}`,
                background: flash(i + 1) ? A.green : '#7FCDA8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                scale: `${1 + flash(i + 1) * 0.03}`,
              }}
            >
              <Mono size={30} color="#FFFFFF" weight={800}>
                ↓ DOWNLOAD {i === 0 ? 'NOW' : i === 1 ? 'FAST' : 'FREE'}
              </Mono>
            </div>
          ))}
        </BrowserCard>
      </div>

      <FileChip name="GTA6_Setup.exe" ext="exe" p={exe} wobble={t > E(5, 1) - 0.4 ? wobble(t, 6, 14) : 0} style={{ left: exeX, top: mix(700, fileY, fallExe) }} />
      <div style={{ opacity: 1 - push }}>
        <FileChip name="GTA6.apk" ext="apk" p={apk} style={{ left: apkX, top: mix(700, fileY, fallApk) }} />
      </div>
      <div style={{ opacity: 1 - push }}>
        <StickerPill text="ماشي اللعبة" tone="red" p={notGame} rotate={-5} size={58} style={{ left: 330, top: 1210 }} />
      </div>

      {/* open loop: an X-ray scanner over the file, a blurred figure inside */}
      {lock > 0.001 && (
        <div style={{ position: 'absolute', left: exeX - 22, top: fileY - 22, width: 164, height: 196, opacity: Math.min(1, lock * 3), scale: `${0.8 + 0.2 * Math.min(1, lock)}` }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 14, background: 'rgba(34,43,68,0.82)', border: `3px solid ${theme.dark.marker}`, boxShadow: `0 0 18px rgba(129,225,200,0.55)`, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 30, top: 50, filter: 'blur(5px)', opacity: 0.75 }}>
              <ThiefGlyph size={100} fill={A.red} color="#0B0F15" />
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 6 + ((t * 1.3) % 1) * 180, height: 3, background: '#9BE7FF', boxShadow: '0 0 12px 3px rgba(120,210,255,0.7)' }} />
          </div>
          <div style={{ position: 'absolute', left: 0, top: -30, scale: `${1 / Z}`, transformOrigin: '0 100%' }}>
            <Mono size={20} color={L.ink} weight={800}>
              SCAN · INSIDE
            </Mono>
          </div>
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          left: exeX + 140,
          top: fileY - 40,
          fontFamily: display,
          fontWeight: 900,
          fontSize: 130,
          color: A.red,
          opacity: Math.min(1, q * 3),
          scale: `${(0.5 + 0.5 * q) * qPulse / Z * 1.2}`,
          WebkitTextStroke: `4px ${L.ink}`,
        }}
      >
        ?
      </div>
    </div>
  );
};
