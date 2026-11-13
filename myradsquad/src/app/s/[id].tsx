import { useLocalSearchParams } from 'expo-router';

import { SquadOtherView } from '@/sections/squad/view/squad-other-view';

export default function OtherSquadScreen() {
  const { id, draft } = useLocalSearchParams<{ id: string; draft?: string }>();
  return <SquadOtherView id={id} draft={draft} />;
}
