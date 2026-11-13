import { useMemo } from 'react';

import { useAppStore } from '@/lib/app-store';
import { ALL_SQUADS } from '@/lib/mock-data';
import { createdToSquad, rankSquads, type LiveSquad } from '@/lib/squads';

/** Your squads (including ones you made that friends joined), most alive first. */
export function useSquads(): LiveSquad[] {
  const presence = useAppStore((s) => s.presence);
  const created = useAppStore((s) => s.createdSquads);
  return useMemo(
    () =>
      rankSquads([...ALL_SQUADS, ...created.filter((c) => c.joined).map(createdToSquad)], presence),
    [presence, created],
  );
}
