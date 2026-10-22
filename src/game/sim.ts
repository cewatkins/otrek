import { sfx } from "@/game/audio";
import { classById, type ShipClass } from "@/game/classes";

export const WORLD = 9000;
const WARP_SPEED = 78;
const WARP_ACCEL = 2.5;

export type Quad = "A" | "B";
export type Base = {
  id: string;
  num: number;
  name: string;
  race: string;
  x: number;
  y: number;
  quad: Quad;
};
export type Planet = { name: string; x: number; y: number; quad: Quad; feed: boolean };
export type Bolt = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  dmg: number;
  owner: string;
  traveled: number;
  min: number;
  max: number;
  homing: number;
  lockId: string | null;
  kind: ShipClass["torpKind"];
  life: number;
  drone?: boolean;
  varPlasma?: boolean;
};
export type Beam = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  life: number;
  esi: boolean;
  byPlayer: boolean;
};
export type Pickup = { x: number; y: number; gold: number; life: number };
export type Mine = { x: number; y: number; dmg: number; owner: string; life: number; arm: number };
export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  alert: boolean;
  size: number;
};
export type Line = { text: string; tone: "info" | "alert" | "amber" | "hail"; at?: number };

export type Ship = {
  id: string;
  letter: string;
  name: string;
  cls: ShipClass;
  isPlayer: boolean;
  x: number;
  y: number;
  yaw: number;
  warp: number;
  hull: number;
  shield: number;
  energy: number;
  magazine: number;
  alive: boolean;
  docked: boolean;
  dockName: string;
  dockTimer: number;
  cloaked: boolean;
  repair: boolean;
  raiseLatch: boolean;
  intercept: boolean;
  lockId: string | null;
  courseYaw: number | null;
  phaserCd: number;
  torpCd: number;
  twCd: number;
  twLeft: number;
  shieldDrop: number;
  hitFlash: number;
  holeCd: number;
  dmgGiven: number;
  dmgTaken: number;
  /** Damage dealt since last dock. JavaTrek pays (damage + bonus) / 10 on docking. */
  pendingDmg: number;
  pendingBonus: number;
  /** Gold bars already aboard, not yet saved. */
  cargo: number;
  drones: number;
  droneCd: number;
  mines: number;
  mineCd: number;
  regenAcc: number;
  skill: number;
  banked: number;
  kills: number;
  conflicts: number;
  conflictAt: Map<string, number>;
  respawn: number;
  aiAcc: number;
  aiState: "hunt" | "flee" | "patrol" | "docking";
  patrolX: number;
  patrolY: number;
  orbitSign: number;
  bias: number;
  home: string;
  traveled: number;
  born: number;
  goalYaw: number;
  goalWarp: number;
  missNote: number;
  /** Dilithium still in the hold. Soaks damage that gets through shields. */
  crystals: number;
  /** Another player's ship. Pose comes from them; this client does not fly it. */
  remote: boolean;
  /** Alpha is where every ship starts. The wormhole is the door to Beta. */
  quad: Quad;
};

export type RosterRow = {
  id: string;
  letter: string;
  name: string;
  code: string;
  dist: number | null;
  alive: boolean;
  docked: boolean;
  isPlayer: boolean;
  gold: number;
  seen: boolean;
};

export type TargetInfo = {
  id: string;
  letter: string;
  name: string;
  code: string;
  race: string;
  dist: number;
  warp: number;
  shield: number;
  hull: number;
  hullMax: number;
  cloaked: boolean;
  docked: boolean;
  gold: number;
};

export type Snapshot = {
  phase: "play" | "dead";
  t: number;
  warp: number;
  maxWarp: number;
  heading: number;
  energy: number;
  energyMax: number;
  shield: number;
  hull: number;
  hullMax: number;
  torps: number;
  torpMax: number;
  torpName: string;
  drones: number;
  dronesMax: number;
  mines: number;
  minesMax: number;
  crystals: number;
  crystalsMax: number;
  holeOpen: boolean;
  quad: "ALPHA" | "BETA";
  cloakOn: boolean;
  canCloak: boolean;
  repair: boolean;
  shieldsUp: boolean;
  intercept: boolean;
  autoLock: boolean;
  seekBase: boolean;
  aiPilot: boolean;
  transwarp: boolean;
  twReady: boolean;
  banked: number;
  unbanked: number;
  dmgGiven: number;
  dmgTaken: number;
  kills: number;
  conflicts: number;
  letter: string;
  name: string;
  code: string;
  race: string;
  docked: boolean;
  dockName: string;
  nearBase: string | null;
  nearPlanet: string | null;
  target: TargetInfo | null;
  roster: RosterRow[];
  messages: Line[];
  hint: string;
  killedBy: string;
  survived: number;
  shake: number;
};

export const BASES: Base[] = [];
export const PLANETS: Planet[] = [];
export const HOLES: { quad: Quad; x: number; y: number }[] = [];

function layChart(
  rows: { id: string; num: number; name: string; race: string; x: number; y: number; dock: boolean; feed: boolean }[],
  quad: Quad,
  holeAt: { x: number; y: number } | null,
) {
  const minX = Math.min(...rows.map((r) => r.x));
  const maxX = Math.max(...rows.map((r) => r.x));
  const minY = Math.min(...rows.map((r) => r.y));
  const maxY = Math.max(...rows.map((r) => r.y));
  const span = Math.max(maxX - minX, maxY - minY) || 1;
  const scale = 7600 / span;
  const ox = (WORLD - (maxX - minX) * scale) / 2;
  const oy = (WORLD - (maxY - minY) * scale) / 2;
  const pt = (x: number, y: number) => ({
    x: ox + (x - minX) * scale,
    y: oy + (maxY - y) * scale,
  });
  for (const row of rows) {
    const p = pt(row.x, row.y);
    if (row.dock) BASES.push({ id: row.id, num: row.num, name: row.name, race: row.race, quad, ...p });
    else PLANETS.push({ name: row.name, quad, feed: row.feed, ...p });
  }
  const mouth = holeAt ?? {
    x: rows.reduce((s, r) => s + r.x, 0) / rows.length,
    y: rows.reduce((s, r) => s + r.y, 0) / rows.length,
  };
  HOLES.push({ quad, ...pt(mouth.x, mouth.y) });
}

/** Coordinates from the mtrek.com FAQ chart. Alpha is the quadrant every ship starts in. */
layChart(
  [
    { id: "SB1", num: 1, name: "Starbase 1", race: "Starbase", x: -6150, y: -13432, dock: true, feed: false },
    { id: "SB2", num: 2, name: "Starbase 2", race: "Starbase", x: 7803, y: -10300, dock: true, feed: false },
    { id: "SB3", num: 3, name: "Starbase 3", race: "Starbase", x: -6000, y: 10020, dock: true, feed: false },
    { id: "SB4", num: 4, name: "Starbase 4", race: "Starbase", x: -11400, y: 17000, dock: true, feed: false },
    { id: "SB5", num: 5, name: "Babylon 5", race: "Starbase", x: -18400, y: 20730, dock: true, feed: false },
    { id: "SB6", num: 6, name: "Starbase 6", race: "Starbase", x: -29600, y: 17000, dock: true, feed: false },
    { id: "SB7", num: 7, name: "K-7", race: "Starbase", x: 21800, y: 16000, dock: true, feed: false },
    { id: "SB8", num: 8, name: "Starbase 8", race: "Starbase", x: 28000, y: 5000, dock: true, feed: false },
    { id: "SB9", num: 9, name: "Starbase 9", race: "Starbase", x: 33900, y: -10500, dock: true, feed: false },
    { id: "SB10", num: 10, name: "Starbase 10", race: "Starbase", x: 24000, y: -24000, dock: true, feed: false },
    { id: "EARTH", num: 0, name: "Earth", race: "Federation", x: 2000, y: 2025, dock: true, feed: false },
    { id: "VULCAN", num: 0, name: "Vulcan", race: "Federation", x: 6053, y: 20747, dock: true, feed: false },
    { id: "ROM", num: 0, name: "Romulus", race: "Romulan", x: 20100, y: 29200, dock: true, feed: false },
    { id: "KLIN", num: 0, name: "Klinzhai", race: "Klingon", x: 36030, y: -18080, dock: true, feed: false },
    { id: "GORN", num: 0, name: "Gorn", race: "Gorn", x: -10000, y: -36020, dock: true, feed: false },
    { id: "ORION", num: 0, name: "Orion", race: "Orion", x: -39700, y: 16341, dock: true, feed: false },
    { id: "VEGA", num: 0, name: "Delta Vega", race: "Planet", x: -20320, y: -21344, dock: false, feed: true },
    { id: "DENEVA", num: 0, name: "Deneva", race: "Planet", x: -21200, y: -23040, dock: false, feed: true },
    { id: "WRIGLEY", num: 0, name: "Wrigley", race: "Planet", x: 8100, y: -20341, dock: false, feed: true },
    { id: "RIGEL", num: 0, name: "Rigel XII", race: "Planet", x: -17700, y: -9341, dock: false, feed: true },
    { id: "ORGANIA", num: 0, name: "Organia", race: "Planet", x: -18000, y: 4000, dock: false, feed: false },
    { id: "MUTARA", num: 0, name: "Mutara Nebula", race: "Hazard", x: -6003, y: -10300, dock: false, feed: false },
    { id: "ROCKS", num: 0, name: "Asteroid Field", race: "Hazard", x: -18000, y: -12500, dock: false, feed: false },
    { id: "THOLIAN", num: 0, name: "Tholean Space", race: "Hazard", x: -40003, y: 6032, dock: false, feed: false },
  ],
  "A",
  { x: 3, y: -7 },
);

layChart(
  [
    { id: "SB11", num: 11, name: "Starbase 11", race: "Starbase", x: 4016, y: 13407, dock: true, feed: false },
    { id: "SB12", num: 12, name: "Starbase 12", race: "Starbase", x: 26200, y: 9680, dock: true, feed: false },
    { id: "SB13", num: 13, name: "Starbase 13", race: "Starbase", x: 8150, y: -10940, dock: true, feed: false },
    { id: "SB14", num: 14, name: "Starbase 14", race: "Starbase", x: 1340, y: -24700, dock: true, feed: false },
    { id: "SB15", num: 15, name: "Starbase 15", race: "Starbase", x: -5900, y: -12870, dock: true, feed: false },
    { id: "SB16", num: 16, name: "Starbase 16", race: "Starbase", x: -19792, y: -15170, dock: true, feed: false },
    { id: "SB17", num: 17, name: "Starbase 17", race: "Starbase", x: -25935, y: 2440, dock: true, feed: false },
    { id: "SB18", num: 18, name: "Starbase 18", race: "Starbase", x: -18913, y: 11802, dock: true, feed: false },
    { id: "SB19", num: 19, name: "Starbase 19", race: "Starbase", x: -16402, y: 22795, dock: true, feed: false },
    { id: "SB20", num: 20, name: "Starbase 20", race: "Starbase", x: 207, y: 26501, dock: true, feed: false },
    { id: "DANA", num: 0, name: "Dana", race: "Planet", x: 1280, y: 24120, dock: true, feed: false },
    { id: "MALIBU", num: 0, name: "Malibu Beta 6", race: "Planet", x: -23450, y: 27700, dock: true, feed: false },
    { id: "ARRAKIS", num: 0, name: "Arrakis", race: "Planet", x: -15350, y: 2440, dock: false, feed: true },
    { id: "PLEASURE", num: 0, name: "Pleasure Planet", race: "Planet", x: 28620, y: -15180, dock: false, feed: true },
    { id: "HAWS", num: 0, name: "Hawserion", race: "Planet", x: -19340, y: -18190, dock: false, feed: true },
    { id: "NEWT", num: 0, name: "Newtonium", race: "Planet", x: 2512, y: 5004, dock: false, feed: false },
  ],
  "B",
  null,
);

const BOTS: { name: string; classId: string; bias: number; home: string; skill: number }[] = [
  { name: "IKS Torg", classId: "KEV12", bias: 0.72, home: "KLIN", skill: 5 },
  { name: "IRW Vorel", classId: "RBOP", bias: 0.5, home: "ROM", skill: 4 },
  { name: "OSS Slammer", classId: "BR5", bias: 0.45, home: "ORION", skill: 4 },
  { name: "CDS Galor", classId: "CDA180", bias: 0.62, home: "SB7", skill: 3 },
  { name: "USS Hood", classId: "EXCEL", bias: 0.34, home: "EARTH", skill: 3 },
  { name: "USS Farragut", classId: "LARSON", bias: 0.4, home: "EARTH", skill: 3 },
  { name: "USS Yorktown", classId: "IIA", bias: 0.36, home: "EARTH", skill: 3 },
  { name: "IKS Gr'oth", classId: "KPB13", bias: 0.7, home: "KLIN", skill: 4 },
];

export const QUADRANT_ROBOTS = BOTS.map((bot) => bot.name);

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function angDiff(from: number, to: number) {
  let d = to - from;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

export function yawTo(x: number, y: number, tx: number, ty: number) {
  return Math.atan2(-(tx - x), -(ty - y));
}

export function headingOf(yaw: number) {
  const d = ((-yaw * 180) / Math.PI) % 360;
  return (d + 360) % 360;
}

function nose(yaw: number) {
  return { x: -Math.sin(yaw), y: -Math.cos(yaw) };
}

let seq = 1;

function makeShip(
  partial: {
    name: string;
    classId: string;
    letter: string;
    isPlayer: boolean;
    home: string;
    x: number;
    y: number;
    bias?: number;
    skill?: number;
  },
  t: number,
): Ship {
  const cls = classById(partial.classId);
  const yaw = yawTo(partial.x, partial.y, WORLD / 2, WORLD / 2);
  return {
    id: `s${seq++}`,
    letter: partial.letter,
    name: partial.name,
    cls,
    isPlayer: partial.isPlayer,
    x: partial.x,
    y: partial.y,
    yaw,
    warp: 0,
    hull: cls.hull,
    shield: 100,
    energy: cls.energy,
    magazine: cls.magazine,
    alive: true,
    docked: false,
    dockName: "",
    dockTimer: 0,
    cloaked: false,
    repair: false,
    raiseLatch: false,
    intercept: false,
    lockId: null,
    courseYaw: null,
    phaserCd: 0,
    torpCd: 0.4,
    twCd: 0,
    twLeft: 0,
    shieldDrop: 0,
    hitFlash: 0,
    holeCd: 0,
    dmgGiven: 0,
    dmgTaken: 0,
    pendingDmg: 0,
    pendingBonus: 0,
    cargo: 0,
    drones: cls.drones ?? 0,
    droneCd: 0.6,
    mines: cls.mines ?? 0,
    mineCd: 1.2,
    regenAcc: 0,
    skill: partial.skill ?? 3,
    banked: 0,
    kills: 0,
    conflicts: 0,
    conflictAt: new Map(),
    respawn: 0,
    aiAcc: Math.random() * 1.6,
    aiState: "patrol",
    patrolX: partial.x,
    patrolY: partial.y,
    orbitSign: Math.random() < 0.5 ? -1 : 1,
    bias: partial.bias ?? 0,
    home: partial.home,
    traveled: 0,
    born: t,
    goalYaw: yaw,
    goalWarp: 0,
    missNote: 0,
    crystals: cls.crystals ?? 0,
    remote: false,
    quad: "A",
  };
}

function quietLine(text: string) {
  const t = text.toLowerCase();
  return (
    t.includes("vault updated") ||
    t.includes("undock") ||
    t.includes("docked at") ||
    t.includes("relaunched from")
  );
}

export class TrekSim {
  ships: Ship[] = [];
  player: Ship;
  bolts: Bolt[] = [];
  beams: Beam[] = [];
  picks: Pickup[] = [];
  mines: Mine[] = [];
  particles: Particle[] = [];
  messages: Line[] = [];
  stars: { x: number; y: number; b: number }[] = [];
  t = 0;
  over = false;
  killedBy = "";
  shake = 0;
  keys = new Set<string>();
  inputOverride: Set<string> | null = null;
  touchSteer = 0;
  touchWarp = 0;
  touchPhaser = false;
  touchTorp = false;
  touchDrone = false;
  touchMine = false;
  /** Default on. 5 toggles it. Prefers whoever is shooting you, else the nearest ship. */
  autoLock = true;
  /** 2 steers to the nearest starbase, docks, and the yard repairs the ship. */
  seekBase = false;
  /** 7 flies the human ship with the same brain the robots use. 7 again takes the helm back. */
  aiPilot = false;
  /** Click on the long-range chart. The ship flies to this point. */
  nav: { x: number; y: number } | null = null;
  private threatId: string | null = null;
  private threatUntil = 0;
  /** mtrek.com wormholes sit dark for about a minute, then open again. */
  holeOpen = true;
  private holeLeft = 58;
  onBank: ((ship: Ship) => void) | null = null;
  /** Last player strike on a remote, repeated on the pose so a dropped packet still lands. */
  lastStrike: { to: string; dmg: number; n: number; by: string } | null = null;
  private strikeSeq = 0;
  /** Fired when a local weapon tags a remote ship. Peer id, damage. */
  onStrike: ((peerId: string, raw: number) => void) | null = null;
  private edgeNote = 0;
  private noTgt = 0;
  private warpNote = 0;

  constructor(name: string, classId: string, opts?: { bots?: boolean }) {
    const cls = classById(classId);
    const home = BASES.find((b) => b.id === cls.home) ?? BASES[0];
    this.player = makeShip(
      {
        name: name.slice(0, 18) || "USS Intrepid",
        classId: cls.id,
        letter: "a",
        isPlayer: true,
        home: home.id,
        x: home.x + 460,
        y: home.y + 280,
      },
      0,
    );
    this.ships = [this.player];
    if (opts?.bots !== false) {
    const letters = ["b", "c", "d", "e", "f", "g", "h", "i"];
    BOTS.forEach((bot, i) => {
      const b = BASES.find((x) => x.id === bot.home) ?? BASES[0];
      const ang = (i / BOTS.length) * Math.PI * 2;
      this.ships.push(
        makeShip(
          {
            name: bot.name,
            classId: bot.classId,
            letter: letters[i] ?? "z",
            isPlayer: false,
            home: bot.home,
            x: clamp(b.x + Math.cos(ang) * 520, 200, WORLD - 200),
            y: clamp(b.y + Math.sin(ang) * 520, 200, WORLD - 200),
            bias: bot.bias,
            skill: bot.skill,
          },
          0,
        ),
      );
    });
    for (const ship of this.ships) {
      if (ship.isPlayer) continue;
      const dx = ship.x - this.player.x;
      const dy = ship.y - this.player.y;
      const d = Math.hypot(dx, dy) || 1;
      if (d < 750) {
        ship.x = clamp(this.player.x + (dx / d) * 750, 280, WORLD - 280);
        ship.y = clamp(this.player.y + (dy / d) * 750, 280, WORLD - 280);
        ship.yaw = yawTo(ship.x, ship.y, WORLD / 2, WORLD / 2);
      }
    }
    }
    let s = 77;
    const rnd = () => {
      s = (s * 16807) % 2147483647;
      return (s & 2147483647) / 2147483647;
    };
    for (let i = 0; i < 140; i++) {
      this.stars.push({ x: rnd() * WORLD, y: rnd() * WORLD, b: 0.25 + rnd() * 0.75 });
    }
    this.say("You have the conn. Raise shields, lock a target, bank gold before you die.", "amber");
    if (cls.agonizer) this.say("Agonizers ignore range. Each shot spends one torpedo.", "info");
    else if (cls.regenTorp) this.say("Obliterators regenerate. One returns every two seconds.", "info");
    else if (cls.teleport) this.say("Teleporter phasers shove you clear. Transwarp will not track.", "info");
    else if (cls.esi) this.say("Expanding-sphere phasers hit every ship in range. A crowd weakens the shot.", "info");
    else if ((cls.crystals ?? 0) >= 60)
      this.say("Dilithium soaks hits that punch the shields. Dock to refill the crystals.", "info");
    else this.say("W/S warp · A/D turn · click a ship to lock · Space phasers · T torpedoes · . dock", "info");
  }

  held() {
    return this.inputOverride ?? this.keys;
  }

  /** One keypress. W raises warp. S lowers it, then backs up. */
  nudgeWarp(dir: 1 | -1) {
    const p = this.player;
    if (this.aiPilot || !p.alive || p.docked || this.over || p.twLeft > 0) return;
    p.intercept = false;
    if (dir > 0 && p.energy < 8) {
      if (this.t > this.warpNote) {
        this.warpNote = this.t + 2;
        this.say("Not enough energy to raise warp.", "alert");
      }
      return;
    }
    const next = dir > 0 ? Math.min(p.cls.maxWarp, p.warp + 0.4) : Math.max(-2, p.warp - 0.4);
    p.warp = Math.round(next * 10) / 10;
  }

  verbose = false;

  say(text: string, tone: Line["tone"] = "info") {
    if (!this.verbose && quietLine(text)) return;
    if (tone === "hail") sfx.hail();
    this.messages = [{ text, tone, at: this.t }, ...this.messages].slice(0, 8);
  }

  toggleVerbose() {
    this.verbose = !this.verbose;
    this.messages = [
      { text: this.verbose ? "Full log on." : "Dock and vault lines hidden.", tone: "info" as const },
      ...this.messages,
    ].slice(0, 8);
  }

  baseById(id: string) {
    return BASES.find((b) => b.id === id) ?? BASES[0];
  }

  dist(ax: number, ay: number, bx: number, by: number) {
    return Math.hypot(ax - bx, ay - by);
  }

  shipById(id: string | null) {
    if (!id) return null;
    return this.ships.find((s) => s.id === id) ?? null;
  }

  upsertRemote(
    peerId: string,
    pose: {
      name?: string;
      classId?: string;
      x?: number;
      y?: number;
      yaw?: number;
      warp?: number;
      shield?: number;
      hull?: number;
      cloaked?: boolean;
      docked?: boolean;
      quad?: "A" | "B";
      alive?: boolean;
    },
  ) {
    const id = `net:${peerId}`;
    const alive = pose.alive !== false;
    let ship = this.ships.find((s) => s.id === id);
    if (!alive) {
      if (ship?.alive) {
        ship.alive = false;
        ship.hull = 0;
        this.burst(ship.x, ship.y, 16, true);
        this.say(`${ship.name} destroyed.`, "alert");
      }
      return;
    }
    const x = clamp(Number(pose.x) || 0, 80, WORLD - 80);
    const y = clamp(Number(pose.y) || 0, 80, WORLD - 80);
    if (!ship) {
      const letters = "bcdefghij";
      const used = new Set(this.ships.map((s) => s.letter));
      const letter = letters.split("").find((ch) => !used.has(ch)) ?? "z";
      ship = makeShip(
        {
          name: String(pose.name ?? "Unknown").slice(0, 18),
          classId: String(pose.classId ?? "EXCEL"),
          letter,
          isPlayer: false,
          home: "SB1",
          x,
          y,
        },
        this.t,
      );
      ship.id = id;
      ship.remote = true;
      ship.quad = pose.quad === "B" ? "B" : "A";
      this.ships.push(ship);
      this.say(`${ship.name} entered the quadrant.`, "amber");
    }
    ship.remote = true;
    ship.quad = pose.quad === "B" ? "B" : "A";
    ship.alive = true;
    ship.name = String(pose.name ?? ship.name).slice(0, 18);
    if (pose.classId && pose.classId !== ship.cls.id) ship.cls = classById(String(pose.classId));
    ship.x = x;
    ship.y = y;
    ship.yaw = Number(pose.yaw) || 0;
    ship.warp = clamp(Number(pose.warp) || 0, 0, 18);
    ship.shield = clamp(Number(pose.shield) || 0, 0, 100);
    ship.hull = clamp(Number(pose.hull) || 0, 0, ship.cls.hull);
    ship.cloaked = Boolean(pose.cloaked);
    ship.docked = Boolean(pose.docked);
  }

  /** Humans take a, b, c in the same order on every screen. Robots follow. */
  setRoster(selfNetId: string, otherNetIds: string[]) {
    const alpha = "abcdefghijklmnopqrstuvwxyz";
    const ids = [...new Set([selfNetId, ...otherNetIds].filter(Boolean))].sort();
    const letterOf = (id: string) => alpha[ids.indexOf(id)] ?? "z";
    this.player.letter = letterOf(selfNetId);
    const used = new Set<string>([this.player.letter]);
    for (const ship of this.ships) {
      if (!ship.remote) continue;
      ship.letter = letterOf(ship.id.slice(4));
      used.add(ship.letter);
    }
    let n = ids.length;
    for (const ship of this.ships) {
      if (ship.isPlayer || ship.remote) continue;
      while (n < alpha.length && used.has(alpha[n])) n += 1;
      const letter = alpha[n] ?? "z";
      ship.letter = letter;
      used.add(letter);
      n += 1;
    }
  }

  dropRemotes(peerIds: string[]) {
    const keep = new Set(peerIds.map((id) => `net:${id}`));
    this.ships = this.ships.filter((s) => !s.remote || keep.has(s.id));
    if (this.player.lockId?.startsWith("net:") && !keep.has(this.player.lockId)) {
      this.player.lockId = null;
    }
  }

  applyIncoming(raw: number, byName: string) {
    if (!this.player.alive || this.over) return;
    const dmg = Math.max(0, Math.min(500, raw));
    const ghost = this.ships.find((s) => s.remote && s.name === byName) ?? null;
    this.applyDamage(this.player, dmg, ghost);
    this.say(`${byName} hits for ${Math.round(dmg)}.`, "alert");
  }

  visible(observer: Ship, target: Ship) {
    if (!target.alive) return false;
    if (observer.quad === target.quad && target.remote) return true;
    if (observer.quad !== target.quad) return false;
    const d = this.dist(observer.x, observer.y, target.x, target.y);
    if (d > observer.cls.scan) return false;
    if (target.cloaked && !target.docked && d > 320 && target !== observer) return false;
    return true;
  }

  lockShip(id: string) {
    const t = this.shipById(id);
    if (!t || t === this.player || !t.alive) return;
    if (!this.visible(this.player, t)) {
      this.say("No scan on that contact.", "info");
      return;
    }
    this.player.lockId = id;
    this.say(`Locked ${t.letter}:${t.name} (${t.cls.code}).`, "amber");
  }

  breakLock() {
    this.player.lockId = null;
    this.player.intercept = false;
  }

  toggleAutoLock() {
    this.autoLock = !this.autoLock;
    this.say(this.autoLock ? "Autolock on." : "Autolock off.", "info");
  }

  /** Nearest starbase in this quadrant. Dock, and the yard puts the ship back together. */
  goToBase() {
    const p = this.player;
    if (this.over || !p.alive) return;
    if (p.docked) {
      this.say(`Already at ${p.dockName}. The yard has you repaired.`, "info");
      return;
    }
    if (this.seekBase) {
      this.seekBase = false;
      this.say("Base run cancelled.", "info");
      return;
    }
    if (this.aiPilot) {
      this.say("AI has the helm. Press 7 to take it back.", "info");
      return;
    }
    const base = this.nearestBase(p);
    this.seekBase = true;
    p.intercept = false;
    p.courseYaw = null;
    this.say(`Making for ${base.name}. Will dock and repair.`, "amber");
  }

  toggleAiPilot() {
    this.aiPilot = !this.aiPilot;
    if (this.aiPilot) {
      this.seekBase = false;
      this.player.intercept = false;
      this.player.courseYaw = null;
      if (this.player.docked) this.player.dockTimer = 3.2;
      this.say("AI helm on. The ship fights like the other captains. Press 7 to take it back.", "amber");
    } else {
      this.say("AI helm off. You have the ship.", "info");
    }
  }

  private noteThreat(id: string | null) {
    if (!id || id === this.player.id) return;
    this.threatId = id;
    this.threatUntil = this.t + 5;
  }

  private autoLockStep() {
    const p = this.player;
    if (!this.autoLock || this.over || !p.alive || p.docked) return;
    let pick: Ship | null = null;
    if (this.threatId && this.t < this.threatUntil) {
      const t = this.shipById(this.threatId);
      if (t && t.alive && !t.docked && t !== p && this.visible(p, t)) pick = t;
    }
    if (!pick) {
      for (const bolt of this.bolts) {
        if (bolt.owner === p.id || bolt.lockId !== p.id) continue;
        const s = this.shipById(bolt.owner);
        if (s && s.alive && !s.docked && this.visible(p, s)) {
          pick = s;
          break;
        }
      }
    }
    if (!pick) {
      let best = Infinity;
      for (const s of this.ships) {
        if (s === p || !s.alive || s.docked || !this.visible(p, s)) continue;
        const d = this.dist(p.x, p.y, s.x, s.y);
        if (d < best) {
          best = d;
          pick = s;
        }
      }
    }
    if (!pick) {
      if (p.lockId) p.lockId = null;
      return;
    }
    if (p.lockId === pick.id) return;
    const cur = this.shipById(p.lockId);
    const threat = pick.id === this.threatId && this.t < this.threatUntil;
    const aimed = this.bolts.some((b) => b.owner === pick.id && b.lockId === p.id);
    if (cur && cur.alive && !cur.docked && this.visible(p, cur) && !threat && !aimed) {
      const cd = this.dist(p.x, p.y, cur.x, cur.y);
      const pd = this.dist(p.x, p.y, pick.x, pick.y);
      if (pd > cd * 0.85) return;
    }
    p.lockId = pick.id;
    this.say(`Autolock ${pick.letter}:${pick.name}.`, "info");
  }

  setCourse(x: number, y: number) {
    if (this.over || this.player.docked) return;
    this.nav = null;
    this.player.courseYaw = yawTo(this.player.x, this.player.y, x, y);
    this.player.intercept = false;
    this.seekBase = false;
  }

  /** Fly to a point chosen on the long-range chart. */
  setWaypoint(x: number, y: number) {
    if (this.over || this.player.docked || !this.player.alive) return;
    this.nav = { x: clamp(x, 80, WORLD - 80), y: clamp(y, 80, WORLD - 80) };
    this.player.courseYaw = null;
    this.player.intercept = false;
    this.seekBase = false;
    if (this.aiPilot) this.aiPilot = false;
    const bearing = String(headingOf(yawTo(this.player.x, this.player.y, this.nav.x, this.nav.y))).padStart(3, "0");
    this.say(`Long-range course ${bearing}.`, "amber");
  }

  toggleRepair() {
    this.player.repair = !this.player.repair;
    this.say(this.player.repair ? "Damage control engaged." : "Damage control off.", "info");
  }

  toggleCloak() {
    const p = this.player;
    if (!p.cls.cloak) {
      this.say("This class has no cloaking device.", "info");
      return;
    }
    if (p.docked) return;
    p.cloaked = !p.cloaked;
    this.say(p.cloaked ? "Cloaking device on." : "Decloaked.", "amber");
  }

  toggleIntercept() {
    const p = this.player;
    if (!p.lockId) {
      this.say("Lock a target before intercept.", "info");
      return;
    }
    p.intercept = !p.intercept;
    if (p.intercept) p.courseYaw = null;
    this.say(p.intercept ? "Intercept course set." : "Intercept cancelled.", "info");
  }

  toggleRaise() {
    this.player.raiseLatch = !this.player.raiseLatch;
    this.say(this.player.raiseLatch ? "Raising shields." : "Shields holding.", "info");
  }

  dropShields() {
    this.player.shieldDrop = 0.7;
    this.player.raiseLatch = false;
    this.say("Dropping shields.", "alert");
  }

  transwarp() {
    const p = this.player;
    if (!p.cls.transwarp) {
      this.say("No transwarp drive on this class.", "info");
      return;
    }
    if (p.twCd > 0 || p.docked || this.over) return;
    if (p.energy < 40) {
      this.say("Not enough energy for transwarp.", "alert");
      return;
    }
    p.energy -= 36;
    p.twLeft = 2.7;
    p.twCd = 16;
    p.warp = Math.min(p.cls.maxWarp + 4, 16);
    this.say(p.cls.teleport ? "Non-tracking transwarp. You will overshoot." : "Transwarp engaged.", "amber");
    sfx.torp();
  }

  requestDock() {
    const p = this.player;
    if (p.docked || this.over) return;
    const base = this.nearestBase(p);
    const d = this.dist(p.x, p.y, base.x, base.y);
    if (d > 110) {
      this.say(`${base.name} is ${Math.round(d)} out. Close to 100 and kill warp.`, "info");
      return;
    }
    if (p.warp > 1.4) {
      this.say("Too fast to dock. Drop below warp 1.4.", "alert");
      return;
    }
    this.doDock(p, base);
  }

  requestUndock() {
    if (!this.player.docked) return;
    this.player.docked = false;
    this.player.warp = 0;
  }

  hail(text: string) {
    const msg = text.trim().slice(0, 80);
    if (!msg) return;
    this.say(`${this.player.name}: ${msg}`, "hail");
    const foe = this.ships.find((s) => s.alive && !s.isPlayer && !s.docked);
    if (!foe) return;
    const lines = [
      `${foe.name}: Save it for the debris field.`,
      `${foe.name}: Noted. I still intend to shoot you.`,
      `${foe.name}: Gold first. Speeches later.`,
      `${foe.name}: Your shields are a suggestion.`,
    ];
    this.say(lines[Math.floor(Math.random() * lines.length)] ?? lines[0], "info");
  }

  private goldAboard(ship: Ship) {
    return Math.floor((ship.pendingDmg + ship.pendingBonus) / 10) + Math.floor(ship.cargo);
  }

  private clearAboard(ship: Ship) {
    ship.pendingDmg = 0;
    ship.pendingBonus = 0;
    ship.cargo = 0;
  }

  private doDock(ship: Ship, base: Base) {
    const was = ship.docked;
    ship.docked = true;
    ship.dockName = base.name;
    ship.warp = 0;
    ship.cloaked = false;
    ship.intercept = false;
    ship.courseYaw = null;
    if (ship.isPlayer) this.seekBase = false;
    if (ship.isPlayer && this.aiPilot) ship.dockTimer = 3.2;
    if (ship.isPlayer) {
      const gained = this.goldAboard(ship);
      const bonus = Math.floor(ship.pendingBonus / 10);
      this.clearAboard(ship);
      ship.banked += gained;
      ship.hull = ship.cls.hull;
      ship.shield = 100;
      ship.energy = ship.cls.energy;
      ship.magazine = ship.cls.magazine;
      ship.drones = ship.cls.drones ?? 0;
      ship.mines = ship.cls.mines ?? 0;
      ship.crystals = ship.cls.crystals ?? 0;
      ship.raiseLatch = false;
      this.say(
        gained > 0
          ? `Docked at ${base.name}. Banked ${gained} gold${bonus > 0 ? ` (${bonus} veteran bonus)` : ""}.`
          : `Docked at ${base.name}. Magazines full. Nothing new to bank.`,
        "amber",
      );
      sfx.dock();
      if (!was) this.onBank?.(ship);
    } else {
      ship.dockTimer = 3.2;
    }
  }

  private nearestBase(ship: Ship) {
    const bases = BASES.filter((b) => b.quad === ship.quad);
    let best = bases[0] ?? BASES[0];
    let bestD = Infinity;
    for (const b of bases) {
      const d = this.dist(ship.x, ship.y, b.x, b.y);
      if (d < bestD) {
        bestD = d;
        best = b;
      }
    }
    return best;
  }

  private nearestShip(ship: Ship, list: Ship[]) {
    let best: Ship | null = null;
    let bestD = Infinity;
    for (const o of list) {
      const d = this.dist(ship.x, ship.y, o.x, o.y);
      if (d < bestD) {
        bestD = d;
        best = o;
      }
    }
    return best;
  }

  private flyComputer(ship: Ship, dt: number) {
    if (!ship.alive || ship.remote || ship.docked) return;
    ship.aiAcc -= dt;
    if (ship.aiAcc <= 0) {
      ship.aiAcc = 1.28;
      this.think(ship);
    }
    this.steerToward(ship, ship.goalYaw, dt * 0.25);
    this.easeWarp(ship, ship.goalWarp, dt * 0.25);
    if (ship.aiState === "hunt") {
      const tgt = this.shipById(ship.lockId);
      if (tgt && tgt.alive && tgt !== ship && !tgt.docked) {
        const d = this.dist(ship.x, ship.y, tgt.x, tgt.y);
        const noseOn = Math.abs(angDiff(ship.yaw, yawTo(ship.x, ship.y, tgt.x, tgt.y))) < 0.55;
        if (noseOn && d < ship.cls.phaserRange * 0.96) this.firePhaser(ship);
        if (noseOn && d > ship.cls.torpMin * 0.85 && d < ship.cls.torpMax * 0.95) this.fireTorp(ship);
        if (d > 200 && d < 1500 && ship.drones > 0) this.fireDrone(ship);
        if (d > 160 && d < 420 && ship.mines > 0) this.dropMine(ship);
      }
    }
    if (ship.aiState === "docking") {
      const base = this.nearestBase(ship);
      if (this.dist(ship.x, ship.y, base.x, base.y) < 96 && ship.warp < 1.6) this.doDock(ship, base);
    }
  }

  private think(ship: Ship) {
    if (this.t < 8) {
      ship.aiState = "patrol";
      ship.lockId = null;
      ship.cloaked = false;
      if (this.dist(ship.x, ship.y, ship.patrolX, ship.patrolY) < 220) {
        ship.patrolX = 700 + Math.random() * (WORLD - 1400);
        ship.patrolY = 700 + Math.random() * (WORLD - 1400);
      }
      ship.goalYaw = yawTo(ship.x, ship.y, ship.patrolX, ship.patrolY);
      ship.goalWarp = ship.cls.cruise * 0.4;
      return;
    }
    const foes = this.ships.filter(
      (o) => o !== ship && o.alive && !o.docked && this.visible(ship, o),
    );
    const hurt =
      ship.hull / ship.cls.hull < 0.26 || ship.energy < 24 || (ship.magazine === 0 && ship.energy < 50);
    if (hurt) {
      const base = this.nearestBase(ship);
      const d = this.dist(ship.x, ship.y, base.x, base.y);
      ship.goalYaw = yawTo(ship.x, ship.y, base.x, base.y);
      ship.goalWarp = d > 180 ? Math.min(ship.cls.cruise, ship.cls.maxWarp) : 1;
      ship.aiState = d < 100 ? "docking" : "flee";
      ship.lockId = null;
      if (ship.cls.cloak && ship.hull / ship.cls.hull < 0.4) ship.cloaked = true;
      return;
    }
    let target = this.nearestShip(ship, foes);
    let shooter: Ship | null = null;
    let shooterD = Infinity;
    for (const o of foes) {
      const shooting =
        o.lockId === ship.id || this.bolts.some((b) => b.owner === o.id && b.lockId === ship.id);
      if (!shooting) continue;
      const d = this.dist(ship.x, ship.y, o.x, o.y);
      if (d < shooterD) {
        shooter = o;
        shooterD = d;
      }
    }
    if (shooter) target = shooter;
    else if (
      ship !== this.player &&
      this.player.alive &&
      !this.player.docked &&
      this.visible(ship, this.player) &&
      Math.random() < ship.bias * 0.35
    ) {
      const playerDist = this.dist(ship.x, ship.y, this.player.x, this.player.y);
      const nearDist = target ? this.dist(ship.x, ship.y, target.x, target.y) : Infinity;
      if (playerDist < nearDist * 1.35) target = this.player;
    }
    const heldLock = this.shipById(ship.lockId);
    if (
      !shooter &&
      heldLock &&
      heldLock !== ship &&
      heldLock.alive &&
      !heldLock.docked &&
      this.visible(ship, heldLock)
    ) {
      const heldDist = this.dist(ship.x, ship.y, heldLock.x, heldLock.y);
      const nextDist = target ? this.dist(ship.x, ship.y, target.x, target.y) : Infinity;
      if (heldDist < nextDist * 1.4) target = heldLock;
    }
    if (!target) {
      ship.aiState = "patrol";
      ship.lockId = null;
      ship.cloaked = false;
      if (this.dist(ship.x, ship.y, ship.patrolX, ship.patrolY) < 220) {
        ship.patrolX = 700 + Math.random() * (WORLD - 1400);
        ship.patrolY = 700 + Math.random() * (WORLD - 1400);
      }
      ship.goalYaw = yawTo(ship.x, ship.y, ship.patrolX, ship.patrolY);
      ship.goalWarp = ship.cls.cruise * 0.55;
      return;
    }
    ship.aiState = "hunt";
    ship.lockId = target.id;
    const d = this.dist(ship.x, ship.y, target.x, target.y);
    const bearing = yawTo(ship.x, ship.y, target.x, target.y);
    const optimal = ship.cls.phaserRange * 0.72;
    let offset = 0;
    if (d < optimal) offset = ship.orbitSign * 0.28;
    if (d < optimal * 0.45) offset = ship.orbitSign * 0.45;
    ship.goalYaw = bearing + offset;
    ship.goalYaw += (Math.random() - 0.5) * (5 - ship.skill) * 0.05;
    if (d > ship.cls.torpMax) ship.goalWarp = ship.cls.cruise;
    else if (d > optimal) ship.goalWarp = 4.5;
    else ship.goalWarp = 2.4;
    if (ship.cls.cloak && d < 700 && d > 360 && ship.hull / ship.cls.hull < 0.7 && Math.random() < 0.35) {
      ship.cloaked = true;
    }
    if (ship.cloaked && d < 420) ship.cloaked = false;
  }

  private steerToward(ship: Ship, desired: number, dt: number) {
    const diff = angDiff(ship.yaw, desired);
    const rate = this.turnRate(ship);
    const step = rate * dt;
    if (Math.abs(diff) <= step) ship.yaw = desired;
    else ship.yaw += Math.sign(diff) * step;
  }

  private turnRate(ship: Ship) {
    const k = clamp(ship.warp / ship.cls.maxWarp, 0, 1.3);
    return ship.cls.turn * (1 - 0.7 * Math.min(1, k)) + 0.18;
  }

  private moveShip(ship: Ship, dt: number) {
    if (ship.remote) return;
    if (!ship.alive || ship.docked) {
      ship.warp = 0;
      return;
    }
    const dir = nose(ship.yaw);
    const spd = ship.warp * WARP_SPEED;
    ship.x += dir.x * spd * dt;
    ship.y += dir.y * spd * dt;
    ship.traveled += spd * dt;
    if (ship.x < 70 || ship.x > WORLD - 70 || ship.y < 70 || ship.y > WORLD - 70) {
      ship.x = clamp(ship.x, 70, WORLD - 70);
      ship.y = clamp(ship.y, 70, WORLD - 70);
      ship.yaw = yawTo(ship.x, ship.y, WORLD / 2, WORLD / 2);
      ship.courseYaw = null;
      ship.warp = Math.min(ship.warp, 2);
      if (ship.isPlayer && this.t > this.edgeNote) {
        this.edgeNote = this.t + 4;
        this.say("Nav hazard — quadrant edge. Coming about.", "alert");
      }
    }
  }

  private easeWarp(ship: Ship, target: number, dt: number) {
    const max = ship.twLeft > 0 ? ship.cls.maxWarp + 4 : ship.cls.maxWarp;
    const goal = clamp(target, 0, max);
    if (ship.energy < 8) {
      ship.warp = Math.max(0, ship.warp - WARP_ACCEL * dt);
      return;
    }
    const diff = goal - ship.warp;
    const step = WARP_ACCEL * dt;
    if (Math.abs(diff) <= step) ship.warp = goal;
    else ship.warp += Math.sign(diff) * step;
  }

  firePhaser(ship: Ship) {
    if (!ship.alive || ship.docked || ship.cloaked) return false;
    if (ship.phaserCd > 0 || ship.energy < 14) return false;
    const range = ship.cls.phaserRange;
    const foes = this.ships.filter((o) => o !== ship && o.alive && !o.docked);
    if (ship.cls.esi) {
      const hits = foes.filter((o) => this.dist(ship.x, ship.y, o.x, o.y) <= range && (!o.cloaked || this.dist(ship.x, ship.y, o.x, o.y) < 300));
      if (hits.length === 0) return false;
      ship.energy -= 16;
      ship.phaserCd = 1.7;
      for (const o of hits) {
        const d = this.dist(ship.x, ship.y, o.x, o.y);
        const fall = clamp(1 - d / range, 0, 1);
        const dmg = (ship.cls.phaser / hits.length) * (0.4 + 0.6 * fall);
        this.applyDamage(o, dmg, ship);
        this.beams.push({ x1: ship.x, y1: ship.y, x2: o.x, y2: o.y, life: 0.16, esi: true, byPlayer: ship.isPlayer });
      }
      if (ship.isPlayer || this.visible(this.player, ship)) sfx.phaser();
      return true;
    }
    const lock = this.shipById(ship.lockId);
    let victim: Ship | null = null;
    let wide = false;
    if (
      lock &&
      lock.alive &&
      !lock.docked &&
      lock !== ship &&
      this.dist(ship.x, ship.y, lock.x, lock.y) <= range &&
      (!lock.cloaked || this.dist(ship.x, ship.y, lock.x, lock.y) < 300)
    ) {
      victim = lock;
    } else {
      let best = Infinity;
      for (const o of foes) {
        const d = this.dist(ship.x, ship.y, o.x, o.y);
        if (d > range) continue;
        if (o.cloaked && d > 300) continue;
        const bearing = yawTo(ship.x, ship.y, o.x, o.y);
        if (Math.abs(angDiff(ship.yaw, bearing)) > 0.55) continue;
        if (d < best) {
          best = d;
          victim = o;
          wide = true;
        }
      }
    }
    if (!victim) return false;
    const d = this.dist(ship.x, ship.y, victim.x, victim.y);
    const fall = clamp(1 - d / range, 0, 1);
    let dmg = ship.cls.phaser * (0.22 + 0.78 * fall);
    if (wide) dmg *= 0.55;
    if (ship.cls.agonizer) {
      if (ship.magazine <= 0) return false;
      dmg = ship.cls.phaser * (wide ? 0.7 : 1);
      ship.magazine -= 1;
    }
    ship.energy -= 15;
    ship.phaserCd = ship.cls.esi ? 1.7 : 1.12;
    this.applyDamage(victim, dmg, ship);
    if (ship.cls.teleport) {
      const dx = ship.x - victim.x;
      const dy = ship.y - victim.y;
      const len = Math.hypot(dx, dy) || 1;
      ship.x += (dx / len) * 240;
      ship.y += (dy / len) * 240;
      if (ship.isPlayer) this.say("Teleporter phaser. You are clear of the target.", "amber");
    }
    this.beams.push({
      x1: ship.x,
      y1: ship.y,
      x2: victim.x,
      y2: victim.y,
      life: 0.14,
      esi: false,
      byPlayer: ship.isPlayer,
    });
    if (ship.isPlayer || victim.isPlayer) sfx.phaser();
    return true;
  }

  fireTorp(ship: Ship) {
    if (!ship.alive || ship.docked || ship.cloaked) return false;
    if (ship.torpCd > 0 || ship.magazine <= 0 || ship.energy < 6) return false;
    const lock = this.shipById(ship.lockId);
    let dirx: number;
    let diry: number;
    let lockId: string | null = null;
    if (lock && lock.alive && !lock.docked && (!lock.cloaked || this.dist(ship.x, ship.y, lock.x, lock.y) < 340)) {
      const dx = lock.x - ship.x;
      const dy = lock.y - ship.y;
      const len = Math.hypot(dx, dy) || 1;
      dirx = dx / len;
      diry = dy / len;
      lockId = lock.id;
    } else {
      const n = nose(ship.yaw);
      dirx = n.x;
      diry = n.y;
    }
    ship.magazine -= 1;
    ship.torpCd = ship.cls.torpCd;
    ship.energy -= 4;
    const spd = ship.cls.torpSpeed;
    this.bolts.push({
      x: ship.x + dirx * 46,
      y: ship.y + diry * 46,
      vx: dirx * spd,
      vy: diry * spd,
      dmg: ship.cls.torpDmg,
      owner: ship.id,
      traveled: 0,
      min: ship.cls.torpMin,
      max: ship.cls.torpMax,
      homing: ship.cls.torpHoming,
      lockId,
      kind: ship.cls.torpKind,
      life: ship.cls.torpMax / spd + 0.4,
      varPlasma: ship.cls.id === "WARBIRD",
    });
    if (ship.isPlayer) sfx.torp();
    return true;
  }

  dropMine(ship: Ship) {
    if (!ship.alive || ship.docked || ship.cloaked) return false;
    if ((ship.cls.mines ?? 0) <= 0 || ship.mines <= 0 || ship.mineCd > 0) return false;
    ship.mines -= 1;
    ship.mineCd = ship.isPlayer ? 1.4 : 9;
    this.mines.push({
      x: ship.x,
      y: ship.y,
      dmg: ship.cls.mineDmg ?? 170,
      owner: ship.id,
      life: 48,
      arm: 0.85,
    });
    if (ship.isPlayer) this.say("Mine away. It arms in a second.", "amber");
    return true;
  }

  fireDrone(ship: Ship) {
    if (!ship.alive || ship.docked || ship.cloaked) return false;
    if ((ship.cls.drones ?? 0) <= 0 || ship.drones <= 0 || ship.droneCd > 0 || ship.energy < 8) return false;
    const lock = this.shipById(ship.lockId);
    let dirx: number;
    let diry: number;
    let lockId: string | null = null;
    if (lock && lock.alive && !lock.docked) {
      const dx = lock.x - ship.x;
      const dy = lock.y - ship.y;
      const len = Math.hypot(dx, dy) || 1;
      dirx = dx / len;
      diry = dy / len;
      lockId = lock.id;
    } else {
      const n = nose(ship.yaw);
      dirx = n.x;
      diry = n.y;
    }
    ship.drones -= 1;
    ship.droneCd = 1.7;
    ship.energy -= 6;
    const spd = ship.cls.droneVar ? 420 + Math.random() * 520 : 640;
    this.bolts.push({
      x: ship.x + dirx * 40,
      y: ship.y + diry * 40,
      vx: dirx * spd,
      vy: diry * spd,
      dmg: ship.cls.droneDmg ?? 90,
      owner: ship.id,
      traveled: 0,
      min: 80,
      max: 1600,
      homing: 2.8,
      lockId,
      kind: "photon",
      life: 4,
      drone: true,
    });
    if (ship.isPlayer) sfx.torp();
    return true;
  }

  private applyDamage(target: Ship, raw: number, attacker: Ship | null) {
    if (!target.alive || target.docked || raw <= 0) return;
    if (target.remote) {
      if (attacker && attacker.isPlayer) {
        attacker.dmgGiven += raw;
        attacker.pendingDmg += raw;
        if (target.banked > 400 || target.dmgGiven > 1200) attacker.pendingBonus += raw * 0.5;
      }
      target.hitFlash = 0.18;
      const peer = target.id.startsWith("net:") ? target.id.slice(4) : "";
      if (peer && attacker?.isPlayer) {
        this.strikeSeq += 1;
        this.lastStrike = { to: peer, dmg: raw, n: this.strikeSeq, by: attacker.name };
        this.onStrike?.(peer, raw);
      }
      return;
    }
    let left = raw;
    if (target.shield > 0) {
      const pct = Math.min(target.shield, left / target.cls.shieldStr);
      target.shield -= pct;
      left -= pct * target.cls.shieldStr;
    }
    if (left > 0 && target.crystals > 0) {
      const soak = Math.min(target.crystals, left);
      target.crystals -= soak;
      left -= soak;
    }
    if (left > 0) target.hull -= left;
    target.dmgTaken += raw;
    target.hitFlash = 0.18;
    if (attacker && attacker !== target) {
      if (target.isPlayer) this.noteThreat(attacker.id);
      attacker.dmgGiven += raw;
      attacker.pendingDmg += raw;
      if (target.banked > 400 || target.dmgGiven > 1200) attacker.pendingBonus += raw * 0.5;
      const prev = attacker.conflictAt.get(target.id) ?? 0;
      if (this.t - prev > 12) {
        attacker.conflicts += 1;
        target.conflicts += 1;
        attacker.conflictAt.set(target.id, this.t);
      }
    }
    if (target.isPlayer) {
      this.shake = Math.min(10, this.shake + 3 + raw / 40);
      sfx.hit();
    }
    this.burst(target.x, target.y, 4, true);
    if (target.hull <= 0) this.destroy(target, attacker);
  }

  private destroy(ship: Ship, killer: Ship | null) {
    if (!ship.alive) return;
    ship.alive = false;
    ship.warp = 0;
    ship.cloaked = false;
    ship.docked = false;
    ship.hull = 0;
    this.burst(ship.x, ship.y, 22, true);
    const aboard = this.goldAboard(ship);
    const dropped =
      aboard <= 0
        ? ship.dmgTaken > 100
          ? 40
          : 0
        : Math.min(1000, aboard) + Math.floor(Math.max(0, aboard - 1000) * 0.1);
    if (dropped > 0) this.picks.push({ x: ship.x, y: ship.y, gold: dropped, life: 90 });
    this.clearAboard(ship);
    const by = killer && killer !== ship ? killer.name : "a hazard";
    this.say(`${ship.name} destroyed by ${by}.`, "alert");
    if (killer && killer !== ship && killer.alive) killer.kills += 1;
    sfx.explode();
    if (ship.isPlayer) {
      this.over = true;
      this.killedBy = by;
      this.say(
        dropped > 0
          ? `${dropped} gold left on the field. Vault still holds ${Math.floor(ship.banked)}.`
          : `Vault still holds ${Math.floor(ship.banked)}.`,
        "alert",
      );
    } else {
      ship.respawn = this.t + 18;
    }
  }

  private burst(x: number, y: number, n: number, alert: boolean) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 20 + Math.random() * 140;
      this.particles.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: 0.35 + Math.random() * 0.45,
        max: 0.8,
        alert,
        size: 1.2 + Math.random() * 1.8,
      });
    }
  }

  step(dt: number) {
    this.t += dt;
    this.shake = Math.max(0, this.shake - dt * 18);
    const held = this.held();
    const shift = held.has("ShiftLeft") || held.has("ShiftRight");

    for (const ship of this.ships) {
      if (!ship.alive) {
        if (ship.remote) continue;
        if (!ship.isPlayer && this.t >= ship.respawn && ship.respawn > 0) {
          const base = this.baseById(ship.home);
          ship.alive = true;
          ship.x = base.x + 180;
          ship.y = base.y + 120;
          ship.hull = ship.cls.hull;
          ship.shield = 70;
          ship.energy = ship.cls.energy;
          ship.magazine = ship.cls.magazine;
          ship.warp = 0;
          ship.cloaked = false;
          ship.yaw = yawTo(ship.x, ship.y, WORLD / 2, WORLD / 2);
          this.clearAboard(ship);
          ship.drones = ship.cls.drones ?? 0;
          ship.mines = ship.cls.mines ?? 0;
          ship.crystals = ship.cls.crystals ?? 0;
          ship.born = this.t;
          this.say(`${ship.name} relaunched from ${base.name}.`, "info");
        }
        continue;
      }
      if (ship.remote) {
        ship.hitFlash = Math.max(0, ship.hitFlash - dt);
        continue;
      }
      ship.phaserCd = Math.max(0, ship.phaserCd - dt);
      ship.torpCd = Math.max(0, ship.torpCd - dt);
      ship.droneCd = Math.max(0, ship.droneCd - dt);
      ship.mineCd = Math.max(0, ship.mineCd - dt);
      if (ship.cls.regenTorp && ship.magazine < ship.cls.magazine) {
        ship.regenAcc += dt;
        if (ship.regenAcc >= 2) {
          ship.regenAcc = 0;
          ship.magazine += 1;
        }
      }
      ship.twCd = Math.max(0, ship.twCd - dt);
      ship.holeCd = Math.max(0, ship.holeCd - dt);
      ship.hitFlash = Math.max(0, ship.hitFlash - dt);
      ship.missNote = Math.max(0, ship.missNote - dt);
      if (ship.twLeft > 0) {
        ship.twLeft -= dt;
        ship.warp = Math.max(ship.warp, ship.cls.maxWarp + 2);
        if (ship.twLeft <= 0) ship.warp = Math.min(ship.warp, ship.cls.cruise);
      }
      const raising =
        ship.isPlayer && !this.aiPilot
          ? (ship.raiseLatch || (held.has("KeyR") && !shift)) && ship.shieldDrop <= 0
          : ship.shield < 100 && ship.energy > 20 && !ship.docked;
      if (ship.shieldDrop > 0) {
        ship.shieldDrop -= dt;
        ship.shield = Math.max(0, ship.shield - 90 * dt);
      } else if (raising && ship.shield < 100 && ship.energy > 6) {
        ship.shield = Math.min(100, ship.shield + 24 * dt);
        ship.energy -= 5 * dt;
      }
      if (ship.repair && ship.hull < ship.cls.hull && ship.energy > 6 && !ship.docked) {
        ship.hull = Math.min(ship.cls.hull, ship.hull + 18 * dt);
        ship.energy -= 4 * dt;
      }
      let drain = Math.abs(ship.warp) * 0.85;
      if (ship.cloaked) drain += 7;
      ship.energy = clamp(ship.energy + (3 - drain) * dt, 0, ship.cls.energy);
      if (ship.energy < 8) ship.cloaked = false;
      if (!ship.docked) {
        for (const planet of PLANETS) {
          if (planet.quad !== ship.quad || !planet.feed) continue;
          if (this.dist(ship.x, ship.y, planet.x, planet.y) < 150) {
            ship.energy = Math.min(ship.cls.energy, ship.energy + 7 * dt);
          }
        }
      }
      if (ship.energy <= 0 && ship.twLeft <= 0) {
        ship.warp = Math.max(0, ship.warp - WARP_ACCEL * dt);
      }
      if (ship.docked && (!ship.isPlayer || this.aiPilot)) {
        ship.dockTimer -= dt;
        if (ship.dockTimer <= 0) {
          ship.docked = false;
          ship.hull = ship.cls.hull;
          ship.shield = 100;
          ship.energy = ship.cls.energy;
          ship.magazine = ship.cls.magazine;
          ship.drones = ship.cls.drones ?? 0;
          ship.mines = ship.cls.mines ?? 0;
          ship.crystals = ship.cls.crystals ?? 0;
          const gained = this.goldAboard(ship);
          this.clearAboard(ship);
          ship.banked += gained;
        }
      }
    }

    const p = this.player;
    if (this.aiPilot) {
      this.flyComputer(p, dt);
    } else {
    this.autoLockStep();
    if (p.alive && !p.docked && !this.over) {
      let steer = 0;
      if (held.has("KeyA") || held.has("ArrowLeft")) steer += 1;
      if (held.has("KeyD") || held.has("ArrowRight")) steer -= 1;
      steer = clamp(steer + this.touchSteer, -1, 1);
      const warpUp = this.touchWarp > 0 || ((held.has("KeyW") || held.has("ArrowUp")) && !shift);
      const warpDn =
        this.touchWarp < 0 ||
        held.has("KeyS") ||
        held.has("ArrowDown") ||
        ((held.has("KeyW") || held.has("ArrowUp")) && shift);
      if (warpUp || warpDn) {
        p.intercept = false;
        this.seekBase = false;
        this.nav = null;
      }
      if (p.twLeft > 0 && p.cls.teleport) {
        p.intercept = false;
        p.courseYaw = null;
        if (steer === 0) p.yaw += 0.55 * dt;
      }
      if (steer !== 0) {
        p.yaw += steer * this.turnRate(p) * dt;
        p.intercept = false;
        p.courseYaw = null;
        this.seekBase = false;
        this.nav = null;
      } else if (p.intercept && p.lockId) {
        const lock = this.shipById(p.lockId);
        if (lock && lock.alive && this.visible(p, lock)) {
          this.steerToward(p, yawTo(p.x, p.y, lock.x, lock.y), dt);
          const d = this.dist(p.x, p.y, lock.x, lock.y);
          const want = d > 900 ? p.cls.cruise : d > 280 ? 3.5 : 0.6;
          this.easeWarp(p, want, dt);
        } else {
          p.intercept = false;
        }
      } else if (this.seekBase && p.twLeft <= 0) {
        const base = this.nearestBase(p);
        const d = this.dist(p.x, p.y, base.x, base.y);
        this.steerToward(p, yawTo(p.x, p.y, base.x, base.y), dt);
        const want = d > 900 ? p.cls.cruise : d > 220 ? 3.2 : 0.7;
        this.easeWarp(p, want, dt);
        if (d < 100 && p.warp <= 1.4) {
          this.seekBase = false;
          this.doDock(p, base);
        }
      } else if (this.nav && p.twLeft <= 0) {
        const d = this.dist(p.x, p.y, this.nav.x, this.nav.y);
        this.steerToward(p, yawTo(p.x, p.y, this.nav.x, this.nav.y), dt);
        const want = d > 800 ? p.cls.cruise : d > 240 ? 3 : 0.5;
        this.easeWarp(p, want, dt);
        if (d < 90) {
          this.nav = null;
          this.say("On station.", "info");
        }
      } else if (p.courseYaw !== null) {
        this.steerToward(p, p.courseYaw, dt);
        if (Math.abs(angDiff(p.yaw, p.courseYaw)) < 0.04) p.courseYaw = null;
      }
      if (p.twLeft <= 0) {
        if (warpUp && p.energy >= 8) p.warp = Math.min(p.cls.maxWarp, p.warp + WARP_ACCEL * dt);
        if (warpDn) p.warp = Math.max(-2, p.warp - WARP_ACCEL * dt);
      }
      if ((held.has("Space") || held.has("KeyF") || held.has("KeyP") || this.touchPhaser) && p.phaserCd <= 0) {
        if (p.cls.agonizer && p.magazine <= 0) {
          if (this.t > p.missNote) {
            p.missNote = this.t + 1.8;
            this.say("Agonizer needs a torpedo in the tube.", "alert");
          }
        } else {
          const ok = this.firePhaser(p);
          if (!ok && this.t > this.noTgt) {
            this.noTgt = this.t + 1.6;
            this.say("No phaser solution. Lock a target or point the bow.", "info");
          }
        }
      }
      if ((held.has("KeyT") || this.touchTorp) && p.torpCd <= 0) {
        if (p.magazine <= 0) {
          if (this.t > p.missNote) {
            p.missNote = this.t + 1.8;
            this.say("Tubes empty. Dock at a starbase.", "alert");
          }
        } else this.fireTorp(p);
      }
      if ((held.has("KeyG") || this.touchDrone) && p.droneCd <= 0 && (p.cls.drones ?? 0) > 0) {
        if (p.drones <= 0 && this.t > p.missNote) {
          p.missNote = this.t + 1.8;
          this.say("Drone racks empty. Dock to reload.", "alert");
        } else this.fireDrone(p);
      }
      if ((held.has("KeyM") || this.touchMine) && (p.cls.mines ?? 0) > 0 && p.mineCd <= 0) {
        if (p.mines <= 0 && this.t > p.missNote) {
          p.missNote = this.t + 1.8;
          this.say("Mine belt empty. Dock to reload.", "alert");
        } else this.dropMine(p);
      }
    }
    }

    for (const ship of this.ships) {
      if (ship.isPlayer || ship.remote) continue;
      this.flyComputer(ship, dt);
    }

    for (const ship of this.ships) this.moveShip(ship, dt);

    for (let i = this.mines.length - 1; i >= 0; i--) {
      const mine = this.mines[i];
      mine.life -= dt;
      mine.arm -= dt;
      let boom = mine.life <= 0;
      if (mine.arm <= 0 && !boom) {
        for (const ship of this.ships) {
          if (!ship.alive || ship.docked) continue;
          if (this.dist(mine.x, mine.y, ship.x, ship.y) < 46) {
            this.applyDamage(ship, mine.dmg, this.shipById(mine.owner));
            this.burst(mine.x, mine.y, 10, true);
            if (ship.isPlayer) this.say("Mine.", "alert");
            boom = true;
            break;
          }
        }
      }
      if (boom) this.mines.splice(i, 1);
    }

    this.holeLeft -= dt;
    if (this.holeLeft <= 0) {
      this.holeOpen = !this.holeOpen;
      this.holeLeft = 48 + Math.random() * 24;
      this.say(this.holeOpen ? "Wormholes are open." : "Wormholes have gone dark.", "amber");
    }

    for (const ship of this.ships) {
      if (!ship.alive || ship.docked || ship.holeCd > 0 || ship.remote) continue;
      const here = HOLES.find((h) => h.quad === ship.quad);
        if (!here || this.dist(ship.x, ship.y, here.x, here.y) >= 78) continue;
        if (ship.cloaked) {
          if (ship.isPlayer && this.t > this.edgeNote) {
            this.edgeNote = this.t + 3;
            this.say("Cloaked ships cannot take the wormhole.", "alert");
          }
          continue;
        }
        if (!this.holeOpen) {
          if (ship.isPlayer && this.t > this.edgeNote) {
            this.edgeNote = this.t + 3;
            this.say("Wormhole is dark. It opens about once a minute.", "alert");
          }
          continue;
        }
        const there = HOLES.find((h) => h.quad !== ship.quad) ?? here;
        const n = nose(ship.yaw);
        ship.quad = there.quad;
        ship.x = there.x + n.x * 160;
        ship.y = there.y + n.y * 160;
        ship.holeCd = 60;
        if (ship.isPlayer) {
          this.say(
            ship.quad === "B"
              ? "Wormhole transit. Beta quadrant. A minute before this mouth will take you again."
              : "Wormhole transit. Alpha quadrant. A minute before this mouth will take you again.",
            "amber",
          );
        }
    }

    for (let i = this.bolts.length - 1; i >= 0; i--) {
      const b = this.bolts[i];
      const lock = this.shipById(b.lockId);
      if (lock && lock.alive && !lock.docked && b.homing > 0) {
        const dx = lock.x - b.x;
        const dy = lock.y - b.y;
        const len = Math.hypot(dx, dy) || 1;
        const spd = Math.hypot(b.vx, b.vy) || 1;
        const tx = (dx / len) * spd;
        const ty = (dy / len) * spd;
        const k = clamp(b.homing * dt, 0, 1);
        b.vx += (tx - b.vx) * k;
        b.vy += (ty - b.vy) * k;
      }
      const step = Math.hypot(b.vx, b.vy) * dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.traveled += step;
      b.life -= dt;
      let hit = false;
      if (b.traveled >= b.min) {
        for (const ship of this.ships) {
          if (!ship.alive || ship.docked || ship.id === b.owner) continue;
          if (ship.cloaked && this.dist(b.x, b.y, ship.x, ship.y) > 36) continue;
          if (this.dist(b.x, b.y, ship.x, ship.y) < 34) {
            const span = Math.max(1, b.max - b.min);
            const u = clamp((b.traveled - b.min) / span, 0, 1);
            const dmg =
              b.kind === "obliterator" ? b.dmg : b.dmg * (b.varPlasma ? 0.4 + 0.95 * u : 0.35 + 0.65 * u);
            const owner = this.shipById(b.owner);
            this.applyDamage(ship, dmg, owner);
            hit = true;
            break;
          }
        }
      }
      if (hit || b.life <= 0 || b.traveled > b.max || b.x < -200 || b.y < -200 || b.x > WORLD + 200 || b.y > WORLD + 200) {
        this.bolts.splice(i, 1);
      }
    }

    const seekers = [this.player, ...this.ships.filter((s) => s !== this.player)];
    for (let i = this.picks.length - 1; i >= 0; i--) {
      const g = this.picks[i];
      g.life -= dt;
      let taken = false;
      for (const ship of seekers) {
        if (!ship.alive || ship.docked || ship.remote) continue;
        if (this.dist(ship.x, ship.y, g.x, g.y) < 56) {
          ship.cargo += g.gold;
          if (ship.isPlayer) {
            this.say(`Picked up ${g.gold} gold. Dock to keep it.`, "amber");
            sfx.gold();
          }
          taken = true;
          break;
        }
      }
      if (taken || g.life <= 0) this.picks.splice(i, 1);
    }

    for (let i = this.beams.length - 1; i >= 0; i--) {
      this.beams[i].life -= dt;
      if (this.beams[i].life <= 0) this.beams.splice(i, 1);
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const q = this.particles[i];
      q.life -= dt;
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      if (q.life <= 0) this.particles.splice(i, 1);
    }
  }

  relaunch() {
    const p = this.player;
    const base = this.baseById(p.home);
    p.alive = true;
    p.x = base.x + 460;
    p.y = base.y + 280;
    p.yaw = yawTo(p.x, p.y, WORLD / 2, WORLD / 2);
    p.warp = 0;
    p.hull = p.cls.hull;
    p.shield = 100;
    p.energy = p.cls.energy;
    p.magazine = p.cls.magazine;
    p.cloaked = false;
    p.docked = false;
    p.repair = false;
    p.raiseLatch = false;
    p.intercept = false;
    p.lockId = null;
    p.courseYaw = null;
    this.seekBase = false;
    this.nav = null;
    this.clearAboard(p);
    p.drones = p.cls.drones ?? 0;
    p.mines = p.cls.mines ?? 0;
    p.crystals = p.cls.crystals ?? 0;
    p.born = this.t;
    p.phaserCd = 0;
    p.torpCd = 0.3;
    this.over = false;
    this.killedBy = "";
    this.say("Relaunched. The vault kept what you banked. The rest is gone.", "amber");
  }

  snapshot(): Snapshot {
    const p = this.player;
    const lock = this.shipById(p.lockId);
    let target: TargetInfo | null = null;
    if (lock && lock.alive && this.visible(p, lock)) {
      target = {
        id: lock.id,
        letter: lock.letter,
        name: lock.name,
        code: lock.cls.code,
        race: lock.cls.race,
        dist: this.dist(p.x, p.y, lock.x, lock.y),
        warp: lock.warp,
        shield: lock.shield,
        hull: Math.max(0, lock.hull),
        hullMax: lock.cls.hull,
        cloaked: lock.cloaked,
        docked: lock.docked,
        gold: Math.floor(lock.banked + this.goldAboard(lock)),
      };
    } else if (lock && !lock.alive) {
      p.lockId = null;
    }
    const roster: RosterRow[] = this.ships.map((s) => {
      const same = s.quad === p.quad;
      const seen = s.isPlayer || (s.alive && (s.remote || this.visible(p, s)));
      return {
        id: s.id,
        letter: s.letter,
        name: s.remote && !same ? `${s.name} · other quadrant` : s.name,
        code: s.cls.code,
        dist: seen && s.alive && same ? this.dist(p.x, p.y, s.x, s.y) : null,
        alive: s.alive,
        docked: s.docked,
        isPlayer: s.isPlayer,
        gold: Math.floor(s.banked + (s.alive ? this.goldAboard(s) : 0)),
        seen,
      };
    });
    const base = this.nearestBase(p);
    const bd = this.dist(p.x, p.y, base.x, base.y);
    let nearPlanet: string | null = null;
    for (const planet of PLANETS) {
      if (planet.quad !== p.quad) continue;
      if (this.dist(p.x, p.y, planet.x, planet.y) < 150) nearPlanet = planet.name;
    }
    let hint = "Click a contact or empty space.";
    if (this.over) hint = "Ship lost.";
    else if (p.docked) hint = `Docked at ${p.dockName}. Undock to fly.`;
    else if (bd < 110 && p.warp <= 1.4) hint = `${base.name} in range. Press . to dock and bank.`;
    else if (bd < 110) hint = "Kill warp under 1.4 to dock.";
    else if (p.hull / p.cls.hull < 0.28) hint = "Hull critical. Run for a starbase.";
    else if (!p.raiseLatch && p.shield < 40) hint = "Shields low. Hold R or latch raise.";
    else if (nearPlanet) hint = `Orbiting ${nearPlanet}. Dilithium is feeding the core.`;
    return {
      phase: this.over ? "dead" : "play",
      t: this.t,
      warp: p.warp,
      maxWarp: p.cls.maxWarp,
      heading: headingOf(p.yaw),
      energy: p.energy,
      energyMax: p.cls.energy,
      shield: p.shield,
      hull: Math.max(0, p.hull),
      hullMax: p.cls.hull,
      torps: p.magazine,
      torpMax: p.cls.magazine,
      torpName: p.cls.torpName,
      drones: p.drones,
      dronesMax: p.cls.drones ?? 0,
      mines: p.mines,
      minesMax: p.cls.mines ?? 0,
      crystals: p.crystals,
      crystalsMax: p.cls.crystals ?? 0,
      holeOpen: this.holeOpen,
      quad: p.quad === "B" ? "BETA" : "ALPHA",
      cloakOn: p.cloaked,
      canCloak: p.cls.cloak,
      repair: p.repair,
      shieldsUp: p.raiseLatch,
      intercept: p.intercept,
      autoLock: this.autoLock,
      seekBase: this.seekBase,
      aiPilot: this.aiPilot,
      transwarp: p.cls.transwarp,
      twReady: p.cls.transwarp && p.twCd <= 0 && p.twLeft <= 0,
      banked: Math.floor(p.banked),
      unbanked: this.goldAboard(p),
      dmgGiven: Math.floor(p.dmgGiven),
      dmgTaken: Math.floor(p.dmgTaken),
      kills: p.kills,
      conflicts: p.conflicts,
      letter: p.letter,
      name: p.name,
      code: p.cls.code,
      race: p.cls.race,
      docked: p.docked,
      dockName: p.dockName,
      nearBase: bd < 900 ? `${base.name} ${Math.round(bd)}` : null,
      nearPlanet,
      target,
      roster,
      messages: this.messages,
      hint,
      killedBy: this.killedBy,
      survived: Math.max(0, this.t - p.born),
      shake: this.shake,
    };
  }
}
