import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '@/lib/utils';

/**
 * A tab's title row, the same on every tab: big title (and a line under it), an optional
 * action on the right. Drawn by the screen itself so every tab's title starts at the same
 * height, right under the status bar (a native large title sits a nav bar lower).
 */
export function TabTitle({
  title,
  subtitle,
  right,
  className,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <View className={cn('flex-row items-center gap-3 pt-2', className)}>
      <View className="flex-1">
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          accessibilityRole="header"
          className="font-display text-title text-content"
        >
          {title}
        </Text>
        {subtitle ? <Text className="font-text text-caption text-muted">{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

/** Content scrolls under the status bar: a canvas band keeps the clock readable. */
export function StatusBand() {
  const insets = useSafeAreaInsets();
  return (
    <View
      pointerEvents="none"
      className="absolute inset-x-0 top-0 bg-canvas"
      style={{ height: insets.top }}
    />
  );
}
