import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

import { Sparkle } from '@/components/art/sparkle';
import { Alive, SCENE_PERIOD, useSceneClock } from '@/components/motion/scene-clock';
import { usePalette } from '@/hooks/use-palette';
import { deepen } from '@/lib/color';
import { loop, wave } from '@/lib/motion';

type RoundTableProps = {
  size: number;
  /** `shapes` is the invite table, `quarters` the Squad+ paywall table. */
  variant?: 'shapes' | 'quarters';
  /** Slowly turn the rim lights (and the quarters) on the scene clock. */
  alive?: boolean;
};

// The disc sits at (100,100); the viewBox is centred on it so layers rotate about the table's middle.
const VIEW_BOX = '-3 -3 206 206';
const C = 100;
const R = 92;
const RIM_DOTS = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4 + Math.PI / 8;
  return { x: C + Math.cos(a) * 80, y: C + Math.sin(a) * 80 };
});

function TableArt({ size, variant = 'shapes', alive = false }: RoundTableProps) {
  const p = usePalette();
  const t = useSceneClock();
  const line = {};
  const unit = size / 206;

  // Rim lights: one slow turn per scene loop (24s), linear, like a lazy susan.
  const rimTurn = useAnimatedStyle(() => ({
    transform: [{ rotate: `${alive ? loop(t.value, SCENE_PERIOD) * 360 : 0}deg` }],
  }));
  // Paywall quarters: one turn per loop the other way, so the two layers drift apart.
  const quartersTurn = useAnimatedStyle(() => ({
    transform: [{ rotate: `${alive ? -loop(t.value, SCENE_PERIOD) * 360 : 0}deg` }],
  }));
  // The coral dot and white puck on the table bob a little, out of phase.
  const puck = useAnimatedStyle(() => ({
    transform: [{ translateY: alive ? 2 * unit * wave(t.value, 3000, 0.1) : 0 }],
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={VIEW_BOX}>
        <Circle cx={C} cy={C + 7} r={R} fill={deepen(p.cobalt)} />
        <Circle cx={C} cy={C} r={R} fill={p.cobalt} {...line} />
        {variant === 'shapes' ? (
          <G>
            <Path d="M93.6 46.6 L93.6 94.6 A48 48 0 0 1 45.6 46.6 Z" fill={p.coral} {...line} />
            <Path
              d="M158.9 154.3 L105.5 154.3 A53.4 53.4 0 0 1 158.9 100.9 Z"
              fill={p.teal}
              {...line}
            />
            <Rect x={102.6} y={44.7} width={15} height={15} rx={4} fill={p.teal} {...line} />
          </G>
        ) : (
          <Circle
            cx={C}
            cy={C}
            r={64}
            fill="none"
            stroke={p.surface}
            strokeOpacity={0.5}
            strokeWidth={2}
          />
        )}
      </Svg>

      {variant === 'shapes' ? (
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, puck]}>
          <Svg width={size} height={size} viewBox={VIEW_BOX}>
            <Circle cx={131.3} cy={64.1} r={8} fill={p.coral} {...line} />
            <Circle cx={115.6} cy={80.7} r={6.5} fill={p.surface} {...line} />
          </Svg>
        </Animated.View>
      ) : (
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, quartersTurn]}>
          <Svg width={size} height={size} viewBox={VIEW_BOX}>
            <Path d="M95 95 L95 37 A58 58 0 0 0 37 95 Z" fill={p.teal} {...line} />
            <Path d="M105 95 L163 95 A58 58 0 0 0 105 37 Z" fill={p.coral} {...line} />
            <Path d="M95 105 L37 105 A58 58 0 0 0 95 163 Z" fill={p.coral} {...line} />
            <Path d="M105 105 L105 163 A58 58 0 0 0 163 105 Z" fill={p.teal} {...line} />
            <Circle cx={C} cy={C} r={6} fill={p.surface} {...line} />
            <Circle cx={45} cy={C} r={7} fill={p.canvas} {...line} />
            <Circle cx={155} cy={C} r={7} fill={p.canvas} {...line} />
          </Svg>
        </Animated.View>
      )}

      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, rimTurn]}>
        <Svg width={size} height={size} viewBox={VIEW_BOX}>
          {RIM_DOTS.map((d) => (
            <Circle key={`${d.x}-${d.y}`} cx={d.x} cy={d.y} r={2.8} fill={p.surface} />
          ))}
        </Svg>
      </Animated.View>

      {variant === 'shapes' ? (
        <View
          pointerEvents="none"
          className="absolute"
          style={{ left: 63 * unit, top: 126 * unit }}
        >
          <Sparkle size={22 * unit} tone="canvas" outlined alive={alive} phase={0.6} />
        </View>
      ) : (
        <>
          <View
            pointerEvents="none"
            className="absolute"
            style={{ left: 93 * unit, top: 51 * unit }}
          >
            <Sparkle size={20 * unit} alive={alive} phase={0.2} />
          </View>
          <View
            pointerEvents="none"
            className="absolute"
            style={{ left: 93 * unit, top: 131 * unit }}
          >
            <Sparkle size={20 * unit} alive={alive} phase={0.7} />
          </View>
        </>
      )}
    </View>
  );
}

/** The cobalt "lunch table" seen from above. */
export function RoundTable(props: RoundTableProps) {
  return props.alive ? (
    <Alive>
      <TableArt {...props} />
    </Alive>
  ) : (
    <TableArt {...props} />
  );
}
