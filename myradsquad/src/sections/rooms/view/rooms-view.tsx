import { router } from 'expo-router';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';

import { SquadEmblem } from '@/components/art/squad-emblem';
import { Icon } from '@/components/icon';
import { SectionHeader } from '@/components/section-header';
import { Wireframe } from '@/components/wireframe';
import { useSquadRooms } from '@/hooks/use-rooms';
import { useSquads } from '@/hooks/use-squads';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { useBottomInset } from '@/hooks/use-bottom-inset';
import { haptics } from '@/lib/haptics';
import { openSquad } from '@/lib/navigation';
import { roomsSummary } from '@/lib/rooms';
import { RoomsAddCard, RoomsCard } from '@/sections/rooms/rooms-card';
import { RoomsHero } from '@/sections/rooms/rooms-hero';

/**
 * A squad's rooms, as a sheet: the busiest room on top (Join room / Mute), then every other
 * room in a grid (FUN / STUDY tags), then a slim New room row. Rooms with people in them move; quiet ones stand still.
 */
function RoomsViewContent({ squadId }: { squadId: string }) {
  const lip = useHardShadow(4);
  const bottomInset = useBottomInset();
  const { width } = useWindowDimensions();
  const squads = useSquads();
  const squad = squads.find((s) => s.id === squadId) ?? squads[0];
  const rooms = useSquadRooms(squad);

  const [hero, ...rest] = rooms;
  const cardWidth = (width - 32 - 12) / 2;

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-6 px-4 pt-8"
      contentContainerStyle={{ paddingBottom: bottomInset + 16 }}
    >
      <View className="flex-row items-center gap-3">
        <View className="rounded-2xl bg-surface p-1.5" style={lip}>
          <SquadEmblem id={squad.id} size={44} alive={squad.live} />
        </View>
        <View className="flex-1">
          <Text numberOfLines={1} className="font-heavy text-overline tracking-widest text-muted">
            {squad.name.toUpperCase()}
          </Text>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            className="font-display text-headline text-content"
          >
            Rooms
          </Text>
          <Text className="font-text text-caption text-muted">
            {roomsSummary(rooms)}
            {squad.live ? ` · ${squad.friendsHere.length} friends here` : ''}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open ${squad.name} chat`}
          hitSlop={8}
          onPress={() => {
            haptics.tap();
            router.back();
            openSquad(squad.id);
          }}
          className="size-12 items-center justify-center rounded-full bg-surface"
        >
          <Icon name="chat" size={22} />
        </Pressable>
      </View>

      {hero ? (
        <RoomsHero room={hero} />
      ) : (
        <Text className="font-text text-body text-muted">
          No rooms open. Start one and your squad can hop in.
        </Text>
      )}

      <View className="gap-3">
        {rest.length ? (
          <SectionHeader title={`Also open · ${rest.length}`} className="mb-0" />
        ) : null}
        <View className="flex-row flex-wrap gap-3">
          {rest.map((room, i) => (
            <RoomsCard key={room.id} room={room} index={i} width={cardWidth} />
          ))}
        </View>
        <RoomsAddCard index={rest.length} squadId={squad.id} />
      </View>
    </ScrollView>
  );
}

/** Outside the six solutions: shown as a wireframe. */
export function RoomsView(props: { squadId: string }) {
  return (
    <Wireframe sheet="fill">
      <RoomsViewContent {...props} />
    </Wireframe>
  );
}
