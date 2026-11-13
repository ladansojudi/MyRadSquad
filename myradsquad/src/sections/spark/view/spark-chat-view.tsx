import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, LayoutAnimationConfig } from 'react-native-reanimated';

import { NavHeader } from '@/components/nav-header';
import { SparkMark } from '@/components/art/spark-mark';
import { SquadEmblem } from '@/components/art/squad-emblem';
import { Sticker } from '@/components/art/sticker';
import { Composer } from '@/components/composer';
import { KeyboardScreen } from '@/components/keyboard-screen';
import { PressableScale } from '@/components/ui';
import { useChatScroll } from '@/hooks/use-chat-scroll';
import { useAppStore } from '@/lib/app-store';
import { MEMBERS, SPARK_QUESTION, SQUAD_NAME } from '@/lib/mock-data';
import { TIMING_OUT } from '@/lib/motion';
import { SparkMutedNote } from '@/sections/spark/spark-muted-note';
import {
  IncomingMessage,
  OutgoingMessage,
  ReactionRow,
  ThreadMessages,
} from '@/sections/squad/squad-messages';

/** Chat on the yellow table, right after Spark joined. */
export function SparkChatView() {
  const chatScroll = useChatScroll();
  const muted = useAppStore((s) => s.sparkMuted);
  const addedBy = useAppStore((s) => s.sparkAddedBy);
  const toggleMuted = useAppStore((s) => s.toggleSparkMuted);
  const sendMessage = useAppStore((s) => s.sendMessage);

  return (
    <KeyboardScreen className="flex-1 bg-canvas">
      <NavHeader
        title={SQUAD_NAME}
        mark={<SquadEmblem id="lunch" size={28} />}
        right={
          <Pressable
            accessibilityLabel="Spark table"
            hitSlop={8}
            className="px-1"
            onPress={() => router.push('/spark/table')}
          >
            <SparkMark size={22} />
          </Pressable>
        }
      />

      <ScrollView
        {...chatScroll}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-4 pb-6 pt-4"
      >
        <LayoutAnimationConfig skipEntering>
          <IncomingMessage member={MEMBERS.jordan} named={false} text="ok who has the bio notes" />
          <Text className="text-center font-text text-caption text-muted">· 3 hours quiet ·</Text>

          <View className="items-center gap-1 rounded-[20px] bg-surface/70 px-4 py-3">
            <Text className="font-heavy text-body text-content">
              {addedBy === 'you' ? 'You added Spark' : 'Maya added Spark'}
            </Text>
            <Text className="font-text text-body text-content">
              Spark is an AI. It reads only this chat.
            </Text>
            <View className="mt-1 flex-row gap-6">
              <Pressable hitSlop={8} onPress={() => router.push('/spark/add')}>
                <Text className="font-heavy text-caption text-content underline">
                  What it can see
                </Text>
              </Pressable>
              <Pressable hitSlop={8} onPress={toggleMuted}>
                <Text className="font-heavy text-caption text-content underline">
                  {muted ? 'Unmute' : 'Mute'}
                </Text>
              </Pressable>
            </View>
          </View>

          {muted ? (
            <SparkMutedNote />
          ) : (
            <Animated.View
              entering={FadeIn.duration(200).easing(TIMING_OUT)}
              className="flex-row gap-3"
            >
              <View className="pt-1">
                <SparkMark size={22} alive />
              </View>
              <View className="flex-1 gap-2">
                <Text className="font-heavy text-overline tracking-widest text-content">
                  SPARK · AI
                </Text>
                <PressableScale
                  accessibilityHint="Opens today's Spark answers"
                  onPress={() => router.push('/spark/today')}
                  className="rounded-[18px] bg-cobalt px-4 py-3"
                >
                  <Text className="font-heavy text-body text-cobalt-content">
                    Hot take round: {SPARK_QUESTION.replace('Best', 'best')}
                  </Text>
                </PressableScale>
                <ReactionRow
                  id="spark-chat-question"
                  reactions={[
                    { label: '+1', count: 3 },
                    { label: 'lol', count: 2 },
                    { label: 'no', count: 1 },
                  ]}
                />
              </View>
            </Animated.View>
          )}

          <IncomingMessage member={MEMBERS.leo} named={false} text="a single grape" />
          <OutgoingMessage text="cold pizza from tuesday" tone="coral" />
          <View className="self-end">
            <Sticker label="LOL" tone="cobalt" size="md" rotate={0} />
          </View>
          <ThreadMessages thread="spark" />
        </LayoutAnimationConfig>
      </ScrollView>

      <Composer
        placeholder="Message"
        field="outlined"
        className=""
        onSend={(text) => sendMessage('spark', text)}
      />
    </KeyboardScreen>
  );
}
