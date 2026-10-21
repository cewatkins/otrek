import { o as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bu67ERgy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ctx = null;
function unlockAudio() {
	if (typeof window === "undefined") return;
	if (!ctx) ctx = new AudioContext();
	if (ctx.state === "suspended") ctx.resume();
}
function tone(freq, dur, type, gain, slide = 0) {
	if (!ctx || ctx.state !== "running") return;
	const t = ctx.currentTime;
	const osc = ctx.createOscillator();
	const amp = ctx.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(freq, t);
	if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
	amp.gain.setValueAtTime(gain, t);
	amp.gain.exponentialRampToValueAtTime(1e-4, t + dur);
	osc.connect(amp);
	amp.connect(ctx.destination);
	osc.start(t);
	osc.stop(t + dur + .02);
}
function burst(freq, q, dur, gain) {
	if (!ctx || ctx.state !== "running") return;
	const t = ctx.currentTime;
	const frames = Math.max(1, Math.floor(ctx.sampleRate * dur));
	const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
	const src = ctx.createBufferSource();
	src.buffer = buffer;
	const filter = ctx.createBiquadFilter();
	filter.type = "bandpass";
	filter.frequency.setValueAtTime(freq, t);
	filter.Q.value = q;
	const amp = ctx.createGain();
	amp.gain.setValueAtTime(gain, t);
	amp.gain.exponentialRampToValueAtTime(1e-4, t + dur);
	src.connect(filter);
	filter.connect(amp);
	amp.connect(ctx.destination);
	src.start(t);
	src.stop(t + dur + .02);
}
var sfx = {
	phaser() {
		tone(980, .16, "sawtooth", .045, -720);
		tone(1480, .11, "square", .018, -1100);
		burst(2200, 4, .1, .05);
	},
	torp() {
		tone(160, .32, "sine", .07, -90);
		tone(70, .38, "triangle", .05, -30);
		burst(420, 1.2, .22, .06);
	},
	hit() {
		tone(140, .08, "triangle", .03);
	},
	explode() {
		tone(70, .4, "sawtooth", .05, -40);
	},
	dock() {
		tone(330, .12, "sine", .03);
		tone(440, .16, "sine", .02);
	},
	gold() {
		tone(520, .1, "sine", .025);
	},
	warn() {
		tone(180, .2, "square", .02);
	}
};
var CLASSES = [
	{
		id: "EXCEL",
		name: "Excelsior",
		code: "EXCEL",
		race: "Federation",
		home: "SB1",
		blurb: "Heavy cruiser. Photon tubes that hit harder at long range, thick shields, and a tracking transwarp spike.",
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
		torpHoming: .7,
		magazine: 18,
		torpCd: .8,
		cloak: false,
		scan: 4800,
		transwarp: true,
		drones: 4,
		droneDmg: 80,
		mines: 5,
		mineDmg: 170,
		crystals: 30
	},
	{
		id: "LARSON",
		name: "Larson",
		code: "LARSON",
		race: "Federation",
		home: "SB1",
		blurb: "The 1993 destroyer. Photons, eight drones, and a mine belt. No cloak. The tubes are the ship. Do not miss.",
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
		torpSpeed: 1e3,
		torpHoming: .55,
		magazine: 16,
		torpCd: .72,
		cloak: false,
		scan: 4600,
		transwarp: false,
		drones: 8,
		droneDmg: 100,
		mines: 8,
		mineDmg: 180,
		crystals: 40
	},
	{
		id: "RBOP",
		name: "Bird-of-Prey",
		code: "RBOP",
		race: "Romulan",
		home: "SB3",
		blurb: "Cloak, one plasma tube, and the legs to leave the wreck behind. Fragile if you get caught decloaked.",
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
		crystals: 30
	},
	{
		id: "KEV12",
		name: "KEV-12",
		code: "KEV-12",
		race: "Klingon",
		home: "SB2",
		blurb: "Obliterators hit the same at any range and grow back, one every two seconds. She cloaks, she carries fifteen drones, and she turns like a moon.",
		cruise: 8,
		maxWarp: 10,
		turn: .95,
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
		torpHoming: .25,
		magazine: 26,
		torpCd: .38,
		cloak: true,
		scan: 4300,
		transwarp: false,
		drones: 15,
		droneDmg: 120,
		regenTorp: true,
		crystals: 30
	},
	{
		id: "WARBIRD",
		name: "Warbird",
		code: "WARBIRD",
		race: "Romulan",
		home: "SB3",
		blurb: "Agonizers ignore range and spend a torpedo to fire. Plasma hits harder the farther it flies. Cloak and a mine belt if the range fight goes sour.",
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
		crystals: 30
	},
	{
		id: "CDA180",
		name: "Galor",
		code: "CDA-180",
		race: "Cardassian",
		home: "SB4",
		blurb: "Expanding-sphere phasers scorch every ship in range at once. Crowds make you weaker. Duels make you cruel.",
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
		torpHoming: .45,
		magazine: 14,
		torpCd: .9,
		cloak: false,
		scan: 4200,
		transwarp: false,
		drones: 10,
		droneDmg: 130,
		droneVar: true,
		crystals: 40
	},
	{
		id: "BR5",
		name: "Brigand",
		code: "BR-5",
		race: "Orion",
		home: "SB4",
		blurb: "Turns like a thief and cloaks like a rumor. Falls apart if a cruiser gets a clean, close phaser lock.",
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
		torpHoming: .9,
		magazine: 10,
		torpCd: .65,
		cloak: true,
		scan: 3600,
		transwarp: false,
		drones: 6,
		droneDmg: 80,
		crystals: 40
	},
	{
		id: "DY600",
		name: "Freighter",
		code: "DY-600",
		race: "Federation",
		home: "SB1",
		blurb: "The JavaTrek freighter. Weak phasers that teleport you clear of the target, a thick shield belt, a hold full of drones, and a transwarp spike that does not track.",
		cruise: 8,
		maxWarp: 11,
		turn: .82,
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
		torpMax: 1e3,
		torpSpeed: 860,
		torpHoming: .2,
		magazine: 8,
		torpCd: 1.35,
		cloak: false,
		scan: 5200,
		transwarp: true,
		drones: 12,
		droneDmg: 80,
		teleport: true
	},
	{
		id: "IIA",
		name: "Constitution II-A",
		code: "II-A",
		race: "Federation",
		home: "SB1",
		blurb: "The fast Constitution. Long photons, a mine belt, and a hold of eighty dilithium crystals. The warp core is small. Do not live at damage warp.",
		cruise: 11,
		maxWarp: 14,
		turn: 1.05,
		hull: 520,
		shieldStr: 7.2,
		energy: 90,
		phaser: 70,
		phaserRange: 700,
		esi: false,
		torpKind: "photon",
		torpName: "Photon",
		torpDmg: 110,
		torpMin: 220,
		torpMax: 1750,
		torpSpeed: 1040,
		torpHoming: .6,
		magazine: 14,
		torpCd: .85,
		cloak: false,
		scan: 5e3,
		transwarp: false,
		drones: 8,
		droneDmg: 80,
		mines: 6,
		mineDmg: 170,
		crystals: 80
	},
	{
		id: "KPB13",
		name: "K'vort",
		code: "KPB-13",
		race: "Klingon",
		home: "SB2",
		blurb: "Battlecruiser. Obliterators grow back, twenty drone racks in the sheet, and no cloak. She wins by staying in the fight.",
		cruise: 10,
		maxWarp: 13,
		turn: 1.05,
		hull: 580,
		shieldStr: 7,
		energy: 160,
		phaser: 70,
		phaserRange: 700,
		esi: false,
		torpKind: "obliterator",
		torpName: "Obliterator",
		torpDmg: 70,
		torpMin: 40,
		torpMax: 1100,
		torpSpeed: 1180,
		torpHoming: .25,
		magazine: 18,
		torpCd: .45,
		cloak: false,
		scan: 4e3,
		transwarp: false,
		drones: 12,
		droneDmg: 90,
		regenTorp: true,
		crystals: 40
	},
	{
		id: "CV97",
		name: "Gorn Destroyer",
		code: "CV-97",
		race: "Gorn",
		home: "SB4",
		blurb: "Slow, thick, and cloaked. One plasma tube and a rack of heavy drones. The Gorn does not chase. She arrives.",
		cruise: 9,
		maxWarp: 11,
		turn: .9,
		hull: 620,
		shieldStr: 7.4,
		energy: 180,
		phaser: 90,
		phaserRange: 600,
		esi: false,
		torpKind: "plasma",
		torpName: "Plasma",
		torpDmg: 220,
		torpMin: 200,
		torpMax: 1600,
		torpSpeed: 700,
		torpHoming: 2.2,
		magazine: 8,
		torpCd: 1.6,
		cloak: true,
		scan: 4200,
		transwarp: false,
		drones: 10,
		droneDmg: 100,
		crystals: 40
	},
	{
		id: "CDA120",
		name: "Hideki",
		code: "CDA-120",
		race: "Cardassian",
		home: "SB4",
		blurb: "Light escort. Expanding-sphere phasers and variable-speed drones. Fast enough to leave the Galor behind, not tough enough to stay.",
		cruise: 12,
		maxWarp: 14,
		turn: 1.4,
		hull: 420,
		shieldStr: 6,
		energy: 140,
		phaser: 80,
		phaserRange: 500,
		esi: true,
		torpKind: "photon",
		torpName: "Photon",
		torpDmg: 100,
		torpMin: 180,
		torpMax: 1300,
		torpSpeed: 980,
		torpHoming: .45,
		magazine: 12,
		torpCd: .85,
		cloak: false,
		scan: 3800,
		transwarp: false,
		drones: 8,
		droneDmg: 140,
		droneVar: true,
		crystals: 30
	}
];
/** Constructor numbers from rumour/jtrek Ship*.java. Parenthetical warp energy is the mtrek.com class table. */
var SHEETS = {
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
		scan: 1e4,
		phasers: "PH 65 · 0–600",
		torpedoes: "Photon · 6 tubes · 54 · 500–1200",
		drones: "4 × 400",
		mines: "5 × 900",
		crew: 750,
		home: "Earth"
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
		scan: 11e3,
		phasers: "PH 40 · 0–600",
		torpedoes: "Photon · 4 tubes · 48 · 600–1400",
		drones: "8 × 500",
		mines: "8 × 900",
		crew: 220,
		home: "Earth"
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
		scan: 8e3,
		phasers: "PH 25 · 0–500",
		torpedoes: "Plasma · 1 tube · 15 · 500–2000",
		drones: "—",
		mines: "6 × 900",
		crew: 12,
		home: "Romulus"
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
		scan: 13e3,
		phasers: "PH 60 · 0–1000",
		torpedoes: "Obliterator · 8 tubes · 60 · regen · 500–1200",
		drones: "15 × 600",
		mines: "—",
		crew: 150,
		home: "Klinzhai"
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
		scan: 8e3,
		phasers: "AG 40 · 0–500",
		torpedoes: "Var. plasma · 1 tube · 35 · 500–2000",
		drones: "—",
		mines: "6 × 900",
		crew: 43,
		home: "Romulus"
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
		scan: 11e3,
		phasers: "ESI 60 · 0–500",
		torpedoes: "Photon · 5 tubes · 70 · 500–1300",
		drones: "20 × 800 · variable",
		mines: "—",
		crew: 523,
		home: "Cardassia"
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
		home: "Orion"
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
		scan: 8e3,
		phasers: "PH 20 · 0–500 · teleporter",
		torpedoes: "Torpedo · 1 tube · 200 · 500–1000",
		drones: "30 × 400",
		mines: "—",
		crew: 85,
		home: "Earth"
	},
	IIA: {
		turn: 9,
		cruise: 14,
		damageWarp: 18,
		warpEnergy: "50",
		impulse: 40,
		transwarp: "—",
		warpCost: 2,
		damagePct: 45,
		shield: 17,
		visibility: 100,
		cloak: "—",
		scan: 13e3,
		phasers: "PH 50 · 0–700",
		torpedoes: "Photon · 4 tubes · 40 · 500–1800",
		drones: "10 × 400",
		mines: "8 × 900",
		crew: 432,
		home: "Earth"
	},
	KPB13: {
		turn: 10,
		cruise: 13,
		damageWarp: 17,
		warpEnergy: "120 (150)",
		impulse: 60,
		transwarp: "—",
		warpCost: 2,
		damagePct: 50,
		shield: 16,
		visibility: 100,
		cloak: "—",
		scan: 8e3,
		phasers: "PH 35 · 0–800",
		torpedoes: "Obliterator · 5 tubes · 50 · regen · 300–1200",
		drones: "20 × 400",
		mines: "—",
		crew: 150,
		home: "Klinzhai"
	},
	CV97: {
		turn: 9,
		cruise: 11,
		damageWarp: 13,
		warpEnergy: "130 (160)",
		impulse: 80,
		transwarp: "—",
		warpCost: 3,
		damagePct: 40,
		shield: 17,
		visibility: 100,
		cloak: "40s · pwr 80 · rgn 2",
		scan: 1e4,
		phasers: "PH 75 · 0–600",
		torpedoes: "Plasma · 1 tube · 50 · 300–1200",
		drones: "20 × 500",
		mines: "—",
		crew: 235,
		home: "Gorn"
	},
	CDA120: {
		turn: 12,
		cruise: 14,
		damageWarp: 16,
		warpEnergy: "100 (140)",
		impulse: 50,
		transwarp: "—",
		warpCost: 1,
		damagePct: 55,
		shield: 16,
		visibility: 90,
		cloak: "—",
		scan: 8e3,
		phasers: "ESI 40 · 0–500",
		torpedoes: "Photon · 4 tubes · 40 · 500–1300",
		drones: "15 × 800 · variable",
		mines: "—",
		crew: 74,
		home: "Cardassia"
	}
};
function classById(id) {
	return CLASSES.find((c) => c.id === id) ?? CLASSES[0];
}
var WORLD = 9e3;
var WARP_SPEED = 78;
var WARP_ACCEL = 2.5;
var BASES = [
	{
		id: "SB1",
		num: 1,
		name: "Terra Dock",
		race: "Federation",
		x: 1500,
		y: 1500
	},
	{
		id: "SB2",
		num: 2,
		name: "Qo'noS Yards",
		race: "Klingon",
		x: 7500,
		y: 1600
	},
	{
		id: "SB3",
		num: 3,
		name: "Romulus Gate",
		race: "Romulan",
		x: 1600,
		y: 7400
	},
	{
		id: "SB4",
		num: 4,
		name: "Orion Freeport",
		race: "Orion",
		x: 7400,
		y: 7300
	}
];
var PLANETS = [
	{
		name: "Vulcan",
		x: 2700,
		y: 2300
	},
	{
		name: "Rigel XII",
		x: 4700,
		y: 4500
	},
	{
		name: "Praxis",
		x: 6800,
		y: 2700
	}
];
var HOLES = [{
	x: 4500,
	y: 1500
}, {
	x: 4500,
	y: 7500
}];
var BOTS = [
	{
		name: "IKS Torg",
		classId: "KEV12",
		bias: .72,
		home: "SB2",
		skill: 5
	},
	{
		name: "IRW Vorel",
		classId: "RBOP",
		bias: .5,
		home: "SB3",
		skill: 4
	},
	{
		name: "OSS Slammer",
		classId: "BR5",
		bias: .45,
		home: "SB4",
		skill: 4
	},
	{
		name: "CDS Galor",
		classId: "CDA180",
		bias: .62,
		home: "SB4",
		skill: 3
	},
	{
		name: "USS Hood",
		classId: "EXCEL",
		bias: .34,
		home: "SB1",
		skill: 3
	},
	{
		name: "USS Farragut",
		classId: "LARSON",
		bias: .4,
		home: "SB1",
		skill: 3
	},
	{
		name: "USS Yorktown",
		classId: "IIA",
		bias: .36,
		home: "SB1",
		skill: 3
	},
	{
		name: "IKS Gr'oth",
		classId: "KPB13",
		bias: .7,
		home: "SB2",
		skill: 4
	}
];
function clamp(n, a, b) {
	return Math.max(a, Math.min(b, n));
}
function angDiff(from, to) {
	let d = to - from;
	while (d > Math.PI) d -= Math.PI * 2;
	while (d < -Math.PI) d += Math.PI * 2;
	return d;
}
function yawTo(x, y, tx, ty) {
	return Math.atan2(-(tx - x), -(ty - y));
}
function headingOf(yaw) {
	return (-yaw * 180 / Math.PI % 360 + 360) % 360;
}
function nose(yaw) {
	return {
		x: -Math.sin(yaw),
		y: -Math.cos(yaw)
	};
}
var seq = 1;
function makeShip(partial, t) {
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
		torpCd: .4,
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
		droneCd: .6,
		mines: cls.mines ?? 0,
		mineCd: 1.2,
		regenAcc: 0,
		skill: partial.skill ?? 3,
		banked: 0,
		kills: 0,
		conflicts: 0,
		conflictAt: /* @__PURE__ */ new Map(),
		respawn: 0,
		aiAcc: Math.random() * .4,
		aiState: "patrol",
		patrolX: partial.x,
		patrolY: partial.y,
		orbitSign: Math.random() < .5 ? -1 : 1,
		bias: partial.bias ?? 0,
		home: partial.home,
		traveled: 0,
		born: t,
		goalYaw: yaw,
		goalWarp: 0,
		missNote: 0,
		crystals: cls.crystals ?? 0,
		remote: false
	};
}
var TrekSim = class {
	ships = [];
	player;
	bolts = [];
	beams = [];
	picks = [];
	mines = [];
	particles = [];
	messages = [];
	stars = [];
	t = 0;
	over = false;
	killedBy = "";
	shake = 0;
	keys = /* @__PURE__ */ new Set();
	inputOverride = null;
	touchSteer = 0;
	touchWarp = 0;
	touchPhaser = false;
	touchTorp = false;
	touchDrone = false;
	touchMine = false;
	/** mtrek.com wormholes sit dark for about a minute, then open again. */
	holeOpen = true;
	holeLeft = 58;
	onBank = null;
	/** Fired when a local weapon tags a remote ship. Peer id, damage. */
	onStrike = null;
	edgeNote = 0;
	noTgt = 0;
	constructor(name, classId, opts) {
		const cls = classById(classId);
		const home = BASES.find((b) => b.id === cls.home) ?? BASES[0];
		this.player = makeShip({
			name: name.slice(0, 18) || "USS Intrepid",
			classId: cls.id,
			letter: "a",
			isPlayer: true,
			home: home.id,
			x: home.x + 460,
			y: home.y + 280
		}, 0);
		this.ships = [this.player];
		if (opts?.bots !== false) {
			const letters = [
				"b",
				"c",
				"d",
				"e",
				"f",
				"g",
				"h",
				"i"
			];
			BOTS.forEach((bot, i) => {
				const b = BASES.find((x) => x.id === bot.home) ?? BASES[0];
				const ang = i / BOTS.length * Math.PI * 2;
				this.ships.push(makeShip({
					name: bot.name,
					classId: bot.classId,
					letter: letters[i] ?? "z",
					isPlayer: false,
					home: bot.home,
					x: clamp(b.x + Math.cos(ang) * 520, 200, 8800),
					y: clamp(b.y + Math.sin(ang) * 520, 200, 8800),
					bias: bot.bias,
					skill: bot.skill
				}, 0));
			});
			for (const ship of this.ships) {
				if (ship.isPlayer) continue;
				const dx = ship.x - this.player.x;
				const dy = ship.y - this.player.y;
				const d = Math.hypot(dx, dy) || 1;
				if (d < 2e3) {
					ship.x = clamp(this.player.x + dx / d * 2e3, 280, 8720);
					ship.y = clamp(this.player.y + dy / d * 2e3, 280, 8720);
					ship.yaw = yawTo(ship.x, ship.y, WORLD / 2, WORLD / 2);
				}
			}
		}
		let s = 77;
		const rnd = () => {
			s = s * 16807 % 2147483647;
			return (s & 2147483647) / 2147483647;
		};
		for (let i = 0; i < 140; i++) this.stars.push({
			x: rnd() * WORLD,
			y: rnd() * WORLD,
			b: .25 + rnd() * .75
		});
		this.say("You have the conn. Raise shields, lock a target, bank gold before you die.", "amber");
		if (cls.agonizer) this.say("Agonizers ignore range. Each shot spends one torpedo.", "info");
		else if (cls.regenTorp) this.say("Obliterators regenerate. One returns every two seconds.", "info");
		else if (cls.teleport) this.say("Teleporter phasers shove you clear. Transwarp will not track.", "info");
		else if (cls.esi) this.say("Expanding-sphere phasers hit every ship in range. A crowd weakens the shot.", "info");
		else if ((cls.crystals ?? 0) >= 60) this.say("Dilithium soaks hits that punch the shields. Dock to refill the crystals.", "info");
		else this.say("W/S warp · A/D turn · click a ship to lock · Space phasers · T torpedoes · . dock", "info");
	}
	held() {
		return this.inputOverride ?? this.keys;
	}
	say(text, tone = "info") {
		this.messages = [{
			text,
			tone
		}, ...this.messages].slice(0, 8);
	}
	baseById(id) {
		return BASES.find((b) => b.id === id) ?? BASES[0];
	}
	dist(ax, ay, bx, by) {
		return Math.hypot(ax - bx, ay - by);
	}
	shipById(id) {
		if (!id) return null;
		return this.ships.find((s) => s.id === id) ?? null;
	}
	upsertRemote(peerId, pose) {
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
		const x = clamp(Number(pose.x) || 0, 80, 8920);
		const y = clamp(Number(pose.y) || 0, 80, 8920);
		if (!ship) {
			const letters = "bcdefghij";
			const used = new Set(this.ships.map((s) => s.letter));
			const letter = letters.split("").find((ch) => !used.has(ch)) ?? "z";
			ship = makeShip({
				name: String(pose.name ?? "Unknown").slice(0, 18),
				classId: String(pose.classId ?? "EXCEL"),
				letter,
				isPlayer: false,
				home: "SB1",
				x,
				y
			}, this.t);
			ship.id = id;
			ship.remote = true;
			this.ships.push(ship);
			this.say(`${ship.name} entered the quadrant.`, "amber");
		}
		ship.remote = true;
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
	dropRemotes(peerIds) {
		const keep = new Set(peerIds.map((id) => `net:${id}`));
		this.ships = this.ships.filter((s) => !s.remote || keep.has(s.id));
		if (this.player.lockId?.startsWith("net:") && !keep.has(this.player.lockId)) this.player.lockId = null;
	}
	applyIncoming(raw, byName) {
		if (!this.player.alive || this.over) return;
		const dmg = Math.max(0, Math.min(500, raw));
		const ghost = this.ships.find((s) => s.remote && s.name === byName) ?? null;
		this.applyDamage(this.player, dmg, ghost);
		this.say(`${byName} hits for ${Math.round(dmg)}.`, "alert");
	}
	visible(observer, target) {
		if (!target.alive) return false;
		const d = this.dist(observer.x, observer.y, target.x, target.y);
		if (d > observer.cls.scan) return false;
		if (target.cloaked && !target.docked && d > 320 && target !== observer) return false;
		return true;
	}
	lockShip(id) {
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
	setCourse(x, y) {
		if (this.over || this.player.docked) return;
		this.player.courseYaw = yawTo(this.player.x, this.player.y, x, y);
		this.player.intercept = false;
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
		this.player.shieldDrop = .7;
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
		this.say(`Undocking from ${this.player.dockName}.`, "info");
	}
	hail(text) {
		const msg = text.trim().slice(0, 80);
		if (!msg) return;
		this.say(`${this.player.name}: ${msg}`, "amber");
		const foe = this.ships.find((s) => s.alive && !s.isPlayer && !s.docked);
		if (!foe) return;
		const lines = [
			`${foe.name}: Save it for the debris field.`,
			`${foe.name}: Noted. I still intend to shoot you.`,
			`${foe.name}: Gold first. Speeches later.`,
			`${foe.name}: Your shields are a suggestion.`
		];
		this.say(lines[Math.floor(Math.random() * lines.length)] ?? lines[0], "info");
	}
	goldAboard(ship) {
		return Math.floor((ship.pendingDmg + ship.pendingBonus) / 10) + Math.floor(ship.cargo);
	}
	clearAboard(ship) {
		ship.pendingDmg = 0;
		ship.pendingBonus = 0;
		ship.cargo = 0;
	}
	doDock(ship, base) {
		const was = ship.docked;
		ship.docked = true;
		ship.dockName = base.name;
		ship.warp = 0;
		ship.cloaked = false;
		ship.intercept = false;
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
			this.say(gained > 0 ? `Docked at ${base.name}. Banked ${gained} gold${bonus > 0 ? ` (${bonus} veteran bonus)` : ""}.` : `Docked at ${base.name}. Magazines full. Nothing new to bank.`, "amber");
			sfx.dock();
			if (!was) this.onBank?.(ship);
		} else ship.dockTimer = 3.2;
	}
	nearestBase(ship) {
		let best = BASES[0];
		let bestD = Infinity;
		for (const b of BASES) {
			const d = this.dist(ship.x, ship.y, b.x, b.y);
			if (d < bestD) {
				bestD = d;
				best = b;
			}
		}
		return best;
	}
	nearestShip(ship, list) {
		let best = null;
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
	think(ship) {
		if (this.t < 8) {
			ship.aiState = "patrol";
			ship.lockId = null;
			ship.cloaked = false;
			if (this.dist(ship.x, ship.y, ship.patrolX, ship.patrolY) < 220) {
				ship.patrolX = 700 + Math.random() * 7600;
				ship.patrolY = 700 + Math.random() * 7600;
			}
			ship.goalYaw = yawTo(ship.x, ship.y, ship.patrolX, ship.patrolY);
			ship.goalWarp = ship.cls.cruise * .4;
			return;
		}
		const foes = this.ships.filter((o) => o !== ship && o.alive && !o.docked && this.visible(ship, o));
		if (ship.hull / ship.cls.hull < .26 || ship.energy < 24 || ship.magazine === 0 && ship.energy < 50) {
			const base = this.nearestBase(ship);
			const d = this.dist(ship.x, ship.y, base.x, base.y);
			ship.goalYaw = yawTo(ship.x, ship.y, base.x, base.y);
			ship.goalWarp = d > 180 ? Math.min(ship.cls.cruise, ship.cls.maxWarp) : 1;
			ship.aiState = d < 100 ? "docking" : "flee";
			ship.lockId = null;
			if (ship.cls.cloak && ship.hull / ship.cls.hull < .4) ship.cloaked = true;
			return;
		}
		let target = this.nearestShip(ship, foes);
		if (this.player.alive && !this.player.docked && this.visible(ship, this.player) && Math.random() < ship.bias) target = this.player;
		if (!target) {
			ship.aiState = "patrol";
			ship.lockId = null;
			ship.cloaked = false;
			if (this.dist(ship.x, ship.y, ship.patrolX, ship.patrolY) < 220) {
				ship.patrolX = 700 + Math.random() * 7600;
				ship.patrolY = 700 + Math.random() * 7600;
			}
			ship.goalYaw = yawTo(ship.x, ship.y, ship.patrolX, ship.patrolY);
			ship.goalWarp = ship.cls.cruise * .55;
			return;
		}
		ship.aiState = "hunt";
		ship.lockId = target.id;
		const d = this.dist(ship.x, ship.y, target.x, target.y);
		const optimal = ship.cls.phaserRange * .72;
		let offset = ship.orbitSign * .85;
		if (d > optimal * 1.45) offset *= .15;
		if (d < optimal * .5) offset = ship.orbitSign * 2.4;
		ship.goalYaw = yawTo(ship.x, ship.y, target.x, target.y) + offset;
		ship.goalYaw += (Math.random() - .5) * (5 - ship.skill) * .4;
		if (d > ship.cls.torpMax) ship.goalWarp = ship.cls.cruise;
		else if (d > optimal) ship.goalWarp = 4.5;
		else ship.goalWarp = 2.4;
		if (ship.cls.cloak && d < 700 && d > 360 && ship.hull / ship.cls.hull < .7 && Math.random() < .35) ship.cloaked = true;
		if (ship.cloaked && d < 420) ship.cloaked = false;
	}
	steerToward(ship, desired, dt) {
		const diff = angDiff(ship.yaw, desired);
		const step = this.turnRate(ship) * dt;
		if (Math.abs(diff) <= step) ship.yaw = desired;
		else ship.yaw += Math.sign(diff) * step;
	}
	turnRate(ship) {
		const k = clamp(ship.warp / ship.cls.maxWarp, 0, 1.3);
		return ship.cls.turn * (1 - .7 * Math.min(1, k)) + .18;
	}
	moveShip(ship, dt) {
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
		if (ship.x < 70 || ship.x > 8930 || ship.y < 70 || ship.y > 8930) {
			ship.x = clamp(ship.x, 70, 8930);
			ship.y = clamp(ship.y, 70, 8930);
			ship.yaw = yawTo(ship.x, ship.y, WORLD / 2, WORLD / 2);
			ship.courseYaw = null;
			ship.warp = Math.min(ship.warp, 2);
			if (ship.isPlayer && this.t > this.edgeNote) {
				this.edgeNote = this.t + 4;
				this.say("Nav hazard — quadrant edge. Coming about.", "alert");
			}
		}
	}
	easeWarp(ship, target, dt) {
		const goal = clamp(target, 0, ship.twLeft > 0 ? ship.cls.maxWarp + 4 : ship.cls.maxWarp);
		if (ship.energy < 8) {
			ship.warp = Math.max(0, ship.warp - WARP_ACCEL * dt);
			return;
		}
		const diff = goal - ship.warp;
		const step = WARP_ACCEL * dt;
		if (Math.abs(diff) <= step) ship.warp = goal;
		else ship.warp += Math.sign(diff) * step;
	}
	firePhaser(ship) {
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
				const fall = clamp(1 - this.dist(ship.x, ship.y, o.x, o.y) / range, 0, 1);
				const dmg = ship.cls.phaser / hits.length * (.4 + .6 * fall);
				this.applyDamage(o, dmg, ship);
				this.beams.push({
					x1: ship.x,
					y1: ship.y,
					x2: o.x,
					y2: o.y,
					life: .16,
					esi: true,
					byPlayer: ship.isPlayer
				});
			}
			if (ship.isPlayer || this.visible(this.player, ship)) sfx.phaser();
			return true;
		}
		const lock = this.shipById(ship.lockId);
		let victim = null;
		let wide = false;
		if (lock && lock.alive && !lock.docked && lock !== ship && this.dist(ship.x, ship.y, lock.x, lock.y) <= range && (!lock.cloaked || this.dist(ship.x, ship.y, lock.x, lock.y) < 300)) victim = lock;
		else {
			let best = Infinity;
			for (const o of foes) {
				const d = this.dist(ship.x, ship.y, o.x, o.y);
				if (d > range) continue;
				if (o.cloaked && d > 300) continue;
				const bearing = yawTo(ship.x, ship.y, o.x, o.y);
				if (Math.abs(angDiff(ship.yaw, bearing)) > .55) continue;
				if (d < best) {
					best = d;
					victim = o;
					wide = true;
				}
			}
		}
		if (!victim) return false;
		const fall = clamp(1 - this.dist(ship.x, ship.y, victim.x, victim.y) / range, 0, 1);
		let dmg = ship.cls.phaser * (.22 + .78 * fall);
		if (wide) dmg *= .55;
		if (ship.cls.agonizer) {
			if (ship.magazine <= 0) return false;
			dmg = ship.cls.phaser * (wide ? .7 : 1);
			ship.magazine -= 1;
		}
		ship.energy -= 15;
		ship.phaserCd = ship.cls.esi ? 1.7 : 1.12;
		this.applyDamage(victim, dmg, ship);
		if (ship.cls.teleport) {
			const dx = ship.x - victim.x;
			const dy = ship.y - victim.y;
			const len = Math.hypot(dx, dy) || 1;
			ship.x += dx / len * 240;
			ship.y += dy / len * 240;
			if (ship.isPlayer) this.say("Teleporter phaser. You are clear of the target.", "amber");
		}
		this.beams.push({
			x1: ship.x,
			y1: ship.y,
			x2: victim.x,
			y2: victim.y,
			life: .14,
			esi: false,
			byPlayer: ship.isPlayer
		});
		if (ship.isPlayer || victim.isPlayer) sfx.phaser();
		return true;
	}
	fireTorp(ship) {
		if (!ship.alive || ship.docked || ship.cloaked) return false;
		if (ship.torpCd > 0 || ship.magazine <= 0 || ship.energy < 6) return false;
		const lock = this.shipById(ship.lockId);
		let dirx;
		let diry;
		let lockId = null;
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
			life: ship.cls.torpMax / spd + .4,
			varPlasma: ship.cls.id === "WARBIRD"
		});
		if (ship.isPlayer) sfx.torp();
		return true;
	}
	dropMine(ship) {
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
			arm: .85
		});
		if (ship.isPlayer) this.say("Mine away. It arms in a second.", "amber");
		return true;
	}
	fireDrone(ship) {
		if (!ship.alive || ship.docked || ship.cloaked) return false;
		if ((ship.cls.drones ?? 0) <= 0 || ship.drones <= 0 || ship.droneCd > 0 || ship.energy < 8) return false;
		const lock = this.shipById(ship.lockId);
		let dirx;
		let diry;
		let lockId = null;
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
			drone: true
		});
		if (ship.isPlayer) sfx.torp();
		return true;
	}
	applyDamage(target, raw, attacker) {
		if (!target.alive || target.docked || raw <= 0) return;
		if (target.remote) {
			if (attacker && attacker.isPlayer) {
				attacker.dmgGiven += raw;
				attacker.pendingDmg += raw;
				if (target.banked > 400 || target.dmgGiven > 1200) attacker.pendingBonus += raw * .5;
			}
			target.hitFlash = .18;
			const peer = target.id.startsWith("net:") ? target.id.slice(4) : "";
			if (peer && attacker?.isPlayer) this.onStrike?.(peer, raw);
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
		target.hitFlash = .18;
		if (attacker && attacker !== target) {
			attacker.dmgGiven += raw;
			attacker.pendingDmg += raw;
			if (target.banked > 400 || target.dmgGiven > 1200) attacker.pendingBonus += raw * .5;
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
	destroy(ship, killer) {
		if (!ship.alive) return;
		ship.alive = false;
		ship.warp = 0;
		ship.cloaked = false;
		ship.docked = false;
		ship.hull = 0;
		this.burst(ship.x, ship.y, 22, true);
		const aboard = this.goldAboard(ship);
		const dropped = aboard <= 0 ? ship.dmgTaken > 100 ? 40 : 0 : Math.min(1e3, aboard) + Math.floor(Math.max(0, aboard - 1e3) * .1);
		if (dropped > 0) this.picks.push({
			x: ship.x,
			y: ship.y,
			gold: dropped,
			life: 90
		});
		this.clearAboard(ship);
		const by = killer && killer !== ship ? killer.name : "a hazard";
		this.say(`${ship.name} destroyed by ${by}.`, "alert");
		if (killer && killer !== ship && killer.alive) killer.kills += 1;
		sfx.explode();
		if (ship.isPlayer) {
			this.over = true;
			this.killedBy = by;
			this.say(dropped > 0 ? `${dropped} gold left on the field. Vault still holds ${Math.floor(ship.banked)}.` : `Vault still holds ${Math.floor(ship.banked)}.`, "alert");
		} else ship.respawn = this.t + 18;
	}
	burst(x, y, n, alert) {
		for (let i = 0; i < n; i++) {
			const a = Math.random() * Math.PI * 2;
			const s = 20 + Math.random() * 140;
			this.particles.push({
				x,
				y,
				vx: Math.cos(a) * s,
				vy: Math.sin(a) * s,
				life: .35 + Math.random() * .45,
				max: .8,
				alert,
				size: 1.2 + Math.random() * 1.8
			});
		}
	}
	step(dt) {
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
			const raising = ship.isPlayer ? (ship.raiseLatch || held.has("KeyR") && !shift) && ship.shieldDrop <= 0 : ship.shield < 100 && ship.energy > 20 && !ship.docked;
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
			let drain = ship.warp * .85;
			if (ship.cloaked) drain += 7;
			ship.energy = clamp(ship.energy + (3 - drain) * dt, 0, ship.cls.energy);
			if (ship.energy < 8) ship.cloaked = false;
			if (!ship.docked) {
				for (const planet of PLANETS) if (this.dist(ship.x, ship.y, planet.x, planet.y) < 150) ship.energy = Math.min(ship.cls.energy, ship.energy + 7 * dt);
			}
			if (ship.energy <= 0 && ship.twLeft <= 0) ship.warp = Math.max(0, ship.warp - WARP_ACCEL * dt);
			if (ship.docked && !ship.isPlayer) {
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
					this.say(`${ship.name} undocked, vault updated.`, "info");
				}
			}
		}
		const p = this.player;
		if (p.alive && !p.docked && !this.over) {
			let steer = 0;
			if (held.has("KeyA") || held.has("ArrowLeft")) steer += 1;
			if (held.has("KeyD") || held.has("ArrowRight")) steer -= 1;
			steer = clamp(steer + this.touchSteer, -1, 1);
			const warpUp = (held.has("KeyW") || held.has("ArrowUp")) && !shift || this.touchWarp > 0;
			const warpDn = held.has("KeyS") || held.has("ArrowDown") || held.has("KeyW") && shift || this.touchWarp < 0;
			if (p.twLeft > 0 && p.cls.teleport) {
				p.intercept = false;
				p.courseYaw = null;
				if (steer === 0) p.yaw += .55 * dt;
			}
			if (steer !== 0) {
				p.yaw += steer * this.turnRate(p) * dt;
				p.intercept = false;
				p.courseYaw = null;
			} else if (p.intercept && p.lockId) {
				const lock = this.shipById(p.lockId);
				if (lock && lock.alive && this.visible(p, lock)) {
					this.steerToward(p, yawTo(p.x, p.y, lock.x, lock.y), dt);
					const d = this.dist(p.x, p.y, lock.x, lock.y);
					const want = d > 900 ? p.cls.cruise : d > 280 ? 3.5 : .6;
					this.easeWarp(p, want, dt);
				} else p.intercept = false;
			} else if (p.courseYaw !== null) {
				this.steerToward(p, p.courseYaw, dt);
				if (Math.abs(angDiff(p.yaw, p.courseYaw)) < .04) p.courseYaw = null;
			}
			if (p.twLeft <= 0 && !p.intercept) {
				if (warpUp && p.energy >= 8) p.warp = Math.min(p.cls.maxWarp, p.warp + WARP_ACCEL * dt);
				if (warpDn) p.warp = Math.max(0, p.warp - WARP_ACCEL * dt);
			}
			if ((held.has("Space") || held.has("KeyF") || held.has("KeyP") || this.touchPhaser) && p.phaserCd <= 0) {
				if (p.cls.agonizer && p.magazine <= 0) {
					if (this.t > p.missNote) {
						p.missNote = this.t + 1.8;
						this.say("Agonizer needs a torpedo in the tube.", "alert");
					}
				} else if (!this.firePhaser(p) && this.t > this.noTgt) {
					this.noTgt = this.t + 1.6;
					this.say("No phaser solution. Lock a target or point the bow.", "info");
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
		for (const ship of this.ships) {
			if (!ship.alive || ship.isPlayer || ship.remote) continue;
			if (ship.docked) continue;
			ship.aiAcc -= dt;
			if (ship.aiAcc <= 0) {
				ship.aiAcc = .32;
				this.think(ship);
			}
			this.steerToward(ship, ship.goalYaw, dt);
			this.easeWarp(ship, ship.goalWarp, dt);
			if (ship.aiState === "hunt") {
				const tgt = this.shipById(ship.lockId);
				if (tgt && tgt.alive) {
					const d = this.dist(ship.x, ship.y, tgt.x, tgt.y);
					if (d < ship.cls.phaserRange * .96) this.firePhaser(ship);
					if (d > ship.cls.torpMin * .85 && d < ship.cls.torpMax * .95) this.fireTorp(ship);
					if (ship.drones > 0 && d > 200 && d < 1500) this.fireDrone(ship);
					if (ship.mines > 0 && d > 160 && d < 420) this.dropMine(ship);
				}
			}
			if (ship.aiState === "docking") {
				const base = this.nearestBase(ship);
				if (this.dist(ship.x, ship.y, base.x, base.y) < 96 && ship.warp < 1.6) this.doDock(ship, base);
			}
		}
		for (const ship of this.ships) this.moveShip(ship, dt);
		for (let i = this.mines.length - 1; i >= 0; i--) {
			const mine = this.mines[i];
			mine.life -= dt;
			mine.arm -= dt;
			let boom = mine.life <= 0;
			if (mine.arm <= 0 && !boom) for (const ship of this.ships) {
				if (!ship.alive || ship.docked) continue;
				if (this.dist(mine.x, mine.y, ship.x, ship.y) < 46) {
					this.applyDamage(ship, mine.dmg, this.shipById(mine.owner));
					this.burst(mine.x, mine.y, 10, true);
					if (ship.isPlayer) this.say("Mine.", "alert");
					boom = true;
					break;
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
			for (let i = 0; i < HOLES.length; i++) {
				const h = HOLES[i];
				if (this.dist(ship.x, ship.y, h.x, h.y) < 78) {
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
					const o = HOLES[1 - i];
					const n = nose(ship.yaw);
					ship.x = o.x + n.x * 160;
					ship.y = o.y + n.y * 160;
					ship.holeCd = 60;
					if (ship.isPlayer) this.say("Wormhole transit. A minute before this mouth will take you again.", "amber");
					break;
				}
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
				const tx = dx / len * spd;
				const ty = dy / len * spd;
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
			if (b.traveled >= b.min) for (const ship of this.ships) {
				if (!ship.alive || ship.docked || ship.id === b.owner) continue;
				if (ship.cloaked && this.dist(b.x, b.y, ship.x, ship.y) > 36) continue;
				if (this.dist(b.x, b.y, ship.x, ship.y) < 34) {
					const span = Math.max(1, b.max - b.min);
					const u = clamp((b.traveled - b.min) / span, 0, 1);
					const dmg = b.kind === "obliterator" ? b.dmg : b.dmg * (b.varPlasma ? .4 + .95 * u : .35 + .65 * u);
					const owner = this.shipById(b.owner);
					this.applyDamage(ship, dmg, owner);
					hit = true;
					break;
				}
			}
			if (hit || b.life <= 0 || b.traveled > b.max || b.x < -200 || b.y < -200 || b.x > 9200 || b.y > 9200) this.bolts.splice(i, 1);
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
		this.clearAboard(p);
		p.drones = p.cls.drones ?? 0;
		p.mines = p.cls.mines ?? 0;
		p.crystals = p.cls.crystals ?? 0;
		p.born = this.t;
		p.phaserCd = 0;
		p.torpCd = .3;
		this.over = false;
		this.killedBy = "";
		this.say("Relaunched. The vault kept what you banked. The rest is gone.", "amber");
	}
	snapshot() {
		const p = this.player;
		const lock = this.shipById(p.lockId);
		let target = null;
		if (lock && lock.alive && this.visible(p, lock)) target = {
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
			gold: Math.floor(lock.banked + this.goldAboard(lock))
		};
		else if (lock && !lock.alive) p.lockId = null;
		const roster = this.ships.map((s) => {
			const seen = s.isPlayer || s.alive && this.visible(p, s);
			return {
				id: s.id,
				letter: s.letter,
				name: s.name,
				code: s.cls.code,
				dist: seen && s.alive ? this.dist(p.x, p.y, s.x, s.y) : null,
				alive: s.alive,
				docked: s.docked,
				isPlayer: s.isPlayer,
				gold: Math.floor(s.banked + (s.alive ? this.goldAboard(s) : 0)),
				seen
			};
		});
		const base = this.nearestBase(p);
		const bd = this.dist(p.x, p.y, base.x, base.y);
		let nearPlanet = null;
		for (const planet of PLANETS) if (this.dist(p.x, p.y, planet.x, planet.y) < 150) nearPlanet = planet.name;
		let hint = "Click a contact or empty space.";
		if (this.over) hint = "Ship lost.";
		else if (p.docked) hint = `Docked at ${p.dockName}. Undock to fly.`;
		else if (bd < 110 && p.warp <= 1.4) hint = `${base.name} in range. Press . to dock and bank.`;
		else if (bd < 110) hint = "Kill warp under 1.4 to dock.";
		else if (p.hull / p.cls.hull < .28) hint = "Hull critical. Run for a starbase.";
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
			cloakOn: p.cloaked,
			canCloak: p.cls.cloak,
			repair: p.repair,
			shieldsUp: p.raiseLatch,
			intercept: p.intercept,
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
			shake: this.shake
		};
	}
};
var BG = "#000000";
var FG = "#e6eef6";
var MUTED = "#8b9bb0";
var AMBER = "#5eb6ff";
var ALERT = "#ff3358";
var LINE = "#163044";
var BLUE = "#3ec5ff";
var RED = "#ff2438";
var GOLD = "#e4c36a";
var SPRITE_SRC = {
	EXCEL: "/ships/excel.png",
	LARSON: "/ships/larson.png",
	IIA: "/ships/iia.png",
	RBOP: "/ships/rbop.png",
	WARBIRD: "/ships/warbird.png",
	KEV12: "/ships/kev12.png",
	KPB13: "/ships/kpb13.png",
	CDA180: "/ships/cda180.png",
	CDA120: "/ships/cda120.png",
	BR5: "/ships/br5.png",
	DY600: "/ships/dy600.png",
	CV97: "/ships/cv97.png"
};
var spriteCache = /* @__PURE__ */ new Map();
function shipSprite(kind) {
	if (typeof Image === "undefined") return null;
	const src = SPRITE_SRC[kind];
	if (!src) return null;
	let img = spriteCache.get(src);
	if (!img) {
		img = new Image();
		img.decoding = "async";
		img.src = src;
		spriteCache.set(src, img);
	}
	return img.complete && img.naturalWidth > 0 ? img : null;
}
/** Grey Starfleet, dark Klingon, green Romulan. The plates are original renders, not studio stills. */
function factionFilter(kind) {
	if (kind === "KEV12" || kind === "KPB13") return "brightness(0.55) saturate(0.65)";
	if (kind === "RBOP" || kind === "WARBIRD") return "hue-rotate(55deg) saturate(1.35) brightness(0.95)";
	if (kind === "EXCEL" || kind === "LARSON" || kind === "IIA" || kind === "DY600") return "saturate(0.2) brightness(1.18)";
	if (kind === "BR5") return "brightness(0.7) saturate(0.8)";
	return "none";
}
function radarSplit(h) {
	return Math.round(Math.min(Math.max(h * .36, 148), h * .44));
}
function cameraFor(sim, w, h) {
	const scale = Math.min(w, h) / 2400;
	return {
		x: sim.player.x,
		y: sim.player.y,
		scale,
		w,
		h
	};
}
function screenToWorld(cam, sx, sy) {
	return {
		x: (sx - cam.w / 2) / cam.scale + cam.x,
		y: (sy - cam.h / 2) / cam.scale + cam.y
	};
}
function toScreen(cam, x, y) {
	return {
		x: (x - cam.x) * cam.scale + cam.w / 2,
		y: (y - cam.y) * cam.scale + cam.h / 2
	};
}
function paintShip(ctx, kind, yaw, x, y, size, flash) {
	const img = shipSprite(kind);
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(-yaw);
	if (img) {
		const base = factionFilter(kind);
		const filter = flash ? `${base === "none" ? "" : base} brightness(2.4)`.trim() : base;
		if (filter && filter !== "none") ctx.filter = filter;
		ctx.drawImage(img, -size / 2, -size / 2, size, size);
		ctx.filter = "none";
	} else {
		ctx.strokeStyle = flash ? FG : AMBER;
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.moveTo(0, -size * .45);
		ctx.lineTo(size * .32, size * .4);
		ctx.lineTo(0, size * .18);
		ctx.lineTo(-size * .32, size * .4);
		ctx.closePath();
		ctx.stroke();
	}
	ctx.restore();
}
function drawTactical(ctx, sim, cam) {
	const { w, h } = cam;
	if (!cam.radarOnly) {
		const split = radarSplit(h);
		ctx.save();
		ctx.fillStyle = BG;
		ctx.fillRect(0, 0, w, h);
		ctx.save();
		ctx.beginPath();
		ctx.rect(0, 0, w, split);
		ctx.clip();
		drawTactical(ctx, sim, {
			x: cam.x,
			y: cam.y,
			scale: Math.min(w, split) / 2400,
			w,
			h: split,
			radarOnly: true
		});
		ctx.restore();
		ctx.strokeStyle = "#1a4a72";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(0, split + .5);
		ctx.lineTo(w, split + .5);
		ctx.stroke();
		ctx.fillStyle = MUTED;
		ctx.font = "11px IBM Plex Mono, ui-monospace, monospace";
		ctx.fillText("RADAR", 10, 16);
		drawForward(ctx, sim, {
			x: 0,
			y: split + 1,
			w,
			h: Math.max(1, h - split - 1)
		});
		ctx.restore();
		return;
	}
	const shake = sim.shake;
	const sx = shake ? (Math.random() - .5) * shake : 0;
	const sy = shake ? (Math.random() - .5) * shake : 0;
	ctx.save();
	ctx.translate(sx, sy);
	ctx.fillStyle = BG;
	ctx.fillRect(-20, -20, w + 40, h + 40);
	ctx.strokeStyle = LINE;
	ctx.lineWidth = 1;
	ctx.globalAlpha = .55;
	const grid = 1e3;
	const left = cam.x - w / 2 / cam.scale;
	const top = cam.y - h / 2 / cam.scale;
	const gx0 = Math.floor(left / grid) * grid;
	const gy0 = Math.floor(top / grid) * grid;
	for (let x = gx0; x < left + w / cam.scale + grid; x += grid) {
		const p = toScreen(cam, x, 0);
		ctx.beginPath();
		ctx.moveTo(p.x, 0);
		ctx.lineTo(p.x, h);
		ctx.stroke();
	}
	for (let y = gy0; y < top + h / cam.scale + grid; y += grid) {
		const p = toScreen(cam, 0, y);
		ctx.beginPath();
		ctx.moveTo(0, p.y);
		ctx.lineTo(w, p.y);
		ctx.stroke();
	}
	ctx.globalAlpha = 1;
	for (const star of sim.stars) {
		const p = toScreen(cam, star.x, star.y);
		if (p.x < -10 || p.y < -10 || p.x > w + 10 || p.y > h + 10) continue;
		ctx.globalAlpha = .25 + star.b * .55;
		ctx.fillStyle = FG;
		ctx.fillRect(p.x, p.y, star.b > .8 ? 2 : 1, star.b > .8 ? 2 : 1);
	}
	ctx.globalAlpha = 1;
	const player = sim.player;
	const origin = toScreen(cam, player.x, player.y);
	ctx.strokeStyle = LINE;
	ctx.setLineDash([3, 6]);
	for (const radius of [player.cls.phaserRange, player.cls.torpMax]) {
		ctx.beginPath();
		ctx.arc(origin.x, origin.y, radius * cam.scale, 0, Math.PI * 2);
		ctx.stroke();
	}
	ctx.setLineDash([]);
	HOLES.forEach((hole, i) => {
		const p = toScreen(cam, hole.x, hole.y);
		const open = sim.holeOpen;
		ctx.strokeStyle = open ? AMBER : MUTED;
		ctx.globalAlpha = open ? .85 : .35;
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.arc(p.x, p.y, 18, sim.t * (open ? 1.4 : .2), sim.t * (open ? 1.4 : .2) + 4);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(p.x, p.y, 10, -sim.t * 2, -sim.t * 2 + 3);
		ctx.stroke();
		ctx.globalAlpha = 1;
		ctx.fillStyle = open ? MUTED : LINE;
		ctx.font = "11px IBM Plex Mono, ui-monospace, monospace";
		ctx.fillText(open ? i === 0 ? "ALPHA MOUTH" : "BETA MOUTH" : "WORMHOLE DARK", p.x + 22, p.y + 4);
	});
	for (const planet of PLANETS) {
		const p = toScreen(cam, planet.x, planet.y);
		ctx.fillStyle = "#221c14";
		ctx.beginPath();
		ctx.arc(p.x, p.y, 16, 0, Math.PI * 2);
		ctx.fill();
		ctx.strokeStyle = MUTED;
		ctx.lineWidth = 1.5;
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(p.x, p.y, 24, .4, 2.2);
		ctx.stroke();
		ctx.fillStyle = FG;
		ctx.font = "12px IBM Plex Mono, ui-monospace, monospace";
		ctx.fillText(planet.name, p.x + 28, p.y + 4);
	}
	for (const base of BASES) {
		const p = toScreen(cam, base.x, base.y);
		ctx.strokeStyle = AMBER;
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		for (let i = 0; i < 6; i++) {
			const a = Math.PI / 3 * i - Math.PI / 6;
			const x = p.x + Math.cos(a) * 14;
			const y = p.y + Math.sin(a) * 14;
			if (i === 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		}
		ctx.closePath();
		ctx.stroke();
		ctx.fillStyle = AMBER;
		ctx.font = "12px IBM Plex Mono, ui-monospace, monospace";
		ctx.fillText(`SB${base.num} ${base.name}`, p.x + 20, p.y - 8);
		ctx.fillStyle = MUTED;
		ctx.fillText(base.race, p.x + 20, p.y + 8);
	}
	for (const g of sim.picks) {
		const p = toScreen(cam, g.x, g.y);
		ctx.save();
		ctx.translate(p.x, p.y);
		ctx.rotate(sim.t * 2);
		ctx.strokeStyle = GOLD;
		ctx.lineWidth = 1.5;
		ctx.strokeRect(-5, -5, 10, 10);
		ctx.restore();
	}
	for (const mine of sim.mines) {
		const p = toScreen(cam, mine.x, mine.y);
		ctx.strokeStyle = mine.arm > 0 ? MUTED : ALERT;
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.moveTo(p.x, p.y - 6);
		ctx.lineTo(p.x + 6, p.y);
		ctx.lineTo(p.x, p.y + 6);
		ctx.lineTo(p.x - 6, p.y);
		ctx.closePath();
		ctx.stroke();
	}
	for (const b of sim.bolts) {
		const p = toScreen(cam, b.x, b.y);
		const owner = sim.shipById(b.owner);
		const friendly = Boolean(owner?.isPlayer);
		ctx.fillStyle = b.drone ? friendly ? BLUE : RED : b.kind === "plasma" ? friendly ? "#7dffa8" : ALERT : friendly ? BLUE : RED;
		ctx.beginPath();
		if (b.drone) ctx.rect(p.x - 3, p.y - 3, 6, 6);
		else ctx.arc(p.x, p.y, b.kind === "plasma" ? 4 : 2.5, 0, Math.PI * 2);
		ctx.fill();
	}
	for (const beam of sim.beams) {
		const a = toScreen(cam, beam.x1, beam.y1);
		const b = toScreen(cam, beam.x2, beam.y2);
		ctx.strokeStyle = beam.byPlayer ? BLUE : RED;
		ctx.globalAlpha = Math.max(.25, beam.life / .16);
		ctx.lineWidth = beam.esi ? 2 : 1.5;
		ctx.beginPath();
		ctx.moveTo(a.x, a.y);
		ctx.lineTo(b.x, b.y);
		ctx.stroke();
		ctx.globalAlpha = 1;
	}
	for (const ship of sim.ships) {
		if (!ship.alive) continue;
		if (!(ship.isPlayer || sim.visible(player, ship))) continue;
		const p = toScreen(cam, ship.x, ship.y);
		const mine = ship.isPlayer;
		const color = mine ? BLUE : RED;
		const size = mine ? 46 : 36;
		ctx.save();
		ctx.globalAlpha = ship.cloaked ? .45 : 1;
		if (ship.shield > 2) {
			ctx.strokeStyle = color;
			ctx.globalAlpha = (ship.cloaked ? .3 : .7) * (ship.shield / 100);
			ctx.lineWidth = 1.5;
			ctx.beginPath();
			ctx.arc(p.x, p.y, size * .62, 0, Math.PI * 2);
			ctx.stroke();
			ctx.globalAlpha = ship.cloaked ? .45 : 1;
		}
		if (ship.docked) {
			ctx.setLineDash([3, 3]);
			ctx.strokeStyle = color;
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.arc(p.x, p.y, size * .72, 0, Math.PI * 2);
			ctx.stroke();
			ctx.setLineDash([]);
		}
		paintShip(ctx, ship.cls.id, ship.yaw, p.x, p.y, size, ship.hitFlash > 0);
		ctx.globalAlpha = 1;
		ctx.fillStyle = mine ? BLUE : FG;
		ctx.font = "12px IBM Plex Mono, ui-monospace, monospace";
		const tag = ship.docked ? `${ship.letter} ${ship.name} DOCKED` : `${ship.letter} ${ship.name}`;
		ctx.fillText(tag, p.x + size * .55, p.y - 14);
		ctx.restore();
	}
	if (player.lockId) {
		const lock = sim.shipById(player.lockId);
		if (lock && lock.alive && sim.visible(player, lock)) {
			const p = toScreen(cam, lock.x, lock.y);
			ctx.strokeStyle = ALERT;
			ctx.lineWidth = 1.5;
			const s = 16;
			ctx.strokeRect(p.x - s, p.y - s, 32, 32);
		}
	}
	for (const q of sim.particles) {
		const p = toScreen(cam, q.x, q.y);
		ctx.globalAlpha = Math.max(0, q.life / q.max);
		ctx.fillStyle = q.alert ? ALERT : AMBER;
		ctx.fillRect(p.x, p.y, q.size, q.size);
	}
	ctx.globalAlpha = 1;
	const hullPct = player.cls.hull > 0 ? player.hull / player.cls.hull : 1;
	if (!cam.radarOnly && hullPct < .3 && player.alive) {
		const g = ctx.createRadialGradient(w / 2, h / 2, h * .2, w / 2, h / 2, h * .7);
		g.addColorStop(0, "rgba(0,0,0,0)");
		g.addColorStop(1, "rgba(255,90,60,0.28)");
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, w, h);
	}
	if (!cam.radarOnly) drawMinimap(ctx, sim, w, h);
	ctx.restore();
}
function drawMinimap(ctx, sim, w, h) {
	const size = Math.min(148, Math.max(96, w * .22));
	const pad = 12;
	const x0 = w - size - pad;
	const y0 = h - size - pad;
	ctx.fillStyle = "rgba(12,10,7,0.82)";
	ctx.strokeStyle = LINE;
	ctx.lineWidth = 1;
	ctx.fillRect(x0, y0, size, size);
	ctx.strokeRect(x0, y0, size, size);
	const m = (wx, wy) => ({
		x: x0 + wx / WORLD * size,
		y: y0 + wy / WORLD * size
	});
	ctx.fillStyle = MUTED;
	for (const planet of PLANETS) {
		const p = m(planet.x, planet.y);
		ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
	}
	ctx.fillStyle = AMBER;
	for (const base of BASES) {
		const p = m(base.x, base.y);
		ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
	}
	for (const ship of sim.ships) {
		if (!ship.alive) continue;
		if (!ship.isPlayer && !sim.visible(sim.player, ship)) continue;
		const p = m(ship.x, ship.y);
		ctx.fillStyle = ship.isPlayer ? AMBER : ALERT;
		ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
	}
	ctx.fillStyle = MUTED;
	ctx.font = "10px IBM Plex Mono, ui-monospace, monospace";
	ctx.fillText("QUADRANT", x0 + 6, y0 + 14);
}
function place(fwd, lat, pane) {
	if (fwd < 36) return null;
	const cx = pane.x + pane.w / 2;
	const horizon = pane.y + pane.h * .36;
	const focal = pane.h * .92;
	return {
		sx: cx + lat / fwd * focal,
		sy: horizon + Math.min(pane.h * .58, focal * 110 / fwd),
		size: Math.max(16, Math.min(pane.h * .62, 15e3 / fwd)),
		fwd
	};
}
function project(player, wx, wy, pane) {
	const dx = wx - player.x;
	const dy = wy - player.y;
	const fx = -Math.sin(player.yaw);
	const fy = -Math.cos(player.yaw);
	const rx = Math.cos(player.yaw);
	const ry = -Math.sin(player.yaw);
	return place(dx * fx + dy * fy, dx * rx + dy * ry, pane);
}
function drawForward(ctx, sim, pane) {
	const player = sim.player;
	const cx = pane.x + pane.w / 2;
	const horizon = pane.y + pane.h * .36;
	ctx.save();
	ctx.beginPath();
	ctx.rect(pane.x, pane.y, pane.w, pane.h);
	ctx.clip();
	ctx.fillStyle = "#000000";
	ctx.fillRect(pane.x, pane.y, pane.w, pane.h);
	for (let i = 0; i < 80; i++) {
		let rel = i * 2.399963 % (Math.PI * 2) - player.yaw;
		while (rel > Math.PI) rel -= Math.PI * 2;
		while (rel < -Math.PI) rel += Math.PI * 2;
		if (Math.abs(rel) > 1.2) continue;
		const sx = cx + rel / 1.2 * pane.w * .48;
		const sy = pane.y + 12 + i * 53 % Math.max(8, Math.floor(horizon - pane.y - 16));
		ctx.globalAlpha = .28 + i % 5 * .12;
		ctx.fillStyle = FG;
		ctx.fillRect(sx, sy, i % 8 === 0 ? 2 : 1, i % 8 === 0 ? 2 : 1);
	}
	ctx.globalAlpha = 1;
	ctx.strokeStyle = "#12324c";
	ctx.lineWidth = 1;
	for (const fwd of [
		220,
		420,
		720,
		1100,
		1700,
		2500,
		3600
	]) {
		const a = place(fwd, -2400, pane);
		const b = place(fwd, 2400, pane);
		if (!a || !b) continue;
		ctx.beginPath();
		ctx.moveTo(a.sx, a.sy);
		ctx.lineTo(b.sx, b.sy);
		ctx.stroke();
	}
	for (let lat = -2e3; lat <= 2e3; lat += 500) {
		const a = place(80, lat, pane);
		const b = place(4e3, lat, pane);
		if (!a || !b) continue;
		ctx.beginPath();
		ctx.moveTo(a.sx, a.sy);
		ctx.lineTo(b.sx, b.sy);
		ctx.stroke();
	}
	ctx.strokeStyle = "#1a4a72";
	ctx.beginPath();
	ctx.moveTo(pane.x, horizon);
	ctx.lineTo(pane.x + pane.w, horizon);
	ctx.stroke();
	for (const base of BASES) {
		const p = project(player, base.x, base.y, pane);
		if (!p || p.fwd > 7e3) continue;
		const s = Math.max(10, p.size * .35);
		ctx.strokeStyle = BLUE;
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.moveTo(p.sx, p.sy - s);
		ctx.lineTo(p.sx + s, p.sy);
		ctx.lineTo(p.sx, p.sy + s);
		ctx.lineTo(p.sx - s, p.sy);
		ctx.closePath();
		ctx.stroke();
		ctx.fillStyle = MUTED;
		ctx.font = "11px IBM Plex Mono, ui-monospace, monospace";
		ctx.fillText(`SB${base.num}`, p.sx + s + 4, p.sy);
	}
	const marks = [];
	for (const ship of sim.ships) {
		if (!ship.alive || ship.isPlayer) continue;
		if (!sim.visible(player, ship)) continue;
		const p = project(player, ship.x, ship.y, pane);
		if (!p || p.sx < pane.x - 120 || p.sx > pane.x + pane.w + 120) continue;
		marks.push({
			id: ship.id,
			kind: ship.cls.id,
			name: ship.name,
			yaw: ship.yaw - player.yaw,
			flash: ship.hitFlash > 0,
			sx: p.sx,
			sy: p.sy,
			size: p.size,
			fwd: p.fwd
		});
	}
	marks.sort((a, b) => b.fwd - a.fwd);
	for (const mark of marks) {
		paintShip(ctx, mark.kind, mark.yaw, mark.sx, mark.sy, mark.size, mark.flash);
		ctx.strokeStyle = mark.kind === "KEV12" || mark.kind === "KPB13" ? RED : mark.kind === "RBOP" || mark.kind === "WARBIRD" ? "#3dce7a" : BLUE;
		ctx.lineWidth = 1;
		const b = mark.size * .55;
		ctx.strokeRect(mark.sx - b, mark.sy - b, b * 2, b * 2);
		ctx.fillStyle = FG;
		ctx.font = "11px IBM Plex Mono, ui-monospace, monospace";
		ctx.fillText(mark.name, mark.sx + b + 4, mark.sy - 4);
	}
	for (const bolt of sim.bolts) {
		const p = project(player, bolt.x, bolt.y, pane);
		if (!p) continue;
		ctx.fillStyle = sim.shipById(bolt.owner)?.isPlayer ? BLUE : RED;
		ctx.beginPath();
		ctx.arc(p.sx, p.sy, bolt.drone ? 4 : bolt.kind === "plasma" ? 5 : 3, 0, Math.PI * 2);
		ctx.fill();
	}
	for (const beam of sim.beams) {
		const hit = project(player, beam.x2, beam.y2, pane);
		ctx.strokeStyle = beam.byPlayer ? BLUE : RED;
		ctx.globalAlpha = Math.max(.4, beam.life / .16);
		ctx.lineWidth = beam.esi ? 3 : 2;
		ctx.beginPath();
		if (beam.byPlayer) {
			ctx.moveTo(cx, pane.y + pane.h - 8);
			if (hit) ctx.lineTo(hit.sx, hit.sy);
			else ctx.lineTo(cx, horizon);
		} else if (hit) {
			const src = project(player, beam.x1, beam.y1, pane);
			if (!src) continue;
			ctx.moveTo(src.sx, src.sy);
			ctx.lineTo(hit.sx, hit.sy);
		}
		ctx.stroke();
		ctx.globalAlpha = 1;
	}
	ctx.strokeStyle = BLUE;
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(cx - 10, horizon + 18);
	ctx.lineTo(cx - 3, horizon + 18);
	ctx.moveTo(cx + 3, horizon + 18);
	ctx.lineTo(cx + 10, horizon + 18);
	ctx.moveTo(cx, horizon + 10);
	ctx.lineTo(cx, horizon + 15);
	ctx.moveTo(cx, horizon + 21);
	ctx.lineTo(cx, horizon + 26);
	ctx.stroke();
	ctx.fillStyle = BLUE;
	ctx.font = "12px IBM Plex Mono, ui-monospace, monospace";
	ctx.fillText(`SHIELDS  ${Math.round(player.shield)}`, pane.x + 12, pane.y + 20);
	ctx.fillStyle = GOLD;
	ctx.fillText(`TORPEDOES  ${player.magazine}`, pane.x + 12, pane.y + 36);
	ctx.fillStyle = FG;
	ctx.fillText(`WARP  ${player.warp.toFixed(1)}`, pane.x + 12, pane.y + 52);
	ctx.fillStyle = MUTED;
	ctx.fillText("FORWARD", pane.x + pane.w - 78, pane.y + 20);
	ctx.restore();
}
function pointerCommand(sim, w, h, sx, sy) {
	const split = radarSplit(h);
	if (sy <= split) {
		const cam = cameraFor(sim, w, split);
		const id = pickShipAt(sim, cam, sx, sy);
		if (id) return {
			kind: "lock",
			id
		};
		const world = screenToWorld(cam, sx, sy);
		return {
			kind: "course",
			x: world.x,
			y: world.y
		};
	}
	const pane = {
		x: 0,
		y: split + 1,
		w,
		h: Math.max(1, h - split - 1)
	};
	let best = null;
	let bestD = 36;
	for (const ship of sim.ships) {
		if (!ship.alive || ship.isPlayer || !sim.visible(sim.player, ship)) continue;
		const p = project(sim.player, ship.x, ship.y, pane);
		if (!p) continue;
		const d = Math.hypot(p.sx - sx, p.sy - sy);
		if (d < Math.max(bestD, p.size * .45)) {
			bestD = d;
			best = ship.id;
		}
	}
	if (best) return {
		kind: "lock",
		id: best
	};
	const nx = (sx - w / 2) / (w * .42);
	const aim = sim.player.yaw - nx * .7;
	return {
		kind: "course",
		x: sim.player.x - Math.sin(aim) * 900,
		y: sim.player.y - Math.cos(aim) * 900
	};
}
function pickShipAt(sim, cam, sx, sy) {
	let best = null;
	let bestD = 26;
	for (const ship of sim.ships) {
		if (!ship.alive || ship.isPlayer) continue;
		if (!sim.visible(sim.player, ship)) continue;
		const p = toScreen(cam, ship.x, ship.y);
		const d = Math.hypot(p.x - sx, p.y - sy);
		if (d < bestD) {
			bestD = d;
			best = ship.id;
		}
	}
	return best;
}
var KEY = "mtrek-web-v1";
function blank() {
	return {
		version: 1,
		scores: [],
		callsign: "USS Intrepid",
		classId: "EXCEL"
	};
}
function read() {
	if (typeof localStorage === "undefined") return blank();
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return blank();
		const parsed = JSON.parse(raw);
		if (parsed.version !== 1 || !Array.isArray(parsed.scores)) return blank();
		return {
			version: 1,
			scores: parsed.scores.filter((s) => s && typeof s.name === "string" && typeof s.gold === "number"),
			callsign: typeof parsed.callsign === "string" ? parsed.callsign : "USS Intrepid",
			classId: typeof parsed.classId === "string" ? parsed.classId : "EXCEL"
		};
	} catch {
		return blank();
	}
}
function write(data) {
	localStorage.setItem(KEY, JSON.stringify(data));
}
function loadScores() {
	return read().scores;
}
function loadCallsign() {
	const data = read();
	return {
		name: data.callsign,
		classId: data.classId
	};
}
function saveCallsign(name, classId) {
	const data = read();
	data.callsign = name;
	data.classId = classId;
	write(data);
}
function saveScore(row) {
	const data = read();
	const existing = data.scores.find((s) => s.name === row.name && s.code === row.code);
	if (existing && existing.gold >= row.gold) return data.scores;
	data.scores = [row, ...data.scores.filter((s) => !(s.name === row.name && s.code === row.code))].sort((a, b) => b.gold - a.gold).slice(0, 8);
	write(data);
	return data.scores;
}
var FAST_POLL_MS = 400;
var IDLE_POLL_MS = 2e3;
var PING_INTERVAL_MS = 2e3;
var STALL_MS = 1e4;
var MAX_RECOVERY_ATTEMPTS = 3;
var SIGNAL_RETRY_DELAYS_MS = [250, 750];
function defaultIceServers() {
	return [{ urls: ["stun:stun.l.google.com:19302", "stun:stun.cloudflare.com:3478"] }];
}
var P2PRoom = class {
	opts;
	peers = /* @__PURE__ */ new Map();
	/** Per-remote-peer signal delivery chains (order-preserving). */
	signalQueues = /* @__PURE__ */ new Map();
	cursor = 0;
	pollTimer = null;
	pingTimer = null;
	closed = false;
	everPolled = false;
	lastPeersFingerprint = "";
	constructor(opts) {
		this.opts = opts;
	}
	/**
	* The first poll IS the join: it registers this peer and returns the
	* roster. A failed first poll (cold DB, offline tab) must not strand the
	* room: the loop and timers start regardless and the next poll retries.
	*/
	async join() {
		try {
			await this.pollOnce();
		} catch {}
		if (this.closed) return;
		this.schedulePoll(this.anyPairConnecting() ? FAST_POLL_MS : IDLE_POLL_MS);
		this.pingTimer = setInterval(() => {
			this.pingAll();
			this.watchdog();
		}, PING_INTERVAL_MS);
	}
	close() {
		this.closed = true;
		if (this.pollTimer) clearTimeout(this.pollTimer);
		if (this.pingTimer) clearInterval(this.pingTimer);
		for (const slot of this.peers.values()) slot.pc.close();
		this.peers.clear();
		fetch("/api/rtc", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				op: "leave",
				room: this.opts.room,
				peer: this.opts.selfId
			}),
			keepalive: true
		}).catch(() => {});
	}
	/** Send on the unreliable game-state channel (drops stale packets). */
	broadcast(data) {
		const wire = JSON.stringify({
			t: "d",
			d: data
		});
		for (const slot of this.peers.values()) if (slot.state?.readyState === "open") slot.state.send(wire);
	}
	/** Send reliably (ordered) to one peer, or to all when peerId is omitted. */
	send(data, peerId) {
		const wire = JSON.stringify({
			t: "d",
			d: data
		});
		const targets = peerId ? [this.peers.get(peerId)] : [...this.peers.values()];
		for (const slot of targets) if (slot?.reliable?.readyState === "open") slot.reliable.send(wire);
	}
	peerList() {
		return [...this.peers.values()].map((s) => ({ ...s.info }));
	}
	schedulePoll(delay) {
		if (this.closed) return;
		if (this.pollTimer) clearTimeout(this.pollTimer);
		this.pollTimer = setTimeout(() => void this.poll(), delay);
	}
	anyPairConnecting() {
		for (const s of this.peers.values()) {
			if (s.terminal) continue;
			if (s.info.connectionState !== "connected") return true;
		}
		return false;
	}
	async pollOnce() {
		const params = new URLSearchParams({
			room: this.opts.room,
			peer: this.opts.selfId,
			name: this.opts.name ?? "",
			since: String(this.cursor)
		});
		const res = await fetch(`/api/rtc?${params}`);
		if (this.closed) return;
		if (!res.ok) throw new Error(`signaling poll failed: ${res.status}`);
		const body = await res.json();
		if (this.closed) return;
		if (!this.everPolled) {
			this.everPolled = true;
			this.opts.onConnected?.();
		}
		this.reconcileRoster(body.peers);
		const roster = new Set(body.peers.map((p) => p.id));
		for (const sig of body.signals) {
			this.cursor = Math.max(this.cursor, sig.id);
			await this.onSignal(sig.from, sig.kind, sig.payload, roster);
			if (this.closed) return;
		}
	}
	async poll() {
		if (this.closed) return;
		try {
			await this.pollOnce();
		} catch {}
		this.schedulePoll(this.anyPairConnecting() ? FAST_POLL_MS : IDLE_POLL_MS);
	}
	reconcileRoster(peers) {
		const alive = new Set(peers.map((p) => p.id));
		for (const p of peers) {
			if (p.id === this.opts.selfId) continue;
			const existing = this.peers.get(p.id);
			if (existing) existing.info.name = p.name;
			else this.connectTo(p.id, p.name, this.opts.selfId > p.id);
		}
		for (const [id, slot] of this.peers) if (!alive.has(id)) {
			slot.pc.close();
			this.peers.delete(id);
		}
		this.emitPeers();
	}
	connectTo(peerId, name, initiator) {
		if (this.closed) return null;
		const pc = new RTCPeerConnection({ iceServers: this.opts.iceServers ?? defaultIceServers() });
		const slot = {
			pc,
			makingOffer: false,
			ignoreOffer: false,
			pendingCandidates: [],
			lastProgressAt: Date.now(),
			recoveryAttempts: 0,
			info: {
				id: peerId,
				name,
				connectionState: pc.connectionState,
				candidateType: null,
				rttMs: null
			}
		};
		this.peers.set(peerId, slot);
		pc.onicecandidate = (e) => {
			if (e.candidate) this.sendSignal(peerId, "ice", e.candidate.toJSON());
		};
		pc.onconnectionstatechange = () => {
			slot.info.connectionState = pc.connectionState;
			if (pc.connectionState === "connecting" || pc.connectionState === "connected") slot.lastProgressAt = Date.now();
			if (pc.connectionState === "connected") {
				slot.recoveryAttempts = 0;
				slot.terminal = false;
				this.readCandidateType(slot);
			}
			this.emitPeers();
			if (pc.connectionState === "failed") pc.restartIce();
			if (pc.connectionState === "failed" || pc.connectionState === "disconnected") this.schedulePoll(FAST_POLL_MS);
		};
		pc.onnegotiationneeded = async () => {
			try {
				slot.makingOffer = true;
				await pc.setLocalDescription();
				await this.sendSignal(peerId, "offer", pc.localDescription.toJSON());
			} catch {} finally {
				slot.makingOffer = false;
			}
		};
		pc.ondatachannel = (e) => this.attachChannel(slot, e.channel);
		if (initiator) {
			this.attachChannel(slot, pc.createDataChannel("state", {
				ordered: false,
				maxRetransmits: 0
			}));
			this.attachChannel(slot, pc.createDataChannel("reliable", { ordered: true }));
		}
		return slot;
	}
	attachChannel(slot, channel) {
		if (channel.label === "state") slot.state = channel;
		else slot.reliable = channel;
		channel.onopen = () => {
			slot.lastProgressAt = Date.now();
		};
		channel.onmessage = (e) => {
			let msg;
			try {
				msg = JSON.parse(e.data);
			} catch {
				return;
			}
			if (msg.t === "ping") {
				if (slot.state?.readyState === "open") slot.state.send(JSON.stringify({ t: "pong" }));
			} else if (msg.t === "pong") {
				if (slot.pingSentAt) {
					slot.info.rttMs = Math.round(performance.now() - slot.pingSentAt);
					slot.pingSentAt = void 0;
					this.emitPeers();
				}
			} else this.opts.onMessage?.(slot.info.id, msg.d, channel.label === "state" ? "state" : "reliable");
		};
	}
	/** Apply buffered ICE candidates once a remote description is in place. */
	async flushPendingCandidates(slot) {
		while (slot.pendingCandidates.length > 0) {
			const candidate = slot.pendingCandidates.shift();
			try {
				await slot.pc.addIceCandidate(candidate);
			} catch (err) {
				if (!slot.ignoreOffer) console.warn("[p2p] addIceCandidate failed:", err);
			}
			if (this.closed) return;
		}
	}
	async onSignal(from, kind, payload, roster) {
		if (this.closed) return;
		let slot = this.peers.get(from);
		if (!slot) {
			if (!roster.has(from)) return;
			const created = this.connectTo(from, "", false);
			if (!created) return;
			slot = created;
		}
		const polite = this.opts.selfId < from;
		try {
			if (kind === "offer" || kind === "answer") {
				const description = payload;
				const collision = kind === "offer" && (slot.makingOffer || slot.pc.signalingState !== "stable");
				slot.ignoreOffer = !polite && collision;
				if (slot.ignoreOffer) return;
				try {
					await slot.pc.setRemoteDescription(description);
				} catch (err) {
					if (kind !== "offer" || slot.recreatedForOffer) throw err;
					const attempts = slot.recoveryAttempts;
					const name = slot.info.name;
					slot.pc.close();
					this.peers.delete(from);
					const fresh = this.connectTo(from, name, false);
					if (!fresh) return;
					fresh.recoveryAttempts = attempts;
					fresh.recreatedForOffer = true;
					slot = fresh;
					await slot.pc.setRemoteDescription(description);
				}
				if (this.closed) return;
				await this.flushPendingCandidates(slot);
				if (this.closed) return;
				if (kind === "offer") {
					await slot.pc.setLocalDescription();
					if (this.closed) return;
					await this.sendSignal(from, "answer", slot.pc.localDescription.toJSON());
				}
			} else if (kind === "ice") {
				const candidate = payload;
				if (!slot.pc.remoteDescription) {
					slot.pendingCandidates.push(candidate);
					return;
				}
				try {
					await slot.pc.addIceCandidate(candidate);
				} catch (err) {
					if (!slot.ignoreOffer) console.warn("[p2p] addIceCandidate failed:", err);
				}
			}
		} catch {}
	}
	/**
	* Signals are serialized per remote peer (a candidate must never overtake
	* its SDP into the DB) and retried on failure with short backoff.
	*/
	sendSignal(to, kind, payload) {
		const next = (this.signalQueues.get(to) ?? Promise.resolve()).then(() => this.postSignal(to, kind, payload));
		this.signalQueues.set(to, next.catch(() => {}));
		return next;
	}
	async postSignal(to, kind, payload) {
		for (let attempt = 0;; attempt++) {
			if (this.closed) return;
			try {
				const res = await fetch("/api/rtc", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({
						op: "signal",
						room: this.opts.room,
						from: this.opts.selfId,
						to,
						kind,
						payload
					})
				});
				if (res.ok) return;
				throw new Error(`signal POST failed: ${res.status}`);
			} catch (err) {
				if (attempt >= SIGNAL_RETRY_DELAYS_MS.length) {
					console.warn(`[p2p] signal ${kind} to ${to} failed after retries`, err);
					return;
				}
				await new Promise((r) => setTimeout(r, SIGNAL_RETRY_DELAYS_MS[attempt]));
			}
		}
	}
	pingAll() {
		const wire = JSON.stringify({ t: "ping" });
		for (const slot of this.peers.values()) {
			if (slot.state?.readyState !== "open") continue;
			const stale = slot.pingSentAt !== void 0 && performance.now() - slot.pingSentAt > 2 * PING_INTERVAL_MS;
			if (slot.pingSentAt === void 0 || stale) {
				slot.pingSentAt = performance.now();
				slot.state.send(wire);
			}
		}
	}
	/**
	* Stuck-pair recovery, piggybacked on the ping interval. A pair that has
	* made no progress for STALL_MS gets rebuilt by the dialer with a FRESH
	* RTCPeerConnection (new DTLS identity — fixes the suspend/resume
	* fingerprint wedge). After MAX_RECOVERY_ATTEMPTS the pair is terminal:
	* visible to the app as its last connectionState, ignored by fast-poll.
	*/
	watchdog() {
		if (this.closed) return;
		const now = Date.now();
		for (const [peerId, slot] of this.peers) {
			const live = slot.pc.connectionState;
			if (live !== slot.info.connectionState) {
				slot.info.connectionState = live;
				if (live === "connecting" || live === "connected") slot.lastProgressAt = now;
				this.emitPeers();
			}
			if (slot.terminal || live === "connected") continue;
			if (now - slot.lastProgressAt <= STALL_MS) continue;
			if (slot.recoveryAttempts >= MAX_RECOVERY_ATTEMPTS) {
				slot.terminal = true;
				this.emitPeers();
				continue;
			}
			slot.recoveryAttempts += 1;
			slot.lastProgressAt = now;
			if (this.opts.selfId > peerId) {
				const { name } = slot.info;
				const attempts = slot.recoveryAttempts;
				slot.pc.close();
				this.peers.delete(peerId);
				const fresh = this.connectTo(peerId, name, true);
				if (fresh) fresh.recoveryAttempts = attempts;
				this.schedulePoll(FAST_POLL_MS);
			}
		}
	}
	async readCandidateType(slot) {
		try {
			const stats = await slot.pc.getStats();
			let selected;
			stats.forEach((s) => {
				if (s.type === "candidate-pair" && s.nominated) selected = s;
			});
			const localId = selected?.localCandidateId;
			if (localId) {
				const local = stats.get(localId);
				slot.info.candidateType = local?.candidateType ?? null;
				this.emitPeers();
			}
		} catch {}
	}
	emitPeers() {
		const list = this.peerList();
		const fingerprint = JSON.stringify(list.map((p) => [
			p.id,
			p.name,
			p.connectionState,
			p.candidateType,
			p.rttMs
		]));
		if (fingerprint === this.lastPeersFingerprint) return;
		this.lastPeersFingerprint = fingerprint;
		this.opts.onPeersChanged?.(list);
	}
};
function useP2PRoom(options = {}) {
	const [selfId] = (0, import_react.useState)(() => `p-${Math.random().toString(36).slice(2, 10)}`);
	const [room] = (0, import_react.useState)(() => (options.room ?? "mtrek-open").slice(0, 64));
	const [name] = (0, import_react.useState)(() => options.name ?? selfId);
	const [peers, setPeers] = (0, import_react.useState)([]);
	const [joined, setJoined] = (0, import_react.useState)(false);
	const roomRef = (0, import_react.useRef)(null);
	const listeners = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	(0, import_react.useEffect)(() => {
		const p2p = new P2PRoom({
			room,
			selfId,
			name,
			onPeersChanged: setPeers,
			onMessage: (from, data, channel) => {
				for (const fn of listeners.current) fn(from, data, channel);
			},
			onConnected: () => setJoined(true)
		});
		roomRef.current = p2p;
		p2p.join();
		return () => {
			roomRef.current = null;
			p2p.close();
		};
	}, [
		room,
		selfId,
		name
	]);
	return {
		selfId,
		room,
		peers,
		joined,
		broadcast: (0, import_react.useCallback)((data) => roomRef.current?.broadcast(data), []),
		send: (0, import_react.useCallback)((data, peerId) => roomRef.current?.send(data, peerId), []),
		onMessage: (0, import_react.useCallback)((fn) => {
			listeners.current.add(fn);
			return () => {
				listeners.current.delete(fn);
			};
		}, [])
	};
}
function NetLink({ room, name, simRef, sendRef }) {
	const p2p = useP2PRoom({
		room: `mtrek-${room}`.slice(0, 64),
		name
	});
	const [label, setLabel] = (0, import_react.useState)("linking");
	(0, import_react.useEffect)(() => {
		sendRef.current = (data) => p2p.send(data);
		return () => {
			sendRef.current = null;
		};
	}, [p2p.send, sendRef]);
	(0, import_react.useEffect)(() => {
		const sim = simRef.current;
		if (!sim) return;
		sim.onStrike = (peer, raw) => {
			if (peer) p2p.send({
				k: "hit",
				to: peer,
				dmg: raw,
				by: sim.player.name
			});
		};
		return () => {
			sim.onStrike = null;
		};
	}, [p2p.send, simRef]);
	(0, import_react.useEffect)(() => p2p.onMessage((from, data) => {
		if (!data || typeof data !== "object") return;
		const msg = data;
		const sim = simRef.current;
		if (!sim) return;
		if (msg.k === "pose") sim.upsertRemote(from, msg);
		if (msg.k === "hit" && msg.to === p2p.selfId) sim.applyIncoming(Number(msg.dmg) || 0, String(msg.by ?? "someone"));
		if (msg.k === "hail" && msg.text) sim.say(String(msg.text).slice(0, 96), "amber");
	}), [
		p2p.onMessage,
		p2p.selfId,
		simRef
	]);
	(0, import_react.useEffect)(() => {
		let last = 0;
		let raf = 0;
		const loop = (now) => {
			if (now - last > 100) {
				last = now;
				const sim = simRef.current;
				const p = sim?.player;
				if (p) p2p.broadcast({
					k: "pose",
					name: p.name,
					classId: p.cls.id,
					x: p.x,
					y: p.y,
					yaw: p.yaw,
					warp: p.warp,
					shield: p.shield,
					hull: p.hull,
					cloaked: p.cloaked,
					docked: p.docked,
					alive: p.alive && !sim?.over
				});
			}
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, [p2p.broadcast, simRef]);
	(0, import_react.useEffect)(() => {
		simRef.current?.dropRemotes(p2p.peers.map((peer) => peer.id));
		const linked = p2p.peers.filter((peer) => peer.connectionState === "connected").length;
		const failed = p2p.peers.filter((peer) => peer.connectionState === "failed").length;
		setLabel(!p2p.joined ? "linking" : failed && !linked ? "no path" : linked ? `${linked} linked` : "waiting");
	}, [
		p2p.joined,
		p2p.peers,
		simRef
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "pointer-events-none absolute top-14 left-3 z-10 font-mono text-xs text-amber",
		children: [
			"ROOM ",
			room,
			" · ",
			label
		]
	});
}
function pad3(n) {
	return Math.round(n).toString().padStart(3, "0");
}
function clock(s) {
	return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}
function Bridge({ name, classId, room, onLeave }) {
	const canvasRef = (0, import_react.useRef)(null);
	const simRef = (0, import_react.useRef)(null);
	const netSend = (0, import_react.useRef)(null);
	const [snap, setSnap] = (0, import_react.useState)(null);
	const [paused, setPaused] = (0, import_react.useState)(false);
	const [help, setHelp] = (0, import_react.useState)(false);
	const [hail, setHail] = (0, import_react.useState)("");
	const pausedRef = (0, import_react.useRef)(false);
	pausedRef.current = paused || help;
	(0, import_react.useEffect)(() => {
		const sim = new TrekSim(name, classId, { bots: !room });
		simRef.current = sim;
		sim.onBank = (ship) => {
			saveScore({
				name: ship.name,
				code: ship.cls.code,
				gold: Math.floor(ship.banked),
				dmg: Math.floor(ship.dmgGiven),
				kills: ship.kills,
				at: Date.now()
			});
		};
		setSnap(sim.snapshot());
		window.__controlsTest = {
			getYaw: () => sim.player.yaw,
			getSpeed: () => sim.player.warp,
			setKeys: (codes) => {
				sim.inputOverride = new Set(codes);
			},
			setSteer: (v) => {
				sim.touchSteer = v;
			}
		};
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;
		const resize = () => {
			const rect = canvas.getBoundingClientRect();
			const dpr = Math.min(2, window.devicePixelRatio || 1);
			canvas.width = Math.max(1, Math.floor(rect.width * dpr));
			canvas.height = Math.max(1, Math.floor(rect.height * dpr));
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		resize();
		const observer = new ResizeObserver(resize);
		observer.observe(canvas);
		let raf = 0;
		let last = performance.now();
		let acc = 0;
		let hud = 0;
		const loop = (now) => {
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			if (!pausedRef.current) {
				acc += dt;
				while (acc >= 1 / 60) {
					sim.step(1 / 60);
					acc -= 1 / 60;
				}
			}
			const rect = canvas.getBoundingClientRect();
			const cam = cameraFor(sim, rect.width, rect.height);
			drawTactical(ctx, sim, cam);
			hud += dt;
			if (hud > .1) {
				hud = 0;
				setSnap(sim.snapshot());
			}
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		const down = (e) => {
			const target = e.target;
			if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
			sim.keys.add(e.code);
			if ([
				"Space",
				"ArrowUp",
				"ArrowDown",
				"ArrowLeft",
				"ArrowRight"
			].includes(e.code)) e.preventDefault();
			if (e.repeat) return;
			if (e.code === "KeyR" && e.shiftKey) {
				sim.dropShields();
				return;
			}
			if (e.code === "KeyR") sim.toggleRaise();
			if (e.code === "KeyC") sim.toggleRepair();
			if (e.code === "KeyZ") sim.toggleCloak();
			if (e.code === "KeyI") sim.toggleIntercept();
			if (e.code === "KeyX") sim.transwarp();
			if (e.code === "Period") sim.requestDock();
			if (e.code === "KeyU") sim.requestUndock();
			if (e.code === "KeyH" || e.code === "Slash") setHelp((v) => !v);
			if (e.code === "Escape") setPaused((v) => !v);
		};
		const up = (e) => {
			sim.keys.delete(e.code);
		};
		const blur = () => {
			sim.keys.clear();
			sim.touchSteer = 0;
			sim.touchWarp = 0;
			sim.touchPhaser = false;
			sim.touchTorp = false;
			sim.touchDrone = false;
			sim.touchMine = false;
		};
		window.addEventListener("keydown", down);
		window.addEventListener("keyup", up);
		window.addEventListener("blur", blur);
		return () => {
			cancelAnimationFrame(raf);
			observer.disconnect();
			window.removeEventListener("keydown", down);
			window.removeEventListener("keyup", up);
			window.removeEventListener("blur", blur);
			delete window.__controlsTest;
		};
	}, [name, classId]);
	const onPointer = (e) => {
		const sim = simRef.current;
		const canvas = canvasRef.current;
		if (!sim || !canvas || sim.over) return;
		unlockAudio();
		const rect = canvas.getBoundingClientRect();
		const sx = e.clientX - rect.left;
		const sy = e.clientY - rect.top;
		const cmd = pointerCommand(sim, rect.width, rect.height, sx, sy);
		if (cmd.kind === "lock") sim.lockShip(cmd.id);
		else sim.setCourse(cmd.x, cmd.y);
	};
	const hold = (kind, on) => {
		const sim = simRef.current;
		if (!sim) return;
		unlockAudio();
		if (kind === "left") sim.touchSteer = on ? 1 : sim.touchSteer === 1 ? 0 : sim.touchSteer;
		if (kind === "right") sim.touchSteer = on ? -1 : sim.touchSteer === -1 ? 0 : sim.touchSteer;
		if (kind === "up") sim.touchWarp = on ? 1 : sim.touchWarp === 1 ? 0 : sim.touchWarp;
		if (kind === "down") sim.touchWarp = on ? -1 : sim.touchWarp === -1 ? 0 : sim.touchWarp;
		if (kind === "phaser") sim.touchPhaser = on;
		if (kind === "torp") sim.touchTorp = on;
		if (kind === "drone") sim.touchDrone = on;
		if (kind === "mine") sim.touchMine = on;
	};
	const act = (fn) => {
		const sim = simRef.current;
		if (!sim) return;
		unlockAudio();
		fn(sim);
		setSnap(sim.snapshot());
	};
	const sendHail = () => {
		const sim = simRef.current;
		if (!sim) return;
		sim.hail(hail);
		if (hail.trim()) netSend.current?.({
			k: "hail",
			text: `${name}: ${hail.trim().slice(0, 80)}`
		});
		setHail("");
		setSnap(sim.snapshot());
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex h-dvh min-h-0 flex-col overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex shrink-0 items-center justify-between gap-3 border-b border-line px-3 py-2 md:px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs tracking-widest text-amber",
						children: ["MTREK · ", room ? `ROOM ${room}` : "SOLO QUADRANT"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate font-sans text-sm font-semibold",
						children: [
							snap ? `${snap.letter} ${snap.name}` : name,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs font-normal text-muted",
								children: snap?.code
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "hidden font-mono text-xs text-muted sm:block",
							children: [
								"BANK ",
								snap ? snap.banked.toLocaleString("en-US") : "0",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-gold",
									children: [" +", snap?.unbanked ?? 0]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setHelp(true),
							className: "h-10 border border-line px-3 font-mono text-xs text-fg",
							children: "Help"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setPaused(true),
							className: "h-10 border border-line px-3 font-mono text-xs text-fg",
							children: "Pause"
						})
					]
				})]
			}),
			room ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NetLink, {
				room,
				name,
				simRef,
				sendRef: netSend
			}) : null,
			snap && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 gap-3 overflow-x-auto border-b border-line px-3 py-2 font-mono text-xs md:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["W ", snap.warp.toFixed(1)] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: snap.hull / snap.hullMax < .3 ? "text-alert" : "",
						children: [
							"HULL ",
							Math.round(snap.hull / snap.hullMax * 100),
							"%"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"SH ",
						Math.round(snap.shield),
						"%"
					] }),
					snap.crystalsMax > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["XL ", snap.crystals] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-amber",
						children: ["+", snap.unbanked]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 flex-col md:flex-row",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "hidden w-60 shrink-0 overflow-y-auto border-r border-line p-3 md:block",
						children: snap && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { snap })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-h-0 min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
								ref: canvasRef,
								onPointerDown: onPointer,
								className: "h-full w-full touch-none",
								"aria-label": "Tactical display"
							}),
							snap?.docked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pointer-events-none absolute top-3 left-3 border border-amber bg-bg/90 px-3 py-2 font-mono text-xs text-amber",
								children: [
									"DOCKED · ",
									snap.dockName,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-fg",
										children: "Gold is in the vault. Press U to undock."
									})
								]
							}),
							snap && !snap.docked && snap.phase === "play" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "pointer-events-none absolute bottom-3 left-3 max-w-xs font-mono text-xs text-muted",
								children: snap.hint
							}),
							snap?.phase === "dead" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 flex items-center justify-center bg-bg/75 p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "w-full max-w-sm border border-alert bg-surface p-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-xs tracking-widest text-alert",
											children: "SHIP DESTROYED"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
											className: "mt-2 font-sans text-xl font-semibold",
											children: ["Lost to ", snap.killedBy]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
											className: "mt-4 space-y-1 font-mono text-xs",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
													k: "Vault",
													v: snap.banked.toLocaleString("en-US")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
													k: "Unbanked lost",
													v: String(snap.unbanked)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
													k: "Damage given",
													v: snap.dmgGiven.toLocaleString("en-US")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
													k: "Kills",
													v: String(snap.kills)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
													k: "Time",
													v: clock(snap.survived)
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-5 flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "h-11 flex-1 bg-amber font-semibold text-bg",
												onClick: () => act((sim) => {
													sim.relaunch();
												}),
												children: "Relaunch"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "h-11 flex-1 border border-line",
												onClick: onLeave,
												children: "Shipyard"
											})]
										})
									]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "hidden min-h-0 w-64 shrink-0 flex-col border-l border-line md:flex",
						children: snap && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scanner, {
							snap,
							onLock: (id) => act((sim) => sim.lockShip(id))
						})
					})
				]
			}),
			snap && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0 border-t border-line md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scanner, {
					snap,
					onLock: (id) => act((sim) => sim.lockShip(id)),
					compact: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid shrink-0 grid-cols-4 gap-1 border-t border-line p-2 md:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pad, {
						label: "Left",
						on: hold,
						kind: "left"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pad, {
						label: "Warp+",
						on: hold,
						kind: "up"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pad, {
						label: "Warp−",
						on: hold,
						kind: "down"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pad, {
						label: "Right",
						on: hold,
						kind: "right"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pad, {
						label: "Phaser",
						on: hold,
						kind: "phaser"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pad, {
						label: "Torpedo",
						on: hold,
						kind: "torp"
					}),
					(snap?.dronesMax ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pad, {
						label: "Drone",
						on: hold,
						kind: "drone"
					}),
					(snap?.minesMax ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pad, {
						label: "Mine",
						on: hold,
						kind: "mine"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-12 border border-line font-mono text-xs",
						onClick: () => act((s) => s.toggleRaise()),
						children: "Shields"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-12 border border-line font-mono text-xs",
						onClick: () => act((s) => s.player.docked ? s.requestUndock() : s.requestDock()),
						children: "Dock"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "hidden shrink-0 items-center gap-3 border-t border-line px-4 py-2 md:flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "min-w-0 flex-1 truncate font-mono text-xs text-muted",
					children: "W/S warp · A/D turn · click lock or course · Space phasers · T torpedoes · G drones · M mines · R shields · C repair · Z cloak · I intercept · . dock · U undock"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex",
					onSubmit: (e) => {
						e.preventDefault();
						sendHail();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: hail,
						onChange: (e) => setHail(e.target.value),
						placeholder: "Hail the quadrant",
						"aria-label": "Hail",
						className: "w-56 border border-line bg-surface px-2 py-1.5 font-mono text-xs text-fg outline-none focus:border-amber"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "border border-l-0 border-line px-3 font-mono text-xs",
						children: "Send"
					})]
				})]
			}),
			(paused || help) && snap?.phase !== "dead" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-10 flex items-center justify-center bg-bg/80 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md border border-line bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs tracking-widest text-amber",
							children: help ? "COMMANDS" : "PAUSED"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-sans text-xl font-semibold",
							children: help ? "How to fight" : snap?.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-1 font-mono text-xs leading-relaxed text-fg",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The top of the window is the radar. The bottom is the forward view. Click either one to lock a ship. Blue phasers are yours. Red phasers are theirs." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "A turns left, D turns right. Click empty space to come about." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Click a ship to lock. Locked torpedoes curve in. Unlocked ones fly straight." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Phasers need a lock or a target in the forward arc. ESI hits everyone in range. Agonizers are flat and spend a torpedo. G launches a drone. M drops a mine." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Dock inside 100 units under warp 1.4. Gold paid there is (damage + veteran bonus) / 10. Klingon obliterators return one every two seconds." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "R raises shields. Shift+R drops them. C repairs the hull. Dilithium soaks damage that gets through the shields and refills when you dock. Planets trickle energy." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Wormholes open and shut about once a minute. Cloaked ships cannot enter, and the same ship must wait a minute to transit again." })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-11 flex-1 bg-amber font-semibold text-bg",
								onClick: () => {
									setPaused(false);
									setHelp(false);
								},
								children: "Resume"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-11 flex-1 border border-line",
								onClick: onLeave,
								children: "Leave quadrant"
							})]
						})
					]
				})
			})
		]
	});
}
function Status({ snap }) {
	const hullPct = snap.hullMax > 0 ? snap.hull / snap.hullMax : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 font-mono text-xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				k: "WARP",
				v: `${snap.warp.toFixed(1)} / ${snap.maxWarp}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				k: "HEADING",
				v: pad3(snap.heading)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
				k: "ENERGY",
				pct: snap.energy / snap.energyMax
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
				k: "SHIELDS",
				pct: snap.shield / 100,
				hot: snap.shield < 30
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
				k: "HULL",
				pct: hullPct,
				hot: hullPct < .3
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				k: snap.torpName.toUpperCase(),
				v: `${snap.torps} / ${snap.torpMax}`
			}),
			snap.dronesMax > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				k: "DRONES",
				v: `${snap.drones} / ${snap.dronesMax}`
			}),
			snap.minesMax > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				k: "MINES",
				v: `${snap.mines} / ${snap.minesMax}`
			}),
			snap.crystalsMax > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				k: "CRYSTALS",
				v: `${snap.crystals} / ${snap.crystalsMax}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				k: "WORMHOLE",
				v: snap.holeOpen ? "OPEN" : "DARK"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				k: "CLOAK",
				v: snap.canCloak ? snap.cloakOn ? "ON" : "OFF" : "NONE"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				k: "REPAIR",
				v: snap.repair ? "ON" : "OFF"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				k: "SHIELD ORD",
				v: snap.shieldsUp ? "RAISE" : "HOLD"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				k: "INTERCEPT",
				v: snap.intercept ? "ON" : "OFF"
			}),
			snap.transwarp && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				k: "TRANSWARP",
				v: snap.twReady ? "READY" : "CYCLING"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-line pt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "BANKED",
						v: snap.banked.toLocaleString("en-US")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "UNBANKED",
						v: String(snap.unbanked)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "DMG GVN",
						v: snap.dmgGiven.toLocaleString("en-US")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "KILLS",
						v: String(snap.kills)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "TIME",
						v: clock(snap.survived)
					})
				]
			}),
			hullPct < .3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pulse-alert text-alert",
				children: "HULL CRITICAL"
			})
		]
	});
}
function Scanner({ snap, onLock, compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex min-h-0 flex-col ${compact ? "max-h-28" : "h-full"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-line px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs tracking-widest text-muted",
					children: "SCANNER"
				}), snap.target ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 font-mono text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-alert",
							children: [
								snap.target.letter,
								" ",
								snap.target.name
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted",
							children: [
								snap.target.code,
								" · ",
								Math.round(snap.target.dist),
								" · W",
								snap.target.warp.toFixed(1)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"SH ",
							Math.round(snap.target.shield),
							"% · HULL",
							" ",
							Math.round(snap.target.hull / snap.target.hullMax * 100),
							"%",
							snap.target.cloaked ? " · CLOAK" : "",
							snap.target.docked ? " · DOCKED" : ""
						] })
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-mono text-xs text-muted",
					children: "No lock."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "min-h-0 flex-1 overflow-y-auto",
				children: snap.roster.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: row.isPlayer || !row.alive || !row.seen,
					onClick: () => onLock(row.id),
					className: `flex w-full items-center justify-between gap-2 px-3 py-2 text-left font-mono text-xs ${snap.target?.id === row.id ? "bg-surface-2 text-alert" : "text-fg"} disabled:text-muted`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "truncate",
						children: [
							row.letter,
							" ",
							row.name,
							!row.alive ? " DESTROYED" : row.docked ? " DOCK" : ""
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 text-muted",
						children: row.dist === null ? "—" : Math.round(row.dist)
					})]
				}) }, row.id))
			}),
			!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-36 overflow-y-auto border-t border-line px-3 py-2",
				children: snap.messages.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `font-mono text-xs leading-relaxed ${line.tone === "alert" ? "text-alert" : line.tone === "amber" ? "text-amber" : "text-muted"}`,
					children: line.text
				}, `${i}-${line.text}`))
			})
		]
	});
}
function Stat({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: v })]
	});
}
function Bar({ k, pct, hot = false }) {
	const width = `${Math.max(0, Math.min(100, pct * 100))}%`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-1 flex justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: hot ? "text-alert" : "",
			children: [Math.round(pct * 100), "%"]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-1.5 bg-surface-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `h-full ${hot ? "bg-alert" : "bg-amber"}`,
			style: { width }
		})
	})] });
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: v })]
	});
}
function Pad({ label, kind, on }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "h-12 touch-none border border-line font-mono text-xs",
		onPointerDown: (e) => {
			e.preventDefault();
			on(kind, true);
		},
		onPointerUp: () => on(kind, false),
		onPointerLeave: () => on(kind, false),
		onPointerCancel: () => on(kind, false),
		children: label
	});
}
function Shipyard({ onStart }) {
	const [classId, setClassId] = (0, import_react.useState)(CLASSES[0].id);
	const [name, setName] = (0, import_react.useState)("USS Intrepid");
	const [scores, setScores] = (0, import_react.useState)([]);
	const [real, setReal] = (0, import_react.useState)(true);
	const [room, setRoom] = (0, import_react.useState)("");
	const selected = CLASSES.find((c) => c.id === classId) ?? CLASSES[0];
	(0, import_react.useEffect)(() => {
		const saved = loadCallsign();
		setName(saved.name);
		if (CLASSES.some((c) => c.id === saved.classId)) setClassId(saved.classId);
		setScores(loadScores());
		const clean = (new URLSearchParams(window.location.search).get("room") ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
		if (clean) setRoom(clean);
	}, []);
	const launch = () => {
		const trimmed = name.trim().slice(0, 18) || "USS Intrepid";
		const code = room.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
		saveCallsign(trimmed, selected.id);
		const url = new URL(window.location.href);
		if (code) url.searchParams.set("room", code);
		else url.searchParams.delete("room");
		window.history.replaceState(null, "", url);
		onStart(trimmed, selected.id, code || null);
	};
	const copyLink = async () => {
		const code = room.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
		if (!code) return;
		const url = new URL(window.location.href);
		url.searchParams.set("room", code);
		window.history.replaceState(null, "", url);
		try {
			await navigator.clipboard.writeText(url.toString());
		} catch {}
	};
	const sheet = SHEETS[selected.id];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh min-h-0 flex-col overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "shrink-0 border-b border-line px-4 py-4 md:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs tracking-widest text-amber",
						children: "PORT 1701 · QUADRANT ALPHA"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-sans text-3xl font-semibold tracking-tight",
						children: "MTrek"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-2xl text-sm leading-relaxed text-muted",
							children: "A browser port of the real-time starship duel. Damage becomes gold-pressed latinum only after you dock. If the hull goes, unbanked bars go with it."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							role: "switch",
							"aria-checked": real,
							onClick: () => setReal((on) => !on),
							className: "flex shrink-0 items-center gap-2 border border-line bg-surface px-3 py-2 font-mono text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `relative h-5 w-9 border ${real ? "border-amber bg-amber" : "border-line bg-bg"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute top-0.5 h-3.5 w-3.5 ${real ? "right-0.5 bg-bg" : "left-0.5 bg-muted"}` })
							}), "Show real stats"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 flex-col md:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex shrink-0 gap-2 overflow-x-auto border-b border-line p-3 md:min-h-0 md:w-80 md:shrink-0 md:flex-col md:overflow-y-auto md:border-r md:border-b-0",
					children: CLASSES.map((cls) => {
						const on = cls.id === selected.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setClassId(cls.id),
							className: `flex min-w-52 shrink-0 items-center gap-3 border px-3 py-3 text-left md:min-w-0 ${on ? "border-amber bg-surface-2" : "border-line bg-surface"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: `/ships/${cls.id.toLowerCase()}.png`,
								alt: "",
								className: "h-16 w-16 shrink-0 object-contain"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block font-mono text-xs text-amber",
										children: cls.code
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block font-sans text-sm font-semibold",
										children: cls.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-0.5 block text-xs text-muted",
										children: [cls.race, real && SHEETS[cls.id] ? ` · W${SHEETS[cls.id].cruise} · S${SHEETS[cls.id].shield}` : ` · W${cls.maxWarp} · H${cls.hull}`]
									})
								]
							})]
						}, cls.id);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-end justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-end gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: `/ships/${selected.id.toLowerCase()}.png`,
									alt: "",
									className: "h-24 w-24 object-contain"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs text-amber",
									children: selected.race.toUpperCase()
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-sans text-2xl font-semibold",
									children: selected.name
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "max-w-md text-right font-mono text-xs text-muted",
								children: [
									real && sheet ? sheet.home.toUpperCase() : selected.home,
									selected.cloak ? " · CLOAK" : "",
									selected.transwarp ? " · TRANSWARP" : "",
									selected.teleport ? " · TELEPORTER" : "",
									(selected.drones ?? 0) > 0 ? " · DRONES" : "",
									(selected.mines ?? 0) > 0 ? " · MINES" : "",
									selected.agonizer ? " · AGONIZER" : "",
									selected.regenTorp ? " · REGEN TORPS" : "",
									selected.esi ? " · ESI PHASERS" : ""
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-xl text-sm leading-relaxed text-muted",
							children: selected.blurb
						}),
						real ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-mono text-xs tracking-widest text-muted",
									children: "CLASS TABLE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-relaxed text-muted",
									children: "mtrek.com sheet. Warp is turn / cruise / damage. Energy in parentheses is the table maximum."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 overflow-x-auto border border-line",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "w-full min-w-[720px] border-collapse font-mono text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
											className: "bg-surface-2 text-muted",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-2 py-2 text-left font-normal",
													children: "CLASS"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-2 py-2 text-left font-normal",
													children: "WARP"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-2 py-2 text-left font-normal",
													children: "ENERGY"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-2 py-2 text-right font-normal",
													children: "IE"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-2 py-2 text-right font-normal",
													children: "SHLD"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-2 py-2 text-right font-normal",
													children: "DMG%"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-2 py-2 text-right font-normal",
													children: "SCAN"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-2 py-2 text-left font-normal",
													children: "PHASERS"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-2 py-2 text-left font-normal",
													children: "TORPEDOES"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-2 py-2 text-left font-normal",
													children: "DRONES"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-2 py-2 text-left font-normal",
													children: "MINES"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-2 py-2 text-right font-normal",
													children: "CREW"
												})
											] })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: CLASSES.map((cls) => {
											const row = SHEETS[cls.id];
											if (!row) return null;
											const on = cls.id === selected.id;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: on ? "bg-surface-2 text-fg" : "bg-surface text-muted",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "border-t border-line px-2 py-2",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															onClick: () => setClassId(cls.id),
															className: `text-left ${on ? "text-amber" : "text-fg"}`,
															children: cls.code
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "border-t border-line px-2 py-2 whitespace-nowrap",
														children: [
															row.turn,
															"/",
															row.cruise,
															"/",
															row.damageWarp
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "border-t border-line px-2 py-2 whitespace-nowrap",
														children: row.warpEnergy
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "border-t border-line px-2 py-2 text-right",
														children: row.impulse
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "border-t border-line px-2 py-2 text-right",
														children: row.shield
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "border-t border-line px-2 py-2 text-right",
														children: row.damagePct
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "border-t border-line px-2 py-2 text-right",
														children: row.scan.toLocaleString("en-US")
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "border-t border-line px-2 py-2 whitespace-nowrap",
														children: row.phasers
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "border-t border-line px-2 py-2 whitespace-nowrap",
														children: row.torpedoes
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "border-t border-line px-2 py-2 whitespace-nowrap",
														children: row.drones
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "border-t border-line px-2 py-2 whitespace-nowrap",
														children: row.mines
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "border-t border-line px-2 py-2 text-right",
														children: row.crew
													})
												]
											}, cls.id);
										}) })]
									})
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-6 max-w-3xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-mono text-xs tracking-widest text-muted",
									children: "THIS QUADRANT"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-relaxed text-muted",
									children: "Numbers the patrol actually uses. The map is smaller than a telnet quadrant, so ranges are scaled."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
									className: "mt-3 grid grid-cols-2 gap-px bg-line sm:grid-cols-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
											k: "CRUISE",
											v: String(selected.cruise)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
											k: "MAX WARP",
											v: String(selected.maxWarp)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
											k: "TURN",
											v: selected.turn.toFixed(2)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
											k: "HULL",
											v: String(selected.hull)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
											k: "SHIELD",
											v: String(selected.shieldStr)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
											k: "ENERGY",
											v: String(selected.energy)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
											k: "SCAN",
											v: selected.scan.toLocaleString("en-US")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
											k: "PHASERS",
											v: `${selected.phaser} · ${selected.phaserRange}`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
											k: "CLOAK",
											v: selected.cloak ? "Yes" : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
											k: "TORPEDOES",
											v: `${selected.torpName} · ${selected.magazine} · ${selected.torpMin}–${selected.torpMax}`,
											wide: true
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
											k: "DRONES",
											v: selected.drones ? `${selected.drones} × ${selected.droneDmg ?? 0}` : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
											k: "MINES",
											v: selected.mines ? `${selected.mines} × ${selected.mineDmg ?? 0}` : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
											k: "CRYSTALS",
											v: selected.crystals ? String(selected.crystals) : "—"
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 grid gap-6 md:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-mono text-xs tracking-widest text-muted",
									children: "CONN"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "mt-2 space-y-1 font-mono text-xs leading-relaxed text-fg",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "W / S warp up and down" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "A / D turn left and right" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Click a ship to lock, space to set course" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Space or F phasers, T torpedoes" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "R raise shields, Shift+R drop them" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "C damage control, Z cloak, I intercept" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "X transwarp, G drones, M mines, period dock when alongside" })
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-mono text-xs tracking-widest text-muted",
										children: "ENGINES"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm leading-relaxed text-muted",
										children: "Gold at a starbase is (damage + veteran bonus) / 10, the JavaTrek dock payout. A destroyed ship drops the bars aboard, up to 1000 plus a tenth of the rest. Wormholes open and shut about once a minute. A cloak will not fit, and the same mouth waits a minute to take you again."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm leading-relaxed text-muted",
										children: "JavaTrek (GPL) is Joe Hopkinson and Jay Ashworth’s engine, from Chuck L. Peterson’s 1986 MTrek. Upstream is SourceForge and the rumour/jtrek tree. The live games are telnet, not this page: mtrek.com 1701, javatrek.org 1764, rbop.net 2000. Steve Scherf kept the 1993 C source. Justin Flude made that build run again (mtrek.site 1993, justinflude.org 1993)."
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-mono text-xs tracking-widest text-muted",
									children: "VAULT"
								}), scores.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted",
									children: "No ship has banked gold in this browser yet."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
									className: "mt-2 space-y-1 font-mono text-xs",
									children: scores.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "truncate",
											children: [
												row.name,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted",
													children: row.code
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-gold",
											children: row.gold.toLocaleString("en-US")
										})]
									}, `${row.name}-${row.code}`))
								})] })
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "flex shrink-0 flex-col gap-2 border-t border-line px-4 py-3 md:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs text-muted",
									children: "ROOM CODE"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: room,
									onChange: (e) => setRoom(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6)),
									maxLength: 6,
									placeholder: "Solo if empty",
									"aria-label": "Room code",
									className: "mt-1 w-full border border-line bg-surface px-3 py-2 font-mono text-sm text-fg outline-none focus:border-amber"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
									let code = "";
									for (let i = 0; i < 4; i++) code += alphabet[Math.floor(Math.random() * 32)];
									setRoom(code);
								},
								className: "h-11 border border-line px-3 font-mono text-xs",
								children: "New room"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void copyLink(),
								className: "h-11 border border-line px-3 font-mono text-xs",
								children: "Copy link"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs text-muted",
						children: "Same code, same site, shared quadrant. Up to eight ships. The handshake stays on this server. The fight goes browser to browser, so a published copy hosts itself."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-muted",
								children: "SHIP NAME"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: name,
								onChange: (e) => setName(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter") launch();
								},
								maxLength: 18,
								"aria-label": "Ship name",
								className: "mt-1 w-full border border-line bg-surface px-3 py-2 font-mono text-sm text-fg outline-none focus:border-amber"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: launch,
							className: "h-11 shrink-0 bg-amber px-6 font-sans text-sm font-semibold text-bg",
							children: "Start"
						})]
					})
				]
			})
		]
	});
}
function Cell({ k, v, wide = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `bg-surface px-3 py-2 ${wide ? "col-span-2 sm:col-span-3" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "font-mono text-[10px] tracking-widest text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-0.5 font-mono text-sm text-fg",
			children: v
		})]
	});
}
function Home() {
	const [flight, setFlight] = (0, import_react.useState)(null);
	if (!flight) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shipyard, { onStart: (name, classId, room) => setFlight({
		name,
		classId,
		id: Date.now(),
		room
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bridge, {
		name: flight.name,
		classId: flight.classId,
		room: flight.room,
		onLeave: () => setFlight(null)
	}, flight.id);
}
//#endregion
export { Home as component };
