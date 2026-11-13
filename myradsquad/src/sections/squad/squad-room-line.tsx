import { Text } from 'react-native';

import { MEMBERS } from '@/lib/mock-data';
import { startedLine, type LiveRoom } from '@/lib/rooms';

/** In the chat history: a quiet system line that a room was started (the room itself is pinned). */
export function SquadRoomLine({ room }: { room: LiveRoom }) {
  return (
    <Text className="text-center font-text text-caption text-muted">
      {startedLine(room, MEMBERS)} <Text className="font-heavy">{room.name}</Text> ·{' '}
      {room.startedAgo}
    </Text>
  );
}
