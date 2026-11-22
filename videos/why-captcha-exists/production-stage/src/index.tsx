import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {CaptchaVideo} from './CaptchaVideo';
const Root:React.FC=()=> <Composition id="WhyCaptchaExists" component={CaptchaVideo} width={1080} height={1920} fps={30} durationInFrames={2871}/>;
registerRoot(Root);
