// ========================================
// THE BUILDER TRAIL — Iconic Scene Art
// ========================================
// Each scene: dark background + one centered pixel art icon
// No tilesheets — everything drawn programmatically

const TILE_SIZE = 1;     // pixel-based (kept for API compat)
const SCENE_SCALE = 1;

const SCENE_W = 480;
const SCENE_H = 320;

// ── Stubs for API compatibility (game.js calls these) ──

const sheetImages = {};
const sceneCache = {};

function preloadSheets() {}
function loadCharacterTiles() { clearSceneCache(); }
function clearSceneCache() {
  for (const k of Object.keys(sceneCache)) delete sceneCache[k];
}

// ── Drawing Helpers ──

function drawPixels(ctx, grid, palette, cx, cy, px) {
  const rows = grid.length, cols = grid[0].length;
  const ox = Math.round(cx - cols * px / 2);
  const oy = Math.round(cy - rows * px / 2);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const ch = grid[r][c];
      if (ch === '.') continue;
      ctx.fillStyle = palette[ch];
      ctx.fillRect(ox + c * px, oy + r * px, px, px);
    }
  }
}

function glow(ctx, x, y, radius, color) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
  g.addColorStop(0, color);
  g.addColorStop(1, 'transparent');
  ctx.fillStyle = g;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

// ── Scene Definitions ──

const SCENES = {

  'ship': {
    width: SCENE_W, height: SCENE_H,
    caption: 'You shipped something real.',
    draw(ctx, w, h) {
      ctx.fillStyle = '#0a192f';
      ctx.fillRect(0, 0, w, h);
      glow(ctx, w / 2, h * 0.5, 180, 'rgba(63,185,80,0.18)');

      drawPixels(ctx, [
        '....WW....',
        '...WWWW...',
        '...WWWW...',
        '..WWWWWW..',
        '..WCCCWW..',
        '..WCCCWW..',
        '..WWWWWW..',
        '.WWWWWWWW.',
        '.WWWWWWWW.',
        'RWWWWWWWWR',
        'RR.WWWW.RR',
        '....OO....',
        '...OOYY...',
        '....YY....',
      ], {
        W: '#e6edf3', C: '#58a6ff', R: '#f85149',
        O: '#f0883e', Y: '#d29922'
      }, w / 2, h * 0.42, 14);

      ctx.fillStyle = 'rgba(230,237,243,0.35)';
      [[80, 50], [400, 35], [55, 200], [425, 175], [150, 275],
       [350, 260], [200, 28], [310, 285], [440, 90], [30, 130]].forEach(([sx, sy]) => {
        ctx.fillRect(sx, sy, 3, 3);
      });
    }
  },

  'late-night': {
    width: SCENE_W, height: SCENE_H,
    caption: '2:47 AM. It works.',
    draw(ctx, w, h) {
      ctx.fillStyle = '#070b1a';
      ctx.fillRect(0, 0, w, h);
      glow(ctx, w * 0.62, h * 0.35, 180, 'rgba(240,230,140,0.06)');

      drawPixels(ctx, [
        '..YYY....',
        '.YYYYY...',
        'YYYYY....',
        'YYYY.....',
        'YYYY.....',
        'YYYY.....',
        'YYYY.....',
        'YYYYY....',
        '.YYYYY...',
        '..YYY....',
      ], { Y: '#f0e68c' }, w * 0.62, h * 0.35, 16);

      ctx.fillStyle = '#e6edf3';
      [[60, 40], [120, 100], [400, 55], [200, 50], [100, 220],
       [350, 150], [440, 240], [80, 165], [300, 30], [175, 270],
       [420, 120], [260, 280], [35, 275], [455, 50]].forEach(([sx, sy]) => {
        ctx.fillRect(sx, sy, 3, 3);
      });
      ctx.fillStyle = '#58a6ff';
      [[150, 80], [380, 200], [50, 260], [330, 45]].forEach(([sx, sy]) => {
        ctx.fillRect(sx, sy, 4, 4);
      });

      glow(ctx, w * 0.35, h * 0.85, 100, 'rgba(88,166,255,0.12)');
    }
  },

  'family': {
    width: SCENE_W, height: SCENE_H,
    caption: 'Some things matter more than code.',
    draw(ctx, w, h) {
      ctx.fillStyle = '#1a0f08';
      ctx.fillRect(0, 0, w, h);
      glow(ctx, w / 2, h * 0.42, 200, 'rgba(248,81,73,0.12)');

      drawPixels(ctx, [
        '..RRR...RRR..',
        '.RRRRR.RRRRR.',
        'RRRRRRRRRRRRR',
        'RRRRRRRRRRRRR',
        'RRRRRRRRRRRRR',
        '.RRRRRRRRRRR.',
        '..RRRRRRRRR..',
        '...RRRRRRR...',
        '....RRRRR....',
        '.....RRR.....',
        '......R......',
      ], { R: '#f85149' }, w / 2, h * 0.42, 16);

      ctx.fillStyle = 'rgba(248,81,73,0.25)';
      [[100, 80], [380, 95], [75, 250], [405, 230],
       [200, 275], [320, 55]].forEach(([sx, sy]) => {
        ctx.fillRect(sx, sy, 4, 4);
      });
    }
  },

  'flow-state': {
    width: SCENE_W, height: SCENE_H,
    caption: 'Everything clicks.',
    draw(ctx, w, h) {
      ctx.fillStyle = '#0b1628';
      ctx.fillRect(0, 0, w, h);
      glow(ctx, w / 2, h * 0.45, 180, 'rgba(210,153,34,0.15)');

      drawPixels(ctx, [
        '....YYYYY',
        '...YYYYY.',
        '..YYYYY..',
        '.YYYYY...',
        'YYYYYYYYY',
        '.YYYYYYYY',
        '.....YYYY',
        '....YYYY.',
        '...YYYY..',
        '..YYYY...',
        '.YYYY....',
        'YYYY.....',
      ], { Y: '#f0e68c' }, w / 2, h * 0.42, 14);

      ctx.fillStyle = '#58a6ff';
      [[175, 95], [305, 85], [145, 225], [345, 200],
       [205, 270], [280, 50], [400, 145], [85, 155]].forEach(([sx, sy]) => {
        ctx.fillRect(sx, sy, 3, 3);
      });
    }
  },

  'coffee-shop': {
    width: SCENE_W, height: SCENE_H,
    caption: 'The perfect Saturday morning.',
    draw(ctx, w, h) {
      ctx.fillStyle = '#1a0f08';
      ctx.fillRect(0, 0, w, h);
      glow(ctx, w / 2, h * 0.5, 180, 'rgba(210,153,34,0.12)');

      drawPixels(ctx, [
        '..S..S..S..',
        '...........',
        '.BBBBBBBBB.',
        '.BBBBBBBBBH',
        '.BBBBBBBBBH',
        '.BBBBBBBBBH',
        '.BBBBBBBBB.',
        '..BBBBBBB..',
        '...........',
        'PPPPPPPPPPP',
        '.PPPPPPPPP.',
      ], {
        S: 'rgba(230,237,243,0.5)',
        B: '#6e4b2a', H: '#5a3d22', P: '#8b949e'
      }, w / 2, h * 0.42, 16);
    }
  },

  'vacation': {
    width: SCENE_W, height: SCENE_H,
    caption: 'No laptops allowed.',
    draw(ctx, w, h) {
      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, h * 0.5);
      sky.addColorStop(0, '#4a90d9');
      sky.addColorStop(1, '#87ceeb');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h * 0.5);

      // Sun
      glow(ctx, w * 0.78, h * 0.15, 60, 'rgba(240,230,140,0.5)');
      ctx.fillStyle = '#f0e68c';
      ctx.fillRect(w * 0.78 - 18, h * 0.15 - 18, 36, 36);

      // Water
      ctx.fillStyle = '#3d7fc2';
      ctx.fillRect(0, h * 0.5, w, h * 0.12);
      ctx.fillStyle = '#58a6ff';
      for (let x = 0; x < w; x += 55) {
        ctx.fillRect(x + 10, h * 0.52, 28, 3);
      }

      // Sand
      ctx.fillStyle = '#d2c290';
      ctx.fillRect(0, h * 0.62, w, h * 0.38);
      ctx.fillStyle = '#c2b280';
      ctx.fillRect(0, h * 0.62, w, 5);

      // Palm tree
      drawPixels(ctx, [
        '.GGGGG.',
        'GGGGGGG',
        'GG.G.GG',
        '...B...',
        '...B...',
        '...B...',
        '...B...',
        '...B...',
      ], { G: '#2ea043', B: '#6e4b2a' }, w * 0.3, h * 0.58, 14);

      // Second palm tree (smaller, farther)
      drawPixels(ctx, [
        '.GGG.',
        'GGGGG',
        'G.G.G',
        '..B..',
        '..B..',
        '..B..',
        '..B..',
      ], { G: '#2ea043', B: '#6e4b2a' }, w * 0.72, h * 0.52, 10);
    }
  },

  'payday': {
    width: SCENE_W, height: SCENE_H,
    caption: 'Your first dollar.',
    draw(ctx, w, h) {
      ctx.fillStyle = '#081a0a';
      ctx.fillRect(0, 0, w, h);
      glow(ctx, w / 2, h * 0.45, 200, 'rgba(210,153,34,0.18)');

      drawPixels(ctx, [
        '...GGGGG...',
        '..GGGGGGG..',
        '.GGGGGGGGG.',
        '.GGGGGGGGG.',
        'GGGGGGGGGGG',
        'GGGGGGGGGGG',
        'GGGGGGGGGGG',
        '.GGGGGGGGG.',
        '.GGGGGGGGG.',
        '..GGGGGGG..',
        '...GGGGG...',
      ], { G: '#d29922' }, w / 2, h * 0.42, 16);

      // Inner highlight
      glow(ctx, w / 2, h * 0.42, 50, 'rgba(240,230,140,0.25)');

      ctx.fillStyle = '#f0e68c';
      [[180, 95], [315, 80], [145, 240], [365, 220],
       [240, 55], [275, 270], [100, 160], [395, 135]].forEach(([sx, sy]) => {
        ctx.fillRect(sx, sy, 5, 5);
      });
    }
  },

  'sunrise': {
    width: SCENE_W, height: SCENE_H,
    caption: 'Is this what rested feels like?',
    draw(ctx, w, h) {
      // Sky gradient: deep purple → warm orange
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#1a0a2e');
      grad.addColorStop(0.4, '#3d1f5c');
      grad.addColorStop(0.65, '#c46b3a');
      grad.addColorStop(1, '#f0883e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Sun semicircle at horizon
      const sunY = h * 0.62;
      glow(ctx, w / 2, sunY, 150, 'rgba(240,230,140,0.25)');
      ctx.fillStyle = '#f0e68c';
      const sunR = 55;
      for (let dy = 0; dy <= sunR; dy += 3) {
        const dx = Math.round(Math.sqrt(sunR * sunR - dy * dy));
        ctx.fillRect(w / 2 - dx, sunY - dy, dx * 2, 3);
      }

      // Horizon line
      ctx.fillStyle = 'rgba(240,230,140,0.2)';
      ctx.fillRect(0, sunY, w, 2);

      // Rays
      ctx.fillStyle = 'rgba(240,230,140,0.06)';
      ctx.fillRect(w / 2 - 2, h * 0.15, 4, h * 0.47);
      ctx.fillRect(w / 2 - 80, sunY - 2, 160, 4);
      // Diagonal rays
      ctx.save();
      ctx.translate(w / 2, sunY);
      [30, -30, 60, -60].forEach(deg => {
        ctx.save();
        ctx.rotate(deg * Math.PI / 180);
        ctx.fillRect(-2, -120, 4, 120);
        ctx.restore();
      });
      ctx.restore();
    }
  },

  'burnout': {
    width: SCENE_W, height: SCENE_H,
    caption: 'You pushed too hard.',
    draw(ctx, w, h) {
      ctx.fillStyle = '#0d0d0d';
      ctx.fillRect(0, 0, w, h);
      glow(ctx, w / 2, h * 0.45, 120, 'rgba(248,81,73,0.08)');

      drawPixels(ctx, [
        '.....DD.....',
        'DDDDDDDDDDDD',
        'DD........DD',
        'DD........DD',
        'DD.RR.....DD',
        'DD.RR.....DD',
        'DD........DD',
        'DD........DD',
        'DDDDDDDDDDDD',
      ], { D: '#484f58', R: '#f85149' }, w / 2, h * 0.42, 16);

      // Dim red warning tint
      ctx.fillStyle = 'rgba(248,81,73,0.04)';
      ctx.fillRect(0, 0, w, h);
    }
  },

  'ending-builder': {
    width: SCENE_W, height: SCENE_H,
    caption: 'The Builder.',
    draw(ctx, w, h) {
      ctx.fillStyle = '#1a1508';
      ctx.fillRect(0, 0, w, h);
      glow(ctx, w / 2, h * 0.42, 200, 'rgba(210,153,34,0.2)');

      drawPixels(ctx, [
        'H.GGGGGGG.H',
        'HH.GGGGG.HH',
        'HH.GGGGG.HH',
        '.GGGGGGGGG.',
        '.GGGGGGGGG.',
        '..GGGGGGG..',
        '...GGGGG...',
        '....GGG....',
        '....GGG....',
        '...GGGGG...',
        '..GGGGGGG..',
        '.GGGGGGGGG.',
      ], { G: '#d29922', H: '#b08018' }, w / 2, h * 0.40, 14);

      ctx.fillStyle = '#f0e68c';
      [[140, 65], [350, 55], [95, 220], [405, 200], [230, 45],
       [275, 275], [175, 270], [345, 260]].forEach(([sx, sy]) => {
        ctx.fillRect(sx, sy, 5, 5);
      });
      ctx.fillStyle = '#e6edf3';
      [[200, 90], [310, 115], [155, 190], [385, 155]].forEach(([sx, sy]) => {
        ctx.fillRect(sx, sy, 3, 3);
      });
    }
  }
};

// ── Rendering Engine ──

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
