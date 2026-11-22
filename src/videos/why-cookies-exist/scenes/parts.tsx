import React from 'react';
import { NodeBox } from '../../../components/Diagram';
import { ServerIcon } from '../../../components/Icons';
import { Mono } from '../../../components/Labels';
import { BrowserCard, UserGlyph } from '../../../components/Web';
import { theme } from '../../../theme';

const L = theme.light;

/** Shared stage for scenes 2-4: your browser on the right (RTL reading), the site's server on the left. */
export const STAGE = {
  browser: { x: 585, y: 560, w: 320, h: 400 },
  server: { x: 175, y: 620, w: 250, h: 250 },
};
export const LINE_Y = STAGE.server.y + STAGE.server.h / 2;
export const BROWSER_EDGE = STAGE.browser.x;
export const SERVER_EDGE = STAGE.server.x + STAGE.server.w;

export const YouBrowser: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; url?: string }> = ({ style, children, url = 'sneako.shop' }) => (
  <BrowserCard width={STAGE.browser.w} height={STAGE.browser.h} url={url} style={{ left: STAGE.browser.x, top: STAGE.browser.y, ...style }}>
    {children}
  </BrowserCard>
);

export const YouTag: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{ position: 'absolute', left: STAGE.browser.x + STAGE.browser.w / 2, top: STAGE.browser.y + STAGE.browser.h + 22, translate: '-50% 0', display: 'flex', alignItems: 'center', gap: 10, ...style }}>
    <UserGlyph size={34} />
    <Mono size={22} color={L.ink} weight={800}>
      YOU
    </Mono>
  </div>
);

export const SiteServer: React.FC<{ glow?: number; glowColor?: string; style?: React.CSSProperties; blink?: number }> = ({ glow = 0, glowColor, style, blink = 0 }) => (
  <NodeBox
    icon={<ServerIcon size={110} blink={blink} fill="#F4F4F0" />}
    label="SERVER"
    width={STAGE.server.w}
    height={STAGE.server.h}
    glow={glow}
    glowColor={glowColor}
    style={{ left: STAGE.server.x, top: STAGE.server.y, ...style }}
  />
);
