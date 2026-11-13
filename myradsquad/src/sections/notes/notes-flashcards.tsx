import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Button } from '@/components/ui';
import { haptics } from '@/lib/haptics';
import { FLASHCARDS } from '@/lib/mock-data';
import { TIMING_OUT } from '@/lib/motion';
import { cn } from '@/lib/utils';

const FLIP_MS = 320;

/** Flashcard deck: tap the card to flip it (a real 3D turn), then next. */
export function NotesFlashcards() {
  const [index, setIndex] = useState(0);
  const turn = useSharedValue(0);
  const [showingAnswer, setShowingAnswer] = useState(false);
  const card = FLASHCARDS[index];

  const flip = () => {
    haptics.select();
    const next = !showingAnswer;
    setShowingAnswer(next);
    turn.set(withTiming(next ? 180 : 0, { duration: FLIP_MS, easing: TIMING_OUT }));
  };

  const go = (delta: 1 | -1) => {
    haptics.select();
    setShowingAnswer(false);
    turn.set(0);
    setIndex((i) => (i + delta + FLASHCARDS.length) % FLASHCARDS.length);
  };

  const front = useAnimatedStyle(() => ({
    transform: [{ perspective: 900 }, { rotateY: `${turn.get()}deg` }],
    opacity: turn.get() < 90 ? 1 : 0,
  }));
  const back = useAnimatedStyle(() => ({
    transform: [{ perspective: 900 }, { rotateY: `${turn.get() - 180}deg` }],
    opacity: turn.get() >= 90 ? 1 : 0,
  }));

  const face = (side: 'q' | 'a') => (
    <View
      className={cn(
        'h-[340px] items-center justify-center rounded-[28px] px-6',
        side === 'q' ? 'bg-surface' : 'bg-cobalt',
      )}
    >
      <Text
        className={cn(
          'mb-3 font-heavy text-overline tracking-widest',
          side === 'q' ? 'text-muted' : 'text-cobalt-content/80',
        )}
      >
        {side === 'q' ? 'QUESTION' : 'ANSWER'}
      </Text>
      <Text
        className={cn(
          'text-center font-display text-headline',
          side === 'q' ? 'text-content' : 'text-cobalt-content',
        )}
      >
        {side === 'q' ? card.q : card.a}
      </Text>
    </View>
  );

  return (
    <View className="flex-1">
      <Text className="text-center font-text text-caption text-muted">
        Card {index + 1} of {FLASHCARDS.length} · tap to flip
      </Text>
      <View className="flex-1 justify-center">
        <Pressable accessibilityRole="button" accessibilityHint="Flips the card" onPress={flip}>
          <Animated.View style={front}>{face('q')}</Animated.View>
          <Animated.View className="absolute inset-0" style={back}>
            {face('a')}
          </Animated.View>
        </Pressable>
      </View>
      <View className="flex-row gap-3">
        <Button
          label="Back"
          variant="outline"
          size="md"
          className="flex-1"
          onPress={() => go(-1)}
        />
        <Button label="Next card" size="md" className="flex-1" onPress={() => go(1)} />
      </View>
    </View>
  );
}
