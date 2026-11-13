import { View } from 'react-native';

import { Sticker } from '@/components/art/sticker';
import { ChatPreview, type PreviewLine } from '@/components/chat-preview';
import { useAppStore } from '@/lib/app-store';

/** Spark's table: the squad's chat in miniature, with everyone's answers to Spark. */
export function SparkTableScene({ showSticker }: { showSticker: boolean }) {
  const answers = useAppStore((s) => s.sparkAnswers);
  const lines: PreviewLine[] = [
    { author: 'jordan', text: 'ok who has the bio notes' },
    ...answers.flatMap((a) => (a.text ? [{ author: a.author, text: a.text }] : [])),
  ];

  return (
    <View>
      <ChatPreview lines={lines} live className="bg-surface/70" />
      {showSticker ? (
        <View className="absolute -bottom-3 left-2">
          <Sticker label="LOL" tone="cobalt" size="sm" rotate={0} alive phase={0.5} />
        </View>
      ) : null}
    </View>
  );
}
