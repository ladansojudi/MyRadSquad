import { router } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';

import { BottomSheet } from '@/components/bottom-sheet';
import { Button, TextLink, TextField } from '@/components/ui';
import { Wireframe } from '@/components/wireframe';
import { useAppStore } from '@/lib/app-store';
import { haptics } from '@/lib/haptics';
import { EXAMPLE_ANSWER, FIRST_QUESTION, TODAYS_QUESTION } from '@/lib/mock-data';

const MAX_LENGTH = 80;

type SquadsAnswerViewProps = {
  /** `today` unlocks the squad's answers; `first` waits for friends on a new table. */
  question: 'today' | 'first';
};

/** Short answer sheet for the daily question. Answering is what unlocks everyone else's. */
function SquadsAnswerViewContent({ question }: SquadsAnswerViewProps) {
  const [text, setText] = useState('');
  const notificationsOn = useAppStore((s) => s.notificationsOn);
  const answerQuestion = useAppStore((s) => s.answerQuestion);
  const answerFirstQuestion = useAppStore((s) => s.answerFirstQuestion);

  const isToday = question === 'today';

  const submit = () => {
    const value = text.trim() || (isToday ? EXAMPLE_ANSWER : 'chicken tenders, always');
    haptics.tap();
    if (isToday) {
      answerQuestion(value);
      // The heads-up ask comes right after the first answer, never at launch.
      if (!notificationsOn) router.replace('/notify');
      else router.back();
    } else {
      answerFirstQuestion(value);
      router.back();
    }
  };

  return (
    <>
      <BottomSheet>
        <Text className="font-heavy text-overline tracking-widest text-muted">
          {isToday ? 'QUESTION OF THE DAY' : 'FIRST QUESTION'}
        </Text>
        <Text className="mt-2 font-display text-headline text-content">
          {isToday ? TODAYS_QUESTION : FIRST_QUESTION}
        </Text>
        <TextField
          className="mt-4"
          autoFocus
          value={text}
          onChangeText={setText}
          onSubmitEditing={submit}
          maxLength={MAX_LENGTH}
          returnKeyType="send"
          placeholder={isToday ? EXAMPLE_ANSWER : 'chicken tenders, always'}
          accessibilityLabel="Your answer"
        />
        <Text className="mt-2 font-text text-caption text-muted">
          {isToday
            ? 'Only this squad sees it. Answer to unlock theirs.'
            : 'Friends see it when they join.'}
        </Text>
        <Button label={isToday ? 'Answer' : 'Save answer'} className="mt-5" onPress={submit} />
        <TextLink label="Not now" className="mt-1" onPress={() => router.back()} />
      </BottomSheet>
    </>
  );
}

/** Outside the six solutions: shown as a wireframe. */
export function SquadsAnswerView(props: SquadsAnswerViewProps) {
  return (
    <Wireframe sheet="fit">
      <SquadsAnswerViewContent {...props} />
    </Wireframe>
  );
}
