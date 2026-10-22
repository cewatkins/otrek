import { useCallback, useEffect, useRef, useState } from "react";
import { BoardRelay, type BoardMsg } from "./relay";

export type Human = { id: string; name: string; playing: boolean; seen: number };

export function useBoard(
  selfId: string,
  name: string,
  playing: boolean,
  enabled = true,
  onMessage?: (msg: BoardMsg) => void,
) {
  const [humans, setHumans] = useState<Human[]>([]);
  const [notice, setNotice] = useState("");
  const [status, setStatus] = useState("linking");
  const relayRef = useRef<BoardRelay | null>(null);
  const known = useRef(new Set<string>());
  const seenOnce = useRef(false);
  const msgRef = useRef<BoardMsg>({ id: selfId, name, playing });
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;
  const nameRef = useRef(name);
  const playingRef = useRef(playing);
  nameRef.current = name;
  playingRef.current = playing;

  useEffect(() => {
    msgRef.current = { ...msgRef.current, id: selfId, name, playing };
  }, [selfId, name, playing]);

  useEffect(() => {
    if (!enabled) return;
    const relay = new BoardRelay(selfId);
    relayRef.current = relay;
    const people = new Map<string, Human>();
    const stop = relay.on((msg) => {
      onMessageRef.current?.(msg);
      if (msg.bye) {
        people.delete(msg.id);
      } else if (msg.name) {
        people.set(msg.id, {
          id: msg.id,
          name: msg.name,
          playing: Boolean(msg.playing),
          seen: Date.now(),
        });
        if (seenOnce.current && !known.current.has(msg.id)) {
          known.current.add(msg.id);
          setNotice(msg.playing ? `${msg.name} is in the quadrant.` : `${msg.name} logged in.`);
        }
      }
      const now = Date.now();
      const list = [...people.values()].filter((human) => now - human.seen < 15000);
      for (const human of list) known.current.add(human.id);
      seenOnce.current = true;
      setHumans(list);
    });
    void relay
      .join()
      .then(() => {
        setStatus("on the board");
        relay.publish({ ...msgRef.current, t: Date.now() });
      })
      .catch((error: unknown) => {
        setStatus(error instanceof Error ? error.message : "board relay down");
      });
    const beat = window.setInterval(() => {
      relay.publish({ ...msgRef.current, name: nameRef.current, playing: playingRef.current, t: Date.now() });
      const now = Date.now();
      setHumans([...people.values()].filter((human) => now - human.seen < 15000));
    }, 2000);
    return () => {
      window.clearInterval(beat);
      stop();
      relay.close();
      relayRef.current = null;
    };
  }, [selfId, enabled]);

  const publish = useCallback((extra: Partial<BoardMsg>) => {
    if (extra.kind) {
      relayRef.current?.publish({
        ...msgRef.current,
        ...extra,
        id: selfId,
        name: nameRef.current,
        playing: playingRef.current,
        t: Date.now(),
      });
      return;
    }
    msgRef.current = {
      ...msgRef.current,
      ...extra,
      id: selfId,
      name: nameRef.current,
      playing: playingRef.current,
    };
    delete msgRef.current.kind;
    delete msgRef.current.to;
    delete msgRef.current.dmg;
    delete msgRef.current.by;
    relayRef.current?.publish({ ...msgRef.current, t: Date.now() });
  }, [selfId]);

  return { humans, notice, status, publish, selfId };
}