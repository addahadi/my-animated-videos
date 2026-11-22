import React from 'react';
import { Magnifier, SmsNotif } from '../../../components/Banking';
import { DeviceMock, StatusBar } from '../../../components/Device';
import { DrawPath } from '../../../components/Diagram';
import { ArText, Mono, StickerPill } from '../../../components/Labels';
import { arabic, display, mono } from '../../../fonts';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN, EASE_IN_OUT, SPRING, theme } from '../../../theme';
import { FlyingCode, Scammer, Tap, screenOf } from './parts';

const L = theme.light;
const A = theme.accent;

export const FAKE_URL = 'poste-dz-verif.xyz';
const PH = { x: 280, y: 420, w: 520, h: 880 };

/** Fake login page (invented copy, no logo): yellow header, two fields, a button. */
const FakePage: React.FC<{ w: number; h: number; t: number; e: (i: number) => number; fps: number }> = ({ w, h, t, e, fps }) => {
  const f = [0, 1, 2, 3].map((i) => pop(t, e(3) + 0.25 + i * 0.25, fps, SPRING.soft));
  const dots = t < e(5) ? 0 : Math.min(4, Math.floor((t - e(5)) / 0.2) + 1);
  const field = (label: string, p: number, children?: React.ReactNode) => (
    <div style={{ opacity: Math.min(1, p * 3), translate: `0px ${(1 - Math.min(1, p)) * 30}px` }}>
      <div dir="rtl" style={{ fontFamily: arabic, fontWeight: 800, fontSize: 30, color: L.ink, marginBottom: 8 }}>{label}</div>
      <div style={{ height: 78, borderRadius: 14, border: `3px solid ${L.ink}`, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>{children}</div>
    </div>
  );
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, background: '#F3F4F1' }}>
      <div style={{ position: 'absolute', left: 18, right: 18, top: 66, height: 50, borderRadius: 999, background: '#FFFFFF', border: `2.5px solid ${L.ink}`, display: 'flex', alignItems: 'center', padding: '0 18px' }}>
        <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 21, color: L.ink }}>{FAKE_URL}</span>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 136, height: 130, background: A.yellow, borderTop: `3px solid ${L.ink}`, borderBottom: `3px solid ${L.ink}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, opacity: Math.min(1, f[0] * 3) }}>
        <span dir="rtl" style={{ fontFamily: arabic, fontWeight: 900, fontSize: 44, color: L.ink }}>بريد الجزائر</span>
        <Mono size={17} color={L.ink}>ESPACE CLIENT</Mono>
      </div>
      <div style={{ position: 'absolute', left: 30, right: 30, top: 300, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {field('رقم الحساب', f[1], <span style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: L.inkSoft }}>0079 99•• ••••</span>)}
        {field(
          'الكود السري',
          f[2],
          [0, 1, 2, 3].map((i) => <div key={i} style={{ width: 22, height: 22, borderRadius: 99, background: i < dots ? L.ink : 'transparent', border: `3px solid ${i < dots ? L.ink : L.faded}` }} />),
        )}
        <div style={{ height: 80, borderRadius: 16, background: A.blue, border: `3px solid ${L.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, f[3] * 3) }}>
          <span dir="rtl" style={{ fontFamily: arabic, fontWeight: 900, fontSize: 36, color: '#FFFFFF', paddingTop: 4 }}>دخول</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Scene 3, trick 1: SMS "حسابك راح يتبلوكا" with a link -> tap -> a page that looks like the post office ->
 * magnifier on the wrong URL ("ماشي هي") -> code typed -> the CODE chip flies to the scammer at once.
 */
type TrickSmsProps = SceneProps & {
  /** lock-screen clock and day label (default 21:47 / TUESDAY) */
  lockTime?: string;
  lockDay?: string;
  /** TikTok hook: phone already up at frame 0 + hook text until the tap */
  hookText?: boolean;
  /** sticker under the magnifier (default "ماشي هي") */
  notIt?: string;
};

export const Scene03TrickSms: React.FC<TrickSmsProps> = ({ events, lockTime = '21:47', lockDay = 'TUESDAY', hookText = false, notIt: notItText = 'ماشي هي' }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);
  const night = lockDay === 'NIGHT';
  const sc = screenOf(PH.w, PH.h);

  const rise = hookText ? 1 : pop(t, e(0) - 0.1, fps, SPRING.soft);
  const hookOut = ramp(t, e(2) - 0.3, e(2), EASE_IN);
  const sms = pop(t, e(1), fps, SPRING.soft);
  const glow = t > e(1) + 0.8 && t < e(2) ? 0.5 + 0.5 * Math.sin((t - e(1)) * 6) : 0;
  const tap = ramp(t, e(2), e(2) + 0.45);
  const page = ramp(t, e(3), e(3) + 0.35, EASE_IN_OUT);
  const lens = pop(t, e(4) - 0.2, fps, SPRING.pop);
  const lensOut = ramp(t, e(5) - 0.35, e(5) - 0.1, EASE_IN);
  const notIt = pop(t, e(4) + 0.15, fps, SPRING.pop);
  const shift = ramp(t, e(5) - 0.3, e(5) + 0.3, EASE_IN_OUT);
  const scam = pop(t, e(5), fps, SPRING.pop);
  const k = ramp(t, e(6), e(6) + 0.7, EASE_IN);
  const caught = t > e(6) + 0.7 ? 1 : 0;
  const bump = t > e(6) + 0.7 ? Math.exp(-(t - e(6) - 0.7) * 6) : 0;
  const instant = pop(t, e(6) + 0.2, fps, SPRING.pop);

  const px = mix(PH.x, 170, shift);
  const off = 3 + Math.max(8, PH.w * 0.035) + 2;
  const codeField: [number, number] = [px + off + sc.w / 2, PH.y + off + 300 + 100 + 30 + 39];
  const bag: [number, number] = [815, 1010];

  return (
    <>
      {hookText && hookOut < 1 && (
        <ArText size={76} weight={900} style={{ position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center', opacity: 1 - hookOut }}>
          <span dir="ltr">SMS</span> من البريد في الليل؟ ⚠️
        </ArText>
      )}
      <DeviceMock width={PH.w} height={PH.h} style={{ left: px, top: PH.y + (1 - Math.min(1, rise)) * 700 }}>
        {/* lock screen */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: sc.w, height: sc.h, background: night ? 'linear-gradient(170deg, #1E2440 0%, #3A3F66 100%)' : 'linear-gradient(170deg, #DCE1F6 0%, #F3F4F1 100%)' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: display, fontWeight: 900, fontSize: 120, color: night ? '#F4F4F0' : L.ink, lineHeight: 1 }}>{lockTime}</div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center' }}>
            <Mono size={20} color={night ? '#B9BED8' : L.inkSoft}>{lockDay}</Mono>
          </div>
          <SmsNotif width={sc.w - 32} sender="ALGERIE-POSTE" text="حسابك راح يتبلوكا، دخل لهاذ اللينك" link={FAKE_URL} p={sms} linkGlow={glow} style={{ left: 16, top: 310 }} />
          <Tap x={130} y={540} p={tap} />
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, translate: `${(1 - page) * sc.w}px 0px`, opacity: page > 0 ? 1 : 0 }}>
          <FakePage w={sc.w} h={sc.h} t={t} e={e} fps={fps} />
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 16 }}>
          <StatusBar width={sc.w} scale={0.85} />
        </div>
      </DeviceMock>

      {/* magnifier on the URL */}
      {lensOut < 1 && (
        <div style={{ opacity: 1 - lensOut }}>
          <Magnifier size={330} p={lens} ring={A.red} style={{ left: 560, top: 360 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span style={{ fontFamily: mono, fontWeight: 800, fontSize: 40, color: L.ink }}>poste-dz-</span>
              <span style={{ fontFamily: mono, fontWeight: 800, fontSize: 40, color: A.red, textDecoration: 'underline', textDecorationThickness: 4 }}>verif.xyz</span>
            </div>
          </Magnifier>
          <StickerPill text={notItText} tone="red" p={notIt} rotate={6} size={58} style={{ left: 600, top: 740 }} />
        </div>
      )}

      {/* code goes to the scammer in the same second */}
      <Scammer p={scam} fill={caught} bump={bump} x={730} y={940} size={180} />
      <DrawPath d={`M${codeField[0]} ${codeField[1]} Q 700 640 ${bag[0]} ${bag[1] - 20}`} p={ramp(t, e(6), e(6) + 0.6)} dashed color={A.red} width={6} opacity={0.8 * (1 - ramp(t, e(6) + 1.2, e(6) + 1.6))} />
      {t >= e(6) && <FlyingCode from={codeField} ctrl={[700, 640]} to={[bag[0], bag[1] - 20]} k={k} size={0.8} />}
      <StickerPill text="0.0 s" tone="ink" p={instant} rotate={-5} size={40} style={{ left: 735, top: 700 }} />
    </>
  );
};
