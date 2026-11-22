import React from 'react';
import { CartIcon, ClockIcon, Sneaker } from '../../../components/Icons';
import { Mono, StickerPill } from '../../../components/Labels';
import { BrowserCard, TicketChip, UserGlyph } from '../../../components/Web';
import { arabic } from '../../../fonts';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN, EASE_IN_OUT, SPRING, theme } from '../../../theme';

const L = theme.light;
const A = theme.accent;

const B = { x: 175, y: 470, w: 730, h: 700 };
const PAGES = ['HOME', 'SHOES', 'SHOE · 42'];

/**
 * The good use, one shopping story: log in once and stay logged in across pages; add shoes to
 * the cart, close the tab; tomorrow the site still has your cart. The ticket rides on every page.
 */
export const Scene05Remember: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  const win = pop(t, e(0) + 0.1, fps, SPRING.soft);
  const login = pop(t, e(1), fps, SPRING.pop);
  // page flips while logged in
  const flips = [e(2), e(2) + 0.5, e(2) + 1.0];
  const pageIdx = flips.filter((f) => t >= f).length; // 0..3
  const page = Math.max(0, pageIdx - 1);
  const flipK = Math.max(0, ...flips.map((f) => 1 - Math.abs(t - f) * 6));
  const shoeFly = ramp(t, e(3), e(3) + 0.6, EASE_IN_OUT);
  const badge = pop(t, e(3) + 0.55, fps, SPRING.pop);
  const close = ramp(t, e(4), e(4) + 0.35, EASE_IN);
  const tomorrow = pop(t, e(5), fps, SPRING.pop);
  const reopenAt = Math.max(e(6), e(5) + 0.45);
  const reopen = pop(t, reopenAt, fps, SPRING.soft);
  const pulse = t > reopenAt + 0.3 ? 0.5 + 0.5 * Math.sin((t - reopenAt) * 7) : 0;
  const open = t < e(4) ? 1 : t < reopenAt ? 1 - close : Math.min(1, reopen);
  const ticketGlow = flipK > 0 ? flipK : t > reopenAt ? 0.6 * Math.min(1, reopen) : 0;

  const loggedIn = t >= e(1) + 0.1;

  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: Math.min(1, win * 3) * (t < reopenAt ? 1 - close * 0.9 : 1),
          scale: `${t >= e(4) && t < reopenAt ? 1 - close * 0.6 : 1}`,
          transformOrigin: '540px 1180px',
        }}
      >
        <BrowserCard
          width={B.w}
          height={B.h}
          url={`sneako.shop/${['', 'shoes', 'shoes/42'][Math.min(page, 2)]}`}
          style={{ left: B.x, top: B.y, translate: `0px ${(1 - Math.min(win, 1)) * 90}px`, scale: `${open}` }}
        >
          {/* site header: login chip + cart */}
          <div style={{ position: 'absolute', left: 22, right: 22, top: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative' }}>
              <CartIcon size={64} />
              <div
                style={{
                  position: 'absolute',
                  right: -14,
                  top: -12,
                  width: 40,
                  height: 40,
                  borderRadius: 99,
                  background: t > reopenAt ? A.green : L.ink,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  fontWeight: 900,
                  opacity: Math.min(1, badge * 3),
                  scale: `${0.5 + 0.5 * badge + pulse * 0.15}`,
                  boxShadow: t > reopenAt ? `0 0 ${20 * pulse}px ${A.green}` : 'none',
                }}
              >
                1
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 16px',
                borderRadius: 999,
                border: `3px solid ${loggedIn ? A.green : L.ink}`,
                background: loggedIn ? '#DDEFE6' : '#F4F4F0',
                scale: `${1 + 0.12 * Math.max(0, 1 - Math.abs(t - e(1) - 0.1) * 5)}`,
              }}
            >
              <UserGlyph size={30} />
              <Mono size={20} color={L.ink} weight={800}>
                {loggedIn ? '✓ CONNECTÉ' : 'LOGIN'}
              </Mono>
            </div>
          </div>

          {/* page body slides on each flip */}
          <div style={{ position: 'absolute', left: 22, right: 22, top: 110, bottom: 22, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, translate: `${flipK * -40}px 0px`, opacity: 1 - flipK * 0.5 }}>
              <Mono size={22} color={L.mono}>
                {PAGES[page]}
              </Mono>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 46, height: 300, borderRadius: 18, background: '#DCE1F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ opacity: 1 - shoeFly, translate: `${shoeFly * -150}px ${shoeFly * -260}px`, scale: `${1 - shoeFly * 0.7}` }}>
                  <Sneaker width={300} />
                </div>
              </div>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 370, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ height: 70, padding: '0 26px', borderRadius: 14, background: L.ink, display: 'flex', alignItems: 'center', scale: `${1 - 0.08 * Math.max(0, 1 - Math.abs(t - e(3)) * 6)}` }}>
                  <span dir="rtl" style={{ fontFamily: arabic, fontWeight: 800, fontSize: 36, color: '#F4F4F0', paddingTop: 4 }}>
                    زيد للسلة
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
                  <div style={{ height: 14, width: 200, borderRadius: 8, background: '#D5D7D2' }} />
                  <div style={{ height: 14, width: 140, borderRadius: 8, background: '#D5D7D2' }} />
                </div>
              </div>
            </div>
          </div>
        </BrowserCard>
        {/* the cookie rides along with every page */}
        <TicketChip id="48213" width={200} glow={ticketGlow} style={{ left: B.x + B.w - 150, top: B.y + B.h - 60, rotate: '-5deg', scale: `${open}` }} />
      </div>

      {/* closed tab stub + tomorrow */}
      {t >= e(4) + 0.2 && t < reopenAt + 0.2 && (
        <div style={{ position: 'absolute', left: 540, top: 1150, translate: '-50% 0', opacity: 1 - ramp(t, reopenAt - 0.1, reopenAt + 0.2) }}>
          <Mono size={24} color={L.mono}>
            TAB CLOSED
          </Mono>
        </div>
      )}
      <StickerPill
        text="غدوة"
        tone="ink"
        p={tomorrow}
        rotate={-5}
        size={48}
        icon={<ClockIcon size={42} color="#F4F4F0" hand={(t - e(5)) * 1.2} />}
        style={{ left: 540, top: mix(760, 420, ramp(t, reopenAt, reopenAt + 0.5)), translate: '-50% 0' }}
      />
    </>
  );
};
