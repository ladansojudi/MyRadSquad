import { Host, Picker, Text } from '@expo/ui/swift-ui';
import { pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';
import { View } from 'react-native';

export type Segment<T extends string> = { value: T; label: string };

type SegmentedControlProps<T extends string> = {
  segments: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** The native iOS segmented control (SwiftUI Picker, segmented style). */
export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View style={{ height: 34 }}>
      <Host style={{ flex: 1 }}>
        <Picker
          modifiers={[pickerStyle('segmented')]}
          selection={value}
          onSelectionChange={(selection) => onChange(selection as T)}
        >
          {segments.map((s) => (
            <Text key={s.value} modifiers={[tag(s.value)]}>
              {s.label}
            </Text>
          ))}
        </Picker>
      </Host>
    </View>
  );
}
