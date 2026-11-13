import { useAppStore } from '@/lib/app-store';

/**
 * Spark in one squad, the same shape for every squad. Lunch Table Legends keeps its
 * original state (sparkAdded / sparkMuted); other squads use squadSpark / sparkMutedFor.
 */
export function useSquadSpark(id: string) {
  const lunch = id === 'lunch';
  const lunchOn = useAppStore((s) => s.sparkAdded);
  const lunchMuted = useAppStore((s) => s.sparkMuted);
  const addedBy = useAppStore((s) => s.sparkAddedBy);
  const other = useAppStore((s) => s.squadSpark[id]);
  const otherOn = Boolean(other);
  const otherMuted = useAppStore((s) => s.sparkMutedFor.includes(id));
  const toggleLunch = useAppStore((s) => s.toggleSparkMuted);
  const toggleOther = useAppStore((s) => s.toggleSquadSparkMuted);
  const removeLunch = useAppStore((s) => s.removeSpark);
  const removeOther = useAppStore((s) => s.removeSquadSpark);

  return {
    on: lunch ? lunchOn : otherOn,
    muted: lunch ? lunchMuted : otherMuted,
    addedBy: lunch ? addedBy : (other?.by ?? 'you'),
    toggleMuted: () => (lunch ? toggleLunch() : toggleOther(id)),
    remove: () => (lunch ? removeLunch() : removeOther(id)),
  };
}
