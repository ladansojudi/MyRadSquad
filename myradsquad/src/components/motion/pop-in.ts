import { withDelay, withTiming } from 'react-native-reanimated';

import { TIMING_OUT } from '@/lib/motion';

/**
 * Entering animation for illustration pieces: arrive from 85% scale, a small turn and
 * transparent, with ease-out, after `delay` ms. Never from scale 0.
 */
export function popIn(delay: number, turn = -8) {
  return () => {
    'worklet';
    const config = { duration: 420, easing: TIMING_OUT };
    return {
      initialValues: { opacity: 0, transform: [{ scale: 0.85 }, { rotate: `${turn}deg` }] },
      animations: {
        opacity: withDelay(delay, withTiming(1, config)),
        transform: [
          { scale: withDelay(delay, withTiming(1, config)) },
          { rotate: withDelay(delay, withTiming('0deg', config)) },
        ],
      },
    };
  };
}
