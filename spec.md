# The Builder Trail - Game Spec

## Product Thesis

The Builder Trail is a terminal-styled survival card game about a tech worker trying to build agency in the AI era without spending down the rest of their life.

You are not trying to become a startup founder at all costs. You are trying to stay capable, curious, employed, healthy, and connected while learning AI and shipping real side projects. The game should feel funny, painfully familiar, and empathetic to people balancing a demanding day job with the pressure to adapt.

The core question:

> Can you build agency in the AI era without burning through the money, health, and relationships that make agency worth having?

## Core Loop

Each turn is one week. The game lasts 26 weeks.

1. A card presents a work, AI, life, money, or project situation.
2. The player chooses one of two responses.
3. The choice affects survival attributes and project progress.
4. New cards are weighted by current pressure.
5. The player either ships enough project credits, collapses one survival attribute, or reaches the end.

The game is inspired by Reigns, but it is not about keeping every meter centered. It is about keeping your life above water while building enough proof that you can steer your future.

## Survival Attributes

All four attributes must stay above 0.

| Attribute | Meaning | Failure |
|---|---|---|
| Money | Can you fund your current life and buy time? | Runway crisis |
| Health | Can your body and mind keep carrying the load? | Burnout |
| Relationships | Are the people you care about still connected to you? | Alone with the repo |
| Agency | Are you becoming more capable of steering your future? | Spectator mode |

Agency includes AI skill, builder confidence, judgment, project momentum, and optionality. It is not hustle. Agency rises when you learn deeply, ship real projects, talk to users, make good tradeoffs, and understand the tools. It falls when you only consume hype, avoid learning, blindly trust agents, get trapped in corporate process, or stop making things.

## Project Goal

Win by shipping **5 project credits** before 26 weeks while all four survival attributes remain above 0.

| Size | Credits | Role |
|---|---:|---|
| Small | 1 | Low risk, fast learning, low upside |
| Medium | 2 | Best balanced path |
| Large | 3 | High risk, high upside, high life cost |

Five small projects is valid. One large plus one medium is valid. The credit system is the abstraction; project size differences should come through risk, cost, duration, revenue, and story flavor.

## Choice Hints

Choices should use Reigns-like effect hints, not exact numbers.

Before choosing, the player sees which attributes may be affected, not whether they go up or down. For example:

- `Money . Health`
- `Agency . Relationships`
- `Money . Health . Agency`

After choosing, the game narrates the consequence and the meters move. The player can infer what happened from the story and visible meter changes, but the UI should avoid precise deltas like `Health -10` or `Agency +15`.

The goal is informed tension, not spreadsheet optimization.

## Core Tradeoffs

The game should repeatedly force these tensions:

- Money vs Agency: take the safe corporate path or protect time to learn/build.
- Agency vs Health: stay up debugging the agent's code or sleep and slow down.
- Agency vs Relationships: respond to real users tonight or be present at dinner.
- Money vs Relationships: pay for help or DIY your way through a life problem.
- Health vs Agency: rest strategically or chase one more shipping window.

Good choices should rarely be purely good. The best cards make the player think, "I understand why both options are tempting."

## Endings

Win endings:

- Balanced Builder: shipped 5+ credits with all attributes healthy.
- Barely Made It: shipped 5+ credits with one or more attributes near collapse.
- Hollow Victory: shipped 5+ credits but Health or Relationships nearly broke.
- Small Bets Builder: won through small, sustainable projects.
- Big Swing Builder: won through one or more large projects.

Lose endings:

- Runway Crisis: Money hits 0.
- Burnout: Health hits 0.
- Alone with the Repo: Relationships hit 0.
- Spectator Mode: Agency hits 0.
- Still Waiting: 26 weeks end without 5 project credits.

## Visual and Interaction Direction

- The game runs in a polished terminal-style interface: monospace text, prompt-like week counter, compact status bars, and dark modern styling.
- Cards are the primary interaction surface. Most gameplay choices should be binary.
- Choices support click/tap, number keys, and left/right swipe or keyboard input where appropriate.
- Current attribute state is visible through labels/bars, but exact internal numbers should stay hidden from normal play.
- Pixel art scene cards appear for high-impact story moments and endings. They should support the emotional beat rather than become visual noise.

## Milestones

### Milestone 1 - The Survival Card Loop

Goal: prove the moment-to-moment game is fun.

Acceptance criteria:

- Player can complete a 26-week run.
- Four survival attributes are visible: Money, Health, Relationships, Agency.
- Every gameplay card has two choices with clear narrative stakes.
- Choices show affected-attribute hints, not exact numerical deltas.
- Any survival attribute hitting 0 ends the run with the correct ending.
- Basic project shipping supports small, medium, and large projects with credits.
- The player can win by reaching 5 project credits before week 26.

### Milestone 2 - The Tech Worker Empathy Pass

Goal: prove the game feels true to the lived experience.

Acceptance criteria:

- Cards cover day job pressure, AI learning, side projects, family/relationships, health, and financial stress.
- At least 40 cards exist, with no obvious all-upside choices.
- Agency is affected by learning, shipping, user feedback, AI tool judgment, and corporate passivity.
- Rest, family, and health choices are sometimes strategically correct, not just moral flavor.
- Project size differences are meaningful through risk, time, cost, upside, and life impact.
- Endings reflect how the player won or lost, not just whether they hit the credit target.

### Milestone 3 - Replayability and Reigns-Like Depth

Goal: prove the game is worth replaying.

Acceptance criteria:

- At least 6 endings are reachable through different play patterns.
- Recurring characters create small arcs across multiple cards.
- Prior choices unlock, weight, or alter future cards.
- Project size mix changes ending flavor.
- Pixel art scenes appear at major emotional beats and endings.
- A smoke test simulates many runs and reports ending distribution.
- A browser QA test verifies desktop and mobile playthroughs without console errors or broken UI.

## Release Verification

Before sharing a public build, run:

```bash
node --check game.js && node --check events.js && node --check scenes.js && node --check qa-smoke.cjs && node --check qa-browser.cjs
node qa-smoke.cjs 1000
node qa-browser.cjs
```
