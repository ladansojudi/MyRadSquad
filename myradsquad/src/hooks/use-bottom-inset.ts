import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Space under a screen's last control: the iPhone safe area (34 pt over the home
 * indicator) plus 8 pt of breathing room, at least 24 pt on phones without one. Every
 * bottom bar uses it, so buttons sit at the same height on every screen.
 */
export function useBottomInset(extra = 0) {
  const insets = useSafeAreaInsets();
  return Math.max(insets.bottom + 8, 24) + extra;
}
