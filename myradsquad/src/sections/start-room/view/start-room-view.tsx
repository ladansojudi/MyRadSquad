import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { RoomArt } from '@/components/art/room-art';
import { BottomSheet } from '@/components/bottom-sheet';
import { Button, PressableScale, TextField } from '@/components/ui';
import { Wireframe } from '@/components/wireframe';
import { useSquads } from '@/hooks/use-squads';
import { useAppStore } from '@/lib/app-store';
import { haptics } from '@/lib/haptics';
import { ROOM_TEMPLATES } from '@/lib/mock-data';
import { leaveSheetTo } from '@/lib/navigation';
import { squadThread } from '@/lib/squads';
import { cn } from '@/lib/utils';

type Kind = keyof typeof ROOM_TEMPLATES;
const KINDS: Kind[] = ['voice', 'focus', 'notes', 'game'];
/** A plain hangout is free; the timer, shared notes and games are Squad+ fun. */
const FREE: Kind[] = ['voice'];

/**
 * Start a room (the + in a squad chat): pick a kind, name it (optional), say what it's for
 * (optional), start. Hangout is free; Focus, Study together and Quick game come with
 * Squad+ (tapping a locked one opens Squad+).
 */
function StartRoomViewContent({ squadId }: { squadId: string }) {
  const startRoom = useAppStore((s) => s.startRoom);
  const plus = useAppStore((s) => s.plus);
  const squads = useSquads();
  const squad = squads.find((q) => q.id === squadId) ?? squads[0];
  const [kind, setKind] = useState<Kind>('voice');
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const unlocked = plus === 'trial';
  const t = ROOM_TEMPLATES[kind];

  const start = () => {
    haptics.success();
    const room = startRoom(squad.id, kind, {
      name: name.trim() || t.name,
      vibe: t.vibe,
      detail: about.trim(),
    });
    leaveSheetTo(room.href);
  };

  return (
    <BottomSheet>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        className="font-display text-headline text-content"
      >
        Start a room
      </Text>
      <Text className="mt-1 font-text text-body text-muted">
        In {squad.name}. Everyone sees it and can hop in. It closes when it empties.
      </Text>

      <View className="mt-5 flex-row gap-2">
        {KINDS.map((k) => {
          const locked = !unlocked && !FREE.includes(k);
          const selected = k === kind;
          return (
            <Pressable
              key={k}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${ROOM_TEMPLATES[k].name}${locked ? ', Squad+' : ''}`}
              onPress={() => {
                haptics.select();
                if (locked) return leaveSheetTo('/squad-plus');
                setKind(k);
              }}
              className={cn(
                'flex-1 items-center gap-1.5 rounded-[20px] py-2.5',
                selected ? 'bg-primary/15' : 'bg-cream',
              )}
            >
              <View className={locked ? 'opacity-50' : undefined}>
                <RoomArt kind={k} tone={ROOM_TEMPLATES[k].tone} size={44} alive={selected} />
              </View>
              <Text numberOfLines={1} className="font-heavy text-caption text-content">
                {k === 'voice'
                  ? 'Hangout'
                  : k === 'focus'
                    ? 'Focus'
                    : k === 'notes'
                      ? 'Study'
                      : 'Game'}
              </Text>
              <Text
                className={cn('font-text text-overline', locked ? 'text-primary' : 'text-muted')}
              >
                {locked ? '✦ Squad+' : 'Free'}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text className="mt-2 font-text text-caption text-muted">{t.blurb}</Text>

      <View className="mt-4 gap-3">
        <TextField
          value={name}
          onChangeText={setName}
          maxLength={28}
          placeholder={`Name (or "${t.name}")`}
          returnKeyType="next"
        />
        <TextField
          value={about}
          onChangeText={setAbout}
          maxLength={60}
          placeholder="What's it about? (optional)"
          returnKeyType="go"
          onSubmitEditing={start}
        />
        <Button label={`Start ${name.trim() || t.name}`} onPress={start} />
      </View>

      <PressableScale
        accessibilityRole="button"
        onPress={() => {
          haptics.tap();
          leaveSheetTo({ pathname: '/stickers', params: { thread: squadThread(squad.id) } });
        }}
        className="mt-3 items-center py-2"
      >
        <Text className="font-heavy text-caption text-content underline">Or send a sticker</Text>
      </PressableScale>
    </BottomSheet>
  );
}

/** Outside the six solutions: shown as a wireframe. */
export function StartRoomView(props: { squadId: string }) {
  return (
    <Wireframe sheet="fit">
      <StartRoomViewContent {...props} />
    </Wireframe>
  );
}
