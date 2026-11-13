import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Icon } from '@/components/icon';
import { PressableScale } from '@/components/ui';
import { useAppStore } from '@/lib/app-store';
import { haptics } from '@/lib/haptics';
import { PLANS, type PlanId } from '@/lib/mock-data';
import { TIMING_OUT } from '@/lib/motion';
import { cn } from '@/lib/utils';

/** One plan as a small tile: the name, the price that matters big, the fine print small. */
function PlanTile({ id }: { id: PlanId }) {
  const selected = useAppStore((s) => s.plan === id);
  const setPlan = useAppStore((s) => s.setPlan);
  const plan = PLANS[id];
  const big = 'perMonth' in plan ? plan.perMonth : plan.price;
  const small = 'perMonth' in plan ? plan.price : 'billed weekly';

  return (
    <PressableScale
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${plan.label}, ${big}, ${small}`}
      onPress={() => {
        haptics.select();
        setPlan(id);
      }}
      className={cn('flex-1 gap-0.5 rounded-[20px] p-3.5', selected ? 'bg-primary/15' : 'bg-cream')}
    >
      <View className="flex-row items-center justify-between">
        <Text className="font-heavy text-body text-content">{plan.label}</Text>
        <View
          className={cn(
            'size-6 items-center justify-center rounded-full',
            selected ? 'bg-primary' : 'bg-surface',
          )}
        >
          {selected ? (
            <Animated.View entering={FadeIn.duration(160).easing(TIMING_OUT)}>
              <Icon name="check" size={13} tone="surface" strokeWidth={3.2} />
            </Animated.View>
          ) : null}
        </View>
      </View>
      <Text className="font-display text-subtitle text-content">{big}</Text>
      <Text className="font-text text-caption text-muted">{small}</Text>
      {'badge' in plan ? (
        <View className="mt-1 self-start rounded-full bg-content px-2 py-0.5">
          <Text className="font-heavy text-overline text-brand-content">{plan.badge}</Text>
        </View>
      ) : null}
    </PressableScale>
  );
}

/** Yearly (pre-selected, shown per month) and weekly, side by side. */
export function PaywallPlans() {
  return (
    <View className="flex-row gap-3" accessibilityRole="radiogroup">
      <PlanTile id="yearly" />
      <PlanTile id="weekly" />
    </View>
  );
}
