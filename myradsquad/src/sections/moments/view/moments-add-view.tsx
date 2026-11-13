import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { BottomSheet } from '@/components/bottom-sheet';
import { Icon } from '@/components/icon';
import { Button, PressableScale, TextLink, TextField } from '@/components/ui';
import { Wireframe } from '@/components/wireframe';
import { useAppStore } from '@/lib/app-store';
import { haptics } from '@/lib/haptics';
import { MOMENT_LOOKS, SQUAD_NAME } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { MOMENT_BG, MomentsPhoto } from '@/sections/moments/moments-photo';

/** Post a moment (mock camera): pick a shot, add a caption, gone in 24h. */
function MomentsAddViewContent() {
  const [look, setLook] = useState(0);
  const [caption, setCaption] = useState('');
  const postMoment = useAppStore((s) => s.postMoment);
  const showToast = useAppStore((s) => s.showToast);

  const post = () => {
    haptics.success();
    postMoment(caption.trim() || 'right now', MOMENT_LOOKS[look]);
    showToast(`Posted to ${SQUAD_NAME}`);
    router.back();
  };

  return (
    <>
      <BottomSheet>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          className="font-display text-headline text-content"
        >
          New moment
        </Text>
        <Text className="mt-1 font-text text-body text-muted">
          Only {SQUAD_NAME} sees it. Gone in 24h.
        </Text>

        <MomentsPhoto
          tones={MOMENT_LOOKS[look]}
          caption={caption.trim() || undefined}
          height={190}
          className="mt-4"
        />

        <View className="mt-3 flex-row items-center gap-3">
          <View className="size-11 items-center justify-center rounded-full bg-content">
            <Icon name="camera" size={20} tone="surface" />
          </View>
          {MOMENT_LOOKS.map((tones, i) => (
            <PressableScale
              key={tones.join('-')}
              accessibilityLabel={`Shot ${i + 1}`}
              accessibilityState={{ selected: look === i }}
              onPress={() => {
                haptics.select();
                setLook(i);
              }}
              className={cn(
                'size-11 rounded-xl',
                MOMENT_BG[tones[0]],
                look === i ? 'scale-110' : 'opacity-50',
              )}
            />
          ))}
        </View>

        <TextField
          className="mt-3"
          value={caption}
          onChangeText={setCaption}
          maxLength={40}
          placeholder="Add a caption"
          returnKeyType="done"
        />

        <Button label="Post moment" className="mt-4" onPress={post} />
        <TextLink label="Not now" className="mt-1" onPress={() => router.back()} />
      </BottomSheet>
    </>
  );
}

/** Outside the six solutions: shown as a wireframe. */
export function MomentsAddView() {
  return (
    <Wireframe sheet="fit">
      <MomentsAddViewContent />
    </Wireframe>
  );
}
