import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { useSceneClock } from '@/components/motion/scene-clock';
import { bell, loop, seeded, wave } from '@/lib/motion';

/** What friends send while you listen (mock), drifting up the side of the room. */
const AMBIENT = ['😂', '🔥', '🫶', '👀', '😮', '✨'];

/** Rise distance for a floating reaction. */
const RISE = 260;

/** A reaction is just the emoji, big, floating up. */
function Chip({ label }: { label: string; tone: number }) {
  return <Text className="text-[34px] leading-[42px]">{label}</Text>;
}

/** One friend's reaction: rises with its own speed and sway, fades in and out (looping). */
function Ambient({ index }: { index: number }) {
  const t = useSceneClock();
  const period = [8000, 12000, 6000][index % 3];
  const phase = seeded(index, 3);
  const x = 8 + seeded(index, 9) * 56;
  const style = useAnimatedStyle(() => {
    const p = loop(t.value, period, phase);
    return {
      opacity: bell(p),
      transform: [
        { translateY: -RISE * p },
        { translateX: 6 * wave(t.value, 4000, phase) },
        { rotate: `${4 * wave(t.value, 6000, phase + 0.2)}deg` },
        { scale: 0.85 + 0.15 * Math.min(1, p * 4) },
      ],
    };
  });
  return (
    <Animated.View className="absolute bottom-0" style={[{ right: x }, style]}>
      <Chip label={AMBIENT[index % AMBIENT.length]} tone={index} />
    </Animated.View>
  );
}

/** Friends reacting while the room is live. Never catches touches. */
export function RoomAmbientReactions({ count = 3 }: { count?: number }) {
  return (
    <View pointerEvents="none" className="absolute bottom-0 right-0 h-[280px] w-40">
      {Array.from({ length: count }, (_, i) => (
        <Ambient key={i} index={i} />
      ))}
    </View>
  );
}

/** Your own reaction: one rise from where you tapped, bigger, then gone. */
export function RoomBurst({ label, tone }: { label: string; tone: number }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.set(withTiming(1, { duration: 1400, easing: Easing.out(Easing.quad) }));
  }, [p]);
  const style = useAnimatedStyle(() => ({
    opacity: bell(p.get()),
    transform: [
      { translateY: -RISE * p.get() },
      { scale: 0.9 + 0.35 * Math.min(1, p.get() * 3) },
      { rotate: `${-8 + 16 * p.get()}deg` },
    ],
  }));
  return (
    <Animated.View pointerEvents="none" className="absolute bottom-0 self-center" style={style}>
      <Chip label={label} tone={tone} />
    </Animated.View>
  );
}
