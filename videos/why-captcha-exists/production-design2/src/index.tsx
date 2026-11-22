import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {Video} from './Video';
const Root:React.FC=()=> <Composition id="CaptchaDesign2" component={Video} durationInFrames={2871} width={1080} height={1920} fps={30}/>;
registerRoot(Root);
