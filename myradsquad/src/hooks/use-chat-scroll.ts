import { useRef } from 'react';
import type { ScrollViewInstance } from 'react-native';

/** Props for a chat ScrollView: stick to the newest message, drag down to hide the keyboard. */
export function useChatScroll() {
  const ref = useRef<ScrollViewInstance>(null);
  return {
    ref,
    onContentSizeChange: () => ref.current?.scrollToEnd({ animated: true }),
    keyboardDismissMode: 'interactive' as const,
    keyboardShouldPersistTaps: 'handled' as const,
  };
}
