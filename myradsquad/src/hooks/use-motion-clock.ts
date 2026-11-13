import { useEffect } from 'react';
import {
  Easing,
  cancelAnimation,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

/**
 * A looping clock from 0 to `period` ms. Frozen at 0 when `live` is false
 * (reduced motion, off screen, hidden): frame 0 must be a good drawing.
 */
export function useLoopClock(period: number, live: boolean): SharedValue<number> {
  const clock = useSharedValue(0);
  useEffect(() => {
    cancelAnimation(clock);
    // withRepeat restarts from the CURRENT value: always reset first.
    clock.value = 0;
    if (!live) return;
    clock.value = withRepeat(withTiming(period, { duration: period, easing: Easing.linear }), -1);
    return () => cancelAnimation(clock);
  }, [live, period, clock]);
  return clock;
}

/**
 * A clock that plays ONCE from 0 to `duration` ms when `play` turns true, and
 * holds at the end (a scene that tells an action, a chart drawing itself on).
 * With reduced motion it jumps straight to the end: the final frame is the one
 * that carries meaning, so it must read on its own.
 */
export function useOneShotClock(
  duration: number,
  play: boolean,
  reduced: boolean,
): SharedValue<number> {
  const clock = useSharedValue(reduced ? duration : 0);
  useEffect(() => {
    cancelAnimation(clock);
    if (!play) {
      clock.value = 0;
      return;
    }
    if (reduced) {
      clock.value = duration;
      return;
    }
    clock.value = 0;
    clock.value = withTiming(duration, { duration, easing: Easing.linear });
    return () => cancelAnimation(clock);
  }, [play, reduced, duration, clock]);
  return clock;
}
