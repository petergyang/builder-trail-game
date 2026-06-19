// ========================================
// THE BUILDER TRAIL — Headliner Cards (native 4-attribute format)
// Source of truth: cards.md. Effects are direct attribute-point deltas
// (+1/-1 = small, +2/-2 = strong). Every choice is a real two-way tradeoff.
// ========================================

const CARD_WEIGHT = 7; // headliners show more often than legacy events (default 3)

const CARDS = [
  // ===== I. The Day Job =====
  {
    id: 'card-standup', type: 'work', weight: CARD_WEIGHT, scene: 'card-standup',
    title: 'The Standup Tax',
    text: "You're collaborating with another team on a shared project. They've set up a weekly sync and a daily standup at 9:30 — right in the middle of your only real focus block.",
    choices: [
      { label: 'Show up to every sync, be a team player', effects: { money: 1, relationships: 1, agency: -1 },
        result: "You're aligned, visible, and well-liked across the org. You're also out of focus hours by 10 a.m., and the thing you wanted to build stays a comment in a doc." },
      { label: 'Push back, ask for async updates', effects: { agency: 1, relationships: -1, money: -1 },
        result: "You reclaim your mornings and ship something real. The partner team reads it as \"not a team player,\" and that quietly follows you into the next planning cycle." }
    ]
  },
  {
    id: 'card-calibration', type: 'work', weight: CARD_WEIGHT, scene: 'card-calibration',
    title: 'Calibration Season',
    text: "Perf review is here. Your best work this half was quiet and AI-augmented — hard to put on a slide. The promo, your manager keeps hinting, is about the slide.",
    choices: [
      { label: 'Build the narrative, play the game', effects: { money: 2, agency: -1, health: -1 },
        result: "You manufacture a story of impact convincing enough to fund the next year of your life. You also become slightly more slide than human." },
      { label: 'Let the work speak, accept \"meets\"', effects: { money: -1, agency: 1 },
        result: "You skip the theater and keep your evenings and your self-respect. The raise that doesn't come is a number; the thing you protected isn't." }
    ]
  },
  {
    id: 'card-review-bottleneck', type: 'work', weight: CARD_WEIGHT, scene: 'card-review-bottleneck',
    title: 'The Review Bottleneck',
    text: "Half the team is blocked on your code reviews. Clearing the queue makes you indispensable — which, you're slowly learning, is just a nicer word for \"never gets to leave.\"",
    choices: [
      { label: 'Clear the queue, be the reliable one', effects: { money: 1, relationships: 1, health: -1, agency: -1 },
        result: "You unblock everyone and earn the quiet power of the person who can't be replaced. Your own work, and your shoulders, pay for it." },
      { label: 'Batch reviews, set a boundary', effects: { agency: 1, health: 1, relationships: -1 },
        result: "You carve back focus and finally move your own thing forward. Two teammates wait longer and feel it; one of them mentions it." }
    ]
  },
  {
    id: 'card-team-dinner', type: 'work', weight: CARD_WEIGHT, scene: 'card-team-dinner',
    title: 'The Team Dinner',
    text: "The team's heading out tonight — a nice place, free drinks, the good kind, everyone's going. You'd blocked tonight to build. \"Come on, it's one night,\" someone says, and they're not wrong.",
    choices: [
      { label: 'Go — show your face, have the drinks', effects: { relationships: 1, agency: -1, health: -1 },
        result: "You laugh, you bond, you learn three things about the org you'd never hear in a meeting. You also lose the night and wake up foggy, owing tomorrow an apology." },
      { label: 'Skip it, build tonight', effects: { relationships: -1, agency: 1 },
        result: "You make real progress in the quiet. By morning the group chat has an inside joke you're not part of, and someone's noticed you're \"always heads-down.\"" }
    ]
  },

  // ===== II. Family & Friends =====
  {
    id: 'card-summer-afternoon', type: 'life', weight: CARD_WEIGHT, scene: 'card-summer-afternoon',
    title: 'Summer Afternoon',
    text: "It's summer. Your kid gets dropped off from camp at 1 p.m., still in the camp T-shirt, and makes a beeline for you — she wants to play, right now. The afternoon was supposed to be yours.",
    choices: [
      { label: 'Drop everything and play', effects: { relationships: 2, health: 1, agency: -1 },
        result: "You build a blanket fort instead of a feature. The afternoon vanishes in the best way, and the work is exactly where you left it — which is the point." },
      { label: '"Five more hours, then I\'m all yours"', effects: { agency: 1, relationships: -1, health: -1 },
        result: "You get the build done; she gets a screen and a \"soon.\" By 5 p.m. she's found something else to be excited about, and it isn't you." }
    ]
  },
  {
    id: 'card-sev2', type: 'life', weight: CARD_WEIGHT, scene: 'card-sev2',
    title: '4:55 P.M., Sev 2',
    text: "Daycare closes at six. At 4:55 a Sev 2 lights up and your name is on the rotation. Your partner is already texting: \"are you getting them?\"",
    choices: [
      { label: 'Jump on the incident', effects: { money: 1, relationships: -2, health: -1 },
        result: "A hero in the channel, a no-show at pickup. Again. Your partner does the math, and you can hear them doing the math." },
      { label: 'Hard stop — hand it off', effects: { relationships: 2, money: -1 },
        result: "You log off mid-fire and make it to the little face lighting up at the door. Someone in the channel types \"where'd they go?\"" }
    ]
  },
  {
    id: 'card-30th', type: 'life', weight: CARD_WEIGHT, scene: 'card-30th',
    title: 'The 30th Birthday',
    text: "Your oldest friend's 30th is the same weekend as your launch window. You've moved the launch twice. You have never once moved a friendship and felt it move.",
    choices: [
      { label: 'Show up for your friend', effects: { relationships: 2, health: 1, agency: -1 },
        result: "You toast a decade of friendship and feel like a person. The launch slips a week — into the ocean of slipped launches, where it feels right at home." },
      { label: 'Skip it, hit the window', effects: { agency: 1, relationships: -2, health: -1 },
        result: "You ship on time to forty users and a friend's polite \"no worries.\" Both numbers will haunt you, differently." }
    ]
  },
  {
    id: 'card-apartment', type: 'life', weight: CARD_WEIGHT, scene: 'card-apartment',
    title: 'The Nicer Apartment',
    text: "Your partner found the place — more light, a room for the kid, a commute that doesn't crush souls. It also raises your burn enough to quietly end any \"someday I'll go indie\" math.",
    choices: [
      { label: 'Sign the lease, upgrade the life', effects: { relationships: 2, money: -2, agency: -1 },
        result: "Everyone's happier in the mornings. The runway that would've bought your freedom now buys square footage. A good trade, and a real one." },
      { label: 'Stay put, protect the runway', effects: { money: 1, agency: 1, relationships: -1 },
        result: "You keep the cushion that could one day buy your time back. The current place keeps its small frustrations and its wonderfully low rent." }
    ]
  },
  {
    id: 'card-screen-time', type: 'life', weight: CARD_WEIGHT, scene: 'card-screen-time',
    title: 'The Screen-Time Conversation',
    text: "Your partner finally says it out loud: \"Why are you always glued to the screen, talking to your little robots, when you could be here, with us?\" It isn't a fight yet. It's the sentence right before one.",
    choices: [
      { label: 'Defend it — explain why it matters', effects: { agency: 1, relationships: -2, health: -1 },
        result: "You make the case for optionality and the future and how this is for the family, actually. You win the argument and lose the evening. Nobody feels good about the scoreboard." },
      { label: 'Close the laptop and really listen', effects: { relationships: 2, health: 1, agency: -1 },
        result: "You put it down and hear what's under the question, which is \"I miss you.\" The build loses a night; the marriage gets one back." }
    ]
  },

  // ===== III. Body & Burnout =====
  {
    id: 'card-gym', type: 'life', weight: CARD_WEIGHT, scene: 'card-gym',
    title: 'The Gym You Pay For',
    text: "A hundred and fifty a month, untouched for six weeks. Your lower back has started sending strongly-worded letters. The membership is now mostly a subscription to guilt.",
    choices: [
      { label: 'Cancel it, reclaim the money', effects: { money: 1, health: -2 },
        result: "You delete the guilt and the gains in one click. It feels responsible right up until your back submits its formal complaint." },
      { label: 'Actually go three times this week', effects: { health: 2, money: -1, agency: -1 },
        result: "Two workouts and a sauna later, you can think straight again. You lose six build-hours and feel, annoyingly, much better." }
    ]
  },
  {
    id: 'card-5am', type: 'building', weight: CARD_WEIGHT, scene: 'card-5am',
    title: 'The 5 A.M. Cult',
    text: "The internet insists real builders wake at 5 to ship before work. You try it. The build hour is glorious. The 3 p.m. crash, and the person you are at the kid's bedtime, are less glorious.",
    choices: [
      { label: 'Force the 5 a.m. habit', effects: { agency: 2, health: -1, relationships: -1 },
        result: "Brutal for two weeks, then the habit holds and the project actually moves. Your body and your evenings quietly pick up the tab." },
      { label: 'Wait for the \"right time\" to build', effects: { health: 1, agency: -1 },
        result: "You protect your sleep and your sanity. The right time to build, it turns out, keeps the same calendar as a unicorn. The repo stays at three commits." }
    ]
  },
  {
    id: 'card-agents-in-bed', type: 'building', weight: CARD_WEIGHT, scene: 'card-agents-in-bed',
    title: 'Agents in Bed',
    text: "Your agents don't sleep, so lately neither do you. You've taken to running them from bed — one more prompt, one more diff — and the project has never moved faster. Your 6 a.m. self is filing for damages.",
    choices: [
      { label: 'Keep the phone in bed, keep shipping', effects: { agency: 1, health: -2, relationships: -1 },
        result: "The build screams ahead while your sleep quietly collapses. You're productive and frayed, and your partner is tired of the blue glow on the ceiling at 1 a.m." },
      { label: 'Leave the phone in the kitchen', effects: { health: 2, agency: -1 },
        result: "You charge it in another room like it's the year 2000. The project slows; you wake up like a person, with ideas instead of a hangover of notifications." }
    ]
  },

  // ===== IV. Craft & Agency =====
  {
    id: 'card-wrong-thing', type: 'building', weight: CARD_WEIGHT, scene: 'card-wrong-thing',
    title: 'Built the Wrong Thing',
    text: "Your agent cheerfully built an entire feature this week. Opening it, you realize you never asked one human being whether they wanted it.",
    choices: [
      { label: 'Ship it anyway and move on', effects: { health: 1, relationships: 1, agency: -1 },
        result: "You push it live, tell yourself \"shipped is shipped,\" and reclaim your evenings. A few people try it and bounce. You file the lesson under \"later.\"" },
      { label: 'Scrap it, talk to five users first', effects: { money: -1, health: -1, agency: 2 },
        result: "It stings to delete a week and admit you guessed. Then a real user says one sentence worth more than the whole feature. That's the muscle that matters." }
    ]
  },
  {
    id: 'card-mentor', type: 'building', weight: CARD_WEIGHT, scene: 'card-mentor',
    title: 'Mentor the New Hire',
    text: "A nervous new hire asks you to teach them the AI workflow you've figured out. It's flattering. It's also the exact two hours you'd carved out to build.",
    choices: [
      { label: 'Say yes, teach them', effects: { relationships: 2, agency: 1, health: -1 },
        result: "Explaining it forces you to actually understand it — you both get sharper. Your own project waits, and your evening gets shorter." },
      { label: 'Protect your build time', effects: { agency: 1, health: 1, relationships: -1 },
        result: "You guard the hours, make real progress, and get to bed on time. The new hire figures it out alone, slower, and remembers that you were busy." }
    ]
  },
  {
    id: 'card-trending-repo', type: 'building', weight: CARD_WEIGHT, scene: 'card-trending-repo',
    title: 'The Trending Repo',
    text: "An open-source project you tossed on GitHub is suddenly trending — hundreds of stars overnight and an inbox full of feature requests and \"can you add…\" from total strangers. It's thrilling. It's also unpaid, and growing by the hour.",
    choices: [
      { label: 'Double down, serve the surge', effects: { money: 1, health: -2, agency: -1 },
        result: "The visibility opens doors — a few real opportunities find you. You also become an unpaid support desk for a thing you used to enjoy, answering issues at midnight from people who'll never say thanks." },
      { label: 'Hold your pace, build your roadmap', effects: { agency: 1, relationships: -1 },
        result: "You say no a lot, ship what you believe in, and let the noise be noise. The project stays yours and keeps improving. A few entitled commenters call it a \"dead repo.\"" }
    ]
  },

  // ===== V. Big Bets & Money =====
  {
    id: 'card-vesting', type: 'work', weight: CARD_WEIGHT, scene: 'card-vesting',
    title: 'Vesting Day',
    text: "A big chunk of stock just vested. For the first time, you have real runway — enough to take a swing instead of just collecting the next paycheck. The number is also exactly why people never take the swing.",
    choices: [
      { label: 'Let it ride for the next cliff', effects: { money: 2, health: 1, relationships: 1, agency: -2 },
        result: "You re-up the lease on the golden handcuffs and start counting down to the next vest. Calmer evenings, softer ambition; the builder in you files a complaint with no one." },
      { label: 'Treat it as runway, build toward the exit', effects: { agency: 2, money: -1, health: -1, relationships: -1 },
        result: "You stop seeing the balance as a reward and start seeing it as months of freedom. You keep the badge — but now you build like someone with a quit date in mind." }
    ]
  },
  {
    id: 'card-conference', type: 'building', weight: CARD_WEIGHT, scene: 'card-conference',
    title: 'The Free Conference Invite',
    text: "A free invite lands: a big AI builders' conference, exactly the people you want to learn from, all in one room. The catch is the obvious one — three days there is three days not building.",
    choices: [
      { label: 'Go meet the builders', effects: { relationships: 1, money: -1, agency: -1 },
        result: "You shake a lot of hands, swap a lot of hot takes, and come home inspired and three days behind. Inspiration, you'll find, is not a commit." },
      { label: 'Stay home and build', effects: { money: 1, agency: 1, relationships: -1 },
        result: "You skip the badge and put the three days into the thing itself. You miss the room and the serendipity; you gain a thing that actually runs." }
    ]
  },
  {
    id: 'card-recruiter', type: 'work', weight: CARD_WEIGHT, scene: 'card-recruiter',
    title: 'The Recruiter DM',
    text: "An AI startup slides into your DMs: more equity, more ownership, more chaos. The kind of role that would make you or break you. Your current job is neither, which is the problem and the comfort.",
    choices: [
      { label: 'Take the leap', effects: { agency: 2, money: -1, health: -1, relationships: -1 },
        result: "You trade a stable salary for a lottery ticket with a learning curve. Everything gets harder and, for the first time in a while, interesting." },
      { label: 'Stay, and use it to negotiate', effects: { money: 2, health: 1, agency: -1 },
        result: "You parlay the offer into a raise and a calmer year. The road not taken moves into the back of your mind, rent-free." }
    ]
  },
  {
    id: 'card-side-project-real', type: 'building', weight: CARD_WEIGHT, scene: 'card-side-project-real',
    title: 'The Side Project Gets Real',
    text: "Your little tool has eleven paying users. Eleven. It's a rounding error and it's also the most real money your ideas have ever made. Scaling it means treating it like a second job you already don't have time for.",
    choices: [
      { label: 'Go hard — make it a business', effects: { money: 2, agency: 2, health: -2, relationships: -2 },
        result: "You add a third job to your two jobs. The revenue chart goes up and to the right; so does your resting heart rate, and the silence at home." },
      { label: 'Keep it a calm little side thing', effects: { money: 1, health: 1, relationships: 1, agency: -1 },
        result: "You keep the joy and pass on the swing. It pays for nice dinners and stays a hobby. Some Tuesday you'll wonder what it could have been." }
    ]
  },
  {
    id: 'card-management', type: 'work', weight: CARD_WEIGHT, scene: 'card-management',
    title: 'The Management Track',
    text: "Your manager floats an opening: step up and run a small team. A modest pay bump, a title that clears a real hurdle — and, you already know, a calendar of one-on-ones and meetings where your hands never touch a keyboard.",
    choices: [
      { label: 'Take the management role', effects: { money: 1, agency: -2, health: -1 },
        result: "You get the title and a calendar of one-on-ones. You're good at it, even — but the last time you wrote real code becomes a date you can remember exactly." },
      { label: 'Decline politely, stay an IC', effects: { money: -1, agency: 1 },
        result: "You keep your hands on the keyboard and your name out of the org chart's middle layer. You watch a peer take it and wonder, briefly, if you're \"not ambitious.\"" }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) module.exports = { CARDS };
