const BROKERS = ["wss://broker.emqx.io:8084/mqtt", "wss://broker.hivemq.com:8884/mqtt"];
const ROOT = "otrek/oxy/alpha";

export type BoardMsg = {
  id: string;
  name?: string;
  playing?: boolean;
  bye?: boolean;
  t?: number;
  hail?: { text?: string; n?: number; to?: string | null } | null;
  hit?: { to?: string; dmg?: number; n?: number; by?: string } | null;
  kind?: string;
  to?: string;
  dmg?: number;
  n?: number;
  by?: string;
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
  z?: number;
  quad?: "A" | "B" | "G" | "O";
};

type Listener = (msg: BoardMsg) => void;

function encStr(text: string) {
  const bytes = new TextEncoder().encode(text);
  const out = new Uint8Array(2 + bytes.length);
  new DataView(out.buffer).setUint16(0, bytes.length);
  out.set(bytes, 2);
  return out;
}

function concat(parts: Uint8Array[]) {
  const out = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let at = 0;
  for (const part of parts) {
    out.set(part, at);
    at += part.length;
  }
  return out;
}

function remLen(length: number) {
  const bytes: number[] = [];
  do {
    let digit = length % 128;
    length = Math.floor(length / 128);
    if (length > 0) digit |= 0x80;
    bytes.push(digit);
  } while (length > 0);
  return Uint8Array.from(bytes);
}

function packet(header: number, body: Uint8Array) {
  return concat([Uint8Array.from([header]), remLen(body.length), body]);
}

function connectPacket(clientId: string, willTopic: string) {
  const flags = 0x02 | 0x04 | 0x20;
  const body = concat([
    encStr("MQTT"),
    Uint8Array.from([4, flags, 0, 30]),
    encStr(clientId),
    encStr(willTopic),
    encStr(JSON.stringify({ id: clientId, bye: true })),
  ]);
  return packet(0x10, body);
}

function parse(data: ArrayBuffer) {
  const bytes = new Uint8Array(data);
  let at = 1;
  let value = 0;
  let shift = 1;
  let digit = 0;
  do {
    digit = bytes[at++] ?? 0;
    value += (digit & 127) * shift;
    shift *= 128;
  } while (digit & 128);
  return { type: bytes[0] >> 4, body: bytes.subarray(at, at + value) };
}

export class BoardRelay {
  private ws: WebSocket | null = null;
  private readonly listeners = new Set<Listener>();
  private ping: ReturnType<typeof setInterval> | null = null;
  private closed = false;
  readonly selfId: string;

  constructor(selfId: string) {
    this.selfId = selfId;
  }

  on(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  async join() {
    let last = "board relay down";
    for (const url of BROKERS) {
      try {
        await this.open(url);
        return;
      } catch (error) {
        last = error instanceof Error ? error.message : last;
      }
    }
    throw new Error(last);
  }

  publish(msg: BoardMsg) {
    const socket = this.ws;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    const topic = `${ROOT}/${msg.id}`;
    const body = concat([encStr(topic), new TextEncoder().encode(JSON.stringify(msg))]);
    socket.send(packet(0x31, body));
  }

  close() {
    if (this.closed) return;
    this.closed = true;
    if (this.ping) clearInterval(this.ping);
    try {
      this.publish({ id: this.selfId, bye: true, t: Date.now() });
    } catch {
      /* already closing */
    }
    this.ws?.close();
    this.ws = null;
  }

  private open(url: string) {
    return new Promise<void>((resolve, reject) => {
      const socket = new WebSocket(url, ["mqtt"]);
      const fail = (message: string) => {
        socket.onopen = null;
        socket.onerror = null;
        socket.onmessage = null;
        try {
          socket.close();
        } catch {
          /* not open */
        }
        reject(new Error(message));
      };
      const timer = setTimeout(() => fail("board relay timed out"), 8000);
      socket.binaryType = "arraybuffer";
      socket.onopen = () => {
        socket.send(connectPacket(this.selfId, `${ROOT}/${this.selfId}`));
      };
      socket.onerror = () => fail("board relay refused");
      socket.onmessage = (event) => {
        const frame = parse(event.data as ArrayBuffer);
        if (frame.type === 2) {
          clearTimeout(timer);
          if (frame.body[1] !== 0) {
            fail("board relay rejected");
            return;
          }
          const topic = encStr(`${ROOT}/+`);
          socket.send(packet(0x82, concat([Uint8Array.from([0, 1]), topic, Uint8Array.from([0])])));
          this.ws = socket;
          this.ping = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) socket.send(Uint8Array.from([0xc0, 0]));
          }, 20000);
          socket.onmessage = (next) => this.incoming(next.data as ArrayBuffer);
          resolve();
        }
      };
    });
  }

  private incoming(data: ArrayBuffer) {
    const frame = parse(data);
    if (frame.type !== 3) return;
    const topicLen = (frame.body[0] << 8) | frame.body[1];
    const json = new TextDecoder().decode(frame.body.subarray(2 + topicLen));
    try {
      const msg = JSON.parse(json) as BoardMsg;
      if (!msg.id || msg.id === this.selfId) return;
      for (const fn of this.listeners) fn(msg);
    } catch {
      /* ignore a bad packet */
    }
  }
}
