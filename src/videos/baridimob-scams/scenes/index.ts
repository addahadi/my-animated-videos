import type React from 'react';
import type { SceneProps } from '../../../lib/time';
import { Scene01Hook } from './Scene01Hook';
import { Scene02WhatHappened } from './Scene02WhatHappened';
import { Scene03TrickSms } from './Scene03TrickSms';
import { Scene04TrickFakeApp } from './Scene04TrickFakeApp';
import { Scene05TrickOverlay } from './Scene05TrickOverlay';
import { Scene06RuleStamp } from './Scene06RuleStamp';
import { Scene07RecoveryChecklist } from './Scene07RecoveryChecklist';
import { Scene08ShareLoop } from './Scene08ShareLoop';
import { TtMorningZero, TtShare, TtTease } from './tiktok';

/** timeline `component` name -> scene */
export const baridimobScamsScenes: Record<string, React.FC<SceneProps>> = {
  WalletHook: Scene01Hook,
  WhatHappened: Scene02WhatHappened,
  TrickSms: Scene03TrickSms,
  TrickFakeApp: Scene04TrickFakeApp,
  TrickOverlay: Scene05TrickOverlay,
  RuleStamp: Scene06RuleStamp,
  RecoveryChecklist: Scene07RecoveryChecklist,
  ShareLoop: Scene08ShareLoop,
  // TikTok cut only
  TtMorningZero,
  TtShare,
  TtTease,
};
