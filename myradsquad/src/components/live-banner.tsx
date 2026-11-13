import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeOutUp, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AvatarStack } from '@/components/avatar-stack';
import { LiveDot } from '@/components/motion/live-dot';
import { PressableScale } from '@/components/ui';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { useAppStore } from '@/lib/app-store';
import { haptics } from '@/lib/haptics';
import { TIMING_IN, TIMING_OUT } from '@/lib/motion';
import { openSquad } from '@/lib/navigation';

const VISIBLE_MS = 6000;

/** Drops in from above the screen edge with ease-out (never from nothing). */
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
 * In-app "a squad just came alive" banner. Animated on purpose: faces pop in one by one
 * and the newest arrival pulses, so you see who joined before reading. iOS push
 * notifications stay plain text (and at most one a day); this only shows inside the app.
 */
export function LiveBanner() {
  const lip = useHardShadow(4);
  const insets = useSafeAreaInsets();
  const alert = useAppStore((s) => s.liveAlert);
  const dismiss = useAppStore((s) => s.dismissLiveAlert);

  useEffect(() => {
    if (!alert) return;
    haptics.tap();
    const id = setTimeout(dismiss, VISIBLE_MS);
    return () => clearTimeout(id);
  }, [alert, dismiss]);

  if (!alert) return null;

  return (
    <Animated.View
      key={alert.id}
      entering={dropIn}
      exiting={FadeOutUp.duration(200).easing(TIMING_IN)}
      accessibilityLiveRegion="polite"
      className="absolute inset-x-4"
      style={{ top: insets.top + 6 }}
    >
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`${alert.title}. ${alert.detail}. Join`}
        onPress={() => {
          dismiss();
          openSquad(alert.squadId);
        }}
        className="flex-row items-center gap-3 rounded-[22px] bg-surface px-3 py-3"
        style={lip}
      >
        <AvatarStack ids={alert.faces} size={34} pop live />
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <LiveDot size={8} />
            <Text numberOfLines={1} className="flex-1 font-heavy text-body text-content">
              {alert.title}
            </Text>
          </View>
          <Text numberOfLines={2} className="font-text text-caption text-muted">
            {alert.detail}
          </Text>
        </View>
        <View className="rounded-full bg-teal px-3 py-1.5">
          <Text className="font-heavy text-caption text-teal-content">Join</Text>
        </View>
      </PressableScale>
    </Animated.View>
  );
}
