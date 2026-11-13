import { Text, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { RoundTable } from '@/components/art/round-table';
import { EmptySeat, SeatTile } from '@/components/art/seat-tile';
import { Sticker } from '@/components/art/sticker';
import { popIn } from '@/components/motion/pop-in';
import { SceneClock, useSceneClock } from '@/components/motion/scene-clock';
import { bell, wave } from '@/lib/motion';

// The scene's one action: the table is set, then friends and stickers land one by one.
const ART_W = 354;
const ART_H = 330;

const ARRIVE = { table: 80, maya: 380, jordan: 520, lunch: 680, empty: 820, imIn: 960, you: 1150 };

/** Your seat waits to be taken: a quick squash-and-widen for 1.2s, then a rest (every 3s). */
function YourSeat() {
  const t = useSceneClock();
  const jiggle = useAnimatedStyle(() => {
    const local = t.value % 3000;
    const amount = local < 1200 ? bell(local / 1200) : 0;
    const beat = wave(t.value, 300);
    return {
      transform: [{ scaleX: 1 + 0.03 * amount * beat }, { scaleY: 1 - 0.03 * amount * beat }],
    };
  });
  return (
    <Animated.View
      style={jiggle}
      className="h-[42px] w-[42px] items-center justify-center rounded-[12px] bg-content/10"
    >
      <Text className="font-text text-caption text-content">you</Text>
    </Animated.View>
  );
}

/** The invite illustration: the table, two friends, "LUNCH?" and "I'M IN" stickers, your empty seat. */
export function InviteArt({ height }: { height: number }) {
  const { width } = useWindowDimensions();
  // Drawn on a 354×330 stage, scaled down (never up) to the space the screen leaves.
  const scale = Math.min(1, height / ART_H, (width - 48) / ART_W);
  return (
    <SceneClock>
      <View
        style={{
          width: ART_W,
          height: ART_H,
          transform: [{ scale }],
          // Collapse the layout box to the scaled size so nothing around it moves.
          marginVertical: (ART_H * scale - ART_H) / 2,
          marginHorizontal: (ART_W * scale - ART_W) / 2,
        }}
      >
        <Animated.View entering={popIn(ARRIVE.lunch, -14)} className="absolute left-0 top-0">
          <Sticker label="LUNCH?" tone="surface" rotate={-7} alive phase={0.1} />
        </Animated.View>
        <Animated.View
          entering={popIn(ARRIVE.maya)}
          className="absolute left-[155px] top-[8px] rotate-[-4deg]"
        >
          <SeatTile letter="M" tone="coral" size={40} alive />
        </Animated.View>
        <Animated.View entering={popIn(ARRIVE.empty)} className="absolute left-[35px] top-[104px]">
          <EmptySeat size={40} round alive phase={0.4} />
        </Animated.View>
        <Animated.View
          entering={popIn(ARRIVE.table, -20)}
          className="absolute left-[90px] top-[58px]"
        >
          <RoundTable size={186} alive />
        </Animated.View>
        <Animated.View
          entering={popIn(ARRIVE.jordan, 8)}
          className="absolute right-[24px] top-[94px]"
        >
          <SeatTile letter="J" tone="teal" shape="leaf" size={38} alive />
        </Animated.View>
        <Animated.View entering={popIn(ARRIVE.you)} className="absolute left-[78px] top-[246px]">
          <YourSeat />
        </Animated.View>
        <Animated.View entering={popIn(ARRIVE.imIn, 10)} className="absolute right-0 top-[236px]">
          <Sticker label="I'M IN" tone="coral" size="lg" rotate={-5} alive phase={0.6} />
        </Animated.View>
      </View>
    </SceneClock>
  );
}
