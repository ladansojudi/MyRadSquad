import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { SparkMark } from '@/components/art/spark-mark';
import { SquadEmblem } from '@/components/art/squad-emblem';
import { NavHeader } from '@/components/nav-header';
import { Icon } from '@/components/icon';
import { useSquadSpark } from '@/hooks/use-squad-spark';
import { SQUAD_NAME } from '@/lib/mock-data';

type SquadHeaderProps = {
  subtitle?: string;
  /** A screen inside the squad (notes, moments) shows its own title. */
  title?: string;
  /** Another squad's name and mark (defaults to Lunch Table Legends). */
  name?: string;
  /** Which squad's settings the header button opens. */
  squadId?: string;
  mark?: ReactNode;
  children?: ReactNode;
};

/** The chat's settings (Spark, mute, members). Shows Spark's mark while Spark is on. */
function SquadSettingsButton({ squadId }: { squadId: string }) {
  const spark = useSquadSpark(squadId);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Squad settings"
      hitSlop={8}
      onPress={() => router.push({ pathname: '/squad-settings/[id]', params: { id: squadId } })}
      className="flex-row items-center gap-1.5 px-1"
    >
      {spark.on && !spark.muted ? <SparkMark size={18} /> : null}
      <Icon name="settings" size={22} />
    </Pressable>
  );
}

/** Back button, squad name + who's here, the settings button, and pinned rooms (children). */
export function SquadHeader({
  subtitle,
  title,
  name = SQUAD_NAME,
  squadId = 'lunch',
  mark,
  children,
}: SquadHeaderProps) {
  return (
    <>
      <NavHeader
        title={title ?? name}
        subtitle={subtitle}
        mark={mark ?? <SquadEmblem id="lunch" size={28} />}
        right={<SquadSettingsButton squadId={squadId} />}
      />
      {children ? <View className="bg-canvas px-4 pb-3 pt-1">{children}</View> : null}
    </>
  );
}
