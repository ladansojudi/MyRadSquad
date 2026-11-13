import { useState, type ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '@/lib/utils';

type FillSpaceProps = {
  /** Never shrink below this (pt); on very short phones the screen scrolls instead. */
  min: number;
  /** Renders the illustration for the height that is actually left on screen. */
  children: (height: number) => ReactNode;
  className?: string;
};

/**
 * Takes all the vertical space the rest of the screen leaves and hands its height to an
 * illustration, so art grows on tall phones and shrinks on small ones instead of
 * pushing buttons off screen.
 */
export function FillSpace({ min, children, className }: FillSpaceProps) {
  const [height, setHeight] = useState(0);
  return (
    <View
      className={cn('flex-1 items-center justify-center', className)}
      style={{ minHeight: min }}
      onLayout={(e) => setHeight(Math.round(e.nativeEvent.layout.height))}
    >
      {height > 0 ? children(height) : null}
    </View>
  );
}
