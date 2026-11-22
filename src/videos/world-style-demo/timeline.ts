// World style demo: scene ranges, demo captions and SFX cues.
// There is no narration: captions are timed by hand to show the TopCaption behaviour.
// A real World video takes its timing from the recorded voice via plans/<slug>-timeline.json.
import type { KeyPage } from '../../components/world/TopCaption';
import type { SfxCue } from '../../lib/sfx';

export const S = {
  hook: [0, 4.6],
  phone: [4.6, 8.4],
  signals: [8.4, 13.6],
  jam: [13.6, 18.4],
  save: [18.4, 22.0],
  end: [22.0, 25.5],
} as const;

export const TOTAL_SEC = 25.5;

/** words split evenly over [a, b]; a leading "*" marks a key word (yellow chip) */
const page = (a: number, b: number, line: string): KeyPage => {
  const words = line.split(' ');
  const step = (b - a) / words.length;
  return {
    startMs: a * 1000,
    endMs: b * 1000,
    words: words.map((w, i) => ({
      text: w.replace(/^\*/, ''),
      key: w.startsWith('*'),
      startMs: Math.round((a + i * step) * 1000),
      endMs: Math.round((a + (i + 1) * step) * 1000),
    })),
  };
};

export const PAGES: KeyPage[] = [
  page(0.25, 1.9, 'كيفاش تطبيق الخرائط'),
  page(2.0, 4.3, 'يعرف بلي كاين *زحمة؟'),
  page(4.8, 6.4, 'السر كاين في *تيليفونك'),
  page(6.5, 8.1, 'اللي راهو في جيبك'),
  page(8.6, 10.4, 'كل تيليفون يبعث *موقعو'),
  page(10.7, 13.2, '*وسرعتو، *والوقت'),
  page(13.8, 15.3, 'بزاف تيليفونات *بطاو'),
  page(15.5, 16.5, 'في نفس الطريق'),
  page(16.7, 18.1, 'يعني *زحمة'),
  page(18.6, 20.0, '3 معلومات *برك'),
  page(20.2, 21.6, '*خليها معاك'),
];

export const CUES: SfxCue[] = [
  { at: 0.6, name: 'pop-soft', volume: 0.35 },
  { at: 2.6, name: 'draw', volume: 0.3 },
  { at: 3.5, name: 'buzz', volume: 0.3 },
  { at: 4.6, name: 'whoosh-short', volume: 0.4 },
  { at: 4.75, name: 'pop', volume: 0.4 },
  { at: 6.1, name: 'glow', volume: 0.25 },
  { at: 6.7, name: 'pop-soft', volume: 0.35 },
  { at: 8.4, name: 'whoosh-short', volume: 0.4 },
  { at: 9.6, name: 'pop', volume: 0.45 },
  { at: 11.0, name: 'pop', volume: 0.45 },
  { at: 12.4, name: 'pop', volume: 0.45 },
  { at: 13.6, name: 'zoom', volume: 0.35 },
  { at: 14.4, name: 'draw', volume: 0.3 },
  { at: 16.0, name: 'buzz', volume: 0.3 },
  { at: 16.4, name: 'stamp', volume: 0.35 },
  { at: 18.4, name: 'whoosh-short', volume: 0.4 },
  { at: 18.85, name: 'tick', volume: 0.5 },
  { at: 19.13, name: 'tick', volume: 0.5 },
  { at: 19.41, name: 'tick', volume: 0.5 },
  { at: 19.75, name: 'stamp', volume: 0.4 },
  { at: 22.0, name: 'whoosh', volume: 0.35 },
  { at: 22.5, name: 'scan', volume: 0.3 },
  { at: 22.6, name: 'stamp', volume: 0.35 },
  { at: 23.0, name: 'pop', volume: 0.4 },
];
