import React from 'react';
import { DeviceMock, StatusBar } from '../../../components/Device';
import { AppGrid } from '../../../components/Diagram';
import { ShopIcon } from '../../../components/Icons';
import { ArText, Mono, StickerPill, XStamp } from '../../../components/Labels';
import { FileChip, ThiefGlyph } from '../../../components/Scam';
import { UserGlyph } from '../../../components/Web';
import { arabic, display } from '../../../fonts';
import { pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN, EASE_IN_OUT, SPRING, theme } from '../../../theme';
import { E, Tap, screenOf } from './parts';

const L = theme.light;
const A = theme.accent;
const PH = { x: 280, y: 430, w: 520, h: 870 };

/** The fake wallet app icon: blue front, scammer on the back (flip 0..1). */
export const FakeAppIcon: React.FC<{ size: number; flip: number; p?: number; style?: React.CSSProperties }> = ({ size, flip, p = 1, style }) => {
  const back = flip > 0.5;
  return (
    <div style={{ position: 'absolute', width: size, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: Math.min(1, p * 3), scale: `${0.5 + 0.5 * p}`, ...style }}>
      <div style={{ width: size, height: size, transform: `perspective(600px) rotateY(${flip * 180}deg)` }}>
        <div
          style={{
            width: size,
            height: size,
            borderRadius: size * 0.26,
            background: back ? A.red : A.blue,
            border: `3px solid ${L.ink}`,
            boxShadow: '4px 6px 0 rgba(11,15,21,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: back ? 'scaleX(-1)' : undefined,
          }}
        >
          {back ? <ThiefGlyph size={size * 0.62} fill="#FFFFFF" /> : <div style={{ width: size * 0.42, height: size * 0.42, borderRadius: size * 0.1, background: A.yellow, border: `3px solid ${L.ink}` }} />}
        </div>
      </div>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: size * 0.2, color: L.ink, whiteSpace: 'nowrap' }}>BaridiMob</span>
    </div>
  );
};

/**
 * Scene 4, trick 2: a chat message "نسخة جديدة… حمّلها من هنا" (Facebook / Telegram as text) -> install ->
 * the icon lands on the home screen and flips to show the scammer -> split: chat download ❌ vs store ✅.
 */
export const Scene04TrickFakeApp: React.FC<SceneProps> = () => {
  const { t, fps } = useClock();
  const e = (i: number) => E(4, i);
  const sc = screenOf(PH.w, PH.h);

  const rise = pop(t, e(0) - 0.1, fps, SPRING.soft);
  const plat = [pop(t, e(1), fps, SPRING.pop), pop(t, e(1) + 0.4, fps, SPRING.pop)];
  const msg = pop(t, e(2) - 0.3, fps, SPRING.soft);
  const file = pop(t, e(2) + 0.2, fps, SPRING.pop);
  const pulse = t > e(2) + 0.5 && t < e(3) ? 0.5 + 0.5 * Math.sin((t - e(2)) * 7) : 0;
  const tap = ramp(t, e(3) - 0.15, e(3) + 0.3);
  const prog = ramp(t, e(3), e(3) + 0.4);
  const home = ramp(t, e(3) + 0.4, e(3) + 0.55);
  const icon = pop(t, e(3) + 0.45, fps, SPRING.pop);
  const flip = ramp(t, e(4), e(4) + 0.4, EASE_IN_OUT);
  const thiefTag = pop(t, e(4) + 0.3, fps, SPRING.pop);
  const phoneOut = ramp(t, e(5) - 0.25, e(5) + 0.05, EASE_IN);
  const left = pop(t, e(5), fps, SPRING.soft);
  const right = pop(t, e(5) + 0.35, fps, SPRING.soft);
  const xs = pop(t, e(5) + 0.3, fps, SPRING.snappy);
  const win = pop(t, e(6), fps, SPRING.pop);
  const winGlow = t > e(6) ? 0.6 + 0.4 * Math.sin((t - e(6)) * 5) : 0;

  return (
    <>
      <div style={{ opacity: 1 - phoneOut, scale: `${1 - phoneOut * 0.08}` }}>
        <DeviceMock width={PH.w} height={PH.h} style={{ left: PH.x, top: PH.y + (1 - Math.min(1, rise)) * 700 }}>
          {/* chat */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: sc.w, height: sc.h, background: '#F3F4F1', opacity: 1 - home }}>
            <div dir="rtl" style={{ position: 'absolute', left: 0, right: 0, top: 66, height: 96, borderBottom: '2.5px solid rgba(11,15,21,0.25)', display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px' }}>
              <div style={{ width: 60, height: 60, borderRadius: 99, background: '#F3B2B0', border: `3px solid ${L.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserGlyph size={38} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontFamily: arabic, fontWeight: 800, fontSize: 36, color: L.ink, lineHeight: 1.1 }}>خدمة الزبائن 24/24</span>
                <Mono size={15} color={A.green}>ONLINE</Mono>
              </div>
            </div>
            <div style={{ position: 'absolute', left: 20, right: 60, top: 190, opacity: Math.min(1, msg * 3), translate: `${(1 - Math.min(1, msg)) * -60}px 0px` }}>
              <div dir="rtl" style={{ display: 'inline-block', background: '#FFFFFF', border: `3px solid ${L.ink}`, borderRadius: '26px 26px 26px 6px', padding: '14px 22px 8px', fontFamily: arabic, fontWeight: 800, fontSize: 36, color: L.ink, lineHeight: 1.25, boxShadow: theme.shadow.card }}>
                نسخة جديدة من بريدي موب 🔥 حمّلها من هنا
              </div>
            </div>
            <div style={{ position: 'absolute', left: 30, top: 380, width: 380, height: 300, borderRadius: 22, background: '#FFFFFF', border: `3px solid ${L.ink}`, opacity: Math.min(1, file * 3), scale: `${0.7 + 0.3 * Math.min(1, file)}`, transformOrigin: '0 0' }}>
              <FileChip name="BaridiMob_v5.apk" ext="apk" size={0.9} style={{ left: 110, top: 8 }} />
              <div style={{ position: 'absolute', left: 30, right: 30, bottom: 22, height: 64, borderRadius: 14, background: A.green, border: `3px solid ${L.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 ${30 * pulse}px rgba(50,175,122,${0.6 * pulse})`, scale: `${1 + pulse * 0.04}`, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${prog * 100}%`, background: '#1F8A5C' }} />
                <Mono size={22} color="#FFFFFF" weight={800} style={{ position: 'relative' }}>
                  {prog > 0 ? `INSTALLING ${Math.round(prog * 100)}%` : '↓ DOWNLOAD'}
                </Mono>
              </div>
            </div>
            <Tap x={220} y={650} p={tap} />
          </div>
          {/* home screen */}
          {home > 0 && (
            <div style={{ position: 'absolute', left: 0, top: 0, width: sc.w, height: sc.h, background: 'linear-gradient(170deg, #DCE1F6 0%, #EEF0F4 100%)', opacity: home }}>
              <AppGrid cols={3} rows={4} tile={104} gap={40} dim={0.3} hidden={4} style={{ left: 50, top: 120 }} />
              <FakeAppIcon size={104} flip={flip} p={icon} style={{ left: 50 + 144, top: 120 + 144 }} />
            </div>
          )}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 16 }}>
            <StatusBar width={sc.w} scale={0.85} />
          </div>
        </DeviceMock>
        <StickerPill text="Facebook" tone="ink" p={plat[0]} rotate={-6} size={32} style={{ left: 150, top: 430 }} />
        <StickerPill text="Telegram" tone="ink" p={plat[1]} rotate={5} size={32} style={{ left: 690, top: 480 }} />
        <StickerPill text="تطبيق المحتال" tone="red" p={thiefTag} rotate={-5} size={58} style={{ left: 330, top: 1000 }} />
      </div>

      {/* split: where it came from */}
      {left > 0.001 && (
        <>
          <div style={{ position: 'absolute', left: 165, top: 560, width: 340, height: 520, borderRadius: 24, background: L.surface, border: `3px solid ${A.red}`, boxShadow: theme.shadow.card, opacity: Math.min(1, left * 3), translate: `0px ${(1 - Math.min(1, left)) * 60}px` }}>
            <div dir="rtl" style={{ position: 'absolute', left: 24, right: 24, top: 30, background: '#FFFFFF', border: `3px solid ${L.ink}`, borderRadius: '22px 22px 22px 6px', padding: '10px 16px 6px', fontFamily: arabic, fontWeight: 800, fontSize: 30, color: L.ink }}>
              حمّلها من هنا 🔥
            </div>
            <FileChip name="update.apk" ext="apk" size={0.85} tone="red" style={{ left: 105, top: 150 }} />
            <ArText size={44} style={{ position: 'absolute', left: 0, right: 0, bottom: 34, textAlign: 'center' }}>
              من الميساج
            </ArText>
            <XStamp p={xs} size={260} style={{ left: 40, top: 110 }} />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 575,
              top: 560,
              width: 340,
              height: 520,
              borderRadius: 24,
              background: L.surface,
              border: `4px solid ${A.green}`,
              boxShadow: `${theme.shadow.card}${winGlow > 0 ? `, 0 0 ${36 * winGlow}px rgba(50,175,122,0.55)` : ''}`,
              opacity: Math.min(1, right * 3),
              translate: `0px ${(1 - Math.min(1, right)) * 60}px`,
              scale: `${1 + 0.06 * Math.min(1, win)}`,
            }}
          >
            <div style={{ position: 'absolute', left: 0, right: 0, top: 50, display: 'flex', justifyContent: 'center' }}>
              <ShopIcon size={140} fill="#C8EBD9" />
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 230, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <Mono size={26} color={L.ink} weight={800}>PLAY STORE</Mono>
              <Mono size={26} color={L.ink} weight={800}>APP STORE</Mono>
            </div>
            <ArText size={44} style={{ position: 'absolute', left: 0, right: 0, bottom: 34, textAlign: 'center' }}>
              من المتجر الرسمي
            </ArText>
            <div style={{ position: 'absolute', right: -14, top: -26, width: 90, height: 90, borderRadius: 99, background: A.green, border: `3px solid ${L.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, right * 3) }}>
              <span style={{ fontFamily: display, fontWeight: 900, fontSize: 56, color: '#FFFFFF' }}>✓</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};
