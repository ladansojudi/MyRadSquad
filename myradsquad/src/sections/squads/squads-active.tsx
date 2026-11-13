import { useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';

import { SectionHeader } from '@/components/section-header';
import { useSquads } from '@/hooks/use-squads';
import { TIMING_OUT } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { SquadsList } from '@/sections/squads/squads-list';
import { SquadsLiveCard } from '@/sections/squads/squads-live-card';
import { SquadsQuietCard } from '@/sections/squads/squads-quiet-card';

/** Cards and headers slide to their new place when the order changes (never jump). */
const MOVE = LinearTransition.duration(320).easing(TIMING_OUT);
const GAP = 12;
/** How much of the next live card shows at the edge, so it reads as "swipe for more". */
const PEEK = 36;

/**
 * Home is two kinds of squads:
 * - Live: friends are in it right now. A carousel; each card's rooms are one tap away.
 * - Quiet: nobody is. To keep them alive, Spark asks a quiet squad a question now and then
 *   (it arrives as a notification); the card shows it, and tapping takes you into the chat,
 *   where your answer pings everyone and the squad moves back to Live.
 */
export function SquadsActive() {
  const squads = useSquads();
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);

  const live = squads.filter((s) => s.live);
  const quiet = squads.filter((s) => !s.live);
  const single = live.length === 1;
  const cardWidth = single ? width - 32 : width - 32 - PEEK;

  return (
    <View className="gap-3">
      {live.length ? (
        <Animated.View layout={MOVE} className="gap-3">
          <SectionHeader title={`Live now · ${live.length}`} className="mb-0" />
          <ScrollView
            horizontal
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            snapToInterval={cardWidth + GAP}
            decelerationRate="fast"
            scrollEnabled={!single}
            className="-mx-4"
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 6, gap: GAP }}
            onMomentumScrollEnd={(e) =>
              setPage(Math.round(e.nativeEvent.contentOffset.x / (cardWidth + GAP)))
            }
          >
            {live.map((squad) => (
              <Animated.View
                key={squad.id}
                layout={MOVE}
                entering={FadeIn.duration(220).easing(TIMING_OUT)}
              >
                <SquadsLiveCard squad={squad} width={cardWidth} />
              </Animated.View>
            ))}
          </ScrollView>
          {!single ? (
            <View className="flex-row justify-center gap-1.5">
              {live.map((s, i) => (
                <View
                  key={s.id}
                  className={cn(
                    'h-1.5 rounded-full',
                    i === page ? 'w-4 bg-content' : 'w-1.5 bg-content/25',
                  )}
                />
              ))}
            </View>
          ) : null}
        </Animated.View>
      ) : null}

      {quiet.length ? (
        <Animated.View layout={MOVE} className={cn('gap-3', live.length && 'mt-5')}>
          <SectionHeader title={`Quiet · ${quiet.length}`} className="mb-0" />
          {quiet.map((squad) => (
            <Animated.View key={squad.id} layout={MOVE}>
              <SquadsQuietCard squad={squad} />
            </Animated.View>
          ))}
        </Animated.View>
      ) : null}

      <Animated.View layout={MOVE} className="mt-3">
        <SquadsList />
      </Animated.View>
    </View>
  );
}
