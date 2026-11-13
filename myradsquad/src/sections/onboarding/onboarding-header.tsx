import { Text } from 'react-native';

import { NavHeader } from '@/components/nav-header';

/** Native nav bar for onboarding steps: system back chevron, step count on the right. */
export function OnboardingHeader({ step, first = false }: { step: string; first?: boolean }) {
  return (
    <NavHeader
      title=""
      noBack={first}
      right={<Text className="px-1 font-heavy text-body text-content">{step}</Text>}
    />
  );
}
