import type { SfxCue } from '../../lib/sfx';
import type { TimelineScene } from '../../lib/time';

/** SFX cue sheet anchored to timeline events: [sceneId, eventIndex, name, volume, offsetSec]. */
type Row = [number, number, string, number, number?];

const ROWS: Row[] = [
  // 1 hook
  [1, 0, 'buzz', 0.55, 0.02],
  [1, 0, 'pop-soft', 0.35, 0.1],
  [1, 1, 'pop', 0.45],
  [1, 2, 'glow', 0.25],
  [1, 3, 'pop', 0.5],
  [1, 4, 'pop', 0.45],
  [1, 4, 'pop', 0.45, 0.15],
  [1, 5, 'tick', 0.7],
  // 2-3 verdict
  [2, 0, 'stamp', 0.85],
  [2, 1, 'whoosh-short', 0.3],
  [2, 2, 'ding', 0.35, 0.1],
  [2, 3, 'ding', 0.35, 0.1],
  [3, 0, 'hit', 0.5, 0.1],
  [3, 1, 'hit', 0.5, 0.1],
  // 4-5 fake page
  [4, 0, 'whoosh', 0.4],
  [4, 1, 'pop', 0.45],
  [4, 2, 'pop', 0.45],
  [4, 3, 'strike', 0.5],
  [5, 0, 'zoom', 0.45],
  [5, 0, 'lock', 0.5, 0.3],
  // 6-7 infostealer
  [6, 0, 'unlock', 0.5],
  [6, 1, 'pop', 0.5],
  [6, 3, 'pop-soft', 0.4],
  [6, 4, 'scan', 0.4],
  [6, 4, 'tick', 0.7, 0.6],
  [6, 4, 'tick', 0.7, 1.15],
  [6, 4, 'tick', 0.7, 1.7],
  [7, 0, 'pop', 0.45],
  [7, 0, 'whoosh-short', 0.35, 0.6],
  [7, 1, 'pop', 0.45],
  // 8 cookie entry
  [8, 0, 'pop-soft', 0.4],
  [8, 1, 'strike', 0.55],
  [8, 2, 'unlock', 0.5],
  [8, 3, 'pop', 0.4],
  [8, 4, 'morph', 0.55],
  // 9 spread
  [9, 0, 'whoosh', 0.4],
  [9, 0, 'pop-soft', 0.35, 0.6],
  [9, 0, 'pop-soft', 0.35, 0.85],
  [9, 0, 'pop-soft', 0.35, 1.1],
  [9, 1, 'zoom', 0.45],
  [9, 2, 'hit', 0.55],
  // 10 miner
  [10, 0, 'hum', 0.3],
  [10, 1, 'tick-roll', 0.35],
  [10, 2, 'glow', 0.3],
  [10, 3, 'hum', 0.3],
  [10, 5, 'hum', 0.4],
  [10, 5, 'pop', 0.4, 0.2],
  // 11 checklist
  [11, 0, 'pop-soft', 0.4],
  [11, 1, 'pop', 0.5],
  [11, 2, 'stamp', 0.45],
  [11, 3, 'pop', 0.5],
  [11, 4, 'stamp', 0.6],
  [11, 5, 'pop', 0.5],
  [11, 6, 'stamp', 0.8],
  [11, 7, 'ding', 0.45],
  // 12 payoff
  [12, 0, 'stamp', 0.6, 0.2],
  [12, 1, 'type', 0.4],
  [12, 2, 'strike', 0.55],
  [12, 2, 'hit', 0.6, 0.1],
  // 13 end
  [13, 0, 'whoosh', 0.4, 0.1],
  [13, 0, 'pop', 0.4, 0.25],
  [13, 1, 'pop', 0.45],
  [13, 1, 'scan', 0.4, 0.3],
  [13, 1, 'pop', 0.45, 0.7],
  [13, 2, 'buzz', 0.35],
];

export const buildCues = (scenes: TimelineScene[]): SfxCue[] =>
  ROWS.map(([id, ev, name, volume, offset = 0]) => {
    const scene = scenes.find((s) => s.id === id);
    const e = scene?.props.events[ev];
    if (!e) throw new Error(`sfx cue: scene ${id} event ${ev} not found`);
    return { at: e.sec + offset, name, volume };
  });
