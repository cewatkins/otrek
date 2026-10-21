import { useEffect, useState } from "react";
import { CLASSES, SHEETS } from "@/game/classes";
import { loadCallsign, loadScores, saveCallsign, type ScoreRow } from "@/game/scores";

type Props = {
  onStart: (name: string, classId: string, room: string | null) => void;
};

export function Shipyard({ onStart }: Props) {
  const [classId, setClassId] = useState(CLASSES[0].id);
  const [name, setName] = useState("USS Intrepid");
  const [scores, setScores] = useState<ScoreRow[]>([]);
  const [real, setReal] = useState(true);
  const [room, setRoom] = useState("");
  const selected = CLASSES.find((c) => c.id === classId) ?? CLASSES[0];

  useEffect(() => {
    const saved = loadCallsign();
    setName(saved.name);
    if (CLASSES.some((c) => c.id === saved.classId)) setClassId(saved.classId);
    setScores(loadScores());
    const fromUrl = new URLSearchParams(window.location.search).get("room") ?? "";
    const clean = fromUrl.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
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
    } catch {
      /* the address bar already holds the room */
    }
  };

  const sheet = SHEETS[selected.id];

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-bg text-fg">
      <header className="shrink-0 border-b border-line px-4 py-4 md:px-8">
        <p className="font-mono text-xs tracking-widest text-amber">CLASS O · PORT 1701 · QUADRANT ALPHA</p>
        <h1 className="mt-1 font-sans text-4xl font-semibold tracking-tight">OTrek</h1>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            A browser port of the real-time starship duel. Damage becomes gold-pressed latinum only
            after you dock. If the hull goes, unbanked bars go with it.
          </p>
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
                Numbers the patrol actually uses. The map is smaller than a telnet quadrant, so ranges are scaled.
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
                game. This board took the next letter: OTrek. Upstream is SourceForge and the rumour/jtrek tree.
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
        <div className="flex flex-wrap items-end gap-2">
          <label className="min-w-0 flex-1">
            <span className="font-mono text-xs text-muted">ROOM CODE</span>
            <input
              value={room}
              onChange={(e) => setRoom(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))}
              maxLength={6}
              placeholder="Solo if empty"
              aria-label="Room code"
              className="mt-1 w-full border border-line bg-surface px-3 py-2 font-mono text-sm text-fg outline-none focus:border-amber"
            />
          </label>
          <button
            type="button"
            onClick={() => {
              const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
              let code = "";
              for (let i = 0; i < 4; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
              setRoom(code);
            }}
            className="h-11 border border-line px-3 font-mono text-xs"
          >
            New room
          </button>
          <button type="button" onClick={() => void copyLink()} className="h-11 border border-line px-3 font-mono text-xs">
            Copy link
          </button>
        </div>
        <p className="font-mono text-xs text-muted">
          Same code, same site, shared quadrant. Up to eight ships. The handshake stays on this
          server. The fight goes browser to browser, so a published copy hosts itself.
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
