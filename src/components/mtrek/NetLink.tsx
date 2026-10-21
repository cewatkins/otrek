import { useEffect, useState, type MutableRefObject, type RefObject } from "react";
import { useP2PRoom } from "@/lib/multiplayer";
import type { TrekSim } from "@/game/sim";

type Props = {
  room: string;
  name: string;
  simRef: RefObject<TrekSim | null>;
  sendRef: MutableRefObject<((data: unknown) => void) | null>;
};

export function NetLink({ room, name, simRef, sendRef }: Props) {
  const p2p = useP2PRoom({ room: `otrek-${room}`.slice(0, 64), name });
  const [label, setLabel] = useState("linking");

  useEffect(() => {
    sendRef.current = (data) => p2p.send(data);
    return () => {
      sendRef.current = null;
    };
  }, [p2p.send, sendRef]);

  useEffect(() => {
    const sim = simRef.current;
    if (!sim) return;
    sim.onStrike = (peer, raw) => {
      if (peer) p2p.send({ k: "hit", to: peer, dmg: raw, by: sim.player.name });
    };
    return () => {
      sim.onStrike = null;
    };
  }, [p2p.send, simRef]);

  useEffect(
    () =>
      p2p.onMessage((from, data) => {
        if (!data || typeof data !== "object") return;
        const msg = data as {
          k?: string;
          to?: string;
          dmg?: number;
          by?: string;
          text?: string;
          name?: string;
          classId?: string;
          x?: number;
          y?: number;
          yaw?: number;
          warp?: number;
          shield?: number;
          hull?: number;
          cloaked?: boolean;
          docked?: boolean;
          alive?: boolean;
        };
        const sim = simRef.current;
        if (!sim) return;
        if (msg.k === "pose") sim.upsertRemote(from, msg);
        if (msg.k === "hit" && msg.to === p2p.selfId) {
          sim.applyIncoming(Number(msg.dmg) || 0, String(msg.by ?? "someone"));
        }
        if (msg.k === "hail" && msg.text) sim.say(String(msg.text).slice(0, 96), "amber");
      }),
    [p2p.onMessage, p2p.selfId, simRef],
  );

  useEffect(() => {
    let last = 0;
    let raf = 0;
    const loop = (now: number) => {
      if (now - last > 100) {
        last = now;
        const sim = simRef.current;
        const p = sim?.player;
        if (p) {
          p2p.broadcast({
            k: "pose",
            name: p.name,
            classId: p.cls.id,
            x: p.x,
            y: p.y,
            yaw: p.yaw,
            warp: p.warp,
            shield: p.shield,
            hull: p.hull,
            cloaked: p.cloaked,
            docked: p.docked,
            alive: p.alive && !sim?.over,
          });
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [p2p.broadcast, simRef]);

  useEffect(() => {
    simRef.current?.dropRemotes(p2p.peers.map((peer) => peer.id));
    const linked = p2p.peers.filter((peer) => peer.connectionState === "connected").length;
    const failed = p2p.peers.filter((peer) => peer.connectionState === "failed").length;
    setLabel(
      !p2p.joined ? "linking" : failed && !linked ? "no path" : linked ? `${linked} linked` : "waiting",
    );
  }, [p2p.joined, p2p.peers, simRef]);

  return (
    <p className="pointer-events-none absolute top-14 left-3 z-10 font-mono text-xs text-amber">
      ROOM {room} · {label}
    </p>
  );
}
