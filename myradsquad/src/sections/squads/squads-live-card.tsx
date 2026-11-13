import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { SquadEmblem } from '@/components/art/squad-emblem';
import { AvatarStack } from '@/components/avatar-stack';
import { Icon } from '@/components/icon';
import { LiveDot } from '@/components/motion/live-dot';
import { PressableScale } from '@/components/ui';
import { useSquadRooms } from '@/hooks/use-rooms';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { EMPTY_THREAD, useAppStore } from '@/lib/app-store';
import { haptics } from '@/lib/haptics';
import { MEMBERS } from '@/lib/mock-data';
import { openSquad } from '@/lib/navigation';
import { roomsSummary } from '@/lib/rooms';
import { joinNames, squadThread, type LiveSquad } from '@/lib/squads';
import { SquadRoomStarted } from '@/sections/squad/squad-room-started';
import { SquadsTicker } from '@/sections/squads/squads-ticker';

/**
 * A live squad in the Home carousel. Same size for every squad: its emblem (moving),
 * who's here, its chat rolling by (💬), and the rooms friends started ("Sam started a
 * Focus session · Join", the busiest one only). Start a room / all open rooms underneath.
 * No Spark here: Spark only speaks up when a squad goes quiet.
 * Tapping the card itself opens the chat.
 */
export function SquadsLiveCard({ squad, width }: { squad: LiveSquad; width: number }) {
  const lip = useHardShadow(4);
  const sent = useAppStore((s) => s.threads[squadThread(squad.id)] ?? EMPTY_THREAD);
  const rooms = useSquadRooms(squad);
  const unread = sent.length ? 0 : squad.unread;
  const lines = [
    ...squad.messages.map((m) => ({
      who: m.author === 'you' ? 'You' : MEMBERS[m.author].name,
      text: m.text,
    })),
    ...sent.map((m) => ({ who: 'You', text: m.sticker ? `sent a ${m.text} sticker` : m.text })),
  ];

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${squad.name}, ${squad.friendsHere.length} here now. Opens the chat`}
      onPress={() => {
        haptics.tap();
        openSquad(squad.id);
      }}
      className="flex-1 gap-4 rounded-[28px] bg-surface p-4"
      style={[lip, { width }]}
    >
      <View className="flex-row items-center gap-3">
        <SquadEmblem id={squad.id} size={56} alive />
        <View className="flex-1 gap-0.5">
          <View className="flex-row items-center gap-2">
            <Text numberOfLines={1} className="shrink font-display text-subtitle text-content">
              {squad.name}
            </Text>
            {unread ? (
              <View className="ml-auto rounded-full bg-accent px-2 py-0.5">
                <Text className="font-display text-overline text-accent-content">{unread}</Text>
              </View>
            ) : null}
          </View>
          <View className="flex-row items-center gap-1.5">
            <AvatarStack ids={squad.friendsHere} size={22} max={3} />
            <LiveDot size={7} />
            <Text numberOfLines={1} className="flex-1 font-heavy text-caption text-live">
              {joinNames(squad.friendsHere)} here
            </Text>
          </View>
        </View>
      </View>

      <View className="h-10 flex-row items-center gap-2 rounded-xl bg-cream px-3">
        <Icon name="chat" size={16} tone="muted" />
        <SquadsTicker lines={lines} running />
      </View>

      <View className="gap-2">
        {rooms.slice(0, 1).map((r) => (
          <SquadRoomStarted key={r.id} room={r} compact />
        ))}
      </View>

      <View className="flex-row items-center justify-between">
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => {
            haptics.tap();
            router.push({ pathname: '/start-room/[id]', params: { id: squad.id } });
          }}
          className="flex-row items-center gap-1"
        >
          <Icon name="plus" size={14} strokeWidth={2.6} />
          <Text className="font-heavy text-caption text-content">Start a room</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => {
            haptics.tap();
            router.push({ pathname: '/rooms/[id]', params: { id: squad.id } });
          }}
          className="flex-row items-center gap-1"
        >
          <Text className="font-heavy text-caption text-muted">{roomsSummary(rooms)}</Text>
          <Icon name="chevron-right" size={14} tone="muted" strokeWidth={2.6} />
        </Pressable>
      </View>
    </PressableScale>
  );
}
