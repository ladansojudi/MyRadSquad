import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Sticker } from '@/components/art/sticker';
import { BottomSheet } from '@/components/bottom-sheet';
import { PressableScale, TextLink } from '@/components/ui';
import { Wireframe } from '@/components/wireframe';
import { useAppStore, type ThreadId } from '@/lib/app-store';
import { haptics } from '@/lib/haptics';
import { STICKERS } from '@/lib/mock-data';

/** Sticker drawer: one tap drops a sticker into the chat you came from. */
function StickersViewContent({ thread }: { thread: ThreadId }) {
  const sendSticker = useAppStore((s) => s.sendSticker);

  return (
    <BottomSheet>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        className="font-display text-headline text-content"
      >
        Stickers
      </Text>
      <Text className="mt-1 font-text text-body text-muted">Tap one to send it.</Text>
      <View className="mt-5 flex-row flex-wrap justify-between gap-y-5">
        {STICKERS.map((s, i) => (
          <PressableScale
            key={s.label}
            accessibilityRole="button"
            accessibilityLabel={`Send ${s.label} sticker`}
            onPress={() => {
              haptics.tap();
              sendSticker(thread, s.label, s.tone);
              router.back();
            }}
            className="w-[48%] items-center justify-center py-2"
          >
            <Sticker label={s.label} tone={s.tone} size="sm" rotate={i % 2 ? 5 : -5} />
          </PressableScale>
        ))}
      </View>
      <TextLink label="Close" className="mt-3" onPress={() => router.back()} />
    </BottomSheet>
  );
}

/** Outside the six solutions: shown as a wireframe. */
export function StickersView(props: { thread: ThreadId }) {
  return (
    <Wireframe sheet="fit">
      <StickersViewContent {...props} />
    </Wireframe>
  );
}
