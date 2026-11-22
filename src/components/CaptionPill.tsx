import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { arabic } from '../fonts';
import { theme } from '../theme';

export type CaptionWord = { text: string; startMs: number; endMs: number };
export type CaptionPage = { startMs: number; endMs: number; words: CaptionWord[] };

const RTL = /[֐-ࣿיִ-﷿ﹰ-﻿]/;
// Darija captions: any Arabic word makes the line RTL (Latin terms are isolated with <bdi>)
const isRtl = (words: CaptionWord[]) => words.some((w) => RTL.test(w.text));
// fit the line inside the pill: approximate advance of Tajawal 800 is ~0.56 em per character
const fitSize = (words: CaptionWord[], max: number, inner: number) => {
  const chars = words.reduce((n, w) => n + w.text.length, 0) + Math.max(0, words.length - 1);
  return Math.max(48, Math.min(max, inner / (chars * 0.56)));
};

const LEAD_MS = 80; // page shows just before its first word
const HOLD_MS = 320; // and lingers briefly after its last word

/**
 * Black caption pill (style.md): 2 to 4 words, spoken words white, upcoming words dim.
 * Hidden during pauses. Uses absolute composition time (mount at composition level).
 */
export const CaptionPill: React.FC<{ pages: CaptionPage[]; hidden?: boolean }> = ({ pages, hidden }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (hidden) return null;
  const ms = (frame / fps) * 1000;
  let idx = -1;
  for (let i = 0; i < pages.length; i++) {
    const start = pages[i].startMs - LEAD_MS;
    const nextStart = i + 1 < pages.length ? pages[i + 1].startMs - LEAD_MS : Infinity;
    const end = Math.min(nextStart, pages[i].endMs + HOLD_MS);
    if (ms >= start && ms < end) {
      idx = i;
      break;
    }
  }
  if (idx < 0) return null;
  const page = pages[idx];
  const sinceStart = ms - (page.startMs - LEAD_MS);
  const enter = Math.min(1, sinceStart / 110);
  const nextStart = idx + 1 < pages.length ? pages[idx + 1].startMs - LEAD_MS : Infinity;
  const gapAfter = nextStart - page.endMs > HOLD_MS; // a real pause follows -> fade out
  const exit = gapAfter ? Math.min(1, Math.max(0, (ms - (page.endMs + HOLD_MS - 120)) / 120)) : 0;
  const c = theme.caption;
  const rtl = isRtl(page.words);
  const maxW = theme.safe.contentX[1] - theme.safe.contentX[0];
  const size = fitSize(page.words, c.size, maxW - 68);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: c.centerY - c.height / 2,
        height: c.height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        dir={rtl ? 'rtl' : 'ltr'}
        lang={rtl ? 'ar' : undefined}
        style={{
          maxWidth: maxW,
          minHeight: c.height,
          boxSizing: 'border-box',
          padding: '10px 34px 4px',
          borderRadius: c.radius,
          background: c.fill,
          boxShadow: '0 10px 24px rgba(11,15,21,0.28)',
          fontFamily: arabic,
          fontWeight: 800,
          fontSize: size,
          lineHeight: `${c.height - 14}px`,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          opacity: enter * (1 - exit),
          scale: `${0.94 + 0.06 * enter}`,
          translate: `0px ${(1 - enter) * 10}px`,
        }}
      >
        {page.words.map((w, i) => {
          const spoken = ms >= w.startMs - 40;
          const current = ms >= w.startMs - 40 && ms < w.endMs;
          return (
            <React.Fragment key={i}>
              <span
                style={{
                  color: spoken ? c.active : c.upcoming,
                  display: 'inline-block',
                  scale: current ? '1.06' : '1',
                }}
              >
                {RTL.test(w.text) ? w.text : <bdi dir="ltr">{w.text}</bdi>}
              </span>
              {i < page.words.length - 1 ? ' ' : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
