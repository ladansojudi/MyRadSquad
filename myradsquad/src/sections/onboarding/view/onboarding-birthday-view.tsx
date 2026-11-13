import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Screen } from '@/components/screen';
import { Button, TextLink } from '@/components/ui';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { useBottomInset } from '@/hooks/use-bottom-inset';
import { ageOn, type Birthday } from '@/lib/age';
import { useAppStore } from '@/lib/app-store';
import { haptics } from '@/lib/haptics';
import { TIMING_OUT } from '@/lib/motion';
import { OnboardingBirthdayWheel } from '@/sections/onboarding/onboarding-birthday-wheel';

const TODAY = new Date();
const EARLIEST = new Date(1950, 0, 1);

const toBirthday = (d: Date): Birthday => ({
  year: d.getFullYear(),
  month: d.getMonth(),
  day: d.getDate(),
});

/**
 * The 13+ gate. The native iOS date wheel, which everyone already knows how to spin. It
 * starts on today (a neutral age screen, per COPPA: it never suggests an age of 13 or more)
 * and checks nothing until the teen has moved it.
 */
export function OnboardingBirthdayView() {
  const bottomInset = useBottomInset();
  const setBirthday = useAppStore((s) => s.setBirthday);
  const lip = useHardShadow(4);
  const [date, setDate] = useState(TODAY);
  const [touched, setTouched] = useState(false);

  const birthday = toBirthday(date);
  const tooYoung = ageOn(birthday, new Date()) < 13;

  return (
    <Screen scroll topGap={8} className="px-6">
      {/* The first step: nothing to go back to, so no nav bar; the step sits on the title row. */}
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-row items-center gap-3">
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          accessibilityRole="header"
          className="flex-1 font-display text-hero text-content"
        >
          {"When's your birthday?"}
        </Text>
        <Text className="font-heavy text-body text-muted">1 of 2</Text>
      </View>
      <Text className="mt-3 font-text text-body text-content">
        {"Just to check you're 13+. Nobody else sees it."}
      </Text>

      <View className="mt-8 rounded-[24px] bg-surface px-2" style={lip}>
        <OnboardingBirthdayWheel
          value={date}
          min={EARLIEST}
          max={TODAY}
          onChange={(d) => {
            haptics.select();
            setTouched(true);
            setDate(d);
          }}
        />
      </View>

      {touched && tooYoung ? (
        <Animated.Text
          entering={FadeIn.duration(200).easing(TIMING_OUT)}
          accessibilityLiveRegion="polite"
          className="mt-4 text-center font-heavy text-caption text-content"
        >
          You need to be 13 or older to join a table.
        </Animated.Text>
      ) : null}

      <View className="flex-1" />
      <View className="gap-3" style={{ paddingBottom: bottomInset }}>
        <Button
          label="Continue"
          disabled={tooYoung}
          className={tooYoung ? 'opacity-40' : undefined}
          onPress={() => {
            setBirthday(birthday);
            router.push('/invite');
          }}
        />
        <TextLink label="Why do we ask?" onPress={() => router.push('/why-age')} />
      </View>
    </Screen>
  );
}
