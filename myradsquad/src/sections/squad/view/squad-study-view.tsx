import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { LayoutAnimationConfig } from 'react-native-reanimated';

import { Composer } from '@/components/composer';
import { KeyboardScreen } from '@/components/keyboard-screen';
import { PressableScale } from '@/components/ui';
import { Wireframe } from '@/components/wireframe';
import { useChatScroll } from '@/hooks/use-chat-scroll';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { useAppStore } from '@/lib/app-store';
import { MEMBERS, SHARED_NOTES } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { SquadFocusTimer } from '@/sections/squad/squad-focus-timer';
import { SquadHeader } from '@/sections/squad/squad-header';
import { IncomingMessage, OutgoingMessage, ThreadMessages } from '@/sections/squad/squad-messages';

function SquadStudyViewContent() {
  const lip = useHardShadow(4);
  const tealLip = useHardShadow(4, 'teal');
  const chatScroll = useChatScroll();
  const sendMessage = useAppStore((s) => s.sendMessage);

  return (
    <KeyboardScreen className="flex-1 bg-canvas">
      <SquadHeader title="Notes & study" subtitle="Lunch Table Legends">
        <View className="flex-row gap-3">
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Focus session, Jordan and Leo focusing. Join"
            onPress={() => router.push('/focus')}
            className="flex-1 rounded-[22px] bg-teal px-4 py-3"
            style={tealLip}
          >
            <Text className="font-heavy text-overline tracking-widest text-teal-content/85">
              FOCUS
            </Text>
            <SquadFocusTimer />
            <View className="flex-row items-center justify-between">
              <Text className="font-text text-caption text-teal-content">Jordan, Leo</Text>
              <View className="rounded-full bg-surface px-3 py-1">
                <Text className="font-heavy text-caption text-content">Join</Text>
              </View>
            </View>
          </PressableScale>
          <View className="flex-1 rounded-[22px] bg-surface px-4 py-3" style={lip}>
            <Text className="font-heavy text-overline tracking-widest text-muted">BIO EXAM</Text>
            <Text className="font-display text-[36px] leading-[42px] text-content">3 days</Text>
            <Text className="font-text text-caption text-muted">Friday · 9:00</Text>
          </View>
        </View>
      </SquadHeader>

      <View className="flex-1 rounded-t-[32px] bg-surface">
        <ScrollView
          {...chatScroll}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-4 px-4 pb-6 pt-5"
        >
          <LayoutAnimationConfig skipEntering>
            <View className="flex-row items-center justify-between">
              <Text className="font-heavy text-body text-content">Shared notes</Text>
              <PressableScale hitSlop={8} onPress={() => router.push('/notes')}>
                <Text className="font-heavy text-body text-primary">
                  See all {SHARED_NOTES.length}
                </Text>
              </PressableScale>
            </View>
            <View className="flex-row gap-3">
              {SHARED_NOTES.slice(0, 2).map((note) => (
                <PressableScale
                  key={note.id}
                  onPress={() => router.push({ pathname: '/notes/[id]', params: { id: note.id } })}
                  className="flex-1 gap-2 rounded-[20px] bg-cream px-3 py-3"
                >
                  <View
                    className={cn(
                      'size-8',
                      note.tone === 'coral' ? 'rounded-lg bg-accent' : 'rounded-full bg-cobalt',
                    )}
                  />
                  <Text className="font-heavy text-body text-content">{note.title}</Text>
                  <Text className="font-text text-caption text-muted">{note.meta}</Text>
                </PressableScale>
              ))}
            </View>
            <IncomingMessage member={MEMBERS.jordan} text="quiz me on mitosis in 10?" />
            <OutgoingMessage text="bet, after this session" />
            <ThreadMessages thread="study" />
          </LayoutAnimationConfig>
        </ScrollView>
        <Composer
          placeholder="Ask the squad a question"
          leading="file"
          onLeadingPress={() => router.push('/notes')}
          onSend={(text) => sendMessage('study', text)}
        />
      </View>
    </KeyboardScreen>
  );
}

/** Outside the six solutions: shown as a wireframe. */
export function SquadStudyView() {
  return (
    <Wireframe>
      <SquadStudyViewContent />
    </Wireframe>
  );
}
