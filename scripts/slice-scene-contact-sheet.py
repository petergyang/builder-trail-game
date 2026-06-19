#!/usr/bin/env python3
"""Slice a 5x4 scene contact sheet into named scene PNGs.

This is a practical bridge for Codex chat image previews: save the approved
contact sheet locally, then run this script to create the 20 scene files in the
same order as assets/scenes/imagegen-prompts.jsonl.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
PROMPTS_PATH = ROOT / "assets" / "scenes" / "imagegen-prompts.jsonl"
DEFAULT_OUT_DIR = ROOT / "assets" / "scenes"
TARGET_SIZE = (1536, 864)


def load_jobs(path: Path) -> list[dict]:
    jobs = []
    for line in path.read_text().splitlines():
        if line.strip():
            jobs.append(json.loads(line))
    return jobs


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Slice a saved 5x4 scene contact sheet into assets/scenes/*.png."
    )
    parser.add_argument("input", type=Path, help="Path to the saved contact sheet image.")
    parser.add_argument("--out-dir", type=Path, default=DEFAULT_OUT_DIR, help="Directory for scene PNGs.")
    parser.add_argument("--prompts", type=Path, default=PROMPTS_PATH, help="JSONL prompt manifest for scene order.")
    parser.add_argument("--cols", type=int, default=5, help="Contact sheet columns.")
    parser.add_argument("--rows", type=int, default=4, help="Contact sheet rows.")
    parser.add_argument(
        "--padding",
        type=float,
        default=0.035,
        help="Fraction of each cell to trim on every side to remove gutters/borders.",
    )
    parser.add_argument("--no-resize", action="store_true", help="Keep each slice at its cropped source size.")
    parser.add_argument("--force", action="store_true", help="Overwrite existing scene PNGs.")
    parser.add_argument("--no-manifest", action="store_true", help="Do not rebuild assets/scenes/manifest.json.")
    return parser.parse_args()


def crop_box(index: int, image_width: int, image_height: int, cols: int, rows: int, padding: float) -> tuple[int, int, int, int]:
    col = index % cols
    row = index // cols
    cell_w = image_width / cols
    cell_h = image_height / rows
    pad_x = cell_w * padding
    pad_y = cell_h * padding

    left = round((col * cell_w) + pad_x)
    top = round((row * cell_h) + pad_y)
    right = round(((col + 1) * cell_w) - pad_x)
    bottom = round(((row + 1) * cell_h) - pad_y)
    return left, top, right, bottom


def main() -> int:
    args = parse_args()
    if not args.input.exists():
        raise SystemExit(f"Input image not found: {args.input}")

    args.input = args.input.resolve()
    args.out_dir = args.out_dir.resolve()
    args.prompts = args.prompts.resolve()

    jobs = load_jobs(args.prompts)
    expected = args.cols * args.rows
    if len(jobs) != expected:
        raise SystemExit(f"Expected {expected} prompt jobs for {args.cols}x{args.rows}; found {len(jobs)}")

    args.out_dir.mkdir(parents=True, exist_ok=True)

    sheet = Image.open(args.input).convert("RGB")
    wrote = []
    for index, job in enumerate(jobs):
        out_path = ROOT / job["out"]
        if args.out_dir != DEFAULT_OUT_DIR.resolve():
            out_path = args.out_dir / Path(job["out"]).name
        out_path = out_path.resolve()
        if out_path.exists() and not args.force:
            raise SystemExit(f"Refusing to overwrite existing file without --force: {out_path}")

        scene = sheet.crop(crop_box(index, sheet.width, sheet.height, args.cols, args.rows, args.padding))
        if not args.no_resize:
            scene.thumbnail(TARGET_SIZE, Image.Resampling.LANCZOS)
            canvas = Image.new("RGB", TARGET_SIZE, (7, 8, 18))
            x = (TARGET_SIZE[0] - scene.width) // 2
            y = (TARGET_SIZE[1] - scene.height) // 2
            canvas.paste(scene, (x, y))
            scene = canvas

        scene.save(out_path, "PNG", optimize=True)
        wrote.append(out_path)

    print(f"Wrote {len(wrote)} scene PNG(s):")
    for path in wrote:
        print(f"- {path.relative_to(ROOT)}")

    if not args.no_manifest and args.out_dir == DEFAULT_OUT_DIR.resolve():
        subprocess.run(["node", "scripts/build-scene-manifest.mjs"], cwd=ROOT, check=True)

    return 0


if __name__ == "__main__":
    sys.exit(main())
