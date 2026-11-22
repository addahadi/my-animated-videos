import type { SfxCue } from '../../lib/sfx';
import type { TimelineScene } from '../../lib/time';

/** SFX cue sheet, anchored to timeline events: [sceneId, eventIndex, name, volume, offsetSec]. */
type Row = [number, number, string, number, number?];

const ROWS: Row[] = [
  // 1 hook
  [1, 0, 'whoosh-short', 0.3],
  [1, 1, 'pop', 0.45],
  [1, 2, 'pop', 0.45],
  [1, 3, 'pop', 0.45],
  [1, 4, 'draw', 0.4],
  [1, 4, 'pop-soft', 0.35, 0.35],
  [1, 5, 'stamp', 0.7],
  [1, 6, 'whoosh', 0.42],
  [1, 6, 'pop-soft', 0.35, 0.55],
  [1, 7, 'tick', 0.8, 0.05],
  [1, 7, 'pop', 0.5, 0.35],
  // 2 problem
  [2, 0, 'whoosh-short', 0.3, 0.2],
  [2, 1, 'pop', 0.45],
  [2, 1, 'draw', 0.3, 0.25],
  [2, 2, 'pop', 0.5],
  // 3 stateless
  [3, 1, 'whoosh-short', 0.3],
  [3, 2, 'pop', 0.45],
  [3, 2, 'strike', 0.45, 0.15],
  [3, 3, 'whoosh-short', 0.3],
  [3, 4, 'pop', 0.45],
  [3, 5, 'whoosh-short', 0.3, 0.15],
  [3, 5, 'ding', 0.4, 0.9],
  [3, 6, 'whoosh-short', 0.3],
  [3, 7, 'morph', 0.5],
  // 4 ticket
  [4, 1, 'stamp', 0.5],
  [4, 2, 'pop-soft', 0.35],
  [4, 3, 'pop', 0.55],
  [4, 4, 'whoosh', 0.4],
  [4, 5, 'glow', 0.4],
  [4, 6, 'whoosh', 0.4, -0.3],
  [4, 7, 'whoosh-short', 0.3],
  [4, 8, 'pop', 0.45],
  [4, 9, 'tick-roll', 0.3],
  [4, 10, 'whoosh-short', 0.3],
  [4, 11, 'ding', 0.5, 0.45],
  [4, 11, 'pop', 0.45, 1.0],
  // 5 remember
  [5, 1, 'pop', 0.45],
  [5, 2, 'tick', 0.6],
  [5, 2, 'tick', 0.6, 0.5],
  [5, 2, 'tick', 0.6, 1.0],
  [5, 3, 'whoosh-short', 0.35],
  [5, 3, 'pop', 0.5, 0.55],
  [5, 4, 'zoom', 0.4],
  [5, 5, 'pop', 0.45],
  [5, 6, 'ding', 0.5, 0.45],
  // 6 trackers (dark)
  [6, 0, 'scan', 0.5],
  [6, 1, 'hit', 0.55],
  [6, 2, 'pop', 0.5],
  [6, 3, 'tick-roll', 0.4],
  [6, 4, 'pop-soft', 0.4],
  [6, 5, 'draw', 0.35],
  [6, 6, 'whoosh-short', 0.35],
  [6, 6, 'pop-soft', 0.4, 0.45],
  [6, 7, 'whoosh-short', 0.35],
  [6, 7, 'pop-soft', 0.4, 0.45],
  [6, 8, 'whoosh-short', 0.35],
  [6, 8, 'pop-soft', 0.4, 0.45],
  [6, 9, 'stamp', 0.6],
  // 7 law
  [7, 0, 'whoosh', 0.35, 0.05],
  [7, 1, 'glow', 0.4],
  [7, 2, 'pop', 0.45],
  [7, 3, 'stamp', 0.75],
  [7, 4, 'whoosh-short', 0.35],
  [7, 5, 'lock', 0.55],
  [7, 6, 'whoosh', 0.35, -0.3],
  [7, 7, 'tick-roll', 0.45],
  [7, 8, 'pop', 0.5],
  // 8 choice / save frame
  [8, 1, 'whoosh-short', 0.35, -0.2],
  [8, 2, 'pop', 0.5],
  [8, 3, 'strike', 0.45],
  [8, 4, 'draw', 0.4],
  [8, 5, 'pop-soft', 0.4],
  [8, 6, 'pop-soft', 0.4],
  [8, 7, 'tick', 0.8],
  [8, 7, 'ding', 0.5, 0.3],
  // 9 end
  [9, 0, 'whoosh-short', 0.3, 0.1],
  [9, 2, 'pop', 0.45],
  [9, 3, 'draw', 0.3],
  [9, 5, 'whoosh', 0.35, -0.35],
  [9, 5, 'stamp', 0.65, 0.2],
  [9, 5, 'scan', 0.45, 0.1],
  [9, 6, 'pop', 0.55],
];

export const buildCues = (scenes: TimelineScene[]): SfxCue[] =>
  ROWS.map(([id, ev, name, volume, offset = 0]) => {
    const scene = scenes.find((s) => s.id === id);
    const e = scene?.props.events[ev];
    if (!e) throw new Error(`sfx cue: scene ${id} event ${ev} not found`);
    return { at: e.sec + offset, name, volume };
  });
