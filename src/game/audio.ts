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

export const sfx = {
  phaser() {
    tone(220, 0.14, "sawtooth", 0.03, -140);
  },
  torp() {
    tone(90, 0.18, "square", 0.025, -30);
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
