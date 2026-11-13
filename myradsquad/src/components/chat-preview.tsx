import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';

import { TypingDots } from '@/components/motion/typing-dots';
import { useLive } from '@/hooks/use-live';
import { useAppStore, type ThreadId } from '@/lib/app-store';
import { haptics } from '@/lib/haptics';
import { MEMBERS, type MemberId } from '@/lib/mock-data';
import { TIMING_IN, TIMING_OUT } from '@/lib/motion';
import { cn } from '@/lib/utils';

export type PreviewLine = { author: MemberId; text: string };

/** Each friend's face colour (white people get butter so they show on cream). */
const FACE: Record<string, string> = {
  coral: 'bg-accent',
  teal: 'bg-teal',
  cobalt: 'bg-cobalt',
  surface: 'bg-canvas',
};

const SHOWN = 3;
/** Room for about three short bubbles and the typing dots. */
const BODY = 196;
/** A friend "types" for a beat, then their line slides in. */
const TYPE_MS = 1100;
const NEXT_MS = 3200;
const MOVE = LinearTransition.duration(260).easing(TIMING_OUT);

const QUICK = ['lol', 'same', 'omw'];

function Face({ id }: { id: MemberId }) {
  const m = MEMBERS[id];
  return (
    <View
      className={cn('size-7 items-center justify-center rounded-full', FACE[m.tone] ?? 'bg-canvas')}
    >
      <Text className="font-display text-overline text-content">{m.letter}</Text>
    </View>
  );
}

function Bubble({ line, faded }: { line: PreviewLine; faded: boolean }) {
  const mine = line.author === 'you';
  return (
    <View
      className={cn('flex-row items-end gap-2', mine && 'flex-row-reverse', faded && 'opacity-60')}
    >
      {mine ? null : <Face id={line.author} />}
      <View
        className={cn(
          'max-w-[78%] rounded-[18px] px-3 py-2',
          mine ? 'rounded-br-md bg-content' : 'rounded-bl-md bg-surface',
        )}
      >
        {mine ? null : (
          <Text className="font-heavy text-overline text-muted">{MEMBERS[line.author].name}</Text>
        )}
        <Text
          className={cn('font-strong text-caption', mine ? 'text-brand-content' : 'text-content')}
        >
          {line.text}
        </Text>
      </View>
    </View>
  );
}

type ChatPreviewProps = {
  lines: PreviewLine[];
  /** Live: the chat plays on (someone types, the next line slides in). Quiet: still and faded. */
  live: boolean;
  /** Where quick replies go; without one, no reply chips. */
  thread?: ThreadId;
  className?: string;
};

/**
 * A squad's chat in miniature: the last three messages as real bubbles. While the squad is
 * live, a friend types and the next line slides in from below; what you send (a quick
 * reply here, or anything in the chat) shows straight away. Reply chips let you join from
 * Home without opening the chat.
 */
export function ChatPreview({ lines, live, thread, className }: ChatPreviewProps) {
  const visible = useLive();
  const typingNow = useAppStore((s) => (thread ? s.typing[thread] : undefined));
  const sendMessage = useAppStore((s) => s.sendMessage);
  // `end` is how many lines have "happened" so far; it starts a few short of the newest so
  // the conversation has somewhere to go.
  const [end, setEnd] = useState(Math.max(1, lines.length - 2));
  const [typing, setTyping] = useState(false);
  const running = live && visible && lines.length > 1;

  // A new line from you or a friend (the store) jumps straight to the end.
  const [seen, setSeen] = useState(lines.length);
  if (seen !== lines.length) {
    setSeen(lines.length);
    setEnd(lines.length);
  }

  useEffect(() => {
    if (!running) return;
    let typeTimer: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      setTyping(true);
      typeTimer = setTimeout(() => {
        setTyping(false);
        // Loop the mock conversation: after the newest line, play it again from the top.
        setEnd((e) => (e >= lines.length ? 1 : e + 1));
      }, TYPE_MS);
    }, NEXT_MS);
    return () => {
      clearInterval(id);
      clearTimeout(typeTimer);
    };
  }, [running, lines.length]);

  const shownEnd = live ? end : lines.length;
  const window = lines.slice(Math.max(0, shownEnd - SHOWN), shownEnd);
  const nextAuthor = typingNow ?? (typing ? lines[shownEnd % lines.length]?.author : undefined);

  return (
    <View className={cn('gap-2 rounded-2xl bg-cream p-3', className)}>
      {/* Fixed height, newest at the bottom (like a chat), so nothing below ever moves. */}
      <View className="justify-end gap-2 overflow-hidden" style={{ height: BODY }}>
        {window.map((line, i) => (
          <Animated.View
            key={`${shownEnd - window.length + i}-${line.text}`}
            entering={FadeInDown.duration(260).easing(TIMING_OUT)}
            exiting={FadeOut.duration(140).easing(TIMING_IN)}
            layout={MOVE}
          >
            <Bubble line={line} faded={!live} />
          </Animated.View>
        ))}

        {live && nextAuthor && nextAuthor !== 'you' ? (
          <Animated.View
            entering={FadeInDown.duration(200).easing(TIMING_OUT)}
            exiting={FadeOut.duration(120)}
            layout={MOVE}
            className="flex-row items-center gap-2"
          >
            <Face id={nextAuthor} />
            <View className="rounded-[18px] rounded-bl-md bg-surface px-3 py-2.5">
              <TypingDots />
            </View>
          </Animated.View>
        ) : null}
      </View>

      {live && thread ? (
        <View className="mt-1 flex-row gap-2">
          {QUICK.map((q) => (
            <Pressable
              key={q}
              accessibilityRole="button"
              accessibilityLabel={`Send ${q}`}
              onPress={() => {
                haptics.tap();
                sendMessage(thread, q);
              }}
              className="h-8 justify-center rounded-full bg-surface px-3.5 active:bg-canvas"
            >
              <Text className="font-heavy text-caption text-content">{q}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
