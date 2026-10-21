import { useEffect, useRef, useState } from "react";
import { CLASSES, SHEETS } from "@/game/classes";
import { QUADRANT_ROBOTS } from "@/game/sim";
import { loadCallsign, loadScores, saveCallsign, type ScoreRow } from "@/game/scores";

type Props = {
  onStart: (name: string, classId: string, room: string | null) => void;
};

const QUADRANT = "ALPHA";

type RoomRow = {
  code: string;
  count: number;
  handles: string[];
  players?: { id: string; name: string; playing: boolean }[];
};

export function Shipyard({ onStart }: Props) {
  const [classId, setClassId] = useState(CLASSES[0].id);
  const [name, setName] = useState("USS Intrepid");
  const [scores, setScores] = useState<ScoreRow[]>([]);
  const [real, setReal] = useState(true);
  const [shared, setShared] = useState(true);
  const [board, setBoard] = useState<RoomRow | null>(null);
  const [arrival, setArrival] = useState("");
  const nameRef = useRef(name);
  nameRef.current = name;
  const selfId = useRef("");
  const known = useRef(new Set<string>());
  const seenOnce = useRef(false);
  const selected = CLASSES.find((c) => c.id === classId) ?? CLASSES[0];

  useEffect(() => {
    const saved = loadCallsign();
    setName(saved.name);
    if (CLASSES.some((c) => c.id === saved.classId)) setClassId(saved.classId);
    setScores(loadScores());
    const q = new URLSearchParams(window.location.search);
    if (q.get("play") === "quadrant" || q.get("room")) setShared(true);
  }, []);

  useEffect(() => {
    let stop = false;
    const pull = async () => {
      try {
        const res = await fetch("/api/rtc?op=rooms");
        if (!res.ok) return;
        const data = (await res.json()) as { rooms?: RoomRow[] };
        const mine = data.rooms?.find((row) => row.code === QUADRANT) ?? null;
        if (stop) return;
        setBoard(mine);
        const players = mine?.players ?? [];
        if (!seenOnce.current) {
          for (const player of players) known.current.add(player.id);
          seenOnce.current = true;
          return;
        }
        for (const player of players) {
          if (player.id === selfId.current || known.current.has(player.id)) continue;
          known.current.add(player.id);
          setArrival(player.playing ? `${player.name} is in the quadrant.` : `${player.name} logged in.`);
        }
      } catch {
        /* the board can wait for the next pass */
      }
    };
    void pull();
    const timer = window.setInterval(() => void pull(), 1500);
    return () => {
      stop = true;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!shared) return;
    const peerKey = "otrek-lobby-peer";
    let peer = sessionStorage.getItem(peerKey) ?? "";
    if (!/^w-[a-z0-9]{6,16}$/.test(peer)) {
      peer = `w-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(peerKey, peer);
    }
    selfId.current = peer;
    const roomId = `otrek-${QUADRANT}`;
    let stop = false;
    const beat = () => {
      if (stop) return;
      const handle = nameRef.current.trim().slice(0, 18) || "unnamed";
      const q = new URLSearchParams({ room: roomId, peer, name: handle, since: "1" });
      void fetch(`/api/rtc?${q}`);
    };
    beat();
    const timer = window.setInterval(beat, 4000);
    return () => {
      stop = true;
      window.clearInterval(timer);
      void fetch("/api/rtc", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ op: "leave", room: roomId, peer }),
      });
    };
  }, [shared]);

  const launch = () => {
    const trimmed = name.trim().slice(0, 18) || "USS Intrepid";
    saveCallsign(trimmed, selected.id);
    const url = new URL(window.location.href);
    url.searchParams.delete("room");
    if (shared) url.searchParams.set("play", "quadrant");
    else url.searchParams.delete("play");
    window.history.replaceState(null, "", url);
    onStart(trimmed, selected.id, shared ? QUADRANT : null);
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
              HUMANS · {board?.players?.length ?? 0}
            </p>
            {!board?.players?.length ? (
              <p className="mt-1 font-mono text-xs text-muted">No one else is logged in.</p>
            ) : (
              <ul className="mt-1 space-y-0.5 font-mono text-xs">
                {board.players.map((player) => (
                  <li key={player.id} className="truncate">
                    {player.name}
                    {player.id === selfId.current ? " · you" : player.playing ? " · in the fight" : " · logged in"}
                  </li>
                ))}
              </ul>
            )}
            {arrival ? <p className="mt-1 font-mono text-xs text-amber">{arrival}</p> : null}
          </div>
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
              These robots fly that board. Solo is you and them. Quadrant adds whoever else is here.
            </p>
            {!board?.players?.length ? (
              <p className="mt-3 border border-line px-3 py-3 font-mono text-xs text-muted">
                No other players yet. The robots are already out.
              </p>
            ) : (
              <p className="mt-3 font-mono text-xs text-amber">{arrival || "The list above is every human on this board."}</p>
            )}
            <p className="mt-2 text-sm text-muted">{QUADRANT_ROBOTS.join(" · ")}</p>
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
              <h3 className="font-mono text-xs tracking-widest text-muted">VAULT</h3>
              {scores.length === 0 ? (
                <p className="mt-2 text-sm text-muted">No ship has banked gold in this browser yet.</p>
              ) : (
                <ol className="mt-2 space-y-1 font-mono text-xs">
                  {scores.map((row) => (
                    <li key={`${row.name}-${row.code}`} className="flex justify-between gap-3">
                      <span className="truncate">
                        {row.name}{" "}
                        <span className="text-muted">{row.code}</span>
                      </span>
                      <span className="text-gold">{row.gold.toLocaleString("en-US")}</span>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </div>
        </div>
      </div>

      <footer className="flex shrink-0 flex-col gap-2 border-t border-line px-4 py-3 md:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted">PLAY</span>
          <button
            type="button"
            aria-pressed={!shared}
            onClick={() => setShared(false)}
            className={`h-11 border px-4 font-mono text-xs ${shared ? "border-line" : "border-amber text-amber"}`}
          >
            Solo
          </button>
          <button
            type="button"
            aria-pressed={shared}
            onClick={() => setShared(true)}
            className={`h-11 border px-4 font-mono text-xs ${shared ? "border-amber text-amber" : "border-line"}`}
          >
            Quadrant
          </button>
        </div>
        <p className="font-mono text-xs text-muted">
          Solo is you and the robot ships, not other players. Quadrant is that same board, plus
          whoever else is here. The fight with them goes browser to browser.
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
