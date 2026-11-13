import { useMemo } from 'react';

import { useAppStore } from '@/lib/app-store';
import { ROOMS, type Room } from '@/lib/mock-data';
import { squadRooms, type LiveRoom } from '@/lib/rooms';
import type { LiveSquad } from '@/lib/squads';

/** Every room: the mock ones plus the ones you started. */
export function useAllRooms(): Room[] {
  const started = useAppStore((s) => s.startedRooms);
  return useMemo(() => [...ROOMS, ...started], [started]);
}

/** A squad's open rooms right now. */
export function useSquadRooms(squad: Pick<LiveSquad, 'id' | 'here'>): LiveRoom[] {
  const all = useAllRooms();
  return useMemo(() => squadRooms(squad, all), [squad, all]);
}
