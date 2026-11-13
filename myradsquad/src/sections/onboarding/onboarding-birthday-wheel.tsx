import { DatePicker, Host } from '@expo/ui/swift-ui';
import { datePickerStyle, labelsHidden } from '@expo/ui/swift-ui/modifiers';
import { View } from 'react-native';

type BirthdayWheelProps = {
  value: Date;
  onChange: (date: Date) => void;
  /** Earliest and latest selectable dates. */
  min: Date;
  max: Date;
};

/**
 * The native iOS date wheel (SwiftUI DatePicker, wheel style): month, day and year as
 * three spinning columns everyone already knows how to use.
 */
export function OnboardingBirthdayWheel({ value, onChange, min, max }: BirthdayWheelProps) {
  return (
    <View style={{ height: 216 }}>
      <Host style={{ flex: 1 }}>
        <DatePicker
          selection={value}
          range={{ start: min, end: max }}
          displayedComponents={['date']}
          onDateChange={onChange}
          modifiers={[datePickerStyle('wheel'), labelsHidden()]}
        />
      </Host>
    </View>
  );
}
