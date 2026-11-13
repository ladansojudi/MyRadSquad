import { MEMBERS, type MemberId, type Room } from './mock-data';
import type { LiveRoom } from './rooms';
import type { LiveSquad } from './squads';

export type MessageHit = { squadId: string; squad: string; author: MemberId; text: string };

export type SearchResults = {
  squads: LiveSquad[];
  rooms: (LiveRoom & { squad: string })[];
  friends: MemberId[];
  messages: MessageHit[];
};

const has = (text: string, q: string) => text.toLowerCase().includes(q);

/**
 * Everything that matches `query` across your squads: squad names, rooms (by name, what's
 * on, or vibe: "fun" / "study"), friends by name, and messages by text.
 */
export function searchAll(
  query: string,
  squads: LiveSquad[],
  rooms: (LiveRoom & { squad: string })[],
): SearchResults {
  const q = query.trim().toLowerCase();
  if (!q) return { squads: [], rooms: [], friends: [], messages: [] };
  const friends = new Set<MemberId>();
  for (const s of squads) for (const m of s.members) if (m !== 'you') friends.add(m);
  return {
    squads: squads.filter((s) => has(s.name, q)),
    rooms: rooms.filter(
      (r: Room) => has(r.name, q) || has(r.detail, q) || has(r.idle, q) || r.vibe === q,
    ),
    friends: [...friends].filter((id) => has(MEMBERS[id].name, q)),
    messages: squads.flatMap((s) =>
      s.messages
        .filter((m) => has(m.text, q))
        .map((m) => ({ squadId: s.id, squad: s.name, author: m.author, text: m.text })),
    ),
  };
}

/** Where a friend is right now: in a live room, in a squad, or away. */
export function whereIs(
  id: MemberId,
  squads: LiveSquad[],
  rooms: (LiveRoom & { squad: string })[],
): { live: boolean; line: string; room?: LiveRoom } {
  const room = rooms.find((r) => r.inside.includes(id));
  if (room) return { live: true, line: `In ${room.name} · ${room.squad}`, room };
  const squad = squads.find((s) => s.friendsHere.includes(id));
  if (squad) return { live: true, line: `Online in ${squad.name}` };
  return { live: false, line: 'Away' };
}
