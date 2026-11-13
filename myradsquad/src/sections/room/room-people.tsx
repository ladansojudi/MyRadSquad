import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { Icon } from '@/components/icon';
import { popIn } from '@/components/motion/pop-in';
import { useSceneClock } from '@/components/motion/scene-clock';
import { PressableScale } from '@/components/ui';
import { MEMBERS, type MemberId } from '@/lib/mock-data';
import { loop, wave } from '@/lib/motion';
import { cn } from '@/lib/utils';

/** Who talks when on the 24s scene clock, by seat: turns, with pauses in between. */
const TURNS: [number, number][][] = [
  [
    [0, 4000],
    [12000, 15000],
  ],
  [
    [5000, 9500],
    [17000, 21000],
  ],
  [
    [9500, 12000],
    [21500, 23500],
  ],
];

const AVATAR: Record<string, { bg: string; text: string }> = {
  coral: { bg: 'bg-accent', text: 'text-accent-content' },
  teal: { bg: 'bg-teal', text: 'text-teal-content' },
  cobalt: { bg: 'bg-cobalt', text: 'text-cobalt-content' },
  surface: { bg: 'bg-content', text: 'text-brand-content' },
};

const SIZE = 84;
const COL = SIZE + 28;

type PersonProps = {
  id: MemberId;
  seat: number;
  /** 'auto' follows the seat's turns; true/false is you, by your mic. */
  speaking: 'auto' | boolean;
  index: number;
};

/** A person in the room: rings pulse out while they talk, the mic badge says if they can. */
function Person({ id, seat, speaking, index }: PersonProps) {
  const t = useSceneClock();
  const member = MEMBERS[id];
  const avatar = AVATAR[member.tone] ?? AVATAR.surface;
  const turns = TURNS[seat % TURNS.length];

  const ring = useAnimatedStyle(() => {
    const talking =
      speaking === 'auto' ? turns.some(([a, b]) => t.value >= a && t.value < b) : speaking;
    const p = loop(t.value, 1200);
    return { opacity: talking ? 0.6 * (1 - p) : 0, transform: [{ scale: 1 + 0.4 * p }] };
  });
  // While talking, the avatar nods a little; otherwise it just breathes.
  const bob = useAnimatedStyle(() => {
    const talking =
      speaking === 'auto' ? turns.some(([a, b]) => t.value >= a && t.value < b) : speaking;
    return {
      transform: [
        { translateY: (talking ? -2 : -1) * wave(t.value, talking ? 600 : 3000, seat * 0.23) },
      ],
    };
  });
  const mic = useAnimatedStyle(() => {
    const talking =
      speaking === 'auto' ? turns.some(([a, b]) => t.value >= a && t.value < b) : speaking;
    return { opacity: talking ? 1 : 0 };
  });

  return (
    <Animated.View
      entering={popIn(120 + index * 90)}
      className="items-center gap-2"
      style={{ width: COL }}
    >
      <Animated.View style={[{ width: SIZE, height: SIZE }, bob]}>
        <Animated.View className="absolute inset-0 rounded-full bg-surface" style={ring} />
        {/* A white plate behind each face, so nobody blends into the room's colour. */}
        <View className="size-full items-center justify-center rounded-full bg-surface p-1">
          <View className={cn('size-full items-center justify-center rounded-full', avatar.bg)}>
            <Text className={cn('font-display text-headline', avatar.text)}>{member.letter}</Text>
          </View>
        </View>
        <View className="absolute bottom-0 right-0 size-7 items-center justify-center rounded-full bg-surface">
          <Icon name="mic-off" size={12} strokeWidth={2.6} />
          <Animated.View
            className="absolute inset-0 items-center justify-center rounded-full bg-teal"
            style={mic}
          >
            <Icon name="mic" size={12} tone="surface" strokeWidth={2.6} />
          </Animated.View>
        </View>
      </Animated.View>
      <Text numberOfLines={1} className="font-heavy text-body text-content">
        {id === 'you' ? 'You' : member.name}
      </Text>
    </Animated.View>
  );
}

type RoomPeopleProps = {
  inside: MemberId[];
  you: false | { talking: boolean };
  onInvite: () => void;
};

/** The room's people, centred on the stage: friends, you, then an Invite seat. */
export function RoomPeople({ inside, you, onInvite }: RoomPeopleProps) {
  return (
    <View className="flex-row flex-wrap justify-center gap-y-6">
      {inside.map((id, i) => (
        <Person key={id} id={id} seat={i} speaking="auto" index={i} />
      ))}
      {you ? <Person id="you" seat={0} speaking={you.talking} index={0} /> : null}
      <Animated.View
        entering={popIn(120 + (inside.length + 1) * 90, 0)}
        className="items-center gap-2"
        style={{ width: COL }}
      >
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Invite a friend to this room"
          onPress={onInvite}
          className="items-center justify-center rounded-full bg-surface/50"
          style={{ width: SIZE, height: SIZE }}
        >
          <Icon name="plus" size={26} strokeWidth={2.4} />
        </PressableScale>
        <Text className="font-heavy text-body text-content/70">Invite</Text>
      </Animated.View>
    </View>
  );
}
