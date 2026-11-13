import { useState, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '@/lib/utils';

type ScreenProps = {
  children: ReactNode;
  className?: string;
  /** Extra space under the status bar. */
  topGap?: number;
  /**
   * Scroll when the content is taller than the screen (small iPhones, large text).
   * Scrolling stays off while everything fits, so it never fights gestures on the page.
   */
  scroll?: boolean;
  /** A native nav bar sits above (it already clears the status bar). */
  header?: boolean;
};

/** Full-height mustard page that clears the status bar. */
export function Screen({
  children,
  className,
  topGap = 16,
  scroll = false,
  header = false,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const top = (header ? 0 : insets.top) + topGap;
  const [viewHeight, setViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  if (!scroll) {
    return (
      <View className={cn('flex-1 bg-canvas', className)} style={{ paddingTop: top }}>
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      bounces={false}
      scrollEnabled={contentHeight > viewHeight + 1}
      keyboardShouldPersistTaps="handled"
      onLayout={(e) => setViewHeight(e.nativeEvent.layout.height)}
      onContentSizeChange={(_, h) => setContentHeight(h)}
      contentContainerClassName={cn('grow', className)}
      contentContainerStyle={{ paddingTop: top }}
    >
      {children}
    </ScrollView>
  );
}
