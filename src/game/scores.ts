export type ScoreRow = {
  name: string;
  code: string;
  gold: number;
  dmg: number;
  kills: number;
  at: number;
};

const KEY = "mtrek-web-v1";

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
    const raw = localStorage.getItem(KEY);
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
  if (existing && existing.gold >= row.gold) return data.scores;
  data.scores = [row, ...data.scores.filter((s) => !(s.name === row.name && s.code === row.code))]
    .sort((a, b) => b.gold - a.gold)
    .slice(0, 8);
  write(data);
  return data.scores;
}
