import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { LayoutAnimationConfig } from 'react-native-reanimated';

import { NavHeader } from '@/components/nav-header';
import { SparkMark } from '@/components/art/spark-mark';
import { SquadEmblem } from '@/components/art/squad-emblem';
import { Composer } from '@/components/composer';
import { KeyboardScreen } from '@/components/keyboard-screen';
import { Chip } from '@/components/ui';
import { Wireframe } from '@/components/wireframe';
import { useChatScroll } from '@/hooks/use-chat-scroll';
import { useAppStore } from '@/lib/app-store';
import { MEMBERS, SQUAD_NAME } from '@/lib/mock-data';
import { SparkQuestionCard } from '@/sections/spark/spark-question-card';
import { IncomingMessage, OutgoingMessage, ThreadMessages } from '@/sections/squad/squad-messages';

/** Regular chat where Spark's question sits inline as a card. */
function SparkThreadViewContent() {
  const chatScroll = useChatScroll();
  const sendMessage = useAppStore((s) => s.sendMessage);

  return (
    <KeyboardScreen className="flex-1 bg-surface">
      <NavHeader
        title={SQUAD_NAME}
        subtitle="Maya, Jordan, Leo here"
        mark={<SquadEmblem id="lunch" size={28} />}
        background="surface"
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
        contentContainerClassName="gap-4 px-4 pb-6 pt-4"
      >
        <LayoutAnimationConfig skipEntering>
          <IncomingMessage member={MEMBERS.jordan} bubble="cream" text="ok who has the bio notes" />
          <View className="flex-row items-center gap-3">
            <View className="h-0.5 flex-1 bg-cream" />
            <Text className="font-text text-caption text-muted">3 hours quiet</Text>
            <View className="h-0.5 flex-1 bg-cream" />
          </View>
          <SparkQuestionCard />
          <IncomingMessage member={MEMBERS.leo} tone="coral" bubble="cream" text="a single grape" />
          <OutgoingMessage text="cold pizza from tuesday" />
          <ThreadMessages thread="thread" bubble="cream" />
        </LayoutAnimationConfig>
      </ScrollView>

      <View className="flex-row gap-3 px-4 pb-3">
        <Chip
          label="Answer Spark"
          tone="mustard"
          size="sm"
          className="h-10"
          onPress={() => router.push('/spark/today')}
        />
        <Chip
          label="Send a sticker"
          size="sm"
          className="h-10"
          onPress={() => router.push({ pathname: '/stickers', params: { thread: 'thread' } })}
        />
      </View>
      <Composer placeholder="Message" onSend={(text) => sendMessage('thread', text)} />
    </KeyboardScreen>
  );
}

/** Outside the six solutions: shown as a wireframe. */
export function SparkThreadView() {
  return (
    <Wireframe>
      <SparkThreadViewContent />
    </Wireframe>
  );
}
