import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { RoomArt, VibeTag } from '@/components/art/room-art';
import { AvatarStack } from '@/components/avatar-stack';
import { EqBars } from '@/components/motion/eq-bars';
import { LiveDot } from '@/components/motion/live-dot';
import { Button } from '@/components/ui';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { haptics } from '@/lib/haptics';
import { TIMING_OUT } from '@/lib/motion';
import { MEMBERS } from '@/lib/mock-data';
import { startedLine, type LiveRoom } from '@/lib/rooms';
import { leaveSheetTo } from '@/lib/navigation';
import { joinNames } from '@/lib/squads';

/** The squad's busiest room, big: what's on, who's inside, Join room. */
export function RoomsHero({ room }: { room: LiveRoom }) {
  const lip = useHardShadow(4);
  return (
    <Animated.View
      entering={FadeInDown.duration(320).easing(TIMING_OUT)}
      className="gap-4 rounded-[28px] bg-surface p-4"
      style={lip}
    >
      <View className="flex-row gap-4">
        <RoomArt kind={room.kind} tone={room.tone} size={92} alive={room.live} />
        <View className="flex-1 justify-center gap-1">
          <View className="flex-row items-center gap-2">
            <VibeTag vibe={room.vibe} />
            {room.live ? (
              <View className="flex-row items-center gap-1.5">
                <LiveDot size={8} />
                <Text className="font-heavy text-overline tracking-widest text-live">LIVE</Text>
              </View>
            ) : null}
          </View>
          <Text numberOfLines={1} className="font-display text-headline text-content">
            {room.name}
          </Text>
          <Text numberOfLines={1} className="font-text text-caption text-muted">
            {startedLine(room, MEMBERS)} {room.startedAgo} · {room.detail}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-3 rounded-2xl bg-cream px-3 py-2.5">
        {room.live ? (
          <>
            <AvatarStack ids={room.inside} size={28} max={3} live />
            <Text numberOfLines={1} className="flex-1 font-heavy text-caption text-content">
              {joinNames(room.inside)} {room.inside.length === 1 ? 'is' : 'are'} in
            </Text>
            <EqBars className="bg-teal" max={14} count={4} />
          </>
        ) : (
          <Text className="flex-1 font-text text-caption text-muted">
            {"Nobody's in yet. Open it and the squad gets a nudge."}
          </Text>
        )}
      </View>

      <View className="flex-row gap-3">
        <Button
          label={room.live ? 'Join room' : 'Open room'}
          size="md"
          className="flex-1"
          onPress={() => {
            haptics.success();
            leaveSheetTo(room.href);
          }}
        />
      </View>
    </Animated.View>
  );
}
