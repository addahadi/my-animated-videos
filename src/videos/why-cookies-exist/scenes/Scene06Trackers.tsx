import React from 'react';
import { DrawPath, NodeBox } from '../../../components/Diagram';
import { Sneaker } from '../../../components/Icons';
import { Mono, StickerPill } from '../../../components/Labels';
import { NewsIcon, PhoneGlyph, ProfileCard, TermLabel } from '../../../components/Web';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';

const D = theme.dark;
const A = theme.accent;

const SITES = ['NEWS', 'RECIPES', 'SHOES', 'SPORT', 'PHONES', 'TRAVEL', 'MUSIC', 'CARS', 'GAMES'];
const TW = 220;
const TH = 130;
const GAP = 35;
const GX = 175;
const GY = 820;
const tilePos = (i: number) => ({ x: GX + (i % 3) * (TW + GAP), y: GY + Math.floor(i / 3) * (TH + GAP) });
const ADS = { x: 175, y: 450, w: 270, h: 260 };
const ADS_IN: [number, number] = [ADS.x + ADS.w / 2, ADS.y + ADS.h];

/**
 * Blueprint: the advertiser drops the SAME ticket (ID 77X9) on thousands of sites. Every site you
 * visit reports back, and the profile from the hook rebuilds. These are third-party cookies.
 */
export const Scene06Trackers: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  const warn = pop(t, e(1), fps, SPRING.pop);
  const ads = pop(t, e(2), fps, SPRING.pop);
  const tiles = SITES.map((_, i) => pop(t, e(3) + i * 0.06, fps, SPRING.pop));
  const ids = SITES.map((_, i) => pop(t, e(4) + i * 0.05, fps, SPRING.pop));
  const faint = ramp(t, e(5), e(5) + 0.6, EASE_IN_OUT);
  // the three sites you actually visit, in order: NEWS, SHOES, PHONES
  const visits = [
    { i: 0, at: e(6) },
    { i: 2, at: e(7) },
    { i: 4, at: e(8) },
  ];
  const profile = pop(t, e(6) - 0.2, fps, SPRING.soft);
  const term = pop(t, e(9), fps, SPRING.pop);
  const tag = pop(t, e(9) + 0.3, fps, SPRING.pop);
  const gridDim = ramp(t, e(9) - 0.2, e(9) + 0.25) * 0.65;
  const adsGlow = Math.max(0.25, ...visits.map((v) => Math.max(0, 1 - Math.abs(t - v.at - 0.55) * 2.5)));

  const icons = [<NewsIcon key="n" size={46} fill="#F4F4F0" />, <Sneaker key="s" width={74} />, <PhoneGlyph key="p" size={46} fill="#DCE1F6" />];
  const texts = ['قرا: أخبار', 'شاف: سبّاط', 'حب يشري: تيليفون'];

  return (
    <>
      {/* lines from every site to the advertiser (faint), visited ones light up */}
      {SITES.map((_, i) => {
        const { x, y } = tilePos(i);
        const v = visits.find((vv) => vv.i === i);
        const lit = v ? ramp(t, v.at, v.at + 0.55, EASE_IN_OUT) : 0;
        const d = `M${x + TW / 2} ${y} Q${x + TW / 2} ${ADS_IN[1] + 60} ${ADS_IN[0]} ${ADS_IN[1] + 4}`;
        return (
          <React.Fragment key={i}>
            <DrawPath d={d} p={faint} dashed width={3} color={D.mono} opacity={0.35} />
            {lit > 0 && <DrawPath d={d} p={lit} width={6} color={D.marker} glow={D.marker} />}
          </React.Fragment>
        );
      })}

      {/* the advertiser */}
      <div style={{ position: 'absolute', inset: 0, opacity: Math.min(1, ads * 3), scale: `${0.6 + 0.4 * ads}`, transformOrigin: `${ADS.x + ADS.w / 2}px ${ADS.y + ADS.h / 2}px` }}>
        <NodeBox
          icon={
            <div style={{ fontSize: 70, lineHeight: 1 }}>
              <svg width="96" height="70" viewBox="0 0 96 70">
                <rect x="4" y="4" width="88" height="62" rx="12" fill="none" stroke={A.red} strokeWidth="5" />
                <text x="48" y="48" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="900" fontSize="34" fill={A.red}>
                  AD
                </text>
              </svg>
            </div>
          }
          label="ADS CO."
          mode="dark"
          width={ADS.w}
          height={ADS.h}
          borderColor={A.red}
          glow={adsGlow}
          glowColor={A.red}
          style={{ left: ADS.x, top: ADS.y }}
        />
      </div>
      <StickerPill text="!" tone="red" p={warn} rotate={8} size={50} style={{ left: ADS.x + ADS.w - 30, top: ADS.y - 30 }} />

      {/* the profile rebuilds next to the advertiser */}
      <div style={{ position: 'absolute', left: 475, top: 450, width: 430, opacity: Math.min(1, profile * 3), translate: `${(1 - Math.min(profile, 1)) * 60}px 0px` }}>
        <ProfileCard
          width={430}
          title="ID 77X9"
          mode="dark"
          rowH={70}
          textSize={34}
          rows={visits.map((v, k) => ({ icon: icons[k], text: texts[k], p: pop(t, v.at + 0.45, fps, SPRING.pop), hl: t > v.at + 0.45 && t < v.at + 1.2 ? 1 : 0 }))}
        />
      </div>

      {/* thousands of sites, each with the same advertiser ticket */}
      {SITES.map((s, i) => {
        const { x, y } = tilePos(i);
        const v = visits.find((vv) => vv.i === i);
        const lit = v ? Math.max(0, Math.min(1, ramp(t, v.at - 0.05, v.at + 0.15) - ramp(t, v.at + 1.3, v.at + 1.7) * 0.6)) : 0;
        const p = tiles[i];
        return (
          <div
            key={s}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: TW,
              height: TH,
              borderRadius: 18,
              background: D.panel,
              border: `3px solid ${lit > 0.3 ? D.marker : D.glow}`,
              boxShadow: lit > 0 ? `0 0 ${30 * lit}px rgba(129,225,200,0.7)` : 'none',
              boxSizing: 'border-box',
              opacity: Math.min(1, p * 3) * (1 - gridDim),
              scale: `${0.6 + 0.4 * p}`,
              padding: '14px 16px',
            }}
          >
            <Mono size={20} color={D.text} weight={800}>
              {s}
            </Mono>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              <div style={{ height: 10, width: 70, borderRadius: 6, background: 'rgba(179,226,251,0.25)' }} />
              <div style={{ height: 10, width: 40, borderRadius: 6, background: 'rgba(179,226,251,0.25)' }} />
            </div>
            {/* the advertiser's ticket on this site */}
            <div
              style={{
                position: 'absolute',
                right: 10,
                bottom: 10,
                padding: '4px 10px',
                borderRadius: 8,
                background: A.red,
                border: `2px solid ${lit > 0.3 ? D.delta : '#0B0F15'}`,
                boxShadow: lit > 0.3 ? `0 0 16px ${D.delta}` : 'none',
                opacity: Math.min(1, ids[i] * 3),
                scale: `${0.5 + 0.5 * ids[i]}`,
              }}
            >
              <Mono size={18} color="#FFFFFF" weight={800}>
                ID 77X9
              </Mono>
            </div>
          </div>
        );
      })}

      {/* "thousands" */}
      <div style={{ position: 'absolute', left: 540, top: 1278, translate: '-50% 0', opacity: Math.min(1, tiles[8] * 2) * (1 - ramp(t, e(9) - 0.3, e(9))) }}>
        <Mono size={22} color={D.mono}>
          × 1000s OF SITES
        </Mono>
      </div>

      {/* the name of the thing */}
      <TermLabel term="third-party cookies" gloss="cookie نتاع شركة أخرى" p={term} mode="dark" size={40} style={{ left: 540, top: mix(1000, 975, Math.min(1, term)), translate: '-50% 0' }} />
      <StickerPill text="3RD PARTY" tone="red" p={tag} rotate={-6} size={30} style={{ left: ADS.x + 30, top: ADS.y + ADS.h - 24 }} />
    </>
  );
};
