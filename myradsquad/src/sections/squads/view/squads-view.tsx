import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, View } from 'react-native';

import { StatusBand, TabTitle } from '@/components/tab-title';
import { useAppStore } from '@/lib/app-store';
import { SquadsActive } from '@/sections/squads/squads-active';
import { SquadsEmpty } from '@/sections/squads/squads-empty';
import { SquadsNewButton } from '@/sections/squads/squads-new-button';

const LIVE_EVENT_DELAY_MS = 14000;
const SPARK_PING_DELAY_MS = 4000;

export function SquadsView() {
  const origin = useAppStore((s) => s.origin);
  const liveEventDone = useAppStore((s) => s.liveEventDone);
  const triggerLiveEvent = useAppStore((s) => s.triggerLiveEvent);
  const sparkPingDone = useAppStore((s) => s.sparkPingDone);
  const triggerSparkPing = useAppStore((s) => s.triggerSparkPing);

  // Mock: a few seconds in, Spark asks the quiet squad (Cousins) a question, delivered like
  // a notification. In the real app this is a push, at most once a day per quiet squad.
  useFocusEffect(
    useCallback(() => {
      if (origin !== 'invite' || sparkPingDone) return;
      const id = setTimeout(() => triggerSparkPing('cousins'), SPARK_PING_DELAY_MS);
      return () => clearTimeout(id);
    }, [origin, sparkPingDone, triggerSparkPing]),
  );

  // Mock "something happens": a little while after you land on Home, another squad comes
  // alive (once per session). Its card takes "Live now" and an in-app banner says why.
  useFocusEffect(
    useCallback(() => {
      if (origin !== 'invite' || liveEventDone) return;
      const id = setTimeout(triggerLiveEvent, LIVE_EVENT_DELAY_MS);
      return () => clearTimeout(id);
    }, [origin, liveEventDone, triggerLiveEvent]),
  );
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // The ScrollView is the screen's root so the tab bar minimizes on scroll and the inset
  // under the status bar is automatic. The title row is ours: "Squads", the date, and "+ New squad" (Squad+ lives in You).
  return (
    <View className="flex-1 bg-canvas">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        className="flex-1 bg-canvas"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="px-4 pb-10"
      >
        <TabTitle title="Squads" subtitle={today} right={<SquadsNewButton />} className="mb-5" />
        {origin === 'invite' ? <SquadsActive /> : <SquadsEmpty />}
      </ScrollView>
      <StatusBand />
    </View>
  );
}
