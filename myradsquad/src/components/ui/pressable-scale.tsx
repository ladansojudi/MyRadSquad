import { Pressable, type PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { TIMING_OUT } from '@/lib/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PressableScaleProps = PressableProps & { className?: string };

/** Pressable that dips to 0.97 while held: press feedback without touching the drawing inside. */
export function PressableScale({
  onPressIn,
  onPressOut,
  style,
  disabled,
  ...props
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <AnimatedPressable
      {...props}
      disabled={disabled}
      onPressIn={(e) => {
        scale.set(withTiming(0.97, { duration: 110, easing: TIMING_OUT }));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.set(withTiming(1, { duration: 160, easing: TIMING_OUT }));
        onPressOut?.(e);
      }}
      style={[style as object, pressStyle]}
    />
  );
}
