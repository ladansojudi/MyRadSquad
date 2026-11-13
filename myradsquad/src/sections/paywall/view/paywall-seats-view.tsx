import { Text, View } from 'react-native';

import { AvatarStack } from '@/components/avatar-stack';
import { BackButton } from '@/components/back-button';
import { FREE_SEATS } from '@/lib/mock-data';
import { leavePaywall } from '@/lib/navigation';
import { PaywallActions } from '@/sections/paywall/paywall-actions';
import { PaywallPlans } from '@/sections/paywall/paywall-plans';
import { PaywallSeatsArt } from '@/sections/paywall/paywall-seats-art';
import { PaywallLayout } from '@/sections/paywall/paywall-sheet';

/** Close button and the "5 of 5 used" badge pinned over the art. */
function SeatsOverlay() {
  return (
    <View className="flex-row items-start justify-between">
      <BackButton icon="close" tone="surface" onPress={() => leavePaywall('app')} />
      <View className="mt-2 rounded-full bg-surface px-3 py-1">
        <Text className="font-heavy text-overline text-content">
          {FREE_SEATS} of {FREE_SEATS} used
        </Text>
      </View>
    </View>
  );
}

/** Seat-limit paywall, shown when the free table is full. */
export function PaywallSeatsView() {
  return (
    <PaywallLayout
      overlay={<SeatsOverlay />}
      art={(h) => <PaywallSeatsArt size={Math.min(290, h)} />}
    >
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        className="font-display text-headline text-content"
      >
        Room for 12.
      </Text>
      <View className="mt-4 flex-row items-center gap-3 rounded-2xl bg-cream px-3 py-3">
        <AvatarStack ids={['sam', 'priya']} size={36} max={2} />
        <Text className="flex-1 font-text text-body text-content">
          <Text className="font-display">Sam and Priya</Text> want in. Your table is full.
        </Text>
      </View>
      <Text className="my-4 font-text text-body text-muted">+ themes, games and Spark</Text>
      <PaywallPlans />
      <Text className="my-4 text-center font-text text-caption text-muted">
        3 days free · we remind you on day 2
      </Text>
      <PaywallActions source="app" label="Unlock 12 seats free for 3 days" />
    </PaywallLayout>
  );
}
