import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { useBottomInset } from '@/hooks/use-bottom-inset';
import { Screen } from '@/components/screen';
import { Button, TextLink } from '@/components/ui';
import { useAppStore, type Purpose } from '@/lib/app-store';
import { HangoutIcon, MomentsIcon, StudyIcon } from '@/sections/onboarding/onboarding-icons';
import { OnboardingHeader } from '@/sections/onboarding/onboarding-header';
import { OnboardingOption } from '@/sections/onboarding/onboarding-option';
import { haptics } from '@/lib/haptics';

const OPTIONS: {
  id: Purpose;
  title: string;
  subtitle: string;
  Icon: () => React.JSX.Element;
}[] = [
  {
    id: 'hangout',
    title: 'Hanging out',
    subtitle: 'memes, plans, chaos',
    Icon: HangoutIcon,
  },
  {
    id: 'study',
    title: 'Studying together',
    subtitle: 'homework, focus sessions',
    Icon: StudyIcon,
  },
  {
    id: 'moments',
    title: 'Sharing moments',
    subtitle: 'photos, right now',
    Icon: MomentsIcon,
  },
];

export function OnboardingPurposeView() {
  const bottomInset = useBottomInset();
  const purpose = useAppStore((s) => s.purpose);
  const setPurpose = useAppStore((s) => s.setPurpose);

  const finish = () => {
    // The intro pages already showed what Squad+ adds, so the answer goes straight to the
    // paywall, which leads with what they came for.
    router.push({ pathname: '/paywall', params: { from: 'onboarding' } });
  };

  return (
    <Screen scroll header topGap={4} className="px-6">
      <OnboardingHeader step="2 of 2" />
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        className="mt-2 font-display text-hero text-content"
      >
        What are you here for?
      </Text>
      <Text className="mt-3 font-text text-body text-content">
        {"Pick one and we'll show you that first. You can change it anytime."}
      </Text>

      <View className="mt-10 gap-4" accessibilityRole="radiogroup">
        {OPTIONS.map(({ id, title, subtitle, Icon }) => (
          <OnboardingOption
            key={id}
            title={title}
            subtitle={subtitle}
            icon={<Icon />}
            selected={purpose === id}
            onPress={() => {
              haptics.select();
              setPurpose(id);
            }}
          />
        ))}
      </View>

      <View className="flex-1" />
      <View className="gap-3" style={{ paddingBottom: bottomInset }}>
        <Button label="Next" onPress={finish} />
        <TextLink label="Skip" onPress={finish} />
      </View>
    </Screen>
  );
}
