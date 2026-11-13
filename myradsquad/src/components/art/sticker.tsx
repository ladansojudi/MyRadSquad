import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { Sparkle } from '@/components/art/sparkle';
import { Crisp } from '@/components/motion/crisp';
import { Alive, useSceneClock } from '@/components/motion/scene-clock';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { wave } from '@/lib/motion';
import { cn } from '@/lib/utils';

type StickerTone = 'surface' | 'coral' | 'cobalt' | 'teal';

type StickerProps = {
  label: string;
  tone?: StickerTone;
  size?: 'sm' | 'md' | 'lg';
  rotate?: number;
  /** Wiggle around its tilt and twinkle its sparkles (illustrations, not chat). */
  alive?: boolean;
  phase?: number;
};

const TONE: Record<StickerTone, { bg: string; text: string; spark: 'canvas' | 'surface' }> = {
  surface: { bg: 'bg-surface', text: 'text-content', spark: 'canvas' },
  coral: { bg: 'bg-accent', text: 'text-content', spark: 'canvas' },
  cobalt: { bg: 'bg-cobalt', text: 'text-cobalt-content', spark: 'surface' },
  teal: { bg: 'bg-teal', text: 'text-teal-content', spark: 'surface' },
};

const SIZE = {
  sm: { pad: 'px-4 py-1.5', text: 'text-[16px] leading-[20px]', spark: 10 },
  md: { pad: 'px-5 py-2', text: 'text-[20px] leading-[24px]', spark: 12 },
  lg: { pad: 'px-6 py-2.5', text: 'text-[24px] leading-[28px]', spark: 16 },
};

function StickerArt({
  label,
  tone = 'coral',
  size = 'md',
  rotate = -6,
  alive = false,
  phase = 0,
}: StickerProps) {
  const shadow = useHardShadow(4);
  const t = useSceneClock();
  const toneStyle = TONE[tone];
  const sizeStyle = SIZE[size];

  // A slapped-on sticker never sits dead still: ±2° around its tilt and a 1pt lift.
  const wiggle = useAnimatedStyle(() => {
    const wobble = alive ? 2 * wave(t.value, 4000, phase) : 0;
    const lift = alive ? -1 * wave(t.value, 3000, phase + 0.2) : 0;
    return { transform: [{ translateY: lift }, { rotate: `${rotate + wobble}deg` }] };
  });

  return (
    <Animated.View style={wiggle}>
      <Crisp pad={10}>
        <View>
          <View className="rounded-2xl bg-surface p-1" style={shadow}>
            <View className={cn('items-center rounded-xl', toneStyle.bg, sizeStyle.pad)}>
              <Text className={cn('font-display', toneStyle.text, sizeStyle.text)}>{label}</Text>
            </View>
          </View>
          <View className="absolute -right-1 -top-2">
            <Sparkle
              size={sizeStyle.spark + 6}
              tone={toneStyle.spark}
              outlined
              alive={alive}
              phase={phase + 0.4}
            />
          </View>
          <View className="absolute bottom-2 left-2">
            <Sparkle size={sizeStyle.spark} tone="surface" alive={alive} phase={phase + 0.7} />
          </View>
        </View>
      </Crisp>
    </Animated.View>
  );
}

/** Die-cut sticker: a coloured pill on a white backing, both outlined in ink. */
export function Sticker(props: StickerProps) {
  return props.alive ? (
    <Alive>
      <StickerArt {...props} />
    </Alive>
  ) : (
    <StickerArt {...props} />
  );
}
