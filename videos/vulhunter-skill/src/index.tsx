import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {Video} from './Video';

const Root:React.FC = () => <Composition id="VulnHunterInstagram" component={Video} durationInFrames={2105} fps={30} width={1080} height={1920}/>;
registerRoot(Root);
