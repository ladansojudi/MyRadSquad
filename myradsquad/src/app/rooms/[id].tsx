import { useLocalSearchParams } from 'expo-router';

import { RoomsView } from '@/sections/rooms/view/rooms-view';

export default function SquadRoomsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <RoomsView squadId={id} />;
}
