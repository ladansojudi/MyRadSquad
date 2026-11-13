import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { SceneClock, useSceneClock } from '@/components/motion/scene-clock';
import { usePalette, type Palette } from '@/hooks/use-palette';
import { deepen } from '@/lib/color';
import { EASE_IN_OUT, loop, seeded, wave } from '@/lib/motion';

/** The logo's three piece shapes, drawn in one 50×50 cell. */
export type Shape = 'quarter' | 'circle' | 'pill';
export type Tone = Extract<keyof Palette, 'coral' | 'cobalt' | 'teal' | 'canvas'>;
export type Piece = { shape: Shape; tone: Tone; turn: number };

const TONES: Tone[] = ['coral', 'cobalt', 'teal', 'canvas'];
const SHAPES: Shape[] = ['quarter', 'pill', 'quarter', 'circle'];
const SHADOW = 5;
/** One full cycle: every piece takes its quarter turn once, one after another. */
const CYCLE = 6000; // divides the 24s scene clock into 4 turns, so the loop seam never jumps
const TURN_MS = 700;

function hash(text: string): number {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = (h * 33 + text.charCodeAt(i)) % 100003;
  return h;
}

/**
 * Four logo pieces for a squad, chosen from its id: the same squad always gets the same
 * emblem, and no two neighbouring pieces share a colour.
 */
export function emblemPieces(id: string): Piece[] {
  const h = hash(id);
  const start = Math.floor(seeded(h, 1) * TONES.length);
  const flip = seeded(h, 2) > 0.5;
  return [0, 1, 2, 3].map((i) => ({
    shape: SHAPES[(i + Math.floor(seeded(h, 3) * 4)) % 4],
    // Diagonal cells share a colour family offset, so neighbours always differ.
    tone: TONES[(start + (flip ? i : 3 - i)) % TONES.length],
    turn: Math.floor(seeded(h, 10 + i) * 4) * 90,
  }));
}

export function PieceShape({ shape, fill }: { shape: Shape; fill: string }) {
  const stroke = {};
  if (shape === 'circle') return <Circle cx={25} cy={25} r={24} fill={fill} {...stroke} />;
  if (shape === 'pill') {
    return <Path d="M1 49 L1 25 A24 24 0 0 1 49 25 L49 49 Z" fill={fill} {...stroke} />;
  }
  return <Path d="M49 1 L49 49 L1 49 A48 48 0 0 1 49 1 Z" fill={fill} {...stroke} />;
}

function Cell({ piece, index, cell }: { piece: Piece; index: number; cell: number }) {
  const t = useSceneClock();
  const p = usePalette();
  // Calm: each piece breathes a little, and once per cycle takes one slow quarter turn,
  // in turn around the grid. A quarter turn lands on a whole new pose, so it never jumps.
  const turn = useAnimatedStyle(() => {
    const local = loop(t.value, CYCLE, -index / 4) * CYCLE;
    const k = Math.min(1, local / TURN_MS);
    const cycles = Math.floor((t.value + (index / 4) * CYCLE) / CYCLE);
    const deg = piece.turn + 90 * (cycles + EASE_IN_OUT(k));
    return {
      transform: [{ translateY: 0.8 * wave(t.value, 3000, index * 0.25) }, { rotate: `${deg}deg` }],
    };
  });
  const left = (index % 2) * cell;
  const top = Math.floor(index / 2) * cell;
  const box = { position: 'absolute' as const, width: cell, height: cell };
  const svg = (fill: string) => (
    <Svg width={cell} height={cell} viewBox="-2 -2 54 54">
      <PieceShape shape={piece.shape} fill={fill} />
    </Svg>
  );
  const shadow = (cell / 50) * SHADOW * 0.6;
  return (
    <>
      <Animated.View style={[box, { left, top: top + shadow }, turn]}>
        {svg(deepen(p[piece.tone]))}
      </Animated.View>
      <Animated.View style={[box, { left, top }, turn]}>{svg(p[piece.tone])}</Animated.View>
    </>
  );
}

type SquadEmblemProps = {
  id: string;
  size?: number;
  /** Moves while true (an open squad card); a still drawing otherwise. */
  alive?: boolean;
};

/** A squad's own mark, built from the logo's pieces: every squad gets one automatically. */
export function SquadEmblem({ id, size = 48, alive = false }: SquadEmblemProps) {
  const pieces = emblemPieces(id);
  const cell = size / 2.12;
  const art = (
    <View style={{ width: size, height: size }}>
      <View style={{ position: 'absolute', left: size * 0.02, top: size * 0.02 }}>
        {pieces.map((piece, i) => (
          <Cell key={i} piece={piece} index={i} cell={cell} />
        ))}
      </View>
    </View>
  );
  return alive ? <SceneClock>{art}</SceneClock> : art;
}
