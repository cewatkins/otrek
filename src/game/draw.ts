import { BASES, HOLES, PLANETS, WORLD, type TrekSim } from "@/game/sim";

const BG = "#000000";
const FG = "#e6eef6";
const MUTED = "#8b9bb0";
const AMBER = "#5eb6ff";
const ALERT = "#ff3358";
const LINE = "#163044";
const BLUE = "#3ec5ff";
const RED = "#ff2438";
const GOLD = "#e4c36a";

export type Camera = { x: number; y: number; scale: number; w: number; h: number; radarOnly?: boolean };

const SPRITE_SRC: Record<string, string> = {
  EXCEL: "/ships/excel.png",
  LARSON: "/ships/larson.png",
  IIA: "/ships/iia.png",
  RBOP: "/ships/rbop.png",
  WARBIRD: "/ships/warbird.png",
  KEV12: "/ships/kev12.png",
  KPB13: "/ships/kpb13.png",
  CDA180: "/ships/cda180.png",
  CDA120: "/ships/cda120.png",
  BR5: "/ships/br5.png",
  DY600: "/ships/dy600.png",
  CV97: "/ships/cv97.png",
};

const spriteCache = new Map<string, HTMLImageElement>();

function shipSprite(kind: string): HTMLImageElement | null {
  if (typeof Image === "undefined") return null;
  const src = SPRITE_SRC[kind];
  if (!src) return null;
  let img = spriteCache.get(src);
  if (!img) {
    img = new Image();
    img.decoding = "async";
    img.src = src;
    spriteCache.set(src, img);
  }
  return img.complete && img.naturalWidth > 0 ? img : null;
}

/** Grey Starfleet, dark Klingon, green Romulan. The plates are original renders, not studio stills. */
function factionFilter(kind: string) {
  if (kind === "KEV12" || kind === "KPB13") return "brightness(0.55) saturate(0.65)";
  if (kind === "RBOP" || kind === "WARBIRD") return "hue-rotate(55deg) saturate(1.35) brightness(0.95)";
  if (kind === "EXCEL" || kind === "LARSON" || kind === "IIA" || kind === "DY600") {
    return "saturate(0.2) brightness(1.18)";
  }
  if (kind === "BR5") return "brightness(0.7) saturate(0.8)";
  return "none";
}

export function radarSplit(h: number) {
  return Math.round(Math.min(Math.max(h * 0.36, 148), h * 0.44));
}

function gaugeWidth(w: number) {
  return Math.round(Math.min(168, Math.max(108, w * 0.18)));
}

function longWidth(w: number) {
  return Math.round(Math.min(240, Math.max(112, w * 0.26)));
}

export function cameraFor(sim: TrekSim, w: number, h: number): Camera {
  const short = Math.min(w, h);
  const scale = short / 2400;
  return { x: sim.player.x, y: sim.player.y, scale, w, h };
}

export function screenToWorld(cam: Camera, sx: number, sy: number) {
  return {
    x: (sx - cam.w / 2) / cam.scale + cam.x,
    y: (sy - cam.h / 2) / cam.scale + cam.y,
  };
}

function toScreen(cam: Camera, x: number, y: number) {
  return {
    x: (x - cam.x) * cam.scale + cam.w / 2,
    y: (y - cam.y) * cam.scale + cam.h / 2,
  };
}

function paintShip(
  ctx: CanvasRenderingContext2D,
  kind: string,
  yaw: number,
  x: number,
  y: number,
  size: number,
  flash: boolean,
) {
  const img = shipSprite(kind);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-yaw);
  if (img) {
    const base = factionFilter(kind);
    const filter = flash ? `${base === "none" ? "" : base} brightness(2.4)`.trim() : base;
    if (filter && filter !== "none") ctx.filter = filter;
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.filter = "none";
  } else {
    ctx.strokeStyle = flash ? FG : AMBER;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.45);
    ctx.lineTo(size * 0.32, size * 0.4);
    ctx.lineTo(0, size * 0.18);
    ctx.lineTo(-size * 0.32, size * 0.4);
    ctx.closePath();
    ctx.stroke();
  }
  ctx.restore();
}

function drawGauges(
  ctx: CanvasRenderingContext2D,
  sim: TrekSim,
  pane: { x: number; y: number; w: number; h: number },
) {
  const p = sim.player;
  ctx.save();
  ctx.beginPath();
  ctx.rect(pane.x, pane.y, pane.w, pane.h);
  ctx.clip();
  ctx.fillStyle = "#000";
  ctx.fillRect(pane.x, pane.y, pane.w, pane.h);
  ctx.fillStyle = MUTED;
  ctx.font = "11px IBM Plex Mono, ui-monospace, monospace";
  ctx.fillText("GAUGES", pane.x + 10, pane.y + 16);
  const rows = [
    { label: "SHIELDS", frac: p.shield / 100, text: String(Math.round(p.shield)), color: BLUE },
    {
      label: pane.w < 176 ? "TORPEDOES" : "PHOTON TORPEDOES",
      frac: p.cls.magazine > 0 ? p.magazine / p.cls.magazine : 0,
      text: String(p.magazine),
      color: GOLD,
    },
    {
      label: "WARP ENERGY",
      frac: p.cls.energy > 0 ? p.energy / p.cls.energy : 0,
      text: String(Math.round(p.energy)),
      color: "#7ee0ff",
    },
  ];
  const gap = (pane.h - 28) / rows.length;
  rows.forEach((row, i) => {
    const y = pane.y + 28 + i * gap;
    ctx.fillStyle = MUTED;
    ctx.font = "10px IBM Plex Mono, ui-monospace, monospace";
    ctx.fillText(row.label, pane.x + 10, y + 12);
    ctx.fillStyle = FG;
    ctx.fillText(row.text, pane.x + pane.w - 36, y + 12);
    const bx = pane.x + 10;
    const by = y + 18;
    const bw = pane.w - 20;
    const bh = Math.max(8, Math.min(14, gap - 28));
    ctx.strokeStyle = "#1a4a72";
    ctx.strokeRect(bx, by, bw, bh);
    const frac = Math.max(0, Math.min(1, row.frac));
    ctx.fillStyle = row.color;
    ctx.fillRect(bx + 1, by + 1, Math.max(0, (bw - 2) * frac), bh - 2);
  });
  ctx.restore();
}

export function drawTactical(
  ctx: CanvasRenderingContext2D,
  sim: TrekSim,
  cam: Camera,
) {
  const { w, h } = cam;
  if (!cam.radarOnly) {
    const split = radarSplit(h);
    const longW = longWidth(w);
    const gauges = gaugeWidth(w);
    ctx.save();
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, w, h);
    drawLongRange(ctx, sim, { x: 0, y: 0, w: longW, h: split });
    drawGauges(ctx, sim, { x: longW + 1, y: 0, w: gauges, h: split });
    const radarX = longW + gauges + 2;
    const radarW = Math.max(1, w - radarX);
    ctx.save();
    ctx.beginPath();
    ctx.rect(radarX, 0, radarW, split);
    ctx.clip();
    ctx.translate(radarX, 0);
    drawTactical(ctx, sim, {
      x: cam.x,
      y: cam.y,
      scale: Math.min(radarW, split) / 2400,
      w: radarW,
      h: split,
      radarOnly: true,
    });
    ctx.restore();
    ctx.strokeStyle = "#1a4a72";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, split + 0.5);
    ctx.lineTo(w, split + 0.5);
    ctx.moveTo(longW + 0.5, 0);
    ctx.lineTo(longW + 0.5, split);
    ctx.moveTo(radarX - 0.5, 0);
    ctx.lineTo(radarX - 0.5, split);
    ctx.stroke();
    drawForward(ctx, sim, { x: 0, y: split + 1, w, h: Math.max(1, h - split - 1) });
    ctx.restore();
    return;
  }
  const shake = sim.shake;
  const sx = shake ? (Math.random() - 0.5) * shake : 0;
  const sy = shake ? (Math.random() - 0.5) * shake : 0;
  ctx.save();
  ctx.translate(sx, sy);
  ctx.fillStyle = BG;
  ctx.fillRect(-20, -20, w + 40, h + 40);

  ctx.strokeStyle = LINE;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.55;
  const grid = 1000;
  const left = cam.x - w / 2 / cam.scale;
  const top = cam.y - h / 2 / cam.scale;
  const gx0 = Math.floor(left / grid) * grid;
  const gy0 = Math.floor(top / grid) * grid;
  for (let x = gx0; x < left + w / cam.scale + grid; x += grid) {
    const p = toScreen(cam, x, 0);
    ctx.beginPath();
    ctx.moveTo(p.x, 0);
    ctx.lineTo(p.x, h);
    ctx.stroke();
  }
  for (let y = gy0; y < top + h / cam.scale + grid; y += grid) {
    const p = toScreen(cam, 0, y);
    ctx.beginPath();
    ctx.moveTo(0, p.y);
    ctx.lineTo(w, p.y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  for (const star of sim.stars) {
    const p = toScreen(cam, star.x, star.y);
    if (p.x < -10 || p.y < -10 || p.x > w + 10 || p.y > h + 10) continue;
    ctx.globalAlpha = 0.25 + star.b * 0.55;
    ctx.fillStyle = FG;
    ctx.fillRect(p.x, p.y, star.b > 0.8 ? 2 : 1, star.b > 0.8 ? 2 : 1);
  }
  ctx.globalAlpha = 1;

  const player = sim.player;
  const origin = toScreen(cam, player.x, player.y);
  ctx.strokeStyle = LINE;
  ctx.setLineDash([3, 6]);
  for (const radius of [player.cls.phaserRange, player.cls.torpMax]) {
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, radius * cam.scale, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  const quad = player.quad;
  const bases = BASES.filter((b) => b.quad === quad);
  const planets = PLANETS.filter((p) => p.quad === quad);
  const hole = HOLES.find((h) => h.quad === quad);

  if (hole) {
    const p = toScreen(cam, hole.x, hole.y);
    const open = sim.holeOpen;
    ctx.strokeStyle = open ? AMBER : MUTED;
    ctx.globalAlpha = open ? 0.85 : 0.35;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 18, sim.t * (open ? 1.4 : 0.2), sim.t * (open ? 1.4 : 0.2) + 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(p.x, p.y, 10, -sim.t * 2, -sim.t * 2 + 3);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = open ? MUTED : LINE;
    ctx.font = "11px IBM Plex Mono, ui-monospace, monospace";
    const mouth = quad === "A" ? "ALPHA WORMHOLE" : "BETA WORMHOLE";
    ctx.fillText(open ? mouth : "WORMHOLE DARK", p.x + 22, p.y + 4);
  }

  for (const planet of planets) {
    const p = toScreen(cam, planet.x, planet.y);
    ctx.fillStyle = "#221c14";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = MUTED;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(p.x, p.y, 24, 0.4, 2.2);
    ctx.stroke();
    ctx.fillStyle = FG;
    ctx.font = "12px IBM Plex Mono, ui-monospace, monospace";
    ctx.fillText(planet.name, p.x + 28, p.y + 4);
  }

  for (const base of bases) {
    const p = toScreen(cam, base.x, base.y);
    ctx.strokeStyle = AMBER;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      const x = p.x + Math.cos(a) * 14;
      const y = p.y + Math.sin(a) * 14;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = AMBER;
    ctx.font = "12px IBM Plex Mono, ui-monospace, monospace";
    ctx.fillText(base.num > 0 ? `SB${base.num} ${base.name}` : base.name, p.x + 20, p.y - 8);
    ctx.fillStyle = MUTED;
    ctx.fillText(base.race, p.x + 20, p.y + 8);
  }

  for (const g of sim.picks) {
    const p = toScreen(cam, g.x, g.y);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(sim.t * 2);
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-5, -5, 10, 10);
    ctx.restore();
  }

  for (const mine of sim.mines) {
    const p = toScreen(cam, mine.x, mine.y);
    ctx.strokeStyle = mine.arm > 0 ? MUTED : ALERT;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y - 6);
    ctx.lineTo(p.x + 6, p.y);
    ctx.lineTo(p.x, p.y + 6);
    ctx.lineTo(p.x - 6, p.y);
    ctx.closePath();
    ctx.stroke();
  }

  for (const b of sim.bolts) {
    const p = toScreen(cam, b.x, b.y);
    const owner = sim.shipById(b.owner);
    const friendly = Boolean(owner?.isPlayer);
    ctx.fillStyle = b.drone
      ? friendly
        ? BLUE
        : RED
      : b.kind === "plasma"
        ? friendly
          ? "#7dffa8"
          : ALERT
        : friendly
          ? BLUE
          : RED;
    ctx.beginPath();
    if (b.drone) ctx.rect(p.x - 3, p.y - 3, 6, 6);
    else ctx.arc(p.x, p.y, b.kind === "plasma" ? 4 : 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const beam of sim.beams) {
    const a = toScreen(cam, beam.x1, beam.y1);
    const b = toScreen(cam, beam.x2, beam.y2);
    ctx.strokeStyle = beam.byPlayer ? BLUE : RED;
    ctx.globalAlpha = Math.max(0.25, beam.life / 0.16);
    ctx.lineWidth = beam.esi ? 2 : 1.5;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  for (const ship of sim.ships) {
    if (!ship.alive) continue;
    const seen = ship.isPlayer || sim.visible(player, ship);
    if (!seen) continue;
    const p = toScreen(cam, ship.x, ship.y);
    const mine = ship.isPlayer;
    const color = mine ? BLUE : RED;
    const size = mine ? 46 : 36;
    ctx.save();
    ctx.globalAlpha = ship.cloaked ? 0.45 : 1;
    if (ship.shield > 2) {
      ctx.strokeStyle = color;
      ctx.globalAlpha = (ship.cloaked ? 0.3 : 0.7) * (ship.shield / 100);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size * 0.62, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = ship.cloaked ? 0.45 : 1;
    }
    if (ship.docked) {
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size * 0.72, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    paintShip(ctx, ship.cls.id, ship.yaw, p.x, p.y, size, ship.hitFlash > 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = mine ? BLUE : FG;
    ctx.font = "12px IBM Plex Mono, ui-monospace, monospace";
    const tag = ship.docked ? `${ship.letter} ${ship.name} DOCKED` : `${ship.letter} ${ship.name}`;
    ctx.fillText(tag, p.x + size * 0.55, p.y - 14);
    ctx.restore();
  }

  if (player.lockId) {
    const lock = sim.shipById(player.lockId);
    if (lock && lock.alive && sim.visible(player, lock)) {
      const p = toScreen(cam, lock.x, lock.y);
      ctx.strokeStyle = ALERT;
      ctx.lineWidth = 1.5;
      const s = 16;
      ctx.strokeRect(p.x - s, p.y - s, s * 2, s * 2);
    }
  }

  for (const q of sim.particles) {
    const p = toScreen(cam, q.x, q.y);
    ctx.globalAlpha = Math.max(0, q.life / q.max);
    ctx.fillStyle = q.alert ? ALERT : AMBER;
    ctx.fillRect(p.x, p.y, q.size, q.size);
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = MUTED;
  ctx.font = "11px IBM Plex Mono, ui-monospace, monospace";
  ctx.fillText("SHORT RANGE", 10, 16);

  const hullPct = player.cls.hull > 0 ? player.hull / player.cls.hull : 1;
  if (!cam.radarOnly && hullPct < 0.3 && player.alive) {
    const g = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.7);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(255,90,60,0.28)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  ctx.restore();
}

function drawLongRange(ctx: CanvasRenderingContext2D, sim: TrekSim, pane: Pane) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(pane.x, pane.y, pane.w, pane.h);
  ctx.clip();
  ctx.fillStyle = BG;
  ctx.fillRect(pane.x, pane.y, pane.w, pane.h);
  const size = Math.max(8, Math.min(pane.w - 16, pane.h - 28));
  const x0 = pane.x + (pane.w - size) / 2;
  const y0 = pane.y + 22;
  ctx.strokeStyle = "#1a4a72";
  ctx.strokeRect(x0, y0, size, size);
  const quad = sim.player.quad;
  const m = (wx: number, wy: number) => ({
    x: x0 + (wx / WORLD) * size,
    y: y0 + (wy / WORLD) * size,
  });
  ctx.fillStyle = MUTED;
  for (const planet of PLANETS) {
    if (planet.quad !== quad) continue;
    const p = m(planet.x, planet.y);
    ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
  }
  ctx.fillStyle = AMBER;
  for (const base of BASES) {
    if (base.quad !== quad) continue;
    const p = m(base.x, base.y);
    ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
  }
  for (const hole of HOLES) {
    if (hole.quad !== quad) continue;
    const p = m(hole.x, hole.y);
    ctx.strokeStyle = sim.holeOpen ? GOLD : MUTED;
    ctx.strokeRect(p.x - 3, p.y - 3, 6, 6);
  }
  for (const ship of sim.ships) {
    if (!ship.alive || ship.quad !== quad) continue;
    if (!ship.isPlayer && !ship.remote && !sim.visible(sim.player, ship)) continue;
    const p = m(ship.x, ship.y);
    ctx.fillStyle = ship.isPlayer ? GOLD : ship.remote ? "#7ee0ff" : ALERT;
    ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
  }
  ctx.fillStyle = GOLD;
  ctx.font = "10px IBM Plex Mono, ui-monospace, monospace";
  ctx.fillText("LONG RANGE", pane.x + 8, pane.y + 14);
  ctx.restore();
}

type Pane = { x: number; y: number; w: number; h: number };

function place(fwd: number, lat: number, pane: Pane) {
  if (fwd < 36) return null;
  const cx = pane.x + pane.w / 2;
  const horizon = pane.y + pane.h * 0.36;
  const focal = pane.h * 0.92;
  const sx = cx + (lat / fwd) * focal;
  const sy = horizon + Math.min(pane.h * 0.58, (focal * 110) / fwd);
  const size = Math.max(16, Math.min(pane.h * 0.62, 15000 / fwd));
  return { sx, sy, size, fwd };
}

function project(player: { x: number; y: number; yaw: number }, wx: number, wy: number, pane: Pane) {
  const dx = wx - player.x;
  const dy = wy - player.y;
  const fx = -Math.sin(player.yaw);
  const fy = -Math.cos(player.yaw);
  const rx = Math.cos(player.yaw);
  const ry = -Math.sin(player.yaw);
  return place(dx * fx + dy * fy, dx * rx + dy * ry, pane);
}

function drawForward(ctx: CanvasRenderingContext2D, sim: TrekSim, pane: Pane) {
  const player = sim.player;
  const cx = pane.x + pane.w / 2;
  const horizon = pane.y + pane.h * 0.36;
  ctx.save();
  ctx.beginPath();
  ctx.rect(pane.x, pane.y, pane.w, pane.h);
  ctx.clip();
  ctx.fillStyle = "#000000";
  ctx.fillRect(pane.x, pane.y, pane.w, pane.h);

  for (let i = 0; i < 80; i++) {
    const ang = (i * 2.399963) % (Math.PI * 2);
    let rel = ang - player.yaw;
    while (rel > Math.PI) rel -= Math.PI * 2;
    while (rel < -Math.PI) rel += Math.PI * 2;
    if (Math.abs(rel) > 1.2) continue;
    const sx = cx + (rel / 1.2) * pane.w * 0.48;
    const sy = pane.y + 12 + ((i * 53) % Math.max(8, Math.floor(horizon - pane.y - 16)));
    ctx.globalAlpha = 0.28 + (i % 5) * 0.12;
    ctx.fillStyle = FG;
    ctx.fillRect(sx, sy, i % 8 === 0 ? 2 : 1, i % 8 === 0 ? 2 : 1);
  }
  ctx.globalAlpha = 1;

  ctx.strokeStyle = "#12324c";
  ctx.lineWidth = 1;
  for (const fwd of [220, 420, 720, 1100, 1700, 2500, 3600]) {
    const a = place(fwd, -2400, pane);
    const b = place(fwd, 2400, pane);
    if (!a || !b) continue;
    ctx.beginPath();
    ctx.moveTo(a.sx, a.sy);
    ctx.lineTo(b.sx, b.sy);
    ctx.stroke();
  }
  for (let lat = -2000; lat <= 2000; lat += 500) {
    const a = place(80, lat, pane);
    const b = place(4000, lat, pane);
    if (!a || !b) continue;
    ctx.beginPath();
    ctx.moveTo(a.sx, a.sy);
    ctx.lineTo(b.sx, b.sy);
    ctx.stroke();
  }
  ctx.strokeStyle = "#1a4a72";
  ctx.beginPath();
  ctx.moveTo(pane.x, horizon);
  ctx.lineTo(pane.x + pane.w, horizon);
  ctx.stroke();

  for (const base of BASES) {
    if (base.quad !== player.quad) continue;
    const p = project(player, base.x, base.y, pane);
    if (!p || p.fwd > 7000) continue;
    const s = Math.max(10, p.size * 0.35);
    ctx.strokeStyle = BLUE;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(p.sx, p.sy - s);
    ctx.lineTo(p.sx + s, p.sy);
    ctx.lineTo(p.sx, p.sy + s);
    ctx.lineTo(p.sx - s, p.sy);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = MUTED;
    ctx.font = "11px IBM Plex Mono, ui-monospace, monospace";
    ctx.fillText(base.num > 0 ? `SB${base.num}` : base.name, p.sx + s + 4, p.sy);
  }

  const marks: { id: string; kind: string; name: string; yaw: number; flash: boolean; shield: number; sx: number; sy: number; size: number; fwd: number }[] = [];
  for (const ship of sim.ships) {
    if (!ship.alive || ship.isPlayer) continue;
    if (!sim.visible(player, ship)) continue;
    const p = project(player, ship.x, ship.y, pane);
    if (!p || p.sx < pane.x - 120 || p.sx > pane.x + pane.w + 120) continue;
    marks.push({
      id: ship.id,
      kind: ship.cls.id,
      name: ship.name,
      yaw: ship.yaw - player.yaw,
      flash: ship.hitFlash > 0,
      shield: ship.shield,
      sx: p.sx,
      sy: p.sy,
      size: p.size,
      fwd: p.fwd,
    });
  }
  marks.sort((a, b) => b.fwd - a.fwd);
  for (const mark of marks) {
    const fog = Math.max(0.35, Math.min(1, 1100 / mark.fwd));
    ctx.globalAlpha = fog;
    paintShip(ctx, mark.kind, mark.yaw, mark.sx, mark.sy, mark.size, mark.flash);
    if (mark.shield > 8) {
      ctx.strokeStyle = `rgba(62, 197, 255, ${0.2 + mark.shield / 250})`;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.ellipse(mark.sx, mark.sy, mark.size * 0.62, mark.size * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = mark.kind === "KEV12" || mark.kind === "KPB13" ? RED : mark.kind === "RBOP" || mark.kind === "WARBIRD" ? "#3dce7a" : BLUE;
    ctx.lineWidth = 1;
    const b = mark.size * 0.55;
    ctx.strokeRect(mark.sx - b, mark.sy - b, b * 2, b * 2);
    ctx.fillStyle = FG;
    ctx.font = "11px IBM Plex Mono, ui-monospace, monospace";
    ctx.fillText(mark.name, mark.sx + b + 4, mark.sy - 4);
  }

  for (const bolt of sim.bolts) {
    const p = project(player, bolt.x, bolt.y, pane);
    if (!p) continue;
    const owner = sim.shipById(bolt.owner);
    ctx.fillStyle = owner?.isPlayer ? BLUE : RED;
    ctx.beginPath();
    ctx.arc(p.sx, p.sy, bolt.drone ? 4 : bolt.kind === "plasma" ? 5 : 3, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const beam of sim.beams) {
    const hit = project(player, beam.x2, beam.y2, pane);
    ctx.strokeStyle = beam.byPlayer ? BLUE : RED;
    ctx.globalAlpha = Math.max(0.4, beam.life / 0.16);
    ctx.lineWidth = beam.esi ? 3 : 2;
    ctx.beginPath();
    if (beam.byPlayer) {
      ctx.moveTo(cx, pane.y + pane.h - 8);
      if (hit) ctx.lineTo(hit.sx, hit.sy);
      else ctx.lineTo(cx, horizon);
    } else if (hit) {
      const src = project(player, beam.x1, beam.y1, pane);
      if (!src) continue;
      ctx.moveTo(src.sx, src.sy);
      ctx.lineTo(hit.sx, hit.sy);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  ctx.strokeStyle = BLUE;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 10, horizon + 18);
  ctx.lineTo(cx - 3, horizon + 18);
  ctx.moveTo(cx + 3, horizon + 18);
  ctx.lineTo(cx + 10, horizon + 18);
  ctx.moveTo(cx, horizon + 10);
  ctx.lineTo(cx, horizon + 15);
  ctx.moveTo(cx, horizon + 21);
  ctx.lineTo(cx, horizon + 26);
  ctx.stroke();

  ctx.fillStyle = MUTED;
  ctx.font = "11px IBM Plex Mono, ui-monospace, monospace";
  ctx.fillText("FORWARD", pane.x + pane.w - 78, pane.y + 18);
  ctx.restore();
}

export function pointerCommand(
  sim: TrekSim,
  w: number,
  h: number,
  sx: number,
  sy: number,
): { kind: "lock"; id: string } | { kind: "course"; x: number; y: number } {
  const split = radarSplit(h);
  const longW = longWidth(w);
  const gauges = gaugeWidth(w);
  if (sy <= split) {
    if (sx < longW) {
      const size = Math.max(8, Math.min(longW - 16, split - 28));
      const x0 = (longW - size) / 2;
      const y0 = 22;
      const nx = (sx - x0) / size;
      const ny = (sy - y0) / size;
      if (nx >= 0 && ny >= 0 && nx <= 1 && ny <= 1) {
        return { kind: "course", x: nx * WORLD, y: ny * WORLD };
      }
      return { kind: "course", x: sim.player.x, y: sim.player.y };
    }
    if (sx < longW + gauges + 1) return { kind: "course", x: sim.player.x, y: sim.player.y };
    const radarW = Math.max(1, w - longW - gauges - 2);
    const cam = cameraFor(sim, radarW, split);
    const localX = sx - longW - gauges - 2;
    const id = pickShipAt(sim, cam, localX, sy);
    if (id) return { kind: "lock", id };
    const world = screenToWorld(cam, localX, sy);
    return { kind: "course", x: world.x, y: world.y };
  }
  const pane = { x: 0, y: split + 1, w, h: Math.max(1, h - split - 1) };
  let best: string | null = null;
  let bestD = 36;
  for (const ship of sim.ships) {
    if (!ship.alive || ship.isPlayer || !sim.visible(sim.player, ship)) continue;
    const p = project(sim.player, ship.x, ship.y, pane);
    if (!p) continue;
    const d = Math.hypot(p.sx - sx, p.sy - sy);
    if (d < Math.max(bestD, p.size * 0.45)) {
      bestD = d;
      best = ship.id;
    }
  }
  if (best) return { kind: "lock", id: best };
  const nx = (sx - w / 2) / (w * 0.42);
  const aim = sim.player.yaw - nx * 0.7;
  return {
    kind: "course",
    x: sim.player.x - Math.sin(aim) * 900,
    y: sim.player.y - Math.cos(aim) * 900,
  };
}

export function pickShipAt(sim: TrekSim, cam: Camera, sx: number, sy: number) {
  let best: string | null = null;
  let bestD = 26;
  for (const ship of sim.ships) {
    if (!ship.alive || ship.isPlayer) continue;
    if (!sim.visible(sim.player, ship)) continue;
    const p = toScreen(cam, ship.x, ship.y);
    const d = Math.hypot(p.x - sx, p.y - sy);
    if (d < bestD) {
      bestD = d;
      best = ship.id;
    }
  }
  return best;
}
