import React from 'react';
import { DrawPath } from '../../../components/Diagram';
import { BrainIcon } from '../../../components/Icons';
import { Mono, PacketChip, SpeechBubble } from '../../../components/Labels';
import { TermLabel } from '../../../components/Web';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../../theme';
import { BROWSER_EDGE, LINE_Y, SERVER_EDGE, SiteServer, STAGE, YouBrowser, YouTag } from './parts';

const L = theme.light;
const A = theme.accent;

const TRAVEL = 0.65;

/**
 * Hardest idea: HTTP has no memory. Every page sends a fresh request and the server greets you
 * like a stranger. Log in (green check, memory slot fills), go to the next page... forgotten.
 */
export const Scene03Stateless: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  // requests: [sent at, page label]
  const reqs: [number, string][] = [
    [e(1), 'GET /'],
    [e(3), 'GET /shoes'],
    [e(5) + 0.15, 'POST /login'],
    [e(6), 'GET /cart'],
  ];
  const page = t < e(3) ? 1 : t < e(5) ? 2 : t < e(6) ? 2 : 3;
  const term = pop(t, e(2), fps, SPRING.pop);
  const slash = ramp(t, e(2) + 0.15, e(2) + 0.45);
  const brain = pop(t, e(2) - 0.1, fps, SPRING.pop);

  // server replies
  const reply = (() => {
    if (t >= e(7)) return { text: 'شكون نتا؟', p: pop(t, e(7), fps, SPRING.pop), red: true };
    if (t >= e(5) + 0.15 + TRAVEL) return { text: 'مرحبا!', p: pop(t, e(5) + 0.15 + TRAVEL, fps, SPRING.pop), red: false };
    if (t >= e(4)) return { text: 'شكون نتا؟', p: pop(t, e(4), fps, SPRING.pop), red: true };
    if (t >= e(1) + TRAVEL) return { text: 'شكون نتا؟', p: pop(t, e(1) + TRAVEL, fps, SPRING.pop), red: true };
    return null;
  })();
  const loginP = pop(t, e(5), fps, SPRING.pop);
  const checkP = pop(t, e(5) + 0.15 + TRAVEL + 0.1, fps, SPRING.pop);
  const forget = ramp(t, e(7), e(7) + 0.35);
  const slotFill = Math.min(checkP, 1) * (1 - forget);

  return (
    <>
      <YouBrowser>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Mono size={20} color={L.mono}>
            PAGE
          </Mono>
          <span style={{ fontFamily: 'inherit', fontSize: 96, fontWeight: 900, color: L.ink, lineHeight: 1, scale: `${1 + 0.15 * Math.max(0, 1 - Math.abs(t - (page === 2 ? e(3) : e(6))) * 5)}` }}>{page}</span>
        </div>
        {/* login form -> logged in */}
        <div
          style={{
            position: 'absolute',
            left: 22,
            right: 22,
            bottom: 24,
            height: 120,
            borderRadius: 16,
            border: `3px solid ${slotFill > 0.5 ? A.green : L.ink}`,
            background: slotFill > 0.5 ? '#DDEFE6' : '#F4F4F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            opacity: Math.min(1, loginP * 3),
            scale: `${0.8 + 0.2 * Math.min(1, loginP)}`,
          }}
        >
          {forget > 0.5 ? (
            <span style={{ fontSize: 60, fontWeight: 900, color: L.faded }}>?</span>
          ) : slotFill > 0.5 ? (
            <>
              <span style={{ fontSize: 54, fontWeight: 900, color: A.green }}>✓</span>
              <Mono size={24} color={L.ink} weight={800}>
                LOGGED IN
              </Mono>
            </>
          ) : (
            <Mono size={24} color={L.ink} weight={800}>
              LOGIN ▸
            </Mono>
          )}
        </div>
      </YouBrowser>
      <YouTag />
      <DrawPath d={`M${BROWSER_EDGE - 14} ${LINE_Y} H${SERVER_EDGE + 14}`} p={1} dashed width={5} color={L.ink} opacity={0.6} />
      <SiteServer blink={t * 3} glow={reply && !reply.red ? 0.5 * Math.min(1, reply.p) : 0} />

      {/* server memory: slot fills on login, then empties */}
      <div style={{ position: 'absolute', left: STAGE.server.x, top: STAGE.server.y + STAGE.server.h + 26, width: STAGE.server.w, display: 'flex', gap: 10 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 54,
              borderRadius: 12,
              border: `3px ${i === 0 && slotFill > 0.5 ? 'solid' : 'dashed'} ${i === 0 && slotFill > 0.5 ? A.green : L.faded}`,
              background: i === 0 && slotFill > 0.01 ? `rgba(50,175,122,${0.25 * slotFill})` : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: i === 0 && slotFill > 0.5 ? A.green : L.faded,
              fontSize: 30,
              fontWeight: 900,
            }}
          >
            {i === 0 && slotFill > 0.5 ? '✓' : '?'}
          </div>
        ))}
      </div>

      {/* requests travel browser -> server */}
      {reqs.map(([at, label]) => {
        const p = ramp(t, at, at + TRAVEL, EASE_IN_OUT);
        if (p <= 0 || p >= 1) return null;
        const x = mix(BROWSER_EDGE - 30, SERVER_EDGE - 60, p);
        return <PacketChip key={label} label={label} size={22} style={{ left: x - 110, top: LINE_Y - 34, opacity: Math.min(1, p * 6, (1 - p) * 6) }} />;
      })}

      {reply && (
        <SpeechBubble p={reply.p} tail="left" size={50} style={{ left: STAGE.server.x + 30, top: 452 }}>
          <span style={{ color: reply.red ? L.ink : A.green }}>{reply.text}</span>
        </SpeechBubble>
      )}

      {/* the memory is crossed out */}
      <div style={{ position: 'absolute', left: SERVER_EDGE - 70, top: STAGE.server.y - 40, opacity: Math.min(1, brain * 3), scale: `${0.5 + 0.5 * brain}` }}>
        <div style={{ width: 96, height: 96, borderRadius: 99, background: L.surface, border: `3px solid ${L.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: theme.shadow.card }}>
          <BrainIcon size={62} />
        </div>
        <div style={{ position: 'absolute', left: -6, top: 44, width: 108 * slash, height: 9, borderRadius: 6, background: A.red, rotate: '-40deg', transformOrigin: '54px 4px' }} />
      </div>

      <TermLabel term="HTTP" gloss="بلا ذاكرة" p={term} size={46} style={{ left: 540, top: 1090, translate: '-50% 0' }} />
    </>
  );
};
