import { useEffect, useRef, useState } from "react";
import { introLive, sfx } from "@/game/audio";

type Props = {
  onEngage: () => void;
};

export function TitleCard({ onEngage }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heard = useRef(false);
  const [sound, setSound] = useState(false);

  const poke = () => {
    const already = heard.current && introLive();
    if (sfx.intro()) {
      heard.current = true;
      setSound(true);
    }
    return already;
  };

  useEffect(() => {
    poke();
    const onKey = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.key !== "Enter" && event.key !== " " && event.key !== "Escape") return;
      event.preventDefault();
      if (poke()) onEngage();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      sfx.stopIntro();
    };
  }, [onEngage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random(),
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
      const cy = h * 0.42;
      for (const star of stars) {
        if (!reduce) {
          star.z -= 0.0035;
          if (star.z <= 0.02) {
            star.z = 1;
            star.x = Math.random() * 2 - 1;
            star.y = Math.random() * 2 - 1;
          }
        }
        const depth = 0.08 + star.z;
        const px = cx + (star.x / depth) * w * 0.45;
        const py = cy + (star.y / depth) * h * 0.45;
        if (px < -4 || py < -4 || px > w + 4 || py > h + 4) continue;
        const size = Math.max(0.6, (1 - star.z) * 2.4);
        const bright = 0.25 + (1 - star.z) * 0.75;
        ctx.fillStyle = `rgba(214, 228, 242, ${bright})`;
        ctx.fillRect(px, py, size, size);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="relative h-dvh w-full overflow-hidden bg-black text-left"
      onPointerDown={(event) => {
        if ((event.target as HTMLElement).closest("button")) return;
        poke();
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.2)_48%,#000_100%)]" />
      <img
        src="/ships/title-flyby.png"
        alt=""
        className="trek-drift pointer-events-none absolute top-[1%] left-1/2 max-h-[46vh] w-auto max-w-[96vw] object-contain"
      />
      <div className="trek-title-in pointer-events-none absolute inset-x-0 bottom-[16%] flex flex-col items-center px-6">
        <p className="font-mono text-[10px] tracking-[0.55em] text-gold/80">THE OPEN QUADRANT</p>
        <h1 className="relative mt-3 pl-[0.28em] font-sans text-[clamp(3.4rem,11vw,7.25rem)] leading-none font-light tracking-[0.28em] text-gold">
          <span className="text-amber">O</span>TREK
          <span className="trek-flare absolute top-1/2 right-[-6%] left-[-6%] h-px bg-gradient-to-r from-transparent via-white to-transparent" />
          <span className="trek-flare absolute top-1/2 right-[8%] left-[8%] h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent blur-[1.5px]" />
        </h1>
        <p className="mt-4 pl-[0.45em] font-mono text-[11px] tracking-[0.45em] text-fg/90">O FOR OXY</p>
        <p className="mt-2 font-mono text-[10px] tracking-[0.32em] text-muted">PORT 1701</p>
      </div>
      <button
        type="button"
        onClick={() => {
          if (poke()) onEngage();
        }}
        className="pulse-alert absolute bottom-[7%] left-1/2 -translate-x-1/2 font-mono text-xs tracking-[0.5em] text-amber"
        aria-label={sound ? "Engage. Enter the shipyard." : "Start the title cue."}
      >
        {sound ? "ENGAGE" : "CLICK FOR SOUND"}
      </button>
    </div>
  );
}