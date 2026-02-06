// ========================================
// THE BUILDER TRAIL — Scene System (M2.5)
// Canvas-based scene compositor with character sprites
// ========================================

const TILE_SIZE = 16;
const SCENE_SCALE = 3;

// --- Character Sprite Loading ---
const SPRITE_SHEETS = {};
const sheetImages = {};
let sheetsLoaded = false;

function preloadSheets() {
  // No tileset sheets needed — scenes use fill rects
  sheetsLoaded = true;
  return Promise.resolve();
}

function loadCharacterTiles(charName) {
  const name = charName.toLowerCase();
  const poses = {
    idle: `assets/${charName}_idle_16x16.png`,
    sit: `assets/${charName}_sit2_16x16.png`,
    phone: `assets/${charName}_phone_16x16.png`,
  };

  const TILE_ATLAS_ENTRIES = {};
  Object.entries(poses).forEach(([pose, src]) => {
    const sheetKey = `char-${name}-${pose}-sheet`;
    SPRITE_SHEETS[sheetKey] = src;
    TILE_ATLAS[`char-${name}-${pose}`] = { sheet: sheetKey, col: 0, row: 0, h: 2 };
  });

  return Promise.all(Object.keys(poses).map(pose => {
    const sheetKey = `char-${name}-${pose}-sheet`;
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => { sheetImages[sheetKey] = img; resolve(); };
      img.onerror = () => resolve();
      img.src = SPRITE_SHEETS[sheetKey];
    });
  }));
}

// --- Tile Atlas (character sprites only) ---
const TILE_ATLAS = {};

// --- Scene Definitions ---
// Layers: { type: 'fill', color, x, y, w, h }
//         { tile: '__CHARACTER_SIT__' | '__CHARACTER_IDLE__' | '__CHARACTER_PHONE__', x, y }

const SCENES = {

  // 1. Late night coding session
  'coding-night': {
    width: 16, height: 12,
    caption: '2:47 AM. It works.',
    bg: '#0a0a14',
    layers: [
      // Dark wall
      { type: 'fill', color: '#161b22', x: 0, y: 0, w: 16, h: 8 },
      // Wall baseboard
      { type: 'fill', color: '#21262d', x: 0, y: 7.5, w: 16, h: 0.5 },
      // Floor
      { type: 'fill', color: '#1c1510', x: 0, y: 8, w: 16, h: 4 },
      // Floor line
      { type: 'fill', color: '#2a2015', x: 0, y: 10, w: 16, h: 0.1 },
      // Window — night sky
      { type: 'fill', color: '#0d1117', x: 11, y: 1, w: 3, h: 3 },
      { type: 'fill', color: '#30363d', x: 10.8, y: 0.8, w: 3.4, h: 0.2 },
      { type: 'fill', color: '#30363d', x: 10.8, y: 4, w: 3.4, h: 0.2 },
      { type: 'fill', color: '#30363d', x: 10.8, y: 0.8, w: 0.2, h: 3.4 },
      { type: 'fill', color: '#30363d', x: 14, y: 0.8, w: 0.2, h: 3.4 },
      // Stars in window
      { type: 'fill', color: '#e6edf3', x: 11.5, y: 1.5, w: 0.2, h: 0.2 },
      { type: 'fill', color: '#e6edf3', x: 13, y: 2.2, w: 0.2, h: 0.2 },
      { type: 'fill', color: '#8b949e', x: 12.2, y: 3, w: 0.15, h: 0.15 },
      // Blue glow from window
      { type: 'fill', color: 'rgba(88,166,255,0.06)', x: 10, y: 0, w: 6, h: 12 },
      // Desk
      { type: 'fill', color: '#4a3520', x: 3, y: 8, w: 7, h: 0.5 },
      { type: 'fill', color: '#3d2c18', x: 3, y: 8.5, w: 0.4, h: 2.5 },
      { type: 'fill', color: '#3d2c18', x: 9.6, y: 8.5, w: 0.4, h: 2.5 },
      // Monitor
      { type: 'fill', color: '#30363d', x: 5, y: 5.5, w: 3, h: 2 },
      { type: 'fill', color: '#0d1117', x: 5.2, y: 5.7, w: 2.6, h: 1.5 },
      // Code on screen
      { type: 'fill', color: '#58a6ff', x: 5.5, y: 6, w: 0.8, h: 0.2 },
      { type: 'fill', color: '#3fb950', x: 6.5, y: 6, w: 0.5, h: 0.2 },
      { type: 'fill', color: '#e6edf3', x: 5.7, y: 6.4, w: 1.2, h: 0.15 },
      { type: 'fill', color: '#3fb950', x: 5.5, y: 6.7, w: 0.6, h: 0.15 },
      { type: 'fill', color: '#8b949e', x: 6.3, y: 6.7, w: 0.8, h: 0.15 },
      // Monitor stand
      { type: 'fill', color: '#30363d', x: 6.2, y: 7.5, w: 0.6, h: 0.5 },
      // Monitor glow on desk
      { type: 'fill', color: 'rgba(88,166,255,0.15)', x: 3, y: 7, w: 7, h: 4 },
      // Coffee mug
      { type: 'fill', color: '#8b949e', x: 9, y: 7.5, w: 0.5, h: 0.5 },
      { type: 'fill', color: '#6e4a2a', x: 9.1, y: 7.6, w: 0.3, h: 0.3 },
      // Character sitting
      { tile: '__CHARACTER_SIT__', x: 6, y: 7 },
    ]
  },

  // 2. Shipped something real
  'ship': {
    width: 16, height: 12,
    caption: '{name} shipped something real.',
    bg: '#0d1117',
    layers: [
      // Dark room
      { type: 'fill', color: '#161b22', x: 0, y: 0, w: 16, h: 8 },
      { type: 'fill', color: '#21262d', x: 0, y: 7.5, w: 16, h: 0.5 },
      { type: 'fill', color: '#1c1510', x: 0, y: 8, w: 16, h: 4 },
      // Desk
      { type: 'fill', color: '#4a3520', x: 3, y: 8, w: 7, h: 0.5 },
      { type: 'fill', color: '#3d2c18', x: 3, y: 8.5, w: 0.4, h: 2.5 },
      { type: 'fill', color: '#3d2c18', x: 9.6, y: 8.5, w: 0.4, h: 2.5 },
      // Monitor with GREEN deploy screen
      { type: 'fill', color: '#30363d', x: 5, y: 5.5, w: 3, h: 2 },
      { type: 'fill', color: '#0d1117', x: 5.2, y: 5.7, w: 2.6, h: 1.5 },
      { type: 'fill', color: '#3fb950', x: 5.8, y: 6.1, w: 1.4, h: 0.4 },
      { type: 'fill', color: '#3fb950', x: 6.1, y: 6.6, w: 0.8, h: 0.2 },
      { type: 'fill', color: '#30363d', x: 6.2, y: 7.5, w: 0.6, h: 0.5 },
      // Green glow
      { type: 'fill', color: 'rgba(63,185,80,0.2)', x: 3, y: 5, w: 7, h: 6 },
      // Character at desk
      { tile: '__CHARACTER_SIT__', x: 6, y: 7 },
      // Confetti
      { type: 'fill', color: '#3fb950', x: 2, y: 1, w: 0.5, h: 0.5 },
      { type: 'fill', color: '#58a6ff', x: 9, y: 0.5, w: 0.5, h: 0.5 },
      { type: 'fill', color: '#f0883e', x: 4, y: 2, w: 0.5, h: 0.5 },
      { type: 'fill', color: '#f85149', x: 12, y: 1, w: 0.5, h: 0.5 },
      { type: 'fill', color: '#d29922', x: 7, y: 0.5, w: 0.5, h: 0.5 },
      { type: 'fill', color: '#3fb950', x: 14, y: 2.5, w: 0.4, h: 0.4 },
      { type: 'fill', color: '#58a6ff', x: 1, y: 3, w: 0.4, h: 0.4 },
      { type: 'fill', color: '#f0883e', x: 11, y: 3.5, w: 0.4, h: 0.4 },
      { type: 'fill', color: '#d29922', x: 3, y: 0.5, w: 0.3, h: 0.3 },
      { type: 'fill', color: '#f85149', x: 13, y: 0.5, w: 0.3, h: 0.3 },
      // Plant
      { type: 'fill', color: '#3d2c18', x: 13.5, y: 9.5, w: 0.8, h: 0.8 },
      { type: 'fill', color: '#3fb950', x: 13.3, y: 8.5, w: 0.5, h: 1.2 },
      { type: 'fill', color: '#2ea043', x: 13.8, y: 8.8, w: 0.5, h: 0.9 },
      { type: 'fill', color: '#3fb950', x: 14.1, y: 9, w: 0.3, h: 0.6 },
    ]
  },

  // 3. Family time
  'family': {
    width: 16, height: 12,
    caption: 'Some things matter more than code.',
    bg: '#1a150e',
    layers: [
      // Warm walls
      { type: 'fill', color: '#2a2015', x: 0, y: 0, w: 16, h: 8 },
      { type: 'fill', color: '#332818', x: 0, y: 7.5, w: 16, h: 0.5 },
      // Warm wood floor
      { type: 'fill', color: '#3d2c18', x: 0, y: 8, w: 16, h: 4 },
      { type: 'fill', color: '#4a3520', x: 0, y: 10, w: 16, h: 0.1 },
      // Floor lamp with warm glow
      { type: 'fill', color: '#d29922', x: 13.2, y: 4.5, w: 0.8, h: 0.6 },
      { type: 'fill', color: '#8b949e', x: 13.5, y: 5.1, w: 0.2, h: 3.5 },
      { type: 'fill', color: 'rgba(210,153,34,0.15)', x: 10, y: 0, w: 6, h: 12 },
      // Bookshelf on left
      { type: 'fill', color: '#4a3520', x: 0, y: 3, w: 2, h: 5 },
      { type: 'fill', color: '#3d2c18', x: 0.2, y: 3.2, w: 1.6, h: 0.2 },
      { type: 'fill', color: '#3d2c18', x: 0.2, y: 4.5, w: 1.6, h: 0.2 },
      { type: 'fill', color: '#3d2c18', x: 0.2, y: 5.8, w: 1.6, h: 0.2 },
      // Books (colored spines)
      { type: 'fill', color: '#58a6ff', x: 0.3, y: 3.5, w: 0.3, h: 0.9 },
      { type: 'fill', color: '#f85149', x: 0.7, y: 3.5, w: 0.3, h: 0.9 },
      { type: 'fill', color: '#3fb950', x: 1.1, y: 3.5, w: 0.3, h: 0.9 },
      { type: 'fill', color: '#d29922', x: 1.5, y: 3.5, w: 0.2, h: 0.9 },
      { type: 'fill', color: '#f0883e', x: 0.3, y: 4.8, w: 0.4, h: 0.9 },
      { type: 'fill', color: '#8b949e', x: 0.8, y: 4.8, w: 0.3, h: 0.9 },
      { type: 'fill', color: '#58a6ff', x: 1.2, y: 4.8, w: 0.3, h: 0.9 },
      // Sofa
      { type: 'fill', color: '#4a3520', x: 5, y: 8, w: 5, h: 2 },
      { type: 'fill', color: '#5a422a', x: 5.2, y: 8.2, w: 4.6, h: 1.5 },
      { type: 'fill', color: '#4a3520', x: 4.8, y: 7, w: 0.4, h: 3 },
      { type: 'fill', color: '#4a3520', x: 9.8, y: 7, w: 0.4, h: 3 },
      // Rug
      { type: 'fill', color: '#6e4a2a', x: 4, y: 10, w: 7, h: 1.5 },
      { type: 'fill', color: '#5a422a', x: 4.3, y: 10.2, w: 6.4, h: 1.1 },
      // Character sitting on sofa
      { tile: '__CHARACTER_SIT__', x: 7, y: 7 },
    ]
  },

  // 4. Burnout
  'burnout': {
    width: 16, height: 12,
    caption: '{name} pushed too hard.',
    bg: '#050508',
    layers: [
      // Very dark walls
      { type: 'fill', color: '#0a0a0f', x: 0, y: 0, w: 16, h: 8 },
      // Dark floor
      { type: 'fill', color: '#080810', x: 0, y: 8, w: 16, h: 4 },
      // Desk
      { type: 'fill', color: '#2a2015', x: 3, y: 8, w: 7, h: 0.5 },
      { type: 'fill', color: '#1c1510', x: 3, y: 8.5, w: 0.4, h: 2.5 },
      { type: 'fill', color: '#1c1510', x: 9.6, y: 8.5, w: 0.4, h: 2.5 },
      // Monitor with red error
      { type: 'fill', color: '#21262d', x: 5, y: 5.5, w: 3, h: 2 },
      { type: 'fill', color: '#160b0b', x: 5.2, y: 5.7, w: 2.6, h: 1.5 },
      { type: 'fill', color: '#f85149', x: 6, y: 6.2, w: 0.4, h: 0.3 },
      { type: 'fill', color: '#f85149', x: 6.6, y: 6.2, w: 0.4, h: 0.3 },
      { type: 'fill', color: '#21262d', x: 6.2, y: 7.5, w: 0.6, h: 0.5 },
      // Red glow
      { type: 'fill', color: 'rgba(248,81,73,0.1)', x: 3, y: 4, w: 7, h: 7 },
      // Multiple coffee cups scattered
      { type: 'fill', color: '#484848', x: 3.5, y: 7.5, w: 0.4, h: 0.4 },
      { type: 'fill', color: '#484848', x: 8.5, y: 7.6, w: 0.4, h: 0.4 },
      { type: 'fill', color: '#484848', x: 9.2, y: 7.3, w: 0.4, h: 0.4 },
      // Crumpled papers on floor
      { type: 'fill', color: '#21262d', x: 2, y: 9.5, w: 0.6, h: 0.4 },
      { type: 'fill', color: '#21262d', x: 11, y: 10, w: 0.5, h: 0.4 },
      // Character slumped at desk
      { tile: '__CHARACTER_SIT__', x: 6, y: 7 },
    ]
  },

  // 5. Flow state
  'flow-state': {
    width: 16, height: 12,
    caption: 'Everything clicks.',
    bg: '#0d1117',
    layers: [
      // Clean walls
      { type: 'fill', color: '#161b22', x: 0, y: 0, w: 16, h: 8 },
      { type: 'fill', color: '#21262d', x: 0, y: 7.5, w: 16, h: 0.5 },
      // Light floor
      { type: 'fill', color: '#1c1c1c', x: 0, y: 8, w: 16, h: 4 },
      // Large desk
      { type: 'fill', color: '#4a3520', x: 1, y: 8, w: 12, h: 0.5 },
      { type: 'fill', color: '#3d2c18', x: 1, y: 8.5, w: 0.4, h: 2.5 },
      { type: 'fill', color: '#3d2c18', x: 12.6, y: 8.5, w: 0.4, h: 2.5 },
      // Left monitor (green code)
      { type: 'fill', color: '#30363d', x: 2, y: 5.5, w: 3, h: 2 },
      { type: 'fill', color: '#0d1117', x: 2.2, y: 5.7, w: 2.6, h: 1.5 },
      { type: 'fill', color: '#3fb950', x: 2.5, y: 6, w: 0.8, h: 0.15 },
      { type: 'fill', color: '#e6edf3', x: 2.5, y: 6.3, w: 1.2, h: 0.1 },
      { type: 'fill', color: '#3fb950', x: 2.5, y: 6.5, w: 0.6, h: 0.15 },
      { type: 'fill', color: '#3fb950', x: 2.5, y: 6.7, w: 1, h: 0.1 },
      { type: 'fill', color: '#30363d', x: 3.2, y: 7.5, w: 0.6, h: 0.5 },
      // Right monitor (blue UI)
      { type: 'fill', color: '#30363d', x: 9, y: 5.5, w: 3, h: 2 },
      { type: 'fill', color: '#0d1117', x: 9.2, y: 5.7, w: 2.6, h: 1.5 },
      { type: 'fill', color: '#58a6ff', x: 9.5, y: 6, w: 1.8, h: 0.3 },
      { type: 'fill', color: '#21262d', x: 9.5, y: 6.5, w: 0.8, h: 0.6 },
      { type: 'fill', color: '#21262d', x: 10.5, y: 6.5, w: 0.8, h: 0.6 },
      { type: 'fill', color: '#30363d', x: 10.2, y: 7.5, w: 0.6, h: 0.5 },
      // Plant between monitors
      { type: 'fill', color: '#3d2c18', x: 6.8, y: 7, w: 0.6, h: 1 },
      { type: 'fill', color: '#3fb950', x: 6.3, y: 5.5, w: 0.6, h: 1.8 },
      { type: 'fill', color: '#2ea043', x: 6.9, y: 5.8, w: 0.6, h: 1.5 },
      { type: 'fill', color: '#3fb950', x: 7.3, y: 6.2, w: 0.4, h: 1 },
      // Ambient dual glow
      { type: 'fill', color: 'rgba(63,185,80,0.08)', x: 0, y: 4, w: 8, h: 7 },
      { type: 'fill', color: 'rgba(88,166,255,0.08)', x: 8, y: 4, w: 8, h: 7 },
      // Character sitting
      { tile: '__CHARACTER_SIT__', x: 6, y: 7 },
    ]
  },

  // 6. Coffee shop coding
  'coffee-shop': {
    width: 16, height: 12,
    caption: 'The perfect Saturday morning.',
    bg: '#2a1f14',
    layers: [
      // Warm walls
      { type: 'fill', color: '#332818', x: 0, y: 0, w: 16, h: 7 },
      { type: 'fill', color: '#3d2c18', x: 0, y: 6.5, w: 16, h: 0.5 },
      // Floor
      { type: 'fill', color: '#4a3520', x: 0, y: 7, w: 16, h: 5 },
      { type: 'fill', color: '#3d2c18', x: 0, y: 9, w: 16, h: 0.1 },
      // Large window with daylight
      { type: 'fill', color: '#87ceeb', x: 5, y: 1, w: 6, h: 4 },
      { type: 'fill', color: '#b8e6f0', x: 5.5, y: 1.5, w: 5, h: 3 },
      // Window frame
      { type: 'fill', color: '#4a3520', x: 4.8, y: 0.8, w: 6.4, h: 0.2 },
      { type: 'fill', color: '#4a3520', x: 4.8, y: 5, w: 6.4, h: 0.2 },
      { type: 'fill', color: '#4a3520', x: 4.8, y: 0.8, w: 0.2, h: 4.4 },
      { type: 'fill', color: '#4a3520', x: 11, y: 0.8, w: 0.2, h: 4.4 },
      { type: 'fill', color: '#4a3520', x: 7.9, y: 0.8, w: 0.2, h: 4.4 },
      // Sunlight spill
      { type: 'fill', color: 'rgba(240,230,140,0.1)', x: 4, y: 0, w: 8, h: 12 },
      // Counter/bar
      { type: 'fill', color: '#4a3520', x: 2, y: 8, w: 8, h: 0.5 },
      { type: 'fill', color: '#3d2c18', x: 2, y: 8.5, w: 0.4, h: 2 },
      { type: 'fill', color: '#3d2c18', x: 9.6, y: 8.5, w: 0.4, h: 2 },
      // Laptop on counter
      { type: 'fill', color: '#30363d', x: 5.5, y: 7.2, w: 1.5, h: 0.8 },
      { type: 'fill', color: '#0d1117', x: 5.6, y: 7.3, w: 1.3, h: 0.5 },
      { type: 'fill', color: '#58a6ff', x: 5.8, y: 7.4, w: 0.4, h: 0.15 },
      { type: 'fill', color: '#3fb950', x: 6.3, y: 7.4, w: 0.3, h: 0.15 },
      // Coffee mug
      { type: 'fill', color: '#e6edf3', x: 8, y: 7.4, w: 0.5, h: 0.5 },
      { type: 'fill', color: '#6e4a2a', x: 8.1, y: 7.5, w: 0.3, h: 0.3 },
      // Pendant lights
      { type: 'fill', color: '#d29922', x: 3, y: 0, w: 0.5, h: 0.8 },
      { type: 'fill', color: 'rgba(210,153,34,0.1)', x: 2, y: 0, w: 2.5, h: 4 },
      { type: 'fill', color: '#d29922', x: 11.5, y: 0, w: 0.5, h: 0.8 },
      { type: 'fill', color: 'rgba(210,153,34,0.1)', x: 10.5, y: 0, w: 2.5, h: 4 },
      // Small plants on shelf
      { type: 'fill', color: '#3d2c18', x: 1, y: 5.5, w: 0.6, h: 0.5 },
      { type: 'fill', color: '#3fb950', x: 0.8, y: 4.8, w: 0.5, h: 0.8 },
      { type: 'fill', color: '#2ea043', x: 1.2, y: 5, w: 0.4, h: 0.6 },
      { type: 'fill', color: '#3d2c18', x: 14, y: 5.5, w: 0.6, h: 0.5 },
      { type: 'fill', color: '#3fb950', x: 13.8, y: 4.8, w: 0.5, h: 0.8 },
      { type: 'fill', color: '#2ea043', x: 14.2, y: 5, w: 0.4, h: 0.6 },
      // Character sitting at counter
      { tile: '__CHARACTER_SIT__', x: 7, y: 8 },
    ]
  },

  // 7. Day job office
  'office': {
    width: 16, height: 12,
    caption: 'Back to the day job.',
    bg: '#181c24',
    layers: [
      // Office walls
      { type: 'fill', color: '#e6edf3', x: 0, y: 0, w: 16, h: 7 },
      { type: 'fill', color: '#d0d7de', x: 0, y: 6.5, w: 16, h: 0.5 },
      // Carpet floor
      { type: 'fill', color: '#8b949e', x: 0, y: 7, w: 16, h: 5 },
      { type: 'fill', color: '#6e7681', x: 0, y: 9, w: 16, h: 0.1 },
      // Corporate desk
      { type: 'fill', color: '#c9d1d9', x: 4, y: 8, w: 5, h: 0.5 },
      { type: 'fill', color: '#8b949e', x: 4, y: 8.5, w: 0.4, h: 2 },
      { type: 'fill', color: '#8b949e', x: 8.6, y: 8.5, w: 0.4, h: 2 },
      // Monitor
      { type: 'fill', color: '#30363d', x: 5.5, y: 5.5, w: 2.5, h: 2 },
      { type: 'fill', color: '#0d1117', x: 5.7, y: 5.7, w: 2.1, h: 1.5 },
      // Spreadsheet on screen
      { type: 'fill', color: '#58a6ff', x: 5.9, y: 5.9, w: 1.7, h: 0.2 },
      { type: 'fill', color: '#e6edf3', x: 5.9, y: 6.2, w: 0.5, h: 0.15 },
      { type: 'fill', color: '#e6edf3', x: 6.5, y: 6.2, w: 0.5, h: 0.15 },
      { type: 'fill', color: '#e6edf3', x: 7.1, y: 6.2, w: 0.5, h: 0.15 },
      { type: 'fill', color: '#e6edf3', x: 5.9, y: 6.5, w: 0.5, h: 0.15 },
      { type: 'fill', color: '#e6edf3', x: 6.5, y: 6.5, w: 0.5, h: 0.15 },
      { type: 'fill', color: '#e6edf3', x: 7.1, y: 6.5, w: 0.5, h: 0.15 },
      { type: 'fill', color: '#30363d', x: 6.5, y: 7.5, w: 0.5, h: 0.5 },
      // Whiteboard
      { type: 'fill', color: '#ffffff', x: 10, y: 1.5, w: 4, h: 3 },
      { type: 'fill', color: '#d0d7de', x: 10, y: 1.5, w: 4, h: 0.15 },
      { type: 'fill', color: '#d0d7de', x: 10, y: 4.35, w: 4, h: 0.15 },
      { type: 'fill', color: '#d0d7de', x: 10, y: 1.5, w: 0.15, h: 3 },
      { type: 'fill', color: '#d0d7de', x: 13.85, y: 1.5, w: 0.15, h: 3 },
      // Sticky notes on whiteboard
      { type: 'fill', color: '#58a6ff', x: 10.5, y: 2, w: 1, h: 0.8 },
      { type: 'fill', color: '#3fb950', x: 11.8, y: 2, w: 1, h: 0.8 },
      { type: 'fill', color: '#f0883e', x: 10.5, y: 3.2, w: 1, h: 0.8 },
      { type: 'fill', color: '#d29922', x: 11.8, y: 3.2, w: 1, h: 0.8 },
      // Character
      { tile: '__CHARACTER_SIT__', x: 6, y: 7 },
    ]
  },

  // 8. Sunrise
  'sunrise': {
    width: 16, height: 12,
    caption: 'Is this what rested feels like?',
    bg: '#1a1a2e',
    layers: [
      // Indoor walls
      { type: 'fill', color: '#1a1a2e', x: 0, y: 0, w: 16, h: 8 },
      // Floor
      { type: 'fill', color: '#2a2015', x: 0, y: 8, w: 16, h: 4 },
      { type: 'fill', color: '#332818', x: 0, y: 10, w: 16, h: 0.1 },
      // Window with sunrise gradient
      { type: 'fill', color: '#1a1a2e', x: 5, y: 1, w: 6, h: 0.5 },
      { type: 'fill', color: '#f0883e', x: 5, y: 1.5, w: 6, h: 1 },
      { type: 'fill', color: '#f0e68c', x: 5, y: 2.5, w: 6, h: 1 },
      { type: 'fill', color: '#ffedd5', x: 5, y: 3.5, w: 6, h: 0.5 },
      // Sun
      { type: 'fill', color: '#ffd700', x: 7.5, y: 2, w: 1, h: 1 },
      // Window frame
      { type: 'fill', color: '#4a3520', x: 4.8, y: 0.8, w: 0.2, h: 3.4 },
      { type: 'fill', color: '#4a3520', x: 11, y: 0.8, w: 0.2, h: 3.4 },
      { type: 'fill', color: '#4a3520', x: 4.8, y: 0.8, w: 6.4, h: 0.2 },
      { type: 'fill', color: '#4a3520', x: 4.8, y: 4, w: 6.4, h: 0.2 },
      // Warm light spill from window
      { type: 'fill', color: 'rgba(240,136,62,0.08)', x: 3, y: 0, w: 10, h: 12 },
      // Rug
      { type: 'fill', color: '#6e4a2a', x: 4, y: 9, w: 7, h: 2 },
      { type: 'fill', color: '#5a422a', x: 4.3, y: 9.2, w: 6.4, h: 1.6 },
      // Plant
      { type: 'fill', color: '#3d2c18', x: 2, y: 9.5, w: 0.6, h: 0.8 },
      { type: 'fill', color: '#3fb950', x: 1.7, y: 8.5, w: 0.5, h: 1.2 },
      { type: 'fill', color: '#2ea043', x: 2.2, y: 8.8, w: 0.5, h: 0.9 },
      // Character standing (stretching)
      { tile: '__CHARACTER_IDLE__', x: 8, y: 7 },
    ]
  },

  // 9. Payday — first revenue
  'payday': {
    width: 16, height: 12,
    caption: '{name}\'s first dollar.',
    bg: '#0d1117',
    layers: [
      // Dark ambient
      { type: 'fill', color: '#0d1117', x: 0, y: 0, w: 16, h: 12 },
      // Phone shape
      { type: 'fill', color: '#30363d', x: 6, y: 2, w: 4, h: 6.5 },
      { type: 'fill', color: '#21262d', x: 6.3, y: 2.5, w: 3.4, h: 5.5 },
      // Phone screen notch
      { type: 'fill', color: '#30363d', x: 7.5, y: 2.2, w: 1, h: 0.2 },
      // Notification banner
      { type: 'fill', color: '#1c2128', x: 6.5, y: 3, w: 3, h: 1.2 },
      { type: 'fill', color: '#58a6ff', x: 6.7, y: 3.1, w: 0.4, h: 0.4 },
      { type: 'fill', color: '#e6edf3', x: 7.3, y: 3.2, w: 1.5, h: 0.15 },
      { type: 'fill', color: '#8b949e', x: 7.3, y: 3.5, w: 1, h: 0.15 },
      // Money amount
      { type: 'fill', color: '#3fb950', x: 7, y: 4.8, w: 2, h: 0.8 },
      // Dollar sign
      { type: 'fill', color: '#e6edf3', x: 7.3, y: 5.8, w: 0.3, h: 0.3 },
      { type: 'fill', color: '#8b949e', x: 7.8, y: 5.8, w: 1.2, h: 0.2 },
      // Green glow from phone
      { type: 'fill', color: 'rgba(63,185,80,0.12)', x: 4, y: 1, w: 8, h: 9 },
      // Character with phone
      { tile: '__CHARACTER_PHONE__', x: 8, y: 8 },
    ]
  },

  // 10. The Builder — ending scene
  'ending-builder': {
    width: 16, height: 12,
    caption: 'The Builder.',
    bg: '#0d1117',
    layers: [
      // Clean dark walls
      { type: 'fill', color: '#161b22', x: 0, y: 0, w: 16, h: 8 },
      { type: 'fill', color: '#21262d', x: 0, y: 7.5, w: 16, h: 0.5 },
      // Nice floor
      { type: 'fill', color: '#1c1c1c', x: 0, y: 8, w: 16, h: 4 },
      // Overhead warm light
      { type: 'fill', color: 'rgba(210,153,34,0.06)', x: 4, y: 0, w: 8, h: 12 },
      // Large desk
      { type: 'fill', color: '#4a3520', x: 1, y: 8, w: 13, h: 0.5 },
      { type: 'fill', color: '#3d2c18', x: 1, y: 8.5, w: 0.4, h: 2.5 },
      { type: 'fill', color: '#3d2c18', x: 13.6, y: 8.5, w: 0.4, h: 2.5 },
      // Left monitor (green)
      { type: 'fill', color: '#30363d', x: 1.5, y: 5.5, w: 2.5, h: 2 },
      { type: 'fill', color: '#0d1117', x: 1.7, y: 5.7, w: 2.1, h: 1.5 },
      { type: 'fill', color: '#3fb950', x: 2, y: 6, w: 0.8, h: 0.15 },
      { type: 'fill', color: '#3fb950', x: 2, y: 6.3, w: 0.5, h: 0.15 },
      { type: 'fill', color: '#3fb950', x: 2, y: 6.6, w: 1, h: 0.1 },
      { type: 'fill', color: '#30363d', x: 2.5, y: 7.5, w: 0.5, h: 0.5 },
      // Center monitor (blue - main)
      { type: 'fill', color: '#30363d', x: 5.5, y: 5, w: 3.5, h: 2.5 },
      { type: 'fill', color: '#0d1117', x: 5.7, y: 5.2, w: 3.1, h: 2 },
      { type: 'fill', color: '#58a6ff', x: 6, y: 5.5, w: 2, h: 0.3 },
      { type: 'fill', color: '#e6edf3', x: 6, y: 5.9, w: 1.5, h: 0.15 },
      { type: 'fill', color: '#3fb950', x: 6, y: 6.2, w: 1, h: 0.15 },
      { type: 'fill', color: '#8b949e', x: 6, y: 6.5, w: 2, h: 0.1 },
      { type: 'fill', color: '#30363d', x: 7, y: 7.5, w: 0.5, h: 0.5 },
      // Right monitor (orange)
      { type: 'fill', color: '#30363d', x: 10.5, y: 5.5, w: 2.5, h: 2 },
      { type: 'fill', color: '#0d1117', x: 10.7, y: 5.7, w: 2.1, h: 1.5 },
      { type: 'fill', color: '#f0883e', x: 11, y: 6, w: 0.8, h: 0.15 },
      { type: 'fill', color: '#f0883e', x: 11, y: 6.3, w: 0.5, h: 0.15 },
      { type: 'fill', color: '#30363d', x: 11.5, y: 7.5, w: 0.5, h: 0.5 },
      // Bookshelf on right
      { type: 'fill', color: '#4a3520', x: 14, y: 3, w: 1.5, h: 5 },
      { type: 'fill', color: '#3d2c18', x: 14.1, y: 3.2, w: 1.3, h: 0.2 },
      { type: 'fill', color: '#3d2c18', x: 14.1, y: 4.5, w: 1.3, h: 0.2 },
      { type: 'fill', color: '#3d2c18', x: 14.1, y: 5.8, w: 1.3, h: 0.2 },
      { type: 'fill', color: '#58a6ff', x: 14.2, y: 3.5, w: 0.3, h: 0.9 },
      { type: 'fill', color: '#3fb950', x: 14.6, y: 3.5, w: 0.3, h: 0.9 },
      { type: 'fill', color: '#d29922', x: 15, y: 3.5, w: 0.2, h: 0.9 },
      { type: 'fill', color: '#f0883e', x: 14.2, y: 4.8, w: 0.4, h: 0.9 },
      { type: 'fill', color: '#f85149', x: 14.7, y: 4.8, w: 0.3, h: 0.9 },
      // Tall plant on left
      { type: 'fill', color: '#3d2c18', x: 0.2, y: 7, w: 0.6, h: 1 },
      { type: 'fill', color: '#3fb950', x: -0.1, y: 5, w: 0.6, h: 2.2 },
      { type: 'fill', color: '#2ea043', x: 0.5, y: 5.5, w: 0.6, h: 1.7 },
      { type: 'fill', color: '#3fb950', x: 0.9, y: 6, w: 0.3, h: 1.2 },
      // Character standing proud
      { tile: '__CHARACTER_IDLE__', x: 7, y: 7.5 },
    ]
  },
};

// --- Scene Renderer ---

function renderSceneToCanvas(sceneId) {
  const scene = SCENES[sceneId];
  if (!scene) return null;

  const w = scene.width * TILE_SIZE;
  const h = scene.height * TILE_SIZE;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.className = 'pixel-scene';

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // Fill background
  if (scene.bg) {
    ctx.fillStyle = scene.bg;
    ctx.fillRect(0, 0, w, h);
  }

  // Draw each layer
  for (const layer of scene.layers) {
    if (layer.type === 'fill') {
      drawFill(ctx, layer);
    } else if (layer.tile) {
      drawSpriteTile(ctx, layer);
    }
  }

  return canvas;
}

function drawFill(ctx, layer) {
  ctx.fillStyle = layer.color;
  ctx.fillRect(
    layer.x * TILE_SIZE,
    layer.y * TILE_SIZE,
    layer.w * TILE_SIZE,
    layer.h * TILE_SIZE
  );
}

function drawSpriteTile(ctx, layer) {
  let tileName = layer.tile;

  // Resolve character sentinel tokens
  if (tileName && tileName.startsWith('__CHARACTER_')) {
    tileName = resolveCharacterTile(tileName);
  }

  const atlas = TILE_ATLAS[tileName];
  if (!atlas) return;

  const img = sheetImages[atlas.sheet];
  if (!img) return;

  const tileW = (atlas.w || 1);
  const tileH = (atlas.h || 1);
  const sw = tileW * TILE_SIZE;
  const sh = tileH * TILE_SIZE;
  const sx = atlas.col * TILE_SIZE;
  const sy = atlas.row * TILE_SIZE;

  ctx.drawImage(img,
    sx, sy, sw, sh,
    layer.x * TILE_SIZE,
    layer.y * TILE_SIZE,
    sw, sh
  );
}

function resolveCharacterTile(sentinel) {
  const charName = (typeof state !== 'undefined' && state.character) || 'Adam';
  const name = charName.toLowerCase();

  switch (sentinel) {
    case '__CHARACTER_SIT__':   return `char-${name}-sit`;
    case '__CHARACTER_IDLE__':  return `char-${name}-idle`;
    case '__CHARACTER_PHONE__': return `char-${name}-phone`;
    default:                    return `char-${name}-idle`;
  }
}

// --- Scene Cache ---
const sceneCache = {};

function getSceneCanvas(sceneId) {
  const charKey = (typeof state !== 'undefined' && state.character) || 'Adam';
  const cacheKey = sceneId + '-' + charKey;

  if (!sceneCache[cacheKey]) {
    sceneCache[cacheKey] = renderSceneToCanvas(sceneId);
  }

  const cached = sceneCache[cacheKey];
  if (!cached) return null;

  // Clone the canvas for DOM insertion
  const clone = document.createElement('canvas');
  clone.width = cached.width;
  clone.height = cached.height;
  clone.className = cached.className;
  clone.getContext('2d').drawImage(cached, 0, 0);
  return clone;
}

function clearSceneCache() {
  Object.keys(sceneCache).forEach(k => delete sceneCache[k]);
}
