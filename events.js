// ========================================
// THE BUILDER TRAIL — Events & Content (M3)
// ========================================

// --- Projects (halved durations) ---
const PROJECTS = [
  // Small (1-2 weeks base)
  { id: 'meal-planner', name: 'Meal Planner', description: 'A meal planning app for your family', size: 'small', baseWeeks: 1, baseEnergy: 6, baseIncome: 75 },
  { id: 'reading-tracker', name: 'Reading Tracker', description: "A dashboard that tracks your kid's reading progress", size: 'small', baseWeeks: 2, baseEnergy: 6, baseIncome: 50 },
  { id: 'waitlist-app', name: 'Local Waitlist', description: 'A local restaurant waitlist app', size: 'small', baseWeeks: 1, baseEnergy: 7, baseIncome: 100 },
  { id: 'scoreboard', name: 'Game Night Scoreboard', description: 'A multiplayer board game scoring app', size: 'small', baseWeeks: 2, baseEnergy: 6, baseIncome: 60 },

  // Medium (2-3 weeks base)
  { id: 'interview-prep', name: 'PM Interview Prep', description: 'An AI-powered PM interview prep tool', size: 'medium', baseWeeks: 3, baseEnergy: 10, baseIncome: 200 },
  { id: 'prd-generator', name: 'PRD Generator', description: 'An AI wrapper that generates PRDs from voice notes', size: 'medium', baseWeeks: 3, baseEnergy: 10, baseIncome: 250 },
  { id: 'slack-summarizer', name: 'Meeting Summarizer', description: 'A Slack bot that summarizes meeting notes', size: 'medium', baseWeeks: 2, baseEnergy: 8, baseIncome: 175 },
  { id: 'habit-tracker', name: 'AI Habit Coach', description: 'A habit tracker with AI coaching', size: 'medium', baseWeeks: 3, baseEnergy: 10, baseIncome: 200 },

  // Large (4-5 weeks base)
  { id: 'linktree-killer', name: 'LinkPage', description: 'A competitor to Linktree but actually good', size: 'large', baseWeeks: 5, baseEnergy: 13, baseIncome: 400 },
  { id: 'saas-dashboard', name: 'Analytics Dashboard', description: 'A full SaaS analytics dashboard', size: 'large', baseWeeks: 5, baseEnergy: 13, baseIncome: 500 },
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
      { label: 'DIY it over the weekend', effects: { savings: -800, energy: -15, familyScore: -1 },
        hint: 'Cheaper but exhausting',
        result: "YouTube tutorials, three trips to Home Depot, and a very long weekend. It works. Mostly. You're destroyed." },
      { label: 'Patch it and pray', effects: { savings: -200, energy: -5 },
        hint: 'Might not hold',
        result: "Duct tape and hope. It'll hold for now. Probably." }
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
      { label: 'Fight the insurance company', effects: { savings: -1200, energy: -12, momentum: -5 },
        hint: 'Hours on hold',
        result: "Three hours on hold. Four phone calls. They cover another $2,000. You lose a week of building momentum." },
      { label: 'Set up a payment plan', effects: { savings: -800, momentum: -3 },
        hint: 'Spread the pain',
        result: "Monthly payments. The bill hangs over you but the immediate hit is manageable." }
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
      { label: 'Find the cheapest fix', effects: { savings: -800, energy: -8 },
        hint: 'Band-aid solution',
        result: "A shade-tree mechanic does something. It runs. The check engine light is on, but it runs." },
      { label: 'Bike and bus for a while', effects: { energy: -10, momentum: -5, familyScore: -1 },
        hint: 'Save money, lose time',
        result: "Daycare drop-off by bus takes 45 minutes. Your spouse is not thrilled. But you saved $2,000." }
    ]
  },
  {
    id: 'expense-tax',
    condition: (s) => s.week >= 20 && s.week <= 24,
    type: 'life',
    title: 'Tax Surprise',
    text: "Your accountant calls. Side project income means you owe $5,000 in estimated taxes. Should have set that aside.",
    choices: [
      { label: 'Pay it now', effects: { savings: -5000 },
        hint: 'Clean slate',
        result: "Gone. Just like that. But at least the IRS won't come knocking." },
      { label: 'Defer and pay the penalty later', effects: { savings: -1500, momentum: -5 },
        hint: 'Kicks the can',
        result: "You'll deal with it in April. The penalty adds up but you keep building." },
      { label: 'Panic-optimize your deductions', effects: { savings: -3000, energy: -10 },
        hint: 'Stressful but saves money',
        result: "You spend a weekend in TurboTax hell. Home office deduction, equipment write-offs. You knock it down to $3,000." }
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
      { label: 'Partner up', effects: { energy: 10, momentum: 20, familyScore: -1 },
        hint: 'More power, less family time',
        result: "Two builders are better than one. But every evening meeting is an evening away from home." },
      { label: 'Stay solo', effects: { momentum: 10, familyScore: 1 },
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
      { label: 'Decline — focus on your apps', effects: { momentum: 10 },
        hint: 'Bet on yourself',
        result: "You turn down guaranteed income to bet on yourself. Terrifying. But your apps need your attention." },
      { label: 'Negotiate: 5 hours a week', effects: { savings: 750, energy: -8 },
        hint: 'Balanced approach',
        result: "Half the work, half the pay. A sustainable side-side-hustle." }
    ]
  },
  {
    id: 'money-tight',
    condition: (s) => s.savings <= 15000 && s.savings > 0,
    type: 'life',
    title: "Money's Getting Tight",
    text: "The runway is shortening. You check your burn rate. Bay Area rent doesn't care about your dreams.",
    choices: [
      { label: 'Cut costs everywhere', effects: { savings: 2000, energy: 5, familyScore: -1 },
        hint: 'Cancel the kids activities too',
        result: "You downgrade everything. Free tiers, no eating out, cancel swim lessons. The bleeding stops." },
      { label: 'Push harder — ship for revenue', effects: { energy: -10, momentum: 15 },
        hint: 'Desperation mode',
        result: "Desperation is a hell of a motivator. You focus everything on getting to revenue." },
      { label: 'Ask for a raise at work', effects: { savings: 3000, energy: -5, momentum: -5 },
        hint: 'Awkward but practical',
        result: "Awkward conversation. But it works. More runway, less pride." }
    ]
  },
  {
    id: 'flow-state-decision',
    condition: (s) => s.momentum > 80,
    type: 'building',
    title: 'Pure Flow',
    text: "Everything you touch turns to shipped code. You're in the zone. The question is: go big or stay steady?",
    choices: [
      { label: 'Go all-in on a Large project', effects: { energy: -10, momentum: 10, familyScore: -1 },
        hint: 'This could be the one',
        result: "You commit to something ambitious. The flow state carries you. Family dinners get shorter." },
      { label: 'Stack small wins', effects: { energy: 5, momentum: 5 },
        hint: 'Sustainable pace',
        result: "You resist the temptation. Small, shipped, real. Each one adds to your portfolio." }
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
      { label: 'Accept and ship', effects: { momentum: 15, energy: 5 },
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
      { label: 'Trust the diff, move on', effects: { momentum: 15, energy: 10 },
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
      { label: 'Export and fix manually', effects: { energy: -15, momentum: 5 },
        hint: 'Painful but real',
        result: "You eject from Lovable. The code is... not how you'd write it. But you make it work." },
      { label: 'Redesign around the limitation', effects: { energy: -5, momentum: 10 },
        hint: 'Work with what you have',
        result: "You simplify the feature to work within Lovable's comfort zone. Constraint breeds creativity." }
    ]
  },
  {
    id: 'replit-deploy-easy',
    type: 'building',
    tools: ['replit'],
    title: 'One-Click Deploy',
    text: "You hit Deploy on Replit. It just works. No Vercel config, no Docker, no CI/CD. It's just... deployed.",
    choices: [
      { label: 'Ship more features while it lasts', effects: { momentum: 15, energy: 5 },
        hint: 'Ride the momentum',
        result: "You ship two features today. Deployment is not a problem anymore." },
      { label: 'Set up a proper domain', effects: { savings: -20, momentum: 10 },
        hint: 'Look professional',
        result: "Custom domain configured. It looks real now. Professional." }
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
      { label: 'Let them cook', effects: { momentum: 25, energy: -10 },
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
      { label: 'Ask for more feedback', effects: { momentum: 15, energy: 5 },
        hint: 'Dig deeper',
        result: "They spend 20 minutes telling you what to improve. Pure gold." },
      { label: 'Screenshot it and keep building', effects: { momentum: 10 },
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
      { label: 'Find your niche', effects: { energy: -5, momentum: 10 },
        hint: 'Pivot slightly',
        result: "You pivot slightly. Your version serves a niche they'll never bother with." },
      { label: 'Abandon — they already won', effects: { energy: 10, momentum: -15 },
        hint: 'Cut your losses',
        result: "You close the project. The sting fades. Onto the next idea." }
    ]
  },
  {
    id: 'project-bug-crisis',
    type: 'building',
    requiresActiveProject: true,
    title: 'Production Bug',
    text: () => `A critical bug in ${state.activeProject.name}. Users are hitting errors. Your phone buzzes with error alerts.`,
    choices: [
      { label: 'Drop everything and fix it', effects: { energy: -10, momentum: 5, familyScore: -1 },
        hint: 'Right now, during dinner',
        result: "You leave the dinner table. Fixed in an hour. Users happy. Your spouse less so." },
      { label: 'It can wait until tomorrow', effects: { energy: 5, momentum: -5, familyScore: 1 },
        hint: 'Stay present tonight',
        result: "You put the phone away. Two users left. But you finished dinner with your family." }
    ]
  }
];

// --- Base Events (trimmed to ~28, all with familyScore where relevant) ---
const EVENTS = [

  // =========== WORK EVENTS ===========

  {
    id: 'vp_reorg',
    type: 'work',
    title: 'Reorg Season',
    text: "Your VP announced a reorg. Your project is officially 'sunset.' Suddenly your calendar is wide open.",
    choices: [
      { label: 'Use the free time to build',
        effects: { momentum: 15, familyScore: -1 },
        hint: 'Code through the chaos',
        result: "You channel the corporate chaos into side project energy. Another evening away from home." },
      { label: 'Coast and be present at home',
        effects: { energy: 20, momentum: -5, familyScore: 1 },
        hint: 'Recharge with family',
        result: "You take long lunches, leave at 5, and play with the kids. Your energy recovers." }
    ]
  },
  {
    id: 'perf_review',
    type: 'work',
    title: 'Perf Review Season',
    text: "Self-review due Friday. You need to write about your 'impact' and 'cross-functional leadership.' Or you could phone it in.",
    choices: [
      { label: 'Write a thorough self-review',
        effects: { savings: 500, energy: -10, momentum: -5 },
        hint: 'Chase the bonus',
        result: "Exhausting, but your manager is impressed. Small bonus incoming." },
      { label: 'Copy-paste from last cycle',
        effects: { energy: 5, momentum: 5 },
        hint: 'Nobody reads these anyway',
        result: "Nobody noticed. You spent the saved time on your side project instead." }
    ]
  },
  {
    id: 'ceo_allhands',
    type: 'work',
    title: 'All-Hands Meeting',
    text: "CEO said 'AI' fourteen times. A VP demoed something that looks suspiciously like what you've been building on the side.",
    choices: [
      { label: 'Feel inspired, build faster',
        effects: { energy: 5, momentum: 15, familyScore: -1 },
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
        effects: { momentum: 10 },
        hint: 'Multitasking king',
        result: "You designed two new features in your notebook while nodding along." },
      { label: 'Actually engage, be a good PM',
        effects: { energy: -10, momentum: -5 },
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
        effects: { energy: 5, momentum: 5, familyScore: 1 },
        hint: 'Keep your evenings',
        result: "Your manager is 'disappointed.' But you kept your evenings for building and bedtime stories." }
    ]
  },
  {
    id: 'github_discovered',
    type: 'work',
    title: 'GitHub Discovered',
    text: "Your eng lead found your GitHub profile. They see the 11pm commit times. They ping you: 'Can we talk?'",
    choices: [
      { label: 'Be honest about side projects',
        effects: { momentum: 10 },
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
        effects: { energy: 10, momentum: 3, familyScore: 2 },
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
        effects: { energy: 5, momentum: 20, familyScore: -1 },
        hint: '"Not now, buddy"',
        result: "Four hours vanish. You built more tonight than in two weeks combined. Your kid stopped asking." },
      { label: 'Stop and see what they want',
        effects: { energy: 10, momentum: 5, familyScore: 2 },
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
        effects: { savings: 200, energy: 10, momentum: 15, familyScore: 2 },
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
        effects: { energy: -10, momentum: 5 },
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
        effects: { energy: -10, momentum: -5 },
        hint: 'Pride is expensive',
        result: "It was a missing display: flex. Three hours for one line. Tale as old as time." },
      { label: 'Ship it ugly',
        effects: { momentum: 10 },
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
        effects: { energy: -10, momentum: 15, familyScore: -2 },
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
        effects: { energy: -5, momentum: -5 },
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
        effects: { savings: -8, energy: 5, momentum: 8, familyScore: 1 },
        hint: 'Quick session, back for lunch',
        result: "One focused hour. You're home by 11. The kids are happy to see you. Balanced." }
    ]
  },
  {
    id: 'deploy_disaster',
    type: 'building',
    title: 'Deploy Disaster',
    text: "You deployed to production. Forgot environment variables. Your app is hitting your dev database. In production.",
    choices: [
      { label: 'Panic fix — hotfix now',
        effects: { energy: -10 },
        hint: 'Drop everything',
        result: "Fixed in 20 minutes. Nobody noticed. You add a deployment checklist." },
      { label: 'Roll back, fix properly',
        effects: { energy: -5, momentum: 5 },
        hint: 'Slow and safe',
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
        effects: { savings: -50, momentum: 15 },
        hint: 'Chase the shiny thing',
        result: "The new model is genuinely better. Your code generation is 2x faster." },
      { label: 'Stay focused, ship first',
        effects: { energy: 5, momentum: 5 },
        hint: 'Discipline over hype',
        result: "You resist the urge. Your current setup works. Ship first, optimize later." }
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
        result: "You put the drawing on the fridge. You think about it while coding at midnight. It's complicated." },
      { label: 'Build something together',
        effects: { energy: 5, momentum: 10, familyScore: 2 },
        hint: 'Let them press the spacebar',
        result: "Your kid 'helps' you code. They press the spacebar 400 times. Best pairing session you've ever had." }
    ]
  },
  {
    id: 'dinner_analytics',
    type: 'life',
    title: 'Analytics at Dinner',
    text: "You're checking your app's analytics at dinner. Again. Your spouse gives you The Look.",
    choices: [
      { label: 'Put the phone away',
        effects: { energy: 10, momentum: -5, familyScore: 2 },
        hint: 'Be here now',
        result: "You put it face down. You have an actual conversation. Remember those?" },
      { label: "'Just one more check'",
        effects: { momentum: 5, familyScore: -2 },
        hint: 'You always say that',
        result: "You check. 3 new users. Your spouse starts clearing dishes. Alone." }
    ]
  },
  {
    id: 'swim_lessons',
    type: 'life',
    title: 'Saturday Morning Window',
    text: "Kids at swim lessons. 90 uninterrupted minutes. The most productive window of your entire week.",
    choices: [
      { label: 'Code like your life depends on it',
        effects: { momentum: 15 },
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
        result: "The pressure is off. Your spouse smiles. You mean it. You think you mean it." },
      { label: "'I don't know yet'",
        effects: { energy: 5, momentum: 5 },
        hint: 'Honest but uncertain',
        result: "Honest. 'Figure it out. I'm here.' That's enough for now." }
    ]
  },
  {
    id: 'exercise',
    type: 'life',
    title: 'Gym or Code',
    text: "You haven't exercised in two weeks. Your back hurts. But you're so close to finishing a feature.",
    choices: [
      { label: 'Go to the gym',
        effects: { energy: 20, momentum: -5 },
        hint: 'Your body is begging',
        result: "Runner's high is real. You come back with more energy than caffeine ever gave you." },
      { label: 'Skip it, finish the feature',
        effects: { energy: -5, momentum: 10 },
        hint: 'Definitely going tomorrow',
        result: "Feature done. Back still hurts. You'll definitely go tomorrow. (You won't.)" }
    ]
  },
  {
    id: 'good_sleep',
    type: 'life',
    title: 'Full Night\'s Sleep',
    text: "Both kids slept through the night. You woke up at 7am. No alarms. You feel... good?",
    choices: [
      { label: 'Use the energy to build',
        effects: { energy: 10, momentum: 15 },
        hint: 'Strike while rested',
        result: "You're sharper than you've been in weeks. Code flows. Bugs get squashed." },
      { label: 'Spend the morning with the family',
        effects: { energy: 20, familyScore: 1 },
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
        effects: { savings: -100, energy: 10, momentum: 5 },
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
