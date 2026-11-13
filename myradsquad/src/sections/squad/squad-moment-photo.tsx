import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { Sticker } from '@/components/art/sticker';
import { SceneClock, useSceneClock } from '@/components/motion/scene-clock';
import { PhotoImage } from '@/components/wireframe';
import type { Moment, MomentTone } from '@/lib/mock-data';
import { TIMING_OUT, wave } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { haptics } from '@/lib/haptics';

const BG: Record<MomentTone, string> = {
  cobalt: 'bg-cobalt',
  teal: 'bg-teal',
  coral: 'bg-accent',
  canvas: 'bg-canvas',
};

const DOUBLE_TAP_MS = 280;
const BURST_MS = 1100;

/** The LOL sticker lands on the photo from a bigger, tilted, transparent state. */
const burstIn = () => {
  'worklet';
  const config = { duration: 280, easing: TIMING_OUT };
  return {
    initialValues: { opacity: 0, transform: [{ scale: 1.35 }, { rotate: '-14deg' }] },
    animations: {
      opacity: withTiming(1, config),
      transform: [
        { scale: withTiming(1, config) },
        { rotate: withDelay(40, withTiming('-6deg', config)) },
      ],
    },
  };
};

function DriftingShapes({ tones }: { tones: Moment['tones'] }) {
  const t = useSceneClock();
  // The "photo" is never a dead rectangle: its two shapes drift a few points, against each other.
  const driftA = useAnimatedStyle(() => ({
    transform: [
      { translateX: 6 * wave(t.value, 8000) },
      { translateY: 4 * wave(t.value, 6000, 0.25) },
    ],
  }));
  const driftB = useAnimatedStyle(() => ({
    transform: [
      { translateX: -5 * wave(t.value, 8000, 0.4) },
      { translateY: -6 * wave(t.value, 12000) },
    ],
  }));
  return (
    <>
      <Animated.View
        className={cn('absolute -right-16 -top-24 size-[230px] rounded-full', BG[tones[1]])}
        style={driftA}
      />
      <Animated.View
        className={cn('absolute -bottom-20 -left-24 size-[300px] rounded-full', BG[tones[2]])}
        style={driftB}
      />
    </>
  );
}

type SquadMomentPhotoProps = {
  moment: Moment;
  /** Double-tap = "lol". */
  onDoubleTap: () => void;
};

export function SquadMomentPhoto({ moment, onDoubleTap }: SquadMomentPhotoProps) {
  const [lastTap, setLastTap] = useState(0);
  const [burst, setBurst] = useState(0);

  const handlePress = () => {
    const now = Date.now();
    if (now - lastTap < DOUBLE_TAP_MS) {
      haptics.tap();
      onDoubleTap();
      const id = now;
      setBurst(id);
      setTimeout(() => setBurst((b) => (b === id ? 0 : b)), BURST_MS);
      setLastTap(0);
    } else {
      setLastTap(now);
    }
  };

  return (
    <Pressable
      accessibilityLabel={`Photo: ${moment.caption}. Double-tap to react lol.`}
      onPress={handlePress}
      className={cn('h-[340px] overflow-hidden rounded-[24px]', BG[moment.tones[0]])}
    >
      <SceneClock>
        <Animated.View
          key={moment.id}
          entering={FadeIn.duration(220).easing(TIMING_OUT)}
          className="absolute inset-0"
        >
          {moment.photo ? (
            <PhotoImage
              source={moment.photo}
              contentFit="cover"
              style={{ position: 'absolute', inset: 0 }}
            />
          ) : (
            <DriftingShapes tones={moment.tones} />
          )}
          <View className="flex-1" />
          <View className="absolute bottom-4 left-4 rounded-full bg-surface px-3 py-1.5">
            <Text className="font-heavy text-caption text-content">{moment.caption}</Text>
          </View>
        </Animated.View>
      </SceneClock>
      {burst ? (
        <Animated.View
          key={burst}
          entering={burstIn}
          exiting={FadeOut.duration(180)}
          pointerEvents="none"
          className="absolute inset-0 items-center justify-center"
        >
          <Sticker label="LOL" tone="surface" size="lg" rotate={-6} />
        </Animated.View>
      ) : null}
    </Pressable>
  );
}
