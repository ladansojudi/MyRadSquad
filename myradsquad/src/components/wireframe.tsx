import { Image, type ImageProps } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import { useCallback, type ReactNode } from 'react';
import { Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FullWindowOverlay } from 'react-native-screens';
import { ScopedTheme } from 'uniwind';

import { Icon } from '@/components/icon';
import { useDashedEdge } from '@/hooks/use-hard-shadow';
import { useIsWireframe } from '@/hooks/use-is-wireframe';
import { useWireframeStore } from '@/lib/wireframe-store';

export { useIsWireframe };

/**
 * A screen outside the six solutions on the research dashboard, shown as a high-fidelity
 * wireframe: the real layout and copy in greys (cards, art and buttons included), photos
 * as placeholders, and a "Wireframe" tag, so it reads as not designed yet.
 */
export function Wireframe({
  children,
  sheet,
}: {
  children: ReactNode;
  /** In a sheet: `fit` sizes to its content, `fill` takes the whole sheet. */
  sheet?: 'fit' | 'fill';
}) {
  const enter = useWireframeStore((s) => s.enter);
  const leave = useWireframeStore((s) => s.leave);
  // While this screen is in focus, the "Wireframe" tag shows (see WireframeTag).
  useFocusEffect(
    useCallback(() => {
      enter();
      return leave;
    }, [enter, leave]),
  );
  return (
    <ScopedTheme theme="wireframe">
      <View className={sheet === 'fit' ? undefined : 'flex-1 bg-canvas'}>{children}</View>
    </ScopedTheme>
  );
}

/**
 * The "Wireframe" tag, mounted once in the root layout. It sits in the free band under the
 * Dynamic Island (above sheets too) while a wireframe screen is open, so it never covers
 * a screen's own title or buttons.
 */
export function WireframeTag() {
  const insets = useSafeAreaInsets();
  const open = useWireframeStore((s) => s.open > 0);
  if (!open) return null;
  const tag = (
    <View
      pointerEvents="none"
      className="absolute inset-x-0 items-center"
      style={{ top: insets.top - 14 }}
    >
      <View
        accessibilityLabel="Wireframe, not designed yet"
        className="rounded-full bg-content px-2"
      >
        <Text className="font-heavy text-[10px] leading-[14px] tracking-widest text-brand-content">
          WIREFRAME
        </Text>
      </View>
    </View>
  );
  return Platform.OS === 'ios' ? <FullWindowOverlay>{tag}</FullWindowOverlay> : tag;
}

/** A photo; in a wireframe, a grey placeholder with a photo glyph instead. */
export function PhotoImage({ style, ...props }: ImageProps) {
  const wire = useIsWireframe();
  const dashed = useDashedEdge();
  if (!wire) return <Image style={style} {...props} />;
  return (
    <View style={[style as object, dashed]} className="items-center justify-center bg-cream">
      <Icon name="photo" size={28} tone="muted" />
    </View>
  );
}
