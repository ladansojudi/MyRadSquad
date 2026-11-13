import { router, Stack } from 'expo-router';
import { useMemo, useState, type ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { RoomArt, VibeTag } from '@/components/art/room-art';
import { SquadEmblem } from '@/components/art/squad-emblem';
import { Icon } from '@/components/icon';
import { LiveDot } from '@/components/motion/live-dot';
import { SectionHeader } from '@/components/section-header';
import { PressableScale } from '@/components/ui';
import { TabTitle } from '@/components/tab-title';
import { Wireframe } from '@/components/wireframe';
import { useAllRooms } from '@/hooks/use-rooms';
import { useSquads } from '@/hooks/use-squads';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { haptics } from '@/lib/haptics';
import { MEMBERS, type MemberId } from '@/lib/mock-data';
import { openSquad } from '@/lib/navigation';
import { roomsSummary, squadRooms, type LiveRoom } from '@/lib/rooms';
import { searchAll, whereIs } from '@/lib/search';
import { cn } from '@/lib/utils';

const AVATAR: Record<string, string> = {
  coral: 'bg-accent',
  teal: 'bg-teal',
  cobalt: 'bg-cobalt',
  surface: 'bg-content',
};

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
  lead: ReactNode;
  title: string;
  detail: string;
  live?: boolean;
  right?: ReactNode;
  last?: boolean;
  onPress: () => void;
};

function Row({ lead, title, detail, live = false, right, last = false, onPress }: RowProps) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${detail}`}
      onPress={() => {
        haptics.tap();
        onPress();
      }}
      className={cn('flex-row items-center gap-3 px-4 py-3', !last && 'border-b border-cream')}
    >
      {lead}
      <View className="flex-1">
        <Text numberOfLines={1} className="font-heavy text-body text-content">
          {title}
        </Text>
        <View className="flex-row items-center gap-1.5">
          {live ? <LiveDot size={7} /> : null}
          <Text
            numberOfLines={1}
            className={cn('flex-1 font-text text-caption', live ? 'text-live' : 'text-muted')}
          >
            {detail}
          </Text>
        </View>
      </View>
      {right ?? <Icon name="chevron-right" size={14} strokeWidth={3} />}
    </PressableScale>
  );
}

function Face({ id, away = false }: { id: MemberId; away?: boolean }) {
  const m = MEMBERS[id];
  return (
    <View
      className={cn(
        'size-11 items-center justify-center rounded-full',
        away ? 'bg-faint' : (AVATAR[m.tone] ?? 'bg-content'),
      )}
    >
      <Text className="font-display text-subtitle text-content">{m.letter}</Text>
    </View>
  );
}

function RoomRow({ room, last }: { room: LiveRoom & { squad: string }; last: boolean }) {
  return (
    <Row
      lead={<RoomArt kind={room.kind} tone={room.tone} size={44} alive={room.live} />}
      title={room.name}
      detail={`${room.squad} · ${room.inside.length} in · ${room.detail}`}
      live={room.live}
      right={<VibeTag vibe={room.vibe} />}
      last={last}
      onPress={() => router.push(room.href)}
    />
  );
}

/**
 * Search (the iOS 26 search tab): squads, rooms, friends and messages. With nothing typed it
 * shows what's live, who's around, and quick filters for fun or study rooms.
 */
function SearchViewContent() {
  const lip = useHardShadow(4);
  const [query, setQuery] = useState('');
  const squads = useSquads();
  const all = useAllRooms();
  const rooms = useMemo(
    () => squads.flatMap((s) => squadRooms(s, all).map((r) => ({ ...r, squad: s.name }))),
    [squads, all],
  );
  const found = useMemo(() => searchAll(query, squads, rooms), [query, squads, rooms]);
  const friends = useMemo(() => {
    const ids = new Set<MemberId>();
    for (const s of squads) for (const m of s.members) if (m !== 'you') ids.add(m);
    return [...ids].map((id) => ({ id, ...whereIs(id, squads, rooms) }));
  }, [squads, rooms]);

  const typed = query.trim().length > 0;
  const empty =
    typed &&
    !found.squads.length &&
    !found.rooms.length &&
    !found.friends.length &&
    !found.messages.length;
  const liveRooms = rooms.filter((r) => r.live);
  const shownFriends = typed ? friends.filter((f) => found.friends.includes(f.id)) : friends;

  return (
    <>
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            placeholder: 'Squads, rooms, friends',
            onChangeText: (e) => setQuery(e.nativeEvent.text),
            onCancelButtonPress: () => setQuery(''),
          },
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        className="flex-1 bg-canvas"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-8 px-4 pb-10"
      >
        <TabTitle title="Search" />
        {!typed ? (
          <View className="flex-row gap-2">
            {(['fun', 'study'] as const).map((v) => (
              <PressableScale
                key={v}
                accessibilityRole="button"
                onPress={() => {
                  haptics.select();
                  setQuery(v);
                }}
                className="flex-1 flex-row items-center gap-3 rounded-[22px] bg-surface p-3"
                style={lip}
              >
                <RoomArt
                  kind={v === 'fun' ? 'game' : 'notes'}
                  tone={v === 'fun' ? 'coral' : 'teal'}
                  size={44}
                />
                <View>
                  <Text className="font-heavy text-body text-content">
                    {v === 'fun' ? 'Fun rooms' : 'Study rooms'}
                  </Text>
                  <Text className="font-text text-caption text-muted">
                    {rooms.filter((r) => r.vibe === v).length} open
                  </Text>
                </View>
              </PressableScale>
            ))}
          </View>
        ) : null}

        {empty ? (
          <View className="items-center gap-1 py-10">
            <Text className="font-heavy text-subtitle text-content">Nothing for “{query}”</Text>
            <Text className="text-center font-text text-caption text-muted">
              Try a friend’s name, a room, or “fun” / “study”.
            </Text>
          </View>
        ) : null}

        {(typed ? found.rooms : liveRooms).length ? (
          <Group title={typed ? 'Rooms' : 'Live now'}>
            {(typed ? found.rooms : liveRooms).map((r, i, all) => (
              <RoomRow key={r.id} room={r} last={i === all.length - 1} />
            ))}
          </Group>
        ) : null}

        {typed && found.squads.length ? (
          <Group title="Squads">
            {found.squads.map((s, i) => (
              <Row
                key={s.id}
                lead={<SquadEmblem id={s.id} size={44} />}
                title={s.name}
                detail={roomsSummary(squadRooms(s, all))}
                live={s.live}
                last={i === found.squads.length - 1}
                onPress={() => router.push({ pathname: '/rooms/[id]', params: { id: s.id } })}
              />
            ))}
          </Group>
        ) : null}

        {shownFriends.length ? (
          <Group title="Friends">
            {shownFriends.map((f, i) => (
              <Row
                key={f.id}
                lead={<Face id={f.id} away={!f.live} />}
                title={MEMBERS[f.id].name}
                detail={f.line}
                live={f.live}
                last={i === shownFriends.length - 1}
                onPress={() => {
                  const squad = squads.find((s) => s.members.includes(f.id));
                  if (f.room) router.push(f.room.href);
                  else if (squad) openSquad(squad.id);
                }}
              />
            ))}
          </Group>
        ) : null}

        {typed && found.messages.length ? (
          <Group title="Messages">
            {found.messages.map((m, i) => (
              <Row
                key={`${m.squadId}-${i}`}
                lead={<Face id={m.author} />}
                title={`${MEMBERS[m.author].name} · ${m.squad}`}
                detail={m.text}
                last={i === found.messages.length - 1}
                onPress={() => openSquad(m.squadId)}
              />
            ))}
          </Group>
        ) : null}
      </ScrollView>
    </>
  );
}

/** Outside the six solutions: shown as a wireframe. */
export function SearchView() {
  return (
    <Wireframe>
      <SearchViewContent />
    </Wireframe>
  );
}
