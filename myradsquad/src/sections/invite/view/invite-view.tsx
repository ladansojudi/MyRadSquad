import { router } from 'expo-router';
import { useRef, useState, type ReactNode } from 'react';
import { ScrollView, Text, useWindowDimensions, View, type ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBottomInset } from '@/hooks/use-bottom-inset';
import { SparkMark } from '@/components/art/spark-mark';
import { FillSpace } from '@/components/fill-space';
import { LiveDot } from '@/components/motion/live-dot';
import { Button, TextLink } from '@/components/ui';
import { useAppStore } from '@/lib/app-store';
import { haptics } from '@/lib/haptics';
import { SQUAD_NAME } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { InviteArt } from '@/sections/invite/invite-art';
import { InviteRoomsArt } from '@/sections/invite/invite-rooms-art';
import { InviteSparkArt } from '@/sections/invite/invite-spark-art';

type Page = {
  tag: ReactNode;
  title: string;
  body: string;
  art: (height: number) => ReactNode;
};

const PAGES: Page[] = [
  {
    tag: (
      <View className="flex-row items-center gap-2">
        <LiveDot />
        <Text className="font-text text-body text-content">3 at the table right now</Text>
      </View>
    ),
    title: 'Maya saved you a seat.',
    body: `${SQUAD_NAME} is already talking. See who's here and jump in.`,
    art: (h) => <InviteArt height={h} />,
  },
  {
    tag: <Text className="font-heavy text-overline tracking-widest text-muted">ROOMS</Text>,
    title: 'Hang out, focus, play.',
    body: 'Anyone starts a room from the chat and the squad hops in. Focus, study and game rooms come with Squad+.',
    art: (h) => <InviteRoomsArt height={h} />,
  },
  {
    tag: (
      <View className="flex-row items-center gap-1.5">
        <SparkMark size={14} />
        <Text className="font-heavy text-overline tracking-widest text-muted">SPARK · AI</Text>
      </View>
    ),
    title: 'Never a dead chat.',
    body: 'When it goes quiet, Spark drops one question, vote or photo task a day. Everyone sees it; anyone can turn it off.',
    art: (h) => <InviteSparkArt height={h} />,
  },
];

/**
 * The feature screens (S2): three pages you swipe through before any ask. Your squad is
 * alive, rooms to hang out in, Spark for when it goes quiet. Each page has one graphic and
 * one idea; the last one takes your seat.
 */
export function InviteView() {
  const insets = useSafeAreaInsets();
  const bottomInset = useBottomInset();
  const { width } = useWindowDimensions();
  const setOrigin = useAppStore((s) => s.setOrigin);
  const pager = useRef<ScrollViewInstance>(null);
  const [page, setPage] = useState(0);
  const last = page === PAGES.length - 1;

  const start = (origin: 'invite' | 'own') => {
    setOrigin(origin);
    router.push('/onboarding/purpose');
  };
  const next = () => {
    haptics.select();
    if (last) return start('invite');
    pager.current?.scrollTo({ x: (page + 1) * width, animated: true });
    setPage(page + 1);
  };

  return (
    <View className="flex-1 bg-canvas" style={{ paddingTop: insets.top + 16 }}>
      <ScrollView
        ref={pager}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}
        className="flex-1"
      >
        {PAGES.map((p, i) => (
          <View
            key={p.title}
            accessible={false}
            accessibilityLabel={`Page ${i + 1} of ${PAGES.length}`}
            style={{ width }}
            className="px-6"
          >
            {p.tag}
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              className="mt-2 font-display text-hero text-content"
            >
              {p.title}
            </Text>
            <FillSpace min={220} className="my-2">
              {(h) => p.art(h)}
            </FillSpace>
            <Text className="text-center font-text text-body text-content">{p.body}</Text>
          </View>
        ))}
      </ScrollView>

      <View className="gap-3 px-6 pt-5" style={{ paddingBottom: bottomInset }}>
        <View
          accessibilityLabel={`Page ${page + 1} of ${PAGES.length}`}
          className="mb-1 flex-row justify-center gap-1.5"
        >
          {PAGES.map((p, i) => (
            <View
              key={p.title}
              className={cn('h-2 rounded-full', i === page ? 'w-5 bg-content' : 'w-2 bg-faint')}
            />
          ))}
        </View>
        <Button label={last ? 'Take your seat' : 'Next'} onPress={next} />
        <TextLink label="No invite? Start your own table" onPress={() => start('own')} />
      </View>
    </View>
  );
}
