import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';

import { SparkMark } from '@/components/art/spark-mark';
import { SquadEmblem } from '@/components/art/squad-emblem';
import { Icon, type IconName } from '@/components/icon';
import { LiveDot } from '@/components/motion/live-dot';
import { useSquadRooms } from '@/hooks/use-rooms';
import { usePalette } from '@/hooks/use-palette';
import { useSquadSpark } from '@/hooks/use-squad-spark';
import { useSquads } from '@/hooks/use-squads';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { useBottomInset } from '@/hooks/use-bottom-inset';
import { useAppStore } from '@/lib/app-store';
import { haptics } from '@/lib/haptics';
import { shareInvite } from '@/lib/invite';
import { FREE_SEATS, MEMBERS, PLUS_SEATS } from '@/lib/mock-data';
import { roomsSummary } from '@/lib/rooms';
import { cn } from '@/lib/utils';

const FACE: Record<string, string> = {
  coral: 'bg-accent',
  teal: 'bg-teal',
  cobalt: 'bg-cobalt',
  surface: 'bg-canvas',
};

function Group({ title, children }: { title: string; children: ReactNode }) {
  const lip = useHardShadow(4);
  return (
    <View className="gap-2">
      <Text className="px-1 font-heavy text-overline uppercase tracking-widest text-muted">
        {title}
      </Text>
      <View className="overflow-hidden rounded-[22px] bg-surface" style={lip}>
        {children}
      </View>
    </View>
  );
}

type RowProps = {
  icon?: IconName;
  lead?: ReactNode;
  label: string;
  detail?: string;
  right?: ReactNode;
  danger?: boolean;
  last?: boolean;
  onPress?: () => void;
};

function Row({ icon, lead, label, detail, right, danger, last, onPress }: RowProps) {
  const body = (
    <View
      className={cn(
        'min-h-[56px] flex-row items-center gap-3 px-4 py-3',
        !last && 'border-b border-cream',
      )}
    >
      {lead ??
        (icon ? (
          <View className="size-9 items-center justify-center rounded-xl bg-cream">
            <Icon name={icon} size={18} tone={danger ? 'coral' : 'ink'} />
          </View>
        ) : null)}
      <View className="flex-1">
        <Text className={cn('font-heavy text-body', danger ? 'text-alert' : 'text-content')}>
          {label}
        </Text>
        {detail ? <Text className="font-text text-caption text-muted">{detail}</Text> : null}
      </View>
      {right ?? (onPress ? <Icon name="chevron-right" size={16} tone="muted" /> : null)}
    </View>
  );
  return onPress ? (
    <Pressable accessibilityRole="button" onPress={onPress} className="active:bg-cream">
      {body}
    </Pressable>
  ) : (
    body
  );
}

/**
 * One squad's settings, opened from the chat header: who's in it, your notifications,
 * Spark (on / muted for you / removed for everyone), rooms, invite, leave. Every chat has
 * one, so Spark is controlled where it lives.
 */
export function SquadSettingsView({ squadId }: { squadId: string }) {
  const lip = useHardShadow(4);
  const bottomInset = useBottomInset();
  const p = usePalette();
  const squads = useSquads();
  const squad = squads.find((s) => s.id === squadId) ?? squads[0];
  const spark = useSquadSpark(squad.id);
  const plus = useAppStore((s) => s.plus);
  const muted = useAppStore((s) => s.mutedSquads.includes(squad.id));
  const toggleMute = useAppStore((s) => s.toggleMuteSquad);
  const showToast = useAppStore((s) => s.showToast);
  const rooms = useSquadRooms(squad);
  const seats = plus === 'trial' ? PLUS_SEATS : FREE_SEATS;
  const switchColors = {
    trackColor: { true: p.teal, false: p.cream },
    ios_backgroundColor: p.cream,
  };

  const close = (then: () => void) => {
    router.back();
    setTimeout(then, 50);
  };

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-6 px-4 pt-8"
      contentContainerStyle={{ paddingBottom: bottomInset + 16 }}
    >
      <View className="items-center gap-2">
        <View className="rounded-[28px] bg-surface p-3" style={lip}>
          <SquadEmblem id={squad.id} size={64} alive={squad.live} />
        </View>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          className="font-display text-headline text-content"
        >
          {squad.name}
        </Text>
        <Text className="font-text text-caption text-muted">
          {squad.members.length} of {seats} seats ·{' '}
          {squad.live ? `${squad.friendsHere.length} here now` : `quiet since ${squad.lastActive}`}
        </Text>
      </View>

      <Group title="Spark · AI">
        {spark.on ? (
          <>
            <Row
              lead={
                <View className="size-9 items-center justify-center rounded-xl bg-cobalt/40">
                  <SparkMark size={16} />
                </View>
              }
              label="Spark is on"
              detail={`Added by ${spark.addedBy === 'you' ? 'you' : MEMBERS[spark.addedBy].name}`}
            />
            <Row
              icon="bell-off"
              label="Mute Spark for me"
              detail="Only for you"
              right={
                <Switch
                  {...switchColors}
                  value={spark.muted}
                  onValueChange={() => {
                    haptics.select();
                    spark.toggleMuted();
                  }}
                />
              }
            />
            <Row
              icon="close"
              label="Remove Spark"
              detail="For everyone"
              danger
              last
              onPress={() => {
                haptics.success();
                spark.remove();
                showToast(`Spark removed · ${squad.name} sees "You removed Spark"`);
              }}
            />
          </>
        ) : (
          <Row
            lead={
              <View className="size-9 items-center justify-center rounded-xl bg-cobalt/40">
                <SparkMark size={16} />
              </View>
            }
            label="Add Spark"
            detail={`One spark a day when ${squad.name} goes quiet${plus === 'trial' ? '' : ' · Squad+'}`}
            last
            onPress={() =>
              close(() => router.push({ pathname: '/spark/add', params: { squad: squad.id } }))
            }
          />
        )}
      </Group>

      <Group title="Notifications">
        <Row
          icon={muted ? 'bell-off' : 'bell'}
          label="Mute this squad"
          detail={muted ? 'No pings' : undefined}
          last
          right={
            <Switch
              {...switchColors}
              value={muted}
              onValueChange={() => {
                haptics.select();
                toggleMute(squad.id);
              }}
            />
          }
        />
      </Group>

      <Group title={`Members · ${squad.members.length}`}>
        {squad.members.map((id, i) => {
          const here = id === 'you' || squad.friendsHere.includes(id);
          return (
            <Row
              key={id}
              lead={
                <View
                  className={cn(
                    'size-9 items-center justify-center rounded-full',
                    FACE[MEMBERS[id].tone] ?? 'bg-canvas',
                    !here && 'opacity-50',
                  )}
                >
                  <Text className="font-display text-body text-content">{MEMBERS[id].letter}</Text>
                </View>
              }
              label={id === 'you' ? 'You' : MEMBERS[id].name}
              detail={id === 'you' ? undefined : here ? 'Here now' : 'Away'}
              right={here && id !== 'you' ? <LiveDot size={8} /> : <View />}
            />
          );
        })}
        <Row
          icon="user"
          label="Invite friends"
          detail={`${seats - squad.members.length} seats left`}
          last
          onPress={() => shareInvite(squad.name)}
        />
      </Group>

      <Group title="Squad">
        {squad.id === 'lunch' ? (
          <>
            <Row
              icon="file"
              label="Notes & study"
              detail="6 shared notes · flashcards"
              onPress={() => close(() => router.push('/squad/study'))}
            />
            <Row
              icon="photo"
              label="Squad moments"
              detail="Today's moments from this squad"
              onPress={() => close(() => router.push('/squad/moments'))}
            />
          </>
        ) : null}
        <Row
          icon="headphones"
          label="Rooms"
          detail={roomsSummary(rooms)}
          onPress={() =>
            close(() => router.push({ pathname: '/rooms/[id]', params: { id: squad.id } }))
          }
        />
        <Row
          icon="logout"
          label="Leave squad"
          detail="You can join again with an invite"
          danger
          last
          onPress={() => {
            haptics.tap();
            showToast('Prototype: leaving is not wired up');
          }}
        />
      </Group>
    </ScrollView>
  );
}
