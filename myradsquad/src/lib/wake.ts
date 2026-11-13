import { SPARK_PAUSE_AFTER, WAKE, type MemberId } from './mock-data';

/** Spark in one squad: who added it (a member with Squad+), and its unanswered questions. */
export type SquadSpark = { by: MemberId; unanswered: number };

/**
 * What a quiet squad's card offers:
 * - `nudge`: no Spark. You wake it with a message (a suggested opener), Spark is offered.
 * - `asked`: Spark left its spark (a question, a vote or a photo task); your answer pings the squad.
 * - `paused`: two sparks in a row and nobody answered, so it stopped until someone writes.
 */
export type WakeMode = 'nudge' | 'asked' | 'paused';

export function wakeMode(spark: SquadSpark | undefined): WakeMode {
  if (!spark) return 'nudge';
  return spark.unanswered >= SPARK_PAUSE_AFTER ? 'paused' : 'asked';
}

export function wakeCopy(id: string) {
  return WAKE[id] ?? WAKE.cousins;
}
