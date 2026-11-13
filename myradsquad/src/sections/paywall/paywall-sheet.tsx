import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBottomInset } from '@/hooks/use-bottom-inset';
import { FillSpace } from '@/components/fill-space';

type PaywallLayoutProps = {
  /** Controls pinned to the top of the art (close button, badges). */
  overlay?: ReactNode;
  /** The illustration, sized to the space the panel leaves. */
  art: (height: number) => ReactNode;
  children: ReactNode;
};

const ART_MIN = 150;

/**
 * Mustard illustration on top, white panel below. The panel keeps its natural height and
 * the art takes whatever is left, so the buttons and legal line always fit on screen.
 * Only phones too short for the smallest art scroll.
 */
export function PaywallLayout({ overlay, art, children }: PaywallLayoutProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = useBottomInset();
  return (
    <View className="flex-1 bg-canvas">
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        contentContainerClassName="grow"
      >
        <View className="flex-1" style={{ paddingTop: insets.top + 4 }}>
          <FillSpace min={ART_MIN}>{(h) => art(h - 8)}</FillSpace>
          {overlay ? (
            <View
              pointerEvents="box-none"
              className="absolute inset-x-0 px-6"
              style={{ top: insets.top + 8 }}
            >
              {overlay}
            </View>
          ) : null}
        </View>
        <View
          className="rounded-t-[32px] bg-surface px-6 pt-5"
          style={{ paddingBottom: bottomInset }}
        >
          {children}
        </View>
      </ScrollView>
    </View>
  );
}
