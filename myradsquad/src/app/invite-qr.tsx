import { useLocalSearchParams } from 'expo-router';

import { InviteQrView } from '@/sections/invite/view/invite-qr-view';

export default function InviteQrScreen() {
  const { name } = useLocalSearchParams<{ name?: string }>();
  return <InviteQrView name={name} />;
}
