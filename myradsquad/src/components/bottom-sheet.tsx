import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { useBottomInset } from '@/hooks/use-bottom-inset';
import { cn } from '@/lib/utils';

type BottomSheetProps = {
  children: ReactNode;
  /**
   * Large sheet with scrolling content. The ScrollView is the sheet's root, as native
   * iOS form sheets expect (so dragging the content expands/dismisses the sheet).
   */
  fill?: boolean;
  className?: string;
};

/**
 * Content of a native iOS form sheet. The sheet itself (grabber, corner radius, Liquid
 * Glass, swipe to dismiss, dimming) is the system's: see the routes' `presentation`.
 */
export function BottomSheet({ children, fill = false, className }: BottomSheetProps) {
  const bottomInset = useBottomInset();
  const paddingBottom = bottomInset;

  if (fill) {
    return (
      <ScrollView
        className="bg-surface"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName={cn('px-6 pt-7', className)}
        contentContainerStyle={{ paddingBottom }}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View className={cn('bg-surface px-6 pt-7', className)} style={{ paddingBottom }}>
      {children}
    </View>
  );
}
