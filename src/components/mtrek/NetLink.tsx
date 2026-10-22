import { useEffect, useRef, useState, type MutableRefObject, type RefObject } from "react";
import type { TrekSim } from "@/game/sim";
import type { BoardMsg } from "@/lib/multiplayer/relay";
import { useBoard } from "@/lib/multiplayer/use-board";

type Props = {
  room: string;
  name: string;
  simRef: RefObject<TrekSim | null>;
  sendRef: MutableRefObject<((data: unknown) => void) | null>;
};

export function NetLink({ name, simRef, sendRef }: Props) {
  const [selfId] = useState(() => `p-${Math.random().toString(36).slice(2, 10)}`);
  const hailRef = useRef<{ text: string; n: number; to?: string | null } | null>(null);
  const heardHits = useRef(new Map<string, number>());
  const heardHail = useRef(new Map<string, number>());

  const hear = (from: string, text: string, n: number) => {
    if (!text || !n || heardHail.current.get(from) === n) return;
    heardHail.current.set(from, n);
    simRef.current?.hearHail(text.slice(0, 96));
  };

  const onMessage = (msg: BoardMsg) => {
    const sim = simRef.current;
    if (!sim) return;
    if (msg.bye) {
      const sim = simRef.current;
      if (!sim) return;
      sim.dropRemotes(
        sim.ships.filter((ship) => ship.remote && ship.id !== `net:${msg.id}`).map((ship) => ship.id.slice(4)),
      );
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

  useEffect(() => {
    sendRef.current = (data) => {
      if (!data || typeof data !== "object") return;
      const msg = data as { k?: string; text?: string; n?: number; to?: string; dmg?: number; by?: string };
      if (msg.k === "hail" && msg.text) {
        hailRef.current = { text: msg.text, n: Number(msg.n) || Date.now(), to: msg.to };
        board.publish({ hail: hailRef.current });
      }
      if (msg.k === "hit" && msg.to) board.publish({ kind: "hit", to: msg.to, dmg: msg.dmg, by: msg.by });
    };
    return () => {
      sendRef.current = null;
    };
  }, [board.publish, sendRef]);

  useEffect(() => {
    let last = 0;
    let raf = 0;
    const loop = (now: number) => {
      const sim = simRef.current;
      if (sim) {
        sim.onStrike = (peer, raw) => {
          const hit = sim.lastStrike;
          if (peer && hit) board.publish({ kind: "hit", to: peer, dmg: raw, n: hit.n, by: sim.player.name });
        };
        sim.setRoster(
          selfId,
          board.humans.filter((human) => human.playing).map((human) => human.id),
        );
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
          hit: sim.lastStrike,
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

  const handles = [{ id: selfId, name, playing: true as boolean }, ...board.humans];

  return (
    <div className="shrink-0 border-b border-line px-3 py-2 font-mono text-xs">
      <p className="tracking-widest text-amber">HUMANS · {handles.length}</p>
      <ul className="mt-1 max-h-28 space-y-0.5 overflow-y-auto text-fg">
        {handles.map((human) => (
          <li key={human.id} className="truncate">
            {human.name}
            {human.id === selfId ? " · you" : human.playing ? " · in" : " · yard"}
          </li>
        ))}
      </ul>
      {board.notice ? <p className="mt-1 text-amber">{board.notice}</p> : null}
      <p className="mt-1 text-muted">{board.status}</p>
    </div>
  );
}
