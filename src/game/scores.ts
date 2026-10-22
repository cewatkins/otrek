export type ScoreRow = {
  name: string;
  code: string;
  gold: number;
  dmg: number;
  kills: number;
  at: number;
  breaks?: number;
};

const KEY = "otrek-web-v1";
const OLD_KEY = "mtrek-web-v1";

type SaveShape = {
  version: 1;
  scores: ScoreRow[];
  callsign: string;
  classId: string;
};

function blank(): SaveShape {
  return { version: 1, scores: [], callsign: "USS Intrepid", classId: "EXCEL" };
}

function read(): SaveShape {
  if (typeof localStorage === "undefined") return blank();
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(OLD_KEY);
    if (!raw) return blank();
    const parsed = JSON.parse(raw) as Partial<SaveShape>;
    if (parsed.version !== 1 || !Array.isArray(parsed.scores)) return blank();
    return {
      version: 1,
      scores: parsed.scores.filter(
        (s) => s && typeof s.name === "string" && typeof s.gold === "number",
      ),
      callsign: typeof parsed.callsign === "string" ? parsed.callsign : "USS Intrepid",
      classId: typeof parsed.classId === "string" ? parsed.classId : "EXCEL",
    };
  } catch {
    return blank();
  }
}

function write(data: SaveShape) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function loadScores(): ScoreRow[] {
  return read().scores;
}

export function loadCallsign(): { name: string; classId: string } {
  const data = read();
  return { name: data.callsign, classId: data.classId };
}

export function saveCallsign(name: string, classId: string) {
  const data = read();
  data.callsign = name;
  data.classId = classId;
  write(data);
}

export function saveScore(row: ScoreRow): ScoreRow[] {
  const data = read();
  const existing = data.scores.find((s) => s.name === row.name && s.code === row.code);
  if (existing && existing.gold >= row.gold && (existing.breaks ?? 0) >= (row.breaks ?? 0)) return data.scores;
  data.scores = [row, ...data.scores.filter((s) => !(s.name === row.name && s.code === row.code))]
    .sort((a, b) => b.gold - a.gold)
    .slice(0, 8);
  write(data);
  return data.scores;
}

const MAP_KEY = "otrek-keymaps-v1";

export function loadKeymaps(): Record<string, string> {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(MAP_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "string" && value.length > 0 && value.length < 49) out[key] = value;
    }
    return out;
  } catch {
    return {};
  }
}

export function saveKeymaps(map: Record<string, string>) {
  localStorage.setItem(MAP_KEY, JSON.stringify(map));
}
