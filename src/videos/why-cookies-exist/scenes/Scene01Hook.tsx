import React from 'react';
import { DeviceMock } from '../../../components/Device';
import { DrawPath } from '../../../components/Diagram';
import { CursorIcon, Sneaker } from '../../../components/Icons';
import { Mono, StickerPill } from '../../../components/Labels';
import { ConsentBanner, NewsIcon, PhoneGlyph, ProfileCard, TicketChip } from '../../../components/Web';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';

const L = theme.light;
const A = theme.accent;

const HISTORY = ['dailynews.site', 'shoe-shop.site', 'phonemarket.site'];

/**
 * Hook: a profile about "you" fills up from frame 0. Pull back: it sits in ADS CO.'s database,
 * a site you never visited (history card, 0 VISITS). Then a phone with a cookie banner rises
 * and a cursor taps Accept.
 */
export const Scene01Hook: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  // the profile card is already moving on frame 0
  const card = pop(t, -0.12, fps, SPRING.soft);
  const rows = [1, 2, 3].map((i) => pop(t, e(i), fps, SPRING.pop));
  const active = t < e(2) ? 0 : t < e(3) ? 1 : 2;
  const pull = ramp(t, e(4) - 0.05, e(4) + 0.55, EASE_IN_OUT);
  const frame = ramp(t, e(4) + 0.1, e(4) + 0.8, EASE_IN_OUT);
  const hist = pop(t, e(4) + 0.35, fps, SPRING.soft);
  const visits = pop(t, e(5), fps, SPRING.pop);
  const strike = ramp(t, e(5) + 0.1, e(5) + 0.4);
  // part 2: the phone with the banner
  const away = ramp(t, e(6) - 0.1, e(6) + 0.45, EASE_IN_OUT);
  const phone = pop(t, e(6) + 0.05, fps, SPRING.soft);
  const banner = pop(t, e(6) + 0.55, fps, SPRING.pop);
  const cur = ramp(t, e(7) - 0.75, e(7) - 0.05, EASE_IN_OUT);
  const press = Math.max(0, 1 - Math.abs(t - e(7) - 0.05) * 7);
  const tapped = t > e(7);
  const ticket = pop(t, e(7) + 0.35, fps, SPRING.pop);

  // card geometry: centred, then shrinks into the database frame
  const W = 660;
  const scale = mix(1, 0.74, pull);
  const top = mix(500, 470, pull);

  const rowData = [
    { icon: <NewsIcon size={52} fill="#F4F4F0" />, text: 'قرا: أخبار' },
    { icon: <Sneaker width={84} />, text: 'شاف: سبّاط' },
    { icon: <PhoneGlyph size={52} fill="#DCE1F6" />, text: 'حب يشري: تيليفون' },
  ];

  const P = { x: 540 - 220, y: 470, w: 440, h: 820 };
  const pressX = P.x + 112;
  const pressY = P.y + P.h - 118;

  return (
    <>
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - away * 0.85, translate: `0px ${away * -80}px`, scale: `${1 - away * 0.06}` }}>
        {/* ADS CO. database frame drawn around the card */}
        <DrawPath d="M175 450 H905 V905 H175 Z" p={frame} color={A.red} width={5} dashed />
        <div style={{ position: 'absolute', left: 196, top: 418, opacity: frame, background: A.red, borderRadius: 10, padding: '8px 16px' }}>
          <Mono size={22} color="#FFFFFF" weight={800}>
            ADS CO. · DATABASE
          </Mono>
        </div>

        <div style={{ position: 'absolute', left: 540 - W / 2, top, width: W, transformOrigin: '50% 0%', scale: `${scale}`, opacity: Math.min(1, card * 3), translate: `0px ${(1 - Math.min(card, 1)) * 140}px` }}>
          <ProfileCard
            width={W}
            title="YOU"
            rows={rowData.map((r, i) => ({ ...r, p: rows[i], hl: pull > 0.5 ? 0 : active === i && t >= e(i + 1) ? 1 : 0 }))}
          />
        </div>

        {/* your browsing history: ADS CO. is not in it */}
        <div
          style={{
            position: 'absolute',
            left: 175,
            top: 960,
            width: 730,
            background: L.surface,
            border: `3px solid ${L.ink}`,
            borderRadius: theme.radius.card,
            boxShadow: theme.shadow.card,
            padding: '18px 26px',
            boxSizing: 'border-box',
            opacity: Math.min(1, hist * 3),
            translate: `0px ${(1 - Math.min(hist, 1)) * 60}px`,
          }}
        >
          <Mono size={20} color={L.mono}>
            YOUR HISTORY
          </Mono>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            {HISTORY.map((h) => (
              <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ color: A.green, fontSize: 30, fontWeight: 900 }}>✓</span>
                <Mono size={24} color={L.ink} style={{ textTransform: 'none' }}>
                  {h}
                </Mono>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
              <span style={{ color: A.red, fontSize: 30, fontWeight: 900 }}>✕</span>
              <Mono size={24} color={A.red} weight={800} style={{ textTransform: 'none' }}>
                ads-co.site
              </Mono>
              <div style={{ position: 'absolute', left: 44, top: 17, height: 4, width: 190 * strike, background: A.red }} />
            </div>
          </div>
        </div>
        <StickerPill text="0 VISITS" tone="red" p={visits} rotate={-6} size={40} style={{ left: 600, top: 1130 }} />
      </div>

      {/* part 2: the button you press every day */}
      {phone > 0.001 && (
        <DeviceMock width={P.w} height={P.h} style={{ left: P.x, top: P.y + (1 - Math.min(phone, 1)) * 700, opacity: Math.min(1, phone * 3), rotate: `${mix(6, -2, Math.min(phone, 1))}deg` }}>
          {/* a generic article page */}
          <div style={{ position: 'absolute', left: 26, right: 26, top: 70, display: 'flex', flexDirection: 'column', gap: 14, opacity: 0.85 }}>
            <div style={{ height: 160, borderRadius: 16, background: '#C9CFE3' }} />
            {[0.95, 0.8, 0.9, 0.6, 0.85, 0.7].map((wd, i) => (
              <div key={i} style={{ height: 16, width: `${wd * 100}%`, borderRadius: 9, background: '#CFD2CC' }} />
            ))}
          </div>
          <div style={{ position: 'absolute', inset: 0, background: `rgba(11,15,21,${0.25 * Math.min(1, banner)})` }} />
          <ConsentBanner
            width={P.w - 44}
            scale={0.82}
            style={{ left: 22 - 2, bottom: 40, translate: `0px ${(1 - Math.min(banner, 1)) * 260}px` }}
            buttons={[
              { label: 'ACCEPT', tone: 'ink', press, hl: tapped ? ramp(t, e(7), e(7) + 0.15) : 0, hlColor: A.red },
              { label: 'SETTINGS', tone: 'outline' },
            ]}
          />
        </DeviceMock>
      )}
      {cur > 0 && (
        <div style={{ position: 'absolute', left: mix(820, pressX + 30, cur), top: mix(1250, pressY + 10, cur), scale: `${1 - press * 0.15}` }}>
          {press > 0 && <div style={{ position: 'absolute', left: -40 + 6, top: -40 + 6, width: 80, height: 80, borderRadius: 99, border: `4px solid ${L.ink}`, opacity: press, scale: `${1.6 - press * 0.6}` }} />}
          <CursorIcon size={86} fill="#FFFFFF" stroke={3.4} />
        </div>
      )}
      {/* the spine object pops out of the tap: the cookie */}
      <TicketChip id="77X9" kicker="COOKIE" width={250} tone="red" style={{ left: 640, top: 600, opacity: Math.min(1, ticket * 3), scale: `${0.4 + 0.6 * ticket}`, rotate: `${mix(-30, 8, Math.min(1, ticket))}deg` }} />
    </>
  );
};
