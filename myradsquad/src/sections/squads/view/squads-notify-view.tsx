import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Sticker } from '@/components/art/sticker';
import { BottomSheet } from '@/components/bottom-sheet';
import { Button, TextLink } from '@/components/ui';
import { Wireframe } from '@/components/wireframe';
import { useAppStore } from '@/lib/app-store';
import { cn } from '@/lib/utils';
import { requestNotificationPermission } from '@/lib/notify-permission';

const PROMISES = [
  { tone: 'bg-accent', text: 'At most 1 notification a day' },
  { tone: 'bg-teal', text: 'Only from your squads, never ads' },
  { tone: 'bg-cobalt', text: 'Change it anytime in You › Notifications' },
];

/** "Want a heads-up…" — asked right after the first answer, never at launch. */
function SquadsNotifyViewContent() {
  const setNotificationsOn = useAppStore((s) => s.setNotificationsOn);

  return (
    <BottomSheet>
      <View className="flex-row items-center gap-5">
        <View className="ml-2">
          <Sticker label="SAME" tone="teal" size="sm" rotate={-8} alive />
        </View>
        <Text className="font-heavy text-caption text-live">You unlocked 3 answers</Text>
      </View>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        className="mt-5 font-display text-headline text-content"
      >
        Get a heads-up?
      </Text>
      <View className="mt-4 gap-2.5 rounded-2xl bg-cream px-4 py-4">
        {PROMISES.map((p) => (
          <View key={p.text} className="flex-row items-center gap-3">
            <View className={cn('size-4 rounded-[5px]', p.tone)} />
            <Text className="font-text text-body text-content">{p.text}</Text>
          </View>
        ))}
      </View>
      <Button
        label="Turn on"
        className="mt-5"
        onPress={() => {
          // Our pre-prompt first, then the real iOS prompt: only people who said yes see it.
          router.back();
          requestNotificationPermission().then((allowed) => setNotificationsOn(allowed));
        }}
      />
      <TextLink label="Not now" className="mt-1" onPress={() => router.back()} />
    </BottomSheet>
  );
}

/** Outside the six solutions: shown as a wireframe. */
export function SquadsNotifyView() {
  return (
    <Wireframe sheet="fit">
      <SquadsNotifyViewContent />
    </Wireframe>
  );
}
