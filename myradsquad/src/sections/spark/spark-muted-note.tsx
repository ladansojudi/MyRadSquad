import { Pressable, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { SparkMark } from '@/components/art/spark-mark';
import { useAppStore } from '@/lib/app-store';
import { TIMING_OUT } from '@/lib/motion';

/** What's left of Spark's message while it is muted: one quiet line with Unmute. */
export function SparkMutedNote() {
  const toggleMuted = useAppStore((s) => s.toggleSparkMuted);
  return (
    <Animated.View
      entering={FadeIn.duration(200).easing(TIMING_OUT)}
      className="flex-row items-center gap-3 rounded-2xl bg-cream px-4 py-3"
    >
      <SparkMark size={18} />
      <Text className="flex-1 font-text text-body text-muted">Spark is muted for you</Text>
      <Pressable hitSlop={8} onPress={toggleMuted}>
        <Text className="font-heavy text-caption text-content underline">Unmute</Text>
      </Pressable>
    </Animated.View>
  );
}
