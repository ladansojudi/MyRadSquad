import { useLocalSearchParams } from 'expo-router';

import { NotesDetailView } from '@/sections/notes/view/notes-detail-view';

export default function NoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <NotesDetailView id={id} />;
}
