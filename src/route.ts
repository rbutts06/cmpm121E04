import type { EnemyType } from "./actors.ts";

export type Formation = "line" | "vee" | "column" | "pincer";

export interface Wave {
  type: EnemyType;
  count: number;
  formation: Formation;
  at: number;
  x?: number;
}

export interface Sector {
  name: string;
  subtitle: string;
  length: number;
  waves: Wave[];
}

export const grace_ticks = 240;

export const Sectors: Sector[] = [{
  name: "Outer Drift",
  subtitle: "Scouts ahead",
  length: 1560,
  waves: [
    { type: "drone", count: 4, formation: "line", at: 60 },
    { type: "drone", count: 5, formation: "vee", at: 360, x: 168 },
    { type: "drone", count: 5, formation: "vee", at: 660, x: 312 },
    { type: "drone", count: 6, formation: "line", at: 960 },
    { type: "drone", count: 4, formation: "column", at: 1200, x: 120 },
    { type: "drone", count: 4, formation: "column", at: 1260, x: 360 },
  ],
}, {
  name: "Shatter Belt",
  subtitle: "Divers incoming",
  length: 1800,
  waves: [
    { type: "drone", count: 6, formation: "vee", at: 60 },
    { type: "dart", count: 4, formation: "line", at: 300 },
    { type: "dart", count: 5, formation: "column", at: 600, x: 144 },
    { type: "dart", count: 5, formation: "column", at: 720, x: 336 },
    { type: "drone", count: 7, formation: "line", at: 1020 },
    { type: "dart", count: 5, formation: "vee", at: 1140 },
    { type: "dart", count: 6, formation: "line", at: 1440 },
  ],
}, {
  name: "Gun Lanes",
  subtitle: "Turrets online",
  length: 1920,
  waves: [
    { type: "turret", count: 1, formation: "line", at: 60 },
    { type: "drone", count: 6, formation: "vee", at: 240 },
    { type: "turret", count: 2, formation: "line", at: 540 },
    { type: "dart", count: 6, formation: "column", at: 840 },
    { type: "turret", count: 2, formation: "line", at: 1080 },
    { type: "drone", count: 6, formation: "line", at: 1140 },
    { type: "turret", count: 3, formation: "line", at: 1500 },
  ],
}, {
  name: "Lancer Gate",
  subtitle: "Crossfire",
  length: 1920,
  waves: [
    { type: "lancer", count: 4, formation: "pincer", at: 60 },
    { type: "dart", count: 6, formation: "vee", at: 360 },
    { type: "lancer", count: 6, formation: "pincer", at: 600 },
    { type: "turret", count: 2, formation: "line", at: 780 },
    { type: "lancer", count: 6, formation: "pincer", at: 1140 },
    { type: "drone", count: 8, formation: "vee", at: 1260 },
    { type: "dart", count: 8, formation: "line", at: 1560 },
  ],
}, {
  name: "Last Approach",
  subtitle: "Everything they have",
  length: 2040,
  waves: [
    { type: "turret", count: 3, formation: "line", at: 60 },
    { type: "lancer", count: 6, formation: "pincer", at: 180 },
    { type: "dart", count: 6, formation: "column", at: 540, x: 120 },
    { type: "dart", count: 6, formation: "column", at: 540, x: 360 },
    { type: "drone", count: 9, formation: "vee", at: 900 },
    { type: "turret", count: 2, formation: "line", at: 1020 },
    { type: "lancer", count: 8, formation: "pincer", at: 1320 },
    { type: "dart", count: 8, formation: "vee", at: 1560 },
  ],
}];

export const boss_stop = "The Warden";

export const Route_names: readonly string[] = [
  ...Sectors.map((sector) => sector.name),
  boss_stop,
];

export interface Spawn {
  type: EnemyType;
  x: number;
  y: number;
  side: number;
}

const center = 240;
const top = -30;
const left = -30;
const right = 510;

interface Slot {
  delay: number;
  x: number;
  y: number;
}

const Slots: Record<Formation, (wave: Wave, i: number) => Slot> = {
  line: (wave, i) => ({
    delay: 0,
    x: (wave.x ?? center) + (i - middle(wave)) * 64,
    y: top,
  }),
  vee: (wave, i) => ({
    delay: Math.abs(i - middle(wave)) * 10,
    x: (wave.x ?? center) + (i - middle(wave)) * 44,
    y: top,
  }),
  column: (wave, i) => ({
    delay: i * 24,
    x: wave.x ?? center,
    y: top,
  }),
  pincer: (_wave, i) => ({
    delay: Math.floor(i / 2) * 30,
    x: i % 2 === 0 ? left : right,
    y: 70 + Math.floor(i / 2) * 50,
  }),
};

function middle(wave: Wave): number {
  return (wave.count - 1) / 2;
}

export function spawnAt(sector: Sector, t: number): Spawn[] {
  const spawns: Spawn[] = [];
  for (const wave of sector.waves) {
    for (let i = 0; i < wave.count; i++) {
      const slot = Slots[wave.formation](wave, i);
      if (t === wave.at + slot.delay) {
        spawns.push({
          type: wave.type,
          x: slot.x,
          y: slot.y,
          side: i % 2 === 0 ? 1 : -1,
        });
      }
    }
  }
  return spawns;
}
