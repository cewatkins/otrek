import { sfx } from "@/game/audio";
import { CHART, type ChartRow } from "@/game/chart";
import { classById, SHEETS, type ShipClass } from "@/game/classes";
import {
  antimatterUsed,
  countsAsFight,
  crystalBurn,
  garble,
  hullTear,
  pulsarCloaking,
  rawToWorld,
  seenRange,
  terrainOf,
  breaksaveTake,
} from "@/game/rules";

export const WORLD = 9000;
const WARP_SPEED = 78;
const WARP_ACCEL = 2.5;
const CLIMB = WARP_SPEED * 5;

export type Quad = "A" | "B" | "G" | "O";
export type Spot = {
  id: string;
  num: number;
  name: string;
  race: string;
  kind: ChartRow["kind"];
  x: number;
  y: number;
  z: number;
  r: number;
  quad: Quad;
  dock: boolean;
  feed: boolean;
  code: string;
};
export type Base = Spot;
export type Planet = Spot;
export type Bolt = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
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
export type Pickup = { x: number; y: number; z: number; gold: number; life: number };
export type Mine = { x: number; y: number; z: number; dmg: number; owner: string; life: number; arm: number };
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
  z: number;
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
  patrolZ: number;
  orbitSign: number;
  bias: number;
  home: string;
  traveled: number;
  born: number;
  goalYaw: number;
  goalWarp: number;
  goalZ: number;
  missNote: number;
  /** Dilithium still in the hold. Soaks damage that gets through shields, and overwarp burns it. */
  crystals: number;
  crystalAcc: number;
  /** Fuel. Warp energy cannot rise above whatever antimatter is left. */
  antimatter: number;
  amAcc: number;
  /** Breaksaves. Leaving a fight under 1,000 gold loses the ship. */
  breaks: number;
  /** Who has actually shot this ship. Gold requires a shot back from a human. */
  fought: Set<string>;
  /** Another player's ship. Pose comes from them; this client does not fly it. */
  remote: boolean;
  /** Alpha is where every ship starts. Wormholes cycle Alpha, Beta, Gamma, Omega. */
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
  damageWarp: number;
  heading: number;
  z: number;
  energy: number;
  energyMax: number;
  antimatter: number;
  breaks: number;
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
  quad: "ALPHA" | "BETA" | "GAMMA" | "OMEGA";
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

function raceOf(row: ChartRow) {
  if (row.kind === "base") return "Starbase";
  if (row.kind === "star") return "Star";
  if (row.kind === "hazard") return "Hazard";
  if (row.kind === "comet") return "Comet";
  if (row.kind === "hole") return "Wormhole";
  return "Planet";
}

/** Original mtrek coordinates, scaled into world units. Z is the third axis. */
export const SPOTS: Spot[] = CHART.map((row) => ({
  id: row.id,
  num: row.num,
  name: row.name,
  race: raceOf(row),
  kind: row.kind,
  x: row.x,
  y: row.y,
  z: row.z,
  r: row.r,
  quad: row.quad,
  dock: row.dock,
  feed: row.feed,
  code: row.code,
}));
export const BASES: Base[] = SPOTS.filter((spot) => spot.dock && spot.kind !== "hole");
export const PLANETS: Planet[] = SPOTS.filter((spot) => !spot.dock && spot.kind !== "hole");
export const HOLES: Spot[] = SPOTS.filter((spot) => spot.kind === "hole");

export type Zone = { minX: number; maxX: number; minY: number; maxY: number };

/** Shared by the long-range pane and chart clicks so a click lands where it looks. */
export function zoneOf(quad: Quad): Zone {
  const rows = SPOTS.filter((spot) => spot.quad === quad);
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const spot of rows) {
    minX = Math.min(minX, spot.x);
    maxX = Math.max(maxX, spot.x);
    minY = Math.min(minY, spot.y);
    maxY = Math.max(maxY, spot.y);
  }
  if (!Number.isFinite(minX)) return { minX: 0, maxX: WORLD, minY: 0, maxY: WORLD };
  const pad = 420;
  return { minX: minX - pad, maxX: maxX + pad, minY: minY - pad, maxY: maxY + pad };
}

const QUAD_ORDER: Quad[] = ["A", "B", "G", "O"];
const QUAD_NAME: Record<Quad, "ALPHA" | "BETA" | "GAMMA" | "OMEGA"> = {
  A: "ALPHA",
  B: "BETA",
  G: "GAMMA",
  O: "OMEGA",
};

function nextQuad(q: Quad): Quad {
  return QUAD_ORDER[(QUAD_ORDER.indexOf(q) + 1) % QUAD_ORDER.length];
}

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
    z: number;
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
    z: partial.z,
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
    patrolZ: partial.z,
    orbitSign: Math.random() < 0.5 ? -1 : 1,
    bias: partial.bias ?? 0,
    home: partial.home,
    traveled: 0,
    born: t,
    goalYaw: yaw,
    goalWarp: 0,
    goalZ: partial.z,
    missNote: 0,
    crystals: cls.crystals ?? 0,
    crystalAcc: 0,
    antimatter: 5000,
    amAcc: 0,
    breaks: 0,
    fought: new Set(),
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
  touchClimb = 0;
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
  nav: { x: number; y: number; z: number } | null = null;
  /** `[` picks a key. The hail line is the macro. `]` clears one. */
  keymaps: Record<string, string> = {};
  pendingMap = "";
  mapPhase: "idle" | "pick" | "clear" = "idle";
  onHail: ((msg: { text: string; to: string | null }) => void) | null = null;
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
  private farmNote = 0;
  private lastCombat = -100;
  private broke = false;
  private hitTimes = new Map<string, number[]>();

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
        z: home.z,
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
            x: b.x + Math.cos(ang) * 520,
            y: b.y + Math.sin(ang) * 520,
            z: b.z,
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
    else this.say("W/S warp · Up/Down change Z · A/D turn · click a ship to lock · Space phasers · T torpedoes · . dock", "info");
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
    const next = dir > 0 ? Math.min(this.tearOf(p), p.warp + 0.4) : Math.max(-2, p.warp - 0.4);
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

  dist(ax: number, ay: number, bx: number, by: number, az = 0, bz = 0) {
    return Math.hypot(ax - bx, ay - by, az - bz);
  }

  /** Cruising cap is maxWarp. The sheet's damage warp is as fast as the hull will go. */
  tearOf(ship: Ship) {
    return SHEETS[ship.cls.id]?.damageWarp ?? ship.cls.maxWarp;
  }

  private spotNear(ship: Ship, kind: ReturnType<typeof terrainOf>) {
    let best: Spot | null = null;
    let bestD = Infinity;
    for (const spot of SPOTS) {
      if (spot.quad !== ship.quad || terrainOf(spot.name) !== kind) continue;
      const d = this.dist(ship.x, ship.y, spot.x, spot.y, ship.z, spot.z);
      const reach =
        kind === "quasar"
          ? rawToWorld("quasar", spot.r, 1250)
          : kind === "pulsar"
            ? rawToWorld("pulsar", spot.r, 1500)
            : kind === "cygnus"
              ? rawToWorld("cygnus", spot.r, 10000)
              : spot.r;
      if (d < reach && d < bestD) {
        best = spot;
        bestD = d;
      }
    }
    return best;
  }

  private nebulaAt(ship: Ship) {
    return this.spotNear(ship, "nebula");
  }

  private cloakDead(ship: Ship) {
    if (this.spotNear(ship, "quasar")) return true;
    const pulsar = this.spotNear(ship, "pulsar");
    return Boolean(pulsar && pulsarCloaking(pulsar.name, this.t));
  }

  private interference(ship: Ship) {
    return Boolean(this.nebulaAt(ship) || this.spotNear(ship, "quasar") || this.spotNear(ship, "pulsar"));
  }

  private payForHit(attacker: Ship, target: Ship, raw: number) {
    const back = attacker.fought.has(target.id);
    if (!countsAsFight(target.remote, back)) {
      if (attacker.isPlayer && this.t > this.farmNote) {
        this.farmNote = this.t + 6;
        this.say("No gold. They never fired back. That is pointshipping.", "alert");
      }
    } else {
      attacker.pendingDmg += raw;
      if (target.banked > 400 || target.dmgGiven > 1200) attacker.pendingBonus += raw * 0.5;
    }
    target.fought.add(attacker.id);
    if (attacker.isPlayer || target.isPlayer) this.lastCombat = this.t;
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
      quad?: Quad;
      z?: number;
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
    const x = Number(pose.x) || 0;
    const y = Number(pose.y) || 0;
    const z = Number.isFinite(Number(pose.z)) ? Number(pose.z) : 4500;
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
          z,
        },
        this.t,
      );
      ship.id = id;
      ship.remote = true;
      ship.quad = pose.quad && QUAD_ORDER.includes(pose.quad) ? pose.quad : "A";
      this.ships.push(ship);
      this.say(`${ship.name} entered the quadrant.`, "amber");
    }
    ship.remote = true;
    ship.quad = pose.quad && QUAD_ORDER.includes(pose.quad) ? pose.quad : ship.quad;
    ship.alive = true;
    ship.name = String(pose.name ?? ship.name).slice(0, 18);
    if (pose.classId && pose.classId !== ship.cls.id) ship.cls = classById(String(pose.classId));
    ship.x = x;
    ship.y = y;
    ship.z = z;
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
    const name = byName.slice(0, 24);
    const now = this.t;
    const recent = (this.hitTimes.get(name) ?? []).filter((at) => now - at < 1);
    if (recent.length >= 8) return;
    recent.push(now);
    this.hitTimes.set(name, recent);
    const ghost = this.ships.find((s) => s.remote && s.name === name) ?? null;
    if (!ghost || ghost.quad !== this.player.quad) return;
    const reach = Math.max(ghost.cls.phaserRange, ghost.cls.torpMax, 1600) + 500;
    if (this.dist(ghost.x, ghost.y, this.player.x, this.player.y, ghost.z, this.player.z) > reach) return;
    const dmg = Math.max(0, Math.min(220, raw));
    this.applyDamage(this.player, dmg, ghost);
    this.say(`${name} hits for ${Math.round(dmg)}.`, "alert");
  }

  visible(observer: Ship, target: Ship) {
    if (!target.alive) return false;
    if (observer.quad !== target.quad) return false;
    const d = this.dist(observer.x, observer.y, target.x, target.y, observer.z, target.z);
    const nebO = this.nebulaAt(observer);
    const nebT = this.nebulaAt(target);
    const scan = seenRange(observer.cls.scan, Boolean(nebO), Boolean(nebT), (nebO ?? nebT)?.r ?? 450);
    if (d > scan && !(observer.quad === target.quad && target.remote && !nebO && !nebT)) return false;
    if (target.remote && !nebO && !nebT && !target.cloaked) return true;
    const cloaked = target.cloaked && !target.docked && !this.cloakDead(target);
    if (cloaked && d > 320 && target !== observer) return false;
    if (d > scan) return false;
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
        const d = this.dist(p.x, p.y, s.x, s.y, p.z, s.z);
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
      const cd = this.dist(p.x, p.y, cur.x, cur.y, p.z, cur.z);
      const pd = this.dist(p.x, p.y, pick.x, pick.y, p.z, pick.z);
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
  setWaypoint(x: number, y: number, z?: number) {
    if (this.over || this.player.docked || !this.player.alive) return;
    const zone = zoneOf(this.player.quad);
    let px = clamp(x, zone.minX, zone.maxX);
    let py = clamp(y, zone.minY, zone.maxY);
    let pz = z ?? this.player.z;
    if (z === undefined) {
      let best = 90;
      for (const spot of SPOTS) {
        if (spot.quad !== this.player.quad) continue;
        const dxy = Math.hypot(spot.x - px, spot.y - py);
        if (dxy < Math.max(best, spot.r)) {
          best = dxy;
          px = spot.x;
          py = spot.y;
          pz = spot.z;
        }
      }
    }
    this.nav = { x: px, y: py, z: pz };
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
    const d = this.dist(p.x, p.y, base.x, base.y, p.z, base.z);
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
    const raw = text.trim().slice(0, 80);
    if (!raw) return null;
    let body = raw;
    let to: string | null = null;
    let who = "the quadrant";
    if (body.startsWith("@")) {
      const lock = this.shipById(this.player.lockId);
      body = body.slice(1).trim();
      if (!lock || !body) {
        this.say("Hail needs a lock. Press @ only when someone is locked.", "info");
        return null;
      }
      if (!this.visible(lock, this.player) && !this.visible(this.player, lock)) {
        this.say(`${lock.name} is out of range for a hail.`, "info");
        return null;
      }
      who = lock.name;
      to = lock.remote ? lock.id.slice(4) : lock.id;
    }
    if (this.interference(this.player)) body = garble(body, "@");
    this.say(to ? `To ${who}: ${body}` : `${this.player.name}: ${body}`, "hail");
    this.onHail?.({ text: `${this.player.name}: ${body}`, to });
    if (to && !to.startsWith("net") && !this.ships.find((s) => s.id === to)?.remote) {
      const foe = this.shipById(to);
      if (foe && !foe.isPlayer) {
        const lines = [
          `${foe.name}: Save it for the debris field.`,
          `${foe.name}: Noted. I still intend to shoot you.`,
          `${foe.name}: Gold first. Speeches later.`,
        ];
        const reply = lines[Math.floor(Math.random() * lines.length)] ?? lines[0];
        this.say(this.interference(this.player) ? garble(reply, "#") : reply, "info");
      }
    } else if (!to) {
      const foe = this.ships.find((s) => s.alive && !s.isPlayer && !s.docked && !s.remote);
      if (foe) {
        const reply = `${foe.name}: Noted.`;
        this.say(this.interference(this.player) ? garble(reply, "#") : reply, "info");
      }
    }
    return { text: `${this.player.name}: ${body}`, to };
  }

  hearHail(text: string) {
    const body = this.interference(this.player) ? garble(text, "#") : text;
    this.say(body.slice(0, 96), "hail");
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
      ship.antimatter = 5000;
      ship.amAcc = 0;
      ship.crystalAcc = 0;
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
      const d = this.dist(ship.x, ship.y, b.x, b.y, ship.z, b.z);
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
      const d = this.dist(ship.x, ship.y, o.x, o.y, ship.z, o.z);
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
    this.easeZ(ship, ship.goalZ, dt * 0.25);
    if (ship.aiState === "hunt") {
      const tgt = this.shipById(ship.lockId);
      if (tgt && tgt.alive && tgt !== ship && !tgt.docked) {
        const d = this.dist(ship.x, ship.y, tgt.x, tgt.y, ship.z, tgt.z);
        const noseOn = Math.abs(angDiff(ship.yaw, yawTo(ship.x, ship.y, tgt.x, tgt.y))) < 0.55;
        if (noseOn && d < ship.cls.phaserRange * 0.96) this.firePhaser(ship);
        if (noseOn && d > ship.cls.torpMin * 0.85 && d < ship.cls.torpMax * 0.95) this.fireTorp(ship);
        if (d > 200 && d < 1500 && ship.drones > 0) this.fireDrone(ship);
        if (d > 160 && d < 420 && ship.mines > 0) this.dropMine(ship);
      }
    }
    if (ship.aiState === "docking") {
      const base = this.nearestBase(ship);
      if (this.dist(ship.x, ship.y, base.x, base.y, ship.z, base.z) < 96 && ship.warp < 1.6) this.doDock(ship, base);
    }
  }

  private think(ship: Ship) {
    if (this.t < 8) {
      ship.aiState = "patrol";
      ship.lockId = null;
      ship.cloaked = false;
      if (this.dist(ship.x, ship.y, ship.patrolX, ship.patrolY, ship.z, ship.patrolZ) < 220) {
        ship.patrolX = 700 + Math.random() * (WORLD - 1400);
        ship.patrolY = 700 + Math.random() * (WORLD - 1400);
        ship.patrolZ = ship.z + (Math.random() - 0.5) * 800;
      }
      ship.goalYaw = yawTo(ship.x, ship.y, ship.patrolX, ship.patrolY);
      ship.goalZ = ship.patrolZ;
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
      const d = this.dist(ship.x, ship.y, base.x, base.y, ship.z, base.z);
      ship.goalYaw = yawTo(ship.x, ship.y, base.x, base.y);
      ship.goalZ = base.z;
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
      const d = this.dist(ship.x, ship.y, o.x, o.y, ship.z, o.z);
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
      const playerDist = this.dist(ship.x, ship.y, this.player.x, this.player.y, ship.z, this.player.z);
      const nearDist = target ? this.dist(ship.x, ship.y, target.x, target.y, ship.z, target.z) : Infinity;
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
      const heldDist = this.dist(ship.x, ship.y, heldLock.x, heldLock.y, ship.z, heldLock.z);
      const nextDist = target ? this.dist(ship.x, ship.y, target.x, target.y, ship.z, target.z) : Infinity;
      if (heldDist < nextDist * 1.4) target = heldLock;
    }
    if (!target) {
      ship.aiState = "patrol";
      ship.lockId = null;
      ship.cloaked = false;
      if (this.dist(ship.x, ship.y, ship.patrolX, ship.patrolY, ship.z, ship.patrolZ) < 220) {
        ship.patrolX = 700 + Math.random() * (WORLD - 1400);
        ship.patrolY = 700 + Math.random() * (WORLD - 1400);
        ship.patrolZ = ship.z + (Math.random() - 0.5) * 800;
      }
      ship.goalYaw = yawTo(ship.x, ship.y, ship.patrolX, ship.patrolY);
      ship.goalZ = ship.patrolZ;
      ship.goalWarp = ship.cls.cruise * 0.55;
      return;
    }
    ship.aiState = "hunt";
    ship.lockId = target.id;
    ship.goalZ = target.z;
    const d = this.dist(ship.x, ship.y, target.x, target.y, ship.z, target.z);
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
    const zone = zoneOf(ship.quad);
    if (ship.x < zone.minX || ship.x > zone.maxX || ship.y < zone.minY || ship.y > zone.maxY) {
      ship.x = clamp(ship.x, zone.minX, zone.maxX);
      ship.y = clamp(ship.y, zone.minY, zone.maxY);
      ship.yaw = yawTo(ship.x, ship.y, WORLD / 2, WORLD / 2);
      ship.courseYaw = null;
      ship.warp = Math.min(ship.warp, 2);
      if (ship.isPlayer && this.t > this.edgeNote) {
        this.edgeNote = this.t + 4;
        this.say("Nav hazard — quadrant edge. Coming about.", "alert");
      }
    }
  }

  private easeZ(ship: Ship, target: number, dt: number) {
    const diff = target - ship.z;
    const step = CLIMB * dt;
    if (Math.abs(diff) <= step) ship.z = target;
    else ship.z += Math.sign(diff) * step;
  }

  private easeWarp(ship: Ship, target: number, dt: number) {
    const max = ship.twLeft > 0 ? this.tearOf(ship) : this.tearOf(ship);
    const goal = clamp(target, -2, max);
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
      const hits = foes.filter((o) => this.dist(ship.x, ship.y, o.x, o.y, ship.z, o.z) <= range && (!o.cloaked || this.dist(ship.x, ship.y, o.x, o.y, ship.z, o.z) < 300));
      if (hits.length === 0) return false;
      ship.energy -= 16;
      ship.phaserCd = 1.7;
      for (const o of hits) {
        const d = this.dist(ship.x, ship.y, o.x, o.y, ship.z, o.z);
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
      this.dist(ship.x, ship.y, lock.x, lock.y, ship.z, lock.z) <= range &&
      (!lock.cloaked || this.dist(ship.x, ship.y, lock.x, lock.y, ship.z, lock.z) < 300)
    ) {
      victim = lock;
    } else {
      let best = Infinity;
      for (const o of foes) {
        const d = this.dist(ship.x, ship.y, o.x, o.y, ship.z, o.z);
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
    const d = this.dist(ship.x, ship.y, victim.x, victim.y, ship.z, victim.z);
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
    let dirz: number;
    let lockId: string | null = null;
    if (lock && lock.alive && !lock.docked && (!lock.cloaked || this.dist(ship.x, ship.y, lock.x, lock.y, ship.z, lock.z) < 340)) {
      const dx = lock.x - ship.x;
      const dy = lock.y - ship.y;
      const dz = lock.z - ship.z;
      const len = Math.hypot(dx, dy, dz) || 1;
      dirx = dx / len;
      diry = dy / len;
      dirz = dz / len;
      lockId = lock.id;
    } else {
      const n = nose(ship.yaw);
      dirx = n.x;
      diry = n.y;
      dirz = 0;
    }
    ship.magazine -= 1;
    ship.torpCd = ship.cls.torpCd;
    ship.energy -= 4;
    const spd = ship.cls.torpSpeed;
    this.bolts.push({
      x: ship.x + dirx * 46,
      y: ship.y + diry * 46,
      z: ship.z + dirz * 46,
      vx: dirx * spd,
      vy: diry * spd,
      vz: dirz * spd,
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
      z: ship.z,
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
    let dirz: number;
    let lockId: string | null = null;
    if (lock && lock.alive && !lock.docked) {
      const dx = lock.x - ship.x;
      const dy = lock.y - ship.y;
      const dz = lock.z - ship.z;
      const len = Math.hypot(dx, dy, dz) || 1;
      dirx = dx / len;
      diry = dy / len;
      dirz = dz / len;
      lockId = lock.id;
    } else {
      const n = nose(ship.yaw);
      dirx = n.x;
      diry = n.y;
      dirz = 0;
    }
    ship.drones -= 1;
    ship.droneCd = 1.7;
    ship.energy -= 6;
    const spd = ship.cls.droneVar ? 420 + Math.random() * 520 : 640;
    this.bolts.push({
      x: ship.x + dirx * 40,
      y: ship.y + diry * 40,
      z: ship.z + dirz * 40,
      vx: dirx * spd,
      vy: diry * spd,
      vz: dirz * spd,
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
        this.payForHit(attacker, target, raw);
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
    const naked = Boolean(this.nebulaAt(target));
    if (!naked && target.shield > 0) {
      const pct = Math.min(target.shield, left / target.cls.shieldStr);
      target.shield -= pct;
      left -= pct * target.cls.shieldStr;
    }
    if (left > 0 && target.crystals > 0 && !naked) {
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
      this.payForHit(attacker, target, raw);
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
    if (dropped > 0) this.picks.push({ x: ship.x, y: ship.y, z: ship.z, gold: dropped, life: 90 });
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
          ship.z = base.z;
          ship.quad = base.quad;
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
          ship.antimatter = 5000;
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
      this.burnFuel(ship, dt);
      if (ship.energy < 8) ship.cloaked = false;
      if (!ship.docked) {
        for (const planet of PLANETS) {
          if (planet.quad !== ship.quad || !planet.feed) continue;
          if (this.dist(ship.x, ship.y, planet.x, planet.y, ship.z, planet.z) < Math.max(150, planet.r)) {
            ship.energy = Math.min(ship.cls.energy, ship.energy + 7 * dt);
          }
        }
        this.refillAntimatter(ship, dt);
        this.terrain(ship, dt);
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
          ship.antimatter = 5000;
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
      const warpUp = this.touchWarp > 0 || (held.has("KeyW") && !shift);
      const warpDn = this.touchWarp < 0 || held.has("KeyS") || (held.has("KeyW") && shift);
      const climb =
        (held.has("ArrowUp") ? 1 : 0) - (held.has("ArrowDown") ? 1 : 0) + this.touchClimb;
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
          const d = this.dist(p.x, p.y, lock.x, lock.y, p.z, lock.z);
          const want = d > 900 ? p.cls.cruise : d > 280 ? 3.5 : 0.6;
          this.easeWarp(p, want, dt);
          if (climb === 0) this.easeZ(p, lock.z, dt);
        } else {
          p.intercept = false;
        }
      } else if (this.seekBase && p.twLeft <= 0) {
        const base = this.nearestBase(p);
        const d = this.dist(p.x, p.y, base.x, base.y, p.z, base.z);
        this.steerToward(p, yawTo(p.x, p.y, base.x, base.y), dt);
        const want = d > 900 ? p.cls.cruise : d > 220 ? 3.2 : 0.7;
        this.easeWarp(p, want, dt);
        if (climb === 0) this.easeZ(p, base.z, dt);
        if (d < 100 && p.warp <= 1.4) {
          this.seekBase = false;
          this.doDock(p, base);
        }
      } else if (this.nav && p.twLeft <= 0) {
        const d = this.dist(p.x, p.y, this.nav.x, this.nav.y, p.z, this.nav.z);
        this.steerToward(p, yawTo(p.x, p.y, this.nav.x, this.nav.y), dt);
        const want = d > 800 ? p.cls.cruise : d > 240 ? 3 : 0.5;
        this.easeWarp(p, want, dt);
        if (climb === 0) this.easeZ(p, this.nav.z, dt);
        if (d < 90) {
          this.nav = null;
          this.say("On station.", "info");
        }
      } else if (p.courseYaw !== null) {
        this.steerToward(p, p.courseYaw, dt);
        if (Math.abs(angDiff(p.yaw, p.courseYaw)) < 0.04) p.courseYaw = null;
      }
      if (p.twLeft <= 0) {
        if (warpUp && p.energy >= 8 && p.antimatter > 0) p.warp = Math.min(this.tearOf(p), p.warp + WARP_ACCEL * dt);
        if (warpDn) p.warp = Math.max(-2, p.warp - WARP_ACCEL * dt);
      }
      if (climb !== 0 && p.twLeft <= 0) p.z += climb * CLIMB * dt;
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
          if (this.dist(mine.x, mine.y, ship.x, ship.y, mine.z, ship.z) < 46) {
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
        if (!here || this.dist(ship.x, ship.y, here.x, here.y, ship.z, here.z) >= Math.max(78, here.r)) continue;
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
        const there = HOLES.find((h) => h.quad === nextQuad(ship.quad)) ?? here;
        const n = nose(ship.yaw);
        ship.quad = there.quad;
        ship.x = there.x + n.x * 160;
        ship.y = there.y + n.y * 160;
        ship.z = there.z;
        ship.holeCd = 60;
        if (ship.isPlayer) {
          this.say(
            `Wormhole transit. ${QUAD_NAME[ship.quad]} quadrant. A minute before this mouth will take you again.`,
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
        const dz = lock.z - b.z;
        const len = Math.hypot(dx, dy, dz) || 1;
        const spd = Math.hypot(b.vx, b.vy, b.vz) || 1;
        const tx = (dx / len) * spd;
        const ty = (dy / len) * spd;
        const tz = (dz / len) * spd;
        const k = clamp(b.homing * dt, 0, 1);
        b.vx += (tx - b.vx) * k;
        b.vy += (ty - b.vy) * k;
        b.vz += (tz - b.vz) * k;
      }
      const step = Math.hypot(b.vx, b.vy, b.vz) * dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.z += b.vz * dt;
      b.traveled += step;
      b.life -= dt;
      let hit = false;
      if (b.traveled >= b.min) {
        for (const ship of this.ships) {
          if (!ship.alive || ship.docked || ship.id === b.owner) continue;
          if (ship.cloaked && this.dist(b.x, b.y, ship.x, ship.y, b.z, ship.z) > 36) continue;
          if (this.dist(b.x, b.y, ship.x, ship.y, b.z, ship.z) < 34) {
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
      if (hit || b.life <= 0 || b.traveled > b.max) {
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
        if (this.dist(ship.x, ship.y, g.x, g.y, ship.z, g.z) < 56) {
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
    p.z = base.z;
    p.quad = base.quad;
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
    p.antimatter = 5000;
    p.amAcc = 0;
    p.born = this.t;
    p.phaserCd = 0;
    p.torpCd = 0.3;
    this.over = false;
    this.killedBy = "";
    this.say("Relaunched. The vault kept what you banked. The rest is gone.", "amber");
  }

  private burnFuel(ship: Ship, dt: number) {
    if (!ship.alive) return;
    const tear = this.tearOf(ship);
    const cruise = ship.cls.maxWarp;
    if (ship.warp > tear) ship.warp = tear;
    if (!ship.docked) {
      ship.amAcc += antimatterUsed(ship.warp, ship.shield > 10, ship.cloaked, dt);
      while (ship.amAcc >= 1 && ship.antimatter > 0) {
        ship.amAcc -= 1;
        ship.antimatter -= 1;
      }
    }
    const cap = Math.min(ship.cls.energy, Math.max(0, ship.antimatter));
    if (ship.energy > cap) ship.energy = cap;
    if (ship.antimatter <= 0 && ship.warp > 1 && ship.twLeft <= 0) {
      ship.warp = Math.max(1, ship.warp - WARP_ACCEL * dt);
    }
    if (ship.warp > cruise && ship.twLeft <= 0 && !ship.docked) {
      ship.crystalAcc += crystalBurn(ship.warp, cruise, dt);
      while (ship.crystalAcc >= 1 && ship.crystals > 0) {
        ship.crystalAcc -= 1;
        ship.crystals -= 1;
      }
      ship.energy = Math.max(0, ship.energy - (ship.warp - cruise) * 6 * dt);
      if (ship.crystals <= 0) ship.warp = Math.min(ship.warp, cruise);
      const bite = hullTear(ship.warp, tear, dt);
      if (bite > 0) {
        ship.hull -= bite;
        if (ship.isPlayer && this.t > this.warpNote) {
          this.warpNote = this.t + 3;
          this.say("Damage warp. The hull is coming apart.", "alert");
        }
        if (ship.hull <= 0) this.destroy(ship, null);
      }
    }
  }

  private refillAntimatter(ship: Ship, dt: number) {
    for (const spot of SPOTS) {
      if (spot.quad !== ship.quad) continue;
      const codeA = spot.code.split(/\s+/).includes("A");
      if (!codeA && spot.id !== ship.home) continue;
      if (this.dist(ship.x, ship.y, spot.x, spot.y, ship.z, spot.z) < Math.max(150, spot.r)) {
        ship.antimatter = Math.min(5000, ship.antimatter + 80 * dt);
        return;
      }
    }
  }

  private terrain(ship: Ship, dt: number) {
    if (!ship.alive || ship.docked) return;
    for (const spot of SPOTS) {
      if (spot.quad !== ship.quad) continue;
      const kind = terrainOf(spot.name);
      if (kind !== "asteroid" && kind !== "cygnus") continue;
      const d = this.dist(ship.x, ship.y, spot.x, spot.y, ship.z, spot.z);
      if (kind === "asteroid" && d < spot.r && Math.abs(ship.warp) > 8) {
        const hit = 10 * dt;
        if (ship.shield > 0) ship.shield = Math.max(0, ship.shield - hit);
        else ship.hull -= hit;
        if (ship.isPlayer && this.t > this.edgeNote) {
          this.edgeNote = this.t + 3;
          this.say("Asteroids. Warp 8 or less, or they eat the shields.", "alert");
        }
        if (ship.hull <= 0) {
          this.destroy(ship, null);
          return;
        }
      }
      if (kind === "cygnus") {
        const pullR = rawToWorld("cygnus", spot.r, 10000);
        const core = rawToWorld("cygnus", spot.r, 500);
        if (d < core && ship.holeCd <= 0) this.dumpFromCygnus(ship);
        else if (d < pullR && d > 1) {
          const pull = (1 - d / pullR) ** 2 * 520 * dt;
          ship.x += ((spot.x - ship.x) / d) * pull;
          ship.y += ((spot.y - ship.y) / d) * pull;
          ship.z += ((spot.z - ship.z) / d) * pull;
        }
      }
    }
  }

  private dumpFromCygnus(ship: Ship) {
    const order: Quad[] = ["A", "B", "G", "O"];
    const quad = order[Math.floor(Math.random() * order.length)] ?? "A";
    const zone = zoneOf(quad);
    ship.quad = quad;
    ship.x = zone.minX + Math.random() * (zone.maxX - zone.minX);
    ship.y = zone.minY + Math.random() * (zone.maxY - zone.minY);
    ship.z = 4200 + Math.random() * 900;
    ship.holeCd = 6;
    ship.warp = Math.min(Math.abs(ship.warp), 4);
    if (ship.isPlayer) this.say(`Cygnus has you. ${QUAD_NAME[quad]} quadrant, and not where you were.`, "amber");
  }

  /** Leaving mid-fight. Under 1,000 gold the ship is lost. Otherwise a third of the gold goes. */
  breaksave() {
    const p = this.player;
    if (this.broke || p.docked || this.over) return;
    if (this.t - this.lastCombat > 30) return;
    this.broke = true;
    const gold = p.banked + this.goldAboard(p);
    const take = breaksaveTake(gold);
    p.breaks += 1;
    if (take.destroy) {
      this.say("Breaksave under 1,000 gold. The ship is lost.", "alert");
      this.destroy(p, null);
      this.onBank?.(p);
      return;
    }
    this.clearAboard(p);
    p.banked = take.kept;
    if (take.dropped > 0) this.picks.push({ x: p.x, y: p.y, z: p.z, gold: take.dropped, life: 90 });
    this.say(`Breaksave ${p.breaks}. Vault cut to ${take.kept}. ${take.dropped} left in space.`, "alert");
    this.onBank?.(p);
  }

  runMacro(macro: string) {
    for (const ch of macro) {
      const p = this.player;
      if (ch === "w") this.nudgeWarp(1);
      else if (ch === "s") this.nudgeWarp(-1);
      else if (ch === "f" || ch === " ") this.firePhaser(p);
      else if (ch === "t") this.fireTorp(p);
      else if (ch === "g") this.fireDrone(p);
      else if (ch === "m") this.dropMine(p);
      else if (ch === "r") this.toggleRaise();
      else if (ch === "c") this.toggleRepair();
      else if (ch === "z") this.toggleCloak();
      else if (ch === "i") this.toggleIntercept();
      else if (ch === "x") this.transwarp();
      else if (ch === ".") this.requestDock();
      else if (ch === "u") this.requestUndock();
      else if (ch === "b") this.goToBase();
      else if (ch === "5") this.toggleAutoLock();
      else if (ch === "7") this.toggleAiPilot();
    }
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
        dist: this.dist(p.x, p.y, lock.x, lock.y, p.z, lock.z),
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
        dist: seen && s.alive && same ? this.dist(p.x, p.y, s.x, s.y, p.z, s.z) : null,
        alive: s.alive,
        docked: s.docked,
        isPlayer: s.isPlayer,
        gold: Math.floor(s.banked + (s.alive ? this.goldAboard(s) : 0)),
        seen,
      };
    });
    const base = this.nearestBase(p);
    const bd = this.dist(p.x, p.y, base.x, base.y, p.z, base.z);
    let nearPlanet: string | null = null;
    for (const planet of PLANETS) {
      if (planet.quad !== p.quad) continue;
      if (this.dist(p.x, p.y, planet.x, planet.y, p.z, planet.z) < 150) nearPlanet = planet.name;
    }
    let hint = "Click a contact or empty space.";
    if (this.over) hint = "Ship lost.";
    else if (p.docked) hint = `Docked at ${p.dockName}. Undock to fly.`;
    else if (bd < 110 && p.warp <= 1.4) hint = `${base.name} in range. Press . to dock and bank.`;
    else if (bd < 110) hint = "Kill warp under 1.4 to dock.";
    else if (p.hull / p.cls.hull < 0.28) hint = "Hull critical. Run for a starbase.";
    else if (this.nebulaAt(p)) hint = "Nebula. Shields do nothing here, and the scan is short.";
    else if (p.cloaked && this.cloakDead(p)) hint = "The cloak is drawing power and hiding nothing.";
    else if (p.warp > p.cls.maxWarp) hint = "Overwarp. Crystals and fuel are burning.";
    else if (!p.raiseLatch && p.shield < 40) hint = "Shields low. Hold R or latch raise.";
    else if (nearPlanet) hint = `Orbiting ${nearPlanet}. Dilithium is feeding the core.`;
    return {
      phase: this.over ? "dead" : "play",
      t: this.t,
      warp: p.warp,
      maxWarp: p.cls.maxWarp,
      damageWarp: this.tearOf(p),
      heading: headingOf(p.yaw),
      z: p.z,
      energy: p.energy,
      energyMax: Math.min(p.cls.energy, Math.max(0, p.antimatter)),
      antimatter: p.antimatter,
      breaks: p.breaks,
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
      quad: QUAD_NAME[p.quad],
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
