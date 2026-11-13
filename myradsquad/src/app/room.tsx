import { useLocalSearchParams } from 'expo-router';

import { RoomView } from '@/sections/room/view/room-view';

export default function RoomScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return <RoomView roomId={id} />;
}
