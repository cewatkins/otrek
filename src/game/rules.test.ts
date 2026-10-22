import assert from "node:assert/strict";
import test from "node:test";
import {
  antimatterUsed,
  breaksaveTake,
  countsAsFight,
  crystalBurn,
  effectRaw,
  garble,
  hullTear,
  nebulaScan,
  pulsarCloaking,
  rangeUnits,
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

test("nebula scan uses ship scale, and a ship inside is harder to see", () => {
  assert.equal(rangeUnits(1000), 480);
  assert.equal(nebulaScan(4800), 480);
  assert.equal(seenRange(4800, false, true), 1600);
  assert.equal(seenRange(4800, true, false), 480);
  assert.equal(rangeUnits(10000), 4800);
  assert.equal(rangeUnits(500), 240);
});

test("quasar and pulsar fields use ship scale, not the chart sprite", () => {
  assert.equal(rangeUnits(1000), 480);
  assert.equal(rangeUnits(1500), 720);
  assert.equal(rangeUnits(2000), 960);
  const quasar = effectRaw("Quasar 3C 273", "quasar");
  const pulsar = effectRaw("Vela Pulsar", "pulsar");
  assert.ok(quasar === 1000 || quasar === 1500);
  assert.ok(pulsar === 1000 || pulsar === 2000);
  assert.equal(effectRaw("Quasar 3C 273", "quasar"), quasar);
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

test("antimatter at warp 16 with shields is half a unit a second", () => {
  assert.equal(antimatterUsed(0, false, false, 1), 0);
  assert.equal(antimatterUsed(16, true, false, 1), 0.5);
  assert.equal(hullTear(14, 17, 1), 0);
  assert.ok(hullTear(17, 17, 1) > 0);
});

test("breaksave and pointshipping", () => {
  const poor = breaksaveTake(400);
  assert.equal(poor.destroy, true);
  assert.equal(poor.kept, 0);
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
