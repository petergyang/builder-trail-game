#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo "OPENAI_API_KEY is not set. Set it locally, then rerun this script." >&2
  exit 1
fi

mkdir -p assets/scenes/imagegen-final

python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/imagegen/scripts/image_gen.py" generate-batch \
  --input tmp/imagegen/scene-final-batch.jsonl \
  --out-dir assets/scenes/imagegen-final \
  --model gpt-image-2 \
  --quality high \
  --size 1536x864 \
  --output-format png \
  --concurrency 2 \
  --fail-fast
