import { useCallback, useEffect, useRef, useState } from "react";
import { P2PRoom, type HumanRow, type PeerInfo, type PeerRow } from "./p2p";

export interface UseP2PRoomOptions {
  room?: string;
  name?: string;
}

export interface P2PRoomHandle {
  selfId: string;
  room: string;
  peers: PeerInfo[];
  joined: boolean;
  linkError: string;
  broadcast: (data: unknown) => void;
  publishState: (data: unknown) => void;
  send: (data: unknown, peerId?: string) => void;
  onMessage: (
    fn: (from: string, data: unknown, channel: "state" | "reliable") => void,
  ) => () => void;
  onRoster: (fn: (peers: PeerRow[]) => void) => () => void;
  onHumans: (fn: (humans: HumanRow[]) => void) => () => void;
}

export function useP2PRoom(options: UseP2PRoomOptions = {}): P2PRoomHandle {
  const [selfId] = useState(() => `p-${Math.random().toString(36).slice(2, 10)}`);
  const [room] = useState(() => (options.room ?? "otrek-open").slice(0, 64));
  const [name] = useState(() => options.name ?? selfId);
  const [peers, setPeers] = useState<PeerInfo[]>([]);
  const [joined, setJoined] = useState(false);
  const [linkError, setLinkError] = useState("");
  const roomRef = useRef<P2PRoom | null>(null);
  const listeners = useRef(
    new Set<(from: string, data: unknown, channel: "state" | "reliable") => void>(),
  );
  const rosterListeners = useRef(new Set<(peers: PeerRow[]) => void>());
  const humanListeners = useRef(new Set<(humans: HumanRow[]) => void>());

  useEffect(() => {
    const p2p = new P2PRoom({
      room,
      selfId,
      name,
      onPeersChanged: setPeers,
      onMessage: (from, data, channel) => {
        for (const fn of listeners.current) fn(from, data, channel);
      },
      onRoster: (peers) => {
        for (const fn of rosterListeners.current) fn(peers);
      },
      onHumans: (humans) => {
        for (const fn of humanListeners.current) fn(humans);
      },
      onConnected: () => setJoined(true),
      onStatus: (message) => setLinkError(message),
    });
    roomRef.current = p2p;
    void p2p.join();
    return () => {
      roomRef.current = null;
      p2p.close();
    };
  }, [room, selfId, name]);

  const broadcast = useCallback((data: unknown) => roomRef.current?.broadcast(data), []);
  const publishState = useCallback((data: unknown) => roomRef.current?.publishState(data), []);
  const send = useCallback(
    (data: unknown, peerId?: string) => roomRef.current?.send(data, peerId),
    [],
  );
  const onMessage = useCallback(
    (fn: (from: string, data: unknown, channel: "state" | "reliable") => void) => {
      listeners.current.add(fn);
      return () => {
        listeners.current.delete(fn);
      };
    },
    [],
  );
  const onRoster = useCallback((fn: (peers: PeerRow[]) => void) => {
    rosterListeners.current.add(fn);
    return () => {
      rosterListeners.current.delete(fn);
    };
  }, []);
  const onHumans = useCallback((fn: (humans: HumanRow[]) => void) => {
    humanListeners.current.add(fn);
    return () => {
      humanListeners.current.delete(fn);
    };
  }, []);

  return { selfId, room, peers, joined, linkError, broadcast, publishState, send, onMessage, onRoster, onHumans };
}
