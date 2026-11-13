import { useState } from 'react';
import { Text, View } from 'react-native';

import { PersonAvatar } from '@/components/person-avatar';
import { SparkMark } from '@/components/art/spark-mark';
import { Icon } from '@/components/icon';
import { PressableScale } from '@/components/ui';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { useAppStore } from '@/lib/app-store';
import { haptics } from '@/lib/haptics';
import { MEMBERS, type MemberId } from '@/lib/mock-data';
import { openSquad } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { wakeCopy } from '@/lib/wake';

const KIND_LABEL = { question: 'Question', vote: 'Vote', photo: 'Photo task' } as const;

/** The friend a vote option names ("Me" is you), drawn as their seat tile. */
function voter(option: string): { id: MemberId } {
  const found = (Object.keys(MEMBERS) as MemberId[]).find((id) => MEMBERS[id].name === option);
  return { id: found ?? 'you' };
}

/**
 * Spark's one spark for a quiet squad (at most once a day): a question, a quick vote or a
 * photo task. Everyone in the squad sees it; nothing is counted, nothing is lost if you skip
 * it. Your answer is what pings your friends (you, not Spark), and the squad wakes up.
 */
export function SparkDrop({
  squadId,
  inChat = false,
  bare = false,
  className,
}: {
  squadId: string;
  /** In the squad's own chat the question is answered with the composer below. */
  inChat?: boolean;
  /** Inside a squad's Home card: no block of its own, the card is the frame. */
  bare?: boolean;
  className?: string;
}) {
  const wakeSquad = useAppStore((s) => s.wakeSquad);
  const by = useAppStore((s) => s.squadSpark[squadId]?.by);
  const { drop } = wakeCopy(squadId);
  const [done, setDone] = useState<string | null>(null);
  const buttonLip = useHardShadow(3, 'primary');
  const addedBy = !by || by === 'you' ? 'you' : MEMBERS[by].name;

  const answer = (text: string, note: string) => {
    haptics.success();
    setDone(note);
    wakeSquad(squadId, text);
  };

  return (
    <View
      accessible={false}
      className={cn('gap-3', !bare && 'rounded-2xl bg-cobalt/30 p-3', className)}
    >
      {bare ? null : (
        <View className="flex-row items-center gap-1.5">
          <SparkMark size={14} />
          <Text className="flex-1 font-heavy text-overline text-content">
            Spark · added by {addedBy}
          </Text>
          <View className="rounded-full bg-surface px-2 py-0.5">
            <Text className="font-heavy text-overline text-content">{KIND_LABEL[drop.kind]}</Text>
          </View>
        </View>
      )}
      <Text className="font-heavy text-body text-content">{drop.text}</Text>

      {done ? (
        <View className="flex-row items-center gap-1.5">
          <Icon name="check" size={16} tone="ink" strokeWidth={2.8} />
          <Text className="flex-1 font-strong text-caption text-content">{done}</Text>
        </View>
      ) : drop.kind === 'vote' ? (
        <View className="flex-row gap-2">
          {drop.options.map((option) => {
            const who = voter(option);
            return (
              <PressableScale
                key={option}
                accessibilityRole="button"
                accessibilityLabel={`Vote ${option}`}
                onPress={() =>
                  answer(`🗳️ ${option}`, `You voted ${option}. Your squad got a ping.`)
                }
                className="flex-1 items-center gap-1.5 rounded-2xl bg-cream py-2.5"
              >
                <PersonAvatar id={who.id} size={36} />
                <Text numberOfLines={1} className="font-heavy text-caption text-content">
                  {option}
                </Text>
              </PressableScale>
            );
          })}
        </View>
      ) : drop.kind === 'photo' ? (
        <PressableScale
          accessibilityRole="button"
          onPress={() => answer(drop.caption, 'Photo sent. Your squad got a ping.')}
          className="h-10 flex-row items-center justify-center gap-2 self-start rounded-full bg-primary px-4"
          style={buttonLip}
        >
          <Icon name="camera" size={16} tone="surface" strokeWidth={2.4} />
          <Text className="font-heavy text-body text-primary-content">Add a photo</Text>
        </PressableScale>
      ) : inChat ? (
        <Text className="font-text text-caption text-content">
          Answer below. It pings your squad.
        </Text>
      ) : (
        <PressableScale
          accessibilityRole="button"
          onPress={() => {
            haptics.tap();
            openSquad(squadId);
          }}
          className="h-10 flex-row items-center justify-center gap-1.5 self-start rounded-full bg-primary px-4"
          style={buttonLip}
        >
          <Text className="font-heavy text-body text-primary-content">Answer</Text>
          <Icon name="chevron-right" size={14} tone="surface" strokeWidth={2.8} />
        </PressableScale>
      )}
      {bare && !done ? (
        <Text numberOfLines={1} className="font-text text-caption text-muted">
          Spark, added by {addedBy} · your answer pings the squad
        </Text>
      ) : null}
    </View>
  );
}
