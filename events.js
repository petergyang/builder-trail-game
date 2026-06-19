// ========================================
// THE BUILDER TRAIL — Events & Content (M3)
// ========================================

// --- Projects ---
const PROJECTS = [
  // Small (1-2 weeks base)
  { id: 'meal-planner', name: 'Meal Planner', description: 'A family meal planner that stops the 5pm fridge stare.', size: 'small', baseWeeks: 1, baseEnergy: 6, baseIncome: 75, launchRisk: 0.02 },
  { id: 'reading-tracker', name: 'Reading Tracker', description: "A tiny dashboard for your kid's reading streak.", size: 'small', baseWeeks: 2, baseEnergy: 6, baseIncome: 55, launchRisk: 0.02 },
  { id: 'waitlist-app', name: 'Local Waitlist', description: 'A dead-simple restaurant waitlist for neighborhood spots.', size: 'small', baseWeeks: 1, baseEnergy: 7, baseIncome: 105, launchRisk: 0.03 },
  { id: 'scoreboard', name: 'Game Night Scoreboard', description: 'A multiplayer scorekeeper with trash-talk mode.', size: 'small', baseWeeks: 2, baseEnergy: 6, baseIncome: 70, launchRisk: 0.02 },
  { id: 'meeting-bingo', name: 'Meeting Bingo', description: 'A browser game for surviving all-hands meetings.', size: 'small', baseWeeks: 1, baseEnergy: 5, baseIncome: 90, launchRisk: 0.01 },

  // Medium (2-3 weeks base)
  { id: 'interview-prep', name: 'PM Interview Prep', description: 'An AI coach for practicing product sense answers.', size: 'medium', baseWeeks: 3, baseEnergy: 10, baseIncome: 210, launchRisk: 0.04 },
  { id: 'prd-generator', name: 'PRD Detox', description: 'Turns rambling voice notes into a crisp product brief.', size: 'medium', baseWeeks: 3, baseEnergy: 10, baseIncome: 260, launchRisk: 0.05 },
  { id: 'slack-summarizer', name: 'Slack Archaeologist', description: 'Digs decisions out of seven channels and three threads.', size: 'medium', baseWeeks: 2, baseEnergy: 8, baseIncome: 190, launchRisk: 0.04 },
  { id: 'habit-tracker', name: 'AI Habit Coach', description: 'A habit tracker that is kind instead of weirdly punitive.', size: 'medium', baseWeeks: 3, baseEnergy: 10, baseIncome: 210, launchRisk: 0.04 },
  { id: 'calendar-firewall', name: 'Calendar Firewall', description: 'Auto-declines meetings with no agenda and too many attendees.', size: 'medium', baseWeeks: 3, baseEnergy: 9, baseIncome: 240, launchRisk: 0.05 },

  // Large (4-5 weeks base)
  { id: 'linktree-killer', name: 'LinkPage', description: 'A creator homepage that feels less like a QR-code landfill.', size: 'large', baseWeeks: 5, baseEnergy: 13, baseIncome: 420, launchRisk: 0.07 },
  { id: 'saas-dashboard', name: 'Founder Cockpit', description: 'A full SaaS dashboard for metrics, billing, alerts, and denial.', size: 'large', baseWeeks: 5, baseEnergy: 13, baseIncome: 520, launchRisk: 0.08 },
  { id: 'agent-workbench', name: 'Agent Workbench', description: 'A workspace for launching coding agents without losing the plot.', size: 'large', baseWeeks: 5, baseEnergy: 14, baseIncome: 560, launchRisk: 0.09 },
];

// --- Inflection Points (thresholds adjusted for 26 weeks) ---
const INFLECTIONS = [
  // Mandatory expense events — fire once based on week thresholds
  {
    id: 'expense-home-repair',
    condition: (s) => s.week >= 5 && s.week <= 8,
    type: 'life',
    title: 'Home Repair Emergency',
    text: "The water heater died. Your basement is flooding. The plumber says $4,500. Your spouse is looking at you.",
    choices: [
      { label: 'Pay the plumber', effects: { savings: -4500, energy: 5, familyScore: 1 },
        hint: 'Expensive but fast',
        result: "Fixed in a day. Your spouse is relieved. Your savings take a hit, but the house is dry." },
      { label: 'DIY it over the weekend', effects: { savings: -800, energy: -15, familyScore: -1, technicalSkill: 2 },
        hint: 'Cheaper but exhausting',
        result: "YouTube tutorials, three trips to Home Depot, and a very long weekend. It works. Mostly. You're destroyed." }
    ]
  },
  {
    id: 'expense-medical',
    condition: (s) => s.week >= 10 && s.week <= 14,
    type: 'life',
    title: 'Medical Bill',
    text: "Your kid fell off the monkey bars. ER visit, X-ray, tiny cast. Insurance covers some of it. $3,200 remaining.",
    choices: [
      { label: 'Pay the bill', effects: { savings: -3200, familyScore: 1 },
        hint: "It's your kid",
        result: "You pay it without blinking. Your kid thinks the cast is cool. That's what matters." },
      { label: 'Fight the insurance company', effects: { savings: -1200, energy: -12, momentum: -5, familyScore: 1 },
        hint: 'Hours on hold',
        result: "Three hours on hold. Four phone calls. They cover another $2,000. You lose a week of building momentum." }
    ]
  },
  {
    id: 'expense-car',
    condition: (s) => s.week >= 15 && s.week <= 19,
    type: 'life',
    title: 'Car Trouble',
    text: "Your car won't start. The mechanic says transmission. $2,000 minimum.",
    choices: [
      { label: 'Fix it properly', effects: { savings: -2000, familyScore: 1 },
        hint: 'Reliable fix',
        result: "New transmission. Car runs like new. Savings don't." },
      { label: 'Find the cheapest fix', effects: { savings: -800, energy: -8, momentum: 3 },
        hint: 'Band-aid solution',
        result: "A shade-tree mechanic does something. It runs. The check engine light is on, but it runs." }
    ]
  },
  {
    id: 'expense-tax',
    condition: (s) => s.week >= 20 && s.week <= 24,
    type: 'life',
    title: 'Tax Surprise',
    text: "Your accountant calls. Side project income means you owe $5,000 in estimated taxes. Should have set that aside.",
    choices: [
      { label: 'Pay it now', effects: { savings: -5000, energy: 5 },
        hint: 'Clean slate',
        result: "Gone. Just like that. But at least the IRS won't come knocking." },
      { label: 'Defer and pay the penalty later', effects: { savings: -1500, momentum: 6, energy: -5 },
        hint: 'Kicks the can',
        result: "You'll deal with it in April. The penalty adds up but you keep building." }
    ]
  },

  // Story inflections
  {
    id: 'cofounder-offer',
    condition: (s) => s.appsShipped >= 2,
    type: 'building',
    title: 'Co-Founder Offer',
    text: "Your friend Alex has been watching you ship. They DM you: 'I quit my job. Let's build something together. 50/50.'",
    choices: [
      { label: 'Partner up', effects: { energy: -8, momentum: 20, familyScore: -1 },
        hint: 'More power, less family time',
        result: "Two builders are better than one. But every evening meeting is an evening away from home." },
      { label: 'Stay solo', effects: { familyScore: 1, technicalSkill: -2 },
        hint: 'Keep your schedule yours',
        result: "You say no. It's lonely, but your schedule stays flexible. Family dinners intact." }
    ]
  },
  {
    id: 'freelance-opportunity',
    condition: (s) => s.technicalSkill > 40,
    type: 'building',
    title: 'Freelance Gig',
    text: "A startup founder found your portfolio. '$150/hour for 10 hours a week. React work.' Your technical skill is real now.",
    choices: [
      { label: 'Take the freelance work', effects: { savings: 1500, energy: -15, familyScore: -2 },
        hint: 'Good money, no free time',
        result: "Day job, freelance, side projects, family. Something has to give. Guess which one." },
      { label: 'Decline — focus on your apps', effects: { momentum: 10, savings: -500 },
        hint: 'Bet on yourself',
        result: "You turn down guaranteed income to bet on yourself. Terrifying. But your apps need your attention." }
    ]
  },
  {
    id: 'money-tight',
    condition: (s) => s.savings <= 15000 && s.savings > 0,
    type: 'life',
    title: "Money's Getting Tight",
    text: "The runway is shortening. You check your burn rate. Bay Area rent doesn't care about your dreams.",
    choices: [
      { label: 'Cut costs everywhere', effects: { savings: 2000, familyScore: -2 },
        hint: 'Cancel the kids activities too',
        result: "You downgrade everything. Free tiers, no eating out, cancel swim lessons. The bleeding stops." },
      { label: 'Push harder — ship for revenue', effects: { energy: -10, momentum: 15 },
        hint: 'Desperation mode',
        result: "Desperation is a hell of a motivator. You focus everything on getting to revenue." }
    ]
  }
];

// --- Tool-Specific Events ---
const TOOL_EVENTS = [
  {
    id: 'cursor-autocomplete',
    type: 'building',
    tools: ['cursor'],
    title: 'Cursor Magic',
    text: "Cursor autocompleted an entire component. You stared at the screen for 30 seconds. It was perfect.",
    choices: [
      { label: 'Accept and ship', effects: { energy: 5, momentum: 4, technicalSkill: -6 },
        hint: 'Trust the machine',
        result: "Tab. Tab. Tab. Done. This is the future." },
      { label: 'Rewrite it to understand it', effects: { momentum: 5, energy: -5 },
        hint: 'Learn the hard way',
        result: "You rewrite it line by line. Now you actually know what it does." }
    ]
  },
  {
    id: 'claude-code-autonomy',
    type: 'building',
    tools: ['claude-code'],
    title: 'Claude Goes Rogue',
    text: "You told Claude Code to 'fix the bug.' It refactored three files, added tests, and upgraded a dependency. The bug is fixed. You're not sure what else changed.",
    choices: [
      { label: 'Trust the diff, move on', effects: { momentum: 15, energy: -3, technicalSkill: -2 },
        hint: 'Living dangerously',
        result: "You scan the diff. It looks... better? You ship it. Living dangerously." },
      { label: 'Review every line', effects: { momentum: 5, energy: -10 },
        hint: 'The responsible thing',
        result: "Two hours of code review later, you understand your own codebase better. Also, Claude was right." }
    ]
  },
  {
    id: 'lovable-ceiling',
    type: 'building',
    tools: ['lovable'],
    title: 'The Lovable Ceiling',
    text: "Your Lovable app looks amazing. But you need a custom API integration and the AI keeps generating the same broken code.",
    choices: [
      { label: 'Export and fix manually', effects: { energy: -15, momentum: 5, technicalSkill: 3 },
        hint: 'Painful but real',
        result: "You eject from Lovable. The code is... not how you'd write it. But you make it work." },
      { label: 'Redesign around the limitation', effects: { energy: -5, momentum: 10 },
        hint: 'Work with what you have',
        result: "You simplify the feature to work within Lovable's comfort zone. Constraint breeds creativity." }
    ]
  },
  {
    id: 'codex-multi-agent',
    type: 'building',
    tools: ['codex-cli'],
    minTechnicalSkill: 50,
    title: 'Multi-Agent Unlock',
    text: "Your skill is high enough to orchestrate multi-agent workflows. You spin up three Codex instances working in parallel.",
    choices: [
      { label: 'Let them cook', effects: { momentum: 25, energy: -10, technicalSkill: -4 },
        hint: 'Maximum velocity',
        result: "Three agents, one codebase, zero merge conflicts. You built a week's worth of features in one evening." },
      { label: 'Dial it back to one agent', effects: { momentum: 10, energy: -5 },
        hint: 'Stay in control',
        result: "Too much too fast. You stick with one agent but the potential is there." }
    ]
  }
];

// --- Project-Aware Events ---
const PROJECT_EVENTS = [
  {
    id: 'user-feedback-positive',
    type: 'building',
    requiresActiveProject: true,
    title: 'First User Feedback',
    text: () => `Someone tried an early build of ${state.activeProject.name}. They said: "This is exactly what I needed."`,
    choices: [
      { label: 'Ask for more feedback', effects: { momentum: 15, energy: -8, reputation: 3, familyScore: -1 },
        hint: 'Dig deeper',
        result: "They spend 20 minutes telling you what to improve. Pure gold." },
      { label: 'Screenshot it and keep building', effects: { energy: 5, momentum: 3, technicalSkill: -4 },
        hint: 'Fuel for the fire',
        result: "Saved to your 'motivation' folder. Back to work." }
    ]
  },
  {
    id: 'project-competitor',
    type: 'building',
    requiresActiveProject: true,
    projectSizes: ['medium', 'large'],
    title: 'Competitor Alert',
    text: () => `You just discovered a YC-backed startup building the same thing as ${state.activeProject.name}. They have a team of 8.`,
    choices: [
      { label: 'Ship faster — first mover', effects: { energy: -10, momentum: 15, familyScore: -1 },
        hint: 'Cancel everything else',
        result: "You can't out-resource them, but you can out-speed them. Your family doesn't see you for a week." },
      { label: 'Find your niche', effects: { energy: -12, momentum: 10 },
        hint: 'Pivot slightly',
        result: "You pivot slightly. Your version serves a niche they'll never bother with." }
    ]
  }
];

// --- Base Events (trimmed to ~28, all with familyScore where relevant) ---
const EVENTS = [

  // =========== WORK EVENTS ===========

  {
    id: 'alignment_review',
    type: 'work',
    scene: 'office',
    title: 'Alignment Review',
    text: "A director asks whether your roadmap is 'strategically aligned.' Nobody defines aligned. Everyone nods anyway.",
    choices: [
      { label: 'Create the alignment doc',
        effects: { energy: -8, corpLoad: 10, reputation: 6, momentum: -5 },
        hint: 'Responsible, exhausting',
        result: "The doc gets praised, linked, duplicated, and never read again. Your credibility rises. So does the meeting count." },
      { label: 'Ask what decision this unlocks',
        effects: { energy: -4, corpLoad: -7, reputation: 3, momentum: 5 },
        hint: 'Dangerously direct',
        result: "A silence falls over the room. Then someone admits there is no decision. The meeting ends 18 minutes early." }
    ]
  },
  {
    id: 'okr_theater',
    type: 'work',
    scene: 'okr-maze',
    title: 'OKR Theater',
    text: "Your team needs new OKRs. The actual goal is obvious: make the graph go up. The template has 14 sections.",
    choices: [
      { label: 'Write measurable goals',
        effects: { reputation: 8, energy: -8, corpLoad: 5 },
        hint: 'Boring but useful',
        result: "The goals are clear enough that people can disagree with them. This is considered a breakthrough." },
      { label: 'Use impressive abstractions',
        effects: { reputation: 4, corpLoad: 8, energy: -3 },
        hint: 'Executive-safe',
        result: "The wording is gorgeous and means almost nothing. It sails through review." }
    ]
  },
  {
    id: 'okr_dependency_maze',
    type: 'work',
    scene: 'okr-maze',
    title: 'OKR Dependency Maze',
    text: "Your OKR depends on five other product teams. Each team has a different planning doc, a different metric, and a different definition of 'committed.'",
    choices: [
      { label: 'Build the dependency map',
        effects: { energy: -9, corpLoad: 12, reputation: 8, momentum: -5 },
        hint: 'Painful but clarifying',
        result: "You turn chaos into a map. Everyone thanks you. Then they ask for a follow-up sync." },
      { label: 'Negotiate one concrete milestone',
        effects: { energy: -5, corpLoad: -4, reputation: 5, momentum: 6 },
        hint: 'Shrink the blast radius',
        result: "You ignore the grand plan and get one team to commit to one thing by Friday. Miraculously, progress happens." }
    ]
  },
  {
    id: 'strategy_summit',
    type: 'work',
    scene: 'office',
    title: 'Strategy Summit',
    text: "An all-day summit appears on your calendar: long-term strategy, breakout groups, catered sandwiches, and no actual decisions until the last ten minutes.",
    choices: [
      { label: 'Participate for real',
        effects: { energy: -12, corpLoad: 8, reputation: 7, momentum: -4 },
        hint: 'Be the adult in the room',
        result: "You ask the useful questions, capture the messy tradeoffs, and leave with three action items nobody else wanted." },
      { label: 'Guard one hour to build',
        effects: { energy: -4, momentum: 10, reputation: -5 },
        hint: 'Strategic calendar defense',
        result: "You skip the second breakout and ship a small fix. The summit notes say 'alignment remains ongoing.' Naturally." }
    ]
  },
  {
    id: 'vp_review_queue',
    type: 'work',
    scene: 'vp-review',
    title: 'VP Review Queue',
    text: "You are ready to present, but the VP is booked for three days. A director asks for one more review before you can get on the calendar.",
    choices: [
      { label: 'Do the director review',
        effects: { energy: -8, corpLoad: 10, reputation: 5, momentum: -6 },
        hint: 'Pay the hierarchy tax',
        result: "The director adds two slides, removes one sentence, and says you are now 'much closer.' The VP still has not seen it." },
      { label: 'Send the sharp version now',
        effects: { energy: -4, corpLoad: 2, reputation: -3, momentum: 8 },
        hint: 'Risk the shortcut',
        result: "You send the cleanest version directly. The VP replies with one useful question. Three days collapse into ten minutes." }
    ]
  },
  {
    id: 'doc_comment_storm',
    type: 'work',
    scene: 'doc-comments',
    title: 'Comment Storm',
    text: "You open the Google Doc and see 47 new comments. Half are wording suggestions. Three contradict each other. One just says '+1 to pressure test.'",
    choices: [
      { label: 'Resolve every comment',
        effects: { energy: -10, corpLoad: 9, reputation: 6, momentum: -5 },
        hint: 'Document diplomacy',
        result: "You resolve comments until the doc is technically better and spiritually worse. The thread is quiet. For now." },
      { label: 'Call the decision',
        effects: { energy: -5, corpLoad: -6, reputation: -3, momentum: 7 },
        hint: 'Enough wordsmithing',
        result: "You summarize the tradeoff and name the decision. Several people are relieved. One person adds a comment anyway." }
    ]
  },
  {
    id: 'legal_review',
    type: 'work',
    scene: 'doc-comments',
    title: 'Legal Review',
    text: "Legal wants to review copy for a launch that is already late. Their feedback arrives as a PDF screenshot.",
    choices: [
      { label: 'Route it properly',
        effects: { reputation: 5, energy: -6, corpLoad: 8, momentum: -3 },
        hint: 'Process tax',
        result: "You translate screenshot feedback into text. This is now part of your identity." },
      { label: 'Simplify the launch',
        effects: { corpLoad: -5, momentum: 8, reputation: -2, energy: -2 },
        hint: 'Less surface area',
        result: "You cut the risky claims and ship a smaller message. It is not sexy. It is live." }
    ]
  },
  {
    id: 'vp_reorg',
    type: 'work',
    title: 'Reorg Season',
    text: "Your VP announced a reorg. Your project is officially 'sunset.' Suddenly your calendar is wide open.",
    choices: [
      { label: 'Use the free time to build',
        effects: { momentum: 15, familyScore: -1, reputation: -4 },
        hint: 'Code through the chaos',
        result: "You channel the corporate chaos into side project energy. Another evening away from home." },
      { label: 'Coast and be present at home',
        effects: { energy: 10, momentum: -5, familyScore: 1 },
        hint: 'Recharge with family',
        result: "You take long lunches, leave at 5, and play with the kids. Your energy recovers." }
    ]
  },
  {
    id: 'ceo_allhands',
    type: 'work',
    title: 'All-Hands Meeting',
    text: "CEO said 'AI' fourteen times. A VP demoed something that looks suspiciously like what you've been building on the side.",
    choices: [
      { label: 'Feel inspired, build faster',
        effects: { energy: -5, momentum: 15, familyScore: -1 },
        hint: 'Ship before they do',
        result: "If they're building it too, you need to ship first. Late nights ahead." },
      { label: 'Let it go, they have a team of 50',
        effects: { energy: 10, momentum: -10, familyScore: 1 },
        hint: 'Accept reality, go home early',
        result: "A trillion-dollar company is doing what you're doing. You close your laptop and go play with the kids." }
    ]
  },
  {
    id: 'sprint_overrun',
    type: 'work',
    title: 'Sprint Planning From Hell',
    text: "Sprint planning ran 90 minutes over. Your PM instincts are screaming. Your side project's sprint planning takes 30 seconds because you're the whole team.",
    choices: [
      { label: 'Zone out, sketch app ideas',
        effects: { momentum: 6, reputation: -5 },
        hint: 'Multitasking king',
        result: "You designed two new features in your notebook while nodding along." },
      { label: 'Actually engage, be a good PM',
        effects: { energy: -10, momentum: -5, reputation: 6, corpLoad: -5 },
        hint: 'Do your real job',
        result: "You gave the meeting your all. Your team appreciates it. Your side project doesn't." }
    ]
  },
  {
    id: 'manager_initiative',
    type: 'work',
    title: "Manager's Ask",
    text: "Your manager wants you to lead an extra cross-team initiative. More visibility, more work, potential raise.",
    choices: [
      { label: 'Accept — chase the promotion',
        effects: { savings: 2000, energy: -15, momentum: -10, familyScore: -1 },
        hint: 'More money, more meetings',
        result: "You say yes. More money, more meetings. Side project and family gather dust." },
      { label: 'Decline — protect your time',
        effects: { energy: 5, momentum: 5, familyScore: 1, reputation: -4 },
        hint: 'Keep your evenings',
        result: "Your manager is 'disappointed.' But you kept your evenings for building and bedtime stories." }
    ]
  },
  {
    id: 'energizing_brainstorm',
    type: 'work',
    scene: 'demo',
    title: 'Good Brainstorm',
    text: "The team gets in a room and, against all odds, the brainstorm is excellent. Engineers, design, research, and support all see the same customer pain.",
    choices: [
      { label: 'Turn it into a crisp plan',
        effects: { energy: -4, corpLoad: -6, reputation: 8, momentum: -4 },
        hint: 'Corporate work can work',
        result: "You leave with a real plan and fewer meetings than you started with. A rare and beautiful corporate artifact." },
      { label: 'Borrow the insight for your app',
        effects: { energy: 5, momentum: 14, reputation: -2 },
        hint: 'Customer pain travels',
        result: "The same customer pain shows up in your side project notes. Your day job accidentally made you a better builder." }
    ]
  },
  {
    id: 'agentic_engineers',
    type: 'work',
    scene: 'demo',
    title: 'Agentic Engineers',
    text: "Your engineers wire coding agents into the team workflow. PRs get smaller, tests appear faster, and the backlog starts losing fights.",
    choices: [
      { label: 'Clear blockers for them',
        effects: { energy: -6, corpLoad: -8, reputation: 9, momentum: -4 },
        hint: 'PM as force multiplier',
        result: "You spend the day removing ambiguity instead of creating it. The team ships at a speed that feels rude." },
      { label: 'Bring the pattern home',
        effects: { energy: -3, technicalSkill: 5, momentum: 16, familyScore: -1 },
        hint: 'Your side project wants this',
        result: "You rebuild your solo workflow around agents. It works so well you forget to eat dinner." }
    ]
  },
  {
    id: 'github_discovered',
    type: 'work',
    title: 'GitHub Discovered',
    text: "Your eng lead found your GitHub profile. They see the 11pm commit times. They ping you: 'Can we talk?'",
    choices: [
      { label: 'Be honest about side projects',
        effects: { momentum: 10, corpLoad: 4, reputation: 4, energy: -4 },
        hint: 'Own it',
        result: "They're actually impressed. 'Most PMs can't even open a terminal.' Eng cred earned." },
      { label: 'Ask them for code review',
        effects: { energy: -5, momentum: 15 },
        hint: 'Bold move',
        result: "They spend 30 minutes tearing your code apart. Brutal, but you learn more in that half hour than in a month of vibe coding." }
    ]
  },

  // =========== BUILDING EVENTS ===========

  {
    id: 'late_night',
    type: 'building',
    title: 'Late Night Breakthrough',
    text: "11pm. Kids asleep. You just had an idea and your fingers are already on the keyboard. Your spouse is reading in bed.",
    choices: [
      { label: 'Build through the night',
        effects: { energy: -10, momentum: 15, familyScore: -2 },
        hint: '"I\'ll come to bed soon"',
        result: "2:47am. It works. You deploy. Your spouse is asleep. You've been saying 'just 10 more minutes' for three hours." },
      { label: 'Write it down, come to bed',
        effects: { energy: 10, momentum: -4, familyScore: 2 },
        hint: 'Be present tonight',
        result: "You write the idea in your notes app. You get in bed. Your spouse says 'thanks for coming to bed.' That matters." }
    ]
  },
  {
    id: 'flow_state',
    type: 'building',
    title: 'Flow State',
    text: "Everything just clicks. The AI completes your thoughts. Tests pass. Time disappears. Your kid is tugging at your sleeve.",
    choices: [
      { label: 'Keep going — this doesn\'t happen often',
        effects: { energy: -8, momentum: 20, familyScore: -1 },
        hint: '"Not now, buddy"',
        result: "Four hours vanish. You built more tonight than in two weeks combined. Your kid stopped asking." },
      { label: 'Stop and see what they want',
        effects: { energy: 10, momentum: -2, familyScore: 2 },
        hint: 'They won\'t be little forever',
        result: "Your kid wanted to show you a drawing. It's you, coding. You close the laptop and draw together." }
    ]
  },
  {
    id: 'first_revenue',
    type: 'building',
    title: 'First Dollar',
    text: "You check Stripe during a meeting. Someone you've never met just paid $5 for your app. Your hands are shaking.",
    choices: [
      { label: 'Double down — add more features',
        effects: { savings: 200, energy: 5, momentum: 20, familyScore: -1 },
        hint: 'Chase the dream',
        result: "One paying customer means there could be more. You cancel weekend plans to ship features." },
      { label: 'Celebrate with the family',
        effects: { savings: 200, energy: 10, momentum: -5, familyScore: 2 },
        hint: 'Share the moment',
        result: "You show your spouse the Stripe dashboard. $5 has never felt so good. 'See? It's real.' Family dinner is celebratory." }
    ]
  },
  {
    id: 'auth_broken',
    type: 'building',
    title: 'Auth Is Broken',
    text: "Your login flow is completely broken. The AI-generated auth code looked right but doesn't work.",
    choices: [
      { label: 'Debug it yourself — learn auth properly',
        effects: { energy: -10, momentum: 5, technicalSkill: 3 },
        hint: 'Invest in understanding',
        result: "Four hours later, you understand OAuth. Actually understand it. The fix is two lines." },
      { label: 'Rip it out, use a hosted auth service',
        effects: { savings: -100, momentum: 10 },
        hint: 'Ship over learn',
        result: "Clerk set up in 20 minutes. You feel like you cheated, but it works." }
    ]
  },
  {
    id: 'css_nightmare',
    type: 'building',
    title: 'CSS Nightmare',
    text: "You've been fighting a CSS layout issue for 3 hours. The div won't center. You are losing your mind.",
    choices: [
      { label: 'Keep grinding — fix it properly',
        effects: { energy: -10, momentum: -5, technicalSkill: 4 },
        hint: 'Pride is expensive',
        result: "It was a missing display: flex. Three hours for one line. Tale as old as time." },
      { label: 'Ship it ugly',
        effects: { momentum: 10, reputation: -3 },
        hint: 'Nobody will notice. Probably.',
        result: "It looks slightly off on mobile. Nobody will notice. You move on to features that matter." }
    ]
  },
  {
    id: 'hacker_news',
    type: 'building',
    title: 'Hacker News Moment',
    text: "Someone posted your app on Hacker News. It's on the front page. Traffic is spiking. The top comment found a SQL injection.",
    choices: [
      { label: 'Fix it NOW — cancel everything',
        effects: { energy: -10, momentum: 5, familyScore: -2 },
        hint: 'Miss the school play',
        result: "You patch it in an hour. 'Dev fixed it fast. Respect.' You missed your kid's school play." },
      { label: 'Take the site down, fix it tonight',
        effects: { energy: -5, momentum: -5, familyScore: 1 },
        hint: 'Embarrassing but responsible',
        result: "Safe but embarrassing. You fix it after bedtime. The thread says 'lol it's down' but your kid saw you in the audience." }
    ]
  },
  {
    id: 'scope_creep',
    type: 'building',
    title: 'Feature Creep',
    text: "Your app does one thing well. But you keep thinking of features. Dark mode. Analytics. AI. Mobile app.",
    choices: [
      { label: 'Add one more feature',
        effects: { energy: -5, momentum: -5, technicalSkill: 3 },
        hint: 'Just one more...',
        result: "'One more feature' turned into three. You're further from shipping than last week." },
      { label: 'Ship it now, as is',
        effects: { savings: -100, energy: -5, momentum: 20, appsShipped: 1 },
        hint: 'Done is better than perfect',
        result: "You hit deploy. It's not perfect. But it's live and people can use it." }
    ]
  },
  {
    id: 'coffee_shop',
    type: 'building',
    title: 'Coffee Shop Coding',
    text: "Saturday morning. You take your laptop to a coffee shop. No kids, no Slack, just you and the code.",
    choices: [
      { label: 'Build something new',
        effects: { savings: -15, energy: 5, momentum: 15, familyScore: -1 },
        hint: 'A whole morning away',
        result: "Three hours, two lattes, one beautiful feature. Your spouse handled the kids alone all morning." },
      { label: 'Just an hour, then go home',
        effects: { savings: -8, energy: 5, momentum: 8, familyScore: -2 },
        hint: 'Quick session, back for lunch',
        result: "One focused hour and you're home by lunch — refreshed, a little further along. Your spouse still covered the whole morning solo, again." }
    ]
  },
  {
    id: 'deploy_disaster',
    type: 'building',
    title: 'Deploy Disaster',
    text: "You deployed to production. Forgot environment variables. Your app is hitting your dev database. In production.",
    choices: [
      { label: 'Panic fix — hotfix now',
        effects: { energy: -10, momentum: 8, reputation: -3 },
        hint: 'Fast but sloppy',
        result: "Fixed in 20 minutes. You kept moving, but you patched it blind and the root cause is still lurking." },
      { label: 'Roll back, fix properly',
        effects: { energy: -8, momentum: -4, technicalSkill: 4 },
        hint: 'Slow but you learn',
        result: "You roll back, set up proper env management, and redeploy. You now understand why DevOps is a job." }
    ]
  },
  {
    id: 'new_model_drop',
    type: 'building',
    title: 'New Model Drop',
    text: "Anthropic just dropped a new model. Your Twitter feed is on fire. Everyone's saying it changes everything.",
    choices: [
      { label: 'Rebuild your workflow',
        effects: { energy: -10, technicalSkill: 5 },
        hint: 'Chase the shiny thing',
        result: "Two days of re-tooling later you actually know the new model cold — and your sleep is wrecked and your half-built feature went cold with it." },
      { label: 'Stay focused, ship first',
        effects: { momentum: 8, familyScore: -2 },
        hint: 'Discipline over hype',
        result: "You resist the urge and ship the feature while everyone else re-reads release notes. It's just another night the family ate without you." }
    ]
  },
  {
    id: 'customer_community',
    type: 'building',
    scene: 'customer-community',
    title: 'Real Customer Community',
    text: "A tiny group of real customers starts hanging out in your Discord. They are not huge, but they are honest, specific, and weirdly generous.",
    choices: [
      { label: 'Talk to them tonight',
        effects: { energy: -4, momentum: 18, audience: 8, reputation: 5 },
        hint: 'Real feedback loop',
        result: "They tell you what hurts, what delights, and what they would pay for. Your roadmap gets shorter and better." },
      { label: 'Set office hours Saturday',
        effects: { energy: 8, momentum: 10, audience: 5, familyScore: 1, reputation: -2 },
        hint: 'Sustainable community',
        result: "You give customers a real window and keep dinner intact. The community appreciates the rhythm." }
    ]
  },
  {
    id: 'launch_flop',
    type: 'building',
    scene: 'late-night',
    title: 'Launch Flop',
    text: "You launch a feature you were sure people wanted. Three users click it. One emails to ask if it can be hidden.",
    choices: [
      { label: 'Kill it quickly',
        effects: { energy: 8, momentum: -10 },
        hint: 'No sunk-cost shrine',
        result: "You cut it loose and feel lighter. The app gets simpler; so does your roadmap, with a little hole where the work used to be." },
      { label: 'Polish it harder',
        effects: { energy: -10, momentum: -6, familyScore: -1, technicalSkill: 3 },
        hint: 'Maybe they just did not get it',
        result: "You spend another night improving the thing nobody asked for. The lesson gets more expensive." }
    ]
  },

  // =========== LIFE EVENTS ===========

  {
    id: 'board_games',
    type: 'life',
    title: 'Family Game Night',
    text: "Your daughter wants to play board games tonight. You were planning to code after dinner.",
    choices: [
      { label: 'Play with the kids',
        effects: { energy: 15, momentum: -5, familyScore: 2 },
        hint: 'Candy Land. Three times.',
        result: "You play Candy Land three times. Your kid says 'this is the best night ever.' The code can wait." },
      { label: "Say 'maybe tomorrow'",
        effects: { energy: -5, momentum: 5, familyScore: -2 },
        hint: "You've said this before",
        result: "You code for two hours but can't shake the guilt. Your daughter went to bed early." }
    ]
  },
  {
    id: 'family_vacation',
    type: 'life',
    title: 'Family Vacation',
    text: "A week at the beach. No laptop allowed (your spouse made you promise). But you could sneak your phone...",
    choices: [
      { label: 'Truly unplug',
        effects: { savings: -3000, energy: 30, momentum: -10, familyScore: 3 },
        hint: 'Be fully there',
        result: "No screens for 7 days. Your kid says 'Dad/Mom, you're fun again.' That hits different." },
      { label: 'Sneak in some coding',
        effects: { savings: -3000, energy: 15, momentum: 5, familyScore: -2 },
        hint: 'You promised you wouldn\'t',
        result: "You fixed two bugs from a beach chair. Your spouse caught you. 'You promised.' The rest of the trip is tense." }
    ]
  },
  {
    id: 'kid_sick',
    type: 'life',
    title: 'Sick Day',
    text: "Kid is sick. Pediatrician at 8am, home all day with a cranky toddler. Nap time exists though...",
    choices: [
      { label: 'Full parent mode — no screens',
        effects: { energy: -10, momentum: -5, familyScore: 2 },
        hint: 'They need you today',
        result: "Exhausting day. Your kid falls asleep on you. These days won't last forever." },
      { label: 'Code during nap time',
        effects: { energy: -15, momentum: 10, familyScore: -1 },
        hint: '90 minutes if you\'re lucky',
        result: "90 minutes of nap time coding. Productive. But you were checking your phone when they woke up crying." }
    ]
  },
  {
    id: 'laptop_drawing',
    type: 'life',
    title: 'The Drawing',
    text: "Your 4-year-old drew a picture of the family. You're holding a laptop. Everyone else is holding hands.",
    choices: [
      { label: 'Close the laptop for the week',
        effects: { energy: 20, momentum: -10, familyScore: 3 },
        hint: 'They notice everything',
        result: "You spend the week fully present. No code. Your kid draws a new picture — this time you're holding their hand." },
      { label: 'Feel the guilt, keep building',
        effects: { energy: -5, momentum: 5, familyScore: -2 },
        hint: 'This is for them too... right?',
        result: "You put the drawing on the fridge. You think about it while coding at midnight. It's complicated." }
    ]
  },
  {
    id: 'swim_lessons',
    type: 'life',
    title: 'Saturday Morning Window',
    text: "Kids at swim lessons. 90 uninterrupted minutes. The most productive window of your entire week.",
    choices: [
      { label: 'Code like your life depends on it',
        effects: { momentum: 15, familyScore: -1, energy: -8 },
        hint: 'Don\'t waste this',
        result: "90 minutes of pure flow. You ship a feature that's been stuck for two weeks." },
      { label: 'Actually watch them swim',
        effects: { energy: 15, momentum: -5, familyScore: 2 },
        hint: 'They look for you in the stands',
        result: "Your kid waves at you from the pool. You wave back. No laptop. They're getting so good." }
    ]
  },
  {
    id: 'partner_question',
    type: 'life',
    title: 'The Question',
    text: "Your spouse asks: 'Is this coding thing... going somewhere? Or is it just taking you away from us?'",
    choices: [
      { label: "'I think I can make this real'",
        effects: { momentum: 15, familyScore: -1 },
        hint: 'Doubles the pressure',
        result: "You say it out loud. It feels terrifying. Your spouse nods. 'Okay. Show me.' The clock is ticking now." },
      { label: "'You're right, I need to find balance'",
        effects: { energy: 10, momentum: -5, familyScore: 2 },
        hint: 'Ease the tension',
        result: "The pressure is off. Your spouse smiles. You mean it. You think you mean it." }
    ]
  },
  {
    id: 'good_sleep',
    type: 'life',
    title: 'Full Night\'s Sleep',
    text: "Both kids slept through the night. You woke up at 7am. No alarms. You feel... good?",
    choices: [
      { label: 'Use the energy to build',
        effects: { momentum: 15, familyScore: -2 },
        hint: 'Strike while rested',
        result: "You're sharper than you've been in weeks. Code flows. Bugs get squashed." },
      { label: 'Spend the morning with the family',
        effects: { energy: 20, familyScore: 1, momentum: -4 },
        hint: 'Pancakes and cartoons',
        result: "You make pancakes. Watch cartoons. Exist like a normal person. Revolutionary." }
    ]
  },
  {
    id: 'old_friend',
    type: 'life',
    title: 'Friend From College',
    text: "An old friend calls. They're a developer now. Dinner this week?",
    choices: [
      { label: 'Go to dinner',
        effects: { savings: -100, energy: 10, momentum: -3 },
        hint: 'Real human connection',
        result: "Great conversation. They give you a tip about deploying on Railway. You leave energized." },
      { label: 'Raincheck — too busy',
        effects: { momentum: 5, familyScore: -1 },
        hint: 'Another plan canceled',
        result: "You code instead. Productive night. You realize you've been canceling a lot of plans." }
    ]
  },
  {
    id: 'bedtime_routine',
    type: 'life',
    title: 'Bedtime Stories',
    text: "It's 7:30pm. Prime coding hours are about to start. But your kid wants you to read them a story. Three stories.",
    choices: [
      { label: 'Read all three stories',
        effects: { energy: 5, momentum: -5, familyScore: 2 },
        hint: 'They fall asleep on you',
        result: "Three stories, two glasses of water, one monster check. They fall asleep holding your hand. You lost an hour of coding. You gained something else." },
      { label: 'One story, then code',
        effects: { momentum: 8, familyScore: -1 },
        hint: 'Quick version',
        result: "One story. A quick kiss. You're at your desk by 7:45. Efficient. Your kid asks your spouse to read the other two." }
    ]
  }
];
