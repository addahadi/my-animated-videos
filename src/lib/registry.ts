import type React from 'react';
import { phoneListeningScenes } from '../videos/phone-listening/scenes';
import { whyCookiesScenes } from '../videos/why-cookies-exist/scenes';
import { phoneSlowdownV2Scenes } from '../videos/phone-slowdown-v2/scenes';
import { gta6FakeDownloadScenes } from '../videos/gta6-fake-download/scenes';
import { baridimobScamsScenes } from '../videos/baridimob-scams/scenes';
import type { SceneProps } from './time';

/** Maps each timeline `component` string to a React component. Add new videos' scenes here. */
export const registry: Record<string, React.FC<SceneProps>> = {
  ...phoneListeningScenes,
  ...whyCookiesScenes,
  ...phoneSlowdownV2Scenes,
  ...gta6FakeDownloadScenes,
  ...baridimobScamsScenes,
};
