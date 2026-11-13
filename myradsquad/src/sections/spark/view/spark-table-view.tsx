import { useRef, useState } from 'react';
import { Pressable, Text, View, type TextInputInstance } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { NavHeader } from '@/components/nav-header';
import { SparkMark } from '@/components/art/spark-mark';
import { SquadEmblem } from '@/components/art/squad-emblem';
import { Composer } from '@/components/composer';
import { KeyboardScreen } from '@/components/keyboard-screen';
import { Button } from '@/components/ui';
import { Wireframe } from '@/components/wireframe';
import { useAppStore } from '@/lib/app-store';
import { MEMBERS, SPARK_QUESTION, SQUAD_NAME } from '@/lib/mock-data';
import { TIMING_OUT } from '@/lib/motion';
import { SparkTableScene } from '@/sections/spark/spark-table-scene';
import { ReactionRow } from '@/sections/squad/squad-messages';

/** "At the table" view: Spark's question as a panel under the live table. */
function SparkTableViewContent() {
  const inputRef = useRef<TextInputInstance>(null);
  const [revealed, setRevealed] = useState(false);
  const muted = useAppStore((s) => s.sparkMuted);
  const toggleMuted = useAppStore((s) => s.toggleSparkMuted);
  const answers = useAppStore((s) => s.sparkAnswers);
  const answerSpark = useAppStore((s) => s.answerSpark);

  const shown = answers.filter((a) => a.text);

  return (
    <KeyboardScreen className="flex-1 bg-canvas">
      <NavHeader
        title={SQUAD_NAME}
        subtitle={`3 at the table · Spark ${muted ? 'muted' : 'on'}`}
        mark={<SquadEmblem id="lunch" size={28} />}
        right={<SparkMark size={22} alive={!muted} />}
      />

      <View className="px-4">
        <SparkTableScene showSticker={!revealed} />
      </View>

      <View className="flex-1 rounded-t-[32px] bg-surface">
        <View className="gap-4 px-6 pt-5">
          <View className="flex-row items-center gap-3">
            <SparkMark size={20} />
            <Text className="flex-1 font-heavy text-body text-content">Spark asks · AI</Text>
            <Pressable hitSlop={8} onPress={toggleMuted}>
              <Text className="font-heavy text-body text-content underline">
                {muted ? 'Unmute' : 'Mute'}
              </Text>
            </Pressable>
          </View>
          <Text className="font-display text-subtitle text-content">{SPARK_QUESTION}</Text>
          <View className="flex-row items-center gap-2">
            <Button
              label="Answer"
              variant="cobalt"
              size="md"
              className="flex-1"
              onPress={() => {
                setRevealed(true);
                inputRef.current?.focus();
              }}
            />
            <ReactionRow
              id="spark-table"
              size="md"
              reactions={[
                { label: '+1', count: 3 },
                { label: 'lol', count: 2 },
              ]}
            />
          </View>
          {revealed ? (
            <View className="gap-1">
              {shown.map((a, i) => (
                <Animated.Text
                  key={`${a.author}-${a.text}`}
                  entering={FadeInDown.delay(i * 60)
                    .duration(240)
                    .easing(TIMING_OUT)}
                  className="font-text text-body text-muted"
                >
                  <Text className="font-display text-content">{MEMBERS[a.author].name}</Text>{' '}
                  {a.text}
                </Animated.Text>
              ))}
            </View>
          ) : null}
        </View>
        <View className="flex-1" />
        <Composer
          inputRef={inputRef}
          placeholder="Say something to the table"
          field="outlined"
          className="border-t-0"
          onSend={(text) => {
            answerSpark(text);
            setRevealed(true);
          }}
        />
      </View>
    </KeyboardScreen>
  );
}

/** Outside the six solutions: shown as a wireframe. */
export function SparkTableView() {
  return (
    <Wireframe>
      <SparkTableViewContent />
    </Wireframe>
  );
}
