# Scene Art Pipeline

Release-quality scene cards live in this folder as `assets/scenes/<scene-id>.png`.

The game loads `manifest.json` on startup. Any scene ID listed in `generated` is rendered from a PNG. Missing IDs are omitted from the player-facing flow so blocky development art does not lower the quality bar.

The current pack is 20 first-person or near-player-POV scenes. They should feel visually varied: people, rooms, whiteboards, printed docs, sticky notes, physical props, family spaces, repair emergencies, and community moments.

Art direction:

- Keep each scene simple and readable, with one dominant visual idea.
- Laptops are allowed when they make the scene believable, especially builder, office, support, shipping, and ending scenes.
- Do not make laptops, monitors, dashboards, or screen glow the repeated dominant subject.
- The hero scene should present two appealing lifestyles with tradeoffs: modern office life and independent builder life. It should not make the corporate job look evil by default.
- Scene art should not include the player avatar; Builder Guy and Builder Girl share the same first-person scenes.

Manual save checklist:

- `hero.png`
- `office.png`
- `okr-maze.png`
- `strategy-summit.png`
- `doc-comments.png`
- `vp-review.png`
- `reorg.png`
- `demo.png`
- `team-good.png`
- `designer.png`
- `agentic-engineers.png`
- `late-night.png`
- `ship.png`
- `customer-community.png`
- `support-queue.png`
- `launch-flop.png`
- `family.png`
- `home-repair.png`
- `burnout.png`
- `ending-builder.png`

Generate the full scene pack with:

```bash
export OPENAI_API_KEY="..."
scripts/generate-scene-art.sh
```

The prompts are in `imagegen-prompts.jsonl`.

If you generate a single 5x4 contact sheet for review, save the approved sheet locally and slice it into the release scene files with:

```bash
python3 scripts/slice-scene-contact-sheet.py /path/to/contact-sheet.png --force
```

The slicer uses the prompt order in `imagegen-prompts.jsonl`, writes the 20 named PNGs into this folder, and rebuilds `manifest.json`.

After manually saving generated PNGs into this folder, run:

```bash
node scripts/build-scene-manifest.mjs
```
