import { Stack } from 'expo-router';

import { useNavOptions } from '@/hooks/use-nav-options';

export default function YouStack() {
  const nav = useNavOptions();
  return (
    <Stack screenOptions={nav.large}>
      <Stack.Screen name="index" options={{ title: 'You', headerShown: false }} />
    </Stack>
  );
}
