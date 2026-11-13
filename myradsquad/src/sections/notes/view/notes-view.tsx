import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { useBottomInset } from '@/hooks/use-bottom-inset';
import { NavHeader } from '@/components/nav-header';
import { Icon } from '@/components/icon';
import { PressableScale } from '@/components/ui';
import { Wireframe } from '@/components/wireframe';
import { SHARED_NOTES, SQUAD_NAME } from '@/lib/mock-data';
import { NotesIcon } from '@/sections/notes/notes-icon';

const KIND_LABEL = { pdf: 'PDF', cards: 'Flashcards', doc: 'Doc' } as const;

/** Everything the squad shared for the bio exam. */
function NotesViewContent() {
  const bottomInset = useBottomInset();
  return (
    <View className="flex-1 bg-canvas">
      <NavHeader title="Shared notes" subtitle={`${SQUAD_NAME} · bio exam`} />
      <ScrollView
        className="flex-1 rounded-t-[32px] bg-surface"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-4 pt-5"
        contentContainerStyle={{ paddingBottom: bottomInset + 8 }}
      >
        {SHARED_NOTES.map((note) => (
          <PressableScale
            key={note.id}
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/notes/[id]', params: { id: note.id } })}
            className="flex-row items-center gap-3 rounded-[20px] bg-cream px-3 py-3"
          >
            <NotesIcon note={note} />
            <View className="flex-1">
              <Text className="font-heavy text-body text-content">{note.title}</Text>
              <Text className="font-text text-caption text-muted">
                {KIND_LABEL[note.kind]} · {note.meta}
              </Text>
            </View>
            <Icon name="chevron-right" size={16} strokeWidth={3} />
          </PressableScale>
        ))}
      </ScrollView>
    </View>
  );
}

/** Outside the six solutions: shown as a wireframe. */
export function NotesView() {
  return (
    <Wireframe>
      <NotesViewContent />
    </Wireframe>
  );
}
