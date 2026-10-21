import { BASES, HOLES, PLANETS, WORLD, type TrekSim } from "@/game/sim";

const BG = "#0c0a07";
const FG = "#f3e6c8";
const MUTED = "#9a8460";
const AMBER = "#f0a020";
const ALERT = "#ff5a3c";
const LINE = "#3a3124";

export type Camera = { x: number; y: number; scale: number; w: number; h: number };

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

function shipPoly(ctx: CanvasRenderingContext2D, yaw: number, x: number, y: number, scale = 1) {
  const pts = [
    [0, -16],
    [-9, 11],
    [0, 6],
    [9, 11],
  ];
  ctx.beginPath();
  pts.forEach(([lx, ly], i) => {
    const wx = (lx * Math.cos(yaw) + ly * Math.sin(yaw)) * scale;
    const wy = (-lx * Math.sin(yaw) + ly * Math.cos(yaw)) * scale;
    if (i === 0) ctx.moveTo(x + wx, y + wy);
    else ctx.lineTo(x + wx, y + wy);
  });
  ctx.closePath();
}

export function drawTactical(
  ctx: CanvasRenderingContext2D,
  sim: TrekSim,
  cam: Camera,
) {
  const { w, h } = cam;
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

  for (const hole of HOLES) {
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
    ctx.fillText(open ? "WORMHOLE" : "WORMHOLE DARK", p.x + 22, p.y + 4);
  }

  for (const planet of PLANETS) {
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

  for (const base of BASES) {
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
    ctx.fillText(`SB${base.num} ${base.name}`, p.x + 20, p.y - 8);
    ctx.fillStyle = MUTED;
    ctx.fillText(base.race, p.x + 20, p.y + 8);
  }

  for (const g of sim.picks) {
    const p = toScreen(cam, g.x, g.y);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(sim.t * 2);
    ctx.strokeStyle = AMBER;
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
    ctx.fillStyle = b.drone ? AMBER : b.kind === "plasma" ? ALERT : b.kind === "obliterator" ? AMBER : FG;
    ctx.beginPath();
    if (b.drone) ctx.rect(p.x - 3, p.y - 3, 6, 6);
    else ctx.arc(p.x, p.y, b.kind === "plasma" ? 4 : 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const beam of sim.beams) {
    const a = toScreen(cam, beam.x1, beam.y1);
    const b = toScreen(cam, beam.x2, beam.y2);
    ctx.strokeStyle = beam.esi ? ALERT : AMBER;
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
    const color = mine ? AMBER : ALERT;
    ctx.save();
    ctx.globalAlpha = ship.cloaked ? 0.45 : 1;
    if (ship.shield > 2) {
      ctx.strokeStyle = color;
      ctx.globalAlpha = (ship.cloaked ? 0.3 : 0.7) * (ship.shield / 100);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = ship.cloaked ? 0.45 : 1;
    }
    ctx.lineWidth = ship.hitFlash > 0 ? 2.5 : 1.5;
    ctx.strokeStyle = ship.hitFlash > 0 ? FG : color;
    ctx.fillStyle = mine ? "#2a2114" : "#2a1410";
    if (ship.docked) ctx.setLineDash([3, 3]);
    shipPoly(ctx, ship.yaw, p.x, p.y, mine ? 1.05 : 1);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    ctx.fillStyle = mine ? AMBER : FG;
    ctx.font = "12px IBM Plex Mono, ui-monospace, monospace";
    const tag = ship.docked ? `${ship.letter} ${ship.name} DOCKED` : `${ship.letter} ${ship.name}`;
    ctx.fillText(tag, p.x + 16, p.y - 14);
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

  const hullPct = player.cls.hull > 0 ? player.hull / player.cls.hull : 1;
  if (hullPct < 0.3 && player.alive) {
    const g = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.7);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(255,90,60,0.28)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  drawMinimap(ctx, sim, w, h);
  ctx.restore();
}

function drawMinimap(ctx: CanvasRenderingContext2D, sim: TrekSim, w: number, h: number) {
  const size = Math.min(148, Math.max(96, w * 0.22));
  const pad = 12;
  const x0 = w - size - pad;
  const y0 = h - size - pad;
  ctx.fillStyle = "rgba(12,10,7,0.82)";
  ctx.strokeStyle = LINE;
  ctx.lineWidth = 1;
  ctx.fillRect(x0, y0, size, size);
  ctx.strokeRect(x0, y0, size, size);
  const m = (wx: number, wy: number) => ({
    x: x0 + (wx / WORLD) * size,
    y: y0 + (wy / WORLD) * size,
  });
  ctx.fillStyle = MUTED;
  for (const planet of PLANETS) {
    const p = m(planet.x, planet.y);
    ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
  }
  ctx.fillStyle = AMBER;
  for (const base of BASES) {
    const p = m(base.x, base.y);
    ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
  }
  for (const ship of sim.ships) {
    if (!ship.alive) continue;
    if (!ship.isPlayer && !sim.visible(sim.player, ship)) continue;
    const p = m(ship.x, ship.y);
    ctx.fillStyle = ship.isPlayer ? AMBER : ALERT;
    ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
  }
  ctx.fillStyle = MUTED;
  ctx.font = "10px IBM Plex Mono, ui-monospace, monospace";
  ctx.fillText("QUADRANT", x0 + 6, y0 + 14);
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
