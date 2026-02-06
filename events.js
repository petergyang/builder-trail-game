// ========================================
// THE BUILDER TRAIL — Events & Content (M2)
// ========================================

// --- Projects ---
const PROJECTS = [
  // Small (2-3 weeks base)
  { id: 'meal-planner', name: 'Meal Planner', description: 'A meal planning app for your family', size: 'small', baseWeeks: 2, baseEnergy: 6, baseIncome: 75 },
  { id: 'reading-tracker', name: 'Reading Tracker', description: "A dashboard that tracks your kid's reading progress", size: 'small', baseWeeks: 3, baseEnergy: 6, baseIncome: 50 },
  { id: 'waitlist-app', name: 'Local Waitlist', description: 'A local restaurant waitlist app', size: 'small', baseWeeks: 2, baseEnergy: 7, baseIncome: 100 },
  { id: 'scoreboard', name: 'Game Night Scoreboard', description: 'A multiplayer board game scoring app', size: 'small', baseWeeks: 3, baseEnergy: 6, baseIncome: 60 },

  // Medium (4-6 weeks base)
  { id: 'interview-prep', name: 'PM Interview Prep', description: 'An AI-powered PM interview prep tool', size: 'medium', baseWeeks: 5, baseEnergy: 10, baseIncome: 200 },
  { id: 'prd-generator', name: 'PRD Generator', description: 'An AI wrapper that generates PRDs from voice notes', size: 'medium', baseWeeks: 5, baseEnergy: 10, baseIncome: 250 },
  { id: 'slack-summarizer', name: 'Meeting Summarizer', description: 'A Slack bot that summarizes meeting notes', size: 'medium', baseWeeks: 4, baseEnergy: 8, baseIncome: 175 },
  { id: 'habit-tracker', name: 'AI Habit Coach', description: 'A habit tracker with AI coaching', size: 'medium', baseWeeks: 5, baseEnergy: 10, baseIncome: 200 },

  // Large (8-12 weeks base)
  { id: 'linktree-killer', name: 'LinkPage', description: 'A competitor to Linktree but actually good', size: 'large', baseWeeks: 9, baseEnergy: 13, baseIncome: 400 },
  { id: 'saas-dashboard', name: 'Analytics Dashboard', description: 'A full SaaS analytics dashboard', size: 'large', baseWeeks: 11, baseEnergy: 13, baseIncome: 500 },
];

// --- Inflection Points ---
const INFLECTIONS = [
  {
    id: 'cofounder-offer',
    condition: (s) => s.appsShipped >= 3,
    type: 'building',
    title: 'Co-Founder Offer',
    text: "Your friend Alex has been watching you ship. They DM you: 'I quit my job. Let's build something together. 50/50.'",
    choices: [
      { label: 'Partner up', effects: { energy: 10, momentum: 20 },
        result: "Two builders are better than one. Energy costs drop and ideas come faster. But every decision takes twice as long now." },
      { label: 'Stay solo', effects: { momentum: 10 },
        result: "You say no. It's lonely, but it's fast. You keep full control." }
    ]
  },
  {
    id: 'freelance-opportunity',
    condition: (s) => s.technicalSkill > 60,
    type: 'building',
    title: 'Freelance Gig',
    text: "A startup founder found your portfolio. '$150/hour for 10 hours a week. React work.' Your technical skill is real now.",
    choices: [
      { label: 'Take the freelance work', effects: { savings: 1500, energy: -15 },
        result: "The money is great. But between your day job, freelance, and side projects, something has to give." },
      { label: 'Decline — focus on your apps', effects: { momentum: 10 },
        result: "You turn down guaranteed income to bet on yourself. Terrifying. But your apps need your attention." },
      { label: 'Negotiate: 5 hours a week', effects: { savings: 750, energy: -8 },
        result: "Half the work, half the pay. A sustainable side-side-hustle." }
    ]
  },
  {
    id: 'money-tight',
    condition: (s) => s.savings <= 20000 && s.savings > 0,
    type: 'life',
    title: "Money's Getting Tight",
    text: "The runway is shortening. You check your burn rate. The math isn't great.",
    choices: [
      { label: 'Cut costs — fewer API bills', effects: { savings: 2000, energy: 5 },
        result: "You downgrade to free tiers everywhere. Builds are slower, but the bleeding stops." },
      { label: 'Push harder — ship for revenue', effects: { energy: -10, momentum: 15 },
        result: "Desperation is a hell of a motivator. You focus everything on getting to revenue." },
      { label: 'Ask for a raise at work', effects: { savings: 3000, energy: -5, momentum: -5 },
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
      { label: 'Go all-in on a Large project', effects: { energy: -10, momentum: 10 },
        result: "You commit to something ambitious. The flow state carries you. This could be the one." },
      { label: 'Stack small wins', effects: { energy: 5, momentum: 5 },
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
      { label: 'Accept and ship', effects: { momentum: 15, energy: 5 }, result: "Tab. Tab. Tab. Done. This is the future." },
      { label: 'Rewrite it to understand it', effects: { momentum: 5, energy: -5 }, result: "You rewrite it line by line. Now you actually know what it does." }
    ]
  },
  {
    id: 'claude-code-autonomy',
    type: 'building',
    tools: ['claude-code'],
    title: 'Claude Goes Rogue',
    text: "You told Claude Code to 'fix the bug.' It refactored three files, added tests, and upgraded a dependency. The bug is fixed. You're not sure what else changed.",
    choices: [
      { label: 'Trust the diff, move on', effects: { momentum: 15, energy: 10 }, result: "You scan the diff. It looks... better? You ship it. Living dangerously." },
      { label: 'Review every line', effects: { momentum: 5, energy: -10 }, result: "Two hours of code review later, you understand your own codebase better. Also, Claude was right." }
    ]
  },
  {
    id: 'lovable-ceiling',
    type: 'building',
    tools: ['lovable'],
    title: 'The Lovable Ceiling',
    text: "Your Lovable app looks amazing. But you need a custom API integration and the AI keeps generating the same broken code.",
    choices: [
      { label: 'Export and fix manually', effects: { energy: -15, momentum: 5 }, result: "You eject from Lovable. The code is... not how you'd write it. But you make it work." },
      { label: 'Redesign around the limitation', effects: { energy: -5, momentum: 10 }, result: "You simplify the feature to work within Lovable's comfort zone. Constraint breeds creativity." }
    ]
  },
  {
    id: 'replit-deploy-easy',
    type: 'building',
    tools: ['replit'],
    title: 'One-Click Deploy',
    text: "You hit Deploy on Replit. It just works. No Vercel config, no Docker, no CI/CD. It's just... deployed.",
    choices: [
      { label: 'Ship more features while it lasts', effects: { momentum: 15, energy: 5 }, result: "You ship two features today. Deployment is not a problem anymore." },
      { label: 'Set up a proper domain', effects: { savings: -20, momentum: 10 }, result: "Custom domain configured. It looks real now. Professional." }
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
      { label: 'Let them cook', effects: { momentum: 25, energy: -10 }, result: "Three agents, one codebase, zero merge conflicts. You built a week's worth of features in one evening." },
      { label: 'Dial it back to one agent', effects: { momentum: 10, energy: -5 }, result: "Too much too fast. You stick with one agent but the potential is there." }
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
      { label: 'Ask for more feedback', effects: { momentum: 15, energy: 5 }, result: "They spend 20 minutes telling you what to improve. Pure gold." },
      { label: 'Screenshot it and keep building', effects: { momentum: 10 }, result: "Saved to your 'motivation' folder. Back to work." }
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
      { label: 'Ship faster — first mover', effects: { energy: -10, momentum: 15 }, result: "You can't out-resource them, but you can out-speed them. Ship now, iterate later." },
      { label: 'Find your niche', effects: { energy: -5, momentum: 10 }, result: "You pivot slightly. Your version serves a niche they'll never bother with." },
      { label: 'Abandon — they already won', effects: { energy: 10, momentum: -15 }, result: "You close the project. The sting fades. Onto the next idea." }
    ]
  },
  {
    id: 'project-bug-crisis',
    type: 'building',
    requiresActiveProject: true,
    title: 'Production Bug',
    text: () => `A critical bug in ${state.activeProject.name}. Users are hitting errors. Your phone buzzes with error alerts.`,
    choices: [
      { label: 'Drop everything and fix it', effects: { energy: -10, momentum: 5 }, result: "Fixed in an hour. Users happy. You learned something about error handling." },
      { label: 'It can wait until tomorrow', effects: { energy: 5, momentum: -5 }, result: "You sleep on it. Two users left. But you're rested and fix it properly in the morning." }
    ]
  }
];

// --- Base Events ---
const EVENTS = [

  // =========== WORK EVENTS ===========

  {
    id: 'vp_reorg',
    type: 'work',
    title: 'Reorg Season',
    text: "Your VP announced a reorg. Your project is officially 'sunset.' Suddenly your calendar is wide open.",
    choices: [
      {
        label: 'Use the free time to build',
        effects: { savings: 0, energy: 0, momentum: 15, appsShipped: 0 },
        result: "You channel the corporate chaos into side project energy. Best reorg ever."
      },
      {
        label: 'Coast and recharge',
        effects: { savings: 0, energy: 20, momentum: -5, appsShipped: 0 },
        result: "You take long lunches and leave at 5. Your energy recovers. Nice."
      }
    ]
  },
  {
    id: 'perf_review',
    type: 'work',
    title: 'Perf Review Season',
    text: "Self-review due Friday. You need to write about your 'impact' and 'cross-functional leadership.' Or you could phone it in.",
    choices: [
      {
        label: 'Write a thorough self-review',
        effects: { savings: 500, energy: -10, momentum: -5, appsShipped: 0 },
        result: "Exhausting, but your manager is impressed. Small bonus incoming."
      },
      {
        label: 'Copy-paste from last cycle',
        effects: { savings: 0, energy: 5, momentum: 5, appsShipped: 0 },
        result: "Nobody noticed. You spent the saved time on your side project instead."
      }
    ]
  },
  {
    id: 'ceo_allhands',
    type: 'work',
    title: 'All-Hands Meeting',
    text: "CEO said 'AI' fourteen times. A VP demoed something that looks suspiciously like what you've been building on the side.",
    choices: [
      {
        label: 'Feel inspired, build faster',
        effects: { savings: 0, energy: 5, momentum: 15, appsShipped: 0 },
        result: "If they're building it too, you need to ship first. Motivation: unlocked."
      },
      {
        label: 'Feel defeated, what\'s the point',
        effects: { savings: 0, energy: 10, momentum: -10, appsShipped: 0 },
        result: "A trillion-dollar company is doing what you're doing. With a team of 50. You close your laptop and take a nap."
      },
      {
        label: 'Pitch your side project to the VP',
        effects: { savings: 0, energy: -5, momentum: 15, appsShipped: 0 },
        result: "Bold move. The VP says 'interesting' three times, which could mean anything. But people know your name now."
      }
    ]
  },
  {
    id: 'sprint_overrun',
    type: 'work',
    title: 'Sprint Planning From Hell',
    text: "Sprint planning ran 90 minutes over. Your PM instincts are screaming. You realize your side project's sprint planning takes 30 seconds because you're the whole team.",
    choices: [
      {
        label: 'Zone out, sketch app ideas',
        effects: { savings: 0, energy: 0, momentum: 10, appsShipped: 0 },
        result: "You designed two new features in your notebook while nodding along. Multitasking king."
      },
      {
        label: 'Actually engage, be a good PM',
        effects: { savings: 0, energy: -10, momentum: -5, appsShipped: 0 },
        result: "You gave the meeting your all. Your team appreciates it. Your side project doesn't."
      }
    ]
  },
  {
    id: 'manager_initiative',
    type: 'work',
    title: "Manager's Ask",
    text: "Your manager wants you to lead an extra cross-team initiative. More visibility, more work, potential raise.",
    choices: [
      {
        label: 'Accept — chase the promotion',
        effects: { savings: 2000, energy: -15, momentum: -10, appsShipped: 0 },
        result: "You say yes. More money, more meetings. Your side project gathers dust."
      },
      {
        label: 'Decline — protect your time',
        effects: { savings: 0, energy: 5, momentum: 5, appsShipped: 0 },
        result: "Your manager is 'disappointed.' But you kept your evenings free."
      },
      {
        label: 'Counter-offer: lead it but async-only',
        effects: { savings: 1000, energy: -5, momentum: 0, appsShipped: 0 },
        result: "You negotiate fewer meetings. Your manager agrees reluctantly. A PM who hates meetings — the irony."
      }
    ]
  },
  {
    id: 'github_discovered',
    type: 'work',
    title: 'GitHub Discovered',
    text: "Your eng lead found your GitHub profile. They see the 11pm commit times and the repos. They ping you: 'Can we talk?'",
    choices: [
      {
        label: 'Be honest about your side projects',
        effects: { savings: 0, energy: 0, momentum: 10, appsShipped: 0 },
        result: "They're actually impressed. 'Most PMs can't even open a terminal.' You've earned some eng cred."
      },
      {
        label: 'Play it off — just learning',
        effects: { savings: 0, energy: 5, momentum: 0, appsShipped: 0 },
        result: "'Just tutorials,' you say. They don't fully buy it. But the conversation ends. Low stress."
      },
      {
        label: 'Ask them for code review',
        effects: { savings: 0, energy: -5, momentum: 15, appsShipped: 0 },
        result: "Bold. They spend 30 minutes tearing your code apart. Brutal, but you learn more in that half hour than in a month of vibe coding."
      }
    ]
  },
  {
    id: 'company_hackathon',
    type: 'work',
    title: 'Company Hackathon',
    text: "BigTechCo's annual hackathon is this week. 48 hours, free food, prizes for the best project.",
    choices: [
      {
        label: 'Enter with your side project',
        effects: { savings: 0, energy: -10, momentum: 15, appsShipped: 0 },
        result: "You demo your side project to 200 people. It doesn't win, but three engineers ask to try it. Validation."
      },
      {
        label: 'Skip it, build your own thing',
        effects: { savings: 0, energy: 0, momentum: 10, appsShipped: 0 },
        result: "While everyone's at the hackathon, you have the quietest, most productive day of the quarter."
      },
      {
        label: 'Join a team, network',
        effects: { savings: 0, energy: -5, momentum: 5, appsShipped: 0 },
        result: "You meet a designer who says 'let me know if you ever need UI help.' Contact saved."
      }
    ]
  },

  // =========== BUILDING EVENTS ===========

  {
    id: 'hackathon',
    type: 'building',
    title: 'Weekend Hackathon',
    text: "Saturday morning. Kids at swim lessons. Your spouse says 'go build something.' You have 6 uninterrupted hours.",
    choices: [
      {
        label: 'Go all in — ship something',
        effects: { savings: -500, energy: -10, momentum: 20, appsShipped: 1 },
        result: "You built it. You shipped it. It's rough but it's real. Domain: $12. Hosting: $0 (Vercel free tier). Feeling: priceless."
      },
      {
        label: 'Take it easy, just learn',
        effects: { savings: 0, energy: 10, momentum: 5, appsShipped: 0 },
        result: "You follow a tutorial, learn something new. No pressure. Sometimes that's enough."
      }
    ]
  },
  {
    id: 'late_night',
    type: 'building',
    title: 'Late Night Breakthrough',
    text: "11pm. Kids asleep. You just had an idea and your fingers are already on the keyboard.",
    choices: [
      {
        label: 'Build through the night',
        effects: { savings: -200, energy: -10, momentum: 15, appsShipped: 1 },
        result: "2:47am. It works. You deploy. Your spouse asks if you're okay. You've never been better."
      },
      {
        label: 'Write it down, go to bed',
        effects: { savings: 0, energy: 10, momentum: 3, appsShipped: 0 },
        result: "You write the idea in your notes app. Responsible. Boring. But well-rested tomorrow."
      }
    ]
  },
  {
    id: 'flow_state',
    type: 'building',
    title: 'Flow State',
    text: "You sit down to code and everything just clicks. The AI completes your thoughts. The tests pass. Time disappears.",
    choices: [
      {
        label: 'Ride the wave all night',
        effects: { savings: 0, energy: 5, momentum: 20, appsShipped: 0 },
        result: "Four hours vanish. You built more tonight than in the last two weeks combined. Flow state is a hell of a drug."
      },
      {
        label: 'Stop while you\'re ahead',
        effects: { savings: 0, energy: 10, momentum: 10, appsShipped: 0 },
        result: "You quit on a high note. You know exactly where to pick up tomorrow. Smart."
      }
    ]
  },
  {
    id: 'first_revenue',
    type: 'building',
    title: 'First Dollar',
    text: "You check Stripe during a meeting. Someone you've never met just paid $5 for your app. Your hands are shaking.",
    choices: [
      {
        label: 'Double down — add more features',
        effects: { savings: 200, energy: 5, momentum: 20, appsShipped: 0 },
        result: "One paying customer means there could be more. You start building the features they asked for. The dream is real."
      },
      {
        label: 'Tell everyone you know',
        effects: { savings: 200, energy: 10, momentum: 15, appsShipped: 0 },
        result: "You text your spouse. You tell your friend. You screenshot the Stripe dashboard. $5 has never felt so good."
      }
    ]
  },
  {
    id: 'auth_broken',
    type: 'building',
    title: 'Auth Is Broken',
    text: "Your login flow is completely broken. Users can't sign in. The AI-generated auth code looked right but doesn't work.",
    choices: [
      {
        label: 'Debug it yourself — learn auth properly',
        effects: { savings: 0, energy: -10, momentum: 5, appsShipped: 0 },
        result: "Four hours later, you understand OAuth. Actually understand it. The fix is two lines."
      },
      {
        label: 'Rip it out, use a hosted auth service',
        effects: { savings: -100, energy: 0, momentum: 10, appsShipped: 0 },
        result: "Clerk set up in 20 minutes. You feel like you cheated, but it works. Ship > learn."
      },
      {
        label: 'Scrap auth entirely — make it public',
        effects: { savings: 0, energy: 5, momentum: 5, appsShipped: 0 },
        result: "No login required. Simpler product, honestly. Not every app needs auth."
      }
    ]
  },
  {
    id: 'ai_hallucination',
    type: 'building',
    title: 'AI Hallucination',
    text: "Claude hallucinated an entire database schema that doesn't work. The tables reference each other in circles. Your migration is broken.",
    choices: [
      {
        label: 'Fix it manually — learn SQL',
        effects: { savings: 0, energy: -10, momentum: 5, appsShipped: 0 },
        result: "You rewrite the schema by hand. Painful, but now you actually understand your own data model."
      },
      {
        label: 'Prompt engineer your way out',
        effects: { savings: 0, energy: -5, momentum: 0, appsShipped: 0 },
        result: "Three prompts later, the AI generates something that works. You're not sure why. Don't touch it."
      },
      {
        label: 'Switch to a simpler database',
        effects: { savings: 0, energy: 0, momentum: 5, appsShipped: 0 },
        result: "You replace Postgres with a JSON file. It's not webscale. But it works, and you ship tonight."
      }
    ]
  },
  {
    id: 'css_nightmare',
    type: 'building',
    title: 'CSS Nightmare',
    text: "You've been fighting a CSS layout issue for 3 hours. The div won't center. Flexbox isn't flexing. You are losing your mind.",
    choices: [
      {
        label: 'Keep grinding — fix it properly',
        effects: { savings: 0, energy: -10, momentum: -5, appsShipped: 0 },
        result: "You finally fix it. It was a missing `display: flex` on the parent. Three hours for one line. Tale as old as time."
      },
      {
        label: 'Ship it ugly',
        effects: { savings: 0, energy: 0, momentum: 10, appsShipped: 0 },
        result: "It looks slightly off on mobile. Nobody will notice. Probably. You move on to features that matter."
      },
      {
        label: 'Use a UI component library',
        effects: { savings: 0, energy: 0, momentum: 5, appsShipped: 0 },
        result: "shadcn/ui to the rescue. Your app now looks better than anything you could have designed. Modern problems, modern solutions."
      }
    ]
  },
  {
    id: 'hacker_news',
    type: 'building',
    title: 'Hacker News Moment',
    text: "Someone posted your app on Hacker News. It's on the front page. Traffic is spiking. But the top comment says 'I found a SQL injection in 5 minutes.'",
    choices: [
      {
        label: 'Fix the vulnerability NOW',
        effects: { savings: 0, energy: -10, momentum: 15, appsShipped: 0 },
        result: "You patch it in an hour. The HN thread updates: 'Dev fixed it fast. Respect.' Traffic stays."
      },
      {
        label: 'Take the site down until you fix it',
        effects: { savings: 0, energy: -5, momentum: -5, appsShipped: 0 },
        result: "Safe but embarrassing. The thread says 'lol it's down.' You fix it overnight and bring it back."
      }
    ]
  },
  {
    id: 'new_model_drop',
    type: 'building',
    title: 'New Model Drop',
    text: "Anthropic just dropped a new model. Your Twitter feed is on fire. Everyone's saying it changes everything.",
    choices: [
      {
        label: 'Rebuild your workflow with the new model',
        effects: { savings: -50, energy: 0, momentum: 15, appsShipped: 0 },
        result: "The new model is genuinely better. Your code generation is 2x faster. You rebuild a feature in one evening that took a week before."
      },
      {
        label: 'Stay focused, don\'t chase shiny objects',
        effects: { savings: 0, energy: 5, momentum: 5, appsShipped: 0 },
        result: "You resist the urge. Your current setup works. Ship first, optimize later."
      }
    ]
  },
  {
    id: 'stripe_integration',
    type: 'building',
    title: 'Payment Time',
    text: "Your app needs payments. You stare at the Stripe docs. It's a lot. But if you add payments, this thing could actually make money.",
    choices: [
      {
        label: 'Learn Stripe, add payments',
        effects: { savings: -100, energy: -10, momentum: 15, appsShipped: 0 },
        result: "A week of docs and test mode. But now your app charges $5/month. Your first subscriber pays while you're in a meeting at work."
      },
      {
        label: 'Keep it free for now',
        effects: { savings: 0, energy: 5, momentum: -5, appsShipped: 0 },
        result: "You'll add payments later. Later never comes for most people. But maybe you're different."
      },
      {
        label: 'Add a tip jar / buy me a coffee',
        effects: { savings: 0, energy: 0, momentum: 5, appsShipped: 0 },
        result: "Low effort, low reward. Someone tips you $3. It's not revenue but it's validation."
      }
    ]
  },
  {
    id: 'scope_creep',
    type: 'building',
    title: 'Feature Creep',
    text: "Your app does one thing well. But you keep thinking of features to add. Dark mode. Analytics dashboard. AI integration. A mobile app.",
    choices: [
      {
        label: 'Add one more feature, then ship',
        effects: { savings: 0, energy: -5, momentum: -5, appsShipped: 0 },
        result: "'One more feature' turned into three. You're further from shipping than last week. Classic."
      },
      {
        label: 'Ship it now, as is',
        effects: { savings: -100, energy: -5, momentum: 20, appsShipped: 1 },
        result: "You hit deploy. It's not perfect. It does one thing. But it's live and people can use it."
      },
      {
        label: 'Cut scope, simplify, then ship',
        effects: { savings: -100, energy: 0, momentum: 20, appsShipped: 1 },
        result: "You delete half the code. The app is simpler and better for it. You ship with confidence."
      }
    ]
  },
  {
    id: 'deploy_disaster',
    type: 'building',
    title: 'Deploy Disaster',
    text: "You deployed to production. Forgot environment variables. Your app is hitting your dev database. In production. With real users.",
    choices: [
      {
        label: 'Panic fix — hotfix now',
        effects: { savings: 0, energy: -10, momentum: 0, appsShipped: 0 },
        result: "Fixed in 20 minutes. Nobody noticed. You add a deployment checklist. Lesson learned."
      },
      {
        label: 'Roll back, fix properly',
        effects: { savings: 0, energy: -5, momentum: 5, appsShipped: 0 },
        result: "You roll back, set up proper env management, and redeploy. Slower but safer. You now understand why DevOps is a job."
      }
    ]
  },
  {
    id: 'coffee_shop',
    type: 'building',
    title: 'Coffee Shop Coding',
    text: "You take your laptop to a coffee shop on Saturday. No kids, no Slack, just you and the code. The barista's playlist is perfect.",
    choices: [
      {
        label: 'Build something new',
        effects: { savings: -15, energy: 5, momentum: 15, appsShipped: 0 },
        result: "Three hours, two lattes, one beautiful feature. Change of scenery works wonders."
      },
      {
        label: 'Fix bugs and clean up code',
        effects: { savings: -15, energy: 10, momentum: 5, appsShipped: 0 },
        result: "Not glamorous, but everything runs smoother now. Technical debt: reduced. Coffee: excellent."
      }
    ]
  },

  // =========== LIFE EVENTS ===========

  {
    id: 'board_games',
    type: 'life',
    title: 'Family Game Night',
    text: "Your daughter wants to play board games tonight. You were planning to code after dinner.",
    choices: [
      {
        label: 'Play with the kids',
        effects: { savings: 0, energy: 15, momentum: -5, appsShipped: 0 },
        result: "You play Candy Land three times. Your energy is fully restored. The code can wait."
      },
      {
        label: "Say 'maybe tomorrow'",
        effects: { savings: 0, energy: -5, momentum: 5, appsShipped: 0 },
        result: "You code for two hours but can't shake the guilt. Mixed results."
      }
    ]
  },
  {
    id: 'family_vacation',
    type: 'life',
    title: 'Family Vacation',
    text: "A week at the beach. No laptop allowed (your spouse made you promise). But you could sneak your phone...",
    choices: [
      {
        label: 'Truly unplug',
        effects: { savings: -3000, energy: 30, momentum: -10, appsShipped: 0 },
        result: "No screens for 7 days. You come back rested with three new app ideas scribbled on napkins."
      },
      {
        label: 'Sneak in some coding on your phone',
        effects: { savings: -3000, energy: 15, momentum: 5, appsShipped: 0 },
        result: "You fixed two bugs from a beach chair. Your spouse caught you once. 'I was just checking email.'"
      }
    ]
  },
  {
    id: 'kid_sick',
    type: 'life',
    title: 'Sick Day',
    text: "Kid is sick. Pediatrician at 8am, home all day with a cranky toddler. Work is chaos. But nap time exists...",
    choices: [
      {
        label: 'Full parent mode — no screens',
        effects: { savings: 0, energy: -10, momentum: -5, appsShipped: 0 },
        result: "Exhausting day. You're present. That matters."
      },
      {
        label: 'Code during nap time',
        effects: { savings: 0, energy: -15, momentum: 10, appsShipped: 0 },
        result: "90 minutes of nap time coding. Most productive you've been all week. Also the most tired."
      }
    ]
  },
  {
    id: 'laptop_drawing',
    type: 'life',
    title: 'The Drawing',
    text: "Your 4-year-old drew a picture of the family. You're holding a laptop. Everyone else is holding hands.",
    choices: [
      {
        label: 'Close the laptop for the week',
        effects: { savings: 0, energy: 20, momentum: -10, appsShipped: 0 },
        result: "You spend the week fully present. No code. Your kid draws a new picture — this time you're holding their hand."
      },
      {
        label: 'Feel the guilt, keep building',
        effects: { savings: 0, energy: -5, momentum: 5, appsShipped: 0 },
        result: "You put the drawing on the fridge. You think about it while coding at midnight. It's complicated."
      },
      {
        label: 'Build something together',
        effects: { savings: 0, energy: 5, momentum: 10, appsShipped: 0 },
        result: "You let your kid 'help' you code. They press the spacebar 400 times. It's the best pairing session you've ever had."
      }
    ]
  },
  {
    id: 'dinner_analytics',
    type: 'life',
    title: 'Analytics at Dinner',
    text: "You're checking your app's analytics at dinner. Again. Your spouse gives you The Look.",
    choices: [
      {
        label: 'Put the phone away',
        effects: { savings: 0, energy: 10, momentum: -5, appsShipped: 0 },
        result: "You put it face down. You have an actual conversation. Remember those?"
      },
      {
        label: "'Just one more check'",
        effects: { savings: 0, energy: 0, momentum: 5, appsShipped: 0 },
        result: "You check. 3 new users. Worth the cold shoulder? Debatable."
      }
    ]
  },
  {
    id: 'swim_lessons',
    type: 'life',
    title: 'Saturday Morning Window',
    text: "Kids at swim lessons. 90 uninterrupted minutes. The most productive window of your entire week.",
    choices: [
      {
        label: 'Code like your life depends on it',
        effects: { savings: 0, energy: 0, momentum: 15, appsShipped: 0 },
        result: "90 minutes of pure flow state. You ship a feature that's been stuck for two weeks. This is why you do it."
      },
      {
        label: 'Rest — read, coffee, exist',
        effects: { savings: 0, energy: 20, momentum: -5, appsShipped: 0 },
        result: "You sit in silence with a coffee. No Slack. No PRDs. No code. You forgot what this felt like."
      }
    ]
  },
  {
    id: 'old_friend',
    type: 'life',
    title: 'Friend From College',
    text: "An old friend calls. They're a developer now. They want to catch up over dinner this week.",
    choices: [
      {
        label: 'Go to dinner',
        effects: { savings: -100, energy: 10, momentum: 5, appsShipped: 0 },
        result: "Great conversation. They give you a tip about deploying on Railway. You leave energized and with a new debugging buddy."
      },
      {
        label: 'Raincheck — too busy building',
        effects: { savings: 0, energy: 0, momentum: 5, appsShipped: 0 },
        result: "You code instead. Productive night, but you realize you've been canceling a lot of plans lately."
      }
    ]
  },
  {
    id: 'partner_question',
    type: 'life',
    title: 'The Question',
    text: "Your spouse asks: 'Is this coding thing... going somewhere? Or is it just a hobby?'",
    choices: [
      {
        label: "'I think I can make this real'",
        effects: { savings: 0, energy: 0, momentum: 15, appsShipped: 0 },
        result: "You say it out loud for the first time. It feels terrifying and true. Your spouse nods. 'Okay. Show me.'"
      },
      {
        label: "'Just a hobby, don\\'t worry'",
        effects: { savings: 0, energy: 10, momentum: -10, appsShipped: 0 },
        result: "The pressure is off. But so is the fire. If it's just a hobby, why are you up at midnight?"
      },
      {
        label: "'I don\\'t know yet'",
        effects: { savings: 0, energy: 5, momentum: 5, appsShipped: 0 },
        result: "Honest. Your spouse appreciates the honesty. 'Figure it out. I'm here.' That's enough for now."
      }
    ]
  },
  {
    id: 'exercise',
    type: 'life',
    title: 'Gym or Code',
    text: "You haven't exercised in two weeks. Your back hurts from the desk setup. But you're so close to finishing a feature.",
    choices: [
      {
        label: 'Go to the gym',
        effects: { savings: 0, energy: 20, momentum: -5, appsShipped: 0 },
        result: "Runner's high is real. You come back with more energy than caffeine ever gave you."
      },
      {
        label: 'Skip it, finish the feature',
        effects: { savings: 0, energy: -5, momentum: 10, appsShipped: 0 },
        result: "Feature done. Back still hurts. You'll definitely go tomorrow. (You won't.)"
      }
    ]
  },
  {
    id: 'good_sleep',
    type: 'life',
    title: 'Full Night\'s Sleep',
    text: "Both kids slept through the night. You woke up naturally at 7am. No alarms. You feel... good? Is this what rested feels like?",
    choices: [
      {
        label: 'Use the energy to build',
        effects: { savings: 0, energy: 10, momentum: 15, appsShipped: 0 },
        result: "You're sharper than you've been in weeks. Code flows. Bugs get squashed. This is what energy does."
      },
      {
        label: 'Bank the energy, take it easy',
        effects: { savings: 0, energy: 20, momentum: 0, appsShipped: 0 },
        result: "You go for a walk, eat a real breakfast, and exist like a normal person. Revolutionary."
      }
    ]
  }
];
