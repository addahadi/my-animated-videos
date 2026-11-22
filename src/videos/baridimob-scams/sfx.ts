import type { SfxCue } from '../../lib/sfx';
import type { TimelineScene } from '../../lib/time';

/** SFX cue sheet anchored to timeline events: [sceneId, eventIndex, name, volume, offsetSec]. */
type Row = [number, number, string, number, number?];

export const MAIN_ROWS: Row[] = [
  // 1 hook: balance rolling, impact on "صفر"
  [1, 0, 'tick-roll', 0.35],
  [1, 1, 'hit', 0.6],
  [1, 2, 'pop-soft', 0.4],
  // 2 twist
  [2, 0, 'pop', 0.45, 0.1],
  [2, 1, 'whoosh-short', 0.35],
  [2, 2, 'stamp', 0.8],
  [2, 3, 'whoosh', 0.35, 0.2],
  [2, 4, 'pop', 0.45, 0.9],
  [2, 5, 'ding', 0.35],
  [2, 6, 'pop', 0.45],
  [2, 7, 'pop', 0.45],
  [2, 8, 'pop', 0.5],
  // 3 trick 1
  [3, 0, 'whoosh-short', 0.3],
  [3, 1, 'buzz', 0.45],
  [3, 2, 'tick', 0.7],
  [3, 3, 'whoosh-short', 0.3],
  [3, 4, 'scan', 0.4, -0.2],
  [3, 4, 'stamp', 0.45, 0.15],
  [3, 5, 'type', 0.45],
  [3, 6, 'whoosh', 0.4],
  [3, 6, 'pop', 0.45, 0.7],
  // 4 trick 2
  [4, 0, 'whoosh-short', 0.3],
  [4, 1, 'pop-soft', 0.35],
  [4, 1, 'pop-soft', 0.35, 0.4],
  [4, 2, 'buzz', 0.4, -0.3],
  [4, 3, 'tick-roll', 0.3],
  [4, 3, 'pop', 0.45, 0.45],
  [4, 4, 'morph', 0.5],
  [4, 4, 'stamp', 0.45, 0.3],
  [4, 5, 'stamp', 0.6, 0.3],
  [4, 6, 'ding', 0.4],
  // 5 trick 3 (dark)
  [5, 0, 'glow', 0.35],
  [5, 0, 'pop', 0.4, 0.45],
  [5, 1, 'tick', 0.6],
  [5, 2, 'whoosh-short', 0.3],
  [5, 3, 'pop', 0.4],
  [5, 4, 'tick', 0.7],
  [5, 4, 'stamp', 0.5, 0.5],
  [5, 5, 'hum', 0.4],
  [5, 7, 'pop-soft', 0.35],
  [5, 8, 'whoosh-short', 0.35],
  [5, 9, 'morph', 0.5],
  [5, 10, 'type', 0.45],
  [5, 11, 'whoosh', 0.4],
  [5, 11, 'pop', 0.45, 0.7],
  [5, 12, 'buzz', 0.4],
  [5, 12, 'pop', 0.45, 1.0],
  // 6 rule
  [6, 0, 'pop-soft', 0.35],
  [6, 1, 'type', 0.35],
  [6, 2, 'strike', 0.55],
  [6, 3, 'strike', 0.55],
  [6, 4, 'strike', 0.55],
  [6, 5, 'stamp', 0.8],
  // 7 checklist
  [7, 0, 'pop-soft', 0.4],
  [7, 1, 'whoosh-short', 0.35],
  [7, 2, 'pop', 0.45],
  [7, 3, 'pop', 0.5],
  [7, 4, 'whoosh-short', 0.35],
  [7, 5, 'ding', 0.45],
  // 8 share + loop
  [8, 0, 'whoosh', 0.4],
  [8, 0, 'pop', 0.45, 0.05],
  [8, 1, 'pop', 0.45],
  [8, 1, 'pop', 0.4, 0.75],
  [8, 1, 'pop', 0.4, 0.9],
  [8, 2, 'tick-roll', 0.3, 0.15],
  [8, 2, 'lock', 0.45, 0.6],
];

/** TikTok cut (timeline-tiktok.json) */
export const TIKTOK_ROWS: Row[] = [
  // 1 hook: 02:00 SMS -> fake page -> code gone
  [1, 1, 'buzz', 0.45],
  [1, 2, 'tick', 0.7],
  [1, 3, 'whoosh-short', 0.3],
  [1, 4, 'scan', 0.4, -0.2],
  [1, 4, 'stamp', 0.45, 0.15],
  [1, 5, 'type', 0.45],
  [1, 6, 'whoosh', 0.4],
  [1, 6, 'pop', 0.45, 0.7],
  // 2 morning: 0 DA, not a hacker, you gave the code
  [2, 0, 'whoosh-short', 0.3],
  [2, 0, 'tick-roll', 0.3, 0.4],
  [2, 0, 'pop-soft', 0.35, 0.45],
  [2, 1, 'hit', 0.6],
  [2, 2, 'pop-soft', 0.35],
  [2, 3, 'whoosh-short', 0.35],
  [2, 4, 'stamp', 0.8],
  [2, 5, 'whoosh', 0.35, 0.2],
  [2, 6, 'pop', 0.5],
  // 3 rule
  [3, 0, 'pop-soft', 0.4],
  [3, 1, 'type', 0.35],
  [3, 2, 'strike', 0.55],
  [3, 3, 'strike', 0.55],
  [3, 4, 'strike', 0.55],
  // 4 checklist
  [4, 0, 'pop-soft', 0.4],
  [4, 1, 'whoosh-short', 0.35],
  [4, 2, 'pop', 0.45],
  [4, 3, 'pop', 0.5],
  [4, 4, 'whoosh-short', 0.35],
  [4, 5, 'ding', 0.45],
  // 5 share
  [5, 0, 'whoosh', 0.4],
  [5, 0, 'pop', 0.45, 0.05],
  // 6 part-2 tease (dark)
  [6, 0, 'glow', 0.35],
  [6, 0, 'pop', 0.4, 0.3],
  [6, 1, 'morph', 0.45],
  [6, 1, 'pop', 0.4, 0.3],
  [6, 2, 'type', 0.45, 0.3],
  [6, 3, 'stamp', 0.7],
  [6, 4, 'pop', 0.45],
  [6, 4, 'pop', 0.45, 0.2],
];

export const buildCues = (scenes: TimelineScene[], rows: Row[] = MAIN_ROWS): SfxCue[] =>
  rows.map(([id, ev, name, volume, offset = 0]) => {
    const scene = scenes.find((s) => s.id === id);
    const e = scene?.props.events[ev];
    if (!e) throw new Error(`sfx cue: scene ${id} event ${ev} not found`);
    return { at: e.sec + offset, name, volume };
  });
