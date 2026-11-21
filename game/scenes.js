// Twin Frames: the three original scenes. Every picture is drawn in code with
// the canvas 2D API — no image files, no copied art. Each scene is 640x480.
// draw(ctx, side, t) paints one panel: side 'left' is the reference picture,
// side 'right' is the same picture with the scene's differences applied.
// differences: the hit-test circles { id, x, y, r, label } in scene space.

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function cloud(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(255, 244, 230, 0.92)';
  ellipse(ctx, x, y, 34 * s, 16 * s);
  ellipse(ctx, x + 24 * s, y + 4 * s, 26 * s, 13 * s);
  ellipse(ctx, x - 26 * s, y + 5 * s, 22 * s, 11 * s);
}

function bird(ctx, x, y, s) {
  ctx.strokeStyle = '#2b2b3a';
  ctx.lineWidth = 2.5 * s;
  ctx.beginPath();
  ctx.moveTo(x - 9 * s, y);
  ctx.quadraticCurveTo(x - 4 * s, y - 7 * s, x, y);
  ctx.quadraticCurveTo(x + 4 * s, y - 7 * s, x + 9 * s, y);
  ctx.stroke();
}

function pine(ctx, x, y, h, color) {
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(x - 4, y - 12, 8, 12);
  ctx.fillStyle = color;
  for (let i = 0; i < 3; i += 1) {
    const w = 52 - i * 12;
    const ty = y - 14 - i * 26;
    ctx.beginPath();
    ctx.moveTo(x - w / 2, ty);
    ctx.lineTo(x, ty - 34);
    ctx.lineTo(x + w / 2, ty);
    ctx.closePath();
    ctx.fill();
  }
}

function star(ctx, x, y, r) {
  ctx.fillStyle = '#fff8d6';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

// ---------------------------------------------------------------------------
// Level 1 — Harbor Sunset (7 differences)
// ---------------------------------------------------------------------------
function drawHarbor(ctx, side, t) {
  const right = side === 'right';
  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#2b3a67');
  sky.addColorStop(0.55, '#c65f6e');
  sky.addColorStop(1, '#f7b267');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 640, 300);
  // Sun
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.arc(520, 110, 42, 0, Math.PI * 2);
  ctx.fill();
  if (!right) {
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 4;
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(520 + Math.cos(a) * 50, 110 + Math.sin(a) * 50);
      ctx.lineTo(520 + Math.cos(a) * 64, 110 + Math.sin(a) * 64);
      ctx.stroke();
    }
  }
  // Clouds (the first one is missing on the right)
  if (!right) cloud(ctx, 120, 70, 1);
  cloud(ctx, 300, 48, 0.8);
  cloud(ctx, 470, 92, 0.7);
  // Birds (one missing on the right)
  bird(ctx, 200, 90, 1);
  if (!right) bird(ctx, 240, 70, 1);
  bird(ctx, 280, 100, 0.9);
  // Sea
  const sea = ctx.createLinearGradient(0, 300, 0, 480);
  sea.addColorStop(0, '#1d6f8e');
  sea.addColorStop(1, '#0f4c6b');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 300, 640, 180);
  // Sun reflection shimmer
  ctx.strokeStyle = 'rgba(255, 209, 102, 0.55)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i += 1) {
    const y = 320 + i * 28;
    const wob = Math.sin(t * 1.6 + i) * 6;
    ctx.beginPath();
    ctx.moveTo(490 + wob, y);
    ctx.lineTo(550 + wob, y);
    ctx.stroke();
  }
  // Lighthouse
  ctx.fillStyle = '#f2ede4';
  ctx.fillRect(58, 150, 26, 150);
  ctx.fillStyle = '#d64545';
  ctx.fillRect(58, 175, 26, 18);
  ctx.fillRect(58, 225, 26, 18);
  ctx.fillRect(58, 275, 26, 18);
  ctx.fillStyle = '#2b2b3a';
  ctx.fillRect(52, 138, 38, 14);
  ctx.fillStyle = '#ffd166';
  ctx.fillRect(62, 140, 18, 10);
  // Lighthouse window: lit on the left, dark on the right
  ctx.fillStyle = right ? '#2b2b3a' : '#ffe08a';
  ctx.fillRect(66, 205, 10, 12);
  // Light beam (left only)
  if (!right) {
    const pulse = 0.16 + 0.05 * Math.sin(t * 2);
    ctx.fillStyle = `rgba(255, 224, 138, ${pulse})`;
    ctx.beginPath();
    ctx.moveTo(90, 145);
    ctx.lineTo(230, 120);
    ctx.lineTo(230, 175);
    ctx.closePath();
    ctx.fill();
  }
  // Boats
  // Boat 1: sail red on the left, blue on the right
  ctx.fillStyle = '#5a3a21';
  ctx.beginPath();
  ctx.moveTo(272, 340);
  ctx.lineTo(330, 340);
  ctx.lineTo(318, 354);
  ctx.lineTo(284, 354);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = right ? '#3a6fd8' : '#d64545';
  ctx.beginPath();
  ctx.moveTo(300, 336);
  ctx.lineTo(300, 288);
  ctx.lineTo(326, 336);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#5a3a21';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(300, 288);
  ctx.lineTo(300, 338);
  ctx.stroke();
  // Boat 2
  ctx.fillStyle = '#5a3a21';
  ctx.beginPath();
  ctx.moveTo(430, 368);
  ctx.lineTo(478, 368);
  ctx.lineTo(468, 380);
  ctx.lineTo(440, 380);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f2ede4';
  ctx.beginPath();
  ctx.moveTo(454, 366);
  ctx.lineTo(454, 326);
  ctx.lineTo(474, 366);
  ctx.closePath();
  ctx.fill();
  // Buoy (missing on the right)
  if (!right) {
    ctx.fillStyle = '#d64545';
    ctx.beginPath();
    ctx.arc(380, 400, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f2ede4';
    ctx.fillRect(374, 396, 12, 6);
  }
}

const HARBOR_DIFFS = [
  { id: 'sun-rays', x: 520, y: 110, r: 58, label: 'Sun rays' },
  { id: 'cloud', x: 120, y: 70, r: 46, label: 'Cloud' },
  { id: 'beam', x: 130, y: 150, r: 44, label: 'Lighthouse beam' },
  { id: 'sail', x: 305, y: 310, r: 42, label: 'Sail colour' },
  { id: 'bird', x: 240, y: 70, r: 22, label: 'Bird' },
  { id: 'buoy', x: 380, y: 400, r: 26, label: 'Buoy' },
  { id: 'window', x: 71, y: 211, r: 16, label: 'Lighthouse window' },
];

// ---------------------------------------------------------------------------
// Level 2 — Forest Camp (8 differences)
// ---------------------------------------------------------------------------
function drawCamp(ctx, side, t) {
  const right = side === 'right';
  // Night sky
  const sky = ctx.createLinearGradient(0, 0, 0, 480);
  sky.addColorStop(0, '#0b1026');
  sky.addColorStop(1, '#1b2a4a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 640, 480);
  // Stars (one missing on the right)
  const stars = [[60, 50], [150, 60], [220, 40], [330, 70], [420, 45], [90, 130], [260, 110], [480, 130], [600, 80], [360, 150], [180, 170], [540, 170]];
  stars.forEach(([x, y], i) => {
    if (right && i === 1) return;
    star(ctx, x, y, i % 3 === 0 ? 2.6 : 1.8);
  });
  // Moon (craters on the left only)
  ctx.fillStyle = '#f7ead0';
  ctx.beginPath();
  ctx.arc(540, 80, 34, 0, Math.PI * 2);
  ctx.fill();
  if (!right) {
    ctx.fillStyle = '#d9c9a3';
    ctx.beginPath();
    ctx.arc(530, 72, 6, 0, Math.PI * 2);
    ctx.arc(552, 90, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  // Ground
  ctx.fillStyle = '#1e3a24';
  ctx.fillRect(0, 380, 640, 100);
  ctx.fillStyle = '#16291b';
  ctx.fillRect(0, 380, 640, 10);
  // Pine trees (one missing on the right)
  pine(ctx, 60, 380, 120, '#2c5a34');
  pine(ctx, 150, 380, 100, '#26502e');
  pine(ctx, 320, 380, 130, '#2c5a34');
  pine(ctx, 560, 380, 110, '#26502e');
  if (!right) pine(ctx, 600, 380, 90, '#2c5a34');
  // Tent (door open on the left, closed on the right)
  ctx.fillStyle = '#e8823a';
  ctx.beginPath();
  ctx.moveTo(180, 300);
  ctx.lineTo(130, 380);
  ctx.lineTo(230, 380);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c96a28';
  ctx.beginPath();
  ctx.moveTo(180, 300);
  ctx.lineTo(180, 380);
  ctx.lineTo(205, 380);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = right ? '#e8823a' : '#241a12';
  ctx.beginPath();
  ctx.moveTo(180, 336);
  ctx.lineTo(164, 380);
  ctx.lineTo(196, 380);
  ctx.closePath();
  ctx.fill();
  // Campfire: stones, logs, flame (3 tongues left, 2 right)
  ctx.fillStyle = '#8a8f96';
  [[352, 402], [372, 408], [392, 402], [410, 408]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.strokeStyle = '#5a3a21';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(360, 400);
  ctx.lineTo(400, 388);
  ctx.moveTo(400, 400);
  ctx.lineTo(360, 388);
  ctx.stroke();
  const flick = Math.sin(t * 7) * 3;
  ctx.fillStyle = '#ff9d2e';
  ctx.beginPath();
  ctx.moveTo(368, 392);
  ctx.quadraticCurveTo(360, 360 + flick, 380, 344 + flick);
  ctx.quadraticCurveTo(400, 360 + flick, 392, 392);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.moveTo(374, 392);
  ctx.quadraticCurveTo(370, 368 + flick, 380, 358 + flick);
  ctx.quadraticCurveTo(390, 368 + flick, 386, 392);
  ctx.closePath();
  ctx.fill();
  if (!right) {
    ctx.fillStyle = '#ff6b2e';
    ctx.beginPath();
    ctx.moveTo(380, 392);
    ctx.quadraticCurveTo(384, 372 + flick, 380, 352 + flick);
    ctx.quadraticCurveTo(376, 372 + flick, 380, 392);
    ctx.closePath();
    ctx.fill();
  }
  // Spare log beside the fire (missing on the right)
  if (!right) {
    ctx.strokeStyle = '#5a3a21';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(292, 404);
    ctx.lineTo(322, 396);
    ctx.stroke();
  }
  // Backpack: red on the left, green on the right
  ctx.fillStyle = right ? '#3f8f4f' : '#c94f4f';
  ctx.beginPath();
  ctx.arc(480, 392, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(468, 380, 24, 10);
  ctx.fillStyle = '#2b2b3a';
  ctx.fillRect(474, 384, 12, 6);
  // Owl on a branch (missing on the right)
  ctx.strokeStyle = '#5a3a21';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(500, 214);
  ctx.lineTo(556, 206);
  ctx.stroke();
  if (!right) {
    ctx.fillStyle = '#8a7a5a';
    ctx.beginPath();
    ctx.arc(528, 196, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2b2b3a';
    ctx.beginPath();
    ctx.arc(523, 193, 2.5, 0, Math.PI * 2);
    ctx.arc(533, 193, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

const CAMP_DIFFS = [
  { id: 'moon', x: 540, y: 80, r: 40, label: 'Moon craters' },
  { id: 'star', x: 150, y: 60, r: 14, label: 'Star' },
  { id: 'tent-door', x: 180, y: 360, r: 26, label: 'Tent door' },
  { id: 'flame', x: 380, y: 368, r: 30, label: 'Campfire flame' },
  { id: 'owl', x: 528, y: 196, r: 26, label: 'Owl' },
  { id: 'tree', x: 600, y: 330, r: 42, label: 'Pine tree' },
  { id: 'backpack', x: 480, y: 392, r: 26, label: 'Backpack colour' },
  { id: 'log', x: 307, y: 400, r: 22, label: 'Spare log' },
];

// ---------------------------------------------------------------------------
// Level 3 — Rooftop Night (10 differences)
// ---------------------------------------------------------------------------
function drawRooftop(ctx, side, t) {
  const right = side === 'right';
  // Night sky
  const sky = ctx.createLinearGradient(0, 0, 0, 480);
  sky.addColorStop(0, '#10152e');
  sky.addColorStop(1, '#2a1e4a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 640, 480);
  // Moon (crater on the left only)
  ctx.fillStyle = '#f7ead0';
  ctx.beginPath();
  ctx.arc(100, 70, 30, 0, Math.PI * 2);
  ctx.fill();
  if (!right) {
    ctx.fillStyle = '#d9c9a3';
    ctx.beginPath();
    ctx.arc(92, 64, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  // Stars (one missing on the right)
  const stars = [[180, 60], [300, 50], [380, 90], [520, 60], [610, 140], [240, 120], [440, 150]];
  stars.forEach(([x, y], i) => {
    if (right && i === 1) return;
    star(ctx, x, y, 2);
  });
  // Airplane (missing on the right)
  if (!right) {
    ctx.fillStyle = '#d8d8e0';
    ctx.fillRect(428, 116, 44, 6);
    ctx.fillRect(446, 108, 10, 22);
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(428, 119, 2.5, 0, Math.PI * 2);
    ctx.arc(472, 119, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  // Buildings
  const buildings = [
    { x: 60, w: 120, top: 260, lit: [[80, 290], [120, 320], [150, 290]] },
    { x: 220, w: 140, top: 180, lit: [[240, 210], [290, 240], [330, 210], [260, 300]] },
    { x: 420, w: 160, top: 220, lit: [[440, 250], [500, 280], [540, 250]] },
  ];
  buildings.forEach((b) => {
    ctx.fillStyle = '#1c2138';
    ctx.fillRect(b.x, b.top, b.w, 480 - b.top);
    ctx.fillStyle = '#2a3049';
    ctx.fillRect(b.x, b.top, b.w, 6);
    // Window grid: some lit, some dark
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        const wx = b.x + 14 + col * 30;
        const wy = b.top + 22 + row * 34;
        const isLit = b.lit.some(([lx, ly]) => Math.abs(lx - wx) < 4 && Math.abs(ly - wy) < 4);
        // One window on building B is lit on the left, dark on the right
        const isSpecial = b.x === 220 && wx === 290 && wy === 240;
        ctx.fillStyle = isSpecial ? (right ? '#2a3049' : '#ffd166') : (isLit ? '#ffd166' : '#2a3049');
        ctx.fillRect(wx, wy, 16, 20);
      }
    }
  });
  // Water tower on building A (missing on the right)
  if (!right) {
    ctx.fillStyle = '#3a4157';
    ctx.fillRect(108, 224, 6, 36);
    ctx.fillRect(132, 224, 6, 36);
    ctx.fillStyle = '#4a5470';
    ctx.beginPath();
    ctx.ellipse(120, 216, 26, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(94, 216, 52, 10);
  }
  // Antenna on building B with a red light (light missing on the right)
  ctx.strokeStyle = '#8a8f96';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(290, 180);
  ctx.lineTo(290, 132);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(290, 148);
  ctx.lineTo(268, 148);
  ctx.moveTo(290, 148);
  ctx.lineTo(312, 148);
  ctx.stroke();
  if (!right) {
    const blink = Math.sin(t * 3) > 0 ? '#ff5d5d' : '#a33';
    ctx.fillStyle = blink;
    ctx.beginPath();
    ctx.arc(290, 128, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  // Satellite dish on building C (missing on the right)
  if (!right) {
    ctx.strokeStyle = '#8a8f96';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(480, 220);
    ctx.lineTo(480, 196);
    ctx.stroke();
    ctx.fillStyle = '#9aa0b0';
    ctx.beginPath();
    ctx.arc(480, 188, 16, Math.PI, Math.PI * 2);
    ctx.fill();
  }
  // AC unit on building C roof (missing on the right)
  if (!right) {
    ctx.fillStyle = '#4a5470';
    ctx.fillRect(500, 204, 26, 16);
    ctx.fillStyle = '#2a3049';
    ctx.fillRect(504, 208, 18, 3);
    ctx.fillRect(504, 214, 18, 3);
  }
  // Foreground roof
  ctx.fillStyle = '#141828';
  ctx.fillRect(0, 440, 640, 40);
  ctx.fillStyle = '#1e2438';
  ctx.fillRect(0, 440, 640, 6);
  // Cat on the roof edge (missing on the right)
  if (!right) {
    ctx.fillStyle = '#0a0c14';
    ctx.beginPath();
    ctx.arc(500, 428, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(492, 420);
    ctx.lineTo(494, 408);
    ctx.lineTo(498, 418);
    ctx.closePath();
    ctx.moveTo(504, 418);
    ctx.lineTo(508, 408);
    ctx.lineTo(510, 420);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(489, 428, 22, 12);
    ctx.beginPath();
    ctx.moveTo(511, 434);
    ctx.quadraticCurveTo(524, 430, 522, 416);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#0a0c14';
    ctx.stroke();
  }
  // Streetlight (glow on the left, off on the right)
  ctx.strokeStyle = '#3a4157';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(40, 440);
  ctx.lineTo(40, 392);
  ctx.lineTo(58, 392);
  ctx.stroke();
  if (!right) {
    ctx.fillStyle = 'rgba(255, 209, 102, 0.25)';
    ctx.beginPath();
    ctx.arc(60, 398, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(60, 396, 7, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = '#3a4157';
    ctx.beginPath();
    ctx.arc(60, 396, 7, 0, Math.PI * 2);
    ctx.fill();
  }
}

const ROOFTOP_DIFFS = [
  { id: 'moon-crater', x: 100, y: 70, r: 36, label: 'Moon crater' },
  { id: 'star', x: 300, y: 50, r: 14, label: 'Star' },
  { id: 'antenna-light', x: 290, y: 128, r: 14, label: 'Antenna light' },
  { id: 'window', x: 298, y: 250, r: 16, label: 'Lit window' },
  { id: 'dish', x: 480, y: 190, r: 30, label: 'Satellite dish' },
  { id: 'water-tower', x: 120, y: 216, r: 30, label: 'Water tower' },
  { id: 'cat', x: 500, y: 428, r: 26, label: 'Cat' },
  { id: 'airplane', x: 450, y: 119, r: 26, label: 'Airplane' },
  { id: 'streetlight', x: 60, y: 396, r: 30, label: 'Streetlight' },
  { id: 'ac-unit', x: 513, y: 212, r: 18, label: 'AC unit' },
];

export const SCENES = [
  { id: 'harbor', name: 'Harbor Sunset', timeLimit: 120, differences: HARBOR_DIFFS, draw: drawHarbor },
  { id: 'camp', name: 'Forest Camp', timeLimit: 120, differences: CAMP_DIFFS, draw: drawCamp },
  { id: 'rooftop', name: 'Rooftop Night', timeLimit: 150, differences: ROOFTOP_DIFFS, draw: drawRooftop },
];

export const PANEL_WIDTH = 640;
export const PANEL_HEIGHT = 480;
