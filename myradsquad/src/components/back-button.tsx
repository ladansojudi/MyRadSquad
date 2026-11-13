import { router } from 'expo-router';
import { Pressable } from 'react-native';

import { Icon } from '@/components/icon';
import { cn } from '@/lib/utils';

type BackButtonProps = {
  icon?: 'chevron-left' | 'close';
  /** `ink` is the filled black circle, `surface` the outlined white one. */
  tone?: 'ink' | 'surface';
  onPress?: () => void;
};

export function BackButton({ icon = 'chevron-left', tone = 'ink', onPress }: BackButtonProps) {
  const handlePress =
    onPress ?? (() => (router.canGoBack() ? router.back() : router.replace('/squads')));
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={icon === 'close' ? 'Close' : 'Back'}
      hitSlop={8}
      onPress={handlePress}
      className={cn(
        'size-12 items-center justify-center rounded-full',
        tone === 'ink' ? 'bg-content' : ' bg-surface',
      )}
    >
      <Icon name={icon} size={22} tone={tone === 'ink' ? 'surface' : 'ink'} strokeWidth={2.6} />
    </Pressable>
  );
}
