import React from 'react';
import {Composition,registerRoot,staticFile} from 'remotion';
import {SellingPhone} from './SellingPhone';
registerRoot(()=><Composition id="SellingPhone" component={SellingPhone} width={1080} height={1920} fps={30} durationInFrames={3390} calculateMetadata={async()=>{const timeline=await fetch(staticFile('timeline.json')).then(r=>r.json());return {durationInFrames:timeline.durationInFrames,props:{timeline}};}}/>);
