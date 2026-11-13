import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Button, TextLink } from '@/components/ui';
import { selectIsMinor, useAppStore } from '@/lib/app-store';
import { haptics } from '@/lib/haptics';
import { goHome, leavePaywall, type PaywallSource } from '@/lib/navigation';

type PaywallActionsProps = { label: string; note?: string; source: PaywallSource };

/** Primary CTA + "No thanks" + legal links shared by both paywalls. */
export function PaywallActions({ label, note, source }: PaywallActionsProps) {
  const isMinor = useAppStore(selectIsMinor);
  const setPlus = useAppStore((s) => s.setPlus);
  const showToast = useAppStore((s) => s.showToast);

  // No real purchases in this prototype. Under 18 goes through Apple's Ask to Buy;
  // 18+ starts the 3-day trial straight away and lands on Home.
  const start = () => {
    if (isMinor) {
      setPlus('pending');
      router.push('/parent-request');
      return;
    }
    setPlus('trial');
    haptics.success();
    showToast('Squad+ trial started · 3 days free');
    goHome();
  };

  return (
    <View className="gap-1">
      <Button
        label={label}
        labelClassName={label.length > 24 ? 'text-body' : undefined}
        onPress={start}
      />
      <TextLink label="No thanks" onPress={() => leavePaywall(source)} />
      {note ? <Text className="text-center font-text text-caption text-muted">{note}</Text> : null}
      <View className="flex-row justify-center">
        <Pressable
          hitSlop={8}
          accessibilityRole="button"
          onPress={() => showToast('Nothing to restore on this Apple ID')}
        >
          <Text className="font-text text-caption text-muted">Restore</Text>
        </Pressable>
        <Text className="font-text text-caption text-muted"> · Terms · Privacy</Text>
      </View>
    </View>
  );
}
