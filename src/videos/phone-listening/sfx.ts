import type { SfxCue } from '../../lib/sfx';
import type { TimelineScene } from '../../lib/time';

/**
 * SFX cue sheet. Every cue is anchored to a timeline event: [sceneId, eventIndex, name, volume, offsetSec].
 * Times therefore move with the timeline; nothing here is a hardcoded frame.
 */
type Row = [number, number, string, number, number?];

const ROWS: Row[] = [
  // 1 hook
  [1, 1, 'pop', 0.5],
  [1, 1, 'pop-soft', 0.4, 0.35],
  [1, 2, 'pop', 0.4],
  [1, 3, 'whoosh', 0.42],
  [1, 3, 'pop-soft', 0.22, 0.12],
  [1, 3, 'pop-soft', 0.22, 0.26],
  [1, 3, 'pop-soft', 0.22, 0.4],
  [1, 3, 'whoosh-short', 0.3, 0.55],
  [1, 4, 'pop', 0.55],
  [1, 5, 'stamp', 0.72],
  [1, 6, 'pop', 0.5],
  [1, 7, 'stamp', 0.78],
  // 2 suspect
  [2, 0, 'whoosh', 0.38],
  [2, 1, 'pop', 0.45],
  [2, 1, 'pop-soft', 0.35, 1.0],
  [2, 2, 'pop', 0.5],
  [2, 3, 'lock', 0.55],
  [2, 4, 'lock', 0.32],
  // 3 drain test
  [3, 0, 'whoosh-short', 0.35],
  [3, 1, 'pop-soft', 0.32],
  [3, 2, 'pop-soft', 0.3],
  [3, 3, 'tick-roll', 0.38],
  [3, 4, 'tick-roll', 0.3],
  [3, 5, 'stamp', 0.75],
  // 4 indicator dot
  [4, 0, 'zoom', 0.5],
  [4, 1, 'pop', 0.5],
  [4, 2, 'draw', 0.45],
  [4, 3, 'pop', 0.5],
  // 5 study
  [5, 0, 'pop', 0.45],
  [5, 1, 'whoosh-short', 0.3],
  [5, 2, 'tick-roll', 0.42],
  [5, 3, 'scan', 0.5],
  [5, 4, 'ding', 0.45],
  [5, 4, 'pop', 0.4],
  [5, 5, 'strike', 0.45, 0.25],
  [5, 6, 'pop', 0.55],
  // 6 screen leak (twist)
  [6, 0, 'hit', 0.7],
  [6, 1, 'pop', 0.5],
  [6, 1, 'whoosh-short', 0.3, 0.55],
  [6, 2, 'shutter', 0.6],
  [6, 2, 'shutter', 0.45, 0.35],
  [6, 2, 'shutter', 0.4, 0.7],
  [6, 3, 'whoosh', 0.45],
  [6, 4, 'pop', 0.5],
  // 7 ear -> eye
  [7, 0, 'whoosh', 0.4],
  [7, 1, 'pop', 0.45],
  [7, 2, 'strike', 0.55],
  [7, 3, 'morph', 0.55],
  // 8 GPS
  [8, 0, 'pop', 0.45],
  [8, 1, 'steps', 0.42],
  [8, 2, 'pop', 0.5],
  [8, 3, 'draw', 0.3],
  [8, 4, 'pop', 0.5],
  // 9 shared wifi
  [9, 0, 'whoosh-short', 0.3],
  [9, 1, 'type', 0.5],
  [9, 2, 'pop', 0.45],
  [9, 3, 'pop-soft', 0.4],
  [9, 4, 'draw', 0.45],
  [9, 5, 'pop', 0.5],
  [9, 5, 'whoosh-short', 0.35, 0.3],
  // 10 AI blueprint
  [10, 0, 'scan', 0.55],
  [10, 1, 'pop-soft', 0.45],
  [10, 1, 'whoosh-short', 0.22, 0.9],
  [10, 2, 'pop-soft', 0.45],
  [10, 2, 'whoosh-short', 0.22, 0.9],
  [10, 3, 'pop-soft', 0.45],
  [10, 3, 'whoosh-short', 0.22, 0.6],
  [10, 4, 'hum', 0.45],
  [10, 5, 'pop', 0.45],
  [10, 6, 'whoosh', 0.35],
  [10, 7, 'draw', 0.35],
  [10, 8, 'whoosh-short', 0.4],
  [10, 9, 'hit', 0.45],
  // 11 brain
  [11, 0, 'whoosh-short', 0.3],
  [11, 1, 'pop', 0.45],
  [11, 2, 'pop-soft', 0.4],
  [11, 3, 'pop', 0.45],
  [11, 4, 'glow', 0.55],
  [11, 6, 'pop-soft', 0.3],
  // 12 recap / save frame
  [12, 0, 'unlock', 0.6],
  [12, 1, 'pop-soft', 0.45],
  [12, 1, 'strike', 0.4, 0.3],
  [12, 2, 'pop-soft', 0.45],
  [12, 3, 'pop-soft', 0.45],
  [12, 4, 'pop', 0.5],
  [12, 6, 'whoosh', 0.35],
  // 13 end card
  [13, 0, 'whoosh', 0.4],
  [13, 1, 'stamp', 0.7],
  [13, 2, 'scan', 0.5],
  [13, 3, 'pop', 0.45],
  [13, 4, 'pop', 0.55],
];

export const buildCues = (scenes: TimelineScene[]): SfxCue[] =>
  ROWS.map(([id, ev, name, volume, offset = 0]) => {
    const scene = scenes.find((s) => s.id === id);
    const e = scene?.props.events[ev];
    if (!e) throw new Error(`sfx cue: scene ${id} event ${ev} not found`);
    return { at: e.sec + offset, name, volume };
  });
