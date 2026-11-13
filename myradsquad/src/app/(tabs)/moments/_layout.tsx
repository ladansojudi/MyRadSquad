import { Stack } from 'expo-router';

import { useNavOptions } from '@/hooks/use-nav-options';

export default function MomentsStack() {
  const nav = useNavOptions();
  return (
    <Stack screenOptions={nav.large}>
      <Stack.Screen name="index" options={{ title: 'Moments', headerShown: false }} />
    </Stack>
  );
}
