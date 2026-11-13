import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { popIn } from '@/components/motion/pop-in';
import { PersonAvatar } from '@/components/person-avatar';
import { SceneClock, useSceneClock } from '@/components/motion/scene-clock';
import { type MemberId } from '@/lib/mock-data';
import { loop } from '@/lib/motion';

/** A ring that grows out of the newest arrival and fades: "just joined". */
function JoinRipple({ size }: { size: number }) {
  const t = useSceneClock();
  const ripple = useAnimatedStyle(() => {
    const p = loop(t.value, 1500);
    return { opacity: 0.7 * (1 - p), transform: [{ scale: 1 + 0.6 * p }] };
  });
  return (
    <Animated.View
      pointerEvents="none"
      className="absolute rounded-full border-2 border-teal"
      style={[{ width: size, height: size }, ripple]}
    />
  );
}

type AvatarStackProps = {
  ids: MemberId[];
  size?: number;
  /**
   * Slots shown. The stack always takes the width of `max` avatars, so text next to it
   * lines up whether a squad has 2 people or 12. Past `max`, the last slot reads "+N".
   */
  max?: number;
  /** Members who are not here right now: drawn faded. */
  away?: MemberId[];
  /** Avatars pop in one after another (banner). */
  pop?: boolean;
  /** The first avatar just joined: it gets a pulsing ring. */
  live?: boolean;
};

/** Overlapping round avatars: a squad's face, or who just joined. */
export function AvatarStack({
  ids,
  size = 32,
  max = 3,
  away = [],
  pop = false,
  live = false,
}: AvatarStackProps) {
  const overlap = Math.round(size * 0.32);
  const overflow = ids.length > max ? ids.length - (max - 1) : 0;
  const shown = overflow ? ids.slice(0, max - 1) : ids;
  const width = size + (max - 1) * (size - overlap);

  return (
    <SceneClock>
      <View className="flex-row" style={{ width }}>
        {shown.map((id, i) => {
          const isAway = away.includes(id);
          return (
            <Animated.View
              key={id}
              entering={pop ? popIn(120 + i * 110, -10) : undefined}
              className="items-center justify-center"
              style={{ marginLeft: i === 0 ? 0 : -overlap, zIndex: shown.length - i + 1 }}
            >
              {live && i === 0 ? <JoinRipple size={size} /> : null}
              <PersonAvatar id={id} size={size} ring faded={isAway} />
            </Animated.View>
          );
        })}
        {overflow ? (
          <View
            className="items-center justify-center rounded-full border-2 border-surface bg-cream"
            style={{ width: size, height: size, marginLeft: -overlap, zIndex: 0 }}
          >
            <Text className="font-heavy text-content" style={{ fontSize: size * 0.34 }}>
              +{overflow}
            </Text>
          </View>
        ) : null}
      </View>
    </SceneClock>
  );
}
