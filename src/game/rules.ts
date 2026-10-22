/** mtrek terrain and fuel rules, in the scaled chart. Pure, so the sim can be tested without a browser. */

export type Terrain = "nebula" | "asteroid" | "quasar" | "pulsar" | "cygnus";

/** Visual radius on the chart was raw size times the quadrant scale. Recover a raw distance the same way. */
const VISUAL_RAW: Record<Terrain, number> = {
  nebula: 4500,
  asteroid: 5000,
  quasar: 900,
  pulsar: 900,
  cygnus: 900,
};

export function terrainOf(name: string): Terrain | null {
  const n = name.toLowerCase();
  if (n.includes("cygnus x-")) return "cygnus";
  if (n.includes("pulsar")) return "pulsar";
  if (n.includes("quasar")) return "quasar";
  if (n.includes("asteroid")) return "asteroid";
  if (n.includes("nebula") || n.includes("tholian") || n.includes("tholean")) return "nebula";
  return null;
}

/** World units for an original raw radius, using this body's own chart scale. */
export function rawToWorld(terrain: Terrain, visualR: number, raw: number) {
  const scale = visualR / VISUAL_RAW[terrain];
  return raw * scale;
}

export function pulsarCloaking(name: string, t: number) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 33 + name.charCodeAt(i)) >>> 0;
  return (t + (h % 17)) % 24 < 12;
}

/** Scan inside a nebula is 1000 raw units. Visibility of a ship in a nebula is a third of normal. */
export function nebulaScan(visualR: number, normalScan: number) {
  return Math.min(normalScan, rawToWorld("nebula", visualR, 1000));
}

export function seenRange(normalScan: number, observerInNebula: boolean, targetInNebula: boolean, nebulaR: number) {
  let scan = normalScan;
  if (observerInNebula) scan = nebulaScan(nebulaR, normalScan);
  if (targetInNebula) scan = Math.min(scan, normalScan / 3);
  return scan;
}

/** 1 crystal per quarter-second for each warp over cruising maximum. */
export function crystalBurn(warp: number, cruise: number, dt: number) {
  if (warp <= cruise) return 0;
  return (warp - cruise) * 4 * dt;
}

/**
 * Antimatter is fuel. Warp-energy spent per tick piles up; every 400 becomes one unit.
 * Impulse (the free part) is 40. Four ticks a second, matching the mtrek note.
 */
export function antimatterUsed(warp: number, shieldsUp: boolean, cloaked: boolean, dt: number) {
  const perTick = Math.max(0, Math.abs(warp) * 5 + (shieldsUp ? 10 : 0) + (cloaked ? 15 : 0) - 40);
  return (perTick * 4 * dt) / 400;
}

/** Hull tear once you are on the damage-warp number. Overwarp below that only burns crystals and fuel. */
export function hullTear(warp: number, damageWarp: number, dt: number) {
  if (warp < damageWarp - 0.05) return 0;
  return (8 + (warp - damageWarp) * 10) * dt;
}

export function garble(text: string, mark: "#" | "@") {
  let out = "";
  let h = 17;
  for (const ch of text) {
    h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    out += ch === " " || h % 7 !== 0 ? ch : mark;
  }
  return out;
}

/**
 * Breaksave penalty. Under 1000 gold the ship is lost.
 * Otherwise about a third of the gold is taken, and a tenth is left on the field.
 */
export function breaksaveTake(gold: number) {
  if (gold < 1000) return { destroy: true, kept: 0, dropped: Math.max(0, Math.floor(gold)) };
  const dropped = Math.floor(gold * 0.1);
  const kept = Math.max(0, Math.floor(gold - gold / 3));
  return { destroy: false, kept, dropped };
}

/** Gold for shooting a human who never shoots back is pointshipping. Bots always count. */
export function countsAsFight(targetIsHuman: boolean, targetShotBack: boolean) {
  return !targetIsHuman || targetShotBack;
}
