import React from 'react';
import {Composition,registerRoot,staticFile} from 'remotion';
import {IntroductionN8n} from './IntroductionN8n';
registerRoot(()=><Composition id="IntroductionN8n" component={IntroductionN8n} width={1080} height={1920} fps={30} durationInFrames={2964} calculateMetadata={async()=>{const timeline=await(await fetch(staticFile('timeline.json'))).json();return {durationInFrames:timeline.durationInFrames,props:{timeline}};}}/>);
