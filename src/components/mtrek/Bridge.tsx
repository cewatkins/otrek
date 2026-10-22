import { useEffect, useRef, useState, type PointerEvent } from "react";
import { unlockAudio } from "@/game/audio";
import { cameraFor, drawTactical, pointerCommand } from "@/game/draw";
import { saveScore } from "@/game/scores";
import { CLASSES, classById, type ShipClass } from "@/game/classes";
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
  bots?: boolean;
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

export function Bridge({ name, classId, room, bots = true, onLeave }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simRef = useRef<TrekSim | null>(null);
  const netSend = useRef<((data: unknown) => void) | null>(null);
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [paused, setPaused] = useState(false);
  const [help, setHelp] = useState(false);
  const [helpPage, setHelpPage] = useState("commands");
  const [hail, setHail] = useState("");
  const pausedRef = useRef(false);
  pausedRef.current = paused || help;

  useEffect(() => {
    const sim = new TrekSim(name, classId, { bots });
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
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyA", "KeyS", "KeyD"].includes(e.code)) {
        e.preventDefault();
      }
      const warpUp = e.code === "KeyW" && !e.shiftKey;
      const warpDn = e.code === "KeyS" || (e.code === "KeyW" && e.shiftKey);
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
      if (e.code === "KeyH" || e.code === "Slash") {
        setHelp((v) => {
          if (!v) setHelpPage(classId);
          return !v;
        });
      }
      if (e.code === "Escape") setPaused((v) => !v);
    };
    const up = (e: KeyboardEvent) => {
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
  }, [name, classId, bots]);

  const onPointer = (e: PointerEvent<HTMLCanvasElement>) => {
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

  const hold = (kind: "left" | "right" | "up" | "down" | "zup" | "zdn" | "phaser" | "torp" | "drone" | "mine", on: boolean) => {
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
    if (hail.trim()) {
      netSend.current?.({
        k: "hail",
        text: `${name}: ${hail.trim().slice(0, 80)}`,
        n: Date.now(),
      });
    }
    setHail("");
    setSnap(sim.snapshot());
  };

  return (
    <div className="relative flex h-dvh min-h-0 flex-col overflow-hidden bg-bg text-fg">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-3 py-2 md:px-4">
        <div className="min-w-0">
          <p className="font-mono text-xs tracking-widest text-amber">
            OTREK · OXY · {room ? "QUADRANT" : "SOLO"} · {snap?.quad ?? "ALPHA"}
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
            onClick={() => setPaused((v) => !v)}
            className={`h-10 border px-3 font-mono text-xs ${paused ? "border-amber text-amber" : "border-line text-fg"}`}
          >
            {paused ? "Resume" : "Pause"}
          </button>
        </div>
      </header>
      {snap && (
        <div className="flex shrink-0 gap-3 overflow-x-auto border-b border-line px-3 py-2 font-mono text-xs md:hidden">
          <span>W {snap.warp.toFixed(1)}</span>
          <span>Z {Math.round(snap.z)}</span>
          <span className={snap.hull / snap.hullMax < 0.3 ? "text-alert" : ""}>
            HULL {Math.round((snap.hull / snap.hullMax) * 100)}%
          </span>
          <span>SH {Math.round(snap.shield)}%</span>
          {snap.crystalsMax > 0 && <span>XL {snap.crystals}</span>}
          <span className="text-amber">+{snap.unbanked}</span>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-row">
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
          {(() => {
            const line = snap?.messages.find((entry) => entry.tone === "hail");
            if (!line || !snap || snap.t - (line.at ?? 0) > 4) return null;
            return (
              <p
                key={`${line.at}-${line.text}`}
                className="hail-flash pointer-events-none absolute top-16 left-1/2 z-10 max-w-lg -translate-x-1/2 px-3 text-center font-mono text-sm font-semibold"
              >
                {line.text}
              </p>
            );
          })()}
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

        <aside className="flex min-h-0 w-40 shrink-0 flex-col border-l border-line sm:w-60">
          {room ? <NetLink room={room} name={name} simRef={simRef} sendRef={netSend} /> : null}
          {snap && <Scanner snap={snap} onLock={(id) => act((sim) => sim.lockShip(id))} />}
        </aside>
      </div>

      <div className="grid shrink-0 grid-cols-4 gap-1 border-t border-line p-2 md:hidden">
        <Pad label="Left" on={hold} kind="left" />
        <Pad label="Warp+" on={hold} kind="up" />
        <Pad label="Warp−" on={hold} kind="down" />
        <Pad label="Z+" on={hold} kind="zup" />
        <Pad label="Z−" on={hold} kind="zdn" />
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

      <form
        className="flex shrink-0 items-center gap-2 border-t border-line px-3 py-2"
        onSubmit={(e) => {
          e.preventDefault();
          sendHail();
        }}
      >
        <input
          value={hail}
          onChange={(e) => setHail(e.target.value)}
          placeholder={room ? "Hail the quadrant" : "Hail. Solo — no other players hear this."}
          aria-label="Hail"
          className="min-w-0 flex-1 border border-line bg-surface px-2 py-1.5 font-mono text-xs text-fg outline-none focus:border-amber"
        />
        <button type="submit" className="border border-line px-3 py-1.5 font-mono text-xs">
          Send
        </button>
      </form>

      <footer className="hidden shrink-0 items-stretch border-t border-line md:flex">
        <button
          type="button"
          onClick={() => setPaused((v) => !v)}
          className={`shrink-0 border-r border-line px-4 font-mono text-xs ${paused ? "text-amber" : "text-fg"}`}
        >
          {paused ? "Resume" : "Pause"}
        </button>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="key-marquee py-2 font-mono text-xs whitespace-nowrap text-muted">
            <span className="px-6">
              W raises warp · S lowers warp, then reverse · Up / Down change Z · Shift+W slows · A / Left turn left · D / Right turn right · click a ship to lock · 2 nearest base, dock and repair · 5 autolock · 7 AI helm · click the long-range chart to fly there · Space F P phasers · T torpedoes · G drones · M mines · R raise shields · Shift+R drop shields · C repair · Z cloak · I intercept · X transwarp · . dock (reloads torpedoes) · U undock · H or / help · 9 dock log · Esc pause · type and Send to hail
            </span>
            <span className="px-6" aria-hidden="true">
              W raises warp · S lowers warp, then reverse · Up / Down change Z · Shift+W slows · A / Left turn left · D / Right turn right · click a ship to lock · 2 nearest base, dock and repair · 5 autolock · 7 AI helm · click the long-range chart to fly there · Space F P phasers · T torpedoes · G drones · M mines · R raise shields · Shift+R drop shields · C repair · Z cloak · I intercept · X transwarp · . dock (reloads torpedoes) · U undock · H or / help · 9 dock log · Esc pause · type and Send to hail
            </span>
          </div>
        </div>
      </footer>

      {(paused || help) && snap?.phase !== "dead" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg/80 p-4">
          <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto border border-line bg-surface p-5">
            <p className="font-mono text-xs tracking-widest text-amber">{help ? "HELP" : "PAUSED"}</p>
            <h2 className="mt-1 font-sans text-xl font-semibold">
              {helpPage === "commands" ? (help ? "How to fight" : snap?.name) : classById(helpPage).name}
            </h2>
            <div className="mt-3 flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setHelpPage("commands")}
                className={`border px-2 py-1 font-mono text-[10px] ${helpPage === "commands" ? "border-amber text-amber" : "border-line text-muted"}`}
              >
                Commands
              </button>
              {CLASSES.map((cls) => (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => setHelpPage(cls.id)}
                  className={`border px-2 py-1 font-mono text-[10px] ${
                    helpPage === cls.id ? "border-amber text-amber" : cls.id === classId ? "border-line text-fg" : "border-line text-muted"
                  }`}
                >
                  {cls.code}
                </button>
              ))}
            </div>
            {helpPage === "commands" ? (
            <ul className="mt-4 space-y-2 font-mono text-xs leading-relaxed text-fg">
              <li><span className="text-amber">Flight.</span> W raises warp, one step per tap and more if you hold it. S lowers warp and then reverses. Shift+W also slows. Up and Down change Z. A or Left turns left. D or Right turns right. Click empty space to come about. Click the long-range chart to plot a course, including the Z of a body you click. These keys still work if intercept is on.</li>
              <li><span className="text-amber">Lock.</span> Autolock is on when you launch. It holds the ship shooting at you, otherwise the closest one you can see. Press 5 to turn autolock off and pick a lock yourself. Click a ship on the radar or the forward view. Humans are a, b, c. Blue beams are yours. Red beams are theirs.</li>
              <li><span className="text-amber">Base run.</span> 2 steers to the closest starbase, slows, docks, and the yard repairs the hull and refills everything. Press 2 again, or touch the helm, to cancel.</li>
              <li><span className="text-amber">AI helm.</span> 7 hands your ship to the same captain the robots use. It hunts, shoots, flees, and docks. Press 7 again to take the helm back.</li>
              <li><span className="text-amber">Phasers.</span> Space, F, or P. A lock fires on that ship. No lock fires the forward arc for less damage. ESI hits every ship in range, and a crowd weakens each shot.</li>
              <li><span className="text-amber">Torpedoes.</span> T fires. Locked shots curve in. Unlocked shots fly straight. They hit harder the farther they travel. Empty tubes do not refill in flight. Dock to reload.</li>
              <li><span className="text-amber">Obliterators.</span> KEV-12 and KPB-13 put one torpedo back every two seconds. You still dock to fill the rack.</li>
              <li><span className="text-amber">Agonizers.</span> The warbird's phasers are flat and each shot spends one torpedo.</li>
              <li><span className="text-amber">Drones and mines.</span> G launches a drone. M drops a mine. Both classes that carry them reload only by docking.</li>
              <li><span className="text-amber">Dock.</span> Close inside 100 of a starbase and drop under warp 1.4, then press . (period). Docking refills hull, shields, energy, torpedoes, drones, mines, and dilithium. Gold aboard is banked: damage dealt, plus veteran bonus, divided by 10. U undocks. You cannot shoot while docked.</li>
              <li><span className="text-amber">Shields and repair.</span> R latches shields up. Shift+R drops them. C toggles damage control, which spends energy to mend the hull. Dilithium soaks hits that punch the shields. Feeding planets trickle energy if you orbit them.</li>
              <li><span className="text-amber">Cloak.</span> Z, on a ship that has one. It burns energy. You cannot fire, and a cloaked ship cannot take a wormhole. Other ships lose you past short range.</li>
              <li><span className="text-amber">Intercept and transwarp.</span> I steers onto the locked ship. X engages transwarp and spends energy. An Excelsior tracks the lock. A DY-600 teleporter overshoots and will not track. The teleporter phaser also shoves you clear of the target.</li>
              <li><span className="text-amber">Wormholes.</span> They open and shut about once a minute. The same ship must wait a minute to transit again. The rim of the quadrant turns you about.</li>
              <li><span className="text-amber">Hail and log.</span> Type at the bottom and press Send. A hail flashes yellow and the boatswain's pipe sounds. 9 shows dock, undock, and vault lines. H or / opens this list. Esc pauses. The codes above open one page per ship.</li>
            </ul>
            ) : (
              <ShipPage cls={classById(helpPage)} yours={helpPage === classId} />
            )}
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

function ShipPage({ cls, yours }: { cls: ShipClass; yours: boolean }) {
  const lines = [
    `${cls.race}. Home ${cls.home}. Cruise warp ${cls.cruise}, damage warp ${cls.maxWarp}. Hull ${cls.hull}. Scan ${cls.scan}.`,
    `${cls.torpName} × ${cls.magazine}. ${cls.torpMin}–${cls.torpMax}. They hit harder the farther they fly. Dock to reload the tubes.`,
    `Phasers ${cls.phaser} out to ${cls.phaserRange}. Space, F, or P.`,
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
  return (
    <div className="mt-4">
      <p className="font-mono text-[10px] tracking-widest text-muted">
        {cls.code}
        {yours ? " · YOUR SHIP" : ""}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-fg">{cls.blurb}</p>
      <ul className="mt-3 space-y-2 font-mono text-xs leading-relaxed text-fg">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

function Status({ snap }: { snap: Snapshot }) {
  const hullPct = snap.hullMax > 0 ? snap.hull / snap.hullMax : 0;
  return (
    <div className="space-y-4 font-mono text-xs">
      <Stat k="WARP" v={`${snap.warp.toFixed(1)} / ${snap.maxWarp}`} />
      <Stat k="HEADING" v={pad3(snap.heading)} />
      <Stat k="Z" v={String(Math.round(snap.z))} />
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
      <Stat k="AUTOLOCK" v={snap.autoLock ? "ON" : "OFF"} />
      <Stat k="BASE RUN" v={snap.seekBase ? "ON" : "OFF"} />
      <Stat k="AI HELM" v={snap.aiPilot ? "ON" : "OFF"} />
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
                line.tone === "hail"
                  ? "hail-flash"
                  : line.tone === "alert"
                    ? "text-alert"
                    : line.tone === "amber"
                      ? "text-amber"
                      : "text-muted"
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
  kind: "left" | "right" | "up" | "down" | "zup" | "zdn" | "phaser" | "torp" | "drone" | "mine";
  on: (kind: "left" | "right" | "up" | "down" | "zup" | "zdn" | "phaser" | "torp" | "drone" | "mine", down: boolean) => void;
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
