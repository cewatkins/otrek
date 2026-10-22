import { o as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { i as classById, n as SHEETS, r as authMiddleware, t as CLASSES } from "./middleware-CtNNedZm.mjs";
import { i as signOut, r as signIn, t as authClient } from "./client-IWHfIGH2.mjs";
import { a as hasGateSessionMarker, t as GROK_PROVIDERS } from "./server-KFmP1YzR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CzspY47P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ctx = null;
var master = null;
function unlockAudio() {
	if (typeof window === "undefined") return;
	if (!ctx) ctx = new AudioContext();
	if (ctx.state === "suspended") ctx.resume();
}
function out() {
	if (!ctx) return null;
	if (!master) {
		master = ctx.createGain();
		master.gain.value = .33;
		master.connect(ctx.destination);
	}
	return master;
}
function tone(freq, dur, type, gain, slide = 0) {
	const dest = out();
	if (!ctx || !dest || ctx.state !== "running") return;
	const t = ctx.currentTime;
	const osc = ctx.createOscillator();
	const amp = ctx.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(freq, t);
	if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
	amp.gain.setValueAtTime(gain, t);
	amp.gain.exponentialRampToValueAtTime(1e-4, t + dur);
	osc.connect(amp);
	amp.connect(dest);
	osc.start(t);
	osc.stop(t + dur + .02);
}
function burst(freq, q, dur, gain) {
	const dest = out();
	if (!ctx || !dest || ctx.state !== "running") return;
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
	amp.connect(dest);
	src.start(t);
	src.stop(t + dur + .02);
}
var hailBuf = null;
var hailLoading = false;
function playHailBuffer() {
	const dest = out();
	if (!ctx || !dest || ctx.state !== "running" || !hailBuf) return;
	const src = ctx.createBufferSource();
	const amp = ctx.createGain();
	src.buffer = hailBuf;
	amp.gain.setValueAtTime(.55, ctx.currentTime);
	src.connect(amp);
	amp.connect(dest);
	src.start();
}
var introBus = null;
var introOn = false;
var introTimer = null;
var introNodes = [];
var PHRASE = [
	196,
	247,
	294,
	392,
	494,
	392,
	330,
	247
];
function toneAt(freq, when, dur, type, gain, dest) {
	if (!ctx) return;
	const osc = ctx.createOscillator();
	const amp = ctx.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(freq, when);
	amp.gain.setValueAtTime(1e-4, when);
	amp.gain.exponentialRampToValueAtTime(gain, when + .08);
	amp.gain.exponentialRampToValueAtTime(1e-4, when + dur);
	osc.connect(amp);
	amp.connect(dest);
	introNodes.push(osc);
	osc.onended = () => {
		const i = introNodes.indexOf(osc);
		if (i >= 0) introNodes.splice(i, 1);
	};
	osc.start(when);
	osc.stop(when + dur + .05);
}
function queuePhrase() {
	if (!ctx || !introBus || !introOn) return;
	const start = ctx.currentTime + .06;
	const step = .62;
	PHRASE.forEach((freq, i) => {
		const when = start + i * step;
		toneAt(freq, when, .9, "triangle", .045, introBus);
		toneAt(freq / 2, when, 1.05, "sine", .03, introBus);
	});
	toneAt(98, start, PHRASE.length * step, "sine", .02, introBus);
	introTimer = setTimeout(() => queuePhrase(), PHRASE.length * step * 1e3);
}
var sfx = {
	/** Title cue. Returns false until the browser lets audio run. */
	intro() {
		unlockAudio();
		if (!ctx || ctx.state !== "running") return false;
		if (introOn) return true;
		introOn = true;
		introBus = ctx.createGain();
		introBus.gain.setValueAtTime(1e-4, ctx.currentTime);
		introBus.gain.exponentialRampToValueAtTime(1, ctx.currentTime + .35);
		introBus.connect(ctx.destination);
		queuePhrase();
		return true;
	},
	stopIntro() {
		introOn = false;
		if (introTimer) clearTimeout(introTimer);
		introTimer = null;
		for (const osc of introNodes) try {
			osc.stop();
		} catch {}
		introNodes.length = 0;
		if (introBus) {
			try {
				introBus.disconnect();
			} catch {}
			introBus = null;
		}
	},
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
	},
	/** Boatswain's call, the ship hail. CC0 recording, Wikimedia Commons. */
	hail() {
		unlockAudio();
		if (!ctx || ctx.state !== "running") return;
		if (hailBuf) {
			playHailBuffer();
			return;
		}
		if (hailLoading) return;
		hailLoading = true;
		fetch("/sfx/hail.ogg").then((res) => res.arrayBuffer()).then((raw) => ctx?.decodeAudioData(raw)).then((buf) => {
			if (!buf) return;
			hailBuf = buf;
			playHailBuffer();
		}).catch(() => {
			hailLoading = false;
		});
	}
};
var CHART = [
	{
		id: "SB1",
		num: 1,
		name: "Starbase 1",
		kind: "base",
		code: "L M D",
		quad: "A",
		x: 4083.8,
		y: 5501.8,
		z: 4470,
		r: 22,
		dock: true,
		feed: false
	},
	{
		id: "SB2",
		num: 2,
		name: "Starbase 2",
		kind: "base",
		code: "T",
		quad: "A",
		x: 5478.5,
		y: 5188.7,
		z: 3846.3,
		r: 22,
		dock: true,
		feed: false
	},
	{
		id: "SB3",
		num: 3,
		name: "Starbase 3",
		kind: "base",
		code: "L M D",
		quad: "A",
		x: 4098.8,
		y: 3157.6,
		z: 4590,
		r: 22,
		dock: true,
		feed: false
	},
	{
		id: "SB4",
		num: 4,
		name: "Starbase 4",
		kind: "base",
		code: "T",
		quad: "A",
		x: 3559.1,
		y: 2459.9,
		z: 4420,
		r: 22,
		dock: true,
		feed: false
	},
	{
		id: "SB5",
		num: 5,
		name: "Babylon 5",
		kind: "base",
		code: "L M D",
		quad: "A",
		x: 2859.4,
		y: 2087,
		z: 5001.8,
		r: 22,
		dock: true,
		feed: false
	},
	{
		id: "SB6",
		num: 6,
		name: "Starbase 6",
		kind: "base",
		code: "T",
		quad: "A",
		x: 1739.8,
		y: 2459.9,
		z: 4460,
		r: 22,
		dock: true,
		feed: false
	},
	{
		id: "SB7",
		num: 7,
		name: "K-7",
		kind: "base",
		code: "L M D",
		quad: "A",
		x: 6877.6,
		y: 2559.8,
		z: 4200.1,
		r: 22,
		dock: true,
		feed: false
	},
	{
		id: "SB8",
		num: 8,
		name: "Starbase 8",
		kind: "base",
		code: "T",
		quad: "A",
		x: 7497.3,
		y: 3659.4,
		z: 4540,
		r: 22,
		dock: true,
		feed: false
	},
	{
		id: "SB9",
		num: 9,
		name: "Starbase 9",
		kind: "base",
		code: "L M D",
		quad: "A",
		x: 8087.1,
		y: 5208.7,
		z: 5302.7,
		r: 22,
		dock: true,
		feed: false
	},
	{
		id: "SB10",
		num: 10,
		name: "Starbase 10",
		kind: "base",
		code: "T",
		quad: "A",
		x: 7097.5,
		y: 6558.1,
		z: 4580,
		r: 22,
		dock: true,
		feed: false
	},
	{
		id: "ASTEROIDFIEL",
		num: 0,
		name: "Asteroid Field",
		kind: "hazard",
		code: "",
		quad: "A",
		x: 2899.3,
		y: 5408.6,
		z: 4200.1,
		r: 499.8,
		dock: false,
		feed: false
	},
	{
		id: "BETELGEUSEST",
		num: 0,
		name: "Betelgeuse Star",
		kind: "star",
		code: "",
		quad: "A",
		x: 4898.5,
		y: 4459,
		z: 6549.1,
		r: 90,
		dock: false,
		feed: false
	},
	{
		id: "CYGNUSX1",
		num: 0,
		name: "Cygnus X-1",
		kind: "star",
		code: "",
		quad: "A",
		x: 1294.8,
		y: 5866.8,
		z: 4711.1,
		r: 90,
		dock: false,
		feed: false
	},
	{
		id: "DELTAVEGA",
		num: 0,
		name: "Delta Vega",
		kind: "planet",
		code: "C M D",
		quad: "A",
		x: 2667.4,
		y: 6292.6,
		z: 4380.1,
		r: 48,
		dock: false,
		feed: true
	},
	{
		id: "EARTH",
		num: 0,
		name: "Earth",
		kind: "planet",
		code: "A",
		quad: "A",
		x: 4898.5,
		y: 3956.7,
		z: 4522,
		r: 48,
		dock: true,
		feed: false
	},
	{
		id: "ORGANIA",
		num: 0,
		name: "Organia",
		kind: "planet",
		code: "",
		quad: "A",
		x: 2899.3,
		y: 3759.3,
		z: 5099.7,
		r: 48,
		dock: false,
		feed: false
	},
	{
		id: "GORN",
		num: 0,
		name: "Gorn",
		kind: "planet",
		code: "A",
		quad: "A",
		x: 3699,
		y: 7759.6,
		z: 4905.8,
		r: 48,
		dock: true,
		feed: false
	},
	{
		id: "HYPERION",
		num: 0,
		name: "Hyperion",
		kind: "planet",
		code: "C A",
		quad: "A",
		x: 18644.4,
		y: 15669.4,
		z: 15629.8,
		r: 48,
		dock: true,
		feed: true
	},
	{
		id: "DENEVA",
		num: 0,
		name: "Deneva",
		kind: "planet",
		code: "T",
		quad: "A",
		x: 2579.5,
		y: 6462.1,
		z: 4098.2,
		r: 48,
		dock: false,
		feed: false
	},
	{
		id: "KLIN",
		num: 0,
		name: "Klinzhai",
		kind: "planet",
		code: "A",
		quad: "A",
		x: 8300,
		y: 5966.4,
		z: 4799.9,
		r: 48,
		dock: true,
		feed: false
	},
	{
		id: "LUSUSMINOR",
		num: 0,
		name: "Lusus Minor",
		kind: "planet",
		code: "L T",
		quad: "A",
		x: 18691.3,
		y: 15630,
		z: 15607.5,
		r: 48,
		dock: false,
		feed: false
	},
	{
		id: "MAGRATHEA",
		num: 0,
		name: "Magrathea",
		kind: "planet",
		code: "M D",
		quad: "A",
		x: 18295.7,
		y: 15962,
		z: 15795.1,
		r: 48,
		dock: false,
		feed: false
	},
	{
		id: "MUTARANEBULA",
		num: 0,
		name: "Mutara Nebula",
		kind: "hazard",
		code: "",
		quad: "A",
		x: 4098.5,
		y: 5188.7,
		z: 3846.3,
		r: 449.8,
		dock: false,
		feed: false
	},
	{
		id: "ORION",
		num: 0,
		name: "Orion",
		kind: "planet",
		code: "A",
		quad: "A",
		x: 730.3,
		y: 2525.8,
		z: 5199.7,
		r: 48,
		dock: true,
		feed: false
	},
	{
		id: "WRIGLEY",
		num: 0,
		name: "Wrigley",
		kind: "planet",
		code: "C",
		quad: "A",
		x: 5508.2,
		y: 6192.4,
		z: 4504,
		r: 48,
		dock: false,
		feed: true
	},
	{
		id: "RIGELXII",
		num: 0,
		name: "Rigel XII",
		kind: "planet",
		code: "C",
		quad: "A",
		x: 2929.3,
		y: 5092.8,
		z: 4839.9,
		r: 48,
		dock: false,
		feed: true
	},
	{
		id: "ROM",
		num: 0,
		name: "Romulus",
		kind: "planet",
		code: "A FC",
		quad: "A",
		x: 6707.7,
		y: 1240.4,
		z: 4177.1,
		r: 48,
		dock: true,
		feed: false
	},
	{
		id: "SARGASSONEBU",
		num: 0,
		name: "Sargasso Nebula",
		kind: "hazard",
		code: "",
		quad: "A",
		x: 18342.6,
		y: 16150.1,
		z: 16852,
		r: 449.8,
		dock: false,
		feed: false
	},
	{
		id: "THOLEANSPACE",
		num: 0,
		name: "Tholean Space",
		kind: "hazard",
		code: "",
		quad: "A",
		x: 700,
		y: 3556.2,
		z: 4297.1,
		r: 449.8,
		dock: false,
		feed: false
	},
	{
		id: "URSUSOUTPOST",
		num: 0,
		name: "Ursus Outpost",
		kind: "planet",
		code: "",
		quad: "A",
		x: 18174.7,
		y: 15905.7,
		z: 15427.3,
		r: 26,
		dock: false,
		feed: false
	},
	{
		id: "VULCAN",
		num: 0,
		name: "Vulcan",
		kind: "planet",
		code: "C",
		quad: "A",
		x: 5303.6,
		y: 2085.3,
		z: 4797.9,
		r: 48,
		dock: true,
		feed: true
	},
	{
		id: "WORMHOLE",
		num: 0,
		name: "Worm Hole",
		kind: "hole",
		code: "",
		quad: "A",
		x: 4698.9,
		y: 4159.8,
		z: 4500.2,
		r: 50,
		dock: false,
		feed: false
	},
	{
		id: "SB11",
		num: 11,
		name: "Starbase 11",
		kind: "base",
		code: "L M D",
		quad: "B",
		x: 4791.4,
		y: 2688.3,
		z: 3279.3,
		r: 30.1,
		dock: true,
		feed: false
	},
	{
		id: "SB12",
		num: 12,
		name: "Starbase 12",
		kind: "base",
		code: "T",
		quad: "B",
		x: 7821.9,
		y: 3197.5,
		z: 5383.8,
		r: 30.1,
		dock: true,
		feed: false
	},
	{
		id: "SB13",
		num: 13,
		name: "Starbase 13",
		kind: "base",
		code: "L M D",
		quad: "B",
		x: 5356.2,
		y: 6014.3,
		z: 475.6,
		r: 30.1,
		dock: true,
		feed: false
	},
	{
		id: "SB14",
		num: 14,
		name: "Starbase 14",
		kind: "base",
		code: "T",
		quad: "B",
		x: 4425.9,
		y: 7893.9,
		z: 8457.4,
		r: 30.1,
		dock: true,
		feed: false
	},
	{
		id: "SB15",
		num: 15,
		name: "Starbase 15",
		kind: "base",
		code: "L M D",
		quad: "B",
		x: 3436.9,
		y: 6277.9,
		z: 687.4,
		r: 30.1,
		dock: true,
		feed: false
	},
	{
		id: "SB16",
		num: 16,
		name: "Starbase 16",
		kind: "base",
		code: "T",
		quad: "B",
		x: 1539.2,
		y: 6592.1,
		z: 4103.8,
		r: 30.1,
		dock: true,
		feed: false
	},
	{
		id: "SB17",
		num: 17,
		name: "Starbase 17",
		kind: "base",
		code: "L M D",
		quad: "B",
		x: 700,
		y: 4186.5,
		z: 4791.7,
		r: 30.1,
		dock: true,
		feed: false
	},
	{
		id: "SB18",
		num: 18,
		name: "Starbase 18",
		kind: "base",
		code: "T",
		quad: "B",
		x: 1659.2,
		y: 2907.6,
		z: 2309.4,
		r: 30.1,
		dock: true,
		feed: false
	},
	{
		id: "SB19",
		num: 19,
		name: "Starbase 19",
		kind: "base",
		code: "L M D",
		quad: "B",
		x: 2002.3,
		y: 1405.9,
		z: 5861.7,
		r: 30.1,
		dock: true,
		feed: false
	},
	{
		id: "SB20",
		num: 20,
		name: "Starbase 20",
		kind: "base",
		code: "T",
		quad: "B",
		x: 4271.1,
		y: 899.6,
		z: 5534.5,
		r: 30.1,
		dock: true,
		feed: false
	},
	{
		id: "ARRAKIS",
		num: 0,
		name: "Arrakis",
		kind: "planet",
		code: "C",
		quad: "B",
		x: 2146,
		y: 4186.5,
		z: 5330.6,
		r: 65.6,
		dock: false,
		feed: true
	},
	{
		id: "BRACHISTOCHR",
		num: 0,
		name: "Brachistochrone",
		kind: "planet",
		code: "T N I MB",
		quad: "B",
		x: 3017.5,
		y: 1013.2,
		z: 1333.5,
		r: 65.6,
		dock: false,
		feed: false
	},
	{
		id: "CYGNUSX2",
		num: 0,
		name: "Cygnus X-2",
		kind: "star",
		code: "",
		quad: "B",
		x: 1155.6,
		y: 8264.1,
		z: 3608,
		r: 122.9,
		dock: false,
		feed: false
	},
	{
		id: "DANA",
		num: 0,
		name: "Dana",
		kind: "planet",
		code: "A",
		quad: "B",
		x: 4417.7,
		y: 1224.9,
		z: 7378.3,
		r: 65.6,
		dock: true,
		feed: false
	},
	{
		id: "ENCINITAS",
		num: 0,
		name: "Encinitas",
		kind: "planet",
		code: "",
		quad: "B",
		x: 3962.8,
		y: 5265.7,
		z: 2054.8,
		r: 65.6,
		dock: false,
		feed: false
	},
	{
		id: "FOMALHAUT",
		num: 0,
		name: "Fomalhaut",
		kind: "planet",
		code: "",
		quad: "B",
		x: 6812.4,
		y: 4791.7,
		z: 5281.4,
		r: 65.6,
		dock: false,
		feed: false
	},
	{
		id: "GAUSS",
		num: 0,
		name: "Gauss",
		kind: "planet",
		code: "T",
		quad: "B",
		x: 4160.6,
		y: 3338.6,
		z: 4257.9,
		r: 65.6,
		dock: false,
		feed: false
	},
	{
		id: "HAWSERION",
		num: 0,
		name: "Hawserion",
		kind: "planet",
		code: "C",
		quad: "B",
		x: 1600.9,
		y: 7004.6,
		z: 1747.4,
		r: 65.6,
		dock: false,
		feed: true
	},
	{
		id: "ION",
		num: 0,
		name: "Ion",
		kind: "planet",
		code: "FC",
		quad: "B",
		x: 7091,
		y: 3547.2,
		z: 4352.5,
		r: 65.6,
		dock: false,
		feed: false
	},
	{
		id: "JOVIA",
		num: 0,
		name: "Jovia",
		kind: "planet",
		code: "",
		quad: "B",
		x: 3656.8,
		y: 5553.9,
		z: 5732.2,
		r: 65.6,
		dock: false,
		feed: false
	},
	{
		id: "KALIASTEROID",
		num: 0,
		name: "Kali Asteroid Zone",
		kind: "hazard",
		code: "",
		quad: "B",
		x: 8300,
		y: 1484.5,
		z: 3042.4,
		r: 683,
		dock: false,
		feed: false
	},
	{
		id: "LETHARGY",
		num: 0,
		name: "Lethargy",
		kind: "planet",
		code: "",
		quad: "B",
		x: 3177.3,
		y: 5372.2,
		z: 1548,
		r: 65.6,
		dock: false,
		feed: false
	},
	{
		id: "MALIBU",
		num: 0,
		name: "Malibu Beta 6",
		kind: "planet",
		code: "A",
		quad: "B",
		x: 1039.5,
		y: 735.9,
		z: 8114.6,
		r: 65.6,
		dock: true,
		feed: false
	},
	{
		id: "NEWTONIUM",
		num: 0,
		name: "Newtonium",
		kind: "planet",
		code: "M",
		quad: "B",
		x: 4586,
		y: 3836.2,
		z: 4063.1,
		r: 65.6,
		dock: false,
		feed: false
	},
	{
		id: "ORIONOUTPOST",
		num: 0,
		name: "Orion Outpost",
		kind: "planet",
		code: "",
		quad: "B",
		x: 1999.8,
		y: 4742.5,
		z: 6178.9,
		r: 35.5,
		dock: false,
		feed: false
	},
	{
		id: "PLEASUREPLAN",
		num: 0,
		name: "Pleasure Planet",
		kind: "planet",
		code: "C",
		quad: "B",
		x: 8152.5,
		y: 6593.5,
		z: 5998.6,
		r: 65.6,
		dock: false,
		feed: true
	},
	{
		id: "QUASAREPSILO",
		num: 0,
		name: "Quasar Epsilon",
		kind: "star",
		code: "",
		quad: "B",
		x: 5107.5,
		y: 1530.9,
		z: 2456.4,
		r: 122.9,
		dock: false,
		feed: false
	},
	{
		id: "RAMAPULSAR",
		num: 0,
		name: "Rama Pulsar",
		kind: "star",
		code: "",
		quad: "B",
		x: 4480.9,
		y: 8108,
		z: 2254.9,
		r: 122.9,
		dock: false,
		feed: false
	},
	{
		id: "SHIVANEBULA",
		num: 0,
		name: "Shiva Nebula",
		kind: "hazard",
		code: "",
		quad: "B",
		x: 5944.9,
		y: 753.6,
		z: 3392.1,
		r: 614.7,
		dock: false,
		feed: false
	},
	{
		id: "TAUTOCHRONE",
		num: 0,
		name: "Tautochrone",
		kind: "planet",
		code: "C M D",
		quad: "B",
		x: 2876.8,
		y: 1559.6,
		z: 3099.8,
		r: 65.6,
		dock: false,
		feed: true
	},
	{
		id: "UHURA",
		num: 0,
		name: "Uhura",
		kind: "planet",
		code: "",
		quad: "B",
		x: 6596.5,
		y: 5429.6,
		z: 5650.2,
		r: 65.6,
		dock: false,
		feed: false
	},
	{
		id: "VISHNU",
		num: 0,
		name: "Vishnu",
		kind: "planet",
		code: "C D",
		quad: "B",
		x: 4852,
		y: 3237.4,
		z: 4450.5,
		r: 65.6,
		dock: false,
		feed: true
	},
	{
		id: "WORMHOLE",
		num: 0,
		name: "Worm Hole",
		kind: "hole",
		code: "",
		quad: "B",
		x: 4244.5,
		y: 4522.4,
		z: 4500.7,
		r: 68.3,
		dock: false,
		feed: false
	},
	{
		id: "PLANETXBETA",
		num: 0,
		name: "Planet X-Beta",
		kind: "planet",
		code: "",
		quad: "B",
		x: 1382.3,
		y: 3440.6,
		z: 539.8,
		r: 65.6,
		dock: false,
		feed: false
	},
	{
		id: "YAXCI",
		num: 0,
		name: "Yaxci",
		kind: "planet",
		code: "",
		quad: "B",
		x: 942.5,
		y: 5487,
		z: 7181.5,
		r: 65.6,
		dock: false,
		feed: false
	},
	{
		id: "PLANETZBETA",
		num: 0,
		name: "Planet Z-Beta",
		kind: "planet",
		code: "",
		quad: "B",
		x: 7077.4,
		y: 6220.5,
		z: 5459,
		r: 65.6,
		dock: false,
		feed: false
	},
	{
		id: "SB21",
		num: 21,
		name: "Starbase 21",
		kind: "base",
		code: "L M D",
		quad: "G",
		x: 3236,
		y: 4408.1,
		z: 3907.3,
		r: 24.1,
		dock: true,
		feed: false
	},
	{
		id: "SB22",
		num: 22,
		name: "Starbase 22",
		kind: "base",
		code: "T",
		quad: "G",
		x: 7359.6,
		y: 2210.2,
		z: 4952.7,
		r: 24.1,
		dock: true,
		feed: false
	},
	{
		id: "SB23",
		num: 23,
		name: "Starbase 23",
		kind: "base",
		code: "L M D",
		quad: "G",
		x: 7829.8,
		y: 1275.3,
		z: 4925.4,
		r: 24.1,
		dock: true,
		feed: false
	},
	{
		id: "SB24",
		num: 24,
		name: "Starbase 24",
		kind: "base",
		code: "T",
		quad: "G",
		x: 2172.1,
		y: 5205.3,
		z: 2536.1,
		r: 24.1,
		dock: true,
		feed: false
	},
	{
		id: "SB25",
		num: 25,
		name: "Starbase 25",
		kind: "base",
		code: "L M D",
		quad: "G",
		x: 5501.7,
		y: 4080.1,
		z: 5247.9,
		r: 24.1,
		dock: true,
		feed: false
	},
	{
		id: "SB26",
		num: 26,
		name: "Starbase 26",
		kind: "base",
		code: "T",
		quad: "G",
		x: 7420.8,
		y: 3232.6,
		z: 2782.1,
		r: 24.1,
		dock: true,
		feed: false
	},
	{
		id: "SB27",
		num: 27,
		name: "Starbase 27",
		kind: "base",
		code: "L M D",
		quad: "G",
		x: 7271,
		y: 5261.1,
		z: 4325,
		r: 24.1,
		dock: true,
		feed: false
	},
	{
		id: "SB28",
		num: 28,
		name: "Starbase 28",
		kind: "base",
		code: "T",
		quad: "G",
		x: 4932,
		y: 7510.4,
		z: 1410.9,
		r: 24.1,
		dock: true,
		feed: false
	},
	{
		id: "SB29",
		num: 29,
		name: "Starbase 29",
		kind: "base",
		code: "L M D",
		quad: "G",
		x: 4817.2,
		y: 6706.7,
		z: 2121.7,
		r: 24.1,
		dock: true,
		feed: false
	},
	{
		id: "SB30",
		num: 30,
		name: "Starbase 30",
		kind: "base",
		code: "T",
		quad: "G",
		x: 8146.9,
		y: 6583.1,
		z: 4598.4,
		r: 24.1,
		dock: true,
		feed: false
	},
	{
		id: "ALPHACENTAUR",
		num: 0,
		name: "Alpha Centauri",
		kind: "planet",
		code: "M D",
		quad: "G",
		x: 5281,
		y: 2461.9,
		z: 6428.8,
		r: 52.5,
		dock: false,
		feed: false
	},
	{
		id: "BAJOR",
		num: 0,
		name: "Bajor",
		kind: "planet",
		code: "T",
		quad: "G",
		x: 5623.6,
		y: 2137.1,
		z: 6811.3,
		r: 52.5,
		dock: false,
		feed: false
	},
	{
		id: "CARDASSIA",
		num: 0,
		name: "Cardassia",
		kind: "planet",
		code: "A",
		quad: "G",
		x: 5922.7,
		y: 4326.1,
		z: 3630.7,
		r: 52.5,
		dock: true,
		feed: false
	},
	{
		id: "DENEBNEBULA",
		num: 0,
		name: "Deneb Nebula",
		kind: "hazard",
		code: "",
		quad: "G",
		x: 1926,
		y: 4130.4,
		z: 3801.3,
		r: 492.1,
		dock: false,
		feed: false
	},
	{
		id: "ENCALADUSQUA",
		num: 0,
		name: "Encaladus Quasar",
		kind: "star",
		code: "",
		quad: "G",
		x: 2353.6,
		y: 4185.1,
		z: 3514.8,
		r: 98.4,
		dock: false,
		feed: false
	},
	{
		id: "FERRIGULUM",
		num: 0,
		name: "Ferrigulum",
		kind: "planet",
		code: "C FR CM",
		quad: "G",
		x: 8300,
		y: 1783.8,
		z: 4764.6,
		r: 52.5,
		dock: false,
		feed: true
	},
	{
		id: "GALILEOASTER",
		num: 0,
		name: "Galileo Asteroids",
		kind: "hazard",
		code: "",
		quad: "G",
		x: 7004.2,
		y: 2779.9,
		z: 2648.7,
		r: 546.7,
		dock: false,
		feed: false
	},
	{
		id: "HALLEYSCOMET",
		num: 0,
		name: "Halley's Comet",
		kind: "comet",
		code: "",
		quad: "G",
		x: 6341.8,
		y: 4785.6,
		z: 6397,
		r: 30.6,
		dock: false,
		feed: false
	},
	{
		id: "IRATACARINAE",
		num: 0,
		name: "Irata Carinae",
		kind: "planet",
		code: "",
		quad: "G",
		x: 6613.8,
		y: 5165.9,
		z: 2179.6,
		r: 52.5,
		dock: false,
		feed: false
	},
	{
		id: "JUNOASTEROID",
		num: 0,
		name: "Juno Asteroid Zone",
		kind: "hazard",
		code: "",
		quad: "G",
		x: 2099.9,
		y: 4769,
		z: 3164.8,
		r: 546.7,
		dock: false,
		feed: false
	},
	{
		id: "KAHOUTEKCOME",
		num: 0,
		name: "Kahoutek Comet",
		kind: "comet",
		code: "",
		quad: "G",
		x: 7820.4,
		y: 6518.4,
		z: 4810.7,
		r: 30.6,
		dock: false,
		feed: false
	},
	{
		id: "LAGOONNEBULA",
		num: 0,
		name: "Lagoon Nebula",
		kind: "hazard",
		code: "",
		quad: "G",
		x: 8026.6,
		y: 1510.4,
		z: 4739.5,
		r: 492.1,
		dock: false,
		feed: false
	},
	{
		id: "MEGADON",
		num: 0,
		name: "Megadon",
		kind: "planet",
		code: "C M D T A",
		quad: "G",
		x: 7708.4,
		y: 5922.6,
		z: 4461.7,
		r: 52.5,
		dock: true,
		feed: true
	},
	{
		id: "NEBULON",
		num: 0,
		name: "Nebulon",
		kind: "planet",
		code: "C",
		quad: "G",
		x: 1804.6,
		y: 4046.2,
		z: 3976.2,
		r: 52.5,
		dock: false,
		feed: true
	},
	{
		id: "ORIONNEBULA",
		num: 0,
		name: "Orion Nebula",
		kind: "hazard",
		code: "",
		quad: "G",
		x: 5194.5,
		y: 6903.5,
		z: 1738.9,
		r: 492.1,
		dock: false,
		feed: false
	},
	{
		id: "PRAXIS",
		num: 0,
		name: "Praxis",
		kind: "planet",
		code: "C A",
		quad: "G",
		x: 4910.2,
		y: 6263.8,
		z: 2535,
		r: 52.5,
		dock: true,
		feed: true
	},
	{
		id: "QUASAR3C273",
		num: 0,
		name: "Quasar 3C 273",
		kind: "star",
		code: "",
		quad: "G",
		x: 8037.6,
		y: 6692.5,
		z: 4623.6,
		r: 98.4,
		dock: false,
		feed: false
	},
	{
		id: "ROSETTENEBUL",
		num: 0,
		name: "Rosette Nebula",
		kind: "hazard",
		code: "",
		quad: "G",
		x: 5343.2,
		y: 4122.7,
		z: 5581.5,
		r: 492.1,
		dock: false,
		feed: false
	},
	{
		id: "SAGITTARIUS",
		num: 0,
		name: "Sagittarius",
		kind: "planet",
		code: "M",
		quad: "G",
		x: 2858.8,
		y: 6354.6,
		z: 5625.2,
		r: 52.5,
		dock: false,
		feed: false
	},
	{
		id: "TRIANGULUM",
		num: 0,
		name: "Triangulum",
		kind: "planet",
		code: "C",
		quad: "G",
		x: 5713.3,
		y: 2592.9,
		z: 6249.4,
		r: 52.5,
		dock: false,
		feed: true
	},
	{
		id: "URANUSCYGNI",
		num: 0,
		name: "Uranus Cygni",
		kind: "planet",
		code: "",
		quad: "G",
		x: 7154,
		y: 7724.7,
		z: 643.2,
		r: 52.5,
		dock: false,
		feed: false
	},
	{
		id: "VIDICONBETA",
		num: 0,
		name: "Vidicon Beta",
		kind: "planet",
		code: "FC",
		quad: "G",
		x: 3760.9,
		y: 3325.6,
		z: 5105.8,
		r: 52.5,
		dock: false,
		feed: false
	},
	{
		id: "WORMHOLE",
		num: 0,
		name: "Worm Hole",
		kind: "hole",
		code: "",
		quad: "G",
		x: 4423.6,
		y: 5419.6,
		z: 4500.1,
		r: 54.7,
		dock: false,
		feed: false
	},
	{
		id: "XAKAARPULSAR",
		num: 0,
		name: "Xakaar Pulsar",
		kind: "star",
		code: "",
		quad: "G",
		x: 7616.6,
		y: 2024.3,
		z: 5018.3,
		r: 98.4,
		dock: false,
		feed: false
	},
	{
		id: "YXKASTEROIDZ",
		num: 0,
		name: "Yxk Asteroid Zone",
		kind: "hazard",
		code: "",
		quad: "G",
		x: 4631.3,
		y: 7149.5,
		z: 1788.1,
		r: 546.7,
		dock: false,
		feed: false
	},
	{
		id: "ZWICKY",
		num: 0,
		name: "Zwicky",
		kind: "planet",
		code: "",
		quad: "G",
		x: 2694.8,
		y: 1560.7,
		z: 2669.5,
		r: 52.5,
		dock: false,
		feed: false
	},
	{
		id: "CYGNUSX3",
		num: 0,
		name: "Cygnus X-3",
		kind: "star",
		code: "",
		quad: "G",
		x: 700,
		y: 7287.8,
		z: 4730.9,
		r: 98.4,
		dock: false,
		feed: false
	},
	{
		id: "SB31",
		num: 31,
		name: "Starbase 31",
		kind: "base",
		code: "L M D",
		quad: "O",
		x: 5350.7,
		y: 5896.8,
		z: 8149.8,
		r: 53,
		dock: true,
		feed: false
	},
	{
		id: "SB32",
		num: 32,
		name: "Starbase 32",
		kind: "base",
		code: "T",
		quad: "O",
		x: 4772.2,
		y: 7293.3,
		z: 7293.3,
		r: 53,
		dock: true,
		feed: false
	},
	{
		id: "SB33",
		num: 33,
		name: "Starbase 33",
		kind: "base",
		code: "L M D",
		quad: "O",
		x: 7565.6,
		y: 4500,
		z: 7293.3,
		r: 53,
		dock: true,
		feed: false
	},
	{
		id: "SB34",
		num: 34,
		name: "Starbase 34",
		kind: "base",
		code: "T",
		quad: "O",
		x: 8144.2,
		y: 5896.8,
		z: 6011.8,
		r: 53,
		dock: true,
		feed: false
	},
	{
		id: "SB35",
		num: 35,
		name: "Starbase 35",
		kind: "base",
		code: "L M D",
		quad: "O",
		x: 6169,
		y: 1128,
		z: 6011.8,
		r: 53,
		dock: true,
		feed: false
	},
	{
		id: "SB36",
		num: 36,
		name: "Starbase 36",
		kind: "base",
		code: "T",
		quad: "O",
		x: 3375.4,
		y: 1128,
		z: 2988.2,
		r: 53,
		dock: true,
		feed: false
	},
	{
		id: "SB37",
		num: 37,
		name: "Starbase 37",
		kind: "base",
		code: "L M D",
		quad: "O",
		x: 1400.2,
		y: 5896.8,
		z: 2988.2,
		r: 53,
		dock: true,
		feed: false
	},
	{
		id: "SB38",
		num: 38,
		name: "Starbase 38",
		kind: "base",
		code: "T",
		quad: "O",
		x: 1978.9,
		y: 4500,
		z: 1706.7,
		r: 53,
		dock: true,
		feed: false
	},
	{
		id: "SB39",
		num: 39,
		name: "Starbase 39",
		kind: "base",
		code: "L M D",
		quad: "O",
		x: 4772.2,
		y: 7293.3,
		z: 1706.7,
		r: 53,
		dock: true,
		feed: false
	},
	{
		id: "SB40",
		num: 40,
		name: "Starbase 40",
		kind: "base",
		code: "T",
		quad: "O",
		x: 4193.8,
		y: 5896.8,
		z: 850.2,
		r: 53,
		dock: true,
		feed: false
	},
	{
		id: "AAYDIEMMIIIA",
		num: 0,
		name: "Aay'diemm III-A",
		kind: "planet",
		code: "",
		quad: "O",
		x: 6169,
		y: 5078.4,
		z: 850.2,
		r: 115.7,
		dock: false,
		feed: false
	},
	{
		id: "BETACAROTENE",
		num: 0,
		name: "Beta Carotene",
		kind: "planet",
		code: "FC",
		quad: "O",
		x: 3375.4,
		y: 5078.4,
		z: 8149.8,
		r: 115.7,
		dock: false,
		feed: false
	},
	{
		id: "CYGNUSX4",
		num: 0,
		name: "Cygnus X-4",
		kind: "star",
		code: "",
		quad: "O",
		x: 1122.4,
		y: 3449.7,
		z: 6011.8,
		r: 217,
		dock: false,
		feed: false
	},
	{
		id: "DANDELIONOUT",
		num: 0,
		name: "Dandelion Outpost",
		kind: "planet",
		code: "A",
		quad: "O",
		x: 2494.1,
		y: 6778.1,
		z: 6652.7,
		r: 62.7,
		dock: true,
		feed: false
	},
	{
		id: "ELYSIANASTER",
		num: 0,
		name: "Elysian Asteroids",
		kind: "hazard",
		code: "",
		quad: "O",
		x: 7352.9,
		y: 3431.1,
		z: 5090.7,
		r: 1205.6,
		dock: false,
		feed: false
	},
	{
		id: "FROGSTAROUTP",
		num: 0,
		name: "Frogstar Outpost",
		kind: "planet",
		code: "",
		quad: "O",
		x: 4772.2,
		y: 8300,
		z: 5255.9,
		r: 62.7,
		dock: false,
		feed: false
	},
	{
		id: "GAGARANOUTPO",
		num: 0,
		name: "Gagaran Outpost",
		kind: "planet",
		code: "A",
		quad: "O",
		x: 7459.2,
		y: 7187,
		z: 3744.1,
		r: 62.7,
		dock: true,
		feed: false
	},
	{
		id: "HELIXNEBULA",
		num: 0,
		name: "Helix Nebula",
		kind: "hazard",
		code: "",
		quad: "O",
		x: 4840.9,
		y: 6279.2,
		z: 6011.8,
		r: 1085,
		dock: false,
		feed: false
	},
	{
		id: "IDIDIUM",
		num: 0,
		name: "Ididium",
		kind: "planet",
		code: "C",
		quad: "O",
		x: 4957.4,
		y: 3244.7,
		z: 4181.7,
		r: 115.7,
		dock: false,
		feed: true
	},
	{
		id: "JALAPENONEBU",
		num: 0,
		name: "Jalapeno Nebula",
		kind: "hazard",
		code: "",
		quad: "O",
		x: 5350.7,
		y: 3334,
		z: 8149.8,
		r: 1085,
		dock: false,
		feed: false
	},
	{
		id: "KHITTOMEROUT",
		num: 0,
		name: "Khittomer Outpost",
		kind: "planet",
		code: "A",
		quad: "O",
		x: 7459.2,
		y: 1813,
		z: 5255.9,
		r: 62.7,
		dock: true,
		feed: false
	},
	{
		id: "LUCIFER",
		num: 0,
		name: "Lucifer",
		kind: "planet",
		code: "",
		quad: "O",
		x: 6294.4,
		y: 6778.1,
		z: 7293.3,
		r: 115.7,
		dock: false,
		feed: false
	},
	{
		id: "MARKARIAN205",
		num: 0,
		name: "Markarian 205",
		kind: "planet",
		code: "",
		quad: "O",
		x: 7986.1,
		y: 6333.7,
		z: 2093.7,
		r: 115.7,
		dock: false,
		feed: false
	},
	{
		id: "NIMBUSOUTPOS",
		num: 0,
		name: "Nimbus Outpost",
		kind: "planet",
		code: "A",
		quad: "O",
		x: 4772.2,
		y: 700,
		z: 3744.1,
		r: 62.7,
		dock: true,
		feed: false
	},
	{
		id: "OMEGANEBULA",
		num: 0,
		name: "Omega Nebula",
		kind: "hazard",
		code: "",
		quad: "O",
		x: 8144.2,
		y: 6564.9,
		z: 2988.2,
		r: 1085,
		dock: false,
		feed: false
	},
	{
		id: "POLARIS",
		num: 0,
		name: "Polaris",
		kind: "planet",
		code: "C A",
		quad: "O",
		x: 4772.2,
		y: 4500,
		z: 8450.5,
		r: 115.7,
		dock: true,
		feed: true
	},
	{
		id: "QUETZALCOATL",
		num: 0,
		name: "Quetzalcoatl",
		kind: "planet",
		code: "C",
		quad: "O",
		x: 8071.2,
		y: 6072.8,
		z: 2046.9,
		r: 115.7,
		dock: false,
		feed: true
	},
	{
		id: "RURAPENTHE",
		num: 0,
		name: "Rura Penthe",
		kind: "planet",
		code: "",
		quad: "O",
		x: 7565.6,
		y: 1706.7,
		z: 4500,
		r: 115.7,
		dock: false,
		feed: false
	},
	{
		id: "SSYZPLANETOI",
		num: 0,
		name: "Ssyz Planetoid",
		kind: "planet",
		code: "M",
		quad: "O",
		x: 3250.1,
		y: 2221.9,
		z: 1706.7,
		r: 115.7,
		dock: false,
		feed: false
	},
	{
		id: "TANTALUSV",
		num: 0,
		name: "Tantalus V",
		kind: "planet",
		code: "FR",
		quad: "O",
		x: 1978.9,
		y: 7293.3,
		z: 4500,
		r: 115.7,
		dock: false,
		feed: false
	},
	{
		id: "URSAMINORBET",
		num: 0,
		name: "Ursa Minor Beta",
		kind: "planet",
		code: "C",
		quad: "O",
		x: 2929.8,
		y: 5323.7,
		z: 6438.3,
		r: 115.7,
		dock: false,
		feed: true
	},
	{
		id: "VEILNEBULA",
		num: 0,
		name: "Veil Nebula",
		kind: "hazard",
		code: "FC",
		quad: "O",
		x: 3922.5,
		y: 3626.4,
		z: 3535.5,
		r: 1085,
		dock: false,
		feed: false
	},
	{
		id: "WORMHOLE",
		num: 0,
		name: "Worm Hole",
		kind: "hole",
		code: "",
		quad: "O",
		x: 4772.5,
		y: 4499,
		z: 4502.2,
		r: 120.6,
		dock: false,
		feed: false
	},
	{
		id: "XELORASTEROI",
		num: 0,
		name: "Xelor Asteroids",
		kind: "hazard",
		code: "",
		quad: "O",
		x: 855.8,
		y: 3493.3,
		z: 5686.8,
		r: 1205.6,
		dock: false,
		feed: false
	},
	{
		id: "YONADAOUTPOS",
		num: 0,
		name: "Yonada Outpost",
		kind: "planet",
		code: "A",
		quad: "O",
		x: 2494.1,
		y: 2221.9,
		z: 2347.3,
		r: 62.7,
		dock: true,
		feed: false
	},
	{
		id: "VELAPULSAR",
		num: 0,
		name: "Vela Pulsar",
		kind: "star",
		code: "",
		quad: "O",
		x: 4585.1,
		y: 3861.8,
		z: 4623.7,
		r: 217,
		dock: false,
		feed: false
	}
];
/**
* Excelsior scan is 10,000 on the sheet and 4,800 in this chart.
* Nebula scan, quasar and pulsar fields, and the Cygnus pull use this factor.
*/
var RANGE_SCALE = 4800 / 1e4;
/** World units for a raw mtrek distance, matching ship weapon and scan scale. */
function rangeUnits(raw) {
	return raw * RANGE_SCALE;
}
function nameHash(name) {
	let h = 0;
	for (let i = 0; i < name.length; i++) h = h * 33 + name.charCodeAt(i) >>> 0;
	return h;
}
function terrainOf(name) {
	const n = name.toLowerCase();
	if (n.includes("cygnus x-")) return "cygnus";
	if (n.includes("pulsar")) return "pulsar";
	if (n.includes("quasar")) return "quasar";
	if (n.includes("asteroid")) return "asteroid";
	if (n.includes("nebula") || n.includes("tholian") || n.includes("tholean")) return "nebula";
	return null;
}
/** Quasars damp a cloak out to 1,000 or 1,500 raw. Pulsars 1,000 or 2,000. The name picks which. */
function effectRaw(name, terrain) {
	const h = nameHash(name);
	if (terrain === "quasar") return h % 2 === 0 ? 1e3 : 1500;
	return h % 2 === 0 ? 1e3 : 2e3;
}
function pulsarCloaking(name, t) {
	return (t + nameHash(name) % 17) % 24 < 12;
}
/** Scan inside a nebula is 1,000 raw units: 480 at ship scale, inside an Excelsior's torpedo reach. */
function nebulaScan(normalScan) {
	return Math.min(normalScan, rangeUnits(1e3));
}
function seenRange(normalScan, observerInNebula, targetInNebula) {
	let scan = normalScan;
	if (observerInNebula) scan = nebulaScan(normalScan);
	if (targetInNebula) scan = Math.min(scan, normalScan / 3);
	return scan;
}
/** 1 crystal per quarter-second for each warp over cruising maximum. */
function crystalBurn(warp, cruise, dt) {
	if (warp <= cruise) return 0;
	return (warp - cruise) * 4 * dt;
}
/**
* Antimatter is fuel. Warp-energy spent per tick piles up; every 400 becomes one unit.
* Impulse (the free part) is 40. Four ticks a second, matching the mtrek note.
* Warp 16 with shields spends 0.5 a second, so a 5,000 tank lasts about 2.7 hours.
*/
function antimatterUsed(warp, shieldsUp, cloaked, dt) {
	return Math.max(0, Math.abs(warp) * 5 + (shieldsUp ? 10 : 0) + (cloaked ? 15 : 0) - 40) * 4 * dt / 400;
}
/** Hull tear once you are on the damage-warp number. Overwarp below that only burns crystals and fuel. */
function hullTear(warp, damageWarp, dt) {
	if (warp < damageWarp - .05) return 0;
	return (8 + (warp - damageWarp) * 10) * dt;
}
function garble(text, mark) {
	let out = "";
	let h = 17;
	for (const ch of text) {
		h = h * 31 + ch.charCodeAt(0) >>> 0;
		out += ch === " " || h % 7 !== 0 ? ch : mark;
	}
	return out;
}
/**
* Breaksave penalty. Under 1000 gold the ship is lost and the bank goes with it.
* Otherwise about a third of the gold is taken, and a tenth is left on the field.
*/
function breaksaveTake(gold) {
	if (gold < 1e3) return {
		destroy: true,
		kept: 0,
		dropped: Math.max(0, Math.floor(gold))
	};
	const dropped = Math.floor(gold * .1);
	return {
		destroy: false,
		kept: Math.max(0, Math.floor(gold - gold / 3)),
		dropped
	};
}
/** Gold for shooting a human who never shoots back is pointshipping. Bots always count. */
function countsAsFight(targetIsHuman, targetShotBack) {
	return !targetIsHuman || targetShotBack;
}
var WORLD = 9e3;
var WARP_SPEED = 78;
var WARP_ACCEL = 2.5;
var CLIMB = 390;
function raceOf(row) {
	if (row.kind === "base") return "Starbase";
	if (row.kind === "star") return "Star";
	if (row.kind === "hazard") return "Hazard";
	if (row.kind === "comet") return "Comet";
	if (row.kind === "hole") return "Wormhole";
	return "Planet";
}
/** Original mtrek coordinates, scaled into world units. Z is the third axis. */
var SPOTS = CHART.map((row) => ({
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
	code: row.code
}));
var BASES = SPOTS.filter((spot) => spot.dock && spot.kind !== "hole");
var PLANETS = SPOTS.filter((spot) => !spot.dock && spot.kind !== "hole");
var HOLES = SPOTS.filter((spot) => spot.kind === "hole");
/** Shared by the long-range pane and chart clicks so a click lands where it looks. */
function zoneOf(quad) {
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
	if (!Number.isFinite(minX)) return {
		minX: 0,
		maxX: WORLD,
		minY: 0,
		maxY: WORLD
	};
	const pad = 420;
	return {
		minX: minX - pad,
		maxX: maxX + pad,
		minY: minY - pad,
		maxY: maxY + pad
	};
}
var QUAD_ORDER = [
	"A",
	"B",
	"G",
	"O"
];
var QUAD_NAME = {
	A: "ALPHA",
	B: "BETA",
	G: "GAMMA",
	O: "OMEGA"
};
function nextQuad(q) {
	return QUAD_ORDER[(QUAD_ORDER.indexOf(q) + 1) % QUAD_ORDER.length];
}
var BOTS = [
	{
		name: "IKS Torg",
		classId: "KEV12",
		bias: .72,
		home: "KLIN",
		skill: 5
	},
	{
		name: "IRW Vorel",
		classId: "RBOP",
		bias: .5,
		home: "ROM",
		skill: 4
	},
	{
		name: "OSS Slammer",
		classId: "BR5",
		bias: .45,
		home: "ORION",
		skill: 4
	},
	{
		name: "CDS Galor",
		classId: "CDA180",
		bias: .62,
		home: "SB7",
		skill: 3
	},
	{
		name: "USS Hood",
		classId: "EXCEL",
		bias: .34,
		home: "EARTH",
		skill: 3
	},
	{
		name: "USS Farragut",
		classId: "LARSON",
		bias: .4,
		home: "EARTH",
		skill: 3
	},
	{
		name: "USS Yorktown",
		classId: "IIA",
		bias: .36,
		home: "EARTH",
		skill: 3
	},
	{
		name: "IKS Gr'oth",
		classId: "KPB13",
		bias: .7,
		home: "KLIN",
		skill: 4
	}
];
var QUADRANT_ROBOTS = BOTS.map((bot) => bot.name);
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
		aiAcc: Math.random() * 1.6,
		aiState: "patrol",
		patrolX: partial.x,
		patrolY: partial.y,
		patrolZ: partial.z,
		orbitSign: Math.random() < .5 ? -1 : 1,
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
		antimatter: 5e3,
		amAcc: 0,
		breaks: 0,
		foughtAt: /* @__PURE__ */ new Map(),
		remote: false,
		quad: "A"
	};
}
function quietLine(text) {
	const t = text.toLowerCase();
	return t.includes("vault updated") || t.includes("undock") || t.includes("docked at") || t.includes("relaunched from");
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
	nav = null;
	/** `[` picks a key. The hail line is the macro. `]` clears one. */
	keymaps = {};
	pendingMap = "";
	mapPhase = "idle";
	onHail = null;
	threatId = null;
	threatUntil = 0;
	/** mtrek.com wormholes sit dark for about a minute, then open again. */
	holeOpen = true;
	holeLeft = 58;
	onBank = null;
	/** Last player strike on a remote, repeated on the pose so a dropped packet still lands. */
	lastStrike = null;
	strikeSeq = 0;
	/** Fired when a local weapon tags a remote ship. Peer id, damage. */
	onStrike = null;
	edgeNote = 0;
	noTgt = 0;
	warpNote = 0;
	farmNote = 0;
	lastCombat = -100;
	broke = false;
	/** Last accepted hit time per remote, per weapon. Stops a client spraying damage. */
	weaponAt = /* @__PURE__ */ new Map();
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
			y: home.y + 280,
			z: home.z
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
					x: b.x + Math.cos(ang) * 520,
					y: b.y + Math.sin(ang) * 520,
					z: b.z,
					bias: bot.bias,
					skill: bot.skill
				}, 0));
			});
			for (const ship of this.ships) {
				if (ship.isPlayer) continue;
				const dx = ship.x - this.player.x;
				const dy = ship.y - this.player.y;
				const d = Math.hypot(dx, dy) || 1;
				if (d < 750) {
					ship.x = clamp(this.player.x + dx / d * 750, 280, 8720);
					ship.y = clamp(this.player.y + dy / d * 750, 280, 8720);
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
		else this.say("W/S warp · Up/Down change Z · A/D turn · click a ship to lock · Space phasers · T torpedoes · . dock", "info");
	}
	held() {
		return this.inputOverride ?? this.keys;
	}
	/** One keypress. W raises warp. S lowers it, then backs up. */
	nudgeWarp(dir) {
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
		const next = dir > 0 ? Math.min(this.tearOf(p), p.warp + .4) : Math.max(-2, p.warp - .4);
		p.warp = Math.round(next * 10) / 10;
	}
	verbose = false;
	say(text, tone = "info") {
		if (!this.verbose && quietLine(text)) return;
		if (tone === "hail") sfx.hail();
		this.messages = [{
			text,
			tone,
			at: this.t
		}, ...this.messages].slice(0, 8);
	}
	toggleVerbose() {
		this.verbose = !this.verbose;
		this.messages = [{
			text: this.verbose ? "Full log on." : "Dock and vault lines hidden.",
			tone: "info"
		}, ...this.messages].slice(0, 8);
	}
	baseById(id) {
		return BASES.find((b) => b.id === id) ?? BASES[0];
	}
	dist(ax, ay, bx, by, az = 0, bz = 0) {
		return Math.hypot(ax - bx, ay - by, az - bz);
	}
	/** Cruising cap is maxWarp. The sheet's damage warp is as fast as the hull will go. */
	tearOf(ship) {
		return SHEETS[ship.cls.id]?.damageWarp ?? ship.cls.maxWarp;
	}
	spotNear(ship, kind) {
		let best = null;
		let bestD = Infinity;
		for (const spot of SPOTS) {
			if (spot.quad !== ship.quad || terrainOf(spot.name) !== kind) continue;
			const d = this.dist(ship.x, ship.y, spot.x, spot.y, ship.z, spot.z);
			if (d < (kind === "quasar" ? rangeUnits(effectRaw(spot.name, "quasar")) : kind === "pulsar" ? rangeUnits(effectRaw(spot.name, "pulsar")) : kind === "cygnus" ? rangeUnits(1e4) : spot.r) && d < bestD) {
				best = spot;
				bestD = d;
			}
		}
		return best;
	}
	nebulaAt(ship) {
		return this.spotNear(ship, "nebula");
	}
	cloakDead(ship) {
		if (this.spotNear(ship, "quasar")) return true;
		const pulsar = this.spotNear(ship, "pulsar");
		return Boolean(pulsar && pulsarCloaking(pulsar.name, this.t));
	}
	interference(ship) {
		return Boolean(this.nebulaAt(ship) || this.spotNear(ship, "quasar") || this.spotNear(ship, "pulsar"));
	}
	payForHit(attacker, target, raw) {
		const last = attacker.foughtAt.get(target.id) ?? -1e9;
		const back = this.t - last <= 30;
		if (!countsAsFight(target.remote, back)) {
			if (attacker.isPlayer && this.t > this.farmNote) {
				this.farmNote = this.t + 6;
				this.say("No gold. No return fire in the last 30 seconds. That is pointshipping.", "alert");
			}
		} else {
			attacker.pendingDmg += raw;
			if (target.banked > 400 || target.dmgGiven > 1200) attacker.pendingBonus += raw * .5;
		}
		target.foughtAt.set(attacker.id, this.t);
		if (attacker.isPlayer || target.isPlayer) this.lastCombat = this.t;
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
		const x = Number(pose.x) || 0;
		const y = Number(pose.y) || 0;
		const z = Number.isFinite(Number(pose.z)) ? Number(pose.z) : 4500;
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
				y,
				z
			}, this.t);
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
		if (pose.classId && pose.classId !== ship.cls.id) {
			ship.cls = classById(String(pose.classId));
			ship.magazine = ship.cls.magazine;
			ship.drones = ship.cls.drones ?? 0;
			ship.mines = ship.cls.mines ?? 0;
		}
		ship.x = x;
		ship.y = y;
		ship.z = z;
		ship.yaw = Number(pose.yaw) || 0;
		ship.warp = clamp(Number(pose.warp) || 0, 0, 18);
		ship.shield = clamp(Number(pose.shield) || 0, 0, 100);
		ship.hull = clamp(Number(pose.hull) || 0, 0, ship.cls.hull);
		ship.cloaked = Boolean(pose.cloaked);
		ship.docked = Boolean(pose.docked);
		if (ship.docked) {
			ship.magazine = ship.cls.magazine;
			ship.drones = ship.cls.drones ?? 0;
			ship.mines = ship.cls.mines ?? 0;
		}
	}
	/** Humans take a, b, c in the same order on every screen. Robots follow. */
	setRoster(selfNetId, otherNetIds) {
		const alpha = "abcdefghijklmnopqrstuvwxyz";
		const ids = [...new Set([selfNetId, ...otherNetIds].filter(Boolean))].sort();
		const letterOf = (id) => alpha[ids.indexOf(id)] ?? "z";
		this.player.letter = letterOf(selfNetId);
		const used = /* @__PURE__ */ new Set([this.player.letter]);
		for (const ship of this.ships) {
			if (!ship.remote) continue;
			ship.letter = letterOf(ship.id.slice(4));
			used.add(ship.letter);
		}
		let n = ids.length;
		for (const ship of this.ships) {
			if (ship.isPlayer || ship.remote) continue;
			while (n < 26 && used.has(alpha[n])) n += 1;
			const letter = alpha[n] ?? "z";
			ship.letter = letter;
			used.add(letter);
			n += 1;
		}
	}
	dropRemotes(peerIds) {
		const keep = new Set(peerIds.map((id) => `net:${id}`));
		this.ships = this.ships.filter((s) => !s.remote || keep.has(s.id));
		if (this.player.lockId?.startsWith("net:") && !keep.has(this.player.lockId)) this.player.lockId = null;
	}
	/**
	* A remote hit has to match a weapon that ship can actually fire.
	* Peer id, not the display name. Pose lag gets some slack; the quadrant does not.
	* Mines are left behind, so they are not tied to where the ship is now.
	*/
	applyIncoming(raw, peerId) {
		if (!this.player.alive || this.over || raw <= 0) return;
		const id = peerId.startsWith("net:") ? peerId : `net:${peerId}`;
		const ghost = this.ships.find((s) => s.id === id);
		if (!ghost || !ghost.alive || ghost.quad !== this.player.quad) return;
		const d = this.dist(ghost.x, ghost.y, this.player.x, this.player.y, ghost.z, this.player.z);
		const cls = ghost.cls;
		const now = this.t;
		const slack = 800;
		const clock = this.weaponAt.get(id) ?? {
			phaser: -99,
			torp: -99,
			drone: -99,
			mine: -99
		};
		const fits = [];
		const phaserCd = cls.esi ? 1.7 : 1.12;
		if (d <= cls.phaserRange + slack && now - clock.phaser >= phaserCd - .05) {
			if (!cls.agonizer || ghost.magazine > 0) fits.push({
				kind: "phaser",
				cap: cls.phaser
			});
		}
		if (ghost.magazine > 0 && d <= cls.torpMax + slack && d >= Math.max(0, cls.torpMin - slack) && now - clock.torp >= cls.torpCd - .05) fits.push({
			kind: "torp",
			cap: cls.torpDmg
		});
		const droneDmg = cls.droneDmg ?? 0;
		if ((cls.drones ?? 0) > 0 && ghost.drones > 0 && droneDmg > 0 && d <= 2400 && now - clock.drone >= 1.65) fits.push({
			kind: "drone",
			cap: droneDmg
		});
		const mineDmg = cls.mineDmg ?? 0;
		if ((cls.mines ?? 0) > 0 && ghost.mines > 0 && mineDmg > 0 && now - clock.mine >= 1.35) fits.push({
			kind: "mine",
			cap: mineDmg
		});
		if (fits.length === 0) return;
		const covering = fits.filter((f) => raw <= f.cap + .5);
		const pick = covering.length ? covering.reduce((a, b) => a.cap < b.cap ? a : b) : fits.reduce((a, b) => a.cap > b.cap ? a : b);
		const dmg = Math.min(pick.cap, raw);
		if (dmg <= 0) return;
		if (pick.kind === "phaser") {
			clock.phaser = now;
			if (cls.agonizer) ghost.magazine = Math.max(0, ghost.magazine - 1);
		} else if (pick.kind === "torp") {
			clock.torp = now;
			ghost.magazine = Math.max(0, ghost.magazine - 1);
		} else if (pick.kind === "drone") {
			clock.drone = now;
			ghost.drones = Math.max(0, ghost.drones - 1);
		} else {
			clock.mine = now;
			ghost.mines = Math.max(0, ghost.mines - 1);
		}
		this.weaponAt.set(id, clock);
		this.applyDamage(this.player, dmg, ghost);
		this.say(`${ghost.name} hits for ${Math.round(dmg)}.`, "alert");
	}
	visible(observer, target) {
		if (!target.alive) return false;
		if (observer.quad !== target.quad) return false;
		const d = this.dist(observer.x, observer.y, target.x, target.y, observer.z, target.z);
		const nebO = this.nebulaAt(observer);
		const nebT = this.nebulaAt(target);
		if (d > seenRange(observer.cls.scan, Boolean(nebO), Boolean(nebT))) return false;
		if (target.cloaked && !target.docked && !this.cloakDead(target) && d > 320 && target !== observer) return false;
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
		} else this.say("AI helm off. You have the ship.", "info");
	}
	noteThreat(id) {
		if (!id || id === this.player.id) return;
		this.threatId = id;
		this.threatUntil = this.t + 5;
	}
	autoLockStep() {
		const p = this.player;
		if (!this.autoLock || this.over || !p.alive || p.docked) return;
		let pick = null;
		if (this.threatId && this.t < this.threatUntil) {
			const t = this.shipById(this.threatId);
			if (t && t.alive && !t.docked && t !== p && this.visible(p, t)) pick = t;
		}
		if (!pick) for (const bolt of this.bolts) {
			if (bolt.owner === p.id || bolt.lockId !== p.id) continue;
			const s = this.shipById(bolt.owner);
			if (s && s.alive && !s.docked && this.visible(p, s)) {
				pick = s;
				break;
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
			if (this.dist(p.x, p.y, pick.x, pick.y, p.z, pick.z) > cd * .85) return;
		}
		p.lockId = pick.id;
		this.say(`Autolock ${pick.letter}:${pick.name}.`, "info");
	}
	setCourse(x, y) {
		if (this.over || this.player.docked) return;
		this.nav = null;
		this.player.courseYaw = yawTo(this.player.x, this.player.y, x, y);
		this.player.intercept = false;
		this.seekBase = false;
	}
	/** Fly to a point chosen on the long-range chart. */
	setWaypoint(x, y, z) {
		if (this.over || this.player.docked || !this.player.alive) return;
		const zone = zoneOf(this.player.quad);
		let px = clamp(x, zone.minX, zone.maxX);
		let py = clamp(y, zone.minY, zone.maxY);
		let pz = z ?? this.player.z;
		if (z === void 0) {
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
		this.nav = {
			x: px,
			y: py,
			z: pz
		};
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
	hail(text) {
		const raw = text.trim().slice(0, 80);
		if (!raw) return null;
		let body = raw;
		let to = null;
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
		this.onHail?.({
			text: `${this.player.name}: ${body}`,
			to
		});
		if (to && !to.startsWith("net") && !this.ships.find((s) => s.id === to)?.remote) {
			const foe = this.shipById(to);
			if (foe && !foe.isPlayer) {
				const lines = [
					`${foe.name}: Save it for the debris field.`,
					`${foe.name}: Noted. I still intend to shoot you.`,
					`${foe.name}: Gold first. Speeches later.`
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
		return {
			text: `${this.player.name}: ${body}`,
			to
		};
	}
	hearHail(text) {
		const body = this.interference(this.player) ? garble(text, "#") : text;
		this.say(body.slice(0, 96), "hail");
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
			ship.antimatter = 5e3;
			ship.amAcc = 0;
			ship.crystalAcc = 0;
			ship.raiseLatch = false;
			this.say(gained > 0 ? `Docked at ${base.name}. Banked ${gained} gold${bonus > 0 ? ` (${bonus} veteran bonus)` : ""}.` : `Docked at ${base.name}. Magazines full. Nothing new to bank.`, "amber");
			sfx.dock();
			if (!was) this.onBank?.(ship);
		} else ship.dockTimer = 3.2;
	}
	nearestBase(ship) {
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
	nearestShip(ship, list) {
		let best = null;
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
	flyComputer(ship, dt) {
		if (!ship.alive || ship.remote || ship.docked) return;
		ship.aiAcc -= dt;
		if (ship.aiAcc <= 0) {
			ship.aiAcc = 1.28;
			this.think(ship);
		}
		this.steerToward(ship, ship.goalYaw, dt * .25);
		this.easeWarp(ship, ship.goalWarp, dt * .25);
		this.easeZ(ship, ship.goalZ, dt * .25);
		if (ship.aiState === "hunt") {
			const tgt = this.shipById(ship.lockId);
			if (tgt && tgt.alive && tgt !== ship && !tgt.docked) {
				const d = this.dist(ship.x, ship.y, tgt.x, tgt.y, ship.z, tgt.z);
				const noseOn = Math.abs(angDiff(ship.yaw, yawTo(ship.x, ship.y, tgt.x, tgt.y))) < .55;
				if (noseOn && d < ship.cls.phaserRange * .96) this.firePhaser(ship);
				if (noseOn && d > ship.cls.torpMin * .85 && d < ship.cls.torpMax * .95) this.fireTorp(ship);
				if (d > 200 && d < 1500 && ship.drones > 0) this.fireDrone(ship);
				if (d > 160 && d < 420 && ship.mines > 0) this.dropMine(ship);
			}
		}
		if (ship.aiState === "docking") {
			const base = this.nearestBase(ship);
			if (this.dist(ship.x, ship.y, base.x, base.y, ship.z, base.z) < 96 && ship.warp < 1.6) this.doDock(ship, base);
		}
	}
	think(ship) {
		if (this.t < 8) {
			ship.aiState = "patrol";
			ship.lockId = null;
			ship.cloaked = false;
			if (this.dist(ship.x, ship.y, ship.patrolX, ship.patrolY, ship.z, ship.patrolZ) < 220) {
				ship.patrolX = 700 + Math.random() * 7600;
				ship.patrolY = 700 + Math.random() * 7600;
				ship.patrolZ = ship.z + (Math.random() - .5) * 800;
			}
			ship.goalYaw = yawTo(ship.x, ship.y, ship.patrolX, ship.patrolY);
			ship.goalZ = ship.patrolZ;
			ship.goalWarp = ship.cls.cruise * .4;
			return;
		}
		const foes = this.ships.filter((o) => o !== ship && o.alive && !o.docked && this.visible(ship, o));
		if (ship.hull / ship.cls.hull < .26 || ship.energy < 24 || ship.magazine === 0 && ship.energy < 50) {
			const base = this.nearestBase(ship);
			const d = this.dist(ship.x, ship.y, base.x, base.y, ship.z, base.z);
			ship.goalYaw = yawTo(ship.x, ship.y, base.x, base.y);
			ship.goalZ = base.z;
			ship.goalWarp = d > 180 ? Math.min(ship.cls.cruise, ship.cls.maxWarp) : 1;
			ship.aiState = d < 100 ? "docking" : "flee";
			ship.lockId = null;
			if (ship.cls.cloak && ship.hull / ship.cls.hull < .4) ship.cloaked = true;
			return;
		}
		let target = this.nearestShip(ship, foes);
		let shooter = null;
		let shooterD = Infinity;
		for (const o of foes) {
			if (!(o.lockId === ship.id || this.bolts.some((b) => b.owner === o.id && b.lockId === ship.id))) continue;
			const d = this.dist(ship.x, ship.y, o.x, o.y, ship.z, o.z);
			if (d < shooterD) {
				shooter = o;
				shooterD = d;
			}
		}
		if (shooter) target = shooter;
		else if (ship !== this.player && this.player.alive && !this.player.docked && this.visible(ship, this.player) && Math.random() < ship.bias * .35) {
			if (this.dist(ship.x, ship.y, this.player.x, this.player.y, ship.z, this.player.z) < (target ? this.dist(ship.x, ship.y, target.x, target.y, ship.z, target.z) : Infinity) * 1.35) target = this.player;
		}
		const heldLock = this.shipById(ship.lockId);
		if (!shooter && heldLock && heldLock !== ship && heldLock.alive && !heldLock.docked && this.visible(ship, heldLock)) {
			if (this.dist(ship.x, ship.y, heldLock.x, heldLock.y, ship.z, heldLock.z) < (target ? this.dist(ship.x, ship.y, target.x, target.y, ship.z, target.z) : Infinity) * 1.4) target = heldLock;
		}
		if (!target) {
			ship.aiState = "patrol";
			ship.lockId = null;
			ship.cloaked = false;
			if (this.dist(ship.x, ship.y, ship.patrolX, ship.patrolY, ship.z, ship.patrolZ) < 220) {
				ship.patrolX = 700 + Math.random() * 7600;
				ship.patrolY = 700 + Math.random() * 7600;
				ship.patrolZ = ship.z + (Math.random() - .5) * 800;
			}
			ship.goalYaw = yawTo(ship.x, ship.y, ship.patrolX, ship.patrolY);
			ship.goalZ = ship.patrolZ;
			ship.goalWarp = ship.cls.cruise * .55;
			return;
		}
		ship.aiState = "hunt";
		ship.lockId = target.id;
		ship.goalZ = target.z;
		const d = this.dist(ship.x, ship.y, target.x, target.y, ship.z, target.z);
		const bearing = yawTo(ship.x, ship.y, target.x, target.y);
		const optimal = ship.cls.phaserRange * .72;
		let offset = 0;
		if (d < optimal) offset = ship.orbitSign * .28;
		if (d < optimal * .45) offset = ship.orbitSign * .45;
		ship.goalYaw = bearing + offset;
		ship.goalYaw += (Math.random() - .5) * (5 - ship.skill) * .05;
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
	easeZ(ship, target, dt) {
		const diff = target - ship.z;
		const step = CLIMB * dt;
		if (Math.abs(diff) <= step) ship.z = target;
		else ship.z += Math.sign(diff) * step;
	}
	easeWarp(ship, target, dt) {
		const goal = clamp(target, -2, ship.twLeft > 0 ? this.tearOf(ship) : this.tearOf(ship));
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
			const hits = foes.filter((o) => this.dist(ship.x, ship.y, o.x, o.y, ship.z, o.z) <= range && (!o.cloaked || this.dist(ship.x, ship.y, o.x, o.y, ship.z, o.z) < 300));
			if (hits.length === 0) return false;
			ship.energy -= 16;
			ship.phaserCd = 1.7;
			for (const o of hits) {
				const fall = clamp(1 - this.dist(ship.x, ship.y, o.x, o.y, ship.z, o.z) / range, 0, 1);
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
		if (lock && lock.alive && !lock.docked && lock !== ship && this.dist(ship.x, ship.y, lock.x, lock.y, ship.z, lock.z) <= range && (!lock.cloaked || this.dist(ship.x, ship.y, lock.x, lock.y, ship.z, lock.z) < 300)) victim = lock;
		else {
			let best = Infinity;
			for (const o of foes) {
				const d = this.dist(ship.x, ship.y, o.x, o.y, ship.z, o.z);
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
		const fall = clamp(1 - this.dist(ship.x, ship.y, victim.x, victim.y, ship.z, victim.z) / range, 0, 1);
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
		let dirz;
		let lockId = null;
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
			z: ship.z,
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
		let dirz;
		let lockId = null;
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
				this.payForHit(attacker, target, raw);
			}
			target.hitFlash = .18;
			const peer = target.id.startsWith("net:") ? target.id.slice(4) : "";
			if (peer && attacker?.isPlayer) {
				this.strikeSeq += 1;
				this.lastStrike = {
					to: peer,
					dmg: raw,
					n: this.strikeSeq,
					by: attacker.name
				};
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
		target.hitFlash = .18;
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
			z: ship.z,
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
			const vault = Math.floor(ship.banked);
			const vaultLine = vault > 0 ? `Vault still holds ${vault}.` : "Vault is empty.";
			this.say(dropped > 0 ? `${dropped} gold left on the field. ${vaultLine}` : vaultLine, "alert");
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
					ship.antimatter = 5e3;
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
			const raising = ship.isPlayer && !this.aiPilot ? (ship.raiseLatch || held.has("KeyR") && !shift) && ship.shieldDrop <= 0 : ship.shield < 100 && ship.energy > 20 && !ship.docked;
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
			let drain = Math.abs(ship.warp) * .85;
			if (ship.cloaked) drain += 7;
			ship.energy = clamp(ship.energy + (3 - drain) * dt, 0, ship.cls.energy);
			this.burnFuel(ship, dt);
			if (ship.energy < 8) ship.cloaked = false;
			if (!ship.docked) {
				for (const planet of PLANETS) {
					if (planet.quad !== ship.quad || !planet.feed) continue;
					if (this.dist(ship.x, ship.y, planet.x, planet.y, ship.z, planet.z) < Math.max(150, planet.r)) ship.energy = Math.min(ship.cls.energy, ship.energy + 7 * dt);
				}
				this.refillAntimatter(ship, dt);
				this.terrain(ship, dt);
			}
			if (ship.energy <= 0 && ship.twLeft <= 0) ship.warp = Math.max(0, ship.warp - WARP_ACCEL * dt);
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
					ship.antimatter = 5e3;
					const gained = this.goldAboard(ship);
					this.clearAboard(ship);
					ship.banked += gained;
				}
			}
		}
		const p = this.player;
		if (this.aiPilot) this.flyComputer(p, dt);
		else {
			this.autoLockStep();
			if (p.alive && !p.docked && !this.over) {
				let steer = 0;
				if (held.has("KeyA") || held.has("ArrowLeft")) steer += 1;
				if (held.has("KeyD") || held.has("ArrowRight")) steer -= 1;
				steer = clamp(steer + this.touchSteer, -1, 1);
				const warpUp = this.touchWarp > 0 || held.has("KeyW") && !shift;
				const warpDn = this.touchWarp < 0 || held.has("KeyS") || held.has("KeyW") && shift;
				const climb = (held.has("ArrowUp") ? 1 : 0) - (held.has("ArrowDown") ? 1 : 0) + this.touchClimb;
				if (warpUp || warpDn) {
					p.intercept = false;
					this.seekBase = false;
					this.nav = null;
				}
				if (p.twLeft > 0 && p.cls.teleport) {
					p.intercept = false;
					p.courseYaw = null;
					if (steer === 0) p.yaw += .55 * dt;
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
						const want = d > 900 ? p.cls.cruise : d > 280 ? 3.5 : .6;
						this.easeWarp(p, want, dt);
						if (climb === 0) this.easeZ(p, lock.z, dt);
					} else p.intercept = false;
				} else if (this.seekBase && p.twLeft <= 0) {
					const base = this.nearestBase(p);
					const d = this.dist(p.x, p.y, base.x, base.y, p.z, base.z);
					this.steerToward(p, yawTo(p.x, p.y, base.x, base.y), dt);
					const want = d > 900 ? p.cls.cruise : d > 220 ? 3.2 : .7;
					this.easeWarp(p, want, dt);
					if (climb === 0) this.easeZ(p, base.z, dt);
					if (d < 100 && p.warp <= 1.4) {
						this.seekBase = false;
						this.doDock(p, base);
					}
				} else if (this.nav && p.twLeft <= 0) {
					const d = this.dist(p.x, p.y, this.nav.x, this.nav.y, p.z, this.nav.z);
					this.steerToward(p, yawTo(p.x, p.y, this.nav.x, this.nav.y), dt);
					const want = d > 800 ? p.cls.cruise : d > 240 ? 3 : .5;
					this.easeWarp(p, want, dt);
					if (climb === 0) this.easeZ(p, this.nav.z, dt);
					if (d < 90) {
						this.nav = null;
						this.say("On station.", "info");
					}
				} else if (p.courseYaw !== null) {
					this.steerToward(p, p.courseYaw, dt);
					if (Math.abs(angDiff(p.yaw, p.courseYaw)) < .04) p.courseYaw = null;
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
			if (mine.arm <= 0 && !boom) for (const ship of this.ships) {
				if (!ship.alive || ship.docked) continue;
				if (this.dist(mine.x, mine.y, ship.x, ship.y, mine.z, ship.z) < 46) {
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
			if (ship.isPlayer) this.say(`Wormhole transit. ${QUAD_NAME[ship.quad]} quadrant. A minute before this mouth will take you again.`, "amber");
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
				const tx = dx / len * spd;
				const ty = dy / len * spd;
				const tz = dz / len * spd;
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
			if (b.traveled >= b.min) for (const ship of this.ships) {
				if (!ship.alive || ship.docked || ship.id === b.owner) continue;
				if (ship.cloaked && this.dist(b.x, b.y, ship.x, ship.y, b.z, ship.z) > 36) continue;
				if (this.dist(b.x, b.y, ship.x, ship.y, b.z, ship.z) < 34) {
					const span = Math.max(1, b.max - b.min);
					const u = clamp((b.traveled - b.min) / span, 0, 1);
					const dmg = b.kind === "obliterator" ? b.dmg : b.dmg * (b.varPlasma ? .4 + .95 * u : .35 + .65 * u);
					const owner = this.shipById(b.owner);
					this.applyDamage(ship, dmg, owner);
					hit = true;
					break;
				}
			}
			if (hit || b.life <= 0 || b.traveled > b.max) this.bolts.splice(i, 1);
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
		p.antimatter = 5e3;
		p.amAcc = 0;
		p.born = this.t;
		p.phaserCd = 0;
		p.torpCd = .3;
		this.over = false;
		this.killedBy = "";
		this.say("Relaunched. The vault kept what you banked. The rest is gone.", "amber");
	}
	burnFuel(ship, dt) {
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
		if (ship.antimatter <= 0 && ship.warp > 1 && ship.twLeft <= 0) ship.warp = Math.max(1, ship.warp - WARP_ACCEL * dt);
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
	refillAntimatter(ship, dt) {
		for (const spot of SPOTS) {
			if (spot.quad !== ship.quad) continue;
			if (!spot.code.split(/\s+/).includes("A") && spot.id !== ship.home) continue;
			if (this.dist(ship.x, ship.y, spot.x, spot.y, ship.z, spot.z) < Math.max(150, spot.r)) {
				ship.antimatter = Math.min(5e3, ship.antimatter + 80 * dt);
				return;
			}
		}
	}
	terrain(ship, dt) {
		if (!ship.alive || ship.docked) return;
		for (const spot of SPOTS) {
			if (spot.quad !== ship.quad) continue;
			const kind = terrainOf(spot.name);
			if (kind !== "asteroid" && kind !== "cygnus") continue;
			const d = this.dist(ship.x, ship.y, spot.x, spot.y, ship.z, spot.z);
			if (kind === "asteroid" && d < spot.r && Math.abs(ship.warp) > 8 && ship.shield > 0) {
				ship.shield = Math.max(0, ship.shield - Math.min(ship.shield, 10 * dt));
				if (ship.isPlayer && this.t > this.edgeNote) {
					this.edgeNote = this.t + 3;
					this.say("Asteroids. Warp 8 or less, or they eat the shields.", "alert");
				}
			}
			if (kind === "cygnus") {
				const pullR = rangeUnits(1e4);
				if (d < rangeUnits(500) && ship.holeCd <= 0) this.dumpFromCygnus(ship);
				else if (d < pullR && d > 1) {
					const pull = (1 - d / pullR) ** 2 * 520 * dt;
					ship.x += (spot.x - ship.x) / d * pull;
					ship.y += (spot.y - ship.y) / d * pull;
					ship.z += (spot.z - ship.z) / d * pull;
				}
			}
		}
	}
	dumpFromCygnus(ship) {
		const order = [
			"A",
			"B",
			"G",
			"O"
		];
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
		const take = breaksaveTake(p.banked + this.goldAboard(p));
		p.breaks += 1;
		if (take.destroy) {
			p.cargo += p.banked;
			p.banked = 0;
			this.say("Breaksave under 1,000 gold. The ship is lost, and the vault with it.", "alert");
			this.destroy(p, null);
			this.onBank?.(p);
			return;
		}
		this.clearAboard(p);
		p.banked = take.kept;
		if (take.dropped > 0) this.picks.push({
			x: p.x,
			y: p.y,
			z: p.z,
			gold: take.dropped,
			life: 90
		});
		this.say(`Breaksave ${p.breaks}. Vault cut to ${take.kept}. ${take.dropped} left in space.`, "alert");
		this.onBank?.(p);
	}
	runMacro(macro) {
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
			dist: this.dist(p.x, p.y, lock.x, lock.y, p.z, lock.z),
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
			const same = s.quad === p.quad;
			const seen = s.isPlayer || s.alive && same && this.visible(p, s);
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
				seen
			};
		});
		const base = this.nearestBase(p);
		const bd = this.dist(p.x, p.y, base.x, base.y, p.z, base.z);
		let nearPlanet = null;
		for (const planet of PLANETS) {
			if (planet.quad !== p.quad) continue;
			if (this.dist(p.x, p.y, planet.x, planet.y, p.z, planet.z) < 150) nearPlanet = planet.name;
		}
		let hint = "Click a contact or empty space.";
		if (this.over) hint = "Ship lost.";
		else if (p.docked) hint = `Docked at ${p.dockName}. Undock to fly.`;
		else if (bd < 110 && p.warp <= 1.4) hint = `${base.name} in range. Press . to dock and bank.`;
		else if (bd < 110) hint = "Kill warp under 1.4 to dock.";
		else if (p.hull / p.cls.hull < .28) hint = "Hull critical. Run for a starbase.";
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
var BODY_SRC = {
	earth: "/bodies/earth.png",
	mars: "/bodies/mars.png",
	jupiter: "/bodies/jupiter.png",
	neptune: "/bodies/neptune.png",
	venus: "/bodies/venus.png",
	mercury: "/bodies/mercury.png",
	europa: "/bodies/europa.png",
	io: "/bodies/io.png",
	moon: "/bodies/moon.png",
	ceres: "/bodies/ceres.png",
	saturn: "/bodies/saturn.png",
	nebula: "/bodies/nebula.png",
	carina: "/bodies/carina.png",
	starbase: "/bodies/starbase.png"
};
var BODY_BY_NAME = {
	Earth: "earth",
	Vulcan: "mars",
	Romulus: "neptune",
	Klinzhai: "io",
	Gorn: "venus",
	Orion: "jupiter",
	"Delta Vega": "europa",
	Deneva: "moon",
	Wrigley: "saturn",
	"Rigel XII": "mercury",
	Organia: "ceres",
	"Mutara Nebula": "nebula",
	"Asteroid Field": "ceres",
	"Tholean Space": "carina",
	Dana: "earth",
	"Malibu Beta 6": "neptune",
	Arrakis: "mars",
	"Pleasure Planet": "venus",
	Hawserion: "jupiter",
	Newtonium: "mercury"
};
var BODY_HASH = [
	"earth",
	"mars",
	"jupiter",
	"neptune",
	"venus",
	"mercury",
	"europa",
	"io",
	"moon",
	"ceres",
	"saturn"
];
function bodyKey(name) {
	const known = BODY_BY_NAME[name];
	if (known) return known;
	const n = name.toLowerCase();
	if (n.includes("nebula") || n.includes("tholian") || n.includes("tholean")) return n.includes("thol") ? "carina" : "nebula";
	if (n.includes("asteroid") || n.includes("field")) return "ceres";
	if (n.includes("starbase") || n.includes("k-7") || n.includes("babylon") || n.includes("outpost")) return "starbase";
	if (n.includes("comet")) return "europa";
	if (n.includes("cygnus") || n.includes("pulsar") || n.includes("quasar") || n.includes("star")) return "mercury";
	let h = 0;
	for (let i = 0; i < name.length; i++) h = h * 33 + name.charCodeAt(i) >>> 0;
	return BODY_HASH[h % BODY_HASH.length];
}
function bodySprite(key) {
	if (typeof Image === "undefined") return null;
	const src = BODY_SRC[key];
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
function paintBody(ctx, key, x, y, size) {
	const wide = key === "saturn" || key === "starbase";
	const w = wide ? size * (key === "starbase" ? 1.9 : 2.2) : size;
	const h = wide ? size * (key === "starbase" ? .85 : 1.05) : size;
	const img = bodySprite(key);
	if (!img) {
		ctx.beginPath();
		ctx.arc(x, y, size * .35, 0, Math.PI * 2);
		ctx.stroke();
		return;
	}
	ctx.drawImage(img, x - w / 2, y - h / 2, w, h);
}
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
function gaugeWidth(w) {
	return Math.round(Math.min(168, Math.max(108, w * .18)));
}
function longWidth(w) {
	return Math.round(Math.min(240, Math.max(112, w * .26)));
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
function drawGauges(ctx, sim, pane) {
	const p = sim.player;
	ctx.save();
	ctx.beginPath();
	ctx.rect(pane.x, pane.y, pane.w, pane.h);
	ctx.clip();
	ctx.fillStyle = "#000";
	ctx.fillRect(pane.x, pane.y, pane.w, pane.h);
	ctx.fillStyle = MUTED;
	ctx.font = "11px IBM Plex Mono, ui-monospace, monospace";
	ctx.fillText("GAUGES", pane.x + 10, pane.y + 16);
	const rows = [
		{
			label: "SHIELDS",
			frac: p.shield / 100,
			text: String(Math.round(p.shield)),
			color: BLUE
		},
		{
			label: pane.w < 176 ? "TORPEDOES" : "PHOTON TORPEDOES",
			frac: p.cls.magazine > 0 ? p.magazine / p.cls.magazine : 0,
			text: String(p.magazine),
			color: GOLD
		},
		{
			label: "WARP ENERGY",
			frac: p.cls.energy > 0 ? p.energy / p.cls.energy : 0,
			text: String(Math.round(p.energy)),
			color: "#7ee0ff"
		}
	];
	const gap = (pane.h - 28) / rows.length;
	rows.forEach((row, i) => {
		const y = pane.y + 28 + i * gap;
		ctx.fillStyle = MUTED;
		ctx.font = "10px IBM Plex Mono, ui-monospace, monospace";
		ctx.fillText(row.label, pane.x + 10, y + 12);
		ctx.fillStyle = FG;
		ctx.fillText(row.text, pane.x + pane.w - 36, y + 12);
		const bx = pane.x + 10;
		const by = y + 18;
		const bw = pane.w - 20;
		const bh = Math.max(8, Math.min(14, gap - 28));
		ctx.strokeStyle = "#1a4a72";
		ctx.strokeRect(bx, by, bw, bh);
		const frac = Math.max(0, Math.min(1, row.frac));
		ctx.fillStyle = row.color;
		ctx.fillRect(bx + 1, by + 1, Math.max(0, (bw - 2) * frac), bh - 2);
	});
	ctx.restore();
}
function drawTactical(ctx, sim, cam) {
	const { w, h } = cam;
	if (!cam.radarOnly) {
		const split = radarSplit(h);
		const longW = longWidth(w);
		const gauges = gaugeWidth(w);
		ctx.save();
		ctx.fillStyle = BG;
		ctx.fillRect(0, 0, w, h);
		drawLongRange(ctx, sim, {
			x: 0,
			y: 0,
			w: longW,
			h: split
		});
		drawGauges(ctx, sim, {
			x: longW + 1,
			y: 0,
			w: gauges,
			h: split
		});
		const radarX = longW + gauges + 2;
		const radarW = Math.max(1, w - radarX);
		ctx.save();
		ctx.beginPath();
		ctx.rect(radarX, 0, radarW, split);
		ctx.clip();
		ctx.translate(radarX, 0);
		drawTactical(ctx, sim, {
			x: cam.x,
			y: cam.y,
			scale: Math.min(radarW, split) / 2400,
			w: radarW,
			h: split,
			radarOnly: true
		});
		ctx.restore();
		ctx.strokeStyle = "#1a4a72";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(0, split + .5);
		ctx.lineTo(w, split + .5);
		ctx.moveTo(longW + .5, 0);
		ctx.lineTo(longW + .5, split);
		ctx.moveTo(radarX - .5, 0);
		ctx.lineTo(radarX - .5, split);
		ctx.stroke();
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
	const quad = player.quad;
	const bases = BASES.filter((b) => b.quad === quad);
	const planets = PLANETS.filter((p) => p.quad === quad);
	const hole = HOLES.find((h) => h.quad === quad);
	if (hole) {
		const p = toScreen(cam, hole.x, hole.y);
		const open = sim.holeOpen;
		const mouthR = Math.max(10, hole.r * cam.scale * 2);
		ctx.strokeStyle = open ? AMBER : MUTED;
		ctx.globalAlpha = open ? .85 : .35;
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.arc(p.x, p.y, mouthR, sim.t * (open ? 1.4 : .2), sim.t * (open ? 1.4 : .2) + 4);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(p.x, p.y, mouthR * .55, -sim.t * 2, -sim.t * 2 + 3);
		ctx.stroke();
		ctx.globalAlpha = 1;
		ctx.fillStyle = open ? MUTED : LINE;
		ctx.font = "11px IBM Plex Mono, ui-monospace, monospace";
		const mouth = `${{
			A: "ALPHA",
			B: "BETA",
			G: "GAMMA",
			O: "OMEGA"
		}[quad] ?? "ALPHA"} WORMHOLE`;
		ctx.fillText(open ? mouth : "WORMHOLE DARK", p.x + mouthR + 6, p.y + 4);
	}
	for (const planet of planets) {
		const p = toScreen(cam, planet.x, planet.y);
		if (p.x < -180 || p.y < -180 || p.x > w + 180 || p.y > h + 180) continue;
		const key = bodyKey(planet.name);
		const size = Math.max(8, planet.r * cam.scale * 2);
		paintBody(ctx, key, p.x, p.y, size);
		if (size > 14) {
			ctx.fillStyle = FG;
			ctx.font = "12px IBM Plex Mono, ui-monospace, monospace";
			ctx.fillText(planet.name, p.x + size * .55, p.y + 4);
		}
	}
	for (const base of bases) {
		const p = toScreen(cam, base.x, base.y);
		if (p.x < -80 || p.y < -80 || p.x > w + 80 || p.y > h + 80) continue;
		const key = bodyKey(base.name);
		const size = Math.max(10, base.r * cam.scale * 2);
		paintBody(ctx, key, p.x, p.y, size);
		ctx.fillStyle = AMBER;
		ctx.font = "12px IBM Plex Mono, ui-monospace, monospace";
		ctx.fillText(base.num > 0 ? `SB${base.num} ${base.name}` : base.name, p.x + size * .6, p.y - 8);
		ctx.fillStyle = MUTED;
		ctx.fillText(base.race, p.x + size * .6, p.y + 8);
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
	ctx.fillStyle = MUTED;
	ctx.font = "11px IBM Plex Mono, ui-monospace, monospace";
	ctx.fillText("SHORT RANGE", 10, 16);
	const hullPct = player.cls.hull > 0 ? player.hull / player.cls.hull : 1;
	if (!cam.radarOnly && hullPct < .3 && player.alive) {
		const g = ctx.createRadialGradient(w / 2, h / 2, h * .2, w / 2, h / 2, h * .7);
		g.addColorStop(0, "rgba(0,0,0,0)");
		g.addColorStop(1, "rgba(255,90,60,0.28)");
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, w, h);
	}
	ctx.restore();
}
function drawLongRange(ctx, sim, pane) {
	ctx.save();
	ctx.beginPath();
	ctx.rect(pane.x, pane.y, pane.w, pane.h);
	ctx.clip();
	ctx.fillStyle = BG;
	ctx.fillRect(pane.x, pane.y, pane.w, pane.h);
	const size = Math.max(8, Math.min(pane.w - 16, pane.h - 28));
	const x0 = pane.x + (pane.w - size) / 2;
	const y0 = pane.y + 22;
	ctx.strokeStyle = "#1a4a72";
	ctx.strokeRect(x0, y0, size, size);
	const quad = sim.player.quad;
	const zone = zoneOf(quad);
	const spanX = Math.max(1, zone.maxX - zone.minX);
	const spanY = Math.max(1, zone.maxY - zone.minY);
	const span = Math.max(spanX, spanY);
	const m = (wx, wy) => ({
		x: x0 + (wx - zone.minX) / spanX * size,
		y: y0 + (wy - zone.minY) / spanY * size
	});
	const dot = (r) => Math.max(3, Math.min(16, r / span * size * 2.4));
	for (const planet of PLANETS) {
		if (planet.quad !== quad) continue;
		const p = m(planet.x, planet.y);
		paintBody(ctx, bodyKey(planet.name), p.x, p.y, dot(planet.r));
	}
	for (const base of BASES) {
		if (base.quad !== quad) continue;
		const p = m(base.x, base.y);
		paintBody(ctx, bodyKey(base.name), p.x, p.y, Math.max(dot(base.r), 4));
	}
	for (const hole of HOLES) {
		if (hole.quad !== quad) continue;
		const p = m(hole.x, hole.y);
		ctx.strokeStyle = sim.holeOpen ? GOLD : MUTED;
		ctx.strokeRect(p.x - 3, p.y - 3, 6, 6);
	}
	for (const ship of sim.ships) {
		if (!ship.alive || ship.quad !== quad) continue;
		if (!ship.isPlayer && !sim.visible(sim.player, ship)) continue;
		const p = m(ship.x, ship.y);
		ctx.fillStyle = ship.isPlayer ? GOLD : ship.remote ? "#7ee0ff" : ALERT;
		ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
	}
	if (sim.nav) {
		const p = m(sim.nav.x, sim.nav.y);
		const me = m(sim.player.x, sim.player.y);
		ctx.strokeStyle = GOLD;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(me.x, me.y);
		ctx.lineTo(p.x, p.y);
		ctx.stroke();
		ctx.strokeRect(p.x - 4, p.y - 4, 8, 8);
	}
	ctx.fillStyle = GOLD;
	ctx.font = "10px IBM Plex Mono, ui-monospace, monospace";
	ctx.fillText("LONG RANGE", pane.x + 8, pane.y + 14);
	ctx.restore();
}
function place(fwd, lat, pane, elev = 0, radius = 48) {
	if (fwd < 36) return null;
	const cx = pane.x + pane.w / 2;
	const horizon = pane.y + pane.h * .36;
	const focal = pane.h * .92;
	return {
		sx: cx + lat / fwd * focal,
		sy: horizon + Math.min(pane.h * .58, focal * 110 / fwd) - elev / Math.max(fwd, 80) * pane.h * .45,
		size: Math.max(8, Math.min(pane.h * .5, radius / Math.max(fwd, 40) * pane.h * .9)),
		fwd
	};
}
function project(player, wx, wy, wz, pane, radius = 48) {
	const dx = wx - player.x;
	const dy = wy - player.y;
	const fx = -Math.sin(player.yaw);
	const fy = -Math.cos(player.yaw);
	const rx = Math.cos(player.yaw);
	const ry = -Math.sin(player.yaw);
	return place(dx * fx + dy * fy, dx * rx + dy * ry, pane, wz - player.z, radius);
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
		if (base.quad !== player.quad) continue;
		const p = project(player, base.x, base.y, base.z, pane, base.r);
		if (!p || p.fwd > 9e3) continue;
		paintBody(ctx, bodyKey(base.name), p.sx, p.sy, p.size);
		ctx.fillStyle = MUTED;
		ctx.font = "11px IBM Plex Mono, ui-monospace, monospace";
		ctx.fillText(base.num > 0 ? `SB${base.num}` : base.name, p.sx + p.size * .4, p.sy);
	}
	for (const planet of PLANETS) {
		if (planet.quad !== player.quad) continue;
		const p = project(player, planet.x, planet.y, planet.z, pane, planet.r);
		if (!p || p.fwd > 9e3) continue;
		paintBody(ctx, bodyKey(planet.name), p.sx, p.sy, p.size);
		ctx.fillStyle = MUTED;
		ctx.font = "11px IBM Plex Mono, ui-monospace, monospace";
		ctx.fillText(planet.name, p.sx + p.size * .35, p.sy);
	}
	const marks = [];
	for (const ship of sim.ships) {
		if (!ship.alive || ship.isPlayer) continue;
		if (!sim.visible(player, ship)) continue;
		const p = project(player, ship.x, ship.y, ship.z, pane, 36);
		if (!p || p.sx < pane.x - 120 || p.sx > pane.x + pane.w + 120) continue;
		marks.push({
			id: ship.id,
			kind: ship.cls.id,
			name: ship.name,
			yaw: ship.yaw - player.yaw,
			flash: ship.hitFlash > 0,
			shield: ship.shield,
			sx: p.sx,
			sy: p.sy,
			size: p.size,
			fwd: p.fwd
		});
	}
	marks.sort((a, b) => b.fwd - a.fwd);
	for (const mark of marks) {
		ctx.globalAlpha = Math.max(.35, Math.min(1, 1100 / mark.fwd));
		paintShip(ctx, mark.kind, mark.yaw, mark.sx, mark.sy, mark.size, mark.flash);
		if (mark.shield > 8) {
			ctx.strokeStyle = `rgba(62, 197, 255, ${.2 + mark.shield / 250})`;
			ctx.lineWidth = 1.25;
			ctx.beginPath();
			ctx.ellipse(mark.sx, mark.sy, mark.size * .62, mark.size * .4, 0, 0, Math.PI * 2);
			ctx.stroke();
		}
		ctx.globalAlpha = 1;
		ctx.strokeStyle = mark.kind === "KEV12" || mark.kind === "KPB13" ? RED : mark.kind === "RBOP" || mark.kind === "WARBIRD" ? "#3dce7a" : BLUE;
		ctx.lineWidth = 1;
		const b = mark.size * .55;
		ctx.strokeRect(mark.sx - b, mark.sy - b, b * 2, b * 2);
		ctx.fillStyle = FG;
		ctx.font = "11px IBM Plex Mono, ui-monospace, monospace";
		ctx.fillText(mark.name, mark.sx + b + 4, mark.sy - 4);
	}
	for (const bolt of sim.bolts) {
		const p = project(player, bolt.x, bolt.y, bolt.z, pane, 8);
		if (!p) continue;
		ctx.fillStyle = sim.shipById(bolt.owner)?.isPlayer ? BLUE : RED;
		ctx.beginPath();
		ctx.arc(p.sx, p.sy, bolt.drone ? 4 : bolt.kind === "plasma" ? 5 : 3, 0, Math.PI * 2);
		ctx.fill();
	}
	for (const beam of sim.beams) {
		const hit = project(player, beam.x2, beam.y2, player.z, pane, 8);
		ctx.strokeStyle = beam.byPlayer ? BLUE : RED;
		ctx.globalAlpha = Math.max(.4, beam.life / .16);
		ctx.lineWidth = beam.esi ? 3 : 2;
		ctx.beginPath();
		if (beam.byPlayer) {
			ctx.moveTo(cx, pane.y + pane.h - 8);
			if (hit) ctx.lineTo(hit.sx, hit.sy);
			else ctx.lineTo(cx, horizon);
		} else if (hit) {
			const src = project(player, beam.x1, beam.y1, player.z, pane, 8);
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
	ctx.fillStyle = MUTED;
	ctx.font = "11px IBM Plex Mono, ui-monospace, monospace";
	ctx.fillText("FORWARD", pane.x + pane.w - 78, pane.y + 18);
	ctx.restore();
}
function pointerCommand(sim, w, h, sx, sy) {
	const split = radarSplit(h);
	const longW = longWidth(w);
	const gauges = gaugeWidth(w);
	if (sy <= split) {
		if (sx < longW) {
			const size = Math.max(8, Math.min(longW - 16, split - 28));
			const x0 = (longW - size) / 2;
			const y0 = 22;
			const zone = zoneOf(sim.player.quad);
			const nx = (sx - x0) / size;
			const ny = (sy - y0) / size;
			if (nx >= 0 && ny >= 0 && nx <= 1 && ny <= 1) return {
				kind: "course",
				x: zone.minX + nx * (zone.maxX - zone.minX),
				y: zone.minY + ny * (zone.maxY - zone.minY),
				go: true
			};
			return null;
		}
		if (sx < longW + gauges + 1) return {
			kind: "course",
			x: sim.player.x,
			y: sim.player.y
		};
		const cam = cameraFor(sim, Math.max(1, w - longW - gauges - 2), split);
		const localX = sx - longW - gauges - 2;
		const id = pickShipAt(sim, cam, localX, sy);
		if (id) return {
			kind: "lock",
			id
		};
		const world = screenToWorld(cam, localX, sy);
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
		const p = project(sim.player, ship.x, ship.y, ship.z, pane, 36);
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
var KEY = "otrek-web-v1";
var OLD_KEY = "mtrek-web-v1";
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
		const raw = localStorage.getItem(KEY) ?? localStorage.getItem(OLD_KEY);
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
	if (existing && existing.gold >= row.gold && (existing.breaks ?? 0) >= (row.breaks ?? 0)) return data.scores;
	data.scores = [row, ...data.scores.filter((s) => !(s.name === row.name && s.code === row.code))].sort((a, b) => b.gold - a.gold).slice(0, 8);
	write(data);
	return data.scores;
}
var MAP_KEY = "otrek-keymaps-v1";
function loadKeymaps() {
	if (typeof localStorage === "undefined") return {};
	try {
		const raw = localStorage.getItem(MAP_KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") return {};
		const out = {};
		for (const [key, value] of Object.entries(parsed)) if (typeof value === "string" && value.length > 0 && value.length < 49) out[key] = value;
		return out;
	} catch {
		return {};
	}
}
function saveKeymaps(map) {
	localStorage.setItem(MAP_KEY, JSON.stringify(map));
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/** Top of the fleet. Account ids stay on the server; `yours` marks this captain. */
var listBoard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("723ab98b380a937cb6b462294310f59a518fb92b95bf24e84369d86f663d498d"));
/** One row per captain. A higher break count may lower gold. Otherwise gold only rises. */
var submitScore = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(createSsrRpc("89ca813da9bf1e11868b6b0e2ca0027c280c5a49e0d55e726b25683a14d11163"));
var BROKERS = ["wss://broker.emqx.io:8084/mqtt", "wss://broker.hivemq.com:8884/mqtt"];
var ROOT = "otrek/oxy/alpha";
function encStr(text) {
	const bytes = new TextEncoder().encode(text);
	const out = new Uint8Array(2 + bytes.length);
	new DataView(out.buffer).setUint16(0, bytes.length);
	out.set(bytes, 2);
	return out;
}
function concat(parts) {
	const out = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
	let at = 0;
	for (const part of parts) {
		out.set(part, at);
		at += part.length;
	}
	return out;
}
function remLen(length) {
	const bytes = [];
	do {
		let digit = length % 128;
		length = Math.floor(length / 128);
		if (length > 0) digit |= 128;
		bytes.push(digit);
	} while (length > 0);
	return Uint8Array.from(bytes);
}
function packet(header, body) {
	return concat([
		Uint8Array.from([header]),
		remLen(body.length),
		body
	]);
}
function connectPacket(clientId, willTopic) {
	return packet(16, concat([
		encStr("MQTT"),
		Uint8Array.from([
			4,
			38,
			0,
			30
		]),
		encStr(clientId),
		encStr(willTopic),
		encStr(JSON.stringify({
			id: clientId,
			bye: true
		}))
	]));
}
function parse(data) {
	const bytes = new Uint8Array(data);
	let at = 1;
	let value = 0;
	let shift = 1;
	let digit = 0;
	do {
		digit = bytes[at++] ?? 0;
		value += (digit & 127) * shift;
		shift *= 128;
	} while (digit & 128);
	return {
		type: bytes[0] >> 4,
		body: bytes.subarray(at, at + value)
	};
}
var BoardRelay = class {
	ws = null;
	listeners = /* @__PURE__ */ new Set();
	ping = null;
	closed = false;
	selfId;
	constructor(selfId) {
		this.selfId = selfId;
	}
	on(fn) {
		this.listeners.add(fn);
		return () => this.listeners.delete(fn);
	}
	async join() {
		let last = "board relay down";
		for (const url of BROKERS) try {
			await this.open(url);
			return;
		} catch (error) {
			last = error instanceof Error ? error.message : last;
		}
		throw new Error(last);
	}
	publish(msg) {
		const socket = this.ws;
		if (!socket || socket.readyState !== WebSocket.OPEN) return;
		const body = concat([encStr(`${ROOT}/${msg.id}`), new TextEncoder().encode(JSON.stringify(msg))]);
		socket.send(packet(49, body));
	}
	close() {
		if (this.closed) return;
		this.closed = true;
		if (this.ping) clearInterval(this.ping);
		try {
			this.publish({
				id: this.selfId,
				bye: true,
				t: Date.now()
			});
		} catch {}
		this.ws?.close();
		this.ws = null;
	}
	open(url) {
		return new Promise((resolve, reject) => {
			const socket = new WebSocket(url, ["mqtt"]);
			const fail = (message) => {
				socket.onopen = null;
				socket.onerror = null;
				socket.onmessage = null;
				try {
					socket.close();
				} catch {}
				reject(new Error(message));
			};
			const timer = setTimeout(() => fail("board relay timed out"), 8e3);
			socket.binaryType = "arraybuffer";
			socket.onopen = () => {
				socket.send(connectPacket(this.selfId, `${ROOT}/${this.selfId}`));
			};
			socket.onerror = () => fail("board relay refused");
			socket.onmessage = (event) => {
				const frame = parse(event.data);
				if (frame.type === 2) {
					clearTimeout(timer);
					if (frame.body[1] !== 0) {
						fail("board relay rejected");
						return;
					}
					const topic = encStr(`${ROOT}/+`);
					socket.send(packet(130, concat([
						Uint8Array.from([0, 1]),
						topic,
						Uint8Array.from([0])
					])));
					this.ws = socket;
					this.ping = setInterval(() => {
						if (socket.readyState === WebSocket.OPEN) socket.send(Uint8Array.from([192, 0]));
					}, 2e4);
					socket.onmessage = (next) => this.incoming(next.data);
					resolve();
				}
			};
		});
	}
	incoming(data) {
		const frame = parse(data);
		if (frame.type !== 3) return;
		const topicLen = frame.body[0] << 8 | frame.body[1];
		const json = new TextDecoder().decode(frame.body.subarray(2 + topicLen));
		try {
			const msg = JSON.parse(json);
			if (!msg.id || msg.id === this.selfId) return;
			for (const fn of this.listeners) fn(msg);
		} catch {}
	}
};
function useBoard(selfId, name, playing, enabled = true, onMessage) {
	const [humans, setHumans] = (0, import_react.useState)([]);
	const [notice, setNotice] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("linking");
	const relayRef = (0, import_react.useRef)(null);
	const known = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const seenOnce = (0, import_react.useRef)(false);
	const msgRef = (0, import_react.useRef)({
		id: selfId,
		name,
		playing
	});
	const onMessageRef = (0, import_react.useRef)(onMessage);
	onMessageRef.current = onMessage;
	const nameRef = (0, import_react.useRef)(name);
	const playingRef = (0, import_react.useRef)(playing);
	nameRef.current = name;
	playingRef.current = playing;
	(0, import_react.useEffect)(() => {
		msgRef.current = {
			...msgRef.current,
			id: selfId,
			name,
			playing
		};
	}, [
		selfId,
		name,
		playing
	]);
	(0, import_react.useEffect)(() => {
		if (!enabled) return;
		const relay = new BoardRelay(selfId);
		relayRef.current = relay;
		const people = /* @__PURE__ */ new Map();
		const stop = relay.on((msg) => {
			onMessageRef.current?.(msg);
			if (msg.bye) people.delete(msg.id);
			else if (msg.name) {
				people.set(msg.id, {
					id: msg.id,
					name: msg.name,
					playing: Boolean(msg.playing),
					seen: Date.now()
				});
				if (seenOnce.current && !known.current.has(msg.id)) {
					known.current.add(msg.id);
					setNotice(msg.playing ? `${msg.name} is in the quadrant.` : `${msg.name} logged in.`);
				}
			}
			const now = Date.now();
			const list = [...people.values()].filter((human) => now - human.seen < 15e3);
			for (const human of list) known.current.add(human.id);
			seenOnce.current = true;
			setHumans(list);
		});
		relay.join().then(() => {
			setStatus("on the board");
			relay.publish({
				...msgRef.current,
				t: Date.now()
			});
		}).catch((error) => {
			setStatus(error instanceof Error ? error.message : "board relay down");
		});
		const beat = window.setInterval(() => {
			relay.publish({
				...msgRef.current,
				name: nameRef.current,
				playing: playingRef.current,
				t: Date.now()
			});
			const now = Date.now();
			setHumans([...people.values()].filter((human) => now - human.seen < 15e3));
		}, 2e3);
		return () => {
			window.clearInterval(beat);
			stop();
			relay.close();
			relayRef.current = null;
		};
	}, [selfId, enabled]);
	return {
		humans,
		notice,
		status,
		publish: (0, import_react.useCallback)((extra) => {
			if (extra.kind) {
				relayRef.current?.publish({
					...msgRef.current,
					...extra,
					id: selfId,
					name: nameRef.current,
					playing: playingRef.current,
					t: Date.now()
				});
				return;
			}
			msgRef.current = {
				...msgRef.current,
				...extra,
				id: selfId,
				name: nameRef.current,
				playing: playingRef.current
			};
			delete msgRef.current.kind;
			delete msgRef.current.to;
			delete msgRef.current.dmg;
			delete msgRef.current.by;
			relayRef.current?.publish({
				...msgRef.current,
				t: Date.now()
			});
		}, [selfId]),
		selfId
	};
}
function NetLink({ name, simRef, sendRef }) {
	const [selfId] = (0, import_react.useState)(() => `p-${Math.random().toString(36).slice(2, 10)}`);
	const hailRef = (0, import_react.useRef)(null);
	const heardHits = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const heardHail = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const hear = (from, text, n) => {
		if (!text || !n || heardHail.current.get(from) === n) return;
		heardHail.current.set(from, n);
		simRef.current?.hearHail(text.slice(0, 96));
	};
	const onMessage = (msg) => {
		const sim = simRef.current;
		if (!sim) return;
		if (msg.bye) {
			const sim = simRef.current;
			if (!sim) return;
			sim.dropRemotes(sim.ships.filter((ship) => ship.remote && ship.id !== `net:${msg.id}`).map((ship) => ship.id.slice(4)));
			return;
		}
		if (msg.hit && msg.hit.to === selfId) {
			const n = Number(msg.hit.n) || 0;
			if (n > (heardHits.current.get(msg.id) ?? 0)) {
				heardHits.current.set(msg.id, n);
				sim.applyIncoming(Number(msg.hit.dmg) || 0, msg.id);
			}
		}
		if (msg.kind === "hit" && msg.to === selfId) {
			const n = Number(msg.n) || 0;
			if (n === 0 || n > (heardHits.current.get(msg.id) ?? 0)) {
				if (n) heardHits.current.set(msg.id, n);
				sim.applyIncoming(Number(msg.dmg) || 0, msg.id);
			}
		}
		if (typeof msg.x === "number" && typeof msg.y === "number") sim.upsertRemote(msg.id, msg);
		if (msg.hail?.text) {
			const to = msg.hail.to;
			if (to && to !== selfId) return;
			hear(msg.id, String(msg.hail.text), Number(msg.hail.n) || 0);
		}
	};
	const board = useBoard(selfId, name, true, true, onMessage);
	(0, import_react.useEffect)(() => {
		sendRef.current = (data) => {
			if (!data || typeof data !== "object") return;
			const msg = data;
			if (msg.k === "hail" && msg.text) {
				hailRef.current = {
					text: msg.text,
					n: Number(msg.n) || Date.now(),
					to: msg.to
				};
				board.publish({ hail: hailRef.current });
			}
			if (msg.k === "hit" && msg.to) board.publish({
				kind: "hit",
				to: msg.to,
				dmg: msg.dmg,
				by: msg.by
			});
		};
		return () => {
			sendRef.current = null;
		};
	}, [board.publish, sendRef]);
	(0, import_react.useEffect)(() => {
		let last = 0;
		let raf = 0;
		const loop = (now) => {
			const sim = simRef.current;
			if (sim) {
				sim.onStrike = (peer, raw) => {
					const hit = sim.lastStrike;
					if (peer && hit) board.publish({
						kind: "hit",
						to: peer,
						dmg: raw,
						n: hit.n,
						by: sim.player.name
					});
				};
				sim.setRoster(selfId, board.humans.filter((human) => human.playing).map((human) => human.id));
			}
			if (sim && now - last > 400) {
				last = now;
				const p = sim.player;
				board.publish({
					classId: p.cls.id,
					x: p.x,
					y: p.y,
					z: p.z,
					yaw: p.yaw,
					warp: p.warp,
					shield: p.shield,
					hull: p.hull,
					cloaked: p.cloaked,
					docked: p.docked,
					alive: p.alive && !sim.over,
					quad: p.quad,
					hail: hailRef.current,
					hit: sim.lastStrike
				});
			}
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => {
			cancelAnimationFrame(raf);
			if (simRef.current) simRef.current.onStrike = null;
		};
	}, [board.publish, simRef]);
	const handles = [{
		id: selfId,
		name,
		playing: true
	}, ...board.humans];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "shrink-0 border-b border-line px-3 py-2 font-mono text-xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "tracking-widest text-amber",
				children: ["HUMANS · ", handles.length]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1 max-h-28 space-y-0.5 overflow-y-auto text-fg",
				children: handles.map((human) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "truncate",
					children: [human.name, human.id === selfId ? " · you" : human.playing ? " · in" : " · yard"]
				}, human.id))
			}),
			board.notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-amber",
				children: board.notice
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-muted",
				children: board.status
			})
		]
	});
}
function pad3(n) {
	return Math.round(n).toString().padStart(3, "0");
}
function clock(s) {
	return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}
function Bridge({ name, classId, room, bots = true, onLeave }) {
	const canvasRef = (0, import_react.useRef)(null);
	const simRef = (0, import_react.useRef)(null);
	const netSend = (0, import_react.useRef)(null);
	const [snap, setSnap] = (0, import_react.useState)(null);
	const [paused, setPaused] = (0, import_react.useState)(false);
	const [help, setHelp] = (0, import_react.useState)(false);
	const [helpPage, setHelpPage] = (0, import_react.useState)("commands");
	const [hail, setHail] = (0, import_react.useState)("");
	const pausedRef = (0, import_react.useRef)(false);
	pausedRef.current = paused || help;
	(0, import_react.useEffect)(() => {
		const sim = new TrekSim(name, classId, { bots });
		simRef.current = sim;
		sim.keymaps = loadKeymaps();
		sim.onBank = (ship) => {
			const row = {
				callsign: ship.name,
				code: ship.cls.code,
				gold: Math.floor(ship.banked),
				dmg: Math.floor(ship.dmgGiven),
				kills: ship.kills,
				breaks: ship.breaks
			};
			saveScore({
				name: row.callsign,
				code: row.code,
				gold: row.gold,
				dmg: row.dmg,
				kills: row.kills,
				breaks: row.breaks,
				at: Date.now()
			});
			submitScore({ data: row }).catch(() => {
				sim.say("Fleet board missed this vault. Sign in at the yard and dock again.", "info");
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
			const simNow = simRef.current;
			if (!simNow) return;
			if (simNow.mapPhase === "pick" && !e.repeat) {
				e.preventDefault();
				simNow.pendingMap = e.code;
				simNow.mapPhase = "idle";
				simNow.say(`Mapping ${e.code}. Type the macro in the hail line and Send.`, "amber");
				setSnap(simNow.snapshot());
				return;
			}
			if (simNow.mapPhase === "clear" && !e.repeat) {
				e.preventDefault();
				delete simNow.keymaps[e.code];
				saveKeymaps(simNow.keymaps);
				simNow.mapPhase = "idle";
				simNow.say(`Cleared ${e.code}.`, "info");
				setSnap(simNow.snapshot());
				return;
			}
			if (e.code === "BracketLeft" && !e.repeat) {
				e.preventDefault();
				simNow.mapPhase = "pick";
				simNow.say("Keymap. Press the key to bind. Letters: w s f t g m r c z i x . u b", "amber");
				setSnap(simNow.snapshot());
				return;
			}
			if (e.code === "BracketRight" && !e.repeat) {
				e.preventDefault();
				simNow.mapPhase = "clear";
				simNow.say("Press the key to clear.", "info");
				setSnap(simNow.snapshot());
				return;
			}
			const macro = simNow.keymaps[e.code];
			if (macro) {
				e.preventDefault();
				if (!e.repeat) simNow.runMacro(macro);
				return;
			}
			sim.keys.add(e.code);
			if ([
				"Space",
				"ArrowUp",
				"ArrowDown",
				"ArrowLeft",
				"ArrowRight",
				"KeyW",
				"KeyA",
				"KeyS",
				"KeyD"
			].includes(e.code)) e.preventDefault();
			const warpUp = e.code === "KeyW" && !e.shiftKey;
			const warpDn = e.code === "KeyS" || e.code === "KeyW" && e.shiftKey;
			if ((warpUp || warpDn) && !e.repeat) sim.nudgeWarp(warpUp ? 1 : -1);
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
			if (e.code === "Digit9" || e.code === "Numpad9") sim.toggleVerbose();
			if (e.code === "Digit5" || e.code === "Numpad5") sim.toggleAutoLock();
			if (e.code === "Digit2" || e.code === "Numpad2") sim.goToBase();
			if (e.code === "Digit7" || e.code === "Numpad7") sim.toggleAiPilot();
			if (e.code === "KeyH" || e.code === "Slash") setHelp((v) => {
				if (!v) setHelpPage(classId);
				return !v;
			});
			if (e.code === "Escape") setPaused((v) => !v);
		};
		const up = (e) => {
			sim.keys.delete(e.code);
		};
		const blur = () => {
			sim.keys.clear();
			sim.touchSteer = 0;
			sim.touchWarp = 0;
			sim.touchClimb = 0;
			sim.touchPhaser = false;
			sim.touchTorp = false;
			sim.touchDrone = false;
			sim.touchMine = false;
		};
		const hide = () => sim.breaksave();
		window.addEventListener("keydown", down);
		window.addEventListener("keyup", up);
		window.addEventListener("blur", blur);
		window.addEventListener("pagehide", hide);
		window.addEventListener("beforeunload", hide);
		return () => {
			cancelAnimationFrame(raf);
			observer.disconnect();
			window.removeEventListener("keydown", down);
			window.removeEventListener("keyup", up);
			window.removeEventListener("blur", blur);
			window.removeEventListener("pagehide", hide);
			window.removeEventListener("beforeunload", hide);
			delete window.__controlsTest;
		};
	}, [
		name,
		classId,
		bots
	]);
	const onPointer = (e) => {
		const sim = simRef.current;
		const canvas = canvasRef.current;
		if (!sim || !canvas || sim.over) return;
		unlockAudio();
		const rect = canvas.getBoundingClientRect();
		const sx = e.clientX - rect.left;
		const sy = e.clientY - rect.top;
		const cmd = pointerCommand(sim, rect.width, rect.height, sx, sy);
		if (!cmd) return;
		if (cmd.kind === "lock") sim.lockShip(cmd.id);
		else if (cmd.go) sim.setWaypoint(cmd.x, cmd.y);
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
		if (kind === "zup") sim.touchClimb = on ? 1 : sim.touchClimb === 1 ? 0 : sim.touchClimb;
		if (kind === "zdn") sim.touchClimb = on ? -1 : sim.touchClimb === -1 ? 0 : sim.touchClimb;
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
		if (sim.pendingMap) {
			const macro = hail.trim().slice(0, 48);
			if (macro) sim.keymaps[sim.pendingMap] = macro;
			else delete sim.keymaps[sim.pendingMap];
			saveKeymaps(sim.keymaps);
			sim.say(macro ? `Mapped ${sim.pendingMap}.` : `Cleared ${sim.pendingMap}.`, "info");
			sim.pendingMap = "";
			setHail("");
			setSnap(sim.snapshot());
			return;
		}
		const sent = sim.hail(hail);
		if (sent) netSend.current?.({
			k: "hail",
			text: sent.text,
			to: sent.to,
			n: Date.now()
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
						children: [
							"OTREK · OXY · ",
							room ? "QUADRANT" : "SOLO",
							" · ",
							snap?.quad ?? "ALPHA"
						]
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
							onClick: () => setPaused((v) => !v),
							className: `h-10 border px-3 font-mono text-xs ${paused ? "border-amber text-amber" : "border-line text-fg"}`,
							children: paused ? "Resume" : "Pause"
						})
					]
				})]
			}),
			snap && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 gap-3 overflow-x-auto border-b border-line px-3 py-2 font-mono text-xs md:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["W ", snap.warp.toFixed(1)] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Z ", Math.round(snap.z)] }),
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
				className: "flex min-h-0 flex-1 flex-row",
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
							(() => {
								const line = snap?.messages.find((entry) => entry.tone === "hail");
								if (!line || !snap || snap.t - (line.at ?? 0) > 4) return null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "hail-flash pointer-events-none absolute top-16 left-1/2 z-10 max-w-lg -translate-x-1/2 px-3 text-center font-mono text-sm font-semibold",
									children: line.text
								}, `${line.at}-${line.text}`);
							})(),
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
												onClick: () => {
													simRef.current?.breaksave();
													onLeave();
												},
												children: "Shipyard"
											})]
										})
									]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "flex min-h-0 w-40 shrink-0 flex-col border-l border-line sm:w-60",
						children: [room ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NetLink, {
							room,
							name,
							simRef,
							sendRef: netSend
						}) : null, snap && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scanner, {
							snap,
							onLock: (id) => act((sim) => sim.lockShip(id))
						})]
					})
				]
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
						label: "Z+",
						on: hold,
						kind: "zup"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pad, {
						label: "Z−",
						on: hold,
						kind: "zdn"
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex shrink-0 items-center gap-2 border-t border-line px-3 py-2",
				onSubmit: (e) => {
					e.preventDefault();
					sendHail();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: hail,
					onChange: (e) => setHail(e.target.value),
					placeholder: simRef.current?.pendingMap ? "Macro, then Send. w s f t g m r c z i x . u b" : "Hail. @text talks to your lock.",
					"aria-label": "Hail",
					className: "min-w-0 flex-1 border border-line bg-surface px-2 py-1.5 font-mono text-xs text-fg outline-none focus:border-amber"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "border border-line px-3 py-1.5 font-mono text-xs",
					children: "Send"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "hidden shrink-0 items-stretch border-t border-line md:flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setPaused((v) => !v),
					className: `shrink-0 border-r border-line px-4 font-mono text-xs ${paused ? "text-amber" : "text-fg"}`,
					children: paused ? "Resume" : "Pause"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-0 flex-1 overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "key-marquee py-2 font-mono text-xs whitespace-nowrap text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-6",
							children: "W raises warp · S lowers warp, then reverse · Up / Down change Z · Shift+W slows · A / Left turn left · D / Right turn right · click a ship to lock · 2 nearest base, dock and repair · 5 autolock · 7 AI helm · click the long-range chart to fly there · Space F P phasers · T torpedoes · G drones · M mines · R raise shields · Shift+R drop shields · C repair · Z cloak · I intercept · X transwarp · . dock (reloads torpedoes) · U undock · H or / help · 9 dock log · Esc pause · type and Send to hail"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-6",
							"aria-hidden": "true",
							children: "W raises warp · S lowers warp, then reverse · Up / Down change Z · Shift+W slows · A / Left turn left · D / Right turn right · click a ship to lock · 2 nearest base, dock and repair · 5 autolock · 7 AI helm · click the long-range chart to fly there · Space F P phasers · T torpedoes · G drones · M mines · R raise shields · Shift+R drop shields · C repair · Z cloak · I intercept · X transwarp · . dock (reloads torpedoes) · U undock · H or / help · 9 dock log · Esc pause · type and Send to hail"
						})]
					})
				})]
			}),
			(paused || help) && snap?.phase !== "dead" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-10 flex items-center justify-center bg-bg/80 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-[80vh] w-full max-w-lg overflow-y-auto border border-line bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs tracking-widest text-amber",
							children: help ? "HELP" : "PAUSED"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-sans text-xl font-semibold",
							children: helpPage === "commands" ? help ? "How to fight" : snap?.name : classById(helpPage).name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setHelpPage("commands"),
								className: `border px-2 py-1 font-mono text-[10px] ${helpPage === "commands" ? "border-amber text-amber" : "border-line text-muted"}`,
								children: "Commands"
							}), CLASSES.map((cls) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setHelpPage(cls.id),
								className: `border px-2 py-1 font-mono text-[10px] ${helpPage === cls.id ? "border-amber text-amber" : cls.id === classId ? "border-line text-fg" : "border-line text-muted"}`,
								children: cls.code
							}, cls.id))]
						}),
						helpPage === "commands" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-2 font-mono text-xs leading-relaxed text-fg",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber",
									children: "Flight."
								}), " W raises warp, one step per tap and more if you hold it. Past the cruising maximum it is overwarp: crystals burn and fuel drops. The last number is damage warp and the hull tears. S lowers warp and then reverses. Up and Down change Z. A or Left turns left. D or Right turns right. Click empty space to come about. Click the long-range chart to plot a course, including the Z of a body you click."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber",
									children: "Space."
								}), " A nebula ignores shields and shortens the scan. Asteroids take 10 shield points a second above warp 8. A quasar, and a pulsar while it is awake, make a cloak useless. Cygnus pulls, and the core throws you somewhere else. [ binds a keymap. ] clears one. @ at the start of a hail talks only to your lock."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber",
									children: "Lock."
								}), " Autolock is on when you launch. It holds the ship shooting at you, otherwise the closest one you can see. Press 5 to turn autolock off and pick a lock yourself. Click a ship on the radar or the forward view. Humans are a, b, c. Blue beams are yours. Red beams are theirs."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber",
									children: "Base run."
								}), " 2 steers to the closest starbase, slows, docks, and the yard repairs the hull and refills everything. Press 2 again, or touch the helm, to cancel."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber",
									children: "AI helm."
								}), " 7 hands your ship to the same captain the robots use. It hunts, shoots, flees, and docks. Press 7 again to take the helm back."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber",
									children: "Phasers."
								}), " Space, F, or P. A lock fires on that ship. No lock fires the forward arc for less damage. ESI hits every ship in range, and a crowd weakens each shot."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber",
									children: "Torpedoes."
								}), " T fires. Locked shots curve in. Unlocked shots fly straight. They hit harder the farther they travel. Empty tubes do not refill in flight. Dock to reload."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber",
									children: "Obliterators."
								}), " KEV-12 and KPB-13 put one torpedo back every two seconds. You still dock to fill the rack."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber",
									children: "Agonizers."
								}), " The warbird's phasers are flat and each shot spends one torpedo."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber",
									children: "Drones and mines."
								}), " G launches a drone. M drops a mine. Both classes that carry them reload only by docking."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber",
									children: "Dock."
								}), " Close inside 100 of a starbase and drop under warp 1.4, then press . (period). Docking refills hull, shields, energy, torpedoes, drones, mines, and dilithium. Gold aboard is banked: damage dealt, plus veteran bonus, divided by 10. U undocks. You cannot shoot while docked."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber",
									children: "Shields and repair."
								}), " R latches shields up. Shift+R drops them. C toggles damage control, which spends energy to mend the hull. Dilithium soaks hits that punch the shields. Feeding planets trickle energy if you orbit them."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber",
									children: "Cloak."
								}), " Z, on a ship that has one. It burns energy. You cannot fire, and a cloaked ship cannot take a wormhole. Other ships lose you past short range."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber",
									children: "Intercept and transwarp."
								}), " I steers onto the locked ship. X engages transwarp and spends energy. An Excelsior tracks the lock. A DY-600 teleporter overshoots and will not track. The teleporter phaser also shoves you clear of the target."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber",
									children: "Wormholes."
								}), " They open and shut about once a minute. The same ship must wait a minute to transit again. The rim of the quadrant turns you about."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber",
									children: "Hail and log."
								}), " Type at the bottom and press Send. A hail flashes yellow and the boatswain's pipe sounds. 9 shows dock, undock, and vault lines. H or / opens this list. Esc pauses. The codes above open one page per ship."] })
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShipPage, {
							cls: classById(helpPage),
							yours: helpPage === classId
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
function ShipPage({ cls, yours }) {
	const lines = [
		`${cls.race}. Home ${cls.home}. Cruise warp ${cls.cruise}, damage warp ${cls.maxWarp}. Hull ${cls.hull}. Scan ${cls.scan}.`,
		`${cls.torpName} × ${cls.magazine}. ${cls.torpMin}–${cls.torpMax}. They hit harder the farther they fly. Dock to reload the tubes.`,
		`Phasers ${cls.phaser} out to ${cls.phaserRange}. Space, F, or P.`
	];
	if (cls.esi) lines.push("Expanding-sphere phasers hit every ship in range. A crowd splits the shot. A duel does not.");
	if (cls.agonizer) lines.push("Agonizers are flat. Each phaser shot spends one torpedo. An empty rack cannot fire them.");
	if (cls.regenTorp) lines.push("Obliterators grow back, one every two seconds. Docking still fills the rack.");
	if (cls.teleport) lines.push("The phaser shoves you clear of the target. Transwarp flies straight and will not track. Press X.");
	else if (cls.transwarp) lines.push("Transwarp tracks a locked ship. Press X. It spends energy.");
	if (cls.cloak) lines.push("Z cloaks. You cannot fire, and a cloaked ship cannot take a wormhole.");
	else lines.push("No cloak on this class.");
	if ((cls.drones ?? 0) > 0) lines.push(`G launches a drone. ${cls.drones} aboard${cls.droneVar ? ", and each one leaves at a different speed" : ""}. Dock to reload.`);
	if ((cls.mines ?? 0) > 0) lines.push(`M drops a mine. ${cls.mines} aboard. Dock to reload.`);
	if ((cls.crystals ?? 0) > 0) lines.push(`${cls.crystals} dilithium crystals soak hits that punch the shields. Dock refills them.`);
	lines.push("Get inside 100 of a starbase, under warp 1.4, and press . to dock. U undocks.");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-[10px] tracking-widest text-muted",
				children: [cls.code, yours ? " · YOUR SHIP" : ""]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-fg",
				children: cls.blurb
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2 font-mono text-xs leading-relaxed text-fg",
				children: lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line))
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
				k: "DAMAGE W",
				v: String(snap.damageWarp)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				k: "HEADING",
				v: pad3(snap.heading)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				k: "Z",
				v: String(Math.round(snap.z))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
				k: "ENERGY",
				pct: snap.energyMax > 0 ? snap.energy / snap.energyMax : 0
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				k: "ANTIMATTER",
				v: String(Math.round(snap.antimatter))
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
				k: "AUTOLOCK",
				v: snap.autoLock ? "ON" : "OFF"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				k: "BASE RUN",
				v: snap.seekBase ? "ON" : "OFF"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				k: "AI HELM",
				v: snap.aiPilot ? "ON" : "OFF"
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
					className: `font-mono text-xs leading-relaxed ${line.tone === "hail" ? "hail-flash" : line.tone === "alert" ? "text-alert" : line.tone === "amber" ? "text-amber" : "text-muted"}`,
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
function resolveSignInGateState(input) {
	if (input.isPending) return "pending";
	return input.hasUser ? "signed_in" : "signed_out";
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	return useSessionUserState();
}
function useSessionUserState() {
	const { data, isPending } = authClient.useSession();
	const id = data?.user.id;
	const displayName = data?.user.name ?? null;
	const primaryEmail = data?.user.email ?? null;
	const profileImageUrl = data?.user.image ?? null;
	const user = (0, import_react.useMemo)(() => id ? {
		id,
		displayName,
		primaryEmail,
		profileImageUrl,
		isDevFallback: false
	} : null, [
		id,
		displayName,
		primaryEmail,
		profileImageUrl
	]);
	return (0, import_react.useMemo)(() => ({
		user,
		isPending
	}), [user, isPending]);
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
function SignInGate({ children, fallback }) {
	const { user, isPending } = useCurrentUserState();
	const state = resolveSignInGateState({
		isPending,
		hasUser: user !== null
	});
	if (state === "pending") return null;
	if (state === "signed_in") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: fallback ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInButtons, {}) });
}
function SignInButtons() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex w-full max-w-sm flex-col gap-2",
		children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => signIn(p.providerId, { callbackURL: "/" }),
			className: "w-full cursor-pointer rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900",
			children: ["Continue with ", p.label]
		}, p.providerId))
	});
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var QUADRANT = "ALPHA";
function Shipyard({ onStart }) {
	const [classId, setClassId] = (0, import_react.useState)(CLASSES[0].id);
	const [name, setName] = (0, import_react.useState)("USS Intrepid");
	const [real, setReal] = (0, import_react.useState)(true);
	const [mode, setMode] = (0, import_react.useState)("quadrant");
	const [lobbyId] = (0, import_react.useState)(() => `w-${Math.random().toString(36).slice(2, 10)}`);
	const selected = CLASSES.find((c) => c.id === classId) ?? CLASSES[0];
	const linked = mode !== "solo";
	const live = useBoard(lobbyId, name.trim().slice(0, 18) || "unnamed", false, linked);
	(0, import_react.useEffect)(() => {
		const saved = loadCallsign();
		setName(saved.name);
		if (CLASSES.some((c) => c.id === saved.classId)) setClassId(saved.classId);
		const q = new URLSearchParams(window.location.search);
		if (q.get("play") === "humans") setMode("humans");
		else if (q.get("play") === "quadrant" || q.get("room")) setMode("quadrant");
	}, []);
	const launch = () => {
		const trimmed = name.trim().slice(0, 18) || "USS Intrepid";
		saveCallsign(trimmed, selected.id);
		const url = new URL(window.location.href);
		url.searchParams.delete("room");
		if (mode === "humans") url.searchParams.set("play", "humans");
		else if (mode === "quadrant") url.searchParams.set("play", "quadrant");
		else url.searchParams.delete("play");
		window.history.replaceState(null, "", url);
		onStart(trimmed, selected.id, linked ? QUADRANT : null, mode !== "humans");
	};
	const sheet = SHEETS[selected.id];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh min-h-0 flex-col overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "shrink-0 border-b border-line px-4 py-3 md:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "pl-[0.22em] font-sans text-2xl font-light tracking-[0.22em] text-gold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-amber",
								children: "O"
							}), "TREK"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] tracking-[0.35em] text-muted",
							children: "O FOR OXY · PORT 1701"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-[16rem] flex-1 border border-line bg-surface px-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono text-[10px] tracking-widest text-amber",
									children: ["HUMANS · ", (live.humans.length || 0) + (linked ? 1 : 0)]
								}),
								!linked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-mono text-xs text-muted",
									children: "Solo. Other players cannot see this ship."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "mt-1 space-y-0.5 font-mono text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "truncate",
										children: [name.trim() || "unnamed", " · you"]
									}), live.humans.map((player) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "truncate",
										children: [player.name, player.playing ? " · in the fight" : " · logged in"]
									}, player.id))]
								}),
								live.notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-mono text-xs text-amber",
									children: live.notice
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-mono text-[10px] text-muted",
									children: linked ? live.status : ""
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							role: "switch",
							"aria-checked": real,
							onClick: () => setReal((on) => !on),
							className: "flex shrink-0 items-center gap-2 border border-line bg-surface px-3 py-2 font-mono text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `relative h-5 w-9 border ${real ? "border-amber bg-amber" : "border-line bg-bg"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute top-0.5 h-3.5 w-3.5 ${real ? "right-0.5 bg-bg" : "left-0.5 bg-muted"}` })
							}), "Show real stats"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted",
					children: "A browser port of the real-time starship duel. Damage becomes gold-pressed latinum only after you dock. If the hull goes, unbanked bars go with it."
				})]
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-mono text-xs tracking-widest text-muted",
									children: "QUADRANT"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-relaxed text-muted",
									children: "One room, like the original. Everyone starts in Alpha. The wormhole is the door to Beta. Solo is you and the robots. Quadrant adds whoever else is here. Humans only is that same board with no robots."
								}),
								!linked || live.humans.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 border border-line px-3 py-3 font-mono text-xs text-muted",
									children: mode === "solo" ? "Solo. The robots are already out." : mode === "humans" ? live.status === "on the board" ? "No other players yet. No robots in this mode." : live.status : live.status === "on the board" ? "No other players yet. The robots are already out." : live.status
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 font-mono text-xs text-amber",
									children: live.notice || "The list above is every human on this board."
								}),
								mode === "humans" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted",
									children: "No robots."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted",
									children: QUADRANT_ROBOTS.join(" · ")
								})
							]
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
									children: "Class table. Warp is turn / cruise / damage. Energy in parentheses is the table maximum."
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
									children: "Numbers the patrol actually uses. The chart is the old Alpha quadrant, fitted onto this board."
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
										children: "JavaTrek (GPL) is Joe Hopkinson and Jay Ashworth’s engine, from Chuck L. Peterson’s 1986 game. This board took the next letter: OTrek. The O is Oxy. Upstream is SourceForge and the rumour/jtrek tree. The live games are telnet, not this page: mtrek.com 1701, javatrek.org 1764, rbop.net 2000. Steve Scherf kept the 1993 C source. Justin Flude made that build run again (mtrek.site 1993, justinflude.org 1993)."
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-mono text-xs tracking-widest text-muted",
										children: "FLEET BOARD"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm leading-relaxed text-muted",
										children: "The vault on this board is the one that counts. Dock to bank it. Leave a fight and the breaksave posts here too: under 1,000 gold the bank is forfeit, otherwise the vault is cut by a third."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 min-h-16",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInGate, {
											fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm text-muted",
													children: "Sign in to post your vault and read the fleet."
												}), GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => signIn(p.providerId, { callbackURL: "/" }),
													className: "block w-full border border-line px-3 py-2 text-left font-mono text-xs hover:border-amber",
													children: ["Continue with ", p.label]
												}, p.providerId))]
											}),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FleetBoard, {})
										})
									})
								] })
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "flex shrink-0 flex-col gap-2 border-t border-line px-4 py-3 md:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-muted",
								children: "PLAY"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": mode === "solo",
								onClick: () => setMode("solo"),
								className: `h-11 border px-4 font-mono text-xs ${mode === "solo" ? "border-amber text-amber" : "border-line"}`,
								children: "Solo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": mode === "quadrant",
								onClick: () => setMode("quadrant"),
								className: `h-11 border px-4 font-mono text-xs ${mode === "quadrant" ? "border-amber text-amber" : "border-line"}`,
								children: "Quadrant"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": mode === "humans",
								onClick: () => setMode("humans"),
								className: `h-11 border px-4 font-mono text-xs ${mode === "humans" ? "border-amber text-amber" : "border-line"}`,
								children: "Humans only"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs text-muted",
						children: "Solo is you and the robot ships. Quadrant is that board plus whoever else is here. Humans only is the same fight with no robots."
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
function FleetBoard() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let cancel = false;
		listBoard().then((next) => {
			if (!cancel) setRows(next);
		}).catch(() => {
			if (!cancel) setRows([]);
		}).finally(() => {
			if (!cancel) setReady(true);
		});
		return () => {
			cancel = true;
		};
	}, []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-mono text-xs text-muted",
		children: "Reading the board…"
	});
	if (rows.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "No gold posted yet. Dock to bank, and the vault lands here."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "space-y-1 font-mono text-xs",
		children: rows.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: `truncate ${row.yours ? "text-amber" : ""}`,
				children: [
					i + 1,
					". ",
					row.callsign,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: row.code
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-gold",
				children: [row.gold.toLocaleString("en-US"), row.breaks > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted",
					children: [" BRK ", row.breaks]
				}) : null]
			})]
		}, `${row.callsign}-${row.code}-${i}`))
	});
}
function TitleCard({ onEngage }) {
	const canvasRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if (event.repeat) return;
			if (event.key !== "Enter" && event.key !== " " && event.key !== "Escape") return;
			event.preventDefault();
			onEngage();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onEngage]);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const stars = Array.from({ length: 220 }, () => ({
			x: Math.random() * 2 - 1,
			y: Math.random() * 2 - 1,
			z: Math.random()
		}));
		let raf = 0;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const frame = () => {
			const dpr = Math.min(2, window.devicePixelRatio || 1);
			const w = canvas.clientWidth;
			const h = canvas.clientHeight;
			canvas.width = Math.max(1, Math.floor(w * dpr));
			canvas.height = Math.max(1, Math.floor(h * dpr));
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.fillStyle = "#000";
			ctx.fillRect(0, 0, w, h);
			const cx = w / 2;
			const cy = h * .42;
			for (const star of stars) {
				if (!reduce) {
					star.z -= .0035;
					if (star.z <= .02) {
						star.z = 1;
						star.x = Math.random() * 2 - 1;
						star.y = Math.random() * 2 - 1;
					}
				}
				const depth = .08 + star.z;
				const px = cx + star.x / depth * w * .45;
				const py = cy + star.y / depth * h * .45;
				if (px < -4 || py < -4 || px > w + 4 || py > h + 4) continue;
				const size = Math.max(.6, (1 - star.z) * 2.4);
				const bright = .25 + (1 - star.z) * .75;
				ctx.fillStyle = `rgba(214, 228, 242, ${bright})`;
				ctx.fillRect(px, py, size, size);
			}
			raf = requestAnimationFrame(frame);
		};
		raf = requestAnimationFrame(frame);
		return () => cancelAnimationFrame(raf);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-dvh w-full overflow-hidden bg-black text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "absolute inset-0 h-full w-full"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.2)_48%,#000_100%)]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/ships/title-flyby.png",
				alt: "",
				className: "trek-drift pointer-events-none absolute top-[1%] left-1/2 max-h-[46vh] w-auto max-w-[96vw] object-contain"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "trek-title-in pointer-events-none absolute inset-x-0 bottom-[16%] flex flex-col items-center px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] tracking-[0.55em] text-gold/80",
						children: "THE OPEN QUADRANT"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "relative mt-3 pl-[0.28em] font-sans text-[clamp(3.4rem,11vw,7.25rem)] leading-none font-light tracking-[0.28em] text-gold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-amber",
								children: "O"
							}),
							"TREK",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "trek-flare absolute top-1/2 right-[-6%] left-[-6%] h-px bg-gradient-to-r from-transparent via-white to-transparent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "trek-flare absolute top-1/2 right-[8%] left-[8%] h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent blur-[1.5px]" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 pl-[0.45em] font-mono text-[11px] tracking-[0.45em] text-fg/90",
						children: "O FOR OXY"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-mono text-[10px] tracking-[0.32em] text-muted",
						children: "PORT 1701"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onEngage,
				className: "pulse-alert absolute bottom-[7%] left-1/2 -translate-x-1/2 font-mono text-xs tracking-[0.5em] text-amber",
				"aria-label": "Engage. Enter the shipyard.",
				children: "ENGAGE"
			})
		]
	});
}
function Home() {
	const [title, setTitle] = (0, import_react.useState)(true);
	const [flight, setFlight] = (0, import_react.useState)(null);
	if (!flight && title) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleCard, { onEngage: () => setTitle(false) });
	if (!flight) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shipyard, { onStart: (name, classId, room, bots) => setFlight({
		name,
		classId,
		id: Date.now(),
		room,
		bots
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bridge, {
		name: flight.name,
		classId: flight.classId,
		room: flight.room,
		bots: flight.bots,
		onLeave: () => setFlight(null)
	}, flight.id);
}
//#endregion
export { Home as component };
