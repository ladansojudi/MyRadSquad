import { Text } from 'react-native';

import { formatClock, useFocusCountdown } from '@/hooks/use-focus-countdown';

/** Live countdown for the focus session card. */
export function SquadFocusTimer() {
  const left = useFocusCountdown();
  return (
    <Text
      className="font-display text-[36px] leading-[42px] text-teal-content"
      style={{ fontVariant: ['tabular-nums'] }}
    >
      {formatClock(left)}
    </Text>
  );
}
