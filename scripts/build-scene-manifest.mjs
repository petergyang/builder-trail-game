import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const promptsPath = resolve(root, 'assets/scenes/imagegen-prompts.jsonl');
const manifestPath = resolve(root, 'assets/scenes/manifest.json');
const EXPECTED_WIDTH = 1536;
const EXPECTED_HEIGHT = 864;

function readPngSize(path) {
  const buffer = readFileSync(path);
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

const jobs = readFileSync(promptsPath, 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map(line => JSON.parse(line));

const generated = [];
const invalid = [];

for (const job of jobs) {
  const path = resolve(root, job.out);
  if (!existsSync(path)) continue;

  const size = readPngSize(path);
  if (!size || size.width !== EXPECTED_WIDTH || size.height !== EXPECTED_HEIGHT) {
    invalid.push({
      out: job.out,
      reason: size ? `${size.width}x${size.height}` : 'not a PNG'
    });
    continue;
  }

  generated.push(job.id);
}

const missing = jobs
  .filter(job => !existsSync(resolve(root, job.out)))
  .map(job => job.out);

writeFileSync(
  manifestPath,
  `${JSON.stringify({ generated }, null, 2)}\n`
);

console.log(`Scene manifest updated: ${generated.length} generated scene(s).`);
if (invalid.length) {
  console.log(`Invalid ${invalid.length} scene file(s), excluded from manifest:`);
  invalid.forEach(({ out, reason }) => console.log(`- ${out} (${reason}; expected ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT})`));
}
if (missing.length) {
  console.log(`Missing ${missing.length} scene file(s):`);
  missing.forEach(path => console.log(`- ${path}`));
}
