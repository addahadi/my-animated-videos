// Generated from plans/style-world.md (Runtime.tech "World" style). Do not hardcode style values elsewhere.
// World uses the Report palette (light grid canvas, ink outlines, #EEEEEA surfaces, Runtime accents):
// only the map vocabulary is new. Shared tokens come from theme.ts.
import { theme } from './theme';

const L = theme.light;
const A = theme.accent;

export const world = {
  map: {
    ground: L.bgCenter,            // roads are the canvas itself
    grid: L.gridMajor,             // grid moves with the map
    gridStep: 120,
    laneDash: 'rgba(11,15,21,0.32)',  // dashed ink centre lines
    stopLine: 'rgba(11,15,21,0.18)',
    // districts: soft tints of the Runtime accents (muted so the hero yellow and the road bands stay the loudest)
    districts: ['#CDD4F2', '#C4E6D3', '#F3E2A8', '#F5D5BE', A.beige],  // blue, mint, yellow, peach, beige
    neutralBlocks: [L.surface, '#E3E5E1'],  // mixed into every district
    districtShare: 0.62,                     // share of blocks that take the district tint
    blockStroke: L.ink,
    blockStrokeW: 3,
    blockRadius: 12,
    blockShadow: 'rgba(11,15,21,0.13)',  // offset shadow (6, 8), like Report cards
    detail: 'rgba(11,15,21,0.22)',       // floor-plan inner lines, rooftop units
    hatch: 'rgba(11,15,21,0.16)',        // plaza hatching
    park: '#B9E0CA',
    tree: '#86C7A3',
    veil: 'rgba(223,225,220,0.65)',
  },

  agent: {
    hero: A.yellow,
    neutral: L.surface,
    threat: A.red,
    system: A.blue,
    stroke: L.ink,
    shadow: 'rgba(11,15,21,0.22)',
  },

  hud: {
    on: L.ink,
    off: L.surface,
    stroke: L.ink,
    slotDash: 'rgba(11,15,21,0.45)',
    slotQ: L.mono,
    plate: L.surface,
    slotIcon: L.ink,
    zone: A.blue,
    zoneFill: 'rgba(85,107,209,0.12)',
    alert: A.red,
  },

  caption: {
    // the Report caption pill, moved to the top
    fill: theme.caption.fill,
    active: theme.caption.active,
    upcoming: theme.caption.upcoming,
    chip: A.yellow,
    chipText: L.ink,
    radius: theme.caption.radius,
    height: 88,
    centerY: 372,
    size: 62,
  },

  layout: {
    headerY: 270,
    captionY: [328, 416] as const,
    hudY: 500,
    slotsY: 600,
    contentY: [690, 1300] as const,
    panelObjectY: 900,
  },

  motion: {
    camPan: 1.2,
    camZoom: [0.85, 1.6] as const,
    tokenSpeed: 260,
    ping: 0.9,
  },
} as const;

export { theme };
