import { router } from 'expo-router';

import { useBottomInset } from '@/hooks/use-bottom-inset';
import type { PaywallSource } from '@/lib/navigation';
import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SparkMark } from '@/components/art/spark-mark';
import { FillSpace } from '@/components/fill-space';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { PaywallSeatsArt } from '@/sections/paywall/paywall-seats-art';

function FeatureTile({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <View className="h-[66px] flex-1 flex-row items-center gap-3 rounded-[20px] bg-surface px-3">
      {icon}
      <Text className="font-heavy text-body text-content">{label}</Text>
    </View>
  );
}

function IconSquare({ tone, children }: { tone: string; children?: ReactNode }) {
  return (
    <View className={cn('size-10 items-center justify-center rounded-xl', tone)}>{children}</View>
  );
}

/** Squad+ intro, step 2 of 2: what the bigger table includes. */
export function PaywallPlusView({ source }: { source: PaywallSource }) {
  const insets = useSafeAreaInsets();
  const bottomInset = useBottomInset();

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      bounces={false}
      contentContainerClassName="grow"
    >
      <View className="px-6" style={{ paddingTop: insets.top + 16 }}>
        <View className="flex-row items-center justify-between">
          <View className="rounded-full bg-content px-4 py-2">
            <Text className="font-heavy text-caption text-brand-content">Squad+</Text>
          </View>
          <Text className="font-text text-body text-content">2 of 2</Text>
        </View>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          className="mt-4 font-display text-hero text-content"
        >
          More for your crew.
        </Text>
      </View>
      <FillSpace min={170}>{(h) => <PaywallSeatsArt size={Math.min(290, h - 8)} />}</FillSpace>

      <View
        className="rounded-t-[32px] bg-surface px-6 pt-6"
        style={{ paddingBottom: bottomInset }}
      >
        <View className="gap-3">
          <View className="flex-row gap-3">
            <FeatureTile
              label="Themes"
              icon={
                <IconSquare tone="bg-teal">
                  <View className="size-5 rounded-md bg-canvas" />
                </IconSquare>
              }
            />
            <FeatureTile
              label="Games"
              icon={
                <IconSquare tone="bg-accent">
                  <View className="h-4 w-7 rounded-full bg-surface" />
                </IconSquare>
              }
            />
          </View>
          <View className="flex-row gap-3">
            <FeatureTile
              label="Spark"
              icon={
                <IconSquare tone="bg-cobalt">
                  <SparkMark size={16} variant="solid" />
                </IconSquare>
              }
            />
            <FeatureTile
              label="12 seats"
              icon={
                <IconSquare tone="bg-canvas">
                  <View className="size-5 rounded-full bg-cobalt" />
                </IconSquare>
              }
            />
          </View>
        </View>
        <Text className="mt-4 text-center font-text text-body text-muted">
          Your free table fits 5. Squad+ makes room for everyone.
        </Text>
        <View className="h-6" />
        <Button
          label="Continue"
          onPress={() => router.replace({ pathname: '/paywall', params: { from: source } })}
        />
      </View>
    </ScrollView>
  );
}
