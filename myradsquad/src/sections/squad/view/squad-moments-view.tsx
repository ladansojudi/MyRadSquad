import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, LayoutAnimationConfig } from 'react-native-reanimated';

import { SeatTile } from '@/components/art/seat-tile';
import { Composer } from '@/components/composer';
import { Icon } from '@/components/icon';
import { KeyboardScreen } from '@/components/keyboard-screen';
import { PressableScale } from '@/components/ui';
import { PhotoImage, Wireframe } from '@/components/wireframe';
import { useChatScroll } from '@/hooks/use-chat-scroll';
import { useAppStore } from '@/lib/app-store';
import { MEMBERS, MOMENTS, MORE_REACTIONS, type MomentTone } from '@/lib/mock-data';
import { TIMING_OUT } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { SquadHeader } from '@/sections/squad/squad-header';
import { ReactionRow, ThreadMessages } from '@/sections/squad/squad-messages';
import { SquadMomentPhoto } from '@/sections/squad/squad-moment-photo';

const TILE_BG: Record<MomentTone, string> = {
  cobalt: 'bg-cobalt',
  teal: 'bg-teal',
  coral: 'bg-accent',
  canvas: 'bg-canvas',
};

function SquadMomentsViewContent({ initialId }: { initialId?: string }) {
  const chatScroll = useChatScroll();
  const [currentId, setCurrentId] = useState(
    MOMENTS.find((m) => m.id === initialId)?.id ?? MOMENTS[0].id,
  );
  const [moreOpen, setMoreOpen] = useState(false);
  const setReaction = useAppStore((s) => s.setReaction);
  const sendMessage = useAppStore((s) => s.sendMessage);

  const moment = MOMENTS.find((m) => m.id === currentId) ?? MOMENTS[0];
  const author = MEMBERS[moment.author];
  const others = MOMENTS.filter((m) => m.id !== moment.id);
  const reactions = moreOpen
    ? [...moment.reactions, ...MORE_REACTIONS.map((label) => ({ label }))]
    : moment.reactions;

  return (
    <KeyboardScreen className="flex-1 bg-canvas">
      <SquadHeader title="Squad moments" subtitle="Only Lunch Table Legends sees these" />
      <View className="flex-1 rounded-t-[32px] bg-surface">
        <ScrollView
          {...chatScroll}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-4 px-4 pb-6 pt-4"
        >
          <LayoutAnimationConfig skipEntering>
            <View className="flex-row items-center gap-3">
              <SeatTile
                letter={author.letter}
                tone={author.tone === 'surface' ? 'ink' : author.tone}
                shape="leaf"
                size={32}
                dot={false}
              />
              <Text className="flex-1 font-heavy text-body text-content">
                {author.name} · {moment.ago}
              </Text>
              <Text className="font-text text-caption text-muted">gone in 24h</Text>
            </View>

            <SquadMomentPhoto
              moment={moment}
              onDoubleTap={() => setReaction(`moment-${moment.id}`, 'lol')}
            />

            <View className="flex-row flex-wrap items-center gap-2">
              <ReactionRow
                key={moment.id}
                id={`moment-${moment.id}`}
                size="md"
                initial={moment.mine}
                reactions={reactions}
              />
              {moreOpen ? null : (
                <PressableScale
                  accessibilityLabel="More reactions"
                  onPress={() => setMoreOpen(true)}
                  className="size-12 items-center justify-center rounded-full bg-surface"
                >
                  <Icon name="plus" size={20} />
                </PressableScale>
              )}
            </View>

            <View className="flex-row items-center gap-3">
              <View className="flex-row">
                <View className="size-6 rounded-full bg-teal" />
                <View className="-ml-2 size-6 rounded-full bg-content" />
                <View className="-ml-2 size-6 rounded-full bg-cobalt" />
              </View>
              <Text className="font-text text-body text-muted">Seen by Jordan, Leo, Ava</Text>
            </View>

            <ThreadMessages thread="moments" bubble="cream" />

            <Text className="font-heavy text-body text-content">Earlier today</Text>
            <View className="flex-row gap-3">
              {others.map((m) => (
                <PressableScale
                  key={m.id}
                  accessibilityLabel={`Open ${MEMBERS[m.author].name}'s moment`}
                  onPress={() => {
                    setCurrentId(m.id);
                    setMoreOpen(false);
                  }}
                  className={cn('h-28 flex-1 rounded-[18px]', TILE_BG[m.tones[0]])}
                >
                  <Animated.View
                    key={m.id}
                    entering={FadeIn.duration(200).easing(TIMING_OUT)}
                    className="flex-1 overflow-hidden rounded-[18px]"
                  >
                    {m.photo ? (
                      <PhotoImage source={m.photo} contentFit="cover" style={{ flex: 1 }} />
                    ) : null}
                  </Animated.View>
                </PressableScale>
              ))}
              <PressableScale
                onPress={() => router.push('/add-moment')}
                className="h-28 flex-1 items-center justify-center rounded-[18px] bg-cream"
              >
                <Text className="font-text text-caption text-content">+ yours</Text>
              </PressableScale>
            </View>
          </LayoutAnimationConfig>
        </ScrollView>
        <Composer
          placeholder={`Reply to ${author.name}'s moment`}
          action="camera"
          onCamera={() => router.push('/add-moment')}
          onSend={(text) => sendMessage('moments', text)}
        />
      </View>
    </KeyboardScreen>
  );
}

/** Outside the six solutions: shown as a wireframe. */
export function SquadMomentsView(props: { initialId?: string }) {
  return (
    <Wireframe>
      <SquadMomentsViewContent {...props} />
    </Wireframe>
  );
}
