import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { RoomArt, VibeTag } from '@/components/art/room-art';
import { AvatarStack } from '@/components/avatar-stack';
import { Icon } from '@/components/icon';
import { popIn } from '@/components/motion/pop-in';
import { PressableScale } from '@/components/ui';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { haptics } from '@/lib/haptics';
import { leaveSheetTo } from '@/lib/navigation';
import { MEMBERS } from '@/lib/mock-data';
import { startedLine, type LiveRoom } from '@/lib/rooms';
import { cn } from '@/lib/utils';

/** One room in the grid: its moving icon, FUN or STUDY, and who's inside. Quiet rooms stand still. */
export function RoomsCard({
  room,
  index,
  width,
}: {
  room: LiveRoom;
  index: number;
  width: number;
}) {
  const lip = useHardShadow(4);
  return (
    <Animated.View entering={popIn(80 + index * 70, index % 2 ? 4 : -4)} style={{ width }}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`${room.name}, ${room.vibe === 'fun' ? 'fun' : 'study'} room. ${
          room.live ? `${room.inside.length} inside` : 'quiet'
        }`}
        onPress={() => {
          haptics.tap();
          leaveSheetTo(room.href);
        }}
        className={cn('gap-3 rounded-[24px] bg-surface p-3', !room.live && 'bg-surface/60')}
        style={lip}
      >
        <View className="flex-row items-start justify-between">
          <View className={room.live ? undefined : 'opacity-60'}>
            <RoomArt kind={room.kind} tone={room.tone} size={58} alive={room.live} />
          </View>
          <VibeTag vibe={room.vibe} />
        </View>
        <View className="gap-0.5">
          <Text
            numberOfLines={1}
            className={cn('font-heavy text-body', room.live ? 'text-content' : 'text-muted')}
          >
            {room.name}
          </Text>
          <Text
            numberOfLines={1}
            className={cn('font-text text-caption', room.live ? 'text-live' : 'text-muted')}
          >
            {startedLine(room, MEMBERS)} · {room.detail}
          </Text>
        </View>
        <View className="h-6 flex-row items-center justify-between">
          {room.live ? (
            <>
              <AvatarStack ids={room.inside} size={24} max={3} />
              <Text className="font-heavy text-caption text-content">{room.inside.length} in</Text>
            </>
          ) : (
            <Text className="font-text text-caption text-muted">Quiet</Text>
          )}
        </View>
      </PressableScale>
    </Animated.View>
  );
}

/** Last row: start a room (opens the same sheet as the chat's +). */
export function RoomsAddCard({ index, squadId }: { index: number; squadId: string }) {
  const startLip = useHardShadow(4);
  return (
    <Animated.View entering={popIn(80 + index * 70, 0)}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Start a room"
        onPress={() => {
          haptics.tap();
          leaveSheetTo({ pathname: '/start-room/[id]', params: { id: squadId } });
        }}
        className="flex-row items-center gap-3 rounded-[22px] bg-surface px-4 py-3"
        style={startLip}
      >
        <View className="size-9 items-center justify-center rounded-full bg-cream">
          <Icon name="plus" size={18} />
        </View>
        <Text className="flex-1 font-heavy text-body text-content">Start a room</Text>
      </PressableScale>
    </Animated.View>
  );
}
