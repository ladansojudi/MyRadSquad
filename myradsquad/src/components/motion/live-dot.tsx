import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { SceneClock, useSceneClock } from '@/components/motion/scene-clock';
import { loop } from '@/lib/motion';
import { cn } from '@/lib/utils';

function Ripple({ className }: { className: string }) {
  const t = useSceneClock();
  // A ring grows out of the dot and fades away (opacity only as it disappears).
  const ripple = useAnimatedStyle(() => {
    const p = loop(t.value, 2000);
    return { opacity: 0.6 * (1 - p), transform: [{ scale: 1 + 1.4 * p }] };
  });
  return (
    <Animated.View className={cn('absolute inset-0 rounded-full', className)} style={ripple} />
  );
}

/** Presence dot: "people are here right now". */
export function LiveDot({
  className = 'bg-teal',
  size = 12,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <SceneClock>
      <View style={{ width: size, height: size }}>
        <Ripple className={className} />
        <View className={cn('size-full rounded-full', className)} />
      </View>
    </SceneClock>
  );
}
