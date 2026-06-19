const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const Module = require('module');
const os = require('os');
const path = require('path');

const PORT = Number(process.env.PORT || 4173);
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}/`;
const CHROME_PATH = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const NODE_MODULES = process.env.NODE_PATH || path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');

if (fs.existsSync(NODE_MODULES)) {
  process.env.NODE_PATH = NODE_MODULES;
  Module._initPaths();
}

const { chromium } = require('playwright');

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function requestOk(url) {
  return new Promise(resolve => {
    const req = http.get(url, response => {
      response.resume();
      resolve(response.statusCode >= 200 && response.statusCode < 400);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1200, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(url, timeoutMs = 8000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await requestOk(url)) return true;
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  return false;
}

async function ensureServer() {
  if (await requestOk(BASE_URL)) return null;

  const server = spawn('python3', ['-m', 'http.server', String(PORT)], {
    cwd: process.cwd(),
    stdio: 'ignore'
  });

  if (!(await waitForServer(BASE_URL))) {
    server.kill();
    throw new Error(`Could not start dev server at ${BASE_URL}`);
  }

  return server;
}

async function collectPageHealth(page) {
  return page.evaluate(() => ({
    brokenImages: [...document.images].filter(img => !img.complete || img.naturalWidth === 0).length,
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    redundantCopy: /choose left|choose right|swipe left|swipe right|swipe on mobile/i.test(document.body.innerText),
    visibleBureaucracy: /\bBureaucracy\b/i.test(document.body.innerText),
    bodyText: document.body.innerText
  }));
}

async function dismissSceneOverlay(page) {
  const visible = await page.locator('#scene-overlay:not(.hidden)').count();
  if (!visible) return false;

  await page.waitForTimeout(300);
  await page.locator('#scene-overlay').click({ position: { x: 20, y: 20 } });
  // Best-effort: a dismiss can synchronously chain into the next overlay (e.g. the
  // ending scene), so don't require 'hidden' to settle — the caller re-checks phase.
  await page.waitForTimeout(250).catch(() => {});
  return true;
}

function assert(condition, message, details) {
  if (!condition) {
    const suffix = details ? `\n${JSON.stringify(details, null, 2)}` : '';
    throw new Error(`${message}${suffix}`);
  }
}

async function startRun(page, errors) {
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const intro = await collectPageHealth(page);
  assert(!intro.overflowX && intro.brokenImages === 0 && !intro.visibleBureaucracy, 'Intro health check failed', intro);

  await page.click('button.btn-primary');
  await page.waitForTimeout(100);
  assert(await page.locator('[data-char="BuilderGuy"]').count(), 'Builder Guy card missing');
  assert(await page.locator('[data-char="BuilderGirl"]').count(), 'Builder Girl card missing');

  await page.fill('#player-name', 'QA');
  await page.click('button.btn-primary');
  await page.waitForTimeout(150);
  assert(await page.locator('.project-choice').count() >= 1, 'Project select did not render projects');

  await page.click('.project-choice');
  await page.waitForTimeout(150);
  assert(errors.length === 0, 'Console/page errors during onboarding', errors);
}

function readPhase() {
  if (document.querySelector('#scene-overlay:not(.hidden)')) return 'overlay';
  if (document.querySelector('.ending')) return 'ending';
  if (document.querySelector('.decision-card .btn-continue')) return 'result';
  if (document.querySelector('.project-choice')) return 'project';
  if (document.querySelector('.decision-card')) return 'event';
  return 'unknown';
}

async function verifyEventInteraction(page) {
  for (let i = 0; i < 24; i++) {
    const phase = await page.evaluate(readPhase);

    if (phase === 'event') {
      const count = await page.locator('.dchoice').count();
      if (count === 2) break;
      if (count === 1) await page.locator('.dchoice').first().click();
    } else if (phase === 'overlay') {
      await dismissSceneOverlay(page);
    } else if (phase === 'result') {
      await page.locator('.btn-continue').click();
    } else if (phase === 'project') {
      await page.locator('.project-choice').first().click();
    } else {
      throw new Error(`Unexpected UI phase before interaction test: ${phase}`);
    }

    await page.waitForTimeout(80);
  }

  assert(await page.locator('.decision-card').count(), 'Decision card missing before interaction test');

  const before = await page.evaluate(() => ({
    choices: document.querySelectorAll('.dchoice').length,
    hint: !!document.querySelector('.choice-hintline'),
    visibleBureaucracy: /\bBureaucracy\b/i.test(document.body.innerText)
  }));
  assert(before.choices === 2 && before.hint && !before.visibleBureaucracy, 'Two-choice affordance failed', before);

  // Hover each choice: it must light up the meters it touches, and must NOT reveal direction.
  const reveal = await page.evaluate(() => {
    const choices = [...document.querySelectorAll('.dchoice')];
    let maxLit = 0;
    let showsDelta = false;
    for (const choice of choices) {
      choice.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      maxLit = Math.max(maxLit, document.querySelectorAll('.meter.lit').length);
      if (/[+−-]\s?\d/.test(choice.textContent)) showsDelta = true;
      choice.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    }
    return { maxLit, showsDelta };
  });
  assert(reveal.maxLit >= 1 && !reveal.showsDelta, 'Hover reveal failed (should light meters, hide direction)', reveal);

  // Commit a choice → outcome state with a Continue button.
  // Some choices spotlight a scene overlay first; dismiss it before checking.
  await page.locator('.dchoice').first().click();
  await page.waitForTimeout(220);
  if (await page.locator('#scene-overlay:not(.hidden)').count()) await dismissSceneOverlay(page);
  assert(await page.locator('.decision-card .btn-continue').count(), 'Choice did not resolve to an outcome');
}

async function continueToEnding(page, seed) {
  const random = seededRandom(seed);
  let safety = 0;

  while (safety < 90) {
    safety++;
    const phase = await page.evaluate(readPhase);

    if (phase === 'ending') return;
    if (phase === 'overlay') {
      await dismissSceneOverlay(page);
    } else if (phase === 'result') {
      await page.locator('.btn-continue').click();
    } else if (phase === 'project') {
      const count = await page.locator('.project-choice').count();
      await page.locator('.project-choice').nth(Math.floor(random() * count)).click();
    } else if (phase === 'event') {
      const count = await page.locator('.dchoice').count();
      await page.locator('.dchoice').nth(Math.floor(random() * count)).click();
    } else {
      throw new Error(`Unexpected UI phase: ${phase}`);
    }
    await page.waitForTimeout(40);
  }

  throw new Error('Browser playthrough did not reach an ending within safety limit');
}

async function runViewport(browser, viewport) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', error => errors.push(error.message));

  await startRun(page, errors);
  await verifyEventInteraction(page);

  await page.locator('.decision-card .btn-continue').click();
  await page.waitForTimeout(100);
  await continueToEnding(page, viewport.width * 1000 + viewport.height);

  const health = await collectPageHealth(page);
  const ending = await page.evaluate(() => ({
    title: document.querySelector('.ending-title')?.textContent?.trim(),
    stats: document.querySelectorAll('.stat-row').length,
    actions: document.querySelectorAll('.ending-actions a, .ending-actions button').length
  }));

  assert(errors.length === 0, 'Console/page errors during browser QA', errors);
  assert(!health.overflowX && health.brokenImages === 0 && !health.redundantCopy && !health.visibleBureaucracy, 'Final page health check failed', health);
  assert(ending.title && ending.stats >= 6 && ending.actions >= 3, 'Ending screen incomplete', ending);

  await page.close();
  return { viewport, ending };
}

(async () => {
  const server = await ensureServer();
  const browser = await chromium.launch({
    headless: true,
    executablePath: fs.existsSync(CHROME_PATH) ? CHROME_PATH : undefined
  });

  try {
    const results = [];
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      results.push(await runViewport(browser, viewport));
    }
    console.log(JSON.stringify({ ok: true, baseUrl: BASE_URL, results }, null, 2));
  } finally {
    await browser.close();
    if (server) server.kill();
  }
})().catch(error => {
  console.error(error.stack || error.message);
  process.exit(1);
});
