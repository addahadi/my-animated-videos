import React from 'react';
import { Img, staticFile } from 'remotion';
import { Card, Mono, Stamp, StickerPill, ValueTag } from '../../components/Labels';
import { MiniUI, MiniRow } from '../../components/MiniUI';
import { ImageCard, ChoiceButton, ShieldGlyph } from '../../components/Banking';
import { SearchIcon, ServerIcon } from '../../components/Icons';
import { CarouselStrip, Counter, Hl, SlideBody, SlideHeader, SlideTitle, SwipeCue, type SlideDef, type Variant } from '../../components/carousel/Carousel';
import { arabic, display, mono } from '../../fonts';
import { theme } from '../../theme';
import zeta from './zeta-data.json';

/** Carousel: scripts/riemann-claude.md (12 slides, Report style). Box coords are 940 x 1300. */

const L = theme.light;
const D = theme.dark;
const A = theme.accent;
const IMG = 'riemann-claude/images/';

/* ---------------------------------------------------------------- small pieces */

/** A fanned stack of paper sheets with grey text lines. */
const PaperStack: React.FC<{ width: number; height: number; sheets?: number; style?: React.CSSProperties }> = ({ width, height, sheets = 7, style }) => (
  <div style={{ position: 'absolute', width, height, ...style }}>
    {Array.from({ length: sheets }).map((_, k) => {
      const j = sheets - 1 - k;
      return (
        <div
          key={k}
          style={{
            position: 'absolute',
            left: j * 14,
            top: j * -16,
            width,
            height,
            background: j === 0 ? '#F6F6F2' : L.surface,
            border: `3px solid ${L.ink}`,
            borderRadius: 10,
            rotate: `${(j % 2 ? 1 : -1) * j * 0.9}deg`,
            boxShadow: theme.shadow.card,
            padding: '36px 34px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {j === 0 &&
            Array.from({ length: Math.floor((height - 80) / 34) }).map((__, r) => (
              <div key={r} style={{ height: 12, borderRadius: 6, background: '#D3D6D9', width: `${[92, 78, 88, 64, 95, 70, 84][r % 7]}%` }} />
            ))}
        </div>
      );
    })}
  </div>
);

const QuoteCard: React.FC<{ quote: string; who: string; tone: string; size?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ quote, who, tone, size = 46, style, children }) => (
  <Card lift style={{ padding: '34px 40px 30px 52px', ...style }}>
    <div style={{ position: 'absolute', left: 0, top: 26, bottom: 26, width: 10, borderRadius: '0 6px 6px 0', background: tone }} />
    <div dir="ltr" style={{ fontFamily: display, fontWeight: 800, fontSize: size, lineHeight: 1.18, color: L.ink, letterSpacing: '-0.01em' }}>
      “{quote}”
    </div>
    <div style={{ marginTop: 20 }}>
      <Mono size={20} color={L.mono}>{who}</Mono>
    </div>
    {children}
  </Card>
);

const Check: React.FC<{ ok: boolean; size?: number }> = ({ ok, size = 56 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 999,
      flexShrink: 0,
      background: ok ? A.green : A.red,
      border: `3px solid ${L.ink}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#FFF',
      fontFamily: display,
      fontWeight: 900,
      fontSize: size * 0.56,
    }}
  >
    {ok ? '✓' : '✗'}
  </div>
);

/* ---------------------------------------------------------------- slides */

const S1Cover: SlideDef['C'] = ({ i, n }) => (
  <>
    <div style={{ position: 'absolute', left: 0, top: 0 }}>
      <Counter i={i} n={n} />
    </div>
    <SlideTitle size={98} top={70}>
      Claude حلّ مسألة
      <br />
      عمرها <Hl color="rgba(238,206,97,0.8)">167 عام</Hl>؟
    </SlideTitle>
    <SlideBody top={318} size={50} color={L.ink}>
      جائزتها مليون دولار
    </SlideBody>
    <ImageCard
      src={IMG + 'riemann-portrait.jpg'}
      natural={{ w: 1280, h: 1622 }}
      width={430}
      height={540}
      focus={{ x: 0.5, y: 0.22 }}
      tilt={2}
      credit="B. RIEMANN · 1863 · PUBLIC DOMAIN"
      style={{ left: 410, top: 440 }}
    >
      <StickerPill text="RIEMANN · 1859" tone="yellow" rotate={-4} size={26} style={{ left: -30, bottom: 34 }} />
    </ImageCard>
    <Card lift style={{ left: 10, top: 560, width: 290, height: 290, display: 'flex', alignItems: 'center', justifyContent: 'center', rotate: '-3deg' }}>
      <Img src={staticFile(IMG + 'claude-symbol.svg')} style={{ width: 170, height: 170 }} />
    </Card>
    <StickerPill text="?" tone="red" rotate={8} size={64} style={{ left: 280, top: 640 }} />
    <ValueTag value="$1M" caption="CLAY PRIZE" size={60} string={30} style={{ left: 92, top: 900 }} />
    <SwipeCue text="اسحب وشوف" style={{ left: 300, top: 1180 }} />
  </>
);

const S2Catch: SlideDef['C'] = ({ i, n }) => (
  <>
    <SlideHeader i={i} n={n} label="THE CATCH" />
    <SlideTitle top={100} size={74}>
      حتى اللي لقى الحل
      <br />
      <Hl color="rgba(230,88,86,0.45)">مازال ما فهمهش كامل</Hl>
    </SlideTitle>
    <SlideBody top={300}>والحل المكتوب فيه أكثر من 250,000 صفحة.</SlideBody>
    {/* the paper stack itself is a seam object (starts on slide 1) */}
    <ValueTag value="250,000" caption="PAGES · WRITTEN PROOF" size={78} string={70} style={{ left: 470, top: 520 }} />
    <StickerPill text="ما كاش بنادم يقراهم" tone="ink" rotate={-3} style={{ left: 480, top: 900 }} />
  </>
);

const PRIMES = new Set([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]);

const S3Primes: SlideDef['C'] = ({ i, n }) => (
  <>
    <SlideHeader i={i} n={n} label="WHAT ARE PRIMES" />
    <SlideTitle top={100} size={76}>
      الأعداد الأولية
      <br />
      تبان <Hl color="rgba(238,206,97,0.8)">عشوائية</Hl>
    </SlideTitle>
    <SlideBody top={300}>
      2، 3، 5، 7، 11… ما يتقسموش غير على 1 وعلى روحهم. وما كاش قاعدة واضحة وين يجي اللي موراه.
    </SlideBody>
    <div style={{ position: 'absolute', left: 0, top: 560, width: 940, display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 10 }}>
      {Array.from({ length: 50 }).map((_, k) => {
        const v = k + 1;
        const p = PRIMES.has(v);
        return (
          <div
            key={v}
            style={{
              height: 84,
              borderRadius: 14,
              border: p ? `3px solid ${L.ink}` : '2px solid rgba(11,15,21,0.18)',
              background: p ? A.yellow : 'rgba(238,238,234,0.6)',
              boxShadow: p ? '3px 4px 0 rgba(11,15,21,0.18)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: display,
              fontWeight: 900,
              fontSize: 36,
              color: p ? L.ink : L.faded,
            }}
          >
            {v}
          </div>
        );
      })}
    </div>
    <StickerPill text="PATTERN?" tone="red" rotate={-5} size={32} style={{ left: 620, top: 1060 }} />
    <div style={{ position: 'absolute', left: 0, top: 1080 }}>
      <Mono size={20}>15 PRIMES BETWEEN 1 AND 50</Mono>
    </div>
  </>
);

const S4Hypothesis: SlideDef['C'] = ({ i, n }) => (
  <>
    <SlideHeader i={i} n={n} label="THE HYPOTHESIS · 1859" />
    <SlideTitle top={100} size={72}>
      Riemann قال:
      <br />
      كاين <Hl color="rgba(50,175,122,0.4)">نظام مخبي</Hl>
    </SlideTitle>
    <SlideBody top={290} size={40}>
      في 1859 توقع بلي «الأصفار» نتاع الـ fonction zeta كامل راكبين على خط واحد. إذا صح، نفهمو كيفاش يتوزعو الأعداد الأولية.
    </SlideBody>
    <ImageCard
      src={IMG + 'riemann-1859-crop.jpg'}
      natural={{ w: 1160, h: 490 }}
      width={900}
      height={380}
      tilt={-1.2}
      credit="MONATSBERICHTE, BERLIN, NOV 1859 · PUBLIC DOMAIN"
      style={{ left: 20, top: 580 }}
    >
      {/* yellow box around "über die Anzahl der Primzahlen unter einer gegebenen Grösse" */}
      <div style={{ position: 'absolute', left: 8, top: 288, width: 820, height: 60, border: `4px solid ${A.yellow}`, borderRadius: 12, boxShadow: '0 0 0 2px rgba(11,15,21,0.5)' }} />
      <StickerPill text="NOV 1859" tone="yellow" rotate={4} size={28} style={{ right: -20, top: -24 }} />
    </ImageCard>
    <div style={{ position: 'absolute', left: 20, top: 1040, display: 'flex', alignItems: 'center', gap: 14 }}>
      <Mono size={22} color={L.ink} weight={800}>"ON THE NUMBER OF PRIMES</Mono>
    </div>
    <div style={{ position: 'absolute', left: 20, top: 1076 }}>
      <Mono size={22} color={L.ink} weight={800}>LESS THAN A GIVEN SIZE"</Mono>
    </div>
  </>
);

/** Hardy Z(t): real-valued zeta on the critical line; every crossing of the axis is a zero on the line. */
const ZetaGraph: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const t1 = 52;
  const amp = 4;
  const x = (t: number) => (t / t1) * width;
  const y = (z: number) => height / 2 - (z / amp) * (height / 2 - 20);
  const d = zeta.z.map(([t, z], k) => `${k ? 'L' : 'M'}${x(t).toFixed(1)} ${y(z).toFixed(1)}`).join(' ');
  return (
    <svg width={width} height={height} style={{ position: 'absolute', overflow: 'visible' }}>
      <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke={D.marker} strokeWidth={3} opacity={0.9} />
      <path d={d} fill="none" stroke={D.mono} strokeWidth={5} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 8px ${D.glow})` }} />
      {zeta.zeros.map((t) => (
        <g key={t}>
          <circle cx={x(t)} cy={height / 2} r={13} fill={D.marker} stroke={D.bg} strokeWidth={3} />
        </g>
      ))}
      {zeta.zeros.slice(0, 3).map((t) => (
        <text key={t} x={x(t)} y={height / 2 + 50} fill={D.mono} fontFamily={mono} fontWeight={700} fontSize={20} textAnchor="middle">
          {t.toFixed(1)}
        </text>
      ))}
    </svg>
  );
};

const S5Checked: SlideDef['C'] = ({ i, n }) => (
  <>
    <SlideHeader i={i} n={n} mode="dark" label="CHECKED ≠ PROVEN" />
    <SlideTitle top={100} size={74} color={D.text}>
      تشيكاو 10 تريليون…
      <br />
      <span style={{ color: D.marker }}>وما كفاش</span>
    </SlideTitle>
    <SlideBody top={300} color={D.text} size={40}>
      أول 10 تريليون صفر كامل على الخط. بصح الأصفار ما يكملوش، والرياضيات تحب إثبات، ماشي أمثلة.
    </SlideBody>
    <div style={{ position: 'absolute', left: 0, top: 500 }}>
      <Mono size={20} color={D.mono}>ζ ON THE CRITICAL LINE · Z(t), t = 0 TO 52</Mono>
    </div>
    <div style={{ position: 'absolute', left: 0, top: 550, width: 940, height: 380 }}>
      <ZetaGraph width={940} height={380} />
    </div>
    <div style={{ position: 'absolute', left: 600, top: 930, display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 22, height: 22, borderRadius: 99, background: D.marker }} />
      <Mono size={20} color={D.marker}>= A ZERO ON THE LINE</Mono>
    </div>
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 1010,
        padding: '22px 30px',
        borderRadius: 20,
        background: D.panel,
        border: `2px solid ${D.glow}`,
        boxShadow: `0 0 24px ${D.glow}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontFamily: display, fontWeight: 900, fontSize: 54, color: D.text, letterSpacing: '-0.01em' }}>10,000,000,000,000 ✓</div>
        <Mono size={20} color={D.mono}>ZEROS CHECKED BY COMPUTER</Mono>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ fontFamily: display, fontWeight: 900, fontSize: 64, color: D.delta, lineHeight: 1 }}>∞</div>
        <Mono size={18} color={D.delta}>STILL LEFT</Mono>
      </div>
    </div>
  </>
);

const S6Claim: SlideDef['C'] = ({ i, n }) => (
  <>
    <SlideHeader i={i} n={n} label="THE CLAIM · NOV 20, 2026" />
    <SlideTitle top={100} size={72}>
      باحث في Anthropic:
      <br />
      <Hl color="rgba(238,206,97,0.8)">لقيتو مع Claude</Hl>
    </SlideTitle>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40 }}>
      <Img src={staticFile(IMG + 'anthropic-logo.svg')} style={{ height: 34 }} />
      <span style={{ fontFamily: display, fontWeight: 900, fontSize: 40, color: L.mono }}>+</span>
      <Img src={staticFile(IMG + 'claude-logo.svg')} style={{ height: 58 }} />
    </div>
    <QuoteCard
      quote="I believe I have, working with Claude, discovered a proof of the Riemann hypothesis."
      who="LEVENT ALPÖGE · 4-PAGE NOTE · NOV 20, 2026"
      tone={A.yellow}
      size={50}
      style={{ left: 0, top: 440, width: 940 }}
    >
      <StickerPill text="CLAIM" tone="red" rotate={6} size={30} style={{ right: -14, top: -30 }} />
    </QuoteCard>
    <SlideBody top={900}>
      Levent Alpöge نشر ورقة فيها 4 صفحات، ويقول بلي الطريقة تحل حتى النسخة العامة.
    </SlideBody>
    <StickerPill text="مازال ما تأكدش" tone="ink" rotate={-3} style={{ left: 20, top: 1080 }} />
  </>
);

const S7Lean: SlideDef['C'] = ({ i, n }) => (
  <>
    <SlideHeader i={i} n={n} label="HOW TO CHECK IT" />
    <SlideTitle top={100} size={72}>
      ما كاش بنادم يقرا
      <br />
      <Hl color="rgba(238,206,97,0.8)">250,000 صفحة</Hl>
    </SlideTitle>
    <SlideBody top={300}>لهذا نشر الحل بـ Lean: برنامج يشيكي كل خطوة في الإثبات وحدو.</SlideBody>
    <PaperStack width={300} height={380} sheets={6} style={{ left: 560, top: 560 }} />
    {/* arrow right -> left (Arabic reading order) */}
    <svg width={200} height={60} style={{ position: 'absolute', left: 360, top: 720, overflow: 'visible' }}>
      <path d="M190 30 L20 30" stroke={L.ink} strokeWidth={6} strokeLinecap="round" />
      <path d="M44 8 L16 30 L44 52" fill="none" stroke={L.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <Card lift style={{ left: 0, top: 540, width: 360, height: 420, padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: display, fontWeight: 900, fontSize: 60, color: L.ink, lineHeight: 1 }}>Lean</span>
        <Mono size={18}>PROOF CHECKER</Mono>
      </div>
      {['STEP 1', 'STEP 2', 'STEP 3', '… STEP N'].map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, padding: '0 12px 0 18px', borderRadius: 14, border: '2.5px solid rgba(11,15,21,0.75)', background: '#F6F6F2' }}>
          <Mono size={22} color={L.ink}>{s}</Mono>
          <Check ok size={40} />
        </div>
      ))}
    </Card>
    <StickerPill text="كل خطوة تتشيكا" tone="green" rotate={-4} style={{ left: 40, top: 1000 }} />
  </>
);

const S8But: SlideDef['C'] = ({ i, n }) => (
  <>
    <SlideHeader i={i} n={n} label="BUT" />
    <SlideTitle top={100} size={76}>
      بصح Lean <Hl color="rgba(230,88,86,0.45)">ما يشيكيش كلش</Hl>
    </SlideTitle>
    <SlideBody top={290}>يشيكي المنطق. بصح ما يقدرش يقولك واش السؤال مكتوب صحيح في الكود.</SlideBody>
    <div style={{ position: 'absolute', left: 0, top: 470 }}>
      <Mono size={20}>EXAMPLE · HOW MATHLIB (LEAN) WRITES THE QUESTION</Mono>
    </div>
    <div
      dir="ltr"
      style={{
        position: 'absolute',
        left: 0,
        top: 510,
        width: 940,
        padding: '26px 30px',
        boxSizing: 'border-box',
        borderRadius: 20,
        background: D.bg,
        border: `4px solid ${A.yellow}`,
        boxShadow: theme.shadow.lift,
        fontFamily: mono,
        fontWeight: 700,
        fontSize: 27,
        lineHeight: 1.55,
        color: D.text,
        whiteSpace: 'pre',
      }}
    >
      <span style={{ color: D.marker }}>def</span> RiemannHypothesis : Prop :={'\n'}
      {'  '}∀ (s : ℂ) (_ : riemannZeta s = 0){'\n'}
      {'    '}(_ : ¬∃ n : ℕ, s = -2 * (n + 1)){'\n'}
      {'    '}(_ : s ≠ 1), <span style={{ color: D.delta }}>s.re = 1 / 2</span>
    </div>
    <StickerPill text="هذا لازم يكون صحيح" tone="yellow" rotate={-3} style={{ left: 520, top: 760 }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 880, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[
        { ok: true, ar: 'كل خطوة في الإثبات صحيحة', tag: 'LEAN CHECKS' },
        { ok: false, ar: 'واش هذا هو السؤال بالضبط؟', tag: 'HUMANS CHECK' },
      ].map((r) => (
        <div key={r.tag} dir="rtl" style={{ display: 'flex', alignItems: 'center', gap: 20, height: 104, padding: '0 24px', borderRadius: 18, border: `3px solid ${L.ink}`, background: L.surface, boxShadow: theme.shadow.card }}>
          <Check ok={r.ok} />
          <span style={{ fontFamily: arabic, fontWeight: 800, fontSize: 44, color: L.ink, paddingTop: 6 }}>{r.ar}</span>
          <div style={{ flex: 1 }} />
          <Mono size={18} color={r.ok ? A.green : A.red} weight={800}>{r.tag}</Mono>
        </div>
      ))}
    </div>
  </>
);

const S9Reactions: SlideDef['C'] = ({ i, n }) => (
  <>
    <SlideHeader i={i} n={n} label="REACTIONS" />
    <SlideTitle top={100} size={74}>
      الخبراء: تاريخي…
      <br />
      ولا <Hl color="rgba(238,206,97,0.8)">نستناو</Hl>؟
    </SlideTitle>
    <QuoteCard quote="It's a monumental moment in human history." who="BRIAN CONREY · RIEMANN HYPOTHESIS SPECIALIST" tone={A.green} size={50} style={{ left: 0, top: 340, width: 880, rotate: '-1deg' }}>
      <StickerPill text="WOW" tone="green" rotate={6} size={28} style={{ right: -20, top: -26 }} />
    </QuoteCard>
    <QuoteCard quote="Let's see if it compiles first." who="KEVIN BUZZARD · IMPERIAL COLLEGE LONDON" tone={A.red} size={50} style={{ left: 60, top: 680, width: 880, rotate: '1deg' }}>
      <StickerPill text="WAIT" tone="red" rotate={-6} size={28} style={{ left: -24, top: -26 }} />
    </QuoteCard>
    <SlideBody top={1000}>Conrey قالها قبل ما يشوف الحل كامل.</SlideBody>
  </>
);

const ProofDoc: React.FC<{ n: string; who: string; when: string; logo?: boolean; style?: React.CSSProperties }> = ({ n, who, when, logo, style }) => (
  <Card lift style={{ width: 400, height: 500, padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: 16, ...style }}>
    <Mono size={22} color={L.ink} weight={800}>{n}</Mono>
    <div style={{ height: 110, display: 'flex', alignItems: 'center' }}>
      {logo ? (
        <Img src={staticFile(IMG + 'claude-symbol.svg')} style={{ width: 96, height: 96 }} />
      ) : (
        <span style={{ fontFamily: display, fontWeight: 900, fontSize: 52, color: L.ink }}>Stanford</span>
      )}
    </div>
    {[90, 76, 84, 60, 88].map((w, k) => (
      <div key={k} style={{ height: 12, borderRadius: 6, background: '#D3D6D9', width: `${w}%` }} />
    ))}
    <div style={{ flex: 1 }} />
    <Mono size={18}>{who}</Mono>
    <Mono size={18} color={L.ink}>{when}</Mono>
  </Card>
);

const S10Twist: SlideDef['C'] = ({ i, n }) => (
  <>
    <SlideHeader i={i} n={n} label="PLOT TWIST" />
    <SlideTitle top={100} size={74}>
      ومن بعد ساعات…
      <br />
      <Hl color="rgba(238,206,97,0.8)">إثبات آخر</Hl>
    </SlideTitle>
    <ProofDoc n="PROOF #1" who="ANTHROPIC RESEARCHER + CLAUDE" when="NOV 20" logo style={{ left: 520, top: 340, rotate: '2deg' }} />
    <ProofDoc n="PROOF #2" who="STANFORD POSTDOC" when="SAME DAY" style={{ left: 20, top: 370, rotate: '-2deg' }} />
    <StickerPill text="نفس النهار" tone="yellow" rotate={-5} size={44} style={{ left: 330, top: 780 }} />
    <SlideBody top={930}>بروفيسور في Stanford قال بلي باحث في القسم نتاعو بعث إثبات آخر، بشكل مستقل.</SlideBody>
    <div style={{ position: 'absolute', left: 0, top: 1110 }}>
      <Mono size={20} color={A.red} weight={800}>NEITHER PROOF IS VERIFIED YET</Mono>
    </div>
  </>
);

const S11Save: SlideDef['C'] = ({ i, n }) => (
  <>
    <SlideHeader i={i} n={n} label="STATUS" />
    <SlideTitle top={100} size={72}>
      مازال ما تأكدش.
      <br />
      راقب 3 حوايج
    </SlideTitle>
    <MiniUI title="واش نستناو؟" label="SAVE THIS" width={940} style={{ left: 0, top: 340 }}>
      <MiniRow icon={<ServerIcon size={40} />} text="الكود يخدم؟" tag="COMPILES?" />
      <MiniRow icon={<SearchIcon size={40} />} text="الخبراء يأكدو؟" tag="REVIEW" />
      <MiniRow icon={<ShieldGlyph size={40} />} text="مجلة + عامين" tag="$1M PRIZE" highlighted={1} />
    </MiniUI>
    <Stamp text="UNVERIFIED" size={58} rotate={-10} style={{ left: 30, top: 790 }} />
    <SlideBody top={940} size={44} color={L.ink}>
      ابعثها لصاحبك اللي يقول AI ما يقدر يدير والو 👀
    </SlideBody>
  </>
);

const S12End: SlideDef['C'] = ({ i, n }) => (
  <>
    <div style={{ position: 'absolute', right: 0, top: 0 }}>
      <Counter i={i} n={n} />
    </div>
    <Card lift style={{ left: 60, top: 110, width: 820, padding: '34px 44px 36px' }}>
      <Mono size={20} color={A.red}>YOUR TURN</Mono>
      <div dir="rtl" style={{ fontFamily: arabic, fontWeight: 900, fontSize: 60, lineHeight: 1.2, color: L.ink, marginTop: 12 }}>
        تثيق في إثبات ما يفهمو حتى بنادم؟
      </div>
      <div dir="rtl" style={{ fontFamily: arabic, fontWeight: 700, fontSize: 38, color: L.inkSoft, marginTop: 10 }}>
        قولنا في الكومنتار 👇
      </div>
    </Card>
    <ChoiceButton text="إيه" tone="green" p={1} style={{ left: 520, top: 480 }} />
    <ChoiceButton text="لا" tone="red" p={1} style={{ left: 160, top: 480 }} />
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
        <span style={{ fontFamily: arabic, fontWeight: 800, fontSize: 42, paddingTop: 4 }}>تابع باش تعرف الحكم</span>
        <span style={{ fontFamily: display, fontWeight: 900, fontSize: 38 }}>←</span>
      </div>
    </div>
  </>
);

export const RIEMANN_SLIDES: SlideDef[] = [
  { mode: 'light', C: S1Cover },
  { mode: 'light', C: S2Catch },
  { mode: 'light', C: S3Primes },
  { mode: 'light', C: S4Hypothesis },
  { mode: 'dark', C: S5Checked },
  { mode: 'light', C: S6Claim },
  { mode: 'light', C: S7Lean },
  { mode: 'light', C: S8But },
  { mode: 'light', C: S9Reactions },
  { mode: 'light', C: S10Twist },
  { mode: 'light', C: S11Save },
  { mode: 'light', C: S12End },
];

export const RiemannCarousel: React.FC<{ variant: Variant }> = ({ variant }) => (
  <CarouselStrip
    variant={variant}
    slides={RIEMANN_SLIDES}
    seams={({ w, box }) => (
      // the 250,000-page stack starts on the cover's right edge and lands on slide 2
      <div style={{ position: 'absolute', left: w - 120, top: box.y + box.s * 560, scale: `${box.s}`, transformOrigin: '0 0' }}>
        <PaperStack width={460} height={560} sheets={8} />
      </div>
    )}
  />
);
