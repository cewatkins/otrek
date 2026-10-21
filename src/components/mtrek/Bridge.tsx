import { useEffect, useRef, useState, type PointerEvent } from "react";
import { unlockAudio } from "@/game/audio";
import { cameraFor, drawTactical, pointerCommand } from "@/game/draw";
import { saveScore } from "@/game/scores";
import { TrekSim, type Snapshot } from "@/game/sim";
import { NetLink } from "@/components/mtrek/NetLink";

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      setKeys?: (codes: string[]) => void;
      setSteer?: (v: number) => void;
    };
  }
}

type Props = {
  name: string;
  classId: string;
  room: string | null;
  onLeave: () => void;
};

function pad3(n: number) {
  return Math.round(n).toString().padStart(3, "0");
}

function clock(s: number) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function Bridge({ name, classId, room, onLeave }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simRef = useRef<TrekSim | null>(null);
  const netSend = useRef<((data: unknown) => void) | null>(null);
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [paused, setPaused] = useState(false);
  const [help, setHelp] = useState(false);
  const [hail, setHail] = useState("");
  const pausedRef = useRef(false);
  pausedRef.current = paused || help;

  useEffect(() => {
    const sim = new TrekSim(name, classId, { bots: !room });
    simRef.current = sim;
    sim.onBank = (ship) => {
      saveScore({
        name: ship.name,
        code: ship.cls.code,
        gold: Math.floor(ship.banked),
        dmg: Math.floor(ship.dmgGiven),
        kills: ship.kills,
        at: Date.now(),
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
      },
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
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
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
      if (hud > 0.1) {
        hud = 0;
        setSnap(sim.snapshot());
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const down = (e: KeyboardEvent) => {
      const target = e.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
      sim.keys.add(e.code);
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault();
      }
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
    const up = (e: KeyboardEvent) => {
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

  const onPointer = (e: PointerEvent<HTMLCanvasElement>) => {
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

  const hold = (kind: "left" | "right" | "up" | "down" | "phaser" | "torp" | "drone" | "mine", on: boolean) => {
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

  const act = (fn: (sim: TrekSim) => void) => {
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
    if (hail.trim()) netSend.current?.({ k: "hail", text: `${name}: ${hail.trim().slice(0, 80)}` });
    setHail("");
    setSnap(sim.snapshot());
  };

  return (
    <div className="relative flex h-dvh min-h-0 flex-col overflow-hidden bg-bg text-fg">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-3 py-2 md:px-4">
        <div className="min-w-0">
          <p className="font-mono text-xs tracking-widest text-amber">
            OTREK · OXY · {room ? "QUADRANT" : "SOLO"}
          </p>
          <p className="truncate font-sans text-sm font-semibold">
            {snap ? `${snap.letter} ${snap.name}` : name}{" "}
            <span className="font-mono text-xs font-normal text-muted">{snap?.code}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="hidden font-mono text-xs text-muted sm:block">
            BANK {snap ? snap.banked.toLocaleString("en-US") : "0"}
            <span className="text-gold"> +{snap?.unbanked ?? 0}</span>
          </p>
          <button
            type="button"
            onClick={() => setHelp(true)}
            className="h-10 border border-line px-3 font-mono text-xs text-fg"
          >
            Help
          </button>
          <button
            type="button"
            onClick={() => setPaused(true)}
            className="h-10 border border-line px-3 font-mono text-xs text-fg"
          >
            Pause
          </button>
        </div>
      </header>
      {room ? <NetLink room={room} name={name} simRef={simRef} sendRef={netSend} /> : null}

      {snap && (
        <div className="flex shrink-0 gap-3 overflow-x-auto border-b border-line px-3 py-2 font-mono text-xs md:hidden">
          <span>W {snap.warp.toFixed(1)}</span>
          <span className={snap.hull / snap.hullMax < 0.3 ? "text-alert" : ""}>
            HULL {Math.round((snap.hull / snap.hullMax) * 100)}%
          </span>
          <span>SH {Math.round(snap.shield)}%</span>
          {snap.crystalsMax > 0 && <span>XL {snap.crystals}</span>}
          <span className="text-amber">+{snap.unbanked}</span>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <aside className="hidden w-60 shrink-0 overflow-y-auto border-r border-line p-3 md:block">
          {snap && <Status snap={snap} />}
        </aside>

        <div className="relative min-h-0 min-w-0 flex-1">
          <canvas
            ref={canvasRef}
            onPointerDown={onPointer}
            className="h-full w-full touch-none"
            aria-label="Tactical display"
          />
          {snap?.docked && (
            <div className="pointer-events-none absolute top-3 left-3 border border-amber bg-bg/90 px-3 py-2 font-mono text-xs text-amber">
              DOCKED · {snap.dockName}
              <span className="mt-1 block text-fg">Gold is in the vault. Press U to undock.</span>
            </div>
          )}
          {snap && !snap.docked && snap.phase === "play" && (
            <p className="pointer-events-none absolute bottom-3 left-3 max-w-xs font-mono text-xs text-muted">
              {snap.hint}
            </p>
          )}
          {snap?.phase === "dead" && (
            <div className="absolute inset-0 flex items-center justify-center bg-bg/75 p-4">
              <div className="w-full max-w-sm border border-alert bg-surface p-5">
                <p className="font-mono text-xs tracking-widest text-alert">SHIP DESTROYED</p>
                <h2 className="mt-2 font-sans text-xl font-semibold">Lost to {snap.killedBy}</h2>
                <dl className="mt-4 space-y-1 font-mono text-xs">
                  <Row k="Vault" v={snap.banked.toLocaleString("en-US")} />
                  <Row k="Unbanked lost" v={String(snap.unbanked)} />
                  <Row k="Damage given" v={snap.dmgGiven.toLocaleString("en-US")} />
                  <Row k="Kills" v={String(snap.kills)} />
                  <Row k="Time" v={clock(snap.survived)} />
                </dl>
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    className="h-11 flex-1 bg-amber font-semibold text-bg"
                    onClick={() =>
                      act((sim) => {
                        sim.relaunch();
                      })
                    }
                  >
                    Relaunch
                  </button>
                  <button
                    type="button"
                    className="h-11 flex-1 border border-line"
                    onClick={onLeave}
                  >
                    Shipyard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="hidden min-h-0 w-64 shrink-0 flex-col border-l border-line md:flex">
          {snap && <Scanner snap={snap} onLock={(id) => act((sim) => sim.lockShip(id))} />}
        </aside>
      </div>

      {snap && (
        <div className="shrink-0 border-t border-line md:hidden">
          <Scanner snap={snap} onLock={(id) => act((sim) => sim.lockShip(id))} compact />
        </div>
      )}

      <div className="grid shrink-0 grid-cols-4 gap-1 border-t border-line p-2 md:hidden">
        <Pad label="Left" on={hold} kind="left" />
        <Pad label="Warp+" on={hold} kind="up" />
        <Pad label="Warp−" on={hold} kind="down" />
        <Pad label="Right" on={hold} kind="right" />
        <Pad label="Phaser" on={hold} kind="phaser" />
        <Pad label="Torpedo" on={hold} kind="torp" />
        {(snap?.dronesMax ?? 0) > 0 && <Pad label="Drone" on={hold} kind="drone" />}
        {(snap?.minesMax ?? 0) > 0 && <Pad label="Mine" on={hold} kind="mine" />}
        <button type="button" className="h-12 border border-line font-mono text-xs" onClick={() => act((s) => s.toggleRaise())}>
          Shields
        </button>
        <button type="button" className="h-12 border border-line font-mono text-xs" onClick={() => act((s) => (s.player.docked ? s.requestUndock() : s.requestDock()))}>
          Dock
        </button>
      </div>

      <footer className="hidden shrink-0 items-center gap-3 border-t border-line px-4 py-2 md:flex">
        <p className="min-w-0 flex-1 truncate font-mono text-xs text-muted">
          W/S warp · A/D turn · click lock or course · Space phasers · T torpedoes · G drones · M mines · R shields · C repair · Z cloak · I intercept · . dock · U undock
        </p>
        <form
          className="flex"
          onSubmit={(e) => {
            e.preventDefault();
            sendHail();
          }}
        >
          <input
            value={hail}
            onChange={(e) => setHail(e.target.value)}
            placeholder="Hail the quadrant"
            aria-label="Hail"
            className="w-56 border border-line bg-surface px-2 py-1.5 font-mono text-xs text-fg outline-none focus:border-amber"
          />
          <button type="submit" className="border border-l-0 border-line px-3 font-mono text-xs">
            Send
          </button>
        </form>
      </footer>

      {(paused || help) && snap?.phase !== "dead" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg/80 p-4">
          <div className="w-full max-w-md border border-line bg-surface p-5">
            <p className="font-mono text-xs tracking-widest text-amber">{help ? "COMMANDS" : "PAUSED"}</p>
            <h2 className="mt-1 font-sans text-xl font-semibold">{help ? "How to fight" : snap?.name}</h2>
            <ul className="mt-4 space-y-1 font-mono text-xs leading-relaxed text-fg">
              <li>The top of the window is the radar. The bottom is the forward view. Click either one to lock a ship. Blue phasers are yours. Red phasers are theirs.</li>
              <li>A turns left, D turns right. Click empty space to come about.</li>
              <li>Click a ship to lock. Locked torpedoes curve in. Unlocked ones fly straight.</li>
              <li>Phasers need a lock or a target in the forward arc. ESI hits everyone in range. Agonizers are flat and spend a torpedo. G launches a drone. M drops a mine.</li>
              <li>Dock inside 100 units under warp 1.4. Gold paid there is (damage + veteran bonus) / 10. Klingon obliterators return one every two seconds.</li>
              <li>R raises shields. Shift+R drops them. C repairs the hull. Dilithium soaks damage that gets through the shields and refills when you dock. Planets trickle energy.</li>
              <li>Wormholes open and shut about once a minute. Cloaked ships cannot enter, and the same ship must wait a minute to transit again.</li>
            </ul>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                className="h-11 flex-1 bg-amber font-semibold text-bg"
                onClick={() => {
                  setPaused(false);
                  setHelp(false);
                }}
              >
                Resume
              </button>
              <button type="button" className="h-11 flex-1 border border-line" onClick={onLeave}>
                Leave quadrant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Status({ snap }: { snap: Snapshot }) {
  const hullPct = snap.hullMax > 0 ? snap.hull / snap.hullMax : 0;
  return (
    <div className="space-y-4 font-mono text-xs">
      <Stat k="WARP" v={`${snap.warp.toFixed(1)} / ${snap.maxWarp}`} />
      <Stat k="HEADING" v={pad3(snap.heading)} />
      <Bar k="ENERGY" pct={snap.energy / snap.energyMax} />
      <Bar k="SHIELDS" pct={snap.shield / 100} hot={snap.shield < 30} />
      <Bar k="HULL" pct={hullPct} hot={hullPct < 0.3} />
      <Stat k={snap.torpName.toUpperCase()} v={`${snap.torps} / ${snap.torpMax}`} />
      {snap.dronesMax > 0 && <Stat k="DRONES" v={`${snap.drones} / ${snap.dronesMax}`} />}
      {snap.minesMax > 0 && <Stat k="MINES" v={`${snap.mines} / ${snap.minesMax}`} />}
      {snap.crystalsMax > 0 && <Stat k="CRYSTALS" v={`${snap.crystals} / ${snap.crystalsMax}`} />}
      <Stat k="WORMHOLE" v={snap.holeOpen ? "OPEN" : "DARK"} />
      <Stat k="CLOAK" v={snap.canCloak ? (snap.cloakOn ? "ON" : "OFF") : "NONE"} />
      <Stat k="REPAIR" v={snap.repair ? "ON" : "OFF"} />
      <Stat k="SHIELD ORD" v={snap.shieldsUp ? "RAISE" : "HOLD"} />
      <Stat k="INTERCEPT" v={snap.intercept ? "ON" : "OFF"} />
      {snap.transwarp && <Stat k="TRANSWARP" v={snap.twReady ? "READY" : "CYCLING"} />}
      <div className="border-t border-line pt-3">
        <Stat k="BANKED" v={snap.banked.toLocaleString("en-US")} />
        <Stat k="UNBANKED" v={String(snap.unbanked)} />
        <Stat k="DMG GVN" v={snap.dmgGiven.toLocaleString("en-US")} />
        <Stat k="KILLS" v={String(snap.kills)} />
        <Stat k="TIME" v={clock(snap.survived)} />
      </div>
      {hullPct < 0.3 && <p className="pulse-alert text-alert">HULL CRITICAL</p>}
    </div>
  );
}

function Scanner({
  snap,
  onLock,
  compact = false,
}: {
  snap: Snapshot;
  onLock: (id: string) => void;
  compact?: boolean;
}) {
  return (
    <div className={`flex min-h-0 flex-col ${compact ? "max-h-28" : "h-full"}`}>
      <div className="border-b border-line px-3 py-2">
        <p className="font-mono text-xs tracking-widest text-muted">SCANNER</p>
        {snap.target ? (
          <div className="mt-1 font-mono text-xs">
            <p className="text-alert">
              {snap.target.letter} {snap.target.name}
            </p>
            <p className="text-muted">
              {snap.target.code} · {Math.round(snap.target.dist)} · W{snap.target.warp.toFixed(1)}
            </p>
            <p>
              SH {Math.round(snap.target.shield)}% · HULL{" "}
              {Math.round((snap.target.hull / snap.target.hullMax) * 100)}%
              {snap.target.cloaked ? " · CLOAK" : ""}
              {snap.target.docked ? " · DOCKED" : ""}
            </p>
          </div>
        ) : (
          <p className="mt-1 font-mono text-xs text-muted">No lock.</p>
        )}
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto">
        {snap.roster.map((row) => (
          <li key={row.id}>
            <button
              type="button"
              disabled={row.isPlayer || !row.alive || !row.seen}
              onClick={() => onLock(row.id)}
              className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left font-mono text-xs ${
                snap.target?.id === row.id ? "bg-surface-2 text-alert" : "text-fg"
              } disabled:text-muted`}
            >
              <span className="truncate">
                {row.letter} {row.name}
                {!row.alive ? " DESTROYED" : row.docked ? " DOCK" : ""}
              </span>
              <span className="shrink-0 text-muted">
                {row.dist === null ? "—" : Math.round(row.dist)}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {!compact && (
        <div className="max-h-36 overflow-y-auto border-t border-line px-3 py-2">
          {snap.messages.map((line, i) => (
            <p
              key={`${i}-${line.text}`}
              className={`font-mono text-xs leading-relaxed ${
                line.tone === "alert" ? "text-alert" : line.tone === "amber" ? "text-amber" : "text-muted"
              }`}
            >
              {line.text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-muted">{k}</span>
      <span>{v}</span>
    </div>
  );
}

function Bar({ k, pct, hot = false }: { k: string; pct: number; hot?: boolean }) {
  const width = `${Math.max(0, Math.min(100, pct * 100))}%`;
  return (
    <div>
      <div className="mb-1 flex justify-between">
        <span className="text-muted">{k}</span>
        <span className={hot ? "text-alert" : ""}>{Math.round(pct * 100)}%</span>
      </div>
      <div className="h-1.5 bg-surface-2">
        <div className={`h-full ${hot ? "bg-alert" : "bg-amber"}`} style={{ width }} />
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted">{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}

function Pad({
  label,
  kind,
  on,
}: {
  label: string;
  kind: "left" | "right" | "up" | "down" | "phaser" | "torp" | "drone" | "mine";
  on: (kind: "left" | "right" | "up" | "down" | "phaser" | "torp" | "drone" | "mine", down: boolean) => void;
}) {
  return (
    <button
      type="button"
      className="h-12 touch-none border border-line font-mono text-xs"
      onPointerDown={(e) => {
        e.preventDefault();
        on(kind, true);
      }}
      onPointerUp={() => on(kind, false)}
      onPointerLeave={() => on(kind, false)}
      onPointerCancel={() => on(kind, false)}
    >
      {label}
    </button>
  );
}
