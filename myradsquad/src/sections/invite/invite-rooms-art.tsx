import { Text, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { RoomArt } from '@/components/art/room-art';
import { SeatTile } from '@/components/art/seat-tile';
import { Sticker } from '@/components/art/sticker';
import { popIn } from '@/components/motion/pop-in';
import { SceneClock, useSceneClock } from '@/components/motion/scene-clock';
import { wave } from '@/lib/motion';

// Same 354×330 stage as the invite art, scaled down (never up) to the space left.
const ART_W = 354;
const ART_H = 330;
const ARRIVE = { hangout: 80, focus: 300, game: 440, leo: 620, maya: 740, sticker: 900 };

/** A room tile that drifts a few points up and down, out of phase with the others. */
function Floating({ phase, children }: { phase: number; children: React.ReactNode }) {
  const t = useSceneClock();
  const drift = useAnimatedStyle(() => ({
    transform: [{ translateY: 4 * wave(t.value, 3600, phase) }],
  }));
  return <Animated.View style={drift}>{children}</Animated.View>;
}

/** Feature screen 2: a hangout in the middle, focus and game rooms around it, friends hopping in. */
export function InviteRoomsArt({ height }: { height: number }) {
  const { width } = useWindowDimensions();
  const scale = Math.min(1, height / ART_H, (width - 48) / ART_W);
  return (
    <SceneClock>
      <View
        style={{
          width: ART_W,
          height: ART_H,
          transform: [{ scale }],
          marginVertical: (ART_H * scale - ART_H) / 2,
          marginHorizontal: (ART_W * scale - ART_W) / 2,
        }}
      >
        <Animated.View
          entering={popIn(ARRIVE.focus, -8)}
          className="absolute left-[6px] top-[40px]"
        >
          <Floating phase={0.2}>
            <RoomArt kind="focus" tone="teal" size={84} />
          </Floating>
        </Animated.View>
        <Animated.View entering={popIn(ARRIVE.game, 8)} className="absolute right-[6px] top-[24px]">
          <Floating phase={0.7}>
            <RoomArt kind="game" tone="coral" size={84} />
          </Floating>
        </Animated.View>
        <Animated.View
          entering={popIn(ARRIVE.hangout, -12)}
          className="absolute left-[107px] top-[96px] items-center gap-2"
        >
          <Floating phase={0.45}>
            <RoomArt kind="voice" tone="cobalt" size={140} />
          </Floating>
          <View className="rounded-full bg-surface px-3 py-1">
            <Text className="font-heavy text-caption text-content">Leo started Hangout</Text>
          </View>
        </Animated.View>
        <Animated.View
          entering={popIn(ARRIVE.leo, -6)}
          className="absolute left-[70px] top-[214px]"
        >
          <SeatTile letter="L" tone="cobalt" size={38} alive />
        </Animated.View>
        <Animated.View
          entering={popIn(ARRIVE.maya, 6)}
          className="absolute right-[68px] top-[200px]"
        >
          <SeatTile letter="M" tone="coral" size={40} alive />
        </Animated.View>
        <Animated.View
          entering={popIn(ARRIVE.sticker, 10)}
          className="absolute right-[4px] top-[284px]"
        >
          <Sticker label="HOP IN" tone="teal" rotate={-6} alive phase={0.3} />
        </Animated.View>
      </View>
    </SceneClock>
  );
}
