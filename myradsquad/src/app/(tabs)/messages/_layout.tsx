import { Stack } from 'expo-router';

import { useNavOptions } from '@/hooks/use-nav-options';

export default function MessagesStack() {
  const nav = useNavOptions();
  return (
    <Stack screenOptions={nav.large}>
      <Stack.Screen name="index" options={{ title: 'Messages', headerShown: false }} />
    </Stack>
  );
}
