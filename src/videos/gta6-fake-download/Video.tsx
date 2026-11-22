import React from 'react';
import { Audio } from '@remotion/media';
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { CaptionPill, type CaptionPage } from '../../components/CaptionPill';
import { GridCanvas, HeaderStrip, ScanLine } from '../../components/Canvas';
import { SeriesPill } from '../../components/Scam';
import { registry } from '../../lib/registry';
import { SfxTrack } from '../../lib/sfx';
import { SceneClockProvider, mix, ramp, useClock, type TimelineScene } from '../../lib/time';
import { EASE_IN, EASE_IN_OUT, theme } from '../../theme';
import captionData from './captions.json';
import { buildCues } from './sfx';
import timeline from './timeline.json';

export const scenes = timeline.scenes as unknown as TimelineScene[];
const pages = (captionData as { pages: CaptionPage[] }).pages;
const cues = buildCues(scenes);

// scenes whose component continues into the next timeline scene (no exit, no camera push)
const CONTINUES = new Set([2, 4, 6]);
const CONTINUED = new Set([3, 5, 7]);
// hard cuts: 1 -> 2 cuts on the stamp impact; 5 -> 6 cuts into the blueprint; the last scene holds
const HARD_CUT_OUT = new Set([1, 5, scenes[scenes.length - 1].id]);
const EXIT_SEC = 0.22;
const SERIES_TAG = 'TRUE OR FALSE · EP.01';
const isArabic = (s: string) => /[؀-ۿ]/.test(s);

export type Gta6Props = { captions: boolean };

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return <GridCanvas mode="light" drift={frame * 0.35} spacing={240} />;
};

const SceneShell: React.FC<{ scene: TimelineScene; children: React.ReactNode }> = ({ scene, children }) => {
  const { t, startSec, endSec } = useClock();
  const dark = scene.props.canvas === 'dark';
  const cont = CONTINUES.has(scene.id);
  const contd = CONTINUED.has(scene.id);
  const exit = HARD_CUT_OUT.has(scene.id) || cont ? 0 : ramp(t, endSec - EXIT_SEC, endSec, EASE_IN);
  const push = cont || contd ? 1 : mix(1, 1.025, ramp(t, startSec, endSec, EASE_IN_OUT));
  const reveal = dark && !contd ? ramp(t, startSec, startSec + 0.4, EASE_IN_OUT) : 1;
  const darkExit = dark && !cont ? ramp(t, endSec - 0.3, endSec, EASE_IN) : 0;
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

/** Header strip + series pill across body scenes (persists across cuts so it never flickers). */
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
  const series = isArabic(cur.props.headerTag);
  const [y0] = theme.layout.pillY;
  return (
    <>
      <HeaderStrip tag={series ? SERIES_TAG : cur.props.headerTag} mode={cur.props.canvas} p={p * (1 - out)} />
      {series && <SeriesPill p={p * (1 - out)} size={30} style={{ left: 540, top: y0 - 4, translate: '-50% 0px' }} />}
    </>
  );
};

export const Gta6FakeDownload: React.FC<Gta6Props> = ({ captions = true }) => {
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
      <CaptionPill pages={pages} hidden={!captions} />
      <Audio src={staticFile('gta6-fake-download/voice.wav')} />
      <Audio src={staticFile('gta6-fake-download/music.wav')} volume={1} />
      <SfxTrack cues={cues} />
    </AbsoluteFill>
  );
};
