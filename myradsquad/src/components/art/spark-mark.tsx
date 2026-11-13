import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { SPARKLE_PATH } from '@/components/art/sparkle';
import { Alive, useSceneClock } from '@/components/motion/scene-clock';
import { usePalette } from '@/hooks/use-palette';
import { track } from '@/lib/motion';
import { deepen } from '@/lib/color';

type SparkMarkProps = {
  size?: number;
  /** `outline` on light surfaces, `solid` on cobalt cards. */
  variant?: 'outline' | 'solid';
  /** A short twinkle every few seconds (Spark speaking), otherwise still. */
  alive?: boolean;
};

// One twinkle per 6s: a quick turn and swell, then a long rest.
const TWINKLE_TURN = [
  [0, 0],
  [4400, 0],
  [4700, 18, 'out'],
  [5200, 0],
  [6000, 0],
] as const;
const TWINKLE_SCALE = [
  [0, 1],
  [4400, 1],
  [4700, 1.15, 'out'],
  [5200, 1],
  [6000, 1],
] as const;

// A chat bubble built from the logo's pieces: a rounded square and a quarter-circle tail.
const BUBBLE =
  'M8 2H20A6 6 0 0 1 26 8V16A6 6 0 0 1 20 22H11L5 27V22A6 6 0 0 1 2 16V8A6 6 0 0 1 8 2Z';

function SparkMarkArt({ size = 28, variant = 'outline', alive = false }: SparkMarkProps) {
  const p = usePalette();
  const t = useSceneClock();
  const twinkle = useAnimatedStyle(() => {
    if (!alive) return {};
    const local = t.value % 6000;
    return {
      transform: [
        { rotate: `${track(local, TWINKLE_TURN)}deg` },
        { scale: track(local, TWINKLE_SCALE) },
      ],
    };
  });
  // `outline` (light surfaces): periwinkle bubble, white sparkle. `solid` (on periwinkle):
  // white bubble, periwinkle sparkle. Both sit on the same-colour lip, like the logo.
  const bubble = variant === 'solid' ? p.surface : p.cobalt;
  const star = variant === 'solid' ? p.cobalt : p.surface;
  const s = size / 28;
  return (
    <View accessible accessibilityLabel="Spark, AI" style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 28 30">
        <Path d={BUBBLE} fill={deepen(bubble)} transform="translate(0 1.6)" />
        <Path d={BUBBLE} fill={bubble} />
      </Svg>
      <Animated.View
        style={[
          twinkle,
          { position: 'absolute', left: 6.4 * s, top: 3.4 * s, width: 15 * s, height: 15 * s },
        ]}
      >
        <Svg width={15 * s} height={15 * s} viewBox="0 0 24 24">
          <Path d={SPARKLE_PATH} fill={star} />
        </Svg>
      </Animated.View>
    </View>
  );
}

/** Spark's mark: a periwinkle chat bubble (logo pieces) holding a white sparkle. */
export function SparkMark(props: SparkMarkProps) {
  return props.alive ? (
    <Alive>
      <SparkMarkArt {...props} />
    </Alive>
  ) : (
    <SparkMarkArt {...props} />
  );
}
