import { useLocalSearchParams } from 'expo-router';

import { SquadsAnswerView } from '@/sections/squads/view/squads-answer-view';

export default function AnswerScreen() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  return <SquadsAnswerView question={q === 'first' ? 'first' : 'today'} />;
}
