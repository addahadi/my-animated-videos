import React from 'react';
import { DrawPath } from '../../../components/Diagram';
import { SpeechBubble } from '../../../components/Labels';
import { evAt, mix, pop, ramp, useClock, type SceneProps } from '../../../lib/time';
import { SPRING, theme } from '../../../theme';
import { BROWSER_EDGE, LINE_Y, SERVER_EDGE, SiteServer, STAGE, YouBrowser, YouTag } from './parts';

const L = theme.light;

/** The problem: your browser and the site's server meet; the server doesn't remember you. */
export const Scene02Problem: React.FC<SceneProps> = ({ events }) => {
  const { t, fps } = useClock();
  const e = (i: number) => evAt(events, i);

  const br = pop(t, e(0) + 0.25, fps, SPRING.soft);
  const sv = pop(t, e(1), fps, SPRING.pop);
  const line = ramp(t, e(1) + 0.25, e(1) + 0.8);
  const q = pop(t, e(2), fps, SPRING.pop);
  const shake = t > e(2) && t < e(2) + 0.6 ? Math.sin((t - e(2)) * 40) * 6 * (1 - (t - e(2)) / 0.6) : 0;
  // memory slots on the server stay empty
  const slots = ramp(t, e(2) + 0.3, e(2) + 0.7);

  return (
    <>
      <div style={{ position: 'absolute', inset: 0, opacity: Math.min(1, br * 3), translate: `${(1 - Math.min(br, 1)) * 120}px 0px` }}>
        <YouBrowser>
          <div style={{ position: 'absolute', left: 24, right: 24, top: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ height: 120, borderRadius: 14, background: '#DCE1F6' }} />
            {[0.9, 0.7, 0.8, 0.5].map((w, i) => (
              <div key={i} style={{ height: 14, width: `${w * 100}%`, borderRadius: 8, background: '#D5D7D2' }} />
            ))}
          </div>
        </YouBrowser>
        <YouTag />
      </div>
      <DrawPath d={`M${BROWSER_EDGE - 14} ${LINE_Y} H${SERVER_EDGE + 14}`} p={line} dashed width={5} color={L.ink} />
      <div style={{ position: 'absolute', inset: 0, opacity: Math.min(1, sv * 3), scale: `${0.6 + 0.4 * sv}`, transformOrigin: `${STAGE.server.x + 125}px ${LINE_Y}px`, rotate: `${shake}deg` }}>
        <SiteServer />
      </div>
      {/* the server's memory: three empty slots */}
      <div style={{ position: 'absolute', left: STAGE.server.x, top: STAGE.server.y + STAGE.server.h + 26, width: STAGE.server.w, display: 'flex', gap: 10, opacity: slots }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ flex: 1, height: 54, borderRadius: 12, border: `3px dashed ${L.faded}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: L.faded, fontSize: 30, fontWeight: 900 }}>
            ?
          </div>
        ))}
      </div>
      <SpeechBubble text="شكون نتا؟" p={q} tail="left" size={52} style={{ left: STAGE.server.x + 40, top: mix(470, 452, Math.min(1, q)) }} />
    </>
  );
};
