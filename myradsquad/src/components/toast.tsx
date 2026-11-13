import { Text } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppStore } from '@/lib/app-store';
import { TIMING_IN, TIMING_OUT } from '@/lib/motion';

/** One short confirmation at the top of the screen; arrives with ease-out, leaves faster. */
export function Toast() {
  const insets = useSafeAreaInsets();
  const toast = useAppStore((s) => s.toast);
  if (!toast) return null;
  return (
    <Animated.View
      key={toast.id}
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      entering={FadeInUp.duration(240).easing(TIMING_OUT)}
      exiting={FadeOutUp.duration(180).easing(TIMING_IN)}
      className="absolute left-4 right-4 items-center"
      style={{ top: insets.top + 8 }}
    >
      <Animated.View className="rounded-full bg-content px-5 py-3">
        <Text className="font-heavy text-caption text-brand-content">{toast.text}</Text>
      </Animated.View>
    </Animated.View>
  );
}
