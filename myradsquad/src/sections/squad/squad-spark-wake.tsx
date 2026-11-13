import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { SparkMark } from '@/components/art/spark-mark';
import { SparkDrop } from '@/components/spark-drop';
import { TIMING_OUT } from '@/lib/motion';

/**
 * Spark in a quiet squad's chat: after the quiet, it leaves one spark (a question, a vote or
 * a photo task). Your answer pings the squad, not Spark. Paused after two unanswered tries.
 */
export function SparkWakeQuestion({ squadId, paused }: { squadId: string; paused: boolean }) {
  if (paused) {
    return (
      <View className="flex-row items-center gap-2 rounded-2xl bg-cobalt/25 px-3 py-2.5">
        <SparkMark size={14} />
        <Text className="flex-1 font-text text-caption text-content">
          Spark is taking a break: two tries, no answers. It&apos;s back when someone writes.
        </Text>
      </View>
    );
  }
  return (
    <Animated.View entering={FadeInDown.duration(260).easing(TIMING_OUT)}>
      <SparkDrop squadId={squadId} inChat />
    </Animated.View>
  );
}
