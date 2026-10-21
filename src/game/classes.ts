export type TorpKind = "photon" | "plasma" | "obliterator";

export type ShipClass = {
  id: string;
  name: string;
  code: string;
  race: string;
  home: string;
  blurb: string;
  cruise: number;
  maxWarp: number;
  turn: number;
  hull: number;
  shieldStr: number;
  energy: number;
  phaser: number;
  phaserRange: number;
  esi: boolean;
  torpKind: TorpKind;
  torpName: string;
  torpDmg: number;
  torpMin: number;
  torpMax: number;
  torpSpeed: number;
  torpHoming: number;
  magazine: number;
  torpCd: number;
  cloak: boolean;
  scan: number;
  transwarp: boolean;
  /** Guided drones aboard. JavaTrek classes that carry racks. */
  drones?: number;
  droneDmg?: number;
  /** DY-600 phaser: shoves the shooter clear instead of a clean kill shot. */
  teleport?: boolean;
  /** KEV-12 / KPB-13: one torpedo returns every two seconds. */
  regenTorp?: boolean;
  /** Warbird: flat phaser damage, spends one torpedo. */
  agonizer?: boolean;
  /** JavaTrek mine belt. M drops one. */
  mines?: number;
  mineDmg?: number;
};

export const CLASSES: ShipClass[] = [
  {
    id: "EXCEL",
    name: "Excelsior",
    code: "EXCEL",
    race: "Federation",
    home: "SB1",
    blurb:
      "Heavy cruiser. Photon tubes that hit harder at long range, thick shields, and a tracking transwarp spike.",
    cruise: 9,
    maxWarp: 12,
    turn: 1.2,
    hull: 560,
    shieldStr: 7.4,
    energy: 170,
    phaser: 84,
    phaserRange: 640,
    esi: false,
    torpKind: "photon",
    torpName: "Photon",
    torpDmg: 130,
    torpMin: 240,
    torpMax: 1650,
    torpSpeed: 1020,
    torpHoming: 0.7,
    magazine: 18,
    torpCd: 0.8,
    cloak: false,
    scan: 4800,
    transwarp: true,
    drones: 4,
    droneDmg: 80,
    mines: 5,
    mineDmg: 170,
  },
  {
    id: "LARSON",
    name: "Larson",
    code: "LARSON",
    race: "Federation",
    home: "SB1",
    blurb:
      "The 1993 destroyer. Photons, eight drones, and a mine belt. No cloak. The tubes are the ship. Do not miss.",
    cruise: 10,
    maxWarp: 13,
    turn: 1.15,
    hull: 500,
    shieldStr: 7.2,
    energy: 150,
    phaser: 62,
    phaserRange: 600,
    esi: false,
    torpKind: "photon",
    torpName: "Photon",
    torpDmg: 118,
    torpMin: 220,
    torpMax: 1450,
    torpSpeed: 1000,
    torpHoming: 0.55,
    magazine: 16,
    torpCd: 0.72,
    cloak: false,
    scan: 4600,
    transwarp: false,
    drones: 8,
    droneDmg: 100,
    mines: 8,
    mineDmg: 180,
  },
  {
    id: "RBOP",
    name: "Bird-of-Prey",
    code: "RBOP",
    race: "Romulan",
    home: "SB3",
    blurb:
      "Cloak, one plasma tube, and the legs to leave the wreck behind. Fragile if you get caught decloaked.",
    cruise: 12,
    maxWarp: 14,
    turn: 1.75,
    hull: 300,
    shieldStr: 5.1,
    energy: 120,
    phaser: 54,
    phaserRange: 500,
    esi: false,
    torpKind: "plasma",
    torpName: "Plasma",
    torpDmg: 230,
    torpMin: 180,
    torpMax: 1900,
    torpSpeed: 740,
    torpHoming: 2.5,
    magazine: 6,
    torpCd: 2.15,
    cloak: true,
    scan: 3900,
    transwarp: false,
    mines: 6,
    mineDmg: 180,
  },
  {
    id: "KEV12",
    name: "KEV-12",
    code: "KEV-12",
    race: "Klingon",
    home: "SB2",
    blurb:
      "Obliterators hit the same at any range and grow back, one every two seconds. She cloaks, she carries fifteen drones, and she turns like a moon.",
    cruise: 8,
    maxWarp: 10,
    turn: 0.95,
    hull: 660,
    shieldStr: 8.4,
    energy: 165,
    phaser: 98,
    phaserRange: 740,
    esi: false,
    torpKind: "obliterator",
    torpName: "Obliterator",
    torpDmg: 72,
    torpMin: 30,
    torpMax: 1080,
    torpSpeed: 1200,
    torpHoming: 0.25,
    magazine: 26,
    torpCd: 0.38,
    cloak: true,
    scan: 4300,
    transwarp: false,
    drones: 15,
    droneDmg: 120,
    regenTorp: true,
  },
  {
    id: "WARBIRD",
    name: "Warbird",
    code: "WARBIRD",
    race: "Romulan",
    home: "SB3",
    blurb:
      "Agonizers ignore range and spend a torpedo to fire. Plasma hits harder the farther it flies. Cloak and a mine belt if the range fight goes sour.",
    cruise: 11,
    maxWarp: 13,
    turn: 1.05,
    hull: 520,
    shieldStr: 6.5,
    energy: 155,
    phaser: 70,
    phaserRange: 560,
    esi: false,
    torpKind: "plasma",
    torpName: "Plasma",
    torpDmg: 250,
    torpMin: 260,
    torpMax: 2050,
    torpSpeed: 700,
    torpHoming: 2.1,
    magazine: 8,
    torpCd: 1.9,
    cloak: true,
    scan: 4100,
    transwarp: false,
    agonizer: true,
    mines: 6,
    mineDmg: 180,
  },
  {
    id: "CDA180",
    name: "Galor",
    code: "CDA-180",
    race: "Cardassian",
    home: "SB4",
    blurb:
      "Expanding-sphere phasers scorch every ship in range at once. Crowds make you weaker. Duels make you cruel.",
    cruise: 10,
    maxWarp: 12,
    turn: 1.12,
    hull: 540,
    shieldStr: 6.9,
    energy: 155,
    phaser: 128,
    phaserRange: 530,
    esi: true,
    torpKind: "photon",
    torpName: "Photon",
    torpDmg: 100,
    torpMin: 180,
    torpMax: 1350,
    torpSpeed: 980,
    torpHoming: 0.45,
    magazine: 14,
    torpCd: 0.9,
    cloak: false,
    scan: 4200,
    transwarp: false,
    drones: 10,
    droneDmg: 130,
  },
  {
    id: "BR5",
    name: "Brigand",
    code: "BR-5",
    race: "Orion",
    home: "SB4",
    blurb:
      "Turns like a thief and cloaks like a rumor. Falls apart if a cruiser gets a clean, close phaser lock.",
    cruise: 13,
    maxWarp: 15,
    turn: 1.9,
    hull: 280,
    shieldStr: 4.5,
    energy: 115,
    phaser: 66,
    phaserRange: 480,
    esi: false,
    torpKind: "photon",
    torpName: "Photon",
    torpDmg: 115,
    torpMin: 160,
    torpMax: 1250,
    torpSpeed: 1100,
    torpHoming: 0.9,
    magazine: 10,
    torpCd: 0.65,
    cloak: true,
    scan: 3600,
    transwarp: false,
    drones: 6,
    droneDmg: 80,
  },
  {
    id: "DY600",
    name: "Freighter",
    code: "DY-600",
    race: "Federation",
    home: "SB1",
    blurb:
      "The JavaTrek freighter. Weak phasers that teleport you clear of the target, a thick shield belt, a hold full of drones, and a transwarp spike that does not track.",
    cruise: 8,
    maxWarp: 11,
    turn: 0.82,
    hull: 740,
    shieldStr: 10,
    energy: 140,
    phaser: 42,
    phaserRange: 500,
    esi: false,
    torpKind: "photon",
    torpName: "Photon",
    torpDmg: 150,
    torpMin: 0,
    torpMax: 1000,
    torpSpeed: 860,
    torpHoming: 0.2,
    magazine: 8,
    torpCd: 1.35,
    cloak: false,
    scan: 5200,
    transwarp: true,
    drones: 12,
    droneDmg: 80,
    teleport: true,
  },
];

export type ClassSheet = {
  turn: number;
  cruise: number;
  damageWarp: number;
  warpEnergy: string;
  impulse: number;
  transwarp: string;
  warpCost: number;
  damagePct: number;
  shield: number;
  visibility: number;
  cloak: string;
  scan: number;
  phasers: string;
  torpedoes: string;
  drones: string;
  mines: string;
  crew: number;
  home: string;
};

/** Constructor numbers from rumour/jtrek Ship*.java. Parenthetical warp energy is the mtrek.com class table. */
export const SHEETS: Record<string, ClassSheet> = {
  EXCEL: {
    turn: 10,
    cruise: 12,
    damageWarp: 17,
    warpEnergy: "130 (160)",
    impulse: 50,
    transwarp: "Tracking",
    warpCost: 2,
    damagePct: 45,
    shield: 17,
    visibility: 100,
    cloak: "—",
    scan: 10000,
    phasers: "PH 65 · 0–600",
    torpedoes: "Photon · 6 tubes · 54 · 500–1200",
    drones: "4 × 400",
    mines: "5 × 900",
    crew: 750,
    home: "Earth",
  },
  LARSON: {
    turn: 10,
    cruise: 13,
    damageWarp: 17,
    warpEnergy: "100 (140)",
    impulse: 50,
    transwarp: "—",
    warpCost: 1,
    damagePct: 45,
    shield: 17,
    visibility: 95,
    cloak: "—",
    scan: 11000,
    phasers: "PH 40 · 0–600",
    torpedoes: "Photon · 4 tubes · 48 · 600–1400",
    drones: "8 × 500",
    mines: "8 × 900",
    crew: 220,
    home: "Earth",
  },
  RBOP: {
    turn: 12,
    cruise: 14,
    damageWarp: 18,
    warpEnergy: "80 (110)",
    impulse: 50,
    transwarp: "—",
    warpCost: 1,
    damagePct: 50,
    shield: 18,
    visibility: 95,
    cloak: "90s · pwr 80 · rgn 2",
    scan: 8000,
    phasers: "PH 25 · 0–500",
    torpedoes: "Plasma · 1 tube · 15 · 500–2000",
    drones: "—",
    mines: "6 × 900",
    crew: 12,
    home: "Romulus",
  },
  KEV12: {
    turn: 8,
    cruise: 10,
    damageWarp: 12,
    warpEnergy: "120 (150)",
    impulse: 60,
    transwarp: "—",
    warpCost: 2,
    damagePct: 40,
    shield: 17,
    visibility: 100,
    cloak: "50s · pwr 50 · rgn 1",
    scan: 13000,
    phasers: "PH 60 · 0–1000",
    torpedoes: "Obliterator · 8 tubes · 60 · regen · 500–1200",
    drones: "15 × 600",
    mines: "—",
    crew: 150,
    home: "Klinzhai",
  },
  WARBIRD: {
    turn: 12,
    cruise: 13,
    damageWarp: 17,
    warpEnergy: "100 (130)",
    impulse: 40,
    transwarp: "—",
    warpCost: 1,
    damagePct: 45,
    shield: 16,
    visibility: 96,
    cloak: "60s · pwr 75 · rgn 2",
    scan: 8000,
    phasers: "AG 40 · 0–500",
    torpedoes: "Var. plasma · 1 tube · 35 · 500–2000",
    drones: "—",
    mines: "6 × 900",
    crew: 43,
    home: "Romulus",
  },
  CDA180: {
    turn: 10,
    cruise: 12,
    damageWarp: 15,
    warpEnergy: "140 (180)",
    impulse: 60,
    transwarp: "—",
    warpCost: 2,
    damagePct: 45,
    shield: 17,
    visibility: 98,
    cloak: "—",
    scan: 11000,
    phasers: "ESI 60 · 0–500",
    torpedoes: "Photon · 5 tubes · 70 · 500–1300",
    drones: "20 × 800 · variable",
    mines: "—",
    crew: 523,
    home: "Cardassia",
  },
  BR5: {
    turn: 14,
    cruise: 16,
    damageWarp: 18,
    warpEnergy: "110 (150)",
    impulse: 40,
    transwarp: "—",
    warpCost: 1,
    damagePct: 60,
    shield: 15,
    visibility: 96,
    cloak: "90s · pwr 80 · rgn 1",
    scan: 7500,
    phasers: "PH 40 · 0–500",
    torpedoes: "Photon · 2 tubes · 30 · 500–1000",
    drones: "6 × 400",
    mines: "—",
    crew: 25,
    home: "Orion",
  },
  DY600: {
    turn: 8,
    cruise: 11,
    damageWarp: 13,
    warpEnergy: "120 (120)",
    impulse: 60,
    transwarp: "Non-tracking",
    warpCost: 2,
    damagePct: 30,
    shield: 25,
    visibility: 100,
    cloak: "—",
    scan: 8000,
    phasers: "PH 20 · 0–500 · teleporter",
    torpedoes: "Torpedo · 1 tube · 200 · 500–1000",
    drones: "30 × 400",
    mines: "—",
    crew: 85,
    home: "Earth",
  },
};

export function classById(id: string): ShipClass {
  return CLASSES.find((c) => c.id === id) ?? CLASSES[0];
}
