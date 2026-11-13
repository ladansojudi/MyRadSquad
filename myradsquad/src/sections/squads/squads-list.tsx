import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { PressableScale } from '@/components/ui';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { useAppStore } from '@/lib/app-store';

function Row({
  title,
  subtitle,
  onPress,
  leading,
  trailing,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
  leading: React.ReactNode;
  trailing?: string;
}) {
  const lip = useHardShadow(4);
  return (
    <PressableScale
      accessibilityRole="button"
      onPress={onPress}
      className="min-h-[64px] flex-row items-center gap-3 rounded-[20px] bg-surface px-3 py-2"
      style={lip}
    >
      {leading}
      <View className="flex-1">
        <Text numberOfLines={1} className="font-heavy text-body text-content">
          {title}
        </Text>
        <Text numberOfLines={1} className="font-text text-caption text-muted">
          {subtitle}
        </Text>
      </View>
      {trailing ? <Text className="font-heavy text-caption text-content">{trailing}</Text> : null}
      <Icon name="chevron-right" size={16} strokeWidth={3} />
    </PressableScale>
  );
}

/** Squads you made that nobody has joined yet (new squads are started from the + up top). */
export function SquadsList() {
  const created = useAppStore((s) => s.createdSquads);

  return (
    <View className="gap-2">
      {created
        .filter((squad) => !squad.joined)
        .map((squad) => (
          <Row
            key={squad.id}
            title={squad.name}
            subtitle="Waiting for friends · tap to invite"
            leading={
              <View className="size-10 items-center justify-center rounded-full bg-cream">
                <Icon name="plus" size={16} strokeWidth={3} />
              </View>
            }
            onPress={() => router.push({ pathname: '/invite-qr', params: { name: squad.name } })}
          />
        ))}
    </View>
  );
}
