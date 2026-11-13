/** "5h 56m left" until midnight (the daily question and streaks reset then). */
export function leftToday(now: Date): string {
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  const mins = Math.max(0, Math.round((end.getTime() - now.getTime()) / 60000));
  const h = Math.floor(mins / 60);
  return h ? `${h}h ${mins % 60}m left` : `${mins}m left`;
}
