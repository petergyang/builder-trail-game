// ========================================
// THE BUILDER TRAIL - Pixel Scene System
// ========================================

const SCENE_W = 640;
const SCENE_H = 360;
const sceneCache = {};

function preloadSheets() {}
function loadCharacterTiles() { clearSceneCache(); }
function clearSceneCache() {
  Object.keys(sceneCache).forEach(key => delete sceneCache[key]);
}

const PAL = {
  ink: '#070812',
  night: '#0d1020',
  navy: '#101a2d',
  blue: '#58a6ff',
  cyan: '#7dd3fc',
  green: '#3fb950',
  mint: '#8ff0a4',
  amber: '#d29922',
  orange: '#f0883e',
  red: '#f85149',
  pink: '#ff7ab6',
  cream: '#e6edf3',
  mute: '#8b949e',
  wall: '#1d2433',
  floor: '#161019',
  wood: '#6b4a2b',
  wood2: '#3c2a1e',
  paper: '#d7c6a3',
  shadow: 'rgba(0,0,0,0.35)'
};

function px(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function glow(ctx, x, y, radius, color) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

function gradient(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, SCENE_H);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SCENE_W, SCENE_H);
}

function dither(ctx, color = 'rgba(255,255,255,0.04)') {
  ctx.fillStyle = color;
  for (let y = 0; y < SCENE_H; y += 12) {
    for (let x = (y / 12) % 2 ? 6 : 0; x < SCENE_W; x += 12) {
      ctx.fillRect(x, y, 2, 2);
    }
  }
}

function drawWindow(ctx, x, y, w, h, mood = 'night') {
  px(ctx, x, y, w, h, '#050712');
  px(ctx, x + 4, y + 4, w - 8, h - 8, mood === 'warm' ? '#261b22' : '#071326');
  px(ctx, x + w / 2 - 2, y + 4, 4, h - 8, '#141a28');
  px(ctx, x + 4, y + h / 2 - 2, w - 8, 4, '#141a28');
  const starColor = mood === 'warm' ? PAL.amber : PAL.cyan;
  [[16, 16], [42, 28], [72, 18], [92, 48], [26, 66], [64, 78]].forEach(([sx, sy]) => {
    px(ctx, x + sx, y + sy, 3, 3, starColor);
  });
}

function drawMonitor(ctx, x, y, w = 104, h = 66, color = PAL.green) {
  px(ctx, x - 6, y - 6, w + 12, h + 12, '#050712');
  px(ctx, x, y, w, h, '#0a1221');
  glow(ctx, x + w / 2, y + h / 2, 70, `${color}33`);
  px(ctx, x + 8, y + 10, w - 16, 4, `${color}`);
  px(ctx, x + 8, y + 24, Math.floor(w * 0.62), 4, PAL.blue);
  px(ctx, x + 8, y + 38, Math.floor(w * 0.78), 4, PAL.cream);
  px(ctx, x + 8, y + 52, Math.floor(w * 0.45), 4, PAL.amber);
  px(ctx, x + w / 2 - 5, y + h + 6, 10, 18, '#2b3344');
  px(ctx, x + w / 2 - 28, y + h + 22, 56, 8, '#2b3344');
}

function drawLaptop(ctx, x, y, open = true) {
  if (open) {
    px(ctx, x, y, 88, 56, '#050712');
    px(ctx, x + 6, y + 6, 76, 44, '#0a1526');
    px(ctx, x + 14, y + 16, 44, 4, PAL.green);
    px(ctx, x + 14, y + 28, 56, 4, PAL.blue);
    px(ctx, x + 14, y + 40, 34, 4, PAL.amber);
    glow(ctx, x + 44, y + 30, 70, 'rgba(88,166,255,0.22)');
  }
  px(ctx, x - 8, y + 58, 104, 10, '#2b3344');
  px(ctx, x + 2, y + 62, 84, 3, '#6e7681');
}

function drawKeyboard(ctx, x, y, w = 150) {
  px(ctx, x, y, w, 34, '#101827');
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 9; col++) {
      px(ctx, x + 10 + col * 14, y + 7 + row * 8, 9, 4, row === 1 ? '#526077' : '#303a4f');
    }
  }
  px(ctx, x + 42, y + 29, 66, 4, '#526077');
}

function drawHands(ctx, x, y) {
  px(ctx, x, y, 34, 16, '#b98255');
  px(ctx, x + 5, y - 7, 8, 10, '#d6a16f');
  px(ctx, x + 19, y - 6, 8, 10, '#d6a16f');
  px(ctx, x + 142, y, 34, 16, '#b98255');
  px(ctx, x + 147, y - 6, 8, 10, '#d6a16f');
  px(ctx, x + 161, y - 7, 8, 10, '#d6a16f');
}

function drawEmptyChair(ctx, x, y, color = '#252f42') {
  px(ctx, x, y, 82, 18, color);
  px(ctx, x + 8, y + 18, 66, 46, '#151923');
  px(ctx, x + 14, y + 62, 12, 42, '#2b3344');
  px(ctx, x + 56, y + 62, 12, 42, '#2b3344');
  px(ctx, x - 10, y + 102, 102, 8, '#101827');
}

function drawNotebook(ctx, x, y) {
  px(ctx, x, y, 112, 72, PAL.paper);
  px(ctx, x + 54, y, 4, 72, '#a9895f');
  px(ctx, x + 12, y + 16, 32, 4, PAL.blue);
  px(ctx, x + 12, y + 30, 40, 4, PAL.red);
  px(ctx, x + 68, y + 16, 26, 4, PAL.green);
  px(ctx, x + 68, y + 30, 30, 4, PAL.amber);
}

function drawPhone(ctx, x, y) {
  px(ctx, x, y, 48, 82, '#050712');
  px(ctx, x + 5, y + 8, 38, 62, '#0b1528');
  px(ctx, x + 12, y + 18, 24, 4, PAL.green);
  px(ctx, x + 12, y + 32, 18, 4, PAL.blue);
  px(ctx, x + 12, y + 46, 28, 4, PAL.amber);
  px(ctx, x + 21, y + 73, 7, 4, '#526077');
}

function drawDesk(ctx, x, y, w = 250) {
  px(ctx, x, y, w, 18, PAL.wood);
  px(ctx, x + 14, y + 18, 12, 72, PAL.wood2);
  px(ctx, x + w - 26, y + 18, 12, 72, PAL.wood2);
  px(ctx, x + 40, y + 20, w - 80, 8, '#8a6238');
}

function drawCalendarWall(ctx, x, y) {
  px(ctx, x, y, 120, 92, '#0d1320');
  px(ctx, x + 8, y + 8, 104, 14, PAL.red);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      const busy = (row + col) % 2 === 0 || row === 2;
      px(ctx, x + 10 + col * 16, y + 30 + row * 13, 11, 8, busy ? PAL.blue : '#2b3344');
    }
  }
}

function drawOrgChart(ctx, x, y) {
  const boxes = [
    [x + 54, y, 64, 24],
    [x, y + 54, 64, 24],
    [x + 108, y + 54, 64, 24],
    [x + 24, y + 108, 64, 24],
    [x + 84, y + 108, 64, 24]
  ];
  ctx.strokeStyle = '#526077';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x + 86, y + 24);
  ctx.lineTo(x + 86, y + 42);
  ctx.lineTo(x + 32, y + 42);
  ctx.lineTo(x + 32, y + 54);
  ctx.moveTo(x + 86, y + 42);
  ctx.lineTo(x + 140, y + 42);
  ctx.lineTo(x + 140, y + 54);
  ctx.moveTo(x + 32, y + 78);
  ctx.lineTo(x + 56, y + 108);
  ctx.moveTo(x + 140, y + 78);
  ctx.lineTo(x + 116, y + 108);
  ctx.stroke();
  boxes.forEach(([bx, by, bw, bh], i) => {
    px(ctx, bx, by, bw, bh, i === 0 ? PAL.red : '#243044');
    px(ctx, bx + 8, by + 9, bw - 16, 4, PAL.cream);
  });
}

function drawConfetti(ctx) {
  const colors = [PAL.green, PAL.blue, PAL.amber, PAL.red, PAL.pink, PAL.cream];
  for (let i = 0; i < 90; i++) {
    const x = (i * 47) % SCENE_W;
    const y = (i * 83) % 210;
    px(ctx, x, y, 5, 5, colors[i % colors.length]);
  }
}

function drawOfficeBase(ctx) {
  gradient(ctx, '#09111f', '#1b1420');
  dither(ctx);
  px(ctx, 0, 240, SCENE_W, 120, '#161019');
  for (let x = -20; x < SCENE_W; x += 52) {
    px(ctx, x, 262, 36, 6, '#251a25');
    px(ctx, x + 18, 312, 42, 5, '#251a25');
  }
}

function drawHomeBase(ctx) {
  gradient(ctx, '#100d1d', '#25151b');
  dither(ctx, 'rgba(255,210,146,0.04)');
  px(ctx, 0, 238, SCENE_W, 122, '#211514');
  for (let x = 0; x < SCENE_W; x += 40) {
    px(ctx, x, 256, 28, 4, '#332119');
    px(ctx, x + 18, 316, 32, 4, '#332119');
  }
}

function drawFamilyPhoto(ctx, x, y) {
  px(ctx, x, y, 86, 64, '#40251f');
  px(ctx, x + 6, y + 6, 74, 52, '#f0d8a8');
  px(ctx, x + 16, y + 18, 12, 20, PAL.red);
  px(ctx, x + 36, y + 14, 12, 24, PAL.blue);
  px(ctx, x + 56, y + 22, 10, 16, PAL.green);
  px(ctx, x + 14, y + 44, 54, 4, '#8a6238');
}

function drawTitleSplit(ctx) {
  gradient(ctx, '#070812', '#16101d');
  px(ctx, 0, 0, SCENE_W / 2, SCENE_H, '#0a1425');
  px(ctx, SCENE_W / 2, 0, SCENE_W / 2, SCENE_H, '#21130f');
  dither(ctx);

  drawCalendarWall(ctx, 42, 42);
  drawOrgChart(ctx, 122, 112);
  drawWindow(ctx, 426, 38, 142, 102, 'warm');
  drawDesk(ctx, 360, 236, 220);
  drawLaptop(ctx, 426, 166);
  drawFamilyPhoto(ctx, 352, 64);
  drawKeyboard(ctx, 212, 276, 156);
  drawHands(ctx, 202, 270);
  glow(ctx, 310, 210, 150, 'rgba(63,185,80,0.18)');
  glow(ctx, 470, 190, 170, 'rgba(240,136,62,0.16)');
  px(ctx, 316, 0, 8, SCENE_H, 'rgba(230,237,243,0.08)');
}

function drawLateNight(ctx) {
  drawHomeBase(ctx);
  drawWindow(ctx, 442, 42, 132, 102);
  drawDesk(ctx, 186, 238, 280);
  drawMonitor(ctx, 276, 154, 120, 76, PAL.green);
  drawLaptop(ctx, 198, 174);
  drawKeyboard(ctx, 246, 264, 168);
  drawHands(ctx, 235, 258);
  px(ctx, 514, 188, 24, 50, PAL.amber);
  glow(ctx, 520, 186, 90, 'rgba(210,153,34,0.2)');
  px(ctx, 502, 238, 44, 16, PAL.wood2);
  px(ctx, 224, 226, 20, 12, '#6f4f31');
  px(ctx, 228, 218, 12, 8, '#f4d59d');
}

function drawOffice(ctx) {
  drawOfficeBase(ctx);
  drawCalendarWall(ctx, 54, 50);
  drawOrgChart(ctx, 402, 44);
  drawDesk(ctx, 178, 238, 280);
  drawMonitor(ctx, 276, 158, 116, 72, PAL.blue);
  drawEmptyChair(ctx, 78, 194, '#34202a');
  [[218, 74], [244, 96], [270, 118], [296, 140]].forEach(([x, y], i) => {
    px(ctx, x, y, 116 + i * 6, 18, i % 2 ? '#16253f' : '#182d1d');
    px(ctx, x + 10, y + 7, 70, 4, i % 2 ? PAL.blue : PAL.green);
  });
}

function drawShip(ctx) {
  gradient(ctx, '#07101d', '#17182c');
  dither(ctx);
  drawConfetti(ctx);
  drawDesk(ctx, 154, 242, 336);
  drawMonitor(ctx, 260, 138, 128, 82, PAL.green);
  drawKeyboard(ctx, 246, 272, 170);
  drawHands(ctx, 236, 266);
  px(ctx, 432, 166, 56, 72, '#101827');
  px(ctx, 442, 178, 36, 8, PAL.green);
  px(ctx, 442, 194, 28, 8, PAL.blue);
  px(ctx, 442, 210, 42, 8, PAL.amber);
  glow(ctx, 326, 178, 170, 'rgba(63,185,80,0.26)');
}

function drawFamily(ctx) {
  gradient(ctx, '#1a0f12', '#2a1710');
  dither(ctx, 'rgba(255,235,190,0.04)');
  px(ctx, 0, 246, SCENE_W, 114, '#241812');
  px(ctx, 84, 190, 214, 78, '#5f352d');
  px(ctx, 96, 174, 190, 28, '#7a4335');
  drawFamilyPhoto(ctx, 424, 64);
  drawNotebook(ctx, 330, 172);
  px(ctx, 156, 156, 72, 16, '#6f3b30');
  px(ctx, 142, 214, 104, 20, '#3c221d');
  px(ctx, 350, 258, 120, 16, '#3c2a1e');
  glow(ctx, 246, 170, 180, 'rgba(240,136,62,0.18)');
}

function drawBurnout(ctx) {
  gradient(ctx, '#050509', '#160b10');
  dither(ctx, 'rgba(248,81,73,0.05)');
  drawDesk(ctx, 158, 246, 330);
  drawMonitor(ctx, 278, 152, 116, 74, PAL.red);
  drawEmptyChair(ctx, 90, 204, '#2d3344');
  px(ctx, 126, 200, 92, 8, PAL.red);
  px(ctx, 180, 168, 34, 10, '#35251f');
  px(ctx, 210, 170, 22, 8, '#35251f');
  for (let i = 0; i < 5; i++) {
    px(ctx, 438 + i * 18, 220 - i * 8, 12, 20, '#4a3528');
    px(ctx, 440 + i * 18, 214 - i * 8, 8, 5, '#f4d59d');
  }
  glow(ctx, 320, 174, 180, 'rgba(248,81,73,0.18)');
}

function drawFlow(ctx) {
  gradient(ctx, '#06131e', '#111b2c');
  dither(ctx, 'rgba(125,211,252,0.04)');
  drawDesk(ctx, 112, 242, 416);
  drawMonitor(ctx, 160, 142, 110, 72, PAL.blue);
  drawMonitor(ctx, 286, 128, 124, 84, PAL.green);
  drawMonitor(ctx, 426, 150, 96, 64, PAL.amber);
  drawKeyboard(ctx, 246, 266, 180);
  drawHands(ctx, 236, 260);
  for (let i = 0; i < 12; i++) {
    px(ctx, 70 + i * 42, 54 + (i % 3) * 28, 20, 4, [PAL.blue, PAL.green, PAL.amber][i % 3]);
  }
  glow(ctx, 320, 164, 220, 'rgba(88,166,255,0.24)');
}

function drawCoffee(ctx) {
  gradient(ctx, '#190f0b', '#2c1b12');
  dither(ctx, 'rgba(210,153,34,0.05)');
  px(ctx, 0, 244, SCENE_W, 116, '#241811');
  px(ctx, 60, 70, 520, 24, '#3d2b1b');
  for (let i = 0; i < 8; i++) px(ctx, 82 + i * 62, 52, 28, 18, '#6b4a2b');
  drawDesk(ctx, 170, 236, 300);
  drawLaptop(ctx, 276, 166);
  drawKeyboard(ctx, 246, 266, 168);
  drawHands(ctx, 236, 260);
  px(ctx, 420, 204, 22, 22, '#f4d59d');
  px(ctx, 424, 198, 14, 8, '#fff1c2');
  glow(ctx, 320, 180, 170, 'rgba(210,153,34,0.2)');
}

function drawVacation(ctx) {
  gradient(ctx, '#4a90d9', '#e8b96d');
  px(ctx, 0, 184, SCENE_W, 64, '#3d7fc2');
  for (let x = 0; x < SCENE_W; x += 58) px(ctx, x + 14, 205, 34, 4, PAL.cyan);
  px(ctx, 0, 248, SCENE_W, 112, '#d2b06b');
  glow(ctx, 512, 70, 78, 'rgba(240,230,140,0.55)');
  px(ctx, 494, 52, 38, 38, '#f0e68c');
  px(ctx, 158, 164, 20, 96, PAL.wood);
  px(ctx, 116, 130, 96, 20, PAL.green);
  px(ctx, 132, 108, 74, 18, PAL.green);
  drawPhone(ctx, 346, 194);
  px(ctx, 424, 250, 84, 16, '#aa1f2b');
}

function drawPayday(ctx) {
  gradient(ctx, '#06180b', '#112414');
  dither(ctx, 'rgba(63,185,80,0.06)');
  drawDesk(ctx, 172, 242, 296);
  drawLaptop(ctx, 276, 164);
  drawKeyboard(ctx, 246, 266, 168);
  drawHands(ctx, 236, 260);
  for (let i = 0; i < 18; i++) {
    const x = 80 + (i * 31) % 480;
    const y = 56 + (i * 57) % 160;
    px(ctx, x, y, 34, 18, '#163f20');
    px(ctx, x + 6, y + 6, 22, 5, PAL.green);
  }
  glow(ctx, 322, 178, 190, 'rgba(63,185,80,0.26)');
}

function drawSunrise(ctx) {
  gradient(ctx, '#1b1034', '#f0883e');
  dither(ctx, 'rgba(240,230,140,0.05)');
  const sunY = 230;
  glow(ctx, 320, sunY, 170, 'rgba(240,230,140,0.35)');
  px(ctx, 244, sunY - 48, 152, 60, '#f0e68c');
  px(ctx, 0, sunY, SCENE_W, 4, 'rgba(255,255,255,0.28)');
  px(ctx, 0, 244, SCENE_W, 116, '#120d15');
  px(ctx, 252, 272, 136, 18, '#2c1a18');
  px(ctx, 286, 246, 68, 26, '#3b251f');
}

function drawReorg(ctx) {
  drawOfficeBase(ctx);
  drawOrgChart(ctx, 230, 58);
  drawEmptyChair(ctx, 74, 206, '#34202a');
  drawEmptyChair(ctx, 488, 206, '#213044');
  for (let i = 0; i < 7; i++) {
    px(ctx, 176 + i * 42, 236 + (i % 2) * 18, 32, 16, '#243044');
    px(ctx, 184 + i * 42, 242 + (i % 2) * 18, 16, 4, PAL.red);
  }
  glow(ctx, 320, 134, 160, 'rgba(248,81,73,0.18)');
}

function drawReview(ctx) {
  drawOfficeBase(ctx);
  px(ctx, 140, 80, 360, 212, '#111827');
  px(ctx, 158, 100, 324, 24, '#243044');
  for (let i = 0; i < 7; i++) {
    px(ctx, 168, 144 + i * 18, 230 - (i % 3) * 36, 6, i % 2 ? PAL.mute : PAL.cream);
    px(ctx, 410, 140 + i * 18, 42, 12, i > 4 ? PAL.red : PAL.green);
  }
  drawKeyboard(ctx, 70, 262, 150);
  glow(ctx, 320, 156, 130, 'rgba(210,153,34,0.14)');
}

function drawDemo(ctx) {
  drawOfficeBase(ctx);
  px(ctx, 112, 48, 416, 188, '#08111f');
  px(ctx, 142, 78, 112, 72, '#132b4a');
  px(ctx, 284, 78, 216, 16, PAL.blue);
  px(ctx, 284, 112, 168, 12, PAL.green);
  px(ctx, 284, 142, 188, 12, PAL.amber);
  for (let i = 0; i < 8; i++) {
    px(ctx, 82 + i * 66, 282, 44, 18, i % 2 ? '#34202a' : '#213044');
    px(ctx, 88 + i * 66, 264, 32, 24, '#101827');
  }
  glow(ctx, 320, 130, 190, 'rgba(88,166,255,0.18)');
}

function drawEndingBuilder(ctx) {
  gradient(ctx, '#0a1420', '#20160f');
  dither(ctx, 'rgba(255,255,255,0.04)');
  drawWindow(ctx, 454, 42, 124, 98, 'warm');
  drawDesk(ctx, 120, 238, 400);
  drawMonitor(ctx, 166, 144, 96, 66, PAL.green);
  drawMonitor(ctx, 288, 128, 116, 82, PAL.blue);
  drawMonitor(ctx, 430, 150, 92, 62, PAL.amber);
  drawKeyboard(ctx, 248, 268, 178);
  drawHands(ctx, 238, 262);
  drawFamilyPhoto(ctx, 52, 62);
  drawConfetti(ctx);
  glow(ctx, 320, 168, 220, 'rgba(63,185,80,0.22)');
}

const SCENES = {
  // Headliner card scenes (4:3 pixel art). draw = canvas fallback if the PNG fails.
  'card-standup': { width: SCENE_W, height: SCENE_H, caption: 'The calendar wins the morning.', draw: drawOffice },
  'card-calibration': { width: SCENE_W, height: SCENE_H, caption: 'Impact, rendered in slides.', draw: drawReview },
  'card-review-bottleneck': { width: SCENE_W, height: SCENE_H, caption: 'The queue never empties.', draw: drawReview },
  'card-team-dinner': { width: SCENE_W, height: SCENE_H, caption: 'Warm inside, you outside.', draw: drawFamily },
  'card-summer-afternoon': { width: SCENE_W, height: SCENE_H, caption: 'She wants to play now.', draw: drawFamily },
  'card-sev2': { width: SCENE_W, height: SCENE_H, caption: 'Pickup at six, incident at 4:55.', draw: drawOffice },
  'card-30th': { width: SCENE_W, height: SCENE_H, caption: "A friend turns thirty.", draw: drawFamily },
  'card-apartment': { width: SCENE_W, height: SCENE_H, caption: 'A brighter place, a bigger burn.', draw: drawFamily },
  'card-screen-time': { width: SCENE_W, height: SCENE_H, caption: '"You could be here, with us."', draw: drawFamily },
  'card-gym': { width: SCENE_W, height: SCENE_H, caption: 'A subscription to guilt.', draw: drawFamily },
  'card-5am': { width: SCENE_W, height: SCENE_H, caption: 'Ship before the world wakes.', draw: drawOffice },
  'card-agents-in-bed': { width: SCENE_W, height: SCENE_H, caption: 'The agents never sleep.', draw: drawFamily },
  'card-wrong-thing': { width: SCENE_W, height: SCENE_H, caption: 'Did anyone ask for this?', draw: drawReview },
  'card-mentor': { width: SCENE_W, height: SCENE_H, caption: 'Teach it and you learn it.', draw: drawOffice },
  'card-trending-repo': { width: SCENE_W, height: SCENE_H, caption: 'Stars, and an inbox full of strangers.', draw: drawReview },
  'card-vesting': { width: SCENE_W, height: SCENE_H, caption: 'Runway, or a reward.', draw: drawOffice },
  'card-conference': { width: SCENE_W, height: SCENE_H, caption: 'The room, or the work.', draw: drawOffice },
  'card-recruiter': { width: SCENE_W, height: SCENE_H, caption: 'A door slides into your DMs.', draw: drawReorg },
  'card-side-project-real': { width: SCENE_W, height: SCENE_H, caption: 'Eleven paying users.', draw: drawShip },
  'card-management': { width: SCENE_W, height: SCENE_H, caption: 'A title, and a calendar of one-on-ones.', draw: drawReorg },
  'ending-balanced': { width: SCENE_W, height: SCENE_H, caption: 'You built, and kept the life.', draw: drawShip },
  'ending-barely': { width: SCENE_W, height: SCENE_H, caption: 'Across the line on fumes.', draw: drawShip },
  'ending-burnout': { width: SCENE_W, height: SCENE_H, caption: 'The body filed the last ticket.', draw: drawFamily },
  'ending-alone': { width: SCENE_W, height: SCENE_H, caption: 'Alone with the repo.', draw: drawFamily },
  'ending-spectator': { width: SCENE_W, height: SCENE_H, caption: 'Watching from the sidelines.', draw: drawReorg },
  hero: { width: SCENE_W, height: SCENE_H, caption: 'The corporate trail begins.', draw: drawTitleSplit },
  office: { width: SCENE_W, height: SCENE_H, caption: 'BigTechCo expands to fill all available time.', draw: drawOffice },
  'okr-maze': { width: SCENE_W, height: SCENE_H, caption: 'Five teams. One metric. No shared reality.', draw: drawReview },
  'strategy-summit': { width: SCENE_W, height: SCENE_H, caption: 'Alignment has catering now.', draw: drawOffice },
  'doc-comments': { width: SCENE_W, height: SCENE_H, caption: 'The comments have comments.', draw: drawReview },
  'vp-review': { width: SCENE_W, height: SCENE_H, caption: 'Progress waits for the calendar.', draw: drawReview },
  reorg: { width: SCENE_W, height: SCENE_H, caption: 'The org chart has weather patterns now.', draw: drawReorg },
  review: { width: SCENE_W, height: SCENE_H, caption: 'Impact must be documented before it can exist.', draw: drawReview },
  demo: { width: SCENE_W, height: SCENE_H, caption: 'The word AI appears again.', draw: drawDemo },
  'team-good': { width: SCENE_W, height: SCENE_H, caption: 'Sometimes the team actually works.', draw: drawFlow },
  'designer': { width: SCENE_W, height: SCENE_H, caption: 'Taste arrives and the room gets quieter.', draw: drawFlow },
  'agentic-engineers': { width: SCENE_W, height: SCENE_H, caption: 'The backlog starts losing.', draw: drawDemo },
  'late-night': { width: SCENE_W, height: SCENE_H, caption: '2:47 AM. It works.', draw: drawLateNight },
  ship: { width: SCENE_W, height: SCENE_H, caption: 'You shipped something real.', draw: drawShip },
  'customer-community': { width: SCENE_W, height: SCENE_H, caption: 'Real users are talking back.', draw: drawPayday },
  'support-queue': { width: SCENE_W, height: SCENE_H, caption: 'Users mean bugs with feelings.', draw: drawBurnout },
  'launch-flop': { width: SCENE_W, height: SCENE_H, caption: 'Nobody wanted the thing you loved.', draw: drawLateNight },
  family: { width: SCENE_W, height: SCENE_H, caption: 'Some things matter more than code.', draw: drawFamily },
  'home-repair': { width: SCENE_W, height: SCENE_H, caption: 'Adult life entered the basement.', draw: drawFamily },
  burnout: { width: SCENE_W, height: SCENE_H, caption: 'You pushed too hard.', draw: drawBurnout },
  'flow-state': { width: SCENE_W, height: SCENE_H, caption: 'Everything clicks.', draw: drawFlow },
  'coffee-shop': { width: SCENE_W, height: SCENE_H, caption: 'The perfect Saturday morning.', draw: drawCoffee },
  vacation: { width: SCENE_W, height: SCENE_H, caption: 'No laptops allowed.', draw: drawVacation },
  payday: { width: SCENE_W, height: SCENE_H, caption: 'Your first dollar.', draw: drawPayday },
  sunrise: { width: SCENE_W, height: SCENE_H, caption: 'Is this what rested feels like?', draw: drawSunrise },
  'ending-builder': { width: SCENE_W, height: SCENE_H, caption: 'The Builder.', draw: drawEndingBuilder }
};

function renderSceneToCanvas(sceneId) {
  const scene = SCENES[sceneId];
  if (!scene) return null;

  const canvas = document.createElement('canvas');
  canvas.width = scene.width;
  canvas.height = scene.height;
  canvas.className = 'pixel-scene';

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  scene.draw(ctx, scene.width, scene.height);
  return canvas;
}

function getSceneCanvas(sceneId) {
  if (!sceneCache[sceneId]) {
    sceneCache[sceneId] = renderSceneToCanvas(sceneId);
  }

  const src = sceneCache[sceneId];
  if (!src) return null;

  const copy = document.createElement('canvas');
  copy.width = src.width;
  copy.height = src.height;
  copy.className = 'pixel-scene';
  const copyCtx = copy.getContext('2d');
  copyCtx.imageSmoothingEnabled = false;
  copyCtx.drawImage(src, 0, 0);
  return copy;
}
