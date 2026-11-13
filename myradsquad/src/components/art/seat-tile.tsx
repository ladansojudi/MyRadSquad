import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Circle, Rect } from 'react-native-svg';

import { Crisp } from '@/components/motion/crisp';
import { useSceneClock } from '@/components/motion/scene-clock';
import { useHardShadow } from '@/hooks/use-hard-shadow';
import { usePalette, type Palette } from '@/hooks/use-palette';
import { seeded, wave } from '@/lib/motion';
import { cn } from '@/lib/utils';

export type SeatTone = 'coral' | 'teal' | 'cobalt' | 'surface' | 'ink';
export type SeatShape = 'square' | 'leaf' | 'circle';

type SeatTileProps = {
  letter?: string;
  tone?: SeatTone;
  shape?: SeatShape;
  size?: number;
  /** The little white "online" dot in the top-right corner. */
  dot?: boolean;
  /** Bob, tilt and a pulsing online dot on the surrounding scene clock. */
  alive?: boolean;
  /** 0–1 offset so friends around a table never move together. */
  phase?: number;
};

const TONE_PALETTE: Record<SeatTone, keyof Palette> = {
  coral: 'coral',
  teal: 'teal',
  cobalt: 'cobalt',
  surface: 'surface',
  ink: 'ink',
};

const TONE_CLASS: Record<SeatTone, { bg: string; text: string }> = {
  coral: { bg: 'bg-accent', text: 'text-accent-content' },
  teal: { bg: 'bg-teal', text: 'text-teal-content' },
  cobalt: { bg: 'bg-cobalt', text: 'text-cobalt-content' },
  surface: { bg: 'bg-surface', text: 'text-content' },
  ink: { bg: 'bg-content', text: 'text-brand-content' },
};

/** Phase from the seat's letter, so every friend keeps their own rhythm. */
const letterPhase = (letter?: string) => seeded(letter ? letter.charCodeAt(0) : 7);

/** A friend's seat at the table: a letter in a tilted, outlined tile. */
export function SeatTile({
  letter,
  tone = 'surface',
  shape = 'square',
  size = 36,
  dot = true,
  alive = false,
  phase,
}: SeatTileProps) {
  const t = useSceneClock();
  const ph = phase ?? letterPhase(letter);
  const shadow = useHardShadow(Math.max(2, Math.round(size / 12)), TONE_PALETTE[tone]);
  const radius = shape === 'circle' ? size / 2 : size * 0.26;
  const toneClass = TONE_CLASS[tone];

  // A friend at the table: a slow bob (1.5pt) and a small tilt (3°), out of phase with the others.
  const bob = useAnimatedStyle(() => {
    if (!alive) return {};
    return {
      transform: [
        { translateY: -1.5 * wave(t.value, 3000, ph) },
        { rotate: `${3 * wave(t.value, 4000, ph + 0.25)}deg` },
      ],
    };
  });
  // The online dot breathes, so the seat reads as someone who is here right now.
  const pulse = useAnimatedStyle(() => {
    if (!alive) return {};
    return { transform: [{ scale: 1 + 0.12 * ((wave(t.value, 2000, ph) + 1) / 2) }] };
  });

  return (
    <Animated.View style={bob}>
      <Crisp>
        <View
          className={cn('items-center justify-center', toneClass.bg)}
          style={[
            {
              width: size,
              height: size,
              borderRadius: radius,
              borderBottomLeftRadius: shape === 'leaf' ? size * 0.08 : radius,
            },
            shadow,
          ]}
        >
          {letter ? (
            <Text
              className={cn('font-display', toneClass.text)}
              style={{ fontSize: size * 0.42, lineHeight: size * 0.5 }}
            >
              {letter}
            </Text>
          ) : null}
          {dot && size >= 24 ? (
            <Animated.View
              className="absolute rounded-full bg-surface"
              style={[
                { width: size * 0.3, height: size * 0.3, top: -size * 0.08, right: -size * 0.08 },
                pulse,
              ]}
            />
          ) : null}
        </View>
      </Crisp>
    </Animated.View>
  );
}

type EmptySeatProps = {
  size?: number;
  round?: boolean;
  /** Breathe gently, inviting someone to sit down. */
  alive?: boolean;
  phase?: number;
};

/**
 * A seat nobody has taken yet: a faint filled shape (no outline), drawn in SVG so it can
 * breathe.
 */
export function EmptySeat({ size = 36, round = false, alive = false, phase = 0 }: EmptySeatProps) {
  const palette = usePalette();
  const t = useSceneClock();
  const stroke = 2;
  const inner = size - stroke;

  // An open seat breathes (3.5%) and turns a hair, like it is waiting for someone.
  const breathe = useAnimatedStyle(() => {
    if (!alive) return {};
    return {
      transform: [
        { scale: 1 + 0.035 * wave(t.value, 3000, phase) },
        { rotate: `${4 * wave(t.value, 6000, phase + 0.5)}deg` },
      ],
    };
  });

  return (
    <Animated.View style={breathe}>
      <Svg width={size} height={size}>
        {round ? (
          <Circle cx={size / 2} cy={size / 2} r={inner / 2} fill={palette.ink} fillOpacity={0.1} />
        ) : (
          <Rect
            x={stroke / 2}
            y={stroke / 2}
            width={inner}
            height={inner}
            rx={size * 0.28}
            fill={palette.ink}
            fillOpacity={0.1}
          />
        )}
      </Svg>
    </Animated.View>
  );
}
