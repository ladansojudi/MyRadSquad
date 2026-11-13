import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { BottomSheet } from '@/components/bottom-sheet';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

const REASONS = [
  { tone: 'bg-teal', text: 'MyRadSquad is for 13 and up.' },
  { tone: 'bg-cobalt', text: 'Under 18, Apple asks a parent before any purchase (Ask to Buy).' },
  { tone: 'bg-accent', text: 'Your squad never sees your birthday.' },
];

/** "Why do we ask?" — the age gate explains itself in three lines. */
export function OnboardingWhyView() {
  return (
    <BottomSheet>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        className="font-display text-headline text-content"
      >
        Why we ask
      </Text>
      <View className="mt-4 gap-3 rounded-2xl bg-cream px-4 py-4">
        {REASONS.map((r) => (
          <View key={r.text} className="flex-row items-start gap-3">
            <View className={cn('mt-1 size-4 rounded-[5px]', r.tone)} />
            <Text className="flex-1 font-text text-body text-content">{r.text}</Text>
          </View>
        ))}
      </View>
      <Button label="Got it" className="mt-5 mb-2" onPress={() => router.back()} />
    </BottomSheet>
  );
}
