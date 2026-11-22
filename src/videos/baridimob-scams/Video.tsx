import React from 'react';
import { Audio } from '@remotion/media';
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { CaptionPill, type CaptionPage } from '../../components/CaptionPill';
import { ChapterPill, GridCanvas, HeaderStrip, ScanLine } from '../../components/Canvas';
import { registry } from '../../lib/registry';
import { SfxTrack } from '../../lib/sfx';
import { SceneClockProvider, mix, pop, ramp, useClock, type TimelineScene } from '../../lib/time';
import { EASE_IN, EASE_IN_OUT, SPRING, theme } from '../../theme';
import type { SfxCue } from '../../lib/sfx';
import captionData from './captions.json';
import captionTiktok from './captions-tiktok.json';
import { MAIN_ROWS, TIKTOK_ROWS, buildCues } from './sfx';
import timeline from './timeline.json';
import timelineTiktok from './timeline-tiktok.json';

/** One cut of the video: its own timeline, captions, voice and music; scenes and components are shared. */
type Cut = {
  scenes: TimelineScene[];
  pages: CaptionPage[];
  cues: SfxCue[];
  voice: string;
  music: string;
  /** scene ids that hand their phone to the next scene (no exit, no push) / that receive it */
  continues: Set<number>;
  continued: Set<number>;
};

export const scenes = timeline.scenes as unknown as TimelineScene[];
export const tiktokScenes = timelineTiktok.scenes as unknown as TimelineScene[];

const MAIN: Cut = {
  scenes,
  pages: (captionData as { pages: CaptionPage[] }).pages,
  cues: buildCues(scenes, MAIN_ROWS),
  voice: 'baridimob-scams/voice.wav',
  music: 'baridimob-scams/music.wav',
  // scene 1 hands its phone to scene 2; the last scene holds for the loop
  continues: new Set([1]),
  continued: new Set([2]),
};

const TIKTOK: Cut = {
  scenes: tiktokScenes,
  pages: (captionTiktok as { pages: CaptionPage[] }).pages,
  cues: buildCues(tiktokScenes, TIKTOK_ROWS),
  voice: 'baridimob-scams/voice-tiktok.wav',
  music: 'baridimob-scams/music-tiktok.wav',
  continues: new Set(),
  continued: new Set(),
};

const EXIT_SEC = 0.22;

export type BaridimobProps = { captions: boolean };

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return <GridCanvas mode="light" drift={frame * 0.35} spacing={240} />;
};

const SceneShell: React.FC<{ cut: Cut; scene: TimelineScene; children: React.ReactNode }> = ({ cut, scene, children }) => {
  const { t, startSec, endSec } = useClock();
  const dark = scene.props.canvas === 'dark';
  const cont = cut.continues.has(scene.id);
  const contd = cut.continued.has(scene.id);
  const last = scene.id === cut.scenes[cut.scenes.length - 1].id;
  const exit = last || cont ? 0 : ramp(t, endSec - EXIT_SEC, endSec, EASE_IN);
  const push = cont || contd || last ? 1 : mix(1, 1.025, ramp(t, startSec, endSec, EASE_IN_OUT));
  const reveal = dark ? ramp(t, startSec, startSec + 0.4, EASE_IN_OUT) : 1;
  const darkExit = dark && !last ? ramp(t, endSec - 0.3, endSec, EASE_IN) : 0;
  return (
    <AbsoluteFill>
      {dark && (
        <AbsoluteFill style={{ clipPath: `inset(0 0 ${(1 - reveal) * 100}% 0)`, opacity: 1 - darkExit }}>
          <GridCanvas mode="dark" drift={t * 12} spacing={220} />
        </AbsoluteFill>
      )}
      {dark && reveal < 1 && <ScanLine y={reveal * 1920} />}
      <AbsoluteFill style={{ opacity: 1 - exit, scale: `${push * (1 - exit * 0.02)}`, transformOrigin: '540px 860px' }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Header strip across body scenes + the chapter pill of the current scene (persist across cuts). */
const HeaderLayer: React.FC<{ scenes: TimelineScene[] }> = ({ scenes }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cur = scenes.find((s) => t >= s.startSec && t < s.endSec) ?? scenes[scenes.length - 1];
  if (!cur.props.header || !cur.props.headerTag) return null;
  const first = scenes.find((s) => s.props.header)!;
  const p = ramp(t, first.startSec, first.startSec + 0.45);
  const lastHeader = [...scenes].reverse().find((s) => s.props.header)!;
  const out = ramp(t, lastHeader.endSec - EXIT_SEC, lastHeader.endSec, EASE_IN);
  const pillP = pop(t, cur.startSec + 0.05, fps, SPRING.pop) * (1 - ramp(t, cur.endSec - EXIT_SEC, cur.endSec, EASE_IN));
  return (
    <>
      <HeaderStrip tag={cur.props.headerTag} mode={cur.props.canvas} p={p * (1 - out)} />
      {cur.props.chapterPill && <ChapterPill text={cur.props.chapterPill} mode={cur.props.canvas} p={pillP} />}
    </>
  );
};

const makeVideo = (cut: Cut): React.FC<BaridimobProps> => ({ captions = true }) => {
  const { fps } = useVideoConfig();
  const { scenes } = cut;
  return (
    <AbsoluteFill style={{ background: theme.light.bgEdge }}>
      <Background />
      {scenes.map((s) => {
        const Comp = registry[s.component];
        if (!Comp) throw new Error(`No component registered for "${s.component}"`);
        return (
          <Sequence key={s.id} name={`${s.id} ${s.component}`} from={s.startFrame} durationInFrames={s.endFrame - s.startFrame} premountFor={fps}>
            <SceneClockProvider value={{ startSec: s.startSec, endSec: s.endSec }}>
              <SceneShell cut={cut} scene={s}>
                <Comp {...s.props} />
              </SceneShell>
            </SceneClockProvider>
          </Sequence>
        );
      })}
      <HeaderLayer scenes={scenes} />
      <CaptionPill pages={cut.pages} hidden={!captions} />
      <Audio src={staticFile(cut.voice)} />
      <Audio src={staticFile(cut.music)} volume={1} />
      <SfxTrack cues={cut.cues} />
    </AbsoluteFill>
  );
};

export const BaridimobScams = makeVideo(MAIN);
export const BaridimobScamsTiktok = makeVideo(TIKTOK);
