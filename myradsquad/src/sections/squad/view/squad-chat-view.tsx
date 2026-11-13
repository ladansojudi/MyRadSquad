import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { LayoutAnimationConfig } from 'react-native-reanimated';

import { Sticker } from '@/components/art/sticker';
import { Composer } from '@/components/composer';
import { KeyboardScreen } from '@/components/keyboard-screen';
import { Icon } from '@/components/icon';
import { PressableScale } from '@/components/ui';
import { useChatScroll } from '@/hooks/use-chat-scroll';
import { useSquadRooms } from '@/hooks/use-rooms';
import { useSquads } from '@/hooks/use-squads';
import { useAppStore } from '@/lib/app-store';
import { MEMBERS } from '@/lib/mock-data';
import {
  IncomingMessage,
  OutgoingMessage,
  ReactionRow,
  ThreadMessages,
} from '@/sections/squad/squad-messages';
import { SquadHeader } from '@/sections/squad/squad-header';
import { SquadPinnedRooms } from '@/sections/squad/squad-pinned-rooms';
import { SquadRoomLine } from '@/sections/squad/squad-room-line';

export function SquadChatView() {
  const chatScroll = useChatScroll();
  const joinedPlan = useAppStore((s) => s.joinedPlan);
  const toggleJoinedPlan = useAppStore((s) => s.toggleJoinedPlan);
  const sendMessage = useAppStore((s) => s.sendMessage);
  const squad = useSquads().find((q) => q.id === 'lunch')!;
  const rooms = useSquadRooms(squad);

  return (
    <KeyboardScreen className="flex-1 bg-canvas">
      <SquadHeader subtitle="Maya, Jordan, Leo here">
        <SquadPinnedRooms squad={squad} />
      </SquadHeader>

      <View className="flex-1 rounded-t-[32px] bg-surface">
        <ScrollView
          {...chatScroll}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-4 px-4 pb-6 pt-4"
        >
          <LayoutAnimationConfig skipEntering>
            <Text className="text-center font-text text-caption text-muted">Today, 12:40</Text>
            <IncomingMessage
              member={MEMBERS.jordan}
              text="who's down for boba after 6th?"
              footer={
                <ReactionRow
                  id="squad-boba"
                  reactions={[
                    { label: '+1', count: 3 },
                    { label: 'me', count: 2 },
                  ]}
                />
              }
            />
            <IncomingMessage member={MEMBERS.maya}>
              <View className="ml-1 mt-1">
                <Sticker label="I'M IN" tone="coral" size="md" rotate={-8} />
              </View>
            </IncomingMessage>

            <View className="flex-row items-center gap-3 rounded-2xl bg-cream px-3 py-3">
              <View className="size-9 items-center justify-center rounded-xl bg-canvas">
                <Icon name="pin" size={18} />
              </View>
              <Text className="flex-1 font-text text-body text-content">
                <Text className="font-display">Plan:</Text> Boba after 6th · {joinedPlan ? 4 : 3}{' '}
                going
              </Text>
              <PressableScale
                hitSlop={8}
                onPress={toggleJoinedPlan}
                accessibilityRole="button"
                className={joinedPlan ? 'rounded-full bg-content px-3 py-1' : 'px-1 py-1'}
              >
                <Text
                  className={
                    joinedPlan
                      ? 'font-heavy text-caption text-brand-content'
                      : 'font-heavy text-caption text-content'
                  }
                >
                  {joinedPlan ? 'Going' : 'Join'}
                </Text>
              </PressableScale>
            </View>

            <OutgoingMessage text="count me in, I'll grab the table" />
            {rooms.map((r) => (
              <SquadRoomLine key={r.id} room={r} />
            ))}
            <ThreadMessages thread="squad" />
          </LayoutAnimationConfig>
        </ScrollView>
        <Composer
          placeholder="Message the squad"
          leading="plus"
          onLeadingPress={() =>
            router.push({ pathname: '/start-room/[id]', params: { id: 'lunch' } })
          }
          onSend={(text) => sendMessage('squad', text)}
        />
      </View>
    </KeyboardScreen>
  );
}
