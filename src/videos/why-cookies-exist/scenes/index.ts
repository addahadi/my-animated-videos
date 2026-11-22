import type React from 'react';
import type { SceneProps } from '../../../lib/time';
import { Scene01Hook } from './Scene01Hook';
import { Scene02Problem } from './Scene02Problem';
import { Scene03Stateless } from './Scene03Stateless';
import { Scene04Ticket } from './Scene04Ticket';
import { Scene05Remember } from './Scene05Remember';
import { Scene06Trackers } from './Scene06Trackers';
import { Scene07Law } from './Scene07Law';
import { Scene08Choice } from './Scene08Choice';
import { Scene09End } from './Scene09End';

/** timeline `component` name -> scene */
export const whyCookiesScenes: Record<string, React.FC<SceneProps>> = {
  HookProfile: Scene01Hook,
  StatelessIntro: Scene02Problem,
  StatelessServer: Scene03Stateless,
  CookieTicket: Scene04Ticket,
  RememberedShop: Scene05Remember,
  TrackerWeb: Scene06Trackers,
  LawBanner: Scene07Law,
  ChoiceBanner: Scene08Choice,
  LoopEnd: Scene09End,
};
