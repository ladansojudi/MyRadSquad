import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { RoomArt } from '@/components/art/room-art';
import { AvatarStack } from '@/components/avatar-stack';
import { PressableScale } from '@/components/ui';
import { haptics } from '@/lib/haptics';
import { MEMBERS } from '@/lib/mock-data';
import { startedLine, type LiveRoom } from '@/lib/rooms';
import { cn } from '@/lib/utils';

const TINT: Record<LiveRoom['tone'], string> = {
  cobalt: 'bg-cobalt/30',
  teal: 'bg-teal/30',
  coral: 'bg-accent/30',
  canvas: 'bg-canvas',
};

/**
 * "Sam started a Focus session": how a room shows up, in the chat and on Home. Who started
 * it, when, who's in, and Join. Compact for Home's live card.
 */
export function SquadRoomStarted({ room, compact = false }: { room: LiveRoom; compact?: boolean }) {
  const mine = room.inside.includes('you');
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${startedLine(room, MEMBERS)} ${room.name}. ${room.inside.length} in. ${mine ? 'Open' : 'Join'}`}
      onPress={() => {
        haptics.tap();
        router.push(room.href);
      }}
      className={cn('flex-row items-center gap-3 rounded-2xl p-2 pr-3', TINT[room.tone])}
    >
      <RoomArt kind={room.kind} tone={room.tone} size={compact ? 44 : 48} />
      <View className="flex-1">
        {compact ? null : (
          <Text numberOfLines={1} className="font-text text-caption text-muted">
            {startedLine(room, MEMBERS)} · {room.startedAgo}
          </Text>
        )}
        <Text numberOfLines={1} className="font-heavy text-body text-content">
          {room.name}
        </Text>
        {compact ? (
          <View className="mt-0.5 flex-row items-center gap-1.5">
            <AvatarStack
              ids={room.inside.filter((id) => id !== 'you')}
              size={18}
              max={Math.max(1, Math.min(3, room.inside.filter((id) => id !== 'you').length))}
            />
            <Text numberOfLines={1} className="flex-1 font-text text-caption text-muted">
              {startedLine(room, MEMBERS)}
            </Text>
          </View>
        ) : (
          <Text numberOfLines={1} className="font-text text-caption text-muted">
            {`${room.inside.length} in · ${room.detail}`}
          </Text>
        )}
      </View>
      <View className="h-8 justify-center rounded-full bg-surface px-3.5">
        <Text className="font-heavy text-caption text-content">{mine ? 'Open' : 'Join'}</Text>
      </View>
    </PressableScale>
  );
}
