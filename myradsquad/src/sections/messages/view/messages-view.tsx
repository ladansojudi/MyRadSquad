import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { RoomArt } from '@/components/art/room-art';
import { SquadEmblem } from '@/components/art/squad-emblem';
import { LiveDot } from '@/components/motion/live-dot';
import { TypingDots } from '@/components/motion/typing-dots';
import { SectionHeader } from '@/components/section-header';
import { PressableScale } from '@/components/ui';
import { StatusBand, TabTitle } from '@/components/tab-title';
import { Wireframe } from '@/components/wireframe';
import { useAllRooms } from '@/hooks/use-rooms';
import { useSquads } from '@/hooks/use-squads';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { EMPTY_THREAD, useAppStore } from '@/lib/app-store';
import { haptics } from '@/lib/haptics';
import { MEMBERS } from '@/lib/mock-data';
import { openSquad } from '@/lib/navigation';
import { squadRooms } from '@/lib/rooms';
import { squadThread, type LiveSquad } from '@/lib/squads';
import { cn } from '@/lib/utils';

/** One squad chat: its mark, the last line (or who's typing), when, and what's unread. */
function ChatRow({ squad }: { squad: LiveSquad }) {
  const lip = useHardShadow(4);
  const thread = squadThread(squad.id);
  const sent = useAppStore((s) => s.threads[thread] ?? EMPTY_THREAD);
  const typing = useAppStore((s) => s.typing[thread]);
  const latest = sent[sent.length - 1] ?? squad.messages[squad.messages.length - 1];
  const who = latest.author === 'you' ? 'You' : MEMBERS[latest.author].name;
  const unread = sent.length ? 0 : squad.unread;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${squad.name}. ${who}: ${latest.text}`}
      onPress={() => {
        haptics.tap();
        openSquad(squad.id);
      }}
      className="flex-row items-center gap-3 rounded-[24px] bg-surface p-3"
      style={lip}
    >
      <View className={cn('size-14 items-center justify-center', !squad.live && 'opacity-50')}>
        <SquadEmblem id={squad.id} size={52} />
        {squad.live ? (
          <View className="absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-surface">
            <LiveDot size={10} />
          </View>
        ) : null}
      </View>
      <View className="flex-1 gap-0.5">
        <View className="flex-row items-center gap-2">
          <Text numberOfLines={1} className="flex-1 font-heavy text-body text-content">
            {squad.name}
          </Text>
          <Text className={cn('font-text text-caption', unread ? 'text-alert' : 'text-muted')}>
            {sent.length ? 'now' : squad.lastActive}
          </Text>
        </View>
        <View className="h-5 flex-row items-center gap-2">
          {typing ? (
            <>
              <Text className="font-strong text-caption text-live">
                {MEMBERS[typing].name} is typing
              </Text>
              <TypingDots />
            </>
          ) : (
            <Text
              numberOfLines={1}
              className={cn(
                'flex-1 text-caption',
                unread ? 'font-strong text-content' : 'font-text text-muted',
              )}
            >
              {who}: {latest.sticker ? `sent a ${latest.text} sticker` : latest.text}
            </Text>
          )}
          {typing ? <View className="flex-1" /> : null}
          {unread ? (
            <View className="min-w-[22px] items-center rounded-full bg-accent px-1.5 py-0.5">
              <Text className="font-display text-overline text-accent-content">{unread}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </PressableScale>
  );
}

/**
 * Messages: every squad chat in one list, like iMessage, with the rooms that are live right
 * now on top (their icons move; tap one to drop in).
 */
function MessagesViewContent() {
  const squads = useSquads();
  const all = useAllRooms();
  const live = squads.flatMap((s) =>
    squadRooms(s, all)
      .filter((r) => r.live)
      .map((r) => ({ ...r, squad: s.name })),
  );

  return (
    <View className="flex-1 bg-canvas">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="flex-1 bg-canvas"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-8 pb-10"
      >
        <TabTitle title="Messages" className="px-4" />
        {live.length ? (
          <View>
            <SectionHeader title="Live rooms" className="px-4" />
            <ScrollView
              horizontal
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-4 px-4"
            >
              {live.map((r) => (
                <PressableScale
                  key={r.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${r.name} in ${r.squad}, ${r.inside.length} inside`}
                  onPress={() => {
                    haptics.tap();
                    router.push(r.href);
                  }}
                  className="w-[84px] items-center gap-1"
                >
                  <View>
                    <RoomArt kind={r.kind} tone={r.tone} size={64} />
                  </View>
                  <Text
                    numberOfLines={2}
                    className="text-center font-heavy text-caption leading-[16px] text-content"
                  >
                    {r.name}
                  </Text>
                  <Text numberOfLines={1} className="font-text text-overline text-live">
                    {r.inside.length} in
                  </Text>
                </PressableScale>
              ))}
            </ScrollView>
          </View>
        ) : null}

        <View className="px-4">
          <SectionHeader title="Chats" />
          <View className="gap-3">
            {squads.map((s) => (
              <ChatRow key={s.id} squad={s} />
            ))}
          </View>
        </View>
      </ScrollView>
      <StatusBand />
    </View>
  );
}

/** Outside the six solutions: shown as a wireframe. */
export function MessagesView() {
  return (
    <Wireframe>
      <MessagesViewContent />
    </Wireframe>
  );
}
