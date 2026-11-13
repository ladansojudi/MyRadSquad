import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { SeatTile } from '@/components/art/seat-tile';
import { BackButton } from '@/components/back-button';
import { Button } from '@/components/ui';
import { Wireframe } from '@/components/wireframe';
import { FOCUS_TOTAL_S, formatClock, useFocusCountdown } from '@/hooks/use-focus-countdown';
import { usePalette } from '@/hooks/use-palette';
import { useBottomInset } from '@/hooks/use-bottom-inset';
import { deepen } from '@/lib/color';
import { useAppStore } from '@/lib/app-store';
import { haptics } from '@/lib/haptics';
import { MEMBERS } from '@/lib/mock-data';
import { TIMING_OUT } from '@/lib/motion';

const RING = 248;
const STROKE = 18;

/** How much of the session is left, as a ring that empties clockwise. */
function ProgressRing({ left }: { left: number }) {
  const p = usePalette();
  const r = (RING - STROKE) / 2 - 4;
  const c = 2 * Math.PI * r;
  const done = 1 - left / FOCUS_TOTAL_S;
  return (
    <Svg width={RING} height={RING} viewBox={`0 0 ${RING} ${RING}`}>
      <Circle cx={RING / 2} cy={RING / 2 + 5} r={r + STROKE / 2} fill={deepen(p.teal)} />
      <Circle cx={RING / 2} cy={RING / 2} r={r + STROKE / 2} fill={p.surface} />
      <Circle cx={RING / 2} cy={RING / 2} r={r} fill="none" stroke={p.cream} strokeWidth={STROKE} />
      <Circle
        cx={RING / 2}
        cy={RING / 2}
        r={r}
        fill="none"
        stroke={p.teal}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray={`${c} ${c}`}
        strokeDashoffset={c * done}
        transform={`rotate(-90 ${RING / 2} ${RING / 2})`}
      />
    </Svg>
  );
}

/** Focus session: study "together, quietly" — a shared timer, who's in, and the chat muted. */
function FocusViewContent() {
  const insets = useSafeAreaInsets();
  const bottomInset = useBottomInset();
  const left = useFocusCountdown();
  const [joined, setJoined] = useState(false);
  const showToast = useAppStore((s) => s.showToast);
  const people = joined
    ? [MEMBERS.jordan, MEMBERS.leo, MEMBERS.you]
    : [MEMBERS.jordan, MEMBERS.leo];

  return (
    <View
      className="flex-1 bg-teal px-6"
      style={{ paddingTop: insets.top + 16, paddingBottom: bottomInset }}
    >
      <View className="flex-row items-center gap-3">
        <BackButton icon="close" tone="surface" onPress={() => router.back()} />
        <View className="flex-1">
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            className="font-display text-subtitle text-teal-content"
          >
            Focus session
          </Text>
          <Text className="font-text text-caption text-teal-content/85">
            Bio exam in 3 days · 25 min
          </Text>
        </View>
      </View>

      <View className="flex-1 items-center justify-center">
        <View className="items-center justify-center">
          <ProgressRing left={left} />
          <View className="absolute items-center">
            <Text
              className="font-display text-[52px] leading-[58px] text-content"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatClock(left)}
            </Text>
            <Text className="font-text text-caption text-muted">left in this round</Text>
          </View>
        </View>

        <View className="mt-8 flex-row items-center gap-3">
          {people.map((m) => (
            <Animated.View key={m.id} entering={FadeIn.duration(220).easing(TIMING_OUT)}>
              <SeatTile
                letter={m.letter}
                // Teal people would vanish on the teal screen: show them in white.
                tone={m.tone === 'teal' ? 'surface' : m.tone === 'surface' ? 'ink' : m.tone}
                shape="leaf"
                size={44}
              />
            </Animated.View>
          ))}
        </View>
        <Text className="mt-3 font-text text-body text-teal-content">
          {joined ? 'You, Jordan and Leo are focusing' : 'Jordan and Leo are focusing'}
        </Text>
      </View>

      {joined ? (
        <Button
          label="Leave session"
          variant="outline"
          onPress={() => {
            haptics.tap();
            setJoined(false);
          }}
        />
      ) : (
        <Button
          label="Join the session"
          variant="mustard"
          onPress={() => {
            haptics.success();
            setJoined(true);
            showToast("You're in · phone down");
          }}
        />
      )}
    </View>
  );
}

/** Outside the six solutions: shown as a wireframe. */
export function FocusView() {
  return (
    <Wireframe>
      <FocusViewContent />
    </Wireframe>
  );
}
