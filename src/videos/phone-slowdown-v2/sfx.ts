import type { SfxCue } from '../../lib/sfx';
import type { TimelineScene } from '../../lib/time';

// [scene id, event index, sfx name, volume, offset seconds]. Only files in public/sfx/ are used.
// Plan names without a file: bloop -> morph, click -> tick, water -> glow (see build notes).
const ROWS: [number, number, string, number, number?][] = [
  // 1 hook
  [1, 0, 'whoosh', 0.35],
  [1, 1, 'pop', 0.5, 0.3],
  [1, 2, 'tick-roll', 0.35],
  [1, 2, 'pop-soft', 0.45, 0.45],
  [1, 3, 'stamp', 0.7],
  // 2 your camera
  [2, 1, 'whoosh-short', 0.35],
  [2, 2, 'zoom', 0.35],
  [2, 3, 'tick', 0.5],
  [2, 4, 'whoosh-short', 0.4],
  [2, 4, 'morph', 0.4, 0.45],
  // 3 verdict locked
  [3, 1, 'lock', 0.55],
  [3, 2, 'pop-soft', 0.4],
  [3, 3, 'whoosh-short', 0.3],
  [3, 4, 'type', 0.4],
  // 4 case file
  [4, 1, 'pop-soft', 0.35],
  [4, 2, 'pop', 0.4, 0.45],
  [4, 3, 'whoosh-short', 0.3],
  [4, 3, 'stamp', 0.6, 0.45],
  [4, 4, 'whoosh-short', 0.3],
  [4, 4, 'pop', 0.45, 0.3],
  [4, 5, 'whoosh-short', 0.3],
  // 5 claim vs reply
  [5, 1, 'pop', 0.45],
  [5, 2, 'pop', 0.45],
  [5, 3, 'tick', 0.6],
  [5, 4, 'whoosh', 0.3],
  [5, 5, 'morph', 0.35],
  [5, 6, 'tick-roll', 0.35],
  // 6 blueprint power
  [6, 0, 'scan', 0.35],
  [6, 1, 'glow', 0.35],
  [6, 2, 'draw', 0.35],
  [6, 3, 'hit', 0.35],
  [6, 4, 'whoosh-short', 0.3],
  [6, 6, 'glow', 0.3],
  [6, 7, 'pop-soft', 0.4],
  // 7 throttle
  [7, 1, 'hum', 0.3],
  [7, 2, 'strike', 0.55],
  [7, 3, 'pop-soft', 0.4],
  [7, 4, 'tick-roll', 0.4],
  [7, 5, 'pop', 0.4],
  [7, 7, 'pop-soft', 0.4],
  [7, 8, 'pop-soft', 0.4],
  [7, 9, 'ding', 0.45],
  // 8 apps grow
  [8, 0, 'whoosh', 0.3],
  [8, 2, 'pop', 0.4],
  [8, 3, 'pop-soft', 0.4],
  [8, 3, 'pop-soft', 0.4, 0.32],
  [8, 3, 'pop-soft', 0.4, 0.64],
  [8, 5, 'draw', 0.35],
  [8, 6, 'draw', 0.35],
  // 9 same phone
  [9, 3, 'tick-roll', 0.4],
  [9, 5, 'pop-soft', 0.4],
  [9, 6, 'pop', 0.45],
  [9, 7, 'whoosh-short', 0.35],
  [9, 8, 'ding', 0.4],
  // 10 storage + heat + recap
  [10, 1, 'pop-soft', 0.4],
  [10, 2, 'tick-roll', 0.35],
  [10, 3, 'pop-soft', 0.4],
  [10, 5, 'pop', 0.45],
  [10, 6, 'pop', 0.4],
  // 11 verdict
  [11, 1, 'unlock', 0.45],
  [11, 2, 'pop', 0.4, 0.35],
  [11, 3, 'draw', 0.35],
  [11, 4, 'stamp', 0.7],
  // 12 save frame
  [12, 1, 'whoosh-short', 0.35],
  [12, 2, 'pop-soft', 0.4],
  [12, 3, 'pop-soft', 0.4],
  [12, 4, 'pop-soft', 0.4],
  [12, 5, 'tick', 0.7],
  [12, 6, 'ding', 0.45],
  // 13 end
  [13, 1, 'whoosh-short', 0.3],
  [13, 2, 'stamp', 0.6, 0.15],
  [13, 2, 'scan', 0.4, 0.1],
  [13, 3, 'pop', 0.5],
];

export const buildCues = (scenes: TimelineScene[]): SfxCue[] =>
  ROWS.map(([id, ev, name, volume, offset = 0]) => {
    const scene = scenes.find((s) => s.id === id);
    const e = scene?.props.events[ev];
    if (!e) throw new Error(`sfx cue: scene ${id} event ${ev} not found`);
    return { at: e.sec + offset, name, volume };
  });
