import React from 'react';
import {Composition,registerRoot,staticFile} from 'remotion';
import {SellingPhoneV4} from './SellingPhoneV4';
registerRoot(()=><Composition id="SellingPhoneV4" component={SellingPhoneV4} width={1080} height={1920} fps={30} durationInFrames={3390} calculateMetadata={async()=>({props:{timeline:await fetch(staticFile('timeline-v2.json')).then(r=>r.json())}})}/>);
