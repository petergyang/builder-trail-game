#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo "OPENAI_API_KEY is required to generate scene art." >&2
  echo "Run: export OPENAI_API_KEY=\"...\"" >&2
  exit 1
fi

IMAGE_GEN="${CODEX_HOME:-$HOME/.codex}/skills/.system/imagegen/scripts/image_gen.py"

python3 "$IMAGE_GEN" generate-batch \
  --input assets/scenes/imagegen-prompts.jsonl \
  --out-dir assets/scenes \
  --concurrency 3 \
  --force

node scripts/build-scene-manifest.mjs
