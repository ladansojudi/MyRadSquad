import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useReducedMotion } from 'react-native-reanimated';

/** Idle motion runs only while the screen is focused and Reduce Motion is off. */
export function useLive(): boolean {
  const reduced = useReducedMotion();
  const [focused, setFocused] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );

  return focused && !reduced;
}
