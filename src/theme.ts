// Generated from plans/style.md (Runtime.tech visual system). Do not hardcode style values elsewhere.
import { Easing } from 'remotion';

export const theme = {
  canvas: { width: 1080, height: 1920, fps: 30 },

  light: {
    bgCenter: '#DFE1DC',
    bgEdge: '#D1D3D0',
    gridMajor: '#D3D5D0',
    gridMinor: '#D9DBD6',
    surface: '#EEEEEA',
    ink: '#0B0F15',
    inkSoft: '#474648',
    faded: '#BCC0C6',
    mono: '#6C6C6C',
    pill: '#1F2120',
  },

  dark: {
    bg: '#222B44',
    bgMid: '#253352',
    grid: '#2C3D5E',
    scanlines: 'rgba(255,255,255,0.04)',
    text: '#E2F5FF',
    mono: '#B3E2FB',
    panel: '#334A6A',
    glow: '#5C83A5',
    rulerFrom: '#3E8297',
    rulerTo: '#416C9A',
    marker: '#81E1C8',
    delta: '#E6CF6D',
  },

  accent: {
    red: '#E65856',
    green: '#32AF7A',
    yellow: '#EECE61',
    blue: '#556BD1',
    gold: '#C9BC92',
    beige: '#E9E3D0',
  },

  caption: {
    fill: '#0B0F15',
    active: '#FFFFFF',
    upcoming: '#65696F',
    radius: 18,
    height: 83,
    centerY: 1383,
    centerX: 540,
    size: 64,
  },

  radius: { card: 24, pill: 18, sticker: 21 },
  stroke: { card: 3, sticker: 3 },
  shadow: {
    card: '6px 8px 14px rgba(11,15,21,0.18)',
    lift: '10px 16px 30px rgba(11,15,21,0.22)',
  },
  safe: { top: 250, bottom: 450, rightX: 940, contentX: [165, 915], contentY: [400, 1300] },

  layout: {
    headerY: 270,
    headerX: [162, 914],
    pillY: [316, 368],
    pillW: 440,
    captionY: [1342, 1425],
  },

  motion: {
    pop: 0.35,
    enter: 0.4,
    exit: 0.25,
    dim: 0.2,
    stagger: 0.25,
    bezier: [0.22, 1, 0.36, 1] as const,
  },

  type: {
    numberSize: 100,
    headlineSize: 45,
    captionArabic: 64,
    captionLatin: 58,
    monoHeader: 22,
    monoPill: 33,
    monoTag: 23,
    monoSpacing: '0.12em',
  },
} as const;

export const EASE_OUT = Easing.bezier(...theme.motion.bezier);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.55, 0, 1, 0.45);

// spring presets (style.md section 7: sticker pop overshoots to ~1.08 then settles)
export const SPRING = {
  pop: { damping: 11, stiffness: 170, mass: 0.7 },
  soft: { damping: 18, stiffness: 120, mass: 0.9 },
  snappy: { damping: 20, stiffness: 260, mass: 0.6 },
  heavy: { damping: 14, stiffness: 90, mass: 1.2 },
} as const;
