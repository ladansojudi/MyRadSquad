import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { LayoutAnimationConfig, withTiming } from 'react-native-reanimated';

import { NavHeader } from '@/components/nav-header';
import { SegmentedControl } from '@/components/segmented-control';
import { SparkMark } from '@/components/art/spark-mark';
import { SquadEmblem } from '@/components/art/squad-emblem';
import { Composer } from '@/components/composer';
import { KeyboardScreen } from '@/components/keyboard-screen';
import { Wireframe } from '@/components/wireframe';
import { useAppStore } from '@/lib/app-store';
import { MEMBERS, SPARK_QUESTION, SQUAD_NAME, type SparkAnswer } from '@/lib/mock-data';
import { TIMING_OUT } from '@/lib/motion';
import { cn } from '@/lib/utils';

/** An answer card lands from 94% scale (never from 0) when its text arrives or changes. */
const cardIn = () => {
  'worklet';
  const config = { duration: 260, easing: TIMING_OUT };
  return {
    initialValues: { opacity: 0, transform: [{ scale: 0.94 }] },
    animations: { opacity: withTiming(1, config), transform: [{ scale: withTiming(1, config) }] },
  };
};

const CARD_STYLE: Record<string, { bg: string; text: string }> = {
  leo: { bg: 'bg-surface', text: 'text-content' },
  you: { bg: 'bg-accent', text: 'text-accent-content' },
  jordan: { bg: 'bg-teal', text: 'text-teal-content' },
  maya: { bg: 'bg-cobalt', text: 'text-cobalt-content' },
};

function AnswerCard({ answer }: { answer: SparkAnswer }) {
  const name = MEMBERS[answer.author].name.toUpperCase();

  if (!answer.text) {
    return (
      <Animated.View
        entering={cardIn}
        className="h-[108px] items-center justify-center gap-1 rounded-[20px] bg-surface/50"
      >
        <Text className="font-heavy text-overline tracking-widest text-muted">{name}</Text>
        <Text className="font-text text-body text-muted">still thinking…</Text>
      </Animated.View>
    );
  }

  const style = CARD_STYLE[answer.author] ?? CARD_STYLE.maya;
  return (
    <Animated.View
      entering={cardIn}
      className={cn('h-[108px] gap-1 rounded-[20px] px-3 py-3', style.bg)}
    >
      <Text className={cn('font-heavy text-overline tracking-widest opacity-80', style.text)}>
        {name}
      </Text>
      <Text className={cn('font-heavy text-body', style.text)}>{answer.text}</Text>
    </Animated.View>
  );
}

/** Today's Spark: everyone's answers as a 2×2 board. */
function SparkTodayViewContent() {
  const answers = useAppStore((s) => s.sparkAnswers);
  const answerSpark = useAppStore((s) => s.answerSpark);
  const muted = useAppStore((s) => s.sparkMuted);
  const addedBy = useAppStore((s) => s.sparkAddedBy);
  const toggleMuted = useAppStore((s) => s.toggleSparkMuted);
  const count = answers.filter((a) => a.text).length;

  return (
    <KeyboardScreen className="flex-1 bg-canvas">
      <NavHeader title={SQUAD_NAME} mark={<SquadEmblem id="lunch" size={28} />} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-4 px-4 pb-6 pt-2"
      >
        <SegmentedControl
          segments={[
            { value: 'chat', label: 'Chat' },
            { value: 'today', label: `Today's Spark · ${count}` },
          ]}
          value="today"
          onChange={(v) => v === 'chat' && router.replace('/spark/thread')}
        />

        <View className="gap-3 rounded-[26px] bg-cobalt px-5 py-4">
          <View className="flex-row items-center gap-2">
            <View className="size-8 items-center justify-center rounded-full bg-surface">
              <SparkMark size={14} variant="solid" alive />
            </View>
            <Text className="flex-1 font-heavy text-caption tracking-wide text-cobalt-content">
              SPARK · AI · ADDED BY {addedBy === 'you' ? 'YOU' : 'MAYA'}
            </Text>
            <Pressable hitSlop={8} onPress={toggleMuted}>
              <Text className="font-heavy text-caption text-cobalt-content underline">
                {muted ? 'Unmute' : 'Mute'}
              </Text>
            </Pressable>
          </View>
          <Text className="font-display text-headline text-cobalt-content">{SPARK_QUESTION}</Text>
        </View>

        <LayoutAnimationConfig skipEntering>
          <View className="gap-3">
            <View className="flex-row gap-3">
              <View className="flex-1">
                <AnswerCard key={`0-${answers[0].text}`} answer={answers[0]} />
              </View>
              <View className="flex-1">
                <AnswerCard key={`1-${answers[1].text}`} answer={answers[1]} />
              </View>
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <AnswerCard key={`2-${answers[2].text}`} answer={answers[2]} />
              </View>
              <View className="flex-1">
                <AnswerCard key={`3-${answers[3].text}`} answer={answers[3]} />
              </View>
            </View>
          </View>
        </LayoutAnimationConfig>
      </ScrollView>
      <Composer placeholder="Add your answer" field="outlined" className="" onSend={answerSpark} />
    </KeyboardScreen>
  );
}

/** Outside the six solutions: shown as a wireframe. */
export function SparkTodayView() {
  return (
    <Wireframe>
      <SparkTodayViewContent />
    </Wireframe>
  );
}
