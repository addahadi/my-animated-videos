import type React from 'react';
import type { SceneProps } from '../../../lib/time';
import { Scene07BlueprintThrottle, Scene06BlueprintPower } from './Blueprint';
import { Scene04CaseFile, Scene05ClaimVsReply } from './Case';
import { Scene08AppGrowth, Scene09SamePhone, Scene10StorageHeat } from './Causes';
import { Scene01HookFine, Scene02YourCamera, Scene03VerdictLocked } from './Hook';
import { Scene11Verdict, Scene12CheckFirst, Scene13EndCard } from './Verdict';

/** timeline `component` name -> scene (phone-slowdown-v2) */
export const phoneSlowdownV2Scenes: Record<string, React.FC<SceneProps>> = {
  HookFine: Scene01HookFine,
  YourCamera: Scene02YourCamera,
  VerdictLocked: Scene03VerdictLocked,
  CaseFile: Scene04CaseFile,
  ClaimVsReply: Scene05ClaimVsReply,
  BlueprintPower: Scene06BlueprintPower,
  BlueprintThrottle: Scene07BlueprintThrottle,
  AppGrowth: Scene08AppGrowth,
  SamePhoneMoreWork: Scene09SamePhone,
  StorageHeatRecap: Scene10StorageHeat,
  VerdictOpen: Scene11Verdict,
  CheckBeforeBuying: Scene12CheckFirst,
  EndCard: Scene13EndCard,
};
