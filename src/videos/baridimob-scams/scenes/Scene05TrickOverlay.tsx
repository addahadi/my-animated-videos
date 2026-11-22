import React from 'react';
import { AccessibilityScreen, AllowDialog, SmsGlyph, WalletScreen } from '../../../components/Banking';
import { DeviceMock, StatusBar } from '../../../components/Device';
import { AppGrid, DrawPath } from '../../../components/Diagram';
import { CursorIcon, EyeIcon } from '../../../components/Icons';
import { Mono, StickerPill } from '../../../components/Labels';
import { TermLabel } from '../../../components/Web';
import { display } from '../../../fonts';
import { pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN, EASE_IN_OUT, SPRING, theme } from '../../../theme';
import { FakeAppIcon } from './Scene04TrickFakeApp';
import { BALANCE, E, FlyingCode, Scammer, Tap, screenOf } from './parts';

const L = theme.light;
const A = theme.accent;
const D = theme.dark;
const PH = { x: 300, y: 440, w: 480, h: 820 };

/**
 * Scene 5, trick 3 (dark blueprint): the fake app asks for the Accessibility permission -> toggle ON + ALLOW ->
 * an eye over the screen, a ghost cursor moving by itself -> the real wallet app opens, an identical layer
 * slides over it -> tilt to a 3D side view (two labelled layers) -> the code typed on the top layer goes to
 * the scammer -> the SMS code is copied too.
 */
export const Scene05TrickOverlay: React.FC<SceneProps> = () => {
  const { t, fps } = useClock();
  const e = (i: number) => E(5, i);
  const sc = screenOf(PH.w, PH.h);
  const bezel = Math.max(8, PH.w * 0.035);
  const off = 3 + bezel + 2;
  const radius = PH.w * 0.16 - bezel;

  const rise = pop(t, e(0) + 0.1, fps, SPRING.soft);
  const android = pop(t, e(0) + 0.45, fps, SPRING.pop);
  const tapApp = ramp(t, e(1) - 0.1, e(1) + 0.35);
  const splash = ramp(t, e(1) + 0.15, e(1) + 0.4);
  const a11y = ramp(t, e(2), e(2) + 0.4, EASE_IN_OUT);
  const hl = ramp(t, e(2) + 0.4, e(2) + 0.7);
  const term = pop(t, e(3), fps, SPRING.pop);
  const termOut = ramp(t, e(4) - 0.05, e(4) + 0.15, EASE_IN); // leaves before the Allow dialog
  const on = ramp(t, e(4), e(4) + 0.2);
  const dialog = pop(t, e(4) + 0.15, fps, SPRING.pop) * (1 - ramp(t, e(4) + 0.75, e(4) + 0.95));
  const press = ramp(t, e(4) + 0.45, e(4) + 0.55) * (1 - ramp(t, e(4) + 0.6, e(4) + 0.7));
  const tapAllow = ramp(t, e(4) + 0.45, e(4) + 0.85);
  const eye = pop(t, e(5), fps, SPRING.pop) * (1 - ramp(t, e(7) - 0.3, e(7)));
  const ghost = ramp(t, e(6) - 0.1, e(6) + 0.1) * (1 - ramp(t, e(7) - 0.7, e(7) - 0.4));
  const real = ramp(t, e(7), e(7) + 0.3);
  const slide = ramp(t, e(8), e(8) + 0.55, EASE_IN_OUT);
  const tilt = ramp(t, e(9), e(9) + 0.9, EASE_IN_OUT);
  const labels = [pop(t, e(9) + 0.7, fps, SPRING.pop), pop(t, e(9) + 0.95, fps, SPRING.pop)];
  const dots = t < e(10) ? 0 : Math.min(4, Math.floor((t - e(10)) / 0.2) + 1);
  const scam = pop(t, e(10), fps, SPRING.pop);
  const k = ramp(t, e(11), e(11) + 0.7, EASE_IN);
  const sms = pop(t, e(12), fps, SPRING.pop);
  const k2 = ramp(t, e(12) + 0.35, e(12) + 1.0, EASE_IN);
  const caught = (t > e(11) + 0.7 ? 0.6 : 0) + (t > e(12) + 1.0 ? 0.4 : 0);
  const bumpAt = t > e(12) + 1.0 ? e(12) + 1.0 : e(11) + 0.7;
  const bump = t > e(11) + 0.7 ? Math.exp(-(t - bumpAt) * 6) : 0;

  // ghost cursor path inside the screen (deterministic lissajous)
  const gt = Math.max(0, t - e(6));
  const gx = sc.w * (0.5 + 0.32 * Math.sin(gt * 2.1));
  const gy = sc.h * (0.45 + 0.28 * Math.sin(gt * 1.3 + 1));

  // 3D stack: both layers sit exactly on the phone screen at tilt 0
  const sx = PH.x + off;
  const sy = PH.y + off;
  const shiftX = -70 * tilt;
  const sep = 230 * tilt;
  const rot = `rotateX(${52 * tilt}deg) rotateZ(${-30 * tilt}deg)`;
  const layerStyle: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: sc.w, height: sc.h, borderRadius: radius, overflow: 'hidden', backfaceVisibility: 'hidden' };

  const codeFrom: [number, number] = [500, 650];
  const bag: [number, number] = [815, 1060];

  return (
    <>
      <StickerPill text="ANDROID" tone="yellow" p={android * (1 - tilt)} rotate={-6} size={30} style={{ left: 120, top: 470 }} />

      <div style={{ opacity: 1 - tilt * 0.9 }}>
        <DeviceMock width={PH.w} height={PH.h} style={{ left: PH.x, top: PH.y + (1 - Math.min(1, rise)) * 600 }}>
          {/* home screen with the fake app from trick 2 */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: sc.w, height: sc.h, background: 'linear-gradient(170deg, #DCE1F6 0%, #EEF0F4 100%)' }}>
            <AppGrid cols={3} rows={4} tile={96} gap={36} dim={0.3} hidden={4} style={{ left: 50, top: 120 }} />
            <FakeAppIcon size={96} flip={0} style={{ left: 50 + 132, top: 120 + 132 }} />
            <Tap x={50 + 132 + 48} y={120 + 132 + 48} p={tapApp} />
          </div>
          {/* splash of the fake app */}
          {splash > 0 && (
            <div style={{ position: 'absolute', left: 0, top: 0, width: sc.w, height: sc.h, background: A.blue, opacity: splash, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
              <div style={{ width: 120, height: 120, borderRadius: 30, background: A.yellow, border: `3px solid ${L.ink}` }} />
              <span style={{ fontFamily: display, fontWeight: 900, fontSize: 36, color: '#FFFFFF' }}>BaridiMob Update</span>
              <div style={{ display: 'flex', gap: 12 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 14, height: 14, borderRadius: 99, background: '#FFFFFF', opacity: 0.35 + 0.65 * (Math.floor(t * 4 + i) % 3 === 0 ? 1 : 0) }} />
                ))}
              </div>
            </div>
          )}
          {/* Accessibility settings */}
          {a11y > 0 && (
            <div style={{ position: 'absolute', left: 0, top: 0, translate: `0px ${(1 - a11y) * sc.h}px` }}>
              <AccessibilityScreen
                width={sc.w}
                height={sc.h}
                rows={[
                  { label: 'TalkBack', on: 0 },
                  { label: 'BaridiMob Update', on, highlight: hl, fake: true },
                  { label: 'Select to Speak', on: 0 },
                ]}
              />
              {dialog > 0.001 && <AllowDialog width={sc.w - 50} app="BaridiMob Update" p={dialog} press={press} style={{ left: 25, top: 520 }} />}
              <Tap x={sc.w - 90} y={520 + 170} p={tapAllow} />
            </div>
          )}
          {/* it watches and controls */}
          {eye > 0.001 && (
            <div style={{ position: 'absolute', left: 0, top: 0, width: sc.w, height: sc.h, background: `rgba(230,88,86,${0.22 * Math.min(1, eye)})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ opacity: Math.min(1, eye * 3), scale: `${0.5 + 0.5 * eye}`, filter: 'drop-shadow(0 0 22px rgba(230,88,86,0.9))' }}>
                <EyeIcon size={240} color={L.ink} fill="#FFFFFF" stroke={3.5} />
              </div>
            </div>
          )}
          {ghost > 0.001 && (
            <div style={{ position: 'absolute', left: gx, top: gy, opacity: ghost }}>
              <CursorIcon size={80} fill={A.red} stroke={3.4} />
            </div>
          )}
          {/* the real app */}
          {real > 0 && (
            <div style={{ position: 'absolute', left: 0, top: 0, opacity: real }}>
              <WalletScreen width={sc.w} height={sc.h} balance={BALANCE} code={{ p: 1, dots: 0 }} />
            </div>
          )}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 16 }}>
            <StatusBar width={sc.w} scale={0.85} />
          </div>
        </DeviceMock>
      </div>

      {/* overlay layers (on the screen at tilt 0, a 3D side view after) */}
      {slide > 0 && (
        <div style={{ position: 'absolute', left: sx + shiftX, top: sy, width: sc.w, height: sc.h, perspective: 1800, overflow: tilt > 0 ? 'visible' : 'hidden', borderRadius: radius }}>
          <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: rot }}>
            {tilt > 0 && (
              <div style={{ ...layerStyle, border: `4px solid ${A.blue}`, boxShadow: `0 0 30px ${D.glow}` }}>
                <WalletScreen width={sc.w} height={sc.h} balance={BALANCE} code={{ p: 1, dots: 0 }} />
              </div>
            )}
            <div style={{ ...layerStyle, transform: `translateZ(${sep}px) translateY(${(1 - slide) * -sc.h}px)`, boxShadow: tilt > 0 ? `0 0 34px rgba(230,88,86,0.7)` : undefined }}>
              <WalletScreen width={sc.w} height={sc.h} balance={BALANCE} code={{ p: 1, dots }} fake={tilt} />
            </div>
          </div>
        </div>
      )}
      <StickerPill text="مزيفة" tone="red" p={labels[0]} rotate={-6} size={56} style={{ left: 180, top: 470 }} />
      <StickerPill text="الصح" tone="blue" p={labels[1]} rotate={5} size={56} style={{ left: 150, top: 960 }} />

      {/* the code goes to the scammer, then the SMS code */}
      <Scammer p={scam} fill={caught} bump={bump} x={735} y={1000} size={170} />
      {t >= e(11) && <FlyingCode from={codeFrom} ctrl={[720, 560]} to={[bag[0], bag[1] - 10]} k={k} size={0.8} />}
      {sms > 0.001 && (
        <div style={{ position: 'absolute', left: 170, top: 1130, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderRadius: 18, background: D.panel, border: `3px solid ${D.marker}`, boxShadow: `0 0 18px rgba(129,225,200,0.45)`, opacity: Math.min(1, sms * 3), scale: `${0.6 + 0.4 * sms}` }}>
          <SmsGlyph size={40} color={D.text} fill={A.green} />
          <Mono size={26} color={D.text} weight={800}>
            CODE 4821
          </Mono>
        </div>
      )}
      <DrawPath d={`M 400 1150 Q 640 1240 ${bag[0] - 20} ${bag[1] + 40}`} p={ramp(t, e(12) + 0.2, e(12) + 0.8)} dashed color={D.marker} width={6} />
      {t >= e(12) + 0.35 && <FlyingCode from={[400, 1150]} ctrl={[640, 1240]} to={[bag[0] - 20, bag[1] + 40]} k={k2} size={0.6} glow={0.3} />}

      <div style={{ opacity: 1 - termOut }}>
        <TermLabel term="Accessibility" gloss="إذن" p={term} mode="light" size={44} style={{ left: 540, top: 1030, translate: '-50% 0px' }} />
      </div>
      {tilt > 0.98 && (
        <div style={{ position: 'absolute', left: 165, top: 400 }}>
          <Mono size={20} color={D.mono}>SIDE VIEW · 2 LAYERS</Mono>
        </div>
      )}
    </>
  );
};
