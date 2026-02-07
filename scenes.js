// ========================================
// THE BUILDER TRAIL — Tile-Based Pixel Art Scenes
// ========================================
// Uses LimeZu "Modern tiles_Free" sprite sheets (48×48 variant)
// Tile coords: (col, row) 0-indexed, 48×48px per tile

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
// Room_Builder walls: paired rows (top=crown, bot=baseboard)
// Use col 5 for smooth mid-fill (col 4 has seam edges that create bars)

const T = {
  // Walls (col 5 — seamless fill)
  WALL_SALMON_T:   { s: 'rooms', c: 5, r: 5 },
  WALL_SALMON_B:   { s: 'rooms', c: 5, r: 6 },
  WALL_CREAM_T:    { s: 'rooms', c: 5, r: 7 },
  WALL_CREAM_B:    { s: 'rooms', c: 5, r: 8 },
  WALL_MINT_T:     { s: 'rooms', c: 5, r: 9 },
  WALL_MINT_B:     { s: 'rooms', c: 5, r: 10 },
  WALL_WOOD_T:     { s: 'rooms', c: 5, r: 11 },
  WALL_WOOD_B:     { s: 'rooms', c: 5, r: 12 },
  WALL_BLUEGRAY_T: { s: 'rooms', c: 5, r: 17 },
  WALL_BLUEGRAY_B: { s: 'rooms', c: 5, r: 18 },
  WALL_DKBLUE_T:   { s: 'rooms', c: 5, r: 19 },
  WALL_DKBLUE_B:   { s: 'rooms', c: 5, r: 20 },

  // Floors (right side of Room_Builder)
  FLOOR_YELLOW:   { s: 'rooms', c: 11, r: 7 },
  FLOOR_GRAY:     { s: 'rooms', c: 11, r: 11 },
  FLOOR_HERRING:  { s: 'rooms', c: 11, r: 13 },
};

// Character sentinels
const CHAR_SIT = '__CHARACTER_SIT__';
const CHAR_IDLE = '__CHARACTER_IDLE__';

// Helper: multi-tile layer entries
function mt(sheet, sc, sr, w, h, dx, dy) {
  const out = [];
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      out.push({ tile: { s: sheet, c: sc + x, r: sr + y }, x: dx + x, y: dy + y });
  return out;
}

// Shorthand for single interiors tile
function it(c, r, x, y) {
  return { tile: { s: 'interiors', c, r }, x, y };
}

// ── Scene Definitions ──
// 16 wide × 12 tall | Rows 0-1: wall top | Rows 2-3: wall bottom | Rows 4-11: floor

const SCENES = {

  'ship': {
    width: 16, height: 12,
    caption: '{name} shipped something real.',
    layers: [
      { type: 'tile-fill', tile: T.FLOOR_YELLOW, x: 0, y: 0, w: 16, h: 12 },
      { type: 'tile-fill', tile: T.WALL_BLUEGRAY_T, x: 0, y: 0, w: 16, h: 2 },
      { type: 'tile-fill', tile: T.WALL_BLUEGRAY_B, x: 0, y: 2, w: 16, h: 2 },
      // Wall decorations
      ...mt('interiors', 4, 24, 2, 2, 2, 2),    // curtain window
      ...mt('interiors', 7, 24, 2, 2, 7, 2),     // red 4-pane window
      ...mt('interiors', 9, 66, 2, 2, 12, 2),    // world map
      it(1, 70, 5, 3),                            // small painting
      // Furniture against wall
      ...mt('interiors', 5, 14, 2, 2, 0, 4),     // colorful bookshelf
      ...mt('interiors', 12, 68, 2, 2, 14, 4),   // brown bookshelf
      ...mt('interiors', 10, 44, 2, 2, 11, 5),   // green plant
      ...mt('interiors', 14, 35, 1, 2, 4, 5),    // globe
      it(0, 66, 3, 6),                            // small pot
      // Desk area
      ...mt('interiors', 5, 35, 2, 2, 6, 6),     // desk with book
      ...mt('interiors', 12, 40, 1, 2, 8, 6),    // computer tower
      // Character sitting at desk
      { tile: CHAR_SIT, x: 7, y: 7 },
      // Celebration glow
      { type: 'fill', color: 'rgba(63,185,80,0.07)', x: 0, y: 0, w: 16, h: 12 },
    ]
  },

  'burnout': {
    width: 16, height: 12,
    caption: '{name} pushed too hard.',
    layers: [
      { type: 'tile-fill', tile: T.FLOOR_GRAY, x: 0, y: 0, w: 16, h: 12 },
      { type: 'tile-fill', tile: T.WALL_WOOD_T, x: 0, y: 0, w: 16, h: 2 },
      { type: 'tile-fill', tile: T.WALL_WOOD_B, x: 0, y: 2, w: 16, h: 2 },
      // Sparse, dark room
      it(0, 70, 7, 3),                            // lonely painting
      // Desk area
      ...mt('interiors', 5, 35, 2, 2, 6, 6),     // desk with book
      ...mt('interiors', 12, 40, 1, 2, 8, 6),    // computer tower
      it(0, 68, 13, 8),                            // lonely pot
      // Character slumped at desk
      { tile: CHAR_SIT, x: 7, y: 7 },
      // Darkness
      { type: 'fill', color: 'rgba(0,0,0,0.45)', x: 0, y: 0, w: 16, h: 12 },
      // Dim red glow from screen
      { type: 'fill', color: 'rgba(248,81,73,0.18)', x: 5, y: 5, w: 5, h: 4 },
    ]
  },

  'family': {
    width: 16, height: 12,
    caption: 'Some things matter more than code.',
    layers: [
      { type: 'tile-fill', tile: T.FLOOR_HERRING, x: 0, y: 0, w: 16, h: 12 },
      { type: 'tile-fill', tile: T.WALL_CREAM_T, x: 0, y: 0, w: 16, h: 2 },
      { type: 'tile-fill', tile: T.WALL_CREAM_B, x: 0, y: 2, w: 16, h: 2 },
      // Wall decorations
      ...mt('interiors', 7, 28, 2, 2, 3, 2),     // framed painting
      ...mt('interiors', 4, 24, 2, 2, 8, 2),     // curtain window
      it(2, 70, 13, 3),                            // art painting
      // Furniture
      ...mt('interiors', 4, 68, 2, 2, 12, 4),    // fireplace
      ...mt('interiors', 10, 44, 2, 2, 0, 5),    // green plant
      ...mt('interiors', 7, 16, 3, 2, 5, 8),     // red/gold rug
      ...mt('interiors', 1, 72, 3, 2, 5, 6),     // gray sofa (3 wide!)
      ...mt('interiors', 0, 10, 2, 2, 2, 7),     // small table
      it(0, 66, 14, 6),                            // pot plant
      it(0, 66, 15, 8),                            // pot plant
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
      // Moon
      { type: 'fill', color: '#c8d0d8', x: 12, y: 1, w: 1, h: 1 },
      it(1, 70, 4, 3),                            // painting on wall
      // Furniture
      ...mt('interiors', 12, 68, 2, 2, 0, 4),    // brown bookshelf
      ...mt('interiors', 10, 44, 2, 2, 14, 4),   // green plant
      it(0, 66, 3, 6),                            // pot
      // Desk area
      ...mt('interiors', 5, 35, 2, 2, 5, 6),     // desk with book
      ...mt('interiors', 12, 40, 1, 2, 7, 6),    // computer tower
      // Character sitting
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
      // Wall items
      ...mt('interiors', 9, 66, 2, 2, 6, 2),     // world map on wall
      ...mt('interiors', 9, 24, 2, 2, 12, 2),    // frosted window
      it(2, 70, 4, 3),                            // art painting
      // Furniture against wall
      ...mt('interiors', 5, 14, 2, 2, 0, 4),     // bookshelf
      ...mt('interiors', 14, 68, 2, 2, 14, 4),   // red bookshelf
      ...mt('interiors', 10, 44, 2, 2, 8, 5),    // green plant (center)
      // Left desk
      ...mt('interiors', 5, 35, 2, 2, 2, 6),
      ...mt('interiors', 12, 40, 1, 2, 4, 6),
      // Right desk
      ...mt('interiors', 5, 35, 2, 2, 10, 6),
      ...mt('interiors', 12, 40, 1, 2, 12, 6),
      // Character at right desk
      { tile: CHAR_SIT, x: 11, y: 7 },
      // Subtle glow
      { type: 'fill', color: 'rgba(63,185,80,0.06)', x: 0, y: 0, w: 16, h: 12 },
    ]
  },

  'coffee-shop': {
    width: 16, height: 12,
    caption: 'The perfect Saturday morning.',
    layers: [
      { type: 'tile-fill', tile: T.FLOOR_YELLOW, x: 0, y: 0, w: 16, h: 12 },
      { type: 'tile-fill', tile: T.WALL_SALMON_T, x: 0, y: 0, w: 16, h: 2 },
      { type: 'tile-fill', tile: T.WALL_SALMON_B, x: 0, y: 2, w: 16, h: 2 },
      // Wall items
      ...mt('interiors', 4, 24, 2, 2, 1, 2),     // curtain window
      ...mt('interiors', 7, 24, 2, 2, 5, 2),     // red window
      it(1, 70, 10, 3),                           // painting
      it(2, 70, 14, 3),                           // painting
      // Furniture
      ...mt('interiors', 12, 72, 2, 2, 12, 4),   // store shelf (counter)
      ...mt('interiors', 14, 72, 2, 2, 14, 6),   // store shelf
      ...mt('interiors', 10, 44, 2, 2, 0, 5),    // plant
      it(0, 66, 10, 6),                           // pot
      // Seating area
      ...mt('interiors', 7, 72, 3, 2, 0, 7),     // brown sofa bench
      ...mt('interiors', 7, 10, 3, 2, 5, 7),     // wide table
      ...mt('interiors', 0, 10, 2, 2, 10, 8),    // small table
      // Character at table
      { tile: CHAR_SIT, x: 6, y: 9 },
      // Warm glow
      { type: 'fill', color: 'rgba(210,153,34,0.06)', x: 0, y: 0, w: 16, h: 12 },
    ]
  },

  'vacation': {
    width: 16, height: 12,
    caption: 'No laptops allowed.',
    layers: [
      // Sky
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
      // Second palm tree
      ...mt('interiors', 12, 44, 2, 2, 12, 5),
      // Beach blanket
      { type: 'fill', color: '#f85149', x: 7, y: 9, w: 3, h: 1 },
      { type: 'fill', color: '#58a6ff', x: 7, y: 10, w: 3, h: 1 },
      // Character on beach
      { tile: CHAR_IDLE, x: 6, y: 8 },
    ]
  },

  'payday': {
    width: 16, height: 12,
    caption: '{name}\'s first dollar.',
    layers: [
      { type: 'tile-fill', tile: T.FLOOR_GRAY, x: 0, y: 0, w: 16, h: 12 },
      { type: 'tile-fill', tile: T.WALL_MINT_T, x: 0, y: 0, w: 16, h: 2 },
      { type: 'tile-fill', tile: T.WALL_MINT_B, x: 0, y: 2, w: 16, h: 2 },
      // Wall items
      ...mt('interiors', 7, 24, 2, 2, 7, 2),     // red window
      ...mt('interiors', 7, 28, 2, 2, 12, 2),    // framed painting
      it(2, 70, 4, 3),                            // art painting
      it(1, 70, 5, 3),                            // cat painting
      // Furniture
      ...mt('interiors', 5, 14, 2, 2, 0, 4),     // bookshelf
      ...mt('interiors', 12, 68, 2, 2, 14, 4),   // brown bookshelf
      ...mt('interiors', 14, 35, 1, 2, 13, 6),   // globe
      ...mt('interiors', 10, 44, 2, 2, 2, 5),    // green plant
      it(0, 66, 12, 8),                           // pot
      // Desk area
      ...mt('interiors', 5, 35, 2, 2, 6, 6),     // desk with book
      ...mt('interiors', 12, 40, 1, 2, 8, 6),    // computer tower
      // Character celebrating
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
      { type: 'fill', color: '#f0e68c', x: 7, y: 0, w: 5, h: 4 },
      // Window
      ...mt('interiors', 0, 28, 3, 2, 7, 2),     // large modern window
      it(0, 12, 13, 3),                           // landscape painting
      // Furniture
      ...mt('interiors', 0, 0, 3, 4, 1, 4),      // green bed (3×4)
      ...mt('interiors', 3, 3, 1, 2, 4, 6),      // nightstand
      ...mt('interiors', 10, 44, 2, 2, 13, 5),   // green plant
      ...mt('interiors', 6, 67, 1, 2, 12, 5),    // standing mirror
      it(0, 66, 0, 9),                            // pot
      it(0, 66, 15, 9),                           // pot
      // Character just woke up
      { tile: CHAR_IDLE, x: 9, y: 7 },
      // Morning light
      { type: 'fill', color: 'rgba(240,230,140,0.08)', x: 0, y: 0, w: 16, h: 12 },
    ]
  },

  'ending-builder': {
    width: 16, height: 12,
    caption: 'The Builder.',
    layers: [
      { type: 'tile-fill', tile: T.FLOOR_HERRING, x: 0, y: 0, w: 16, h: 12 },
      { type: 'tile-fill', tile: T.WALL_BLUEGRAY_T, x: 0, y: 0, w: 16, h: 2 },
      { type: 'tile-fill', tile: T.WALL_BLUEGRAY_B, x: 0, y: 2, w: 16, h: 2 },
      // Wall decorations
      ...mt('interiors', 9, 66, 2, 2, 2, 2),     // world map
      ...mt('interiors', 4, 24, 2, 2, 7, 2),     // curtain window
      ...mt('interiors', 7, 24, 2, 2, 12, 2),    // red window
      it(1, 70, 5, 3),                            // painting
      // Furniture against walls
      ...mt('interiors', 7, 14, 3, 2, 0, 4),     // wide bookshelf
      ...mt('interiors', 12, 68, 2, 2, 14, 4),   // brown bookshelf
      ...mt('interiors', 14, 35, 1, 2, 5, 5),    // globe
      ...mt('interiors', 12, 44, 2, 2, 11, 5),   // palm tree
      ...mt('interiors', 10, 44, 2, 2, 3, 6),    // green plant
      it(0, 66, 13, 8),                           // pot
      // Desk area
      ...mt('interiors', 5, 35, 2, 2, 7, 6),     // desk with book
      ...mt('interiors', 12, 40, 1, 2, 9, 6),    // computer tower
      // Character triumphant
      { tile: CHAR_IDLE, x: 6, y: 7 },
      // Golden glow
      { type: 'fill', color: 'rgba(210,153,34,0.07)', x: 0, y: 0, w: 16, h: 12 },
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

  const copy = document.createElement('canvas');
  copy.width = src.width;
  copy.height = src.height;
  copy.className = 'pixel-scene';
  const copyCtx = copy.getContext('2d');
  copyCtx.imageSmoothingEnabled = false;
  copyCtx.drawImage(src, 0, 0);
  return copy;
}
