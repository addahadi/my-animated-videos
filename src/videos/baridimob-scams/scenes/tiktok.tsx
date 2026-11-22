import React from 'react';
import { Img, staticFile } from 'remotion';
import { ChoiceButton, ImageCard, SendGlyph, WalletScreen } from '../../../components/Banking';
import { DeviceMock, StatusBar } from '../../../components/Device';
import { CursorIcon, EyeIcon } from '../../../components/Icons';
import { ArText, Mono, StickerPill, XStamp } from '../../../components/Labels';
import { display } from '../../../fonts';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN, EASE_IN_OUT, SPRING, theme } from '../../../theme';
import { FakeAppIcon } from './Scene04TrickFakeApp';
import { BALANCE, FlyingCode, HOOK_PHONE, Scammer, WalletPhone, screenOf } from './parts';

const L = theme.light;
const A = theme.accent;
const D = theme.dark;

/** Real BaridiMob logo (store icon) on a white app tile. Shown next to the app, never on a fake. */
export const BrandTile: React.FC<{ src: string; size: number; p: number; label?: string; style?: React.CSSProperties }> = ({ src, size, p, label, style }) => (
  <div style={{ position: 'absolute', width: size, opacity: Math.min(1, p * 3), scale: `${0.6 + 0.4 * p}`, ...style }}>
    <div style={{ width: size, height: size, borderRadius: size * 0.22, background: '#FFFFFF', border: `3px solid ${L.ink}`, boxShadow: theme.shadow.card, overflow: 'hidden' }}>
      <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    {label && (
      <div style={{ marginTop: 10, textAlign: 'center' }}>
        <Mono size={22} color={L.ink} weight={800}>
          {label}
        </Mono>
      </div>
    )}
  </div>
);

/**
 * TikTok scene 2: "وفي الصباح، تحل بريدي موب: صفر دينار" -> the balance slams to 0 DA (real BaridiMob logo beside
 * the phone) -> "ماكانش hacker" (cliché photo crossed out) -> "انت بيدك عطيت الكود": the CODE chip leaves the phone
 * and lands in the scammer's bag.
 */
export const TtMorningZero: React.FC<SceneProps> = ({ events }) => {
  const { t, fps, startSec } = useClock();
  const e = (i: number) => evAt(events, i);

  const rise = pop(t, e(0) - 0.1, fps, SPRING.soft);
  const sun = pop(t, e(0) + 0.2, fps, SPRING.pop);
  const logo = pop(t, e(0) + 0.45, fps, SPRING.pop);
  const balance = BALANCE * (1 - ramp(t, startSec + 0.4, e(1), EASE_IN));
  const zero = pop(t, e(1), fps, SPRING.snappy);
  const sticker = pop(t, e(1) + 0.05, fps, SPRING.pop);
  const bump = t > e(1) ? Math.exp(-(t - e(1)) * 9) * Math.sin((t - e(1)) * 40) : 0;
  const row = pop(t, e(2), fps, SPRING.soft);
  const shrink = ramp(t, e(3) - 0.2, e(3) + 0.35, EASE_IN_OUT);
  const img = pop(t, e(3), fps, SPRING.soft);
  const imgOut = ramp(t, e(5) - 0.05, e(5) + 0.3, EASE_IN);
  const x = pop(t, e(4), fps, SPRING.snappy);
  const notHacker = pop(t, e(4) + 0.15, fps, SPRING.pop);
  const phoneHide = ramp(t, e(3) - 0.1, e(3) + 0.15) * (1 - ramp(t, e(5) - 0.1, e(5) + 0.25));
  const scam = pop(t, e(5) + 0.1, fps, SPRING.pop);
  const k = ramp(t, e(5) + 0.25, e(6), EASE_IN_OUT);
  const caught = t > e(6) ? 1 : 0;
  const bagBump = t > e(6) ? Math.exp(-(t - e(6)) * 6) : 0;
  const you = pop(t, e(6) + 0.05, fps, SPRING.pop);

  const P = HOOK_PHONE;
  const sc = mix(1, 0.68, shrink);
  const px = mix(P.x, 150, shrink);
  const py = mix(P.y, 520, shrink);
  const from: [number, number] = [150 + P.w * 0.68 * 0.62, 520 + P.h * 0.68 * 0.36];
  const to: [number, number] = [790, 905];
  const sideOut = 1 - shrink;

  return (
    <>
      <div style={{ opacity: 1 - phoneHide * 0.85 }}>
        <WalletPhone
          w={P.w}
          h={P.h}
          balance={balance}
          zero={Math.min(1, zero)}
          rows={[{ label: 'تحويل', amount: '−48 750 DA', p: row, tone: 'red' }]}
          style={{ left: px, top: py + (1 - Math.min(1, rise)) * 700, scale: `${sc * (1 + bump * 0.02)}`, transformOrigin: '0 0' }}
        />
      </div>
      <div style={{ opacity: sideOut }}>
        <StickerPill text="الصباح ☀️" tone="yellow" p={sun} rotate={-5} size={50} style={{ left: 110, top: 400 }} />
        <BrandTile src="baridimob-scams/images/baridimob-logo.png" size={170} p={logo} label="BaridiMob" style={{ left: 70, top: 900, rotate: '-4deg' }} />
        <StickerPill text="0 DA" tone="red" p={sticker} rotate={7} size={54} style={{ left: 650, top: 700 }} />
      </div>

      {img > 0.001 && imgOut < 1 && (
        <ImageCard
          src="baridimob-scams/images/hacker-hoodie.jpg"
          natural={{ w: 1024, h: 499 }}
          width={720}
          height={420}
          p={img}
          push={ramp(t, e(3), e(5), EASE_IN_OUT)}
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

      <Scammer p={scam} fill={caught} bump={bagBump} x={700} y={820} size={200} />
      {t >= e(5) + 0.15 && <FlyingCode from={from} ctrl={[560, 600]} to={to} k={k} p={Math.min(1, ramp(t, e(5) + 0.15, e(5) + 0.35))} />}
      <ArText size={70} weight={900} style={{ position: 'absolute', left: 0, right: 0, top: 1170, textAlign: 'center', opacity: Math.min(1, you * 3), scale: `${0.7 + 0.3 * you}` }}>
        انت عطيتهولو 🔑
      </ArText>
    </>
  );
};

/** TikTok scene 5: the share line on its own beat (send icon + the line). */
export const TtShare: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e0 = evAt(events, 0);
  const send = pop(t, e0, fps, SPRING.pop);
  const fly = t > e0 + 0.6 ? Math.sin((t - e0) * 3) * 8 : 0;
  const text = ramp(t, e0 + 0.1, e0 + 0.45);
  return (
    <>
      <div style={{ position: 'absolute', left: 540 - 140, top: 470, width: 280, height: 280, borderRadius: 999, background: A.yellow, border: `4px solid ${L.ink}`, boxShadow: theme.shadow.lift, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, send * 3), scale: `${0.5 + 0.5 * send}` }}>
        <SendGlyph size={150} fill="#FFFFFF" style={{ translate: `${fly}px ${-fly}px` }} />
      </div>
      <ArText size={86} weight={900} style={{ position: 'absolute', left: 0, right: 0, top: 820, textAlign: 'center', opacity: text, translate: `0px ${(1 - text) * 30}px` }}>
        ابعثو لماماك وباباك
      </ArText>
    </>
  );
};

const TPH = { x: 300, y: 430, w: 480, h: 800 };

/**
 * TikTok scene 6 (dark): Part 2 tease. "وكاين حيلة أخطر" -> the fake app opens, an eye spreads over the screen
 * ("يشوف كلش"), a ghost cursor and typed code dots -> big "Part 2؟" -> "اكتب إيه" with a pulsing إيه button.
 */
export const TtTease: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);
  const sc = screenOf(TPH.w, TPH.h);

  const rise = pop(t, e(0) + 0.05, fps, SPRING.soft);
  const worse = pop(t, e(0) + 0.3, fps, SPRING.pop);
  const open = ramp(t, e(1) - 0.2, e(1) + 0.15);
  const eye = pop(t, e(1) + 0.1, fps, SPRING.pop);
  const fake = pop(t, e(1) + 0.3, fps, SPRING.pop);
  const ghost = ramp(t, e(2) - 0.1, e(2) + 0.1);
  const dots = t < e(2) + 0.3 ? 0 : Math.min(4, Math.floor((t - e(2) - 0.3) / 0.22) + 1);
  const sees = pop(t, e(2) + 0.2, fps, SPRING.pop);
  const shrink = ramp(t, e(3) - 0.25, e(3) + 0.25, EASE_IN_OUT);
  const part = pop(t, e(3), fps, SPRING.snappy);
  const write = pop(t, e(4), fps, SPRING.pop);
  const yes = pop(t, e(4) + 0.2, fps, SPRING.pop);
  const pulse = t > e(4) + 0.6 ? 1 + 0.06 * Math.sin((t - e(4)) * 8) : 1;

  const gt = Math.max(0, t - e(2));
  const gx = sc.w * (0.5 + 0.3 * Math.sin(gt * 2.1));
  const gy = sc.h * (0.5 + 0.25 * Math.sin(gt * 1.3 + 1));
  const pScale = mix(1, 0.62, shrink);
  const pLeft = mix(TPH.x, 120, shrink);
  const pTop = mix(TPH.y, 470, shrink);

  return (
    <>
      <DeviceMock width={TPH.w} height={TPH.h} style={{ left: pLeft, top: pTop + (1 - Math.min(1, rise)) * 700, scale: `${pScale}`, transformOrigin: '0 0' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: sc.w, height: sc.h, background: 'linear-gradient(170deg, #DCE1F6 0%, #EEF0F4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FakeAppIcon size={150} flip={0} style={{ position: 'relative', opacity: 1 - open }} />
        </div>
        {open > 0 && (
          <div style={{ position: 'absolute', left: 0, top: 0, opacity: open }}>
            <WalletScreen width={sc.w} height={sc.h} balance={BALANCE} code={{ p: 1, dots }} fake={1} />
          </div>
        )}
        {eye > 0.001 && (
          <div style={{ position: 'absolute', left: 0, top: 0, width: sc.w, height: sc.h, background: `rgba(230,88,86,${0.22 * Math.min(1, eye)})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ opacity: Math.min(1, eye * 3), scale: `${0.5 + 0.5 * eye}`, filter: 'drop-shadow(0 0 22px rgba(230,88,86,0.9))' }}>
              <EyeIcon size={220} color={L.ink} fill="#FFFFFF" stroke={3.5} />
            </div>
          </div>
        )}
        {ghost > 0.001 && (
          <div style={{ position: 'absolute', left: gx, top: gy, opacity: ghost }}>
            <CursorIcon size={80} fill={A.red} stroke={3.4} />
          </div>
        )}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 16 }}>
          <StatusBar width={sc.w} scale={0.85} />
        </div>
      </DeviceMock>

      <StickerPill text="حيلة أخطر" tone="red" p={worse * (1 - shrink)} rotate={-6} size={56} style={{ left: 90, top: 360 }} />
      <div style={{ opacity: 1 - shrink }}>
        <StickerPill text="تطبيق مزيف" tone="red" p={fake} rotate={5} size={52} style={{ left: 640, top: 560 }} />
        <StickerPill text="يشوف كلش 👁" tone="yellow" p={sees} rotate={-4} size={48} style={{ left: 600, top: 1060 }} />
      </div>

      {/* Part 2? */}
      <div style={{ position: 'absolute', left: 470, top: 520, width: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 }}>
        <div style={{ padding: '18px 40px', borderRadius: 999, background: A.yellow, border: `4px solid ${L.ink}`, boxShadow: `0 0 34px ${D.glow}`, opacity: Math.min(1, part * 3), scale: `${0.5 + 0.5 * part}`, rotate: '-3deg' }}>
          <span dir="ltr" style={{ fontFamily: display, fontWeight: 900, fontSize: 92, color: L.ink, lineHeight: 1 }}>
            Part 2
          </span>
          <span style={{ fontFamily: display, fontWeight: 900, fontSize: 92, color: A.red, lineHeight: 1 }}>?</span>
        </div>
        <ArText size={64} weight={900} color={D.text} style={{ textAlign: 'center', opacity: Math.min(1, write * 3), translate: `0px ${(1 - Math.min(1, write)) * 20}px` }}>
          اكتب "إيه" 👇
        </ArText>
      </div>
      <ChoiceButton text="إيه" tone="green" p={yes} style={{ left: 580, top: 900, scale: `${(0.5 + 0.5 * yes) * pulse}` }} />
    </>
  );
};
