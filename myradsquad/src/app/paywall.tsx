import { useLocalSearchParams } from 'expo-router';

import { PaywallView } from '@/sections/paywall/view/paywall-view';

export default function PaywallScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  return <PaywallView source={from === 'onboarding' ? 'onboarding' : 'app'} />;
}
