/** mtrek terrain and fuel rules. Effect distances use the same scale as ship scan, not the chart sprite. */

export type Terrain = "nebula" | "asteroid" | "quasar" | "pulsar" | "cygnus";

/**
 * Excelsior scan is 10,000 on the sheet and 4,800 in this chart.
 * Nebula scan, quasar and pulsar fields, and the Cygnus pull use this factor.
 */
export const RANGE_SCALE = 4800 / 10000;

/** World units for a raw mtrek distance, matching ship weapon and scan scale. */
export function rangeUnits(raw: number) {
  return raw * RANGE_SCALE;
}

function nameHash(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 33 + name.charCodeAt(i)) >>> 0;
  return h;
}

export function terrainOf(name: string): Terrain | null {
  const n = name.toLowerCase();
  if (n.includes("cygnus x-")) return "cygnus";
  if (n.includes("pulsar")) return "pulsar";
  if (n.includes("quasar")) return "quasar";
  if (n.includes("asteroid")) return "asteroid";
  if (n.includes("nebula") || n.includes("tholian") || n.includes("tholean")) return "nebula";
  return null;
}

/** Quasars damp a cloak out to 1,000 or 1,500 raw. Pulsars 1,000 or 2,000. The name picks which. */
export function effectRaw(name: string, terrain: "quasar" | "pulsar") {
  const h = nameHash(name);
  if (terrain === "quasar") return h % 2 === 0 ? 1000 : 1500;
  return h % 2 === 0 ? 1000 : 2000;
}

export function pulsarCloaking(name: string, t: number) {
  return (t + (nameHash(name) % 17)) % 24 < 12;
}

/** Scan inside a nebula is 1,000 raw units: 480 at ship scale, inside an Excelsior's torpedo reach. */
export function nebulaScan(normalScan: number) {
  return Math.min(normalScan, rangeUnits(1000));
}

export function seenRange(normalScan: number, observerInNebula: boolean, targetInNebula: boolean) {
  let scan = normalScan;
  if (observerInNebula) scan = nebulaScan(normalScan);
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
 * Warp 16 with shields spends 0.5 a second, so a 5,000 tank lasts about 2.7 hours.
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
 * Breaksave penalty. Under 1000 gold the ship is lost and the bank goes with it.
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