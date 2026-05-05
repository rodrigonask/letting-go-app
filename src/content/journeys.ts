// All workbook content lives here so the journey pages stay clean.

export type Block =
  | { type: 'lede'; text: string }
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'pull'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'story'; label: string; paragraphs: string[] }
  | { type: 'note'; author: 'Nichole' | 'Kate'; paragraphs: string[] }
  | { type: 'softbox'; head: string; items?: string[]; text?: string }
  | { type: 'flourish' }
  | { type: 'prompt'; id: string; label: string; placeholder?: string }
  | { type: 'reframe' }
  | { type: 'trapcards' }
  | { type: 'realitychecks' }
  | { type: 'ladder' }
  | { type: 'steps'; items: { title: string; body: string }[] }

export interface Journey {
  id: string
  number: string
  numberRoman: string
  title: string
  titleAccent: string
  subtitle: string
  quote: string
  blocks: Block[]
}

export const journeys: Journey[] = [
  {
    id: 'welcome',
    number: '0',
    numberRoman: '—',
    title: 'Welcome,',
    titleAccent: 'Friend',
    subtitle: 'An invitation to begin gently',
    quote: 'You do not have to carry it all.',
    blocks: [
      { type: 'lede', text: "If you're here, you're probably carrying more than 'too much stuff.'" },
      { type: 'p', text: "You might be carrying guilt, grief, memories, or expectations — all tucked quietly inside drawers, closets, and bins. Maybe it's gotten to the point where you don't even know where to start. That heavy feeling isn't just about overflowing shelves and cupboards; often, the real mess is deeper, tucked away in your heart and mind." },
      { type: 'p', text: "It's completely normal to feel so overwhelmed that starting feels impossible. This workbook is here to tackle that double burden — gently guiding you to release the physical clutter that's holding the emotional weight." },
      { type: 'note', author: 'Nichole', paragraphs: ["I'm Nichole Gehman, professional organizer and founder of Organize By Designe. I've seen firsthand how clutter can weigh on a person's heart — not just their home. My goal is to equip you with tangible, gentle steps to begin releasing what no longer serves you."] },
      { type: 'note', author: 'Kate', paragraphs: ["I'm Kate Fish, LMFT, PMH-C, a licensed marriage and family therapist. In this workbook, I offer insight into the psychological side of decluttering — how letting go is often tied to deeper emotions, and how healing begins with compassion, clarity, and connection."] },
      { type: 'pull', text: 'You do not have to carry it all. The weight you feel is not a permanent fixture of your life.' },
      { type: 'h3', text: 'Before you begin' },
      { type: 'p', text: 'Bring a pen, an open heart, and permission to be imperfect. There is no right pace. Some days you may linger; other days you may move quickly. Take your time. Breathe often.' },
      { type: 'prompt', id: 'why', label: 'My deeper "why" — what I hope this work brings me…', placeholder: 'A calmer home. Less guilt. More space for…' },
      { type: 'prompt', id: 'rooms', label: 'The rooms or areas that feel heaviest are…', placeholder: 'The basement. The hall closet. The kitchen counter…' },
      { type: 'flourish' },
    ],
  },
  {
    id: 'journey-1',
    number: '1',
    numberRoman: 'I',
    title: 'Understanding',
    titleAccent: 'Emotional Attachment',
    subtitle: 'Why some things are harder to let go of',
    quote: "We're not really organizing stuff. We're organizing stories.",
    blocks: [
      { type: 'lede', text: "Let's talk about why some things are harder to let go of than others." },
      { type: 'story', label: "Nichole's story — Megan's doorway", paragraphs: [
        "The first time I stepped into Megan's home, she stood in the doorway with an anxious smile, her hands twisting the edge of her sweatshirt. She had warned me on the phone that her space was 'so overwhelming,' 'so embarrassing,' 'not at all what it used to be.'",
        "I saw piles. Books in uneven towers. Mail across surfaces. Clothes that no longer fit. Keepsakes that once brought joy but now carried a quiet heaviness. It wasn't chaos. It was exhaustion made visible.",
        "'I used to be so organized,' she said softly. 'I don't know what happened.'",
        "I smiled. 'Megan, I promise — this isn't the worst room I've ever seen. And we're going to make progress today. All you have to do is make decisions.' Her shoulders softened. For the first time, she exhaled.",
      ] },
      { type: 'p', text: "Clutter isn't about laziness or lack of discipline. It's about emotion. The stories attached to the things we own. The memories we're afraid to lose. The guilt we carry for what something costs — or what it represents." },
      { type: 'pull', text: "Every object tells a story. Before you can clear a space, you have to understand the emotional attachments holding it in place." },
      { type: 'h2', text: 'When clutter triggers your nervous system' },
      { type: 'p', text: 'You walk into a messy room and your body reacts before your brain does:' },
      { type: 'list', items: [
        'Your jaw tightens.',
        'Your shoulders creep toward your ears.',
        'Your breath becomes shallow.',
        "Your vision narrows — you're scanning, not seeing.",
      ] },
      { type: 'p', text: "This isn't a willpower problem. It's your nervous system interpreting visual chaos as a threat and shifting into fight, flight, freeze, or fawn. Your body is trying to protect you." },
      { type: 'h2', text: 'Action Step: Begin with Awareness' },
      { type: 'steps', items: [
        { title: 'Identify the areas that need organizing', body: 'Write them down — every drawer, room, or "I\'ll deal with that later" zone.' },
        { title: 'Clarify the purpose of each room', body: "Ask: What do I actually want to do in this room? What is it meant to support?" },
        { title: 'Notice what feels heavy', body: 'Stand in the hardest space. Notice memories, emotions, or stories that surface. Don\'t rush past this.' },
        { title: 'Rate the difficulty', body: 'Rate each space from 1 to 10. 10 = "I cannot begin here." 1 = "I could start right now."' },
        { title: 'Trust your first reaction', body: "When handling each item, ask: Do I love this? Do I use this? Does this align with my goal? You usually know within five seconds." },
      ] },
      { type: 'prompt', id: 'heaviest', label: 'The space that feels heaviest right now is __________ , because…' },
      { type: 'prompt', id: 'one_drawer', label: 'If everything feels like a 10, the smallest place I could start is…', placeholder: 'One drawer. One shelf. One countertop.' },
      { type: 'note', author: 'Kate', paragraphs: [
        "An honest moment with Kate: Sometimes my house feels louder than it actually is. Not noisy in a sound way, but visually. Every surface has something to say.",
        "My instinct is usually to think I need a big reset. But that idea alone is enough to make me more overwhelmed, not less. So instead, I aim smaller. Much smaller. I pick one space that won't fight back. Most days, that's the kitchen island — the emotional support surface of my home.",
        "Clearing one small space doesn't fix everything. But it reminds me: I'm not failing, I'm overwhelmed. I don't need to do everything to feel better — I just need one place to start.",
      ] },
    ],
  },
  {
    id: 'journey-2',
    number: '2',
    numberRoman: 'II',
    title: 'Recognizing the',
    titleAccent: 'Thought Patterns',
    subtitle: 'The thinking traps that keep us stuck',
    quote: "Once you can see the trap, you don't have to stay stuck in it.",
    blocks: [
      { type: 'lede', text: 'Therapists call them cognitive distortions. We\'re going to call them thinking traps.' },
      { type: 'p', text: "Thinking traps are the small, often automatic stories we tell ourselves about why we need to keep something — or why we can't possibly begin. They don't mean anything is wrong with you. They're simply habits your brain developed to protect you. We're not judging them. We're learning to notice them." },
      { type: 'trapcards' },
      { type: 'h2', text: 'Reframe Worksheet — Shift the Story' },
      { type: 'p', text: "Once you've spotted a thinking trap, the next step is learning to gently rewrite it. When we change the way we speak to ourselves, letting go becomes lighter." },
      { type: 'reframe' },
      { type: 'pull', text: 'When you change the way you think about your belongings, you\'re not just organizing your home — you\'re rewiring your brain.' },
      { type: 'realitychecks' },
    ],
  },
  {
    id: 'journey-3',
    number: '3',
    numberRoman: 'III',
    title: 'Setting Yourself',
    titleAccent: 'Up for Success',
    subtitle: 'Your why, your vision, your supports',
    quote: "You're the one driving the bus.",
    blocks: [
      { type: 'lede', text: "Real, lasting change doesn't happen because someone tells you what to do. It sticks when it comes from inside you." },
      { type: 'h3', text: "You don't need to grow a tree — just plant the seed" },
      { type: 'p', text: "If a season isn't right for big change, take one small action and let time do its work. You're not expecting a forest overnight. With consistent care, even a tiny seed grows." },
      { type: 'h3', text: 'Get visual inspiration' },
      { type: 'p', text: "A simple vision board — Pinterest, magazines, screenshots of homes you love — gives you something concrete to return to when decisions feel hard." },
      { type: 'h3', text: 'Treat yo\'self' },
      { type: 'p', text: "Kids aren't the only ones who need rewards. After each session, give yourself something — a cozy cup of tea, a few minutes of stretching. Then take a body snapshot: notice if your tension has shifted, how your breathing is, if the room feels lighter." },
      { type: 'h2', text: 'Words matter' },
      { type: 'p', text: "When we gently shift the way we talk to ourselves, we ditch the guilt. Instead of 'I should keep this,' try a compassionate reframe:" },
      { type: 'pull', text: 'Love lives in how I use things, not in keeping everything.' },
      { type: 'h3', text: 'Plant your seeds' },
      { type: 'prompt', id: 'reward', label: 'My simple reward after sessions will be…', placeholder: 'A cup of tea. A walk. Ten minutes outside.' },
      { type: 'prompt', id: 'body_snap', label: 'Body snapshot words that describe "after" for me are…', placeholder: 'Lighter. Quieter. More room to breathe.' },
      { type: 'prompt', id: 'guilt_phrase', label: 'A supportive phrase I\'ll say when guilt shows up is…', placeholder: 'Memories live in me, not in things.' },
      { type: 'prompt', id: 'cheerleader', label: 'One person who can cheer me on is…' },
    ],
  },
  {
    id: 'journey-4',
    number: '4',
    numberRoman: 'IV',
    title: 'Gentle',
    titleAccent: 'Let-Go Methods',
    subtitle: 'The Exposure Ladder',
    quote: 'How do you eat an elephant? One bite at a time.',
    blocks: [
      { type: 'lede', text: "Letting go doesn't have to be dramatic or painful." },
      { type: 'p', text: "Trying to force yourself to 'just get rid of it' often backfires. Instead, we use a gradual, supported approach — one that works with your nervous system, not against it." },
      { type: 'p', text: "Borrowed from psychology, gradual exposure helps you build confidence by increasing distance from an item slowly. Rather than jumping off a cliff, you walk down a staircase — one manageable step at a time. Each step teaches your brain: I'm okay. I can handle this." },
      { type: 'ladder' },
      { type: 'pull', text: 'Each item you release reinforces a powerful message: You are capable. You are safe. You can let go.' },
      { type: 'softbox', head: 'Try the Exposure Ladder', text: "The Ladder is the heart of this app. Add an emotionally sticky item — just one — and walk it down the steps at your own pace. The app remembers where you left it. Visit the Ladder section from the menu." },
    ],
  },
  {
    id: 'journey-5',
    number: '5',
    numberRoman: 'V',
    title: 'Daily & Weekly',
    titleAccent: 'Resets That Stick',
    subtitle: 'Maintenance without overwhelm',
    quote: 'Make the good stuff easy. The not-so-good stuff, less easy.',
    blocks: [
      { type: 'lede', text: 'Habits stick when you reduce barriers to your desired behaviors and increase barriers to undesired ones.' },
      { type: 'p', text: "The easier you make a desired action, the more likely you'll do it consistently. Just as important: throw up small hurdles for the habits you want to break. Tucking your credit card in a different drawer. Even tiny disruptions interrupt automatic patterns and give you space to choose." },
      { type: 'h2', text: 'Less frazzle, better decisions' },
      { type: 'p', text: 'To make wise decisions, especially big ones, minimize distractions. Reducing visual and auditory noise creates a calmer mind — and clearer minds make more thoughtful choices.' },
      { type: 'softbox', head: 'Make it easier · Make it harder', items: [
        'Hooks by the door = easier to hang the coat than to drape it on a chair.',
        'Donation bag in the trunk = easier to drop off than to forget.',
        'Phone-free hour after dinner = harder to scroll, easier to reset.',
        'Empty surfaces in your bedroom = harder for clutter to land.',
      ] },
      { type: 'h2', text: 'The 15-Minute Reset' },
      { type: 'p', text: 'This is how you stay organized. Before your tush hits the couch at night, take 15 minutes. Put things back where they belong. That\'s it.' },
      { type: 'pull', text: "You don't need to be perfect. You just need to be consistent." },
      { type: 'softbox', head: 'Try the Reset Timer', text: 'A simple 15-minute countdown lives in the menu. Press start, put a few things away, and let yourself feel the lightness when it dings. The app tracks your streak.' },
    ],
  },
  {
    id: 'journey-6',
    number: '6',
    numberRoman: 'VI',
    title: 'Special',
    titleAccent: 'Situations',
    subtitle: 'Sentimental items, heirlooms & comfort objects',
    quote: "Honor what was — while making room for what's next.",
    blocks: [
      { type: 'lede', text: 'When something feels soothing, your brain shifts from stress mode to rest mode.' },
      { type: 'h3', text: 'The science of "ahhhh…"' },
      { type: 'p', text: "Comforting sights, sounds, and textures calm your nervous system. The trick when decluttering: pick one item that genuinely brings you peace, and let the duplicates go. You keep the comfort without the excess." },
      { type: 'h3', text: 'The Legacy Box' },
      { type: 'p', text: "Use a small Legacy Box and photo stories to continue bonds while reclaiming function. The goal isn't how much you keep — it's that your space supports your life now, while still honoring what was." },
      { type: 'h3', text: 'Anchor items' },
      { type: 'p', text: 'Memories are intangible — and that\'s okay. To honor them, we choose anchor items: small physical links to a beloved person, a favorite era, a life-changing event. They let us pay tribute without letting the past take over the present.' },
      { type: 'prompt', id: 'kids_art', label: "Children's art: Which 10 pieces make the yearly portfolio? What story do they tell?" },
      { type: 'prompt', id: 'heirloom_box', label: 'My Legacy Box (one per person) will contain…' },
      { type: 'prompt', id: 'hobby_boundary', label: 'Hobby supplies: The space boundary is __________. If it doesn\'t fit, it doesn\'t stay.' },
      { type: 'prompt', id: 'soother', label: 'Texture soothers: Which one will I keep in active use? What duplicates can go?' },
      { type: 'prompt', id: 'story_card', label: "Grief: One story card I'll write (for a photo album) says…" },
    ],
  },
  {
    id: 'journey-7',
    number: '7',
    numberRoman: 'VII',
    title: 'Grace in',
    titleAccent: 'the Return',
    subtitle: 'Trusting yourself when life gets full again',
    quote: 'You are not trying to become a person who never struggles. You are becoming a person who trusts herself when she does.',
    blocks: [
      { type: 'lede', text: "If you've made it here, pause. Not to evaluate how much you've finished. Just pause." },
      { type: 'p', text: 'You have done more than clear space. You have built capacity:' },
      { type: 'list', items: [
        'Capacity to notice what feels heavy.',
        'Capacity to question the stories your mind tells you.',
        'Capacity to sit with discomfort instead of reacting to it.',
        'Capacity to let go — not harshly, not dramatically — but steadily.',
      ] },
      { type: 'pull', text: 'Clutter will come back.' },
      { type: 'p', text: "Not because you failed. Not because you didn't try hard enough. Clutter comes back because life keeps moving. New seasons. Transitions. Grief. Growth. Joyful chaos." },
      { type: 'p', text: 'That moment does not erase your progress. It is simply an invitation to return.' },
      { type: 'p', text: "This final journey is not about preventing clutter forever. It's about becoming someone who can return without shame. Someone who can notice, adjust, and begin again — without spiraling into all-or-nothing thinking." },
      { type: 'pull', text: "You are becoming a person who trusts herself when she struggles. That is a different kind of order — one that lives inside you." },
      { type: 'flourish' },
    ],
  },
]

export const traps = [
  {
    n: 1,
    title: 'All-or-Nothing Thinking',
    examples: ['"If I start, I\'ll have to finish everything."', '"If I don\'t do it perfectly, why bother?"'],
    body: 'This trap convinces you that your only options are everything or nothing. Real progress lives in the middle.',
  },
  {
    n: 2,
    title: 'Catastrophizing',
    examples: ['"If I throw this out, something bad will happen."', '"I\'ll regret it forever."'],
    body: "Letting go can feel scary, but it's rarely as dangerous as your mind predicts.",
  },
  {
    n: 3,
    title: 'The Perfectionistic "Shoulds"',
    examples: ['"I should keep it — it was a gift."', '"I should fix it someday."', '"I should be able to make this work."'],
    body: "Shoulds don't create clarity. They create pressure. Letting go isn't failure — it's freedom.",
  },
  {
    n: 4,
    title: 'Feeling Overly Responsible',
    examples: ["Acting as if we're the caretaker of every item's future."],
    body: 'Memories live inside you — not inside things. Objects can hold meaning, but they are not responsible for preserving your identity or your past.',
  },
]

export const realityChecks = [
  {
    n: '01',
    title: "What's really true?",
    body: "Letting go of items rarely means losing memories. Choosing a few meaningful pieces often allows you to appreciate them more, not less. Memories don't disappear when objects do — they live within you.",
  },
  {
    n: '02',
    title: 'Does this actually support your life?',
    body: "Clutter becomes a problem when it interferes with a room's purpose. The goal isn't minimalism. The goal is supporting how you actually live.",
  },
]

export const ladderSteps = [
  {
    n: 1,
    roman: 'I',
    title: 'Neutral Zone',
    body: 'Move the item to a neutral space in your home — a spare room, a hallway corner, a labeled box. Still accessible, but no longer in its emotionally charged location.',
    suggestedDays: 0,
  },
  {
    n: 2,
    roman: 'II',
    title: 'Out of Sight',
    body: 'Move the item out of sight for 48–72 hours. A closet, a cupboard, a bin. Notice what happens. Do you miss it? Does the anxiety peak, then settle? That settling matters.',
    suggestedDays: 3,
  },
  {
    n: 3,
    roman: 'III',
    title: 'Garage or Deep Storage',
    body: 'Move the item to a less accessible area — garage, attic, deep closet. Your brain begins to understand the item is no longer part of your daily life. Emotional attachment loosens here.',
    suggestedDays: 7,
  },
  {
    n: 4,
    roman: 'IV',
    title: 'In the Car',
    body: "If you're ready, place the item in your car (only if safe). It's now fully outside your home, but still technically with you. A final emotional checkpoint — without pressure.",
    suggestedDays: 3,
  },
  {
    n: 5,
    roman: 'V',
    title: 'Release',
    body: 'Donate, recycle, sell, or gift the item. By this point, the emotional work is done. Letting go feels lighter — sometimes even relieving.',
    suggestedDays: 0,
  },
] as const
