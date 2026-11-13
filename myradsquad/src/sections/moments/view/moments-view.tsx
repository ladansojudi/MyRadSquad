import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { SeatTile } from '@/components/art/seat-tile';
import { SectionHeader } from '@/components/section-header';
import { SegmentedControl } from '@/components/segmented-control';
import { PressableScale } from '@/components/ui';
import { StatusBand, TabTitle } from '@/components/tab-title';
import { HeaderButton } from '@/components/header-button';
import { Wireframe } from '@/components/wireframe';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { useAppStore } from '@/lib/app-store';
import {
  MEMBERS,
  MEMORIES,
  MOMENTS,
  SQUAD_NAME,
  type MemberId,
  type Memory,
  type MomentTone,
  type Photo,
} from '@/lib/mock-data';
import { daysBetween } from '@/lib/calendar';
import { haptics } from '@/lib/haptics';
import { TIMING_OUT } from '@/lib/motion';
import { MomentsCalendar } from '@/sections/moments/moments-calendar';
import { MomentsPhoto } from '@/sections/moments/moments-photo';
import { ReactionRow } from '@/sections/squad/squad-messages';

type FeedItem = {
  id: string;
  author: MemberId;
  ago: string;
  caption: string;
  tones: [MomentTone, MomentTone, MomentTone];
  photo?: Photo;
  reactions: { label: string; count?: number }[];
  mine?: string;
  yours: boolean;
};

function MomentCard({ item }: { item: FeedItem }) {
  const author = MEMBERS[item.author];
  const open = () =>
    item.yours ? undefined : router.push({ pathname: '/squad/moments', params: { id: item.id } });
  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-3">
        <SeatTile
          letter={author.letter}
          tone={author.tone === 'surface' ? 'ink' : author.tone}
          shape="leaf"
          size={30}
          dot={false}
        />
        <View className="flex-1">
          <Text className="font-heavy text-body text-content">
            {item.yours ? 'You' : author.name} · {item.ago}
          </Text>
          <Text className="font-text text-caption text-muted">{SQUAD_NAME}</Text>
        </View>
        <Text className="font-text text-caption text-muted">gone in 24h</Text>
      </View>
      <PressableScale accessibilityRole="button" onPress={open} disabled={item.yours}>
        <MomentsPhoto tones={item.tones} photo={item.photo} caption={item.caption} height={230} />
      </PressableScale>
      {item.yours ? (
        <Text className="font-text text-caption text-muted">
          Seen by nobody yet · your squad gets a heads-up
        </Text>
      ) : (
        <ReactionRow
          id={`moment-${item.id}`}
          size="sm"
          initial={item.mine}
          reactions={item.reactions}
        />
      )}
    </View>
  );
}

/** Moments: small things not worth posting publicly, from all your squads, for 24 hours. */
type Tab = 'today' | 'memories';

/** Your memories: kept moments by day, plus anything you posted today. */
function useDayMoments(today: Date) {
  const mine = useAppStore((s) => s.myMoments);
  return useMemo(() => {
    const map = new Map<number, Memory>();
    for (const m of MEMORIES) map.set(m.daysAgo, m);
    // Today: your newest post, otherwise the squad moment you saw today.
    const todayMoment = mine[0]
      ? { daysAgo: 0, author: 'you' as const, caption: mine[0].caption, tones: mine[0].tones }
      : {
          daysAgo: 0,
          author: MOMENTS[0].author,
          caption: MOMENTS[0].caption,
          tones: MOMENTS[0].tones,
          photo: MOMENTS[0].photo,
        };
    map.set(0, todayMoment);
    // Only days in this month show on the grid.
    for (const key of [...map.keys()]) if (key > today.getDate() - 1) map.delete(key);
    return map;
  }, [mine, today]);
}

function MemoriesPanel({ today }: { today: Date }) {
  const lip = useHardShadow(4);
  const [selected, setSelected] = useState(today);
  const dayMoments = useDayMoments(today);
  const ago = daysBetween(today, selected);
  const memory = dayMoments.get(ago);
  const author = memory ? MEMBERS[memory.author] : null;
  const month = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const selectedLabel =
    ago === 0
      ? 'Today'
      : ago === 1
        ? 'Yesterday'
        : selected.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <View className="gap-6">
      <View className="rounded-[22px] bg-surface p-3" style={lip}>
        <View className="mb-3 flex-row items-end justify-between px-1">
          <Text className="font-display text-subtitle text-content">{month}</Text>
          <Text className="font-text text-caption text-muted">
            {dayMoments.size} days with a moment
          </Text>
        </View>
        <MomentsCalendar
          today={today}
          moments={dayMoments}
          selected={selected}
          onSelect={(d) => {
            haptics.select();
            setSelected(d);
          }}
        />
      </View>

      <View>
        <SectionHeader title={selectedLabel} />
        {memory && author ? (
          <Animated.View
            key={ago}
            entering={FadeIn.duration(200).easing(TIMING_OUT)}
            className="gap-3"
          >
            <MomentsPhoto
              tones={memory.tones}
              photo={memory.photo}
              caption={memory.caption}
              height={220}
            />
            <Text className="font-text text-caption text-muted">
              <Text className="font-heavy text-content">
                {memory.author === 'you' ? 'You' : author.name}
              </Text>{' '}
              · {SQUAD_NAME} · only you see past days
            </Text>
          </Animated.View>
        ) : (
          <View className="items-center gap-3 rounded-[22px] bg-surface/60 px-4 py-8">
            <Text className="font-heavy text-body text-content">No moment this day</Text>
            <Text className="text-center font-text text-caption text-muted">
              Days you or your squad post show up here.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

/** Moments: today's feed from your squads, and Memories, a calendar of past days. */
function MomentsViewContent() {
  const mine = useAppStore((s) => s.myMoments);
  const [tab, setTab] = useState<Tab>('today');
  const [today] = useState(() => new Date());

  const feed: FeedItem[] = [
    ...mine.map((m) => ({
      id: m.id,
      author: 'you' as const,
      ago: 'just now',
      caption: m.caption,
      tones: m.tones,
      reactions: [],
      yours: true,
    })),
    ...MOMENTS.map((m) => ({ ...m, yours: false })),
  ];

  return (
    <View className="flex-1 bg-canvas">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="flex-1 bg-canvas"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-6 px-4 pb-10"
      >
        <TabTitle
          title="Moments"
          right={
            <HeaderButton
              icon="camera"
              accessibilityLabel="Share a moment"
              onPress={() => router.push('/add-moment')}
            />
          }
        />
        <SegmentedControl
          segments={[
            { value: 'today', label: 'Today' },
            { value: 'memories', label: 'Memories' },
          ]}
          value={tab}
          onChange={(v) => {
            haptics.select();
            setTab(v);
          }}
        />

        {tab === 'today' ? (
          <View className="gap-8">
            <Text className="font-text text-caption text-muted">
              Moments leave the feed after 24h. You keep yours in Memories.
            </Text>
            {feed.map((item, i) => (
              <Animated.View
                key={item.id}
                entering={FadeInDown.delay(i * 60)
                  .duration(260)
                  .easing(TIMING_OUT)}
              >
                <MomentCard item={item} />
              </Animated.View>
            ))}
          </View>
        ) : (
          <MemoriesPanel today={today} />
        )}
      </ScrollView>
      <StatusBand />
    </View>
  );
}

/** Outside the six solutions: shown as a wireframe. */
export function MomentsView() {
  return (
    <Wireframe>
      <MomentsViewContent />
    </Wireframe>
  );
}
