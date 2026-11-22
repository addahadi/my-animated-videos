import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { arabic } from '../../fonts';
import { world } from '../../theme-world';
import { theme } from '../../theme';

export type KeyWord = { text: string; startMs: number; endMs: number; key?: boolean };
export type KeyPage = { startMs: number; endMs: number; words: KeyWord[] };

const RTL = /[֐-ࣿיִ-﷿ﹰ-﻿]/;
const LEAD_MS = 80;
const HOLD_MS = 320;

/**
 * World-style caption: the Report caption pill moved to the top. Spoken words white, upcoming dim,
 * key words in a yellow chip (dim chip before they are spoken). Mount once at composition level.
 */
export const TopCaption: React.FC<{ pages: KeyPage[]; hidden?: boolean }> = ({ pages, hidden }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (hidden) return null;
  const ms = (frame / fps) * 1000;
  let idx = -1;
  for (let i = 0; i < pages.length; i++) {
    const start = pages[i].startMs - LEAD_MS;
    const nextStart = i + 1 < pages.length ? pages[i + 1].startMs - LEAD_MS : Infinity;
    if (ms >= start && ms < Math.min(nextStart, pages[i].endMs + HOLD_MS)) {
      idx = i;
      break;
    }
  }
  if (idx < 0) return null;
  const page = pages[idx];
  const c = world.caption;
  const enter = Math.min(1, (ms - (page.startMs - LEAD_MS)) / 110);
  const nextStart = idx + 1 < pages.length ? pages[idx + 1].startMs - LEAD_MS : Infinity;
  const pauseAfter = nextStart - page.endMs > HOLD_MS;
  const exit = pauseAfter ? Math.min(1, Math.max(0, (ms - (page.endMs + HOLD_MS - 120)) / 120)) : 0;
  const rtl = page.words.some((w) => RTL.test(w.text));
  const maxW = theme.safe.contentX[1] - theme.safe.contentX[0] + 40;
  const chars = page.words.reduce((n, w) => n + w.text.length + (w.key ? 1.2 : 0), 0) + page.words.length - 1;
  const size = Math.max(48, Math.min(c.size, (maxW - 70) / (chars * 0.56)));
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: c.centerY - c.height / 2, height: c.height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div
        dir={rtl ? 'rtl' : 'ltr'}
        lang={rtl ? 'ar' : undefined}
        style={{
          maxWidth: maxW,
          height: c.height,
          boxSizing: 'border-box',
          padding: '8px 30px 0',
          borderRadius: c.radius,
          background: c.fill,
          boxShadow: '0 10px 24px rgba(11,15,21,0.28)',
          fontFamily: arabic,
          fontWeight: 800,
          fontSize: size,
          display: 'flex',
          alignItems: 'center',
          gap: size * 0.28,
          whiteSpace: 'nowrap',
          opacity: enter * (1 - exit),
          scale: `${0.94 + 0.06 * enter}`,
          translate: `0px ${(1 - enter) * -10}px`,
        }}
      >
        {page.words.map((w, i) => {
          const spoken = ms >= w.startMs - 40;
          const current = spoken && ms < w.endMs;
          const content = RTL.test(w.text) ? w.text : <bdi dir="ltr">{w.text}</bdi>;
          if (w.key) {
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  padding: `${size * 0.06}px ${size * 0.22}px 0`,
                  borderRadius: 12,
                  background: c.chip,
                  color: c.chipText,
                  opacity: spoken ? 1 : 0.35,
                  scale: current ? '1.08' : '1',
                  lineHeight: 1.25,
                }}
              >
                {content}
              </span>
            );
          }
          return (
            <span key={i} style={{ display: 'inline-block', color: spoken ? c.active : c.upcoming, scale: current ? '1.05' : '1' }}>
              {content}
            </span>
          );
        })}
      </div>
    </div>
  );
};
