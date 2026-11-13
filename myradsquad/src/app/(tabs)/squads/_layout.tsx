import { Stack } from 'expo-router';

import { useNavOptions } from '@/hooks/use-nav-options';

/** Home draws its own title row ("Squads" and Squad+ side by side), so no native header. */
export default function SquadsStack() {
  const nav = useNavOptions();
  return (
    <Stack screenOptions={nav.large}>
      <Stack.Screen name="index" options={{ title: 'Squads', headerShown: false }} />
    </Stack>
  );
}
