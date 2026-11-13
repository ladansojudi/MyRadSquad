import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBottomInset } from '@/hooks/use-bottom-inset';
import { TableRing } from '@/components/art/table-ring';
import { BackButton } from '@/components/back-button';
import { Icon } from '@/components/icon';
import { Button, Chip, TextLink, TextField } from '@/components/ui';
import { Wireframe } from '@/components/wireframe';
import { useAppStore, type Purpose } from '@/lib/app-store';
import { haptics } from '@/lib/haptics';
import { copyInviteLink, shareInvite } from '@/lib/invite';
import { FREE_SEATS, MEMBERS } from '@/lib/mock-data';
import { TIMING_OUT } from '@/lib/motion';

const PURPOSES: { id: Purpose; label: string }[] = [
  { id: 'hangout', label: 'Hang out' },
  { id: 'study', label: 'Study' },
  { id: 'moments', label: 'Moments' },
];

/** Your seat plus the four free ones, around a new table. */
const PREVIEW = [
  { angle: 200, member: MEMBERS.you },
  { angle: -100 },
  { angle: -30, round: true },
  { angle: 40 },
  { angle: 120, round: true },
];

/** Start a new squad: name it, say what it's for, then invite (share, link or QR). */
function NewSquadViewContent() {
  const insets = useSafeAreaInsets();
  const bottomInset = useBottomInset();
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState<Purpose>('hangout');
  const [created, setCreated] = useState<{ id: string; name: string } | null>(null);
  const createSquad = useAppStore((s) => s.createSquad);
  const demoJoin = useAppStore((s) => s.demoJoinSquad);
  const ready = name.trim().length > 0;

  const create = () => {
    if (!ready) return;
    const finalName = name.trim();
    const id = createSquad(finalName, purpose);
    haptics.success();
    setCreated({ id, name: finalName });
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView
        className="flex-1 bg-canvas"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="grow px-6"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: bottomInset,
        }}
      >
        <View className="flex-row items-center justify-between">
          <BackButton icon="close" tone="surface" onPress={() => router.back()} />
          <Text className="font-text text-body text-content">{created ? '2 of 2' : '1 of 2'}</Text>
        </View>

        <View className="items-center py-2">
          <TableRing size={200} tableSize={112} seatSize={30} radius={82} seats={PREVIEW} />
        </View>

        {created ? (
          <Animated.View entering={FadeIn.duration(220).easing(TIMING_OUT)} className="flex-1">
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              className="font-display text-title text-content"
            >
              {created.name} is ready.
            </Text>
            <Text className="mt-2 font-text text-body text-content">
              Free tables fit {FREE_SEATS}. Your seat is taken, {FREE_SEATS - 1} to go.
            </Text>
            <View className="mt-5 gap-3">
              <Button label="Invite friends" onPress={() => shareInvite(created.name)} />
              <View className="flex-row gap-3">
                <Button
                  label="Copy link"
                  variant="outline"
                  size="md"
                  className="flex-1"
                  onPress={() => copyInviteLink(created.name)}
                />
                <Button
                  label="QR code"
                  variant="outline"
                  size="md"
                  className="flex-1"
                  onPress={() =>
                    router.push({ pathname: '/invite-qr', params: { name: created.name } })
                  }
                />
              </View>
            </View>
            <View className="flex-1" />
            {/* Prototype: pretend the invites worked, so you see the squad come alive on Home. */}
            <Text className="mt-4 text-center font-text text-caption text-muted">
              Demo: tapping Done adds three friends so you can see your squad live.
            </Text>
            <TextLink
              label="Done"
              className="mt-1"
              onPress={() => {
                demoJoin(created.id);
                router.back();
              }}
            />
          </Animated.View>
        ) : (
          <View className="flex-1">
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              className="font-display text-title text-content"
            >
              Name your squad
            </Text>
            <TextField
              on="canvas"
              className="mt-4"
              value={name}
              onChangeText={setName}
              maxLength={28}
              counter
              placeholder="Name it"
              returnKeyType="done"
              accessibilityLabel="Squad name"
            />

            <Text className="mt-6 font-heavy text-overline tracking-widest text-muted">
              {"WHAT'S IT FOR?"}
            </Text>
            <View className="mt-2 flex-row gap-2">
              {PURPOSES.map((p) => (
                <Chip
                  key={p.id}
                  label={p.label}
                  size="md"
                  tone={purpose === p.id ? 'primary' : 'surface'}
                  className="h-11 flex-1 px-2"
                  accessibilityState={{ selected: purpose === p.id }}
                  onPress={() => {
                    haptics.select();
                    setPurpose(p.id);
                  }}
                />
              ))}
            </View>

            <View className="flex-1" />
            <View className="mt-6 flex-row items-center gap-2">
              <Icon name="user" size={16} tone="muted" />
              <Text className="flex-1 font-text text-caption text-muted">
                Only people you invite can join. Nothing here is public.
              </Text>
            </View>
            <Button
              label={ready ? 'Create squad' : 'Name it to create'}
              className={ready ? 'mt-3' : 'mt-3 opacity-40'}
              disabled={!ready}
              onPress={create}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/** Outside the six solutions: shown as a wireframe. */
export function NewSquadView() {
  return (
    <Wireframe>
      <NewSquadViewContent />
    </Wireframe>
  );
}
