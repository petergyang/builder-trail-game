// ========================================
// THE BUILDER TRAIL — Game Engine (M2)
// ========================================

// --- Constants ---
const TOTAL_WEEKS = 26;
const WEEKLY_INCOME = 4000;
const WEEKLY_EXPENSES = 3500;
const WEEKLY_ENERGY_DRAIN = 4;
const WEEKLY_MOMENTUM_DECAY = 4;
const QUIET_WEEK_CHANCE = 0.08;
const QUIET_WEEK_ENERGY = 12;

// --- Tools ---
const TOOLS = {
  'cursor': {
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
    tagline: 'Your terminal co-pilot',
    description: 'Terminal-based, high autonomy. Lower energy cost but higher variance outcomes.',
    energyMod: 0.75,
    buildSpeedMod: 0.9,
    passiveIncomeMod: 1.0,
    momentumOnShip: 5,
    ceilingWeeks: null,
    specialText: 'Low energy, high variance'
  },
  'lovable': {
    name: 'Lovable / Bolt',
    tagline: 'Ship an MVP before lunch',
    description: 'Fastest prototyping, lowest energy. But projects hit a ceiling fast.',
    energyMod: 0.5,
    buildSpeedMod: 0.7,
    passiveIncomeMod: 0.7,
    momentumOnShip: 0,
    ceilingWeeks: 2,
    specialText: 'Fastest start, ceiling on big projects'
  },
  'replit': {
    name: 'Replit',
    tagline: 'Code, run, deploy — all in browser',
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
    tagline: 'Maximum power, maximum skill',
    description: 'Highest skill ceiling. Punishing early, unmatched late. Multi-agent workflows unlock.',
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
  savings: 30000,
  energy: 100,
  momentum: 50,
  appsShipped: 0,
  peakMomentum: 50,
  zeroEnergyWeeks: 0,
  zeroMomentumWeeks: 0,
  lastEventId: null,
  currentEvent: null,
  phase: 'intro', // intro | nameCharacterSelect | toolSelect | projectSelect | event | result | ending

  // Player identity
  playerName: '',
  character: 'Adam', // Adam | Alex | Amelia | Bob

  // M2: Tool system
  tool: null,

  // M2: Project system
  activeProject: null,
  completedProjects: [],
  totalPassiveIncome: 0,

  // M2: Hidden stats
  technicalSkill: 10,
  reputation: 30,
  familyScore: 0,

  // M2: Inflection points
  firedInflections: [],

  // M2: Pixel art overlay
  pendingScene: null
};

// --- DOM ---
let hudEl, contentEl;

function init() {
  hudEl = document.getElementById('hud');
  contentEl = document.getElementById('content');
  preloadSheets(); // Load tileset sprite sheets for scene rendering
  renderIntro();
  document.addEventListener('keydown', handleKeydown);
}

// ========================================
// RENDERING
// ========================================

function renderIntro() {
  state.phase = 'intro';
  hudEl.innerHTML = '';
  contentEl.innerHTML = `
    <div class="intro">
      <h1 class="title intro-line" style="animation-delay: 0s">The Builder Trail</h1>
      <div class="subtitle intro-line" style="animation-delay: 0.3s">A VIBE CODING SURVIVAL GAME</div>
      <div class="intro-text">
        <p class="intro-line" style="animation-delay: 0.8s">You are a PM at BigTechCo.</p>
        <p class="intro-line" style="animation-delay: 1.4s">You've been shipping PRDs, running sprints, and sitting through all-hands meetings for years.</p>
        <p class="intro-line" style="animation-delay: 2.2s">One night, you open a code editor.</p>
        <p class="intro-line dim" style="animation-delay: 3.2s">You have 26 weeks. Ship apps. Don't burn out.</p>
      </div>
      <button class="btn-primary intro-line" style="animation-delay: 4.0s" onclick="renderNameCharacterSelect()">
        <span class="btn-key">Enter</span> Begin
      </button>
    </div>
  `;
}

function renderNameCharacterSelect() {
  state.phase = 'nameCharacterSelect';
  hudEl.innerHTML = '';

  const characters = ['Adam', 'Alex', 'Amelia', 'Bob'];
  const charCards = characters.map((name, i) => `
    <button class="character-card ${i === 0 ? 'selected' : ''}" data-char="${name}" onclick="selectCharPreview('${name}')">
      <div class="char-sprite" style="
        background-image: url('assets/${name}_idle_16x16.png');
        background-position: 0 0;
        background-size: ${64 * 4}px ${32 * 4}px;
        width: ${16 * 4}px;
        height: ${32 * 4}px;
        image-rendering: pixelated;
      "></div>
    </button>
  `).join('');

  contentEl.innerHTML = `
    <div class="name-select">
      <h2 class="tool-select-title">Who are you?</h2>
      <p class="dim" style="margin-bottom: 24px;">Every builder needs a name.</p>

      <div class="name-input-row">
        <label class="resource-label" for="player-name">NAME</label>
        <input type="text" id="player-name" class="name-input"
               maxlength="16" placeholder="Enter your name"
               autocomplete="off" />
      </div>

      <p class="dim" style="margin: 28px 0 16px;">Choose your character:</p>
      <div class="character-grid">${charCards}</div>

      <button class="btn-primary" onclick="confirmNameCharacter()" style="margin-top: 28px;">
        <span class="btn-key">Enter</span> Continue
      </button>
    </div>
  `;

  // Focus the name input after render
  setTimeout(() => {
    const input = document.getElementById('player-name');
    if (input) input.focus();
  }, 100);
}

function selectCharPreview(name) {
  state.character = name;
  const cards = contentEl.querySelectorAll('.character-card');
  cards.forEach(c => {
    c.classList.toggle('selected', c.dataset.char === name);
  });
}

function confirmNameCharacter() {
  if (state.phase !== 'nameCharacterSelect') return;
  const input = document.getElementById('player-name');
  const name = input ? input.value.trim() : '';
  state.playerName = name || 'Builder';

  // Preload character sprite sheets (HUD animation + scene tiles)
  preloadCharacterSheets(state.character);
  loadCharacterTiles(state.character);
  clearSceneCache();

  renderToolSelect();
}

function renderToolSelect() {
  state.phase = 'toolSelect';
  hudEl.innerHTML = '';

  const toolKeys = Object.keys(TOOLS);
  const cardsHTML = toolKeys.map((key, i) => {
    const t = TOOLS[key];
    return `
      <button class="tool-card" onclick="selectTool('${key}')">
        <span class="choice-key">${i + 1}</span>
        <div class="tool-name">${t.name}</div>
        <div class="tool-tagline">${t.tagline}</div>
        <div class="tool-special">${t.specialText}</div>
      </button>
    `;
  }).join('');

  contentEl.innerHTML = `
    <div class="tool-select">
      <h2 class="tool-select-title">Choose Your Tool</h2>
      <p class="tool-select-subtitle dim">This is how you'll build. Choose wisely.</p>
      <div class="tool-grid">${cardsHTML}</div>
    </div>
  `;
}

function selectTool(toolKey) {
  if (state.phase !== 'toolSelect') return;
  state.tool = toolKey;
  startGame();
}

function getEffectiveToolStats() {
  const tool = TOOLS[state.tool];
  if (!tool) return { energyMod: 1, buildSpeedMod: 1, passiveIncomeMod: 1 };

  let energyMod = tool.energyMod;
  let buildSpeedMod = tool.buildSpeedMod;

  // Codex CLI scales with Technical Skill
  if (state.tool === 'codex-cli') {
    const skillFactor = state.technicalSkill / 100;
    energyMod = 1.3 - (0.7 * skillFactor);
    buildSpeedMod = 1.1 - (0.4 * skillFactor);
  }

  return { energyMod, buildSpeedMod, passiveIncomeMod: tool.passiveIncomeMod };
}

function renderHUD() {
  const barWidth = 20;
  const toolName = state.tool ? TOOLS[state.tool].name : '';
  const toolBit = toolName ? ` <span class="prompt-tool">[${toolName}]</span>` : '';

  const incomeHTML = state.totalPassiveIncome > 0
    ? `<div class="resource-row">
        <span class="resource-label">INCOME</span>
        <span class="resource-value green">+${formatMoney(state.totalPassiveIncome)}/wk</span>
      </div>`
    : '';

  const projectHTML = state.activeProject
    ? `<div class="resource-row">
        <span class="resource-label">PROJECT</span>
        <span class="resource-bar">${makeBar(state.activeProject.weeksWorked, state.activeProject.weeksRequired, 10)}</span>
        <span class="resource-value">${state.activeProject.name} <span class="dim">${state.activeProject.weeksWorked}/${state.activeProject.weeksRequired}wk</span></span>
      </div>`
    : '';

  const charName = state.character || 'Adam';
  const displayName = state.playerName || 'builder';

  hudEl.innerHTML = `
    <div class="hud-row">
      <div class="hud-sprite hud-sprite-${charName.toLowerCase()}"></div>
      <div class="hud-text">
        <div class="hud-prompt">
          <span class="prompt-path">~/${displayName.toLowerCase()}/trail</span>${toolBit}
          <span class="prompt-separator"> $ </span>
          <span class="prompt-week">week ${state.week} of ${TOTAL_WEEKS}</span>
        </div>
        <div class="hud-resources">
      <div class="resource-row">
        <span class="resource-label">SAVINGS</span>
        <span class="resource-value ${getSavingsColor()}">${formatMoney(state.savings)}${state.totalPassiveIncome > 0 ? ' <span class="dim green">(+' + formatMoney(state.totalPassiveIncome) + '/wk)</span>' : ''}</span>
      </div>
      <div class="resource-row">
        <span class="resource-label">ENERGY</span>
        <span class="resource-bar">${makeBar(state.energy, 100, barWidth)}</span>
        <span class="resource-value">${state.energy}</span>
      </div>
      <div class="resource-row">
        <span class="resource-label">MOMENTUM</span>
        <span class="resource-bar">${makeBar(state.momentum, 100, barWidth)}</span>
        <span class="resource-value">${state.momentum}</span>
      </div>
      <div class="resource-row">
        <span class="resource-label">SHIPPED</span>
        <span class="resource-value">${state.appsShipped} app${state.appsShipped !== 1 ? 's' : ''}</span>
      </div>
      ${projectHTML}
        </div>
      </div>
    </div>
  `;
}

function renderWeek() {
  renderHUD();

  const event = state.currentEvent;
  const isQuiet = !event;
  const isAutoEvent = event && event.choices.length === 1;

  if (isQuiet) {
    // Quiet week: apply energy boost and show result directly
    const effects = { energy: QUIET_WEEK_ENERGY };
    applyEffects(effects);
    renderHUD();

    contentEl.innerHTML = `
      <div class="event">
        <div class="event-header">
          <span class="event-type quiet">quiet week</span>
          <span class="event-title">The Grind</span>
        </div>
        <p class="event-text">No fires at work. No midnight inspiration. Just a normal week. You rest a little.</p>
        <div class="result">
          <div class="result-effects">${formatEffectsHTML(effects)}</div>
        </div>
        <button class="btn-primary" onclick="nextWeek()">
          <span class="btn-key">Enter</span> Next Week
        </button>
      </div>
    `;
    state.phase = 'result';

  } else if (isAutoEvent) {
    // Auto event: apply effects and show result directly
    const choice = event.choices[0];
    applyEffects(choice.effects);
    renderHUD();

    contentEl.innerHTML = `
      <div class="event">
        <div class="event-header">
          <span class="event-type ${event.type}">${event.type}</span>
          <span class="event-title">${event.title}</span>
        </div>
        <p class="event-text">${personalize(event.text)}</p>
        <div class="result">
          <p class="result-text">${personalize(choice.result)}</p>
          <div class="result-effects">${formatEffectsHTML(choice.effects)}</div>
        </div>
        <button class="btn-primary" onclick="nextWeek()">
          <span class="btn-key">Enter</span> Next Week
        </button>
      </div>
    `;
    state.phase = 'result';

  } else {
    // Choice event: show choices, wait for input
    const choicesHTML = event.choices.map((c, i) => `
      <button class="choice-card" onclick="handleChoice(${i})" data-index="${i}">
        <span class="choice-key">${i + 1}</span>
        <div class="choice-content">
          <div class="choice-label">${c.label}</div>
          ${c.hint ? `<div class="choice-hint dim">${c.hint}</div>` : ''}
        </div>
      </button>
    `).join('');

    contentEl.innerHTML = `
      <div class="event">
        <div class="event-header">
          <span class="event-type ${event.type}">${event.type}</span>
          <span class="event-title">${event.title}</span>
        </div>
        <p class="event-text">${personalize(event.text)}</p>
        <div class="choices">${choicesHTML}</div>
      </div>
    `;
    state.phase = 'event';
  }
}

function renderResult(resultText, effects) {
  // Show scene overlay first if pending
  if (state.pendingScene) {
    const sceneId = state.pendingScene;
    state.pendingScene = null;
    showSceneOverlay(sceneId, () => {
      renderResultInner(resultText, effects);
    });
    return;
  }
  renderResultInner(resultText, effects);
}

function renderResultInner(resultText, effects) {
  contentEl.innerHTML = `
    <div class="result">
      <p class="result-text">${personalize(resultText)}</p>
      <div class="result-effects">${formatEffectsHTML(effects)}</div>
      <button class="btn-primary" onclick="nextWeek()">
        <span class="btn-key">Enter</span> Next Week
      </button>
    </div>
  `;
}

function renderEnding() {
  const ending = getEnding();
  state.phase = 'ending';
  hudEl.innerHTML = '';

  const toolName = state.tool ? TOOLS[state.tool].name : 'None';
  const totalRevenue = state.completedProjects.reduce((sum, p) => sum + (p.weeklyIncome * TOTAL_WEEKS), 0);

  const doRender = () => {
    contentEl.innerHTML = `
      <div class="ending">
        ${ending.sceneId && SCENES[ending.sceneId] ? renderPixelArt(ending.sceneId) : ''}
        <div class="ending-badge ${ending.isWin ? 'win' : 'lose'}">
          ${ending.isWin ? 'YEAR COMPLETE' : 'GAME OVER'}
        </div>
        <h1 class="ending-title">${ending.title}</h1>
        <p class="ending-description">${ending.description}</p>
        <div class="ending-stats">
          <div class="stat-row">
            <span class="stat-label">Weeks survived</span>
            <span class="stat-value">${Math.min(state.week - 1, TOTAL_WEEKS)}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Apps shipped</span>
            <span class="stat-value">${state.appsShipped}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Final savings</span>
            <span class="stat-value">${formatMoney(Math.max(0, state.savings))}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Peak momentum</span>
            <span class="stat-value">${state.peakMomentum}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Tool used</span>
            <span class="stat-value">${toolName}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Passive income</span>
            <span class="stat-value">${formatMoney(state.totalPassiveIncome)}/wk</span>
          </div>
        </div>
        <button class="btn-primary" onclick="renderIntro()">
          <span class="btn-key">Enter</span> Play Again
        </button>
      </div>
    `;
    hydrateScenes(contentEl);
  };

  // Show ending scene overlay if available
  if (ending.sceneId) {
    showSceneOverlay(ending.sceneId, doRender);
  } else {
    doRender();
  }
}

// ========================================
// GAME LOGIC
// ========================================

function startGame() {
  state.week = 1;
  state.savings = 30000;
  state.energy = 100;
  state.momentum = 50;
  state.appsShipped = 0;
  state.peakMomentum = 50;
  state.zeroEnergyWeeks = 0;
  state.zeroMomentumWeeks = 0;
  state.lastEventId = null;
  state.currentEvent = null;

  // M2 resets
  state.activeProject = null;
  state.completedProjects = [];
  state.totalPassiveIncome = 0;
  state.technicalSkill = 10;
  state.reputation = 30;
  state.familyScore = 0;
  state.firedInflections = [];
  state.pendingScene = null;

  // First week: pick a project
  renderProjectSelect();
}

function renderProjectSelect() {
  state.phase = 'projectSelect';
  renderHUD();

  const completedIds = state.completedProjects.map(p => p.id);
  const available = PROJECTS.filter(p => !completedIds.includes(p.id));
  const shuffled = available.sort(() => Math.random() - 0.5);
  const offered = shuffled.slice(0, Math.min(3, shuffled.length));

  const toolStats = getEffectiveToolStats();

  const sizeHints = {
    small: 'Quick build \u00b7 A few weeks',
    medium: 'Steady commitment \u00b7 Several weeks',
    large: 'Major undertaking \u00b7 Over a month'
  };

  const cardsHTML = offered.map((proj, i) => {
    return `
      <button class="choice-card" onclick="selectProject(${i})">
        <span class="choice-key">${i + 1}</span>
        <div class="choice-content">
          <div class="choice-label">${proj.name}</div>
          <div class="project-desc dim">${proj.description}</div>
          <div class="choice-hint dim">${sizeHints[proj.size]}</div>
        </div>
      </button>
    `;
  }).join('');

  const skipIndex = offered.length;
  const skipOption = `
    <button class="choice-card" onclick="selectProject(-1)">
      <span class="choice-key">${skipIndex + 1}</span>
      <div class="choice-content">
        <div class="choice-label">Take a break from projects</div>
        <div class="choice-hint dim">Rest up, but lose some drive</div>
      </div>
    </button>
  `;

  state._offeredProjects = offered;

  contentEl.innerHTML = `
    <div class="event">
      <div class="event-header">
        <span class="event-type building">project</span>
        <span class="event-title">What will you build next?</span>
      </div>
      <p class="event-text">You've got time and energy. Pick a project to start working on.</p>
      <div class="choices">${cardsHTML}${skipOption}</div>
    </div>
  `;
}

function selectProject(index) {
  if (state.phase !== 'projectSelect') return;

  if (index === -1) {
    state.activeProject = null;
    applyEffects({ energy: 5, momentum: -3 });
  } else {
    const proj = state._offeredProjects[index];
    const toolStats = getEffectiveToolStats();

    state.activeProject = {
      id: proj.id,
      name: proj.name,
      description: proj.description,
      size: proj.size,
      weeksRequired: Math.ceil(proj.baseWeeks * toolStats.buildSpeedMod),
      weeksWorked: 0,
      energyCostPerWeek: Math.ceil(proj.baseEnergy * toolStats.energyMod),
      baseIncome: proj.baseIncome
    };
  }

  delete state._offeredProjects;

  // Continue to regular event for this week
  state.currentEvent = Math.random() < QUIET_WEEK_CHANCE ? null : pickEvent();
  renderWeek();
}

function renderProjectComplete() {
  state.phase = 'event';

  const project = state.activeProject;
  const qualityRoll = Math.random();
  const momentumBonus = state.momentum / 100;
  const skillBonus = state.technicalSkill / 100;
  const qualityScore = clamp((qualityRoll * 0.4) + (momentumBonus * 0.3) + (skillBonus * 0.3), 0, 1);

  const toolStats = getEffectiveToolStats();
  const weeklyIncome = Math.round(project.baseIncome * qualityScore * toolStats.passiveIncomeMod);

  const tool = TOOLS[state.tool];
  const ceilingPenalty = (tool.ceilingWeeks && project.size !== 'small')
    ? " The AI-generated code hit a wall — you had to rewrite chunks manually." : '';

  const shipMomentum = 20 + (tool.momentumOnShip || 0);

  let qualityText;
  if (qualityScore >= 0.8) qualityText = "It's polished. You're proud of this one.";
  else if (qualityScore >= 0.5) qualityText = "It's solid. Not perfect, but it works.";
  else if (qualityScore >= 0.3) qualityText = "It's rough around the edges. Could use more time.";
  else qualityText = "Honestly? It's janky. The code is held together with duct tape.";

  state.currentEvent = {
    id: 'project-complete-' + project.id,
    type: 'building',
    title: `${project.name} is Ready`,
    text: `You've been working on ${project.name} for ${project.weeksWorked} weeks. ${qualityText}${ceilingPenalty}`,
    choices: [
      {
        label: 'Ship it!',
        hint: 'Put it out there',
        effects: { momentum: shipMomentum, appsShipped: 1 },
        result: weeklyIncome > 150
          ? `You hit deploy. Within a week, people are signing up. It's making ${formatMoney(weeklyIncome)}/week. You built something real.`
          : `It's live. A few people try it. Revenue trickles in at ${formatMoney(weeklyIncome)}/week. Not a hit, but it's shipped.`,
        _shipData: { id: project.id, name: project.name, size: project.size, quality: qualityScore, weeklyIncome }
      },
      {
        label: 'Abandon it — not good enough',
        hint: 'Walk away, start fresh',
        effects: { momentum: -15, energy: 10 },
        result: "You close the repo. It wasn't right. The momentum hit stings, but you're free to try something new.",
        _shipData: null
      }
    ]
  };

  renderWeek();
}

function handleChoice(index) {
  if (state.phase !== 'event') return;

  const event = state.currentEvent;
  if (!event || index >= event.choices.length) return;

  const choice = event.choices[index];
  applyEffects(choice.effects);

  // Handle project ship/abandon
  if ('_shipData' in choice) {
    if (choice._shipData) {
      state.completedProjects.push(choice._shipData);
      state.totalPassiveIncome = state.completedProjects.reduce((sum, p) => sum + p.weeklyIncome, 0);
      state.reputation = Math.min(100, state.reputation + 10);
      state.pendingScene = 'ship';
    } else if (choice._shipData === null && state.activeProject) {
      state.reputation = Math.max(0, state.reputation - 5);
    }
    state.activeProject = null;
  }

  // Trigger scenes for specific events
  if (event.id === 'late_night' && index === 0) state.pendingScene = 'late-night';
  if (event.id === 'laptop_drawing') state.pendingScene = 'family';
  if (event.id === 'board_games' && index === 0) state.pendingScene = 'family';
  if (event.id === 'flow_state' && index === 1) state.pendingScene = 'family';
  if (event.id === 'flow_state' && index === 0) state.pendingScene = 'flow-state';
  if (event.id === 'coffee_shop') state.pendingScene = 'coffee-shop';
  if (event.id === 'family_vacation') state.pendingScene = 'vacation';
  if (event.id === 'first_revenue') state.pendingScene = 'payday';
  if (event.id === 'hacker_news' && index === 0) state.pendingScene = 'late-night';
  if (event.id === 'partner_question') state.pendingScene = 'family';
  if (event.id === 'exercise' && index === 0) state.pendingScene = 'sunrise';
  if (event.id === 'good_sleep') state.pendingScene = 'sunrise';
  if (event.id === 'kid_sick' && index === 0) state.pendingScene = 'family';
  if (event.id === 'swim_lessons' && index === 1) state.pendingScene = 'family';
  if (event.id === 'scope_creep' && index >= 1) state.pendingScene = 'ship';
  if (event.id === 'old_friend' && index === 0) state.pendingScene = 'coffee-shop';
  if (event.id === 'bedtime_routine' && index === 0) state.pendingScene = 'family';

  renderHUD();
  state.phase = 'result';
  renderResult(choice.result, choice.effects);
}

function nextWeek() {
  if (state.phase !== 'result') return;

  // Weekly tick (day job, expenses, energy drain, momentum decay, project progress)
  applyWeeklyTick();
  state.week++;

  // Check lose conditions
  if (checkGameOver()) {
    state.phase = 'ending';
    renderEnding();
    return;
  }

  // Check if year is complete
  if (state.week > TOTAL_WEEKS) {
    state.phase = 'ending';
    renderEnding();
    return;
  }

  // Check project completion
  if (state.activeProject && state.activeProject.weeksWorked >= state.activeProject.weeksRequired) {
    renderProjectComplete();
    return;
  }

  // Check inflection points
  const inflection = checkInflectionPoints();
  if (inflection) {
    state.currentEvent = inflection;
    renderWeek();
    return;
  }

  // If no active project, offer project selection periodically
  if (!state.activeProject && state.momentum > 15 && state.week % 3 === 0) {
    renderProjectSelect();
    return;
  }

  // Normal event flow
  state.currentEvent = Math.random() < QUIET_WEEK_CHANCE ? null : pickEvent();
  renderWeek();
}

function applyEffects(effects) {
  if (!effects) return;
  if (effects.savings) state.savings += effects.savings;
  if (effects.energy) state.energy += effects.energy;
  if (effects.momentum) state.momentum += effects.momentum;
  if (effects.appsShipped) state.appsShipped += effects.appsShipped;
  if (effects.familyScore) state.familyScore += effects.familyScore;

  state.energy = clamp(state.energy, 0, 100);
  state.momentum = clamp(state.momentum, 0, 100);

  if (state.momentum > state.peakMomentum) {
    state.peakMomentum = state.momentum;
  }
}

function applyWeeklyTick() {
  // Day job + passive income
  state.savings += WEEKLY_INCOME - WEEKLY_EXPENSES + state.totalPassiveIncome;

  // Base drains
  state.energy -= WEEKLY_ENERGY_DRAIN;
  state.momentum -= WEEKLY_MOMENTUM_DECAY;

  // Active project: drain energy, advance progress, grow skill
  if (state.activeProject) {
    state.energy -= state.activeProject.energyCostPerWeek;
    state.activeProject.weeksWorked++;
    state.technicalSkill = Math.min(100, state.technicalSkill + 2);
    state.momentum += 2; // building counteracts decay

    // Lovable ceiling: medium/large projects stall after ceilingWeeks
    const tool = TOOLS[state.tool];
    if (tool.ceilingWeeks && state.activeProject.size !== 'small'
        && state.activeProject.weeksWorked === tool.ceilingWeeks) {
      state.activeProject.weeksRequired += 2;
    }
  }

  state.energy = clamp(state.energy, 0, 100);
  state.momentum = clamp(state.momentum, 0, 100);

  // Track consecutive zero weeks for lose conditions
  if (state.energy === 0) {
    state.zeroEnergyWeeks++;
  } else {
    state.zeroEnergyWeeks = 0;
  }

  if (state.momentum === 0) {
    state.zeroMomentumWeeks++;
  } else {
    state.zeroMomentumWeeks = 0;
  }

  if (state.momentum > state.peakMomentum) {
    state.peakMomentum = state.momentum;
  }
}

function checkGameOver() {
  if (state.savings <= 0) return true;
  if (state.zeroEnergyWeeks >= 2) return true;
  if (state.zeroMomentumWeeks >= 5) return true;
  return false;
}

function getEnding() {
  // Lose conditions
  if (state.savings <= 0) {
    return { isWin: false, title: 'Broke', sceneId: 'burnout',
      description: "The money ran out. Rent, daycare, API bills — it adds up fast in the Bay Area. The dream isn't dead, but the runway is." };
  }
  if (state.zeroEnergyWeeks >= 2) {
    return { isWin: false, title: 'Burnout', sceneId: 'burnout',
      description: "Two weeks of zero energy. Your body chose for you. The laptop stays closed." };
  }
  if (state.zeroMomentumWeeks >= 5) {
    return { isWin: false, title: 'Lost the Thread', sceneId: null,
      description: "Five weeks without touching code. The editor gathers dust. You meant to get back to it. You always meant to." };
  }

  // Win conditions — success × family matrix
  const successScore = state.appsShipped * 10 + (state.totalPassiveIncome / 50);
  const fs = state.familyScore;

  if (successScore >= 30) {
    if (fs >= 3) return { isWin: true, title: 'Sustainable Builder', sceneId: 'ending-builder',
      description: "You shipped real products AND stayed present for your family. The rarest ending. You proved it doesn't have to be either/or." };
    if (fs <= -3) return { isWin: true, title: 'The Workaholic', sceneId: 'late-night',
      description: "You shipped everything. But at what cost? Your kid's drawings show you holding a laptop. Your spouse stopped asking about your day." };
    return { isWin: true, title: 'The Builder', sceneId: 'ending-builder',
      description: "Apps shipped, income flowing. You're not a PM who codes — you're a builder. The family stuff... you'll figure that out next." };
  }
  if (successScore >= 15) {
    if (fs >= 3) return { isWin: true, title: 'Present Parent', sceneId: 'family',
      description: "You didn't ship the most, but your family never doubted you were there. And you still built something real. That's enough." };
    if (fs <= -3) return { isWin: true, title: 'The Grinder', sceneId: 'burnout',
      description: "You shipped some things. Missed some things. Your spouse says 'we need to talk' and you know it's not about the code." };
    return { isWin: true, title: 'The Shipper', sceneId: 'flow-state',
      description: "Not everything worked, but you shipped. Most people talk about building. You actually did it." };
  }
  // Low success
  if (fs >= 3) return { isWin: true, title: 'The Good Parent', sceneId: 'family',
    description: "You chose your family over the grind. Not much shipped, but your kid's drawing now shows you holding their hand." };
  if (fs <= -3) return { isWin: false, title: 'Lost in the Grind', sceneId: 'burnout',
    description: "You sacrificed family time but didn't ship much either. The worst of both worlds. Time to reset." };
  return { isWin: false, title: 'The Tinkerer', sceneId: 'late-night',
    description: "You tinkered. You learned. You didn't quite ship or quite show up. But the seed is planted." };
}

// ========================================
// HELPERS
// ========================================

function pickEvent() {
  // Build the pool: base events + matching tool events + matching project events
  let pool = [...EVENTS];

  if (state.tool && typeof TOOL_EVENTS !== 'undefined') {
    pool = pool.concat(TOOL_EVENTS.filter(e => {
      if (!e.tools.includes(state.tool)) return false;
      if (e.minTechnicalSkill && state.technicalSkill < e.minTechnicalSkill) return false;
      return true;
    }));
  }

  if (state.activeProject && typeof PROJECT_EVENTS !== 'undefined') {
    pool = pool.concat(PROJECT_EVENTS.filter(e => {
      if (!e.requiresActiveProject) return false;
      if (e.projectSizes && !e.projectSizes.includes(state.activeProject.size)) return false;
      return true;
    }));
  }

  let event;
  let attempts = 0;
  do {
    event = pool[Math.floor(Math.random() * pool.length)];
    attempts++;
  } while (event.id === state.lastEventId && attempts < 10);

  state.lastEventId = event.id;

  // Handle dynamic text functions
  if (typeof event.text === 'function') {
    event = { ...event, text: event.text() };
  }

  return event;
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

// --- Pixel Art Scene Overlay ---

function renderPixelArt(sceneId) {
  // Returns a placeholder; call hydrateScene() after innerHTML is set
  const scene = SCENES[sceneId];
  if (!scene) return '';
  return `<div class="scene-placeholder" data-scene="${sceneId}"></div>`;
}

function hydrateScenes(container) {
  const placeholders = (container || document).querySelectorAll('.scene-placeholder');
  placeholders.forEach(ph => {
    const canvas = getSceneCanvas(ph.dataset.scene);
    if (canvas) {
      canvas.style.width = (SCENES[ph.dataset.scene].width * TILE_SIZE * SCENE_SCALE) + 'px';
      canvas.style.height = (SCENES[ph.dataset.scene].height * TILE_SIZE * SCENE_SCALE) + 'px';
      ph.replaceWith(canvas);
    }
  });
}

function showSceneOverlay(sceneId, callback) {
  const overlay = document.getElementById('scene-overlay');
  if (!overlay) { if (callback) callback(); return; }

  const scene = typeof SCENES !== 'undefined' ? SCENES[sceneId] : null;
  if (!scene) { if (callback) callback(); return; }

  overlay.innerHTML = `
    <div class="scene-card">
      ${renderPixelArt(sceneId)}
      <div class="scene-caption">${personalize(scene.caption)}</div>
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

  const onKey = (e) => {
    if (e.key === 'Enter') dismiss();
  };

  setTimeout(() => {
    document.addEventListener('keydown', onKey);
    overlay.addEventListener('click', dismiss, { once: true });
  }, 300);
}

function personalize(text) {
  if (!text || !state.playerName) return text;
  return text.replace(/\{name\}/g, state.playerName);
}

function preloadCharacterSheets(charName) {
  const sheets = ['idle_anim', 'sit2', 'phone'];
  sheets.forEach(sheet => {
    const img = new Image();
    img.src = `assets/${charName}_${sheet}_16x16.png`;
  });
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function formatMoney(n) {
  const sign = n < 0 ? '-' : '';
  return sign + '$' + Math.abs(n).toLocaleString();
}

function getSavingsColor() {
  if (state.savings < 10000) return 'red';
  if (state.savings < 20000) return 'yellow';
  return '';
}

function makeBar(current, max, width) {
  const filled = Math.round((current / max) * width);
  const empty = width - filled;
  const pct = current / max;

  let colorClass = 'green';
  if (pct <= 0.3) colorClass = 'red';
  else if (pct <= 0.6) colorClass = 'yellow';

  return `<span class="bar-fill ${colorClass}">${'\u2588'.repeat(filled)}</span><span class="bar-empty">${'\u2591'.repeat(empty)}</span>`;
}

function formatEffectsHTML(effects) {
  if (!effects) return '';
  const parts = [];
  const labels = {
    savings: 'Savings',
    energy: 'Energy',
    momentum: 'Momentum',
    appsShipped: 'Shipped',
    familyScore: 'Family'
  };

  for (const [key, val] of Object.entries(effects)) {
    if (val === 0) continue;
    if (key.startsWith('_')) continue;
    const sign = val > 0 ? '+' : '';
    const colorClass = val > 0 ? 'green' : 'red';

    if (key === 'savings') {
      parts.push(`<span class="${colorClass}">${sign}${formatMoney(val)}</span>`);
    } else if (key === 'appsShipped') {
      parts.push(`<span class="green">+${val} app shipped</span>`);
    } else {
      parts.push(`<span class="${colorClass}">${labels[key] || key} ${sign}${val}</span>`);
    }
  }

  return parts.join('<span class="dim"> · </span>');
}

// ========================================
// INPUT HANDLING
// ========================================

function handleArrowNav(e, selector) {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Enter') return false;

  const cards = contentEl.querySelectorAll(selector);
  if (!cards.length) return false;

  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    const current = contentEl.querySelector(selector + '.focused');
    let index = current ? Array.from(cards).indexOf(current) : -1;

    if (e.key === 'ArrowDown') {
      index = (index + 1) % cards.length;
    } else {
      index = index <= 0 ? cards.length - 1 : index - 1;
    }

    cards.forEach(c => c.classList.remove('focused'));
    cards[index].classList.add('focused');
    cards[index].scrollIntoView({ block: 'nearest' });
    return true;
  }

  if (e.key === 'Enter') {
    const focused = contentEl.querySelector(selector + '.focused');
    if (focused) {
      focused.click();
      return true;
    }
  }

  return false;
}

function handleKeydown(e) {
  // Don't process keys while scene overlay is showing (its own dismiss handler will fire)
  const overlay = document.getElementById('scene-overlay');
  if (overlay && !overlay.classList.contains('hidden')) return;

  // Don't process game keys while typing in an input field
  if (document.activeElement && document.activeElement.tagName === 'INPUT') {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (state.phase === 'nameCharacterSelect') confirmNameCharacter();
    }
    return;
  }

  if (state.phase === 'intro' && e.key === 'Enter') {
    renderNameCharacterSelect();
    return;
  }

  if (state.phase === 'nameCharacterSelect') {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const chars = ['Adam', 'Alex', 'Amelia', 'Bob'];
      const curIdx = chars.indexOf(state.character);
      const newIdx = e.key === 'ArrowRight' ? (curIdx + 1) % 4 : (curIdx + 3) % 4;
      selectCharPreview(chars[newIdx]);
      return;
    }
    if (e.key === 'Enter') {
      confirmNameCharacter();
      return;
    }
    return;
  }

  if (state.phase === 'toolSelect') {
    if (e.key >= '1' && e.key <= '5') {
      const keys = Object.keys(TOOLS);
      selectTool(keys[parseInt(e.key) - 1]);
      return;
    }
    if (handleArrowNav(e, '.tool-card')) return;
    return;
  }

  if (state.phase === 'projectSelect') {
    if (e.key >= '1' && e.key <= '9') {
      const maxIndex = (state._offeredProjects ? state._offeredProjects.length : 0);
      const index = parseInt(e.key) - 1;
      if (index < maxIndex) selectProject(index);
      else if (index === maxIndex) selectProject(-1);
      return;
    }
    if (handleArrowNav(e, '.choice-card')) return;
    return;
  }

  if (state.phase === 'event') {
    const event = state.currentEvent;
    if (!event) return;
    const numChoices = event.choices.length;

    if (e.key >= '1' && e.key <= '9') {
      const index = parseInt(e.key) - 1;
      if (index < numChoices) handleChoice(index);
      return;
    }
    if (handleArrowNav(e, '.choice-card')) return;
    return;
  }

  if (state.phase === 'result' && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    nextWeek();
    return;
  }

  if (state.phase === 'ending' && (e.key === 'Enter' || e.key === ' ')) {
    renderIntro();
    return;
  }
}

// ========================================
// INIT
// ========================================

document.addEventListener('DOMContentLoaded', init);
