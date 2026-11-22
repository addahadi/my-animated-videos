import type React from 'react';
import type { SceneProps } from '../../../lib/time';
import { Scene01Hook } from './Scene01Hook';
import { Scene02Suspect } from './Scene02Suspect';
import { Scene03Drain } from './Scene03Drain';
import { Scene04Dot } from './Scene04Dot';
import { Scene05Study } from './Scene05Study';
import { Scene06Leak } from './Scene06Leak';
import { Scene07EarEye } from './Scene07EarEye';
import { Scene08Map } from './Scene08Map';
import { Scene09Wifi } from './Scene09Wifi';
import { Scene10Model } from './Scene10Model';
import { Scene11Brain } from './Scene11Brain';
import { Scene12Recap } from './Scene12Recap';
import { Scene13End } from './Scene13End';

/** timeline `component` name -> scene */
export const phoneListeningScenes: Record<string, React.FC<SceneProps>> = {
  HookFeed: Scene01Hook,
  SuspectCard: Scene02Suspect,
  MicDrainTest: Scene03Drain,
  StatusBarZoom: Scene04Dot,
  StudyGrid: Scene05Study,
  ScreenLeak: Scene06Leak,
  EarToEye: Scene07EarEye,
  MapPin: Scene08Map,
  SharedWifi: Scene09Wifi,
  ModelBlueprint: Scene10Model,
  FeedNotice: Scene11Brain,
  CaseFileRecap: Scene12Recap,
  EndCard: Scene13End,
};
