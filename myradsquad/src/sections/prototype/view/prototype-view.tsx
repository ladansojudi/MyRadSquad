import { router, type Href } from 'expo-router';
import { Text, View } from 'react-native';

import { BottomSheet } from '@/components/bottom-sheet';
import { Icon } from '@/components/icon';
import { PressableScale } from '@/components/ui';
import { useAppStore } from '@/lib/app-store';
import { haptics } from '@/lib/haptics';
import { goHome } from '@/lib/navigation';

/** A solution from the research dashboard: the problem it answers, and one tap to see it. */
type Solution = { title: string; hmw: string; problem: string; run: () => void };

/** A screen (in the right state) that is not a solution's main screen. */
type Extra = { label: string; run: () => void };

/** Every screen worth showing, one tap away. */
const PLACES: { label: string; href: Href }[] = [
  { label: 'Home', href: '/squads' },
  { label: 'Messages', href: '/messages' },
  { label: 'Moments', href: '/moments' },
  { label: 'You', href: '/you' },
  { label: 'Search', href: '/search' },
  { label: 'Lunch chat', href: '/squad/chat' },
  { label: 'Cousins (quiet)', href: { pathname: '/s/[id]', params: { id: 'cousins' } } },
  { label: 'A room', href: { pathname: '/room', params: { id: 'hangout' } } },
  { label: 'Focus', href: '/focus' },
  { label: 'Open rooms', href: { pathname: '/rooms/[id]', params: { id: 'lunch' } } },
  { label: 'Squad settings', href: { pathname: '/squad-settings/[id]', params: { id: 'lunch' } } },
  { label: 'New squad', href: '/new-squad' },
  { label: 'Squad+', href: '/squad-plus' },
];

function SolutionCard({ solution, index }: { solution: Solution; index: number }) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${index + 1}. ${solution.title}. Problem: ${solution.problem} Opens the solution`}
      onPress={() => {
        haptics.select();
        solution.run();
      }}
      className="gap-3 rounded-3xl bg-cream p-4"
    >
      <View className="flex-row items-center gap-3">
        <View className="size-9 items-center justify-center rounded-full bg-primary">
          <Text className="font-display text-body text-primary-content">{index + 1}</Text>
        </View>
        <View className="flex-1">
          <Text className="font-heavy text-overline tracking-widest text-primary">
            {solution.hmw}
          </Text>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            className="font-display text-subtitle text-content"
          >
            {solution.title}
          </Text>
        </View>
        <Icon name="chevron-right" size={18} strokeWidth={2.8} />
      </View>
      <View className="gap-0.5">
        <Text className="font-heavy text-overline tracking-widest text-muted">PROBLEM</Text>
        <Text className="font-text text-body text-content">{solution.problem}</Text>
      </View>
    </PressableScale>
  );
}

function Chip({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <PressableScale
      accessibilityRole="button"
      onPress={() => {
        haptics.select();
        onPress();
      }}
      className="h-8 justify-center rounded-full bg-cream px-3"
    >
      <Text className="font-text text-caption text-content">{label}</Text>
    </PressableScale>
  );
}

/**
 * Prototype menu (the edge tab on every screen, or You → Prototype menu). The research
 * dashboard's six solutions in its order, each as the problem it answers; tap one to see
 * the solution. Other states and screens below. Not part of the product.
 */
export function PrototypeView() {
  const resetDemo = useAppStore((s) => s.resetDemo);
  const setOrigin = useAppStore((s) => s.setOrigin);
  const addSpark = useAppStore((s) => s.addSpark);
  const resetLiveEvent = useAppStore((s) => s.resetLiveEvent);
  const setPlus = useAppStore((s) => s.setPlus);
  const removeSpark = useAppStore((s) => s.removeSpark);

  /** Closes the menu, then opens `href` on top of where you were. */
  const open = (href: Href) => {
    router.back();
    setTimeout(() => router.push(href), 50);
  };
  /** Closes the menu and everything open under it, then goes to `href`. */
  const go = (href: Href) => {
    router.back();
    setTimeout(() => {
      if (router.canDismiss()) router.dismissAll();
      router.navigate(href);
    }, 50);
  };
  /** Home as someone who joined by invite, or who started their own table. */
  const home = (origin: 'invite' | 'own', then?: () => void) => {
    router.back();
    setTimeout(() => {
      setOrigin(origin);
      goHome();
      then?.();
    }, 50);
  };
  const reset = () => {
    haptics.select();
    router.back();
    setTimeout(() => {
      resetDemo();
      if (router.canDismiss()) router.dismissAll();
      router.replace('/');
    }, 50);
  };

  const solutions: Solution[] = [
    {
      title: 'Squad Spark',
      hmw: 'HMW3 · KEY IDEA',
      problem: 'A quiet squad feels dead, and an AI that barges in feels creepy or spammy.',
      run: () =>
        home('invite', () =>
          setTimeout(() => useAppStore.getState().triggerSparkPing('cousins'), 1200),
        ),
    },
    {
      title: 'Feature screens',
      hmw: 'HMW2',
      problem: 'We ask for money before teens feel any value.',
      run: () => go('/invite'),
    },
    {
      title: 'Why are you here?',
      hmw: 'HMW1',
      problem: 'Every teen gets the same app, whatever they came for.',
      run: () => go('/onboarding/purpose'),
    },
    {
      title: 'Paywall A / B',
      hmw: 'HMW2',
      problem: "We don't know what teens pay for: fun and AI, or room for 12.",
      run: () => open('/paywall'),
    },
    {
      title: 'Home',
      hmw: 'HMW1',
      problem: 'A new teen lands in a quiet squad and sees no reason to stay.',
      run: () => home('invite'),
    },
    {
      title: 'Ask a parent',
      hmw: 'HMW4',
      problem: 'Under 18, a parent may have to approve, and the request can sit for 24 hours.',
      run: () => open('/parent-request'),
    },
  ];

  // The other states worth showing, one tap each (the solution cards open the main one).
  const extras: Extra[] = [
    {
      label: 'Spark: turn it on',
      run: () => {
        setPlus('trial');
        removeSpark();
        open('/spark/add');
      },
    },
    {
      label: 'Spark: what the squad sees',
      run: () => {
        addSpark('chill', 'maya');
        open('/spark/chat');
      },
    },
    {
      label: 'Spark: mute or remove',
      run: () => open({ pathname: '/squad-settings/[id]', params: { id: 'cousins' } }),
    },
    {
      label: 'Spark: takes a break',
      run: () => {
        useAppStore.getState().pauseSquadSpark('cousins');
        home('invite');
      },
    },
    { label: 'Paywall B', run: () => open('/seats') },
    { label: '13+ gate', run: () => go('/onboarding/birthday') },
    { label: 'Home: empty', run: () => home('own') },
    {
      label: 'Home: a squad comes alive',
      run: () =>
        home('invite', () => {
          resetLiveEvent();
          setTimeout(() => useAppStore.getState().triggerLiveEvent(), 1500);
        }),
    },
    {
      label: 'Squad+ rooms',
      run: () => {
        setPlus('free');
        open({ pathname: '/start-room/[id]', params: { id: 'lunch' } });
      },
    },
  ];

  return (
    <BottomSheet fill>
      <View className="flex-row items-center justify-between gap-3">
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          className="font-display text-headline text-content"
        >
          Prototype
        </Text>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Start over"
          onPress={reset}
          className="h-8 justify-center rounded-full bg-cream px-3"
        >
          <Text className="font-strong text-caption text-muted">↺ Reset</Text>
        </PressableScale>
      </View>
      <Text className="mt-1 font-text text-caption text-muted">
        Six problems from our research. Tap one to see how we solved it.
      </Text>

      <View className="mt-4 gap-3">
        {solutions.map((solution, i) => (
          <SolutionCard key={solution.title} solution={solution} index={i} />
        ))}
      </View>

      <View className="mt-6 gap-2">
        <Text className="font-heavy text-overline tracking-widest text-muted">MORE STATES</Text>
        <View className="flex-row flex-wrap gap-2">
          {extras.map((extra) => (
            <Chip key={extra.label} label={extra.label} onPress={extra.run} />
          ))}
        </View>
      </View>

      <View className="mt-5 gap-2">
        <Text className="font-heavy text-overline tracking-widest text-muted">ANY SCREEN</Text>
        <View className="flex-row flex-wrap gap-2">
          {PLACES.map((place) => (
            <Chip key={place.label} label={place.label} onPress={() => go(place.href)} />
          ))}
        </View>
      </View>
    </BottomSheet>
  );
}
