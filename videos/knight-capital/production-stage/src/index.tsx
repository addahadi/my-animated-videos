import React from 'react';
import {Composition,registerRoot,staticFile} from 'remotion';
import {KnightCapital} from './KnightCapital';
registerRoot(()=> <Composition id="KnightCapitalDesign2" component={KnightCapital} width={1080} height={1920} fps={30} durationInFrames={2800}
 calculateMetadata={async()=>{const timeline=await fetch(staticFile('timeline.json')).then(r=>r.json());return {durationInFrames:timeline.durationInFrames,props:{timeline}};}}/>);
