import { View } from 'react-native';

import { Chip } from '@/components/ui';

export type Segment<T extends string> = { value: T; label: string };

type SegmentedControlProps<T extends string> = {
  segments: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** Web stand-in for the native segmented control. */
export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View className="flex-row gap-2" accessibilityRole="tablist">
      {segments.map((s) => (
        <Chip
          key={s.value}
          label={s.label}
          size="sm"
          tone={value === s.value ? 'ink' : 'surface'}
          className="flex-1"
          onPress={() => onChange(s.value)}
        />
      ))}
    </View>
  );
}
