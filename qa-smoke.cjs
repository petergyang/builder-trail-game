const fs = require('fs');
const vm = require('vm');

const EXPECTED_SCENE_SIZE = { width: 1536, height: 864 };

function readJsonLines(path) {
  return fs.readFileSync(path, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

function readPngSize(path) {
  if (!fs.existsSync(path)) return null;
  const buffer = fs.readFileSync(path);
  const isPng = buffer.length >= 24
    && buffer[0] === 0x89
    && buffer[1] === 0x50
    && buffer[2] === 0x4e
    && buffer[3] === 0x47;
  if (!isPng) return null;

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function makeElement() {
  return {
    innerHTML: '',
    className: '',
    dataset: {},
    style: {},
    classList: {
      add() {},
      remove() {},
      contains() { return true; },
      toggle() {}
    },
    querySelectorAll() { return []; },
    querySelector() { return null; },
    replaceWith() {},
    scrollIntoView() {},
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {}
  };
}

function makeCanvas() {
  const context = new Proxy({}, {
    get(target, prop) {
      if (prop === 'createRadialGradient' || prop === 'createLinearGradient') {
        return () => ({ addColorStop() {} });
      }
      return target[prop] || function noop() {};
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    }
  });

  return {
    width: 0,
    height: 0,
    className: '',
    style: {},
    getContext() { return context; }
  };
}

function createContext(seed) {
  const elements = {
    hud: makeElement(),
    content: makeElement(),
    'scene-overlay': makeElement(),
    'player-name': { ...makeElement(), value: 'QA' }
  };

  const math = Object.create(Math);
  math.random = seededRandom(seed);

  return {
    console,
    Math: math,
    __result: null,
    setTimeout(fn) { fn(); },
    Image: function ImageStub() { this.src = ''; },
    document: {
      getElementById(id) { return elements[id] || makeElement(); },
      createElement(tag) { return tag === 'canvas' ? makeCanvas() : makeElement(); },
      addEventListener() {},
      removeEventListener() {},
      activeElement: null,
      querySelectorAll() { return []; }
    },
    window: {}
  };
}

// Translate any effects object (native cards OR legacy keys) into the four
// survival-attribute directions, mirroring game.js effectToAttributes().
function effectsToAttributes(effects) {
  const d = { money: 0, health: 0, relationships: 0, agency: 0 };
  if (!effects) return d;
  const native = ['money', 'health', 'relationships', 'agency'].filter(k => typeof effects[k] === 'number');
  if (native.length) {
    native.forEach(k => { d[k] += effects[k]; });
    return d;
  }
  if (typeof effects.savings === 'number') d.money += Math.max(-4, Math.min(4, effects.savings / 1500));
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
  // Treat tiny residuals as zero so near-wash deltas don't read as a real cost/gain.
  for (const k of Object.keys(d)) if (Math.abs(d[k]) < 0.05) d[k] = 0;
  return d;
}

function auditVisibleChoiceTradeoffs() {
  const context = {};
  vm.createContext(context);
  vm.runInContext(
    `${fs.readFileSync('events.js', 'utf8')}\n${fs.readFileSync('cards.js', 'utf8')}\nthis.__events = { INFLECTIONS, TOOL_EVENTS, PROJECT_EVENTS, EVENTS, CARDS };`,
    context,
    { filename: 'events.js' }
  );

  // Judge each choice by its effect on the four attributes (not raw keys), so an
  // option that only helps or only hurts is flagged as a dominant/dead choice.
  const desirability = effects => {
    const d = effectsToAttributes(effects);
    const values = [d.money, d.health, d.relationships, d.agency].filter(v => v !== 0);
    if (!values.length) return 'none';
    const hasUpside = values.some(value => value > 0);
    const hasCost = values.some(value => value < 0);
    if (hasUpside && !hasCost) return 'all-upside';
    if (hasCost && !hasUpside) return 'all-cost';
    return 'tradeoff';
  };

  const findings = [];
  for (const [group, events] of Object.entries(context.__events)) {
    for (const event of events) {
      const choices = (event.choices || []).slice(0, 2);
      if (choices.length < 2) continue;

      const results = choices.map(choice => desirability(choice.effects));
      if (results.includes('all-upside') || results.includes('all-cost')) {
        findings.push({
          group,
          id: event.id,
          title: event.title,
          choices: choices.map((choice, index) => ({
            index: index + 1,
            label: choice.label,
            result: results[index],
            effects: choice.effects
          }))
        });
      }
    }
  }

  return findings;
}

function auditReleaseSceneReferences() {
  const releaseScenes = new Set(
    readJsonLines('assets/scenes/imagegen-prompts.jsonl').map(line => line.id)
  );

  const context = {};
  vm.createContext(context);
  vm.runInContext(
    `${fs.readFileSync('events.js', 'utf8')}\nthis.__events = { INFLECTIONS, TOOL_EVENTS, PROJECT_EVENTS, EVENTS };`,
    context,
    { filename: 'events.js' }
  );

  const findings = [];
  for (const [group, events] of Object.entries(context.__events)) {
    for (const event of events) {
      if (event.scene && !releaseScenes.has(event.scene)) {
        findings.push({ group, id: event.id, field: 'scene', scene: event.scene });
      }
      if (event.spotlightScene && !releaseScenes.has(event.spotlightScene)) {
        findings.push({ group, id: event.id, field: 'spotlightScene', scene: event.spotlightScene });
      }
      for (const [index, choice] of (event.choices || []).entries()) {
        if (choice.scene && !releaseScenes.has(choice.scene)) {
          findings.push({ group, id: event.id, field: `choices[${index}].scene`, scene: choice.scene });
        }
      }
    }
  }

  return findings;
}

function auditSceneAssetPipeline() {
  const jobs = readJsonLines('assets/scenes/imagegen-prompts.jsonl');
  const manifest = JSON.parse(fs.readFileSync('assets/scenes/manifest.json', 'utf8'));
  const ids = new Set();
  const findings = [];

  for (const job of jobs) {
    if (ids.has(job.id)) {
      findings.push({ type: 'duplicate-scene-id', id: job.id });
    }
    ids.add(job.id);

    const expectedOut = `assets/scenes/${job.id}.png`;
    if (job.out !== expectedOut) {
      findings.push({ type: 'scene-output-path', id: job.id, expected: expectedOut, actual: job.out });
    }
  }

  for (const id of manifest.generated || []) {
    const job = jobs.find(candidate => candidate.id === id);
    if (!job) {
      findings.push({ type: 'manifest-unknown-id', id });
      continue;
    }

    const size = readPngSize(job.out);
    if (!size) {
      findings.push({ type: 'manifest-missing-or-invalid-png', id, out: job.out });
      continue;
    }

    const [ew, eh] = String(job.size || '').toLowerCase().split('x').map(Number);
    if (ew && eh && (size.width !== ew || size.height !== eh)) {
      findings.push({
        type: 'manifest-scene-size',
        id,
        out: job.out,
        expected: `${ew}x${eh}`,
        actual: `${size.width}x${size.height}`
      });
    }
  }

  return findings;
}

function runGame(seed) {
  const context = createContext(seed);
  vm.createContext(context);

  for (const file of ['scenes.js', 'events.js', 'cards.js', 'game.js']) {
    vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  }

  vm.runInContext(`
    init();
    renderNameCharacterSelect();
    confirmNameCharacter();

    let safety = 0;
    while (state.phase !== 'ending' && safety < 180) {
      safety++;
      if (state.phase === 'projectSelect') {
        const projectCount = Math.min(3, state._offeredProjects.length);
        selectProject(Math.random() < 0.85 ? Math.floor(Math.random() * projectCount) : -1);
      } else if (state.phase === 'event') {
        const event = state.currentEvent || createQuietWeekEvent();
        const choices = getPlayableChoices(event);
        handleChoice(Math.floor(Math.random() * choices.length));
      } else if (state.phase === 'result') {
        nextWeek();
      } else {
        throw new Error('Unexpected phase ' + state.phase);
      }
    }

    if (state.phase !== 'ending') throw new Error('Game did not reach an ending');
    const ending = getEnding();

    __result = {
      week: state.week,
      shipped: state.appsShipped,
      money: state.money,
      health: state.health,
      relationships: state.relationships,
      agency: state.agency,
      ending: ending.title,
      isWin: ending.isWin
    };
  `, context);

  return context.__result;
}

const runs = Number(process.argv[2] || 100);
const choiceAuditFindings = auditVisibleChoiceTradeoffs();
if (choiceAuditFindings.length) {
  console.error(JSON.stringify({ choiceAuditFindings }, null, 2));
  process.exit(1);
}
const releaseSceneFindings = auditReleaseSceneReferences();
if (releaseSceneFindings.length) {
  console.error(JSON.stringify({ releaseSceneFindings }, null, 2));
  process.exit(1);
}
const sceneAssetFindings = auditSceneAssetPipeline();
if (sceneAssetFindings.length) {
  console.error(JSON.stringify({ sceneAssetFindings }, null, 2));
  process.exit(1);
}

const results = [];

for (let i = 1; i <= runs; i++) {
  results.push(runGame(i * 991));
}

const WIN_ENDINGS = ['Balanced Builder', 'Small Bets Builder', 'Big Swing Builder', 'Barely Made It', 'Hollow Victory'];
const wins = results.filter(result => result.isWin).length;
const cleanWins = results.filter(result =>
  result.ending === 'Balanced Builder'
  || result.ending === 'Small Bets Builder'
  || result.ending === 'Big Swing Builder').length;
const burnouts = results.filter(result => result.ending === 'Burnout').length;
const runwayCrises = results.filter(result => result.ending === 'Runway Crisis').length;
const lonely = results.filter(result => result.ending === 'Alone with the Repo').length;
const spectators = results.filter(result => result.ending === 'Spectator Mode').length;
const timeouts = results.filter(result => result.ending === 'Still Waiting').length;
const avgWeek = results.reduce((sum, result) => sum + result.week, 0) / results.length;
const endings = results.reduce((counts, result) => {
  counts[result.ending] = (counts[result.ending] || 0) + 1;
  return counts;
}, {});
const endingAverages = Object.fromEntries(Object.keys(endings).sort().map(ending => {
  const matching = results.filter(result => result.ending === ending);
  const avg = key => Math.round((matching.reduce((sum, result) => sum + result[key], 0) / matching.length) * 10) / 10;
  return [ending, {
    avgWeek: avg('week'),
    avgShipped: avg('shipped'),
    avgMoney: avg('money'),
    avgHealth: avg('health'),
    avgRelationships: avg('relationships'),
    avgAgency: avg('agency')
  }];
}));

console.log(JSON.stringify({
  runs,
  wins,
  winRate: Math.round((wins / runs) * 1000) / 10,
  cleanWins,
  burnouts,
  runwayCrises,
  lonely,
  spectators,
  timeouts,
  endings,
  endingAverages,
  avgWeek: Math.round(avgWeek * 10) / 10,
  choiceAudit: { oneSidedVisibleChoices: choiceAuditFindings.length },
  sceneAudit: { invalidReleaseSceneRefs: releaseSceneFindings.length },
  sceneAssetAudit: { findings: sceneAssetFindings.length },
  sample: results.slice(0, 5)
}, null, 2));
