import React from 'react';
import {Composition,registerRoot,staticFile} from 'remotion';
import {SellingPhoneV3} from './SellingPhoneV3';
registerRoot(()=><Composition id="SellingPhoneV3" component={SellingPhoneV3} width={1080} height={1920} fps={30} durationInFrames={3390} calculateMetadata={async()=>({props:{timeline:await fetch(staticFile('timeline-v2.json')).then(r=>r.json())}})}/>);
