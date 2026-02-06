// ========================================
// THE BUILDER TRAIL — Tile-Based Pixel Art Scenes
// ========================================
// Uses LimeZu "Modern tiles_Free" sprite sheets
// Tile coords: (col, row) 0-indexed, 16×16px per tile

const TILE_SIZE = 16;
const SCENE_SCALE = 3;

// ── Sprite Sheet Loading ──

const SPRITE_SHEETS = {
  interiors: 'assets/Interiors_free_16x16.png',
  rooms: 'assets/Room_Builder_free_16x16.png'
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

// ── Tile Shorthand ──
// { s: sheetKey, c: col, r: row }

const T = {
  // Room_Builder — Wall surfaces (paired rows: top has crown, bottom has baseboard)
  // Col groups 0-1, 4-5, 7-8 are sub-variants; use col 4-5 for clean mid-wall fill
  WALL_CREAM_T:  { s: 'rooms', c: 4, r: 7 },   // Yellow/cream
  WALL_CREAM_B:  { s: 'rooms', c: 4, r: 8 },
  WALL_WHITE_T:  { s: 'rooms', c: 4, r: 17 },  // White/cream flat
  WALL_WHITE_B:  { s: 'rooms', c: 4, r: 18 },
  WALL_WARM_T:   { s: 'rooms', c: 4, r: 5 },   // Salmon/coral
  WALL_WARM_B:   { s: 'rooms', c: 4, r: 6 },
  WALL_BLUE_T:   { s: 'rooms', c: 4, r: 19 },  // Blue/lavender
  WALL_BLUE_B:   { s: 'rooms', c: 4, r: 20 },
  WALL_DARK_T:   { s: 'rooms', c: 4, r: 15 },  // Dark wood panel
  WALL_DARK_B:   { s: 'rooms', c: 4, r: 16 },
  WALL_MINT_T:   { s: 'rooms', c: 4, r: 11 },  // Mint/teal
  WALL_MINT_B:   { s: 'rooms', c: 4, r: 12 },
  WALL_BEIGE_T:  { s: 'rooms', c: 4, r: 21 },  // Beige/tan
  WALL_BEIGE_B:  { s: 'rooms', c: 4, r: 22 },

  // Room_Builder — Floors (cols 10-16 area, proper floor tiles)
  FLOOR_GRAY:    { s: 'rooms', c: 11, r: 11 },  // Gray smooth
  FLOOR_CREAM:   { s: 'rooms', c: 11, r: 7 },   // Yellow/cream tile
  FLOOR_BLUE:    { s: 'rooms', c: 11, r: 9 },   // Light blue patterned
  FLOOR_HERRING: { s: 'rooms', c: 11, r: 13 },  // Orange herringbone
  FLOOR_STONE:   { s: 'rooms', c: 15, r: 5 },   // Gray stone
  // Wood-look floors (using mid-col wood panel for cleaner tiling)
  FLOOR_WOOD:    { s: 'rooms', c: 5, r: 13 },   // Light wood
  FLOOR_WOOD_D:  { s: 'rooms', c: 5, r: 15 },   // Dark wood
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
// Each scene: 16 wide × 12 tall tiles
// Layers drawn bottom→top: floor fill, wall fill, furniture, character, overlays

const SCENES = {

  'ship': {
    width: 16, height: 12,
    caption: '{name} shipped something real.',
    layers: [
      { type: 'tile-fill', tile: T.FLOOR_WOOD, x: 0, y: 0, w: 16, h: 12 },
      { type: 'tile-fill', tile: T.WALL_WHITE_T, x: 0, y: 0, w: 16, h: 2 },
      { type: 'tile-fill', tile: T.WALL_WHITE_B, x: 0, y: 2, w: 16, h: 2 },
      // Double window on wall
      ...mt('interiors', 0, 26, 2, 2, 7, 1),
      // Bookshelf against wall (2×4)
      ...mt('interiors', 4, 14, 2, 4, 1, 4),
      // Desk with open book (2×2)
      ...mt('interiors', 5, 36, 2, 2, 7, 6),
      // Computer tower
      ...mt('interiors', 12, 40, 1, 2, 9, 6),
      // Chair
      { tile: { s: 'interiors', c: 3, r: 32 }, x: 8, y: 8 },
      // Large potted plant (2×3)
      ...mt('interiors', 10, 44, 2, 3, 13, 5),
      // Character sitting at desk
      { tile: CHAR_SIT, x: 8, y: 7 },
      // Confetti
      { type: 'fill', color: '#3fb950', x: 3, y: 1, w: 1, h: 1 },
      { type: 'fill', color: '#f0883e', x: 12, y: 0, w: 1, h: 1 },
      { type: 'fill', color: '#58a6ff', x: 10, y: 2, w: 1, h: 1 },
      { type: 'fill', color: '#f0883e', x: 5, y: 0, w: 1, h: 1 },
      { type: 'fill', color: '#3fb950', x: 14, y: 3, w: 1, h: 1 },
    ]
  },

  'burnout': {
    width: 16, height: 12,
    caption: '{name} pushed too hard.',
    layers: [
      { type: 'tile-fill', tile: T.FLOOR_WOOD_D, x: 0, y: 0, w: 16, h: 12 },
      { type: 'tile-fill', tile: T.WALL_DARK_T, x: 0, y: 0, w: 16, h: 2 },
      { type: 'tile-fill', tile: T.WALL_DARK_B, x: 0, y: 2, w: 16, h: 2 },
      // Desk
      ...mt('interiors', 5, 36, 2, 2, 6, 6),
      // Chalkboard as dim monitor (2×2)
      ...mt('interiors', 10, 40, 2, 2, 7, 4),
      // Chair
      { tile: { s: 'interiors', c: 4, r: 32 }, x: 7, y: 8 },
      // Character slumped at desk
      { tile: CHAR_SIT, x: 7, y: 7 },
      // Dark overlay
      { type: 'fill', color: 'rgba(0,0,0,0.35)', x: 0, y: 0, w: 16, h: 12 },
      // Dim red glow from screen
      { type: 'fill', color: 'rgba(248,81,73,0.15)', x: 5, y: 4, w: 6, h: 5 },
    ]
  },

  'family': {
    width: 16, height: 12,
    caption: 'Some things matter more than code.',
    layers: [
      { type: 'tile-fill', tile: T.FLOOR_HERRING, x: 0, y: 0, w: 16, h: 12 },
      { type: 'tile-fill', tile: T.WALL_CREAM_T, x: 0, y: 0, w: 16, h: 2 },
      { type: 'tile-fill', tile: T.WALL_CREAM_B, x: 0, y: 2, w: 16, h: 2 },
      // Landscape painting
      ...mt('interiors', 0, 13, 2, 1, 3, 2),
      // Large red/gold rug (4×4)
      ...mt('interiors', 6, 15, 4, 4, 5, 7),
      // Brown couch (3×2)
      ...mt('interiors', 6, 13, 3, 2, 6, 5),
      // Coffee table
      { tile: { s: 'interiors', c: 5, r: 13 }, x: 7, y: 7 },
      // Standing lamp (1×2)
      ...mt('interiors', 11, 52, 1, 2, 1, 5),
      // Large potted plant (2×3)
      ...mt('interiors', 10, 44, 2, 3, 13, 4),
      // Character standing
      { tile: CHAR_IDLE, x: 10, y: 7 },
    ]
  },

  'late-night': {
    width: 16, height: 12,
    caption: '2:47 AM. It works.',
    layers: [
      { type: 'tile-fill', tile: T.FLOOR_GRAY, x: 0, y: 0, w: 16, h: 12 },
      { type: 'tile-fill', tile: T.WALL_BLUE_T, x: 0, y: 0, w: 16, h: 2 },
      { type: 'tile-fill', tile: T.WALL_BLUE_B, x: 0, y: 2, w: 16, h: 2 },
      // Night sky behind window
      { type: 'fill', color: '#0a0a2e', x: 11, y: 1, w: 4, h: 2 },
      // Wide window (4×2)
      ...mt('interiors', 0, 28, 4, 2, 11, 1),
      // Moon
      { type: 'fill', color: '#e6edf3', x: 13, y: 1, w: 1, h: 1 },
      // Desk with book (2×2)
      ...mt('interiors', 5, 36, 2, 2, 5, 6),
      // Computer tower
      ...mt('interiors', 12, 40, 1, 2, 7, 6),
      // Chair
      { tile: { s: 'interiors', c: 3, r: 32 }, x: 6, y: 8 },
      // Character sitting
      { tile: CHAR_SIT, x: 6, y: 7 },
      // Dark overlay
      { type: 'fill', color: 'rgba(0,0,20,0.4)', x: 0, y: 0, w: 16, h: 12 },
      // Monitor glow
      { type: 'fill', color: 'rgba(88,166,255,0.2)', x: 4, y: 5, w: 5, h: 4 },
    ]
  },

  'flow-state': {
    width: 16, height: 12,
    caption: 'Everything clicks.',
    layers: [
      { type: 'tile-fill', tile: T.FLOOR_WOOD, x: 0, y: 0, w: 16, h: 12 },
      { type: 'tile-fill', tile: T.WALL_WHITE_T, x: 0, y: 0, w: 16, h: 2 },
      { type: 'tile-fill', tile: T.WALL_WHITE_B, x: 0, y: 2, w: 16, h: 2 },
      // Bulletin board on wall
      ...mt('interiors', 0, 41, 2, 1, 7, 2),
      // Calendar/schedule board
      ...mt('interiors', 14, 38, 2, 2, 11, 1),
      // Left desk (2×2)
      ...mt('interiors', 5, 36, 2, 2, 2, 6),
      // Left computer tower
      ...mt('interiors', 12, 40, 1, 2, 4, 6),
      // Right desk (2×2)
      ...mt('interiors', 5, 36, 2, 2, 10, 6),
      // Right computer tower
      ...mt('interiors', 12, 40, 1, 2, 12, 6),
      // Left chair
      { tile: { s: 'interiors', c: 3, r: 32 }, x: 3, y: 8 },
      // Right chair
      { tile: { s: 'interiors', c: 3, r: 32 }, x: 11, y: 8 },
      // Large plant between desks (2×3)
      ...mt('interiors', 10, 44, 2, 3, 7, 5),
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
      { type: 'tile-fill', tile: T.FLOOR_CREAM, x: 0, y: 0, w: 16, h: 12 },
      { type: 'tile-fill', tile: T.WALL_WARM_T, x: 0, y: 0, w: 16, h: 2 },
      { type: 'tile-fill', tile: T.WALL_WARM_B, x: 0, y: 2, w: 16, h: 2 },
      // Large window
      ...mt('interiors', 0, 28, 4, 2, 1, 1),
      // Cafe counter (2×2)
      ...mt('interiors', 0, 55, 2, 2, 12, 4),
      // Wood table (3×2)
      ...mt('interiors', 0, 10, 3, 2, 5, 6),
      // Chairs at table
      { tile: { s: 'interiors', c: 3, r: 31 }, x: 5, y: 8 },
      { tile: { s: 'interiors', c: 4, r: 31 }, x: 7, y: 8 },
      // Small potted plant
      { tile: { s: 'interiors', c: 0, r: 49 }, x: 14, y: 7 },
      // Another table (back of shop)
      ...mt('interiors', 0, 10, 3, 2, 9, 8),
      // Character sitting at main table
      { tile: CHAR_SIT, x: 6, y: 7 },
      // Warm cafe glow
      { type: 'fill', color: 'rgba(210,153,34,0.06)', x: 0, y: 0, w: 16, h: 12 },
    ]
  },

  'vacation': {
    width: 16, height: 12,
    caption: 'No laptops allowed.',
    layers: [
      // Sky
      { type: 'fill', color: '#87ceeb', x: 0, y: 0, w: 16, h: 5 },
      // Sun
      { type: 'fill', color: '#f0e68c', x: 12, y: 1, w: 2, h: 2 },
      { type: 'fill', color: '#f0883e', x: 13, y: 2, w: 1, h: 1 },
      // Water
      { type: 'fill', color: '#4a90d9', x: 0, y: 5, w: 16, h: 2 },
      { type: 'fill', color: '#58a6ff', x: 2, y: 5, w: 1, h: 1 },
      { type: 'fill', color: '#58a6ff', x: 8, y: 6, w: 1, h: 1 },
      { type: 'fill', color: '#e6edf3', x: 5, y: 5, w: 1, h: 1 },
      // Sand
      { type: 'fill', color: '#d2c290', x: 0, y: 7, w: 16, h: 5 },
      { type: 'fill', color: '#c2b280', x: 0, y: 7, w: 16, h: 1 },
      // Palm tree (2×3)
      ...mt('interiors', 12, 44, 2, 3, 2, 4),
      // Beach blanket (fill)
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
      // Window
      ...mt('interiors', 0, 26, 2, 2, 7, 1),
      // Bookshelf (2×4)
      ...mt('interiors', 4, 14, 2, 4, 12, 4),
      // Desk with book (2×2)
      ...mt('interiors', 5, 36, 2, 2, 6, 6),
      // Computer tower
      ...mt('interiors', 12, 40, 1, 2, 8, 6),
      // Chair
      { tile: { s: 'interiors', c: 3, r: 32 }, x: 7, y: 8 },
      // Character celebrating
      { tile: CHAR_IDLE, x: 4, y: 7 },
      // Money-green glow
      { type: 'fill', color: 'rgba(63,185,80,0.12)', x: 0, y: 0, w: 16, h: 12 },
      // Gold sparkles
      { type: 'fill', color: '#d29922', x: 3, y: 2, w: 1, h: 1 },
      { type: 'fill', color: '#d29922', x: 11, y: 1, w: 1, h: 1 },
      { type: 'fill', color: '#3fb950', x: 9, y: 3, w: 1, h: 1 },
    ]
  },

  'sunrise': {
    width: 16, height: 12,
    caption: 'Is this what rested feels like?',
    layers: [
      { type: 'tile-fill', tile: T.FLOOR_WOOD, x: 0, y: 0, w: 16, h: 12 },
      { type: 'tile-fill', tile: T.WALL_CREAM_T, x: 0, y: 0, w: 16, h: 2 },
      { type: 'tile-fill', tile: T.WALL_CREAM_B, x: 0, y: 2, w: 16, h: 2 },
      // Sunrise glow behind window
      { type: 'fill', color: '#f0e68c', x: 6, y: 0, w: 5, h: 3 },
      // Wide window (4×2)
      ...mt('interiors', 0, 28, 4, 2, 6, 1),
      // Green bed (3×4)
      ...mt('interiors', 0, 0, 3, 4, 1, 4),
      // Nightstand
      { tile: { s: 'interiors', c: 3, r: 6 }, x: 4, y: 6 },
      // Potted plant (2×3)
      ...mt('interiors', 10, 44, 2, 3, 13, 5),
      // Character (just woke up)
      { tile: CHAR_IDLE, x: 10, y: 7 },
      // Warm morning light
      { type: 'fill', color: 'rgba(240,230,140,0.1)', x: 0, y: 0, w: 16, h: 12 },
    ]
  },

  'ending-builder': {
    width: 16, height: 12,
    caption: 'The Builder.',
    layers: [
      { type: 'tile-fill', tile: T.FLOOR_WOOD, x: 0, y: 0, w: 16, h: 12 },
      { type: 'tile-fill', tile: T.WALL_WHITE_T, x: 0, y: 0, w: 16, h: 2 },
      { type: 'tile-fill', tile: T.WALL_WHITE_B, x: 0, y: 2, w: 16, h: 2 },
      // Paintings on wall
      ...mt('interiors', 0, 13, 2, 1, 2, 2),
      ...mt('interiors', 3, 14, 2, 1, 12, 2),
      // Globe on stand (1×2)
      ...mt('interiors', 14, 36, 1, 2, 10, 5),
      // Bookshelf left (2×4)
      ...mt('interiors', 4, 14, 2, 4, 0, 4),
      // Center desk (2×2)
      ...mt('interiors', 5, 36, 2, 2, 6, 6),
      // Computer tower
      ...mt('interiors', 12, 40, 1, 2, 8, 6),
      // Chair
      { tile: { s: 'interiors', c: 3, r: 32 }, x: 7, y: 8 },
      // Large plant (2×3)
      ...mt('interiors', 10, 44, 2, 3, 13, 5),
      // Palm tree (2×3)
      ...mt('interiors', 12, 44, 2, 3, 3, 5),
      // Standing lamp (1×2)
      ...mt('interiors', 11, 52, 1, 2, 15, 5),
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
  // Character sprite: 1 tile wide × 2 tiles tall (16×32), first frame
  ctx.drawImage(sheet,
    0, 0, TILE_SIZE, TILE_SIZE * 2,
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
