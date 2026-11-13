import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { SceneClock, useSceneClock } from '@/components/motion/scene-clock';
import { seeded, wave } from '@/lib/motion';
import { cn } from '@/lib/utils';

function Bar({ index, className, max }: { index: number; className: string; max: number }) {
  const t = useSceneClock();
  // Each bar rises and falls on its own phase: "someone is talking / music is on".
  const style = useAnimatedStyle(() => {
    const a = (wave(t.value, 1000, seeded(index, 2)) + 1) / 2;
    const b = (wave(t.value, 1500, seeded(index, 5)) + 1) / 2;
    return { height: max * (0.25 + 0.75 * (0.6 * a + 0.4 * b)) };
  });
  return <Animated.View className={cn('w-1 rounded-full', className)} style={style} />;
}

/** Small live audio meter for voice rooms. */
export function EqBars({
  className = 'bg-surface',
  max = 16,
  count = 4,
}: {
  className?: string;
  max?: number;
  count?: number;
}) {
  return (
    <SceneClock>
      <View className="flex-row items-end gap-[3px]" style={{ height: max }}>
        {Array.from({ length: count }, (_, i) => (
          <Bar key={i} index={i} className={className} max={max} />
        ))}
      </View>
    </SceneClock>
  );
}
