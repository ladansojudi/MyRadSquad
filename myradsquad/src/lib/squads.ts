import type { RingSeat } from '@/components/art/table-ring';
import type { ThreadId } from '@/lib/app-store';
import { MEMBERS, type MemberId, type SquadActivity, type SquadInfo } from '@/lib/mock-data';

/** A squad with its presence resolved for right now. */
export type LiveSquad = SquadInfo & { live: boolean; friendsHere: MemberId[] };

/**
 * Orders squads for Home: most friends here right now first (the "Live now" squad), then
 * by how recently they talked. Presence overrides come from the store (live changes).
 */
export function rankSquads(squads: SquadInfo[], presence: Record<string, MemberId[]>): LiveSquad[] {
  return squads
    .map((s) => {
      const here = presence[s.id] ?? s.here;
      const friendsHere = here.filter((id) => id !== 'you');
      return { ...s, here, friendsHere, live: friendsHere.length > 0 };
    })
    .sort((a, b) => b.friendsHere.length - a.friendsHere.length || a.minutesAgo - b.minutesAgo);
}

export function joinNames(ids: MemberId[]): string {
  return ids.map((id) => MEMBERS[id].name).join(', ');
}

/** "Jordan, Leo · music on" — only people here right now; null hides the activity. */
export function activityLine(activity: SquadActivity, here: MemberId[]): string | null {
  if (!activity.people) return activity.detail;
  const present = activity.people.filter((id) => here.includes(id));
  return present.length ? `${joinNames(present)} · ${activity.detail}` : null;
}

/** Seats around the table: present friends (and you) sit, absent ones leave an empty seat. */
export function ringSeats(squad: LiveSquad): RingSeat[] {
  const step = 360 / squad.members.length;
  return squad.members.map((id, i) => {
    const angle = Math.round(-95 + step * i);
    const present = id === 'you' || squad.here.includes(id);
    return present ? { angle, member: MEMBERS[id] } : { angle, round: i % 2 === 1 };
  });
}

/** Lunch Table Legends keeps its original chat thread; other squads get `squad-<id>`. */
export function squadThread(id: string): ThreadId {
  return id === 'lunch' ? 'squad' : `squad-${id}`;
}

/** The squad's conversation for the talking emblem: history, then what you sent. */
export function talkLines(
  squad: Pick<SquadInfo, 'messages'>,
  sent: { author: MemberId; text: string; sticker?: string }[],
): { author: MemberId; text: string }[] {
  return [
    ...squad.messages,
    ...sent.map((m) => ({
      author: m.author,
      text: m.sticker ? `sent a ${m.text} sticker` : m.text,
    })),
  ];
}

const DEMO_TALK: Record<string, { author: MemberId; text: string }[]> = {
  hangout: [
    { author: 'ava', text: 'omg we have a squad 🎉' },
    { author: 'priya', text: "who's free friday?" },
    { author: 'theo', text: 'me!!' },
  ],
  study: [
    { author: 'priya', text: 'bio test friday, who is studying?' },
    { author: 'ava', text: "me, I'll share my notes" },
    { author: 'theo', text: 'focus session at 7?' },
  ],
  moments: [
    { author: 'ava', text: 'first moment incoming 📸' },
    { author: 'theo', text: 'lol' },
    { author: 'priya', text: 'this is going to be chaos' },
  ],
};

/**
 * A squad you made, once the (demo) friends you invited have joined: Ava, Priya and Theo,
 * two of them here right now, chatting about what the squad is for.
 */
export function createdToSquad(c: { id: string; name: string; purpose: string }): SquadInfo {
  return {
    id: c.id,
    name: c.name,
    members: ['ava', 'priya', 'theo', 'you'],
    here: ['ava', 'priya'],
    lastActive: 'now',
    minutesAgo: 0,
    unread: 3,
    activities: [],
    messages: DEMO_TALK[c.purpose] ?? DEMO_TALK.hangout,
    replies: { from: 'ava', lines: ['yesss', 'omw', 'lol same'] },
  };
}
