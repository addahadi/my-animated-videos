import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { GridCanvas } from '../../components/Canvas';
import { Card, Mono, Stamp, StickerPill } from '../../components/Labels';
import { MiniUI, MiniRow } from '../../components/MiniUI';
import { SmsNotif, Magnifier, KeyGlyph, ShieldGlyph } from '../../components/Banking';
import { SearchIcon, EyeIcon } from '../../components/Icons';
import { arabic, display, mono } from '../../fonts';
import { theme } from '../../theme';

/**
 * Carousel design demo (Report style). One frame = one slide.
 * All slides are laid out on one long strip so the grid and "seam" objects continue across slide edges.
 * Each slide draws its content inside a 940 x 1300 "safe box"; the box is placed per platform:
 *   ig: 1080 x 1440, box at (70, 70)
 *   tt: 1080 x 1920, box scaled 0.925 inside x 70..940 (right button column) and y 240..1443 (bottom caption zone)
 */

const L = theme.light;
const D = theme.dark;
const A = theme.accent;

export type Variant = 'ig' | 'tt';
export const SLIDES = 5;
export const SIZES: Record<Variant, { w: number; h: number }> = { ig: { w: 1080, h: 1440 }, tt: { w: 1080, h: 1920 } };
const BOX = { w: 940, h: 1300 };
const place = (v: Variant) => (v === 'ig' ? { x: 70, y: 70, s: 1 } : { x: 70, y: 240, s: 870 / 940 });

const LINK = 'mybank.dz.secure-login.top/verify';

const Counter: React.FC<{ i: number; mode?: 'light' | 'dark' }> = ({ i, mode = 'light' }) => (
  <Mono size={24} color={mode === 'light' ? L.ink : D.text} weight={800}>
    {String(i + 1).padStart(2, '0')}
    <span style={{ color: mode === 'light' ? L.mono : D.mono, fontWeight: 500 }}> / {String(SLIDES).padStart(2, '0')}</span>
  </Mono>
);

/** Header for body slides: wordmark left, counter right, hairline under. */
const Header: React.FC<{ i: number; mode?: 'light' | 'dark' }> = ({ i, mode = 'light' }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `2px solid ${mode === 'light' ? 'rgba(11,15,21,0.12)' : 'rgba(179,226,251,0.18)'}` }}>
    <div style={{ fontFamily: mono, fontSize: 24, color: mode === 'light' ? L.ink : D.text, letterSpacing: '0.04em' }}>
      <span style={{ fontWeight: 800 }}>Runtime</span>
      <span style={{ fontWeight: 500 }}>.tech</span>
    </div>
    <Counter i={i} mode={mode} />
  </div>
);

const Title: React.FC<{ children: React.ReactNode; size?: number; top?: number; color?: string }> = ({ children, size = 72, top = 90, color = L.ink }) => (
  <div dir="rtl" lang="ar" style={{ position: 'absolute', left: 0, right: 0, top, fontFamily: arabic, fontWeight: 900, fontSize: size, lineHeight: 1.12, color }}>
    {children}
  </div>
);

const Body: React.FC<{ children: React.ReactNode; top: number; color?: string; size?: number }> = ({ children, top, color = L.inkSoft, size = 42 }) => (
  <div dir="rtl" lang="ar" style={{ position: 'absolute', left: 0, right: 0, top, fontFamily: arabic, fontWeight: 700, fontSize: size, lineHeight: 1.3, color }}>
    {children}
  </div>
);

const Hl: React.FC<{ children: React.ReactNode; color: string }> = ({ children, color }) => (
  <span style={{ background: `linear-gradient(transparent 58%, ${color} 58%, ${color} 92%, transparent 92%)`, padding: '0 6px' }}>{children}</span>
);

/* ---------------------------------------------------------------- slides (drawn in 940 x 1300 box coords) */

const Cover: React.FC = () => (
  <>
    <div style={{ position: 'absolute', left: 0, top: 0 }}>
      <Counter i={0} />
    </div>
    <Title size={104} top={80}>
      هاد الرسالة
      <br />
      فيها <Hl color="rgba(230,88,86,0.55)">فخ</Hl>
    </Title>
    <Body top={355} size={50} color={L.ink}>
      تقدر تلقاه في 3 ثواني؟
    </Body>
    <SmsNotif width={820} sender="MYBANK" text="حسابك راح يتبلوكا اليوم. أكّد معلوماتك هنا:" link={LINK} style={{ left: 60, top: 520, rotate: '-2deg' }} />
    <StickerPill text="FAKE?" tone="red" rotate={-6} size={40} style={{ left: 20, top: 470 }} />
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 20, display: 'flex', justifyContent: 'center' }}>
      <div dir="rtl" style={{ display: 'flex', alignItems: 'center', gap: 16, height: 84, padding: '0 40px', borderRadius: 999, background: L.ink, color: '#F4F4F0', boxShadow: theme.shadow.lift }}>
        <span style={{ fontFamily: arabic, fontWeight: 800, fontSize: 42, paddingTop: 4 }}>اسحب وشوف</span>
        <span style={{ fontFamily: display, fontWeight: 900, fontSize: 40 }}>→</span>
      </div>
    </div>
  </>
);

const Trick: React.FC = () => (
  <>
    <Header i={1} />
    <Title top={100}>
      اسم البنك كاين…
      <br />
      بصح في <Hl color="rgba(238,206,97,0.75)">البلاصة الغالطة</Hl>
    </Title>
    <Card lift style={{ left: 0, top: 440, width: 940, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div dir="ltr" style={{ fontFamily: mono, fontWeight: 800, fontSize: 40, color: L.ink, letterSpacing: '-0.01em' }}>
        <span style={{ background: 'rgba(50,175,122,0.22)', borderBottom: `5px solid ${A.green}`, padding: '0 4px' }}>mybank.dz</span>
        <span style={{ color: L.mono }}>.</span>
        <span style={{ background: 'rgba(230,88,86,0.2)', borderBottom: `5px solid ${A.red}`, padding: '0 4px' }}>secure-login.top</span>
        <span style={{ color: L.mono }}>/verify</span>
      </div>
    </Card>
    <StickerPill text="يطمّنك" tone="green" rotate={-4} style={{ left: 60, top: 770 }} />
    <StickerPill text="هذا هو المالك" tone="red" rotate={3} style={{ left: 470, top: 790 }} />
    <Body top={890}>
      المحتال يحط اسم البنك في اللوّل باش تثيق فيه. بصح الموقع تاعو هو.
    </Body>
  </>
);

const Chip: React.FC<{ text: string; label: string; hot?: boolean; dim?: boolean }> = ({ text, label, hot, dim }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: dim ? 0.55 : 1 }}>
    <div
      dir="ltr"
      style={{
        padding: '18px 18px',
        borderRadius: 16,
        background: hot ? D.panel : 'rgba(51,74,106,0.45)',
        border: `3px solid ${hot ? D.delta : D.glow}`,
        boxShadow: hot ? `0 0 26px rgba(230,207,109,0.55)` : 'none',
        fontFamily: mono,
        fontWeight: 800,
        fontSize: 34,
        color: hot ? D.delta : D.text,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
    <Mono size={20} color={hot ? D.delta : D.mono}>{label}</Mono>
  </div>
);

const Blueprint: React.FC = () => (
  <>
    <Header i={2} mode="dark" />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 90, display: 'flex', justifyContent: 'center' }}>
      <div style={{ padding: '10px 26px', borderRadius: 999, background: D.panel, border: `2px solid ${D.glow}`, boxShadow: `0 0 22px ${D.glow}` }}>
        <Mono size={26} color={D.text} weight={800}>HOW TO READ A LINK</Mono>
      </div>
    </div>
    <Title top={190} color={D.text} size={76}>
      اقرا الرابط
      <br />
      <span style={{ color: D.marker }}>من اللخر</span>
    </Title>
    {/* the link broken into parts */}
    <div style={{ position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 10 }}>
      <Chip text="mybank.dz." label="DECOR" dim />
      <Chip text="secure-login.top" label="REAL OWNER" hot />
      <Chip text="/verify" label="PAGE" dim />
    </div>
    {/* reading arrow: starts at the first "/" and walks left */}
    <svg width={940} height={120} style={{ position: 'absolute', left: 0, top: 760, overflow: 'visible' }}>
      <path d="M770 30 Q 560 110 330 40" fill="none" stroke={D.marker} strokeWidth={5} strokeDasharray="14 12" />
      <path d="M346 22 L322 38 L348 54" fill="none" stroke={D.marker} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={772} cy={30} r={10} fill={D.marker} />
    </svg>
    <div style={{ position: 'absolute', left: 700, top: 840 }}>
      <Mono size={20} color={D.marker}>START AT THE FIRST "/"</Mono>
    </div>
    <Body top={960} color={D.text}>
      الكلمة اللي قبل أول <span dir="ltr" style={{ fontFamily: mono, color: D.delta }}>/</span> هي مول الموقع. كلش اللي قبلها ديكور.
    </Body>
  </>
);

const Save: React.FC = () => (
  <>
    <Header i={3} />
    <Title top={100} size={68}>
      قبل ما تكليكي
      <br />
      على أي رابط
    </Title>
    <MiniUI title="4 تشيكات" label="SAVE THIS" width={940} style={{ left: 0, top: 380 }}>
      <MiniRow icon={<SearchIcon size={40} />} text="اقرا الرابط من اللخر" tag="01" />
      <MiniRow icon={<EyeIcon size={40} />} text="دومين غريب؟ top. xyz." tag="02" />
      <MiniRow icon={<KeyGlyph size={40} />} text="حتى بنك ما يطلب الكود" tag="03" highlighted={1} />
      <MiniRow icon={<ShieldGlyph size={40} />} text="افتح التطبيق بيدك" tag="04" />
    </MiniUI>
    <Body top={1150} size={40}>
      سيڨيها وابعثها لواحد يكليكي على كلش.
    </Body>
  </>
);

const End: React.FC = () => (
  <>
    <div style={{ position: 'absolute', right: 0, top: 0 }}>
      <Counter i={4} />
    </div>
    <div dir="rtl" style={{ position: 'absolute', left: 0, right: 0, top: 170, display: 'flex', justifyContent: 'center' }}>
      <Card style={{ position: 'relative', padding: '34px 44px 30px', maxWidth: 820 }}>
        <Mono size={20} color={A.red}>YOUR TURN</Mono>
        <div dir="rtl" style={{ fontFamily: arabic, fontWeight: 800, fontSize: 54, lineHeight: 1.2, color: L.ink, marginTop: 10 }}>
          وصلتك رسالة كيما هادي؟ قولنا في الكومنتار
        </div>
      </Card>
    </div>
    <Stamp text="EXPLAINED" size={64} rotate={-12} style={{ left: 470, top: 600, translate: '-50% -50%' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 720, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontFamily: display, fontWeight: 900, fontSize: 124, lineHeight: 1, color: L.ink, letterSpacing: '-0.02em' }}>
        Runtime<span style={{ color: L.inkSoft, fontWeight: 800 }}>.tech</span>
      </div>
      <div style={{ marginTop: 16 }}>
        <Mono size={24} color={L.mono}>TECH · EXPLAINED SIMPLY</Mono>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1000, display: 'flex', justifyContent: 'center' }}>
      <div dir="rtl" style={{ height: 84, padding: '0 44px', borderRadius: 14, background: L.ink, color: '#F4F4F0', display: 'flex', alignItems: 'center', gap: 16, boxShadow: theme.shadow.lift }}>
        <span style={{ fontFamily: arabic, fontWeight: 800, fontSize: 42, paddingTop: 4 }}>تابع باش ما تطيحش</span>
        <span style={{ fontFamily: display, fontWeight: 900, fontSize: 38 }}>←</span>
      </div>
    </div>
  </>
);

const SLIDE_DEFS: { mode: 'light' | 'dark'; C: React.FC }[] = [
  { mode: 'light', C: Cover },
  { mode: 'light', C: Trick },
  { mode: 'dark', C: Blueprint },
  { mode: 'light', C: Save },
  { mode: 'light', C: End },
];

/* ---------------------------------------------------------------- strip */

export const CarouselDemo: React.FC<{ variant: Variant }> = ({ variant }) => {
  const frame = useCurrentFrame();
  const idx = Math.min(SLIDES - 1, Math.max(0, frame));
  const { w, h } = SIZES[variant];
  const box = place(variant);
  return (
    <AbsoluteFill style={{ background: L.bgEdge, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: -idx * w, top: 0, width: w * SLIDES, height: h }}>
        {SLIDE_DEFS.map(({ mode, C }, i) => (
          <div key={i} style={{ position: 'absolute', left: i * w, top: 0, width: w, height: h, overflow: 'hidden' }}>
            {/* drift -2160*i shifts x by -1080*i (grid continues across the seam), y by a multiple of 240 (unchanged) */}
            <GridCanvas mode={mode} drift={-2160 * i} spacing={240} />
            <div style={{ position: 'absolute', left: box.x, top: box.y, width: BOX.w, height: BOX.h, scale: `${box.s}`, transformOrigin: '0 0' }}>
              <C />
            </div>
          </div>
        ))}
        {/* seam object between slide 1 and 2: half on each, pulls the swipe */}
        <Magnifier size={300} style={{ left: w - 150, top: box.y + box.s * 1000, rotate: '-8deg' }}>
          <span dir="ltr" style={{ fontFamily: mono, fontWeight: 800, fontSize: 40, color: A.red }}>.top</span>
        </Magnifier>
      </div>
    </AbsoluteFill>
  );
};
