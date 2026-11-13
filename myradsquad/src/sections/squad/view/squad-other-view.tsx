import { ScrollView, Text, View } from 'react-native';
import { LayoutAnimationConfig } from 'react-native-reanimated';

import { SquadEmblem } from '@/components/art/squad-emblem';
import { Composer } from '@/components/composer';
import { KeyboardScreen } from '@/components/keyboard-screen';
import { router } from 'expo-router';

import { useChatScroll } from '@/hooks/use-chat-scroll';
import { useSquadRooms } from '@/hooks/use-rooms';
import { useAppStore, type ThreadId } from '@/lib/app-store';
import { useSquads } from '@/hooks/use-squads';
import { MEMBERS } from '@/lib/mock-data';
import { joinNames } from '@/lib/squads';
import { wakeMode } from '@/lib/wake';
import { SparkWakeQuestion } from '@/sections/squad/squad-spark-wake';
import { SquadHeader } from '@/sections/squad/squad-header';
import { SquadPinnedRooms } from '@/sections/squad/squad-pinned-rooms';
import { SquadRoomLine } from '@/sections/squad/squad-room-line';
import { IncomingMessage, OutgoingMessage, ThreadMessages } from '@/sections/squad/squad-messages';

/** Chat for squads other than Lunch Table Legends (mock history, live mock replies). */
export function SquadOtherView({ id, draft }: { id: string; draft?: string }) {
  const chatScroll = useChatScroll();
  const sendMessage = useAppStore((s) => s.sendMessage);
  const wakeSquad = useAppStore((s) => s.wakeSquad);
  const spark = useAppStore((s) => s.squadSpark[id]);
  const squads = useSquads();
  const squad = squads.find((sq) => sq.id === id) ?? squads.find((sq) => sq.id !== 'lunch')!;
  const thread: ThreadId = `squad-${squad.id}`;
  const rooms = useSquadRooms(squad);
  const names = squad.members
    .filter((m) => m !== 'you')
    .map((m) => MEMBERS[m].name)
    .join(', ');

  return (
    <KeyboardScreen className="flex-1 bg-canvas">
      <SquadHeader
        squadId={squad.id}
        name={squad.name}
        subtitle={
          squad.live
            ? `${joinNames(squad.friendsHere)} here now`
            : `${names} · active ${squad.lastActive}`
        }
        mark={<SquadEmblem id={squad.id} size={28} />}
      >
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
            <Text className="text-center font-text text-caption text-muted">{names} and you</Text>
            {squad.messages.map((m, i) =>
              m.author === 'you' ? (
                <OutgoingMessage key={i} text={m.text} />
              ) : (
                <IncomingMessage
                  key={i}
                  member={MEMBERS[m.author]}
                  text={m.text}
                  named={squad.messages[i - 1]?.author !== m.author}
                />
              ),
            )}
            {spark ? (
              <SparkWakeQuestion squadId={squad.id} paused={wakeMode(spark) === 'paused'} />
            ) : null}
            {rooms.map((r) => (
              <SquadRoomLine key={r.id} room={r} />
            ))}
            <ThreadMessages thread={thread} />
          </LayoutAnimationConfig>
        </ScrollView>
        <Composer
          placeholder={`Message ${squad.name}`}
          initialText={draft}
          leading="plus"
          onLeadingPress={() =>
            router.push({ pathname: '/start-room/[id]', params: { id: squad.id } })
          }
          // In a quiet squad your message is what wakes it: it pings the squad.
          onSend={(text) => (squad.live ? sendMessage(thread, text) : wakeSquad(squad.id, text))}
        />
      </View>
    </KeyboardScreen>
  );
}
