import { Platform } from 'react-native';

import { usePalette } from '@/hooks/use-palette';

const IOS = Platform.OS === 'ios';

/**
 * Native iOS header options, in the app's typography.
 * - `large`: tab roots. Large title that collapses into the bar on scroll, the header floats
 *   over content (iOS 26 Liquid Glass) with a soft scroll-edge effect.
 * - `inline`: pushed screens (chats, notes). Standard inline title, minimal back chevron.
 */
export function useNavOptions() {
  const p = usePalette();
  const fonts = {
    headerTitleStyle: { fontFamily: 'Rubik-Medium', fontSize: 17, color: p.ink },
    headerLargeTitleStyle: { fontFamily: 'Rubik-SemiBold', color: p.ink },
    headerTintColor: p.ink,
    headerBackButtonDisplayMode: 'minimal' as const,
    headerShadowVisible: false,
  };
  return {
    large: {
      ...fonts,
      headerShown: true,
      headerLargeTitleEnabled: true,
      headerLargeTitleShadowVisible: false,
      headerTransparent: IOS,
      scrollEdgeEffects: { top: 'soft' as const, bottom: 'soft' as const },
      contentStyle: { backgroundColor: p.canvas },
    },
    inline: (background: 'canvas' | 'surface' = 'canvas') => ({
      ...fonts,
      headerShown: true,
      headerTransparent: false,
      headerStyle: { backgroundColor: p[background] },
      contentStyle: { backgroundColor: p[background] },
    }),
  };
}
