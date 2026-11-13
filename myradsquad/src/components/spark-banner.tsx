import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeOutUp, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SparkMark } from '@/components/art/spark-mark';
import { SquadEmblem } from '@/components/art/squad-emblem';
import { PressableScale } from '@/components/ui';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { useAppStore } from '@/lib/app-store';
import { haptics } from '@/lib/haptics';
import { ALL_SQUADS } from '@/lib/mock-data';
import { TIMING_IN, TIMING_OUT } from '@/lib/motion';
import { openSquad } from '@/lib/navigation';
import { wakeCopy } from '@/lib/wake';

const VISIBLE_MS = 7000;

const dropIn = () => {
  'worklet';
  const config = { duration: 340, easing: TIMING_OUT };
  return {
    initialValues: { opacity: 0, transform: [{ translateY: -90 }] },
    animations: {
      opacity: withTiming(1, config),
      transform: [{ translateY: withTiming(0, config) }],
    },
  };
};

/**
 * Spark's question for a quiet squad, as a phone notification would show it (app name,
 * the squad, the question). Tap it and you land in the squad's chat with the question
 * there; your answer pings your friends and the squad comes back to life.
 */
export function SparkBanner() {
  const lip = useHardShadow(4);
  const insets = useSafeAreaInsets();
  const ping = useAppStore((s) => s.sparkPing);
  const dismiss = useAppStore((s) => s.dismissSparkPing);

  useEffect(() => {
    if (!ping) return;
    haptics.tap();
    const id = setTimeout(dismiss, VISIBLE_MS);
    return () => clearTimeout(id);
  }, [ping, dismiss]);

  if (!ping) return null;
  const squad = ALL_SQUADS.find((q) => q.id === ping.squadId);
  const { drop } = wakeCopy(ping.squadId);

  return (
    <Animated.View
      key={ping.id}
      entering={dropIn}
      exiting={FadeOutUp.duration(200).easing(TIMING_IN)}
      accessibilityLiveRegion="polite"
      className="absolute inset-x-3"
      style={{ top: insets.top + 6 }}
    >
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`Spark in ${squad?.name}: ${drop.text}. Opens the chat`}
        onPress={() => {
          dismiss();
          openSquad(ping.squadId);
        }}
        className="flex-row gap-3 rounded-[26px] bg-surface p-3"
        style={lip}
      >
        <SquadEmblem id={ping.squadId} size={40} />
        <View className="flex-1 gap-0.5">
          <View className="flex-row items-center gap-1.5">
            <Text className="flex-1 font-heavy text-caption text-content">
              {squad?.name ?? 'Your squad'}
            </Text>
            <Text className="font-text text-overline text-muted">now</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <SparkMark size={11} />
            <Text className="font-heavy text-overline text-muted">Spark · at most once a day</Text>
          </View>
          <Text numberOfLines={2} className="font-text text-body text-content">
            {drop.text}
          </Text>
        </View>
      </PressableScale>
    </Animated.View>
  );
}
