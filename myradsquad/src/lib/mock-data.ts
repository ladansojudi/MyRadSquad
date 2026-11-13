import type { Href } from 'expo-router';

import type { SeatShape, SeatTone } from '@/components/art/seat-tile';

export type Member = {
  id: string;
  name: string;
  letter: string;
  tone: SeatTone;
  shape: SeatShape;
};

export const SQUAD_NAME = 'Lunch Table Legends';
export const FREE_SEATS = 5;
export const PLUS_SEATS = 12;

export const MEMBERS = {
  maya: { id: 'maya', name: 'Maya', letter: 'M', tone: 'coral', shape: 'square' },
  jordan: { id: 'jordan', name: 'Jordan', letter: 'J', tone: 'teal', shape: 'leaf' },
  leo: { id: 'leo', name: 'Leo', letter: 'L', tone: 'surface', shape: 'square' },
  ava: { id: 'ava', name: 'Ava', letter: 'A', tone: 'surface', shape: 'square' },
  you: { id: 'you', name: 'You', letter: 'Y', tone: 'cobalt', shape: 'circle' },
  sam: { id: 'sam', name: 'Sam', letter: 'S', tone: 'teal', shape: 'leaf' },
  priya: { id: 'priya', name: 'Priya', letter: 'P', tone: 'cobalt', shape: 'square' },
  nia: { id: 'nia', name: 'Nia', letter: 'N', tone: 'coral', shape: 'circle' },
  theo: { id: 'theo', name: 'Theo', letter: 'T', tone: 'surface', shape: 'leaf' },
} satisfies Record<string, Member>;

export type MemberId = keyof typeof MEMBERS;

export const TODAYS_QUESTION = "What's the most chaotic thing that happened at lunch?";

/** The squad's answers, revealed once you answer. Your own answer is shown last, on the right. */
export const QUESTION_ANSWERS: { author: MemberId; text: string }[] = [
  { author: 'maya', text: 'someone microwaved fish' },
  { author: 'jordan', text: 'the fire alarm. again.' },
];

/** The answer shown for you in the design, if you submit an empty field. */
export const EXAMPLE_ANSWER = "Leo's tray flip";

/** The first question on a brand-new table: answered now, seen by friends when they join. */
export const FIRST_QUESTION = "What's your go-to lunch order?";

/** Mock invite link (no backend). */
export const INVITE_LINK = 'https://myradsquad.app/j/lunch-table-legends';

export const SPARK_QUESTION = 'Best snack for a 3-hour study session? Wrong answers only.';

export type SparkAnswer = { author: MemberId; text: string | null };

export const SPARK_ANSWERS: SparkAnswer[] = [
  { author: 'leo', text: 'a single grape' },
  { author: 'you', text: 'cold pizza from tuesday' },
  { author: 'jordan', text: 'the bio notes themselves' },
  { author: 'maya', text: null },
];

export type NoteKind = 'pdf' | 'cards' | 'doc';
export type Note = {
  id: string;
  title: string;
  meta: string;
  tone: 'coral' | 'cobalt' | 'teal';
  kind: NoteKind;
};

/** Notes shared in Lunch Table Legends (the first two are pinned on the Study tab). */
export const SHARED_NOTES: Note[] = [
  { id: 'cell', title: 'Cell division.pdf', meta: 'Maya · 2h ago', tone: 'coral', kind: 'pdf' },
  {
    id: 'flash',
    title: 'Ch. 4 flashcards',
    meta: 'Jordan · 32 cards',
    tone: 'cobalt',
    kind: 'cards',
  },
  { id: 'lab', title: 'Lab 3 write-up', meta: 'Leo · yesterday', tone: 'teal', kind: 'doc' },
  { id: 'vocab', title: 'Bio vocab', meta: 'Ava · 48 cards', tone: 'coral', kind: 'cards' },
  { id: 'diagram', title: 'Mitosis diagram.pdf', meta: 'Maya · Mon', tone: 'cobalt', kind: 'pdf' },
  { id: 'plan', title: 'Exam study plan', meta: 'You · Sun', tone: 'teal', kind: 'doc' },
];

/** Chapter 4 flashcards (cell division). */
export const FLASHCARDS = [
  { q: 'What are the 4 phases of mitosis?', a: 'Prophase, metaphase, anaphase, telophase' },
  { q: 'When do chromosomes line up in the middle?', a: 'Metaphase' },
  { q: 'What splits the cytoplasm at the end?', a: 'Cytokinesis' },
  { q: 'How many cells does meiosis make?', a: 'Four, each with half the chromosomes' },
  { q: 'What pulls sister chromatids apart?', a: 'Spindle fibers, in anaphase' },
];

/** Stickers anyone can drop into a chat. */
export const STICKERS: { label: string; tone: 'surface' | 'coral' | 'cobalt' | 'teal' }[] = [
  { label: 'LOL', tone: 'cobalt' },
  { label: "I'M IN", tone: 'coral' },
  { label: 'SAME', tone: 'teal' },
  { label: 'NO WAY', tone: 'surface' },
  { label: 'OMW', tone: 'coral' },
  { label: 'ICONIC', tone: 'cobalt' },
  { label: 'BRB', tone: 'surface' },
  { label: 'W', tone: 'teal' },
];

export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const PLANS = {
  yearly: { label: 'Yearly', price: '$29.99/yr', perMonth: '$2.50/mo', badge: 'SAVE 86%' },
  weekly: { label: 'Weekly', price: '$3.99/week' },
} as const;

export type PlanId = keyof typeof PLANS;

export type MomentTone = 'cobalt' | 'teal' | 'coral' | 'canvas';

/**
 * Real photos for moments and memories (Wikimedia Commons, free licenses; authors and
 * licenses in assets/images/photos/CREDITS.json). Scenes and things, no faces.
 */
/** A bundled image (what `require` of an image file returns). */
export type Photo = number;

export const PHOTOS = {
  alarm: require('@/assets/images/photos/alarm.jpg'),
  tray: require('@/assets/images/photos/tray.jpg'),
  court: require('@/assets/images/photos/court.jpg'),
  sunset: require('@/assets/images/photos/sunset.jpg'),
  sneakers: require('@/assets/images/photos/sneakers.jpg'),
  library: require('@/assets/images/photos/library.jpg'),
  pizza: require('@/assets/images/photos/pizza.jpg'),
  lab: require('@/assets/images/photos/lab.jpg'),
  lockers: require('@/assets/images/photos/lockers.jpg'),
  rain: require('@/assets/images/photos/rain.jpg'),
  halloween: require('@/assets/images/photos/halloween.jpg'),
} satisfies Record<string, Photo>;

export type Moment = {
  id: string;
  author: MemberId;
  ago: string;
  caption: string;
  /** Background and the two shapes drawn on the placeholder photo. */
  tones: [MomentTone, MomentTone, MomentTone];
  /** The photo; without one, the coloured placeholder (tones) is drawn. */
  photo?: Photo;
  reactions: { label: string; count?: number }[];
  /** Your reaction when the screen was designed (counted in its total). */
  mine?: string;
};

export const MOMENTS: Moment[] = [
  {
    id: 'alarm',
    author: 'maya',
    ago: '2 min ago',
    caption: 'the fire alarm. again.',
    tones: ['cobalt', 'coral', 'teal'],
    photo: PHOTOS.alarm,
    reactions: [{ label: 'lol', count: 4 }, { label: 'same', count: 2 }, { label: 'no way' }],
    mine: 'lol',
  },
  {
    id: 'tray',
    author: 'leo',
    ago: '1h ago',
    caption: 'tray flip, slow-mo',
    tones: ['teal', 'canvas', 'cobalt'],
    photo: PHOTOS.tray,
    reactions: [{ label: 'lol', count: 3 }, { label: 'same' }, { label: 'no way', count: 1 }],
  },
  {
    id: 'court',
    author: 'jordan',
    ago: '3h ago',
    caption: 'gym class mvp',
    tones: ['coral', 'cobalt', 'canvas'],
    photo: PHOTOS.court,
    reactions: [{ label: 'lol', count: 1 }, { label: 'same', count: 1 }, { label: 'no way' }],
  },
];

/** Extra reactions behind the "+" pill. */
export const MORE_REACTIONS = ['omg', 'dead', 'iconic'];

/** Colour combinations for a posted moment (mock camera). */
export const MOMENT_LOOKS: [MomentTone, MomentTone, MomentTone][] = [
  ['coral', 'canvas', 'cobalt'],
  ['teal', 'coral', 'canvas'],
  ['cobalt', 'teal', 'coral'],
  ['canvas', 'cobalt', 'teal'],
];

/** A past day in your Memories calendar: the moment you kept from that day. */
export type Memory = {
  /** Days before today (0 = today). */
  daysAgo: number;
  author: MemberId;
  caption: string;
  tones: [MomentTone, MomentTone, MomentTone];
  photo?: Photo;
};

/**
 * Memories: after 24h a moment leaves the squad's feed, but it stays in your own
 * calendar (only you see past days), like Locket and BeReal memories. Mock data.
 */
export const MEMORIES: Memory[] = [
  {
    daysAgo: 1,
    author: 'leo',
    caption: 'tray flip, slow-mo',
    tones: ['teal', 'canvas', 'cobalt'],
    photo: PHOTOS.tray,
  },
  {
    daysAgo: 2,
    author: 'you',
    caption: 'bus window sunset',
    tones: ['coral', 'canvas', 'cobalt'],
    photo: PHOTOS.sunset,
  },
  {
    daysAgo: 3,
    author: 'jordan',
    caption: 'gym class mvp',
    tones: ['coral', 'cobalt', 'canvas'],
    photo: PHOTOS.court,
  },
  {
    daysAgo: 5,
    author: 'maya',
    caption: 'bio lab chaos',
    tones: ['cobalt', 'teal', 'coral'],
    photo: PHOTOS.lab,
  },
  {
    daysAgo: 6,
    author: 'you',
    caption: 'new sneakers',
    tones: ['canvas', 'coral', 'teal'],
    photo: PHOTOS.sneakers,
  },
  {
    daysAgo: 8,
    author: 'ava',
    caption: 'library fort',
    tones: ['teal', 'coral', 'canvas'],
    photo: PHOTOS.library,
  },
  {
    daysAgo: 9,
    author: 'leo',
    caption: 'pizza friday',
    tones: ['coral', 'teal', 'cobalt'],
    photo: PHOTOS.pizza,
  },
  {
    daysAgo: 11,
    author: 'maya',
    caption: 'first day back',
    tones: ['cobalt', 'canvas', 'coral'],
    photo: PHOTOS.lockers,
  },
  {
    daysAgo: 12,
    author: 'jordan',
    caption: 'rain day',
    tones: ['teal', 'cobalt', 'canvas'],
    photo: PHOTOS.rain,
  },
  {
    daysAgo: 15,
    author: 'you',
    caption: 'halloween fits',
    tones: ['coral', 'cobalt', 'teal'],
    photo: PHOTOS.halloween,
  },
];

/** Something happening inside a squad (shown on its card). */
export type SquadActivity = {
  kind: 'voice' | 'moment' | 'focus';
  title: string;
  /** People in it: only those in the squad right now are named, and it hides when none are. */
  people?: MemberId[];
  /** Shown after the names (or on its own when there are no people). */
  detail: string;
  action: string;
  /** Screen it opens; the squad's chat when missing. */
  href?: Href;
};

/** A squad you are in. Mock data: presence changes at runtime (see LIVE_EVENT). */
export type SquadInfo = {
  id: string;
  name: string;
  members: MemberId[];
  /** Friends in the squad right now, at launch. */
  here: MemberId[];
  lastActive: string;
  /** Minutes since the last message (ranks quiet squads). */
  minutesAgo: number;
  unread: number;
  activities: SquadActivity[];
  /** Recent messages, oldest first; they rotate on the card while the squad is live. */
  messages: { author: MemberId; text: string }[];
  /** Who answers when you write there, and what they say in turn. */
  replies: { from: MemberId; lines: string[] };
};

/** Kept as a name for the non-featured squads. */
export type OtherSquad = SquadInfo;

export const LUNCH_SQUAD: SquadInfo = {
  id: 'lunch',
  name: SQUAD_NAME,
  members: ['maya', 'jordan', 'leo', 'ava', 'you'],
  here: ['maya', 'jordan', 'leo'],
  lastActive: 'now',
  minutesAgo: 0,
  unread: 2,
  activities: [
    {
      kind: 'voice',
      title: 'Hangout room',
      people: ['jordan', 'leo'],
      detail: 'music on',
      action: 'Join',
      href: '/room',
    },
    {
      kind: 'moment',
      title: "Maya's moment",
      detail: '2 min ago · gone in 24h',
      action: 'View',
      href: '/squad/moments',
    },
  ],
  messages: [
    { author: 'jordan', text: "who's down for boba after 6th?" },
    { author: 'maya', text: "I'M IN" },
    { author: 'leo', text: 'lunch was actually insane' },
  ],
  replies: { from: 'leo', lines: ['lol same'] },
};

export const OTHER_SQUADS: SquadInfo[] = [
  {
    id: 'study-hall',
    name: 'Study Hall',
    members: ['sam', 'priya', 'jordan', 'you'],
    here: ['sam', 'priya'],
    lastActive: '1 min ago',
    minutesAgo: 1,
    unread: 4,
    activities: [
      {
        kind: 'focus',
        title: 'Focus session',
        people: ['sam', 'priya', 'jordan'],
        detail: '18 min left',
        action: 'Join',
      },
    ],
    messages: [
      { author: 'priya', text: 'chem worksheet due tmrw, anyone started?' },
      { author: 'sam', text: 'q3 is evil' },
      { author: 'jordan', text: 'focus session at 7?' },
      { author: 'priya', text: 'in. bringing snacks' },
    ],
    replies: { from: 'sam', lines: ['bet', 'q4 is worse fyi', 'see u at 7'] },
  },
  {
    id: 'cousins',
    name: 'Cousins',
    members: ['nia', 'theo', 'you'],
    here: [],
    lastActive: 'yesterday',
    minutesAgo: 1400,
    unread: 0,
    activities: [],
    messages: [
      { author: 'nia', text: 'grandma says thanksgiving at hers again' },
      { author: 'theo', text: 'calling dibs on the mashed potatoes' },
    ],
    replies: { from: 'nia', lines: ['lol same', 'theo stop', 'see u thursday'] },
  },
];

export const ALL_SQUADS: SquadInfo[] = [LUNCH_SQUAD, ...OTHER_SQUADS];

/**
 * The scripted moment another squad comes alive (mock, once per session): Jordan leaves
 * the hangout room for Study Hall's focus session, so Study Hall becomes the live squad.
 */
export const LIVE_EVENT = {
  squadId: 'study-hall',
  presence: { lunch: ['maya', 'leo'], 'study-hall': ['sam', 'priya', 'jordan'] } as Record<
    string,
    MemberId[]
  >,
  title: 'Study Hall is live',
  detail: 'Jordan joined Sam and Priya · focus session',
  faces: ['jordan', 'sam', 'priya'] as MemberId[],
};

/** What a room is for: hanging out, or getting work done. */
export type RoomVibe = 'fun' | 'study';
export type RoomKind = 'voice' | 'game' | 'focus' | 'notes' | 'moments';
export type RoomTone = 'cobalt' | 'teal' | 'coral' | 'canvas';

/**
 * A room: something a squad member starts from the chat (+), like a voice hangout or a
 * focus timer. It is not set up ahead of time and it is not permanent: everyone in the
 * squad sees "Sam started a Focus session", friends join, and it closes when it empties.
 */
export type Room = {
  id: string;
  squadId: string;
  name: string;
  kind: RoomKind;
  vibe: RoomVibe;
  tone: RoomTone;
  /** Who started it (shown everywhere the room is: "Sam started …"). */
  startedBy: MemberId;
  startedAgo: string;
  /** Who is in it; only those in the squad right now count. */
  people: MemberId[];
  /** What's going on ("lo-fi beats on", "18 min left"). */
  detail: string;
  /** Kept for search; rooms only show while open. */
  idle: string;
  href: Href;
};

/** The kinds of room anyone can start, with what each one is for. */
export const ROOM_TEMPLATES: Record<
  Exclude<RoomKind, 'moments'>,
  { name: string; vibe: RoomVibe; tone: RoomTone; detail: string; blurb: string }
> = {
  voice: {
    name: 'Hangout',
    vibe: 'fun',
    tone: 'cobalt',
    detail: 'music on',
    blurb: 'Talk and listen to music together',
  },
  focus: {
    name: 'Focus session',
    vibe: 'study',
    tone: 'teal',
    detail: '25 min',
    blurb: 'A shared 25-min timer. Chat stays quiet.',
  },
  notes: {
    name: 'Study together',
    vibe: 'study',
    tone: 'canvas',
    detail: 'notes open',
    blurb: 'Go through notes and flashcards as a group',
  },
  game: {
    name: 'Quick game',
    vibe: 'fun',
    tone: 'coral',
    detail: 'trivia, 5 min',
    blurb: 'A short trivia round for the squad',
  },
};

export const ROOMS: Room[] = [
  {
    id: 'hangout',
    squadId: 'lunch',
    name: 'Hangout',
    kind: 'voice',
    vibe: 'fun',
    tone: 'cobalt',
    startedBy: 'leo',
    startedAgo: '20 min ago',
    people: ['jordan', 'leo'],
    detail: 'lo-fi beats on',
    idle: 'Drop-in voice',
    href: { pathname: '/room', params: { id: 'hangout' } },
  },
  {
    id: 'bio-focus',
    squadId: 'lunch',
    name: 'Bio cram',
    kind: 'focus',
    vibe: 'study',
    tone: 'teal',
    startedBy: 'maya',
    startedAgo: '5 min ago',
    people: ['maya'],
    detail: '20 min left',
    idle: 'Exam in 3 days',
    href: '/focus',
  },
  {
    id: 'focus-hall',
    squadId: 'study-hall',
    name: 'Focus session',
    kind: 'focus',
    vibe: 'study',
    tone: 'teal',
    startedBy: 'sam',
    startedAgo: '7 min ago',
    people: ['sam', 'priya', 'jordan'],
    detail: '18 min left',
    idle: '25 min rounds',
    href: '/focus',
  },
  {
    id: 'chem',
    squadId: 'study-hall',
    name: 'Chem homework',
    kind: 'notes',
    vibe: 'study',
    tone: 'cobalt',
    startedBy: 'priya',
    startedAgo: '12 min ago',
    people: ['priya'],
    detail: 'on question 3',
    idle: 'Worksheet due tmrw',
    href: '/notes',
  },
  {
    id: 'trivia',
    squadId: 'cousins',
    name: 'Family trivia',
    kind: 'game',
    vibe: 'fun',
    tone: 'coral',
    startedBy: 'nia',
    startedAgo: 'just now',
    people: ['nia', 'theo'],
    detail: 'round 1',
    idle: 'Sunday at 8',
    href: { pathname: '/room', params: { id: 'trivia' } },
  },
];

/** What plays in a voice room (mock). */
export const ROOM_TRACKS: Record<string, { title: string; by: MemberId }> = {
  hangout: { title: 'lo-fi study beats', by: 'leo' },
  'snack-break': { title: 'snack break bangers', by: 'sam' },
  thanksgiving: { title: 'grandma’s kitchen radio', by: 'nia' },
  trivia: { title: 'game show theme', by: 'theo' },
};

/**
 * Spark's one "spark" for a quiet squad, at most once a day: a question to answer, a quick
 * vote (a mini game) or a photo task. Everyone in the squad sees it; nothing is counted.
 */
export type SparkDrop =
  | { kind: 'question'; text: string }
  | { kind: 'vote'; text: string; options: string[] }
  | { kind: 'photo'; text: string; caption: string };

/**
 * Waking a quiet squad. `opener` is a suggested first message you can send yourself (free);
 * `drop` is what Spark leaves when the squad has Spark and the chat went quiet.
 */
export type WakeInfo = {
  opener: string;
  drop: SparkDrop;
  back: MemberId;
  /** Days in a row someone wrote; it breaks at midnight if nobody does today. */
  streak: number;
  /** A photo from this squad, to restart the conversation with. */
  memory: { photo: Photo; caption: string; ago: string };
};

export const WAKE: Record<string, WakeInfo> = {
  cousins: {
    opener: 'ok who is bringing what on thursday',
    drop: {
      kind: 'vote',
      text: 'Who wakes up first on Thanksgiving? 🦃',
      options: ['Nia', 'Theo', 'Me'],
    },
    back: 'nia',
    streak: 12,
    memory: {
      photo: PHOTOS.halloween,
      caption: "pumpkin carving at grandma's",
      ago: '3 weeks ago',
    },
  },
  'study-hall': {
    opener: 'anyone up for a focus round?',
    drop: {
      kind: 'photo',
      text: 'Show your desk right now 📸 Messiest one wins.',
      caption: 'my desk rn 📸',
    },
    back: 'sam',
    streak: 4,
    memory: { photo: PHOTOS.library, caption: 'library fort', ago: '1 week ago' },
  },
  lunch: {
    opener: 'lunch tmrw, same table?',
    drop: { kind: 'question', text: "Drop this week's funniest moment 😂" },
    back: 'maya',
    streak: 21,
    memory: { photo: PHOTOS.tray, caption: 'tray flip, slow-mo', ago: 'yesterday' },
  },
};

/** Spark stops after this many sparks in a row that nobody answered. */
export const SPARK_PAUSE_AFTER = 2;
