import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { r as authMiddleware, t as CLASSES } from "./middleware-CtNNedZm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/board-DBYwBw1R.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var CODES = new Set(CLASSES.flatMap((cls) => [cls.id, cls.code]));
function clampInt(n, max) {
	const v = Math.floor(Number(n));
	if (!Number.isFinite(v) || v < 0) return 0;
	return Math.min(max, v);
}
function cleanPost(input) {
	const callsign = String(input?.callsign ?? "").trim().slice(0, 18);
	const code = String(input?.code ?? "").trim().slice(0, 12);
	if (!callsign || !CODES.has(code)) return null;
	return {
		callsign,
		code,
		gold: clampInt(input.gold, 5e6),
		dmg: clampInt(input.dmg, 5e7),
		kills: clampInt(input.kills, 9999),
		breaks: clampInt(input.breaks, 999)
	};
}
/** Top of the fleet. Account ids stay on the server; `yours` marks this captain. */
var listBoard_createServerFn_handler = createServerRpc({
	id: "723ab98b380a937cb6b462294310f59a518fb92b95bf24e84369d86f663d498d",
	name: "listBoard",
	filename: "src/lib/board.ts"
}, (opts) => listBoard.__executeServer(opts));
var listBoard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listBoard_createServerFn_handler, async ({ context }) => {
	const { getSql } = await import("./db-DDz0VuXO.mjs").then((n) => n.t).then((n) => n.t);
	return (await (await getSql())`
      select callsign, code, gold, dmg, kills, breaks,
             (user_id = ${context.userId}) as yours
      from scores
      order by gold desc, kills desc, updated_at asc
      limit 20
    `).map((row) => ({
		callsign: row.callsign,
		code: row.code,
		gold: Number(row.gold) || 0,
		dmg: Number(row.dmg) || 0,
		kills: Number(row.kills) || 0,
		breaks: Number(row.breaks) || 0,
		yours: row.yours === true || String(row.yours) === "t"
	}));
});
var submitScore_createServerFn_handler = createServerRpc({
	id: "89ca813da9bf1e11868b6b0e2ca0027c280c5a49e0d55e726b25683a14d11163",
	name: "submitScore",
	filename: "src/lib/board.ts"
}, (opts) => submitScore.__executeServer(opts));
var submitScore = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(submitScore_createServerFn_handler, async ({ context, data }) => {
	const post = cleanPost(data);
	if (!post) return { ok: false };
	const { getSql } = await import("./db-DDz0VuXO.mjs").then((n) => n.t).then((n) => n.t);
	await (await getSql())`
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
	return { ok: true };
});
//#endregion
export { listBoard_createServerFn_handler, submitScore_createServerFn_handler };
