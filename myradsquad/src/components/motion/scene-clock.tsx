import { createContext, useContext, type ReactNode } from 'react';
import { useSharedValue, type SharedValue } from 'react-native-reanimated';

import { useLive } from '@/hooks/use-live';
import { useLoopClock } from '@/hooks/use-motion-clock';

/**
 * One loop clock per illustration. Every idle wave in the art uses a period that
 * divides SCENE_PERIOD (1000, 1200, 1500, 2000, 2400, 3000, 4000, 4800, 6000, 8000,
 * 12000, 24000), so the loop seam never jumps.
 */
export const SCENE_PERIOD = 24000;

const SceneClockContext = createContext<SharedValue<number> | null>(null);

/** Provides the scene clock to every animated part inside an illustration. */
export function SceneClock({ children }: { children: ReactNode }) {
  const live = useLive();
  const clock = useLoopClock(SCENE_PERIOD, live);
  return <SceneClockContext.Provider value={clock}>{children}</SceneClockContext.Provider>;
}

/** Wraps a standalone animated part in its own clock unless a scene already provides one. */
export function Alive({ children }: { children: ReactNode }) {
  const clock = useContext(SceneClockContext);
  return clock ? children : <SceneClock>{children}</SceneClock>;
}

/** The surrounding scene clock, or a clock frozen at 0 when the part is used still. */
export function useSceneClock(): SharedValue<number> {
  const still = useSharedValue(0);
  return useContext(SceneClockContext) ?? still;
}
