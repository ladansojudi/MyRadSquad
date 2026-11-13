import { useLocalSearchParams } from 'expo-router';

import { SquadMomentsView } from '@/sections/squad/view/squad-moments-view';

export default function SquadMomentsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return <SquadMomentsView initialId={id} />;
}
