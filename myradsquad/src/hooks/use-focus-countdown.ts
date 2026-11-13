import { useEffect, useState } from 'react';

/** The squad's focus session: 25 minutes, already 6:18 in when the app opens. */
export const FOCUS_TOTAL_S = 25 * 60;
const SESSION_ENDS_AT = Date.now() + (18 * 60 + 42) * 1000;

const secondsLeft = () => Math.max(0, Math.round((SESSION_ENDS_AT - Date.now()) / 1000));

/** Seconds left in the shared focus session (the Study card and the Focus screen agree). */
export function useFocusCountdown(): number {
  const [left, setLeft] = useState(secondsLeft);
  useEffect(() => {
    const id = setInterval(() => setLeft(secondsLeft()), 1000);
    return () => clearInterval(id);
  }, []);
  return left;
}

export function formatClock(seconds: number): string {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}
