import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';

import { SparkMark } from '@/components/art/spark-mark';
import { Icon } from '@/components/icon';
import { SectionHeader } from '@/components/section-header';
import { Button } from '@/components/ui';
import { StatusBand, TabTitle } from '@/components/tab-title';
import { Wireframe } from '@/components/wireframe';
import { usePalette } from '@/hooks/use-palette';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { selectIsMinor, useAppStore } from '@/lib/app-store';
import { haptics } from '@/lib/haptics';
import { requestNotificationPermission } from '@/lib/notify-permission';
import { OTHER_SQUADS, SQUAD_NAME } from '@/lib/mock-data';

function Group({ title, children }: { title: string; children: ReactNode }) {
  const lip = useHardShadow(4);
  return (
    <View>
      <SectionHeader title={title} />
      <View className="overflow-hidden rounded-[22px] bg-surface" style={lip}>
        {children}
      </View>
    </View>
  );
}

type RowProps = {
  label: string;
  detail?: string;
  last?: boolean;
  right?: ReactNode;
  onPress?: () => void;
};

function Row({ label, detail, last = false, right, onPress }: RowProps) {
  const body = (
    <View
      className={
        last
          ? 'min-h-[56px] flex-row items-center gap-3 px-4 py-3'
          : 'min-h-[56px] flex-row items-center gap-3 border-b border-cream px-4 py-3'
      }
    >
      <View className="flex-1">
        <Text className="font-heavy text-body text-content">{label}</Text>
        {detail ? <Text className="font-text text-caption text-muted">{detail}</Text> : null}
      </View>
      {right ?? (onPress ? <Icon name="chevron-right" size={16} strokeWidth={3} /> : null)}
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

/** You: who you are here, your Squad+ status, and the settings a teen (and parent) cares about. */
function YouViewContent() {
  const lip = useHardShadow(4);
  const palette = usePalette();
  const plus = useAppStore((s) => s.plus);
  const isMinor = useAppStore(selectIsMinor);
  const notificationsOn = useAppStore((s) => s.notificationsOn);
  const setNotificationsOn = useAppStore((s) => s.setNotificationsOn);
  const sparkAdded = useAppStore((s) => s.sparkAdded);
  const sparkMuted = useAppStore((s) => s.sparkMuted);
  const toggleSparkMuted = useAppStore((s) => s.toggleSparkMuted);
  const createdCount = useAppStore((s) => s.createdSquads.length);
  const origin = useAppStore((s) => s.origin);
  const squadCount = (origin === 'invite' ? 1 + OTHER_SQUADS.length : 1) + createdCount;
  const showToast = useAppStore((s) => s.showToast);

  const switchColors = {
    trackColor: { true: palette.teal, false: palette.cream },
    ios_backgroundColor: palette.cream,
  };

  const plusCard = {
    free: {
      title: 'Squad+',
      body: '12 seats, themes, games and Spark. 3 days free.',
      cta: 'See Squad+',
    },
    trial: {
      title: 'Squad+ trial',
      body: '3 days free, then $29.99/yr. Cancel anytime in Settings.',
      cta: 'Manage',
    },
    pending: {
      title: 'Waiting for a parent',
      body: 'Squad+ turns on when they say yes. Your table works as usual.',
      cta: 'Remind them',
    },
  }[plus];

  return (
    <View className="flex-1 bg-canvas">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="flex-1 bg-canvas"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-8 px-4 pb-10"
      >
        <TabTitle title="You" />
        {/* Profile row, like the top of iOS Settings. */}
        <View className="flex-row items-center gap-4 rounded-[22px] bg-surface p-4" style={lip}>
          <View className="size-14 items-center justify-center rounded-full bg-cobalt">
            <Text className="font-display text-headline text-cobalt-content">Y</Text>
          </View>
          <View className="flex-1">
            <Text className="font-heavy text-subtitle text-content">You</Text>
            <Text className="font-text text-caption text-muted">
              {squadCount} squads · {SQUAD_NAME}
            </Text>
          </View>
        </View>

        <View className="gap-3 rounded-[24px] bg-surface p-4" style={lip}>
          <View className="flex-row items-center gap-3">
            <View className="size-10 items-center justify-center rounded-xl bg-cobalt">
              <SparkMark size={16} variant="solid" />
            </View>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              className="flex-1 font-display text-subtitle text-content"
            >
              {plusCard.title}
            </Text>
            {plus !== 'free' ? (
              <View className="rounded-full bg-canvas px-2.5 py-1">
                <Text className="font-heavy text-overline text-content">
                  {plus === 'trial' ? 'ACTIVE' : 'ASKED'}
                </Text>
              </View>
            ) : null}
          </View>
          <Text className="font-text text-body text-muted">{plusCard.body}</Text>
          <Button
            label={plusCard.cta}
            size="md"
            variant={plus === 'free' ? 'primary' : 'outline'}
            onPress={() => {
              if (plus === 'free') router.push('/squad-plus');
              else if (plus === 'trial') showToast('Manage in Settings › Apple ID › Subscriptions');
              else showToast('Reminder sent to your parent');
            }}
          />
        </View>

        <Group title="NOTIFICATIONS">
          <Row
            label="Squad answers"
            detail="At most 1 a day, only from your squads"
            last
            right={
              <Switch
                {...switchColors}
                value={notificationsOn}
                onValueChange={async (on) => {
                  haptics.select();
                  setNotificationsOn(on ? await requestNotificationPermission() : false);
                }}
              />
            }
          />
        </Group>

        <Group title="SPARK · AI">
          {sparkAdded ? (
            <Row
              label={`Spark in ${SQUAD_NAME}`}
              detail={sparkMuted ? 'Muted for you' : 'One spark a day when the chat goes quiet'}
              last
              right={
                <Switch
                  {...switchColors}
                  value={!sparkMuted}
                  onValueChange={() => {
                    haptics.select();
                    toggleSparkMuted();
                  }}
                />
              }
            />
          ) : (
            <Row
              label="Add Spark to a squad"
              detail="Reads only that squad's chat"
              last
              onPress={() => router.push('/spark/add')}
            />
          )}
        </Group>

        <Group title="PRIVACY">
          <Row
            label="Birthday"
            detail="Only used for the 13+ check. Your squad never sees it."
            onPress={() => router.push('/why-age')}
          />
          <Row
            label="Purchases"
            detail={
              isMinor ? 'Ask to Buy: a parent approves every purchase' : 'Managed by your Apple ID'
            }
          />
          <Row label="Who can add me" detail="Only people with your squad's invite link" last />
        </Group>

        <Group title="Prototype">
          <Row
            label="Prototype menu"
            detail="Jump to any state, or start over"
            last
            onPress={() => router.push('/prototype')}
          />
        </Group>
      </ScrollView>
      <StatusBand />
    </View>
  );
}

/** Outside the six solutions: shown as a wireframe. */
export function YouView() {
  return (
    <Wireframe>
      <YouViewContent />
    </Wireframe>
  );
}
