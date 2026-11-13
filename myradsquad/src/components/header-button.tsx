import { Pressable, Text } from 'react-native';

import { Icon, type IconName } from '@/components/icon';

type HeaderButtonProps = {
  label?: string;
  icon?: IconName;
  onPress: () => void;
  onLongPress?: () => void;
  accessibilityLabel?: string;
};

/**
 * A bar button for the native header. iOS 26 draws the Liquid Glass capsule around it,
 * so it is just a label or a glyph, no background of its own.
 */
export function HeaderButton({
  label,
  icon,
  onPress,
  onLongPress,
  accessibilityLabel,
}: HeaderButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      hitSlop={8}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
      className="flex-row items-center gap-1 px-1.5"
    >
      {icon ? <Icon name={icon} size={20} strokeWidth={2.4} /> : null}
      {label ? <Text className="font-heavy text-body text-content">{label}</Text> : null}
    </Pressable>
  );
}
