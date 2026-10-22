import { createServerFn } from "@tanstack/react-start";
import { CLASSES } from "@/game/classes";
import { authMiddleware } from "@/lib/auth/middleware";

export type BoardRow = {
  callsign: string;
  code: string;
  gold: number;
  dmg: number;
  kills: number;
  breaks: number;
  yours: boolean;
};

const CODES = new Set(CLASSES.flatMap((cls) => [cls.id, cls.code]));

export type ScorePost = {
  callsign: string;
  code: string;
  gold: number;
  dmg: number;
  kills: number;
  breaks: number;
};

function clampInt(n: unknown, max: number) {
  const v = Math.floor(Number(n));
  if (!Number.isFinite(v) || v < 0) return 0;
  return Math.min(max, v);
}

function cleanPost(input: ScorePost): ScorePost | null {
  const callsign = String(input?.callsign ?? "").trim().slice(0, 18);
  const code = String(input?.code ?? "").trim().slice(0, 12);
  if (!callsign || !CODES.has(code)) return null;
  return {
    callsign,
    code,
    gold: clampInt(input.gold, 5_000_000),
    dmg: clampInt(input.dmg, 50_000_000),
    kills: clampInt(input.kills, 9_999),
    breaks: clampInt(input.breaks, 999),
  };
}

/** Top of the fleet. Account ids stay on the server; `yours` marks this captain. */
export const listBoard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<BoardRow[]> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<{
      callsign: string;
      code: string;
      gold: number;
      dmg: number;
      kills: number;
      breaks: number;
      yours: boolean;
    }>`
      select callsign, code, gold, dmg, kills, breaks,
             (user_id = ${context.userId}) as yours
      from scores
      order by gold desc, kills desc, updated_at asc
      limit 20
    `;
    return rows.map((row) => ({
      callsign: row.callsign,
      code: row.code,
      gold: Number(row.gold) || 0,
      dmg: Number(row.dmg) || 0,
      kills: Number(row.kills) || 0,
      breaks: Number(row.breaks) || 0,
      yours: row.yours === true || String(row.yours) === "t",
    }));
  });

/** One row per captain. A higher break count may lower gold. Otherwise gold only rises. */
export const submitScore = createServerFn({ method: "POST" })
  .validator((input: ScorePost) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const post = cleanPost(data);
    if (!post) return { ok: false as const };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`
      insert into scores (user_id, callsign, code, gold, dmg, kills, breaks)
      values (
        ${context.userId},
        ${post.callsign},
        ${post.code},
        ${post.gold},
        ${post.dmg},
        ${post.kills},
        ${post.breaks}
      )
      on conflict (user_id) do update set
        callsign = excluded.callsign,
        code = excluded.code,
        gold = case
          when excluded.breaks > scores.breaks then excluded.gold
          else greatest(scores.gold, excluded.gold)
        end,
        dmg = greatest(scores.dmg, excluded.dmg),
        kills = greatest(scores.kills, excluded.kills),
        breaks = greatest(scores.breaks, excluded.breaks),
        updated_at = now()
      where scores.user_id = ${context.userId}
    `;
    return { ok: true as const };
  });
