import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { EqBars } from '@/components/motion/eq-bars';
import { LiveDot } from '@/components/motion/live-dot';
import { SceneClock } from '@/components/motion/scene-clock';
import { Button, PressableScale } from '@/components/ui';
import { Wireframe } from '@/components/wireframe';
import { useAllRooms } from '@/hooks/use-rooms';
import { useSquads } from '@/hooks/use-squads';
import { useBottomInset } from '@/hooks/use-bottom-inset';
import { useAppStore } from '@/lib/app-store';
import { haptics } from '@/lib/haptics';
import { shareInvite } from '@/lib/invite';
import { MEMBERS, ROOM_TRACKS } from '@/lib/mock-data';
import { TIMING_OUT } from '@/lib/motion';
import { openSquad } from '@/lib/navigation';
import { findRoom, squadRooms, startedLine } from '@/lib/rooms';
import { cn } from '@/lib/utils';
import { RoomPeople } from '@/sections/room/room-people';
import { RoomAmbientReactions, RoomBurst } from '@/sections/room/room-reactions';

const BG = { cobalt: 'bg-cobalt', teal: 'bg-teal', coral: 'bg-accent', canvas: 'bg-canvas' };
const REACTIONS = ['😂', '🔥', '😮', '👀', '🫶'];

/**
 * A live room. One coloured stage: the room's name and what it's about up top, the people
 * in the middle (rings pulse on whoever is talking), friends' reactions drifting up, and
 * every control in one bar at the bottom: chat, your mic, leave.
 */
function RoomViewContent({ roomId }: { roomId?: string }) {
  const insets = useSafeAreaInsets();
  const bottomInset = useBottomInset();
  const showToast = useAppStore((s) => s.showToast);
  const squads = useSquads();
  const all = useAllRooms();
  const base = findRoom(roomId, all);
  const squad = squads.find((s) => s.id === base.squadId) ?? squads[0];
  const room = useMemo(
    () =>
      squadRooms(squad, all).find((r) => r.id === base.id) ?? { ...base, inside: [], live: false },
    [squad, base, all],
  );
  const track = ROOM_TRACKS[room.id];

  // You're already in a room you started (or are in).
  const [joined, setJoined] = useState(() => room.inside.includes('you'));
  const [talking, setTalking] = useState(false);
  const [bursts, setBursts] = useState<{ id: number; label: string; tone: number }[]>([]);
  const seq = useRef(0);
  const others = room.inside.filter((id) => id !== 'you');
  const count = others.length + (joined ? 1 : 0);

  const about = track
    ? `♪ ${track.title}`
    : room.detail && room.detail !== 'just started'
      ? room.detail
      : null;

  const join = () => {
    haptics.success();
    setJoined(true);
    showToast('You joined · mic is off');
  };
  const react = (label: string, tone: number) => {
    haptics.tap();
    seq.current += 1;
    const id = seq.current;
    setBursts((b) => [...b, { id, label, tone }]);
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1500);
  };

  return (
    <SceneClock>
      <View className={cn('flex-1', BG[room.tone])}>
        {/* Top: minimise, the room, who started it and what it's about, how many are in. */}
        <View className="flex-row items-start gap-3 px-4" style={{ paddingTop: insets.top + 8 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Minimise the room"
            hitSlop={8}
            onPress={() => router.back()}
            className="size-11 items-center justify-center rounded-full bg-surface/60"
          >
            <Icon name="chevron-down" size={22} strokeWidth={2.6} />
          </Pressable>
          <View className="flex-1 items-center pt-0.5">
            <Text numberOfLines={1} className="font-text text-caption text-content/70">
              {squad.name}
            </Text>
            <Text numberOfLines={1} className="font-display text-subtitle text-content">
              {room.name}
            </Text>
          </View>
          <View className="h-11 flex-row items-center gap-1.5 rounded-full bg-surface/60 px-3">
            <LiveDot size={7} />
            <Text className="font-heavy text-caption text-content">{count} in</Text>
          </View>
        </View>

        <View className="mt-3 items-center px-8">
          <Text numberOfLines={2} className="text-center font-text text-body text-content/80">
            {startedLine(room, MEMBERS)} {room.startedAgo}
            {about ? ` · ${about}` : ''}
          </Text>
        </View>

        {/* The stage: people in the middle, reactions drifting up around them. */}
        <View className="flex-1 justify-center px-4">
          <RoomPeople
            inside={others}
            you={joined ? { talking } : false}
            onInvite={() => shareInvite(squad.name)}
          />
          {!others.length ? (
            <Text className="mt-6 text-center font-text text-caption text-content/70">
              Waiting for friends. Your squad got a ping.
            </Text>
          ) : null}
          <View pointerEvents="none" className="absolute inset-x-0 bottom-0 h-1/2">
            {others.length ? <RoomAmbientReactions /> : null}
            {bursts.map((b) => (
              <RoomBurst key={b.id} label={b.label} tone={b.tone} />
            ))}
          </View>
        </View>

        {/* One bar for everything you do here. */}
        <View
          className="gap-4 rounded-t-[32px] bg-surface px-4 pt-4"
          style={{ paddingBottom: bottomInset }}
        >
          {joined ? (
            <>
              <Animated.View
                entering={FadeIn.duration(220).easing(TIMING_OUT)}
                className="flex-row justify-between px-2"
              >
                {REACTIONS.map((r, i) => (
                  <Pressable
                    key={r}
                    accessibilityRole="button"
                    accessibilityLabel={`React ${r}`}
                    onPress={() => react(r, i)}
                    className="size-12 items-center justify-center rounded-full bg-cream active:bg-canvas"
                  >
                    <Text className="text-[22px] leading-[28px]">{r}</Text>
                  </Pressable>
                ))}
              </Animated.View>
              <View className="flex-row items-center gap-3">
                <PressableScale
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${squad.name} chat`}
                  onPress={() => {
                    haptics.tap();
                    router.back();
                    openSquad(squad.id);
                  }}
                  className="size-14 items-center justify-center rounded-full bg-cream"
                >
                  <Icon name="chat" size={24} />
                </PressableScale>
                <PressableScale
                  accessibilityRole="button"
                  accessibilityLabel={talking ? 'Mute' : 'Unmute'}
                  onPress={() => {
                    haptics.select();
                    setTalking((v) => !v);
                  }}
                  className={cn(
                    'h-14 flex-1 flex-row items-center justify-center gap-2 rounded-full',
                    talking ? 'bg-teal' : 'bg-content',
                  )}
                >
                  {talking ? (
                    <EqBars className="bg-content" max={16} count={4} />
                  ) : (
                    <Icon name="mic-off" size={20} tone="surface" strokeWidth={2.4} />
                  )}
                  <Text
                    className={cn(
                      'font-heavy text-body',
                      talking ? 'text-content' : 'text-brand-content',
                    )}
                  >
                    {talking ? 'Talking · tap to mute' : 'Tap to talk'}
                  </Text>
                </PressableScale>
                <PressableScale
                  accessibilityRole="button"
                  accessibilityLabel="Leave the room"
                  onPress={() => {
                    haptics.tap();
                    router.back();
                  }}
                  className="size-14 items-center justify-center rounded-full bg-accent"
                >
                  <Icon name="logout" size={22} strokeWidth={2.4} />
                </PressableScale>
              </View>
            </>
          ) : (
            <View className="gap-2">
              <Button label="Join room" onPress={join} />
              <Text className="text-center font-text text-caption text-muted">
                You join muted. Only {squad.name} can hear.
              </Text>
            </View>
          )}
        </View>
      </View>
    </SceneClock>
  );
}

/** Outside the six solutions: shown as a wireframe. */
export function RoomView(props: { roomId?: string }) {
  return (
    <Wireframe>
      <RoomViewContent {...props} />
    </Wireframe>
  );
}
