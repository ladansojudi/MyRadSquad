import { ScrollView, Text, View } from 'react-native';

import { useBottomInset } from '@/hooks/use-bottom-inset';
import { NavHeader } from '@/components/nav-header';
import { Button } from '@/components/ui';
import { Wireframe } from '@/components/wireframe';
import { useAppStore } from '@/lib/app-store';
import { SHARED_NOTES } from '@/lib/mock-data';
import { NotesFlashcards } from '@/sections/notes/notes-flashcards';
import { NotesIcon } from '@/sections/notes/notes-icon';

/** A page of grey lines standing in for a document's text. */
function Lines({ count, short = false }: { count: number; short?: boolean }) {
  return (
    <View className="gap-2">
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          className="h-2.5 rounded-full bg-cream"
          style={{ width: `${short && i === count - 1 ? 55 : 92 - ((i * 7) % 18)}%` }}
        />
      ))}
    </View>
  );
}

/** One shared note: flashcards you can study, or a preview of the PDF / doc. */
function NotesDetailViewContent({ id }: { id: string }) {
  const bottomInset = useBottomInset();
  const showToast = useAppStore((s) => s.showToast);
  const note = SHARED_NOTES.find((n) => n.id === id) ?? SHARED_NOTES[0];

  return (
    <View className="flex-1 bg-canvas">
      <NavHeader
        title={note.title}
        subtitle={note.meta}
        mark={<NotesIcon note={note} size={22} />}
      />

      <View
        className="flex-1 rounded-t-[32px] bg-surface px-5 pt-5"
        style={{ paddingBottom: bottomInset }}
      >
        {note.kind === 'cards' ? (
          <NotesFlashcards />
        ) : (
          <>
            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-4 pb-4"
            >
              <View className="gap-4 rounded-[20px] bg-surface p-5">
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                  className="font-display text-subtitle text-content"
                >
                  {note.title.replace('.pdf', '')}
                </Text>
                <Lines count={4} short />
                {note.kind === 'pdf' ? (
                  <View className="h-36 flex-row items-center justify-center gap-6 rounded-2xl bg-cream">
                    <View className="size-20 items-center justify-center rounded-full bg-surface">
                      <View className="size-6 rounded-full bg-cobalt" />
                    </View>
                    <View className="flex-row gap-1">
                      {[0, 1].map((k) => (
                        <View
                          key={k}
                          className="size-16 items-center justify-center rounded-full bg-surface"
                        >
                          <View className="size-4 rounded-full bg-accent" />
                        </View>
                      ))}
                    </View>
                  </View>
                ) : null}
                <Lines count={6} short />
                <Lines count={5} short />
              </View>
            </ScrollView>
            <Button
              label={note.kind === 'pdf' ? 'Save to Files' : 'Copy to my notes'}
              variant="outline"
              size="md"
              onPress={() =>
                showToast(note.kind === 'pdf' ? 'Saved to Files' : 'Copied to your notes')
              }
            />
          </>
        )}
      </View>
    </View>
  );
}

/** Outside the six solutions: shown as a wireframe. */
export function NotesDetailView(props: { id: string }) {
  return (
    <Wireframe>
      <NotesDetailViewContent {...props} />
    </Wireframe>
  );
}
