import { router } from 'expo-router';
import { Text } from 'react-native';

import { Icon } from '@/components/icon';
import { PressableScale } from '@/components/ui';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { haptics } from '@/lib/haptics';

/** "+ New squad" next to the Squads title: the one place you start a new squad. */
export function SquadsNewButton() {
  const lip = useHardShadow(3, 'surface');
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel="Start a new squad"
      onPress={() => {
        haptics.tap();
        router.push('/new-squad');
      }}
      className="h-10 flex-row items-center gap-1.5 rounded-full bg-surface pl-3 pr-4"
      style={lip}
    >
      <Icon name="plus" size={16} strokeWidth={2.6} />
      <Text className="font-heavy text-body text-content">New squad</Text>
    </PressableScale>
  );
}
