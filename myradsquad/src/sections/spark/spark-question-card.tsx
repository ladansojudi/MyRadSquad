import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { SparkMark } from '@/components/art/spark-mark';
import { useAppStore } from '@/lib/app-store';
import { SPARK_QUESTION } from '@/lib/mock-data';
import { TIMING_OUT } from '@/lib/motion';
import { SparkMutedNote } from '@/sections/spark/spark-muted-note';
import { ReactionRow } from '@/sections/squad/squad-messages';

/** Spark's question inside the chat thread: cobalt strip + white body (or a quiet line when muted). */
export function SparkQuestionCard() {
  const muted = useAppStore((s) => s.sparkMuted);
  const addedBy = useAppStore((s) => s.sparkAddedBy);
  const toggleMuted = useAppStore((s) => s.toggleSparkMuted);

  if (muted) return <SparkMutedNote />;

  return (
    <Animated.View
      entering={FadeIn.duration(200).easing(TIMING_OUT)}
      className="overflow-hidden rounded-[22px] bg-surface"
    >
      <View className="flex-row items-center gap-2 bg-cobalt px-3 py-2">
        <View className="size-7 items-center justify-center rounded-full bg-surface">
          <SparkMark size={13} variant="solid" alive />
        </View>
        <Text className="flex-1 font-heavy text-caption text-cobalt-content">
          Spark · AI · added by {addedBy === 'you' ? 'you' : 'Maya'}
        </Text>
        <Pressable hitSlop={8} onPress={toggleMuted}>
          <Text className="font-heavy text-caption text-cobalt-content underline">Mute</Text>
        </Pressable>
      </View>
      <View className="gap-3 px-4 py-4">
        <Text className="font-display text-subtitle text-content">{SPARK_QUESTION}</Text>
        <ReactionRow
          id="spark-question"
          size="md"
          reactions={[
            { label: '+1', count: 3 },
            { label: 'lol', count: 2 },
          ]}
        />
      </View>
    </Animated.View>
  );
}
