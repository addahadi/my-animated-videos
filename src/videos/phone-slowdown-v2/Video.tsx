import React from 'react';
import { Audio } from '@remotion/media';
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { CaptionPill, type CaptionPage } from '../../components/CaptionPill';
import { ChapterPill, GridCanvas, HeaderStrip, ScanLine } from '../../components/Canvas';
import { registry } from '../../lib/registry';
import { SfxTrack } from '../../lib/sfx';
import { SceneClockProvider, mix, pop, ramp, useClock, type TimelineScene } from '../../lib/time';
import { EASE_IN, EASE_IN_OUT, SPRING, theme } from '../../theme';
import captionData from './captions.json';
import { buildCues } from './sfx';
import timeline from './timeline.json';

export const scenes = timeline.scenes as unknown as TimelineScene[];
const pages = (captionData as { pages: CaptionPage[] }).pages;
const cues = buildCues(scenes);

// 1 -> 2 -> 3 share the same phone in the same place: no exit, no camera push (seamless).
// 5 -> 6: hard cut into the dark blueprint. The last scene holds to the end.
const CONTINUOUS = new Set([1, 2]);
const HARD_CUT_OUT = new Set([1, 2, 5, scenes[scenes.length - 1].id]);
const EXIT_SEC = 0.22;
const isDark = (s?: TimelineScene) => s?.props.canvas === 'dark';

export type PhoneSlowdownV2Props = { captions: boolean };

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return <GridCanvas mode="light" drift={frame * 0.35} spacing={240} />;
};

/** Per-scene wrapper: dark canvas (wipe in only when entering from light), chapter pill, slow push, soft exit. */
const SceneShell: React.FC<{ scene: TimelineScene; prev?: TimelineScene; next?: TimelineScene; children: React.ReactNode }> = ({ scene, prev, next, children }) => {
  const { t, fps, startSec, endSec } = useClock();
  const dark = isDark(scene);
  const exit = HARD_CUT_OUT.has(scene.id) ? 0 : ramp(t, endSec - EXIT_SEC, endSec, EASE_IN);
  const push = CONTINUOUS.has(scene.id) ? 1 : mix(1, 1.025, ramp(t, startSec, endSec, EASE_IN_OUT));
  const pillP = pop(t, startSec + 0.05, fps, SPRING.pop);
  const reveal = dark && !isDark(prev) ? ramp(t, startSec, startSec + 0.4, EASE_IN_OUT) : 1;
  const darkExit = dark && !isDark(next) ? ramp(t, endSec - 0.3, endSec, EASE_IN) : 0;
  return (
    <AbsoluteFill>
      {dark && (
        <AbsoluteFill style={{ clipPath: `inset(0 0 ${(1 - reveal) * 100}% 0)`, opacity: 1 - darkExit }}>
          <GridCanvas mode="dark" drift={t * 12} spacing={220} />
        </AbsoluteFill>
      )}
      {dark && reveal < 1 && <ScanLine y={reveal * 1920} />}
      <AbsoluteFill style={{ opacity: 1 - exit, scale: `${push * (1 - exit * 0.02)}`, transformOrigin: '540px 860px' }}>{children}</AbsoluteFill>
      {scene.props.chapterPill && (
        <div style={{ opacity: 1 - exit }}>
          <ChapterPill text={scene.props.chapterPill} mode={scene.props.canvas} p={pillP} />
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Header strip across body scenes (persists across cuts so it never flickers). */
const HeaderLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cur = scenes.find((s) => t >= s.startSec && t < s.endSec) ?? scenes[scenes.length - 1];
  if (!cur.props.header || !cur.props.headerTag) return null;
  const first = scenes.find((s) => s.props.header)!;
  const p = ramp(t, first.startSec, first.startSec + 0.45);
  const lastHeader = [...scenes].reverse().find((s) => s.props.header)!;
  const out = ramp(t, lastHeader.endSec - EXIT_SEC, lastHeader.endSec, EASE_IN);
  return <HeaderStrip tag={cur.props.headerTag} mode={cur.props.canvas} p={p * (1 - out)} />;
};

export const PhoneSlowdownV2: React.FC<PhoneSlowdownV2Props> = ({ captions = true }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: theme.light.bgEdge }}>
      <Background />
      {scenes.map((s, i) => {
        const Comp = registry[s.component];
        if (!Comp) throw new Error(`No component registered for "${s.component}"`);
        return (
          <Sequence key={s.id} name={`${s.id} ${s.component}`} from={s.startFrame} durationInFrames={s.endFrame - s.startFrame} premountFor={fps}>
            <SceneClockProvider value={{ startSec: s.startSec, endSec: s.endSec }}>
              <SceneShell scene={s} prev={scenes[i - 1]} next={scenes[i + 1]}>
                <Comp {...s.props} />
              </SceneShell>
            </SceneClockProvider>
          </Sequence>
        );
      })}
      <HeaderLayer />
      <CaptionPill pages={pages} hidden={!captions} />
      <Audio src={staticFile('phone-slowdown-v2/voice.wav')} />
      <SfxTrack cues={cues} />
    </AbsoluteFill>
  );
};
