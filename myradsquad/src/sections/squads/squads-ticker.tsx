import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

import { useLive } from '@/hooks/use-live';
import { TIMING_IN, TIMING_OUT } from '@/lib/motion';

export type TickerLine = { who: string; text: string };

const EVERY_MS = 2800;

/**
 * One line of the squad's chat. While the squad is live, recent messages roll through
 * it (new one rises in, old one leaves upward), so the card reads as a conversation in
 * progress. A quiet squad shows its last message, still.
 */
export function SquadsTicker({ lines, running }: { lines: TickerLine[]; running: boolean }) {
  const live = useLive();
  const [tick, setTick] = useState(0);
  const rolling = running && live && lines.length > 1;

  useEffect(() => {
    if (!rolling) return;
    const id = setInterval(() => setTick((n) => n + 1), EVERY_MS);
    return () => clearInterval(id);
  }, [rolling]);

  if (!lines.length) return <View className="h-[19px] flex-1" />;
  const index = rolling ? (lines.length - 1 + tick) % lines.length : lines.length - 1;
  const line = lines[index];

  return (
    <View className="h-[19px] flex-1 overflow-hidden">
      <Animated.Text
        key={`${tick}-${index}`}
        entering={rolling && tick > 0 ? FadeInDown.duration(260).easing(TIMING_OUT) : undefined}
        exiting={rolling ? FadeOutUp.duration(180).easing(TIMING_IN) : undefined}
        numberOfLines={1}
        className="absolute inset-x-0 top-0 font-text text-caption text-muted"
      >
        <Text className="font-heavy text-content">{line.who}:</Text> {line.text}
      </Animated.Text>
    </View>
  );
}
