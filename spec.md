# The Builder Trail — Game Spec

## Concept

A terminal-styled resource management game inspired by Oregon Trail. You're a Product Manager at a big tech company who starts vibe coding on the side. Your goal: ship real apps and become a legit builder.

The entire game is presented as a CLI/terminal interface — monospace text, command-prompt feel, ASCII-style resource bars — because you're literally learning to live in the terminal. Pixel art scene cards break through the terminal aesthetic at key story moments for emotional impact.

The tone is funny, self-aware, and painfully relatable to any PM who's opened Cursor at 10pm after putting the kids to bed.

---

## Tech Stack

- HTML/CSS/JS — small project structure (index.html, style.css, game.js, events.js)
- DOM-based terminal UI with monospace font (no canvas needed for core gameplay)
- Pixel art scene cards rendered as `<img>` overlays for special moments
- Optional chiptune music and simple SFX
- Static site, deployable to Vercel / GitHub Pages — no build step, just serve the files
- Responsive design: works on desktop and mobile (touch-friendly, no keyboard required)

---

## Core Game Loop

Each turn = **one week**. Game runs **52 weeks** (one year).

1. Show current week and resources
2. Random event or decision point (60% events, 30% decisions, 10% quiet grind weeks)
3. Player makes a choice
4. Resources update
5. Check win/lose conditions
6. Next week

---

## Resources

Persistent HUD rendered as terminal-style ASCII bars:

| Resource | Start | Range | Details |
|---|---|---|---|
| **Savings** | $80,000 | $0+ | Life expenses burn ~$1,500/week. Day job adds ~$4,000/week. App revenue and freelance gigs supplement. Certain decisions cost chunks (API bills, domains, design help, pro subscriptions). |
| **Energy** | 100 | 0–100 | Day job drains ~15/week. Each active side project drains more. Recovered by rest, exercise, quiet weeks. Hits 0 = forced rest, can't build. |
| **Momentum** | 30 | 0–100 | Goes up when you ship. Decays 5/week if idle. High momentum = faster builds and better outcomes. |
| **Apps Shipped** | 0 | 0+ | Primary win condition. Counts *launched* projects, not started ones. |

### Hidden Stats

These affect event probabilities but are not shown to the player:

- **Technical Skill** — Starts low, grows each week you code. Affects build success rates and speed.
- **Reputation** — Goes up when you ship quality work, down when you ship broken stuff or abandon projects.

---

## Tool System

At game start, the player picks their primary vibe coding stack. This affects build speed, energy cost, and which random events fire.

| Tool | Playstyle |
|---|---|
| **Cursor** | Balanced. Good autocomplete, visual diffs, familiar IDE feel. Moderate energy cost. Best for iterative building. |
| **Claude Code** | Terminal-based, high autonomy. Lower energy cost per session (it does more on its own) but harder to debug when things go wrong. Higher variance outcomes. |
| **Lovable / Bolt** | Fastest prototyping. Lowest energy cost to get an MVP out. But projects hit a ceiling fast, and "graduating" to real code costs extra weeks. |
| **Replit** | Good all-rounder with built-in hosting. Moderate everything. Fewer deployment headaches. |
| **Raw Codex CLI** | Highest skill ceiling. Lowest energy cost at high Technical Skill, highest at low skill. Multi-agent workflows unlock late game. |

Tool choice creates different playstyles and replayability. Players can **switch tools mid-game** but it costs **2 weeks of momentum** while they adjust.

---

## Project System

You can have **one active side project** at a time. Projects have:

- A name/description (randomly generated from a pool)
- **Complexity:** Small (2–3 weeks), Medium (4–6 weeks), Large (8–12 weeks)
- Weekly energy cost (modified by tool choice and Technical Skill)
- Quality outcome based on skill + momentum + randomness

### Example Project Pool

| Project | Size |
|---|---|
| A meal planning app for your family | Small |
| A dashboard that tracks your kid's reading progress | Small |
| A local restaurant waitlist app | Small |
| A multiplayer board game scoring app | Medium |
| An AI-powered PM interview prep tool | Medium |
| An AI wrapper that generates PRDs from voice notes | Medium |
| A Slack bot that summarizes meeting notes | Medium |
| A habit tracker with AI coaching | Medium |
| A competitor to Linktree but actually good | Large |
| A full SaaS analytics dashboard | Large |

You can **abandon** projects (lose momentum) or **push through**. Outcomes range from "launched and people love it" to "launched but nobody cares" to "you discover it already exists and is better."

Shipped projects generate small passive income (**$50–500/week** based on quality and size).

---

## Events

### Work Events

- "Your VP announced a reorg. Your project is 'sunset.' Lose 10 Momentum but gain 10 Energy from sudden free time."
- "Perf review season. Self-review due. Energy -15, no time to code this week."
- "Your eng lead found your GitHub. They're impressed but concerned about your 11pm commit times. Be honest or play it off?"
- "All-hands meeting. CEO said 'AI' fourteen times. You feel an overwhelming urge to build something. Momentum +10."
- "Sprint planning ran 90 minutes over. Energy -10. You realize your side project's sprint planning takes 30 seconds because you're the whole team."
- "Manager wants you to lead an extra initiative. Accept (+$500/week raise, Energy -15/week) or decline (manager 'disappointed')?"

### Building Events

- "Auth flow completely broken at 1am. Energy -10 but you fix it. Technical Skill +5."
- "Claude hallucinated an entire database schema that doesn't work. Lose a week of progress."
- "Vibe coding got you 80% there. The last 20% is taking 80% of the time. Tale as old as time."
- "Shipped a feature in one evening that would've taken a sprint at work. Momentum +15."
- "Your app hit the front page of Hacker News. But someone found a SQL injection in your AI-generated code."
- "Spent 4 hours on a CSS issue. Energy -10. Sanity: immeasurable damage."
- "New model drop from Anthropic/OpenAI. Your entire workflow just got faster. Build speed +20% for 4 weeks."
- "You need to learn Stripe integration. Lose a week, gain Technical Skill +10."
- "Cursor autocompleted something so perfect you stared at the screen for 30 seconds."
- "Deployed to production. Forgot environment variables. App is hitting your dev database. Panic."
- "You discover that Lovable can scaffold the UI in 10 minutes. But you've spent 3 days trying to make it do something it can't."
- "Switched from Cursor to Claude Code mid-project. Everything broke. Momentum -15. But now you have two tools."

### Life Events

- "Your daughter wants to play board games tonight. Skip coding (Energy +10, Momentum -5) or say 'maybe tomorrow' (feel guilty, gain nothing)."
- "Family vacation. No building, no work. Energy +30, Momentum -10. You come back with three new app ideas."
- "Stayed up until 2am coding. Your wife asks if you're okay."
- "Your 4-year-old drew a picture of you holding a laptop. Mixed feelings."
- "Saturday morning. Kids at swim lessons. 90 uninterrupted minutes. Most productive you'll be all week."
- "You're checking your app's analytics at dinner again."
- "Kid is sick. No building, work is chaos. Energy -20. But you had a great idea in the pediatrician's waiting room."

### Inflection Point Decisions

- **At 3 apps shipped:** "A friend wants to co-found something. Partner up (shared energy, slower decisions) or stay solo?"
- **At Technical Skill > 70:** "You're actually good at this. Start freelance dev work? (+income, -energy, -momentum on your own apps)"
- **At $20K savings left:** "Money's tight. Cut API costs (slower/worse apps), freelance, or ask for a raise?"
- **At Momentum > 80:** "Flow state. Everything ships. Go all-in on a Large project or keep stacking small wins?"

---

## Win/Lose Conditions

### Win States (ranked)

| Rank | Title | Criteria |
|---|---|---|
| 1 | **The Builder** | 5+ apps shipped, at least 2 generating revenue. You build real things. |
| 2 | **The Shipper** | 3–4 apps shipped. Not everything worked but you shipped. |
| 3 | **The Tinkerer** | 1–2 apps shipped. It's a start. |

### Lose States

| Condition | Description |
|---|---|
| **Savings hit $0** | Game over. Building stops. |
| **Energy at 0 for 3 consecutive weeks** | Burnout. Doctor says stop. |
| **Momentum at 0 for 8 consecutive weeks** | Haven't touched code in two months. The dream fades. |

### Ending Screen

Weeks survived, apps shipped, total revenue, peak momentum, tool used, and a pixel art scene matching the outcome.

---

## Visual Design

### Terminal UI (Core Interface)

The entire game runs in a terminal-style interface modeled after **Claude Code's CLI** — dark background, clean monospace font, subtle syntax-highlighted colors. Modern and polished, not retro green-screen.

- **Resource bars** as ASCII: `Energy  [████████░░░░] 67/100`
- **Week counter** as prompt-style: `~/builder-trail $ week 14 of 52`
- **Events and choices** rendered as terminal output with numbered options
- **Project status** as a CLI dashboard card
- **Typing/scroll animations** for immersion — text appears line by line like real terminal output
- Color palette: dark background (#0d1117 or similar), green for positive, red for negative, yellow for warnings, white for neutral text

### Input

Choices are presented as **numbered option cards** (inspired by Claude Code's AskUserQuestion UI) — keyboard shortcut (1/2/3) on desktop, tappable cards on mobile. Both always work.

- Advance weeks: Enter/Space on desktop, tap "Next Week" on mobile
- Choices: press number key or tap the option card
- All interactions must be mobile-friendly (no keyboard required)

### Character Setup

At game start, the player:

1. Names their character (text input)
2. Picks a sprite from the LimeZu pack (Adam, Alex, Amelia, Bob — shown as pixel art previews)

The chosen sprite + name appear in pixel art scene cards throughout the game.

### Pixel Art Scene Cards (Special Moments)

Pixel art scenes appear as overlay cards that break through the terminal UI at high-impact moments. Built from the **LimeZu Modern Interiors** tileset (16x16 tiles, composed into ~320x180px scenes).

Scenes to compose from the tileset (~10-15 total):

- **PM coding at home late at night** — desk, computer, lamp on, dark window (character: Adam/Alex sitting at desk)
- **PM with family** — living room scene, couch, kids (character: sitting poses)
- **Shipping an app** — desk with confetti/celebration feel, monitor glowing
- **Burnout** — character slumped, messy desk, coffee cups
- **Got the raise / money event** — office desk scene
- **Kid drew a picture of you** — bedroom/kids room scene
- **Flow state** — clean desk, multiple monitors, everything clicking
- **Game over: broke** — empty desk, dark room
- **Game over: burnout** — bed scene, character lying down
- **Win: The Builder** — home office, multiple screens, apps on display

**Available assets from free pack:**
- 4 characters (Adam, Alex, Amelia, Bob) with idle, sitting, phone, and run animations
- Furniture: desks, computers, monitors, beds, couches, bookshelves, kitchen items, lamps, plants, rugs
- Room builder: walls, floors (hardwood, tile, carpet), room borders
- All at 16x16, composable into scenes

### Asset Strategy

- Compose scene cards from LimeZu tileset sprites — arrange furniture + character into small pixel scenes
- Terminal UI is pure CSS/HTML — no image assets needed for the core interface
- Scene cards are pre-composed PNGs, shown as overlays during key moments
- Keep it to ~10-15 scene cards max — they're the reward, not the default

---

## MVP Milestones

### Milestone 1 — The Terminal Loop (Testable: can you play through 52 weeks?)

The core game in pure terminal UI. No pixel art, no sound, no polish. Just the loop.

- Terminal-style HTML/CSS interface (dark background, monospace, ASCII bars)
- Turn system: 52 weeks, advance with a button/keypress
- 4 resource bars rendered as ASCII in a persistent HUD
- Resource math: weekly income, expenses, energy drain, momentum decay
- 10 hardcoded events (mix of work/building/life) with choices
- Win/lose detection and a simple ending screen (text only)
- **No** tool selection, **no** project system yet — just events and resources

**Test:** Can you click through 52 weeks, see resources change, hit a win or lose state?

### Milestone 2 — The Builder's Choices (Testable: do decisions feel meaningful?)

Add the systems that make it a game — tools, projects, and pixel art scene cards. Events are already at 40 (exceeding M3 target), so this milestone focuses on mechanics and visual moments.

- Tool selection screen at game start (affects energy cost and event pool)
- Project system: pick a project, work on it weekly, ship or abandon
- Tool-specific and project-specific event variants
- Inflection point decisions (triggered by resource thresholds)
- Shipped apps generate passive income
- Compose 5–6 pixel art scene cards from LimeZu tileset for key moments (ship an app, burnout, family event, etc.)
- Scene cards appear as overlays that break through the terminal UI
- Ending screen with pixel art scene matching outcome (pulled from M3 — events already done)
- Intro sequence: *"You are a PM at BigTechCo. You have just opened Cursor for the first time..."* (pulled from M3)
- Balance tuning pass on resource math

**Test:** Do tool choices feel different? Can you ship a project? Does the economy hold up over 52 weeks? Do pixel art moments land? Does the intro set the tone?

### Milestone 3 — Polish & Replayability (Testable: does it feel like a real game?)

Final polish, animations, and expanded pixel art.

- Typing/scroll animation for terminal text
- 8–10 total pixel art scene cards (expand from M2)
- Additional event variants for variety and replayability
- Optional: sound effects, screen shake on bad events

**Test:** Is it fun to replay? Does the pacing feel right across 52 weeks?
