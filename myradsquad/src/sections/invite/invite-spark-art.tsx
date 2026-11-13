import { useEffect } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { SeatTile } from '@/components/art/seat-tile';
import { SparkMark } from '@/components/art/spark-mark';
import { Sticker } from '@/components/art/sticker';
import { popIn } from '@/components/motion/pop-in';
import { SceneClock } from '@/components/motion/scene-clock';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { TIMING_OUT } from '@/lib/motion';

// Same 354×330 stage as the invite art, scaled down (never up) to the space left.
const ART_W = 354;
const ART_H = 344;
const ARRIVE = { quiet: 80, card: 260, leo: 1500, lol: 1700 };

const VOTES = [
  { letter: 'L', name: 'Leo', tone: 'cobalt', share: 0.6 },
  { letter: 'M', name: 'Maya', tone: 'coral', share: 0.25 },
  { letter: 'J', name: 'Jordan', tone: 'teal', share: 0.15 },
] as const;

/** One option of the vote: its bar grows to its share once the card has landed (draw-on). */
function VoteRow({ vote, index }: { vote: (typeof VOTES)[number]; index: number }) {
  const fill = useSharedValue(0);
  useEffect(() => {
    fill.value = withDelay(
      ARRIVE.card + 500 + index * 140,
      withTiming(vote.share, { duration: 700, easing: TIMING_OUT }),
    );
  }, [fill, vote.share, index]);
  const bar = useAnimatedStyle(() => ({ width: `${fill.value * 100}%` }));
  return (
    <View className="h-12 flex-row items-center gap-2.5 overflow-hidden rounded-full bg-canvas pl-2.5 pr-4">
      <Animated.View
        style={bar}
        className={
          vote.tone === 'cobalt'
            ? 'absolute inset-y-0 left-0 bg-cobalt/45'
            : vote.tone === 'coral'
              ? 'absolute inset-y-0 left-0 bg-accent/40'
              : 'absolute inset-y-0 left-0 bg-teal/45'
        }
      />
      <SeatTile letter={vote.letter} tone={vote.tone} size={28} dot={false} />
      <Text className="flex-1 font-heavy text-body text-content">{vote.name}</Text>
      <Text className="font-strong text-caption text-content">{Math.round(vote.share * 100)}%</Text>
    </View>
  );
}

/** Feature screen 3: the chat went quiet, Spark drops one vote, the squad answers. */
export function InviteSparkArt({ height }: { height: number }) {
  const lip = useHardShadow(4);
  const { width } = useWindowDimensions();
  const scale = Math.min(1, height / ART_H, (width - 48) / ART_W);
  return (
    <SceneClock>
      <View
        style={{
          width: ART_W,
          height: ART_H,
          transform: [{ scale }],
          marginVertical: (ART_H * scale - ART_H) / 2,
          marginHorizontal: (ART_W * scale - ART_W) / 2,
        }}
      >
        <Animated.View entering={popIn(ARRIVE.quiet, 0)} className="items-center">
          <Text className="font-text text-caption text-muted">· 3 hours quiet ·</Text>
        </Animated.View>
        <Animated.View
          entering={popIn(ARRIVE.card, -4)}
          className="mx-[18px] mt-3 gap-3 rounded-[26px] bg-surface p-4"
          style={lip}
        >
          <View className="flex-row items-center gap-1.5">
            <SparkMark size={13} alive />
            <Text className="flex-1 font-heavy text-overline tracking-widest text-content">
              SPARK · VOTE
            </Text>
          </View>
          <Text className="font-display text-subtitle text-content">
            {"Who's always late to lunch?"}
          </Text>
          <View className="gap-2">
            {VOTES.map((vote, i) => (
              <VoteRow key={vote.letter} vote={vote} index={i} />
            ))}
          </View>
        </Animated.View>
        <Animated.View entering={popIn(ARRIVE.lol, 10)} className="absolute right-0 top-[290px]">
          <Sticker label="LOL" tone="cobalt" rotate={-6} alive phase={0.4} />
        </Animated.View>
        <Animated.View entering={popIn(ARRIVE.leo, -8)} className="absolute left-[6px] top-[296px]">
          <Sticker label="it's leo 💀" tone="surface" rotate={5} alive phase={0.1} />
        </Animated.View>
      </View>
    </SceneClock>
  );
}
