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

export const sfx = {
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
};
