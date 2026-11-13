import { createElement } from 'react';
import { View } from 'react-native';

type BirthdayWheelProps = {
  value: Date;
  onChange: (date: Date) => void;
  min: Date;
  max: Date;
};

const iso = (d: Date) => d.toISOString().slice(0, 10);

/** Web: the browser's own date input (the iOS wheel is SwiftUI only). */
export function OnboardingBirthdayWheel({ value, onChange, min, max }: BirthdayWheelProps) {
  return (
    <View className="h-14 justify-center rounded-2xl bg-surface px-4">
      {createElement('input', {
        type: 'date',
        value: iso(value),
        min: iso(min),
        max: iso(max),
        onChange: (e: { target: { value: string } }) => {
          if (e.target.value) onChange(new Date(`${e.target.value}T12:00:00`));
        },
        style: { border: 0, fontSize: 17, background: 'transparent' },
      })}
    </View>
  );
}
