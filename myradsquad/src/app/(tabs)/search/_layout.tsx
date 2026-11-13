import { Stack } from 'expo-router';

import { useNavOptions } from '@/hooks/use-nav-options';

export default function SearchStack() {
  const nav = useNavOptions();
  return (
    <Stack screenOptions={nav.large}>
      {/* The title is drawn by the view (like every tab); iOS hides this bar while searching. */}
      <Stack.Screen
        name="index"
        options={{ title: '', headerLargeTitleEnabled: false, headerTransparent: true }}
      />
    </Stack>
  );
}
