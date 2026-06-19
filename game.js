// ========================================
// THE BUILDER TRAIL - Game Engine
// ========================================

// --- Constants ---
const TOTAL_WEEKS = 26;
const APPS_TO_SHIP = 5;
const SHIP_CREDITS = { small: 1, medium: 2, large: 3 };
const STARTING_SAVINGS = 30000;
const WEEKLY_INCOME = 4000;
const WEEKLY_EXPENSES = 3500;
const WEEKLY_ENERGY_DRAIN = 0;
const WEEKLY_MOMENTUM_DECAY = 4;
const QUIET_WEEK_CHANCE = 0; // no free-recovery weeks — every card must be a real tradeoff
const MAX_HISTORY = 5;
const AVATAR_IDLE_FRAME_WIDTH = 88;
const AVATAR_FRAME_HEIGHT = 136;
const AVATAR_IDLE_FRAMES = 4;
const AVATAR_SELECT_SCALE = 1;

const NEWSLETTER_URL = 'https://creatoreconomy.so/';
const YOUTUBE_URL = 'https://www.youtube.com/@PeterYangYT';
let generatedSceneIds = new Set();

// --- Survival attributes (spec model: Money / Health / Relationships / Agency) ---
// The four attributes are the real survival state, shown as 0-10 segmented meters.
// They are driven by translating each choice's legacy effects (see effectToAttributes).
const ACCENT = '#d97757';
const ATTRS = [
  { key: 'money', letter: 'M', name: 'MONEY' },
  { key: 'health', letter: 'H', name: 'HEALTH' },
  { key: 'relationships', letter: 'R', name: 'RELATIONSHIPS' },
  { key: 'agency', letter: 'A', name: 'AGENCY' }
];
const ATTR_KEYS = ATTRS.map(a => a.key);
const ATTR_START = { money: 4, health: 4, relationships: 3, agency: 3 };
const ATTR_MAX = 10;

const CHARACTERS = {
  BuilderGuy: {
    id: 'BuilderGuy',
    label: 'Builder Guy',
    description: 'Hoodie, laptop, thousand-yard roadmap stare'
  },
  BuilderGirl: {
    id: 'BuilderGirl',
    label: 'Builder Girl',
    description: 'Sharp, tired, absolutely shipping anyway'
  }
};

// --- Tools ---
const TOOLS = {
  cursor: {
    name: 'Cursor',
    tagline: 'The IDE that codes with you',
    description: 'Balanced. Good autocomplete, familiar IDE feel. Best for iterative building.',
    energyMod: 1.0,
    buildSpeedMod: 1.0,
    passiveIncomeMod: 1.0,
    momentumOnShip: 0,
    ceilingWeeks: null,
    specialText: 'Moderate energy, reliable outcomes'
  },
  'claude-code': {
    name: 'Claude Code',
    tagline: 'Terminal co-pilot',
    description: 'High autonomy. Lower energy cost, but review matters when it changes a lot.',
    energyMod: 0.75,
    buildSpeedMod: 0.9,
    passiveIncomeMod: 1.0,
    momentumOnShip: 5,
    ceilingWeeks: null,
    specialText: 'Low energy, higher trust tax'
  },
  lovable: {
    name: 'Lovable / Bolt',
    tagline: 'MVP before lunch',
    description: 'Fastest prototyping, lowest energy. But bigger products hit a ceiling fast.',
    energyMod: 0.5,
    buildSpeedMod: 0.7,
    passiveIncomeMod: 0.7,
    momentumOnShip: 0,
    ceilingWeeks: 2,
    specialText: 'Fastest start, ceiling on real products'
  },
  replit: {
    name: 'Replit',
    tagline: 'Build, run, deploy',
    description: 'Good all-rounder with built-in hosting. Fewer deployment headaches.',
    energyMod: 0.9,
    buildSpeedMod: 0.95,
    passiveIncomeMod: 1.0,
    momentumOnShip: 0,
    ceilingWeeks: null,
    specialText: 'Balanced, fewer deploy headaches'
  },
  'codex-cli': {
    name: 'Raw Codex CLI',
    tagline: 'Power tools, sharp edges',
    description: 'Punishing early, unmatched late. Multi-agent workflows unlock at high skill.',
    energyMod: 1.3,
    buildSpeedMod: 1.1,
    passiveIncomeMod: 1.2,
    momentumOnShip: 10,
    ceilingWeeks: null,
    specialText: 'Hard start, best late-game scaling'
  }
};

// --- State ---
const state = {
  week: 0,
  savings: STARTING_SAVINGS,
  energy: 100,
  momentum: 50,
  corpLoad: 35,
  appsShipped: 0,

  // Survival attributes (0-10) — primary win/lose state
  money: ATTR_START.money,
  health: ATTR_START.health,
  relationships: ATTR_START.relationships,
  agency: ATTR_START.agency,
  attrPrev: null,
  attrFlash: false,
  hoverAttrs: [],

  peakMomentum: 50,
  zeroEnergyWeeks: 0,
  zeroMomentumWeeks: 0,
  highCorpWeeks: 0,
  finalLaunchPending: false,
  lastEventId: null,
  recentEventIds: [],
  currentEvent: null,
  phase: 'intro',

  playerName: '',
  character: 'BuilderGuy',
  tool: null,

  activeProject: null,
  completedProjects: [],
  totalPassiveIncome: 0,

  technicalSkill: 10,
  reputation: 30,
  familyScore: 0,
  audience: 0,

  firedInflections: [],
  pendingScene: null,
  history: []
};

// --- DOM ---
let hudEl;
let contentEl;
let touchStart = null;
let suppressChoiceClick = false;

function init() {
  hudEl = document.getElementById('hud');
  contentEl = document.getElementById('content');
  preloadSheets();
  loadSceneManifest().finally(renderIntro);
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('pointerdown', handlePointerDown);
  document.addEventListener('pointermove', handlePointerMove);
  document.addEventListener('pointerup', handlePointerUp);
  document.addEventListener('pointercancel', cancelChoiceDrag);
}

async function loadSceneManifest() {
  try {
    const response = await fetch('assets/scenes/manifest.json', { cache: 'no-store' });
    if (!response.ok) return;
    const manifest = await response.json();
    if (Array.isArray(manifest.generated)) {
      generatedSceneIds = new Set(manifest.generated.filter(id => SCENES[id]));
    }
  } catch (error) {
    generatedSceneIds = new Set();
  }
}

// ========================================
// RENDERING
// ========================================

function renderIntro() {
  state.phase = 'intro';
  hudEl.innerHTML = '';
  contentEl.innerHTML = `
    <section class="intro screen">
      ${renderSceneBlock('hero', 'hero-art', { moodFallback: true, type: 'quiet' })}
      <div class="intro-copy">
        <h1 class="title intro-line" style="animation-delay: 0s">The Builder Trail<span class="title-cursor">&#9608;</span></h1>
        <p class="subtitle intro-line" style="animation-delay: 0.2s">Ship ${APPS_TO_SHIP} credits worth of real apps while balancing money, health, relationships, and your agency.</p>
        <div class="intro-text">
          <p class="intro-line" style="animation-delay: 0.45s">You have a high-paying tech job and a week full of meetings.</p>
          <p class="intro-line intro-hook" style="animation-delay: 0.7s">Can you become an AI builder?</p>
        </div>
        <button class="btn-primary intro-line" style="animation-delay: 1s" onclick="renderNameCharacterSelect()">
          <span class="btn-key">Enter</span> Begin
        </button>
      </div>
    </section>
  `;
  hydrateScenes(contentEl);
}

function renderNameCharacterSelect() {
  state.phase = 'nameCharacterSelect';
  hudEl.innerHTML = '';

  const characters = Object.values(CHARACTERS);
  const avatarPreviewWidth = Math.round(AVATAR_IDLE_FRAME_WIDTH * AVATAR_SELECT_SCALE);
  const avatarPreviewHeight = Math.round(AVATAR_FRAME_HEIGHT * AVATAR_SELECT_SCALE);
  const charCards = characters.map((character, i) => `
    <button class="character-card ${i === 0 ? 'selected' : ''}" data-char="${character.id}" onclick="selectCharPreview('${character.id}')">
      <div class="char-sprite" style="
        background-image: url('assets/avatars/${character.id}_idle.png');
        background-position: 0 0;
        background-size: ${avatarPreviewWidth * AVATAR_IDLE_FRAMES}px ${avatarPreviewHeight}px;
        width: ${avatarPreviewWidth}px;
        height: ${avatarPreviewHeight}px;
        --sprite-shift: -${avatarPreviewWidth * AVATAR_IDLE_FRAMES}px;
        image-rendering: pixelated;
      "></div>
    </button>
  `).join('');

  contentEl.innerHTML = `
    <section class="setup screen">
      <p class="eyebrow">Character</p>
      <h2 class="screen-title">Who are you?</h2>
      <div class="name-input-row">
        <label class="resource-label" for="player-name">NAME</label>
        <input type="text" id="player-name" class="name-input"
               maxlength="16" placeholder="Builder" autocomplete="off" />
      </div>
      <div class="character-grid">${charCards}</div>
      <button class="btn-primary" onclick="confirmNameCharacter()">
        <span class="btn-key">Enter</span> Continue
      </button>
    </section>
  `;

  setTimeout(() => {
    const input = document.getElementById('player-name');
    if (input) input.focus();
  }, 100);
}

function selectCharPreview(name) {
  state.character = name;
  const cards = contentEl.querySelectorAll('.character-card');
  cards.forEach(card => {
    card.classList.toggle('selected', card.dataset.char === name);
  });
}

function confirmNameCharacter() {
  if (state.phase !== 'nameCharacterSelect') return;
  const input = document.getElementById('player-name');
  const name = input ? input.value.trim() : '';
  state.playerName = name || 'Builder';

  preloadCharacterSheets(state.character);
  loadCharacterTiles(state.character);
  clearSceneCache();

  startGame();
}

function renderToolSelect() {
  state.phase = 'toolSelect';
  hudEl.innerHTML = '';

  const toolKeys = Object.keys(TOOLS);
  const cardsHTML = toolKeys.map((key, i) => {
    const tool = TOOLS[key];
    const stats = getToolStatLabels(tool);
    return `
      <button class="tool-card" onclick="selectTool('${key}')">
        <span class="choice-key">${i + 1}</span>
        <div class="tool-name">${tool.name}</div>
        <div class="tool-tagline">${tool.tagline}</div>
        <div class="tool-special">${tool.specialText}</div>
        <div class="tool-stats">${stats.join('<span class="dim"> / </span>')}</div>
      </button>
    `;
  }).join('');

  contentEl.innerHTML = `
    <section class="tool-select screen">
      <p class="eyebrow">Primary stack</p>
      <h2 class="screen-title">Choose your build style</h2>
      <p class="screen-subtitle">This is not cosmetic. Your tool changes energy, speed, income, and the kind of chaos that finds you.</p>
      <div class="tool-grid">${cardsHTML}</div>
    </section>
  `;
}

function getToolStatLabels(tool) {
  const stats = [];
  const energyPct = Math.round((1 - tool.energyMod) * 100);
  if (energyPct > 0) stats.push(`<span class="green">${energyPct}% less energy</span>`);
  else if (energyPct < 0) stats.push(`<span class="red">${-energyPct}% more energy</span>`);
  else stats.push(`<span class="dim">baseline energy</span>`);

  const speedPct = Math.round((1 - tool.buildSpeedMod) * 100);
  if (speedPct > 0) stats.push(`<span class="green">${speedPct}% faster</span>`);
  else if (speedPct < 0) stats.push(`<span class="red">${-speedPct}% slower</span>`);
  else stats.push(`<span class="dim">baseline speed</span>`);

  if (tool.passiveIncomeMod > 1) stats.push(`<span class="green">higher upside</span>`);
  if (tool.passiveIncomeMod < 1) stats.push(`<span class="yellow">lower revenue ceiling</span>`);
  if (tool.ceilingWeeks) stats.push(`<span class="yellow">stalls on bigger apps</span>`);
  return stats;
}

function selectTool(toolKey) {
  if (state.phase !== 'toolSelect') return;
  state.tool = toolKey;
  startGame();
}

function renderHUD() {
  const displayName = escapeHTML((state.playerName || 'builder').toUpperCase());
  const charName = state.character || 'BuilderGuy';
  const weekLabel = `WEEK ${String(Math.min(state.week, TOTAL_WEEKS)).padStart(2, '0')} / ${TOTAL_WEEKS}`;
  const metersHTML = ATTRS.map(renderAttrMeter).join('');

  hudEl.innerHTML = `
    <div class="hud-panel">
      <div class="hud-bar">
        <div class="hud-id">
          <div class="hud-avatar hud-avatar-${charName.toLowerCase()}" aria-hidden="true"></div>
          <span class="hud-dot"></span>
          <span class="hud-name">${displayName}</span>
        </div>
        <span class="hud-week">${weekLabel}</span>
      </div>
      <div class="meter-grid">${metersHTML}</div>
      ${renderProjectRow()}
    </div>
  `;
}

function renderAttrMeter(attr) {
  const val = state[attr.key];
  const filled = Math.round(val);
  const prevFilled = state.attrPrev ? Math.round(state.attrPrev[attr.key]) : filled;
  const flashing = state.attrFlash && state.attrPrev;
  const dir = flashing ? (filled > prevFilled ? 'up' : (filled < prevFilled ? 'down' : '')) : '';
  const lit = state.hoverAttrs.includes(attr.key);
  const low = filled <= 3;

  const segs = [];
  for (let i = 0; i < ATTR_MAX; i++) {
    let cls = i < filled ? 'on' : 'off';
    if (dir === 'up' && i >= prevFilled && i < filled) cls = 'gain';
    if (dir === 'down' && i >= filled && i < prevFilled) cls = 'loss';
    segs.push(`<span class="seg ${cls}"></span>`);
  }

  const classes = ['meter'];
  if (lit) classes.push('lit');
  if (low && !dir) classes.push('low');
  if (dir) classes.push('flash-' + dir);

  return `
    <div class="${classes.join(' ')}" data-attr="${attr.key}">
      <div class="meter-head">
        <span class="meter-badge">${attr.letter}</span>
        <span class="meter-name">${attr.name}</span>
        <span class="meter-dot"></span>
      </div>
      <div class="meter-segs">${segs.join('')}</div>
    </div>
  `;
}

function renderProjectRow() {
  const creditSegs = Array.from({ length: APPS_TO_SHIP }, (_, i) =>
    `<span class="credit ${i < state.appsShipped ? 'on' : 'off'}"></span>`).join('');

  if (!state.activeProject) {
    return `
      <div class="project-row">
        <span class="proj-arrow">&#9656;</span>
        <span class="proj-name dim">No active build</span>
        <span class="proj-spacer"></span>
        <span class="proj-ship-label">SHIP</span>
        <div class="credits">${creditSegs}</div>
      </div>`;
  }

  const p = state.activeProject;
  const pct = getPercent(p.weeksWorked, p.weeksRequired);
  const litProg = Math.round((pct / 100) * 12);
  const progSegs = Array.from({ length: 12 }, (_, i) =>
    `<span class="prog ${i < litProg ? 'on' : 'off'}"></span>`).join('');
  const sizeLetter = (p.size || '?').charAt(0).toUpperCase();
  const weeksLeft = Math.max(0, p.weeksRequired - p.weeksWorked);
  const weeksLabel = weeksLeft <= 0 ? 'shipping…' : `${weeksLeft} wk to ship`;

  return `
    <div class="project-row">
      <span class="proj-arrow">&#9656;</span>
      <span class="proj-name">${escapeHTML(p.name)}</span>
      <span class="proj-size">SIZE ${sizeLetter}</span>
      <div class="prog-bar">${progSegs}</div>
      <span class="proj-weeks">${weeksLabel}</span>
      <span class="proj-spacer"></span>
      <span class="proj-ship-label">SHIP</span>
      <div class="credits">${creditSegs}</div>
    </div>`;
}

// Shared decision/outcome shell — the same card frame is used for the question
// (kicker WEEK NN · DECISION) and the answer (kicker OUTCOME).
function decisionShell({ type, sceneId, kicker, title, body, controlsHTML }) {
  const safeType = ['work', 'building', 'life', 'quiet'].includes(type) ? type : 'quiet';
  return `
    <section class="decision-card ${safeType}">
      <div class="decision-main">
        <div class="card-kicker">${escapeHTML(kicker)}</div>
        <div class="card-title">${escapeHTML(personalize(title))}</div>
        <div class="card-body">${escapeHTML(personalize(body))}</div>
        <div class="card-controls">${controlsHTML}</div>
      </div>
      ${renderSceneBlock(sceneId, 'decision-scene', { moodFallback: true, type: safeType })}
    </section>
  `;
}

function renderWeek() {
  // A fresh decision starts with steady meters — the up/down flash belongs to the
  // outcome card only, never carried into the next week.
  state.attrFlash = false;
  state.attrPrev = null;
  renderHUD();

  const event = state.currentEvent || createQuietWeekEvent();
  const choices = getPlayableChoices(event);
  const kicker = `WEEK ${String(Math.min(state.week, TOTAL_WEEKS)).padStart(2, '0')} · ${event.type === 'quiet' ? 'QUIET WEEK' : 'DECISION'}`;

  const choicesHTML = choices.map((choice, i) => {
    const keys = affectedAttributes(choice.effects);
    return `
      <button class="dchoice" data-index="${i}"
        onmouseenter="lightMeters('${keys.join(',')}')" onmouseleave="lightMeters('')"
        onfocus="lightMeters('${keys.join(',')}')" onblur="lightMeters('')"
        onclick="handleChoiceClick(${i})">
        <span class="dchoice-index">[${i + 1}]</span>
        <span class="dchoice-label">${escapeHTML(choice.label)}</span>
        <span class="dchoice-arrow">&#8250;</span>
      </button>`;
  }).join('');

  const navHint = choices.length >= 2
    ? '&#9668; &#9658; or 1 / 2 to choose &#183; click to commit'
    : 'Enter to continue';
  const controls = `
    <div class="choices">${choicesHTML}</div>
    <div class="choice-hintline">${navHint}</div>
  `;

  contentEl.innerHTML = decisionShell({
    type: event.type,
    sceneId: event.scene || getSceneForEvent(event),
    kicker,
    title: event.title,
    body: event.text,
    controlsHTML: controls
  });
  hydrateScenes(contentEl);
  state.phase = 'event';
}

function getPlayableChoices(event) {
  if (!event || !Array.isArray(event.choices)) return [];
  if (event.choices.length <= 2) return event.choices;
  return event.choices.slice(0, 2);
}

function renderResult(resultText, effects) {
  if (state.justShipped) {
    state.justShipped = false;
    state.pendingScene = null;
    // The winning 5th credit skips the celebration overlay and goes straight to victory.
    if (state.appsShipped >= APPS_TO_SHIP) { nextWeek(); return; }
    showShippedScreen(resultText);
    return;
  }
  if (state.pendingScene) {
    const sceneId = state.pendingScene;
    state.pendingScene = null;
    showSceneOverlay(sceneId, () => renderResultInner(resultText, effects));
    return;
  }
  renderResultInner(resultText, effects);
}

// Dedicated "Shipped" celebration: rocket scene + SHIP CREDIT pips + headline.
// Dismiss advances the week (it replaces the normal outcome card for ships).
function showShippedScreen(copy) {
  const overlay = document.getElementById('scene-overlay');
  if (!overlay) { nextWeek(); return; }

  const pips = Array.from({ length: APPS_TO_SHIP }, (_, i) =>
    `<span class="credit ${i < state.appsShipped ? 'on' : 'off'}"></span>`).join('');
  const count = `${String(Math.min(state.appsShipped, APPS_TO_SHIP)).padStart(2, '0')} / ${String(APPS_TO_SHIP).padStart(2, '0')}`;

  overlay.innerHTML = `
    <div class="shipped-card">
      <div class="shipped-scene">
        <img class="ui-scene" src="assets/ui/shipped.png" alt="you shipped something real">
        <div class="scene-vignette"></div>
      </div>
      <div class="shipped-body">
        <div class="ship-credit-badge">
          <span class="scb-label">SHIP CREDIT</span>
          <span class="credits">${pips}</span>
          <span class="scb-count">${count}</span>
        </div>
        <div class="shipped-headline">You shipped something real.</div>
        <div class="shipped-copy">${escapeHTML(personalize(copy))}</div>
        <div class="scene-dismiss">Press Enter or tap to continue</div>
      </div>
    </div>
  `;
  overlay.classList.remove('hidden');

  const dismiss = () => {
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
    if (typeof document !== 'undefined') document.removeEventListener('keydown', onKey);
    overlay.removeEventListener('click', dismiss);
    nextWeek();
  };
  const onKey = event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); dismiss(); }
  };

  if (typeof setTimeout === 'function') {
    setTimeout(() => {
      document.addEventListener('keydown', onKey);
      overlay.addEventListener('click', dismiss, { once: true });
    }, 250);
  } else {
    dismiss();
  }
}

function renderResultInner(resultText, effects) {
  const event = state.currentEvent || {};
  const nextLabel = String(Math.min(state.week + 1, TOTAL_WEEKS + 1)).padStart(2, '0');
  const controls = `
    <button class="btn-continue" onclick="nextWeek()">CONTINUE&nbsp;&nbsp;&#9656;&nbsp;&nbsp;WEEK ${nextLabel}</button>
    ${renderHistory()}
  `;
  contentEl.innerHTML = decisionShell({
    type: event.type || 'quiet',
    sceneId: event.scene || getSceneForEvent(event),
    kicker: 'OUTCOME',
    title: state.lastChoiceLabel || 'Decision made',
    body: resultText,
    controlsHTML: controls
  });
  hydrateScenes(contentEl);
}

function renderHistory() {
  if (!state.history.length) return '';
  const last = state.history[state.history.length - 1];
  return `
    <div class="memory-line">
      <span class="dim">The trail remembers:</span>
      <span>${escapeHTML(last.choice)}</span>
    </div>
  `;
}

function renderEnding() {
  const ending = getEnding();
  state.phase = 'ending';
  hudEl.innerHTML = '';

  const totalRevenue = state.completedProjects.reduce((sum, project) => sum + (project.weeklyIncome * Math.max(1, TOTAL_WEEKS - project.weekShipped)), 0);
  const shipList = state.completedProjects.length
    ? state.completedProjects.map(project => `<li>${escapeHTML(project.name)} <span>${formatMoney(project.weeklyIncome)}/wk</span></li>`).join('')
    : '<li class="dim">No shipped apps made it out of the repo.</li>';

  const doRender = () => {
    contentEl.innerHTML = `
      <section class="ending screen">
        ${renderSceneBlock(ending.sceneId || 'late-night', 'ending-art', { moodFallback: true, type: ending.isWin ? 'building' : 'life' })}
        <div class="ending-badge ${ending.isWin ? 'win' : 'lose'}">${ending.isWin ? 'YEAR COMPLETE' : 'GAME OVER'}</div>
        <h1 class="ending-title">${escapeHTML(ending.title)}</h1>
        ${!ending.isWin && ending.cause ? `<div class="ending-cause"><span class="ending-cause-x">&#10005;</span> ${escapeHTML(ending.cause)}</div>` : ''}
        <p class="ending-description">${escapeHTML(ending.description)}</p>
        <div class="ending-stats">
          <div class="stat-row"><span>Weeks survived</span><strong>${Math.min(state.week - 1, TOTAL_WEEKS)}</strong></div>
          <div class="stat-row"><span>Ship credits</span><strong>${state.appsShipped}/${APPS_TO_SHIP}</strong></div>
          <div class="stat-row"><span>Final runway</span><strong>${formatMoney(Math.max(0, state.savings))}</strong></div>
          <div class="stat-row"><span>Peak momentum</span><strong>${state.peakMomentum}</strong></div>
          <div class="stat-row"><span>Est. trail revenue</span><strong>${formatMoney(totalRevenue)}</strong></div>
        </div>
        <ul class="ship-list">${shipList}</ul>
        <div class="ending-actions">
          <button class="btn-primary" onclick="renderIntro()"><span class="btn-key">Enter</span> Play Again</button>
          <a class="btn-secondary" href="${NEWSLETTER_URL}" target="_blank" rel="noopener noreferrer">Read Builder Notes</a>
          <a class="btn-secondary" href="${YOUTUBE_URL}" target="_blank" rel="noopener noreferrer">Watch Builds</a>
        </div>
      </section>
    `;
    hydrateScenes(contentEl);
  };

  // Straight to the result screen — it already shows the ending scene as its banner,
  // so a separate scene overlay first would just be a redundant click.
  doRender();
}

// ========================================
// GAME LOGIC
// ========================================

function startGame() {
  state.week = 1;
  state.tool = 'cursor'; // baseline build profile (tool-select screen was removed)
  state.savings = STARTING_SAVINGS;
  state.energy = 100;
  state.momentum = 50;
  state.corpLoad = 35;
  state.appsShipped = 0;
  state.money = ATTR_START.money;
  state.health = ATTR_START.health;
  state.relationships = ATTR_START.relationships;
  state.agency = ATTR_START.agency;
  state.attrPrev = null;
  state.attrFlash = false;
  state.hoverAttrs = [];
  state.justShipped = false;
  state.lastShipCopy = '';
  state.peakMomentum = 50;
  state.zeroEnergyWeeks = 0;
  state.zeroMomentumWeeks = 0;
  state.highCorpWeeks = 0;
  state.finalLaunchPending = false;
  state.lastEventId = null;
  state.recentEventIds = [];
  state.currentEvent = null;
  state.activeProject = null;
  state.completedProjects = [];
  state.totalPassiveIncome = 0;
  state.technicalSkill = 10;
  state.reputation = 30;
  state.familyScore = 0;
  state.audience = 0;
  state.firedInflections = [];
  state.pendingScene = null;
  state.history = [];

  renderProjectSelect(true);
}

function renderProjectSelect(isFirstProject = false) {
  state.phase = 'projectSelect';
  renderHUD();

  const completedIds = state.completedProjects.map(project => project.id);
  const available = PROJECTS.filter(project => !completedIds.includes(project.id));
  const offered = shuffle(available).slice(0, Math.min(3, available.length));
  state._offeredProjects = offered;

  const rowsHTML = offered.map((project, i) => {
    const estimate = estimateProject(project);
    return `
      <button class="prow project-choice" onclick="selectProject(${i})" data-index="${i}">
        <span class="prow-index">${i + 1}</span>
        <span class="prow-main">
          <span class="prow-name">${escapeHTML(project.name)}</span>
          <span class="prow-desc">${escapeHTML(project.description)}</span>
        </span>
        <span class="prow-tags">
          <span class="ptag ${project.size}">${project.size}</span>
          <span class="ptag dim">${estimate.weeks} wk</span>
          <span class="ptag dim">${formatMoney(estimate.income)}/wk upside</span>
        </span>
      </button>
    `;
  }).join('');

  const creditSegs = Array.from({ length: APPS_TO_SHIP }, (_, i) =>
    `<span class="credit ${i < state.appsShipped ? 'on' : 'off'}"></span>`).join('');

  contentEl.innerHTML = `
    <section class="select-card">
      <div class="select-main">
        <div class="select-topbar">
          <span class="proj-name dim">&#9656; No active build</span>
          <span class="select-ship"><span class="proj-ship-label">SHIP</span><span class="credits">${creditSegs}</span></span>
        </div>
        <div class="select-head">
          <span class="select-kicker">PROJECT</span>
          <span class="select-title">${isFirstProject ? 'Pick your first project' : 'What gets built next?'}</span>
        </div>
        <p class="select-desc">${isFirstProject
          ? 'The corporate machine is still humming in the background. Choose a side project with enough shape to become real.'
          : 'Momentum wants somewhere to go. Choose carefully; unfinished repos have emotional weight.'}</p>
        <div class="prows">${rowsHTML}</div>
      </div>
      <div class="select-scene">
        <img class="ui-scene" src="assets/ui/desk-tall.png" alt="night desk">
        <div class="scene-vignette"></div>
      </div>
    </section>
  `;
}

function selectProject(index) {
  if (state.phase !== 'projectSelect') return;

  if (index === -1) {
    applyEffects({ energy: 15, momentum: -4, corpLoad: -6, familyScore: 1 });
    recordHistory('Protected an evening instead of starting another repo.');
    state.currentEvent = createQuietWeekEvent();
    renderWeek();
    return;
  }

  const project = state._offeredProjects[index];
  if (!project) return;

  const estimate = estimateProject(project);
  state.activeProject = {
    id: project.id,
    name: project.name,
    description: project.description,
    size: project.size,
    weeksRequired: estimate.weeks,
    weeksWorked: 0,
    energyCostPerWeek: estimate.energy,
    baseIncome: project.baseIncome,
    launchRisk: project.launchRisk || 0
  };

  delete state._offeredProjects;
  recordHistory(`Started ${project.name}.`);
  state.currentEvent = Math.random() < QUIET_WEEK_CHANCE ? createQuietWeekEvent() : pickEvent();
  renderWeek();
}

// A finished project ships automatically — no decision. Award the credit(s) and
// show the celebration (or go straight to victory on the 5th). Attributes don't
// move here: meters change only from the player's tradeoff choices.
function shipActiveProject() {
  const project = state.activeProject;
  const shipCredits = SHIP_CREDITS[project.size] || 1;
  const qualityScore = calculateQuality(project);
  const toolStats = getEffectiveToolStats();
  const weeklyIncome = Math.max(5, Math.round(project.baseIncome * qualityScore * toolStats.passiveIncomeMod));

  state.completedProjects.push({
    id: project.id, name: project.name, size: project.size,
    quality: qualityScore, weeklyIncome, weekShipped: state.week
  });
  state.totalPassiveIncome = state.completedProjects.reduce((sum, p) => sum + p.weeklyIncome, 0);
  state.appsShipped += shipCredits;
  state.activeProject = null;

  if (state.appsShipped >= APPS_TO_SHIP) { renderEnding(); return; }

  state.phase = 'result';
  state.lastShipCopy = `${project.name} is live. That's ${shipCredits} more ship credit${shipCredits > 1 ? 's' : ''} banked.`;
  showShippedScreen(state.lastShipCopy);
}

function handleChoice(index) {
  if (state.phase !== 'event') return;

  const event = state.currentEvent;
  const choices = getPlayableChoices(event);
  if (!event || index >= choices.length) return;

  const choice = choices[index];
  state.lastChoiceLabel = choice.label;
  state.attrPrev = { money: state.money, health: state.health, relationships: state.relationships, agency: state.agency };
  state.hoverAttrs = [];
  applyEffects(choice.effects);
  recordHistory(choice.memory || choice.label);

  state.lastEventId = event.id;
  state.recentEventIds.push(event.id);
  state.recentEventIds = state.recentEventIds.slice(-8); // wider window — fewer repeats per run

  const spotlightScene = getSpotlightScene(event, choice);
  if (spotlightScene) state.pendingScene = spotlightScene;

  state.attrFlash = true;
  renderHUD();
  if (typeof clearTimeout === 'function') clearTimeout(state._flashTimer);
  if (typeof setTimeout === 'function') {
    state._flashTimer = setTimeout(() => {
      state.attrFlash = false;
      state.attrPrev = null;
      if (state.phase === 'result' || state.phase === 'event') renderHUD();
    }, 1600);
  } else {
    state.attrFlash = false;
    state.attrPrev = null;
  }

  state.phase = 'result';
  renderResult(choice.result || 'You make the call and keep moving.', choice.effects);
}

// Hover reveal: light up which meters a choice touches, without showing direction.
function lightMeters(keysCsv) {
  state.hoverAttrs = keysCsv ? keysCsv.split(',').filter(Boolean) : [];
  if (state.phase !== 'event') return;
  const meters = hudEl ? hudEl.querySelectorAll('.meter') : [];
  meters.forEach(meter => {
    meter.classList.toggle('lit', state.hoverAttrs.includes(meter.dataset.attr));
  });
}

function handleChoiceClick(index) {
  if (suppressChoiceClick) {
    suppressChoiceClick = false;
    return;
  }
  handleChoice(index);
}

function nextWeek() {
  if (state.phase !== 'result') return;

  // Resolve the run immediately: a win the instant 5 credits ship, or a loss the
  // instant a meter is at 0 — BEFORE the weekly recovery tick, so a recovery point
  // can't quietly undo a collapse you just caused.
  if (state.appsShipped >= APPS_TO_SHIP || checkGameOver()) {
    renderEnding();
    return;
  }

  if (state.finalLaunchPending) {
    state.finalLaunchPending = false;
    state.week = Math.min(state.week + 1, TOTAL_WEEKS + 1);
    renderEnding();
    return;
  }

  applyWeeklyTick();
  state.week++;

  if (checkGameOver()) {
    renderEnding();
    return;
  }

  if (state.activeProject && state.activeProject.weeksWorked >= state.activeProject.weeksRequired) {
    shipActiveProject();
    return;
  }

  if (state.week > TOTAL_WEEKS) {
    renderEnding();
    return;
  }

  const inflection = checkInflectionPoints();
  if (inflection) {
    state.currentEvent = inflection;
    renderWeek();
    return;
  }

  if (!state.activeProject && state.momentum > 12 && (state.week % 3 === 0 || Math.random() < 0.2)) {
    renderProjectSelect();
    return;
  }

  state.currentEvent = Math.random() < QUIET_WEEK_CHANCE ? createQuietWeekEvent() : pickEvent();
  renderWeek();
}

// Translate a legacy effects object into deltas on the four survival attributes.
// This keeps all 132 tuned event choices working while the game runs on M/H/R/A.
function effectToAttributes(effects) {
  const d = { money: 0, health: 0, relationships: 0, agency: 0 };
  if (!effects) return d;
  // Native cards declare attribute deltas directly (already in 0-10 points).
  const nativeKeys = ATTR_KEYS.filter(key => typeof effects[key] === 'number');
  if (nativeKeys.length) {
    nativeKeys.forEach(key => { d[key] += effects[key]; });
    return d;
  }
  if (typeof effects.savings === 'number') d.money += clamp(effects.savings / 1500, -4, 4);
  // Corporate reputation/standing reads as career capital → Money, not builder Agency.
  if (typeof effects.reputation === 'number') d.money += effects.reputation / 5;
  if (typeof effects.energy === 'number') d.health += effects.energy / 11;
  if (typeof effects.familyScore === 'number') d.relationships += effects.familyScore * 0.6;
  let ag = 0;
  if (typeof effects.momentum === 'number') ag += effects.momentum / 11;
  if (typeof effects.technicalSkill === 'number') ag += effects.technicalSkill / 3;
  if (typeof effects.audience === 'number') ag += effects.audience / 11;
  if (typeof effects.corpLoad === 'number') ag -= effects.corpLoad / 4;
  if (typeof effects.appsShipped === 'number') ag += effects.appsShipped * 0.3;
  d.agency += ag;
  return d;
}

// Which of the four attributes a choice touches — for the hover reveal and the
// "AFFECTS M H A" hints. Deliberately direction-free (spec: hide up/down).
function affectedAttributes(effects) {
  if (!effects) return [];
  // Native cards: the affected attributes are simply the keys present.
  const native = ATTR_KEYS.filter(key => effects[key]);
  if (native.length) return ATTR_KEYS.filter(key => native.includes(key));
  const set = new Set();
  if (effects.savings || effects.reputation) set.add('money');
  if (effects.energy) set.add('health');
  if (effects.familyScore) set.add('relationships');
  if (effects.momentum || effects.technicalSkill
    || effects.audience || effects.corpLoad || effects.appsShipped) set.add('agency');
  return ATTR_KEYS.filter(key => set.has(key));
}

function applyAttributeDeltas(deltas) {
  ATTR_KEYS.forEach(key => {
    state[key] = clamp(state[key] + (deltas[key] || 0), 0, ATTR_MAX);
  });
}

function applyEffects(effects) {
  if (!effects) return;

  applyAttributeDeltas(effectToAttributes(effects));

  const numericKeys = [
    'savings',
    'energy',
    'momentum',
    'corpLoad',
    'appsShipped',
    'familyScore',
    'technicalSkill',
    'reputation',
    'audience',
    'totalPassiveIncome'
  ];

  numericKeys.forEach(key => {
    if (typeof effects[key] === 'number') state[key] += effects[key];
  });

  state.energy = clamp(state.energy, 0, 100);
  state.momentum = clamp(state.momentum, 0, 100);
  state.corpLoad = clamp(state.corpLoad, 0, 100);
  state.technicalSkill = clamp(state.technicalSkill, 0, 100);
  state.reputation = clamp(state.reputation, 0, 100);
  state.audience = Math.max(0, state.audience);

  if (state.momentum > state.peakMomentum) state.peakMomentum = state.momentum;
}

function applyWeeklyTick() {
  const corpTax = Math.ceil(state.corpLoad / 30);
  const familyTax = state.familyScore < -4 ? 1 : 0;
  const passiveIncome = state.totalPassiveIncome;

  state.savings += WEEKLY_INCOME - WEEKLY_EXPENSES + passiveIncome;
  state.energy -= WEEKLY_ENERGY_DRAIN + corpTax + familyTax;
  state.momentum -= WEEKLY_MOMENTUM_DECAY;
  state.corpLoad += 2;

  if (state.activeProject) {
    state.energy -= state.activeProject.energyCostPerWeek;
    state.activeProject.weeksWorked += 1; // one week of progress per week, for a clean countdown
    state.technicalSkill = Math.min(100, state.technicalSkill + 2);
    state.momentum += 2;

    const tool = TOOLS[state.tool];
    if (tool.ceilingWeeks && state.activeProject.size !== 'small'
      && state.activeProject.weeksWorked === tool.ceilingWeeks) {
      state.activeProject.weeksRequired += 2;
      state.corpLoad += 3;
    }
  }

  state.energy = clamp(state.energy, 0, 100);
  state.momentum = clamp(state.momentum, 0, 100);
  state.corpLoad = clamp(state.corpLoad, 0, 100);

  // The four survival attributes change ONLY from player choices, never on the
  // weekly tick — so the meters never move on Continue, only when you decide.

  state.zeroEnergyWeeks = state.energy === 0 ? state.zeroEnergyWeeks + 1 : 0;
  state.zeroMomentumWeeks = state.momentum === 0 ? state.zeroMomentumWeeks + 1 : 0;
  state.highCorpWeeks = state.corpLoad >= 95 ? state.highCorpWeeks + 1 : 0;

  if (state.momentum > state.peakMomentum) state.peakMomentum = state.momentum;
}

function checkGameOver() {
  return ATTR_KEYS.some(key => state[key] <= 0);
}

function getEnding() {
  // Five endings (cards.md is the source of truth). Lose = a meter collapsed
  // or time ran out without enough credits; win = shipped 5 with all four alive.
  if (state.health <= 0) {
    return {
      isWin: false,
      title: 'Burnout',
      cause: 'Your HEALTH meter hit 0',
      sceneId: 'ending-burnout',
      description: "My body filed the last ticket and closed the laptop for me. Somewhere in the all-nighters and the skipped meals and “I’ll rest after this ship,” the after-this never came. The repo is fine. I am not."
    };
  }

  if (state.relationships <= 0) {
    return {
      isWin: false,
      title: 'Alone with the Repo',
      cause: 'Your RELATIONSHIPS meter hit 0',
      sceneId: 'ending-alone',
      description: "Everything I built still runs. The house is quiet in the wrong way. I won every argument about my evenings and lost the evenings — and the people who used to be in them."
    };
  }

  // Money or Agency at zero = you never actually made the leap.
  if (state.money <= 0 || state.agency <= 0) {
    return {
      isWin: false,
      title: 'Still a Spectator',
      cause: state.money <= 0 ? 'Your MONEY meter hit 0' : 'Your AGENCY meter hit 0',
      sceneId: 'ending-spectator',
      description: "Twenty-six weeks went by and I watched most of them. I stayed safe, stayed employed, stayed current on everyone else’s launches. The future got built — by other people — while I refreshed the feed and meant to start tomorrow. Tomorrow ran out."
    };
  }

  // Win: shipped enough credits with all four attributes still above 0.
  if (state.appsShipped >= APPS_TO_SHIP) {
    const fragile = Math.min(state.money, state.health, state.relationships, state.agency);
    if (fragile <= 3) {
      return {
        isWin: true,
        title: 'Barely Made It',
        sceneId: 'ending-barely',
        description: "I crossed the line on fumes. Five credits shipped — and one part of me running on empty: the sleep, the savings, or the people I kept saying “soon” to. It counts. It’s a win. I’m going to go fix what I let slide, starting tonight."
      };
    }
    return {
      isWin: true,
      title: 'The Balanced Builder',
      sceneId: 'ending-balanced',
      description: "Twenty-six weeks. Five things that didn’t exist before now do — and I’m still here: paid, rested, still married, still curious. I didn’t become a founder or a headline. I became someone who can actually build, and I kept the life that made building worth it."
    };
  }

  // Time ran out without enough credits → same as never leaving the sidelines.
  return {
    isWin: false,
    title: 'Still a Spectator',
    cause: `Time ran out — only ${state.appsShipped} of ${APPS_TO_SHIP} apps shipped`,
    sceneId: 'ending-spectator',
    description: `Twenty-six weeks gone, ${state.appsShipped} of ${APPS_TO_SHIP} credits shipped. I stayed safe, stayed busy, and watched the future get built by other people. I always meant to start tomorrow. Tomorrow ran out.`
  };
}

// ========================================
// EVENT SELECTION
// ========================================

function pickEvent() {
  let pool = [...EVENTS];

  // Headliner cards (native 4-attribute format) — always eligible, weighted up.
  if (typeof CARDS !== 'undefined') pool = pool.concat(CARDS);

  if (state.activeProject && typeof PROJECT_EVENTS !== 'undefined') {
    pool = pool.concat(PROJECT_EVENTS.filter(event => {
      if (!event.requiresActiveProject) return false;
      if (event.projectSizes && !event.projectSizes.includes(state.activeProject.size)) return false;
      return true;
    }));
  }

  pool = pool.filter(event => !state.recentEventIds.includes(event.id));
  if (!pool.length) pool = [...EVENTS];

  const weighted = [];
  pool.forEach(event => {
    const weight = getEventWeight(event);
    for (let i = 0; i < weight; i++) weighted.push(event);
  });

  let event = weighted[Math.floor(Math.random() * weighted.length)];
  if (typeof event.text === 'function') event = { ...event, text: event.text() };
  return event;
}

function eventAffectedAttributes(event) {
  const set = new Set();
  (event.choices || []).slice(0, 2).forEach(c => affectedAttributes(c.effects).forEach(k => set.add(k)));
  return [...set];
}

function getEventWeight(event) {
  let weight = event.weight || 3;
  if (event.type === 'work' && state.corpLoad >= 65) weight += 4;
  if (event.type === 'work' && state.corpLoad <= 30) weight -= 1;
  if (event.type === 'building' && state.activeProject) weight += 3;
  if (event.minAudience && state.audience < event.minAudience) weight = 0;

  // Pressure-aware: surface cards that touch your weakest meter, so the deck keeps
  // pressing where you're thin (the Reigns squeeze) and no meter is safe to ignore.
  const low = Math.min(state.money, state.health, state.relationships, state.agency);
  const lowKeys = ATTR_KEYS.filter(key => state[key] <= low + 1);
  if (eventAffectedAttributes(event).some(key => lowKeys.includes(key))) weight += 7;

  return Math.max(1, weight);
}

function checkInflectionPoints() {
  if (typeof INFLECTIONS === 'undefined') return null;
  for (const inflection of INFLECTIONS) {
    if (state.firedInflections.includes(inflection.id)) continue;
    if (inflection.condition(state)) {
      state.firedInflections.push(inflection.id);
      return inflection;
    }
  }
  return null;
}

function createQuietWeekEvent() {
  // A rare calm week. Still a real decision: spend the quiet recovering, or
  // spend it pushing forward. Recover trades Agency for Health/Relationships;
  // push the opposite. Two variants depending on whether a build is active.
  if (state.activeProject) {
    return {
      id: 'quiet-week',
      type: 'quiet',
      title: 'The Grind',
      scene: 'late-night',
      text: 'No reorg. No surprise review. Just a week of small commits and fewer meetings than usual. The rare kind of quiet you can actually spend.',
      choices: [
        {
          label: 'Use the quiet to build',
          hint: 'Progress now, recover later',
          effects: { momentum: 14, technicalSkill: 3, energy: -6, corpLoad: -3 },
          result: 'You pour the calm straight into the repo. No screenshot, no launch tweet — just the satisfying boring part of getting ahead. It costs you a little sleep.'
        },
        {
          label: 'Actually rest this week',
          hint: 'Refill before the next sprint',
          effects: { energy: 22, familyScore: 2, corpLoad: -4 },
          result: 'You let the build sit. Dinner at the table, a full night of sleep, a walk with no podcast. The work will still be there. So, refreshingly, will you.'
        }
      ]
    };
  }

  return {
    id: 'quiet-week',
    type: 'quiet',
    title: 'The Grind',
    scene: 'ending-builder',
    text: 'The calendar finally leaves you alone. A strange silence. Suspicious, but useful — and entirely yours to spend.',
    choices: [
      {
        label: 'Recover on purpose',
        hint: 'Rest is a strategy',
        effects: { energy: 24, familyScore: 2, corpLoad: -6 },
        result: 'You do not optimize the silence. You sit in it. You see the people you keep meaning to see. Revolutionary.'
      },
      {
        label: 'Sketch the next idea',
        hint: 'Tinker while it is calm',
        effects: { momentum: 8, technicalSkill: 4, energy: -5 },
        result: 'You open a blank repo and start poking. Nothing shipped, but your hands remember why you wanted to build in the first place. You skip a little sleep to do it.'
      }
    ]
  };
}

// ========================================
// PROJECTS AND OUTCOMES
// ========================================

function estimateProject(project) {
  const toolStats = getEffectiveToolStats();
  return {
    // Projects take a bit longer now, so the "weeks to ship" countdown is a real plan.
    weeks: Math.max(3, Math.ceil(project.baseWeeks * toolStats.buildSpeedMod) + 1),
    energy: Math.max(2, Math.ceil(project.baseEnergy * toolStats.energyMod * 0.36)),
    income: Math.round(project.baseIncome * toolStats.passiveIncomeMod)
  };
}

function getEffectiveToolStats() {
  const tool = TOOLS[state.tool];
  if (!tool) return { energyMod: 1, buildSpeedMod: 1, passiveIncomeMod: 1 };

  let energyMod = tool.energyMod;
  let buildSpeedMod = tool.buildSpeedMod;

  if (state.tool === 'codex-cli') {
    const skillFactor = state.technicalSkill / 100;
    energyMod = 1.3 - (0.7 * skillFactor);
    buildSpeedMod = 1.1 - (0.4 * skillFactor);
  }

  return { energyMod, buildSpeedMod, passiveIncomeMod: tool.passiveIncomeMod };
}

function calculateQuality(project) {
  const qualityRoll = Math.random();
  const momentumBonus = state.momentum / 100;
  const skillBonus = state.technicalSkill / 100;
  const reputationBonus = state.reputation / 150;
  const corpPenalty = state.corpLoad / 250;
  const riskPenalty = project.launchRisk || 0;
  return clamp((qualityRoll * 0.32) + (momentumBonus * 0.28) + (skillBonus * 0.25) + (reputationBonus * 0.15) - corpPenalty - riskPenalty, 0.05, 1);
}

// ========================================
// PIXEL ART SCENE OVERLAY
// ========================================

function renderSceneBlock(sceneId, className, options = {}) {
  const sceneMarkup = renderPixelArt(sceneId, options);
  if (sceneMarkup) return `<div class="${className}">${sceneMarkup}</div>`;
  if (options.moodFallback) return `<div class="${className}">${renderSceneMood(sceneId, options.type)}</div>`;
  return '';
}

function renderPixelArt(sceneId, options = {}) {
  const id = sceneId && SCENES[sceneId] ? sceneId : 'late-night';
  const allowFallback = Boolean(options.allowFallback);
  if (!generatedSceneIds.has(id) && !allowFallback) return '';
  return `<div class="scene-placeholder" data-scene="${id}" data-fallback="${allowFallback ? 'canvas' : 'none'}"></div>`;
}

function renderSceneMood(sceneId, type = 'quiet') {
  const id = sceneId && SCENES[sceneId] ? sceneId : 'late-night';
  const scene = SCENES[id];
  const moodType = ['work', 'building', 'life', 'quiet'].includes(type) ? type : 'quiet';
  return `
    <div class="scene-mood ${moodType}" data-scene="${id}">
      <span class="scene-mood-line"></span>
      <span class="scene-mood-caption">${escapeHTML(personalize(scene.caption))}</span>
    </div>
  `;
}

function hydrateScenes(container) {
  const placeholders = (container || document).querySelectorAll('.scene-placeholder');
  placeholders.forEach(placeholder => {
    const sceneId = placeholder.dataset.scene;
    if (!generatedSceneIds.has(sceneId)) {
      if (placeholder.dataset.fallback === 'canvas') {
        const canvas = getSceneCanvas(sceneId);
        if (canvas) placeholder.replaceWith(canvas);
      } else {
        placeholder.remove();
      }
      return;
    }

    const image = new Image();
    image.className = 'pixel-scene pixel-scene-generated';
    image.alt = SCENES[sceneId]?.caption || 'Pixel art scene';
    image.decoding = 'async';
    image.onload = () => placeholder.replaceWith(image);
    image.onerror = () => {
      if (placeholder.dataset.fallback === 'canvas') {
        const canvas = getSceneCanvas(sceneId);
        if (canvas) placeholder.replaceWith(canvas);
      } else {
        placeholder.remove();
      }
    };
    image.src = `assets/scenes/${sceneId}.png`;
  });
}

function showSceneOverlay(sceneId, callback) {
  const overlay = document.getElementById('scene-overlay');
  const scene = typeof SCENES !== 'undefined' ? SCENES[sceneId] : null;
  if (!overlay || !scene || !generatedSceneIds.has(sceneId)) {
    if (callback) callback();
    return;
  }

  overlay.innerHTML = `
    <div class="scene-card">
      ${renderPixelArt(sceneId)}
      <div class="scene-caption">${escapeHTML(personalize(scene.caption))}</div>
      <div class="scene-dismiss dim">Press Enter or tap to continue</div>
    </div>
  `;
  hydrateScenes(overlay);
  overlay.classList.remove('hidden');

  const dismiss = () => {
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
    document.removeEventListener('keydown', onKey);
    overlay.removeEventListener('click', dismiss);
    if (callback) callback();
  };

  const onKey = event => {
    if (event.key === 'Enter') dismiss();
  };

  setTimeout(() => {
    document.addEventListener('keydown', onKey);
    overlay.addEventListener('click', dismiss, { once: true });
  }, 250);
}

function getSceneForEvent(event) {
  if (!event) return 'late-night';
  if (event.scene) return event.scene;
  if (event.id === 'expense-home-repair') return 'home-repair';
  if (event.id === 'okr_dependency_maze') return 'okr-maze';
  if (event.id === 'strategy_summit') return 'strategy-summit';
  if (event.id === 'doc_comment_storm') return 'doc-comments';
  if (event.id === 'vp_review_queue') return 'vp-review';
  if (event.id === 'energizing_brainstorm' || event.id === 'team_shipping_streak') return 'team-good';
  if (event.id === 'amazing_designer') return 'designer';
  if (event.id === 'agentic_engineers') return 'agentic-engineers';
  if (event.id === 'customer_community') return 'customer-community';
  if (event.id === 'builder_support_queue') return 'support-queue';
  if (event.id === 'launch_flop') return 'launch-flop';
  if (event.id && event.id.includes('reorg')) return 'reorg';
  if (event.id && event.id.includes('review')) return 'doc-comments';
  if (event.id && event.id.includes('allhands')) return 'demo';
  if (event.id && event.id.includes('family')) return 'family';
  if (event.type === 'work') return 'office';
  if (event.type === 'life') return 'family';
  if (event.type === 'building') return state.momentum >= 75 ? 'ship' : 'late-night';
  return 'late-night';
}

function getSpotlightScene(event, choice) {
  if (choice.scene) return choice.scene;
  if (event.spotlightScene) return event.spotlightScene;
  if (event.id === 'late_night' && choice.label.includes('night')) return 'late-night';
  if (event.id === 'first_revenue') return 'ship';
  if (event.id === 'family_vacation') return 'family';
  if (event.id === 'laptop_drawing' || event.id === 'partner_question') return 'family';
  if (event.id === 'hacker_news' && choice.label.includes('NOW')) return 'late-night';
  return null;
}

// ========================================
// HELPERS
// ========================================

function personalize(text) {
  if (!text || !state.playerName) return text;
  return text.replace(/\{name\}/g, state.playerName);
}

function preloadCharacterSheets(charName) {
  ['idle', 'laptop'].forEach(sheet => {
    const img = new Image();
    img.src = `assets/avatars/${charName}_${sheet}.png`;
  });
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function recordHistory(choice) {
  state.history.push({ week: state.week, choice });
  state.history = state.history.slice(-MAX_HISTORY);
}

function formatMoney(n) {
  const sign = n < 0 ? '-' : '';
  return `${sign}$${Math.abs(Math.round(n)).toLocaleString()}`;
}

function getPercent(current, max) {
  return clamp(Math.round((current / max) * 100), 0, 100);
}

function getSavingsColor() {
  if (state.savings < 8000) return 'red';
  if (state.savings < 16000) return 'yellow';
  return 'green';
}

function getMeterClass(value) {
  if (value <= 30) return 'red';
  if (value <= 60) return 'yellow';
  return 'green';
}

function getInverseMeterClass(value) {
  if (value >= 75) return 'red';
  if (value >= 50) return 'yellow';
  return 'green';
}

function getFamilyLabel() {
  if (state.familyScore >= 5) return 'steady';
  if (state.familyScore >= 1) return 'warm';
  if (state.familyScore <= -5) return 'strained';
  if (state.familyScore <= -1) return 'thin';
  return 'okay';
}

function getFamilyClass() {
  if (state.familyScore <= -5) return 'red';
  if (state.familyScore <= -1) return 'yellow';
  return 'green';
}

function makeBar(current, max, width) {
  const filled = clamp(Math.round((current / max) * width), 0, width);
  const empty = width - filled;
  const pct = current / max;
  let colorClass = 'green';
  if (pct <= 0.3) colorClass = 'red';
  else if (pct <= 0.6) colorClass = 'yellow';
  return `<span class="bar-fill ${colorClass}">${'█'.repeat(filled)}</span><span class="bar-empty">${'░'.repeat(empty)}</span>`;
}

function formatEffectsHTML(effects) {
  if (!effects) return '<span class="effect-chip dim">no visible change</span>';
  const labels = {
    savings: 'Runway',
    energy: 'Energy',
    momentum: 'Momentum',
    appsShipped: 'Shipped',
    familyScore: 'Family',
    technicalSkill: 'Skill',
    reputation: 'Rep',
    audience: 'Audience',
    totalPassiveIncome: 'Income'
  };

  const parts = [];
  Object.entries(effects).forEach(([key, value]) => {
    if (typeof value !== 'number' || value === 0 || key.startsWith('_')) return;
    if (key === 'corpLoad') return;
    const isBadWhenPositive = key === 'corpLoad';
    const positive = value > 0;
    const good = isBadWhenPositive ? !positive : positive;
    const colorClass = good ? 'green' : 'red';
    const sign = positive ? '+' : '';
    const displayValue = key === 'savings' || key === 'totalPassiveIncome'
      ? `${sign}${formatMoney(value)}`
      : `${sign}${value}`;
    parts.push(`<span class="effect-chip ${colorClass}">${labels[key] || key} ${displayValue}</span>`);
  });

  return parts.join('') || '<span class="effect-chip dim">no visible change</span>';
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ========================================
// INPUT HANDLING
// ========================================

function handleArrowNav(event, selector) {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Enter') return false;

  const cards = contentEl.querySelectorAll(selector);
  if (!cards.length) return false;

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    const current = contentEl.querySelector(`${selector}.focused`);
    let index = current ? Array.from(cards).indexOf(current) : -1;
    index = event.key === 'ArrowDown'
      ? (index + 1) % cards.length
      : (index <= 0 ? cards.length - 1 : index - 1);

    cards.forEach(card => card.classList.remove('focused'));
    cards[index].classList.add('focused');
    cards[index].scrollIntoView({ block: 'nearest' });
    return true;
  }

  const focused = contentEl.querySelector(`${selector}.focused`);
  if (focused) {
    focused.click();
    return true;
  }

  return false;
}

function handleKeydown(event) {
  const overlay = document.getElementById('scene-overlay');
  if (overlay && !overlay.classList.contains('hidden')) return;

  if (document.activeElement && document.activeElement.tagName === 'INPUT') {
    if (event.key === 'Enter' && state.phase === 'nameCharacterSelect') {
      event.preventDefault();
      confirmNameCharacter();
    }
    return;
  }

  if (state.phase === 'intro' && event.key === 'Enter') {
    renderNameCharacterSelect();
    return;
  }

  if (state.phase === 'nameCharacterSelect') {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      const chars = Object.keys(CHARACTERS);
      const curIdx = chars.indexOf(state.character);
      const newIdx = event.key === 'ArrowRight' ? (curIdx + 1) % chars.length : (curIdx + chars.length - 1) % chars.length;
      selectCharPreview(chars[newIdx]);
      return;
    }
    if (event.key === 'Enter') confirmNameCharacter();
    return;
  }

  if (state.phase === 'toolSelect') {
    if (event.key >= '1' && event.key <= '5') {
      const keys = Object.keys(TOOLS);
      selectTool(keys[parseInt(event.key, 10) - 1]);
      return;
    }
    if (handleArrowNav(event, '.tool-card')) return;
    return;
  }

  if (state.phase === 'projectSelect') {
    if (event.key >= '1' && event.key <= '9') {
      const maxIndex = state._offeredProjects ? state._offeredProjects.length : 0;
      const index = parseInt(event.key, 10) - 1;
      if (index < maxIndex) selectProject(index);
      return;
    }
    if (handleArrowNav(event, '.prow')) return;
    return;
  }

  if (state.phase === 'event') {
    const eventData = state.currentEvent || createQuietWeekEvent();
    const choices = getPlayableChoices(eventData);
    if ((event.key === 'Enter' || event.key === ' ') && choices.length === 1) {
      event.preventDefault();
      handleChoice(0);
      return;
    }
    if ((event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') && choices.length >= 1) {
      event.preventDefault();
      handleChoice(0);
      return;
    }
    if ((event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') && choices.length >= 1) {
      event.preventDefault();
      handleChoice(choices.length >= 2 ? 1 : 0);
      return;
    }
    if (event.key >= '1' && event.key <= '9') {
      const index = parseInt(event.key, 10) - 1;
      if (index < choices.length) handleChoice(index);
      return;
    }
    if (handleArrowNav(event, '.choice-card')) return;
    return;
  }

  if (state.phase === 'result' && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    nextWeek();
    return;
  }

  if (state.phase === 'ending' && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    renderIntro();
  }
}

function handlePointerDown(event) {
  if (state.phase !== 'event') return;
  if (event.button && event.button !== 0) return;

  const eventCard = event.target.closest('.event.shell-card');
  const eventData = state.currentEvent || createQuietWeekEvent();
  const choices = getPlayableChoices(eventData);
  if (!eventCard || choices.length < 2) return;

  touchStart = {
    x: event.clientX,
    y: event.clientY,
    time: Date.now(),
    pointerId: event.pointerId,
    card: eventCard,
    dragging: false
  };

  if (event.target.setPointerCapture) {
    try {
      event.target.setPointerCapture(event.pointerId);
    } catch (error) {
      // Some browser targets cannot capture pointers; document listeners still handle the drag.
    }
  }
}

function handlePointerMove(event) {
  if (state.phase !== 'event' || !touchStart || event.pointerId !== touchStart.pointerId) return;

  const dx = event.clientX - touchStart.x;
  const dy = event.clientY - touchStart.y;
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);

  if (!touchStart.dragging) {
    if (absX < 10) return;
    if (absY > absX * 1.2) return;
    touchStart.dragging = true;
    touchStart.card.classList.add('is-dragging');
  }

  event.preventDefault();
  updateChoiceDrag(dx);
}

function handlePointerUp(event) {
  if (state.phase !== 'event' || !touchStart || event.pointerId !== touchStart.pointerId) return;
  const eventData = state.currentEvent || createQuietWeekEvent();
  const choices = getPlayableChoices(eventData);
  if (choices.length < 2) {
    cancelChoiceDrag();
    return;
  }

  const dx = event.clientX - touchStart.x;
  const dy = event.clientY - touchStart.y;
  const elapsed = Date.now() - touchStart.time;
  const wasDragging = touchStart.dragging;
  const eventCard = touchStart.card;
  touchStart = null;

  resetChoiceDrag(eventCard);
  if (wasDragging) {
    suppressChoiceClick = true;
    window.setTimeout(() => {
      suppressChoiceClick = false;
    }, 0);
  }

  if (elapsed > 900 || Math.abs(dx) < 90 || Math.abs(dx) < Math.abs(dy) * 1.15) return;
  handleChoice(dx < 0 ? 0 : 1);
}

function updateChoiceDrag(dx) {
  const eventCard = touchStart?.card;
  if (!eventCard) return;

  const maxOffset = 128;
  const clamped = clamp(dx, -maxOffset, maxOffset);
  const progress = Math.min(1, Math.abs(dx) / 110);
  const tilt = clamped * 0.035;

  eventCard.style.transform = `translateX(${clamped}px) rotate(${tilt}deg)`;
  eventCard.style.setProperty('--left-alpha', dx < 0 ? progress.toFixed(2) : '0');
  eventCard.style.setProperty('--right-alpha', dx > 0 ? progress.toFixed(2) : '0');
  eventCard.classList.toggle('drag-left', dx < -8);
  eventCard.classList.toggle('drag-right', dx > 8);
}

function cancelChoiceDrag() {
  resetChoiceDrag(touchStart?.card);
  touchStart = null;
}

function resetChoiceDrag(eventCard) {
  if (!eventCard) return;
  eventCard.style.transform = '';
  eventCard.style.removeProperty('--left-alpha');
  eventCard.style.removeProperty('--right-alpha');
  eventCard.classList.remove('is-dragging', 'drag-left', 'drag-right');
}

document.addEventListener('DOMContentLoaded', init);
