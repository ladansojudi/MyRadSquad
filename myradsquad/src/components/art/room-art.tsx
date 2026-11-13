import type { ReactElement } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { SceneClock, useSceneClock } from '@/components/motion/scene-clock';
import type { RoomKind, RoomTone } from '@/lib/mock-data';
import { bell, loop, seeded, wave } from '@/lib/motion';
import { cn } from '@/lib/utils';

const TILE: Record<RoomTone, string> = {
  cobalt: 'bg-cobalt',
  teal: 'bg-teal',
  coral: 'bg-accent',
  canvas: 'bg-canvas',
};

type PartProps = { u: number };

/** Voice: four bars rise and fall, slowly, like music in another room. */
function Voice({ u }: PartProps) {
  return (
    <View className="items-center justify-center" style={{ width: 44 * u, height: 44 * u }}>
      <View className="flex-row items-end" style={{ gap: 4 * u, height: 26 * u }}>
        {[0, 1, 2, 3].map((i) => (
          <Bar key={i} index={i} u={u} />
        ))}
      </View>
    </View>
  );
}

function Bar({ index, u }: { index: number; u: number }) {
  const t = useSceneClock();
  const style = useAnimatedStyle(() => {
    const a = (wave(t.value, 2400, seeded(index, 2)) + 1) / 2;
    const b = (wave(t.value, 3000, seeded(index, 5)) + 1) / 2;
    return { height: 26 * u * (0.45 + 0.55 * (0.6 * a + 0.4 * b)) };
  });
  return <Animated.View className="rounded-full bg-surface" style={[{ width: 7 * u }, style]} />;
}

/** Game: a die rocks slowly on its corner, as if about to be rolled. */
function Game({ u }: PartProps) {
  const t = useSceneClock();
  const hop = useAnimatedStyle(() => ({
    transform: [
      { translateY: -1.5 * u * wave(t.value, 3000) },
      { rotate: `${8 * wave(t.value, 4000)}deg` },
    ],
  }));
  const pip = 6 * u;
  const spots: [number, number][] = [
    [0.22, 0.22],
    [0.78, 0.22],
    [0.5, 0.5],
    [0.22, 0.78],
    [0.78, 0.78],
  ];
  const die = 30 * u;
  return (
    <View className="items-center justify-end" style={{ width: 44 * u, height: 46 * u }}>
      <Animated.View
        className="items-center justify-center rounded-[8px] bg-surface"
        style={[{ width: die, height: die }, hop]}
      >
        {spots.map(([x, y], i) => (
          <View
            key={i}
            className="absolute rounded-full bg-content"
            style={{
              width: pip,
              height: pip,
              left: x * (die - 4) - pip / 2,
              top: y * (die - 4) - pip / 2,
            }}
          />
        ))}
      </Animated.View>
      <View className="mt-1 rounded-full bg-content/20" style={{ width: 26 * u, height: 4 * u }} />
    </View>
  );
}

/** Focus: the clock's hand sweeps round, the bell on top gives a small tick every second. */
function Focus({ u }: PartProps) {
  const t = useSceneClock();
  const face = 36 * u;
  const sweep = useAnimatedStyle(() => ({
    transform: [{ rotate: `${360 * loop(t.value, 6000)}deg` }],
  }));
  const tick = useAnimatedStyle(() => {
    const p = loop(t.value, 1000);
    return { transform: [{ rotate: `${p < 0.15 ? 8 * bell(p / 0.15) : 0}deg` }] };
  });
  return (
    <View className="items-center justify-center" style={{ width: 44 * u, height: 46 * u }}>
      <Animated.View
        className="z-10 rounded-full bg-accent"
        style={[{ width: 12 * u, height: 8 * u, marginBottom: -3 * u }, tick]}
      />
      <View
        className="items-center justify-center rounded-full bg-surface"
        style={{ width: face, height: face }}
      >
        <Animated.View className="absolute inset-0 items-center" style={sweep}>
          <View
            className="rounded-full bg-content"
            style={{ width: 3 * u, height: face / 2 - 6 * u, marginTop: 4 * u }}
          />
        </Animated.View>
        <View className="rounded-full bg-content" style={{ width: 6 * u, height: 6 * u }} />
      </View>
    </View>
  );
}

/** Notes: the top page drifts over the stack; the pencil moves along a line, slowly. */
function Notes({ u }: PartProps) {
  const t = useSceneClock();
  const page = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-3 + 2 * wave(t.value, 4800)}deg` }],
  }));
  const pencil = useAnimatedStyle(() => ({
    transform: [
      { translateX: 2 * u * wave(t.value, 3000) },
      { translateY: 1.5 * u * wave(t.value, 3000, 0.25) },
      { rotate: '35deg' },
    ],
  }));
  const card = { width: 30 * u, height: 36 * u };
  return (
    <View className="items-center justify-center" style={{ width: 44 * u, height: 46 * u }}>
      <View
        className="absolute rounded-[6px] bg-cream"
        style={[card, { transform: [{ rotate: '10deg' }, { translateX: 4 * u }] }]}
      />
      <Animated.View
        className="rounded-[6px] bg-surface"
        style={[card, { paddingTop: 7 * u, paddingHorizontal: 5 * u, gap: 4 * u }, page]}
      >
        {[1, 0.8, 0.9, 0.55].map((w, i) => (
          <View
            key={i}
            className="rounded-full bg-content/70"
            style={{ height: 2.5 * u, width: `${w * 100}%` }}
          />
        ))}
      </Animated.View>
      <Animated.View
        className="absolute rounded-full bg-canvas"
        style={[{ width: 7 * u, height: 22 * u, right: 0, bottom: 2 * u }, pencil]}
      />
    </View>
  );
}

/** Moments: a polaroid rocks gently, like it was just pinned up. */
function Moments({ u }: PartProps) {
  const t = useSceneClock();
  const rock = useAnimatedStyle(() => ({
    transform: [{ rotate: `${3 * wave(t.value, 4800)}deg` }],
  }));
  return (
    <View className="items-center justify-center" style={{ width: 44 * u, height: 46 * u }}>
      <Animated.View
        className="rounded-[5px] bg-surface"
        style={[{ width: 32 * u, height: 38 * u, padding: 3 * u, paddingBottom: 9 * u }, rock]}
      >
        <View className="flex-1 items-center justify-center overflow-hidden rounded-[3px] bg-cobalt">
          <View className="rounded-full bg-canvas" style={{ width: 11 * u, height: 11 * u }} />
          <View
            className="absolute rounded-full bg-teal"
            style={{ width: 30 * u, height: 16 * u, bottom: -8 * u }}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const ART: Record<RoomKind, (p: PartProps) => ReactElement> = {
  voice: Voice,
  game: Game,
  focus: Focus,
  notes: Notes,
  moments: Moments,
};

type RoomArtProps = {
  kind: RoomKind;
  tone: RoomTone;
  size?: number;
  /** Moves while people are in the room; a quiet room is a still drawing. */
  alive?: boolean;
  className?: string;
};

/** A room's animated icon on its colored tile: what is going on inside, at a glance. */
export function RoomArt({ kind, tone, size = 64, alive = true, className }: RoomArtProps) {
  const Part = ART[kind];
  const art = <Part u={size / 64} />;
  return (
    <View
      className={cn('items-center justify-center', TILE[tone], className)}
      style={{ width: size, height: size, borderRadius: size * 0.3 }}
    >
      {alive ? <SceneClock>{art}</SceneClock> : art}
    </View>
  );
}

/** Text tag on a room: FUN or STUDY. */
export function VibeTag({ vibe, className }: { vibe: 'fun' | 'study'; className?: string }) {
  return (
    <View
      className={cn(
        'rounded-full px-2 py-0.5',
        vibe === 'fun' ? 'bg-accent/50' : 'bg-teal/50',
        className,
      )}
    >
      <Text className="font-heavy text-[10px] leading-[13px] tracking-widest text-content">
        {vibe === 'fun' ? 'FUN' : 'STUDY'}
      </Text>
    </View>
  );
}
