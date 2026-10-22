import { useEffect, useState } from "react";
import { CLASSES, SHEETS } from "@/game/classes";
import { QUADRANT_ROBOTS } from "@/game/sim";
import { loadCallsign, saveCallsign } from "@/game/scores";
import { listBoard, type BoardRow } from "@/lib/board";
import { GROK_PROVIDERS, signIn } from "@/lib/auth/client";
import { SignInGate, UserButton } from "@/lib/auth/gates";
import { useBoard } from "@/lib/multiplayer/use-board";

type Props = {
  onStart: (name: string, classId: string, room: string | null, bots: boolean) => void;
};

const QUADRANT = "ALPHA";
type Mode = "solo" | "quadrant" | "humans";

export function Shipyard({ onStart }: Props) {
  const [classId, setClassId] = useState(CLASSES[0].id);
  const [name, setName] = useState("USS Intrepid");
  const [real, setReal] = useState(true);
  const [mode, setMode] = useState<Mode>("quadrant");
  const [lobbyId] = useState(() => `w-${Math.random().toString(36).slice(2, 10)}`);
  const selected = CLASSES.find((c) => c.id === classId) ?? CLASSES[0];
  const linked = mode !== "solo";
  const live = useBoard(lobbyId, name.trim().slice(0, 18) || "unnamed", false, linked);

  useEffect(() => {
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

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-bg text-fg">
      <header className="shrink-0 border-b border-line px-4 py-3 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="pl-[0.22em] font-sans text-2xl font-light tracking-[0.22em] text-gold">
              <span className="text-amber">O</span>TREK
            </h1>
            <p className="font-mono text-[10px] tracking-[0.35em] text-muted">O FOR OXY · PORT 1701</p>
          </div>
          <div className="min-w-[16rem] flex-1 border border-line bg-surface px-3 py-2">
            <p className="font-mono text-[10px] tracking-widest text-amber">
              HUMANS · {(live.humans.length || 0) + (linked ? 1 : 0)}
            </p>
            {!linked ? (
              <p className="mt-1 font-mono text-xs text-muted">Solo. Other players cannot see this ship.</p>
            ) : (
              <ul className="mt-1 space-y-0.5 font-mono text-xs">
                <li className="truncate">{name.trim() || "unnamed"} · you</li>
                {live.humans.map((player) => (
                  <li key={player.id} className="truncate">
                    {player.name}
                    {player.playing ? " · in the fight" : " · logged in"}
                  </li>
                ))}
              </ul>
            )}
            {live.notice ? <p className="mt-1 font-mono text-xs text-amber">{live.notice}</p> : null}
            <p className="mt-1 font-mono text-[10px] text-muted">{linked ? live.status : ""}</p>
          </div>
          <UserButton />
          <button
            type="button"
            role="switch"
            aria-checked={real}
            onClick={() => setReal((on) => !on)}
            className="flex shrink-0 items-center gap-2 border border-line bg-surface px-3 py-2 font-mono text-xs"
          >
            <span
              className={`relative h-5 w-9 border ${real ? "border-amber bg-amber" : "border-line bg-bg"}`}
            >
              <span
                className={`absolute top-0.5 h-3.5 w-3.5 ${real ? "right-0.5 bg-bg" : "left-0.5 bg-muted"}`}
              />
            </span>
            Show real stats
          </button>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          A browser port of the real-time starship duel. Damage becomes gold-pressed latinum only
          after you dock. If the hull goes, unbanked bars go with it.
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-line p-3 md:min-h-0 md:w-80 md:shrink-0 md:flex-col md:overflow-y-auto md:border-r md:border-b-0">
          {CLASSES.map((cls) => {
            const on = cls.id === selected.id;
            return (
              <button
                key={cls.id}
                type="button"
                onClick={() => setClassId(cls.id)}
                className={`flex min-w-52 shrink-0 items-center gap-3 border px-3 py-3 text-left md:min-w-0 ${
                  on ? "border-amber bg-surface-2" : "border-line bg-surface"
                }`}
              >
                <img
                  src={`/ships/${cls.id.toLowerCase()}.png`}
                  alt=""
                  className="h-16 w-16 shrink-0 object-contain"
                />
                <span className="min-w-0">
                  <span className="block font-mono text-xs text-amber">{cls.code}</span>
                  <span className="mt-1 block font-sans text-sm font-semibold">{cls.name}</span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {cls.race}
                    {real && SHEETS[cls.id]
                      ? ` · W${SHEETS[cls.id].cruise} · S${SHEETS[cls.id].shield}`
                      : ` · W${cls.maxWarp} · H${cls.hull}`}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-end gap-4">
              <img
                src={`/ships/${selected.id.toLowerCase()}.png`}
                alt=""
                className="h-24 w-24 object-contain"
              />
              <div>
              <p className="font-mono text-xs text-amber">{selected.race.toUpperCase()}</p>
              <h2 className="font-sans text-2xl font-semibold">{selected.name}</h2>
              </div>
            </div>
            <p className="max-w-md text-right font-mono text-xs text-muted">
              {real && sheet ? sheet.home.toUpperCase() : selected.home}
              {selected.cloak ? " · CLOAK" : ""}
              {selected.transwarp ? " · TRANSWARP" : ""}
              {selected.teleport ? " · TELEPORTER" : ""}
              {(selected.drones ?? 0) > 0 ? " · DRONES" : ""}
              {(selected.mines ?? 0) > 0 ? " · MINES" : ""}
              {selected.agonizer ? " · AGONIZER" : ""}
              {selected.regenTorp ? " · REGEN TORPS" : ""}
              {selected.esi ? " · ESI PHASERS" : ""}
            </p>
          </div>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{selected.blurb}</p>

          <section className="mt-6">
            <h3 className="font-mono text-xs tracking-widest text-muted">QUADRANT</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              One room, like the original. Everyone starts in Alpha. The wormhole is the door to Beta.
              Solo is you and the robots. Quadrant adds whoever else is here. Humans only is that same
              board with no robots.
            </p>
            {!linked || live.humans.length === 0 ? (
              <p className="mt-3 border border-line px-3 py-3 font-mono text-xs text-muted">
                {mode === "solo"
                  ? "Solo. The robots are already out."
                  : mode === "humans"
                    ? live.status === "on the board"
                      ? "No other players yet. No robots in this mode."
                      : live.status
                    : live.status === "on the board"
                      ? "No other players yet. The robots are already out."
                      : live.status}
              </p>
            ) : (
              <p className="mt-3 font-mono text-xs text-amber">{live.notice || "The list above is every human on this board."}</p>
            )}
            {mode === "humans" ? (
              <p className="mt-2 text-sm text-muted">No robots.</p>
            ) : (
              <p className="mt-2 text-sm text-muted">{QUADRANT_ROBOTS.join(" · ")}</p>
            )}
          </section>

          {real ? (
            <section className="mt-6">
              <h3 className="font-mono text-xs tracking-widest text-muted">CLASS TABLE</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Class table. Warp is turn / cruise / damage. Energy in parentheses is the table maximum.
              </p>
              <div className="mt-3 overflow-x-auto border border-line">
                <table className="w-full min-w-[720px] border-collapse font-mono text-xs">
                  <thead className="bg-surface-2 text-muted">
                    <tr>
                      <th className="px-2 py-2 text-left font-normal">CLASS</th>
                      <th className="px-2 py-2 text-left font-normal">WARP</th>
                      <th className="px-2 py-2 text-left font-normal">ENERGY</th>
                      <th className="px-2 py-2 text-right font-normal">IE</th>
                      <th className="px-2 py-2 text-right font-normal">SHLD</th>
                      <th className="px-2 py-2 text-right font-normal">DMG%</th>
                      <th className="px-2 py-2 text-right font-normal">SCAN</th>
                      <th className="px-2 py-2 text-left font-normal">PHASERS</th>
                      <th className="px-2 py-2 text-left font-normal">TORPEDOES</th>
                      <th className="px-2 py-2 text-left font-normal">DRONES</th>
                      <th className="px-2 py-2 text-left font-normal">MINES</th>
                      <th className="px-2 py-2 text-right font-normal">CREW</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CLASSES.map((cls) => {
                      const row = SHEETS[cls.id];
                      if (!row) return null;
                      const on = cls.id === selected.id;
                      return (
                        <tr
                          key={cls.id}
                          className={on ? "bg-surface-2 text-fg" : "bg-surface text-muted"}
                        >
                          <td className="border-t border-line px-2 py-2">
                            <button
                              type="button"
                              onClick={() => setClassId(cls.id)}
                              className={`text-left ${on ? "text-amber" : "text-fg"}`}
                            >
                              {cls.code}
                            </button>
                          </td>
                          <td className="border-t border-line px-2 py-2 whitespace-nowrap">
                            {row.turn}/{row.cruise}/{row.damageWarp}
                          </td>
                          <td className="border-t border-line px-2 py-2 whitespace-nowrap">{row.warpEnergy}</td>
                          <td className="border-t border-line px-2 py-2 text-right">{row.impulse}</td>
                          <td className="border-t border-line px-2 py-2 text-right">{row.shield}</td>
                          <td className="border-t border-line px-2 py-2 text-right">{row.damagePct}</td>
                          <td className="border-t border-line px-2 py-2 text-right">
                            {row.scan.toLocaleString("en-US")}
                          </td>
                          <td className="border-t border-line px-2 py-2 whitespace-nowrap">{row.phasers}</td>
                          <td className="border-t border-line px-2 py-2 whitespace-nowrap">{row.torpedoes}</td>
                          <td className="border-t border-line px-2 py-2 whitespace-nowrap">{row.drones}</td>
                          <td className="border-t border-line px-2 py-2 whitespace-nowrap">{row.mines}</td>
                          <td className="border-t border-line px-2 py-2 text-right">{row.crew}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ) : (
            <section className="mt-6 max-w-3xl">
              <h3 className="font-mono text-xs tracking-widest text-muted">THIS QUADRANT</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Numbers the patrol actually uses. The chart is the old Alpha quadrant, fitted onto this board.
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-px bg-line sm:grid-cols-3">
                <Cell k="CRUISE" v={String(selected.cruise)} />
                <Cell k="MAX WARP" v={String(selected.maxWarp)} />
                <Cell k="TURN" v={selected.turn.toFixed(2)} />
                <Cell k="HULL" v={String(selected.hull)} />
                <Cell k="SHIELD" v={String(selected.shieldStr)} />
                <Cell k="ENERGY" v={String(selected.energy)} />
                <Cell k="SCAN" v={selected.scan.toLocaleString("en-US")} />
                <Cell k="PHASERS" v={`${selected.phaser} · ${selected.phaserRange}`} />
                <Cell k="CLOAK" v={selected.cloak ? "Yes" : "—"} />
                <Cell
                  k="TORPEDOES"
                  v={`${selected.torpName} · ${selected.magazine} · ${selected.torpMin}–${selected.torpMax}`}
                  wide
                />
                <Cell k="DRONES" v={selected.drones ? `${selected.drones} × ${selected.droneDmg ?? 0}` : "—"} />
                <Cell k="MINES" v={selected.mines ? `${selected.mines} × ${selected.mineDmg ?? 0}` : "—"} />
                <Cell k="CRYSTALS" v={selected.crystals ? String(selected.crystals) : "—"} />
              </dl>
            </section>
          )}

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <section>
              <h3 className="font-mono text-xs tracking-widest text-muted">CONN</h3>
              <ul className="mt-2 space-y-1 font-mono text-xs leading-relaxed text-fg">
                <li>W / S warp up and down</li>
                <li>A / D turn left and right</li>
                <li>Click a ship to lock, space to set course</li>
                <li>Space or F phasers, T torpedoes</li>
                <li>R raise shields, Shift+R drop them</li>
                <li>C damage control, Z cloak, I intercept</li>
                <li>X transwarp, G drones, M mines, period dock when alongside</li>
              </ul>
            </section>
            <section>
              <h3 className="font-mono text-xs tracking-widest text-muted">ENGINES</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Gold at a starbase is (damage + veteran bonus) / 10, the JavaTrek dock payout. A destroyed
                ship drops the bars aboard, up to 1000 plus a tenth of the rest. Wormholes open and shut
                about once a minute. A cloak will not fit, and the same mouth waits a minute to take you again.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                JavaTrek (GPL) is Joe Hopkinson and Jay Ashworth’s engine, from Chuck L. Peterson’s 1986
                game. This board took the next letter: OTrek. The O is Oxy. Upstream is SourceForge and the rumour/jtrek tree.
                The live games are telnet, not this page: mtrek.com 1701, javatrek.org 1764, rbop.net 2000.
                Steve Scherf kept the 1993 C source. Justin Flude made that build run again (mtrek.site 1993,
                justinflude.org 1993).
              </p>
            </section>
            <section>
              <h3 className="font-mono text-xs tracking-widest text-muted">FLEET BOARD</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                The vault on this board is the one that counts. Dock to bank it. Leave a fight and the
                breaksave posts here too: under 1,000 gold the bank is forfeit, otherwise the vault is cut
                by a third.
              </p>
              <div className="mt-2 min-h-16">
                <SignInGate
                  fallback={
                    <div className="space-y-2">
                      <p className="text-sm text-muted">Sign in to post your vault and read the fleet.</p>
                      {GROK_PROVIDERS.map((p) => (
                        <button
                          key={p.providerId}
                          type="button"
                          onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                          className="block w-full border border-line px-3 py-2 text-left font-mono text-xs hover:border-amber"
                        >
                          Continue with {p.label}
                        </button>
                      ))}
                    </div>
                  }
                >
                  <FleetBoard />
                </SignInGate>
              </div>
            </section>
          </div>
        </div>
      </div>

      <footer className="flex shrink-0 flex-col gap-2 border-t border-line px-4 py-3 md:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted">PLAY</span>
          <button
            type="button"
            aria-pressed={mode === "solo"}
            onClick={() => setMode("solo")}
            className={`h-11 border px-4 font-mono text-xs ${mode === "solo" ? "border-amber text-amber" : "border-line"}`}
          >
            Solo
          </button>
          <button
            type="button"
            aria-pressed={mode === "quadrant"}
            onClick={() => setMode("quadrant")}
            className={`h-11 border px-4 font-mono text-xs ${mode === "quadrant" ? "border-amber text-amber" : "border-line"}`}
          >
            Quadrant
          </button>
          <button
            type="button"
            aria-pressed={mode === "humans"}
            onClick={() => setMode("humans")}
            className={`h-11 border px-4 font-mono text-xs ${mode === "humans" ? "border-amber text-amber" : "border-line"}`}
          >
            Humans only
          </button>
        </div>
        <p className="font-mono text-xs text-muted">
          Solo is you and the robot ships. Quadrant is that board plus whoever else is here.
          Humans only is the same fight with no robots.
        </p>
        <div className="flex items-end gap-3">
        <label className="min-w-0 flex-1">
          <span className="font-mono text-xs text-muted">SHIP NAME</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") launch();
            }}
            maxLength={18}
            aria-label="Ship name"
            className="mt-1 w-full border border-line bg-surface px-3 py-2 font-mono text-sm text-fg outline-none focus:border-amber"
          />
        </label>
        <button
          type="button"
          onClick={launch}
          className="h-11 shrink-0 bg-amber px-6 font-sans text-sm font-semibold text-bg"
        >
          Start
        </button>
        </div>
      </footer>
    </div>
  );
}

function Cell({ k, v, wide = false }: { k: string; v: string; wide?: boolean }) {
  return (
    <div className={`bg-surface px-3 py-2 ${wide ? "col-span-2 sm:col-span-3" : ""}`}>
      <dt className="font-mono text-[10px] tracking-widest text-muted">{k}</dt>
      <dd className="mt-0.5 font-mono text-sm text-fg">{v}</dd>
    </div>
  );
}

function FleetBoard() {
  const [rows, setRows] = useState<BoardRow[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancel = false;
    listBoard()
      .then((next) => {
        if (!cancel) setRows(next);
      })
      .catch(() => {
        if (!cancel) setRows([]);
      })
      .finally(() => {
        if (!cancel) setReady(true);
      });
    return () => {
      cancel = true;
    };
  }, []);
  if (!ready) return <p className="font-mono text-xs text-muted">Reading the board…</p>;
  if (rows.length === 0) return <p className="text-sm text-muted">No gold posted yet. Dock to bank, and the vault lands here.</p>;
  return (
    <ol className="space-y-1 font-mono text-xs">
      {rows.map((row, i) => (
        <li key={`${row.callsign}-${row.code}-${i}`} className="flex justify-between gap-3">
          <span className={`truncate ${row.yours ? "text-amber" : ""}`}>
            {i + 1}. {row.callsign} <span className="text-muted">{row.code}</span>
          </span>
          <span className="text-gold">
            {row.gold.toLocaleString("en-US")}
            {row.breaks > 0 ? <span className="text-muted"> BRK {row.breaks}</span> : null}
          </span>
        </li>
      ))}
    </ol>
  );
}
