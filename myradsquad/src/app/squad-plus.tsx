import { useLocalSearchParams } from 'expo-router';

import { PaywallPlusView } from '@/sections/paywall/view/paywall-plus-view';

export default function SquadPlusScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  return <PaywallPlusView source={from === 'onboarding' ? 'onboarding' : 'app'} />;
}
