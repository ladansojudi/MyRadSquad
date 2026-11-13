import { View } from 'react-native';

import type { Note } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const TONE: Record<Note['tone'], string> = {
  coral: 'bg-accent',
  cobalt: 'bg-cobalt',
  teal: 'bg-teal',
};

/** The note's shape tells its kind: square = PDF, circle = flashcards, leaf = doc. */
export function NotesIcon({ note, size = 36 }: { note: Note; size?: number }) {
  return (
    <View
      className={cn('', TONE[note.tone])}
      style={{
        width: size,
        height: size,
        borderRadius: note.kind === 'cards' ? size / 2 : size * 0.28,
        borderBottomLeftRadius:
          note.kind === 'doc' ? size * 0.06 : note.kind === 'cards' ? size / 2 : size * 0.28,
      }}
    />
  );
}
