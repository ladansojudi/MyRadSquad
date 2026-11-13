import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { PhotoImage } from '@/components/wireframe';
import { daysBetween, monthWeeks, sameDay } from '@/lib/calendar';
import type { MomentTone, Photo } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { MOMENT_BG } from '@/sections/moments/moments-photo';

export type DayMoment = {
  tones: [MomentTone, MomentTone, MomentTone];
  photo?: Photo;
};

type MomentsCalendarProps = {
  today: Date;
  /** Days with a moment, keyed by days-before-today. */
  moments: Map<number, DayMoment>;
  selected: Date;
  onSelect: (date: Date) => void;
};

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** A tiny version of the moment's photo, used as the day's tile. */
function Thumb({ tones, photo }: DayMoment) {
  if (photo) {
    return (
      <PhotoImage source={photo} contentFit="cover" style={{ position: 'absolute', inset: 0 }} />
    );
  }
  return (
    <View className={cn('absolute inset-0 overflow-hidden', MOMENT_BG[tones[0]])}>
      <View className={cn('absolute -right-2 -top-2 size-5 rounded-full', MOMENT_BG[tones[1]])} />
      <View className={cn('absolute -bottom-3 -left-3 size-7 rounded-full', MOMENT_BG[tones[2]])} />
    </View>
  );
}

/**
 * Memories calendar: this month as a grid, each day with a moment shows its thumbnail
 * (like Locket / BeReal memories). Tap a day to see it; future days are inactive.
 */
export function MomentsCalendar({ today, moments, selected, onSelect }: MomentsCalendarProps) {
  const weeks = useMemo(() => monthWeeks(today.getFullYear(), today.getMonth()), [today]);

  return (
    <View className="gap-1.5">
      <View className="flex-row">
        {WEEKDAYS.map((d, i) => (
          <Text key={`${d}${i}`} className="flex-1 text-center font-heavy text-overline text-muted">
            {d}
          </Text>
        ))}
      </View>
      {weeks.map((week) => (
        <View key={week[0].date.toISOString()} className="flex-row gap-1.5">
          {week.map(({ date, inMonth }) => {
            const ago = daysBetween(today, date);
            const moment = inMonth ? moments.get(ago) : undefined;
            const future = ago < 0;
            const isToday = ago === 0;
            const isSelected = sameDay(date, selected);
            if (!inMonth) return <View key={date.toISOString()} className="aspect-square flex-1" />;
            return (
              <Pressable
                key={date.toISOString()}
                disabled={future}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected, disabled: future }}
                accessibilityLabel={`${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}${moment ? ', has a moment' : ''}`}
                onPress={() => onSelect(date)}
                className={cn(
                  'aspect-square flex-1 overflow-hidden rounded-xl',
                  moment ? '' : future ? '' : 'bg-cream',
                  isSelected && !moment && '',
                )}
              >
                {moment ? <Thumb tones={moment.tones} photo={moment.photo} /> : null}
                <View className="flex-1 items-center justify-center">
                  <View
                    className={cn(
                      'min-w-6 items-center rounded-full px-1',
                      moment && 'bg-surface',
                      isToday && 'bg-content',
                    )}
                  >
                    <Text
                      className={cn(
                        'font-heavy text-caption',
                        isToday ? 'text-brand-content' : future ? 'text-faint' : 'text-content',
                      )}
                    >
                      {date.getDate()}
                    </Text>
                  </View>
                </View>
                {isSelected ? (
                  <View pointerEvents="none" className="absolute inset-0 rounded-xl" />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
