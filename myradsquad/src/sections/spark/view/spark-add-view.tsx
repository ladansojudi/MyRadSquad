import { router } from 'expo-router';
import { Pressable, Switch, Text, View } from 'react-native';

import { SparkMark } from '@/components/art/spark-mark';
import { BottomSheet } from '@/components/bottom-sheet';
import { Icon } from '@/components/icon';
import { SegmentedControl } from '@/components/segmented-control';
import { Button, TextLink } from '@/components/ui';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { usePalette } from '@/hooks/use-palette';
import { useAppStore, type SparkVibe } from '@/lib/app-store';
import { ALL_SQUADS, SQUAD_NAME } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { haptics } from '@/lib/haptics';

const VIBES: { id: SparkVibe; label: string }[] = [
  { id: 'chill', label: 'Chill' },
  { id: 'chaotic', label: 'Chaotic' },
  { id: 'study', label: 'Study' },
];

type IconName = Parameters<typeof Icon>[0]['name'];

/** Spark's rules as four pictures and a few words each (research RQ7, RQ8, RQ11). */
const RULES: { icon: IconName; tone: string; label: string }[] = [
  { icon: 'chat', tone: 'bg-teal', label: 'Reads only this chat' },
  { icon: 'close', tone: 'bg-accent', label: 'No DMs, faces or location' },
  { icon: 'bell', tone: 'bg-cobalt', label: 'Max once a day, when quiet' },
  { icon: 'bell-off', tone: 'bg-canvas', label: 'Anyone can mute or remove' },
];

/** One rule: its icon and a few words, on one line. */
function RuleRow({ rule }: { rule: (typeof RULES)[number] }) {
  return (
    <View className={'flex-row items-center gap-3 px-3 py-2.5'}>
      <View className={cn('size-8 items-center justify-center rounded-xl', rule.tone)}>
        <Icon name={rule.icon} size={16} strokeWidth={2.4} />
      </View>
      <Text numberOfLines={1} className="flex-1 font-text text-body text-content">
        {rule.label}
      </Text>
    </View>
  );
}

/** Spark's four rules, top to bottom in one soft card. */
function SparkRules() {
  return (
    <View className="rounded-2xl bg-cream py-1">
      {RULES.map((rule) => (
        <RuleRow key={rule.label} rule={rule} />
      ))}
    </View>
  );
}

/** Title row for a Spark sheet: the mark, the squad (one line), who added it. */
function SparkTitle({ name, sub, title }: { name: string; sub: string; title?: string }) {
  return (
    <View className="flex-row items-center gap-3">
      <SparkMark size={36} alive />
      <View className="flex-1">
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          className="font-display text-subtitle text-content"
        >
          {title ?? `Spark in ${name}`}
        </Text>
        <Text numberOfLines={1} className="font-text text-caption text-muted">
          {sub}
        </Text>
      </View>
    </View>
  );
}

/** One action row: a label, and a switch or a chevron. */
function ActionRow({
  label,
  danger,
  value,
  onPress,
}: {
  label: string;
  danger?: boolean;
  value?: boolean;
  onPress: () => void;
}) {
  const p = usePalette();
  return (
    <Pressable
      accessibilityRole={value === undefined ? 'button' : 'switch'}
      accessibilityState={value === undefined ? undefined : { checked: value }}
      onPress={onPress}
      className="h-14 flex-row items-center justify-between px-4"
    >
      <Text className={cn('font-heavy text-body', danger ? 'text-alert' : 'text-content')}>
        {label}
      </Text>
      {value === undefined ? null : (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ true: p.teal, false: p.cream }}
          ios_backgroundColor={p.cream}
        />
      )}
    </Pressable>
  );
}

/** Spark is already on: who added it, the rules, and mute (you) / remove (everyone). */
function SparkManage() {
  const addedBy = useAppStore((s) => s.sparkAddedBy);
  const muted = useAppStore((s) => s.sparkMuted);
  const toggleMuted = useAppStore((s) => s.toggleSparkMuted);
  const removeSpark = useAppStore((s) => s.removeSpark);
  const showToast = useAppStore((s) => s.showToast);
  const lip = useHardShadow(4);

  return (
    <BottomSheet>
      <View className="gap-4">
        <SparkTitle
          name={SQUAD_NAME}
          sub={`Added by ${addedBy === 'you' ? 'you' : 'Maya'} · ${muted ? 'muted for you' : 'on'}`}
        />
        <SparkRules />
        <View className="overflow-hidden rounded-2xl bg-surface" style={lip}>
          <ActionRow
            label="Mute for me"
            value={muted}
            onPress={() => {
              haptics.select();
              toggleMuted();
            }}
          />
          <View className="mx-4 h-px bg-cream" />
          <ActionRow
            label="Remove Spark for everyone"
            danger
            onPress={() => {
              removeSpark();
              haptics.success();
              showToast('Spark removed · your squad sees "You removed Spark"');
              router.back();
            }}
          />
        </View>
      </View>
    </BottomSheet>
  );
}

/** Spark is on in another squad: the rules, and remove (anyone can). */
function SquadSparkManage({ squadId, name }: { squadId: string; name: string }) {
  const remove = useAppStore((s) => s.removeSquadSpark);
  const showToast = useAppStore((s) => s.showToast);
  const lip = useHardShadow(4);
  return (
    <BottomSheet>
      <View className="gap-4">
        <SparkTitle name={name} sub="Added by you · on" />
        <SparkRules />
        <View className="overflow-hidden rounded-2xl bg-surface" style={lip}>
          <ActionRow
            label="Remove Spark for everyone"
            danger
            onPress={() => {
              remove(squadId);
              haptics.success();
              showToast(`Spark removed · ${name} sees "You removed Spark"`);
              router.back();
            }}
          />
        </View>
      </View>
    </BottomSheet>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <Text className="font-heavy text-overline tracking-widest text-muted">{children}</Text>;
}

/**
 * Adding the AI is explicit: what it sees, how it behaves, who controls it. Spark is the
 * Squad+ feature, so turning it on needs Squad+ (the member who adds it pays for it);
 * everyone else in the squad gets it, and every one of them can mute or remove it.
 */
export function SparkAddView({ squadId = 'lunch' }: { squadId?: string }) {
  const vibe = useAppStore((s) => s.sparkVibe);
  const addSpark = useAppStore((s) => s.addSpark);
  const lunchSpark = useAppStore((s) => s.sparkAdded);
  const squadSpark = useAppStore((s) => s.squadSpark[squadId]);
  const addSquadSpark = useAppStore((s) => s.addSquadSpark);
  const setVibe = useAppStore((s) => s.setSparkVibe);
  const plus = useAppStore((s) => s.plus);
  const showToast = useAppStore((s) => s.showToast);
  const isLunch = squadId === 'lunch';
  const name = ALL_SQUADS.find((q) => q.id === squadId)?.name ?? SQUAD_NAME;

  if (isLunch && lunchSpark) return <SparkManage />;
  if (!isLunch && squadSpark) return <SquadSparkManage squadId={squadId} name={name} />;

  return (
    <BottomSheet fill>
      <View className="gap-3 pb-2">
        <SparkTitle
          name={name}
          title={`Add Spark to ${name}`}
          sub="One spark a day when the chat goes quiet"
        />

        <SectionLabel>PICK A VIBE</SectionLabel>
        <SegmentedControl
          segments={VIBES.map((v) => ({ value: v.id, label: v.label }))}
          value={vibe}
          onChange={(v) => {
            haptics.select();
            setVibe(v);
          }}
        />

        <SparkRules />

        <Text className="text-center font-text text-body text-muted">
          {'Your squad sees "You added Spark".'}
        </Text>
      </View>

      <View className="gap-1 pt-3">
        {plus === 'trial' ? (
          <Button
            label="Add Spark"
            variant="cobalt"
            onPress={() => {
              haptics.success();
              if (isLunch) {
                addSpark(vibe);
                router.replace('/spark/chat');
              } else {
                addSquadSpark(squadId);
                showToast(`Spark is in ${name}`);
                router.back();
              }
            }}
          />
        ) : plus === 'pending' ? (
          <Button label="Waiting for a parent to approve Squad+" variant="outline" disabled />
        ) : (
          <Button
            label="Add Spark · get Squad+"
            variant="cobalt"
            onPress={() => router.replace('/squad-plus')}
          />
        )}
        <TextLink label="Not now" onPress={() => router.back()} />
      </View>
    </BottomSheet>
  );
}
