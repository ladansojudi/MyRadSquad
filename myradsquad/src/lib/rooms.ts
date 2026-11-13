import { ROOMS, type MemberId, type Room, type RoomVibe } from './mock-data';
import type { LiveSquad } from './squads';

/** An open room with who is inside it right now. */
export type LiveRoom = Room & { inside: MemberId[]; live: boolean };

/**
 * A squad's open rooms, busiest first. A room is open while someone is in it (you count,
 * so a room you just started shows); when it empties it is gone, nothing piles up.
 */
export function squadRooms(
  squad: Pick<LiveSquad, 'id' | 'here'>,
  rooms: Room[] = ROOMS,
): LiveRoom[] {
  return rooms
    .filter((r) => r.squadId === squad.id)
    .map((r, order) => {
      const inside = r.people.filter((id) => id === 'you' || squad.here.includes(id));
      return { ...r, inside, live: inside.length > 0, order };
    })
    .filter((r) => r.live)
    .sort((a, b) => b.inside.length - a.inside.length || a.order - b.order)
    .map(({ order: _order, ...room }) => room);
}

export function filterRooms<T extends Room>(rooms: T[], vibe: RoomVibe | 'all'): T[] {
  return vibe === 'all' ? rooms : rooms.filter((r) => r.vibe === vibe);
}

/** "2 open now", the summary under a squad. */
export function roomsSummary(rooms: LiveRoom[]): string {
  return rooms.length ? `${rooms.length} open now` : 'No rooms open';
}

/** "Sam started" / "You started". */
export function startedLine(
  room: Pick<Room, 'startedBy'>,
  names: Record<string, { name: string }>,
) {
  return `${room.startedBy === 'you' ? 'You' : names[room.startedBy].name} started`;
}

export function findRoom(id: string | undefined, rooms: Room[] = ROOMS): Room {
  return rooms.find((r) => r.id === id) ?? rooms[0];
}
