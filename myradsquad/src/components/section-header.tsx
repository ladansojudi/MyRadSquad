import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { cn } from '@/lib/utils';

type SectionHeaderProps = {
  title: string;
  className?: string;
  action?: { label: string; onPress: () => void };
  children?: ReactNode;
};

/** The one way a section starts: an overline label, optionally an action on the right. */
export function SectionHeader({ title, action, className }: SectionHeaderProps) {
  return (
    <View className={cn('mb-3 flex-row items-center justify-between', className)}>
      <Text className="font-heavy text-overline uppercase tracking-widest text-muted">{title}</Text>
      {action ? (
        <Pressable accessibilityRole="button" hitSlop={8} onPress={action.onPress}>
          <Text className="font-heavy text-caption text-content underline">{action.label}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
