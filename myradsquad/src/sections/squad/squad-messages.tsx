import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

import { SeatTile, type SeatTone } from '@/components/art/seat-tile';
import { Sticker } from '@/components/art/sticker';
import { TypingDots } from '@/components/motion/typing-dots';
import { Chip } from '@/components/ui';
import { EMPTY_THREAD, useAppStore, type ThreadId } from '@/lib/app-store';
import { MEMBERS, type Member } from '@/lib/mock-data';
import { TIMING_OUT } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { haptics } from '@/lib/haptics';

/** New messages rise in from just below (ease-out, under 300 ms). */
export const MESSAGE_IN = FadeInDown.duration(260).easing(TIMING_OUT);

type IncomingProps = {
  member: Member;
  /** Override the avatar colour (the designs recolour Leo per screen). */
  tone?: SeatTone;
  text?: string;
  /** Show the sender's name above the bubble. */
  named?: boolean;
  /** `outlined` = cream bubble with a tail corner, `cream` = soft fill (Spark thread). */
  bubble?: 'outlined' | 'cream';
  children?: ReactNode;
  footer?: ReactNode;
};

/** Someone else's message: avatar on the left, name above, bubble or custom content. */
export function IncomingMessage({
  member,
  tone,
  text,
  named = true,
  bubble = 'outlined',
  children,
  footer,
}: IncomingProps) {
  return (
    <View className="gap-1">
      {named ? (
        <Text className="ml-11 font-heavy text-overline text-muted">{member.name}</Text>
      ) : null}
      <View className="flex-row items-end gap-2">
        <SeatTile
          letter={member.letter}
          tone={tone ?? (member.tone === 'surface' ? 'ink' : member.tone)}
          shape="leaf"
          size={32}
          dot={false}
        />
        <View className="shrink items-start gap-1.5">
          {text ? (
            <View
              className={cn(
                'rounded-2xl px-4 py-2.5',
                bubble === 'outlined' ? 'rounded-bl-md bg-cream' : 'bg-cream',
              )}
            >
              <Text className="font-text text-body text-content">{text}</Text>
            </View>
          ) : null}
          {children}
        </View>
      </View>
      {footer ? <View className="ml-11">{footer}</View> : null}
    </View>
  );
}

export function OutgoingMessage({ text, tone = 'ink' }: { text: string; tone?: 'ink' | 'coral' }) {
  return (
    <View
      className={cn(
        'max-w-[78%] self-end rounded-2xl rounded-br-md px-4 py-2.5',
        tone === 'ink' ? 'bg-content' : ' bg-accent',
      )}
    >
      <Text
        className={cn(
          'text-body',
          tone === 'ink' ? 'font-heavy text-brand-content' : 'font-display text-accent-content',
        )}
      >
        {text}
      </Text>
    </View>
  );
}

/** "Leo is typing…" with hopping dots. */
export function TypingRow({ member }: { member: Member }) {
  return (
    <Animated.View
      entering={MESSAGE_IN}
      exiting={FadeOut.duration(150)}
      className="flex-row items-center gap-3"
    >
      <View className="size-7 items-center justify-center rounded-full bg-content">
        <Text className="font-display text-[11px] text-brand-content">{member.letter}</Text>
      </View>
      <Text className="font-text text-body text-muted">{member.name} is typing</Text>
      <TypingDots />
    </Animated.View>
  );
}

type ThreadMessagesProps = {
  thread: ThreadId;
  bubble?: 'outlined' | 'cream';
  /** How your own bubbles look in this thread. */
  mine?: 'ink' | 'coral';
};

/** Messages sent in this session (yours and the mock replies), plus who is typing. */
export function ThreadMessages({ thread, bubble = 'outlined', mine = 'ink' }: ThreadMessagesProps) {
  const messages = useAppStore((s) => s.threads[thread] ?? EMPTY_THREAD);
  const typing = useAppStore((s) => s.typing[thread]);

  return (
    <>
      {messages.map((m) => (
        <Animated.View key={m.id} entering={MESSAGE_IN}>
          {m.sticker ? (
            <View className="items-end pr-2">
              <Sticker label={m.text} tone={m.sticker} size="sm" rotate={-4} />
            </View>
          ) : m.author === 'you' ? (
            <OutgoingMessage text={m.text} tone={mine} />
          ) : (
            <IncomingMessage
              member={MEMBERS[m.author]}
              text={m.text}
              bubble={bubble}
              named={false}
            />
          )}
        </Animated.View>
      ))}
      {typing ? <TypingRow member={MEMBERS[typing]} /> : null}
    </>
  );
}

type Reaction = { label: string; count?: number };

type ReactionRowProps = {
  /** Stable id so your pick survives leaving and coming back to the screen. */
  id: string;
  reactions: Reaction[];
  size?: 'xs' | 'sm' | 'md';
  /** The reaction you had already picked when the screen was designed (its count includes you). */
  initial?: string;
};

/** Reaction pills; tapping one adds your vote, tapping it again takes it back. */
export function ReactionRow({ id, reactions, size = 'xs', initial = '' }: ReactionRowProps) {
  const mine = useAppStore((s) => s.reactions[id] ?? initial);
  const setReaction = useAppStore((s) => s.setReaction);

  return (
    <View className="flex-row flex-wrap gap-2">
      {reactions.map((r) => {
        const base = (r.count ?? 0) - (initial === r.label ? 1 : 0);
        const count = base + (mine === r.label ? 1 : 0);
        const label = count > 0 ? `${r.label} · ${count}` : r.label;
        return (
          <Chip
            key={r.label}
            label={label}
            size={size}
            tone={mine === r.label ? 'mustard' : 'surface'}
            accessibilityState={{ selected: mine === r.label }}
            onPress={() => {
              haptics.select();
              setReaction(id, mine === r.label ? '' : r.label);
            }}
          />
        );
      })}
    </View>
  );
}
