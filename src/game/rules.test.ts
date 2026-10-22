import assert from "node:assert/strict";
import test from "node:test";
import {
  antimatterUsed,
  breaksaveTake,
  countsAsFight,
  crystalBurn,
  garble,
  hullTear,
  nebulaScan,
  pulsarCloaking,
  rawToWorld,
  seenRange,
  terrainOf,
} from "./rules.ts";

test("terrain names", () => {
  assert.equal(terrainOf("Mutara Nebula"), "nebula");
  assert.equal(terrainOf("Tholean Space"), "nebula");
  assert.equal(terrainOf("Asteroid Field"), "asteroid");
  assert.equal(terrainOf("Quasar 3C 273"), "quasar");
  assert.equal(terrainOf("Vela Pulsar"), "pulsar");
  assert.equal(terrainOf("Cygnus X-1"), "cygnus");
  assert.equal(terrainOf("Earth"), null);
});

test("nebula scan is the scaled 1000, and a ship inside is harder to see", () => {
  const scan = nebulaScan(450, 4800);
  assert.ok(scan < 200);
  assert.ok(scan > 50);
  const seen = seenRange(4800, false, true, 450);
  assert.equal(seen, 1600);
  const inside = seenRange(4800, true, false, 450);
  assert.ok(inside < 200);
});

test("quasar radius scales with the chart", () => {
  const r = rawToWorld("quasar", 90, 1000);
  assert.ok(Math.abs(r - 100) < 1);
});

test("pulsar cloak damping turns on and off", () => {
  const a = pulsarCloaking("Rama Pulsar", 0);
  const b = pulsarCloaking("Rama Pulsar", 13);
  assert.notEqual(a, b);
});

test("crystal burn is four per second per warp over cruise", () => {
  assert.equal(crystalBurn(17, 13, 1), 16);
  assert.equal(crystalBurn(13, 13, 1), 0);
});

test("antimatter drains only past impulse, and hull tears at damage warp", () => {
  assert.equal(antimatterUsed(0, false, false, 1), 0);
  assert.ok(antimatterUsed(16, true, false, 1) > 0);
  assert.equal(hullTear(14, 17, 1), 0);
  assert.ok(hullTear(17, 17, 1) > 0);
});

test("breaksave and pointshipping", () => {
  assert.equal(breaksaveTake(400).destroy, true);
  const rich = breaksaveTake(3000);
  assert.equal(rich.destroy, false);
  assert.ok(rich.kept < 3000);
  assert.ok(rich.dropped > 0);
  assert.equal(countsAsFight(true, false), false);
  assert.equal(countsAsFight(true, true), true);
  assert.equal(countsAsFight(false, false), true);
});

test("garble keeps the words readable", () => {
  const g = garble("hello there", "#");
  assert.equal(g.length, "hello there".length);
  assert.ok(g.includes(" ") || g.includes("#"));
});
