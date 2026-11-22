import React, { createContext, useContext } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { EASE_OUT, SPRING } from '../theme';

/** seconds -> frames. The only place where a time becomes a frame number. */
export const sec = (seconds: number, fps: number) => Math.round(seconds * fps);

export type TimelineEvent = { sec: number; frame: number; what: string };
export type SceneProps = {
  canvas: 'light' | 'dark';
  header: boolean;
  headerTag: string | null;
  chapterPill: string | null;
  events: TimelineEvent[];
};
export type TimelineScene = {
  id: number;
  startSec: number;
  endSec: number;
  startFrame: number;
  endFrame: number;
  voiceover: string;
  component: string;
  props: SceneProps;
  onScreenText: string;
  sfx: string[];
  tool: string;
  role: string;
};

type Clock = { startSec: number; endSec: number };
const SceneClock = createContext<Clock>({ startSec: 0, endSec: 0 });
export const SceneClockProvider: React.FC<{ value: Clock; children: React.ReactNode }> = ({ value, children }) =>
  React.createElement(SceneClock.Provider, { value }, children);

/**
 * Scene clock. `t` is ABSOLUTE narration time in seconds (scene start + local frame / fps),
 * so components animate directly against the timeline's absolute event times.
 */
export const useClock = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { startSec, endSec } = useContext(SceneClock);
  return { t: startSec + frame / fps, frame, fps, startSec, endSec };
};

/** event time (seconds) by index from the scene's timeline props */
export const evAt = (events: TimelineEvent[], i: number) => {
  const e = events[i];
  if (!e) throw new Error(`timeline event ${i} missing`);
  return e.sec;
};

/** 0..1 eased ramp between absolute times a and b */
export const ramp = (t: number, a: number, b: number, easing: (x: number) => number = EASE_OUT) =>
  interpolate(t, [a, Math.max(b, a + 1e-3)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });

/** spring progress starting at absolute time `at` */
export const pop = (
  t: number,
  at: number,
  fps: number,
  config: { damping: number; stiffness: number; mass: number } = SPRING.pop,
) => spring({ frame: Math.max(0, (t - at) * fps), fps, config });

export const mix = (a: number, b: number, p: number) => a + (b - a) * p;

/** opacity/scale for "appear at A, leave at B" with soft edges */
export const window01 = (t: number, a: number, b: number, fadeIn = 0.25, fadeOut = 0.25) =>
  Math.min(ramp(t, a, a + fadeIn), 1 - ramp(t, b - fadeOut, b));
