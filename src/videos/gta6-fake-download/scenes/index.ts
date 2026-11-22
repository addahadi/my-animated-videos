import type React from 'react';
import type { SceneProps } from '../../../lib/time';
import { Scene01Hook } from './Scene01Hook';
import { Scene02Verdict } from './Scene02Verdict';
import { Scene04FakePage } from './Scene04FakePage';
import { Scene06Infostealer } from './Scene06Infostealer';
import { Scene08CookieEntry } from './Scene08CookieEntry';
import { Scene09Spread } from './Scene09Spread';
import { Scene10Miner } from './Scene10Miner';
import { Scene11Checklist } from './Scene11Checklist';
import { Scene12Payoff } from './Scene12Payoff';
import { Scene13End } from './Scene13End';

/** timeline `component` name -> scene (some components span two timeline scenes, using absolute times) */
export const gta6FakeDownloadScenes: Record<string, React.FC<SceneProps>> = {
  HookLink: Scene01Hook,
  VerdictPlatforms: Scene02Verdict,
  FakeDownloadPage: Scene04FakePage,
  Infostealer: Scene06Infostealer,
  CookieEntry: Scene08CookieEntry,
  SpreadToFriends: Scene09Spread,
  HiddenMiner: Scene10Miner,
  ScamChecklist: Scene11Checklist,
  PayoffStrike: Scene12Payoff,
  EndCardShare: Scene13End,
};
