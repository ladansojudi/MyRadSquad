import { useLocalSearchParams } from 'expo-router';

import { StartRoomView } from '@/sections/start-room/view/start-room-view';

export default function StartRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <StartRoomView squadId={id} />;
}
