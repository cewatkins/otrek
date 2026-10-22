let ctx: AudioContext | null = null;

export function unlockAudio() {
  if (typeof window === "undefined") return;
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
}

function tone(freq: number, dur: number, type: OscillatorType, gain: number, slide = 0) {
  if (!ctx || ctx.state !== "running") return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
  amp.gain.setValueAtTime(gain, t);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(amp);
  amp.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function burst(freq: number, q: number, dur: number, gain: number) {
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
  amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter);
  filter.connect(amp);
  amp.connect(ctx.destination);
  src.start(t);
  src.stop(t + dur + 0.02);
}

let hailBuf: AudioBuffer | null = null;
let hailLoading = false;

function playHailBuffer() {
  if (!ctx || ctx.state !== "running" || !hailBuf) return;
  const src = ctx.createBufferSource();
  const amp = ctx.createGain();
  src.buffer = hailBuf;
  amp.gain.setValueAtTime(0.55, ctx.currentTime);
  src.connect(amp);
  amp.connect(ctx.destination);
  src.start();
}
let introBus: GainNode | null = null;
let introOn = false;
let introTimer: ReturnType<typeof setTimeout> | null = null;

const introNodes: OscillatorNode[] = [];
const PHRASE = [196, 247, 294, 392, 494, 392, 330, 247];

function toneAt(freq: number, when: number, dur: number, type: OscillatorType, gain: number, dest: AudioNode) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, when);
  amp.gain.setValueAtTime(0.0001, when);
  amp.gain.exponentialRampToValueAtTime(gain, when + 0.08);
  amp.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  osc.connect(amp);
  amp.connect(dest);
  introNodes.push(osc);
  osc.onended = () => {
    const i = introNodes.indexOf(osc);
    if (i >= 0) introNodes.splice(i, 1);
  };
  osc.start(when);
  osc.stop(when + dur + 0.05);
}

function queuePhrase() {
  if (!ctx || !introBus || !introOn) return;
  const start = ctx.currentTime + 0.06;
  const step = 0.62;
  PHRASE.forEach((freq, i) => {
    const when = start + i * step;
    toneAt(freq, when, 0.9, "triangle", 0.045, introBus!);
    toneAt(freq / 2, when, 1.05, "sine", 0.03, introBus!);
  });
  toneAt(98, start, PHRASE.length * step, "sine", 0.02, introBus);
  introTimer = setTimeout(() => queuePhrase(), PHRASE.length * step * 1000);
}

export function introLive() {
  return introOn;
}

export const sfx = {
  /** Title cue. Returns false until the browser lets audio run. */
  intro() {
    unlockAudio();
    if (!ctx || ctx.state !== "running") return false;
    if (introOn) return true;
    introOn = true;
    introBus = ctx.createGain();
    introBus.gain.setValueAtTime(0.0001, ctx.currentTime);
    introBus.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 0.35);
    introBus.connect(ctx.destination);
    queuePhrase();
    return true;
  },
  stopIntro() {
    introOn = false;
    if (introTimer) clearTimeout(introTimer);
    introTimer = null;
    for (const osc of introNodes) {
      try {
        osc.stop();
      } catch {
        /* already stopped */
      }
    }
    introNodes.length = 0;
    if (introBus) {
      try {
        introBus.disconnect();
      } catch {
        /* already disconnected */
      }
      introBus = null;
    }
  },
  phaser() {
    tone(980, 0.16, "sawtooth", 0.045, -720);
    tone(1480, 0.11, "square", 0.018, -1100);
    burst(2200, 4, 0.1, 0.05);
  },
  torp() {
    tone(160, 0.32, "sine", 0.07, -90);
    tone(70, 0.38, "triangle", 0.05, -30);
    burst(420, 1.2, 0.22, 0.06);
  },
  hit() {
    tone(140, 0.08, "triangle", 0.03);
  },
  explode() {
    tone(70, 0.4, "sawtooth", 0.05, -40);
  },
  dock() {
    tone(330, 0.12, "sine", 0.03);
    tone(440, 0.16, "sine", 0.02);
  },
  gold() {
    tone(520, 0.1, "sine", 0.025);
  },
  warn() {
    tone(180, 0.2, "square", 0.02);
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
    void fetch("/sfx/hail.ogg")
      .then((res) => res.arrayBuffer())
      .then((raw) => ctx?.decodeAudioData(raw))
      .then((buf) => {
        if (!buf) return;
        hailBuf = buf;
        playHailBuffer();
      })
      .catch(() => {
        hailLoading = false;
      });
  },
};
