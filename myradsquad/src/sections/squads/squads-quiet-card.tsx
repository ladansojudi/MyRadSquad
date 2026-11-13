import { Text, View } from 'react-native';

import { SparkMark } from '@/components/art/spark-mark';
import { SquadEmblem } from '@/components/art/squad-emblem';
import { SparkDrop } from '@/components/spark-drop';
import { Icon } from '@/components/icon';
import { PressableScale } from '@/components/ui';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { EMPTY_THREAD, useAppStore } from '@/lib/app-store';
import { haptics } from '@/lib/haptics';
import { MEMBERS } from '@/lib/mock-data';
import { openSquad } from '@/lib/navigation';
import { squadThread, type LiveSquad } from '@/lib/squads';
import { wakeMode } from '@/lib/wake';

/**
 * A quiet squad: faded emblem, when it was last active, and either its last message or,
 * if a member added Spark, today's spark (a question, a vote or a photo task). Spark lives inside
 * its squad's card, never in a card of its own above your friends. Tap for the chat.
 */
export function SquadsQuietCard({ squad }: { squad: LiveSquad }) {
  const lip = useHardShadow(4);
  const sent = useAppStore((s) => s.threads[squadThread(squad.id)] ?? EMPTY_THREAD);
  const spark = useAppStore((s) => s.squadSpark[squad.id]);
  const asked = wakeMode(spark) === 'asked';
  const last = sent.at(-1) ?? squad.messages.at(-1);

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${squad.name}, quiet. ${asked ? 'Spark left a spark. ' : ''}Opens the chat`}
      onPress={() => {
        haptics.tap();
        openSquad(squad.id);
      }}
      className="gap-3 rounded-[24px] bg-surface p-4"
      style={lip}
    >
      <View className="flex-row items-center gap-3">
        <View className="opacity-60">
          <SquadEmblem id={squad.id} size={40} />
        </View>
        <View className="flex-1">
          <Text numberOfLines={1} className="font-heavy text-body text-content">
            {squad.name}
          </Text>
          <Text numberOfLines={1} className="font-text text-caption text-muted">
            Quiet since {squad.lastActive}
          </Text>
        </View>
        {asked ? <SparkMark size={22} /> : <Icon name="chevron-right" size={16} tone="muted" />}
      </View>

      {asked ? (
        <SparkDrop squadId={squad.id} bare />
      ) : last ? (
        <Text numberOfLines={1} className="font-text text-caption text-muted">
          <Text className="font-heavy">
            {last.author === 'you' ? 'You' : MEMBERS[last.author].name}:
          </Text>{' '}
          {last.text}
        </Text>
      ) : null}
    </PressableScale>
  );
}
