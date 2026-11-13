import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { Alive, useSceneClock } from '@/components/motion/scene-clock';
import { usePalette, type Palette } from '@/hooks/use-palette';
import { wave } from '@/lib/motion';

export const SPARKLE_PATH =
  'M12 0C13 8 16 11 24 12 16 13 13 16 12 24 11 16 8 13 0 12 8 11 11 8 12 0Z';

type SparkleProps = {
  size?: number;
  tone?: keyof Palette;
  /** Kept for callers; the style has no outlines. */
  outlined?: boolean;
  /** Twinkle (a small breath of scale and turn) on the scene clock. */
  alive?: boolean;
  /** 0–1 offset so neighbouring sparkles never twinkle together. */
  phase?: number;
};

function SparkleArt({ size = 20, tone = 'surface', alive = false, phase = 0 }: SparkleProps) {
  const palette = usePalette();
  const t = useSceneClock();
  const twinkle = useAnimatedStyle(() => {
    if (!alive) return {};
    return {
      transform: [
        { scale: 0.9 + 0.12 * wave(t.value, 2400, phase) },
        { rotate: `${10 * wave(t.value, 4800, phase + 0.3)}deg` },
      ],
    };
  });

  return (
    <Animated.View style={twinkle}>
      <Svg width={size} height={size} viewBox="-2 -2 28 28">
        <Path
          d={SPARKLE_PATH}
          fill={palette[tone]}
          stroke="none"
          strokeWidth={0}
          strokeLinejoin="round"
        />
      </Svg>
    </Animated.View>
  );
}

/** Four-point star used as decoration around the illustrations. */
export function Sparkle(props: SparkleProps) {
  return props.alive ? (
    <Alive>
      <SparkleArt {...props} />
    </Alive>
  ) : (
    <SparkleArt {...props} />
  );
}
