import { useEffect, useRef, useState, type MutableRefObject, type RefObject } from "react";
import { useP2PRoom } from "@/lib/multiplayer";
import type { HumanRow } from "@/lib/multiplayer/p2p";
import type { TrekSim } from "@/game/sim";

type Props = {
  room: string;
  name: string;
  simRef: RefObject<TrekSim | null>;
  sendRef: MutableRefObject<((data: unknown) => void) | null>;
};

type Pose = {
  k?: string;
  text?: string;
  n?: number;
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
  quad?: "A" | "B";
  hail?: { text?: string; n?: number } | null;
};

function poseOf(sim: TrekSim, hail: { text: string; n: number } | null): Pose {
  const p = sim.player;
  return {
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
    alive: p.alive && !sim.over,
    quad: p.quad,
    hail,
  };
}

export function NetLink({ room, name, simRef, sendRef }: Props) {
  const p2p = useP2PRoom({ room: `otrek-${room}`.slice(0, 64), name });
  const [label, setLabel] = useState("linking");
  const [humans, setHumans] = useState<HumanRow[]>([]);
  const [notice, setNotice] = useState("");
  const hailRef = useRef<{ text: string; n: number } | null>(null);
  const heard = useRef(new Map<string, number>());
  const known = useRef(new Set<string>());
  const seenOnce = useRef(false);

  const hear = (from: string, text: string, n: number) => {
    if (!text || !n || heard.current.get(from) === n) return;
    heard.current.set(from, n);
    simRef.current?.say(text.slice(0, 96), "amber");
  };

  useEffect(() => {
    sendRef.current = (data) => {
      p2p.send(data);
      p2p.broadcast(data);
      if (!data || typeof data !== "object") return;
      const msg = data as { k?: string; text?: string; n?: number };
      if (msg.k !== "hail" || !msg.text) return;
      hailRef.current = { text: msg.text, n: Number(msg.n) || Date.now() };
      const sim = simRef.current;
      if (sim) p2p.publishState(poseOf(sim, hailRef.current));
    };
    return () => {
      sendRef.current = null;
    };
  }, [p2p.send, p2p.broadcast, p2p.publishState, sendRef, simRef]);

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
        const msg = data as Pose & { to?: string; dmg?: number; by?: string };
        const sim = simRef.current;
        if (!sim) return;
        if (msg.k === "pose") sim.upsertRemote(from, msg);
        if (msg.k === "hit" && msg.to === p2p.selfId) {
          sim.applyIncoming(Number(msg.dmg) || 0, String(msg.by ?? "someone"));
        }
        if (msg.k === "hail" && msg.text) hear(from, msg.text, Number(msg.n) || 0);
      }),
    [p2p.onMessage, p2p.selfId, simRef],
  );

  useEffect(
    () =>
      p2p.onRoster((peers) => {
        const sim = simRef.current;
        if (!sim) return;
        for (const peer of peers) {
          if (peer.id === p2p.selfId || !peer.state || typeof peer.state !== "object") continue;
          const pose = peer.state as Pose;
          if (pose.k !== "pose") continue;
          sim.upsertRemote(peer.id, pose);
          if (pose.hail?.text) hear(peer.id, String(pose.hail.text), Number(pose.hail.n) || 0);
        }
      }),
    [p2p.onRoster, p2p.selfId, simRef],
  );

  useEffect(
    () =>
      p2p.onHumans((list) => {
        setHumans(list);
        const sim = simRef.current;
        if (!seenOnce.current) {
          for (const human of list) known.current.add(human.id);
          seenOnce.current = true;
          return;
        }
        for (const human of list) {
          if (human.id === p2p.selfId || known.current.has(human.id)) continue;
          known.current.add(human.id);
          const line = human.playing ? `${human.name} is in the quadrant.` : `${human.name} logged in.`;
          setNotice(line);
          sim?.say(line, "amber");
        }
      }),
    [p2p.onHumans, p2p.selfId, simRef],
  );

  useEffect(() => {
    let last = 0;
    let posted = 0;
    let raf = 0;
    const loop = (now: number) => {
      const sim = simRef.current;
      const p = sim?.player;
      if (p && sim && now - last > 100) {
        last = now;
        const pose = poseOf(sim, hailRef.current);
        p2p.broadcast(pose);
        if (now - posted > 400) {
          posted = now;
          p2p.publishState(pose);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [p2p.broadcast, p2p.publishState, simRef]);

  useEffect(() => {
    simRef.current?.dropRemotes(p2p.peers.map((peer) => peer.id));
    const linked = p2p.peers.filter((peer) => peer.connectionState === "connected").length;
    setLabel(!p2p.joined ? "linking" : linked ? `${linked} linked` : "on the board");
  }, [p2p.joined, p2p.peers, simRef]);

  const handles = humans.length ? humans : [{ id: "you", name, playing: true }];

  return (
    <div className="pointer-events-none absolute top-14 left-3 z-10 w-56 border border-line bg-bg/90 px-3 py-2 font-mono text-xs">
      <p className="text-amber">
        HUMANS · {humans.length || 1}
      </p>
      <ul className="mt-1 space-y-0.5 text-fg">
        {handles.map((human) => (
          <li key={human.id} className="truncate">
            {human.name}
            {human.id === p2p.selfId || human.id === "you" ? " · you" : human.playing ? " · in the fight" : " · logged in"}
          </li>
        ))}
      </ul>
      {notice ? <p className="mt-1 text-amber">{notice}</p> : null}
      <p className="mt-1 text-muted">{label}</p>
    </div>
  );
}