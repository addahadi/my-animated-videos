import { loadFont as loadTajawal } from '@remotion/google-fonts/Tajawal';
import { loadFont as loadArchivo } from '@remotion/google-fonts/Archivo';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

// Arabic (Darija) display + captions
export const arabic = loadTajawal('normal', { weights: ['500', '700', '800', '900'], subsets: ['arabic', 'latin'] }).fontFamily;
// Latin heavy grotesk for numbers / wordmark
export const display = loadArchivo('normal', { weights: ['700', '800', '900'], subsets: ['latin'] }).fontFamily;
// mono labels (uppercase, letter-spaced, Latin only)
export const mono = loadMono('normal', { weights: ['500', '700', '800'], subsets: ['latin'] }).fontFamily;

// mixed text: Arabic first, Latin fallback inside the same run keeps Tajawal's Latin glyphs consistent
export const mixed = `${arabic}, ${display}, sans-serif`;
