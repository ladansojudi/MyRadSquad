import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { RoundTable } from '@/components/art/round-table';
import { EmptySeat, SeatTile } from '@/components/art/seat-tile';
import { Sparkle } from '@/components/art/sparkle';
import { SceneClock, useSceneClock } from '@/components/motion/scene-clock';
import { usePalette } from '@/hooks/use-palette';
import { deepen } from '@/lib/color';
import { EASE_OUT, wave } from '@/lib/motion';

const TICK_MS = 1000;
const TICK_MOVE_MS = 260;

/** The minute hand steps once a second with ease-out, like a real clock (2 turns per scene loop). */
function MinuteHand({ size }: { size: number }) {
  const p = usePalette();
  const t = useSceneClock();
  const turn = useAnimatedStyle(() => {
    const tick = Math.floor(t.value / TICK_MS);
    const move = Math.min(1, (t.value % TICK_MS) / TICK_MOVE_MS);
    return { transform: [{ rotate: `${(tick - 1 + EASE_OUT(move)) * 30}deg` }] };
  });
  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, turn]}>
      <Svg width={size} height={size} viewBox="0 0 44 44">
        <Path d="M22 22 L22 10" stroke={p.ink} strokeWidth={2.5} strokeLinecap="round" />
        <Circle cx={22} cy={22} r={2.2} fill={p.ink} />
      </Svg>
    </Animated.View>
  );
}

function ClockArt({ size }: { size: number }) {
  const p = usePalette();
  const t = useSceneClock();
  const s = size / 200;
  const line = {};
  const hand = { stroke: p.ink, strokeWidth: 2.5, strokeLinecap: 'round' as const };

  // The clock rocks a hair, like it is ticking hard.
  const rock = useAnimatedStyle(() => ({
    transform: [{ rotate: `${2 * wave(t.value, 2000)}deg` }],
  }));

  return (
    <View style={{ width: size, height: size }}>
      <View className="absolute" style={{ left: 40 * s, top: 34 * s }}>
        <RoundTable size={130 * s} alive />
      </View>
      <View className="absolute" style={{ left: 78 * s, top: 0 }}>
        <SeatTile letter="M" tone="coral" size={26 * s} alive />
      </View>
      <View className="absolute" style={{ left: 152 * s, top: 54 * s }}>
        <SeatTile letter="J" tone="teal" shape="leaf" size={22 * s} alive />
      </View>
      <View className="absolute" style={{ left: 146 * s, top: 20 * s }}>
        <SeatTile tone="coral" size={14 * s} alive phase={0.8} />
      </View>
      <View className="absolute" style={{ left: 12 * s, top: 66 * s }}>
        <EmptySeat size={22 * s} round alive phase={0.3} />
      </View>
      <View className="absolute" style={{ left: 60 * s, top: 150 * s }}>
        <EmptySeat size={22 * s} alive phase={0.65} />
      </View>
      <View className="absolute" style={{ left: 22 * s, top: 26 * s }}>
        <Sparkle size={20 * s} outlined alive phase={0.15} />
      </View>
      <View className="absolute" style={{ left: 2 * s, top: 170 * s }}>
        <Sparkle size={12 * s} tone="coral" alive phase={0.55} />
      </View>
      <Animated.View
        className="absolute"
        style={[{ left: 118 * s, top: 108 * s, width: 70 * s, height: 84 * s }, rock]}
      >
        <Svg width={70 * s} height={84 * s} viewBox="0 0 70 84">
          <Rect x={18} y={56} width={20} height={22} rx={6} fill={p.canvas} {...line} />
          <Circle cx={34} cy={39} r={30} fill={deepen(p.canvas)} />
          <Circle cx={34} cy={34} r={30} fill={p.canvas} {...line} />
          <Circle cx={34} cy={34} r={22} fill={p.surface} {...line} />
          <Path d="M34 34 L44 40" fill="none" {...hand} />
        </Svg>
        <View
          className="absolute"
          style={{ left: 12 * s, top: 12 * s, width: 44 * s, height: 44 * s }}
        >
          <MinuteHand size={44 * s} />
        </View>
      </Animated.View>
    </View>
  );
}

/** Round table with a waiting clock: "a parent needs to say yes". */
export function ClockTable({ size }: { size: number }) {
  return (
    <SceneClock>
      <ClockArt size={size} />
    </SceneClock>
  );
}
