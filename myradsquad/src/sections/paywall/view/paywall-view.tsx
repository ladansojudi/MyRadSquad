import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { RoomArt } from '@/components/art/room-art';
import { SparkMark } from '@/components/art/spark-mark';
import { Sparkle } from '@/components/art/sparkle';
import { Sticker } from '@/components/art/sticker';
import { BackButton } from '@/components/back-button';
import { SceneClock, useSceneClock } from '@/components/motion/scene-clock';
import { popIn } from '@/components/motion/pop-in';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { useAppStore, type Purpose } from '@/lib/app-store';
import { SQUAD_NAME } from '@/lib/mock-data';
import { wave } from '@/lib/motion';
import { leavePaywall, type PaywallSource } from '@/lib/navigation';
import { PaywallActions } from '@/sections/paywall/paywall-actions';
import { PaywallPlans } from '@/sections/paywall/paywall-plans';
import { PaywallLayout } from '@/sections/paywall/paywall-sheet';

/** What they came for ("What are you here for?") leads; the rest follows. Seats come last. */
const BY_PURPOSE: Record<Purpose, { title: string; lead: 'game' | 'focus' | 'voice' }> = {
  hangout: {
    title: 'Play more, together.',
    lead: 'game',
  },
  study: {
    title: 'Study together, for real.',
    lead: 'focus',
  },
  moments: {
    title: 'Make it look like you.',
    lead: 'voice',
  },
};

const LEAD_TONE = { game: 'coral', focus: 'teal', voice: 'cobalt' } as const;

/** Drifts a few points up and down, out of phase with its neighbours. */
function Float({ phase, children }: { phase: number; children: ReactNode }) {
  const t = useSceneClock();
  const drift = useAnimatedStyle(() => ({
    transform: [{ translateY: 4 * wave(t.value, 3400, phase) }],
  }));
  return <Animated.View style={drift}>{children}</Animated.View>;
}

/** The Squad+ things themselves: the room they came for, Spark, a sticker. */
function PaywallArt({ height, lead }: { height: number; lead: 'game' | 'focus' | 'voice' }) {
  const lip = useHardShadow(4);
  const size = Math.max(96, Math.min(150, height * 0.62));
  return (
    <SceneClock>
      <View style={{ width: size * 2.3, height: Math.min(height, size * 1.45) }}>
        <Animated.View
          entering={popIn(80, -10)}
          className="absolute"
          style={{ left: size * 0.65, top: size * 0.12 }}
        >
          <Float phase={0.4}>
            <RoomArt kind={lead} tone={LEAD_TONE[lead]} size={size} />
          </Float>
        </Animated.View>
        <Animated.View
          entering={popIn(320, 8)}
          className="absolute size-14 items-center justify-center rounded-2xl bg-surface"
          style={[lip, { right: 0, top: size * 0.05 }]}
        >
          <Float phase={0.1}>
            <SparkMark size={24} alive />
          </Float>
        </Animated.View>
        <Animated.View
          entering={popIn(480, 10)}
          className="absolute left-0"
          style={{ top: size * 0.62 }}
        >
          <Sticker label="LOL" tone="cobalt" size="sm" rotate={10} alive phase={0.3} />
        </Animated.View>
        <View className="absolute" style={{ left: size * 0.2, top: size * 0.95 }}>
          <Sparkle size={22} alive phase={0.8} />
        </View>
      </View>
    </SceneClock>
  );
}

function PaywallClose({ source }: { source: PaywallSource }) {
  return (
    <View className="flex-row">
      <BackButton icon="close" tone="surface" onPress={() => leavePaywall(source)} />
    </View>
  );
}

/**
 * Paywall A (fun and AI): almost no reading. What they came for leads (title, art, first
 * tile), each Squad+ thing is a picture and a word, 12 friends last (teens pay for fun and
 * AI, not seats). Annual pre-selected and shown per month, "No thanks" always visible.
 */
export function PaywallView({ source }: { source: PaywallSource }) {
  const purpose = useAppStore((s) => s.purpose);
  const { title, lead } = BY_PURPOSE[purpose];

  return (
    <PaywallLayout
      overlay={<PaywallClose source={source} />}
      art={(h) => <PaywallArt height={h} lead={lead} />}
    >
      <View className="flex-row items-center gap-2">
        <View className="rounded-full bg-content px-2.5 py-1">
          <Text className="font-heavy text-overline text-brand-content">Squad+</Text>
        </View>
        <Text className="font-strong text-caption text-muted">for {SQUAD_NAME}</Text>
      </View>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        className="mt-2 font-display text-headline text-content"
      >
        {title}
      </Text>

      <View className="mt-5">
        <PaywallPlans />
      </View>
      <Text className="mt-3 mb-2 text-center font-text text-caption text-muted">
        3 days free · we remind you on day 2
      </Text>
      <PaywallActions
        source={source}
        label="Try 3 days free"
        note="Under 18? A parent approves it."
      />
    </PaywallLayout>
  );
}
