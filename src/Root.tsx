import React from 'react';
import { Composition, Folder } from 'remotion';
import { theme } from './theme';
import { PhoneListening, scenes as phoneListeningScenes } from './videos/phone-listening/Video';
import phoneListeningTimeline from './videos/phone-listening/timeline.json';
import { WhyCookies, scenes as whyCookiesScenes } from './videos/why-cookies-exist/Video';
import whyCookiesTimeline from './videos/why-cookies-exist/timeline.json';
import { PhoneSlowdownV2, scenes as phoneSlowdownV2Scenes } from './videos/phone-slowdown-v2/Video';
import phoneSlowdownV2Timeline from './videos/phone-slowdown-v2/timeline.json';
import { Gta6FakeDownload, scenes as gta6Scenes } from './videos/gta6-fake-download/Video';
import gta6Timeline from './videos/gta6-fake-download/timeline.json';
import { BaridimobScams, BaridimobScamsTiktok, scenes as baridimobScenes, tiktokScenes as baridimobTiktokScenes } from './videos/baridimob-scams/Video';
import baridimobTimeline from './videos/baridimob-scams/timeline.json';
import { WorldStyleDemo, WORLD_DEMO_FRAMES } from './videos/world-style-demo/Video';
import { CarouselDemo, SIZES, SLIDES } from './videos/carousel-demo/Carousel';
import { RiemannCarousel, RIEMANN_SLIDES } from './videos/riemann-claude/Carousel';
import { CAROUSEL_SIZES } from './components/carousel/Carousel';
import './fonts';

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Runtime-tech">
      <Composition
        id="PhoneListening"
        component={PhoneListening}
        durationInFrames={phoneListeningScenes[phoneListeningScenes.length - 1].endFrame}
        fps={phoneListeningTimeline.fps}
        width={theme.canvas.width}
        height={theme.canvas.height}
        defaultProps={{ captions: true }}
      />
      <Composition
        id="WhyCookiesExist"
        component={WhyCookies}
        durationInFrames={whyCookiesScenes[whyCookiesScenes.length - 1].endFrame}
        fps={whyCookiesTimeline.fps}
        width={theme.canvas.width}
        height={theme.canvas.height}
        defaultProps={{ captions: true }}
      />
      <Composition
        id="PhoneSlowdownV2"
        component={PhoneSlowdownV2}
        durationInFrames={phoneSlowdownV2Scenes[phoneSlowdownV2Scenes.length - 1].endFrame}
        fps={phoneSlowdownV2Timeline.fps}
        width={theme.canvas.width}
        height={theme.canvas.height}
        defaultProps={{ captions: true }}
      />
      <Composition
        id="Gta6FakeDownload"
        component={Gta6FakeDownload}
        durationInFrames={gta6Scenes[gta6Scenes.length - 1].endFrame}
        fps={gta6Timeline.fps}
        width={theme.canvas.width}
        height={theme.canvas.height}
        defaultProps={{ captions: true }}
      />
      <Composition
        id="BaridimobScams"
        component={BaridimobScams}
        durationInFrames={baridimobScenes[baridimobScenes.length - 1].endFrame}
        fps={baridimobTimeline.fps}
        width={theme.canvas.width}
        height={theme.canvas.height}
        defaultProps={{ captions: true }}
      />
      <Composition
        id="BaridimobScams-tiktok"
        component={BaridimobScamsTiktok}
        durationInFrames={baridimobTiktokScenes[baridimobTiktokScenes.length - 1].endFrame}
        fps={baridimobTimeline.fps}
        width={theme.canvas.width}
        height={theme.canvas.height}
        defaultProps={{ captions: true }}
      />
      <Composition
        id="WorldStyleDemo"
        component={WorldStyleDemo}
        durationInFrames={WORLD_DEMO_FRAMES}
        fps={30}
        width={theme.canvas.width}
        height={theme.canvas.height}
        defaultProps={{ captions: true }}
      />
      <Composition
        id="CarouselDemo-ig"
        component={CarouselDemo}
        durationInFrames={SLIDES}
        fps={30}
        width={SIZES.ig.w}
        height={SIZES.ig.h}
        defaultProps={{ variant: 'ig' as const }}
      />
      <Composition
        id="CarouselDemo-tt"
        component={CarouselDemo}
        durationInFrames={SLIDES}
        fps={30}
        width={SIZES.tt.w}
        height={SIZES.tt.h}
        defaultProps={{ variant: 'tt' as const }}
      />
      <Composition
        id="RiemannCarousel-ig"
        component={RiemannCarousel}
        durationInFrames={RIEMANN_SLIDES.length}
        fps={30}
        width={CAROUSEL_SIZES.ig.w}
        height={CAROUSEL_SIZES.ig.h}
        defaultProps={{ variant: 'ig' as const }}
      />
      <Composition
        id="RiemannCarousel-tt"
        component={RiemannCarousel}
        durationInFrames={RIEMANN_SLIDES.length}
        fps={30}
        width={CAROUSEL_SIZES.tt.w}
        height={CAROUSEL_SIZES.tt.h}
        defaultProps={{ variant: 'tt' as const }}
      />
    </Folder>
  );
};
