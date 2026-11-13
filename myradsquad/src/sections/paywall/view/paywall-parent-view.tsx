import { Text, View } from 'react-native';

import { ClockTable } from '@/components/art/clock-table';
import { BottomSheet } from '@/components/bottom-sheet';
import { Button, TextLink } from '@/components/ui';
import { useAppStore } from '@/lib/app-store';
import { goHome } from '@/lib/navigation';

/** Ask to Buy confirmation for under-18s. */
export function PaywallParentView() {
  const plan = useAppStore((s) => s.plan);
  const price = plan === 'yearly' ? '$29.99 a year' : '$3.99 a week';
  const backToSquad = goHome;

  return (
    <BottomSheet>
      <View className="items-center">
        <ClockTable size={190} />
      </View>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        className="mt-4 text-center font-display text-headline text-content"
      >
        Sent to your parent
      </Text>
      <Text className="mt-3 text-center font-text text-body text-muted">
        Squad+ turns on when they say yes. Your table stays free meanwhile.
      </Text>
      <View className="mt-6 rounded-[18px] bg-canvas px-4 py-3">
        <Text className="font-text text-body text-content">
          <Text className="font-display">Tip:</Text> {`${price}, 3 days free.`}
        </Text>
      </View>
      <Button label="Back to my squad" className="mt-5" onPress={backToSquad} />
      <TextLink label="Not now" onPress={backToSquad} />
    </BottomSheet>
  );
}
