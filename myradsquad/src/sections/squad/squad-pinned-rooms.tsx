import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { RoomArt } from '@/components/art/room-art';
import { Icon } from '@/components/icon';
import { PressableScale } from '@/components/ui';
import { useSquadRooms } from '@/hooks/use-rooms';
import { haptics } from '@/lib/haptics';
import type { LiveRoom } from '@/lib/rooms';
import type { LiveSquad } from '@/lib/squads';
import { cn } from '@/lib/utils';

const TINT: Record<LiveRoom['tone'], string> = {
  cobalt: 'bg-cobalt/40',
  teal: 'bg-teal/40',
  coral: 'bg-accent/40',
  canvas: 'bg-surface',
};

/**
 * Open rooms, pinned under the chat header (like a live voice channel): always in view
 * while you scroll the chat, one tap to join, and gone when a room empties. The + starts
 * a new one.
 */
export function SquadPinnedRooms({ squad }: { squad: Pick<LiveSquad, 'id' | 'here'> }) {
  const rooms = useSquadRooms(squad);
  return (
    <ScrollView
      horizontal
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      className="-mx-4"
      contentContainerClassName="gap-2 px-4"
    >
      {rooms.map((r) => {
        const mine = r.inside.includes('you');
        return (
          <PressableScale
            key={r.id}
            accessibilityRole="button"
            accessibilityLabel={`${r.name}, ${r.inside.length} in. ${mine ? 'Open' : 'Join'}`}
            onPress={() => {
              haptics.tap();
              router.push(r.href);
            }}
            className={cn('h-12 flex-row items-center gap-2 rounded-2xl pl-1.5 pr-3', TINT[r.tone])}
          >
            <RoomArt kind={r.kind} tone={r.tone} size={36} />
            <View>
              <Text
                numberOfLines={1}
                className="max-w-[140px] font-heavy text-caption text-content"
              >
                {r.name}
              </Text>
              <Text className="font-text text-overline text-content/70">
                {r.inside.length} in · {mine ? 'Open' : 'Join'}
              </Text>
            </View>
          </PressableScale>
        );
      })}
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Start a room"
        onPress={() => {
          haptics.tap();
          router.push({ pathname: '/start-room/[id]', params: { id: squad.id } });
        }}
        className="h-12 flex-row items-center gap-1.5 rounded-2xl bg-surface/60 px-3"
      >
        <Icon name="plus" size={16} strokeWidth={2.6} />
        <Text className="font-heavy text-caption text-content">
          {rooms.length ? 'Room' : 'Start a room'}
        </Text>
      </PressableScale>
    </ScrollView>
  );
}
