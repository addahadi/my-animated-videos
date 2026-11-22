import React from 'react';
import {Composition,registerRoot,staticFile} from 'remotion';
import {SellingPhoneV2} from './SellingPhoneV2';
registerRoot(()=><Composition id="SellingPhoneV2" component={SellingPhoneV2} width={1080} height={1920} fps={30} durationInFrames={3390} calculateMetadata={async()=>({props:{timeline:await fetch(staticFile('timeline-v2.json')).then(r=>r.json())}})}/>);
