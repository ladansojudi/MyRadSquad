import { router, usePathname } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import {
  GestureDetector,
  GestureHandlerRootView,
  usePanGesture,
} from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FullWindowOverlay } from 'react-native-screens';

import { Icon } from '@/components/icon';
import { PressableScale } from '@/components/ui';
import { haptics } from '@/lib/haptics';
import { TIMING_OUT } from '@/lib/motion';
import { cn } from '@/lib/utils';

/** Big enough to find at a glance; mostly in the 16pt screen gutter. Drag it if it's in the way. */
const TAB_W = 26;
const TAB_H = 56;
const SNAP = { duration: 260, easing: TIMING_OUT };

/**
 * The prototype menu's handle: a small tab docked to the screen edge, on every screen
 * (above sheets and modals too). Tap it to jump anywhere; drag it up, down or to the
 * other edge if it ever sits on something. Not part of the product.
 */
function ProtoTab() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const minY = insets.top + 56;
  const maxY = height - insets.bottom - 150;
  const [side, setSide] = useState<'left' | 'right'>('right');
  const x = useSharedValue(width - TAB_W);
  const y = useSharedValue(Math.round(height * 0.42));
  const startY = useSharedValue(0);

  const pan = usePanGesture({
    runOnJS: true,
    activeOffsetX: [-8, 8],
    activeOffsetY: [-8, 8],
    onActivate: () => {
      startY.value = y.value;
    },
    onUpdate: (e) => {
      x.value = Math.min(width - TAB_W, Math.max(0, e.absoluteX - TAB_W / 2));
      y.value = Math.min(maxY, Math.max(minY, startY.value + e.translationY));
    },
    onDeactivate: (e) => {
      const next = e.absoluteX < width / 2 ? 'left' : 'right';
      setSide(next);
      x.value = withTiming(next === 'left' ? 0 : width - TAB_W, SNAP);
    },
  });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.tab, style]}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Prototype menu"
          accessibilityHint="Jump to any screen. Drag to move."
          hitSlop={{ top: 6, bottom: 6, left: 10, right: 10 }}
          onPress={() => {
            haptics.select();
            router.push('/prototype');
          }}
          className={cn(
            'size-full items-center justify-center bg-primary',
            side === 'right' ? 'rounded-l-2xl' : 'rounded-r-2xl',
          )}
        >
          <Icon name="widget" size={17} tone="surface" strokeWidth={2.6} />
        </PressableScale>
      </Animated.View>
    </GestureDetector>
  );
}

/** Mounted once in the root layout. Hidden while the menu itself is open. */
export function ProtoButton() {
  const pathname = usePathname();
  // Hidden while taking the design-file screenshots (EXPO_PUBLIC_SCREENSHOTS=1).
  if (process.env.EXPO_PUBLIC_SCREENSHOTS === '1' || pathname === '/prototype') return null;
  const tab = (
    <GestureHandlerRootView style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <ProtoTab />
    </GestureHandlerRootView>
  );
  // On iOS a full-window overlay keeps it above native sheets and full-screen modals.
  return Platform.OS === 'ios' ? (
    <FullWindowOverlay>{tab}</FullWindowOverlay>
  ) : (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {tab}
    </View>
  );
}

const styles = StyleSheet.create({
  tab: { position: 'absolute', top: 0, left: 0, width: TAB_W, height: TAB_H },
});
