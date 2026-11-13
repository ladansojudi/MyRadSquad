import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { SceneClock, useSceneClock } from '@/components/motion/scene-clock';
import { wave } from '@/lib/motion';

function Dot({ index }: { index: number }) {
  const t = useSceneClock();
  // Each dot hops 3pt in turn; the delay travels left to right.
  const hop = useAnimatedStyle(() => ({
    transform: [{ translateY: -3 * Math.max(0, wave(t.value, 1200, -index * 0.15)) }],
  }));
  return <Animated.View className="size-1.5 rounded-full bg-muted" style={hop} />;
}

/** "…" that shows someone is typing. */
export function TypingDots() {
  return (
    <SceneClock>
      <View className="flex-row items-center gap-1 pt-1">
        {[0, 1, 2].map((i) => (
          <Dot key={i} index={i} />
        ))}
      </View>
    </SceneClock>
  );
}
