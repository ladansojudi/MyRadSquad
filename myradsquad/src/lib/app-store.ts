import { create } from 'zustand';

import { ageOn, type Birthday } from '@/lib/age';
import {
  ALL_SQUADS,
  LIVE_EVENT,
  MEMBERS,
  ROOM_TEMPLATES,
  OTHER_SQUADS,
  SPARK_ANSWERS,
  SPARK_PAUSE_AFTER,
  type MemberId,
  type MomentTone,
  type PlanId,
  type Room,
  type RoomVibe,
  type SparkAnswer,
} from '@/lib/mock-data';
import { joinNames } from '@/lib/squads';
import { wakeCopy, type SquadSpark } from '@/lib/wake';

/** `invite` = joined Maya's table, `own` = started a new, empty table. */
export type Origin = 'invite' | 'own';
export type Purpose = 'hangout' | 'study' | 'moments';
export type SparkVibe = 'chill' | 'chaotic' | 'study';
/** Squad+ status: free, on the 3-day trial, or waiting for a parent's Ask to Buy. */
export type PlusStatus = 'free' | 'trial' | 'pending';

/** Each chat surface keeps its own messages. */
/** The fixed Lunch Table Legends surfaces, plus one thread per other squad (`squad-<id>`). */
export type ThreadId = 'squad' | 'study' | 'spark' | 'thread' | 'moments' | `squad-${string}`;

export type StickerTone = 'surface' | 'coral' | 'cobalt' | 'teal';

export type ChatMessage = {
  id: string;
  author: MemberId;
  text: string;
  /** Sent as a sticker instead of a bubble. */
  sticker?: StickerTone;
};

/** A squad you started in this session (nobody has joined yet). */
/** A squad you made. `joined`: the demo friends have joined it (after the invite step). */
export type CreatedSquad = { id: string; name: string; purpose: Purpose; joined?: boolean };

/** A moment you posted (mock photo: a colour combination, plus a caption). */
export type MyMoment = { id: string; caption: string; tones: [MomentTone, MomentTone, MomentTone] };

/** Who answers in each thread, and what they say (in turn). Mock replies, no backend. */
const REPLIES: Record<string, { from: MemberId; lines: string[] }> = {
  squad: {
    from: 'leo',
    lines: ['lol same', 'save me the window seat', 'boba is on me today', 'omw'],
  },
  study: {
    from: 'jordan',
    lines: ['deal', 'ok first question: what is prophase', 'bring snacks pls'],
  },
  spark: {
    from: 'leo',
    lines: ['a raw onion. like an apple', 'that is diabolical', 'spark is cooking today'],
  },
  thread: {
    from: 'maya',
    lines: ['WHY is it always pizza', 'respect', 'ok i finally have an answer'],
  },
  moments: { from: 'maya', lines: ['right?? third time this week', 'we were outside for 40 min'] },
};

const MAYA_SPARK_ANSWER = 'a whole raw onion';
const TYPING_DELAY_MS = 700;
const REPLY_DELAY_MS = 2200;
const MAYA_THINKS_MS = 2600;

export const EMPTY_THREAD: ChatMessage[] = [];

type AppState = {
  origin: Origin;
  birthday: Birthday;
  purpose: Purpose;
  questionAnswered: boolean;
  questionSkipped: boolean;
  /** What you wrote for today's question (unlocks the squad's answers). */
  myAnswer: string | null;
  /** Your answer to the first question on a new, empty table. */
  firstAnswer: string | null;
  notificationsOn: boolean;
  sparkAdded: boolean;
  /** Who turned Spark on, so the system message reads "You added Spark" or "Maya added Spark". */
  sparkAddedBy: 'you' | 'maya';
  sparkMuted: boolean;
  sparkVibe: SparkVibe;
  sparkAnswers: SparkAnswer[];
  plan: PlanId;
  plus: PlusStatus;
  nudged: boolean;
  joinedPlan: boolean;
  threads: Partial<Record<ThreadId, ChatMessage[]>>;
  /** Who is typing in a thread right now. The squad chat opens with Leo typing (as designed). */
  typing: Partial<Record<ThreadId, MemberId>>;
  replyCount: Partial<Record<ThreadId, number>>;
  /** The reaction you picked on each reaction row, by row id ('' = none). */
  reactions: Record<string, string>;
  createdSquads: CreatedSquad[];
  myMoments: MyMoment[];
  /** Rooms you started this session (on top of the mock rooms). */
  startedRooms: Room[];
  /** Squads whose notifications you turned off (by id). */
  mutedSquads: string[];
  /** Squads where Spark is muted just for you (other squads; Lunch uses sparkMuted). */
  sparkMutedFor: string[];
  /** Spark's question for a quiet squad, shown as a notification (one at a time). */
  sparkPing: { id: number; squadId: string } | null;
  sparkPingDone: boolean;
  /** Spark in squads other than Lunch Table Legends, by squad id (missing = no Spark). */
  squadSpark: Record<string, SquadSpark>;
  /** Who is in each squad right now, when it changed since launch (by squad id). */
  presence: Record<string, MemberId[]>;
  /** The in-app "a squad just came alive" banner. */
  liveAlert: {
    id: number;
    squadId: string;
    title: string;
    detail: string;
    faces: MemberId[];
  } | null;
  liveEventDone: boolean;
  /** One short confirmation at a time ("Invite link copied"). */
  toast: { id: number; text: string } | null;

  setOrigin: (origin: Origin) => void;
  setBirthday: (birthday: Birthday) => void;
  setPurpose: (purpose: Purpose) => void;
  answerQuestion: (text: string) => void;
  answerFirstQuestion: (text: string) => void;
  skipQuestion: () => void;
  setNotificationsOn: (on: boolean) => void;
  setSparkVibe: (vibe: SparkVibe) => void;
  addSpark: (vibe: SparkVibe, by?: 'you' | 'maya') => void;
  toggleSparkMuted: () => void;
  /** Anyone in the squad can take Spark out (everyone is told). */
  removeSpark: () => void;
  answerSpark: (text: string) => void;
  setPlan: (plan: PlanId) => void;
  setPlus: (plus: PlusStatus) => void;
  nudge: () => void;
  toggleJoinedPlan: () => void;
  sendMessage: (thread: ThreadId, text: string) => void;
  showToast: (text: string) => void;
  /** Another squad comes alive (scripted, once per session): presence moves, a banner shows. */
  triggerLiveEvent: () => void;
  dismissLiveAlert: () => void;
  /** Prototype menu: undo the live event so it can play again. */
  resetLiveEvent: () => void;
  sendSticker: (thread: ThreadId, label: string, tone: StickerTone) => void;
  createSquad: (name: string, purpose: Purpose) => string;
  /** Prototype: the friends you invited join your new squad, so you see it alive on Home. */
  demoJoinSquad: (id: string) => void;
  postMoment: (caption: string, tones: [MomentTone, MomentTone, MomentTone]) => void;
  /**
   * A squad went quiet: Spark asks it a question and you get it as a notification.
   * Opening it takes you into the squad, where your answer wakes everyone up.
   */
  triggerSparkPing: (squadId: string) => void;
  /**
   * Start a room in a squad (from the chat's +). The squad sees "You started …", and a
   * friend who's around joins a moment later. Returns the new room.
   */
  startRoom: (
    squadId: string,
    kind: keyof typeof ROOM_TEMPLATES,
    /** Your own room: your name and vibe instead of the template's. */
    custom?: { name: string; vibe: RoomVibe; detail?: string },
  ) => Room;
  toggleMuteSquad: (id: string) => void;
  toggleSquadSparkMuted: (id: string) => void;
  dismissSparkPing: () => void;
  addSquadSpark: (id: string) => void;
  removeSquadSpark: (id: string) => void;
  /** Prototype menu: Spark asked twice in this squad and nobody answered. */
  pauseSquadSpark: (id: string) => void;
  /**
   * You write in a quiet squad (an opener, or your answer to Spark). The message pings the
   * squad (a person pings, never Spark); a friend comes back and answers, and the squad is live.
   */
  wakeSquad: (id: string, text: string) => void;
  /** Back to a fresh install (prototype menu). */
  resetDemo: () => void;
  setReaction: (rowId: string, label: string) => void;
};

let nextId = 0;
const newId = () => `m${++nextId}`;

type Data = Omit<
  AppState,
  {
    [K in keyof AppState]: AppState[K] extends (...args: never[]) => unknown ? K : never;
  }[keyof AppState]
>;

/**
 * Squads where a friend already added Spark: Maya in Lunch Table Legends (state 2, what the
 * squad sees) and Nia in Cousins (quiet, so Spark has left its spark). Study Hall has no
 * Spark yet, so you can turn it on yourself from its settings (state 1).
 */
const SPARK_START: Record<string, SquadSpark> = {
  cousins: { by: 'nia', unanswered: 0 },
};

/** A fresh install. The app is a prototype: nothing is saved, every launch starts here. */
const INITIAL: Data = {
  origin: 'invite',
  birthday: { year: 2011, month: 2, day: 12 },
  purpose: 'hangout',
  questionAnswered: false,
  questionSkipped: false,
  myAnswer: null,
  firstAnswer: null,
  notificationsOn: false,
  // You arrive by invite (A1) into Maya's table, where Maya already added Spark.
  sparkAdded: true,
  sparkAddedBy: 'maya',
  sparkMuted: false,
  sparkVibe: 'chill',
  sparkAnswers: SPARK_ANSWERS,
  plan: 'yearly',
  plus: 'free',
  nudged: false,
  joinedPlan: false,
  threads: { squad: [], study: [], spark: [], thread: [], moments: [] },
  typing: { squad: 'leo' },
  replyCount: {},
  reactions: {},
  toast: null,
  squadSpark: SPARK_START,
  sparkPing: null,
  sparkPingDone: false,
  mutedSquads: [],
  sparkMutedFor: [],
  startedRooms: [],
  presence: {},
  liveAlert: null,
  liveEventDone: false,
  createdSquads: [],
  myMoments: [],
};

const TOAST_MS = 2200;

export const useAppStore = create<AppState>((set, get) => ({
  ...INITIAL,

  setOrigin: (origin) => set({ origin }),
  setBirthday: (birthday) => set({ birthday }),
  setPurpose: (purpose) => set({ purpose }),
  answerQuestion: (text) => set({ questionAnswered: true, myAnswer: text }),
  answerFirstQuestion: (text) => set({ firstAnswer: text }),
  skipQuestion: () => set({ questionSkipped: true }),
  setNotificationsOn: (notificationsOn) => set({ notificationsOn }),
  setSparkVibe: (sparkVibe) => set({ sparkVibe }),
  addSpark: (sparkVibe, by = 'you') =>
    set({ sparkAdded: true, sparkVibe, sparkAddedBy: by, sparkMuted: false }),
  toggleSparkMuted: () => set((s) => ({ sparkMuted: !s.sparkMuted })),
  removeSpark: () => set({ sparkAdded: false, sparkMuted: false }),

  answerSpark: (text) => {
    set((s) => ({
      sparkAnswers: s.sparkAnswers.map((a) => (a.author === 'you' ? { ...a, text } : a)),
    }));
    // Maya is "still thinking…" until you answer; she answers a moment after you.
    if (get().sparkAnswers.some((a) => a.author === 'maya' && !a.text)) {
      setTimeout(() => {
        set((s) => ({
          sparkAnswers: s.sparkAnswers.map((a) =>
            a.author === 'maya' ? { ...a, text: MAYA_SPARK_ANSWER } : a,
          ),
        }));
      }, MAYA_THINKS_MS);
    }
  },

  setPlan: (plan) => set({ plan }),
  setPlus: (plus) => set({ plus }),
  nudge: () => set({ nudged: true }),
  toggleJoinedPlan: () => set((s) => ({ joinedPlan: !s.joinedPlan })),

  sendMessage: (thread, text) => {
    const mine: ChatMessage = { id: newId(), author: 'you', text };
    set((s) => ({ threads: { ...s.threads, [thread]: [...(s.threads[thread] ?? []), mine] } }));

    // A friend starts typing, then answers. Mock conversation, so the chat feels alive.
    const other = OTHER_SQUADS.find((sq) => `squad-${sq.id}` === thread);
    const { from, lines } = REPLIES[thread] ?? other?.replies ?? REPLIES.squad;
    setTimeout(() => set((s) => ({ typing: { ...s.typing, [thread]: from } })), TYPING_DELAY_MS);
    setTimeout(() => {
      const count = get().replyCount[thread] ?? 0;
      const reply: ChatMessage = { id: newId(), author: from, text: lines[count % lines.length] };
      set((s) => ({
        threads: { ...s.threads, [thread]: [...(s.threads[thread] ?? []), reply] },
        typing: { ...s.typing, [thread]: undefined },
        replyCount: { ...s.replyCount, [thread]: count + 1 },
      }));
    }, REPLY_DELAY_MS);
  },

  setReaction: (rowId, label) => set((s) => ({ reactions: { ...s.reactions, [rowId]: label } })),

  showToast: (text) => {
    const id = Date.now();
    set({ toast: { id, text } });
    setTimeout(() => set((s) => (s.toast?.id === id ? { toast: null } : {})), TOAST_MS);
  },

  triggerLiveEvent: () => {
    if (get().liveEventDone) return;
    set((s) => ({
      presence: { ...s.presence, ...LIVE_EVENT.presence },
      liveEventDone: true,
      liveAlert: {
        id: Date.now(),
        squadId: LIVE_EVENT.squadId,
        title: LIVE_EVENT.title,
        detail: LIVE_EVENT.detail,
        faces: LIVE_EVENT.faces,
      },
    }));
  },
  dismissLiveAlert: () => set({ liveAlert: null }),
  resetLiveEvent: () => set({ presence: {}, liveAlert: null, liveEventDone: false }),

  triggerSparkPing: (squadId) =>
    set((s) => ({
      sparkPingDone: true,
      sparkPing: { id: Date.now(), squadId },
      // Mock: Nia (Squad+) added Spark to Cousins earlier; it asks after the quiet.
      squadSpark: { ...s.squadSpark, [squadId]: { by: 'nia', unanswered: 1 } },
    })),
  dismissSparkPing: () => set({ sparkPing: null }),
  startRoom: (squadId, kind, custom) => {
    const base = ROOM_TEMPLATES[kind];
    const t = custom
      ? { ...base, name: custom.name, vibe: custom.vibe, detail: custom.detail || base.detail }
      : base;
    const id = `mine-${newId()}`;
    const room: Room = {
      id,
      squadId,
      name: t.name,
      kind,
      vibe: t.vibe,
      tone: t.tone,
      startedBy: 'you',
      startedAgo: 'just now',
      people: ['you'],
      detail: t.detail,
      idle: t.blurb,
      // Focus opens the shared timer and Study the notes; the rest open the live room.
      href:
        kind === 'focus'
          ? '/focus'
          : kind === 'notes'
            ? '/notes'
            : { pathname: '/room', params: { id } },
    };
    set((s) => ({ startedRooms: [...s.startedRooms, room] }));
    get().showToast(`Your squad sees "You started ${t.name}"`);
    // A friend who's around sees it and hops in.
    const squad = ALL_SQUADS.find((q) => q.id === squadId);
    const here = get().presence[squadId] ?? squad?.here ?? [];
    // In a quiet squad, the room is the ping: a friend sees it and comes back.
    const quiet = !here.some((m) => m !== 'you');
    const friend = here.find((m) => m !== 'you') ?? (squad ? wakeCopy(squadId).back : undefined);
    if (quiet && get().squadSpark[squadId]) {
      set((s) => ({
        squadSpark: { ...s.squadSpark, [squadId]: { ...s.squadSpark[squadId], unanswered: 0 } },
      }));
    }
    if (friend) {
      setTimeout(() => {
        set((s) => ({
          startedRooms: s.startedRooms.map((r) =>
            r.id === id ? { ...r, people: [...r.people, friend] } : r,
          ),
          presence: quiet ? { ...s.presence, [squadId]: [friend] } : s.presence,
        }));
        get().showToast(`${MEMBERS[friend].name} joined your ${t.name}`);
      }, 3000);
    }
    return room;
  },
  toggleMuteSquad: (id) =>
    set((s) => ({
      mutedSquads: s.mutedSquads.includes(id)
        ? s.mutedSquads.filter((x) => x !== id)
        : [...s.mutedSquads, id],
    })),
  toggleSquadSparkMuted: (id) =>
    set((s) => ({
      sparkMutedFor: s.sparkMutedFor.includes(id)
        ? s.sparkMutedFor.filter((x) => x !== id)
        : [...s.sparkMutedFor, id],
    })),
  addSquadSpark: (id) =>
    set((s) => ({ squadSpark: { ...s.squadSpark, [id]: { by: 'you' as const, unanswered: 1 } } })),
  removeSquadSpark: (id) =>
    set((s) => {
      const next = { ...s.squadSpark };
      delete next[id];
      return { squadSpark: next };
    }),
  pauseSquadSpark: (id) =>
    set((s) => ({
      squadSpark: {
        ...s.squadSpark,
        [id]: { by: s.squadSpark[id]?.by ?? 'nia', unanswered: SPARK_PAUSE_AFTER },
      },
    })),

  wakeSquad: (id, text) => {
    const thread = `squad-${id}` as const;
    get().sendMessage(thread, text);
    // Someone answered: Spark's count starts over (and a paused Spark asks again later).
    set((s) =>
      s.squadSpark[id]
        ? { squadSpark: { ...s.squadSpark, [id]: { by: 'you', unanswered: 0 } } }
        : {},
    );
    const { back } = wakeCopy(id);
    get().showToast(
      `${joinNames(ALL_SQUADS.find((q) => q.id === id)?.members.filter((m) => m !== 'you') ?? [])} got a ping`,
    );
    // The friend who answers is back in the squad: it moves to "Live now".
    setTimeout(() => {
      set((s) => ({ presence: { ...s.presence, [id]: [back] } }));
    }, REPLY_DELAY_MS);
  },

  sendSticker: (thread, label, tone) => {
    const sticker: ChatMessage = { id: newId(), author: 'you', text: label, sticker: tone };
    set((s) => ({
      threads: { ...s.threads, [thread]: [...(s.threads[thread] ?? []), sticker] },
    }));
  },

  demoJoinSquad: (id) => {
    const squad = get().createdSquads.find((q) => q.id === id);
    if (!squad || squad.joined) return;
    set((s) => ({
      createdSquads: s.createdSquads.map((q) => (q.id === id ? { ...q, joined: true } : q)),
    }));
    get().showToast(`Ava, Priya and Theo joined ${squad.name}`);
  },
  createSquad: (name, purpose) => {
    const id = newId();
    set((s) => ({ createdSquads: [...s.createdSquads, { id, name, purpose }] }));
    return id;
  },

  postMoment: (caption, tones) =>
    set((s) => ({ myMoments: [{ id: newId(), caption, tones }, ...s.myMoments] })),

  resetDemo: () =>
    set({
      ...INITIAL,
      threads: { ...INITIAL.threads },
      typing: { ...INITIAL.typing },
      createdSquads: [],
      myMoments: [],
      squadSpark: { ...SPARK_START },
      sparkPing: null,
      sparkPingDone: false,
      mutedSquads: [],
      sparkMutedFor: [],
      startedRooms: [],
    }),
}));

export const selectIsMinor = (s: AppState) => ageOn(s.birthday, new Date()) < 18;
export const selectIsUnder13 = (s: AppState) => ageOn(s.birthday, new Date()) < 13;
