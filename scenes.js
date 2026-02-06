// ========================================
// THE BUILDER TRAIL — Tile-Based Pixel Art Scenes
// ========================================
// Uses LimeZu "Modern tiles_Free" sprite sheets (48×48 variant)
// Tile coords: (col, row) 0-indexed, 48×48px per tile
// Grid: 16 cols × 89 rows (Interiors), 17 cols × 23 rows (Room_Builder)

const TILE_SIZE = 48;
const SCENE_SCALE = 1;

// ── Sprite Sheet Loading ──

const SPRITE_SHEETS = {
  interiors: 'assets/Interiors_free_48x48.png',
  rooms: 'assets/Room_Builder_free_48x48.png'
};

const sheetImages = {};
const sceneCache = {};

function preloadSheets() {
  Object.entries(SPRITE_SHEETS).forEach(([key, src]) => {
    const img = new Image();
    img.src = src;
    sheetImages[key] = img;
  });
}

function loadCharacterTiles(charName) {
  ['idle', 'sit2', 'phone'].forEach(pose => {
    const img = new Image();
    img.src = `assets/${charName}_${pose}_16x16.png`;
    sheetImages['char_' + pose] = img;
  });
  clearSceneCache();
}

function clearSceneCache() {
  for (const k of Object.keys(sceneCache)) delete sceneCache[k];
}

// ── Tile Definitions ──
// Room_Builder walls: paired rows (top=crown, bot=baseboard), col 4 for mid-fill
// Room_Builder floors: cols 11-16 right side

const T = {
  // Walls (col 4, mid-section for clean tiling)
  WALL_SALMON_T:   { s: 'rooms', c: 4, r: 5 },
  WALL_SALMON_B:   { s: 'rooms', c: 4, r: 6 },
  WALL_CREAM_T:    { s: 'rooms', c: 4, r: 7 },
  WALL_CREAM_B:    { s: 'rooms', c: 4, r: 8 },
  WALL_MINT_T:     { s: 'rooms', c: 4, r: 9 },
  WALL_MINT_B:     { s: 'rooms', c: 4, r: 10 },
  WALL_WOOD_T:     { s: 'rooms', c: 4, r: 11 },
  WALL_WOOD_B:     { s: 'rooms', c: 4, r: 12 },
  WALL_LWOOD_T:    { s: 'rooms', c: 4, r: 13 },
  WALL_LWOOD_B:    { s: 'rooms', c: 4, r: 14 },
  WALL_ORANGE_T:   { s: 'rooms', c: 4, r: 15 },
  WALL_ORANGE_B:   { s: 'rooms', c: 4, r: 16 },
  WALL_BLUEGRAY_T: { s: 'rooms', c: 4, r: 17 },
  WALL_BLUEGRAY_B: { s: 'rooms', c: 4, r: 18 },
  WALL_DKBLUE_T:   { s: 'rooms', c: 4, r: 19 },
  WALL_DKBLUE_B:   { s: 'rooms', c: 4, r: 20 },
  WALL_BEIGE_T:    { s: 'rooms', c: 4, r: 21 },
  WALL_BEIGE_B:    { s: 'rooms', c: 4, r: 22 },

  // Floors (right side of Room_Builder)
  FLOOR_RED:      { s: 'rooms', c: 11, r: 5 },
  FLOOR_YELLOW:   { s: 'rooms', c: 11, r: 7 },
  FLOOR_CYAN:     { s: 'rooms', c: 11, r: 9 },
  FLOOR_GRAY:     { s: 'rooms', c: 11, r: 11 },
  FLOOR_HERRING:  { s: 'rooms', c: 11, r: 13 },
};

// Character sentinels
const CHAR_SIT = '__CHARACTER_SIT__';
const CHAR_IDLE = '__CHARACTER_IDLE__';

// Helper: multi-tile layer entries from a sheet region
function mt(sheet, sc, sr, w, h, dx, dy) {
  const out = [];
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      out.push({ tile: { s: sheet, c: sc + x, r: sr + y }, x: dx + x, y: dy + y });
  return out;
}

// ── Scene Definitions ──
// Layout: 16 wide × 12 tall tiles
// Rows 0-1: top wall | Rows 2-3: bottom wall | Rows 4-11: floor + furniture

const SCENES = {

  'ship': {
    width: 16, height: 12,
    caption: '{name} shipped something real.',
    layers: [
      { type: 'tile-fill', tile: T.FLOOR_YELLOW, x: 0, y: 0, w: 16, h: 12 },
      { type: 'tile-fill', tile: T.WALL_BLUEGRAY_T, x: 0, y: 0, w: 16, h: 2 },
      { type: 'tile-fill', tile: T.WALL_BLUEGRAY_B, x: 0, y: 2, w: 16, h: 2 },
      // Curtained window on wall
      ...mt('interiors', 4, 24, 2, 2, 3, 2),
      // Red 4-pane window on wall
      ...mt('interiors', 7, 24, 2, 2, 10, 2),
      // Colorful bookshelf against wall (2×2)
      ...mt('interiors', 5, 14, 2, 2, 13, 4),
      // Wide table as desk (2×2)
      ...mt('interiors', 5, 10, 2, 2, 6, 6),
      // Computer tower beside desk (1×2)
      ...mt('interiors', 12, 40, 1, 2, 8, 6),
      // Green bushy plant (2×2)
      ...mt('interiors', 10, 44, 2, 2, 1, 5),
      // Character sitting at desk
      { tile: CHAR_SIT, x: 7, y: 7 },
      // Subtle celebratory glow
      { type: 'fill', color: 'rgba(63,185,80,0.08)', x: 0, y: 0, w: 16, h: 12 },
    ]
  },

  'burnout': {
    width: 16, height: 12,
    caption: '{name} pushed too hard.',
    layers: [
      { type: 'tile-fill', tile: T.FLOOR_GRAY, x: 0, y: 0, w: 16, h: 12 },
      { type: 'tile-fill', tile: T.WALL_WOOD_T, x: 0, y: 0, w: 16, h: 2 },
      { type: 'tile-fill', tile: T.WALL_WOOD_B, x: 0, y: 2, w: 16, h: 2 },
      // Flat screen TV on wall
      { tile: { s: 'interiors', c: 0, r: 14 }, x: 7, y: 3 },
      // Desk (2×2)
      ...mt('interiors', 5, 10, 2, 2, 6, 6),
      // Computer tower (1×2)
      ...mt('interiors', 12, 40, 1, 2, 8, 6),
      // Character slumped at desk
      { tile: CHAR_SIT, x: 7, y: 7 },
      // Dark overlay — exhaustion
      { type: 'fill', color: 'rgba(0,0,0,0.4)', x: 0, y: 0, w: 16, h: 12 },
      // Dim red glow from screen
      { type: 'fill', color: 'rgba(248,81,73,0.15)', x: 5, y: 5, w: 6, h: 5 },
    ]
  },

  'family': {
    width: 16, height: 12,
    caption: 'Some things matter more than code.',
    layers: [
      { type: 'tile-fill', tile: T.FLOOR_HERRING, x: 0, y: 0, w: 16, h: 12 },
      { type: 'tile-fill', tile: T.WALL_CREAM_T, x: 0, y: 0, w: 16, h: 2 },
      { type: 'tile-fill', tile: T.WALL_CREAM_B, x: 0, y: 2, w: 16, h: 2 },
      // Landscape painting on wall
      { tile: { s: 'interiors', c: 0, r: 12 }, x: 3, y: 3 },
      // Large framed painting on wall (2×2)
      ...mt('interiors', 7, 28, 2, 2, 11, 2),
      // Red/gold rug on floor (3×2)
      ...mt('interiors', 7, 16, 3, 2, 5, 8),
      // Orange couch (2×2)
      ...mt('interiors', 7, 12, 2, 2, 6, 6),
      // Green bushy plant (2×2)
      ...mt('interiors', 10, 44, 2, 2, 13, 4),
      // Small brown table (2×2)
      ...mt('interiors', 0, 10, 2, 2, 2, 7),
      // Character standing
      { tile: CHAR_IDLE, x: 10, y: 7 },
    ]
  },

  'late-night': {
    width: 16, height: 12,
    caption: '2:47 AM. It works.',
    layers: [
      { type: 'tile-fill', tile: T.FLOOR_GRAY, x: 0, y: 0, w: 16, h: 12 },
      { type: 'tile-fill', tile: T.WALL_DKBLUE_T, x: 0, y: 0, w: 16, h: 2 },
      { type: 'tile-fill', tile: T.WALL_DKBLUE_B, x: 0, y: 2, w: 16, h: 2 },
      // Night sky behind window
      { type: 'fill', color: '#0a0a2e', x: 10, y: 1, w: 4, h: 3 },
      // Large modern window (3×2)
      ...mt('interiors', 0, 28, 3, 2, 10, 2),
      // Moon glow in window
      { type: 'fill', color: '#e6edf3', x: 12, y: 1, w: 1, h: 1 },
      // Colorful bookshelf (2×2)
      ...mt('interiors', 5, 14, 2, 2, 1, 4),
      // Desk (2×2)
      ...mt('interiors', 5, 10, 2, 2, 5, 6),
      // Computer tower (1×2)
      ...mt('interiors', 12, 40, 1, 2, 7, 6),
      // Character sitting at desk
      { tile: CHAR_SIT, x: 6, y: 7 },
      // Dark night overlay
      { type: 'fill', color: 'rgba(0,0,20,0.45)', x: 0, y: 0, w: 16, h: 12 },
      // Monitor glow
      { type: 'fill', color: 'rgba(88,166,255,0.2)', x: 4, y: 5, w: 5, h: 5 },
    ]
  },

  'flow-state': {
    width: 16, height: 12,
    caption: 'Everything clicks.',
    layers: [
      { type: 'tile-fill', tile: T.FLOOR_YELLOW, x: 0, y: 0, w: 16, h: 12 },
      { type: 'tile-fill', tile: T.WALL_BLUEGRAY_T, x: 0, y: 0, w: 16, h: 2 },
      { type: 'tile-fill', tile: T.WALL_BLUEGRAY_B, x: 0, y: 2, w: 16, h: 2 },
      // Green chalkboard on wall (2×2)
      ...mt('interiors', 7, 35, 2, 2, 7, 2),
      // Frosted window on wall (2×2)
      ...mt('interiors', 9, 24, 2, 2, 12, 2),
      // Left desk (2×2)
      ...mt('interiors', 5, 10, 2, 2, 2, 6),
      // Left computer tower
      ...mt('interiors', 12, 40, 1, 2, 4, 6),
      // Right desk (2×2)
      ...mt('interiors', 5, 10, 2, 2, 10, 6),
      // Right computer tower
      ...mt('interiors', 12, 40, 1, 2, 12, 6),
      // Green plant between desks (2×2)
      ...mt('interiors', 10, 44, 2, 2, 7, 5),
      // Character at right desk
      { tile: CHAR_SIT, x: 11, y: 7 },
      // Subtle green glow
      { type: 'fill', color: 'rgba(63,185,80,0.08)', x: 0, y: 0, w: 16, h: 12 },
    ]
  },

  'coffee-shop': {
    width: 16, height: 12,
    caption: 'The perfect Saturday morning.',
    layers: [
      { type: 'tile-fill', tile: T.FLOOR_YELLOW, x: 0, y: 0, w: 16, h: 12 },
      { type: 'tile-fill', tile: T.WALL_SALMON_T, x: 0, y: 0, w: 16, h: 2 },
      { type: 'tile-fill', tile: T.WALL_SALMON_B, x: 0, y: 2, w: 16, h: 2 },
      // Curtained window (2×2)
      ...mt('interiors', 4, 24, 2, 2, 1, 2),
      // Red 4-pane window (2×2)
      ...mt('interiors', 7, 24, 2, 2, 5, 2),
      // Cabinet with windows (2×2) — looks like a counter
      ...mt('interiors', 11, 24, 2, 2, 12, 4),
      // Wide table — main seating (3×2)
      ...mt('interiors', 7, 10, 3, 2, 5, 7),
      // Small brown table — back (2×2)
      ...mt('interiors', 0, 10, 2, 2, 11, 8),
      // Character sitting at table
      { tile: CHAR_SIT, x: 6, y: 9 },
      // Warm cafe glow
      { type: 'fill', color: 'rgba(210,153,34,0.06)', x: 0, y: 0, w: 16, h: 12 },
    ]
  },

  'vacation': {
    width: 16, height: 12,
    caption: 'No laptops allowed.',
    layers: [
      // Sky gradient
      { type: 'fill', color: '#7ec8e3', x: 0, y: 0, w: 16, h: 3 },
      { type: 'fill', color: '#87ceeb', x: 0, y: 3, w: 16, h: 2 },
      // Sun
      { type: 'fill', color: '#f0e68c', x: 12, y: 1, w: 2, h: 2 },
      // Water
      { type: 'fill', color: '#4a90d9', x: 0, y: 5, w: 16, h: 2 },
      { type: 'fill', color: '#58a6ff', x: 2, y: 5, w: 2, h: 1 },
      { type: 'fill', color: '#3d7fc2', x: 8, y: 6, w: 3, h: 1 },
      // Sand
      { type: 'fill', color: '#d2c290', x: 0, y: 7, w: 16, h: 5 },
      { type: 'fill', color: '#c2b280', x: 0, y: 7, w: 16, h: 1 },
      // Palm tree (2×2)
      ...mt('interiors', 12, 44, 2, 2, 2, 6),
      // Beach blanket
      { type: 'fill', color: '#f85149', x: 9, y: 9, w: 3, h: 1 },
      { type: 'fill', color: '#58a6ff', x: 9, y: 10, w: 3, h: 1 },
      // Character on beach
      { tile: CHAR_IDLE, x: 7, y: 8 },
    ]
  },

  'payday': {
    width: 16, height: 12,
    caption: '{name}\'s first dollar.',
    layers: [
      { type: 'tile-fill', tile: T.FLOOR_GRAY, x: 0, y: 0, w: 16, h: 12 },
      { type: 'tile-fill', tile: T.WALL_MINT_T, x: 0, y: 0, w: 16, h: 2 },
      { type: 'tile-fill', tile: T.WALL_MINT_B, x: 0, y: 2, w: 16, h: 2 },
      // Red 4-pane window on wall (2×2)
      ...mt('interiors', 7, 24, 2, 2, 7, 2),
      // Colorful bookshelf (2×2)
      ...mt('interiors', 5, 14, 2, 2, 12, 4),
      // Globe on stand (1×2)
      ...mt('interiors', 14, 35, 1, 2, 2, 5),
      // Desk (2×2)
      ...mt('interiors', 5, 10, 2, 2, 6, 6),
      // Computer tower (1×2)
      ...mt('interiors', 12, 40, 1, 2, 8, 6),
      // Character celebrating (standing)
      { tile: CHAR_IDLE, x: 4, y: 8 },
      // Money-green glow
      { type: 'fill', color: 'rgba(63,185,80,0.1)', x: 0, y: 0, w: 16, h: 12 },
    ]
  },

  'sunrise': {
    width: 16, height: 12,
    caption: 'Is this what rested feels like?',
    layers: [
      { type: 'tile-fill', tile: T.FLOOR_YELLOW, x: 0, y: 0, w: 16, h: 12 },
      { type: 'tile-fill', tile: T.WALL_CREAM_T, x: 0, y: 0, w: 16, h: 2 },
      { type: 'tile-fill', tile: T.WALL_CREAM_B, x: 0, y: 2, w: 16, h: 2 },
      // Sunrise glow behind window
      { type: 'fill', color: '#f0e68c', x: 6, y: 0, w: 5, h: 4 },
      // Large modern window (3×2)
      ...mt('interiors', 0, 28, 3, 2, 6, 2),
      // Green bed (3×4)
      ...mt('interiors', 0, 0, 3, 4, 1, 4),
      // Nightstand with lamp (1×2)
      ...mt('interiors', 3, 3, 1, 2, 4, 6),
      // Green bushy plant (2×2)
      ...mt('interiors', 10, 44, 2, 2, 13, 5),
      // Character just woke up (standing)
      { tile: CHAR_IDLE, x: 10, y: 7 },
      // Warm morning light
      { type: 'fill', color: 'rgba(240,230,140,0.1)', x: 0, y: 0, w: 16, h: 12 },
    ]
  },

  'ending-builder': {
    width: 16, height: 12,
    caption: 'The Builder.',
    layers: [
      { type: 'tile-fill', tile: T.FLOOR_HERRING, x: 0, y: 0, w: 16, h: 12 },
      { type: 'tile-fill', tile: T.WALL_BLUEGRAY_T, x: 0, y: 0, w: 16, h: 2 },
      { type: 'tile-fill', tile: T.WALL_BLUEGRAY_B, x: 0, y: 2, w: 16, h: 2 },
      // Large framed painting (2×2)
      ...mt('interiors', 7, 28, 2, 2, 2, 2),
      // Curtained window (2×2)
      ...mt('interiors', 4, 24, 2, 2, 7, 2),
      // Red 4-pane window (2×2)
      ...mt('interiors', 7, 24, 2, 2, 12, 2),
      // Wide bookshelf against wall (3×2)
      ...mt('interiors', 7, 14, 3, 2, 0, 4),
      // Globe on stand (1×2)
      ...mt('interiors', 14, 35, 1, 2, 5, 5),
      // Desk (2×2)
      ...mt('interiors', 5, 10, 2, 2, 7, 6),
      // Computer tower (1×2)
      ...mt('interiors', 12, 40, 1, 2, 9, 6),
      // Palm tree (2×2)
      ...mt('interiors', 12, 44, 2, 2, 13, 5),
      // Green plant (2×2)
      ...mt('interiors', 10, 44, 2, 2, 14, 8),
      // Character (triumphant)
      { tile: CHAR_IDLE, x: 5, y: 7 },
      // Golden glow
      { type: 'fill', color: 'rgba(210,153,34,0.08)', x: 0, y: 0, w: 16, h: 12 },
    ]
  }
};

// ── Rendering Engine ──

function drawTile(ctx, tile, x, y) {
  if (typeof tile === 'string' && tile.startsWith('__CHARACTER_')) {
    drawCharacterTile(ctx, tile, x, y);
    return;
  }
  const sheet = sheetImages[tile.s];
  if (!sheet || !sheet.complete) return;
  ctx.drawImage(sheet,
    tile.c * TILE_SIZE, tile.r * TILE_SIZE, TILE_SIZE, TILE_SIZE,
    x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE
  );
}

function drawCharacterTile(ctx, token, x, y) {
  const poseMap = {
    '__CHARACTER_SIT__': 'char_sit2',
    '__CHARACTER_IDLE__': 'char_idle',
    '__CHARACTER_PHONE__': 'char_phone',
  };
  const sheet = sheetImages[poseMap[token]];
  if (!sheet || !sheet.complete) return;
  // Character sprites are 16×32px, scale 3x to fill 48×96 (1×2 tiles)
  ctx.drawImage(sheet,
    0, 0, 16, 32,
    x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE * 2
  );
}

function drawTileFill(ctx, tile, x, y, w, h) {
  for (let ty = y; ty < y + h; ty++)
    for (let tx = x; tx < x + w; tx++)
      drawTile(ctx, tile, tx, ty);
}

function renderSceneToCanvas(sceneId) {
  const scene = SCENES[sceneId];
  if (!scene) return null;

  const canvas = document.createElement('canvas');
  canvas.width = scene.width * TILE_SIZE;
  canvas.height = scene.height * TILE_SIZE;
  canvas.className = 'pixel-scene';

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  for (const layer of scene.layers) {
    if (layer.type === 'fill') {
      ctx.fillStyle = layer.color;
      ctx.fillRect(
        layer.x * TILE_SIZE, layer.y * TILE_SIZE,
        layer.w * TILE_SIZE, layer.h * TILE_SIZE
      );
    } else if (layer.type === 'tile-fill') {
      drawTileFill(ctx, layer.tile, layer.x, layer.y, layer.w, layer.h);
    } else if (layer.tile) {
      drawTile(ctx, layer.tile, layer.x, layer.y);
    }
  }

  return canvas;
}

function getSceneCanvas(sceneId) {
  if (!sceneCache[sceneId]) {
    sceneCache[sceneId] = renderSceneToCanvas(sceneId);
  }
  const src = sceneCache[sceneId];
  if (!src) return null;

  // Canvas cloneNode doesn't preserve content — draw copy
  const copy = document.createElement('canvas');
  copy.width = src.width;
  copy.height = src.height;
  copy.className = 'pixel-scene';
  const copyCtx = copy.getContext('2d');
  copyCtx.imageSmoothingEnabled = false;
  copyCtx.drawImage(src, 0, 0);
  return copy;
}
