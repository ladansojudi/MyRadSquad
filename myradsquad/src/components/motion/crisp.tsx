import type { ReactNode } from 'react';
import { View } from 'react-native';

/**
 * Keeps a tilted or wiggling bordered shape smooth on iOS.
 *
 * iOS does not anti-alias the border layers (or children) of a rotated view, so a tilted
 * card shows stair-stepped edges. Rendering the content once into a bitmap with a
 * transparent margin moves its visible edges inside that bitmap, where the rotation is
 * filtered smoothly. The negative margin keeps the layout exactly the same.
 */
export function Crisp({ children, pad = 6 }: { children: ReactNode; pad?: number }) {
  return (
    <View shouldRasterizeIOS style={{ padding: pad, margin: -pad }}>
      {children}
    </View>
  );
}
