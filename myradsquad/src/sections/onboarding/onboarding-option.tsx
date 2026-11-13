import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Icon } from '@/components/icon';
import { PressableScale } from '@/components/ui';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { TIMING_IN, TIMING_OUT } from '@/lib/motion';
import { cn } from '@/lib/utils';

type OnboardingOptionProps = {
  title: string;
  subtitle: string;
  icon: ReactNode;
  selected: boolean;
  onPress: () => void;
};

export function OnboardingOption({
  title,
  subtitle,
  icon,
  selected,
  onPress,
}: OnboardingOptionProps) {
  const lip = useHardShadow(4, selected ? 'coral' : 'surface');
  return (
    <PressableScale
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={cn(
        'h-[92px] flex-row items-center gap-4 rounded-[22px] px-4',
        selected ? 'bg-accent' : 'bg-surface',
      )}
      style={lip}
    >
      <View className="size-[58px] items-center justify-center rounded-2xl bg-cream">{icon}</View>
      <View className="flex-1">
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
          className={cn(
            'font-display text-subtitle',
            selected ? 'text-accent-content' : 'text-content',
          )}
        >
          {title}
        </Text>
        <Text
          numberOfLines={1}
          className={cn('font-text text-body', selected ? 'text-accent-content' : 'text-muted')}
        >
          {subtitle}
        </Text>
      </View>
      {/* The check's place is always kept, so picking one never reflows the card. */}
      <View
        className={cn(
          'size-7 items-center justify-center rounded-full',
          selected ? 'bg-surface' : 'bg-cream',
        )}
      >
        {selected ? (
          <Animated.View
            entering={FadeIn.duration(180).easing(TIMING_OUT)}
            exiting={FadeOut.duration(120).easing(TIMING_IN)}
          >
            <Icon name="check" size={16} strokeWidth={3} />
          </Animated.View>
        ) : null}
      </View>
    </PressableScale>
  );
}
