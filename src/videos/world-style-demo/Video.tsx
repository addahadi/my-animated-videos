import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { GridCanvas, HeaderStrip } from '../../components/Canvas';
import { EndCard } from '../../components/EndCard';
import { ClockIcon, PinIcon } from '../../components/Icons';
import { Card, Mono, StickerPill } from '../../components/Labels';
import { CityMap, CITY, along, type Cam, type RoadTint } from '../../components/world/CityMap';
import { GaugeIcon, PhonePin } from '../../components/world/Glyphs';
import { LevelMeter, SlotTray, ZoneOverlay } from '../../components/world/Hud';
import { IconDisc } from '../../components/world/Panel';
import { CarToken, Ping, type AgentKind } from '../../components/world/Tokens';
import { TopCaption } from '../../components/world/TopCaption';
import { arabic } from '../../fonts';
import { SfxTrack } from '../../lib/sfx';
import { mix, pop, ramp } from '../../lib/time';
import { EASE_IN_OUT, SPRING, theme } from '../../theme';
import { world } from '../../theme-world';
import { CUES, PAGES, S, TOTAL_SEC } from './timeline';

export const WORLD_DEMO_FRAMES = Math.round(TOTAL_SEC * 30);

const L = theme.light;
const A = theme.accent;
const lane = 21; // drive on the right: offset from the road centre line

/* ---------- small helpers ---------- */

const camLerp = (a: Cam, b: Cam, p: number): Cam => ({ x: mix(a.x, b.x, p), y: mix(a.y, b.y, p), scale: mix(a.scale, b.scale, p) });

type Mover = { kind: AgentKind; pts: [number, number][]; speed: number; t0: number; ping?: number };
const drive = (m: Mover, t: number) => along(m.pts, Math.max(0, t - m.t0) * m.speed);
const pingU = (t: number, offset: number, period = 1.3) => (((t - offset) % period) + period) % period / world.motion.ping;

const Cars: React.FC<{ movers: Mover[]; t: number; pings?: boolean; pingOn?: number }> = ({ movers, t, pings = false, pingOn = 1 }) => (
  <>
    {movers.map((m, i) => {
      const p = drive(m, t);
      return (
        <React.Fragment key={i}>
          {pings && pingOn > 0 && <Ping x={p.x} y={p.y} u={pingU(t, m.ping ?? i * 0.37)} size={190} />}
          <CarToken x={p.x} y={p.y} angle={p.angle} kind={m.kind} t={t} />
        </React.Fragment>
      );
    })}
  </>
);

/* ---------- scene 1: hook (world) ---------- */

const X5 = CITY.xs[4]; // 1240, the main avenue
const heroDist = (t: number) => {
  const v = 220;
  if (t < 2.8) return v * t;
  const u = Math.min(1, (t - 2.8) / 1.2);
  return v * 2.8 + v * 1.2 * (u - (u * u) / 2); // eased stop
};
const JAM_V = [2000, 1890, 1780, 1670, 1560]; // queued cars on the avenue (world y)

const Hook: React.FC<{ t: number }> = ({ t }) => {
  const cam = camLerp({ x: X5, y: 2350, scale: 1.2 }, { x: X5, y: 2050, scale: 1.3 }, ramp(t, 0, S.hook[1], EASE_IN_OUT));
  const heroY = 2900 - heroDist(t);
  const tint: RoadTint = { x1: X5 + lane, y1: 2060, x2: X5 + lane, y2: 1480, color: A.red, p: ramp(t, 2.6, 3.5, EASE_IN_OUT) };
  const cross: Mover = { kind: 'neutral', pts: [[640, CITY.ys[6] + lane], [2000, CITY.ys[6] + lane]], speed: 300, t0: 0 };
  const cross2: Mover = { kind: 'neutral', pts: [[1900, CITY.ys[6] - lane], [500, CITY.ys[6] - lane]], speed: 260, t0: 1.2 };
  return (
    <CityMap cam={cam} tints={[tint]}>
      {JAM_V.map((y, i) => (
        <CarToken key={i} x={X5 + lane} y={y - Math.sin(t * 0.8 + i) * 3} angle={0} kind="neutral" t={t} />
      ))}
      <Cars movers={[cross, cross2]} t={t} />
      <CarToken x={X5 + lane} y={heroY} angle={0} kind="hero" t={t} />
    </CityMap>
  );
};

/* ---------- scene 2: the phone (panel) ---------- */

const PhonePanel: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const [a] = S.phone;
  const disc = pop(t, a + 0.15, fps, SPRING.soft);
  return (
    <AbsoluteFill>
      <GridCanvas mode="light" drift={(t - a) * 12} spacing={240} />
      {[0, 1, 2, 3].map((k) => (
        <Ping key={k} x={540} y={world.layout.panelObjectY + 40} u={t > a + 1.5 ? pingU(t, a + 1.5 + k * 0.35, 1.4) : 0} size={560} />
      ))}
      <IconDisc p={disc} y={world.layout.panelObjectY + 40} size={340}>
        <PhonePin size={200} />
      </IconDisc>
    </AbsoluteFill>
  );
};

/* ---------- scene 3: every phone reports (world) ---------- */

const { xs, ys } = CITY;
const SIGNAL_MOVERS: Mover[] = [
  { kind: 'hero', pts: [[xs[4] + lane, 2300], [xs[4] + lane, 600]], speed: 170, t0: S.signals[0] },
  { kind: 'neutral', pts: [[xs[3] - lane, 700], [xs[3] - lane, 2500]], speed: 210, t0: S.signals[0] - 1 },
  { kind: 'neutral', pts: [[500, ys[4] + lane], [2100, ys[4] + lane]], speed: 230, t0: S.signals[0] - 1.5 },
  { kind: 'neutral', pts: [[2000, ys[5] - lane], [400, ys[5] - lane]], speed: 200, t0: S.signals[0] - 1 },
  { kind: 'neutral', pts: [[xs[5] + lane, 2500], [xs[5] + lane, 500]], speed: 190, t0: S.signals[0] - 2 },
  { kind: 'neutral', pts: [[600, ys[3] + lane], [2100, ys[3] + lane]], speed: 240, t0: S.signals[0] - 0.5 },
  { kind: 'neutral', pts: [[xs[5] - lane, 500], [xs[5] - lane, 2500]], speed: 220, t0: S.signals[0] - 2.5 },
  { kind: 'neutral', pts: [[1900, ys[6] - lane], [500, ys[6] - lane]], speed: 210, t0: S.signals[0] - 1.2 },
  { kind: 'neutral', pts: [[xs[2] + lane, 2400], [xs[2] + lane, 500]], speed: 200, t0: S.signals[0] - 3 },
];

const Signals: React.FC<{ t: number }> = ({ t }) => {
  const [a, b] = S.signals;
  const cam = camLerp({ x: 1240, y: 1560, scale: 0.92 }, { x: 1280, y: 1480, scale: 0.98 }, ramp(t, a, b, EASE_IN_OUT));
  return (
    <CityMap cam={cam}>
      <Cars movers={SIGNAL_MOVERS} t={t} pings pingOn={ramp(t, a + 0.6, a + 1)} />
    </CityMap>
  );
};

/* ---------- scene 4: many slow phones on one road = traffic (world) ---------- */

const JAM_Y = ys[4] + lane; // eastbound lane of the 1400 street
const JAM_X = [1470, 1365, 1260, 1150, 1045, 940, 835];

const Jam: React.FC<{ t: number }> = ({ t }) => {
  const [a, b] = S.jam;
  const cam = camLerp({ x: 1150, y: 1440, scale: 1.12 }, { x: 1150, y: 1470, scale: 1.02 }, ramp(t, a, b, EASE_IN_OUT));
  const tints: RoadTint[] = [
    { x1: 1560, y1: JAM_Y, x2: 760, y2: JAM_Y, color: A.red, p: ramp(t, a + 0.8, a + 2.2, EASE_IN_OUT), opacity: 0.6 },
    { x1: xs[5], y1: 2300, x2: xs[5], y2: 700, color: A.green, p: ramp(t, a + 3.4, a + 4.4, EASE_IN_OUT), opacity: 0.45 },
    { x1: xs[3], y1: 700, x2: xs[3], y2: 2300, color: A.green, p: ramp(t, a + 3.6, a + 4.6, EASE_IN_OUT), opacity: 0.45 },
  ];
  const free: Mover[] = [
    { kind: 'neutral', pts: [[1800, ys[4] - lane], [500, ys[4] - lane]], speed: 300, t0: a },
    { kind: 'neutral', pts: [[2000, ys[4] - lane], [500, ys[4] - lane]], speed: 300, t0: a + 2.2 },
    { kind: 'neutral', pts: [[xs[5] + lane, 2300], [xs[5] + lane, 500]], speed: 280, t0: a + 0.5 },
    { kind: 'neutral', pts: [[xs[3] - lane, 700], [xs[3] - lane, 2400]], speed: 280, t0: a + 1 },
  ];
  const zone = pop(t, a + 2.8, 30, SPRING.pop);
  const speedTag = (i: number) => pop(t, a + 1.1 + i * 0.25, 30, SPRING.pop);
  return (
    <CityMap cam={cam} tints={tints}>
      <Cars movers={free} t={t} />
      {JAM_X.map((x, i) => {
        const creep = (t - a) * 6;
        return (
          <React.Fragment key={i}>
            <Ping x={x + creep} y={JAM_Y} u={pingU(t, a + i * 0.21, 1.2)} size={170} color={A.red} />
            <CarToken x={x + creep} y={JAM_Y} angle={90} kind="neutral" t={t} />
          </React.Fragment>
        );
      })}
      {[1, 4].map((i, k) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: JAM_X[i] + (t - a) * 6 - 70,
            top: JAM_Y - 118,
            width: 140,
            height: 44,
            borderRadius: 999,
            background: L.ink,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: Math.min(1, speedTag(k) * 3) * (1 - ramp(t, a + 2.7, a + 3)),
            scale: `${0.6 + 0.4 * speedTag(k)}`,
          }}
        >
          <Mono size={22} color="#F4F4F0">
            {k === 0 ? '4 KM/H' : '6 KM/H'}
          </Mono>
        </div>
      ))}
      <ZoneOverlay x={720} y={JAM_Y - 110} w={880} h={200} label="زحمة" p={zone} pulse={(Math.sin(t * 4) + 1) / 2} color={A.red} fill="rgba(230,88,86,0.14)" />
    </CityMap>
  );
};

/* ---------- scene 5: save frame (Report card on a night panel) ---------- */

const SaveFrame: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const [a] = S.save;
  const card = pop(t, a + 0.1, fps, SPRING.soft);
  const rows = [
    { icon: <PinIcon size={50} fill={A.yellow} />, text: 'بزاف تيليفونات هنا' },
    { icon: <GaugeIcon size={50} needle={0.12} />, text: 'يمشيو بشوية' },
    { icon: <ClockIcon size={50} />, text: 'في نفس الوقت' },
  ];
  const sticker = pop(t, a + 1.35, fps, SPRING.pop);
  return (
    <AbsoluteFill>
      <GridCanvas mode="light" drift={(t - a) * 12} spacing={240} />
      <Card style={{ left: 165, top: 640, width: 750, height: 600, opacity: Math.min(1, card * 3), scale: `${0.85 + 0.15 * card}`, rotate: '-1deg' }}>
        <div style={{ position: 'absolute', left: 40, right: 40, top: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Mono size={22} color={L.mono}>
            CHEAT SHEET
          </Mono>
          <Mono size={22} color={L.mono}>
            MAPS · TRAFFIC
          </Mono>
        </div>
        {rows.map((r, i) => {
          const p = pop(t, a + 0.45 + i * 0.28, fps, SPRING.pop);
          return (
            <div
              key={i}
              dir="rtl"
              style={{
                position: 'absolute',
                left: 40,
                right: 40,
                top: 96 + i * 118,
                height: 100,
                borderRadius: 18,
                border: `3px solid ${L.ink}`,
                background: i === 0 ? A.beige : L.surface,
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                padding: '0 28px',
                opacity: Math.min(1, p * 3),
                translate: `0px ${(1 - Math.min(p, 1)) * 30}px`,
              }}
            >
              {r.icon}
              <span style={{ fontFamily: arabic, fontWeight: 800, fontSize: 42, color: L.ink, paddingTop: 6, whiteSpace: 'nowrap' }}>{r.text}</span>
            </div>
          );
        })}
        <StickerPill text="= زحمة" tone="red" p={sticker} rotate={-4} size={58} style={{ left: 375, top: 470, translate: '-50% 0px' }} />
      </Card>
    </AbsoluteFill>
  );
};

/* ---------- scene 6: shared end card ---------- */

const End: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const [a] = S.end;
  const mini = pop(t, a + 0.15, fps, SPRING.soft);
  return (
    <EndCard
      bg={ramp(t, a, a + 0.25)}
      drift={(t - a) * 10}
      mark={pop(t, a + 0.3, fps, SPRING.soft)}
      scan={ramp(t, a + 0.5, a + 1.2, EASE_IN_OUT)}
      tagline={ramp(t, a + 0.7, a + 1.1)}
      stamp={pop(t, a + 0.6, fps, SPRING.snappy)}
      button={pop(t, a + 1.0, fps, SPRING.pop)}
      breathe={t > a + 1.5 ? 1 + 0.03 * Math.sin((t - a) * 5) : 1}
      buttonText="تابع باش ما يفوتكش الجاي"
      objects={
        <Card style={{ left: 290, top: 560, width: 500, height: 360, overflow: 'hidden', opacity: Math.min(1, mini * 3), scale: `${0.8 + 0.2 * mini}`, rotate: '2deg' }}>
          <div style={{ position: 'absolute', left: (494 - 1080 * 0.46) / 2, top: (354 - 1920 * 0.46) / 2, width: 1080, height: 1920, scale: '0.46', transformOrigin: '0 0' }}>
            <CityMap cam={{ x: 1150, y: 1440, scale: 1.3 }} tints={[{ x1: 1560, y1: JAM_Y, x2: 760, y2: JAM_Y, color: A.red, opacity: 0.6 }]}>
              {JAM_X.map((x, i) => (
                <CarToken key={i} x={x} y={JAM_Y} angle={90} kind={i === 3 ? 'hero' : 'neutral'} t={t} />
              ))}
            </CityMap>
          </div>
        </Card>
      }
    />
  );
};

/* ---------- composition ---------- */

const inS = (t: number, r: readonly [number, number]) => t >= r[0] && t < r[1];

export const WorldStyleDemo: React.FC<{ captions: boolean }> = ({ captions = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // persistent HUD: level meter (from the hook) and slot tray (from the phone panel), same position in every scene
  const meterIn = pop(t, 0.6, fps, SPRING.pop);
  const meterVal = t < S.phone[0] ? mix(0, 3, ramp(t, 2.8, 3.6)) : t < S.jam[0] ? mix(3, 0, ramp(t, S.phone[0] + 0.2, S.phone[0] + 0.7)) : mix(0, 4, ramp(t, S.jam[0] + 0.3, S.jam[0] + 2.3));
  const meterAlert = t < S.phone[0] ? ramp(t, 3.5, 3.8) : t < S.jam[0] ? 1 - ramp(t, S.phone[0] + 0.2, S.phone[0] + 0.5) : ramp(t, S.jam[0] + 2.4, S.jam[0] + 2.7);
  const trayIn = pop(t, S.phone[0] + 2.1, fps, SPRING.pop);
  const fills = [9.6, 11.0, 12.4].map((at) => pop(t, at, fps, SPRING.pop));
  const hudOut = ramp(t, S.save[0] - 0.05, S.save[0] + 0.2);
  const showHud = t < S.end[0];

  const body = t >= S.phone[0] && t < S.end[0];
  const headerP = ramp(t, S.phone[0], S.phone[0] + 0.45);

  return (
    <AbsoluteFill style={{ background: theme.light.bgEdge }}>
      {inS(t, S.hook) && <Hook t={t} />}
      {inS(t, S.phone) && <PhonePanel t={t} fps={fps} />}
      {inS(t, S.signals) && <Signals t={t} />}
      {inS(t, S.jam) && <Jam t={t} />}
      {inS(t, S.save) && <SaveFrame t={t} fps={fps} />}

      {showHud && (
        <div style={{ opacity: 1 - hudOut }}>
          <LevelMeter value={meterVal} alert={meterAlert} p={meterIn} />
          {t >= S.phone[0] && (
            <SlotTray
              p={trayIn}
              fills={fills}
              icons={[<PinIcon key="pin" size={46} fill={A.yellow} />, <GaugeIcon key="gauge" size={46} needle={0.3 + 0.4 * Math.sin(t * 2) ** 2} />, <ClockIcon key="clock" size={46} hand={t / 6} />]}
            />
          )}
        </div>
      )}

      {body && <HeaderStrip tag="HOW IT WORKS · MAPS" mode="light" p={headerP} />}
      {inS(t, S.end) && <End t={t} fps={fps} />}
      {captions && <TopCaption pages={PAGES} hidden={t >= S.end[0]} />}
      <SfxTrack cues={CUES} />
    </AbsoluteFill>
  );
};
