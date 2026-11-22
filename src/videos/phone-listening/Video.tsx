import React from 'react';
import { Audio } from '@remotion/media';
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { CaptionPill, type CaptionPage } from '../../components/CaptionPill';
import { ChapterPill, GridCanvas, HeaderStrip, ScanLine } from '../../components/Canvas';
import { LockedChip } from '../../components/Labels';
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
const byId = (id: number) => scenes.find((s) => s.id === id)!;

// scene transitions: a hard cut (no exit animation) where the plan asks for one
// 5 -> 6: cut on the pause into the twist; the last scene holds to the end (loop back to frame 0)
const HARD_CUT_OUT = new Set([5, scenes[scenes.length - 1].id]);
const EXIT_SEC = 0.22;

export type PhoneListeningProps = { captions: boolean };

/** Persistent light grid, slowly drifting (style: grid scale/position drift). */
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return <GridCanvas mode="light" drift={frame * 0.35} spacing={240} />;
};

/** Per-scene wrapper: dark canvas reveal, chapter pill, slow camera push, soft exit. */
const SceneShell: React.FC<{ scene: TimelineScene; children: React.ReactNode }> = ({ scene, children }) => {
  const { t, fps, startSec, endSec } = useClock();
  const dark = scene.props.canvas === 'dark';
  const exit = HARD_CUT_OUT.has(scene.id) ? 0 : ramp(t, endSec - EXIT_SEC, endSec, EASE_IN);
  const push = mix(1, 1.025, ramp(t, startSec, endSec, EASE_IN_OUT));
  const pillP = pop(t, startSec + 0.05, fps, SPRING.pop);
  // dark scene: blueprint wipes down from the top with a glowing scan edge
  const reveal = dark ? ramp(t, startSec, startSec + 0.4, EASE_IN_OUT) : 1;
  const darkExit = dark ? ramp(t, endSec - 0.3, endSec, EASE_IN) : 0;
  return (
    <AbsoluteFill>
      {dark && (
        <AbsoluteFill style={{ clipPath: `inset(0 0 ${(1 - reveal) * 100}% 0)`, opacity: 1 - darkExit }}>
          <GridCanvas mode="dark" drift={(t - startSec) * 12} spacing={220} />
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

/**
 * Open-loop chip: drops in with the scene-2 "truth" beat, wiggles on "أغرب",
 * unlocks at the recap (scene 12 event 0) and leaves.
 */
const LockLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const s2 = byId(2).props.events;
  const s12 = byId(12).props.events;
  const appear = s2[3].sec;
  const wiggleAt = s2[4].sec;
  const unlockAt = s12[0].sec;
  if (t < appear) return null;
  const drop = pop(t, appear, fps, SPRING.pop);
  const wig = t > wiggleAt && t < wiggleAt + 0.6 ? Math.sin((t - wiggleAt) * 38) * 7 * (1 - (t - wiggleAt) / 0.6) : 0;
  const open = ramp(t, unlockAt, unlockAt + 0.35);
  const bump = pop(t, unlockAt, fps, SPRING.pop);
  const leave = ramp(t, unlockAt + 0.9, unlockAt + 1.25, EASE_IN);
  if (leave >= 1) return null;
  const cur = scenes.find((s) => t >= s.startSec && t < s.endSec);
  return (
    <LockedChip
      open={open}
      mode={cur?.props.canvas ?? 'light'}
      shake={wig}
      style={{
        right: 1080 - theme.safe.contentX[1],
        top: 404,
        opacity: Math.min(1, drop * 3) * (1 - leave),
        translate: `0px ${(1 - Math.min(drop, 1)) * -70 - leave * 40}px`,
        scale: `${1 + (t > unlockAt ? 0.18 * Math.sin(Math.min(1, bump) * Math.PI) : 0)}`,
      }}
    />
  );
};

export const PhoneListening: React.FC<PhoneListeningProps> = ({ captions = true }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: theme.light.bgEdge }}>
      <Background />
      {scenes.map((s) => {
        const Comp = registry[s.component];
        if (!Comp) throw new Error(`No component registered for "${s.component}"`);
        return (
          <Sequence key={s.id} name={`${s.id} ${s.component}`} from={s.startFrame} durationInFrames={s.endFrame - s.startFrame} premountFor={fps}>
            <SceneClockProvider value={{ startSec: s.startSec, endSec: s.endSec }}>
              <SceneShell scene={s}>
                <Comp {...s.props} />
              </SceneShell>
            </SceneClockProvider>
          </Sequence>
        );
      })}
      <HeaderLayer />
      <LockLayer />
      <CaptionPill pages={pages} hidden={!captions} />
      <Audio src={staticFile('phone-listening/voice.wav')} />
      <SfxTrack cues={cues} />
    </AbsoluteFill>
  );
};
