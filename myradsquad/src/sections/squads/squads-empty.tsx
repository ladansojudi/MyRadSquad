import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle } from 'react-native-reanimated';

import { RoundTable } from '@/components/art/round-table';
import { EmptySeat, SeatTile } from '@/components/art/seat-tile';
import { Sparkle } from '@/components/art/sparkle';
import { Icon } from '@/components/icon';
import { Crisp } from '@/components/motion/crisp';
import { SceneClock, useSceneClock } from '@/components/motion/scene-clock';
import { Button, PressableScale } from '@/components/ui';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { useAppStore } from '@/lib/app-store';
import { FIRST_QUESTION, SQUAD_NAME } from '@/lib/mock-data';
import { haptics } from '@/lib/haptics';
import { copyInviteLink, shareInvite } from '@/lib/invite';
import { TIMING_OUT, wave } from '@/lib/motion';
import { cn } from '@/lib/utils';

/** A little shape floating near the table: bobs 2pt and rocks 6°. */
function Crumb({
  className,
  phase,
  children,
}: {
  className: string;
  phase: number;
  children: ReactNode;
}) {
  const t = useSceneClock();
  const float = useAnimatedStyle(() => ({
    transform: [
      { translateY: -2 * wave(t.value, 3000, phase) },
      { rotate: `${6 * wave(t.value, 4000, phase)}deg` },
    ],
  }));
  return (
    <Animated.View className={cn('absolute', className)} style={float}>
      <Crisp>{children}</Crisp>
    </Animated.View>
  );
}

/** The empty table: open seats breathe, waiting for friends. */
function EmptyTableArt() {
  return (
    <SceneClock>
      <View className="h-[200px] w-[230px] self-center">
        <View className="absolute left-[55px] top-[30px]">
          <RoundTable size={124} alive />
        </View>
        <View className="absolute left-[100px] top-0">
          <EmptySeat size={26} alive phase={0.17} />
        </View>
        <View className="absolute left-[18px] top-[56px]">
          <EmptySeat size={26} round alive phase={0.34} />
        </View>
        <View className="absolute left-[176px] top-[64px]">
          <EmptySeat size={26} alive phase={0.51} />
        </View>
        <View className="absolute left-[44px] top-[150px]">
          <EmptySeat size={26} alive phase={0.68} />
        </View>
        <View className="absolute left-[146px] top-[150px]">
          <EmptySeat size={26} alive phase={0.85} />
        </View>
        <View className="absolute left-[24px] top-[16px]">
          <Sparkle size={22} tone="surface" outlined alive phase={0.1} />
        </View>
        <Crumb className="left-[168px] top-[20px]" phase={0.2}>
          <View className="h-3.5 w-6 rounded-t-full bg-teal" />
        </Crumb>
        <Crumb className="left-[10px] top-[164px]" phase={0.65}>
          <View className="size-4 rounded-full bg-accent" />
        </Crumb>
        <View className="absolute left-[184px] top-[150px]">
          <SeatTile tone="cobalt" size={16} dot={false} alive phase={0.3} />
        </View>
        <View className="absolute left-[205px] top-[118px]">
          <Sparkle size={12} tone="coral" alive phase={0.45} />
        </View>
        <View className="absolute left-[0px] top-[190px]">
          <Sparkle size={12} tone="teal" alive phase={0.8} />
        </View>
      </View>
    </SceneClock>
  );
}

/** Squads home for a brand new table nobody has joined yet. */
export function SquadsEmpty() {
  const lip = useHardShadow(4);
  const nudged = useAppStore((s) => s.nudged);
  const nudge = useAppStore((s) => s.nudge);
  const firstAnswer = useAppStore((s) => s.firstAnswer);

  return (
    <View className="gap-4">
      <View className="rounded-[24px] bg-surface px-4 pb-4 pt-4" style={lip}>
        <Text className="font-heavy text-body text-content">{SQUAD_NAME}</Text>
        <EmptyTableArt />
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          className="text-center font-display text-headline text-content"
        >
          {'Nobody here yet'}
        </Text>
        <Text className="mt-2 text-center font-text text-body text-muted">
          Your table is ready. It just needs people.
        </Text>
        <Button label="Invite friends" className="mt-4" onPress={() => shareInvite()} />
        <View className="mt-3 flex-row justify-center gap-3">
          {(['link', 'qr'] as const).map((icon) => (
            <PressableScale
              key={icon}
              accessibilityLabel={icon === 'link' ? 'Copy invite link' : 'Show QR code'}
              onPress={() => (icon === 'link' ? copyInviteLink() : router.push('/invite-qr'))}
              className="size-[52px] items-center justify-center rounded-2xl bg-surface"
            >
              <Icon name={icon} size={22} />
            </PressableScale>
          ))}
        </View>
      </View>

      <View className="flex-row items-center gap-3 rounded-[20px] bg-surface px-3 py-3" style={lip}>
        <SeatTile letter="M" tone="coral" shape="leaf" size={38} dot={false} />
        <Text className="flex-1 font-text text-body text-content">
          <Text className="font-display">Maya</Text> invited · not joined yet
        </Text>
        <PressableScale
          onPress={() => {
            haptics.tap();
            nudge();
          }}
          disabled={nudged}
          className={cn('rounded-xl px-3 py-1.5', nudged ? 'bg-cream' : 'bg-canvas')}
        >
          <Animated.Text
            key={nudged ? 'done' : 'todo'}
            entering={FadeIn.duration(200).easing(TIMING_OUT)}
            className="font-heavy text-caption text-content"
          >
            {nudged ? 'Nudged' : 'Nudge'}
          </Animated.Text>
        </PressableScale>
      </View>

      <PressableScale
        onPress={() => router.push({ pathname: '/answer', params: { q: 'first' } })}
        className="rounded-[22px] bg-cobalt px-4 py-3"
      >
        <Text className="font-heavy text-overline tracking-widest text-cobalt-content/85">
          {"TODAY'S QUESTION"}
        </Text>
        <Text className="font-display text-subtitle text-cobalt-content">{FIRST_QUESTION}</Text>
        <Text className="font-text text-caption text-cobalt-content/90">
          {firstAnswer
            ? `You: ${firstAnswer} · friends see it when they join`
            : 'Answer now. Friends see it when they join.'}
        </Text>
      </PressableScale>

      <Text className="text-center font-text text-caption text-muted">
        Spark shows up once friends are here.
      </Text>
    </View>
  );
}
